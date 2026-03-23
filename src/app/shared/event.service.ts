import { Injectable } from '@angular/core';
import { CalendarEvent, EventTemplate, SiteData } from './event.model';

const SF_DATA_KEY   = 'sf_data';
const TEMPLATES_KEY = 'ar_templates';
const CAL_KEY       = 'ar_calendar_events';
const SUBMISSIONS_KEY = 'ar_submissions';
const SEED_KEY      = 'ar_seeded_v2';

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

const SEED_TEMPLATES: EventTemplate[] = [
  {
    id: 'tpl-seed-health-drive',
    name: 'Free Health & Vaccination Drive — March 2026',
    createdAt: '2026-02-20T08:00:00.000Z',
    siteData: {
      layout: 'agency',
      theme: { primary: '#2C7A3B', secondary: '#E5A822', customCss: '' },
      sections: [
        {
          id: 'hd-hero',
          type: 'hero',
          data: {
            navBrand: 'Barangay Pandacaqui',
            eyebrow: 'Free Community Health Services',
            headline: 'Health & Vaccination Drive 2026',
            sub: 'Free medical consultations, vaccines, and health screenings for all Pandacaqui residents. No registration required — just bring a valid ID.',
            cta: 'Register Now',
            ctaLink: '#form',
            heroImg: '',
          },
        },
        {
          id: 'hd-about',
          type: 'about-simple',
          data: {
            eyebrow: 'About the Drive',
            title: 'Your Health is Our Priority',
            body: 'In partnership with the Municipal Health Office of Mexico, Pampanga, Barangay Pandacaqui is hosting a week-long free health and vaccination drive open to all residents. Our team of licensed physicians, nurses, and health workers will be on-site every day from 8:00 AM to 5:00 PM at the Barangay Hall.\n\nServices are completely free of charge and cover all age groups — from infants to senior citizens. Early registration is encouraged to minimize waiting time.',
            tagline: 'March 1–7, 2026  ·  Barangay Hall  ·  8:00 AM – 5:00 PM',
            img: '',
            imgPos: 'right',
          },
        },
        {
          id: 'hd-feat',
          type: 'features',
          data: {
            title: 'Services Available',
            items: [
              { emoji: '💉', title: 'Vaccination', desc: 'Free flu, anti-rabies, and routine childhood vaccines for infants, children, and adults.' },
              { emoji: '🩺', title: 'Medical Consultation', desc: 'Free consultation with licensed physicians for general health concerns and chronic disease management.' },
              { emoji: '🦷', title: 'Dental Services', desc: 'Free dental check-up, cleaning, and tooth extraction for residents aged 7 and above.' },
              { emoji: '🤰', title: 'Maternal Health', desc: 'Pre-natal check-ups and family planning consultations for women of all ages.' },
              { emoji: '👁️', title: 'Eye Screening', desc: 'Free vision screening and referrals for those needing corrective eyewear.' },
              { emoji: '💊', title: 'Free Medicines', desc: 'Essential medicines and vitamins distributed while supplies last.' },
            ],
          },
        },
        {
          id: 'hd-form',
          type: 'form',
          data: {
            eyebrow: 'Pre-Registration',
            title: 'Register for Priority Lane',
            desc: 'Pre-registering gives you a priority number and shorter wait time. Walk-ins are still welcome.',
            submitLabel: 'Submit Registration',
            successMsg: '✅ Registration received! Please present this confirmation at the registration booth. Thank you!',
            fields: [
              { id: 'hdf1', type: 'text',   label: 'Full Name',       placeholder: 'Juan dela Cruz',  required: true,  width: 'full' },
              { id: 'hdf2', type: 'text',   label: 'Age',             placeholder: 'e.g. 35',          required: true,  width: 'half' },
              { id: 'hdf3', type: 'text',   label: 'Purok / Street',  placeholder: 'Purok 3',          required: true,  width: 'half' },
              { id: 'hdf4', type: 'phone',  label: 'Contact Number',  placeholder: '09xx-xxx-xxxx',    required: false, width: 'half' },
              { id: 'hdf5', type: 'select', label: 'Primary Service', placeholder: '',                 required: true,  width: 'half', options: ['Vaccination', 'Medical Consultation', 'Dental Services', 'Maternal Health', 'Eye Screening', 'Free Medicines'] },
            ],
          },
        },
        {
          id: 'hd-contact',
          type: 'contact',
          data: {
            title: 'Contact Us',
            body: 'For inquiries about the health drive, please contact the Barangay Health Center or visit the Barangay Hall.',
            email: 'pandacaqui.health@mexico.gov.ph',
            phone: '(045) 123-4567',
            twitter: '',
            instagram: '',
            linkedin: '',
            footerCopy: '© 2026 Barangay Pandacaqui. All rights reserved.',
          },
        },
      ],
    },
  },
  {
    id: 'tpl-seed-fiesta',
    name: 'Barangay Fiesta 2026 — March',
    createdAt: '2026-02-20T08:05:00.000Z',
    siteData: {
      layout: 'minimal',
      theme: { primary: '#c41e3a', secondary: '#E5A822', customCss: '' },
      sections: [
        {
          id: 'fi-hero',
          type: 'hero',
          data: {
            navBrand: 'Barangay Pandacaqui',
            eyebrow: 'Annual Celebration',
            headline: 'Pandacaqui Fiesta 2026',
            sub: 'Join us as we celebrate the Feast of Our Lady of Remedies with three days of music, culture, food, and community spirit. Everyone is welcome!',
            cta: 'See the Program',
            ctaLink: '#features',
            heroImg: '',
          },
        },
        {
          id: 'fi-about',
          type: 'about-centered',
          data: {
            eyebrow: 'Our Annual Tradition',
            title: 'A Celebration of Faith & Community',
            body: 'Every year, Barangay Pandacaqui gathers in joyful celebration of the Feast of Our Lady of Remedies — our barangay\'s patron saint. This three-day fiesta is a time for families, neighbors, and friends to reconnect, share in thanksgiving, and enjoy the rich cultural heritage of our community.\n\nFrom the solemn morning Mass and colorful street parade to the lively evening concerts and food festival, the Pandacaqui Fiesta is truly a celebration for everyone.',
            showQuote: true,
            quote: 'Sama-sama nating ipagdiwang ang ating pagkakaisa at pananampalataya.',
            bannerImg: '',
          },
        },
        {
          id: 'fi-feat',
          type: 'features',
          data: {
            title: 'Fiesta Program Highlights',
            items: [
              { emoji: '⛪', title: 'Solemn Mass', desc: 'Join us for a special thanksgiving Mass at the Barangay Chapel, March 14 at 7:00 AM.' },
              { emoji: '🎉', title: 'Street Parade', desc: 'A colorful procession through the main streets of Pandacaqui featuring floats, cultural dancers, and the community.' },
              { emoji: '🍖', title: 'Food Festival', desc: 'Local vendors and community groups showcase Kapampangan delicacies and specialty dishes all three days.' },
              { emoji: '🎭', title: 'Cultural Night', desc: 'An evening of traditional dances, musical performances, and a special presentation by the SK Youth Organization.' },
              { emoji: '🎤', title: 'Live Concert', desc: 'Enjoy live performances from local and guest artists on the evening of March 15 at the Barangay Plaza.' },
              { emoji: '🏆', title: 'Sports Events', desc: 'Basketball tournament, volleyball, and parlor games open to all puroks. Registration at the Barangay Hall.' },
            ],
          },
        },
        {
          id: 'fi-contact',
          type: 'contact',
          data: {
            title: 'Join the Celebration',
            body: 'For sponsorships, participation inquiries, or event information, reach out to the Barangay Hall.',
            email: 'pandacaqui.fiesta@mexico.gov.ph',
            phone: '(045) 123-4567',
            twitter: '',
            instagram: '',
            linkedin: '',
            footerCopy: '© 2026 Barangay Pandacaqui. All rights reserved.',
          },
        },
      ],
    },
  },
  {
    id: 'tpl-seed-youth-program',
    name: 'Youth Leadership & Skills Program — March–April 2026',
    createdAt: '2026-02-20T08:10:00.000Z',
    siteData: {
      layout: 'bold',
      theme: { primary: '#7c4dff', secondary: '#E5A822', customCss: '' },
      sections: [
        {
          id: 'yp-hero',
          type: 'hero',
          data: {
            navBrand: 'Barangay Pandacaqui',
            eyebrow: 'SK Youth Organization',
            headline: 'Youth Leadership & Skills Program',
            sub: 'A six-day immersive program for Pandacaqui youth aged 15–30. Build leadership skills, explore livelihood opportunities, and connect with mentors from across the province.',
            cta: 'Apply Now',
            ctaLink: '#form',
            heroImg: '',
          },
        },
        {
          id: 'yp-stats',
          type: 'about-stats',
          data: {
            eyebrow: 'Program at a Glance',
            title: 'Empowering the Next Generation',
            body: 'This program is designed to equip young residents of Barangay Pandacaqui with practical skills and leadership values. Organized by the Sangguniang Kabataan in partnership with the TESDA and DSWD, participants will receive certificates of completion and priority referral for livelihood programs.',
            stats: [
              { num: '6', label: 'Days of Training' },
              { num: '50', label: 'Slots Available' },
              { num: 'Free', label: 'Admission & Meals' },
              { num: '3', label: 'Skill Tracks' },
              { num: '15–30', label: 'Age Bracket' },
              { num: 'Cert.', label: 'TESDA-Aligned' },
            ],
          },
        },
        {
          id: 'yp-feat',
          type: 'features',
          data: {
            title: 'What You Will Learn',
            items: [
              { emoji: '🎯', title: 'Leadership Training', desc: 'Workshops on effective communication, decision-making, community organizing, and youth governance.' },
              { emoji: '💻', title: 'Digital Skills', desc: 'Introduction to digital literacy, social media for advocacy, basic graphic design, and online entrepreneurship.' },
              { emoji: '🌱', title: 'Livelihood & Agri-Tech', desc: 'Hands-on sessions in urban gardening, value-added food processing, and sustainable farming practices.' },
              { emoji: '🏃', title: 'Sports & Wellness', desc: 'Daily physical activities, mental health awareness seminars, and team-building challenges.' },
              { emoji: '🎨', title: 'Arts & Culture', desc: 'Creative expression workshops covering visual arts, spoken word, and indigenous Kapampangan cultural arts.' },
              { emoji: '🤝', title: 'Community Service', desc: 'Participants will complete a community project proposal benefiting a chosen sector of Barangay Pandacaqui.' },
            ],
          },
        },
        {
          id: 'yp-form',
          type: 'form',
          data: {
            eyebrow: 'Apply Now',
            title: 'Program Application Form',
            desc: 'Slots are limited to 50 participants. Applications are accepted on a first-come, first-served basis. Incomplete applications will not be processed.',
            submitLabel: 'Submit Application',
            successMsg: '🎉 Application submitted! We will contact you within 3 business days to confirm your slot. See you at the program!',
            fields: [
              { id: 'ypf1', type: 'text',   label: 'Full Name',         placeholder: 'Juan dela Cruz',    required: true,  width: 'full' },
              { id: 'ypf2', type: 'number', label: 'Age',               placeholder: 'e.g. 20',           required: true,  width: 'half' },
              { id: 'ypf3', type: 'text',   label: 'Purok / Street',    placeholder: 'Purok 2',           required: true,  width: 'half' },
              { id: 'ypf4', type: 'email',  label: 'Email Address',     placeholder: 'you@email.com',     required: false, width: 'half' },
              { id: 'ypf5', type: 'phone',  label: 'Contact Number',    placeholder: '09xx-xxx-xxxx',     required: true,  width: 'half' },
              { id: 'ypf6', type: 'select', label: 'Preferred Track',   placeholder: '',                  required: true,  width: 'full', options: ['Leadership & Governance', 'Digital Skills & Entrepreneurship', 'Livelihood & Agri-Tech'] },
              { id: 'ypf7', type: 'textarea', label: 'Why do you want to join?', placeholder: 'Tell us in 2–3 sentences why you want to participate in this program.', required: true, width: 'full' },
            ],
          },
        },
        {
          id: 'yp-contact',
          type: 'contact',
          data: {
            title: 'Questions?',
            body: 'Contact the SK Office at the Barangay Hall for more details about the program schedule, requirements, and application process.',
            email: 'sk.pandacaqui@mexico.gov.ph',
            phone: '09XX-XXX-XXXX',
            twitter: '',
            instagram: '',
            linkedin: '',
            footerCopy: '© 2026 Barangay Pandacaqui SK Organization. All rights reserved.',
          },
        },
      ],
    },
  },
];

