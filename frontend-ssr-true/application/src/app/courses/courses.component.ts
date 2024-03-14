import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoursesService } from '../courses.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddCourseDialogComponent } from '../add-course-dialog/add-course-dialog.component';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit,OnDestroy  {
  private subscription: Subscription = new Subscription;
  courses: any[] = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';
  sortBy: string = ''; // Default sorting criteria
  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog,
    private communicationService: CommunicationService
    ) { }

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe(courses => {
      this.courses = courses;
      // Initialize your courses array, e.g., fetch from API
      this.filteredCourses = this.courses;
    });
    this.subscription = this.communicationService.getSubmitObservable().subscribe(() => {
      this.ngOnInit(); // Re-run ngOnInit
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterCourses(): void {
    if (!this.searchTerm) {
      this.filteredCourses = this.courses;
      return;
    }

    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      course.category.toLowerCase().includes(lowerCaseSearchTerm) ||
      course.instructor.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  sortCourses() {
    // Clone the courses array to avoid mutating the original array
    this.filteredCourses = [...this.filteredCourses];

    // Perform sorting based on the selected criteria
    switch (this.sortBy) {
      case 'price':
        this.filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        this.filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'category':
        this.filteredCourses.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }
  }


  getFullImageUrl(imageUrl: string): string {
    return environment.imageUrl + imageUrl; // Adjust the environment variable accordingly
  }

  openAddCourseDialog(): void {
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      width: '400px' // Adjust the width as needed
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle dialog close event if needed
    });
  }

}
