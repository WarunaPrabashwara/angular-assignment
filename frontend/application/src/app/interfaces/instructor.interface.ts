import { Course } from "./course.interface";

export interface instructor {
  id: number;
  createdAt: string;
  name     : String;
  email    : String;

}


export interface ApiResponse {
  status: boolean;
  data: instructor[];
}
