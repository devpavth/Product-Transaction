import { Component } from '@angular/core';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css'
})
export class LeftMenuComponent {
  viewRequestlist: boolean = true;
  tRequest: boolean = false;
  tAdmin: boolean = false;
  procurement: boolean = false;
  poapproval: boolean = false;
  finance: boolean = false;
  transaction: boolean = false;
  product: boolean = false;
  branch: boolean = false;
  toggleRequest() {
    this.tRequest = !this.tRequest;
  }
  toggleAdmin() {
    this.tAdmin = !this.tAdmin;
  }
  toggleTransaction() {
    this.transaction = !this.transaction;
  }
  toggleProduct() {
    this.product = !this.product;
  }
  toggleBranch() {
    this.branch = !this.branch;
  }
  signOut() {
      sessionStorage.clear();
    }
}
