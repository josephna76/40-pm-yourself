const uiUpdater = (() => {
  // Date formatting function
  function formatDateForDisplay(isoDateString) {
    const date = new Date(isoDateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  const updateTasks = (tasks) => {
    const completedTasks = tasks.filter((task) => task.completed);
    const incompleteTasks = tasks.filter((task) => !task.completed);

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks

    // First, display incomplete tasks
    incompleteTasks.forEach((task) => {
      const taskItem = createTaskItem(task);
      taskList.appendChild(taskItem);
    });

    // Optionally, create a separator or a new section for completed tasks
    // This could be a new div or simply a heading / separator
    const completedTasksHeader = document.createElement("h3");
    completedTasksHeader.textContent = "Completed Tasks";
    taskList.appendChild(completedTasksHeader);

    // Then, display completed tasks
    completedTasks.forEach((task) => {
      const taskItem = createTaskItem(task);
      taskList.appendChild(taskItem);
    });
  };

  function createTaskItem(task) {
    const taskItem = document.createElement("div");
    taskItem.className = "taskItem" + (task.completed ? " completed" : "");

    // Determine if the task is being edited
    const isEditing = window.currentEditingTaskId === task.id;
    const taskContent = isEditing
      ? generateEditableTask(task)
      : generateStaticTask(task);

    taskItem.innerHTML = taskContent;
    return taskItem;
  }

  function generateNotesList(notes) {
    if (notes.length === 0) return "<div>No notes</div>";
    let notesHtml = "";
    notes.forEach((note) => {
      // Use the formatDateForDisplay function for each note's date
      const formattedDate = formatDateForDisplay(note.date);
      notesHtml += `<div><strong>${note.author} (${formattedDate}):</strong> ${note.text}</div>`;
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
      <div>${notesHtml}</div>
      <button onclick="saveTask(${task.id})">Save</button>   
      <button onclick="toggleEditView(null)">Cancel</button>
    `;
  }

  function generateStaticTask(task) {
    const notesHtml = generateNotesList(task.notes); // Assuming this function generates the HTML for notes
    const checkedAttribute = task.completed ? "checked" : "";
    return `
        <div class="${task.completed ? "task-completed" : ""}">
            <input type="checkbox" id="complete-${
              task.id
            }" ${checkedAttribute} onclick="toggleTaskCompletion(${task.id})">
            <label for="complete-${task.id}">${task.name}</label> - <span>${
      task.deadline
    }</span>
            <div>Priority: ${task.priority}</div>
            <div>${notesHtml}</div>
            <button onclick="toggleEditView(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
  }

  return { updateTasks };
})();
