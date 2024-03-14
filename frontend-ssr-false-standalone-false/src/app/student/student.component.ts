import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router  } from '@angular/router';
import { StudentService } from '../student.service';
import { Student } from '../interfaces/student.interface';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  queryParams: Params | undefined
  userId: string | undefined;
  student : Student | undefined ;
  selectedCourse_id : number | undefined;
  courses: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: StudentService,
    private coursesService: CoursesService
    ) { }

  ngOnInit(): void {
    // Accessing the user ID from the query parameter
    this.route.queryParams.subscribe(params => {
      this.userId = params['id'];
      this.queryParams = params;

      this.userService.getaStudent_by_id(this.userId).subscribe(user => {
        this.student = user;
      });


    });

    this.coursesService.getCourses().subscribe(courses => {
      this.courses = courses;
    });

  }

  unenrollStudent( course_n_studnt_id: any , course_id: any , student_id: any ): void {
    this.userService.unenrollUserFromCourse( course_n_studnt_id , course_id , student_id ).subscribe(
      () => {
        // Handle successful unenrollment
        // this.router.navigate(['.'], { relativeTo: this.route ,  queryParams: this.queryParams });
        this.ngOnInit() // this refreshes the page after updating
      },
      (error) => {
        // Handle error
      }
    );
  }


  enrollStudent( student_id: any ): void {
    if( this.selectedCourse_id != undefined ){
      this.userService.enrollUsertoCourse(  student_id , this.selectedCourse_id  ).subscribe(
        () => {
          // Handle successful unenrollment
          // this.router.navigate(['.'], { relativeTo: this.route ,  queryParams: this.queryParams });
          this.ngOnInit() // this refreshes the page after updating
        },
        (error) => {
          // Handle error
        }
      );
    }
    else{
      alert( ' Select the course id  ')
    }

  }

}
