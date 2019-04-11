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
  id: number
  status: string,
  version_id: string
};


@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.css']
})
export class DesignsComponent implements OnInit {
	color = "";	
	color1 = "";
	commentson:boolean = true;
	colorversion = "";
	allcolors = [];
	comments = [];
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

  modifyStatus(versionId, status){
  	const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/updatestatus', JSON.stringify({"versionId": versionId, "status": status}), {
      headers: headers
    });
  }

  onChange(versionId, val){
  	this.modifyStatus(versionId, val).subscribe((res:any) => {
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
  togglecomments(){
  	this.commentson = !this.commentson;
  }
  getVersions(){
  	 var datax; 
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    var url = "http://127.0.0.1:8080/getVersions";
    let paramsh = new HttpParams().set('fid', this.id);

    

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.get(url, {
      params: paramsh
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

var counter = 0;
  	 this.getFileImages().subscribe((res:any) => {
         console.log(res);
         
         for (let key in res["images"]) {
   
         	var proj = {} as Design;
         	proj.title = res["lastModified"];
         	proj.thumbnail_url = res["images"][key];
         	proj.last_modified = res["lastModified"];
         	this.latest_thumbnail_url = proj.thumbnail_url;
         	proj.status = "Pending Approval";
         	proj.id = counter;
         	proj.version_id = "";
         	this.allcolors.push("#F2C94C");
         	this.designs.push(proj);
         	this.comments.push([]);


         	counter++;
         }


         // console.log(this.features);
      }, (err) => {
        console.log(err);
      });


  	 this.getVersions().subscribe((res:any) => {
         console.log(res);
         for(var i = 0; i < res.length; ++i){
         	var proj = {} as Design;

         	proj.title = res[i]["whatisnewinfo"];
         	proj.thumbnail_url = res[i]["imagePath"];
         	proj.last_modified = res[i]["timestamp"];
         	this.latest_thumbnail_url = proj.thumbnail_url;
         	proj.status = res[i]["status"];
         	if(proj.status === "Draft"||proj.status === "Request Approval"){
         		proj.status = "Pending Approval";
         	}

         	proj.id = counter;
         	if(proj.status === "Pending Approval"){
         		this.allcolors[proj.id] = "#F2C94C";
         	}
         	else if (proj.status === "#F2C94C"){
         		this.allcolors[proj.id] = "#F2C94C";
         	}
         	else if(proj.status === "#6FCF97"){
         		this.allcolors[proj.id] = "#6FCF97";
         	}else if(proj.status === "#EB5757"){
         		this.allcolors[proj.id] = "#EB5757";
         	}
         	console.log(proj.id);
         	proj.version_id = res[i]["_id"];
			var curr_comments;
         	if("comments" in res[i]){
         	 curr_comments = res[i]["comments"];
         	}else{
         		curr_comments = [];
         	}


       //   	var all_comments = this.getcommentsall(proj.version_id).subscribe((res:any) => {
       //   			console.log(res);
		     //  	}, (err) => {
		     //    console.log(err);
		     // });


         	// console.log(all_comments);

         	this.allcolors.push("#F2C94C");
         	this.designs.push(proj);
         	this.comments.push(curr_comments);

         	counter++;
         }


         console.log(this.comments);
         


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


  addcommentsub(version_id){
  	 var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    var comment = (<HTMLInputElement>document.getElementById("comment_place")).value;
    console.log(comment);
    console.log(version_id);
    (<HTMLInputElement>document.getElementById("comment_place")).value = "";

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/addcomment', JSON.stringify({"comment": comment,
	"_id": version_id}), {
     headers: headers
    });
  }

  getcommentsall(version_id){
  	 var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

   

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/getcomments', JSON.stringify({
	"_id": version_id}), {
     headers: headers
    });
  }

  getcomments(version_id){
  	this.getcommentsall(version_id).subscribe((res:any) => {
  		console.log(res);
  	});
  }

  addcomment(version_id){
  	this.addcommentsub(version_id).subscribe((res:any) => {
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
