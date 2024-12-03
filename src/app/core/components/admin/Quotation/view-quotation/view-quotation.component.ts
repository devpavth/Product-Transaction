import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrl: './view-quotation.component.css'
})
export class ViewQuotationComponent {
  @Input() productData: any;
  @Output() closeProduct = new EventEmitter<boolean>();
}
