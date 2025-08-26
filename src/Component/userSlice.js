
import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://dummyjson.com/c/4a21-de6f-48fb-aa3e";

// --- Thunks (API calls) ---
export const fetchUsersAsync = createAsyncThunk("users/fetchAll", async () => {
  const res = await axios.get(API_URL);
  // Work with either array or object payloads
  const data = Array.isArray(res.data) ? res.data : (res.data?.users || res.data);
  return data;
});

export const addUserAsync = createAsyncThunk("users/add", async (user) => {
  const res = await axios.post(API_URL, user);
  // Fallback id if API doesn't return one
  const newUser = res.data && res.data.id !== undefined ? res.data : { ...user, id: Date.now() };
  return newUser;
});

export const updateUserAsync = createAsyncThunk("users/update", async (user) => {
  const res = await axios.put(`${API_URL}/${user.id}`, user);
  return res.data || user;
});

export const deleteUserAsync = createAsyncThunk("users/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// --- State ---
const initialState = {
  users: [],
  searchTerm: "",
  viewUserData: null, // object when viewing/adding/editing
  isEditMode: false,
  loading: false,
  error: null
};

// --- Slice ---
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    openAddUser(state) {
      state.viewUserData = {
        id: null,
        name: "",
        email: "",
        role: "",
        status: "Active",
        joinDate: ""
      };
      state.isEditMode = true;
    },
    openViewUser(state, action) {
      const id = action.payload;
      const user = state.users.find((u) => u.id === id);
      state.viewUserData = user ? { ...user } : null;
      state.isEditMode = false;
    },
    startEdit(state) {
      state.isEditMode = true;
    },
    closeModal(state) {
      state.viewUserData = null;
      state.isEditMode = false;
    },
    // Update a single field while editing
    changeField(state, action) {
      const { key, value } = action.payload;
      if (state.viewUserData) state.viewUserData[key] = value;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // add
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // update
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const i = state.users.findIndex((u) => u.id === updated.id);
        if (i !== -1) state.users[i] = updated;
      })

      // delete
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  }
});

export const {
  setSearchTerm,
  openAddUser,
  openViewUser,
  startEdit,
  closeModal,
  changeField
} = usersSlice.actions;

// Selectors
export const selectUsersState = (state) => state.users;
export const selectFilteredUsers = createSelector(
  [selectUsersState],
  (s) =>
    s.users.filter((u) =>
      (u.name || "").toLowerCase().includes((s.searchTerm || "").toLowerCase())
    )
);

export default usersSlice.reducer;
