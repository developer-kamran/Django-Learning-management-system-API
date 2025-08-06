import React from 'react'
import { Clock, Users, Star } from 'lucide-react'

const CourseCard = ({ course }) => {
  const {
    title,
    description,
    instructor,
    duration,
    enrolled_students = 0,
    rating = 4.5,
    price,
    image,
    created_at
  } = course

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <span className="text-primary-600 font-semibold text-lg">
              {title?.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {instructor?.user?.first_name} {instructor?.user?.last_name}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{duration || '8 weeks'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{enrolled_students}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-lg font-bold text-primary-600">
            {price ? `$${price}` : 'Free'}
          </div>
          <button className="btn-primary text-sm px-4 py-2">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard