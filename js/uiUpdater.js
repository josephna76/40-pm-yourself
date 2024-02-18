const uiUpdater = (() => {
  const updateTasks = (tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "taskItem" + (task.completed ? " completed" : "");
      taskItem.innerHTML = `
                <input type="checkbox" ${
                  task.completed ? "checked" : ""
                } onclick="taskManager.toggleTaskCompleted(${task.id})"/>
                ${task.name} - Deadline: ${task.deadline}
                <div>${task.notes.join(", ")}</div>
            `;
      taskList.appendChild(taskItem);
    });
  };

  return { updateTasks };
})();
