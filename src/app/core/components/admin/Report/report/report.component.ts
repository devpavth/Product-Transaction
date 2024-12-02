import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {

  today: string = '';
  minToDate: string = '';

  reportForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ){
    this.reportForm = this.fb.group({
      start_date: [],
      end_date: [],

      inwardFromCode: [''],
      // createdDate: [],
      // CustomerOrVendor: [],
      // searchInput: [],
      
      // product_details: this.fb.array([this.showBankData()]),
    });
  }

  ngOnInit(){
    console.log("checking....");

    const now = new Date();
    console.log("now:", now);

    this.today = now.toISOString().split('T')[0];

    console.log("this.today:",this.today);
  }

  onstartDateChange(event: any){
    const selectedStartDate = event.target.value;
    this.minToDate = selectedStartDate;
    this.reportForm.get('end_start')?.reset();

  }
}
