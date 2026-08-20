-- Insert ticket tiers for existing events
INSERT INTO ticket_tiers (eventId, name, price, totalCapacity, available, saleStartDate, saleEndDate)
SELECT 
    id,
    'General Admission',
    CASE 
        WHEN category = 'Music' THEN 75
        WHEN category = 'Conference' THEN 299
        WHEN category = 'Sports' THEN 50
        WHEN category = 'Workshop' THEN 45
        WHEN category = 'Festival' THEN 85
        ELSE 50
    END,
    CASE 
        WHEN category = 'Music' THEN 500
        WHEN category = 'Conference' THEN 300
        WHEN category = 'Sports' THEN 1000
        WHEN category = 'Workshop' THEN 50
        WHEN category = 'Festival' THEN 400
        ELSE 200
    END,
    CASE 
        WHEN category = 'Music' THEN 500
        WHEN category = 'Conference' THEN 300
        WHEN category = 'Sports' THEN 1000
        WHEN category = 'Workshop' THEN 50
        WHEN category = 'Festival' THEN 400
        ELSE 200
    END,
    NOW(),
    eventDate - INTERVAL '1 day'
FROM events
WHERE category IN ('Music', 'Conference', 'Sports', 'Workshop', 'Festival')
ON CONFLICT (eventid, name) DO NOTHING;

-- Add VIP tier for some events
INSERT INTO ticket_tiers (eventId, name, price, totalCapacity, available, saleStartDate, saleEndDate)
SELECT 
    id,
    'VIP',
    CASE 
        WHEN category = 'Music' THEN 150
        WHEN category = 'Conference' THEN 499
        WHEN category = 'Sports' THEN 120
        WHEN category = 'Festival' THEN 175
        ELSE 100
    END,
    CASE 
        WHEN category = 'Music' THEN 100
        WHEN category = 'Conference' THEN 50
        WHEN category = 'Sports' THEN 200
        WHEN category = 'Festival' THEN 100
        ELSE 50
    END,
    CASE 
        WHEN category = 'Music' THEN 100
        WHEN category = 'Conference' THEN 50
        WHEN category = 'Sports' THEN 200
        WHEN category = 'Festival' THEN 100
        ELSE 50
    END,
    NOW(),
    eventDate - INTERVAL '1 day'
FROM events
WHERE category IN ('Music', 'Conference', 'Sports', 'Festival')
ON CONFLICT (eventid, name) DO NOTHING;

-- Add Early Bird tier for Music events
INSERT INTO ticket_tiers (eventId, name, price, totalCapacity, available, saleStartDate, saleEndDate)
SELECT 
    id,
    'Early Bird',
    50,
    150,
    45,
    NOW(),
    NOW() + INTERVAL '14 days'
FROM events
WHERE category = 'Music'
ON CONFLICT (eventid, name) DO NOTHING;