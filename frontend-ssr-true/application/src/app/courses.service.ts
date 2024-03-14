import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, Course } from './interfaces/course.interface'; // Import the interface

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<ApiResponse>( this.baseUrl + '/admin/courses').pipe(
      map(response  => response.data ) // Extract the 'data' array from the response
    );
  }
}
