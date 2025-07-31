import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface CourseFormProps {
  initialData?: { name: string };
  onSave: (data: { name: string }) => void;
  onCancel: () => void;
}

export default function CourseForm({ initialData, onSave, onCancel }: CourseFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    const newErrors: { name?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Course name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Course name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({ name: name.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Course Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
        placeholder="e.g., English, Hindi, Urdu"
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