import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {
  @Output() closeProduct = new EventEmitter<boolean>();
  @Input() productData: any;

  productId: string = '';
  addingData: any;
  isCloseAdding: boolean = false;
  isSave: boolean = false;
  isEdit: boolean = true;
  isSaveIcon: boolean = true;
  isDelete: boolean = false;

  isStockView: boolean = false;
  deleteProduct: any;

  groupList: any;
  catList: any;
  brandList: any;
  gst: any = [0, 5, 12, 18];
  units: { id: number; name: string }[] = [
    { id: 1, name: 'Kg' },
    { id: 2, name: 'L' },
    { id: 3, name: 'm' },
    { id: 4, name: 'Unit' },
    { id: 200, name: 'Box' },
  ];

  UpdateProductForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    // private productService: ProductService,
  ) {
    this.UpdateProductForm = this.fb.group({
      prdGrpId: [],
      prdCatgId: [],
      prdBrndId: [],
      prdmdlName: [],
      prdDescription: [],
      prdUnit: [],
      prdHsnCode: [],
      prdPurchasedPrice: [],
      prdGstPct: [],
      prdMinQty: [],
      prdClosingStock: [],
      prdTotalValue: [],
      prdStatus: [200],
    });
  }
  ngOnInit(): void {
    this.UpdateProductForm.patchValue(this.productData);
    Object.keys(this.UpdateProductForm.controls).forEach((form) => {
      this.UpdateProductForm.get(form)?.disable();
    });
    // this.fetchGroupList();
    // this.fetchCatList(this.productData.prdGrpId);
    // this.fetchBrandList(this.productData.prdCatgId);
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
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
  }

  edit() {
    Object.keys(this.UpdateProductForm.controls).forEach((form) => {
      this.UpdateProductForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }

  // fetchGroupList() {
  //   this.productService.groupList().subscribe((res) => {
  //     this.groupList = res;
  //     console.log(res);
  //   });
  // }
  // fetchCatList(Id: any) {
  //   this.productService.catagoriesList(Id).subscribe((res) => {
  //     this.catList = res;
  //     console.log(res);
  //   });
  // }
  // fetchBrandList(catId: any) {
  //   this.productService.brandList(catId).subscribe((res) => {
  //     this.brandList = res;
  //     console.log(res);
  //   });
  // }

  toggledelete(check: any, isView: boolean) {
    if (check == 1) {
      this.isDelete = isView;
      this.deleteProduct = {
        title: 'Product',
        action: 2,
        deleteId: this.productData.productId,
      };
      console.log(this.deleteProduct);
    } else if (check == 0) {
      this.isDelete = isView;
      this.closeProduct.emit(false);
    }
  }

  toggleStockView(check: number, isView: boolean) {
    if (check == 1) {
      this.isStockView = isView;
      this.productId = this.productData.productId;
      console.log(this.productId);
    } else if (check == 0) {
      this.isStockView = isView;
    }
  }
  onUpdateProduct(data: any) {
    console.log(data);
  }
}

