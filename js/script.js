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
  const authorSelector = document.getElementById("noteAuthorInput"); // Get the author
  if (noteInput.value && taskSelector.value) {
    taskManager.addNote(
      parseInt(taskSelector.value, 10),
      noteInput.value,
      authorSelector.value
    ); // Include the author
    uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list
    noteInput.value = ""; // Reset input
  }
}

function deleteTask(taskId) {
  taskManager.deleteTask(taskId);
  uiUpdater.updateTasks(taskManager.getTasks());
}

function saveTask(taskId) {
  const newName = document.getElementById(`edit-name-${taskId}`).value;
  const newDeadline = document.getElementById(`edit-deadline-${taskId}`).value;
  const newPriority = document.getElementById(`edit-priority-${taskId}`).value;

  const task = taskManager.getTasks().find((task) => task.id === taskId);
  if (!task) {
    console.error("Task not found");
    return;
  }

  // Extract updated notes with better validation
  const updatedNotes = [];
  for (let index = 0; index < task.notes.length; index++) {
    const noteInput = document.getElementById(`edit-note-${taskId}-${index}`);
    if (noteInput && noteInput.value.trim() !== "") {
      // Assuming a simple split by a delimiter (e.g., " - ") between note and author.
      // Adjust based on your actual UI/input method.
      const parts = noteInput.value.split(" - ");
      if (parts.length === 2) {
        updatedNotes.push({ text: parts[0].trim(), author: parts[1].trim() });
      } else {
        // Handle incorrectly formatted note input gracefully
        console.warn("Note format incorrect, skipping:", noteInput.value);
      }
    }
  }

  // Update the task with new values and updated notes
  taskManager.editTask(taskId, newName, newDeadline, newPriority, updatedNotes);

  window.currentEditingTaskId = null; // Exit edit mode
  uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list
}

function toggleEditView(taskId) {
  // Check if we're currently in edit mode for the specified task
  const isEditing = window.currentEditingTaskId === taskId;

  if (isEditing) {
    // Exit edit mode
    window.currentEditingTaskId = null;
    // Optionally, reset any form fields or UI elements specific to editing
    // For inline editing, this might mean disabling input fields or hiding save/cancel buttons
  } else {
    // Enter edit mode
    window.currentEditingTaskId = taskId;
    // Update the UI to reflect that we're in edit mode
    // This could involve enabling input fields, showing save/cancel buttons, etc.
  }

  // Refresh or update the task list to reflect the current edit mode status
  uiUpdater.updateTasks(taskManager.getTasks());
}
