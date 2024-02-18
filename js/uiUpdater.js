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

      // Updated taskItem HTML to include the Edit button with the correct onClick event
      taskItem.innerHTML = `
              <div>
                <input type="checkbox" id="task-${task.id}" ${
        task.completed ? "checked" : ""
      }/>
                <label for="task-${
                  task.id
                }" onclick="taskManager.toggleTaskCompleted(${
        task.id
      }); uiUpdater.updateTasks(taskManager.getTasks());">${
        task.name
      } - Deadline: ${task.deadline}</label>
                <div>${notes}</div>
                <select id="priority-${task.id}">
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
                <button onclick="updateTaskPriority(${
                  task.id
                })">Update Priority</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
                <button onclick="prepareEditTask(${
                  task.id
                })">Edit</button> <!-- Edit button added -->
              </div>
            `;

      taskList.appendChild(taskItem);

      // Checkbox event for immediate UI update without refresh
      document
        .getElementById(`task-${task.id}`)
        .addEventListener("change", () => {
          taskManager.toggleTaskCompleted(task.id);
          updateTasks(taskManager.getTasks());
        });
    });
  };

  return { updateTasks };
})();
