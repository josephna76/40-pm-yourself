const uiUpdater = (() => {
  const updateTasks = (tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "taskItem" + (task.completed ? " completed" : "");

      // Ensure notes are displayed correctly
      const notes =
        task.notes.length > 0 ? `Notes: ${task.notes.join(", ")}` : "No notes";

      taskItem.innerHTML = `
              <div>
                <input type="checkbox" id="task-${task.id}" ${
        task.completed ? "checked" : ""
      } onchange="toggleTaskCompleted(${task.id})"/>
                <label for="task-${task.id}">${task.name} - Deadline: ${
        task.deadline
      }
                </label>
                <div>${notes}</div>
                <select id="priority-${task.id}" ${
        task.completed ? "disabled" : ""
      }>
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
                <button onclick="updateTaskPriority(${task.id})" ${
        task.completed ? "disabled" : ""
      }>Update Priority</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
                ${
                  !task.completed
                    ? `<button onclick="editTask(${task.id})">Edit</button>`
                    : ""
                }
              </div>
            `;

      taskList.appendChild(taskItem);
    });
  };

  const editTask = (taskId) => {
    console.log("Editing task:", taskId); // Debugging statement

    const task = taskManager.getTasks().find((t) => t.id === taskId);
    if (!task) {
      console.error("Task not found:", taskId); // Debugging statement
      return;
    }

    // Create editable fields for task details
    const taskItem = document.getElementById(`task-${taskId}`);

    // Clear existing content
    taskItem.innerHTML = "";

    // Create input fields for task name, deadline, and notes
    const taskNameInput = document.createElement("input");
    taskNameInput.type = "text";
    taskNameInput.value = task.name;
    taskNameInput.id = `taskName-${taskId}`;

    const deadlineInput = document.createElement("input");
    deadlineInput.type = "date";
    deadlineInput.value = task.deadline;
    deadlineInput.id = `taskDeadline-${taskId}`;

    const notesTextarea = document.createElement("textarea");
    notesTextarea.rows = 4;
    notesTextarea.cols = 50;
    notesTextarea.textContent = task.notes.join("\n");
    notesTextarea.id = `taskNotes-${taskId}`;

    // Append input fields to the task item
    taskItem.appendChild(taskNameInput);
    taskItem.appendChild(deadlineInput);
    taskItem.appendChild(notesTextarea);

    // Create a button to save changes
    const saveChangesButton = document.createElement("button");
    saveChangesButton.textContent = "Save Changes";
    saveChangesButton.onclick = () => saveTaskChanges(taskId);
    taskItem.appendChild(saveChangesButton);
  };

  return { updateTasks, editTask };
})();
