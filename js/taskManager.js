const taskManager = (() => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Inside taskManager.js
  const addTask = (name, deadline, priority) => {
    const task = {
      id: tasks.length + 1,
      name,
      deadline,
      priority, // Ensure this is part of your task object
      notes: [],
      completed: false,
    };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return task;
  };

  const addNote = (taskId, note) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.notes.push(note);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  const toggleTaskCompleted = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  const getTasks = () => tasks;

  const editTask = (taskId, newName, newDeadline, newPriority) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.name = newName || task.name;
      task.deadline = newDeadline || task.deadline;
      task.priority = newPriority || task.priority;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  const deleteTask = (taskId) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  return {
    addTask,
    addNote,
    toggleTaskCompleted,
    getTasks,
    editTask,
    deleteTask,
  };
})();
