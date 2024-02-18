const taskManager = (() => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const addTask = (name, deadline) => {
    const task = {
      id: tasks.length + 1,
      name: name,
      deadline: deadline,
      notes: [],
      completed: false,
    };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return tasks;
  };

  const addNote = (taskId, note) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].notes.push(note);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    return tasks;
  };

  const toggleTaskCompleted = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    return tasks;
  };

  const getTasks = () => tasks;

  return { addTask, addNote, toggleTaskCompleted, getTasks };
})();
