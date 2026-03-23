export interface CalendarEvent {
  id: string;
  title: string;
  desc: string;
  start: string;
  end: string;
  color: string;
  loc: string;
  templateId?: string;
}

export interface CalDay {
  date: Date;
  otherMonth: boolean;
}

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

export interface EventTemplate {
  id: string;
  name: string;
  createdAt: string;
  siteData: SiteData;
}

export interface RecentEvent {
  name: string;
  date: string;
  status: 'published' | 'draft';
  color: string;
}

export interface SectionTypeMeta {
  label: string;
  icon: string;
  cat: string;
  desc: string;
  unique?: boolean;
}
