import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, Ticket } from 'lucide-react'
import { useStore } from '../store'
import type { Event } from '../types'

const categories = ['All', 'Music', 'Sports', 'Conference', 'Workshop', 'Festival']

export default function Events() {
  const { events, fetchEvents, isLoading } = useStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchEvents(category === 'All' ? undefined : category, search || undefined)
  }, [category, search, fetchEvents])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/events" className="text-violet-600 font-medium">Browse Events</Link>
              <Link to="/wallet" className="text-slate-600 hover:text-violet-600 transition-colors">My Wallet</Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-violet-600 transition-colors">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Find and book tickets for concerts, sports, conferences, and more
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  category === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-violet-50 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No events found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const rawEvent = event as unknown as Record<string, unknown>
  const eventDate = new Date(rawEvent.eventDate as string || rawEvent.eventdate as string || Date.now())
  const imageUrl = rawEvent.imageUrl as string || rawEvent.imageurl as string

  return (
    <Link
      to={`/events/${event.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
    >
      <div className="h-48 bg-gradient-to-br from-violet-100 to-purple-100 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Ticket className="w-16 h-16 text-violet-300" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-violet-600">
            {event.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-violet-600 transition-colors line-clamp-1">
          {event.name}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">From</span>
          <span className="text-xl font-bold text-violet-600">
            ${event.ticket_tiers?.[0]?.price || '0'}
          </span>
        </div>
      </div>
    </Link>
  )
}