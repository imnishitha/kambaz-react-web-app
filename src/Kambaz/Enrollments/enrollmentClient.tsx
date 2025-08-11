import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const API_BASE = `${REMOTE_SERVER}/api/users`;
const axiosWithCredentials = axios.create({ withCredentials: true });
interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

export const findEnrollmentsForUser = async (userId: string) => {
  console.log("Finding enrollments for user:", userId);
  const response = await axiosWithCredentials.get<Enrollment[]>(`${API_BASE}/${userId}/enrollments`);
  return response.data;
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post<Enrollment>(`${API_BASE}/${userId}/enrollments/${courseId}`);
  return response.data;
};

export const unenrollUser = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(`${API_BASE}/${userId}/enrollments/${courseId}`);
  return response.data;
};