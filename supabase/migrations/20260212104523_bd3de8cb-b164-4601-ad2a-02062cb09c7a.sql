
-- Messaging channels (per-unit group chats + direct messages)
CREATE TABLE public.message_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel_type text NOT NULL DEFAULT 'group', -- 'group' or 'direct'
  unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.message_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view channels"
  ON public.message_channels FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create channels"
  ON public.message_channels FOR INSERT
  TO authenticated WITH CHECK (true);

-- Channel members
CREATE TABLE public.channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.message_channels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (channel_id, user_id)
);

ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their channel memberships"
  ON public.channel_members FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can join channels"
  ON public.channel_members FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- Messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.message_channels(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Channel members can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.channel_members
      WHERE channel_id = messages.channel_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Channel members can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.channel_members
      WHERE channel_id = messages.channel_id AND user_id = auth.uid()
    )
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
