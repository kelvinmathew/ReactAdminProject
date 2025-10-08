// src/Component/UserList.js
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
  selectUsersState,
} from "./userSlice";
import "./UserList.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserList() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(selectUsersState);

  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    profile: { bio: "", phone: "" },
    is_active: true,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // -------------------
  // Authenticated fetch helper (use latest access_token)
  // -------------------
  const authFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("access_token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };
    return axios({ url, ...options, headers });
  }, []);

  // -------------------
  // Fetch users on mount
  // -------------------
  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  // Handle input changes
  const handleChange = (key, value, isEdit = false) => {
    if (key === "bio" || key === "phone") {
      isEdit
        ? setEditData({ ...editData, profile: { ...editData.profile, [key]: value } })
        : setNewUser({ ...newUser, profile: { ...newUser.profile, [key]: value } });
    } else if (key === "is_active") {
      isEdit
        ? setEditData({ ...editData, [key]: value })
        : setNewUser({ ...newUser, [key]: value });
    } else {
      isEdit
        ? setEditData({ ...editData, [key]: value })
        : setNewUser({ ...newUser, [key]: value });
    }
  };

  // Save edited user
  const handleSave = async () => {
    if (!editUserId) return;
    try {
      await dispatch(updateUserAsync(editData)).unwrap();
      await dispatch(fetchUsersAsync());
      setEditUserId(null);
      toast.success("User updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(`Update failed: ${err?.detail || JSON.stringify(err)}`);
    }
  };

  // Add new user
  const handleAddUser = async () => {
    try {
      await dispatch(createUserAsync(newUser)).unwrap();
      await dispatch(fetchUsersAsync());
      setShowAddForm(false);
      setNewUser({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        profile: { bio: "", phone: "" },
        is_active: true,
      });
      setCurrentPage(1);
      toast.success("User created successfully!");
    } catch (err) {
      console.error(err);
      toast.error(`Create failed: ${err?.detail || JSON.stringify(err)}`);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await dispatch(deleteUserAsync(id)).unwrap();
      await dispatch(fetchUsersAsync());
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(`Delete failed: ${err?.detail || JSON.stringify(err)}`);
    }
  };

  // Export all users
  const handleExportAll = async () => {
    try {
      const response = await authFetch("http://localhost:8000/api/export-users/", {
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "All_Users_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Users exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error downloading file: " + (err.response?.statusText || err.message));
    }
  };

  // Sort users by newest first
  const sortedUsers = [...users].sort((a, b) => b.id - a.id);

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) return <p>Loading users...</p>;
  if (error)
    return (
      <p style={{ color: "red" }}>
        Error: {typeof error === "string" ? error : error.detail || JSON.stringify(error)}
      </p>
    );

  return (
    <div className="userlist-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2>User Management</h2>

      {/* Buttons */}
      <div className="button-group">
        <button className="add-user-btn" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? "Cancel" : "Add User"}
        </button>
        <button className="export-all-btn" onClick={handleExportAll}>
          Export All Users
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="add-user-form">
          <input
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <input
            placeholder="First Name"
            value={newUser.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
          />
          <input
            placeholder="Last Name"
            value={newUser.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />
          <input
            placeholder="Bio"
            value={newUser.profile.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
          <input
            placeholder="Phone"
            value={newUser.profile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <select
            value={newUser.is_active ? "Active" : "Inactive"}
            onChange={(e) => handleChange("is_active", e.target.value === "Active")}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button className="save-btn" onClick={handleAddUser}>
            Save
          </button>
        </div>
      )}

      {/* User Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Bio</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      value={editData.username || ""}
                      onChange={(e) => handleChange("username", e.target.value, true)}
                    />
                  ) : (
                    u.username
                  )}
                </td>
                <td>
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      value={editData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value, true)}
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td>
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      value={editData.first_name || ""}
                      onChange={(e) => handleChange("first_name", e.target.value, true)}
                    />
                  ) : (
                    u.first_name
                  )}
                </td>
                <td>
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      value={editData.last_name || ""}
                      onChange={(e) => handleChange("last_name", e.target.value, true)}
                    />
                  ) : (
                    u.last_name
                  )}
                </td>
                <td>
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      value={editData.profile?.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value, true)}
                    />
                  ) : (
                    u.profile?.bio || ""
                  )}
                </td>
                <td>
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      value={editData.profile?.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value, true)}
                    />
                  ) : (
                    u.profile?.phone || ""
                  )}
                </td>
                <td>
                  {editUserId === u.id ? (
                    <select
                      value={editData.is_active ? "Active" : "Inactive"}
                      onChange={(e) =>
                        handleChange("is_active", e.target.value === "Active", true)
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  ) : u.is_active ? (
                    "Active"
                  ) : (
                    "Inactive"
                  )}
                </td>
                <td>
                  {editUserId === u.id ? (
                    <div className="inline-btns">
                      <button className="save-btn" onClick={handleSave}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={() => setEditUserId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="inline-btns">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditUserId(u.id);
                          setEditData({ ...u });
                        }}
                      >
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;
