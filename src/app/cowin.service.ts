import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Centers } from './models/centers';
import {catchError, map, take} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CowinService {

  private url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=191&date=17-05-2021';
  constructor(private http: HttpClient) { }

  getCenters(): Observable<Centers[]>{
    return this.http.get(this.url).pipe(map((data: any) => data.centers ), 
    catchError(error => { return throwError('Its a Trap!')}));
  }
}
