import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../../../service/vendor/vendor.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.css'
})
export class AddVendorComponent {
  isChecked: boolean = false;
  _BranchName: any;
  addVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    // private branchService: BranchService,
    private route: Router,
  ) {
    this.addVendorForm = this.fb.group({
      // branchId: [],
      vendorName: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      vdrAdd1: ['', Validators.required],
      vdrAdd2: ['', Validators.required],
      vdrCity: ['', Validators.required],
      vdrState: ['', Validators.required],
      vdrCountry: ['', Validators.required],
      vdrPincode: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)],
      ],
      vdrContactPersonName: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      vdrContactPersonPhone: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{9}$/)],
      ],
      vdrEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-z]+.([a-z]{2})+(?:\.(com|in|edu|net)){1}$/,
          ),
        ],
      ],
      vdrGstNo: [
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
      vendorAcccountDetails: this.fb.array([this.showBankData()]),
    });
  }
  ngOnInit(): void {
    // this.getBranchName();
  }

  get vendorAcccountDetails() {
    return this.addVendorForm.get('vendorAcccountDetails') as FormArray;
  }

  showBankData() {
    return this.fb.group({
      ifsCode: ['', Validators.required],
      bankAccNo: ['', Validators.required],
    });
  }

  addbank() {
    this.vendorAcccountDetails.push(this.showBankData());
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
    this.vendorService.addVendor(data).subscribe(
      (res) => {
        console.log("saving vendor data to the server:",res);
        this.addVendorForm.reset();
      },
      (error) => {
        console.log("error while saving data:",error);
        if (error.status == 200) {
          this.route.navigate(['/home/vendorList']);
        }
      },
    );
  }
}
