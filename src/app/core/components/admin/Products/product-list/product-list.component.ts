import { Component } from '@angular/core';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  isProductList: Boolean = false;
  productList: any[] | undefined;
  otherPrdLen: number = 0;
  productData: any;
  Spinner: boolean = true;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  list: any;
  listLength: any;
  ngOnInit() {
    this.fetchProductList(1);
  }
  constructor(private productService: ProductService) {}
  fetchProductList(data: number) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.productService.getAllProduct().subscribe((res: any) => {
      console.log("product list:", res);
      this.list = res;
      this.listLength = this.list.length;
      let list: any[] = res;
      this.otherPrdLen = list.filter((m) => m.prdStatus == 303).length;
      this.Spinner = false;
      switch (data) {
        case 1: {
          this.productList = list
            .filter((m) => m.prdStatus == 200)
            .slice(startIndex, endIndex);
          break;
        }
        case 2: {
          this.productList = list
            .filter((m) => m.prdStatus == 303)
            .slice(startIndex, endIndex);
          console.log('Hello');
          break;
        }
      }
    });
  }
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.fetchProductList(1);
  }
  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }
  get startPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  get endPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.listLength);
  }
  toggleView(action: Boolean, check: number, productData: any) {
    if (check == 1) {
      this.isProductList = action;
      this.productData = productData;
    }
    if (check == 0) {
      this.isProductList = action;
      this.fetchProductList(1);
    }
  }
}
