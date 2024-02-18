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
    taskItem.className = "taskItem" + (task.completed ? " completed" : "");

    const isEditing = window.currentEditingTaskId === task.id;

    // Use generateEditableTask or generateStaticTask based on the editing state
    if (isEditing) {
      taskItem.innerHTML = generateEditableTask(task);
    } else {
      // Now, generateStaticTask also handles the buttons
      taskItem.innerHTML = generateStaticTask(task);
    }

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
    // Format the deadline to YYYY-MM-DD for the date input
    const deadlineDate = new Date(task.deadline);
    const formattedDeadline = deadlineDate.toISOString().split("T")[0];

    const notesHtml = task.notes
      .map(
        (note, index) =>
          `<input type="text" value="${note.text}" id="edit-note-${task.id}-${index}" />`
      )
      .join("");

    return `
      <input type="text" value="${task.name}" id="edit-name-${task.id}" />
      <input type="date" value="${formattedDeadline}" id="edit-deadline-${
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
    // Task details
    let taskHtml = `<div class="taskDetails">
                        <input type="checkbox" id="complete-${task.id}" ${
      task.completed ? "checked" : ""
    } onclick="toggleTaskCompletion(${task.id})">
                        <label for="complete-${task.id}">${task.name}</label>
                    </div>`;

    // Task metadata
    taskHtml += `<div class="taskMeta">
                    <span>Deadline: ${formatDateForDisplay(
                      task.deadline
                    )}</span>
                    <div>Priority: ${task.priority}</div>
                    <div>${generateNotesList(task.notes)}</div>
                 </div>`;

    // Edit and Delete buttons
    taskHtml += `<button onclick="window.currentEditingTaskId = ${task.id}; uiUpdater.updateTasks(taskManager.getTasks());">Edit</button>
                 <button onclick="deleteTask(${task.id}); window.currentEditingTaskId = null; uiUpdater.updateTasks(taskManager.getTasks());">Delete</button>`;

    return taskHtml;
  }

  const initAccordion = () => {
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          // Set max-height to a specific value for the animation effect
          // You might need to adjust this value depending on your content
          panel.style.maxHeight = panel.scrollHeight + "px";
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
