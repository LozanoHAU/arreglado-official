import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventbuilderComponent } from './eventbuilder';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('EventbuilderComponent', () => {
  let component: EventbuilderComponent;
  let fixture: ComponentFixture<EventbuilderComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [EventbuilderComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(EventbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load default site data with sections', () => {
    expect(component.SD().sections.length).toBeGreaterThan(0);
  });

  it('should switch tabs', () => {
    component.switchTab('theme');
    expect(component.activeTab()).toBe('theme');
    component.switchTab('content');
    expect(component.activeTab()).toBe('content');
  });

  it('should set layout', () => {
    component.setLayout('minimal');
    expect(component.SD().layout).toBe('minimal');
    component.setLayout('bold');
    expect(component.SD().layout).toBe('bold');
    component.setLayout('agency');
    expect(component.SD().layout).toBe('agency');
  });

  it('should add a features section', () => {
    const before = component.SD().sections.length;
    component.addSection('features');
    expect(component.SD().sections.length).toBe(before + 1);
  });

  it('should remove a section', () => {
    component.addSection('about-centered');
    const before = component.SD().sections.length;
    const last = component.SD().sections[before - 1];
    spyOn(window, 'confirm').and.returnValue(true);
    component.removeSection(last.id);
    expect(component.SD().sections.length).toBe(before - 1);
  });

  it('should set a field value', () => {
    const heroSec = component.SD().sections.find(s => s.type === 'hero');
    if (!heroSec) return;
    component.setField(heroSec.id, 'headline', 'Test Headline');
    const updated = component.getSec(heroSec.id);
    expect(updated?.data['headline']).toBe('Test Headline');
  });

  it('should open and close add-section modal', () => {
    expect(component.showModal()).toBeFalse();
    component.showModal.set(true);
    expect(component.showModal()).toBeTrue();
    component.showModal.set(false);
    expect(component.showModal()).toBeFalse();
  });

  it('should apply a color preset', () => {
    component.applyPreset('#c41e3a', '#3d9e52');
    expect(component.SD().theme.primary).toBe('#c41e3a');
    expect(component.SD().theme.secondary).toBe('#3d9e52');
  });

  it('sectionTypes should not allow duplicate unique sections', () => {
    const heroType = component.sectionTypes().flatMap(c => c.items).find(i => i.type === 'hero');
    expect(heroType?.disabled).toBeTrue();
  });

  it('saveDraft should save to localStorage and mark isDraftSaved true', () => {
    component.saveDraft();
    const saved = localStorage.getItem('sf_data');
    expect(saved).toBeTruthy();
    expect(component.isDraftSaved()).toBeTrue();
  });

  it('publishAsTemplate should save a template with a given name', () => {
    component.templateName.set('My Test Template');
    component.publishAsTemplate();
    const raw = localStorage.getItem('ar_templates');
    const templates = raw ? JSON.parse(raw) : [];
    expect(templates.length).toBe(1);
    expect(templates[0].name).toBe('My Test Template');
  });

  it('publishAsTemplate should toast a warning if name is empty', () => {
    component.templateName.set('');
    component.publishAsTemplate();
    expect(component.toastMsg()).toBeTruthy();
    expect(component.toastWarn()).toBeTrue();
  });

  it('openPublishModal should open the publish modal', () => {
    component.openPublishModal();
    expect(component.showPublishModal()).toBeTrue();
  });

  it('closePublishModal should close the publish modal', () => {
    component.openPublishModal();
    component.closePublishModal();
    expect(component.showPublishModal()).toBeFalse();
  });

  it('should add and remove a stat from about-stats section', () => {
    component.addSection('about-stats');
    const sec = component.SD().sections.find(s => s.type === 'about-stats')!;
    const before = sec.data['stats'].length;
    component.addStat(sec.id);
    expect(component.getSec(sec.id)!.data['stats'].length).toBe(before + 1);
    component.removeStat(sec.id, 0);
    expect(component.getSec(sec.id)!.data['stats'].length).toBe(before);
  });

  it('should add and remove a form field', () => {
    component.addSection('form');
    const sec = component.SD().sections.find(s => s.type === 'form')!;
    const before = sec.data['fields'].length;
    component.addFormField(sec.id);
    expect(component.getSec(sec.id)!.data['fields'].length).toBe(before + 1);
    const field = component.getSec(sec.id)!.data['fields'][0];
    component.removeFormField(sec.id, field.id);
    expect(component.getSec(sec.id)!.data['fields'].length).toBe(before);
  });
});
