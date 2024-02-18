const uiUpdater = (() => {
  const updateTasks = (tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "taskItem" + (task.completed ? " completed" : "");

      const isEditing = window.currentEditingTaskId === task.id;
      const taskContent = isEditing
        ? generateEditableTask(task)
        : generateStaticTask(task);

      taskItem.innerHTML = taskContent;
      taskList.appendChild(taskItem);
    });
  };

  function generateEditableTask(task) {
    // Example implementation, adjust according to your actual task structure
    return `
        <input type="text" value="${task.name}" id="edit-name-${task.id}" />
        <input type="date" value="${task.deadline}" id="edit-deadline-${
      task.id
    }" />
        <select id="edit-priority-${task.id}">
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
        <input type="text" value="${task.notes.join(", ")}" id="edit-notes-${
      task.id
    }" />
        <button onclick="saveTask(${task.id})">Save</button>
        <button onclick="toggleEditView(null)">Cancel</button>
      `;
  }

  function generateStaticTask(task) {
    // Similar to previous implementation but without input fields
    return `
        <span>${task.name}</span> - <span>${task.deadline}</span>
        <span>Priority: ${task.priority}</span>, Notes: ${task.notes.join(", ")}
        <button onclick="toggleEditView(${task.id})">Edit</button>
      `;
  }

  return { updateTasks };
})();
