import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';


const routes: Routes = [
  {
    path: 'customer-listing',
    component: CustomerListingComponent
  },
  {
    path: 'customer-detail',
    component: CustomerDetailComponent
  },
  {
    path: '**',
    redirectTo: 'customer-listing'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
