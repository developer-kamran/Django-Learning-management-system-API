import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  UserIcon,
  BookOpenIcon 
} from '@heroicons/react/24/outline';

const CourseCard = ({ course }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {course.description}
          </p>
        </div>
        <BookOpenIcon className="h-6 w-6 text-primary-600 ml-4 flex-shrink-0" />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <UserIcon className="h-4 w-4 mr-2" />
          <span>Instructor: {course.instructor?.user || 'TBA'}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>
            {formatDate(course.start_date)} - {formatDate(course.end_date)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            Active
          </span>
        </div>
        
        <Link
          to={`/courses/${course.slug}`}
          className="btn-primary text-sm"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;