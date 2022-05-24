import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public totalItem: number = 0;
  public searchTerm!: string;
  constructor(private cartService: CartService, private auth: AuthService) {}

  ngOnInit(): void {
    this.cartService.getProducts().subscribe((res) => {
      this.totalItem = res.length;
    });
  }

  ngDoCheck(): void {
    this.flagLogout = this.auth.login();
  }

  flagLogout: boolean = false;

  logout() {
    this.auth.logout();
    this.auth.loggedIn(false);
    this.totalItem = 0;
    this.cartService.removeAllCart();
  }

  search(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    console.log(this.searchTerm);
    this.cartService.search.next(this.searchTerm);
  }
}
