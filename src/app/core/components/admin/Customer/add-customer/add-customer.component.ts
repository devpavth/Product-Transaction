import { Component, inject } from '@angular/core';
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
  private customerService = inject(CustomerService);
  constructor(
    private fb: FormBuilder,
    // private customerService: CustomerService,
    // private branchService: BranchService,
    private route: Router,
  ) {
    this.addVendorForm = this.fb.group({
      // branchId: [],
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
      addresses: this.fb.array([this.showCustomerAddressData()]),
    });
  }
  ngOnInit(): void {
    // this.getBranchName();
  }

  get addresses() {
    return this.addVendorForm.get('addresses') as FormArray;
  }

  showCustomerAddressData() {
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
    this.addresses.push(this.showCustomerAddressData());
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
