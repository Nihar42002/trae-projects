-- Add more Music events
INSERT INTO events (name, description, venue, eventDate, category, imageUrl, isPublished, organizerId) VALUES
('Electronic Dance Night', 'An epic night of EDM with top DJs playing the latest beats and drops.', 'Neon Arena, Las Vegas', '2025-07-25T21:00:00Z', 'Music', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', true, 'demo-organizer'),
('Rock Legends Concert', 'Relive the greatest rock anthems performed by tribute bands.', 'The Bowl, Los Angeles', '2025-08-05T19:30:00Z', 'Music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffc5f?w=800', true, 'demo-organizer'),
('Acoustic Summer Night', 'Intimate acoustic performances under the stars.', 'Hilltop Gardens, Denver', '2025-08-12T20:00:00Z', 'Music', 'https://images.unsplash.com/photo-1514320291840-2c2912d3a798?w=800', true, 'demo-organizer'),
('Hip Hop Awards', 'The hottest hip hop artists compete for the crown.', 'Grand Stage, Atlanta', '2025-08-28T20:00:00Z', 'Music', 'https://images.unsplash.com/photo-1571266028243-e37125633f55?w=800', true, 'demo-organizer'),
('K-Pop Fan Meeting', 'Meet your favorite K-pop stars live in concert.', 'Pacific Center, Seattle', '2025-09-05T18:00:00Z', 'Music', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', true, 'demo-organizer'),
('Country Music Festival', 'Two days of country music, camping, and good times.', 'Ranch Fields, Nashville', '2025-09-12T14:00:00Z', 'Music', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', true, 'demo-organizer'),
('Latin Beats Night', 'Salsa, reggaeton, and latin rhythms all night.', 'Olvera Club, Miami', '2025-09-20T21:00:00Z', 'Music', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fe7?w=800', true, 'demo-organizer'),
('Indie Band Showcase', 'Discover the best upcoming indie bands.', 'Underground Venue, Portland', '2025-09-28T20:30:00Z', 'Music', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', true, 'demo-organizer')
ON CONFLICT (id) DO NOTHING
RETURNING id;