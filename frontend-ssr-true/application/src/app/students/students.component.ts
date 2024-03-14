import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { StudentService } from '../student.service';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import { CommunicationService } from '../communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'] // Corrected styleUrls
})
export class StudentsComponent implements OnInit,OnDestroy  {
  private subscription: Subscription = new Subscription ;

  students: any[] = [];
  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private communicationService: CommunicationService
    ) { }
  ngOnInit(): void {
    this.studentService.getStudents().subscribe(students => {
      this.students = students;

    });
    this.subscription = this.communicationService.getSubmitObservable().subscribe(() => {
      this.ngOnInit(); // Re-run ngOnInit
    });
  }

  ngOnDestroy() {
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '400px' // Adjust the width as needed
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle dialog close event if needed
    });
  }

}
