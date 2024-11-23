import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../service/Customer/customer.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.css'
})
export class ViewCustomerComponent {
  isChecked: boolean = false;
  @Output() closeVendor = new EventEmitter<boolean>();
  @Input() vendorData: any;
  isSave = false;
  isEdit = true;
  isSaveIcon = true;
  isSaveAddress = false;
  isEditAddress = true;
  isSaveIconAddress = true;
  isEditMode: boolean = false;
  deleteVendor: any;
  isDelete: boolean = false;
  isAddressList: Boolean = false;
  customerAddressData: any
  _BranchName: any;

  private customerService = inject(CustomerService);

  UpdateVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    // private vendorService: VendorService,
    // private branchService: BranchService,
    private route: Router,
  ) {
    this.UpdateVendorForm = this.fb.group({
      // branchId: [],
      // vendorId: [],
      customerId: [],
      customerName: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      contactPerson: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      contactPhone: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{9}$/)],
      ],
      contactEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-z]+.([a-z]{2})+(?:\.(com|in|edu|net)){1}$/,
          ),
        ],
      ],
      customerGst: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[A-Z\d]{2}$/),
        ],
      ],
      
      addresses: this.fb.array([this.showBankData()]),
    });
  }

  ngOnInit(): void {
    this.getBranchName();
    this.UpdateVendorForm.patchValue(this.vendorData);
    Object.keys(this.UpdateVendorForm.controls).forEach((form) => {
      this.UpdateVendorForm.get(form)?.disable();
    });
  }

  get addresses() {
    return this.UpdateVendorForm.get('addresses') as FormArray;
  }

  showBankData() {
    return this.fb.group({
      billingAddress1: ['', Validators.required],
      billingAddress2: ['', Validators.required],
      billingPincode: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)],
      ],
      billingCity: ['', Validators.required],
      billingState: ['', Validators.required],
      billingCountry: ['', Validators.required],
      shippingAddress1: ['', Validators.required],
      shippingAddress2: ['', Validators.required],
      shippingPincode: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)],
      ],
      shippingCity: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingCountry: ['', Validators.required],
      statusCode: [],
      "active": 800
    });
  }

  addbank() {
    this.addresses.push(this.showBankData());
  }
  edit() {

    const editableControls = [
      'customerName',
      'contactEmail',
      'contactPhone',
      'contactPerson',
    ]

    Object.keys(this.UpdateVendorForm.controls).forEach((form) => {
      if(editableControls.includes(form)){
        this.UpdateVendorForm.get(form)?.enable();
      }else{
        this.UpdateVendorForm.get(form)?.disable();
      }
    });
    this.isSave = true;
    this.isEdit = false;
  }
 
  updateCustomerDetails(data: any) {
    console.log("updating customer details data:",data);
    let id = this.UpdateVendorForm.get('customerId')?.value;
    console.log(id);

    this.customerService.updateCustomer(id, data).subscribe(
      (res) => {
        console.log("updating customer details:",res);
      },
      (error) => {
        console.log("error while updating customer details:",error);
        if (error.status == 200) {
          this.route.navigate(['/home/customerList']);
        }
      },
    );
  }

  editAddress(){
    const editableAddressControls = [
      'addresses',
    ]

    Object.keys(this.UpdateVendorForm.controls).forEach((form) => {
      if(editableAddressControls.includes(form)){
        this.UpdateVendorForm.get(form)?.enable();
      }else{
        this.UpdateVendorForm.get(form)?.disable();
      }
    });
    this.isEditMode = true;
    this.isSaveAddress = true;
    this.isEditAddress = false;
  }

  useBillingAddress(event: Event, index: number){
    const isChecked = (event.target as HTMLInputElement).checked;

    const addressGroup = this.addresses.at(index) as FormGroup;

    if(isChecked){
      console.log("checking the check box:", isChecked);
      addressGroup.patchValue({
        shippingAddress1: addressGroup.get('billingAddress1')?.value,
        shippingAddress2: addressGroup.get('billingAddress2')?.value,
        shippingPincode: addressGroup.get('billingPincode')?.value,
        shippingCity: addressGroup.get('billingCity')?.value,
        shippingState: addressGroup.get('billingState')?.value,
        shippingCountry: addressGroup.get('billingCountry')?.value,
        statusCode: 200,
      })
    }else{
      addressGroup.patchValue({
        shippingAddress1: '',
        shippingAddress2: '',
        shippingPincode: '',
        shippingCity: '',
        shippingState: '',
        shippingCountry: '',
        statusCode: 400,
      })
    }
  }

  updateCustomerAddressDetails(data: any) {
    console.log("updating customer address details data:",data);
    let id = this.UpdateVendorForm.get('customerId')?.value;
    console.log(id);
    this.isEditMode = false;

    this.customerService.updateAddress(id, data).subscribe(
      (res) => {
        console.log("updating customer address details:",res);
      },
      (error) => {
        console.log("error while updating customer address details:",error);
        if (error.status == 200) {
          this.route.navigate(['/home/customerList']);
        }
      },
    );
  }
  getBranchName() {
    // this.branchService.getBranch().subscribe((res) => {
    //   console.log(res);
    //   this._BranchName = res;
    //   console.log(this._BranchName);
    // });
  }

  toggledelete(check: any, isView: boolean) {
    if (check == 1) {
      this.isDelete = isView;
      this.deleteVendor = {
        title: 'Customer',
        action: 6,
        deleteId: this.vendorData.customerId,
      };
    } else if (check == 0) {
      this.isDelete = isView;
      this.closeVendor.emit(false);
    }
  }

  fetchallcustomer() {
    this.customerService.getAllCustomer().subscribe(
      (res) => {
        // this._vendor = res;
        // this.Spinner = false;
        console.log("Gettting all customer details:",res);
      },
      (error) => {
        console.log("error while getting customer details:",error);
      },
    );
  }

  // toggleView(action: Boolean, check: number, customerAddressData: any) {
  //   if (check == 1) {
  //     this.isAddressList = action;
  //     this.customerAddressData = customerAddressData;
  //   }
  //   if (check == 0) {
  //     this.isAddressList = action;
  //     this.fetchallcustomer();
  //   }
  // }
}
