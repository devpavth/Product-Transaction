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
  isSave: boolean = true;
  isEdit: boolean = true;
  isSaveIcon: boolean = true;
  isDelete: boolean = false;

  totalPrice: number = 0;
  totalPriceWithGst: number = 0;

  isStockView: boolean = false;
  deleteProduct: any;
  selectedCustomerGst: any;

  taxableAmount: number = 0;
  total18GstAmount: number = 0;
  total12GstAmount: number = 0;
  total5GstAmount: number = 0;
  only18Gst: number = 0;
  only12Gst: number = 0;
  only5Gst: number = 0;
  isView18Gst: boolean = false;
  isView12Gst: boolean = false;
  isView5Gst: boolean = false;
  userData: any;
  bankList: any[] = [];

  totalAmount: number = 0;

  noResults: boolean = false;
  storeProductData: any[] = [];
  selectedProductId: any;
  selectedProductQuantity: any;
  isProductSelected: boolean = false;

  productList: any[] = [];

  total18IGstAmount: number = 0;
  total12IGstAmount: number = 0;
  total5IGstAmount: number = 0;
  only18IGst: number = 0;
  only12IGst: number = 0;
  only5IGst: number = 0;
  isView18IGst: boolean = false;
  isView12IGst: boolean = false;
  isView5IGst: boolean = false;

  isTermsView: boolean = false;

  additionalCharges: {label: string, value: number}[] = [];

  // selectedCustomerGst: any;
  selectedCompanyGst: any;
  isChargeView: boolean = false;

  customerList: any[] = [];
  selectedCompanyId: any;
  isCustomerSelected: boolean = false;
  selectedCustomerId: any;
  selectedCustomerName: any;
  // selectedCustomerGst: any;

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
      customerId: ['', Validators.required],
      customerName: [],
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
    console.log("this.productData before patchValue:", this.productData);
    this.UpdateQuotationForm.patchValue(this.productData);
    console.log("this.productData:",this.productData);
    console.log("Form values after patchValue:", this.UpdateQuotationForm.value);
    // Object.keys(this.UpdateQuotationForm.controls).forEach((form) => {
    //   this.UpdateQuotationForm.get(form)?.disable();
    // });
    // this.fetchGroupList();
    // this.fetchCatList(this.productData.prdGrpId);
    // this.fetchBrandList(this.productData.prdCatgId);
  }

  onSelectCustomer(customer: any){
    console.log("customer:", customer);
    this.UpdateQuotationForm.get('customerId')?.setValue(customer.customerName);
    this.selectedCustomerId = customer.customerId;
    this.selectedCustomerName = customer.customerName;
    this.selectedCustomerGst = customer.customerGst;
    this.isCustomerSelected = true;
    this.customerList = [];
  }

  onSelectProduct(product: any){
    // (this.QuotationForm.get('product') as FormArray).controls.forEach((group: AbstractControl, index: number) => {
    //   group.get('product')?.setValue(product.productName);
    // })

    this.selectedProductId = product.productId
    this.selectedProductQuantity = product.productQuantity
    this.isProductSelected = true;
    this.productData = [product];
    this.storeProductData = [];
  }

  isProductFormValid(): boolean{
    const productArray = this.UpdateQuotationForm.get('product') as FormArray;
    return productArray.controls.every((group) => group.valid);
  }

  toggleAdditionalCharges(){
    this.isChargeView = !this.isChargeView;
  }

  toggleTermsAndCondition(){
    this.isTermsView = !this.isTermsView;
  }


  // edit() {
  //   Object.keys(this.UpdateQuotationForm.controls).forEach((form) => {
  //     this.UpdateQuotationForm.get(form)?.enable();
  //   });
  //   this.isSave = true;
  //   this.isEdit = false;
  // }

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

  
  addToBill(data: any, productId: any){
    this.selectedCompanyGst = this.userData.companyGst;
    console.log("addtoBill data from QuotationFormValue:", data);
    console.log("productId from product live search", productId);

    const getProductDetail = {...data.product?.[0], product: productId};
    console.log("getProductDetail", getProductDetail);

    const existingProductIndex = data.product.findIndex(
      (product: any) => product.product === productId
    )

    const matchingProduct = this.productData.find(
      (product: any) => product.productId === getProductDetail.product,
    )

    console.log("matchingProduct:", matchingProduct);

    const isduplicateEntry = this.productList.some(
      (product) => product.product === getProductDetail.product,
      console.log("Duplicate entry detected. Product already exists:", getProductDetail.product)
    )

    if(isduplicateEntry){
      console.log("Duplicate entry detected. Product already exists:", getProductDetail.product);
      alert("This product is already added to the list!");
      // this.inwardForm.reset();
      // this.resetFields();
      return;
    }


    if (existingProductIndex !== -1) {
      // Update the existing product details
      data.product[existingProductIndex] = {
        ...data.product[existingProductIndex],
        
      };
       //console.log(`Updated existing product at index ${existingProductIndex}:`, data.product_details[existingProductIndex]);
    } else {
      // Add the new product to the array
      console.log("reach at end")
      const oldProductData = [...data.product]
      data.product = [...oldProductData];
      
      console.log(data);
       //console.log("Added new product:", newProductDetail);
      this.productList.push({
            ...data,
            product: getProductDetail.product,
            gstRate: getProductDetail.gstRate,
            quantity: getProductDetail.productQuantity,
            price: getProductDetail.price,
            // productCode: matchingProduct.productCode,
            productName: matchingProduct.productName,
            productDescription: matchingProduct.productDescription,
            productModel: matchingProduct.productModel,
            productQuantity: getProductDetail.productQuantity,
            gstAmount: (getProductDetail.gstRate / 100) * getProductDetail.price * getProductDetail.productQuantity,
            productPrice: getProductDetail.price * getProductDetail.productQuantity,
            productPriceWithGst: (getProductDetail.gstRate / 100 * getProductDetail.price * getProductDetail.productQuantity) + (getProductDetail.price * getProductDetail.productQuantity),
          });
    }

    this.taxableAmount = this.productList.reduce(
      (total, product) => {
        const taxable = product.price * product.productQuantity;
        console.log("taxable:", taxable);

        return total + taxable;
      }, 0);

      console.log("Total Taxable Amount:", this.taxableAmount);

    this.total18GstAmount = 0;
    this.total12GstAmount = 0;
    this.total5GstAmount = 0;

    this.total18IGstAmount = 0;
    this.total12IGstAmount = 0;
    this.total5IGstAmount = 0;

    this.totalAmount = 0;

    this.productList.forEach((product) => {
      if(this.selectedCustomerGst.slice(0,2) === this.selectedCompanyGst.slice(0,2)){
        if(product.gstRate === 18){
          this.only18Gst = product.gstRate / 2;
          this.isView18Gst = true;
          const gst18Amount = product.productPriceWithGst;
          this.total18GstAmount += gst18Amount;
        }else if(product.gstRate === 12){
          this.only12Gst = product.gstRate / 2;
          this.isView12Gst = true;
          const gst12Amount = product.productPriceWithGst;
          this.total12GstAmount += gst12Amount;
        }else if(product.gstRate === 5){
          this.only5Gst = product.gstRate / 2;
          this.isView5Gst = true;
          const gst5Amount = product.productPriceWithGst;
          this.total5GstAmount += gst5Amount;
        }
      }else{
        if(product.gstRate === 18){
          this.only18IGst = product.gstRate;
          this.isView18IGst = true;
          const gst18IAmount = product.productPriceWithGst;
          this.total18IGstAmount += gst18IAmount;
        }
        else if(product.gstRate === 12){
          this.only12IGst = product.gstRate;
          this.isView12IGst = true;
          const gst12IAmount = product.productPriceWithGst;
          this.total12IGstAmount += gst12IAmount;
        }else if(product.gstRate === 5){
          this.only5IGst = product.gstRate;
          this.isView5IGst = true;
          const gst5IAmount = product.productPriceWithGst;
          this.total5IGstAmount += gst5IAmount;
        }
      }
      
    })

    if(this.selectedCustomerGst.slice(0,2) === this.selectedCompanyGst.slice(0,2)){
      console.log("(this.selectedCustomerGst.slice(0,2)):", (this.selectedCustomerGst.slice(0,2)));

      this.totalAmount = this.taxableAmount + this.total18GstAmount + 
                          this.total12GstAmount + this.total5GstAmount;

      this.total18GstAmount = this.total18GstAmount / 2;
      this.total12GstAmount = this.total12GstAmount / 2;
      this.total5GstAmount = this.total5GstAmount / 2;


    }else{
      console.log("(this.selectedCustomerGst.slice(0,2)):", (this.selectedCustomerGst.slice(0,2)));

      this.totalAmount = this.taxableAmount + this.total18IGstAmount + 
                          this.total12IGstAmount + this.total5IGstAmount;


      this.total18IGstAmount = this.total18IGstAmount;
      this.total12IGstAmount = this.total12IGstAmount;
      this.total5IGstAmount = this.total5IGstAmount;

      // this.calculateIGstTotal();

    }


    // this.calculateIGstTotal();
    // this.calculateTaxableAmount();
    // this.patchProductFormArray();

    this.productData = '';

    console.log("after productList:", this.productList);


  }

  deleteItem(product: any){
    this.productList = this.productList.filter((p) => p.product !== product.product);
  }

 
  onUpdateProduct(data: any) {
    console.log("Update product data:",data);
    let id = this.UpdateQuotationForm.get('productId')?.value;
    console.log("checking id...:", id);

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
