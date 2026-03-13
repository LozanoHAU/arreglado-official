import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
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
    expect(compiled.querySelector('.coming-soon')).toBeTruthy();
  });

  it('should have a link back to the dashboard', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('a'));
    const dashboardLink = links.find(a => a.getAttribute('href') === '/admin/dashboard' || a.getAttribute('ng-reflect-router-link'));
    expect(dashboardLink).toBeTruthy();
  });
});
