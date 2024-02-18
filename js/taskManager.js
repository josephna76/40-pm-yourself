const taskManager = (() => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const addTask = (name, deadline) => {
    const task = {
      id: tasks.length + 1,
      name,
      deadline,
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

  return { addTask, addNote, toggleTaskCompleted, getTasks };
})();
