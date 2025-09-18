import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AdminComponent } from './pages/admin/admin.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: 'catalog' },
];
