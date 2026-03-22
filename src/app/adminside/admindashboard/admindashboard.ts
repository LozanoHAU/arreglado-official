import { Component, OnInit, inject, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../shared/event.service';
import { CalendarEvent, RecentEvent } from '../../shared/event.model';
import { TitleCasePipe } from '@angular/common';

const COLOR_HEX: Record<string, string> = {
  'ev-blue': '#3b87d4', 'ev-red': '#D12A2F', 'ev-green': '#2C7A3B',
  'ev-gold': '#E5A822', 'ev-purple': '#7c4dff', 'ev-teal': '#00897b',
};

@Component({
  selector: 'app-admindashboard',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './admindashboard.html',
  styleUrl: './admindashboard.css',
  encapsulation: ViewEncapsulation.None,
})
export class AdmindashboardComponent implements OnInit {
  private eventSvc = inject(EventService);

  currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
  currentYear  = new Date().getFullYear();

  totalEvents    = signal(0);
  publishedCount = signal(0); 
  templateCount  = signal(0);

  recentEvents: RecentEvent[] = [];

  ngOnInit(): void {
    const calEvents  = this.eventSvc.loadCalendarEvents();
    const templates  = this.eventSvc.loadTemplates();

    this.totalEvents.set(calEvents.length);
    this.publishedCount.set(calEvents.filter(e => !!e.templateId).length);
    this.templateCount.set(templates.length);

    this.recentEvents = [...calEvents]
      .sort((a, b) => b.start.localeCompare(a.start))
      .slice(0, 4)
      .map(ev => this.toRecentEvent(ev));
  }

  private toRecentEvent(ev: CalendarEvent): RecentEvent {
    const [y, m, d] = ev.start.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
      name: ev.title,
      date: ev.loc ? `${dateStr} · ${ev.loc}` : dateStr,
      status: ev.templateId ? 'published' : 'draft',
      color: COLOR_HEX[ev.color] ?? '#2C7A3B',
    };
  }
}
