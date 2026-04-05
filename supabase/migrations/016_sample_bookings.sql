-- Add sample bookings for demo
INSERT INTO bookings (userid, eventid, tickettierid, quantity, totalprice, status, bookingreference)
SELECT 
    'demo-organizer',
    e.id,
    t.id,
    5,
    t.price * 5,
    'confirmed',
    'DEMO-' || NOW()::text
FROM events e
JOIN ticket_tiers t ON t.eventid = e.id
WHERE e.name = 'Summer Music Festival 2025' AND t.name = 'General Admission'
LIMIT 1;

INSERT INTO bookings (userid, eventid, tickettierid, quantity, totalprice, status, bookingreference)
SELECT 
    'demo-organizer',
    e.id,
    t.id,
    3,
    t.price * 3,
    'confirmed',
    'DEMO-' || NOW()::text
FROM events e
JOIN ticket_tiers t ON t.eventid = e.id
WHERE e.name = 'Tech Conference 2025' AND t.name = 'General'
LIMIT 1;

INSERT INTO bookings (userid, eventid, tickettierid, quantity, totalprice, status, bookingreference)
SELECT 
    'demo-organizer',
    e.id,
    t.id,
    10,
    t.price * 10,
    'confirmed',
    'DEMO-' || NOW()::text
FROM events e
JOIN ticket_tiers t ON t.eventid = e.id
WHERE e.name = 'Marathon Championship' AND t.name = 'Runner Entry'
LIMIT 1;