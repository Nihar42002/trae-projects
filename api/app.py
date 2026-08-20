import os
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_url = os.getenv('SUPABASE_URL', 'https://hohpiuvqjrwpnryvjayx.supabase.co')
supabase_key = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaHBpdXZxanJ3cG5yeXZqYXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjU0ODMsImV4cCI6MjA5MDk0MTQ4M30.aaqvwH-QKv0wJ4nDrxx-glY2WDIJgp6kFA2FdCWhqAw')

supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Event Ticketing API is running'})

@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = supabase.table('events').select('*').eq('ispublished', True)
        
        if category:
            query = query.eq('category', category)
        if search:
            query = query.ilike('name', f'%{search}%')
        
        query = query.eq('ispublished', True).order('eventdate', desc=False)
        response = query.execute()
        
        return jsonify({'events': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['GET'])
def get_event(event_id):
    try:
        response = supabase.table('events').select('*, ticket_tiers(*)').eq('id', event_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Event not found'}), 404
            
        return jsonify({'event': response.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def create_event():
    try:
        data = request.json
        event_data = {
            'name': data.get('name'),
            'description': data.get('description'),
            'venue': data.get('venue'),
            'eventdate': data.get('eventDate'),
            'category': data.get('category'),
            'imageurl': data.get('imageUrl'),
            'ispublished': data.get('isPublished', False),
            'organizerid': data.get('organizerId')
        }
        
        response = supabase.table('events').insert(event_data).execute()
        
        return jsonify({'event': response.data[0]}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        data = request.json
        response = supabase.table('events').update(data).eq('id', event_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Event not found'}), 404
            
        return jsonify({'event': response.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>/publish', methods=['POST'])
def publish_event(event_id):
    try:
        response = supabase.table('events').update({'ispublished': True}).eq('id', event_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Event not found'}), 404
            
        return jsonify({'event': response.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ticket-tiers', methods=['POST'])
def create_ticket_tier():
    try:
        data = request.json
        tier_data = {
            'eventid': data.get('eventId'),
            'name': data.get('name'),
            'price': data.get('price'),
            'totalcapacity': data.get('totalCapacity'),
            'available': data.get('totalCapacity'),
            'salestartdate': data.get('saleStartDate'),
            'saleenddate': data.get('saleEndDate')
        }
        
        response = supabase.table('ticket_tiers').insert(tier_data).execute()
        
        return jsonify({'tier': response.data[0]}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>/tickets', methods=['GET'])
def get_ticket_tiers(event_id):
    try:
        response = supabase.table('ticket_tiers').select('*').eq('eventid', event_id).execute()
        
        return jsonify({'tiers': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        user_id = request.args.get('userId')
        
        if user_id:
            response = supabase.table('bookings').select('*, events(*), ticket_tiers(*)').eq('userid', user_id).execute()
        else:
            response = supabase.table('bookings').select('*, events(*), ticket_tiers(*)').execute()
        
        return jsonify({'bookings': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    try:
        data = request.json
        booking_data = {
            'userid': data.get('userId'),
            'eventid': data.get('eventId'),
            'tickettierid': data.get('ticketTierId'),
            'quantity': data.get('quantity'),
            'totalprice': data.get('totalPrice'),
            'status': 'confirmed'
        }
        
        response = supabase.table('bookings').insert(booking_data).execute()
        booking_id = response.data[0]['id']
        
        tier_response = supabase.table('ticket_tiers').select('available').eq('id', data.get('ticketTierId')).execute()
        if tier_response.data:
            new_available = tier_response.data[0]['available'] - data.get('quantity')
            supabase.table('ticket_tiers').update({'available': new_available}).eq('id', data.get('ticketTierId')).execute()
        
        return jsonify({'booking': response.data[0]}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings/<booking_id>/cancel', methods=['POST'])
def cancel_booking(booking_id):
    try:
        response = supabase.table('bookings').select('*').eq('id', booking_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Booking not found'}), 404
            
        booking = response.data[0]
        
        supabase.table('bookings').update({'status': 'cancelled'}).eq('id', booking_id).execute()
        
        tier_response = supabase.table('ticket_tiers').select('available').eq('id', booking['tickettierid']).execute()
        if tier_response.data:
            new_available = tier_response.data[0]['available'] + booking['quantity']
            supabase.table('ticket_tiers').update({'available': new_available}).eq('id', booking['tickettierid']).execute()
        
        return jsonify({'message': 'Booking cancelled successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendees', methods=['GET'])
def get_attendees():
    try:
        event_id = request.args.get('eventId')
        
        if event_id:
            response = supabase.table('attendees').select('*, bookings(*), ticket_tiers(*)').eq('eventid', event_id).execute()
        else:
            response = supabase.table('attendees').select('*, bookings(*), ticket_tiers(*)').execute()
        
        return jsonify({'attendees': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendees/<attendee_id>/checkin', methods=['POST'])
def checkin_attendee(attendee_id):
    try:
        response = supabase.table('attendees').update({
            'checkedin': True,
            'checkintime': datetime.now(timezone.utc).isoformat()
        }).eq('id', attendee_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Attendee not found'}), 404
            
        return jsonify({'attendee': response.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/sales', methods=['GET'])
def get_sales_analytics():
    try:
        event_id = request.args.get('eventId')
        
        if event_id:
            bookings = supabase.table('bookings').select('*, ticket_tiers(*)').eq('eventid', event_id).execute()
        else:
            bookings = supabase.table('bookings').select('*, ticket_tiers(*), events(*)').execute()
        
        total_tickets = sum(b.get('quantity', 0) for b in bookings.data)
        total_revenue = sum(b.get('totalprice', 0) for b in bookings.data)
        
        tier_sales = {}
        for booking in bookings.data:
            tier_name = booking.get('ticket_tiers', {}).get('name', 'Unknown')
            if tier_name not in tier_sales:
                tier_sales[tier_name] = {'tickets': 0, 'revenue': 0}
            tier_sales[tier_name]['tickets'] += booking.get('quantity', 0)
            tier_sales[tier_name]['revenue'] += booking.get('totalprice', 0)
        
        return jsonify({
            'totalTickets': total_tickets,
            'totalRevenue': total_revenue,
            'tierSales': tier_sales
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard_stats():
    try:
        events_response = supabase.table('events').select('id').execute()
        total_events = len(events_response.data)
        
        bookings_response = supabase.table('bookings').select('quantity, totalprice').execute()
        total_tickets_sold = sum(b.get('quantity', 0) for b in bookings_response.data)
        total_revenue = sum(b.get('totalprice', 0) for b in bookings_response.data)
        
        upcoming_response = supabase.table('events').select('id').gte('eventdate', datetime.now(timezone.utc).isoformat()).execute()
        upcoming_events = len(upcoming_response.data)
        
        return jsonify({
            'totalEvents': total_events,
            'totalTicketsSold': total_tickets_sold,
            'totalRevenue': total_revenue,
            'upcomingEvents': upcoming_events
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/organizer/<organizer_id>/events', methods=['GET'])
def get_organizer_events(organizer_id):
    try:
        response = supabase.table('events').select('*, ticket_tiers(*)').eq('organizerid', organizer_id).execute()
        
        return jsonify({'events': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)