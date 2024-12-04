import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrl: './view-quotation.component.css'
})
export class ViewQuotationComponent {
  @Input() productData: any;
  @Output() closeProduct = new EventEmitter<boolean>();

  addingData: any;
  isCloseAdding: boolean = false;
  isSave: boolean = false;
  isEdit: boolean = true;
  isSaveIcon: boolean = true;
  isDelete: boolean = false;

  totalPrice: number = 0;
  totalPriceWithGst: number = 0;

  isStockView: boolean = false;
  deleteProduct: any;

  groupList: any;
  catList: any;
  brandList: any;
  gst: string[] = ['5.00', '12.00', '18.00', '28.00'];
  units: { id: number; name: string }[] = [
    { id: 1, name: 'Kg' },
    { id: 2, name: 'L' },
    { id: 3, name: 'm' },
    { id: 4, name: 'Unit' },
    { id: 200, name: 'Box' },
  ];

  UpdateQuotationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    // private productService: ProductService,
    private route: Router
  ) {
    this.UpdateQuotationForm = this.fb.group({
      companyId: [],
      customerId: [],
      bankId: [],
      quotationDate: [],
      quotationCode: [],
      quotationReference: [],
      totalAmount: [],
      taxTotal: [],
      cGstTotal: [],
      sGstTotal: [],
      iGstTotal: [],
      product: this.fb.array([this.showProductQuotationData()]),
      terms: this.fb.array([this.showQuotationTerms()]),
      Charge: this.fb.array([this.showAdditionalCharge()]),
      // totalValue: [],
      // totalPriceWithGst: [],
      // prdStatus: [200],
    });
  }

  get productDetails() {
    return this.UpdateQuotationForm.get('product') as FormArray;
  }

  showProductQuotationData() {
    console.log("called  by inti method")
    return this.fb.group({
      product: [],
      productQuantity: ['', Validators.required],
      price: ['', Validators.required],
      gstRate: ['', Validators.required],
      totalAmount: ['', Validators.required],
      taxAmount: ['', Validators.required],
      cGstAmount: ['', Validators.required],
      sGstAmount: ['', Validators.required],
      iGstAmount: ['', Validators.required]
    });
  }

  addProductQuotation() {
    this.productDetails.push(this.showProductQuotationData());
  }


  get quotationTerms() {
    return this.UpdateQuotationForm.get('terms') as FormArray;
  }

  showQuotationTerms(){
    console.log("called  by init terms method")
    return this.fb.group({
      termCondition: ['', Validators.required],
    });
  }

  addQuotationTerms() {
    this.quotationTerms.push(this.showQuotationTerms());
  }


  get additionalCharge() {
    return this.UpdateQuotationForm.get('terms') as FormArray;
  }

  showAdditionalCharge(){
    console.log("called  by init terms method")
    return this.fb.group({
      deliveryCharge: ['', Validators.required],
      installCharge: ['', Validators.required]
    });
  }

  addAdditionalCharge() {
    this.additionalCharge.push(this.showAdditionalCharge());
  }

  ngOnInit(): void {
    this.UpdateQuotationForm.patchValue(this.productData);
    console.log("this.productData:",this.productData);
    Object.keys(this.UpdateQuotationForm.controls).forEach((form) => {
      this.UpdateQuotationForm.get(form)?.disable();
    });
    // this.fetchGroupList();
    // this.fetchCatList(this.productData.prdGrpId);
    // this.fetchBrandList(this.productData.prdCatgId);
  }

  addingAction(check: number) {
    this.isCloseAdding = true;
    if (check === 1) {
      this.addingData = { title: 'Add Group', Adding: 1 };
      console.log(this.addingData);
    }
    if (check === 2) {
      this.addingData = { title: 'Add Category', Adding: 2 };
      console.log(this.addingData);
    }
    if (check === 3) {
      this.addingData = { title: 'Add Brand', Adding: 3 };
      console.log(this.addingData);
    }
  }
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
  }

  edit() {
    Object.keys(this.UpdateQuotationForm.controls).forEach((form) => {
      this.UpdateQuotationForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }

  calculatePrice(price: any){
    console.log("testing...:", this.productData);
    console.log("testing price...:", price);
    this.totalPrice = this.productData.productQuantity * price;
    console.log("this.productData.productGstRate:", this.productData.productGstRate);
    this.totalPriceWithGst = this.totalPrice * this.productData.productGstRate;
    console.log("totalPriceWithGst:", this.totalPriceWithGst);
  }


  toggledelete(check: any, isView: boolean) {
    if (check == 1) {
      this.isDelete = isView;
      this.deleteProduct = {
        title: 'Product',
        action: 2,
        deleteId: this.productData.productId,
      };
      console.log(this.deleteProduct);
    } else if (check == 0) {
      this.isDelete = isView;
      this.closeProduct.emit(false);
    }
  }

 
  onUpdateProduct(data: any) {
    console.log("Update product data:",data);
    let id = this.UpdateQuotationForm.get('productId')?.value;
    console.log("checking id...:",id);

    // this.productService.updateProduct(id, data).subscribe(
    //   (res) => {
    //     console.log("Updating Product from backend service:",res);
    //     this.closeProduct.emit(false);
    //     // this.route.navigate(['/home/productList']);
    //   },
    //   (error) => {
    //     console.log("error while updating product:",error);
    //     if (error.status == 200) {
    //       this.route.navigate(['/home/productList']);
    //     }
    //   },
    // );
  }
}
