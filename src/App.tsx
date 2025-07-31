import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import CourseTypesList from './components/CourseTypes/CourseTypesList';
import CoursesList from './components/Courses/CoursesList';
import CourseOfferingsList from './components/CourseOfferings/CourseOfferingsList';
import StudentRegistrations from './components/Registrations/StudentRegistrations';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'course-types':
        return <CourseTypesList />;
      case 'courses':
        return <CoursesList />;
      case 'course-offerings':
        return <CourseOfferingsList />;
      case 'registrations':
        return <StudentRegistrations />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;