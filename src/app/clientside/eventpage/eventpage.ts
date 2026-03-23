import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EventService } from '../../shared/event.service';
import { CalendarEvent, SiteData } from '../../shared/event.model';
import { renderStyles, renderBody } from '../preview/site-renderer';

const STYLE_ID = 'arreglado-site-styles';

@Component({
  selector: 'app-eventpage',
  imports: [],
  templateUrl: './eventpage.html',
  styleUrl: './eventpage.css',
})
export class EventpageComponent implements OnInit, OnDestroy {
  private svc       = inject(EventService);
  private sanitizer = inject(DomSanitizer);

  html      = signal<SafeHtml>('');
  hasData   = signal(false);
  nextEvent = signal<CalendarEvent | null>(null);

  ngOnInit(): void {
    const data: SiteData | null = this.svc.getActiveEventData();

    if (data && data.sections.length > 0) {
      this.hasData.set(true);
      this.injectStyles(data);
      document.body.className = data.layout || 'agency';
      const bodyHtml = renderBody(data);
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(bodyHtml));
      this.initScrollReveal();
    } else {
      this.nextEvent.set(this.svc.getNextUpcomingEvent());
    }
  }

  ngOnDestroy(): void {
    document.getElementById(STYLE_ID)?.remove();
    document.body.className = '';
  }

  nextEventDateStr(): string {
    const ev = this.nextEvent();
    if (!ev) return '';
    const parseLocal = (s: string) => {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    };
    const start = parseLocal(ev.start);
    const end   = parseLocal(ev.end);
    const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    if (ev.start === ev.end) {
      return start.toLocaleDateString('en-PH', opts);
    }
    return `${start.toLocaleDateString('en-PH', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-PH', opts)}`;
  }

  private injectStyles(data: SiteData): void {
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = renderStyles(data);
  }

  private initScrollReveal(): void {
    setTimeout(() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('[data-r]').forEach(el => obs.observe(el));
    }, 50);
  }
}
