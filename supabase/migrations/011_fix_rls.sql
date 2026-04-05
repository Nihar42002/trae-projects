-- Fix RLS policies for public read access
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
DROP POLICY IF EXISTS "Allow public read access to ticket_tiers" ON ticket_tiers;

CREATE POLICY "Allow public read access to events" ON events
FOR SELECT USING (true);

CREATE POLICY "Allow public read access to ticket_tiers" ON ticket_tiers
FOR SELECT USING (true);