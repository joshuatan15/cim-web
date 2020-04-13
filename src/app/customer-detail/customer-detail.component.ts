import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHelperService } from '../services/api-services/api-helper.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {


  title: string;
  items;
  customerDetailForm;
  isEdit = false;
  viewData: { [k: string]: any } = {};
  notPending = true;
  id: string;
  referenceNumber = '12345';
  channelId = 'CIM';
  username = 'TEST';
  customerStatus: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiHelperService,
    private translate: TranslateService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.customerDetailForm = this.formBuilder.group({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      mobileNo: new FormControl('', Validators.required),
      identityNo: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    });

    this.route.queryParams.subscribe(async params => {
      console.log(params);
      if (Object.keys(params).length !== 0) {
        this.id = params.id;
        this.customerStatus = params.status;
        await this.getCustomerDetail(params.id);
        this.title = this.translate.instant('customerDetailPage.title.edit');
        this.isEdit = true;
        if (params.status === 'PENDING_ADD') {
          this.isEdit = false;
          this.notPending = false;
          this.customerDetailForm.disable();
        }
        if (params.status === 'PENDING_MODIFY') {
          this.notPending = false;
          this.customerDetailForm.disable();
        }
      }
      else {
        this.title = this.translate.instant('customerDetailPage.title.create');
        this.isEdit = false;
      }
    });
  }

  async getCustomerDetail(id) {
    let filter = {
      where: {
        id
      }
    };
    const obj = { filter: JSON.stringify(filter) };

    try {
      const response = await this.apiService.searchCustomer(obj);
      this.viewData = response.data.user[0];
      console.log(this.viewData);
      let map: CustomerDetails = {
        fullName: this.viewData['tmpFullName'],
        email: this.viewData['tmpEmail'],
        mobileNo: this.viewData['tmpMobileNo'],
        identityNo: this.viewData['tmpIdentityNo'],
        address: this.viewData['tmpAddress'],
        postalCode: this.viewData['tmpPostalCode'],
        city: this.viewData['tmpCity'],
        state: this.viewData['tmpState'],
        country: this.viewData['tmpCountry']
      }
      this.customerDetailForm.patchValue(map);
    }
    catch (e) {
      console.log(e);
    }
  }


  async onSubmit(user) {
    console.log(this.customerDetailForm.valid);
    if (this.customerDetailForm.valid) {
      const obj = {
        user,
        referenceNumber: this.referenceNumber,
        channelId: this.channelId,
        username: this.username
      }
      console.log(obj);
      if (this.customerStatus === 'PENDING_NONE') {
        this.updateCustomer(obj);
      }
      else {
        this.createCustomer(obj);
      }
    }
    else {
      alert('Please fill up all the field correctly.');
    }
  }

  async createCustomer(obj) {
    try {
      const response = await this.apiService.createCustomer(obj);
      console.log(response);
      if (response.errorCode === "") {
        this.router.navigate(['/customer-listing']);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  async updateCustomer(obj) {
    try {
      const response = await this.apiService.updateCustomer(obj, this.id);
      console.log(response);
      if (response.errorCode === "") {
        this.router.navigate(['/customer-listing']);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  async approve() {
    const userJSON = {
      referenceNumber: this.referenceNumber,
      channelId: this.channelId,
      username: this.username,
      payload: [
        this.id
      ]
    };
    try {
      const response = await this.apiService.approveCustomer(userJSON);
      console.log(response);
      this.router.navigate(['/customer-listing']);
    }
    catch (e) {
      console.log(e);
    }
  }

  async reject() {
    const userJSON = {
      referenceNumber: this.referenceNumber,
      channelId: this.channelId,
      username: this.username,
      payload: [
        this.id
      ]
    };
    try {
      const response = await this.apiService.rejectCustomer(userJSON);
      console.log(response);
      this.router.navigate(['/customer-listing']);
    }
    catch (e) {
      console.log(e);
    }
  }

  isFieldRequired(form: FormGroup, field: string) {
    return (
      form.get(field).invalid &&
        (form.get(field).dirty || form.get(field).touched) ?
        form.get(field).errors.required : ''
    );
  }
}


export interface CustomerDetails {
  fullName: string,
  email: string,
  mobileNo: string,
  identityNo: string,
  address: string,
  postalCode: string,
  city: string,
  state: string,
  country: string
}