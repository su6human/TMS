document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Helper storage functions ---------- */
  const getUsers = () => JSON.parse(localStorage.getItem('tf_users') || '[]');
  const saveUsers = (users) => localStorage.setItem('tf_users', JSON.stringify(users));
  const setCurrentUser = (username) => localStorage.setItem('tf_current', username);
  const getCurrentUser = () => localStorage.getItem('tf_current');
  const logout = () => { localStorage.removeItem('tf_current'); location.href='signin.html'; };

  /* ---------- Registration ---------- */
  const regBtn = document.getElementById('register-btn');
  if (regBtn){
    const msg = document.getElementById('reg-msg');
    regBtn.addEventListener('click', () => {
      const username = (document.getElementById('reg-username').value || '').trim();
      const email = (document.getElementById('reg-email').value || '').trim().toLowerCase();
      const pass = document.getElementById('reg-password').value;
      const pass2 = document.getElementById('reg-password2').value;
      msg.textContent = '';

      if(!username || !email || !pass || !pass2){ msg.textContent='Заполните все поля.'; return; }
      if(pass.length<6){ msg.textContent='Пароль должен быть не менее 6 символов.'; return; }
      if(pass!==pass2){ msg.textContent='Пароли не совпадают.'; return; }

      const users = getUsers();
      if(users.some(u=>u.username.toLowerCase()===username.toLowerCase())) { msg.textContent='Имя пользователя уже занято.'; return; }
      if(users.some(u=>u.email===email)) { msg.textContent='Пользователь с таким email уже зарегистрирован.'; return; }

      users.push({username,email,password:pass});
      saveUsers(users);
      setCurrentUser(username);
      location.href='tasks.html';
    });
  }

  /* ---------- Login ---------- */
  const loginBtn = document.getElementById('login-btn');
  if(loginBtn){
    const msg = document.getElementById('login-msg');
    loginBtn.addEventListener('click',()=> {
      const ident = (document.getElementById('login-identifier').value||'').trim();
      const pass = document.getElementById('login-password').value;
      msg.textContent='';
      if(!ident || !pass){ msg.textContent='Заполните все поля.'; return; }

      const users = getUsers();
      const user = users.find(u=>u.username===ident||u.email===ident.toLowerCase());
      if(!user || user.password!==pass){ msg.textContent='Неверные учетные данные.'; return; }

      setCurrentUser(user.username);
      location.href='tasks.html';
    });
  }

  /* ---------- Navigation ---------- */
  const menuItems = document.querySelectorAll(".menu-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("page-title");

  menuItems.forEach(item=>{
    item.addEventListener("click",()=>{
      menuItems.forEach(i=>i.classList.remove("active"));
      item.classList.add("active");
      const pageId = item.dataset.page;
      pages.forEach(p=>p.id===pageId?p.classList.add("page-active"):p.classList.remove("page-active"));
      const label = item.querySelector(".menu-label");
      if(label) pageTitle.textContent=label.textContent;
    });
  });

  /* ---------- Task Board ---------- */
  const todoList = document.getElementById("todo-list");
  const inProgressList = document.getElementById("inprogress-list");
  const doneList = document.getElementById("done-list");

  // Данные доски
  let boardData = {
    todo: [],
    inProgress: [],
    done: []
  };

  // Рендер доски
  function renderBoard(){
    // Очистка колонок
    [todoList, inProgressList, doneList].forEach(col => col.innerHTML = "");

    boardData.todo.forEach((task, i)=>{
      const li = document.createElement("li");
      li.textContent = task;
      li.innerHTML += ` <button onclick="moveTask('todo',${i})">➡</button> <button onclick="deleteTask('todo',${i})">🗑</button>`;
      todoList.appendChild(li);
    });
    boardData.inProgress.forEach((task, i)=>{
      const li = document.createElement("li");
      li.textContent = task;
      li.innerHTML += ` <button onclick="moveTask('inProgress',${i})">➡</button> <button onclick="deleteTask('inProgress',${i})">🗑</button>`;
      inProgressList.appendChild(li);
    });
    boardData.done.forEach((task, i)=>{
      const li = document.createElement("li");
      li.textContent = task;
      li.innerHTML += ` <button onclick="moveTask('done',${i})">➡</button> <button onclick="deleteTask('done',${i})">🗑</button>`;
      doneList.appendChild(li);
    });
  }

  // Функция перемещения задачи
  window.moveTask = function(column, index) {
    let task;
    if(column === "todo") {
      task = boardData.todo.splice(index, 1)[0];
      boardData.inProgress.push(task);
    } else if(column === "inProgress") {
      task = boardData.inProgress.splice(index, 1)[0];
      boardData.done.push(task);
    } else if(column === "done") {
      task = boardData.done.splice(index, 1)[0];
      boardData.todo.push(task);
    }
    renderBoard();
  }

  // Функция удаления задачи
  window.deleteTask = function(column, index) {
    if(column === "todo") boardData.todo.splice(index, 1);
    else if(column === "inProgress") boardData.inProgress.splice(index, 1);
    else if(column === "done") boardData.done.splice(index, 1);
    renderBoard();
  }

  // Добавление задачи через форму
  const projectForm = document.getElementById("project-form");
  if(projectForm){
    projectForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const name = (document.getElementById("project-name").value||"").trim();
      if(!name) return;
      boardData.todo.push(name);
      renderBoard();
      projectForm.reset();
    });
  }

  // Инициализация
  renderBoard();

  /* ---------- Calendar ---------- */
  const calendarMonthEl = document.getElementById("calendar-month");
  const calendarGrid = document.querySelector("#calendar .calendar-grid");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const eventsListEl = document.querySelector(".list-deadlines");

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let events = [
    {date:"2025-03-04",title:"Time management app presentation",type:"danger"},
    {date:"2025-03-06",title:"Team meeting",type:"warning"},
    {date:"2025-03-12",title:"Exam preparation session",type:"neutral"}
  ];

  let currentDate = new Date(2025,2); // March 2025

  function renderCalendar(){
    if(!calendarGrid) return;
    calendarGrid.innerHTML="";
    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(d=>{
      const el=document.createElement("div"); el.classList.add("calendar-day-name"); el.textContent=d; calendarGrid.appendChild(el);
    });

    const year=currentDate.getFullYear();
    const month=currentDate.getMonth();
    calendarMonthEl.textContent=`${months[month]} ${year}`;

    const firstDay=new Date(year,month,1);
    let startDay=firstDay.getDay(); startDay=startDay===0?6:startDay-1;
    const daysInMonth=new Date(year,month+1,0).getDate();

    for(let i=0;i<startDay;i++){
      const emptyDay=document.createElement("div");
      emptyDay.classList.add("calendar-day","muted");
      calendarGrid.appendChild(emptyDay);
    }

    for(let i=1;i<=daysInMonth;i++){
      const dayEl=document.createElement("div"); dayEl.classList.add("calendar-day");
      const fullDate=`${year}-${String(month+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
      dayEl.textContent=i;
      const event=events.find(e=>e.date===fullDate);
      if(event){
        const dot=document.createElement("span"); dot.classList.add("dot");
        if(event.type) dot.classList.add(`dot-${event.type}`);
        dayEl.appendChild(dot);
      }
      calendarGrid.appendChild(dayEl);
    }

    // Обновляем список событий
    if(eventsListEl){
      eventsListEl.innerHTML="";
      events.filter(e=>e.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).forEach(e=>{
        const li=document.createElement("li");
        li.innerHTML=`<span>${e.title}</span> <span class="badge ${e.type}">${new Date(e.date).getDate()} ${months[month]}</span>`;
        eventsListEl.appendChild(li);
      });
    }
  }

  if(prevMonthBtn) prevMonthBtn.addEventListener("click",()=>{currentDate.setMonth(currentDate.getMonth()-1); renderCalendar();});
  if(nextMonthBtn) nextMonthBtn.addEventListener("click",()=>{currentDate.setMonth(currentDate.getMonth()+1); renderCalendar();});
  renderCalendar();

  /* ---------- Settings ---------- */
  const settingsForm=document.getElementById("settings-form");
  const settingsMessage=document.getElementById("settings-message");
  if(settingsForm){
    const savedSettings=JSON.parse(localStorage.getItem("tm-settings")||"{}");
    if(savedSettings.studentName) document.getElementById("student-name").value=savedSettings.studentName;
    if(savedSettings.studyHours) document.getElementById("study-hours").value=savedSettings.studyHours;
    if(savedSettings.theme) document.getElementById("theme-select").value=savedSettings.theme;

    settingsForm.addEventListener("submit",e=>{
      e.preventDefault();
      const studentName=document.getElementById("student-name").value.trim();
      const studyHours=document.getElementById("study-hours").value;
      const theme=document.getElementById("theme-select").value;
      localStorage.setItem("tm-settings",JSON.stringify({studentName,studyHours,theme}));
      const nameEl=document.querySelector(".user-name");
      if(nameEl && studentName) nameEl.textContent=studentName;
      settingsMessage.textContent="Settings saved.";
      setTimeout(()=>settingsMessage.textContent="",2000);
    });
  }

});
