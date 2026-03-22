import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';
import { clientGuard } from './shared/client.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'client/eventpage', pathMatch: 'full' },


  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./adminside/login/login').then(m => m.LoginComponent),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./adminside/admindashboard/admindashboard').then(m => m.AdmindashboardComponent),
      },
      {
        path: 'calendar',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./adminside/calendar/calendar').then(m => m.CalendarComponent),
      },
      {
        path: 'eventbuilder',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./adminside/eventbuilder/eventbuilder').then(m => m.EventbuilderComponent),
      },
      {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./adminside/notifications/notifications').then(m => m.NotificationsComponent),
      },
    ],
  },


  {
    path: 'client',
    canActivate: [clientGuard],
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


  {
    path: 'client/preview',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./clientside/preview/preview').then(m => m.PreviewComponent),
  },

  { path: '**', redirectTo: 'client/eventpage' },
];
