import React, { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { changePassword, fetchCurrentUser, saveProfile } from "@/api/services";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // ✅ added
import {
  User,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";


type UserProfile = {
  user_id: string;
  user_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  age: number;
  status: string;
  role_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  auth_type: string;
};

interface EditProfileFormData {
  user_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  age: number;
}

function EditProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // moved here
  const [currentPassword, setCurrentPassword] = useState(""); // moved here
  const [newPassword, setNewPassword] = useState(""); // moved here
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<EditProfileFormData>({
    user_name: "",
    full_name: "",
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    age: 0,
  });
  const [errors, setErrors] = useState<Partial<EditProfileFormData>>({});
  const { updated } = useUserStore();
  const { toast } = useToast(); // ✅ init toast

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCurrentUser();
        if (res.status === 200 && res.data?.user) {
          setUser(res.data.user);
          setFormData({
            user_name: res.data.user.user_name || "",
            full_name: res.data.user.full_name || "",
            first_name: res.data.user.first_name || "",
            last_name: res.data.user.last_name || "",
            phone: res.data.user.phone || "",
            city: res.data.user.city || "",
            state: res.data.user.state || "",
            pincode: res.data.user.pincode || "",
            email: res.data.user.email || "",
            age: res.data.user.age || 0,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user profile", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [updated]);

  const handleCancel = () => {
    if (user) {
      setFormData({
        user_name: user.user_name || "",
        full_name: user.full_name || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        email: user.email || "",
        age: user.age || 0,
      });
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EditProfileFormData> = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = "Username is required";
    } else if (formData.user_name.length < 3) {
      newErrors.user_name = "Username must be at least 3 characters";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (formData.age < 1 || formData.age > 150) {
      newErrors.age = "Age must be between 1 and 150";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof EditProfileFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  
  const handleChangePassword = async () => {
  try {
    setLoading(true);
    const res = await changePassword({ currentPassword, newPassword });
    toast({
      title: "Success",
      description: res.message,
      duration: 3000,
    });
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to change password");
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await saveProfile({
        full_name: formData.full_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        age: formData.age,
        status: "active",
        is_active: true,
      });

      if (response.status === 200) {
        toast({
          title: "Profile updated successfully!",
          description: "Your profile changes have been saved.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update profile.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600">
            We couldn't load your profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => (window.location.href = "/profile")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Edit Profile
              </h1>
              <p className="text-lg text-indigo-100">
                Update your personal information and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 pb-16">
        <div className="space-y-8">
          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-gray-600">
                  Update your profile details below
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCheck className="h-4 w-4 inline mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) =>
                    handleInputChange("user_name", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.user_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your username"
                />
                {errors.user_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.user_name}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.full_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.first_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.first_name}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.last_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.last_name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="150"
                  value={formData.age}
                  onChange={(e) =>
                    handleInputChange("age", parseInt(e.target.value) || 0)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.age ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.city ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.state ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your state"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.pincode ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your pincode"
                />
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

         {/* Password Section - Only for Email Auth Users */}
{user.auth_type === "email" && (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
        <Lock className="h-6 w-6 text-orange-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Security</h3>
        <p className="text-gray-600">Password management</p>
      </div>
    </div>

    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Password</h4>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {new Date(user.updated_at).toLocaleDateString()}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
          onClick={() => setIsPasswordModalOpen(true)} // ✅ open modal
        >
          Change Password
        </Button>
      </div>
    </div>
  </div>
)}


{isPasswordModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Change Password
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={handleChangePassword}
        >
          Update Password
        </Button>
      </div>
    </div>
  </div>
)}


          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3"
                disabled={saving}
              >
                <X className="h-4 w-4" />
                Cancel Changes
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700"
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
