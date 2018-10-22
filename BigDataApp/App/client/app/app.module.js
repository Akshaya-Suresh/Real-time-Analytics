"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var app_component_1 = require("./components/app/app.component");
var navmenu_component_1 = require("./components/navmenu/navmenu.component");
var home_component_1 = require("./components/home/home.component");
var login_component_1 = require("./components/login/login.component");
var services_1 = require("./services/services");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            declarations: [
                app_component_1.AppComponent,
                navmenu_component_1.NavMenuComponent,
                home_component_1.homeComponent,
                login_component_1.LoginComponent
            ],
            providers: [services_1.EmployeeServcies],
            imports: [platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                router_1.RouterModule.forRoot([
                    { path: '', redirectTo: 'login', pathMatch: 'full' },
                    { path: 'login', component: login_component_1.LoginComponent },
                    { path: 'home', component: home_component_1.homeComponent }
                ])],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map