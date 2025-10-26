import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { User } from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import bcrypt from "bcrypt";

// ========== Helper ========== //
const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true only on HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

// ========== GET ALL USERS ========== //
export const getAllUsers = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error)
    return res
      .status(500)
      .json({ status: 500, message: error.message, data: [] });

  res.status(200).json({
    status: 200,
    message: "Users fetched successfully",
    data: data || [],
  });
};

// ========== REGISTER USER ========== //
export const createUser = async (req: Request, res: Response) => {
  try {
    const body: Omit<User, "user_id"> = req.body;

    if (body.auth_type === "email" && !body.password) {
      return res
        .status(400)
        .json({ status: 400, message: "Password is required", data: [] });
    }

    const hashedPassword = body.password
      ? await bcrypt.hash(body.password, 10)
      : "";

    const newUser: User = { ...body, password: hashedPassword, user_id: uuidv4() };

    const { data, error } = await supabase.from("users").insert([newUser]);

    if (error) {
      let message = "Failed to create user";
      if (error.code === "23505") {
        if (error.message.includes("email"))
          message = "This email is already registered";
        else if (error.message.includes("user_name"))
          message = "This username is already taken";
      }
      return res.status(400).json({ status: 400, message, data: [] });
    }

    res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: data || [],
    });
  } catch (err: any) {
    res.status(500).json({
      status: 500,
      message: err?.message || "Internal server error",
      data: [],
    });
  }
};

// ========== LOGIN USER ========== //
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ status: 400, message: "Email and password required" });

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user)
    return res
      .status(401)
      .json({ status: 401, message: "Invalid email or password" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res
      .status(401)
      .json({ status: 401, message: "Invalid email or password" });

  if (!config.jwtSecret)
    return res
      .status(500)
      .json({ status: 500, message: "JWT secret is not defined" });

  const token = jwt.sign(
    { user_id: user.user_id, email: user.email, role_type: user.role_type },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  setAuthCookie(res, token);

  res.status(200).json({
    status: 200,
    message: "Login successful",
    data: {
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role_type: user.role_type,
        is_active: user.is_active,
      },
    },
  });
};

// ========== GET CURRENT USER ========== //
export const getCurrentUser = async (req: Request, res: Response) => {
  const decoded = (req as any).user;
  if (!decoded)
    return res.status(401).json({ status: 401, message: "Not authenticated" });

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", decoded.user_id)
    .single();

  if (error || !user)
    return res.status(404).json({ status: 404, message: "User not found" });

  return res.status(200).json({
    status: 200,
    message: "User is logged in",
    data: { user },
  });
};

// ========== GOOGLE LOGIN USER ========== //
export const googleLoginUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ status: 400, message: "Email is required" });

  const { data: emailUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("auth_type", "email")
    .single();

  if (emailUser)
    return res.status(400).json({
      status: 400,
      message:
        "This email is already registered with email/password. Use normal login instead.",
    });

  const { data: googleUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("auth_type", "google_auth")
    .single();

  if (error || !googleUser)
    return res
      .status(401)
      .json({ status: 401, message: "User not found or not registered via Google" });

  if (!config.jwtSecret)
    return res
      .status(500)
      .json({ status: 500, message: "JWT secret is not defined" });

  const token = jwt.sign(
    {
      user_id: googleUser.user_id,
      email: googleUser.email,
      role_type: googleUser.role_type,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  setAuthCookie(res, token);

  return res.status(200).json({
    status: 200,
    message: "Google login successful",
    data: {
      user: {
        user_id: googleUser.user_id,
        email: googleUser.email,
        full_name: googleUser.full_name,
        role_type: googleUser.role_type,
        is_active: googleUser.is_active,
      },
    },
  });
};

// ========== UPDATE PROFILE ========== //
export const updateUserProfile = async (req: Request, res: Response) => {
  const decoded = (req as any).user;
  if (!decoded)
    return res.status(401).json({ status: 401, message: "Not authenticated" });

  const body = req.body;
  const allowedFields = [
    "full_name",
    "first_name",
    "last_name",
    "phone",
    "city",
    "state",
    "pincode",
    "age",
    "status",
    "is_active",
  ];

  const updates: any = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("user_id", decoded.user_id)
    .select()
    .single();

  if (error)
    return res.status(400).json({
      status: 400,
      message: error.message,
      data: [],
    });

  return res.status(200).json({
    status: 200,
    message: "Profile updated successfully",
    data: { user: data },
  });
};

// ========== LOGOUT USER ========== //
export const logoutUser = async (_req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({ status: 200, message: "Logged out successfully" });
};

// ========== CHANGE PASSWORD ========== //
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    const userId = decoded?.user_id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ status: 400, message: "Current and new password required" });

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !user)
      return res.status(404).json({ status: 404, message: "User not found" });

    if (user.auth_type !== "email")
      return res.status(400).json({
        status: 400,
        message: "Password change only allowed for email users",
      });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ status: 401, message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("user_id", userId);

    if (updateError)
      return res
        .status(500)
        .json({ status: 500, message: "Failed to update password" });

    res.json({ status: 200, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ status: 500, message: "Failed to change password" });
  }
};
