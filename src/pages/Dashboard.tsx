import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Ticket, DollarSign, Users, Plus, Search, Filter, Download, Check, X, MapPin, Clock, Pencil, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { supabase } from '../lib/supabase'
import type { Event, TicketTier } from '../types'

const categories = ['Music', 'Sports', 'Conference', 'Workshop', 'Festival']

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, dashboardStats, fetchDashboardStats } = useStore()
  const [events, setEvents] = useState<Event[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchDashboardStats()
    fetchOrganizerEvents()
  }, [user])

  const fetchOrganizerEvents = async () => {
    if (!user) return
    let query = supabase
      .from('events')
      .select('*, ticket_tiers(*)')
      .order('createdAt', { ascending: false })
    
    if (user.id !== 'demo-organizer') {
      query = query.eq('organizerId', user.id)
    }
    
    const { data } = await query
    setEvents(data || [])
  }

  const handlePublish = async (eventId: string) => {
    await supabase.from('events').update({ isPublished: true }).eq('id', eventId)
    fetchOrganizerEvents()
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    await supabase.from('events').delete().eq('id', eventId)
    fetchOrganizerEvents()
    fetchDashboardStats()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/events" className="text-slate-600 hover:text-violet-600 transition-colors">Browse Events</Link>
              <Link to="/wallet" className="text-slate-600 hover:text-violet-600 transition-colors">My Wallet</Link>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Calendar}
            label="Total Events"
            value={dashboardStats?.totalEvents || 0}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={Ticket}
            label="Tickets Sold"
            value={dashboardStats?.totalTicketsSold || 0}
            color="bg-violet-100 text-violet-600"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${dashboardStats?.totalRevenue || 0}`}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon={Users}
            label="Upcoming"
            value={dashboardStats?.upcomingEvents || 0}
            color="bg-orange-100 text-orange-600"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Your Events</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No events yet</h3>
            <p className="text-slate-500 mb-6">Create your first event to start selling tickets</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Event</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 hidden md:table-cell">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 hidden md:table-cell">Tickets</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 hidden md:table-cell">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Ticket className="w-6 h-6 text-violet-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{event.name}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.venue}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-slate-700">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-slate-700">
                        {event.ticket_tiers?.reduce((sum, t) => sum + (t.totalCapacity - t.available), 0)} / {event.ticket_tiers?.reduce((sum, t) => sum + t.totalCapacity, 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.isPublished
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {event.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!event.isPublished && (
                          <button
                            onClick={() => handlePublish(event.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Publish"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          to={`/dashboard/events/${event.id}`}
                          className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg"
                          title="Manage"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            fetchOrganizerEvents()
            fetchDashboardStats()
          }}
        />
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

function CreateEventModal({
  onClose,
  onCreated
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const { user } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    eventDate: '',
    category: 'Music',
    imageUrl: ''
  })
  const [tiers, setTiers] = useState([{ name: 'General', price: 50, totalCapacity: 100 }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          ...formData,
          organizerId: user.id
        })
        .select()
        .single()

      if (eventError) throw eventError

      for (const tier of tiers) {
        await supabase.from('ticket_tiers').insert({
          eventId: event.id,
          ...tier
        })
      }

      onCreated()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Create New Event</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter event name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 h-24"
              placeholder="Describe your event"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Venue</label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500"
                placeholder="Event location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Image URL (optional)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">Ticket Tiers</label>
              <button
                type="button"
                onClick={() => setTiers([...tiers, { name: '', price: 0, totalCapacity: 50 }])}
                className="text-sm text-violet-600 font-medium"
              >
                + Add Tier
              </button>
            </div>
            <div className="space-y-3">
              {tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <input
                    type="text"
                    required
                    value={tier.name}
                    onChange={(e) => {
                      const newTiers = [...tiers]
                      newTiers[i].name = e.target.value
                      setTiers(newTiers)
                    }}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Tier name"
                  />
                  <input
                    type="number"
                    required
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = [...tiers]
                      newTiers[i].price = Number(e.target.value)
                      setTiers(newTiers)
                    }}
                    className="w-24 px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    required
                    value={tier.totalCapacity}
                    onChange={(e) => {
                      const newTiers = [...tiers]
                      newTiers[i].totalCapacity = Number(e.target.value)
                      setTiers(newTiers)
                    }}
                    className="w-24 px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Capacity"
                  />
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTiers(tiers.filter((_, j) => j !== i))}
                      className="p-2 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}