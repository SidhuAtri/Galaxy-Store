import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  // products
  getProduct() {
    return this.http.get<any>('http://localhost:8000/products').pipe(
      map((res: any) => {
        console.log('RESSS' + res);
        return res;
      })
    );
  }

  getProductById(id: number) {
    return this.http.get<any>('http://localhost:8000/product/' + id).pipe(
      map((res: any) => {
        console.log('RESSS' + res);
        return res;
      })
    );
  }

  // user login data
  getUserLogin(): Observable<any> {
    return this.http.get('http://localhost:8000/users');
  }

  addUser(userObj: any) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(userObj);
    return this.http.post('http://localhost:8000/register', body, {
      headers: headers,
    });
  }

  // orders
  addOrders(userObj: any) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(userObj);
    return this.http.post('http://localhost:8000/addOrders', body, {
      headers: headers,
    });
  }

  getOrders() {
    var id = this.auth.getUserID();
    console.log('IIDD' + id);
    return this.http.get('http://localhost:8000/orders/' + id);
  }

  getUserDetails(): Observable<any> {
    return this.http.get('http://localhost:8000/usersDetails');
  }
}
