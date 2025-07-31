import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Student, StudentRegistration } from '../../types';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Button from '../UI/Button';

interface StudentRegistrationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StudentRegistrationForm({ onSuccess, onCancel }: StudentRegistrationFormProps) {
  const { courseOfferings, students, setStudents, registrations, setRegistrations } = useAppContext();
  const [selectedOffering, setSelectedOffering] = useState('');
  const [existingStudentId, setExistingStudentId] = useState('');
  const [isNewStudent, setIsNewStudent] = useState(true);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<any>({});

  const offeringOptions = [
    { value: '', label: 'Select a course offering...' },
    ...courseOfferings.map(offering => ({
      value: offering.id,
      label: `${offering.courseTypeName} - ${offering.courseName}`
    }))
  ];

  const studentOptions = [
    { value: '', label: 'Select an existing student...' },
    ...students.map(student => ({
      value: student.id,
      label: `${student.name} (${student.email})`
    }))
  ];

  const validate = () => {
    const newErrors: any = {};
    
    if (!selectedOffering) {
      newErrors.offering = 'Please select a course offering';
    }

    if (isNewStudent) {
      if (!newStudent.name.trim()) {
        newErrors.name = 'Student name is required';
      }
      if (!newStudent.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(newStudent.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!newStudent.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    } else {
      if (!existingStudentId) {
        newErrors.existingStudent = 'Please select a student';
      }
    }

    // Check if student is already registered for this offering
    const studentId = isNewStudent ? 'new' : existingStudentId;
    if (selectedOffering && !isNewStudent && existingStudentId) {
      const alreadyRegistered = registrations.some(
        r => r.studentId === existingStudentId && r.courseOfferingId === selectedOffering
      );
      if (alreadyRegistered) {
        newErrors.duplicate = 'This student is already registered for this course offering';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let studentId: string;
    let student: Student;

    if (isNewStudent) {
      // Create new student
      student = {
        id: Date.now().toString(),
        name: newStudent.name.trim(),
        email: newStudent.email.trim(),
        phone: newStudent.phone.trim(),
        createdAt: new Date(),
      };
      studentId = student.id;
      setStudents(prev => [...prev, student]);
    } else {
      // Use existing student
      studentId = existingStudentId;
      student = students.find(s => s.id === studentId)!;
    }

    // Create registration
    const courseOffering = courseOfferings.find(o => o.id === selectedOffering)!;
    const registration: StudentRegistration = {
      id: Date.now().toString(),
      studentId,
      courseOfferingId: selectedOffering,
      student,
      courseOffering,
      registrationDate: new Date(),
    };

    setRegistrations(prev => [...prev, registration]);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Course Offering"
        value={selectedOffering}
        onChange={(e) => setSelectedOffering(e.target.value)}
        options={offeringOptions}
        error={errors.offering}
        required
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Student</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={isNewStudent}
              onChange={() => setIsNewStudent(true)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">New Student</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!isNewStudent}
              onChange={() => setIsNewStudent(false)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Existing Student</span>
          </label>
        </div>
      </div>

      {isNewStudent ? (
        <div className="space-y-4">
          <Input
            label="Student Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
            placeholder="Enter student name"
          />
          <Input
            label="Email"
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            required
            placeholder="student@example.com"
          />
          <Input
            label="Phone"
            value={newStudent.phone}
            onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
            error={errors.phone}
            required
            placeholder="Enter phone number"
          />
        </div>
      ) : (
        <Select
          label="Select Student"
          value={existingStudentId}
          onChange={(e) => setExistingStudentId(e.target.value)}
          options={studentOptions}
          error={errors.existingStudent}
          required
        />
      )}

      {errors.duplicate && (
        <p className="text-sm text-red-600">{errors.duplicate}</p>
      )}
      
      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          Register Student
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}