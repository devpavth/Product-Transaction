import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { CustomerService } from '../../../service/Customer/customer.service';
import { TransactionService } from '../../../service/Transaction/transaction.service';
import { catchError, debounceTime, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import { log } from 'node:console';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  _branch: any;
  inwardFormHeader: FormGroup;
  inwardForm: FormGroup;

  customerList: any[] = [];

  isBox: boolean = false;
  gstPercentages: number[] = [0, 5, 12, 18, 28];
  units: { id: number; name: string; term: string }[] = [
    { id: 1, name: 'Kg', term: 'Kilograms' },
    { id: 2, name: 'L', term: 'Liters' },
    { id: 3, name: 'M', term: 'Meter' },
    { id: 4, name: 'Unit', term: 'Piece' },
    { id: 5, name: 'Lt', term: 'Liters' },
    { id: 6, name: 'Feet', term: 'Feet' },
    { id: 7, name: 'Roll', term: 'Roll' },
    { id: 8, name: 'Dcm', term: 'Decimeters' },
    { id: 9, name: 'Bag', term: 'Bag' },
    { id: 10, name: 'Pair', term: 'Pair' },
    { id: 11, name: 'Tin', term: 'Tin' },
    { id: 12, name: 'Sheet', term: 'Sheet' },
    { id: 13, name: 'Ream', term: 'Ream' },
    { id: 14, name: 'No', term: 'Number' },
    { id: 15, name: 'Meter', term: 'Meter' },
    { id: 200, name: 'Box', term: 'Box' },
  ];
  productData: any;

  productList: any[] = [];

  storeProductData: any[] = [];
  noResults: boolean = false;
  noVendor: boolean = false;
  noCustomer: boolean = false;
  selectedCustomerId: any;

  productView: boolean = false;

  vendorList: any[] = [];

  header: any;

  headerView: any;

  totalItem: number = 0;

  idToPass: string | null = null;
  today: string = '';

  selectedProductId: any;
  selectedProductQuantity: any;
  isProductSelected: boolean = false;
  selectedVendorId: any;

  isVendorSelected: boolean = false;
  isCustomerSelected: boolean = false;
  valueChangesSubscription: Subscription | undefined;

  isSuccess: boolean = false;
  transactionID: object = {};

  private customerService = inject(CustomerService);
  private transactionService = inject(TransactionService);

  constructor(
    // private branchService: BranchService,
    // private productService: ProductService,
    private fb: FormBuilder,
    // private shared: SharedServiceService,
    private vendorService: VendorService,
  ) {
    this.inwardFormHeader = this.fb.group({
      
      vendorId: [''],
      customerId: [''],
      
    });
    this.inwardForm = this.fb.group({
      inwardFromCode: [''],
      createdDate: [],
      CustomerOrVendor: [],
      searchInput: [],
      product_details:[],
      product_form : this.fb.array([this.showBankData()])
    })
    
    if (this.isBox) {
      this.inwardForm.addControl(
        'totalPieces',
        this.fb.control(null, Validators.required),
      );
    }
    this.inwardForm.get('prdUnit')?.disable();
  }



  get productDetails() {
    return this.inwardForm.get('product_form') as FormArray;
  }

  showBankData() {
    console.log("called  by inti method")
    return this.fb.group({
      product: [],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      gst: ['', Validators.required],
    });
  }

  addbank() {
    this.productDetails.push(this.showBankData());
  }
  
  ngOnInit() {
    this.fetchAllBranch();
    // this.fetchVendorList();
    // this.fetchCustomerList();
    console.log(this.inwardForm.value)
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    
    this.inwardForm.get('searchInput')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((productName) =>{
      //     //console.log("productName logging:", productName);
          if(this.isProductSelected){
        //     //console.log("product already selected. Skipping API call.");
            return of([]);
          }
          this.noResults = false;
          this.storeProductData = [];
          if(!productName?.trim()){
           //  //console.log("Empty input, clearing results.");
            return of([]);
          }
          return this.transactionService.searchTransaction({productName}).pipe(
            catchError((error) =>{
            //   //console.log("API Error:", error);
              if (error.status === 404) {
                this.noResults = true;
              }
              return of([]);
            })
          );
        })
      )
      .subscribe(
        (response : any) => {
          this.storeProductData = response.products || [];
        //   //console.log("fetching product details:", this.storeProductData);
          // this.noResults = this.storeProductData.length === 0;
          this.isProductSelected = false;
        },
        // (error)=>{
        //   if(error.status == 404){
        //      //console.log("Error while fetching products:", error);
        //     this.noResults = true;
        //   } else{
        //      //console.log("Unexpected error:", error);
        //   }
        //   this.storeProductData = [];
        // } 
      )

      this.inwardForm.get('inwardFromCode')?.valueChanges.subscribe((inwardFromCode) => {
       //  //console.log("inwardFromCode:", inwardFromCode);
        if (this.valueChangesSubscription) {
         //  //console.log("this.valueChangesSubscription:",this.valueChangesSubscription);
          this.valueChangesSubscription.unsubscribe();
         //  //console.log("after unsubscribe this.valueChangesSubscription:",this.valueChangesSubscription);
        }

        if(inwardFromCode == 268){
          this.handleInwardApiCall();
        //   //console.log("handleInwardApiCall:", this.handleInwardApiCall());
        }else if(inwardFromCode == 269){
          this.handleOutwardApiCall();
        }
      
      });
      
  }


  handleInwardApiCall(){
    if (this.valueChangesSubscription) {
     //  //console.log("this.valueChangesSubscription in handleInwardApiCall:",this.valueChangesSubscription);
      this.valueChangesSubscription.unsubscribe();
     //  //console.log("after unsubscribe this.valueChangesSubscription in handleInwardApiCall:",this.valueChangesSubscription);
    }

    this.valueChangesSubscription = this.inwardForm.get('CustomerOrVendor')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((vendorName) =>{
       //  //console.log("vendorName in transaction:",vendorName);
        if(this.isVendorSelected){
         //  //console.log("Vendor already selected. Skipping API call.");
          return of([]);
        }

       //  //console.log("VendorName logging:", vendorName);
        this.noVendor = false;
        
        if(!vendorName?.trim()){
         //  //console.log("Empty input, clearing results.");
          this.vendorList = [];
          return of([]);
        }
        // const params = {VendorName : VendorName};
        return this.transactionService.fetchInwardVendor({vendorName}).pipe(
          catchError((error) =>{
          //   //console.log("Vendor API Error:", error);
            if (error.status === 404) {
              this.noVendor = true;
            }
            return of([]);
          })
        );
      })
    )
    .subscribe(
      (response : any) => {
        if(response?.vendor?.length){
          this.vendorList = response.vendor;
        //   //console.log("fetching vendor details:", this.vendorList);
        }else{
          this.vendorList = [];
        }
        
        // this.noResults = this.storeProductData.length === 0;
        this.isVendorSelected = false;
      },
    )
  }


  handleOutwardApiCall(){
    this.valueChangesSubscription = this.inwardForm.get('CustomerOrVendor')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((customerName) =>{
      //   //console.log("customerName in transaction:",customerName);
        if(this.isCustomerSelected){
         //  //console.log("customerName already selected. Skipping API call.");
          return of([]);
        }

         //  //console.log("CustomerName logging:", customerName);
        this.noCustomer = false;
        // this.vendorList = [];
        if(!customerName?.trim()){
        //   //console.log("Empty input, clearing results.");
          this.customerList = [];
          return of([]);
        }
        // const params = {VendorName : VendorName};
        return this.transactionService.fetchOutwardCustomer({customerName}).pipe(
          catchError((error) =>{
          //   //console.log("Customer API Error:", error);
            if (error.status === 404) {
              this.noCustomer = true;
            }
            return of([]);
          })
        );
      })
    )
    .subscribe(
      (response : any) => {
        this.customerList = response.customer;
         //console.log("fetching customer details:", this.customerList);        
        // this.noResults = this.storeProductData.length === 0;
        this.isCustomerSelected = false;
      },
    )
  }

  fetchAllBranch() {
    // this.branchService.getBranch().subscribe((res) => {
    //    //console.log(res);

    //   this._branch = res;
    // });
  }

  

  onSelectVendor(vendor: any){
    this.inwardForm.get('CustomerOrVendor')?.setValue(vendor.vendorName);
    this.selectedVendorId = vendor.vendorId;
    this.isVendorSelected = true;
    this.vendorList = [];
     //console.log("checking vendorList:", this.vendorList);
  }

  onSelectCustomer(customer: any){
    this.inwardForm.get('CustomerOrVendor')?.setValue(customer.customerName);
    this.selectedCustomerId = customer.customerId;
    this.isCustomerSelected = true;
    this.customerList = [];
     //console.log("checking vendorList:", this.customerList);
  }

  onSelectProduct(product: any){
    // const combinedValue = `${product.productName} - ${product.productDescription} - ${product.productModel}`
    // this.inwardForm.get('searchInput')?.setValue('');
     //console.log("product:",product);
     //console.log("product with productId:",product.productId);
    this.isProductSelected = true;
    this.selectedProductId = product.productId;
    this.selectedProductQuantity = product.productQuantity;
    this.productData = [product];
    this.storeProductData = [];
  }

  compareQuantity(index: number,qty: any){

    const txnType = this.inwardForm.get('inwardFromCode')?.value

    console.log("txntype:", txnType);

    if (txnType === '269'){
      if(qty > this.selectedProductQuantity){
        //console.log("user typed quantity is greater than current available quantity");
       this.productDetails.at(index).get('quantity')?.setErrors({quantityExceed: true});
      } else{
        //console.log("Quantity is valid.");
       this.productDetails.at(index).get('quantity')?.setErrors(null);
      }
    }
     //console.log("qty", qty);
    // const currentQuantity = this.storeProductData.filter(
    //   (pro: any) => pro.productQuantity
    // )
    //  //console.log("currentQuantity:", currentQuantity);
    
  }

  // fetchProductData() {

  //   const searchInputValue = this.inwardForm.get('searchInput')?.value || '';

  //    //console.log("search Input:", searchInputValue);
  //   const searchCriteria: { [key: string]: string } = {};

  //   if (this.isProductName(searchInputValue)) {
  //     searchCriteria['productName'] = searchInputValue;
  //   } 
  //   // else if (this.isProductModel(searchInputValue)) {
  //   //   searchCriteria['productModel'] = searchInputValue;
  //   // }  else {
  //   //   searchCriteria['productDescription'] = searchInputValue;
  //   // }
  
  //    //console.log("Search criteria being sent:", searchCriteria);
    
    
  //   this.transactionService.searchTransaction(searchCriteria).subscribe((res: any) => {
  //      //console.log("fetching product data from search",res.products);
  //     this.productData = Array.isArray(res.products) ? res.products : [];
  //      //console.log("to fetch product data for productId:", this.productData);
  //      //console.log("for productId:",this.productData.products);

  //     while (this.productDetails.length > 0){
  //       this.productDetails.removeAt(0);
  //     }

  //     this.productData.forEach((product: any)=>{
  //      //console.log("Processing product data:", product);
  //       const productGroup = this.showBankData();
  //       productGroup.patchValue({
  //         product: product.productId,
  //       })
  //       this.productDetails.push(productGroup);
  //     })

  //     // this.inwardForm.patchValue({
  //     //   productId: this.productData.productId,
  //     //   prdUnit: this.productData.prdUnit,

  //     //   prdQty: this.productData.prouctId,
  //     //   purchasedPrice: this.productData.prdPurchasedPrice,
  //     //   gstPercentage: this.productData.prdGstPct,
  //     // });
      
  //     // if (this.inwardForm.get('prdUnit')?.value == 200) {
  //     //   this.isBox = true;
  //     //   this.updateForm();
  //     // }
  //   },
  //   (error) => {
  //      //console.error("Error in search field:", error);
  //   });
  // }

  // isProductName(input: string): boolean {
  //   return /^[a-zA-Z\s]+$/.test(input); 
  // }

  // isProductModel(input: string): boolean {
  //   return /^[A-Z0-9]+$/.test(input); 
  // }

  // isProductDescription(input: string){
  //   return /^[a-zA-Z\s]+$/.test(input); 
  // }
  
  // fetchVendorList() {
  //   this.vendorService.getAllVendor().subscribe((res) => {
  //      //console.log("vendor data from backend",res);
  //     this.vendorList = res;
  //      //console.log("fetching vendor list:", this.vendorList.vendorId);
  //     // let id = this.inwardForm.get('vendorId')?.value;
  //     //  //console.log("checking id...:",id);
  //     const gettingVendorId = this.vendorList.map((vendor: any)=>{
  //       return vendor.vendorId;
  //     })
  //      //console.log("checking id...:", gettingVendorId);
  //   });
  // }

  // fetchCustomerList() {
  //   this.customerService.getAllCustomer().subscribe((res) => {
  //      //console.log("customer data from backend",res);
  //     this.customerList = res;
  //      //console.log("fetching customer list:",this.customerList.customerId);

  //     const customerIds = this.customerList.map((cus: any)=>{
  //       return cus.customerId;
  //     })
  
  //      //console.log("All customer Ids:", customerIds);

  //   },(error) => {
  //      //console.log("error while getting customer details:",error);
  //   });
  // }

  ifBox(data: any) {
     //console.log(data);
    this.isBox = data == 200;

    this.updateForm();
  }
  updateForm() {
    if (this.isBox && !this.inwardForm.contains('totalPieces')) {
      this.inwardForm.addControl(
        'totalPieces',
        this.fb.control(null, Validators.required),
      );
    } else if (!this.isBox && this.inwardForm.contains('totalPieces')) {
      this.inwardForm.removeControl('totalPieces');
    }
  }

  calculateBoxItem() {
    this.totalItem =
      this.inwardForm.get('prdQty')?.value *
      this.inwardForm.get('itemprebox')?.value;
     //console.log(this.totalItem);
    this.inwardForm.patchValue({ totalPieces: this.totalItem });
  }

  addProductList(data: any, productId: any) {


   
     //console.log("Adding item to the product list:", data);

     //console.log("selected productId:", productId);
    console.log(data);
    console.log(productId);
     //console.log("Initial before product_details:", data.product_details);

    if (!productId) {
       //console.log("Invalid productId. Cannot add product.");
      return;
    }


    if (!data.product_details || !Array.isArray(data.product_details)) {
      data.product_details = [];
    }

    // data.product_details = data.product_details.filter((product: any) => product.product !== null);

     //console.log("Initial product_details:", data.product_details)

    
     // Remove any blank or invalid entries
    // data.product_details = data.product_details.filter(
    //   (product: any) => product.product && product.quantity !== null && product.price !== null
    // );

    //  //console.log("Cleaned product_details:", data.product_details);

    // data.product_details[0].product = productId;


    // this.productView = true;

    const getProductDetail = {...data.product_form?.[0], product: productId};
    console.log("getProductDetail:",getProductDetail);

    // if (!getProductDetail || !getProductDetail.product) {
    //    //console.error("No valid product details found in data.");
    //   return;
    // }

    var collectionItem:any = [];
    var temp = getProductDetail
    collectionItem.push(temp);
    console.log(collectionItem)
  

    const newProductDetail = {
      product: productId,
      quantity: data.product_form?.[0]?.quantity,
      gst: data.product_form?.[0]?.gst,
      price: data.product_form?.[0]?.price
    };

     //console.log("newProductDetail:",newProductDetail);

     //console.log(" //console data:", data);
  
  const existingProductIndex = data.product_details.findIndex(
    (product: any) => product.product === productId
  );

   //console.log("existingProductIndex:", existingProductIndex);

  
  const matchingProduct = this.productData.find(
    (product: any) => product.productId === getProductDetail.product,
  )


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

   //console.log("matchingProduct:", matchingProduct);
    

  if (existingProductIndex !== -1) {
    // Update the existing product details
    data.product_details[existingProductIndex] = {
      ...data.product_details[existingProductIndex],
      ...newProductDetail,
    };
     //console.log(`Updated existing product at index ${existingProductIndex}:`, data.product_details[existingProductIndex]);
  } else {
    // Add the new product to the array
    console.log("reach at end")
    const oldProductData = [...data.product_details]
    data.product_details = [...oldProductData,newProductDetail];
    
    console.log(data)
     //console.log("Added new product:", newProductDetail);
    this.productList.push({
          ...data,
          product: getProductDetail.product,
          gst: getProductDetail.gst,
          quantity: getProductDetail.quantity,
          price: getProductDetail.price,
          productCode: matchingProduct.productCode,
          productName: matchingProduct.productName,
          productModel: matchingProduct.productModel,
          productQuantity: getProductDetail.quantity,
          gstAmount: (getProductDetail.gst / 100) * getProductDetail.price * getProductDetail.quantity,
          productPrice: getProductDetail.price * getProductDetail.quantity,
          productPriceWithGst: (getProductDetail.gst / 100 * getProductDetail.price * getProductDetail.quantity) + (getProductDetail.price * getProductDetail.quantity),
        });
  }


   //console.log("Updated product_details:", data.product_details);


     //console.log("newProductDetail.product:", newProductDetail.product);

  

    data.product_details.forEach((product: any) =>
       console.log("Comparing product in array:", product.product, "with newProductDetail:", newProductDetail.product)
    );


    data.product_form.forEach((product: any, index: number) => {
       console.log(`Object at index ${index}:`, product);
       console.log("product.product value:", product.product);
    });
     

   


    

    // if (existingProductIndex !== -1) {
    //   this.productDetails.at(existingProductIndex).patchValue(newProductDetail);
    //   //  //console.log("Product not found, adding new product to array.");
    //   // data.product_details.push(newProductDetail);
    //   // Product exists, update the quantity and total
    //   //  //console.log("Updating existing product in product_details array...");
    //   // const existingProduct = data.product_details[existingProductIndex];
    //   //  //console.log("existingProduct:",existingProduct);
    //   // existingProduct.quantity += newProductDetail.quantity; // Update quantity
    //   // existingProduct.gst = newProductDetail.gst;
    //   // existingProduct.price += newProductDetail.price;
    //   // data.product_details[existingProductIndex] = existingProduct;
    //   // existingProduct.total = this.shared.gstCalculation(
    //   //   existingProduct.prdQty,
    //   //   existingProduct.purchasedPrice,
    //   //   existingProduct.gstPercentage,
    //   // ); // Recalculate total

    //   // Update the product in the productList array
      
    // } else {
    //   this.productDetails.push(this.fb.group(newProductDetail));
    //   //  //console.log("Product found, updating existing product.");
    //   // data.product_details[existingProductIndex] = { ...data.product_details[existingProductIndex], ...newProductDetail };
    //   //  //console.log("Adding new product to product_details array...");
    //   // data.product_details.push(newProductDetail);
    //   // let total = this.shared.gstCalculation(
    //   //   data.prdQty,
    //   //   data.purchasedPrice,
    //   //   data.gstPercentage,
    //   // );
    //   this.productList.push({
    //     ...data,
    //     product: getProductDetail.product,
    //     gst: getProductDetail.gst,
    //     quantity: getProductDetail.quantity,
    //     price: getProductDetail.price,
    //     productCode: matchingProduct.productCode,
    //     productName: matchingProduct.productName,
    //     productModel: matchingProduct.productModel,
    //     productQuantity: getProductDetail.quantity,
    //     gstAmount: (getProductDetail.gst / 100) * getProductDetail.price * getProductDetail.quantity,
    //     productPrice: getProductDetail.price * getProductDetail.quantity,
    //     productPriceWithGst: (getProductDetail.gst / 100 * getProductDetail.price * getProductDetail.quantity) + (getProductDetail.price * getProductDetail.quantity),
    //   });
    //   //  //console.log(total);
    // }


    // data.product_details = data.product_details.filter(
    //   (product: any) => product.product !== null && product.product !== undefined
    // );

     //console.log("Updated product_details:", this.productDetails.value);


     //console.log("Updated product_details array:", data.product_details);

     //console.log("Updated Form Data:", data);

    // this.resetFields();


    this.productData = '';
    this.isBox = false;
  }



  

