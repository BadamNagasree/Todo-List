document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");

  const taskText = taskInput.value.trim();
  const dateValue = taskDate.value;

  if (taskText === "") {
    alert("⚠️ Please enter a task before adding.");
    return;
  }

  const task = {
    text: taskText,
    date: dateValue,
    completed: false
  };

  const tasks = getTasksFromStorage();
  tasks.push(task);
  saveTasksToStorage(tasks);
  renderTasks();
  taskInput.value = "";
  taskDate.value = "";
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const tasks = getTasksFromStorage();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("fade-in");

    if (task.isEditing) {
      li.innerHTML = `
        <input id="editText${index}" value="${task.text}" class="edit-input" />
        <input type="date" id="editDate${index}" value="${task.date}" class="edit-input" />
        <div class="task-buttons">
          <button class="edit" onclick="saveEdit(${index})">Save</button>
          <button class="remove" onclick="cancelEdit(${index})">Cancel</button>
        </div>
      `;
    } else {
      li.classList.toggle("completed", task.completed);
      li.innerHTML = `
        <span>
          ${task.text} ${task.date ? `(${task.date})` : ""}
        </span>
        <div class="task-buttons">
          <button class="edit" onclick="toggleDone(${index})">${task.completed ? "Undo" : "Done"}</button>
          <button class="edit" onclick="startEdit(${index})">Edit</button>
          <button class="remove" onclick="removeTask(${index})">Remove</button>
        </div>
      `;
    }

    taskList.appendChild(li);
  });

  updateProgress();
}

function toggleDone(index) {
  const tasks = getTasksFromStorage();
  tasks[index].completed = !tasks[index].completed;
  saveTasksToStorage(tasks);
  renderTasks();
}

function removeTask(index) {
  const tasks = getTasksFromStorage();
  tasks.splice(index, 1);
  saveTasksToStorage(tasks);
  renderTasks();
}

function startEdit(index) {
  const tasks = getTasksFromStorage();
  tasks[index].isEditing = true;
  saveTasksToStorage(tasks);
  renderTasks();
}

function cancelEdit(index) {
  const tasks = getTasksFromStorage();
  tasks[index].isEditing = false;
  saveTasksToStorage(tasks);
  renderTasks();
}

function saveEdit(index) {
  const editText = document.getElementById(`editText${index}`).value.trim();
  const editDate = document.getElementById(`editDate${index}`).value;

  if (editText === "") {
    alert("⚠️ Task text cannot be empty!");
    return;
  }

  const tasks = getTasksFromStorage();
  tasks[index].text = editText;
  tasks[index].date = editDate;
  tasks[index].isEditing = false;
  saveTasksToStorage(tasks);
  renderTasks();
}

function updateProgress() {
  const tasks = getTasksFromStorage();
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const percent = total === 0 ? 0 : (completed / total) * 100;

  document.getElementById("progressFill").style.width = `${percent}%`;
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const active = document.activeElement;
    if (active && (active.id === "taskInput" || active.id === "taskDate")) {
      addTask();
    }
  }
});
