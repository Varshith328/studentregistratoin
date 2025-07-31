import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { StudentRegistration, Student } from '../../types';
import { Plus, Users, Filter } from 'lucide-react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Select from '../UI/Select';
import StudentRegistrationForm from './StudentRegistrationForm';
import RegisteredStudentsList from './RegisteredStudentsList';

export default function StudentRegistrations() {
  const { courseOfferings, registrations, courseTypes } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState('');
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [showStudentsList, setShowStudentsList] = useState(false);

  const courseTypeOptions = [
    { value: '', label: 'All course types' },
    ...courseTypes.map(type => ({ value: type.id, label: type.name }))
  ];

  const filteredOfferings = courseOfferings.filter(offering => 
    !selectedCourseType || offering.courseTypeId === selectedCourseType
  );

  const offeringOptions = [
    { value: '', label: 'Select a course offering...' },
    ...filteredOfferings.map(offering => ({
      value: offering.id,
      label: `${offering.courseTypeName} - ${offering.courseName}`
    }))
  ];

  const selectedOfferingData = courseOfferings.find(o => o.id === selectedOffering);
  const registeredStudents = registrations.filter(r => r.courseOfferingId === selectedOffering);

  const handleRegistrationSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Registrations</h2>
          <p className="text-gray-600">Register students for course offerings</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Register Student</span>
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="font-medium text-gray-900">Filter Course Offerings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select
            label="Course Type Filter"
            value={selectedCourseType}
            onChange={(e) => {
              setSelectedCourseType(e.target.value);
              setSelectedOffering('');
            }}
            options={courseTypeOptions}
          />
          
          <Select
            label="Course Offering"
            value={selectedOffering}
            onChange={(e) => {
              setSelectedOffering(e.target.value);
              setShowStudentsList(false);
            }}
            options={offeringOptions}
          />
        </div>

        {selectedOffering && selectedOfferingData && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {selectedOfferingData.courseTypeName} - {selectedOfferingData.courseName}
                </h4>
                <p className="text-sm text-gray-600">
                  {registeredStudents.length} student{registeredStudents.length !== 1 ? 's' : ''} registered
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowStudentsList(!showStudentsList)}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>{showStudentsList ? 'Hide' : 'Show'} Students</span>
              </Button>
            </div>

            {showStudentsList && (
              <RegisteredStudentsList
                courseOfferingId={selectedOffering}
                courseOffering={selectedOfferingData}
              />
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Student"
      >
        <StudentRegistrationForm
          onSuccess={handleRegistrationSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}