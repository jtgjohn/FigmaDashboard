import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from "@angular/common/http";
import {HttpParams} from '@angular/common/http';
import {Location} from '@angular/common';


export interface Status{
	color: string,
	status: string
}	



export interface Design{
  title:string,
  thumbnail_url: string,
  last_modified: string,
  approver: string,
  last_approved: string,
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
  today_date = "";
  commentson = [];
	colorversion = "";
	allcolors = [];
	comments = [];
	colorversionreview = "";
	changeworthy:boolean = false;
	panelvisible:boolean = false;
  statusfiltercolor = "";
  filterbystatus:boolean = false;
  public width: Number;
  public left: Number;
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
      private router: Router, private _location: Location) { }

   getFileImages(){
     var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    return this.http.post('http://127.0.0.1:8080/fileImagebyFeature', JSON.stringify({"code": this.code, 
    	"id": this.id}), {
      headers: headers
    });
  }

  modifyStatus(versionId, status){
  	const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    return this.http.post('http://127.0.0.1:8080/updatestatus', JSON.stringify({"versionId": versionId, "status": status}), {
      headers: headers
    });
  }




  showOptionsexp(checked){
    console.log(checked);
    this.filterbystatus = checked;
    this.statusfiltercolor = "#F2C94C";
    if(!checked){
      this.comments.length = 0;
      this.designs.length = 0;
      this.commentson.length = 0;
      this.allcolors.length = 0;
      var counter = 0;
       this.getVersions().subscribe((res:any) => {
         console.log(res);

         for(var i = 0; i < res.length; ++i){
           this.comments.push([]);
           var proj = {} as Design;

           proj.title = res[i]["whatisnewinfo"];
           proj.thumbnail_url = res[i]["imagePath"];
           proj.last_modified = res[i]["timestamp"];
           this.commentson.push(false);
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
           proj.version_id = res[i]["_id"];
          var curr_comments = [];
 
          if("lastChanger" in res[i]){
            proj.approver = res[i]["lastChanger"];
            proj.last_approved = res[i]["lastChangetime"];

          }else{
            proj.approver = "";
            proj.last_approved = "";
          }
           if("comments" in res[i]){
             for(var x = 0; x < res[i]["comments"].length; ++x){
               if(typeof res[i]["comments"][x] !== 'string' && res[i]["comments"][x]["commentBody"]!=="" ){

                 var handle = res[i]["comments"][x][0]["userHandle"];

                 var colon = " : ";
                 var commentbody = res[i]["comments"][x][0]["commentBody"];
                 var final = handle.concat(colon).concat(commentbody);
                  curr_comments.push(final);
                  this.comments[this.comments.length - 1].push(final);
               }
             }
           }else{
             curr_comments = [];
           }

           this.allcolors.push("#F2C94C");
           this.designs.push(proj);

           counter++;
         }

        
         

      }, (err) => {
        console.log(err);
      });
    }else{
      this.comments.length = 0;
      this.designs.length = 0;
      this.commentson.length = 0;
      this.allcolors.length = 0;
      var counter = 0;
       this.getVersionsByStatus("#F2C94C").subscribe((res:any) => {


         for(var i = 0; i < res.length; ++i){
           this.comments.push([]);
           var proj = {} as Design;

           proj.title = res[i]["whatisnewinfo"];
           proj.thumbnail_url = res[i]["imagePath"];
           proj.last_modified = res[i]["timestamp"];
           this.commentson.push(false);
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
           proj.version_id = res[i]["_id"];
          var curr_comments = [];
 
          if("lastChanger" in res[i]){
            proj.approver = res[i]["lastChanger"];
            proj.last_approved = res[i]["lastChangetime"];

          }else{
            proj.approver = "";
            proj.last_approved = "";
          }
           if("comments" in res[i]){
             for(var x = 0; x < res[i]["comments"].length; ++x){
               if(typeof res[i]["comments"][x] !== 'string' && res[i]["comments"][x]["commentBody"]!=="" ){

                 var handle = res[i]["comments"][x][0]["userHandle"];

                 var colon = " : ";
                 var commentbody = res[i]["comments"][x][0]["commentBody"];
                 var final = handle.concat(colon).concat(commentbody);
                  curr_comments.push(final);
                  this.comments[this.comments.length - 1].push(final);

               }
             }
           }else{
             curr_comments = [];
           }

           this.allcolors.push("#F2C94C");
           this.designs.push(proj);
           counter++;
         }

      }, (err) => {
        console.log(err);
      });
    }
  }

  onChangefilter(val){
    this.comments.length = 0;
      this.designs.length = 0;
      this.commentson.length = 0;
      this.allcolors.length = 0;
      var counter = 0;
       this.getVersionsByStatus(val).subscribe((res:any) => {

         for(var i = 0; i < res.length; ++i){
           this.comments.push([]);
           var proj = {} as Design;

           proj.title = res[i]["whatisnewinfo"];
           proj.thumbnail_url = res[i]["imagePath"];
           proj.last_modified = res[i]["timestamp"];
           this.commentson.push(false);
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
           proj.version_id = res[i]["_id"];
           var curr_comments = [];
 
          if("lastChanger" in res[i]){
            proj.approver = res[i]["lastChanger"];
            proj.last_approved = res[i]["lastChangetime"];

          }else{
            proj.approver = "";
            proj.last_approved = "";
          }
           if("comments" in res[i]){
             for(var x = 0; x < res[i]["comments"].length; ++x){
               if(typeof res[i]["comments"][x] !== 'string' && res[i]["comments"][x]["commentBody"]!=="" ){

                 var handle = res[i]["comments"][x][0]["userHandle"];

                 var colon = " : ";
                 var commentbody = res[i]["comments"][x][0]["commentBody"];
                 var final = handle.concat(colon).concat(commentbody);
                  curr_comments.push(final);
                  this.comments[this.comments.length - 1].push(final);

               }
             }
           }else{
             curr_comments = [];
           }

           this.allcolors.push("#F2C94C");
           this.designs.push(proj);

           counter++;
         }


         
      }, (err) => {
        console.log(err);
      });
  }

  onChange(versionId, val){
  	this.modifyStatus(versionId, val).subscribe((res:any) => {

         var id = -1;
         for(var i = 0; i < this.designs.length; ++i){
           if(this.designs[i].version_id === versionId){
             this.designs[i].approver = res["lastChanger"];
             this.designs[i].last_approved = res["lastChangetime"];
           }
         }

      }, (err) => {
        console.log(err);
      });
  }
  togglecomments(id){
  	this.commentson[id] = !this.commentson[id];
    var total_view = "view" + id;
    if(this.commentson[id]){
      document.getElementById(total_view).innerHTML = "Hide Comments";
    }else{
       document.getElementById(total_view).innerHTML = "View Comments";
    }
  }


  getVersionsByStatus(status){
     var datax; 
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    var url = "http://127.0.0.1:8080/getVersionsbyStatus";
    
    return this.http.get(url, {
      params: {'status': status, 'fid': this.id}
    });
  }
  getVersions(){
  	 var datax; 
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    var url = "http://127.0.0.1:8080/getVersions";
    let paramsh = new HttpParams().set('fid', this.id);

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


            var newDiv = document.createElement("SPAN"); 
  // and give it some content 
  var newContent = document.createTextNode(this.project_name); 
  // add the text node to the newly created div
  newDiv.appendChild(newContent);  
              // this.width = newDiv.clientWidth;
                console.log(this.width);

               console.log(document.getElementById('list_project_title').style.width);

    });

