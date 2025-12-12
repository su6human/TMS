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

// ========== ACCOUNT FORM LOGIC ==========

const accountForm = document.getElementById("accountForm");
const editBtn = document.getElementById("editProfileBtn");
const cancelBtn = document.getElementById("cancelEditBtn");
const saveBtn = document.getElementById("saveProfileBtn");
const toast = document.getElementById("toast");
const nameHeading = document.getElementById("accountNameHeading");

const formFields = ["firstName", "lastName", "email", "phone", "city", "bio"];

// дефолтные данные
const defaultData = {
    firstName: "Jimmy",
    lastName: "Steven",
    email: "mrbeast_1@gmail.com",
    phone: "+1 669 457 3671",
    city: "Bishkek",
    bio: "Student"
};

function loadData() {
    const stored = localStorage.getItem("accountData");
    const data = stored ? JSON.parse(stored) : defaultData;

    formFields.forEach(name => {
        const field = document.getElementById(name);
        if (field && data[name] !== undefined) {
            field.value = data[name];
        }
    });

    updateHeadingName();
}

function saveData() {
    const data = {};
    formFields.forEach(name => {
        const field = document.getElementById(name);
        data[name] = field.value.trim();
    });
    localStorage.setItem("accountData", JSON.stringify(data));
}

function setViewMode(isViewMode) {
    const inputs = accountForm.querySelectorAll("input, textarea");

    if (isViewMode) {
        accountForm.classList.add("view-mode");
        inputs.forEach(i => i.setAttribute("disabled", "disabled"));
    } else {
        accountForm.classList.remove("view-mode");
        inputs.forEach(i => i.removeAttribute("disabled"));
    }
}

function updateHeadingName() {
    const first = document.getElementById("firstName").value.trim() || "Student";
    const last = document.getElementById("lastName").value.trim() || "Name";
    nameHeading.textContent = `${first} ${last}`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

// события

editBtn.addEventListener("click", () => {
    setViewMode(false);
});

cancelBtn.addEventListener("click", () => {
    loadData();
    setViewMode(true);
});

accountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!accountForm.reportValidity()) {
        return;
    }

    saveData();
    setViewMode(true);
    updateHeadingName();
    showToast("Profile saved");
});

// init
loadData();
setViewMode(true);

