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
  console.log("Editing task:", taskId); // Debugging statement

  const task = taskManager.getTasks().find((t) => t.id === taskId);
  if (!task) {
    console.error("Task not found:", taskId); // Debugging statement
    return;
  }

  // Create editable fields for task details
  const taskItem = document.getElementById(`task-${taskId}`);

  // Clear existing content
  taskItem.innerHTML = "";

  // Create input fields for task name, deadline, and notes
  const taskNameInput = document.createElement("input");
  taskNameInput.type = "text";
  taskNameInput.value = task.name;
  taskNameInput.id = `taskName-${taskId}`;

  const deadlineInput = document.createElement("input");
  deadlineInput.type = "date";
  deadlineInput.value = task.deadline;
  deadlineInput.id = `taskDeadline-${taskId}`;

  const notesTextarea = document.createElement("textarea");
  notesTextarea.rows = 4;
  notesTextarea.cols = 50;
  notesTextarea.textContent = task.notes.join("\n");
  notesTextarea.id = `taskNotes-${taskId}`;

  // Append input fields to the task item
  taskItem.appendChild(taskNameInput);
  taskItem.appendChild(deadlineInput);
  taskItem.appendChild(notesTextarea);

  // Create a button to save changes
  const saveChangesButton = document.createElement("button");
  saveChangesButton.textContent = "Save Changes";
  saveChangesButton.onclick = () => saveTaskChanges(taskId);
  taskItem.appendChild(saveChangesButton);
}
