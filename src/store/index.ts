import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Event, Booking, DashboardStats } from '../types'

interface AppState {
  user: { id: string; email: string } | null
  events: Event[]
  myBookings: Booking[]
  dashboardStats: DashboardStats | null
  isLoading: boolean
  error: string | null
  setUser: (user: { id: string; email: string } | null) => void
  fetchEvents: (category?: string, search?: string) => Promise<void>
  fetchEvent: (id: string) => Promise<Event | null>
  fetchMyBookings: () => Promise<void>
  fetchDashboardStats: () => Promise<void>
  createBooking: (eventId: string, tierId: string, quantity: number, totalPrice: number) => Promise<Booking | null>
  cancelBooking: (bookingId: string) => Promise<boolean>
  signOut: () => void
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  events: [],
  myBookings: [],
  dashboardStats: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  fetchEvents: async (category?: string, search?: string) => {
    set({ isLoading: true, error: null })
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('ispublished', true)

      if (category) query = query.eq('category', category)
      if (search) query = query.ilike('name', `%${search}%`)

      query = query.order('eventdate', { ascending: true })
      const { data, error } = await query

      if (error) throw error

      const eventsWithTiers = await Promise.all(
        (data || []).map(async (event) => {
          const { data: tiers } = await supabase
            .from('ticket_tiers')
            .select('*')
            .eq('eventid', event.id)
          return { ...event, ticket_tiers: tiers || [] }
        })
      )

      set({ events: eventsWithTiers, isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events'
      set({ error: message, isLoading: false })
    }
  },

  fetchEvent: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const { data: tiers } = await supabase
        .from('ticket_tiers')
        .select('*')
        .eq('eventid', id)

      set({ isLoading: false })
      return { ...data, ticket_tiers: tiers || [] } as Event
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch event'
      set({ error: message, isLoading: false })
      return null
    }
  },

  fetchMyBookings: async () => {
    const { user } = get()
    if (!user) return

    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, events(*), ticket_tiers(*)')
        .eq('userid', user.id)
        .order('createdat', { ascending: false })

      if (error) throw error
      set({ myBookings: data || [], isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings'
      set({ error: message, isLoading: false })
    }
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null })
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        supabase.from('events').select('id'),
        supabase.from('bookings').select('quantity, totalprice')
      ])

      const totalEvents = eventsRes.data?.length || 0
      const totalTicketsSold = bookingsRes.data?.reduce((sum, b) => sum + (b.quantity || 0), 0) || 0
      const totalRevenue = bookingsRes.data?.reduce((sum, b) => sum + (b.totalprice || 0), 0) || 0

      const upcomingRes = await supabase
        .from('events')
        .select('id')
        .gte('eventdate', new Date().toISOString())

      const stats: DashboardStats = {
        totalEvents,
        totalTicketsSold,
        totalRevenue,
        upcomingEvents: upcomingRes.data?.length || 0
      }

      set({ dashboardStats: stats, isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stats'
      set({ error: message, isLoading: false })
    }
  },

  createBooking: async (eventId: string, tierId: string, quantity: number, totalPrice: number) => {
    const { user } = get()
    if (!user) {
      set({ error: 'Please sign in to book tickets' })
      return null
    }

    set({ isLoading: true, error: null })
    try {
      const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}`

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          userid: user.id,
          eventid: eventId,
          tickettierid: tierId,
          quantity,
          totalprice: totalPrice,
          status: 'confirmed',
          bookingreference: bookingRef
        })
        .select()
        .single()

      if (error) throw error

      const tierRes = await supabase
        .from('ticket_tiers')
        .select('available')
        .eq('id', tierId)
        .single()

      if (tierRes.data) {
        await supabase
          .from('ticket_tiers')
          .update({ available: tierRes.data.available - quantity })
          .eq('id', tierId)
      }

      set({ isLoading: false })
      return data as Booking
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create booking'
      set({ error: message, isLoading: false })
      return null
    }
  },

  cancelBooking: async (bookingId: string) => {
    set({ isLoading: true, error: null })
    try {
      const bookingRes = await supabase
        .from('bookings')
        .select('*, ticket_tiers(*)')
        .eq('id', bookingId)
        .single()

      if (!bookingRes.data) throw new Error('Booking not found')

      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (bookingRes.data.ticket_tiers) {
        const newAvailable = bookingRes.data.ticket_tiers.available + bookingRes.data.quantity
        await supabase
          .from('ticket_tiers')
          .update({ available: newAvailable })
          .eq('id', bookingRes.data.ticketTierId)
      }

      set({ isLoading: false })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to cancel booking'
      set({ error: message, isLoading: false })
      return false
    }
  },

  signOut: () => set({ user: null, myBookings: [] })
}))