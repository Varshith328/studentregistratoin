import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CourseType } from '../../types';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import CourseTypeForm from './CourseTypeForm';

export default function CourseTypesList() {
  const { courseTypes, setCourseTypes } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseType, setEditingCourseType] = useState<CourseType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingCourseType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (courseType: CourseType) => {
    setEditingCourseType(courseType);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCourseTypes(prev => prev.filter(ct => ct.id !== id));
    setDeleteConfirm(null);
  };

  const handleSave = (data: Omit<CourseType, 'id' | 'createdAt'>) => {
    if (editingCourseType) {
      setCourseTypes(prev =>
        prev.map(ct =>
          ct.id === editingCourseType.id
            ? { ...ct, name: data.name }
            : ct
        )
      );
    } else {
      const newCourseType: CourseType = {
        id: Date.now().toString(),
        name: data.name,
        createdAt: new Date(),
      };
      setCourseTypes(prev => [...prev, newCourseType]);
    }
    setIsModalOpen(false);
    setEditingCourseType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Types</h2>
          <p className="text-gray-600">Manage different types of courses</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Course Type</span>
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        {courseTypes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No course types found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {courseTypes.map((courseType) => (
              <div key={courseType.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{courseType.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(courseType.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(courseType)}
                      className="flex items-center space-x-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteConfirm(courseType.id)}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourseType ? 'Edit Course Type' : 'Add Course Type'}
      >
        <CourseTypeForm
          initialData={editingCourseType ? { name: editingCourseType.name } : undefined}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this course type? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}