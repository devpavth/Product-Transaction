import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quotation',
  templateUrl: './create-quotation.component.html',
  styleUrl: './create-quotation.component.css'
})
export class CreateQuotationComponent {
  addingData: any;
  isCloseAdding: boolean = false;

  groupList: any;
  catList: any;
  brandList: any;
  gst: any = [0, 5, 12, 18];
  

  private route = inject(Router);

  QuotationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.QuotationForm = this.fb.group({
      companyId: [], // i need to pass to backend(no need for UI)
      customerId: ['', Validators.required],
      bankId: ['', Validators.required],
      quotationDate: ['', Validators.required],
      quotationCode: ['', Validators.required],
      quotationReference: ['', Validators.required],
      totalAmount: [],
      taxTotal: [],
      cGstTotal: [],
      sGstTotal: [],
      iGstTotal: [],
      product: this.fb.array([this.showProductQuotationData()]),
      terms: this.fb.array([this.showQuotationTerms()]),
      Charge: this.fb.array([this.showAdditionalCharge()]),
    });
  }

  get productDetails() {
    return this.QuotationForm.get('product') as FormArray;
  }

  showProductQuotationData() {
    console.log("called  by inti method")
    return this.fb.group({
      product: [],
      productQuantity: ['', Validators.required],
      price: ['', Validators.required],
      gstRate: ['', Validators.required],
      totalAmount: [],
      taxAmount: [],
      cGstAmount: [],
      sGstAmount: [],
      iGstAmount: []
    });
  }

  addProductQuotation() {
    this.productDetails.push(this.showProductQuotationData());
  }


  get quotationTerms() {
    return this.QuotationForm.get('terms') as FormArray;
  }

  showQuotationTerms(){
    console.log("called  by init terms method")
    return this.fb.group({
      termCondition: [],
    });
  }

  addQuotationTerms() {
    this.quotationTerms.push(this.showQuotationTerms());
  }


  get additionalCharge() {
    return this.QuotationForm.get('terms') as FormArray;
  }

  showAdditionalCharge(){
    console.log("called  by init terms method")
    return this.fb.group({
      deliveryCharge: [],
      installCharge: []
    });
  }

  addAdditionalCharge() {
    this.additionalCharge.push(this.showAdditionalCharge());
  }


  ngOnInit(): void {
    this.fetchGroupList();
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

  fetchGroupList() {
    // this.productService.groupList().subscribe((res) => {
    //   this.groupList = res;
    //   console.log(res);
    // });
  }
  fetchCatList(Id: any) {
    // this.productService.catagoriesList(Id).subscribe((res) => {
    //   this.catList = res;
    //   console.log(res);
    // });
  }
  fetchBrandList(catId: any) {
    // this.productService.brandList(catId).subscribe((res) => {
    //   this.brandList = res;
    //   console.log(res);
    // });
  }

  openHsnLink(){
    window.open('https://cleartax.in/s/gst-hsn-lookup', '_blank')
  }

  onSubmit(data: any) {
    console.log("add product data:",data);

    // this.productService.postProduct(data).subscribe(
    //   (res) => {
    //     console.log("Product User added:",res);
    //     this.route.navigate(['/home/productList']);
    //   },
    //   (error) => {
    //     console.log("Error adding product details:",error);

    //     if (error.status == 200) {
    //       this.ProductForm.reset();
    //       this.ProductForm.get('prdStatus')?.patchValue(200);
    //     }
    //   },
    // );
  }
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
    this.fetchGroupList();
    this.QuotationForm.reset();
  }
}
