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
var homeComponent = /** @class */ (function () {
    function homeComponent() {
    }
    homeComponent.prototype.ngAfterViewInit = function () {
        (this.example.nativeElement.tBodies[0].children[0].children).forEach(function (element) {
            console.log(element);
        });
        ;
    };
    __decorate([
        core_1.ViewChild('example'),
        __metadata("design:type", core_1.ElementRef)
    ], homeComponent.prototype, "example", void 0);
    homeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'home',
            templateUrl: 'home.component.html',
        }),
        __metadata("design:paramtypes", [])
    ], homeComponent);
    return homeComponent;
}());
exports.homeComponent = homeComponent;
//# sourceMappingURL=home.component.js.map