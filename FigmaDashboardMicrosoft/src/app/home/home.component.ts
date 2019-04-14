import { Component, OnInit } from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from "@angular/common/http";
import { Params } from '@angular/router';

import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

export interface Project{
	title:string,
	thumbnail_url: string,
	last_modified: string,
	id: string
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	code:string = "";
  state:string = "";
	projects:Project[] = [];
  queryParams: Params = null;
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
  	  private router: Router) { }

  view_id_view(teamid: string){
		var datax;
		var teamid = (<HTMLInputElement>document.getElementById("teamident")).value;
	 const headers = new HttpHeaders({

			 'Content-Type': 'application/json'
	 });

	 // console.log("DATA: " + data);
	 // console.log("HEADERS: " + headers);
	 //make a cross origin POST request for user timeline info.
	 return this.http.post('http://127.0.0.1:8080/teamProjectsall', JSON.stringify({"code": this.code, "teamid": teamid}), {
		 headers: headers
	 });


	}


  view_id_view_head(teamid:string){
      this.view_id_view(teamid)

      .subscribe((res:any) => {
         console.log(res);
         for(var i = 0; i < res.length; ++i){
           var proj = {} as Project;
           proj.title = res[i]["name"];
           proj.thumbnail_url = res[i]["thumbnailUrl"];
           proj.last_modified = res[i]["files"][0]["last_modified"];
           proj.id = res[i]["id"];
           this.projects.push(proj);
         }

      }, (err) => {
        console.log(err);
      });
  }
  getProjects(code: string){
     var datax;
		 var teamid;
    const headers = new HttpHeaders({

        'Content-Type': 'application/json'
    });

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/teamProjectsall', JSON.stringify({"code": code}), {
      headers: headers
    });
  }
  ngOnInit() {
  	this.code = "";
  	this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        this.code = params["code"];
        this.state = params["state"];
    });



    // this.getProjects(this.code)

    //   .subscribe((res:any) => {
    //      console.log(res);
    //      for(var i = 0; i < res.length; ++i){
    //      	var proj = {} as Project;
    //      	proj.title = res[i]["name"];
    //      	proj.thumbnail_url = res[i]["thumbnailUrl"];
    //      	proj.last_modified = res[i]["files"][0]["last_modified"];
    //      	proj.id = res[i]["id"];
    //      	this.projects.push(proj);
    //      }

    //   }, (err) => {
    //     console.log(err);
    //   });



  }

  view_features(id, name){
  	console.log("PROJ ID: " + id);
    this.queryParams = {code: this.code, state: this.state, project_name: name};
  	  this.router.navigate(['/features', id],     {   relativeTo: this.activatedRoute,
queryParams: this.queryParams, queryParamsHandling: "merge" });

  }

}
