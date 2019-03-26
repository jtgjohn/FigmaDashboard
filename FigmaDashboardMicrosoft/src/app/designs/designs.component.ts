import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';


export interface Status{
	color: string,
	status: string
}	



@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.css']
})
export class DesignsComponent implements OnInit {
	color = "";	
	color1 = "";

	compareFn(c1: Status, c2: Status): boolean {
    return c1 && c2 ? c1.color === c2.color : c1 === c2;
}
	statusForm: FormGroup;
	statuses:Status[] = [
		{color: "#F2C94C", status: "Pending Approval"},
		{color: "#6FCF97", status: "Approved"},
		{color: "#EB5757", status: "Changes Requested"}
	];
	default: string = 'Pending Approval';
  constructor(private fb: FormBuilder) { }
  // @ViewChild('customInput') input: ElementRef;
  ngOnInit() {
  	this.statusForm = this.fb.group({
	  statusControl: [this.statuses[0]]
	});

	this.color = "#F2C94C";
	this.color1 = "#F2C94C";
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
