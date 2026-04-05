-- Publish all events
UPDATE events SET isPublished = true WHERE isPublished = false;