import { Component, OnInit, computed, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

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
  imports: [RouterLink, DatePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsComponent implements OnInit {
  activeTab = signal<'attendance' | 'hall-rental'>('attendance');
  submissions = signal<Submission[]>([]);
  selectedIds = signal<Set<string>>(new Set());
  expandedId = signal<string | null>(null);
  toastMsg = signal('');
  statusFilter = signal<'all' | 'pending' | 'verified' | 'rejected'>('all');
  eventFilter = signal<string>('all');
  toastTimer: ReturnType<typeof setTimeout> | undefined;

  readonly filterOptions: { value: 'all' | 'pending' | 'verified' | 'rejected'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ];

  uniqueAttendanceEvents = computed(() =>
    [...new Set(
      this.submissions()
        .filter(s => s.type === 'attendance')
        .map(s => s.eventName)
        .filter(Boolean)
    )]
  );

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

  deleteSubmission(id: string): void {
    if (!confirm('Delete this submission? This cannot be undone.')) return;
    this.submissions.update(list => list.filter(s => s.id !== id));
    this.persist();
    this.selectedIds.update(s => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
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

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMsg.set(''), 2600);
  }
}
