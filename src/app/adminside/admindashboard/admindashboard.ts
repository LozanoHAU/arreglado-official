import { Component, OnInit, inject, signal, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../shared/event.service';
import { RecentEvent } from '../../shared/event.model';
import { TitleCasePipe } from '@angular/common';

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

  totalEvents   = signal(4);
  publishedCount = signal(2);

  recentEvents: RecentEvent[] = [
    { name: 'Free Vaccination Drive — Purok 1 to 4',       date: 'Mar 15, 2026 · Barangay Hall',          status: 'published', color: '#2C7A3B' },
    { name: 'Barangay Fiesta Preparation Meeting',          date: 'Mar 20, 2026 · Multi-purpose Hall',     status: 'draft',     color: '#E5A822' },
    { name: 'Senior Citizens Health Check & Orientation',   date: 'Mar 25, 2026 · Barangay Health Center', status: 'published', color: '#2C7A3B' },
    { name: 'Youth Livelihood Skills Training',             date: 'Apr 3, 2026 · Barangay Hall',           status: 'draft',     color: '#E5A822' },
  ];

  ngOnInit(): void {
    // Update stats from real service data
    const data = this.eventSvc.loadSiteData();
    const published = this.eventSvc.getPublishedData();
    this.totalEvents.set(data.sections.length || 4);
    this.publishedCount.set(published ? 2 : 0);
  }
}