import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventpageComponent } from './eventpage';
import { EventService } from '../../shared/event.service';
import { SiteData } from '../../shared/event.model';

const MOCK_SITE: SiteData = {
  layout: 'agency',
  sections: [
    {
      id: 'hero-test',
      type: 'hero',
      data: {
        navBrand: 'Test Brgy',
        eyebrow: 'Upcoming',
        headline: 'Test Event Headline',
        sub: 'A great event for everyone.',
        cta: 'Register',
        ctaLink: '#form',
        heroImg: '',
      },
    },
  ],
  theme: { primary: '#7c6aff', secondary: '#ff6a8a', customCss: '' },
};

describe('EventpageComponent', () => {
  let component: EventpageComponent;
  let fixture: ComponentFixture<EventpageComponent>;
  let mockService: jasmine.SpyObj<EventService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('EventService', ['getPublishedData', 'loadSiteData']);
    mockService.getPublishedData.and.returnValue(MOCK_SITE);

    await TestBed.configureTestingModule({
      imports: [EventpageComponent],
      providers: [{ provide: EventService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set hasData to true when published data exists', () => {
    expect(component.hasData()).toBeTrue();
  });

  it('should set html signal with sanitized content', () => {
    expect(component.html()).toBeTruthy();
  });

  it('should show empty state when no published data', async () => {
    mockService.getPublishedData.and.returnValue(null as any);
    fixture = TestBed.createComponent(EventpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.hasData()).toBeFalse();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });
});
