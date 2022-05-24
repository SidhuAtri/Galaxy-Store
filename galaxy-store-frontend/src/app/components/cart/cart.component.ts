import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public products: any = [];
  public grandTotal!: number;
  public orderData: any = [];
  constructor(
    private cartService: CartService,
    public auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getProducts().subscribe((res) => {
      this.products = res;
      this.grandTotal = this.cartService.getTotalPrice();
    });
  }
  removeItem(item: any) {
    this.cartService.removeCartItem(item);
  }
  emptycart() {
    this.cartService.removeAllCart();
  }
  addOrders() {
    this.orderData = [];
    for (let item in this.products) {
      var ordersObj = {
        title: '',
        price: '',
        quantity: 0,
        image: '',
        userID: 0,
      };
      ordersObj.title = this.products[item].title;
      ordersObj.price = this.products[item].price;
      ordersObj.quantity = this.products[item].quantity;
      ordersObj.image = this.products[item].image;
      ordersObj.userID = this.auth.getUserID();

      this.orderData.push(ordersObj);
    }

    setTimeout(() => {
      this.api.addOrders(this.orderData).subscribe((res) => {
        console.log('Order Placed');
        this.emptycart();
        this.router.navigate(['/orders']);
      });
    }, 2000);
  }
}