// resetFields() {
//   this.inwardForm.get('searchInput')?.reset();
//   const productDetailsArray = this.inwardForm.get('product_details') as FormArray;

//   // Reset the first product in the FormArray
//   if (productDetailsArray.length > 0) {
//     const firstProduct = productDetailsArray.at(0) as FormGroup;

//     firstProduct.get('gst')?.reset();
//     firstProduct.get('price')?.reset();
//     firstProduct.get('quantity')?.reset();
//   }
// }


  get totalAmount(): number{
    return this.productList.reduce(
      (total, product) => total + product.productPrice,
      0
    )
  }

  get totalGst(){
    return this.productList.reduce(
      (total, product) => total + product.gstAmount,
      0
    )
  }

  get grandTotal(){
    return this.productList.reduce(
      (total, product) => total + product.productPriceWithGst,
      0
    )
  }

  // inwardHeader(data: any) {
  //   //  //console.log(data);

  //   this.header = data;
  //   let branch: any[] = this._branch;
  //   let vendor: any[] = this.vendorList;
  //   let branchDetails = branch.find((f) => f.branchId == data.branchId);
  //   if (branchDetails) {
  //     this.header.branchName = branchDetails.branchName;
  //   }
  //   let vendorDetails = vendor.find((v) => v.vendorId == data.vendorId);
  //   if (this.inwardFormHeader.get('inwardFromCode')?.value == 269) {
  //     let vendorDetails = vendor.find((v) => v.vendorId == data.vendorId);
  //     this.header.vendorName = vendorDetails.vendorName;
  //   } else if (this.inwardFormHeader.get('inwardFromCode')?.value == 298) {
  //     let vendorDetails = branch.find((v) => v.branchId == data.vendorId);
  //     this.header.vendorName = vendorDetails.branchName;
  //   }
  //    //console.log(this.header);
  // }
  inwardHeader(data: any) {
    //  //console.log(data);

    this.header = data;
    let branch: any[] = this._branch;
    let vendor: any[] = this.vendorList;

    let branchDetails = branch.find((f) => f.branchId == data.vendorId);
    let vendorDetails = vendor.find((v) => v.vendorId == data.vendorId);
    let branchDetails1 = branch.find((f) => f.branchId == data.branchId);
    if (branchDetails1) {
      this.header.branchName = branchDetails1.branchName;
    }
    if (this.inwardFormHeader.get('inwardFromCode')?.value == 269) {
      if (vendorDetails) {
        this.header.vendorName = vendorDetails.vendorName;
      }
    } else if (this.inwardFormHeader.get('inwardFromCode')?.value == 268) {
      if (branchDetails) {
        this.header.vendorName = branchDetails.branchName;
      }
    }

     //console.log(this.header);
  }

  deleteHeader() {
    this.header = '';
  }

  closeSuccess(data: boolean) {
    this.isSuccess = data;
    this.resetComponent();
  }

  onSubmit() {
    let finalList = { ...this.header, transPrdDetails: this.productList };
     //console.log(finalList);
    // this.productService.addInward(finalList).subscribe(
    //   (res) => {
    //      //console.log(res);
    //   },
    //   (error) => {
    //     if (error.status == 200) {
    //        //console.log(error);

    //       this.isSuccess = true;
    //       let successData = { show: 2, text: error.error.text };
    //       this.transactionID = successData;
    //     }
    //      //console.log(error.error.text);
    //   },
    // );
  }

  saveInwardOrOutward(data: any, customerId: any, vendorId: any){
    // const CustomerOrVendor = this.selectedCustomerId;
     //console.log("customerId in while saving outward:",customerId)
    /*  data.product_details = this.productList.map(item =>{
      return {product: item.product,
      quantity: item.productQuantity,
      price: item.price,
      gst: item.gst
     }}) */
   
    

     
      delete data.product_form
      data.CustomerOrVendor = customerId;
      data.CustomerOrVendor = vendorId;
     //console.log("data.CustomerOrVendor :",data.CustomerOrVendor)

    const txnType = this.inwardForm.get('inwardFromCode')?.value;
     //console.log("transaction type:", txnType);

    if(txnType === '268'){
      data.CustomerOrVendor = vendorId;
    }

    if(txnType === '269'){
      data.CustomerOrVendor = customerId;
    }

console.log(data)
    if (txnType === '268') {
      this.transactionService.addTransaction(data).subscribe((res)=>{
         //console.log("saving transaction to the database:", res);
        this.inwardForm.reset();
        this.productList = [];
      },(error) => {
         //console.log("error while saving data to the database:", error);
        this.productList = [];
      })
    }
    

    if (txnType === '269') {
      this.transactionService.addOutwardTransaction(data).subscribe((res)=>{
         //console.log("saving outward transaction to the database:", res);
        this.inwardForm.reset();
        this.productList = [];
      }, (error) => {
         //console.log("error while fetching outward data:", error);
        this.productList = [];
      })
    }  
  }

  saveInwardOrOutward1(data: any, customerId: any, vendorId: any){
   console.log(this.productList);
   console.log(this.productList);
   console.log(this.productList);
  }

  deleteItem(product: any){
    this.productList = this.productList.filter(p => p.product !== product.product);
    // this.inwardForm.reset();
     //console.log("Deleting product item:", this.productList);
  }

  resetComponent() {
    this.inwardFormHeader.reset();
    this.inwardForm.reset();
    this.isBox = false;
    this.header = null;
    this.productData = null;
    this.productList = [];
    this.totalItem = 0;
    this.transactionID = {};

    // Fetch initial data if necessary
    this.fetchAllBranch();
    // this.fetchVendorList();
  }
}

