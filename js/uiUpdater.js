const uiUpdater = (() => {
  const updateTasks = (tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "taskItem" + (task.completed ? " completed" : "");

      const isEditing = window.currentEditingTaskId === task.id;
      // Move the generateNotesList call inside the loop to access each task's notes correctly
      const notesHtml = generateNotesList(task.notes);
      const taskContent = isEditing
        ? generateEditableTask(task, notesHtml)
        : generateStaticTask(task, notesHtml);

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

  function generateEditableTask(task, notesHtml) {
    // Adjusted to include notesHtml in the editable view
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
        <input type="text" value="${task.notes
          .map((note) => note.text)
          .join(", ")}" id="edit-notes-${task.id}" />
        ${notesHtml} <!-- Displaying notes with authorship -->
        <button onclick="saveTask(${task.id})">Save</button>
        <button onclick="toggleEditView(null)">Cancel</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
  }

  function generateStaticTask(task, notesHtml) {
    // Adjusted to include a Delete button and use notesHtml
    return `
        <span>${task.name}</span> - <span>${task.deadline}</span>
        <span>Priority: ${task.priority}</span>
        ${notesHtml} <!-- Displaying notes with authorship -->
        <button onclick="toggleEditView(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
  }

  return { updateTasks };
})();
