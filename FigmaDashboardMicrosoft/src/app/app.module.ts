import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {MatButtonModule, MatInputModule, MatListModule, MatToolbarModule, MatCheckboxModule, MatSelectModule} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { FeaturesComponent } from './features/features.component';
import { DesignsComponent } from './designs/designs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FeaturesComponent,
    DesignsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule, MatInputModule, MatListModule, MatToolbarModule, MatCheckboxModule, MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
   exports: [
   
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
