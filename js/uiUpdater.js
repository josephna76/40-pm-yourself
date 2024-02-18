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

  function generateNotesList(notes) {
    if (notes.length === 0) return "No notes";
    let notesHtml = "";
    notes.forEach((note) => {
      notesHtml += `<div><strong>${note.author}:</strong> ${note.text}</div>`;
    });
    return notesHtml;
  }

  function generateEditableTask(task) {
    // Get notes HTML for editable view
    const notesHtml = generateNotesList(task.notes);
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
          <div id="edit-notes-${task.id}">${notesHtml}</div>
          <button onclick="saveTask(${task.id})">Save</button>
          <button onclick="toggleEditView(null)">Cancel</button>
        `;
  }

  function generateStaticTask(task) {
    // Get notes HTML for static view
    const notesHtml = generateNotesList(task.notes);
    return `
          <span>${task.name}</span> - <span>${task.deadline}</span>
          <span>Priority: ${task.priority}</span>
          <div>Notes: ${notesHtml}</div>
          <button onclick="toggleEditView(${task.id})">Edit</button>
        `;
  }

  return { updateTasks };
})();
