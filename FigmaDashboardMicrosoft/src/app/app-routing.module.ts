import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {FeaturesComponent} from './features/features.component';
import {DesignsComponent} from './designs/designs.component';

const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full'},
 {path: 'login', component: LoginComponent},
 {path: 'home', component: HomeComponent},
 {path: 'features/:project_id', component: FeaturesComponent},
 {path: 'designs', component: DesignsComponent}
 
     
     



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
