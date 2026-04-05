import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet as WalletIcon, Calendar, MapPin, Ticket, QrCode, X, Clock, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import type { Booking } from '../types'

export default function Wallet() {
  const navigate = useNavigate()
  const { user, myBookings, fetchMyBookings, cancelBooking, isLoading } = useStore()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchMyBookings()
  }, [user])

  const now = new Date()

  const upcomingBookings = myBookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.events?.eventDate || '') > now
  )
  const pastBookings = myBookings.filter(
    (b) => b.status === 'cancelled' || new Date(b.events?.eventDate || '') <= now
  )

  const bookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId)
    await cancelBooking(bookingId)
    fetchMyBookings()
    setCancellingId(null)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <WalletIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                My Wallet
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/events" className="text-slate-600 hover:text-violet-600 transition-colors">Browse Events</Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-violet-600 transition-colors">Dashboard</Link>
              <button
                onClick={() => {
                  useStore.getState().signOut()
                  navigate('/login')
                }}
                className="text-slate-600 hover:text-violet-600 transition-colors"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">My Tickets</h1>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'upcoming'
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-600 hover:bg-violet-50 border border-slate-200'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'past'
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-600 hover:bg-violet-50 border border-slate-200'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>

        {isLoading && myBookings.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <WalletIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No {activeTab} bookings</h3>
            <p className="text-slate-500 mb-6">
              {activeTab === 'upcoming'
                ? "You haven't booked any tickets yet"
                : 'Your past bookings will appear here'}
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              Browse Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                isCancelling={cancellingId === booking.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function BookingCard({
  booking,
  onCancel,
  isCancelling
}: {
  booking: Booking
  onCancel: (id: string) => void
  isCancelling: boolean
}) {
  const event = booking.events
  const eventDate = event ? new Date(event.eventDate) : null

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{event?.name}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {eventDate && (
                <>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </>
              )}
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              booking.status === 'cancelled'
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
          </span>
        </div>

        {event && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <MapPin className="w-4 h-4" />
            {event.venue}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
          <div>
            <p className="text-xs text-slate-500 mb-1">Reference</p>
            <p className="font-mono font-bold text-slate-700">{booking.bookingReference}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Ticket Type</p>
            <p className="font-medium text-slate-700">{booking.ticket_tiers?.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Quantity</p>
            <p className="font-medium text-slate-700">{booking.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Total</p>
            <p className="font-bold text-violet-600">${booking.totalPrice}</p>
          </div>
        </div>

        {booking.status !== 'cancelled' && eventDate && eventDate > new Date() && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <button className="flex items-center gap-2 text-sm text-violet-600 font-medium hover:text-violet-700">
              <QrCode className="w-4 h-4" />
              Show QR Code
            </button>
            <button
              onClick={() => onCancel(booking.id)}
              disabled={isCancelling}
              className="flex items-center gap-2 text-sm text-red-600 font-medium hover:text-red-700 disabled:opacity-50"
            >
              {isCancelling ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Cancel Booking
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}