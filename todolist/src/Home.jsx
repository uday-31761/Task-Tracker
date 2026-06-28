import React, { useEffect, useState } from "react";
import axios from "axios";
import Create from "./Create";
import EditTask from "./EditTask";

function Home() {
  const [todos, setTodos] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const result = await axios.get("http://localhost:3001/get");
      setTodos(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Sort
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open Delete Popup
  const handleDeleteClick = (todo) => {
    setTaskToDelete(todo);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await axios.delete("http://localhost:3001/delete/" + taskToDelete._id);
      fetchTasks();
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Cancel Delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // Change Status
  const handleStatus = async (todo) => {
    let nextStatus = "Pending";

    if (todo.status === "Pending") {
      nextStatus = "In Progress";
    } else if (todo.status === "In Progress") {
      nextStatus = "Completed";
    } else {
      nextStatus = "Pending";
    }

    try {
      await axios.put("http://localhost:3001/update/" + todo._id, {
        ...todo,
        status: nextStatus,
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Popup
  const handleEdit = (todo) => {
    setEditingTask(todo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };
  // Search + Filter + Sort
  const filteredTodos = [...todos]
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((todo) =>
      statusFilter === "All" ? true : todo.status === statusFilter,
    )
    .filter((todo) =>
      priorityFilter === "All" ? true : todo.priority === priorityFilter,
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);

        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);

        case "due":
          return new Date(a.dueDate) - new Date(b.dueDate);

        case "high":
          const high = { High: 3, Medium: 2, Low: 1 };
          return high[b.priority] - high[a.priority];

        case "low":
          const low = { High: 3, Medium: 2, Low: 1 };
          return low[a.priority] - low[b.priority];

        case "az":
          return a.title.localeCompare(b.title);

        case "za":
          return b.title.localeCompare(a.title);

        default:
          return 0;
      }
    });

  return (
    <div className="home">
      <h1>Task Tracker</h1>

      {/* Create Task */}
      <Create fetchTasks={fetchTasks} />

      {/* Edit Modal */}
      {showModal && (
        <EditTask
          task={editingTask}
          fetchTasks={fetchTasks}
          closeModal={closeModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Delete Task</h2>

            <p>
              Are you sure you want to delete
              <br />
              <strong>"{taskToDelete?.title}"</strong>?
            </p>

            <div className="modal-buttons">
              <button className="cancel-delete-btn" onClick={cancelDelete}>
                Cancel
              </button>

              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <h2>Task List</h2>
      <br />
      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search Task..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter + Sort */}
      <div className="filter-sort">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="due">Due Date</option>
          <option value="high">High Priority First</option>
          <option value="low">Low Priority First</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>
      {/* Task List */}
      <div className="task-list">
        {filteredTodos.length === 0 ? (
          <h2>No Tasks Found</h2>
        ) : (
          filteredTodos.map((todo) => (
            <div className="task-card" key={todo._id}>
              <p>
                <strong>Title:</strong> <b>{todo.title}</b>
              </p>

              <p>
                <strong>Description:</strong>
                <br />
                {todo.description}
              </p>

              <p>
                <strong>Status:</strong> {todo.status}
              </p>

              <p>
                <strong>Priority:</strong> {todo.priority}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(todo.dueDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(todo.createdAt).toLocaleString()}
              </p>

              <p>
                <strong>Updated:</strong>{" "}
                {new Date(todo.updatedAt).toLocaleString()}
              </p>

              <div className="btn-group">
                <button className="edit-btn" onClick={() => handleEdit(todo)}>
                  Edit
                </button>

                <button
                  className="status-btn"
                  onClick={() => handleStatus(todo)}
                >
                  Change Status
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(todo)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        
      </div>
      <footer className="footer">
  <p>© {new Date().getFullYear()} Task Tracker</p>
  <p>Built with ❤️ using React</p>
</footer>
    </div>
  );
}

export default Home;
