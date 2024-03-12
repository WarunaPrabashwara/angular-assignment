import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { InstructorsService } from '../instructors.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrl: './add-course-dialog.component.css'
})
export class AddCourseDialogComponent implements OnInit {
  instructors: any[] = [];

  course = {
    price: '',
    instructor_id: '',
    category: '',
    description: '',
    title: '',
    file: null
  };


  constructor(
    public dialogRef: MatDialogRef<AddCourseDialogComponent>,
    private http: HttpClient,
    private InstructorsService: InstructorsService,
    private communicationService: CommunicationService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.course.file = file;
    }
    else {
      // Clear the file property if no file is selected
      this.course.file = null;
    }
  }

  onSubmit(): void {

    const formData = new FormData();
    formData.append('price', this.course.price);
    formData.append('instructor_id', this.course.instructor_id);
    formData.append('category', this.course.category);
    formData.append('description', this.course.description);
    formData.append('title', this.course.title);
    if (this.course.file != null) { formData.append('file', this.course.file); }

    // Submit the form to the URL from environment
    this.http.post(environment.baseUrl + '/admin/courses', formData)
      .subscribe(response => {
        console.log('Form submitted successfully:', response);
        // After successful submission, trigger the communication service
        this.communicationService.submitRequest();
      }, error => {
        console.error('Error submitting form:', error);
      });

    // Implement your form submission logic here
    // After successful submission, close the dialog
    this.dialogRef.close();
  }


  ngOnInit(): void {
    this.InstructorsService.getInstructors().subscribe(instructors => {
      this.instructors = instructors;
    });
  }

}
