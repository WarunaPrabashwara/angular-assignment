import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { StudentService } from '../student.service';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrl: './add-student-dialog.component.css'
})
export class AddStudentDialogComponent {

  student = {
    name: '',
    email: '',
    pswd: '',
    ulevel: 3,
  };

  constructor(
    public dialogRef: MatDialogRef<AddStudentDialogComponent>,
    private http: HttpClient,
    private studentService: StudentService,
    private communicationService: CommunicationService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    const formData = new FormData();
    formData.append('name', this.student.name);
    formData.append('email', this.student.email);
    formData.append('pswd', this.student.pswd);
    formData.append('ulevel', this.student.ulevel.toString());

    // Submit the form to the URL from environment
    this.http.post(environment.baseUrl + '/admin/add_user', formData)
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


}
