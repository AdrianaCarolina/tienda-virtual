import { Component, EventEmitter, Input, Output } from '@angular/core';
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
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],
      image: [''],
    });
  }

  ngOnChanges() {
    if (this.product) {
      this.form.patchValue(this.product);
    } else {
      this.form.reset({ price: 0, stock: 0 });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const value = this.form.value as Product;
    this.save.emit(value);
  }
}
