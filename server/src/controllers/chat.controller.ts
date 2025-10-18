// controllers/chat.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { ChatHistory } from '../models/chat.model';

/**
 * Save or update chat messages
 */
export const saveChat = async (req: Request, res: Response) => {
  const { chatId, messages } = req.body;
  const user = (req as any).user; // retrieved from authenticate middleware

  if (!chatId || !messages) {
    return res.status(400).json({ error: 'chatId and messages are required' });
  }

  if (!user?.user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Check if a chat with this chatId already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('chat_history')
      .select('messages')
      .eq('chat_id', chatId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // ignore "no rows found"
      throw fetchError;
    }

    // Append new messages if chat exists
    const updatedMessages = existingData ? [...existingData.messages, ...messages] : messages;

    const chatRecord: ChatHistory = {
      chat_id: chatId,
      user_id: user.user_id, // use user from auth
      messages: updatedMessages,
    };

    const { data, error } = await supabase
      .from('chat_history')
      .upsert(chatRecord)
      .select();

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error saving chat:', err);
    res.status(500).json({ error: 'Failed to save chat' });
  }
};

/**
 * Get chat messages by chatId
 */
export const getChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const user = (req as any).user;

  if (!chatId) return res.status(400).json({ error: 'chatId is required' });
  if (!user?.user_id) return res.status(401).json({ error: 'User not authenticated' });

  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('chat_id', chatId)
      .eq('user_id', user.user_id) // ensure user can only fetch their own chats
      .single();

    if (error) throw error;

    if (!data) return res.status(404).json({ error: 'Chat not found' });

    res.status(200).json({ success: true, chat: data });
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};
