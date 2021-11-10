import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { UnauthenticatedGuard } from '../core/http-config/guards/unauthenticated.guard';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [UnauthenticatedGuard],
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
