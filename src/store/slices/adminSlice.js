import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApiRequest, adminEndpoints, setAdminAuthToken, clearAdminAuthToken } from "@/lib/adminApi";

const initialState = {
  admin: null,
  status: "idle",
  error: null,
  generalStats: null,
  users: [],
  usersPagination: null,
  currentUser: null,
};

export const adminLoginThunk = createAsyncThunk(
  "admin/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await adminApiRequest(adminEndpoints.login(), { method: "POST", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const adminGeneralStatsThunk = createAsyncThunk(
  "admin/generalStats",
  async (_payload, { rejectWithValue }) => {
    try {
      return await adminApiRequest(adminEndpoints.generalStats(), { method: "GET" });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const adminListUsersThunk = createAsyncThunk(
  "admin/listUsers",
  async (query, { rejectWithValue }) => {
    try {
      return await adminApiRequest(adminEndpoints.users(query), { method: "GET" });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const adminGetUserThunk = createAsyncThunk(
  "admin/getUser",
  async (id, { rejectWithValue }) => {
    try {
      return await adminApiRequest(adminEndpoints.userById(id), { method: "GET" });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const adminBanUserThunk = createAsyncThunk(
  "admin/banUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await adminApiRequest(adminEndpoints.banUser(), { method: "PUT", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const adminLockUserThunk = createAsyncThunk(
  "admin/lockUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await adminApiRequest(adminEndpoints.lockUser(), { method: "PUT", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLogout(state) {
      state.admin = null;
      if (typeof document !== "undefined") {
        document.cookie = "admin_auth=; Max-Age=0; path=/";
      }
      clearAdminAuthToken();
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.status = "loading"; state.error = null; };
    const rejected = (state, action) => { state.status = "failed"; state.error = action.payload || action.error.message; };

    builder
      .addCase(adminLoginThunk.pending, pending)
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload?.admin || { email: action.meta.arg?.email };
        const token = action.payload?.token || action.payload?.accessToken || action.payload?.data?.token;
        if (token) {
          if (typeof document !== "undefined") {
            document.cookie = `admin_auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
          }
          setAdminAuthToken(token);
        }
      })
      .addCase(adminLoginThunk.rejected, rejected)

      .addCase(adminGeneralStatsThunk.pending, pending)
      .addCase(adminGeneralStatsThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.generalStats = action.payload; })
      .addCase(adminGeneralStatsThunk.rejected, rejected)

      .addCase(adminListUsersThunk.pending, pending)
      .addCase(adminListUsersThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.users = action.payload?.data || action.payload?.users || action.payload; state.usersPagination = action.payload?.pagination || null; })
      .addCase(adminListUsersThunk.rejected, rejected)

      .addCase(adminGetUserThunk.pending, pending)
      .addCase(adminGetUserThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.currentUser = action.payload; })
      .addCase(adminGetUserThunk.rejected, rejected)

      .addCase(adminBanUserThunk.pending, pending)
      .addCase(adminBanUserThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(adminBanUserThunk.rejected, rejected)

      .addCase(adminLockUserThunk.pending, pending)
      .addCase(adminLockUserThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(adminLockUserThunk.rejected, rejected);
  },
});

export const { adminLogout } = adminSlice.actions;

export default adminSlice.reducer;


