import { Component, OnInit } from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from "@angular/common/http";

import {ActivatedRoute} from '@angular/router';


export interface Project{
	title:string,
	thumbnail_url: string,
	last_modified: string
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	code:string = "";
	projects:Project[] = [];
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) { }


  getProjects(code: string){
     var datax;
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
    });


    this.getProjects(this.code)
    
      .subscribe((res:any) => {
         console.log(res);
         for(var i = 0; i < res.length; ++i){
         	var proj = {} as Project;
         	proj.title = res[i]["name"];
         	proj.thumbnail_url = res[i]["thumbnailUrl"];
         	proj.last_modified = res[i]["files"][0]["last_modified"];
         	this.projects.push(proj);
         }
       
      }, (err) => {
        console.log(err);
      });
	


  }

}
