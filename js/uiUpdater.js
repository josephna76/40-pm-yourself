const uiUpdater = (() => {
  const updateTasks = (tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "taskItem" + (task.completed ? " completed" : "");

      // Create editable fields
      const nameInput = `<input type="text" value="${task.name}" id="name-${task.id}"/>`;
      const deadlineInput = `<input type="date" value="${task.deadline}" id="deadline-${task.id}"/>`;
      const prioritySelect = `
          <select id="priority-${task.id}">
            <option value="High" ${
              task.priority === "High" ? "selected" : ""
            }>High</option>
            <option value="Medium" ${
              task.priority === "Medium" ? "selected" : ""
            }>Medium</option>
            <option value="Low" ${
              task.priority === "Low" ? "selected" : ""
            }>Low</option>
          </select>`;
      const notesInput = `<input type="text" value="${task.notes.join(
        ", "
      )}" id="notes-${task.id}"/>`;

      // Include a Save button for each task
      const saveButton = `<button onclick="saveTask(${task.id})">Save</button>`;

      taskItem.innerHTML = `
          <div>
            ${nameInput}
            ${deadlineInput}
            ${prioritySelect}
            ${notesInput}
            ${saveButton}
          </div>
        `;

      taskList.appendChild(taskItem);
    });
  };

  return { updateTasks };
})();
