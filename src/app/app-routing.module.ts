import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';
import { AccountRoutingModule } from './account/account-routing.module';
import { UnauthenticatedGuard } from './core/http-config/guards/unauthenticated.guard';
import { AuthenticatedGuard } from './core/http-config/guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    HomeRoutingModule,
    DetailRoutingModule,
    AccountRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
