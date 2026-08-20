-- Add ticket tiers for all Music events
INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT e.id, 'General Admission', 65, 300, 300
FROM events e
WHERE e.ispublished = true AND e.category = 'Music'
ON CONFLICT (eventid, name) DO NOTHING;

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT e.id, 'VIP', 125, 75, 75
FROM events e
WHERE e.ispublished = true AND e.category = 'Music'
ON CONFLICT (eventid, name) DO NOTHING;

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT e.id, 'Front Row', 200, 25, 25
FROM events e
WHERE e.ispublished = true AND e.category = 'Music'
ON CONFLICT (eventid, name) DO NOTHING;