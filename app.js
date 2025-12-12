// Универсальный скрипт для auth + tasks
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Helper storage functions ---------- */
  function getUsers(){
    try {
      return JSON.parse(localStorage.getItem('tf_users') || '[]');
    } catch {
      return [];
    }
  }
  function saveUsers(users){
    localStorage.setItem('tf_users', JSON.stringify(users));
  }
  function setCurrentUser(username){
    localStorage.setItem('tf_current', username);
  }
  function getCurrentUser(){
    return localStorage.getItem('tf_current');
  }
  function logout(){
    localStorage.removeItem('tf_current');
    location.href = 'signin.html';
  }

  /* ---------- Registration page ---------- */
  const regBtn = document.getElementById('register-btn');
  if (regBtn){
    const msg = document.getElementById('reg-msg');

    regBtn.addEventListener('click', () => {
      const username = (document.getElementById('reg-username').value || '').trim();
      const email = (document.getElementById('reg-email').value || '').trim().toLowerCase();
      const pass = document.getElementById('reg-password').value;
      const pass2 = document.getElementById('reg-password2').value;
      msg.textContent = '';

      if (!username || !email || !pass || !pass2){
        msg.textContent = 'Заполните все поля.';
        return;
      }
      if (pass.length < 6){
        msg.textContent = 'Пароль должен быть не менее 6 символов.';
        return;
      }
      if (pass !== pass2){
        msg.textContent = 'Пароли не совпадают.';
        return;
      }

      const users = getUsers();
      if (users.some(u=>u.username.toLowerCase()===username.toLowerCase())) {
        msg.textContent = 'Имя пользователя уже занято.';
        return;
      }
      if (users.some(u=>u.email === email)) {
        msg.textContent = 'Пользователь с таким email уже зарегистрирован.';
        return;
      }

      users.push({ username, email, password: pass });
      saveUsers(users);
      setCurrentUser(username);

      window.location.href = "tasks.html";
      // после регистрации — переходим в список задач
      location.href = 'tasks.html';
    });
  }

  /* ---------- Login page ---------- */
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn){
    const msg = document.getElementById('login-msg');
    loginBtn.addEventListener('click', () => {
      const ident = (document.getElementById('login-identifier').value || '').trim();
      const pass = document.getElementById('login-password').value;
      msg.textContent = '';

      if (!ident || !pass){
        msg.textContent = 'Заполните все поля.';
        return;
      }
      const users = getUsers();
      const user = users.find(u => (u.username === ident) || (u.email === ident.toLowerCase()));
      if (!user || user.password !== pass){
        msg.textContent = 'Неверные учетные данные.';
        return;
      }
      setCurrentUser(user.username);
      location.href = 'tasks.html';
    });
  }

});
// ========== NAVIGATION ==========

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const indicator = document.querySelector(".nav-indicator");

function moveIndicatorTo(activeItem) {
    const rect = activeItem.getBoundingClientRect();
    const parentRect = activeItem.parentElement.getBoundingClientRect();
    const offsetTop = rect.top - parentRect.top;

    indicator.style.transform = `translateY(${offsetTop}px)`;
}

function showPage(pageId) {
    pages.forEach(p => p.classList.remove("active"));
    const page = document.getElementById(`page-${pageId}`);
    if (page) page.classList.add("active");
}

navItems.forEach(item => {
    item.addEventListener("click", () => {
        navItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const targetPage = item.dataset.page;
        showPage(targetPage);
        moveIndicatorTo(item);
    });
});

// начальная позиция индикатора
const initialActive = document.querySelector(".nav-item.active");
if (initialActive) {
    // небольшая задержка, чтобы браузер успел отрисовать
    setTimeout(() => moveIndicatorTo(initialActive), 50);
}
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("page-title");

  // Навигация между страницами
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pageId = item.dataset.page;

      // Активный пункт меню
      menuItems.forEach((btn) => btn.classList.remove("active"));
      item.classList.add("active");

      // Переключение страниц
      pages.forEach((page) => {
        if (page.id === pageId) {
          page.classList.add("page-active");
        } else {
          page.classList.remove("page-active");
        }
      });

      // Заголовок
      const label = item.querySelector(".menu-label");
      if (label) {
        pageTitle.textContent = label.textContent;
      }
    });
  });

  // Простая логика для New Projects
  const projectForm = document.getElementById("project-form");
  const projectList = document.getElementById("project-list");
  const projectMessage = document.getElementById("project-message");

  if (projectForm) {
    projectForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("project-name");
      const subjectInput = document.getElementById("project-subject");
      const deadlineInput = document.getElementById("project-deadline");

      const name = nameInput.value.trim();
      const subject = subjectInput.value.trim();
      const deadline = deadlineInput.value;

      if (!name) {
        projectMessage.textContent = "Please enter project name.";
        return;
      }

      const li = document.createElement("li");
      const infoSpan = document.createElement("span");
      const metaSpan = document.createElement("span");

      infoSpan.textContent = name;

      let metaText = [];
      if (subject) metaText.push(subject);
      if (deadline) metaText.push(deadline);
      metaSpan.classList.add("badge", "neutral");
      metaSpan.textContent = metaText.join(" • ") || "New";

      li.appendChild(infoSpan);
      li.appendChild(metaSpan);
      projectList.prepend(li);

      projectMessage.textContent = "Project added.";
      projectForm.reset();

      setTimeout(() => {
        projectMessage.textContent = "";
      }, 2000);
    });
  }

  // Простая демо логика для календаря — смена названия месяца
  const calendarMonth = document.getElementById("calendar-month");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");

  const months = ["January 2025", "February 2025", "March 2025", "April 2025"];
  let currentMonthIndex = 2; // March 2025

  function updateCalendarMonth() {
    if (calendarMonth) {
      calendarMonth.textContent = months[currentMonthIndex];
    }
  }

  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentMonthIndex = (currentMonthIndex - 1 + months.length) % months.length;
      updateCalendarMonth();
    });

    nextMonthBtn.addEventListener("click", () => {
      currentMonthIndex = (currentMonthIndex + 1) % months.length;
      updateCalendarMonth();
    });
  }

  updateCalendarMonth();

  // Settings: простое сохранение в память браузера (localStorage) как демо
  const settingsForm = document.getElementById("settings-form");
  const settingsMessage = document.getElementById("settings-message");

  if (settingsForm) {
    // Подгрузить сохраненные настройки
    const savedSettings = JSON.parse(localStorage.getItem("tm-settings") || "{}");
    if (savedSettings.studentName) {
      document.getElementById("student-name").value = savedSettings.studentName;
    }
    if (savedSettings.studyHours) {
      document.getElementById("study-hours").value = savedSettings.studyHours;
    }
    if (savedSettings.theme) {
      document.getElementById("theme-select").value = savedSettings.theme;
    }

    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const studentName = document.getElementById("student-name").value.trim();
      const studyHours = document.getElementById("study-hours").value;
      const theme = document.getElementById("theme-select").value;

      const data = {
        studentName,
        studyHours,
        theme,
      };

      localStorage.setItem("tm-settings", JSON.stringify(data));

      // Обновить имя в сайдбаре (если есть)
      const nameEl = document.querySelector(".user-name");
      if (nameEl && studentName) {
        nameEl.textContent = studentName;
      }

      settingsMessage.textContent = "Settings saved.";
      setTimeout(() => {
        settingsMessage.textContent = "";
      }, 2000);
    });
  }
});

