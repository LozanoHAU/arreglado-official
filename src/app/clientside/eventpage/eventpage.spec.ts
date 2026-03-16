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

  describe('when an active event exists', () => {
    beforeEach(async () => {
      mockService = jasmine.createSpyObj('EventService', [
        'getActiveEventData', 'getNextUpcomingEvent', 'loadSiteData'
      ]);
      mockService.getActiveEventData.and.returnValue(MOCK_SITE);
      mockService.getNextUpcomingEvent.and.returnValue(null);

      await TestBed.configureTestingModule({
        imports: [EventpageComponent],
        providers: [{ provide: EventService, useValue: mockService }],
      }).compileComponents();

      fixture = TestBed.createComponent(EventpageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('should set hasData to true', () => {
      expect(component.hasData()).toBeTrue();
    });

    it('should set html signal with rendered content', () => {
      expect(component.html()).toBeTruthy();
    });

    it('should call getActiveEventData, not getPublishedData or loadSiteData', () => {
      expect(mockService.getActiveEventData).toHaveBeenCalled();
    });
  });

  describe('when no active event exists', () => {
    beforeEach(async () => {
      mockService = jasmine.createSpyObj('EventService', [
        'getActiveEventData', 'getNextUpcomingEvent', 'loadSiteData'
      ]);
      mockService.getActiveEventData.and.returnValue(null);
      mockService.getNextUpcomingEvent.and.returnValue(null);

      await TestBed.configureTestingModule({
        imports: [EventpageComponent],
        providers: [{ provide: EventService, useValue: mockService }],
      }).compileComponents();

      fixture = TestBed.createComponent(EventpageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set hasData to false', () => {
      expect(component.hasData()).toBeFalse();
    });

    it('should show the coming soon screen', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.cs-page')).toBeTruthy();
    });

    it('should call getNextUpcomingEvent to surface upcoming info', () => {
      expect(mockService.getNextUpcomingEvent).toHaveBeenCalled();
    });
  });

  describe('when no active event but there is an upcoming one', () => {
    const upcomingEv = {
      id: 'u1', title: 'Upcoming Health Fair', desc: '', color: 'ev-green',
      start: '2026-12-01', end: '2026-12-01', loc: 'Barangay Hall', templateId: 't1',
    };

    beforeEach(async () => {
      mockService = jasmine.createSpyObj('EventService', [
        'getActiveEventData', 'getNextUpcomingEvent', 'loadSiteData'
      ]);
      mockService.getActiveEventData.and.returnValue(null);
      mockService.getNextUpcomingEvent.and.returnValue(upcomingEv);

      await TestBed.configureTestingModule({
        imports: [EventpageComponent],
        providers: [{ provide: EventService, useValue: mockService }],
      }).compileComponents();

      fixture = TestBed.createComponent(EventpageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should store nextEvent signal', () => {
      expect(component.nextEvent()).toEqual(upcomingEv);
    });

    it('should return a formatted date string for next event', () => {
      expect(component.nextEventDateStr()).toContain('December');
    });
  });
});
