import axios from "axios";

const BASE = "/api";

export const getStudents = (params = {}) =>
  axios.get(`${BASE}/students`, { params }).then((r) => r.data);

export const getStudent = (id) =>
  axios.get(`${BASE}/students/${id}`).then((r) => r.data);

export const createStudent = (data) =>
  axios.post(`${BASE}/students`, data).then((r) => r.data);

export const updateStudent = (id, data) =>
  axios.put(`${BASE}/students/${id}`, data).then((r) => r.data);

export const deleteStudent = (id) =>
  axios.delete(`${BASE}/students/${id}`).then((r) => r.data);

export const getStats = () =>
  axios.get(`${BASE}/stats`).then((r) => r.data);
