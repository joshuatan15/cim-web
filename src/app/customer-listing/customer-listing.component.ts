import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHelperService } from '../services/api-services/api-helper.service';


@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.css']
})
export class CustomerListingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'tmpFullName', 'tmpIdentityNo', 'tmpEmail', 'pendingStatus', 'actions'];
  dataSource = new MatTableDataSource<Comment>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router, private apiService: ApiHelperService) {
    this.search();

  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async search() {
    let filter = {
      where: {
        status: "ACTIVE"
      }
    };
    const obj = { filter: JSON.stringify(filter) };
    try {
      const response = await this.apiService.searchCustomer(obj);
      console.log(response);
      this.dataSource = new MatTableDataSource<Comment>(response.data.user);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    catch (e) {
      console.log(e);
    }
  }

  viewDetails(row) {
    console.log(row);
    this.router.navigate(['/customer-detail'], {
      queryParams: {
        id: row.id,
        status: row.pendingStatus
      }
    });
  }

  addCustomer() {
    this.router.navigate(['/customer-detail']);
  }

  async deleteCustomer(row) {
    try {
      const response = await this.apiService.deleteCustomer(row.id);
      console.log(response);
      this.search();
    }
    catch (e) {
      console.log(e);
    }
  }

}
