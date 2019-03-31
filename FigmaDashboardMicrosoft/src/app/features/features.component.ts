import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from "@angular/common/http";
import {HttpParams} from '@angular/common/http';


import { Params } from '@angular/router';


@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  id = "";
  code = "";
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  getFiles(code: string){
     var datax;
    const headers = new HttpHeaders({
       
        'Content-Type': 'application/json'
    });

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.
    return this.http.post('http://127.0.0.1:8080/projectsbyid', JSON.stringify({"code": code, "id": this.id}), {
      headers: headers
    });
  }
  ngOnInit() {
  	  // let id = this.route.snapshot.paramMap.get('id');
  	  // console.log(id);
  	 this.route.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['project_id']) //log the value of id
      this.id = params['project_id'];
    });
  	 this.route.queryParams.subscribe(params => {
        console.log(params);
        this.code = params["code"];
    });


  	 this.getFiles(this.code).subscribe((res:any) => {
         console.log(res);
         // for(var i = 0; i < res.length; ++i){
         // 	var proj = {} as Project;
         // 	proj.title = res[i]["name"];
         // 	proj.thumbnail_url = res[i]["thumbnailUrl"];
         // 	proj.last_modified = res[i]["files"][0]["last_modified"];
         // 	proj.id = res[i]["id"];
         // 	this.projects.push(proj);
         // }
       
      }, (err) => {
        console.log(err);
      });



  }


   

}
