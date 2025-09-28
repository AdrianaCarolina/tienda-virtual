import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  @Input() product?: Product | null;
  @Input() categories: Category[] = [];
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null as null | undefined],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null as number | null, [Validators.required]],
      image: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('product' in changes) {
      if (this.product) {
        this.form.patchValue({
          ...this.product,
          id: this.product.id !== undefined && this.product.id !== null ? this.product.id : null,
          categoryId: Number(this.product.categoryId),
        });
      } else {
        this.form.reset({ price: 0, stock: 0, categoryId: null });
      }
    }
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.value;

    // Ensure categoryId is a number
    const payload: Product = {
      ...raw,
      categoryId: Number(raw.categoryId),
      id: raw.id ? Number(raw.id) : undefined,
    };

    this.save.emit(payload);
    this.form.reset({ price: 0, stock: 0, categoryId: null });
  }
}
