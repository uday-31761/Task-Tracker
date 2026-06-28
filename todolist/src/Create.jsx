import React, { useState } from "react";
import axios from "axios";

function Create({ fetchTasks }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.dueDate
    ) {
      setMessage("Please fill all required fields.");
      setIsSuccess(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/add",
        formData
      );

      setMessage("Task Added Successfully!");
      setIsSuccess(true);

      setFormData({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="create-container">
      <h2>Create New Task</h2>

      <form onSubmit={handleAdd}>

        <label>Task Title</label>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
        />

        <label>Task Description</label>

        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="row">

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

        </div>

        <label>Due Date</label>

        <input
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <button type="submit">
          Add Task
        </button>

      </form>

      {message && (
        <div
          className={`popup-message ${
            isSuccess ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Create;