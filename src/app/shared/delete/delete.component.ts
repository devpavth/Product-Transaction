import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../core/components/service/product.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  @Input() deleteData: any;
  @Output() close = new EventEmitter<boolean>();

  constructor(
    // private funderService: FunderService,
    private productService: ProductService,
    // private vendorService: VendorService,
    // private branchService: BranchService,
  ) {}

  deleteFunction() {
    console.log(this.deleteData);

    if (this.deleteData.action == 1) {
      console.log(this.deleteData);
      // this.funderService.deleteFunder(this.deleteData?.deleteId).subscribe(
      //   (res) => {
      //     console.log(res);
      //   },
      //   (error) => {
      //     if (error.status == 200) {
      //       this.close.emit(false);
      //     }
      //   },
      // );
    }
    if (this.deleteData.action == 2) {
      console.log(this.deleteData);
      this.productService.deleteProduct(this.deleteData.deleteId).subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          if (error.status == 200) {
            this.close.emit(false);
          }
        },
      );
    }
    if (this.deleteData.action == 3) {
      console.log(this.deleteData);
      // this.vendorService.deleteVendor(this.deleteData.deleteId).subscribe(
      //   (res) => {
      //     console.log(res);
      //   },
      //   (error) => {
      //     if (error.status == 200) {
      //       this.close.emit(false);
      //     }
      //   },
      // );
    }

    ///action 4
    if (this.deleteData.action == 4) {
      console.log(this.deleteData);
      // this.branchService.deleteDepartment(this.deleteData.deleteId).subscribe(
      //   (res) => {
      //     console.log(res);
      //   },
      //   (error) => {
      //     console.log(error);

      //     if (error.status == 200) {
      //       this.close.emit(false);
      //     }
      //   },
      // );
    }

    if (this.deleteData.action == 5) {
      console.log(this.deleteData);
      // this.branchService.deleteProj(this.deleteData.deleteId).subscribe(
      //   (res) => {
      //     console.log(res);
      //   },
      //   (error) => {
      //     console.log(error);

      //     if (error.status == 200) {
      //       this.close.emit(false);
      //     }
      //   },
      // );
    }
  }
}

