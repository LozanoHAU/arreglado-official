import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
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
  {
    path: 'client',
    children: [
      {
        path: 'eventpage',
        loadComponent: () =>
          import('./clientside/eventpage/eventpage').then(m => m.EventpageComponent),
      },
      {
        path: 'preview',
        loadComponent: () =>
          import('./clientside/preview/preview').then(m => m.PreviewComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'admin/dashboard' },
];
