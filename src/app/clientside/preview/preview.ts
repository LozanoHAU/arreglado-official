import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EventService } from '../../shared/event.service';
import { SiteData } from '../../shared/event.model';
import { renderStyles, renderBody } from './site-renderer';

const STYLE_ID = 'arreglado-site-styles';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class PreviewComponent implements OnInit, OnDestroy {
  private svc       = inject(EventService);
  private sanitizer = inject(DomSanitizer);

  html    = signal<SafeHtml>('');
  hasData = signal(false);

  ngOnInit(): void {
    const data: SiteData = this.svc.loadSiteData();
    if (data && data.sections.length > 0) {
      this.hasData.set(true);
      this.injectStyles(data);
      document.body.className = data.layout || 'agency';
      const bodyHtml = renderBody(data);
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(bodyHtml));
      this.initScrollReveal();
    }
  }

  ngOnDestroy(): void {
    document.getElementById(STYLE_ID)?.remove();
    document.body.className = '';
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
