"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var login_service_1 = require("./../../services/login.service");
var user_model_1 = require("./../../models/user.model");
var router_1 = require("@angular/router");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(loginService, router) {
        this.loginService = loginService;
        this.router = router;
        this.user = new user_model_1.User();
    }
    LoginComponent.prototype.validateLogin = function () {
        var _this = this;
        if (this.user.username && this.user.password) {
            console.log(this.user);
            this.loginService.validateLogin(this.user).subscribe(function (result) {
                console.log('result is ', result);
                _this.router.navigate(['/home']);
            }, function (error) {
                console.log('error is ', error);
            });
        }
        else {
            alert('enter user name and password');
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css'],
            providers: [login_service_1.LoginService]
        }),
        __metadata("design:paramtypes", [login_service_1.LoginService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map