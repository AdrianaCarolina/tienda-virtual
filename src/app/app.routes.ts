import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AdminComponent } from './pages/admin/admin.component';
import { Cart } from './pages/cart/cart';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent, title: 'Productos' },
  { path: 'admin', component: AdminComponent, title: 'Administración Productos' },
  { path: 'cart', component: Cart, title: 'Carrito' },
  { path: '**', redirectTo: 'catalog' },
  //Estos componentes faltan del compañero
  //{ path: 'pedidos', component: Orders, title: 'Mis Pedidos' },
  //{ path: 'perfil', component: Profile, title: 'Mi Perfil' },
  //{ path: 'admin-pedidos', component: AdminPedidos, title: 'Administración de Pedidos' },
];
