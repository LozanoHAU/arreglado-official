import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EventService } from '../../shared/event.service';
import { SiteData } from '../../shared/event.model';
import { renderSite } from '../preview/site-renderer';

@Component({
  selector: 'app-eventpage',
  imports: [],
  templateUrl: './eventpage.html',
  styleUrl: './eventpage.css',
})
export class EventpageComponent implements OnInit {
  private svc       = inject(EventService);
  private sanitizer = inject(DomSanitizer);

  html = signal<SafeHtml>('');
  hasData = signal(false);

  ngOnInit(): void {
    const data: SiteData | null = this.svc.getPublishedData();
    if (data && data.sections.length > 0) {
      this.hasData.set(true);
      const raw = renderSite(data);
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(raw));
    }
  }
}
