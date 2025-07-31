import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CourseOffering } from '../../types';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import CourseOfferingForm from './CourseOfferingForm';

export default function CourseOfferingsList() {
  const { courseOfferings, setCourseOfferings } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<CourseOffering | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingOffering(null);
    setIsModalOpen(true);
  };

  const handleEdit = (offering: CourseOffering) => {
    setEditingOffering(offering);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCourseOfferings(prev => prev.filter(co => co.id !== id));
    setDeleteConfirm(null);
  };

  const handleSave = (data: Omit<CourseOffering, 'id' | 'createdAt'>) => {
    if (editingOffering) {
      setCourseOfferings(prev =>
        prev.map(co =>
          co.id === editingOffering.id
            ? { ...co, ...data }
            : co
        )
      );
    } else {
      const newOffering: CourseOffering = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
      };
      setCourseOfferings(prev => [...prev, newOffering]);
    }
    setIsModalOpen(false);
    setEditingOffering(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Offerings</h2>
          <p className="text-gray-600">Manage course and course type combinations</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Course Offering</span>
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        {courseOfferings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No course offerings found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {courseOfferings.map((offering) => (
              <div key={offering.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {offering.courseTypeName} - {offering.courseName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(offering.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(offering)}
                      className="flex items-center space-x-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteConfirm(offering.id)}
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
        title={editingOffering ? 'Edit Course Offering' : 'Add Course Offering'}
      >
        <CourseOfferingForm
          initialData={editingOffering ? {
            courseId: editingOffering.courseId,
            courseTypeId: editingOffering.courseTypeId
          } : undefined}
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
            Are you sure you want to delete this course offering? This action cannot be undone.
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