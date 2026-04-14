import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductApiService } from '../../core/services/product-api.service';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-manager.component.html',
  styleUrl: './product-manager.component.css'
})
export class ProductManagerComponent implements OnInit {
  private apiService = inject(ProductApiService);
  private fb = inject(FormBuilder);

  products: Product[] = [];
  productForm: FormGroup;
  isEditing = false;
  showForm = false;
  currentProductId: string | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      urlImg: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe(data => this.products = data);
  }

  onAddNew(): void {
    this.resetForm();
    this.showForm = true;
  }

  onSubmit(): void {
    console.log('Submitting form...', this.productForm.value);
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEditing && this.currentProductId) {
        console.log('Updating product...', this.currentProductId);
        this.apiService.updateProduct(this.currentProductId, productData).subscribe({
          next: () => {
            console.log('Update successful');
            this.loadProducts();
            this.hideForm();
          },
          error: (err) => console.error('Update failed', err)
        });
      } else {
        console.log('Adding new product...');
        this.apiService.addProduct(productData).subscribe({
          next: (res) => {
            console.log('Add successful', res);
            this.loadProducts();
            this.hideForm();
          },
          error: (err) => console.error('Add failed', err)
        });
      }
    } else {
      console.warn('Form is invalid', this.productForm.errors);
    }
  }

  onEdit(product: Product): void {
    this.isEditing = true;
    this.showForm = true;
    this.currentProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      urlImg: product.urlImg
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.reset({ price: 0 });
  }

  hideForm(): void {
    this.showForm = false;
    this.resetForm();
  }
}