const SEED_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-seed-health-drive',
    title: 'Free Health & Vaccination Drive',
    desc: 'Week-long free health services including vaccination, medical consultation, dental, and maternal health services for all residents.',
    start: '2026-03-01',
    end: '2026-03-07',
    color: 'ev-green',
    loc: 'Barangay Hall',
    templateId: 'tpl-seed-health-drive',
  },
  {
    id: 'ev-seed-fiesta',
    title: 'Pandacaqui Fiesta 2026',
    desc: 'Annual Barangay Fiesta celebrating the Feast of Our Lady of Remedies with parade, food festival, cultural night, and live concert.',
    start: '2026-03-14',
    end: '2026-03-17',
    color: 'ev-red',
    loc: 'Barangay Plaza & Hall',
    templateId: 'tpl-seed-fiesta',
  },
  {
    id: 'ev-seed-youth-program',
    title: 'Youth Leadership & Skills Program',
    desc: 'Six-day SK-organized program for youth aged 15–30 covering leadership, digital skills, livelihood, and community service.',
    start: '2026-03-29',
    end: '2026-04-03',
    color: 'ev-purple',
    loc: 'Barangay Hall & Multi-Purpose Center',
    templateId: 'tpl-seed-youth-program',
  },
];

const SEED_SUBMISSIONS = [
  {
    id: 'sub-hd-seed-1',
    type: 'attendance',
    name: 'Maria Santos',
    submittedAt: '2026-03-01T08:14:22.000Z',
    status: 'verified',
    eventName: 'Health & Vaccination Drive 2026',
    fields: [
      { label: 'Full Name', value: 'Maria Santos' },
      { label: 'Age', value: '34' },
      { label: 'Purok / Street', value: 'Purok 3' },
      { label: 'Contact Number', value: '09171234567' },
      { label: 'Primary Service', value: 'Vaccination' },
    ],
  },
  {
    id: 'sub-hd-seed-2',
    type: 'attendance',
    name: 'Jose dela Cruz',
    submittedAt: '2026-03-01T09:32:45.000Z',
    status: 'verified',
    eventName: 'Health & Vaccination Drive 2026',
    fields: [
      { label: 'Full Name', value: 'Jose dela Cruz' },
      { label: 'Age', value: '52' },
      { label: 'Purok / Street', value: 'Purok 1' },
      { label: 'Contact Number', value: '09281234567' },
      { label: 'Primary Service', value: 'Medical Consultation' },
    ],
  },
  {
    id: 'sub-hd-seed-3',
    type: 'attendance',
    name: 'Ana Reyes',
    submittedAt: '2026-03-01T10:05:11.000Z',
    status: 'pending',
    eventName: 'Health & Vaccination Drive 2026',
    fields: [
      { label: 'Full Name', value: 'Ana Reyes' },
      { label: 'Age', value: '27' },
      { label: 'Purok / Street', value: 'Purok 5' },
      { label: 'Contact Number', value: '09991234567' },
      { label: 'Primary Service', value: 'Maternal Health' },
    ],
  },
  {
    id: 'sub-hd-seed-4',
    type: 'attendance',
    name: 'Roberto Manalo',
    submittedAt: '2026-03-01T13:47:30.000Z',
    status: 'pending',
    eventName: 'Health & Vaccination Drive 2026',
    fields: [
      { label: 'Full Name', value: 'Roberto Manalo' },
      { label: 'Age', value: '61' },
      { label: 'Purok / Street', value: 'Purok 2' },
      { label: 'Contact Number', value: '09081234567' },
      { label: 'Primary Service', value: 'Medical Consultation' },
    ],
  },
  {
    id: 'sub-hd-seed-5',
    type: 'attendance',
    name: 'Liza Flores',
    submittedAt: '2026-03-02T08:22:09.000Z',
    status: 'rejected',
    eventName: 'Health & Vaccination Drive 2026',
    fields: [
      { label: 'Full Name', value: 'Liza Flores' },
      { label: 'Age', value: '19' },
      { label: 'Purok / Street', value: 'Purok 4' },
      { label: 'Contact Number', value: '09161234567' },
      { label: 'Primary Service', value: 'Eye Screening' },
    ],
  },
  {
    id: 'sub-hd-seed-6',
    type: 'attendance',
    name: 'Nestor Bautista',
    submittedAt: '2026-03-02T09:55:17.000Z',
    status: 'pending',
    eventName: 'Health & Vaccination Drive 2026',
    fields: [
      { label: 'Full Name', value: 'Nestor Bautista' },
      { label: 'Age', value: '45' },
      { label: 'Purok / Street', value: 'Purok 6' },
      { label: 'Contact Number', value: '09351234567' },
      { label: 'Primary Service', value: 'Dental Services' },
    ],
  },
  {
    id: 'sub-hd-seed-7',
    type: 'attendance',
    name: 'Carmelita Ramos',
    submittedAt: '2026-03-02T11:10:44.000Z',
    status: 'verified',
    eventName: 'Health & Vaccination Drive 2026',
    fields: [
      { label: 'Full Name', value: 'Carmelita Ramos' },
      { label: 'Age', value: '38' },
      { label: 'Purok / Street', value: 'Purok 1' },
      { label: 'Contact Number', value: '09501234567' },
      { label: 'Primary Service', value: 'Free Medicines' },
    ],
  },
];

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

