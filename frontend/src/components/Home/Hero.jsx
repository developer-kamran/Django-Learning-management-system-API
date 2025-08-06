import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Without
            <span className="text-primary-600"> Limits</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of students and instructors in our comprehensive learning management system. 
            Access high-quality courses, track your progress, and achieve your learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              Browse Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quality Content
            </h3>
            <p className="text-gray-600">
              Access expertly crafted courses with comprehensive lessons, assessments, and practical exercises.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Expert Instructors
            </h3>
            <p className="text-gray-600">
              Learn from industry professionals and experienced educators who are passionate about teaching.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed progress tracking and achievement badges.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero