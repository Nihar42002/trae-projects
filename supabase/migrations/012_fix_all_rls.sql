-- Drop all existing policies and create permissive ones
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
DROP POLICY IF EXISTS "Allow public read access to ticket_tiers" ON ticket_tiers;
DROP POLICY IF EXISTS "Allow public read access to bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public read access to attendees" ON attendees;
DROP POLICY IF EXISTS "events select" ON events;
DROP POLICY IF EXISTS "ticket_tiers select" ON ticket_tiers;
DROP POLICY IF EXISTS "bookings select" ON bookings;
DROP POLICY IF EXISTS "attendees select" ON attendees;
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable read access for all users" ON ticket_tiers;

-- Create simple permissive SELECT policies
CREATE POLICY "public_select_events" ON events FOR SELECT TO anon USING (true);
CREATE POLICY "public_select_tiers" ON ticket_tiers FOR SELECT TO anon USING (true);
CREATE POLICY "public_select_bookings" ON bookings FOR SELECT TO anon USING (true);
CREATE POLICY "public_select_attendees" ON attendees FOR SELECT TO anon USING (true);

-- Also for authenticated role
CREATE POLICY "auth_select_events" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_select_tiers" ON ticket_tiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_select_bookings" ON bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_select_attendees" ON attendees FOR SELECT TO authenticated USING (true);