import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Clock, Ticket, Users, ArrowLeft, Check, X } from 'lucide-react'
import { useStore } from '../store'
import type { Event, TicketTier } from '../types'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, createBooking, fetchEvent, isLoading, error } = useStore()
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    const loadEvent = async () => {
      const data = await fetchEvent(id)
      if (data) setEvent(data)
    }
    loadEvent()
  }, [id, fetchEvent])

  const handleBooking = async () => {
    if (!selectedTier || !event) return
    const totalPrice = selectedTier.price * quantity
    const booking = await createBooking(event.id, selectedTier.id, quantity, totalPrice)
    if (booking) {
      setBookingSuccess(true)
      setTimeout(() => navigate('/wallet'), 2000)
    }
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-600">Redirecting to your wallet...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const eventDate = new Date(event.eventDate)
  const totalPrice = selectedTier ? selectedTier.price * quantity : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/events" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
              <span className="text-slate-600 font-medium">Back to Events</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/wallet" className="text-slate-600 hover:text-violet-600 transition-colors">My Wallet</Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-violet-600 transition-colors">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
              <div className="h-80 bg-gradient-to-br from-violet-100 to-purple-100 relative">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Ticket className="w-24 h-24 text-violet-300" />
                  </div>
                )}
              </div>
              <div className="p-8">
                <span className="inline-block px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-sm font-medium mb-4">
                  {event.category}
                </span>
                <h1 className="text-3xl font-bold text-slate-800 mb-4">{event.name}</h1>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="font-medium text-slate-700">{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="font-medium text-slate-700">{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 col-span-2">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Venue</p>
                      <p className="font-medium text-slate-700">{event.venue}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-3">About this event</h2>
                  <p className="text-slate-600 leading-relaxed">{event.description || 'No description available.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Select Tickets</h2>

              {!user ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Sign in to book tickets</p>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              ) : event.ticket_tiers?.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No tickets available yet</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {event.ticket_tiers?.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      disabled={tier.available === 0}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTier?.id === tier.id
                          ? 'border-violet-600 bg-violet-50'
                          : 'border-slate-200 hover:border-violet-300'
                      } ${tier.available === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800">{tier.name}</span>
                        <span className="text-lg font-bold text-violet-600">${tier.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          {tier.available > 0 ? `${tier.available} available` : 'Sold out'}
                        </span>
                        {tier.saleStartDate && (
                          <span className="text-xs text-slate-400">
                            {new Date(tier.saleStartDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedTier && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedTier.available, quantity + 1))}
                      disabled={quantity >= selectedTier.available}
                      className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedTier || !user || isLoading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Ticket className="w-5 h-5" />
                    {selectedTier ? `Confirm Booking - $${totalPrice}` : 'Select a ticket'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}