const uiUpdater = (() => {
  // Date formatting function
  function formatDateForDisplay(isoDateString) {
    if (!isoDateString) {
      return "Date not available"; // Or return an empty string, or any placeholder you prefer
    }
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

  // Updated updateTaskSelector to handle no tasks scenario
  const updateTaskSelector = () => {
    const taskSelector = document.getElementById("taskSelector");
    taskSelector.innerHTML = ""; // Clear existing options
    const tasks = taskManager.getTasks();

    if (tasks.length === 0) {
      const noTaskOption = new Option("No Tasks Available", "");
      taskSelector.appendChild(noTaskOption);
    } else {
      tasks.forEach((task) => {
        const option = new Option(`Task ${task.id}: ${task.name}`, task.id);
        taskSelector.appendChild(option);
      });
    }
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
      const formattedDate = formatDateForDisplay(note.date); // Safely format the date
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
    const creationDateFormatted = task.creationDate.toLocaleString();
    const formattedDeadline = formatDateForDisplay(task.deadline); // Format the deadline
    const checkedAttribute = task.completed ? "checked" : "";
    return `
        <div class="${task.completed ? "task-completed" : ""}">
            <input type="checkbox" id="complete-${
              task.id
            }" ${checkedAttribute} onclick="toggleTaskCompletion(${task.id})">
            <label for="complete-${task.id}">${
      task.name
    }</label> - <span>${formattedDeadline}</span> 
            <div>Priority: ${task.priority}</div>
            <div>Created on: ${creationDateFormatted}</div>
            <div>${notesHtml}</div>
            <button onclick="toggleEditView(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
  }

  // Accordion functionality
  const initAccordion = () => {
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }
  };

  // Call initAccordion on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    initAccordion();
  });

  return { updateTasks, updateTaskSelector };
})();
