ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_events" ON events;
DROP POLICY IF EXISTS "public_select_tiers" ON ticket_tiers;
DROP POLICY IF EXISTS "public_select_bookings" ON bookings;
DROP POLICY IF EXISTS "public_select_attendees" ON attendees;
DROP POLICY IF EXISTS "auth_select_events" ON events;
DROP POLICY IF EXISTS "auth_select_tiers" ON ticket_tiers;
DROP POLICY IF EXISTS "auth_select_bookings" ON bookings;
DROP POLICY IF EXISTS "auth_select_attendees" ON attendees;

CREATE POLICY "public_select_published_events" ON events
FOR SELECT TO anon, authenticated
USING (ispublished = true);

CREATE POLICY "organizer_manage_events" ON events
FOR ALL TO authenticated
USING (organizerid = auth.uid()::text)
WITH CHECK (organizerid = auth.uid()::text);

CREATE POLICY "public_select_published_tiers" ON ticket_tiers
FOR SELECT TO anon, authenticated
USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = ticket_tiers.eventid
      AND events.ispublished = true
));

CREATE POLICY "organizer_manage_tiers" ON ticket_tiers
FOR ALL TO authenticated
USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = ticket_tiers.eventid
      AND events.organizerid = auth.uid()::text
))
WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = ticket_tiers.eventid
      AND events.organizerid = auth.uid()::text
));

CREATE POLICY "users_read_own_bookings" ON bookings
FOR SELECT TO authenticated
USING (userid = auth.uid()::text);

CREATE POLICY "users_create_own_bookings" ON bookings
FOR INSERT TO authenticated
WITH CHECK (userid = auth.uid()::text);

CREATE POLICY "users_update_own_bookings" ON bookings
FOR UPDATE TO authenticated
USING (userid = auth.uid()::text)
WITH CHECK (userid = auth.uid()::text);

CREATE POLICY "users_read_own_attendees" ON attendees
FOR SELECT TO authenticated
USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = attendees.bookingid
      AND bookings.userid = auth.uid()::text
));

CREATE POLICY "users_create_own_attendees" ON attendees
FOR INSERT TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = attendees.bookingid
      AND bookings.userid = auth.uid()::text
));

CREATE POLICY "users_update_own_attendees" ON attendees
FOR UPDATE TO authenticated
USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = attendees.bookingid
      AND bookings.userid = auth.uid()::text
))
WITH CHECK (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = attendees.bookingid
      AND bookings.userid = auth.uid()::text
));
