import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}
  isLoggedIn = 'isLoggedIn';
  loginFlag: boolean = false;
  userID: number = 0;
  login() {
    localStorage.setItem(this.isLoggedIn, 'true');
    return this.loginFlag;
  }

  loggedIn(flag: boolean) {
    this.loginFlag = flag;
  }

  logout() {
    localStorage.setItem(this.isLoggedIn, 'false');
    this.router.navigate(['/home']);
    return (this.loginFlag = false);
  }
  user(id: number) {
    this.userID = id;
  }
  getUserID() {
    return this.userID;
  }
}
