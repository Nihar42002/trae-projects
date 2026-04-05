-- Add ticket tiers for new events
INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'General Admission', 75, 200, 200 FROM events WHERE organizerId = 'demo-organizer' AND name = 'Summer Nights Concert';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'VIP', 150, 50, 50 FROM events WHERE organizerId = 'demo-organizer' AND name = 'Summer Nights Concert';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'General', 299, 300, 300 FROM events WHERE organizerId = 'demo-organizer' AND name = 'Tech Summit 2025';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'VIP', 499, 50, 50 FROM events WHERE organizerId = 'demo-organizer' AND name = 'Tech Summit 2025';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'Runner Entry', 50, 500, 500 FROM events WHERE organizerId = 'demo-organizer' AND name = 'City Marathon 2025';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'General', 45, 30, 30 FROM events WHERE organizerId = 'demo-organizer' AND name = 'Art Workshop';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'Entry', 25, 200, 200 FROM events WHERE organizerId = 'demo-organizer' AND name = 'Food Festival';

INSERT INTO ticket_tiers (eventid, name, price, totalcapacity, available)
SELECT id, 'VIP', 75, 50, 50 FROM events WHERE organizerId = 'demo-organizer' AND name = 'Food Festival';