import axios from "axios";


const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const API_BASE = `${REMOTE_SERVER}/api/courses`;


interface Assignment {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFrom?: string;
  untilDate?: string;
  group?: string;
  displayGradeAs?: string;
  submissionType?: string;
  onlineEntryOptions?: string[];
  assignTo?: string;
  available?: boolean;
}

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get<Assignment[]>(`${API_BASE}/${courseId}/assignments`);
  return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: Omit<Assignment, '_id'>) => {
  const response = await axios.post<Assignment>(`${API_BASE}/${courseId}/assignments`, assignment);
  return response.data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const response = await axios.get<Assignment>(`${API_BASE}/undefined/assignments/${assignmentId}`);
  return response.data;
};

export const updateAssignment = async (assignment: Assignment) => {
  const response = await axios.put<Assignment>(`${API_BASE}/${assignment.course}/assignments/${assignment._id}`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${API_BASE}/undefined/assignments/${assignmentId}`);
  return response.data;
};