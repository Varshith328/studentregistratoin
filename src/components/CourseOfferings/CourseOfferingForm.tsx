import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Select from '../UI/Select';
import Button from '../UI/Button';

interface CourseOfferingFormProps {
  initialData?: { courseId: string; courseTypeId: string };
  onSave: (data: { courseId: string; courseTypeId: string; courseName: string; courseTypeName: string }) => void;
  onCancel: () => void;
}

export default function CourseOfferingForm({ initialData, onSave, onCancel }: CourseOfferingFormProps) {
  const { courses, courseTypes } = useAppContext();
  const [courseId, setCourseId] = useState(initialData?.courseId || '');
  const [courseTypeId, setCourseTypeId] = useState(initialData?.courseTypeId || '');
  const [errors, setErrors] = useState<{ courseId?: string; courseTypeId?: string }>({});

  const courseOptions = [
    { value: '', label: 'Select a course...' },
    ...courses.map(course => ({ value: course.id, label: course.name }))
  ];

  const courseTypeOptions = [
    { value: '', label: 'Select a course type...' },
    ...courseTypes.map(type => ({ value: type.id, label: type.name }))
  ];

  const validate = () => {
    const newErrors: { courseId?: string; courseTypeId?: string } = {};
    
    if (!courseId) {
      newErrors.courseId = 'Please select a course';
    }
    
    if (!courseTypeId) {
      newErrors.courseTypeId = 'Please select a course type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const course = courses.find(c => c.id === courseId);
      const courseType = courseTypes.find(ct => ct.id === courseTypeId);
      
      if (course && courseType) {
        onSave({
          courseId,
          courseTypeId,
          courseName: course.name,
          courseTypeName: courseType.name,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Course"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        options={courseOptions}
        error={errors.courseId}
        required
      />
      
      <Select
        label="Course Type"
        value={courseTypeId}
        onChange={(e) => setCourseTypeId(e.target.value)}
        options={courseTypeOptions}
        error={errors.courseTypeId}
        required
      />
      
      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}