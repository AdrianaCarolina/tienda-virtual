import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, startWith, debounceTime, Observable } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
// import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCardComponent],
  templateUrl: './catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;

  search = new FormControl('');
  category = new FormControl<number | null>(null);

  filtered$!: Observable<Product[]>;
  categoryMap = new Map<number, string>();

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) // private cart: CartService
  {}

  ngOnInit() {
    this.products$ = this.productsService.getAll();
    this.categories$ = this.categoriesService.getAll();

    this.categories$.subscribe((cats) => {
      this.categoryMap = new Map(cats.map((c) => [c.id, c.name]));
    });

    const search$ = this.search.valueChanges.pipe(startWith(this.search.value), debounceTime(250));
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

  addToCart(product: Product) {
    // this.cart.add(product, 1);
    alert(`Added ${product.name} to cart.`);
  }

  getCategoryName(categoryId?: number) {
    return categoryId ? this.categoryMap.get(categoryId) || '' : '';
  }
}
