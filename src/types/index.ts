export interface Event {
  id: string
  name: string
  description: string
  venue: string
  eventDate: string
  category: string
  imageUrl: string
  isPublished: boolean
  organizerId: string
  createdAt: string
  updatedAt: string
  ticket_tiers?: TicketTier[]
}

export interface TicketTier {
  id: string
  eventId: string
  name: string
  price: number
  totalCapacity: number
  available: number
  saleStartDate: string
  saleEndDate: string
  createdAt: string
}

export interface Booking {
  id: string
  userId: string
  eventId: string
  ticketTierId: string
  quantity: number
  totalPrice: number
  status: string
  bookingReference: string
  createdAt: string
  events?: Event
  ticket_tiers?: TicketTier
}

export interface Attendee {
  id: string
  bookingId: string
  eventId: string
  ticketTierId: string
  name: string
  email: string
  checkedIn: boolean
  checkInTime: string
  createdAt: string
  bookings?: Booking
  ticket_tiers?: TicketTier
}

export interface DashboardStats {
  totalEvents: number
  totalTicketsSold: number
  totalRevenue: number
  upcomingEvents: number
}

export interface SalesAnalytics {
  totalTickets: number
  totalRevenue: number
  tierSales: Record<string, { tickets: number; revenue: number }>
}