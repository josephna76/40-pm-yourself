document.addEventListener("DOMContentLoaded", () => {
  const updateTaskSelector = () => {
    const taskSelector = document.getElementById("taskSelector");
    taskSelector.innerHTML = ""; // Clear existing options
    taskManager.getTasks().forEach((task) => {
      const option = document.createElement("option");
      option.value = task.id;
      option.textContent = `Task ${task.id}: ${task.name}`;
      taskSelector.appendChild(option);
    });
  };

  // Update tasks and task selector on DOM load
  uiUpdater.updateTasks(taskManager.getTasks());
  updateTaskSelector();

  document.getElementById("addTaskButton").onclick = () => {
    // Existing code for adding a task
    updateTaskSelector(); // Update the task selector when a new task is added
  };

  document.getElementById("addNoteButton").onclick = () => {
    const noteInput = document.getElementById("noteInput");
    const taskSelector = document.getElementById("taskSelector");
    if (noteInput.value && taskSelector.value) {
      taskManager.addNote(parseInt(taskSelector.value, 10), noteInput.value);
      uiUpdater.updateTasks(taskManager.getTasks()); // Refresh the task list
      noteInput.value = ""; // Reset input
    }
  };
});
