import { Component, OnInit, inject, signal, computed, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, defaultData } from '../../shared/event.service';
import { SiteData, SiteSection, SectionTypeMeta } from '../../shared/event.model';

export const TYPES: Record<string, SectionTypeMeta> = {
  'hero':           { label: 'Hero Banner',       icon: '⚡', cat: 'Core',  desc: 'Full-screen opening section with event name, date, and registration button.', unique: true },
  'about-simple':   { label: 'About — Classic',   icon: '👤', cat: 'About', desc: 'Two-column layout with an image on one side and event description on the other.' },
  'about-centered': { label: 'About — Centered',  icon: '◎',  cat: 'About', desc: 'Centered headline and body text with an optional full-width image below.' },
  'about-stats':    { label: 'About — Stats',     icon: '📊', cat: 'About', desc: 'Highlight key event metrics — attendees, prizes, schedules, partner orgs.' },
  'features':       { label: 'Event Highlights',  icon: '✦',  cat: 'Core',  desc: 'A grid of event cards — great for vaccination schedules, activities, or prizes.' },
  'form':           { label: 'Registration Form', icon: '📋', cat: 'Core',  desc: 'Build a registration or RSVP form — you decide every field.', },
  'contact':        { label: 'Contact & Footer',  icon: '✉',  cat: 'Core',  desc: 'Contact details, social links, and page footer.', unique: true },
};
export const CAT_ORDER = ['Core', 'About'];

@Component({
  selector: 'app-eventbuilder',
  imports: [RouterLink, FormsModule],
  templateUrl: './eventbuilder.html',
  styleUrl: './eventbuilder.css',
  encapsulation: ViewEncapsulation.None,
})
export class EventbuilderComponent implements OnInit {
  private svc    = inject(EventService);
  private router = inject(Router);

  readonly TYPES     = TYPES;
  readonly CAT_ORDER = CAT_ORDER;
  readonly LAYOUTS   = ['agency', 'minimal', 'bold'] as const;
  readonly FIELD_TYPES = ['text','email','phone','number','textarea','select','url'];
  readonly PRESETS = [
    { p:'#3d9e52', s:'#d4a017', label:'Barangay Green' },
    { p:'#c41e3a', s:'#3d9e52', label:'Red & Green' },
    { p:'#d4a017', s:'#3d9e52', label:'Gold' },
    { p:'#1565c0', s:'#d4a017', label:'Official Blue' },
    { p:'#7c6aff', s:'#ff6a8a', label:'Violet' },
    { p:'#00c2a8', s:'#ff6a3d', label:'Teal' },
  ];

  SD = signal<SiteData>({
    layout: 'agency',
    sections: [],
    theme: { primary: '#3d9e52', secondary: '#d4a017', customCss: '' },
  });

  activeTab    = signal<'content' | 'theme'>('content');
  activeSec    = signal<string | null>(null);
  showModal    = signal(false);
  isPublished  = signal(false);
  toastMsg     = signal('');
  toastWarn    = signal(false);
  toastTimer: any;
  saveTimer:  any;

  // Drag state
  dragSrcId   = signal<string | null>(null);
  dragOverId  = signal<string | null>(null);

  // Open form-field accordion
  openFfIds   = signal<Set<string>>(new Set());

  sectionCount = computed(() => this.SD().sections.length);

  sectionTypes = computed(() => {
    const existing = this.SD().sections.map(s => s.type);
    return CAT_ORDER.map(cat => ({
      cat,
      items: Object.entries(TYPES)
        .filter(([, v]) => v.cat === cat)
        .map(([type, meta]) => ({ type, meta, disabled: !!(meta.unique && existing.includes(type as any)) })),
    }));
  });

  ngOnInit(): void {
    const data = this.svc.loadSiteData();
    this.SD.set(data);
    this.isPublished.set(this.svc.isPublished(data));
    if (data.sections.length > 0) this.activeSec.set(data.sections[0].id);
  }

