import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/accounts/login/', credentials),
  register: (userData) => api.post('/accounts/register/', userData),
  logout: () => api.post('/accounts/logout/'),
  profile: () => api.get('/accounts/profile/'),
}

export const coursesAPI = {
  getAll: () => api.get('/courses/'),
  getById: (id) => api.get(`/courses/${id}/`),
  create: (courseData) => api.post('/courses/', courseData),
  update: (id, courseData) => api.put(`/courses/${id}/`, courseData),
  delete: (id) => api.delete(`/courses/${id}/`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll/`),
}

export const instructorsAPI = {
  getAll: () => api.get('/instructors/'),
  getById: (id) => api.get(`/instructors/${id}/`),
  create: (instructorData) => api.post('/instructors/', instructorData),
  update: (id, instructorData) => api.put(`/instructors/${id}/`, instructorData),
}

export const enrollmentsAPI = {
  getAll: () => api.get('/enrollments/'),
  getById: (id) => api.get(`/enrollments/${id}/`),
  create: (enrollmentData) => api.post('/enrollments/', enrollmentData),
}

export const lessonsAPI = {
  getAll: () => api.get('/lessons/'),
  getById: (id) => api.get(`/lessons/${id}/`),
  getByCourse: (courseId) => api.get(`/lessons/?course=${courseId}`),
}

export const assessmentsAPI = {
  getAll: () => api.get('/assessments/'),
  getById: (id) => api.get(`/assessments/${id}/`),
  getByLesson: (lessonId) => api.get(`/assessments/?lesson=${lessonId}`),
}

export const messagesAPI = {
  getAll: () => api.get('/messages/'),
  getById: (id) => api.get(`/messages/${id}/`),
  create: (messageData) => api.post('/messages/', messageData),
}