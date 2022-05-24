import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public userDetails: any;
  registerForm!: FormGroup;

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.api.getUserLogin().subscribe((res) => {
      this.userDetails = res;
    });
  }

  get name() {
    return this.registerForm.get('name');
  }
  get username() {
    return this.registerForm.get('email');
  }
  get userPhone() {
    return this.registerForm.get('phone');
  }
  get userPassword() {
    return this.registerForm.get('password');
  }

  flagForm: boolean = false;
  registerCaption: string = 'Register Here';
  loginCaption: string = 'Login';

  public changeFormLogin(): void {
    this.flagForm = !this.flagForm;
    if (this.flagForm) {
      this.loginCaption = 'Register';
      this.registerCaption = 'Login Here';
    } else {
      this.loginCaption = 'Login';
      this.registerCaption = 'Register Here';
    }
  }

  validateClassLogin(uId: string, pass: string) {
    for (let user of this.userDetails) {
      if (user.email === uId && user.password === pass) {
        this.auth.loggedIn(true);
        this.auth.user(user.id);
        alert('Login Successfull!');
        return this.router.navigate(['/products']);
      }
    }
    return alert(`Invalid username or password`);
  }

  addNewUser() {
    this.api.addUser(this.registerForm.value).subscribe((res) => {
      alert('Registration Successfull.');
      this.registerForm.reset();
      this.api.getUserLogin().subscribe((res) => {
        this.userDetails = res;
        this.changeFormLogin();
      });
    });
  }
}
