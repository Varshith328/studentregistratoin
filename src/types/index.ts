export interface CourseType {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  createdAt: Date;
}

export interface CourseOffering {
  id: string;
  courseId: string;
  courseTypeId: string;
  courseName: string;
  courseTypeName: string;
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface StudentRegistration {
  id: string;
  studentId: string;
  courseOfferingId: string;
  student: Student;
  courseOffering: CourseOffering;
  registrationDate: Date;
}