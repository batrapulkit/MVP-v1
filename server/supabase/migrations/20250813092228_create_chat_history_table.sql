create table chat_history (
  id uuid default gen_random_uuid() primary key,
  chat_id text not null,
  user_id uuid,
  messages jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_chat_history_chat_id on chat_history(chat_id);
create index idx_chat_history_user_id on chat_history(user_id);
