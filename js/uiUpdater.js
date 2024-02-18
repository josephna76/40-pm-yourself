const uiUpdater = (() => {
  const updateTasks = (tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "taskItem" + (task.completed ? " completed" : "");
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
                <div>${task.notes.join(", ")}</div>
            `;
      taskList.appendChild(taskItem);

      // Add event listener for checkbox to toggle completion
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
