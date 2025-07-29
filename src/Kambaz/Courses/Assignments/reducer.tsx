
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { assignments } from "../../Database"; 

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

const initialState: Assignment[] = assignments; 
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.push(action.payload);
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      return state.filter((assignment) => assignment._id !== action.payload);
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.findIndex((assignment) => assignment._id === action.payload._id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      return action.payload;
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment, setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;