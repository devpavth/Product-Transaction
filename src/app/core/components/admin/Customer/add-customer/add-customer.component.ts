import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../service/Customer/customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  isChecked: boolean = false;
  _BranchName: any;
  addVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    // private branchService: BranchService,
    private route: Router,
  ) {
    this.addVendorForm = this.fb.group({
      // branchId: [],
      customerName: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      vdrAdd1: ['', Validators.required],
      vdrAdd2: ['', Validators.required],
      vdrCity: ['', Validators.required],
      vdrState: ['', Validators.required],
      billingCountry: ['', Validators.required],
      vdrPincode: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)],
      ],
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
      // vdrPanNo: [
      //   '',
      //   [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
      // ],
      // vdrTanNo: [
        // '',
        // [Validators.required, Validators.pattern(/^[A-Z]{4}[0-9]{5}[A-Z]$/)],
      // ],
      // vdrMsmeNo: [],
      // estDate: [''],
      // serviceLocation: ['', Validators.required],
      // bizType: [''],
      // bizDetailName: [
      //   '',
      //   [Validators.required, Validators.pattern('[A-Za-z ]+')],
      // ],
      // bizDetails: ['', Validators.required],
      customerAddressDetails: this.fb.array([this.showCustomerAddressData()]),
    });
  }
  ngOnInit(): void {
    // this.getBranchName();
  }

  get customerAddressDetails() {
    return this.addVendorForm.get('customerAddressDetails') as FormArray;
  }

  showCustomerAddressData() {
    return this.fb.group({
      // ifsCode: ['', Validators.required],
      // bankAccNo: ['', Validators.required],
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
      "statusCode": 200,
      "active": 800
    });
  }

  addbank() {
    this.customerAddressDetails.push(this.showCustomerAddressData());
  }

  // getBranchName() {
  //   this.branchService.getBranch().subscribe((res) => {
  //     console.log(res);
  //     this._BranchName = res;
  //     console.log(this._BranchName);
  //   });
  // }

  submitVendorDetails(data: any) {
    console.log(data);
    this.customerService.addCustomer(data).subscribe(
      (res) => {
        console.log("saving customer data to the server:",res);
        this.addVendorForm.reset();
      },
      (error) => {
        console.log("error while saving customer data:",error);
        if (error.status == 200) {
          this.route.navigate(['/home/customerList']);
        }
      },
    );
  }
}
