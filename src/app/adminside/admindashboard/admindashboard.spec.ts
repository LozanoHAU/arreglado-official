import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmindashboardComponent } from './admindashboard';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { EventService } from '../../shared/event.service';

describe('AdmindashboardComponent', () => {
  let component: AdmindashboardComponent;
  let fixture: ComponentFixture<AdmindashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmindashboardComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(AdmindashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display total events count stat', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-stat-num')).toBeTruthy();
  });

  it('should start with zero events when localStorage is empty', () => {
    localStorage.clear();
    const fixture2 = TestBed.createComponent(AdmindashboardComponent);
    fixture2.componentInstance.ngOnInit();
    expect(fixture2.componentInstance.totalEvents()).toBe(0);
    expect(fixture2.componentInstance.publishedCount()).toBe(0);
  });

  it('should show current year', () => {
    expect(component.currentYear).toEqual(new Date().getFullYear());
  });

  it('should have empty recentEvents when no calendar events exist', () => {
    localStorage.clear();
    const fixture2 = TestBed.createComponent(AdmindashboardComponent);
    fixture2.componentInstance.ngOnInit();
    expect(fixture2.componentInstance.recentEvents.length).toBe(0);
  });
});
