CREATE OR REPLACE FUNCTION public.create_booking(
    p_eventid UUID,
    p_tickettierid UUID,
    p_quantity INTEGER,
    p_totalprice NUMERIC,
    p_bookingreference TEXT
)
RETURNS bookings
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    tier ticket_tiers;
    result bookings;
BEGIN
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than zero';
    END IF;

    SELECT * INTO tier
    FROM ticket_tiers
    WHERE id = p_tickettierid AND eventid = p_eventid
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Ticket tier not found';
    END IF;

    IF tier.available < p_quantity THEN
        RAISE EXCEPTION 'Not enough tickets available';
    END IF;

    UPDATE ticket_tiers
    SET available = available - p_quantity
    WHERE id = p_tickettierid;

    INSERT INTO bookings (
        userid,
        eventid,
        tickettierid,
        quantity,
        totalprice,
        status,
        bookingreference
    )
    VALUES (
        auth.uid()::text,
        p_eventid,
        p_tickettierid,
        p_quantity,
        p_totalprice,
        'confirmed',
        p_bookingreference
    )
    RETURNING * INTO result;

    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_booking(p_bookingid UUID)
RETURNS bookings
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    booking_row bookings;
    result bookings;
BEGIN
    SELECT * INTO booking_row
    FROM bookings
    WHERE id = p_bookingid
      AND userid = auth.uid()::text
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF booking_row.status <> 'confirmed' THEN
        RAISE EXCEPTION 'Booking is already cancelled';
    END IF;

    UPDATE ticket_tiers
    SET available = LEAST(totalcapacity, available + booking_row.quantity)
    WHERE id = booking_row.tickettierid;

    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = p_bookingid
    RETURNING * INTO result;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_booking(UUID, UUID, INTEGER, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_booking(UUID) TO authenticated;
