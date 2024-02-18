document.addEventListener("DOMContentLoaded", () => {
  // Load and display tasks from local storage
  uiUpdater.updateTasks(taskManager.getTasks());
  updateTaskSelector();

  // Move the addTask and addNoteButton event listeners here from inline HTML for better practices
  document.getElementById("addTaskButton").addEventListener("click", addTask);
  document.getElementById("addNoteButton").addEventListener("click", addNote);
});

function updateTaskSelector() {
  const taskSelector = document.getElementById("taskSelector");
  taskSelector.innerHTML = ""; // Clear existing options
  taskManager.getTasks().forEach((task) => {
    const option = document.createElement("option");
    option.value = task.id;
    option.textContent = `Task ${task.id}: ${task.name}`;
    taskSelector.appendChild(option);
  });
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const priorityInput = document.getElementById("priorityInput");
  if (taskInput.value && deadlineInput.value) {
    taskManager.addTask(
      taskInput.value,
      deadlineInput.value,
      priorityInput.value
    );
    uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list
    updateTaskSelector(); // Update the task selector with the new task
    taskInput.value = ""; // Reset input
    deadlineInput.value = ""; // Reset input
  }
}

function addNote() {
  const noteInput = document.getElementById("noteInput");
  const taskSelector = document.getElementById("taskSelector");
  if (noteInput.value && taskSelector.value) {
    taskManager.addNote(parseInt(taskSelector.value, 10), noteInput.value);
    uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list
    noteInput.value = ""; // Reset input
  }
}

function deleteTask(taskId) {
  taskManager.deleteTask(taskId);
  uiUpdater.updateTasks(taskManager.getTasks());
}

function editTask(taskId) {
  // Find the task by its ID
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const priorityInput = document.getElementById("priorityInput");

  const newName = taskInput.value;
  const newDeadline = deadlineInput.value;
  const newPriority = priorityInput.value;

  // Call the editTask function from taskManager
  taskManager.editTask(taskId, newName, newDeadline, newPriority);

  // Update the UI to reflect the changes
  uiUpdater.updateTasks(taskManager.getTasks());

  // Reset input fields
  taskInput.value = "";
  deadlineInput.value = "";
  priorityInput.value = "Medium"; // Reset priority to default value
}

function prepareEditTask(taskId) {
  // Retrieve the task details
  const task = taskManager.getTasks().find((task) => task.id === taskId);
  if (!task) {
    console.error("Task not found!");
    return;
  }

  // Populate the form with the task details
  document.getElementById("taskInput").value = task.name;
  document.getElementById("deadlineInput").value = task.deadline;
  document.getElementById("priorityInput").value = task.priority;

  // Optionally, switch the button from "Add Task" to "Update Task"
  // This might involve changing button text and functionality, e.g.,
  const addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.innerText = "Update Task";
  addTaskButton.onclick = () => editTask(taskId); // Assumes editTask is already implemented

  // To distinguish between adding a new task and editing an existing one,
  // you might store the current editing task ID in a global or better scoped variable.
  window.currentEditingTaskId = taskId; // Use carefully; better scoping is recommended
}
