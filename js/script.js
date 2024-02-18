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
  const taskInput = document.getElementById("taskInput").value;
  const deadlineInput = document.getElementById("deadlineInput").value;
  const priorityInput = document.getElementById("priorityInput").value;

  // Append "T00:00:00" to set the time to the start of the day in the local timezone
  const deadlineDate = new Date(deadlineInput + "T00:00:00");

  if (taskInput && deadlineInput) {
    taskManager.addTask(taskInput, deadlineDate.toISOString(), priorityInput);
    uiUpdater.updateTasks(taskManager.getTasks());
    updateTaskSelector();
    // Reset input fields
    document.getElementById("taskInput").value = "";
    document.getElementById("deadlineInput").value = "";
    document.getElementById("priorityInput").value = "Medium"; // Assuming 'Medium' is the default
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

  // Correctly fetch the task object using taskId
  const task = taskManager.getTasks().find((t) => t.id === taskId);
  if (!task) {
    console.error("Task not found");
    return; // Exit the function if the task is not found
  }

  const updatedNotes = task.notes.map((note, index) => {
    const noteInput = document.getElementById(`edit-note-${taskId}-${index}`);
    return noteInput ? { ...note, text: noteInput.value } : note;
  });

  // Call the editTask function with the updated notes array
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

function toggleTaskCompletion(taskId) {
  const task = taskManager.getTasks().find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed; // Toggle the completion status
    taskManager.saveTasks(); // Assuming you have a function to save the updated tasks list to storage
    uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list display
  } else {
    console.error("Task not found");
  }
}
function applyFilters() {
  const priorityFilter = document.getElementById("priorityFilter").value;
  const dateTypeFilter = document.getElementById("dateTypeFilter").value; // creationDate or deadline
  const dateFilter = document.getElementById("dateFilter").value;

  let filteredTasks = taskManager.getTasks();

  // Filter by priority
  if (priorityFilter !== "All") {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === priorityFilter
    );
  }

  // Current Date and Time Adjustments
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  // Week Calculations
  const weekStartDay = todayStart.getDay(); // Day of week (0-6, Sunday is 0)
  const startOfThisWeek = new Date(todayStart);
  startOfThisWeek.setDate(todayStart.getDate() - weekStartDay); // Adjust to the start of this week (Sunday)
  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // End of this week (Saturday)

  // Next Week Calculations
  const startOfNextWeek = new Date(endOfThisWeek);
  startOfNextWeek.setDate(endOfThisWeek.getDate() + 1); // Start of next week (Sunday)
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6); // End of next week (Saturday)

  // Filter Application
  filteredTasks = filteredTasks.filter((task) => {
    const taskDate = new Date(task[dateTypeFilter]);
    switch (dateFilter) {
      case "Today":
        return taskDate >= todayStart && taskDate < todayEnd;
      case "This Week":
        return taskDate >= startOfThisWeek && taskDate <= endOfThisWeek;
      case "Next Week":
        return taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
      case "This Month":
        return (
          taskDate.getMonth() === now.getMonth() &&
          taskDate.getFullYear() === now.getFullYear()
        );
      default:
        return true; // No filter or "All"
    }
  });

  uiUpdater.updateTasks(filteredTasks);
}

// delete all button start
document
  .getElementById("deleteAllButton")
  .addEventListener("click", function () {
    const userConfirmed = confirm(
      "Are you sure you want to delete all tasks? This action cannot be undone."
    );
    if (userConfirmed) {
      deleteAllTasks();
    }
  });

function deleteAllTasks() {
  // Assuming taskManager is your object that manages tasks
  // Update or replace this logic depending on how you're storing and managing tasks
  taskManager.deleteAll();
  uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list UI
}
// delete all button end
