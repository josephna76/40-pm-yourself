let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  if (taskInput.value && deadlineInput.value) {
    const task = {
      id: tasks.length + 1,
      name: taskInput.value,
      deadline: deadlineInput.value,
      notes: [],
      completed: false,
    };
    tasks.push(task);
    taskInput.value = ""; // Reset input
    deadlineInput.value = ""; // Reset input
    updateTasks();
  }
}

function addNote() {
  const noteInput = document.getElementById("noteInput");
  if (noteInput.value) {
    // Assuming adding note to the last task for simplicity
    tasks[tasks.length - 1].notes.push(noteInput.value);
    noteInput.value = ""; // Reset input
    updateTasks();
  }
}

function toggleTaskCompleted(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  task.completed = !task.completed;
  updateTasks();
}

function updateTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear existing tasks
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "taskItem" + (task.completed ? " completed" : "");
    taskItem.innerHTML = `
            <input type="checkbox" ${
              task.completed ? "checked" : ""
            } onclick="toggleTaskCompleted(${task.id})"/>
            ${task.name} - Deadline: ${task.deadline}
            <div>${task.notes.join(", ")}</div>
        `;
    taskList.appendChild(taskItem);
  });
}
