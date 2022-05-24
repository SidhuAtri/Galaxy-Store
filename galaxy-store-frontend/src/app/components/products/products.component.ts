import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  public productList: any;
  public filterCategory: any;
  searchKey: string = '';
  constructor(
    private api: ApiService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.getProduct().subscribe((res) => {
      this.productList = res;
      this.filterCategory = res;
      this.productList.forEach((a: any) => {
        if (
          a.category === "women's clothing" ||
          a.category === "men's clothing"
        ) {
          a.category = 'fashion';
        }
        Object.assign(a, { quantity: 1, total: a.price });
      });
      console.log(this.productList);
    });

    this.cartService.search.subscribe((val: any) => {
      this.searchKey = val;
    });
  }

  addtocart(item: any) {
    if (this.auth.login()) {
      this.cartService.addtoCart(item);
    } else {
      this.router.navigate(['login']);
    }
  }

  filter(category: string) {
    this.filterCategory = this.productList.filter((a: any) => {
      if (a.category == category || category == '') {
        return a;
      }
    });
  }

  viewProduct(id: number) {
    this.router.navigate(['/product'], { queryParams: { id: id } });
  }

  priceFilter(e: any) {
    this.filterCategory = this.productList.filter((a: any) => {
      if (a.price <= e.value) {
        return a;
      }
    });
  }

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;
  ratingFilter(rating: any) {
    this.filterCategory = this.productList.filter((a: any) => {
      if (a.rate >= rating) {
        return a;
      }
    });
    this.selectedValue = rating;
    console.log('Value of star', rating);
  }
}
