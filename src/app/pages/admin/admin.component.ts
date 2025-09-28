import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, map, startWith, Observable } from 'rxjs';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductFormComponent,
    ProductCardComponent,
    CategoryFormComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;

  search = new FormControl('');
  category = new FormControl<number | null>(null);

  filtered$!: Observable<Product[]>;

  // UI state
  showForm = false;
  editing?: Product | null;

  showCategoryForm = false;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {
    this.loadData();
  }

  loadData() {
    this.products$ = this.productsService.getAll();
    this.categories$ = this.categoriesService.getAll();

    const search$ = this.search.valueChanges.pipe(startWith(this.search.value), debounceTime(200));
    const category$ = this.category.valueChanges.pipe(startWith(this.category.value));
    this.filtered$ = combineLatest([this.products$, search$, category$]).pipe(
      map(([products, searchTerm, categoryId]) => {
        const term = (searchTerm || '').toLowerCase().trim();
        return products.filter((p) => {
          const matchName = !term || p.name.toLowerCase().includes(term);
          const matchCategory = !categoryId || p.categoryId === categoryId;
          return matchName && matchCategory;
        });
      })
    );
  }

  openCreate() {
    this.editing = null;
    this.showForm = true;
  }

  openEdit(product: Product) {
    this.editing = { ...product };
    this.showForm = true;
  }

  onCancel() {
    this.showForm = false;
    this.editing = undefined;
  }

  onSave(product: Product) {
    // ensure categoryId is a number
    product.categoryId = Number(product.categoryId);
    if (product.id) {
      this.productsService.update(product).subscribe({
        next: () => this.afterProductChange(),
        error: () => alert('Failed to update product'),
      });
    } else {
      this.productsService.create(product).subscribe({
        next: () => this.afterProductChange(),
        error: () => alert('Failed to create product'),
      });
    }
  }

  onDelete(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productsService.delete(id).subscribe({
      next: () => this.afterProductChange(),
      error: () => alert('Failed to delete product'),
    });
  }

  private afterProductChange() {
    this.showForm = false;
    this.editing = undefined;
    this.loadData();
  }

  // Categories management
  toggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  createCategory(payload: Partial<Category>) {
    this.categoriesService.create(payload).subscribe({
      next: () => {
        this.showCategoryForm = false;
        this.loadData();
      },
      error: () => alert('Failed to create category'),
    });
  }

  deleteCategory(id: number) {
    if (!confirm('Delete this category?')) return;
    this.categoriesService.delete(id).subscribe({
      next: () => this.loadData(),
      error: () => alert('Failed to delete category'),
    });
  }
}
