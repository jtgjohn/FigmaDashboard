import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.css']
})
export class DesignsComponent implements OnInit {
	color = "";

	default: string = 'Pending Approval';
	 statusForm: FormGroup;
  constructor() { }
  // @ViewChild('customInput') input: ElementRef;
  ngOnInit() {
  // 	const ele = this.input.nativeElement as HTMLElement;
  // ele.click();
  // 	 (<HTMLSelectElement>document.getElementById("1sel")).value = "Pending Approval";
  // 	 (<HTMLSelectElement>document.getElementById("2sel")).value = "Pending Approval";
  }

 //  onChange(newValue) {
	// console.log(newValue);
	// var select_val = document.getElementById("second");
	// if(newValue === "Pending Approval"){
	// 	this.style.backgroundColor = "#F2C94C";
	// }
	// else if(newValue === "Approved"){
	// 	this.style.backgroundColor = "#6FCF97";
	// }
	// else if(newValue === "Changes Requested"){
	// 	this.style.backgroundColor = "#EB5757";
	// }
 //  }

}
