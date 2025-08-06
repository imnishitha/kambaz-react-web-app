import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

const initialState: Assignment[] = []; 
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (_state, action: PayloadAction<Assignment[]>) => {
      return action.payload;
    },
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
  },
});

export const { setAssignments, addAssignment, deleteAssignment, updateAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;