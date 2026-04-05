-- Update ALL image URLs to picsum
UPDATE events SET imageurl = 'https://picsum.photos/seed/summer/800/600' WHERE imageurl LIKE '%unsplash%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/tech/800/600' WHERE imageurl IS NULL OR imageurl = '';
UPDATE events SET imageurl = 'https://picsum.photos/seed/event1/800/600' WHERE name LIKE '%Summer Nights%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/event2/800/600' WHERE name LIKE '%Tech Summit%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/event3/800/600' WHERE name LIKE '%City Marathon%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/event4/800/600' WHERE name LIKE '%Art Workshop%' AND name NOT LIKE '%Watercolor%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/event5/800/600' WHERE name LIKE '%Food Festival%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/music1/800/600' WHERE category = 'Music' AND imageurl LIKE '%unsplash%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/sports/800/600' WHERE category = 'Sports' AND imageurl LIKE '%unsplash%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/workshop/800/600' WHERE category = 'Workshop' AND imageurl LIKE '%unsplash%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/conference/800/600' WHERE category = 'Conference' AND imageurl LIKE '%unsplash%';
UPDATE events SET imageurl = 'https://picsum.photos/seed/festival/800/600' WHERE category = 'Festival' AND imageurl LIKE '%unsplash%';