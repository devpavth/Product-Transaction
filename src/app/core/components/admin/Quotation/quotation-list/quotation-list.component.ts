import { Component, inject } from '@angular/core';
import { QuotationService } from '../../../service/Quotation/quotation.service';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrl: './quotation-list.component.css'
})
export class QuotationListComponent {
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
    this.fetchQuotationList(1);
  }

  private quotationService = inject(QuotationService);
  constructor(
  ) {}

  fetchQuotationList(data: number) {

    const queryParams = { 
      page: this.currentPage.toString(), 
      size: this.itemsPerPage.toString() 
    };
    
    // const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    // const endIndex = startIndex + this.itemsPerPage;
    this.quotationService.getAllQuotation().subscribe((res: any) => {
      console.log("product list:", res);
      this.list = res;
      // console.log("res.results.productGstRate:",res.results.productGstRate)
      this.listLength = res.count;
      console.log("product list length to find:", this.listLength);
      // this.otherPrdLen = list.filter((m) => m.prdStatus == 303).length;
      this.Spinner = false;
      switch (data) {
        case 1: {
          this.productList = this.list
            .filter((product: any) => product.prdStatus == 200)
            // .slice(startIndex, endIndex);
          break;
        }
        case 2: {
          this.productList = this.list
            .filter((m: any) => m.prdStatus == 303)
            // .slice(startIndex, endIndex);
          // console.log('Hello');
          break;
        }
      }
    });
  }
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.fetchQuotationList(1);
  }
  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }
  get startPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  get endPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.listLength || 0);
  }
  toggleView(action: Boolean, check: number, productData: any) {
    if (check == 1) {
      this.isProductList = action;
      this.productData = productData;
    }
    if (check == 0) {
      this.isProductList = action;
      this.fetchQuotationList(1);
    }
  }
}
