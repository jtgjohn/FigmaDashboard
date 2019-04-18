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
  status_values: any = [];
  queryParams: Params = null;
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
  	  private router: Router) { }

  view_id_view(teamid: string){
    console.log(teamid);
		var datax;
		// var teamid = (<HTMLInputElement>document.getElementById("teamident")).value;
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

  add_team_sub(team){
      var datax;
    
   const headers = new HttpHeaders({

       'Content-Type': 'application/json'
   });

   // console.log("DATA: " + data);
   // console.log("HEADERS: " + headers);
   //make a cross origin POST request for user timeline info.
   return this.http.post('http://127.0.0.1:8080/postTeam', JSON.stringify({"team": team}), {
     headers: headers
   });
  }




  add_team(){
    var new_team = (<HTMLInputElement>document.getElementById("add_team_input")).value;
    (<HTMLInputElement>document.getElementById("add_team_input")).value = "";
    this.status_values.push(new_team);
   this.add_team_sub(new_team)

      .subscribe((res:any) => {
         console.log(res);
         // for(var i = 0; i < res.length; ++i){
         //   var proj = {} as Project;
         //   proj.title = res[i]["name"];
         //   proj.thumbnail_url = res[i]["thumbnailUrl"];
         //   proj.last_modified = res[i]["files"][0]["last_modified"];
         //   proj.id = res[i]["id"];
         //   this.projects.push(proj);
         // }

      }, (err) => {
        console.log(err);
      });
  }


  remove_team_sub(team){
    var datax;
    
   const headers = new HttpHeaders({

       'Content-Type': 'application/json'
   });

   // console.log("DATA: " + data);
   // console.log("HEADERS: " + headers);
   //make a cross origin POST request for user timeline info.
   return this.http.post('http://127.0.0.1:8080/removeTeam', JSON.stringify({"team": team}), {
     headers: headers
   });

  }

  remove_team(){
    var old_team = (<HTMLSelectElement>document.getElementById("remove_team_input"));
    var old_team_val = old_team.options[old_team.selectedIndex].text;

    var index = -1;

         for(var i = 0; i < this.status_values.length; ++i){
           if(this.status_values[i] === old_team_val){
             index = i;
           }
         }

         this.status_values.splice(index, 1);

         
         // console.log("STATUS VAL: ");
         // console.log(this.status_values);
     this.remove_team_sub(old_team_val)

      .subscribe((res:any) => {
         console.log(res);

         // for(var i = 0; i < res.length; ++i){
         //   var proj = {} as Project;
         //   proj.title = res[i]["name"];
         //   proj.thumbnail_url = res[i]["thumbnailUrl"];
         //   proj.last_modified = res[i]["files"][0]["last_modified"];
         //   proj.id = res[i]["id"];
         //   this.projects.push(proj);
         // }

      }, (err) => {
        console.log(err);
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

  public onChangeTeam(event): void {  // event will give you full breif of action
    const newVal = event.target.value;
    console.log(newVal);
     this.view_id_view(newVal)

      .subscribe((res:any) => {
         console.log(res);
         this.projects.length = 0;
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
    // console.log(newVal);
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

  loadTeams(code: string){
     var datax;
     var teamid;
    const headers = new HttpHeaders({

        'Content-Type': 'application/json'
    });

    // console.log("DATA: " + data);
    // console.log("HEADERS: " + headers);
    //make a cross origin POST request for user timeline info.

    return this.http.post('http://127.0.0.1:8080/getUserTeams', JSON.stringify({"code": code}), {
      headers: headers
    });

    // return this.http.get('http://127.0.0.1:8080/getUserTeams',  {
    //   headers: headers
    // });
  }
  ngOnInit() {
  	this.code = "";
  	this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        this.code = params["code"];
        this.state = params["state"];
        this.loadTeams(this.code)

        .subscribe((res:any) => {
          console.log(res);
          for(var i = 0; i < res["teamIDs"].length; ++i){
            this.status_values.push(res["teamIDs"][i]);
          }
        }, (err) => {
          console.log(err);
        });
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
