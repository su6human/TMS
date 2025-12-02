const taskList = document.getElementById('task-list');

function addTask(title) {
    const div = document.createElement('div');
    div.className = "task-card";
    div.innerHTML = `<h3>${title}</h3>`;
    taskList.appendChild(div);
}

addTask("Первая задача!");

const addTaskBtn = document.getElementById("add-task-btn");
const modal = document.getElementById("modal");

addTaskBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});
