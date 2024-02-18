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

    if (tasks.length === 0) {
      const noTasksPlaceholder = document.createElement("div");
      noTasksPlaceholder.textContent = "No Tasks Available";
      noTasksPlaceholder.className = "placeholder"; // Assuming you might want to style this
      taskList.appendChild(noTasksPlaceholder);
    } else {
      // Add "In Progress Tasks" Header
      if (incompleteTasks.length > 0) {
        const inProgressHeader = document.createElement("h3");
        inProgressHeader.textContent = "In Progress Tasks";
        taskList.appendChild(inProgressHeader);
      }
      // First, display incomplete tasks
      incompleteTasks.forEach((task) => {
        const taskItem = createTaskItem(task);
        taskList.appendChild(taskItem);
      });

      // Optionally, create a separator or a new section for completed tasks
      if (completedTasks.length > 0) {
        const completedTasksHeader = document.createElement("h3");
        completedTasksHeader.textContent = "Completed Tasks";
        taskList.appendChild(completedTasksHeader);

        // Then, display completed tasks
        completedTasks.forEach((task) => {
          const taskItem = createTaskItem(task);
          taskList.appendChild(taskItem);
        });
      }
    }
  };

  // Adjusting updateTaskSelector to include a default placeholder
  const updateTaskSelector = () => {
    const taskSelector = document.getElementById("taskSelector");
    taskSelector.innerHTML = ""; // Clear existing options
    const tasks = taskManager.getTasks();

    if (tasks.length === 0) {
      // Display a placeholder when no tasks are available
      const placeholderOption = new Option("No tasks yet", "", true, true);
      placeholderOption.disabled = true; // Make the placeholder non-selectable
      taskSelector.appendChild(placeholderOption);
    } else {
      tasks.forEach((task) => {
        const option = new Option(`Task ${task.id}: ${task.name}`, task.id);
        taskSelector.appendChild(option);
      });
    }
  };

  function createTaskItem(task) {
    const taskItem = document.createElement("div");
    taskItem.className = "taskItem" + (task.completed ? " task-completed" : "");

    // Creating a flex container for the checkbox and task details
    const taskDetails = document.createElement("div");
    taskDetails.className = "taskDetails";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.id = "complete-" + task.id;
    checkbox.onclick = () => toggleTaskCompletion(task.id);

    const label = document.createElement("label");
    label.htmlFor = "complete-" + task.id;
    label.textContent = task.name;

    // Appending the checkbox and label to the flex container
    taskDetails.appendChild(checkbox);
    taskDetails.appendChild(label);

    // Task metadata (deadline, priority, notes)
    const meta = document.createElement("div");
    meta.className = "taskMeta";
    const deadline = document.createElement("span");
    deadline.textContent = "Deadline: " + formatDateForDisplay(task.deadline);
    const priority = document.createElement("div");
    priority.textContent = "Priority: " + task.priority;
    const notes = document.createElement("div");
    notes.innerHTML = generateNotesList(task.notes);

    meta.appendChild(deadline);
    meta.appendChild(priority);
    meta.appendChild(notes);

    // Appending elements to taskItem
    taskItem.appendChild(taskDetails);
    taskItem.appendChild(meta);

    // Buttons for editing and deletion
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => toggleEditView(task.id);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteTask(task.id);

    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    return taskItem;
  }

  function generateNotesList(notes) {
    if (notes.length === 0) {
      return "<div class='placeholder'>No Notes Available</div>"; // Placeholder for no notes
    }
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
