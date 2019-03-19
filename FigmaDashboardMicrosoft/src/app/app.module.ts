import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {MatButtonModule, MatInputModule, MatListModule, MatToolbarModule, MatCheckboxModule, MatSelectModule} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { FeaturesComponent } from './features/features.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FeaturesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule, MatInputModule, MatListModule, MatToolbarModule, MatCheckboxModule, MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
