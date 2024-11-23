import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { CustomerService } from '../../../service/Customer/customer.service';
import { TransactionService } from '../../../service/Transaction/transaction.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  _branch: any;
  inwardFormHeader: FormGroup;
  inwardForm: FormGroup;

  customerList: any;

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

  productView: boolean = false;

  vendorList: any;

  header: any;

  headerView: any;

  totalItem: number = 0;

  idToPass: string | null = null;
  today: string = '';

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
      
      product_details: this.fb.array([this.showBankData()]),
    });
    if (this.isBox) {
      this.inwardForm.addControl(
        'totalPieces',
        this.fb.control(null, Validators.required),
      );
    }
    this.inwardForm.get('prdUnit')?.disable();
  }
  ngOnInit() {
    this.fetchAllBranch();
    this.fetchVendorList();
    this.fetchCustomerList();

    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    // this.inwardFormHeader.valueChanges.subscribe((formValues) => {
    //   console.log("Form values updated reactively:", formValues);
  
    //   if (formValues.vendorId) {
    //     this.idToPass = formValues.vendorId;
    //   } else if (formValues.customerId) {
    //     this.idToPass = formValues.customerId;
    //   }
  
    //   if (this.idToPass) {
    //     console.log("ID to pass to addTransaction method (reactive):", this.idToPass);
    //   }
    // });
  }
  fetchAllBranch() {
    // this.branchService.getBranch().subscribe((res) => {
    //   console.log(res);

    //   this._branch = res;
    // });
  }

  get productDetails() {
    return this.inwardForm.get('product_details') as FormArray;
  }

  showBankData() {
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

  fetchProductData() {

    const searchInputValue = this.inwardForm.get('searchInput')?.value || '';

    console.log("search Input:", searchInputValue);
    const searchCriteria: { [key: string]: string } = {};

    if (this.isProductName(searchInputValue)) {
      searchCriteria['productName'] = searchInputValue;
    } else if (this.isProductModel(searchInputValue)) {
      searchCriteria['productModel'] = searchInputValue;
    }  else {
      searchCriteria['productDescription'] = searchInputValue;
    }
  
    console.log("Search criteria being sent:", searchCriteria);
    
    
    this.transactionService.searchTransaction(searchCriteria).subscribe((res: any) => {
      console.log("fetching product data from search",res.products);
      this.productData = Array.isArray(res.products) ? res.products : [];
      console.log("to fetch product data for productId:",this.productData);
      console.log("for productId:",this.productData.products);

      while (this.productDetails.length > 0){
        this.productDetails.removeAt(0);
      }

      this.productData.forEach((product: any)=>{
      console.log("Processing product data:", product);
        const productGroup = this.showBankData();
        productGroup.patchValue({
          product: product.productId,
        })
        this.productDetails.push(productGroup);
      })

      // this.inwardForm.patchValue({
      //   productId: this.productData.productId,
      //   prdUnit: this.productData.prdUnit,

      //   prdQty: this.productData.prouctId,
      //   purchasedPrice: this.productData.prdPurchasedPrice,
      //   gstPercentage: this.productData.prdGstPct,
      // });
      
      // if (this.inwardForm.get('prdUnit')?.value == 200) {
      //   this.isBox = true;
      //   this.updateForm();
      // }
    },
    (error) => {
      console.error("Error in search field:", error);
    });
  }

  isProductName(input: string): boolean {
    return /^[a-zA-Z\s]+$/.test(input); 
  }

  isProductModel(input: string): boolean {
    return /^[A-Z0-9]+$/.test(input); 
  }

  // isProductDescription(input: string){
  //   return /^[a-zA-Z\s]+$/.test(input); 
  // }
  
  fetchVendorList() {
    this.vendorService.getAllVendor().subscribe((res) => {
      console.log("vendor data from backend",res);
      this.vendorList = res;
      console.log("fetching vendor list:", this.vendorList.vendorId);
      // let id = this.inwardForm.get('vendorId')?.value;
      // console.log("checking id...:",id);
      const gettingVendorId = this.vendorList.map((vendor: any)=>{
        return vendor.vendorId;
      })
      console.log("checking id...:", gettingVendorId);
    });
  }

  fetchCustomerList() {
    this.customerService.getAllCustomer().subscribe((res) => {
      console.log("customer data from backend",res);
      this.customerList = res;
      console.log("fetching customer list:",this.customerList.customerId);

      const customerIds = this.customerList.map((cus: any)=>{
        return cus.customerId;
      })
  
      console.log("All customer Ids:", customerIds);

    },(error) => {
      console.log("error while getting customer details:",error);
    });
  }

  ifBox(data: any) {
    console.log(data);
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
    console.log(this.totalItem);
    this.inwardForm.patchValue({ totalPieces: this.totalItem });
  }

  addProductList() {
    console.log("Adding item to the product list:");

    this.productView = true;

    

    // console.log(this.productList);

    // this.inwardForm.reset();
    // this.productData = '';
    // this.isBox = false;
  }

  // inwardHeader(data: any) {
  //   // console.log(data);

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
  //   console.log(this.header);
  // }
  inwardHeader(data: any) {
    // console.log(data);

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

    console.log(this.header);
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
    console.log(finalList);
    // this.productService.addInward(finalList).subscribe(
    //   (res) => {
    //     console.log(res);
    //   },
    //   (error) => {
    //     if (error.status == 200) {
    //       console.log(error);

    //       this.isSuccess = true;
    //       let successData = { show: 2, text: error.error.text };
    //       this.transactionID = successData;
    //     }
    //     console.log(error.error.text);
    //   },
    // );
  }

  saveInwardOrOutward(data: any){
    console.log("transaction data: ",data);

    const txnType = this.inwardForm.get('inwardFromCode')?.value;
    console.log("transaction type:", txnType);


    if (txnType === '268') {
      this.transactionService.addTransaction(data).subscribe((res)=>{
        console.log("saving transaction to the database:", res);
        this.inwardForm.reset();
      },(error) => {
        console.log("error while saving data to the database:", error);
      })
    }
    

    if (txnType === '269') {
      this.transactionService.addOutwardTransaction(data).subscribe((res)=>{
        console.log("saving outward transaction to the database:", res);
        this.inwardForm.reset();
      }, (error) => {
        console.log("error while fetching outward data:", error);
      })
    }  
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
    this.fetchVendorList();
  }
}