var counter = 0;
  	 this.getFileImages().subscribe((res:any) => {
         console.log(res);
         
         for (let key in res["images"]) {
   
         	this.latest_thumbnail_url = res["images"][key];

         }
      }, (err) => {
        console.log(err);
      });


     console.log(this.comments);
  	 this.getVersions().subscribe((res:any) => {
         console.log(res);

         for(var i = 0; i < res.length; ++i){
           this.comments.push([]);
         	var proj = {} as Design;

         	proj.title = res[i]["whatisnewinfo"];
         	proj.thumbnail_url = res[i]["imagePath"];
         	proj.last_modified = res[i]["timestamp"];
           this.commentson.push(false);
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
         	proj.version_id = res[i]["_id"];
			    var curr_comments = [];
 
          if("lastChanger" in res[i]){
            proj.approver = res[i]["lastChanger"];
            proj.last_approved = res[i]["lastChangetime"];

          }else{
            proj.approver = "";
            proj.last_approved = "";
          }
         	if("comments" in res[i]){
             for(var x = 0; x < res[i]["comments"].length; ++x){
               if(typeof res[i]["comments"][x] !== 'string' && res[i]["comments"][x]["commentBody"]!=="" ){

                 var handle = res[i]["comments"][x][0]["userHandle"];

                 var colon = " : ";
                 var commentbody = res[i]["comments"][x][0]["commentBody"];
                 var final = handle.concat(colon).concat(commentbody);

             	   curr_comments.push(final);
                  this.comments[this.comments.length - 1].push(final);

               }
             }
         	}else{
         		curr_comments = [];
         	}


         	this.allcolors.push("#F2C94C");
         	this.designs.push(proj);

         	counter++;
         }

      }, (err) => {
        console.log(err);
      });

  }


  viewRepLink(){
  	this.changeworthy = !this.changeworthy;
  }


  addcommentsub(id, version_id){
  	 var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    var comment = (<HTMLInputElement>document.getElementById(id)).value;

    var total = id;
    (<HTMLInputElement>document.getElementById(total)).value = "";

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

  addcomment(id, version_id){
  	this.addcommentsub(id, version_id).subscribe((res:any) => {

         var comment = res["userHandle"] + " : " + res["commentBody"];

         this.comments[id].push(comment);

      }, (err) => {
        console.log(err);
      });
  }

  addnewversioncall(status){
  	  var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    var reviewer = "";
    var whatisnew = (<HTMLInputElement>document.getElementById("wnew")).value;

    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/addversion', JSON.stringify({"reviewer": reviewer,"status": "#F2C94C", 
    	"fid": this.id,
    	"imagePath": this.latest_thumbnail_url, "whatisnew": whatisnew, "readytoexport": this.readytoexport}), {
      headers: headers
    });
  }
  addnewversion(){
  	this.panelvisible = !this.panelvisible;
  	 var status = "";
     if(this.panelvisible){
       var now = new Date();
        var day = String(now.getDate()).padStart(2, '0');
        var month = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
        var year = now.getFullYear();
        var current_day = "";
        current_day+= (month + "/" + day + "/" + year);
        console.log(current_day);
         this.today_date = current_day;
     }else{
       document.getElementById("top_button").innerHTML = "Add New Version";
     }

    if(this.colorversion === "#F2C94C"){
		status = "Request Approval";
	}else if(this.colorversion === "#BDBDBD"){
		status = "Draft";
	}
	else{
		return;
	}
  	this.addnewversioncall(status).subscribe((res:any) => {

         var proj = {} as Design;
         proj.title = res["whatisnewinfo"];
         proj.thumbnail_url = this.latest_thumbnail_url;
         proj.last_modified = res["timestamp"];
         proj.id = 0;
         proj.status = res["status"];
         proj.last_approved = "";
         proj.approver = "";
         proj.version_id = res["_id"];
         if(this.filterbystatus == false){
            for(var x = 0; x < this.designs.length; ++x){
             this.designs[x].id++;

           }
           this.allcolors.unshift("#F2C94C");
           this.commentson.unshift(false);
           this.comments.unshift([]);
           this.designs.unshift(proj);
         }
         if(this.statusfiltercolor === proj.status){
           for(var x = 0; x < this.designs.length; ++x){
             this.designs[x].id++;

           }
           this.allcolors.unshift("#F2C94C");
           this.commentson.unshift(false);
           this.comments.unshift([]);
           this.designs.unshift(proj);
         }

      }, (err) => {
        console.log(err);
      });
  }


  navigateHome(){
     var queryParams = {code: this.code, state: this.state};
      this.router.navigate(['/home'],     {   relativeTo: this.activatedRoute,
queryParams: queryParams, queryParamsHandling: "merge" });
  }


  navigateProject(){
    this._location.back();
  }


}
