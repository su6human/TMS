const taskList = document.getElementById('task-list');

function addTask(title) {
    const div = document.createElement('div');
    div.className = "task-card";
    div.innerHTML = `<h3>${title}</h3>`;
    taskList.appendChild(div);
}

addTask("Первая задача!");
