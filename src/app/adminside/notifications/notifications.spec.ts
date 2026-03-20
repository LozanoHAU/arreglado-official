import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page wrapper', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page')).toBeTruthy();
  });

  it('should default to attendance tab', () => {
    expect(component.activeTab()).toBe('attendance');
  });

  it('should switch to hall-rental tab', () => {
    component.switchTab('hall-rental');
    expect(component.activeTab()).toBe('hall-rental');
  });

  it('should start with an empty inbox', () => {
    expect(component.submissions().length).toBe(0);
  });

  it('should load submissions from localStorage', () => {
    const fakeData = [
      {
        id: 'sub-real-1', type: 'attendance', name: 'Test User',
        submittedAt: new Date().toISOString(), status: 'pending',
        eventName: 'Test Event', fields: [{ label: 'Full Name', value: 'Test User' }],
      },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    const fixture2 = TestBed.createComponent(NotificationsComponent);
    fixture2.componentInstance.ngOnInit();
    expect(fixture2.componentInstance.submissions().length).toBe(1);
  });

  it('should strip old seed data from localStorage on load', () => {
    const mixed = [
      { id: 'sub-seed-1', type: 'attendance', name: 'Old', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Ev', fields: [] },
      { id: 'sub-real-99', type: 'attendance', name: 'Real', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Ev', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(mixed));
    const fixture2 = TestBed.createComponent(NotificationsComponent);
    fixture2.componentInstance.ngOnInit();
    const ids = fixture2.componentInstance.submissions().map(s => s.id);
    expect(ids).not.toContain('sub-seed-1');
    expect(ids).toContain('sub-real-99');
  });

  it('should update status to verified', () => {
    const fakeData = [
      { id: 'sv1', type: 'attendance', name: 'Maria', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Drive', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    component.ngOnInit();
    component.updateStatus('sv1', 'verified');
    expect(component.submissions().find(s => s.id === 'sv1')?.status).toBe('verified');
  });

  it('should filter attendance by status', () => {
    const fakeData = [
      { id: 's1', type: 'attendance', name: 'A', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Ev', fields: [] },
      { id: 's2', type: 'attendance', name: 'B', submittedAt: new Date().toISOString(), status: 'verified', eventName: 'Ev', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    component.ngOnInit();
    component.setFilter('pending');
    expect(component.attendanceList().every(s => s.status === 'pending')).toBeTrue();
  });

  it('should filter attendance by event name', () => {
    const fakeData = [
      { id: 'e1', type: 'attendance', name: 'A', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Event A', fields: [] },
      { id: 'e2', type: 'attendance', name: 'B', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Event B', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    component.ngOnInit();
    component.setEventFilter('Event A');
    expect(component.attendanceList().length).toBe(1);
    expect(component.attendanceList()[0].eventName).toBe('Event A');
  });

  it('should return all when eventFilter is all', () => {
    const fakeData = [
      { id: 'e1', type: 'attendance', name: 'A', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Event A', fields: [] },
      { id: 'e2', type: 'attendance', name: 'B', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Event B', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    component.ngOnInit();
    component.setEventFilter('Event A');
    component.setEventFilter('all');
    expect(component.attendanceList().length).toBe(2);
  });

  it('should reset eventFilter when switching tabs', () => {
    component.eventFilter.set('Some Event');
    component.switchTab('hall-rental');
    expect(component.eventFilter()).toBe('all');
  });

  it('should toggle expand', () => {
    const fakeData = [
      { id: 'ex1', type: 'attendance', name: 'X', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Ev', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    component.ngOnInit();
    component.toggleExpand('ex1');
    expect(component.expandedId()).toBe('ex1');
    component.toggleExpand('ex1');
    expect(component.expandedId()).toBeNull();
  });

  it('should bulk verify selected pending submissions', () => {
    const fakeData = [
      { id: 'bv1', type: 'attendance', name: 'A', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Ev', fields: [] },
      { id: 'bv2', type: 'attendance', name: 'B', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Ev', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    component.ngOnInit();
    component.toggleSelectAll();
    expect(component.selectedCount()).toBe(2);
    component.bulkVerify();
    expect(component.selectedCount()).toBe(0);
    expect(component.submissions().every(s => s.status === 'verified')).toBeTrue();
  });

  it('should have attendance and hall-rental types after manual seed', () => {
    const fakeData = [
      { id: 'a1', type: 'attendance', name: 'A', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Ev', fields: [] },
      { id: 'h1', type: 'hall-rental', name: 'B', submittedAt: new Date().toISOString(), status: 'pending', eventName: 'Hall', fields: [] },
    ];
    localStorage.setItem('ar_submissions', JSON.stringify(fakeData));
    component.ngOnInit();
    expect(component.submissions().filter(s => s.type === 'attendance').length).toBe(1);
    expect(component.submissions().filter(s => s.type === 'hall-rental').length).toBe(1);
  });
});
