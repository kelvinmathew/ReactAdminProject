// src/Component/UserList.jsx (or .js)
import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Main.css";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsersAsync,
  addUserAsync,
  updateUserAsync,
  deleteUserAsync,
  setSearchTerm,
  openAddUser,
  openViewUser,
  startEdit,
  closeModal,
  changeField,
  selectUsersState,
  selectFilteredUsers
} from "./userSlice";

export default function UserList() {
  const dispatch = useDispatch();
  const { searchTerm, viewUserData, isEditMode, loading, error } =
    useSelector(selectUsersState);
  const filteredUsers = useSelector(selectFilteredUsers);

  // Load initial users
  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  // Handlers (now dispatching Redux actions)
  const handleViewUser = (id) => dispatch(openViewUser(id));
  const handleAddUser = () => dispatch(openAddUser());
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserAsync(id));
    }
  };

  const handleSave = () => {
    if (!viewUserData) return;
    if (viewUserData.id) {
      dispatch(updateUserAsync(viewUserData)).then(() => dispatch(closeModal()));
    } else {
      dispatch(addUserAsync(viewUserData)).then(() => dispatch(closeModal()));
    }
  };

  return (
    <div className="hee">
      <SideBar />

      <div id="userlist" className="page active">
        <div className="page-header">
          <h1 className="pages-titles">User Management</h1>
          <p className="pages-subtitles">Manage all registered users</p>
        </div>

        <div className="user-actions">
          <button className="btn btn-primary" onClick={handleAddUser}>
            Add User
          </button>
          <input
            type="text"
            className="search-box"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>

        {loading && <p className="text-muted">Loading users…</p>}
        {error && <p className="text-danger">Error: {error}</p>}

        <div className="user-table">
          <table id="userTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status === "Active" ? "status-active" : "status-inactive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewUser(user.id)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View / Edit / Add Modal (Redux-driven) */}
        {viewUserData && (
          <div className="modal" style={{ display: "block" }}>
            <div className="modal-content">
              <span className="close" onClick={() => dispatch(closeModal())}>
                &times;
              </span>

              <h2>
                {viewUserData.id
                  ? isEditMode
                    ? "Edit User"
                    : "View User"
                  : "Add User"}
              </h2>

              {isEditMode ? (
                <>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control"
                      value={viewUserData.name}
                      onChange={(e) =>
                        dispatch(changeField({ key: "name", value: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      value={viewUserData.email}
                      onChange={(e) =>
                        dispatch(changeField({ key: "email", value: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      className="form-control"
                      value={viewUserData.role}
                      onChange={(e) =>
                        dispatch(changeField({ key: "role", value: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={viewUserData.status}
                      onChange={(e) =>
                        dispatch(changeField({ key: "status", value: e.target.value }))
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Join Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={viewUserData.joinDate}
                      onChange={(e) =>
                        dispatch(changeField({ key: "joinDate", value: e.target.value }))
                      }
                    />
                  </div>

                  <button className="btn btn-primary" onClick={handleSave}>
                    {viewUserData.id ? "Save Changes" : "Add User"}
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {viewUserData.name}</p>
                  <p><strong>Email:</strong> {viewUserData.email}</p>
                  <p><strong>Role:</strong> {viewUserData.role}</p>
                  <p><strong>Status:</strong> {viewUserData.status}</p>
                  <p><strong>Join Date:</strong> {viewUserData.joinDate}</p>
                  <button className="btn btn-warning" onClick={() => dispatch(startEdit())}>
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
