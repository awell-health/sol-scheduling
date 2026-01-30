/**
 * WhatConverts tracking utilities
 *
 * Usage:
 *   import { trackAppointment } from '@/lib/tracking/whatconverts'
 *
 *   trackAppointment({
 *     firstName: 'Joe',
 *     lastName: 'Smith',
 *     phone: '+18883437185',
 *     appointmentTime: new Date(),
 *     email: 'joe.smith@example.com', // optional
 *   })
 */

interface AppointmentTrackingData {
  firstName: string
  lastName: string
  phone: string
  appointmentTime: Date | string
  /** Optional - include if available */
  email?: string
}

interface WhatConvertsLeads {
  track: {
    appointment: (data: Record<string, string>) => void
  }
}

declare global {
  interface Window {
    $wc_leads?: WhatConvertsLeads
  }
}

/**
 * Track an appointment conversion in WhatConverts
 */
export function trackAppointment(data: AppointmentTrackingData): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!window.$wc_leads) {
    console.warn('[WhatConverts] Tracker not loaded, skipping appointment tracking')
    return
  }

  const appointmentTime =
    data.appointmentTime instanceof Date
      ? formatDateTime(data.appointmentTime)
      : data.appointmentTime

  const trackingData: Record<string, string> = {
    'First Name': data.firstName,
    'Last Name': data.lastName,
    'Phone Number': data.phone,
    'Appointment Time': appointmentTime,
  }

  if (data.email) {
    trackingData['Email Address'] = data.email
  }

  window.$wc_leads.track.appointment(trackingData)
}

/**
 * Format a Date to WhatConverts expected format: MM/DD/YYYY HH:MM AM/PM
 */
function formatDateTime(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12

  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`
}
