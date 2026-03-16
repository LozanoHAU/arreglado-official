// ─── CALENDAR ────────────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string;
  title: string;
  desc: string;
  start: string; // 'YYYY-MM-DD'
  end: string;   // 'YYYY-MM-DD'
  color: string; // 'ev-blue' | 'ev-red' | 'ev-green' | 'ev-gold' | 'ev-purple' | 'ev-teal'
  loc: string;
  templateId?: string; // links to EventTemplate → drives the live eventpage
}

export interface CalDay {
  date: Date;
  otherMonth: boolean;
}

// ─── SITE BUILDER ────────────────────────────────────────────────────────────
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'url';
  label: string;
  placeholder: string;
  required: boolean;
  width: 'full' | 'half';
  options?: string[];
}

export interface StatItem  { num: string; label: string; }
export interface FeatureItem { emoji: string; title: string; desc: string; }

export interface SiteSection {
  id: string;
  type: 'hero' | 'about-simple' | 'about-centered' | 'about-stats' | 'features' | 'form' | 'contact';
  data: Record<string, any>;
}

export interface SiteTheme {
  primary: string;
  secondary: string;
  customCss: string;
}

export interface SiteData {
  layout: 'agency' | 'minimal' | 'bold';
  sections: SiteSection[];
  theme: SiteTheme;
}

// ─── EVENT TEMPLATES ─────────────────────────────────────────────────────────
// Saved from Event Builder via "Publish as Template".
// Selected in the Calendar when creating/editing an event.
// The live eventpage renders whichever template's CalendarEvent is active today.
export interface EventTemplate {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  siteData: SiteData;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
export interface RecentEvent {
  name: string;
  date: string;
  status: 'published' | 'draft';
  color: string;
}

// ─── SECTION TYPE META ───────────────────────────────────────────────────────
export interface SectionTypeMeta {
  label: string;
  icon: string;
  cat: string;
  desc: string;
  unique?: boolean;
}
