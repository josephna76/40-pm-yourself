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
                  <input type="checkbox" id="task-${task.id}" ${
        task.completed ? "checked" : ""
      }/>
                  <label for="task-${
                    task.id
                  }" onclick="taskManager.toggleTaskCompleted(${
        task.id
      }); uiUpdater.updateTasks(taskManager.getTasks());">
                      ${task.name} - Deadline: ${task.deadline}
                  </label>
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

  function updateTaskPriority(taskId) {
    const priorityInput = document.getElementById(`priority-${taskId}`);
    if (priorityInput) {
      const newPriority = priorityInput.value;
      taskManager.updatePriority(taskId, newPriority);
      uiUpdater.updateTasks(taskManager.getTasks());
    }
  }

  return { updateTasks, updateTaskPriority };
})();
