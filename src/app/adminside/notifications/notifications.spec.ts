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

  it('should show coming soon message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.notif-page')).toBeTruthy();
  });

  it('should default to attendance tab', () => {
    expect(component.activeTab()).toBe('attendance');
  });

  it('should switch to hall-rental tab', () => {
    component.switchTab('hall-rental');
    expect(component.activeTab()).toBe('hall-rental');
  });

  it('should load seed data on init', () => {
    expect(component.submissions().length).toBeGreaterThan(0);
  });

  it('should have attendance and hall-rental submissions', () => {
    const attendance = component.submissions().filter(s => s.type === 'attendance');
    const rental = component.submissions().filter(s => s.type === 'hall-rental');
    expect(attendance.length).toBeGreaterThan(0);
    expect(rental.length).toBeGreaterThan(0);
  });

  it('should update status to verified', () => {
    const pending = component.submissions().find(s => s.status === 'pending');
    if (!pending) return;
    component.updateStatus(pending.id, 'verified');
    const updated = component.submissions().find(s => s.id === pending.id);
    expect(updated?.status).toBe('verified');
  });

  it('should bulk verify selected pending submissions', () => {
    component.toggleSelectAll();
    const selectedCount = component.selectedCount();
    expect(selectedCount).toBeGreaterThan(0);
    component.bulkVerify();
    expect(component.selectedCount()).toBe(0);
  });

  it('should filter by status', () => {
    component.setFilter('pending');
    const list = component.attendanceList();
    expect(list.every(s => s.status === 'pending')).toBeTrue();
  });

  it('should toggle expand', () => {
    const sub = component.submissions()[0];
    component.toggleExpand(sub.id);
    expect(component.expandedId()).toBe(sub.id);
    component.toggleExpand(sub.id);
    expect(component.expandedId()).toBeNull();
  });
});
