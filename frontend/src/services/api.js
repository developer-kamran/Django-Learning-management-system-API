import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/accounts/register/', userData),
  login: (credentials) => api.post('/accounts/login/', credentials),
  logout: () => api.post('/accounts/logout/'),
};

// Instructors API
export const instructorsAPI = {
  list: () => api.get('/instructors/'),
  create: (data) => api.post('/instructors/', data),
  get: (username) => api.get(`/instructors/${username}/`),
  update: (username, data) => api.put(`/instructors/${username}/`, data),
  delete: (username) => api.delete(`/instructors/${username}/`),
};

// Courses API
export const coursesAPI = {
  list: () => api.get('/courses/'),
  create: (data) => api.post('/courses/', data),
  get: (slug) => api.get(`/courses/${slug}/`),
  update: (slug, data) => api.put(`/courses/${slug}/`, data),
  delete: (slug) => api.delete(`/courses/${slug}/`),
};

// Enrollments API
export const enrollmentsAPI = {
  enroll: (courseSlug) => api.post(`/${courseSlug}/enrollments/`, {}),
  list: (courseSlug) => api.get(`/${courseSlug}/enrollments/`),
};

// Content/Lessons API
export const contentAPI = {
  list: (courseSlug) => api.get(`/${courseSlug}/lessons/`),
  create: (courseSlug, data) => api.post(`/${courseSlug}/lessons/`, data),
  get: (courseSlug, slug) => api.get(`/${courseSlug}/lessons/${slug}/`),
  update: (courseSlug, slug, data) => api.put(`/${courseSlug}/lessons/${slug}/`, data),
  delete: (courseSlug, slug) => api.delete(`/${courseSlug}/lessons/${slug}/`),
};

// Assessments API
export const assessmentsAPI = {
  list: (courseSlug, contentSlug) => api.get(`/${courseSlug}/assessments/${contentSlug}/`),
  create: (courseSlug, contentSlug, data) => api.post(`/${courseSlug}/assessments/${contentSlug}/`, data),
  get: (courseSlug, contentSlug, title) => api.get(`/${courseSlug}/assessments/${contentSlug}/${title}/`),
  update: (courseSlug, contentSlug, title, data) => api.put(`/${courseSlug}/assessments/${contentSlug}/${title}/`, data),
  delete: (courseSlug, contentSlug, title) => api.delete(`/${courseSlug}/assessments/${contentSlug}/${title}/`),
};

// Questions API
export const questionsAPI = {
  list: (courseSlug, assessmentPk) => api.get(`/${courseSlug}/assessment-${assessmentPk}/questions/`),
  create: (courseSlug, assessmentPk, data) => api.post(`/${courseSlug}/assessment-${assessmentPk}/questions/`, data),
  get: (courseSlug, assessmentPk, id) => api.get(`/${courseSlug}/assessment-${assessmentPk}/questions/${id}/`),
  update: (courseSlug, assessmentPk, id, data) => api.put(`/${courseSlug}/assessment-${assessmentPk}/questions/${id}/`, data),
  delete: (courseSlug, assessmentPk, id) => api.delete(`/${courseSlug}/assessment-${assessmentPk}/questions/${id}/`),
};

// Options API
export const optionsAPI = {
  list: (courseSlug, assessmentPk, questionPk) => api.get(`/${courseSlug}/assessment-${assessmentPk}/question-${questionPk}/options/`),
  create: (courseSlug, assessmentPk, questionPk, data) => api.post(`/${courseSlug}/assessment-${assessmentPk}/question-${questionPk}/options/`, data),
  get: (courseSlug, assessmentPk, questionPk, id) => api.get(`/${courseSlug}/assessment-${assessmentPk}/question-${questionPk}/options/${id}/`),
  update: (courseSlug, assessmentPk, questionPk, id, data) => api.put(`/${courseSlug}/assessment-${assessmentPk}/question-${questionPk}/options/${id}/`, data),
  delete: (courseSlug, assessmentPk, questionPk, id) => api.delete(`/${courseSlug}/assessment-${assessmentPk}/question-${questionPk}/options/${id}/`),
};

// Messages API
export const messagesAPI = {
  list: (courseSlug) => api.get(`/${courseSlug}/messages/`),
  create: (courseSlug, data) => api.post(`/${courseSlug}/messages/`, data),
  get: (courseSlug, id) => api.get(`/${courseSlug}/messages/${id}/`),
  update: (courseSlug, id, data) => api.put(`/${courseSlug}/messages/${id}/`, data),
  delete: (courseSlug, id) => api.delete(`/${courseSlug}/messages/${id}/`),
};

export default api;