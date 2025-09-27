import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AdminComponent } from './pages/admin/admin.component';
import { Cart } from './pages/cart/cart';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'cart', component: Cart },
  { path: '**', redirectTo: 'catalog' },
];
