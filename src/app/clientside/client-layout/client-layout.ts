import { Component, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClientThemeService } from '../../shared/client-theme.service';
import { EventService } from '../../shared/event.service';

@Component({
  selector: 'app-client-layout',
  imports: [NgClass, NgStyle, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.css',
})
export class ClientLayoutComponent implements OnInit, OnDestroy {
  protected themeService = inject(ClientThemeService);
  private eventService = inject(EventService);

  constructor() {
    effect(() => {
      const layout = this.themeService.theme().layout;
      document.body.classList.remove('agency', 'minimal', 'bold');
      document.body.classList.add(layout);
    });
  }

  ngOnInit(): void {
    const data = this.eventService.getActiveEventData() ?? this.eventService.loadSiteData();
    this.themeService.setFromSiteData(data);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('agency', 'minimal', 'bold');
  }
}
