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

  const addNote = (taskId, note, author) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.notes.push({ text: note, author: author }); // Each note now has text and author
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  // In taskManager.js
  const editNote = (taskId, noteIndex, newText) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task && task.notes[noteIndex]) {
      task.notes[noteIndex].text = newText; // Update the note text
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

  const editTask = (taskId, newName, newDeadline, newPriority, newNotes) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.name = newName;
      task.deadline = newDeadline;
      task.priority = newPriority;
      task.notes = newNotes; // Ensure notes are updated correctly
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

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  return {
    addTask,
    addNote,
    saveTasks,
    editNote,
    toggleTaskCompleted,
    getTasks,
    editTask,
    deleteTask,
  };
})();
