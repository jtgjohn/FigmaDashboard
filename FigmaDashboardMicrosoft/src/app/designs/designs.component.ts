import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from "@angular/common/http";
import {HttpParams} from '@angular/common/http';


export interface Status{
	color: string,
	status: string
}	



export interface Design{
  title:string,
  thumbnail_url: string,
  last_modified: string,
  id: string
};


@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.css']
})
export class DesignsComponent implements OnInit {
	color = "";	
	color1 = "";
	colorversion = "";
	colorversionreview = "";
	changeworthy:boolean = false;
	panelvisible:boolean = false;

	 id = "";
  
  	code:string = "";
  	state:string = "";
  	project_name:string = "";
  	feature_name:string = ""; 
  	readytoexport:boolean  = true;
  	latest_thumbnail_url = "";

	  designs:Design[] = [];


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
  constructor(private fb: FormBuilder,
  	private activatedRoute: ActivatedRoute, private http: HttpClient,
      private router: Router) { }
  // @ViewChild('customInput') input: ElementRef;

   getFileImages(){
     var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/fileImagebyFeature', JSON.stringify({"code": this.code, 
    	"id": this.id}), {
      headers: headers
    });
  }
  ngOnInit() {


  	this.statusForm = this.fb.group({
	  statusControl: [this.statuses[0]]
	});

	this.color = "#F2C94C";
	this.color1 = "#F2C94C";
	this.colorversion= "#F2F2F2";
	this.colorversionreview = "#F2F2F2";

	this.activatedRoute.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['feature_id']) //log the value of id
      this.id = params['feature_id'];
    });
  	 this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        this.code = params["code"];
        this.project_name = params["project_name"];
        this.feature_name = params["feature_name"];
          	document.getElementById("featuretitle").innerHTML = this.feature_name;
          	document.getElementById("projecttitle").innerHTML = this.project_name;

    });


  	 this.getFileImages().subscribe((res:any) => {
         console.log(res);
         for (let key in res["images"]) {
   
         	var proj = {} as Design;
         	proj.title = res["lastModified"];
         	proj.thumbnail_url = res["images"][key];
         	proj.last_modified = res["lastModified"];
         	this.latest_thumbnail_url = proj.thumbnail_url;
         	proj.id = "";
         	this.designs.push(proj);
         }


         // console.log(this.features);
      }, (err) => {
        console.log(err);
      });
  // 	const ele = this.input.nativeElement as HTMLElement;
  // ele.click();
  // 	 (<HTMLSelectElement>document.getElementById("1sel")).value = "Pending Approval";
  // 	 (<HTMLSelectElement>document.getElementById("2sel")).value = "Pending Approval";
  }


  viewRepLink(){
  	this.changeworthy = !this.changeworthy;
  }



  addnewversioncall(status){
  	  var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    var reviewer = (<HTMLInputElement>document.getElementById("reviewer_d")).value;
    var whatisnew = (<HTMLInputElement>document.getElementById("wnew")).value;
    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/addversion', JSON.stringify({"reviewer": reviewer,"status": status, 
    	"fid": this.id,
    	"imagePath": this.latest_thumbnail_url, "whatisnew": whatisnew, "readytoexport": this.readytoexport}), {
      headers: headers
    });
  }
  addnewversion(){
  	this.panelvisible = !this.panelvisible;
  	 var status = "";

    if(this.colorversion === "#F2C94C"){
		status = "Request Approval";
	}else if(this.colorversion === "#BDBDBD"){
		status = "Draft";
	}
	else{
		return;
	}
  	this.addnewversioncall(status).subscribe((res:any) => {
         // console.log(res);
         // for (let key in res["images"]) {
   
         // 	var proj = {} as Design;
         // 	proj.title = res["lastModified"];
         // 	proj.thumbnail_url = res["images"][key];
         // 	proj.last_modified = res["lastModified"];
         // 	proj.id = "";
         // 	this.designs.push(proj);
         // }


         // console.log(this.features);
      }, (err) => {
        console.log(err);
      });
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
