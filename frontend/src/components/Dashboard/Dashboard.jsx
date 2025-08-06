import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { coursesAPI, instructorsAPI } from '../../services/api';
import { 
  BookOpenIcon, 
  PlusIcon, 
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    completedCourses: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check if user is an instructor
      try {
        await instructorsAPI.get(user.username);
        setIsInstructor(true);
      } catch (error) {
        setIsInstructor(false);
      }

      // Fetch courses
      const coursesResponse = await coursesAPI.list();
      setCourses(coursesResponse.data);
      
      setStats({
        totalCourses: coursesResponse.data.length,
        totalStudents: 0, // This would need to be calculated from enrollments
        completedCourses: 0 // This would need to be tracked
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const becomeInstructor = async () => {
    try {
      await instructorsAPI.create({ bio: 'New instructor' });
      setIsInstructor(true);
      toast.success('You are now an instructor!');
    } catch (error) {
      toast.error('Failed to become instructor');
      console.error('Error becoming instructor:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-600">
          {isInstructor ? 'Manage your courses and track student progress.' : 'Continue your learning journey.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {isInstructor ? 'My Courses' : 'Enrolled Courses'}
              </p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {isInstructor ? 'Total Students' : 'Completed Courses'}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {isInstructor ? stats.totalStudents : stats.completedCourses}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-2xl font-semibold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
      {!isInstructor && (
        <div className="card mb-8 bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Become an Instructor
              </h3>
              <p className="text-gray-600">
                Share your knowledge and create courses for other learners.
              </p>
            </div>
            <button
              onClick={becomeInstructor}
              className="btn-primary flex items-center space-x-2"
            >
              <AcademicCapIcon className="h-5 w-5" />
              <span>Become Instructor</span>
            </button>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isInstructor ? 'My Courses' : 'My Enrolled Courses'}
          </h2>
          {isInstructor && (
            <Link
              to="/courses/create"
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Course</span>
            </Link>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              {isInstructor ? 'You haven\'t created any courses yet.' : 'You haven\'t enrolled in any courses yet.'}
            </p>
            <Link
              to={isInstructor ? '/courses/create' : '/courses'}
              className="btn-primary"
            >
              {isInstructor ? 'Create Your First Course' : 'Browse Courses'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(course.start_date).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Course →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;