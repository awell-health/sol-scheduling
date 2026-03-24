/**
 * WhatConverts tracking utilities — same `$wc_leads.track.appointment` for all cases.
 *
 * Early funnel (onboarding phone step): phone only; omit or empty `appointmentTime`
 * and names so WhatConverts receives blank appointment time until the user books.
 *
 * Full booking (if ever needed again): pass names, phone, and `appointmentTime`.
 *
 *   import { trackAppointment } from '@/lib/tracking/whatconverts'
 *
 *   trackAppointment({ phone: '+18883437185', appointmentTime: '' })
 *
 *   trackAppointment({
 *     firstName: 'Joe',
 *     lastName: 'Smith',
 *     phone: '+18883437185',
 *     appointmentTime: new Date(),
 *     email: 'joe.smith@example.com',
 *   })
 */

/** External 152343.js may attach `track.appointment` shortly after first paint. */
const TRACKER_RETRY_MS = 100
const TRACKER_MAX_WAIT_MS = 8000

interface AppointmentTrackingData {
  phone: string
  firstName?: string
  lastName?: string
  appointmentTime?: Date | string
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

function buildTrackingRecord(data: AppointmentTrackingData): Record<string, string> {
  const rawTime = data.appointmentTime
  const appointmentTime =
    rawTime === undefined || rawTime === ''
      ? ''
      : rawTime instanceof Date
        ? formatDateTime(rawTime)
        : rawTime

  const trackingData: Record<string, string> = {
    'First Name': data.firstName ?? '',
    'Last Name': data.lastName ?? '',
    'Phone Number': data.phone,
    'Appointment Time': appointmentTime,
  }

  if (data.email) {
    trackingData['Email Address'] = data.email
  }

  return trackingData
}

function trySendAppointment(trackingData: Record<string, string>): boolean {
  const track = window.$wc_leads?.track
  const appointment = track?.appointment
  if (typeof appointment === 'function') {
    appointment.call(track, trackingData)
    console.log('[WhatConverts] track.appointment sent', trackingData)
    return true
  }
  return false
}

/**
 * Track an appointment conversion in WhatConverts.
 * Retries briefly if the async tracker script has not attached `track.appointment` yet.
 */
export function trackAppointment(data: AppointmentTrackingData): void {
  if (typeof window === 'undefined') {
    return
  }

  const trackingData = buildTrackingRecord(data)

  if (trySendAppointment(trackingData)) {
    return
  }

  const started = Date.now()
  const id = window.setInterval(() => {
    if (trySendAppointment(trackingData)) {
      window.clearInterval(id)
      return
    }
    if (Date.now() - started >= TRACKER_MAX_WAIT_MS) {
      window.clearInterval(id)
      console.warn(
        '[WhatConverts] Tracker not ready after retry window, skipping appointment tracking'
      )
    }
  }, TRACKER_RETRY_MS)
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
