import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, instructor } from './interfaces/instructor.interface';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getInstructors(): Observable<instructor[]> {
    return this.http.get<ApiResponse>( this.baseUrl + '/admin/get_all_instructors').pipe(
      map(response  => response.data ) // Extract the 'data' array from the response
    );
  }
}
