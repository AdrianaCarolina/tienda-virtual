import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'app_theme_dark';
  private _dark = false;

  constructor() {
    const saved = localStorage.getItem(this.key);
    this._dark = saved === 'true';
    this.apply();
  }

  isDark() {
    return this._dark;
  }

  toggle() {
    this._dark = !this._dark;
    localStorage.setItem(this.key, String(this._dark));
    this.apply();
  }

  private apply() {
    if (this._dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }
}
