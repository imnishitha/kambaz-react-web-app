import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const API_BASE = `${REMOTE_SERVER}/api/users`;

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

export const findEnrollmentsForUser = async (userId: string) => {
  const response = await axios.get<Enrollment[]>(`${API_BASE}/${userId}/enrollments`);
  return response.data;
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const response = await axios.post<Enrollment>(`${API_BASE}/${userId}/enrollments/${courseId}`);
  return response.data;
};

export const unenrollUser = async (userId: string, courseId: string) => {
  const response = await axios.delete(`${API_BASE}/${userId}/enrollments/${courseId}`);
  return response.data;
};