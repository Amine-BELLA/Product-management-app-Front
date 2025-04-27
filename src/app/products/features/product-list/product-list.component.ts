import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {RatingModule} from "primeng/rating";
import {FormsModule} from "@angular/forms";
import {CartService} from "../../data-access/cart.service";
import {SliderModule, SliderSlideEndEvent} from "primeng/slider";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, DatePipe, CurrencyPipe, RatingModule, FormsModule, NgIf, SliderModule],
})
export class ProductListComponent implements OnInit {
  protected readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);
  minPrice = 0;

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  getQuantity(productId: number): number {
    return this.cartService.getProductQuantity(productId);
  }

  updateQuantity(productId: number, change: number): void {
    const currentQuantity = this.getQuantity(productId);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      this.cartService.removeFromCart(productId);
    } else {
      const product = this.products().find(p => p.id === productId);
      if (product) {
        if (currentQuantity === 0) {
          this.cartService.addToCart(product);
        } else {
          this.cartService.updateQuantity(productId, change);
        }
      }
    }
  }

  updateSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.productsService.filterCriteria.update(current => ({
      ...current,
      searchTerm
    }));
  }

  updateMinPrice(event: SliderSlideEndEvent) {
    if (event.value !== undefined) {
      this.minPrice = event.value;
      this.productsService.filterCriteria.update(current => ({
        ...current,
        minPrice: event.value!
      }));
    }
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
