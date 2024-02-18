document.addEventListener("DOMContentLoaded", () => {
  uiUpdater.updateTasks(taskManager.getTasks());
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  if (taskInput.value && deadlineInput.value) {
    taskManager.addTask(taskInput.value, deadlineInput.value);
    taskInput.value = ""; // Reset input
    deadlineInput.value = ""; // Reset input
    uiUpdater.updateTasks(taskManager.getTasks());
  }
}

function addNote() {
  const noteInput = document.getElementById("noteInput");
  const taskId = tasks.length; // Assuming adding note to the last task for simplicity
  if (noteInput.value && taskId) {
    taskManager.addNote(taskId, noteInput.value);
    noteInput.value = ""; // Reset input
    uiUpdater.updateTasks(taskManager.getTasks());
  }
}
