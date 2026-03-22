import { Injectable } from '@angular/core';
import { CalendarEvent, EventTemplate, SiteData } from './event.model';

const SF_DATA_KEY   = 'sf_data';
const TEMPLATES_KEY = 'ar_templates';
const CAL_KEY       = 'ar_calendar_events';

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

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

@Injectable({ providedIn: 'root' })
export class EventService {

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

  loadTemplates(): EventTemplate[] {
    try {
      const raw = localStorage.getItem(TEMPLATES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  saveTemplate(name: string, data: SiteData): EventTemplate {
    const templates = this.loadTemplates();
    const template: EventTemplate = {
      id: 't' + Date.now(),
      name: name.trim() || 'Untitled Template',
      createdAt: new Date().toISOString(),
      siteData: JSON.parse(JSON.stringify(data)),
    };
    templates.unshift(template);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return template;
  }

  renameTemplate(id: string, name: string): void {
    const templates = this.loadTemplates().map(t => t.id === id ? { ...t, name: name.trim() } : t);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }

  deleteTemplate(id: string): void {
    const templates = this.loadTemplates().filter(t => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }

  loadCalendarEvents(): CalendarEvent[] {
    try {
      const raw = localStorage.getItem(CAL_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return [];
  }

  saveCalendarEvents(events: CalendarEvent[]): void {
    localStorage.setItem(CAL_KEY, JSON.stringify(events));
  }

  getActiveEventData(): SiteData | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = this.loadCalendarEvents();
    const templates = this.loadTemplates();

    for (const ev of events) {
      if (!ev.templateId) continue;
      const start = parseLocalDate(ev.start);
      const end   = parseLocalDate(ev.end);
      if (today >= start && today <= end) {
        const template = templates.find(t => t.id === ev.templateId);
        if (template) return template.siteData;
      }
    }
    return null;
  }

  getNextUpcomingEvent(): CalendarEvent | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.loadCalendarEvents()
      .filter(ev => parseLocalDate(ev.start) > today)
      .sort((a, b) => a.start.localeCompare(b.start))[0] ?? null;
  }

  getPublishedData(): SiteData | null { return this.getActiveEventData(); }
  publishSiteData(data: SiteData): void { this.saveSiteData(data); }
  isPublished(_data: SiteData): boolean { return false; }
}
