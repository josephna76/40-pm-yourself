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

function updateTaskPriority(taskId) {
  const priorityInput = document.getElementById(`priority-${taskId}`);
  if (priorityInput) {
    const newPriority = priorityInput.value;
    taskManager.updatePriority(taskId, newPriority); // Call the updatePriority function with the taskId and newPriority
    uiUpdater.updateTasks(taskManager.getTasks());
  }
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