  // ── Tab / Layout / Section helpers ─────────────────────────────────────────
  switchTab(tab: 'content' | 'theme'): void { this.activeTab.set(tab); }
  setLayout(id: string): void { this.SD.update(d => ({ ...d, layout: id as any })); this.autoSave(); }

  getSec(id: string): SiteSection | undefined { return this.SD().sections.find(s => s.id === id); }

  selectSection(id: string): void {
    this.activeSec.set(id);
    if (this.activeTab() !== 'content') this.activeTab.set('content');
  }

  addSection(type: string): void {
    this.showModal.set(false);
    const id = 'sec-' + Date.now();
    const sec: SiteSection = { id, type: type as any, data: defaultData(type) };
    this.SD.update(d => ({ ...d, sections: [...d.sections, sec] }));
    this.activeSec.set(id);
    this.autoSave();
    this.toast('Section added');
  }

  removeSection(id: string): void {
    if (!confirm('Remove this section? This cannot be undone.')) return;
    this.SD.update(d => ({ ...d, sections: d.sections.filter(s => s.id !== id) }));
    if (this.activeSec() === id) {
      const secs = this.SD().sections;
      this.activeSec.set(secs.length > 0 ? secs[0].id : null);
    }
    this.autoSave();
    this.toast('Section removed');
  }

  // ── Field setters ──────────────────────────────────────────────────────────
  setField(secId: string, key: string, val: any): void {
    this.SD.update(d => ({
      ...d,
      sections: d.sections.map(s => s.id === secId ? { ...s, data: { ...s.data, [key]: val } } : s),
    }));
    this.autoSave();
  }

  setBool(secId: string, key: string, val: boolean): void { this.setField(secId, key, val); }

  setImgPos(secId: string, pos: string): void { this.setField(secId, 'imgPos', pos); }

  setThemeField(key: keyof SiteData['theme'], val: string): void {
    this.SD.update(d => ({ ...d, theme: { ...d.theme, [key]: val } }));
    this.autoSave();
  }

  applyPreset(p: string, s: string): void {
    this.SD.update(d => ({ ...d, theme: { ...d.theme, primary: p, secondary: s } }));
    this.autoSave();
  }

