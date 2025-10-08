import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

// --- Helper: Get access token and refresh if expired ---
const getAccessToken = async () => {
  let token = localStorage.getItem("access_token");
  if (!token) return null;

  // Optionally, we can refresh token here if expired
  // For now, assume front-end refresh interval is handling it
  return token;
};

// --- Thunks ---
// Fetch all users
export const fetchUsersAsync = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token");

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.map(user => ({
        ...user,
        profile: user.profile || { bio: "", phone: "" },
      }));
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create new user
export const createUserAsync = createAsyncThunk(
  "users/create",
  async (user, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token");

      const res = await axios.post(API_URL, user, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return { ...res.data, profile: res.data.profile || { bio: "", phone: "" } };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update existing user
export const updateUserAsync = createAsyncThunk(
  "users/update",
  async (user, { rejectWithValue }) => {
    if (!user.id) return rejectWithValue("User ID is required for update");

    const payload = {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      profile: { bio: user.profile?.bio || "", phone: user.profile?.phone || "" },
    };

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token");

      const res = await axios.patch(`${API_URL}${user.id}/`, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return { ...res.data, profile: res.data.profile || { bio: "", phone: "" } };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete user
export const deleteUserAsync = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    if (!id) return rejectWithValue("User ID is required for deletion");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token");

      await axios.delete(`${API_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const initialState = {
  users: [],
  searchTerm: "",
  loading: false,
  error: null,
  currentPage: 1,
  usersPerPage: 5,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    updateUserLocally(state, action) {
      const updated = action.payload;
      const index = state.users.findIndex(u => u.id === updated.id);
      if (index !== -1) state.users[index] = updated;
    },
    changePage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsersAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.error = null;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to create user";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.users.findIndex(u => u.id === updated.id);
        if (index !== -1) state.users[index] = updated;
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload || "Update failed";
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.error = action.payload || "Delete failed";
      });
  },
});

// --- Selectors ---
export const selectUsersState = state => state.users;
export const selectFilteredUsers = createSelector(
  [selectUsersState],
  s => s.users.filter(u => (u.username || "").toLowerCase().includes((s.searchTerm || "").toLowerCase()))
);
export const selectPaginatedUsers = createSelector(
  [selectFilteredUsers, selectUsersState],
  (filteredUsers, state) => {
    const startIndex = (state.currentPage - 1) * state.usersPerPage;
    const endIndex = startIndex + state.usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }
);

export const { setSearchTerm, updateUserLocally, changePage } = usersSlice.actions;
export default usersSlice.reducer;
