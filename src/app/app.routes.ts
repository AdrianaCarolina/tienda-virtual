import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AdminComponent } from './pages/admin/admin.component';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { AdminOrder } from './pages/admin-order/admin-order';
import { LoginComponent } from './pages/login/login.component';
import { AdminGuard } from './pages/admin/admin.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent, title: 'Productos' },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Administración Productos',
    canActivate: [AdminGuard],
  },
  { path: 'cart', component: Cart, title: 'Carrito' },
  { path: 'orders', component: Orders, title: 'Mis Pedidos' },
  { path: 'admin-orders', component: AdminOrder, title: 'Administración de Pedidos' },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'catalog' },
];
