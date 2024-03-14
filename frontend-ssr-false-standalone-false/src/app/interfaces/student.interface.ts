import { Course } from "./course.interface";

export interface Student {
  id: number;
  createdAt: string;
  name     : String;
  email    : String;
  courses  : [ course_with_student ];
}

export interface course_with_student {
  id : Number;
  createdAt : String;
  id_of_stud : Number;
  id_of_course : Number;
  status : Number;
  progress : Number;
  course : Course ;
}

export interface ApiResponse {
  status: boolean;
  data: Student[];
}

export interface ApiResponse_By_id {
  status: boolean;
  data: Student;
}
