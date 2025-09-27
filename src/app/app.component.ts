import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from './services/theme.service';
import { CartService } from './services/cart.service';
import { AsyncPipe } from '@angular/common';
import { Modal } from './shared/modal/modal';
import { Header } from './shared/header/header';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule, Modal, Header],
  providers: [ThemeService, CartService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public theme: ThemeService,
    public cart: CartService,
    private authService: AuthService
  ) {
    //Todo: esto es de prueba hasta que este el login
    setTimeout(() => {
      if (!this.authService.currentUser()) {
        this.authService.login();
      }
    }, 100);
  }
}