@Injectable({ providedIn: 'root' })
export class EventService {

  constructor() {
    this.runSeedIfNeeded();
  }

  private runSeedIfNeeded(): void {
    if (localStorage.getItem(SEED_KEY) === '1') return;

    const existingTemplates: EventTemplate[] = this.loadTemplates();
    const existingTemplateIds = new Set(existingTemplates.map(t => t.id));
    const templatesToAdd = SEED_TEMPLATES.filter(t => !existingTemplateIds.has(t.id));
    if (templatesToAdd.length > 0) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify([...templatesToAdd, ...existingTemplates]));
    }

    const existingEvents: CalendarEvent[] = this.loadCalendarEvents();
    const existingEventIds = new Set(existingEvents.map(e => e.id));
    const eventsToAdd = SEED_CALENDAR_EVENTS.filter(e => !existingEventIds.has(e.id));
    if (eventsToAdd.length > 0) {
      localStorage.setItem(CAL_KEY, JSON.stringify([...existingEvents, ...eventsToAdd]));
    }

    try {
      const raw = localStorage.getItem(SUBMISSIONS_KEY);
      const existingSubs: any[] = raw ? JSON.parse(raw) : [];
      const existingSubIds = new Set(existingSubs.map((s: any) => s.id));
      const subsToAdd = SEED_SUBMISSIONS.filter(s => !existingSubIds.has(s.id));
      if (subsToAdd.length > 0) {
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([...existingSubs, ...subsToAdd]));
      }
    } catch {}

    localStorage.setItem(SEED_KEY, '1');
  }

  loadSiteData(): SiteData {
    try {
      const raw = localStorage.getItem(SF_DATA_KEY);
      if (raw) {
        const d: SiteData = JSON.parse(raw);
        if (!d.theme) d.theme = { primary: '#3d9e52', secondary: '#d4a017', customCss: '' };
        return d;
      }
    } catch {}
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
    } catch {}
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