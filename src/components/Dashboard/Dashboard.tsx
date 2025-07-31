import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BookOpen, Users, Calendar, UserCheck } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ${color}`}>
              {icon}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { courseTypes, courses, courseOfferings, registrations } = useAppContext();

  const stats = [
    {
      title: 'Course Types',
      value: courseTypes.length,
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Courses',
      value: courses.length,
      icon: <Users className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100',
    },
    {
      title: 'Course Offerings',
      value: courseOfferings.length,
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-100',
    },
    {
      title: 'Total Registrations',
      value: registrations.length,
      icon: <UserCheck className="h-6 w-6 text-orange-600" />,
      color: 'bg-orange-100',
    },
  ];

  const recentRegistrations = registrations
    .slice(-5)
    .reverse()
    .map(reg => ({
      ...reg,
      registrationDate: new Date(reg.registrationDate)
    }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to the Student Registration System</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {recentRegistrations.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Registrations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentRegistrations.map((registration) => (
              <div key={registration.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {registration.student.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {registration.courseOffering.courseTypeName} - {registration.courseOffering.courseName}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {registration.registrationDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}