-- Insert ticket tiers for all published events
INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT e.id, 'General Admission', 75, 200, 200
FROM events e
WHERE e.ispublished = true;

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT e.id, 'VIP', 150, 50, 50
FROM events e
WHERE e.ispublished = true AND e.category = 'Music';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT e.id, 'Early Bird', 50, 100, 100
FROM events e
WHERE e.ispublished = true AND e.category = 'Conference';