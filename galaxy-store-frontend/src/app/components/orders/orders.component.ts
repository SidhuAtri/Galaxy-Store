import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  public orderList: any;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getOrders().subscribe((res) => {
      this.orderList = res;
      this.orderList.reverse();
    });
  }
}
