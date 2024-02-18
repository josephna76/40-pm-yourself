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

  return { updateTasks };
})();
