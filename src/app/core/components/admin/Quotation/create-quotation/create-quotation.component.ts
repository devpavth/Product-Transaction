import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { QuotationService } from '../../../service/Quotation/quotation.service';

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

  isCustomerSelected: boolean = false;
  noCustomer: boolean = false;
  customerList: any[] = [];
  storeProductData: any[] = [];
  selectedCustomerId: any;

  isProductSelected: boolean = false;
  noResults: boolean = false;
  productData: any;
  selectedProductId: any;
  selectedProductQuantity: any;
  productList: any[] = [];

  isChargeView: boolean = false;
  isTermsView: boolean = true;
  

  private route = inject(Router);
  private quotationService = inject(QuotationService);

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
      searchInput: [],
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

    this.quotationService.fetchQuotationCode().subscribe(
      (res: any)=>{
        console.log("fetching quotation code:", res);
        this.QuotationForm.get('quotationCode')?.setValue(res);
      },
      (error) =>{
        console.log("error while fetching quotation code", error);
      }
    )


    this.QuotationForm.get('customerId')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((customerName) =>{
        if(this.isCustomerSelected){
          return of([]);
        }
        this.noCustomer = false;
        if(!customerName?.trim()){
          this.customerList = [];
          return of([]);
        }
        return this.quotationService.fetchCustomerQuotation({customerName}).pipe(
          catchError((error)=>{
            if(error.status === 404){
              console.log("Customer API Error:", error);
              this.noCustomer = true;
            }
            return of([]);
          })
        )
      })
    )
    .subscribe(
      (response: any) =>{
        this.customerList = response.customer;
        this.isCustomerSelected = false;
      },
 
    );

    (this.QuotationForm.get('product') as FormArray).controls.forEach((group: AbstractControl, index: number) => {
      group.get('product')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((productName)=>{
          console.log(`Product Name Changed for Index ${index}:`, productName);
          if(this.isProductSelected){
            return of([]);
          }
          this.noResults = false;
          this.storeProductData = [];
          if(!productName?.trim()){
            return of([]);
          }
          return this.quotationService.fetchProductQuotation({productName}).pipe(
            catchError((error)=>{
              if(error.status === 404){
                this.noResults = true;
              }
              return of([]);
            })
          );
        })
      ).subscribe(
        (response: any) => {
          this.storeProductData = response.products || [];
          console.log("fteching product data from backend:", response);
          this.isProductSelected = false;
        },
      )
    })
  }

  onSelectCustomer(customer: any){
    console.log("customer:", customer);
    this.QuotationForm.get('customerId')?.setValue(customer.customerName);
    this.selectedCustomerId = customer.customerId;
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
    const productArray = this.QuotationForm.get('product') as FormArray;
    return productArray.controls.every((group) => group.valid);
  }

  toggleAdditionalCharges(){
    this.isChargeView = !this.isChargeView;
  }

  toggleTermsAndCondition(){
    this.isTermsView = !this.isTermsView;
  }

  compareQuantity(index: number, qty: any){
    if(qty > this.selectedProductQuantity){
      this.productDetails.at(index).get('productQuantity')?.setErrors({quantityExceed: true});
    }else{
      this.productDetails.at(index).get('productQuantity')?.setErrors(null);
    }
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


  addToBill(data: any, productId: any){
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
      
      console.log(data)
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


    this.productData = '';

  }


  deleteItem(product: any){
    this.productList = this.productList.filter((p) => p.product !== product.product);
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
    this.QuotationForm.reset();
  }
}
