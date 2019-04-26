import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from "@angular/common/http";
import {HttpParams} from '@angular/common/http';


import { Params } from '@angular/router';


export interface Feature{
  title:string,
  thumbnail_url: string,
  last_modified: string,
  id: string
};



@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  id = "";
  
  code:string = "";
  state:string = "";
  features:Feature[] = [];
  project_name = "";
   queryParams: Params = null;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
      private router: Router) { }

  getFiles(code: string){
     var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/projectsbyid', JSON.stringify({"code": code, "id": this.id}), {
      headers: headers
    });
  }
  ngOnInit() {


  	 this.activatedRoute.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['project_id']) //log the value of id
      this.id = params['project_id'];
    });
  	 this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        this.code = params["code"];
        this.project_name = params["project_name"];
    });


     document.getElementById("projecttitle").innerHTML = this.project_name;

  	 this.getFiles(this.code).subscribe((res:any) => {

         for(var i = 0; i < res["files"].length; ++i){
         	var proj = {} as Feature;
         	proj.title = res["files"][i]["name"];
         	proj.thumbnail_url = res["files"][i]["thumbnailUrl"];
         	proj.last_modified = res["files"][i]["last_modified"];
         	proj.id = res["files"][i]["key"];
         	this.features.push(proj);
         }
         console.log(this.features);
      }, (err) => {
        console.log(err);
      });



  }


  view_features(id, name){
     this.queryParams = {code: this.code, state: this.state, feature_name: name, project_id: this.id};
      this.router.navigate(['/designs', id],     {   relativeTo: this.activatedRoute,
queryParams: this.queryParams, queryParamsHandling: "merge" });

  }

  navigateHome(){
    this.queryParams = {code: this.code, state: this.state};
    console.log("BEFORE..");
      this.router.navigate(['/home'],     {   relativeTo: this.activatedRoute,
queryParams: this.queryParams, queryParamsHandling: "merge" });
  }

}
