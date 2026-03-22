import { Component, OnInit, inject, signal, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../shared/event.service';
import { CalendarEvent, CalDay, EventTemplate } from '../../shared/event.model';

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export interface DayCell {
  date: Date;
  otherMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: { ev: CalendarEvent; cls: string }[];
  extra: number;
}

@Component({
  selector: 'app-calendar',
  imports: [RouterLink, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  private svc = inject(EventService);

  readonly MONTHS = MONTHS;
  readonly DAYS   = DAYS;

  today   = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  events  = signal<CalendarEvent[]>([]);
  templates = signal<EventTemplate[]>([]);

  viewDate  = signal(new Date(this.today.getFullYear(), this.today.getMonth(), 1));
  miniDate  = signal(new Date(this.today.getFullYear(), this.today.getMonth(), 1));

  calLabel  = computed(() => `${MONTHS[this.viewDate().getMonth()]} ${this.viewDate().getFullYear()}`);
  miniLabel = computed(() => `${MONTHS[this.miniDate().getMonth()]} ${this.miniDate().getFullYear()}`);

  grid = computed<DayCell[]>(() => {
    const vd = this.viewDate();
    const evs = this.events();
    const year = vd.getFullYear(), month = vd.getMonth();
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const cells: DayCell[] = [];

    for (let i = 0; i < first.getDay(); i++) {
      const d = new Date(year, month, -first.getDay() + i + 1);
      cells.push(this.makeCell(d, true, evs));
    }
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(this.makeCell(new Date(year, month, d), false, evs));
    }
    while (cells.length % 7 !== 0) {
      const d = new Date(year, month + 1, cells.length - last.getDate() - first.getDay() + 1);
      cells.push(this.makeCell(d, true, evs));
    }
    return cells;
  });

  miniDays = computed<{ day: number; otherMonth: boolean; isToday: boolean; hasEvent: boolean }[]>(() => {
    const md = this.miniDate();
    const year = md.getFullYear(), month = md.getMonth();
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const evs   = this.events();
    const days: { day: number; otherMonth: boolean; isToday: boolean; hasEvent: boolean }[] = [];
    for (let i = 0; i < first.getDay(); i++) days.push({ day: 0, otherMonth: true, isToday: false, hasEvent: false });
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(year, month, d);
      const has = evs.some(ev => {
        const s = this.parseDate(ev.start), e = this.parseDate(ev.end);
        return dt >= s && dt <= e;
      });
      days.push({ day: d, otherMonth: false, isToday: dt.getTime() === this.today.getTime(), hasEvent: has });
    }
    return days;
  });

  upcoming = computed(() => {
    const now = this.today;
    return this.events()
      .filter(ev => this.parseDate(ev.end) >= now)
      .sort((a, b) => this.parseDate(a.start).getTime() - this.parseDate(b.start).getTime())
      .slice(0, 6);
  });

  activePanel = signal<CalendarEvent | null>(null);
  panelDateStr = computed(() => {
    const ev = this.activePanel();
    if (!ev) return '';
    const s = this.parseDate(ev.start), e = this.parseDate(ev.end);
    if (s.getTime() === e.getTime())
      return s.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return s.toLocaleDateString('en-PH', { month: 'long', day: 'numeric' }) + ' – ' + e.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
  });
  panelTemplateName = computed(() => {
    const ev = this.activePanel();
    if (!ev?.templateId) return null;
    return this.templates().find(t => t.id === ev.templateId)?.name ?? null;
  });

  showModal     = signal(false);
  editingId     = signal<string | null>(null);
  modalTitle    = signal('New Event');
  evTitle       = signal('');
  evDesc        = signal('');
  evStart       = signal('');
  evEnd         = signal('');
  evLoc         = signal('');
  evColor       = signal('ev-blue');
  evTemplateId  = signal('');
  toastMsg      = signal('');
  toastTimer: any;

  readonly COLOR_LABELS: Record<string, string> = {
    'ev-blue': 'Multi-day Event', 'ev-red': 'Single Day', 'ev-green': 'Health',
    'ev-gold': 'Community', 'ev-purple': 'Meeting', 'ev-teal': 'Training',
  };
  readonly COLORS = ['ev-blue','ev-red','ev-green','ev-gold','ev-purple','ev-teal'];
  readonly COLOR_HEX: Record<string, string> = {
    'ev-blue': '#3b87d4', 'ev-red': '#D12A2F', 'ev-green': '#2C7A3B',
    'ev-gold': '#E5A822', 'ev-purple': '#7c4dff', 'ev-teal': '#00897b',
  };

  ngOnInit(): void {
    this.events.set(this.svc.loadCalendarEvents());
    this.templates.set(this.svc.loadTemplates());
  }

  private makeCell(date: Date, otherMonth: boolean, evs: CalendarEvent[]): DayCell {
    const evList: { ev: CalendarEvent; cls: string }[] = [];
    for (const ev of evs) {
      const s = this.parseDate(ev.start), e = this.parseDate(ev.end);
      if (date >= s && date <= e) {
        let cls = ev.color;
        if (s.getTime() !== e.getTime()) {
          if (date.getTime() === s.getTime()) cls += ' multi-start';
          else if (date.getTime() === e.getTime()) cls += ' multi-end';
          else cls += ' multi-mid';
        }
        evList.push({ ev, cls });
      }
    }
    const shown = evList.slice(0, 3);
    return {
      date, otherMonth,
      isToday: date.getTime() === this.today.getTime(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      events: shown,
      extra: Math.max(0, evList.length - 3),
    };
  }

  parseDate(s: string): Date {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  toStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  prevMonth(): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() - 1, 1));
    this.miniDate.set(new Date(this.viewDate()));
  }
  nextMonth(): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() + 1, 1));
    this.miniDate.set(new Date(this.viewDate()));
  }
  goToday(): void {
    this.viewDate.set(new Date(this.today.getFullYear(), this.today.getMonth(), 1));
    this.miniDate.set(new Date(this.viewDate()));
  }
  miniPrev(): void { const m = this.miniDate(); this.miniDate.set(new Date(m.getFullYear(), m.getMonth()-1, 1)); }
  miniNext(): void { const m = this.miniDate(); this.miniDate.set(new Date(m.getFullYear(), m.getMonth()+1, 1)); }
  miniJump(day: number): void {
    const m = this.miniDate();
    this.viewDate.set(new Date(m.getFullYear(), m.getMonth(), 1));
    this.miniDate.set(new Date(this.viewDate()));
  }

  showPanel(ev: CalendarEvent): void { this.activePanel.set(ev); }
  closePanel(): void { this.activePanel.set(null); }

  editEvent(): void {
    const ev = this.activePanel();
    if (!ev) return;
    this.closePanel();
    this.openAddModal(ev.start, ev);
  }

  deleteEvent(id: string): void {
    this.events.update(evs => evs.filter(e => e.id !== id));
    this.svc.saveCalendarEvents(this.events());
    this.closePanel();
    this.toast('Event deleted.');
  }

  openAddModal(dateStr: string | null, evData?: CalendarEvent): void {
    this.templates.set(this.svc.loadTemplates());
    this.editingId.set(evData?.id ?? null);
    this.modalTitle.set(evData ? 'Edit Event' : 'New Event');
    this.evTitle.set(evData?.title ?? '');
    this.evDesc.set(evData?.desc ?? '');
    this.evStart.set(evData?.start ?? (dateStr || this.toStr(this.today)));
    this.evEnd.set(evData?.end ?? (dateStr || this.toStr(this.today)));
    this.evLoc.set(evData?.loc ?? '');
    this.evColor.set(evData?.color ?? 'ev-blue');
    this.evTemplateId.set(evData?.templateId ?? '');
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  /** When a template is selected, auto-fill the title from its name if title is empty. */
  onTemplateSelect(id: string): void {
    this.evTemplateId.set(id);
    if (id && !this.evTitle().trim()) {
      const t = this.templates().find(t => t.id === id);
      if (t) this.evTitle.set(t.name);
    }
  }

  saveEvent(): void {
    const title = this.evTitle().trim();
    const start = this.evStart();
    const end   = this.evEnd();
    if (!title) { this.toast('Please enter an event title.'); return; }
    if (!start) { this.toast('Please set a start date.'); return; }
    const finalEnd   = end && end >= start ? end : start;
    const templateId = this.evTemplateId() || undefined;

    const id = this.editingId();
    if (id) {
      this.events.update(evs => evs.map(e => e.id === id
        ? { ...e, title, desc: this.evDesc().trim(), start, end: finalEnd, color: this.evColor(), loc: this.evLoc().trim(), templateId }
        : e));
      this.toast(templateId ? '✦ Event updated — live page will activate on schedule!' : 'Event updated!');
    } else {
      const newEv: CalendarEvent = {
        id: 'e' + Date.now(), title, desc: this.evDesc().trim(),
        start, end: finalEnd, color: this.evColor(), loc: this.evLoc().trim(),
        templateId,
      };
      this.events.update(evs => [...evs, newEv]);
      this.toast(templateId ? '✦ Event scheduled — live page activates on start date!' : '✦ Event added!');
    }
    this.svc.saveCalendarEvents(this.events());
    this.closeModal();
  }

  upcomingMonthStr(ev: CalendarEvent): string {
    return MONTHS[this.parseDate(ev.start).getMonth()].substring(0, 3);
  }
  upcomingDayNum(ev: CalendarEvent): number {
    return this.parseDate(ev.start).getDate();
  }

  templateName(ev: CalendarEvent): string | null {
    if (!ev.templateId) return null;
    return this.templates().find(t => t.id === ev.templateId)?.name ?? null;
  }

  toast(msg: string): void {
    this.toastMsg.set(msg);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMsg.set(''), 2800);
  }
}
