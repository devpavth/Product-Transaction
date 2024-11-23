import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  addingData: any;
  isCloseAdding: boolean = false;

  groupList: any;
  catList: any;
  brandList: any;
  gst: any = [0, 5, 12, 18];
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

  private route = inject(Router);

  ProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.ProductForm = this.fb.group({
      // prdGrpId: ['',[Validators.required]],
      // prdCatgId: [],
      // prdBrndId: [],
      productName: [],
      productModel: [],
      productDescription: [],
      // prdUnit: [],
      productHsn: [],
      productPrice: [],
      productGstRate: [],
      productQuantity: [],
      prdStatus: [200],
    });
  }
  ngOnInit(): void {
    this.fetchGroupList();
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

  fetchGroupList() {
    // this.productService.groupList().subscribe((res) => {
    //   this.groupList = res;
    //   console.log(res);
    // });
  }
  fetchCatList(Id: any) {
    // this.productService.catagoriesList(Id).subscribe((res) => {
    //   this.catList = res;
    //   console.log(res);
    // });
  }
  fetchBrandList(catId: any) {
    // this.productService.brandList(catId).subscribe((res) => {
    //   this.brandList = res;
    //   console.log(res);
    // });
  }

  openHsnLink(){
    window.open('https://cleartax.in/s/gst-hsn-lookup', '_blank')
  }

  onSubmit(data: any) {
    console.log("add product data:",data);

    this.productService.postProduct(data).subscribe(
      (res) => {
        console.log("Product User added:",res);
        this.route.navigate(['/home/productList']);
      },
      (error) => {
        console.log("Error adding product details:",error);

        if (error.status == 200) {
          this.ProductForm.reset();
          this.ProductForm.get('prdStatus')?.patchValue(200);
        }
      },
    );
  }
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
    this.fetchGroupList();
    this.ProductForm.reset();
  }
}
