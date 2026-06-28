import React, { useState, useEffect } from "react";
import axios from "axios";

function EditTask({ task, fetchTasks, closeModal }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate.slice(0, 16),
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
  `${import.meta.env.VITE_API_URL}/update/${task._id}`,
  formData
);

      fetchTasks();
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Edit Task</h2>

        <form onSubmit={handleUpdate}>

          <label>Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <label>Priority</label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <label>Due Date</label>

          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          <div className="modal-buttons">

            <button type="submit">
              Update
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditTask;
