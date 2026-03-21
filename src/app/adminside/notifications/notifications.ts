import { Component, OnInit, computed, signal, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../shared/event.service';

const SUBMISSIONS_KEY = 'ar_submissions';

const OLD_SEED_IDS = new Set([
  'sub-seed-1','sub-seed-2','sub-seed-3','sub-seed-4',
  'sub-seed-5','sub-seed-6','sub-seed-7','sub-seed-8',
]);

export interface Submission {
  id: string;
  type: 'attendance' | 'hall-rental';
  name: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  eventName: string;
  fields: { label: string; value: string }[];
}

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsComponent implements OnInit {
  private eventSvc = inject(EventService);

  activeTab = signal<'attendance' | 'hall-rental'>('attendance');
  submissions = signal<Submission[]>([]);
  selectedIds = signal<Set<string>>(new Set());
  expandedId = signal<string | null>(null);
  toastMsg = signal('');
  statusFilter = signal<'all' | 'pending' | 'verified' | 'rejected'>('all');
  eventFilter = signal<string>('all');
  toastTimer: ReturnType<typeof setTimeout> | undefined;

  publishedEventNames = signal<string[]>([]);

  showReportModal = signal(false);
  reportStartDate = signal('');
  reportEndDate = signal('');

  // Calendar picker state
  reportCalOpen = signal<'start' | 'end' | null>(null);
  reportCalViewYear = signal(new Date().getFullYear());
  reportCalViewMonth = signal(new Date().getMonth());

  readonly CAL_WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  readonly filterOptions: { value: 'all' | 'pending' | 'verified' | 'rejected'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ];

  calDays = computed(() => {
    const year = this.reportCalViewYear();
    const month = this.reportCalViewMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  });

  calMonthLabel = computed(() =>
    new Date(this.reportCalViewYear(), this.reportCalViewMonth(), 1)
      .toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );

  uniqueAttendanceEvents = computed(() => {
    const fromSubmissions = [
      ...new Set(
        this.submissions()
          .filter(s => s.type === 'attendance')
          .map(s => s.eventName)
          .filter(Boolean)
      ),
    ];
    const published = this.publishedEventNames();
    return [...new Set([...published, ...fromSubmissions])];
  });

  attendanceList = computed(() =>
    this.submissions()
      .filter(s => s.type === 'attendance')
      .filter(s => this.statusFilter() === 'all' || s.status === this.statusFilter())
      .filter(s => this.eventFilter() === 'all' || s.eventName === this.eventFilter())
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  );

  hallRentalList = computed(() =>
    this.submissions()
      .filter(s => s.type === 'hall-rental')
      .filter(s => this.statusFilter() === 'all' || s.status === this.statusFilter())
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  );

  attendancePending = computed(
    () => this.submissions().filter(s => s.type === 'attendance' && s.status === 'pending').length
  );

  hallRentalPending = computed(
    () => this.submissions().filter(s => s.type === 'hall-rental' && s.status === 'pending').length
  );

  hasPendingAttendance = computed(() => this.attendanceList().some(s => s.status === 'pending'));

  allSelected = computed(() => {
    const pendingList = this.attendanceList().filter(s => s.status === 'pending');
    return pendingList.length > 0 && pendingList.every(s => this.selectedIds().has(s.id));
  });

  selectedCount = computed(() => this.selectedIds().size);

  ngOnInit(): void {
    this.loadSubmissions();
    this.loadPublishedEvents();
  }

  private loadPublishedEvents(): void {
    const calEvents = this.eventSvc.loadCalendarEvents();
    const names = calEvents
      .filter(ev => !!ev.templateId)
      .map(ev => ev.title)
      .filter(Boolean);
    this.publishedEventNames.set([...new Set(names)]);
  }

  private loadSubmissions(): void {
    try {
      const raw = localStorage.getItem(SUBMISSIONS_KEY);
      if (raw) {
        const parsed: Submission[] = JSON.parse(raw);
        const cleaned = parsed.filter(s => !OLD_SEED_IDS.has(s.id));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(cleaned));
        }
        this.submissions.set(cleaned);
      } else {
        this.submissions.set([]);
      }
    } catch {
      this.submissions.set([]);
    }
  }

  private persist(): void {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(this.submissions()));
  }

  switchTab(tab: 'attendance' | 'hall-rental'): void {
    this.activeTab.set(tab);
    this.selectedIds.set(new Set());
    this.statusFilter.set('all');
    this.eventFilter.set('all');
    this.expandedId.set(null);
  }

  setFilter(f: 'all' | 'pending' | 'verified' | 'rejected'): void {
    this.statusFilter.set(f);
    this.selectedIds.set(new Set());
  }

  setEventFilter(name: string): void {
    this.eventFilter.set(name);
    this.selectedIds.set(new Set());
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  toggleSelect(id: string): void {
    this.selectedIds.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  toggleSelectAll(): void {
    const pending = this.attendanceList().filter(s => s.status === 'pending');
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(pending.map(s => s.id)));
    }
  }

  updateStatus(id: string, status: Submission['status']): void {
    this.submissions.update(list => list.map(s => s.id === id ? { ...s, status } : s));
    this.persist();
    this.selectedIds.update(s => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    this.showToast(status === 'verified' ? '✓ Submission verified' : '✕ Submission rejected');
  }

  bulkVerify(): void {
    const ids = this.selectedIds();
    this.submissions.update(list =>
      list.map(s => ids.has(s.id) ? { ...s, status: 'verified' as const } : s)
    );
    this.persist();
    const count = ids.size;
    this.selectedIds.set(new Set());
    this.showToast(`✓ ${count} submission${count > 1 ? 's' : ''} verified`);
  }

  bulkReject(): void {
    const ids = this.selectedIds();
    this.submissions.update(list =>
      list.map(s => ids.has(s.id) ? { ...s, status: 'rejected' as const } : s)
    );
    this.persist();
    const count = ids.size;
    this.selectedIds.set(new Set());
    this.showToast(`${count} submission${count > 1 ? 's' : ''} rejected`);
  }

  bulkDelete(): void {
    const ids = this.selectedIds();
    if (!confirm(`Delete ${ids.size} selected submission${ids.size > 1 ? 's' : ''}? This cannot be undone.`)) return;
    this.submissions.update(list => list.filter(s => !ids.has(s.id)));
    this.persist();
    const count = ids.size;
    this.selectedIds.set(new Set());
    this.showToast(`🗑 ${count} submission${count > 1 ? 's' : ''} deleted`);
  }

  deleteSubmission(id: string): void {
    if (!confirm('Delete this submission? This cannot be undone.')) return;
    this.submissions.update(list => list.filter(s => s.id !== id));
    this.persist();
    this.selectedIds.update(s => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    if (this.expandedId() === id) this.expandedId.set(null);
    this.showToast('Submission deleted');
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  fieldValue(fields: { label: string; value: string }[], label: string): string {
    return fields.find(f => f.label === label)?.value ?? '';
  }

  relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  openReportModal(): void {
    this.reportStartDate.set('');
    this.reportEndDate.set('');
    this.reportCalOpen.set(null);
    this.showReportModal.set(true);
  }

  closeReportModal(): void {
    this.showReportModal.set(false);
    this.reportCalOpen.set(null);
  }

  openCal(which: 'start' | 'end'): void {
    if (this.reportCalOpen() === which) {
      this.reportCalOpen.set(null);
      return;
    }
    this.reportCalOpen.set(which);
    const val = which === 'start' ? this.reportStartDate() : this.reportEndDate();
    const ref = val ? new Date(val + 'T00:00:00') : new Date();
    this.reportCalViewYear.set(ref.getFullYear());
    this.reportCalViewMonth.set(ref.getMonth());
  }

  prevCalMonth(): void {
    if (this.reportCalViewMonth() === 0) {
      this.reportCalViewMonth.set(11);
      this.reportCalViewYear.update(y => y - 1);
    } else {
      this.reportCalViewMonth.update(m => m - 1);
    }
  }

  nextCalMonth(): void {
    if (this.reportCalViewMonth() === 11) {
      this.reportCalViewMonth.set(0);
      this.reportCalViewYear.update(y => y + 1);
    } else {
      this.reportCalViewMonth.update(m => m + 1);
    }
  }

  selectCalDate(day: number | null): void {
    if (!day) return;
    const y = this.reportCalViewYear();
    const m = this.reportCalViewMonth();
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (this.reportCalOpen() === 'start') {
      this.reportStartDate.set(dateStr);
    } else {
      this.reportEndDate.set(dateStr);
    }
    this.reportCalOpen.set(null);
  }

  calDayState(day: number | null): 'empty' | 'today' | 'selected' | 'in-range' | 'normal' {
    if (!day) return 'empty';
    const y = this.reportCalViewYear();
    const m = this.reportCalViewMonth();
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateStr === this.reportStartDate() || dateStr === this.reportEndDate()) return 'selected';
    if (this.reportStartDate() && this.reportEndDate() &&
        dateStr > this.reportStartDate() && dateStr < this.reportEndDate()) return 'in-range';
    const today = new Date();
    if (day === today.getDate() && m === today.getMonth() && y === today.getFullYear()) return 'today';
    return 'normal';
  }

  formatDisplayDate(isoDate: string): string {
    if (!isoDate) return 'Select date';
    const d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  downloadReport(): void {
    const start = this.reportStartDate();
    const end = this.reportEndDate();
    if (!start || !end) {
      this.showToast('Please select both start and end dates.');
      return;
    }
    if (start > end) {
      this.showToast('Start date must be before end date.');
      return;
    }

    const startDate = new Date(start + 'T00:00:00');
    const endDate   = new Date(end   + 'T23:59:59');
    const tab       = this.activeTab();

    const filtered = this.submissions().filter(s => {
      if (s.type !== tab) return false;
      const d = new Date(s.submittedAt);
      return d >= startDate && d <= endDate;
    });

    if (filtered.length === 0) {
      this.showToast('No submissions found in that date range.');
      return;
    }

    const tabLabel = tab === 'attendance' ? 'Event Attendance Verifications' : 'Hall Rental Requests';
    const lines: string[] = [];

    lines.push('='.repeat(60));
    lines.push('ARREGLADO — BARANGAY PANDACAQUI');
    lines.push(tabLabel.toUpperCase());
    lines.push(`Report Period : ${start} to ${end}`);
    lines.push(`Generated     : ${new Date().toLocaleString('en-PH')}`);
    lines.push(`Total Records : ${filtered.length}`);
    lines.push('='.repeat(60));
    lines.push('');

    const count = { pending: 0, verified: 0, rejected: 0 };
    filtered.forEach(s => count[s.status]++);
    lines.push('SUMMARY');
    lines.push('-'.repeat(30));
    lines.push(`Pending  : ${count.pending}`);
    lines.push(`Verified : ${count.verified}`);
    lines.push(`Rejected : ${count.rejected}`);
    lines.push('');

    filtered.forEach((s, i) => {
      lines.push('─'.repeat(60));
      lines.push(`#${i + 1}  ${s.name}`);
      lines.push(`Status    : ${s.status.toUpperCase()}`);
      if (tab === 'attendance') lines.push(`Event     : ${s.eventName}`);
      lines.push(`Submitted : ${new Date(s.submittedAt).toLocaleString('en-PH')}`);
      if (s.fields.length > 0) {
        lines.push('Fields:');
        s.fields.forEach(f => lines.push(`  ${f.label}: ${f.value}`));
      }
      lines.push('');
    });

    lines.push('='.repeat(60));
    lines.push('END OF REPORT');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${tab === 'attendance' ? 'attendance' : 'hall-rental'}_report_${start}_to_${end}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    this.closeReportModal();
    this.showToast(`📄 Report downloaded (${filtered.length} record${filtered.length > 1 ? 's' : ''})`);
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMsg.set(''), 2600);
  }
}
