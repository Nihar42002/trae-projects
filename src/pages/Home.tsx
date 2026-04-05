import { Link } from 'react-router-dom'
import { Ticket, Calendar, DollarSign, Users, ArrowRight, Check } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Easy Event Creation',
    description: 'Create and publish events in minutes with customizable ticket tiers'
  },
  {
    icon: Ticket,
    title: 'Multiple Ticket Types',
    description: 'Set different prices and availability for VIP, General, and more'
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description: 'Track guest lists and check-in attendees on event day'
  },
  {
    icon: DollarSign,
    title: 'Revenue Analytics',
    description: 'View sales reports and revenue breakdown instantly'
  }
]

export default function Home() {
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
            <nav className="flex items-center gap-6">
              <Link to="/events" className="text-slate-600 hover:text-violet-600 transition-colors">Browse Events</Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-violet-600 transition-colors">Dashboard</Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-violet-50/30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-6 leading-tight">
                The Complete Event Ticketing Platform
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Create events, sell tickets, manage attendees, and grow your business — all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25"
                >
                  Browse Events <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all border border-slate-200"
                >
                  Create an Event
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Everything you need
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Powerful features to manage your events from creation to post-event analytics
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of event organizers who trust EventHub to power their events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-700 text-white rounded-xl font-semibold hover:bg-violet-800 transition-all"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> Free to start
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> Cancel anytime
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-700">EventHub</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 EventHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}