import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  public userDetails: any = [];
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUserDetails().subscribe((res) => {
      this.userDetails = res;
    });
  }
}
