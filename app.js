document.addEventListener("DOMContentLoaded", () => {

    const taskList = document.getElementById('task-list');

    function addTask(title, desc, date) {
        const div = document.createElement('div');
        div.className = "task-card";

        div.innerHTML = `
            <h3>${title}</h3>
            <p>${desc}</p>
            <small>${date}</small>
            <button class="delete-btn">Delete</button>
        `;

        taskList.appendChild(div);
    }

    // ----- МОДАЛКА -----

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

    // ----- СОХРАНЕНИЕ НОВОЙ ЗАДАЧИ -----

    const saveTaskBtn = document.getElementById("save-task");
    const titleInput = document.getElementById("task-title");
    const descInput = document.getElementById("task-desc");
    const dateInput = document.getElementById("task-date");

    saveTaskBtn.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        const date = dateInput.value;

        if (!title) {
            alert("Task title is required");
            return;
        }

        addTask(title, desc, date);

        titleInput.value = "";
        descInput.value = "";
        dateInput.value = "";

        modal.classList.add("hidden");
    });

    // ----- УДАЛЕНИЕ ЗАДАЧ -----

    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            e.target.parentElement.remove();
        }
    });

});
