import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CourseOffering } from '../../types';
import { Mail, Phone, Calendar, UserX } from 'lucide-react';
import Button from '../UI/Button';

interface RegisteredStudentsListProps {
  courseOfferingId: string;
  courseOffering: CourseOffering;
}

export default function RegisteredStudentsList({ courseOfferingId, courseOffering }: RegisteredStudentsListProps) {
  const { registrations, setRegistrations } = useAppContext();
  
  const registeredStudents = registrations.filter(r => r.courseOfferingId === courseOfferingId);

  const handleUnregister = (registrationId: string) => {
    if (window.confirm('Are you sure you want to unregister this student?')) {
      setRegistrations(prev => prev.filter(r => r.id !== registrationId));
    }
  };

  if (registeredStudents.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No students registered for this course offering</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h5 className="font-medium text-gray-900">
        Registered Students ({registeredStudents.length})
      </h5>
      
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {registeredStudents.map((registration) => (
          <div key={registration.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-150">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">{registration.student.name}</h6>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {registration.student.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {registration.student.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnregister(registration.id)}
                className="ml-4 flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <UserX className="w-4 h-4" />
                <span>Unregister</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}