import { Injectable } from '@angular/core';
import { CalendarEvent, SiteData, SiteSection } from './event.model';

const SF_DATA_KEY = 'sf_data';
const SF_PUB_KEY  = 'sf_published';
const CAL_KEY     = 'ar_calendar_events';

// ─── DEFAULT DATA FACTORIES ───────────────────────────────────────────────────
export function defaultData(type: string): Record<string, any> {
  switch (type) {
    case 'hero':
      return { navBrand: 'Barangay Pandacaqui', headline: '', sub: '', cta: '', ctaLink: '#contact', heroImg: '', eyebrow: 'Upcoming Event' };
    case 'about-simple':
      return { title: 'About This Event', body: '', tagline: '', img: '', imgPos: 'left', eyebrow: 'Event Details' };
    case 'about-centered':
      return { title: 'Event Overview', body: '', bannerImg: '', quote: '', showQuote: false, eyebrow: 'Overview' };
    case 'about-stats':
      return { title: 'By the Numbers', body: '', eyebrow: 'Key Details', stats: [{ num: '500+', label: 'Expected Attendees' }, { num: 'Free', label: 'Admission' }, { num: '8AM', label: 'Start Time' }] };
    case 'features':
      return { title: 'Event Highlights', items: [{ emoji: '💉', title: 'Free Vaccination', desc: 'Open to all residents of the barangay.' }, { emoji: '🎁', title: 'Freebies & Prizes', desc: 'Raffle draws and giveaways for participants.' }, { emoji: '📋', title: 'Registration', desc: 'Walk-in registration available on the day.' }] };
    case 'form':
      return {
        title: 'Register Now', desc: '', eyebrow: 'Sign Up',
        submitLabel: 'Submit Registration',
        successMsg: 'Thank you! Your registration has been received.',
        fields: [
          { id: 'f1', type: 'text',  label: 'Full Name',     placeholder: 'Juan dela Cruz', required: true,  width: 'full' },
          { id: 'f2', type: 'text',  label: 'Purok / Street',placeholder: 'Purok 1',        required: true,  width: 'half' },
          { id: 'f3', type: 'phone', label: 'Mobile Number', placeholder: '09xx-xxx-xxxx', required: false, width: 'half' },
        ],
      };
    case 'contact':
      return { title: 'Get in Touch', body: '', email: '', phone: '', twitter: '', instagram: '', linkedin: '', footerCopy: '' };
    default:
      return {};
  }
}

const DEFAULT_SITE: SiteData = {
  layout: 'agency',
  sections: [
    { id: 's-hero',    type: 'hero',         data: defaultData('hero') },
    { id: 's-about',   type: 'about-simple', data: defaultData('about-simple') },
    { id: 's-feat',    type: 'features',     data: defaultData('features') },
    { id: 's-contact', type: 'contact',      data: defaultData('contact') },
  ],
  theme: { primary: '#3d9e52', secondary: '#d4a017', customCss: '' },
};

const DEFAULT_CAL_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Free Vaccination Drive',            desc: 'Open to all residents of Purok 1 to 4.', start: '2026-03-15', end: '2026-03-15', color: 'ev-green',  loc: 'Barangay Hall' },
  { id: 'e2', title: 'Barangay Fiesta Preparation Meeting',desc: '',                                       start: '2026-03-20', end: '2026-03-20', color: 'ev-purple', loc: 'Multi-purpose Hall' },
  { id: 'e3', title: 'Senior Citizens Health Check',      desc: 'Health check & orientation.',             start: '2026-03-25', end: '2026-03-26', color: 'ev-blue',   loc: 'Barangay Health Center' },
  { id: 'e4', title: 'Youth Livelihood Skills Training',  desc: '',                                        start: '2026-04-03', end: '2026-04-05', color: 'ev-gold',   loc: 'Barangay Hall' },
];

@Injectable({ providedIn: 'root' })
export class EventService {
  // ── Site Data ──────────────────────────────────────────────────────────────
  loadSiteData(): SiteData {
    try {
      const raw = localStorage.getItem(SF_DATA_KEY);
      if (raw) {
        const d: SiteData = JSON.parse(raw);
        if (!d.theme) d.theme = { primary: '#3d9e52', secondary: '#d4a017', customCss: '' };
        return d;
      }
    } catch { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_SITE)) as SiteData;
  }

  saveSiteData(data: SiteData): void {
    localStorage.setItem(SF_DATA_KEY, JSON.stringify(data));
  }

  publishSiteData(data: SiteData): void {
    localStorage.setItem(SF_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(SF_PUB_KEY,  JSON.stringify(data));
  }

  getPublishedData(): SiteData | null {
    try {
      const raw = localStorage.getItem(SF_PUB_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  isPublished(data: SiteData): boolean {
    const pub = this.getPublishedData();
    return !!pub && JSON.stringify(pub) === JSON.stringify(data);
  }

  // ── Calendar Events ────────────────────────────────────────────────────────
  loadCalendarEvents(): CalendarEvent[] {
    try {
      const raw = localStorage.getItem(CAL_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_CAL_EVENTS));
  }

  saveCalendarEvents(events: CalendarEvent[]): void {
    localStorage.setItem(CAL_KEY, JSON.stringify(events));
  }
}
