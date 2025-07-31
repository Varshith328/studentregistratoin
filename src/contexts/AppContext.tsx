import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CourseType, Course, CourseOffering, Student, StudentRegistration } from '../types';

interface AppContextType {
  courseTypes: CourseType[];
  courses: Course[];
  courseOfferings: CourseOffering[];
  students: Student[];
  registrations: StudentRegistration[];
  setCourseTypes: (courseTypes: CourseType[] | ((prev: CourseType[]) => CourseType[])) => void;
  setCourses: (courses: Course[] | ((prev: Course[]) => Course[])) => void;
  setCourseOfferings: (offerings: CourseOffering[] | ((prev: CourseOffering[]) => CourseOffering[])) => void;
  setStudents: (students: Student[] | ((prev: Student[]) => Student[])) => void;
  setRegistrations: (registrations: StudentRegistration[] | ((prev: StudentRegistration[]) => StudentRegistration[])) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCourseTypes: CourseType[] = [
  { id: '1', name: 'Individual', createdAt: new Date() },
  { id: '2', name: 'Group', createdAt: new Date() },
  { id: '3', name: 'Special', createdAt: new Date() },
];

const initialCourses: Course[] = [
  { id: '1', name: 'English', createdAt: new Date() },
  { id: '2', name: 'Hindi', createdAt: new Date() },
  { id: '3', name: 'Urdu', createdAt: new Date() },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [courseTypes, setCourseTypes] = useLocalStorage<CourseType[]>('courseTypes', initialCourseTypes);
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', initialCourses);
  const [courseOfferings, setCourseOfferings] = useLocalStorage<CourseOffering[]>('courseOfferings', []);
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [registrations, setRegistrations] = useLocalStorage<StudentRegistration[]>('registrations', []);

  return (
    <AppContext.Provider value={{
      courseTypes,
      courses,
      courseOfferings,
      students,
      registrations,
      setCourseTypes,
      setCourses,
      setCourseOfferings,
      setStudents,
      setRegistrations,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}