document.addEventListener("DOMContentLoaded", () => {
  // Load and display tasks from local storage
  uiUpdater.updateTasks(taskManager.getTasks());

  document.getElementById("addTaskButton").onclick = () => {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");
    if (taskInput.value && deadlineInput.value) {
      taskManager.addTask(taskInput.value, deadlineInput.value);
      uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list
      taskInput.value = ""; // Reset input
      deadlineInput.value = ""; // Reset input
    }
  };

  document.getElementById("addNoteButton").onclick = () => {
    const noteInput = document.getElementById("noteInput");
    const taskIdInput = document.getElementById("taskIdInput"); // Assuming you have a way to specify which task
    if (noteInput.value && taskIdInput.value) {
      taskManager.addNote(parseInt(taskIdInput.value, 10), noteInput.value);
      uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list
      noteInput.value = ""; // Reset input
    }
  };
});

// Additional integration might be necessary for toggling tasks, etc.
