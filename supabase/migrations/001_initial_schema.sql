-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    venue TEXT NOT NULL,
    eventDate TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT,
    imageUrl TEXT,
    isPublished BOOLEAN DEFAULT false,
    organizerId TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket tiers table
CREATE TABLE IF NOT EXISTS ticket_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eventId UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    totalCapacity INTEGER NOT NULL,
    available INTEGER NOT NULL,
    saleStartDate TIMESTAMP WITH TIME ZONE,
    saleEndDate TIMESTAMP WITH TIME ZONE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId TEXT NOT NULL,
    eventId UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ticketTierId UUID NOT NULL REFERENCES ticket_tiers(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'confirmed',
    bookingReference TEXT UNIQUE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendees table
CREATE TABLE IF NOT EXISTS attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bookingId UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    eventId UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ticketTierId UUID NOT NULL REFERENCES ticket_tiers(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    checkedIn BOOLEAN DEFAULT false,
    checkInTime TIMESTAMP WITH TIME ZONE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Events policies
GRANT SELECT ON events TO anon;
GRANT SELECT ON events TO authenticated;
GRANT INSERT ON events TO authenticated;
GRANT UPDATE ON events TO authenticated;

-- Ticket tiers policies
GRANT SELECT ON ticket_tiers TO anon;
GRANT SELECT ON ticket_tiers TO authenticated;
GRANT INSERT ON ticket_tiers TO authenticated;
GRANT UPDATE ON ticket_tiers TO authenticated;

-- Bookings policies
GRANT SELECT ON bookings TO authenticated;
GRANT INSERT ON bookings TO authenticated;
GRANT UPDATE ON bookings TO authenticated;

-- Attendees policies
GRANT SELECT ON attendees TO authenticated;
GRANT INSERT ON attendees TO authenticated;
GRANT UPDATE ON attendees TO authenticated;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(eventDate);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_ticket_tiers_event ON ticket_tiers(eventId);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(userId);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(eventId);
CREATE INDEX IF NOT EXISTS idx_attendees_event ON attendees(eventId);