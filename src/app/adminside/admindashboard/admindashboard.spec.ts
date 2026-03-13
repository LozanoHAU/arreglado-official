import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmindashboardComponent } from './admindashboard';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

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

  it('should display total events count', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-stat-num')).toBeTruthy();
  });

  it('should have recent events list', () => {
    expect(component.recentEvents.length).toBeGreaterThan(0);
  });

  it('should show current year', () => {
    expect(component.currentYear).toEqual(new Date().getFullYear());
  });
});
