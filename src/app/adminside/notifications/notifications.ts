import { Component, OnInit, computed, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

const SUBMISSIONS_KEY = 'ar_submissions';

export interface Submission {
  id: string;
  type: 'attendance' | 'hall-rental';
  name: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  eventName: string;
  fields: { label: string; value: string }[];
}

const SEED_DATA: Submission[] = [
  {
    id: 'sub-seed-1',
    type: 'attendance',
    name: 'Maria Santos',
    submittedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: 'pending',
    eventName: 'Free Vaccination Drive',
    fields: [
      { label: 'Full Name', value: 'Maria Santos' },
      { label: 'Purok / Street', value: 'Purok 3' },
      { label: 'Mobile Number', value: '09171234567' },
    ],
  },
  {
    id: 'sub-seed-2',
    type: 'attendance',
    name: 'Juan dela Cruz',
    submittedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    status: 'pending',
    eventName: 'Free Vaccination Drive',
    fields: [
      { label: 'Full Name', value: 'Juan dela Cruz' },
      { label: 'Purok / Street', value: 'Purok 1' },
      { label: 'Mobile Number', value: '09279876543' },
    ],
  },
  {
    id: 'sub-seed-3',
    type: 'attendance',
    name: 'Ana Reyes',
    submittedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    status: 'verified',
    eventName: 'Community Forum — Q1 2026',
    fields: [
      { label: 'Full Name', value: 'Ana Reyes' },
      { label: 'Purok / Street', value: 'Purok 7' },
    ],
  },
  {
    id: 'sub-seed-4',
    type: 'attendance',
    name: 'Pedro Mendoza',
    submittedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    status: 'pending',
    eventName: 'Free Vaccination Drive',
    fields: [
      { label: 'Full Name', value: 'Pedro Mendoza' },
      { label: 'Purok / Street', value: 'Purok 5' },
      { label: 'Mobile Number', value: '09451234500' },
    ],
  },
  {
    id: 'sub-seed-5',
    type: 'attendance',
    name: 'Rosa Garcia',
    submittedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    status: 'rejected',
    eventName: 'Community Forum — Q1 2026',
    fields: [
      { label: 'Full Name', value: 'Rosa Garcia' },
      { label: 'Purok / Street', value: 'Purok 2' },
    ],
  },
  {
    id: 'sub-seed-6',
    type: 'hall-rental',
    name: 'Gabriela Villanueva',
    submittedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: 'pending',
    eventName: 'Hall Rental Inquiry',
    fields: [
      { label: 'Full Name', value: 'Gabriela Villanueva' },
      { label: 'Contact Number', value: '09221234567' },
      { label: 'Email Address', value: 'gabriela@email.com' },
      { label: 'Requested Date', value: '2026-12-25' },
      { label: 'Purpose / Event Type', value: 'Birthday Party' },
      { label: 'Number of Guests', value: '80' },
      { label: 'Additional Notes', value: 'Need sound system setup.' },
    ],
  },
  {
    id: 'sub-seed-7',
    type: 'hall-rental',
    name: 'Marco Castillo',
    submittedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'verified',
    eventName: 'Hall Rental Inquiry',
    fields: [
      { label: 'Full Name', value: 'Marco Castillo' },
      { label: 'Contact Number', value: '09981234567' },
      { label: 'Requested Date', value: '2026-01-05' },
      { label: 'Purpose / Event Type', value: 'Business Meeting' },
      { label: 'Number of Guests', value: '30' },
    ],
  },
  {
    id: 'sub-seed-8',
    type: 'hall-rental',
    name: 'Lorna Bautista',
    submittedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    status: 'pending',
    eventName: 'Hall Rental Inquiry',
    fields: [
      { label: 'Full Name', value: 'Lorna Bautista' },
      { label: 'Contact Number', value: '09151234567' },
      { label: 'Email Address', value: 'lorna.b@email.com' },
      { label: 'Requested Date', value: '2026-02-14' },
      { label: 'Purpose / Event Type', value: 'Wedding Reception' },
      { label: 'Number of Guests', value: '120' },
      { label: 'Additional Notes', value: 'Need whole day booking.' },
    ],
  },
];

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
  toastTimer: ReturnType<typeof setTimeout> | undefined;

  readonly filterOptions: { value: 'all' | 'pending' | 'verified' | 'rejected'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ];

  attendanceList = computed(() =>
    this.submissions()
      .filter((s) => s.type === 'attendance')
      .filter((s) => this.statusFilter() === 'all' || s.status === this.statusFilter())
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  );

  hallRentalList = computed(() =>
    this.submissions()
      .filter((s) => s.type === 'hall-rental')
      .filter((s) => this.statusFilter() === 'all' || s.status === this.statusFilter())
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  );

  attendancePending = computed(
    () => this.submissions().filter((s) => s.type === 'attendance' && s.status === 'pending').length
  );

  hallRentalPending = computed(
    () => this.submissions().filter((s) => s.type === 'hall-rental' && s.status === 'pending').length
  );

  hasPendingAttendance = computed(() => this.attendanceList().some((s) => s.status === 'pending'));

  allSelected = computed(() => {
    const pendingList = this.attendanceList().filter((s) => s.status === 'pending');
    return pendingList.length > 0 && pendingList.every((s) => this.selectedIds().has(s.id));
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
        const ids = new Set(parsed.map((s) => s.id));
        const missing = SEED_DATA.filter((s) => !ids.has(s.id));
        this.submissions.set([...missing, ...parsed]);
      } else {
        this.submissions.set([...SEED_DATA]);
        this.persist();
      }
    } catch {
      this.submissions.set([...SEED_DATA]);
    }
  }

  private persist(): void {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(this.submissions()));
  }

  switchTab(tab: 'attendance' | 'hall-rental'): void {
    this.activeTab.set(tab);
    this.selectedIds.set(new Set());
    this.statusFilter.set('all');
    this.expandedId.set(null);
  }

  setFilter(f: 'all' | 'pending' | 'verified' | 'rejected'): void {
    this.statusFilter.set(f);
    this.selectedIds.set(new Set());
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  toggleSelect(id: string): void {
    this.selectedIds.update((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  toggleSelectAll(): void {
    const pending = this.attendanceList().filter((s) => s.status === 'pending');
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(pending.map((s) => s.id)));
    }
  }

  updateStatus(id: string, status: Submission['status']): void {
    this.submissions.update((list) =>
      list.map((s) => (s.id === id ? { ...s, status } : s))
    );
    this.persist();
    this.selectedIds.update((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    this.showToast(status === 'verified' ? '✓ Submission verified' : '✕ Submission rejected');
  }

  bulkVerify(): void {
    const ids = this.selectedIds();
    this.submissions.update((list) =>
      list.map((s) => (ids.has(s.id) ? { ...s, status: 'verified' as const } : s))
    );
    this.persist();
    const count = ids.size;
    this.selectedIds.set(new Set());
    this.showToast(`✓ ${count} submission${count > 1 ? 's' : ''} verified`);
  }

  bulkReject(): void {
    const ids = this.selectedIds();
    this.submissions.update((list) =>
      list.map((s) => (ids.has(s.id) ? { ...s, status: 'rejected' as const } : s))
    );
    this.persist();
    const count = ids.size;
    this.selectedIds.set(new Set());
    this.showToast(`${count} submission${count > 1 ? 's' : ''} rejected`);
  }

  deleteSubmission(id: string): void {
    if (!confirm('Delete this submission? This cannot be undone.')) return;
    this.submissions.update((list) => list.filter((s) => s.id !== id));
    this.persist();
    this.selectedIds.update((s) => {
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
    return fields.find((f) => f.label === label)?.value ?? '';
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