import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { QuotationService } from '../../../service/Quotation/quotation.service';

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
  isEdit: boolean = false;
  isSaveIcon: boolean = true;
  isDelete: boolean = false;

  private quotationService = inject(QuotationService);

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
  noCustomer: boolean = false;

  allProductDetails: any[] = [];
  selectedProductData: any;

  totalIGstAmount: number = 0;
  totalcGstAmount: number = 0;
  totalsGstAmount: number = 0;

  Tc: any;

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

  // gstValidationMsg: string = '';

  UpdateQuotationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    // private productService: ProductService,
    private route: Router
  ) {
    this.UpdateQuotationForm = this.fb.group({
      companyId: [],
      customerId: ['', Validators.required],
      // customerName: [],
      bankId: ['', Validators.required],
      quotationDate: ['', Validators.required],
      quotationCode: ['', Validators.required],
      quotationDueDate: ['', Validators.required],
      quotationReference: ['', Validators.required],
      quotationId: [],
      totalAmount: [],
      taxTotal: [],
      cGstTotal: [],
      sGstTotal: [],
      iGstTotal: [],
      product: this.fb.array([]),
      terms: this.fb.array([this.showQuotationTerms()]),
      Charge: this.fb.group({
        chargeId: [],
        deliveryCharge: [],
        installCharge: []
      }),
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
      quotationProductId: [],
      product: [],
      productQuantity: ['', Validators.required],
      price: ['', Validators.required],
      gstRate: ['', Validators.required],
      totalAmount: [0],
      taxAmount: [0],
      cGstAmount: [0],
      sGstAmount: [0],
      iGstAmount: [0]
    });
  }

  // addProductQuotation() {
  //   this.productDetails.push(this.showProductQuotationData());
  // }


  get quotationTerms() {
    return this.UpdateQuotationForm.get('terms') as FormArray;
  }

  showQuotationTerms(){
    console.log("called  by init terms method");
    return this.fb.group({
      termCondition: [`
      1. Tax:
      2. Warranty:
      3. Validity:
      4. Delivery:
      5. Payment:`,
      ],
      termId: [],
    });
  }

  addQuotationTerms() {
    this.quotationTerms.push(this.showQuotationTerms());
  }


  get additionalCharge() {
    return this.UpdateQuotationForm.get('terms') as FormArray;
  }

  // showAdditionalCharge(){
  //   console.log("called  by init terms method")
  //   return this.fb.group({
  //     deliveryCharge: ['', Validators.required],
  //     installCharge: ['', Validators.required]
  //   });
  // }

  // addAdditionalCharge() {
  //   this.additionalCharge.push(this.showAdditionalCharge());
  // }

  ngOnInit(): void {
    console.log("this.productData before patchValue:", this.productData);
    this.UpdateQuotationForm.patchValue(this.productData);
    console.log("this.productData:",this.productData);
    console.log("Form values after patchValue:", this.UpdateQuotationForm.value);

    const initalCustomerIdArray = this.UpdateQuotationForm.get('customerId')?.value;
    console.log("initalCustomerId:", initalCustomerIdArray);

    if(initalCustomerIdArray){
      console.log("this.productData.customerId:",this.productData.customerId);
      const initalCustomerId = initalCustomerIdArray[0].customerId;
      const selectedCustomer = this.productData.customerId.find(
        (customer: any) => customer.customerId === initalCustomerId
      );

      console.log("selectedCustomer", selectedCustomer);

      if(selectedCustomer){
        this.selectedCustomerGst = selectedCustomer.customerGst;
        this.UpdateQuotationForm.patchValue({
          customerId: selectedCustomer.customerName,
          // selectedCustomerGst: selectedCustomer.customerGst
        })
      }
    }

    const initalBankIdArray = this.UpdateQuotationForm.get('bankId')?.value;
    console.log("initalBankIdArray:", initalBankIdArray);

    if(initalBankIdArray){
      console.log("this.productData.bankId:",this.productData.bankId);
      const initalBankId = initalBankIdArray[0].bankId;
      const selectedBank = this.productData.bankId.find(
        (bank: any) => bank.bankId === initalBankId
      );

      console.log("selectedBank", selectedBank);
      console.log("selectedBank.bankName:", selectedBank.bankName);

      if(selectedBank){
        // this.selectedCustomerGst = selectedBank.customerGst;
        this.UpdateQuotationForm.patchValue({
          bankId: selectedBank.bankId,
          // selectedCustomerGst: selectedCustomer.customerGst
        })
      }
    }

    const products = this.productData.product;

    console.log("products:", products);

    const productFormArray = this.UpdateQuotationForm.get('product') as FormArray;
    // productFormArray.clear();

    console.log("productFormArray:", productFormArray);
    products.forEach(
      (product: any) => {
        // console.log("product.product:", product.product[0]?.productName);

        const productName = product.product[0]?.productName;
        console.log("productName:", productName);
        
        productFormArray.push(
          this.fb.group({
            product: [productName],
            productQuantity: [product.productQuantity],
            price: [product.price],
            gstRate: [product.gstRate],
            totalAmount: [product.totalAmount],
            taxAmount: [product.taxAmount],
            cGstAmount: [],
            sGstAmount: [],
            iGstAmount: [],
            gstAmount: (product.gstRate / 100) * product.price * product.productQuantity,
            productPrice: product.price * product.productQuantity,
            productPriceWithGst: (product.gstRate / 100 * product.price * product.productQuantity) + (product.price * product.productQuantity),
          })
        );
      }
    )

    console.log("Form values after patchValue:", this.UpdateQuotationForm.value);
    console.log("Product Form values after patchValue:", this.UpdateQuotationForm.get('product')?.value);

    this.allProductDetails = this.UpdateQuotationForm.get('product')?.value;

    this.UpdateQuotationForm.get('customerId')?.valueChanges
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



    (this.UpdateQuotationForm.get('product') as FormArray).controls.forEach((group: AbstractControl, index: number) => {
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



    const storedUser = sessionStorage.getItem('userData');
    console.log("storedUser:", storedUser);

    if(storedUser){
      this.userData = JSON.parse(storedUser);
      console.log("getting user bank data for quotation:", this.userData);
    }

    this.fetchBankInfo();
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
    this.selectedProductData = [product];
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
        title: 'Quotation',
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

    const matchingProduct = this.selectedProductData.find(
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
    this.calculateTaxableAmount();
    this.patchProductFormArray();

    this.productData = '';

    console.log("after productList:", this.productList);


  }

  saveTermsAndConditions(termsControl: AbstractControl){
    console.log("termsControl in saving:", termsControl);

    const termsCondition = termsControl.get('termCondition')?.value;
    this.Tc = termsCondition
    console.log("termsCondition:", termsCondition);
     termsControl.get('termCondition')?.disable();

    this.isSave = false;
    this.isEdit = true;

    console.log("QuotationForm (after patchProductFormArray):", this.UpdateQuotationForm.value);
    
  }

  editTermsAndConditions(termsControl: AbstractControl){
    console.log("termsControl in editing:", termsControl);
    termsControl.get('termCondition')?.enable();
    const termsCondition = termsControl.get('termCondition')?.value;
    this.Tc = termsCondition

    this.isSave = true;
    this.isEdit = false;

    console.log("QuotationForm (after patchProductFormArray):", this.UpdateQuotationForm.value);
  }



  clearTermsAndConditions(termsControl: AbstractControl){
    console.log("termsData:", termsControl);

    termsControl.reset();

    // termsData = null;

    //console.log("termsData:", termsControl);

    termsControl.get('termCondition')?.enable();

    this.isSave = true;
    this.isEdit = false;
  }

  calculateTaxableAmount(){

    this.totalIGstAmount = this.total18IGstAmount + this.total12IGstAmount + this.total5IGstAmount;

    console.log("totalIGstAmount:", this.totalIGstAmount);

    this.totalcGstAmount = this.total18GstAmount + 
                            this.total12GstAmount + this.total5GstAmount;

    console.log("this.totalcGstAmount:", this.totalcGstAmount);

    this.totalsGstAmount = this.total18GstAmount + 
                            this.total12GstAmount + this.total5GstAmount;

    console.log("this.totalsGstAmount:", this.totalsGstAmount);

    console.log("QuotationForm (before patch):", this.UpdateQuotationForm.value);

    this.UpdateQuotationForm.patchValue({
      iGstTotal: Number(this.totalIGstAmount.toFixed(2)),
      taxTotal: Number(this.taxableAmount.toFixed(2)),
      totalAmount: Number(this.totalAmount.toFixed(2)),
      cGstTotal: Number(this.totalcGstAmount.toFixed(2)),
      sGstTotal: Number(this.totalsGstAmount.toFixed(2))
    })

    console.log("QuotationForm (after patch):", this.UpdateQuotationForm.value);
  }

  patchProductFormArray(){
  
    if(this.productList && this.productList.length){

      // while (productArray.length < this.productList.length) {
      //   productArray.push(this.showProductQuotationData());
      // }

      this.productList.forEach(
        (product, index) => {

          const productArray = this.UpdateQuotationForm.get('product') as FormArray;

          console.log("productArray:", productArray);

          // while(index >= productArray.length){
          //   productArray.push(this.showProductQuotationData());
          // }
        
          const productGroup = this.showProductQuotationData();
          if(this.selectedCustomerGst.slice(0,2) === this.selectedCompanyGst.slice(0,2)){
            productGroup.patchValue({
              product: product.product,
              productQuantity: product.quantity,
              price: product.price,
              gstRate: product.gstRate,
              totalAmount: Number(product.productPriceWithGst.toFixed(2)),
              taxAmount: Number(product.gstAmount.toFixed(2)),
              cGstAmount: Number((product.gstAmount / 2).toFixed(2)),
              sGstAmount: Number((product.gstAmount / 2).toFixed(2))
            }, { emitEvent: false });
          }else{
            productGroup.patchValue({
              product: product.product,
              productQuantity: product.quantity,
              price: product.price,
              gstRate: product.gstRate,
              totalAmount: Number(product.productPriceWithGst.toFixed(2)),
              taxAmount: Number(product.gstAmount.toFixed(2)),
              iGstAmount: Number(product.gstAmount.toFixed(2)),
            }, { emitEvent: false });
           
          }
          productArray.push(productGroup);
          
        }
      )
    }

    console.log("QuotationForm (after patchProductFormArray):", this.UpdateQuotationForm.value);
  }

  deleteItem(product: any){
    this.allProductDetails = this.allProductDetails.filter((p) => p.product !== product.product);
  }


  fetchBankInfo(){
    const companyId = this.userData.companyId;
    console.log("companyId:", companyId);

    this.selectedCompanyId = this.userData.companyId;

    console.log("selectedCompanyId:", this.selectedCompanyId);

    this.quotationService.fetchBankDetails(companyId).subscribe(
      (res: any) => {
        console.log("fetching bank details:", res);
        console.log("fetching bank name details:", res.bankName);
        this.bankList = res;
      }
    )
  }

 
  onUpdateProduct(data: any) {
    console.log("Update quotation product data:",data);
    let id = this.UpdateQuotationForm.get('quotationId')?.value;
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
