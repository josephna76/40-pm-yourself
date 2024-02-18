const taskManager = (() => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const addTask = (name, deadline, priority) => {
    const task = {
      id: tasks.length + 1,
      name,
      deadline,
      priority,
      notes: [],
      completed: false,
      creationDate: new Date(), // Automatically log the current date and time
    };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return task;
  };

  const addNote = (taskId, note, author) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newNote = {
        text: note,
        author: author,
        date: new Date().toISOString(), // Ensure the date is stored in ISO format
      };
      task.notes.push(newNote);
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

  const deleteAll = () => {
    // If using an in-memory array
    tasks = [];

    // If using localStorage, adjust as necessary
    localStorage.setItem("tasks", JSON.stringify([]));

    // Add any additional cleanup or notification logic here
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
    deleteAll,
  };
})();
