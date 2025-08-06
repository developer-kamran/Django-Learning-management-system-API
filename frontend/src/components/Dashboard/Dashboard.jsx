import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { BookOpen, Users, Award, Clock, TrendingUp } from 'lucide-react'
import { enrollmentsAPI, coursesAPI } from '../../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user enrollments
      const enrollmentsResponse = await enrollmentsAPI.getAll()
      const enrollments = enrollmentsResponse.data
      
      // Fetch courses
      const coursesResponse = await coursesAPI.getAll()
      const courses = coursesResponse.data

      // Calculate stats
      const enrolledCourses = enrollments.length
      const completedCourses = enrollments.filter(e => e.completed).length
      
      setStats({
        enrolledCourses,
        completedCourses,
        totalHours: enrolledCourses * 8, // Assuming 8 hours per course
        certificates: completedCourses
      })

      // Get recent courses (first 3)
      setRecentCourses(courses.slice(0, 3))
      
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card">
                <div className="h-12 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.first_name || 'Student'}!
        </h1>
        <p className="text-gray-600">
          Here's your learning progress and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Learning Hours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Continue Learning
          </h2>
          {recentCourses.length > 0 ? (
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">Progress: 65%</p>
                  </div>
                  <button className="btn-primary text-sm px-3 py-1">
                    Continue
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses enrolled yet</p>
              <button className="btn-primary">Browse Courses</button>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Completed lesson "Introduction to React"</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Earned certificate in "Web Development Basics"</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Started new course "Advanced JavaScript"</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard