-- Create a storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books', 'books', true);

-- Allow public access to book covers
CREATE POLICY "Give public access to book covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'books');

-- Allow authenticated users to upload book covers
CREATE POLICY "Allow authenticated users to upload book covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'books');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated users to update their uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'books');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated users to delete their uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'books');