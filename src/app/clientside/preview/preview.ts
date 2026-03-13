import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EventService } from '../../shared/event.service';
import { SiteData } from '../../shared/event.model';
import { renderSite } from './site-renderer';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class PreviewComponent implements OnInit {
  private svc       = inject(EventService);
  private sanitizer = inject(DomSanitizer);

  html    = signal<SafeHtml>('');
  hasData = signal(false);

  ngOnInit(): void {
    // Preview uses the latest saved draft, not necessarily published
    const data: SiteData = this.svc.loadSiteData();
    if (data && data.sections.length > 0) {
      this.hasData.set(true);
      const raw = renderSite(data);
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(raw));
    }
  }
}
