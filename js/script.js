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

  // Display editable fields for task details
  const taskItem = document.getElementById(`task-${taskId}`);
  taskItem.innerHTML = `
        <input type="text" id="taskName-${taskId}" value="${task.name}" />
        <input type="date" id="taskDeadline-${taskId}" value="${
    task.deadline
  }" />
        <textarea id="taskNotes-${taskId}" rows="4" cols="50">${task.notes.join(
    "\n"
  )}</textarea>
        <select id="taskPriority-${taskId}">
          <option value="High" ${
            task.priority === "High" ? "selected" : ""
          }>High</option>
          <option value="Medium" ${
            task.priority === "Medium" ? "selected" : ""
          }>Medium</option>
          <option value="Low" ${
            task.priority === "Low" ? "selected" : ""
          }>Low</option>
        </select>
        <button onclick="saveTaskChanges(${taskId})">Save Changes</button>
      `;
}

function saveTaskChanges(taskId) {
  const newName = document.getElementById(`taskName-${taskId}`).value;
  const newDeadline = document.getElementById(`taskDeadline-${taskId}`).value;
  const newNotes = document
    .getElementById(`taskNotes-${taskId}`)
    .value.split("\n");
  const newPriority = document.getElementById(`taskPriority-${taskId}`).value;

  taskManager.editTask(taskId, newName, newDeadline, newNotes, newPriority);

  // Update the UI to reflect the changes
  uiUpdater.updateTasks(taskManager.getTasks());
}
