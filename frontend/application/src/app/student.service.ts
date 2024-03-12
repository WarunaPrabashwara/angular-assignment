import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ApiResponse, ApiResponse_By_id ,  Student } from './interfaces/student.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<ApiResponse>( this.baseUrl + '/admin/get_all_students').pipe(
      map(response  => response.data ) // Extract the 'data' array from the response
    );
  }

  getaStudent_by_id( userid: string | undefined): Observable<Student | undefined> {
    if( userid ){
    return this.http.get<ApiResponse_By_id>( this.baseUrl + '/admin/get_student_by_id?id=' + userid ).pipe(
      map(response  => response.data ) // Extract the 'data' array from the response
    );
    }
    else{
      return of(undefined);
    }

  }

  unenrollUserFromCourse( id: number, studentId: number, courseId: number): Observable<any> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('student_id', studentId.toString());
    formData.append('course_id', courseId.toString());
    return this.http.put<any>(`${this.baseUrl}/admin/unenrolling_user_from_course`, formData /* { id: id, student_id: studentId, course_id: courseId }*/  );
  }


  enrollUsertoCourse(  studentId: number, courseId: number): Observable<any> {
    const formData = new FormData();
    formData.append('student_id', studentId.toString());
    formData.append('course_id', courseId.toString());
    return this.http.post<any>(`${this.baseUrl}/admin/assign_student_to_course`, formData /* { id: id, student_id: studentId, course_id: courseId }*/  );
  }


}
