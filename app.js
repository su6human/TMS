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
    location.href = 'login.html';
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

  /* ---------- Tasks page ---------- */
  const addTaskBtn = document.getElementById('add-task-btn');
  const modal = document.getElementById('modal');
  const saveTaskBtn = document.getElementById('save-task');
  const cancelTaskBtn = document.getElementById('cancel-task');
  const titleInput = document.getElementById('task-title');
  const descInput = document.getElementById('task-desc');
  const dateInput = document.getElementById('task-date');
  const taskListEl = document.getElementById('task-list');
  const welcomeTxt = document.getElementById('welcome-txt');
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  if (window.location.pathname.endsWith('tasks.html') || window.location.pathname.endsWith('/tasks.html')) {
    const current = getCurrentUser();
    if (!current){
      // если не авторизован — редирект на вход
      location.href = 'login.html';
      return;
    }
    if (welcomeTxt) welcomeTxt.textContent = `Мои задачи — ${current}`;

    const storeKey = `tasks_${current}`;

    function loadTasks(){
      try {
        return JSON.parse(localStorage.getItem(storeKey) || '[]');
      } catch {
        return [];
      }
    }
    function saveTasks(tasks){
      localStorage.setItem(storeKey, JSON.stringify(tasks));
    }

    function renderTasks(){
      const tasks = loadTasks();
      taskListEl.innerHTML = '';
      if (tasks.length === 0){
        taskListEl.innerHTML = `<div class="task-card"><p style="color:var(--muted)">Задач нет. Нажми «Добавить задачу», чтобы создать первую.</p></div>`;
        return;
      }
      tasks.forEach(t => {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.dataset.id = t.id;
        div.innerHTML = `
          <h3>${escapeHtml(t.title)}</h3>
          <p>${escapeHtml(t.desc || '')}</p>
          <small>${t.date ? t.date : ''}</small>
          <button class="delete-btn" title="Удалить">✕</button>
        `;
        taskListEl.appendChild(div);
      });
    }

    function escapeHtml(s){
      return String(s)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#39;');
    }

    // Показываем модал
    if (addTaskBtn) addTaskBtn.addEventListener('click', () => {
      titleInput.value = ''; descInput.value = ''; dateInput.value = '';
      modal.classList.remove('hidden');
    });

    // Сохранение задачи
    if (saveTaskBtn) saveTaskBtn.addEventListener('click', () => {
      const title = (titleInput.value || '').trim();
      const desc = (descInput.value || '').trim();
      const date = dateInput.value || '';

      if (!title){
        alert('Название задачи обязательно');
        return;
      }
      const tasks = loadTasks();
      const id = Date.now().toString(36);
      tasks.unshift({ id, title, desc, date });
      saveTasks(tasks);
      modal.classList.add('hidden');
      renderTasks();
    });

    if (cancelTaskBtn) cancelTaskBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    // Закрытие модалки кликом вне контента
    if (modal){
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }

    // Удаление задач (делегирование)
    if (taskListEl){
      taskListEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')){
          const card = e.target.closest('.task-card');
          const id = card.dataset.id;
          if (!id) return;
          let tasks = loadTasks();
          tasks = tasks.filter(t => t.id !== id);
          saveTasks(tasks);
          renderTasks();
        }
      });
    }

    renderTasks();
  }

  /* ---------- small logout on index if exists ---------- */
  const logoutIndex = document.getElementById('logout-btn');
  if (logoutIndex) logoutIndex.addEventListener('click', logout);

});
