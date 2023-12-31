import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders: Order []
  @ViewChild('modal') modalRef: ElementRef

  selectedOrder: Order
  modal: MaterialInstance

  computePrice(order: Order): number {
    // @ts-ignore
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0)

  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    this.modal.open()

  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy(): void {
    this.modal.destroy()
  }

  closeModal(){
    this.modal.close()
  }
}