  // ── Stats helpers ──────────────────────────────────────────────────────────
  setStatField(secId: string, i: number, key: string, val: string): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    const stats = [...sec.data['stats']];
    stats[i] = { ...stats[i], [key]: val };
    this.setField(secId, 'stats', stats);
  }
  addStat(secId: string): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    this.setField(secId, 'stats', [...sec.data['stats'], { num: '0', label: 'Label' }]);
  }
  removeStat(secId: string, i: number): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    const stats = sec.data['stats'].filter((_: any, idx: number) => idx !== i);
    this.setField(secId, 'stats', stats);
  }

  // ── Features helpers ───────────────────────────────────────────────────────
  setFeatField(secId: string, i: number, key: string, val: string): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    const items = [...sec.data['items']];
    items[i] = { ...items[i], [key]: val };
    this.setField(secId, 'items', items);
  }
  addFeat(secId: string): void {
    const sec = this.getSec(secId);
    if (!sec || sec.data['items'].length >= 6) return;
    this.setField(secId, 'items', [...sec.data['items'], { emoji: '📌', title: 'New Activity', desc: 'Describe this activity.' }]);
  }
  removeFeat(secId: string, i: number): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    this.setField(secId, 'items', sec.data['items'].filter((_: any, idx: number) => idx !== i));
  }

  splitOptions(val: string): string[] {
    return val.split(',').map(x => x.trim());
  }

  // ── Form field helpers ─────────────────────────────────────────────────────
  setFFField(secId: string, fieldId: string, key: string, val: any): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    const fields = sec.data['fields'].map((f: any) => f.id === fieldId ? { ...f, [key]: val } : f);
    this.setField(secId, 'fields', fields);
  }
  addFormField(secId: string): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    const id = 'f' + Date.now();
    const newField = { id, type: 'text', label: 'New Field', placeholder: '', required: false, width: 'full' };
    this.setField(secId, 'fields', [...sec.data['fields'], newField]);
    this.openFfIds.update(s => new Set([...s, id]));
  }
  removeFormField(secId: string, fieldId: string): void {
    const sec = this.getSec(secId);
    if (!sec) return;
    this.setField(secId, 'fields', sec.data['fields'].filter((f: any) => f.id !== fieldId));
  }
  toggleFF(id: string): void {
    this.openFfIds.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  isFfOpen(id: string): boolean { return this.openFfIds().has(id); }

  // ── Form field drag ────────────────────────────────────────────────────────
  ffDragSrc: { secId: string; i: number } | null = null;
  onFFDragStart(secId: string, i: number): void { this.ffDragSrc = { secId, i }; }
  onFFDrop(secId: string, i: number): void {
    if (!this.ffDragSrc || this.ffDragSrc.secId !== secId || this.ffDragSrc.i === i) { this.ffDragSrc = null; return; }
    const sec = this.getSec(secId);
    if (!sec) return;
    const fields = [...sec.data['fields']];
    const [item] = fields.splice(this.ffDragSrc.i, 1);
    fields.splice(i, 0, item);
    this.setField(secId, 'fields', fields);
    this.ffDragSrc = null;
  }

  // ── Image handling ─────────────────────────────────────────────────────────
  handleImg(secId: string, key: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setField(secId, key, (e.target as FileReader).result as string);
    };
    reader.readAsDataURL(input.files[0]);
  }

  // ── Section drag & drop ────────────────────────────────────────────────────
  onDragStart(id: string): void { this.dragSrcId.set(id); }
  onDragOver(id: string, e: DragEvent): void { e.preventDefault(); this.dragOverId.set(id); }
  onDragLeave(): void { this.dragOverId.set(null); }
  onDrop(targetId: string, e: DragEvent): void {
    e.preventDefault();
    const srcId = this.dragSrcId();
    if (!srcId || srcId === targetId) { this.dragSrcId.set(null); this.dragOverId.set(null); return; }
    this.SD.update(d => {
      const sections = [...d.sections];
      const fi = sections.findIndex(s => s.id === srcId);
      const ti = sections.findIndex(s => s.id === targetId);
      const [item] = sections.splice(fi, 1);
      sections.splice(ti, 0, item);
      return { ...d, sections };
    });
    this.dragSrcId.set(null);
    this.dragOverId.set(null);
    this.autoSave();
  }
  onDragEnd(): void { this.dragSrcId.set(null); this.dragOverId.set(null); }

  // ── Save / Publish ─────────────────────────────────────────────────────────
  autoSave(): void {
    this.isPublished.set(false);
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => { this.svc.saveSiteData(this.SD()); }, 400);
  }

  publishSite(): void {
    this.svc.publishSiteData(this.SD());
    this.isPublished.set(true);
    this.toast('✦ Event page published successfully!');
  }

  openPreview(): void {
    this.svc.saveSiteData(this.SD());
    window.open('/client/preview', '_blank');
  }

  // ── Toast ──────────────────────────────────────────────────────────────────
  toast(msg: string, warn = false): void {
    this.toastMsg.set(msg);
    this.toastWarn.set(warn);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMsg.set(''), 2400);
  }

  // Template helpers
  getActiveSec(): SiteSection | undefined {
    const id = this.activeSec();
    return id ? this.getSec(id) : undefined;
  }
  secLabel(type: string): string { return TYPES[type]?.label ?? type; }
  secIcon(type: string):  string { return TYPES[type]?.icon ?? '■'; }
  secDesc(type: string):  string { return TYPES[type]?.desc ?? ''; }
  trackById(_: number, s: SiteSection): string { return s.id; }
}