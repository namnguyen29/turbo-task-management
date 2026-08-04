import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        loadComponent: async () => (await import('./pages/home-page/home-page')).HomePage,
        title: 'Dashboard',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
