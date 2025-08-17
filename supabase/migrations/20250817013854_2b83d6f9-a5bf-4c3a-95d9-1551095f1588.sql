-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  x_handle TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public waitlist)
CREATE POLICY "Anyone can insert waitlist entries" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow admins to view all entries (for future admin panel)
CREATE POLICY "Admins can view all waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_waitlist_updated_at
BEFORE UPDATE ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();