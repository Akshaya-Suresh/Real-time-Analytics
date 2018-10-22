import { EmployeeServcies } from './../../services/services';
import { AfterViewInit, Component, ElementRef, ViewChild  } from '@angular/core';
import { Response } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    
})
export class homeComponent implements AfterViewInit {
    @ViewChild('example') example: ElementRef;
    ngAfterViewInit() {
        this.example.nativeElement.tBodies[0].children[0].children
      for(let ex of ){
        console.log(ex)

      }
    }
    public constructor() {
    }
}
