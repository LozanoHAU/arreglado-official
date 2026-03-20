import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'client/eventpage', pathMatch: 'full' },

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./adminside/admindashboard/admindashboard').then(m => m.AdmindashboardComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./adminside/calendar/calendar').then(m => m.CalendarComponent),
      },
      {
        path: 'eventbuilder',
        loadComponent: () =>
          import('./adminside/eventbuilder/eventbuilder').then(m => m.EventbuilderComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./adminside/notifications/notifications').then(m => m.NotificationsComponent),
      },
    ],
  },

  // ── CLIENT (shared navbar wrapper) ────────────────────────────────────────
  {
    path: 'client',
    loadComponent: () =>
      import('./clientside/layout/layout').then(m => m.ClientLayoutComponent),
    children: [
      {
        path: 'eventpage',
        loadComponent: () =>
          import('./clientside/eventpage/eventpage').then(m => m.EventpageComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./clientside/about/about').then(m => m.AboutComponent),
      },
      { path: '', redirectTo: 'eventpage', pathMatch: 'full' },
    ],
  },

  // Preview is standalone (no client navbar, used by admin)
  {
    path: 'client/preview',
    loadComponent: () =>
      import('./clientside/preview/preview').then(m => m.PreviewComponent),
  },

  { path: '**', redirectTo: 'client/eventpage' },
];