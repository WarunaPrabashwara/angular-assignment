export interface Course {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  category: string;
  price: number;
  is_active: boolean;
  instructor_id: number;
  rating: number;
  link_for_img: string;
  instructor: {
    id: number;
    name: string;
    email: string;
  };

}



export interface ApiResponse {
  status: boolean;
  data: Course[];
}
