import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import {NavMenuComponent}  from './components/navmenu/navmenu.component';
import {homeComponent}  from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {EmployeeServcies} from "./services/services" ;
@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
    AppComponent,
    NavMenuComponent,
    homeComponent,
    LoginComponent,
    RegisterComponent
    ],
    providers:[EmployeeServcies],
    imports: [BrowserModule,
     HttpModule,
    FormsModule,
    RouterModule.forRoot([
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'home', component: homeComponent },
            { path: 'register', component: RegisterComponent }
           
            
        ])],
    bootstrap: [AppComponent]
})
export class AppModule { }