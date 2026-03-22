import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no events (no predefined data)', () => {
    expect(component.events().length).toBe(0);
  });

  it('should generate a calendar grid divisible by 7', () => {
    const days = component.grid();
    expect(days.length % 7).toBe(0);
    expect(days.length).toBeGreaterThanOrEqual(28);
  });

  it('should show current month label', () => {
    const label = component.calLabel();
    const now = new Date();
    expect(label).toContain(String(now.getFullYear()));
  });

  it('should navigate to next month', () => {
    const before = component.viewDate().getMonth();
    component.nextMonth();
    const after = component.viewDate().getMonth();
    expect(after).not.toBe(before === 11 ? 11 : before);
  });

  it('should navigate to previous month', () => {
    component.nextMonth();
    const before = component.viewDate().getMonth();
    component.prevMonth();
    const after = component.viewDate().getMonth();
    expect(after).not.toBe(before);
  });

  it('should return to today with goToday()', () => {
    component.nextMonth();
    component.nextMonth();
    component.goToday();
    const now = new Date();
    expect(component.viewDate().getMonth()).toBe(now.getMonth());
    expect(component.viewDate().getFullYear()).toBe(now.getFullYear());
  });

  it('should open and close modal', () => {
    expect(component.showModal()).toBeFalse();
    component.openAddModal(null);
    expect(component.showModal()).toBeTrue();
    component.closeModal();
    expect(component.showModal()).toBeFalse();
  });

  it('should add an event on saveEvent()', () => {
    const initial = component.events().length;
    component.openAddModal(null);
    component.evTitle.set('Test Event');
    component.evStart.set('2026-04-01');
    component.evEnd.set('2026-04-01');
    component.saveEvent();
    expect(component.events().length).toBe(initial + 1);
  });

  it('should add an event with a templateId when one is selected', () => {
    component.openAddModal(null);
    component.evTitle.set('Linked Event');
    component.evStart.set('2026-04-01');
    component.evEnd.set('2026-04-03');
    component.evTemplateId.set('t-fake-id');
    component.saveEvent();
    const added = component.events().find(e => e.title === 'Linked Event');
    expect(added?.templateId).toBe('t-fake-id');
  });

  it('should delete an event', () => {
    component.openAddModal(null);
    component.evTitle.set('Delete Me');
    component.evStart.set('2026-04-01');
    component.evEnd.set('2026-04-01');
    component.saveEvent();
    const added = component.events().find(e => e.title === 'Delete Me');
    expect(added).toBeTruthy();
    component.showPanel(added!);
    component.deleteEvent(added!.id);
    expect(component.events().find(e => e.id === added!.id)).toBeUndefined();
  });

  it('onTemplateSelect should auto-fill title when title is empty', () => {

    const fakeTemplates = [{ id: 'tpl1', name: 'Vaccination Drive', createdAt: new Date().toISOString(), siteData: {} }];
    localStorage.setItem('ar_templates', JSON.stringify(fakeTemplates));
    component.openAddModal(null);
    component.evTitle.set('');
    component.onTemplateSelect('tpl1');
    expect(component.evTitle()).toBe('Vaccination Drive');
  });
});
