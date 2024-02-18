const uiUpdater = (() => {
  const updateTasks = (tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "taskItem" + (task.completed ? " completed" : "");

      // Determine if the task is being edited
      const isEditing = window.currentEditingTaskId === task.id;
      const taskContent = isEditing
        ? generateEditableTask(task)
        : generateStaticTask(task);

      taskItem.innerHTML = taskContent;
      taskList.appendChild(taskItem);
    });
  };

  function generateNotesList(notes) {
    if (notes.length === 0) return "<div>No notes</div>";
    let notesHtml = "";
    notes.forEach((note) => {
      notesHtml += `<div><strong>${note.author}:</strong> ${note.text}</div>`;
    });
    return notesHtml;
  }

  function generateEditableTask(task) {
    // Assuming you're keeping the editable fields for task properties
    const notesHtml = task.notes
      .map(
        (note, index) =>
          `<input type="text" value="${note.text}" id="edit-note-${task.id}-${index}" />`
      )
      .join("");

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
      ${notesHtml}
      <button onclick="saveTask(${task.id})">Save</button>
      <button onclick="toggleEditView(null)">Cancel</button>
    `;
  }

  function generateStaticTask(task) {
    const notesHtml = generateNotesList(task.notes); // Correctly placed within this function
    return `
          <div><span>${task.name}</span> - <span>${task.deadline}</span></div>
          <div>Priority: ${task.priority}</div>
          <div>${notesHtml}</div> <!-- Displaying notes with authorship -->
          <button onclick="toggleEditView(${task.id})">Edit</button>
          <button onclick="deleteTask(${task.id})">Delete</button> <!-- Re-added the Delete button -->
        `;
  }

  return { updateTasks };
})();
