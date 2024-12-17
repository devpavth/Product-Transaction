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
  selectedCompanyId: any;
  selectedCustomerGst: any;
  selectedCompanyGst: any;

  isProductSelected: boolean = false;
  noResults: boolean = false;
  productData: any;
  selectedProductId: any;
  selectedProductQuantity: any;
  productList: any[] = [];

  isChargeView: boolean = false;
  isTermsView: boolean = true;
  isSave: boolean = true;
  isEdit: boolean = false;

  additionalCharges: {label: string, value: number}[] = [];

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

  total18IGstAmount: number = 0;
  total12IGstAmount: number = 0;
  total5IGstAmount: number = 0;
  only18IGst: number = 0;
  only12IGst: number = 0;
  only5IGst: number = 0;
  isView18IGst: boolean = false;
  isView12IGst: boolean = false;
  isView5IGst: boolean = false;

  totalAmount: number = 0;
  totalIGstAmount: number = 0;
  totalcGstAmount: number = 0;
  totalsGstAmount: number = 0;

  Tc:any;

  previousDeliveryChargeTotal: number = 0;
  previousInstallChargeTotal: number = 0;
  

  private route = inject(Router);
  private quotationService = inject(QuotationService);

  QuotationForm: FormGroup;

    constructor(
      private fb: FormBuilder,
    ) {
      this.QuotationForm = this.fb.group({
        companyId: [], // i need to pass to backend(no need for UI)
        customerId: ['', Validators.required],
        bankId: [Validators.required],
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
        Charge: this.fb.group({
          deliveryCharge: [],
          installCharge: []
        }),
      });
    }

    get productDetails() {
      return this.QuotationForm.get('product') as FormArray;
    }

    showProductQuotationData() {
      console.log("called  by init method")
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

    // addProductQuotation() {
    //   this.productDetails.push(this.showProductQuotationData());
    // }


  get quotationTerms() {
    return this.QuotationForm.get('terms') as FormArray;
  }

  showQuotationTerms(){
    console.log("called  by init terms method")
    return this.fb.group({
      termCondition: [],
    });
  }

  // addQuotationTerms() {
  //   this.quotationTerms.push(this.showQuotationTerms());
  // }


  // get additionalCharge() {
  //   return this.QuotationForm.get('Charge') as FormArray;
  // }

  // showAdditionalCharge(){
  //   console.log("called  by init terms method")
  //   return this.fb.group({
  //     deliveryCharge: [],
  //     installCharge: []
  //   });
  // }

  // addAdditionalCharge() {
  //   this.additionalCharge.push(this.showAdditionalCharge());
  // }


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

    const storedUser = sessionStorage.getItem('userData');
    console.log("storedUser:", storedUser);

    if(storedUser){
      this.userData = JSON.parse(storedUser);
      console.log("getting user bank data for quotation:", this.userData);
    }

    this.fetchBankInfo();
    // this.calculateIGstTotal();
  }

  onSelectCustomer(customer: any){
    console.log("customer:", customer);
    this.QuotationForm.get('customerId')?.setValue(customer.customerName);
    this.selectedCustomerId = customer.customerId;
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

  addDeliveryCharges(chargeGroup: any){
    console.log("chargeGroup:", chargeGroup);

    const deliveryCharge = chargeGroup.deliveryCharge;
    const installCharge = chargeGroup.installCharge;


    console.log("Delivery Charge:", deliveryCharge);
    console.log("Installation Charge:", installCharge);

    this.additionalCharges = [
      {
        label: 'Delivery Charges',
        value: deliveryCharge
      },
      {
        label: 'Installation Charges',
        value: installCharge
      }
    ].filter((charge)=> charge.value !== null);

    const deliveryChargeTotal = deliveryCharge * (18 / 100) + deliveryCharge;
    // const installChargeTotal = installCharge * (18 / 100) + installCharge;

    // const chargesAmount = deliveryChargeTotal + installChargeTotal;


    let baseAmount = this.QuotationForm.get('totalAmount')?.value;

    baseAmount -= this.previousDeliveryChargeTotal

    this.totalAmount = baseAmount + deliveryChargeTotal;

    // let isDeliveryChargeAdded = false;
    // let isInstallChargeProcessed = false;

    // if(deliveryCharge > 0 && installCharge === null && !isDeliveryChargeAdded){
    //   console.log("isDeliveryChargeAdded1:", isDeliveryChargeAdded);
    //   this.totalAmount = baseAmount + deliveryChargeTotal;
    //   isDeliveryChargeAdded = true;
    //   console.log("isDeliveryChargeAdded1 after true:", isDeliveryChargeAdded);
    // }
    

    // else if(installCharge > 0 && !isInstallChargeProcessed){
    //   console.log("isDeliveryChargeAdded2:", isDeliveryChargeAdded);
    //   this.totalAmount = baseAmount + installChargeTotal;
    //   isInstallChargeProcessed = true;
    //   console.log("isDeliveryChargeAdded2 after installCharge:", isDeliveryChargeAdded);
    // }

    // else if(deliveryCharge > 0 && installCharge > 0 && !isDeliveryChargeAdded && !isInstallChargeProcessed){
    //   console.log("isDeliveryChargeAdded3:", isDeliveryChargeAdded); 
    //   this.totalAmount = baseAmount + deliveryChargeTotal + installChargeTotal;
    //   isDeliveryChargeAdded = true;
    //   isInstallChargeProcessed = true;
    //   console.log("isDeliveryChargeAdded3 after true:", isDeliveryChargeAdded);
    // }


    console.log("this.totalAmount:", this.totalAmount);

    console.log("QuotationForm (before charge):", this.QuotationForm.value);

    this.QuotationForm.patchValue({
      totalAmount: Number(this.totalAmount.toFixed(2))
    })

    this.previousDeliveryChargeTotal = deliveryChargeTotal;

    console.log("previousDeliveryChargeTotal:", this.previousDeliveryChargeTotal);

    console.log("QuotationForm (after charge):", this.QuotationForm.value);


    // chargeGroup.get('deliveryCharge')?.reset();
    // chargeGroup.get('installCharge')?.reset();

  }

  addInstallationCharges(chargeGroup: any){
    console.log("chargeGroup:", chargeGroup);

    const deliveryCharge = chargeGroup.deliveryCharge;
    const installCharge = chargeGroup.installCharge;


    console.log("Delivery Charge:", deliveryCharge);
    console.log("Installation Charge:", installCharge);

    this.additionalCharges = [
      {
        label: 'Delivery Charges',
        value: deliveryCharge
      },
      {
        label: 'Installation Charges',
        value: installCharge
      }
    ].filter((charge)=> charge.value !== null);

    const deliveryChargeTotal = deliveryCharge * (18 / 100) + deliveryCharge;
    const installChargeTotal = installCharge * (18 / 100) + installCharge;

    // const chargesAmount = deliveryChargeTotal + installChargeTotal;


    let baseAmount = this.QuotationForm.get('totalAmount')?.value;

    baseAmount -= this.previousInstallChargeTotal;

    this.totalAmount = baseAmount + installChargeTotal;

    console.log("this.totalAmount:", this.totalAmount);

    console.log("QuotationForm (before charge):", this.QuotationForm.value);

    this.QuotationForm.patchValue({
      totalAmount: Number(this.totalAmount.toFixed(2))
    })

    this.previousInstallChargeTotal = installChargeTotal;

    console.log("previousInstallChargeTotal:", this.previousInstallChargeTotal);

    console.log("QuotationForm (after charge):", this.QuotationForm.value);
  }

  
  saveTermsAndConditions(termsControl: AbstractControl){
    console.log("termsControl in saving:", termsControl);

    const termsCondition = termsControl.get('termCondition')?.value;
    this.Tc = termsCondition
    console.log("termsCondition:", termsCondition);
     termsControl.get('termCondition')?.disable();

    this.isSave = false;
    this.isEdit = true;

    console.log("QuotationForm (after patchProductFormArray):", this.QuotationForm.value);
    
  }

  editTermsAndConditions(termsControl: AbstractControl){
    console.log("termsControl in editing:", termsControl);
    termsControl.get('termCondition')?.enable();
    const termsCondition = termsControl.get('termCondition')?.value;
    this.Tc = termsCondition

    this.isSave = true;
    this.isEdit = false;

    console.log("QuotationForm (after patchProductFormArray):", this.QuotationForm.value);
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



    // if(getProductDetail.gstRate === 18){
    //   this.only18Gst = (getProductDetail.gstRate) / 2;
    //   this.total18GstAmount = this.productList.reduce(
    //     (total, p) => {
    //       return total + p.productPriceWithGst;
    //     }, 0
    //   )

    //   console.log("total18GstAmount:", this.total18GstAmount);

    //   this.total18GstAmount = this.total18GstAmount / 2;

    //   console.log("total18GstAmount:", this.total18GstAmount);
    // }


    // if(getProductDetail.gstRate === 12){
    //   this.only12Gst = (getProductDetail.gstRate) / 2;
    //   this.total12GstAmount = this.productList.reduce(
    //     (total, p) => {
    //       return total + p.productPriceWithGst;
    //     }, 0
    //   )

    //   console.log("total12GstAmount:", this.total12GstAmount);

    //   this.total12GstAmount = this.total12GstAmount / 2;

    //   console.log("total12GstAmount:", this.total12GstAmount);
    // }

    // this.calculateIGstTotal();
    this.calculateTaxableAmount();
    this.patchProductFormArray();

    this.productData = '';

    console.log("after productList:", this.productList);

    // const tax = this.productList.map(
    //   (pro) => {
    //     console.log("pro", pro);
    //     pro.productPrice * pro.productPrice,
    //     console.log("after pro:", pro);
    //   }
    // )

    // console.log("tax:", tax);

    // this.taxableAmount = getProductDetail.price * getProductDetail.productQuantity;
    // console.log("this.taxableAmount:", this.taxableAmount);

  }

  // get totalIGstAmount(){
  //   return (
  //     this.total18IGstAmount + this.total12IGstAmount + this.total5IGstAmount
  //   )
  // }

  // updateIGstTotal(){
  //   this.QuotationForm.patchValue({
  //     iGstTotal: this.totalIGstAmount,
  //   })
  // }

  // calculateIGstTotal(){
  //   this.totalIGstAmount = this.total18IGstAmount + this.total12IGstAmount + this.total5IGstAmount;

  //   console.log("totalIGstAmount:", this.totalIGstAmount);

  //   console.log("QuotationForm (before patch):", this.QuotationForm.value);

  //   this.QuotationForm.patchValue({
  //     iGstTotal: this.totalIGstAmount
  //   })


  //   console.log("QuotationForm (after patch):", this.QuotationForm.value);
  // }

  calculateTaxableAmount(){

    this.totalIGstAmount = this.total18IGstAmount + this.total12IGstAmount + this.total5IGstAmount;

    console.log("totalIGstAmount:", this.totalIGstAmount);

    this.totalcGstAmount = this.total18GstAmount + 
                            this.total12GstAmount + this.total5GstAmount;

    console.log("this.totalcGstAmount:", this.totalcGstAmount);

    this.totalsGstAmount = this.total18GstAmount + 
                            this.total12GstAmount + this.total5GstAmount;

    console.log("this.totalsGstAmount:", this.totalsGstAmount);

    console.log("QuotationForm (before patch):", this.QuotationForm.value);

    this.QuotationForm.patchValue({
      iGstTotal: Number(this.totalIGstAmount.toFixed(2)),
      taxTotal: Number(this.taxableAmount.toFixed(2)),
      totalAmount: Number(this.totalAmount.toFixed(2)),
      cGstTotal: Number(this.totalcGstAmount.toFixed(2)),
      sGstTotal: Number(this.totalsGstAmount.toFixed(2))
    })

    console.log("QuotationForm (after patch):", this.QuotationForm.value);
  }

  patchProductFormArray(){
  
    if(this.productList && this.productList.length){

      // while (productArray.length < this.productList.length) {
      //   productArray.push(this.showProductQuotationData());
      // }

      this.productList.forEach(
        (product, index) => {

          const productArray = this.QuotationForm.get('product') as FormArray;

          console.log("productArray:", productArray);

          while(index >= productArray.length){
            productArray.push(this.showProductQuotationData());
          }
        
          const productGroup = productArray.at(index) as FormGroup;
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
            }, { emitEvent: false })
          }else{
            productGroup.patchValue({
              product: product.product,
              productQuantity: product.quantity,
              price: product.price,
              gstRate: product.gstRate,
              totalAmount: Number(product.productPriceWithGst.toFixed(2)),
              taxAmount: Number(product.gstAmount.toFixed(2)),
              iGstAmount: Number(product.gstAmount.toFixed(2)),
            }, { emitEvent: false })
          }
          
        }
      )
    }

    console.log("QuotationForm (after patchProductFormArray):", this.QuotationForm.value);
  }


  deleteItem(product: any){
    this.productList = this.productList.filter((p) => p.product !== product.product);
  }

  onSubmit(data: any, companyId: any) {
    data.customerId = this.selectedCustomerId
    data.companyId = companyId;
    console.log("add product data:",data);
    
    let datas:any = [{
      "termCondition":this.Tc
    }]
    
    data.terms = datas
    
 console.log(data)
    this.quotationService.saveQuotation(data).subscribe(
      (res) => {
        console.log("quotation data sending to backend:", res);
        this.route.navigate(['/home/quotationList']);
      },(error) => {
        console.log("quotation data error sending to backend:", error);
      }
    )

  
  }
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
    this.QuotationForm.reset();
  }
}
