// models/chat.model.ts

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  type: 'text' | 'tripPlan';
  detailedPlan?: any; // optional, can type more strictly if needed
  id?: string;
  plan_id?: string;
}

export interface ChatHistory {
  id?: string;          // Supabase generated UUID
  chat_id: string;      // matches frontend chatIdRef.current
  user_id?: string;     // optional: link to user
  messages: ChatMessage[];
  created_at?: string;
  updated_at?: string;
}
