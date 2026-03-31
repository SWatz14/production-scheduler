import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

const schedulerApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
});

export const machineService = {
  getAll: () => api.get('/machines'),
  getById: (id) => api.get(`/machines/${id}`),
  create: (data) => api.post('/machines', data),
  update: (id, data) => api.put(`/machines/${id}`, data),
  delete: (id) => api.delete(`/machines/${id}`),
};

export const jobService = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getByStatus: (status) => api.get(`/jobs/status/${status}`),
  getByMachine: (machineId) => api.get(`/jobs/machine/${machineId}`)
};

export const SchedulerService = {
  generateSchedule: (jobs, algorithm = 'EDD') =>
    schedulerApi.post('/schedule', { jobs, algorithm }),
  getAlgorithms: () => schedulerApi.get('/schedule/algorithms')
};
