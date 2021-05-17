import { Component, OnDestroy, OnInit } from '@angular/core';
import { CowinService } from 'src/app/cowin.service';
import { Centers } from 'src/app/models/centers';
import { timer, Observable, Subject, Subscription, empty } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { switchMap, takeUntil, catchError, startWith } from 'rxjs/operators';
import { ResponseData } from 'src/app/models/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-center-list',
  templateUrl: './center-list.component.html',
  styleUrls: ['./center-list.component.css']
})
export class CenterListComponent implements OnInit, OnDestroy {

  centers: Centers[]=[];  
  responses: ResponseData[]=[];
  showAlert: boolean = false;
  timeInterval: Subscription | undefined ;
  status: any;
  constructor(private cowinService: CowinService) { 
  }

  ngOnInit(): void {
    this.timeInterval = interval(5*1000).pipe(
      switchMap(()=>{ return this.cowinService.getCenters().pipe(catchError((error) => this.handleError(error) ))}))
      .subscribe(data => 
      {
        this.centers = data;
        this.responses=[];
        this.showAlert=false;
        for (let i=0;i<this.centers.length;i++){
          for (let j=0;j<this.centers[i].sessions.length;j++){
            if (this.centers[i].sessions[j].available_capacity>0 && this.centers[i].sessions[j].min_age_limit==18){
              console.log("Yayy");
              this.showAlert=true;
              this.responses.push(new ResponseData(this.centers[i].name, this.centers[i].sessions[j].min_age_limit,this.centers[i].sessions[j].vaccine, this.centers[i].sessions[j].date,this.centers[i].sessions[j].available_capacity, this.centers[i].pincode));
            }
          }
        }
        if (this.showAlert){
          this.playAudio();
          // window.alert("Seats Available!!");
        }
      },
      function(error){
        console.log("error aaya hai bhai, "+error);
      }
    );

  }

  ngOnDestroy(): void{
    this.timeInterval?.unsubscribe();
  }


  playAudio(){
    let audio = new Audio();
    audio.src = "../../../../assets/audio/ringout.wav";
    audio.load();
    audio.play();
  }

  trackCenters(i:Number, center: Centers): Number{
    return center.center_id;
  }
  
  private handleError(error: HttpErrorResponse) {
    console.log("Error bahar hi pakad liyo bhayo"+error);
    return empty();
  }
}
