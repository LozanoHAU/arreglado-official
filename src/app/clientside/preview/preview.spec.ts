import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewComponent } from './preview';
import { EventService } from '../../shared/event.service';
import { SiteData } from '../../shared/event.model';

const MOCK_DRAFT: SiteData = {
  layout: 'minimal',
  sections: [
    {
      id: 'hero-draft',
      type: 'hero',
      data: {
        navBrand: 'Draft Brgy',
        eyebrow: 'Preview',
        headline: 'Draft Headline',
        sub: 'This is a preview of the draft.',
        cta: 'Join',
        ctaLink: '#form',
        heroImg: '',
      },
    },
  ],
  theme: { primary: '#3d9e52', secondary: '#d4a017', customCss: '' },
};

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let mockService: jasmine.SpyObj<EventService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('EventService', ['loadSiteData', 'getPublishedData']);
    mockService.loadSiteData.and.returnValue(MOCK_DRAFT);

    await TestBed.configureTestingModule({
      imports: [PreviewComponent],
      providers: [{ provide: EventService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read from loadSiteData (draft), not published', () => {
    expect(mockService.loadSiteData).toHaveBeenCalled();
    expect(mockService.getPublishedData).not.toHaveBeenCalled();
  });

  it('should set hasData to true when draft has sections', () => {
    expect(component.hasData()).toBeTrue();
  });

  it('should generate html from the draft data', () => {
    expect(component.html()).toBeTruthy();
  });

  it('should show empty state when draft has no sections', async () => {
    const empty: SiteData = { ...MOCK_DRAFT, sections: [] };
    mockService.loadSiteData.and.returnValue(empty);
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.hasData()).toBeFalse();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });
});
