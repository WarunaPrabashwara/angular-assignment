import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoursesComponent } from './courses/courses.component';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { StudentComponent } from './student/student.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AddCourseDialogComponent } from './add-course-dialog/add-course-dialog.component';
import { AddStudentDialogComponent } from './add-student-dialog/add-student-dialog.component'; // Import FormsModule

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    DashboardComponent,
    StudentsComponent,
    StudentComponent,
    AddCourseDialogComponent,
    AddStudentDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule ,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
