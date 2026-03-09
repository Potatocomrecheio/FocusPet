let state = {

    chosenMinutes: 25,

    seconds: 1500,

    isRunning: false,

    interval: null,

    xp: Number(localStorage.getItem('petXP')) || 0,

    coins: Number(localStorage.getItem('petCoins')) || 0,

    totalMinutes: Number(localStorage.getItem('petMins')) || 0,

    sessions: Number(localStorage.getItem('petSessions')) || 0,

    activeTask: null,

    tasks: JSON.parse(localStorage.getItem('tasks')) || [],

    completedTasks: JSON.parse(localStorage.getItem('compTasks')) || []

};



window.onload = () => {

    updateUI();

    renderTasks();

};



function updateUI() {

    let m = Math.floor(state.seconds / 60);

    let s = state.seconds % 60;

    document.getElementById('timer').innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    

    let level = Math.floor(state.xp / 100) + 1;

    let currentXP = state.xp % 100;

    document.getElementById('lvl-display').innerText = level;

    document.getElementById('xp-fill').style.width = `${currentXP}%`;

    

    const evoIcon = document.getElementById('pet-evolution-icon');

    if (level < 5) evoIcon.innerText = "🐣";

    else if (level < 10) evoIcon.innerText = "🐥";

    else evoIcon.innerText = "🦅";



    document.getElementById('coin-count').innerText = state.coins;

    document.getElementById('total-minutes').innerText = state.totalMinutes + "m";

    document.getElementById('total-sessions').innerText = state.sessions;

    

    const ranks = ["Iniciante", "Focado", "Mestre", "Lenda", "Fênix"];

    document.getElementById('pet-rank').innerText = ranks[Math.min(level - 1, 4)];



    if (state.activeTask) {

        document.getElementById('status-text').innerHTML = `Focando em: <strong>${state.activeTask}</strong>`;

    }

}



function save() {

    localStorage.setItem('petXP', state.xp);

    localStorage.setItem('petCoins', state.coins);

    localStorage.setItem('petMins', state.totalMinutes);

    localStorage.setItem('petSessions', state.sessions);

    localStorage.setItem('tasks', JSON.stringify(state.tasks));

    localStorage.setItem('compTasks', JSON.stringify(state.completedTasks));

}



function startTimer() {

    if (!state.activeTask) return alert("Clique em uma meta primeiro!");

    if (state.isRunning) return;

    state.isRunning = true;

    state.interval = setInterval(() => {

        if (state.seconds > 0) {

            state.seconds--;

            if (state.seconds % 60 === 0 && state.seconds !== state.chosenMinutes * 60) {

                state.totalMinutes++;

                state.coins += 1;

                save();

            }

            updateUI();

        } else {

            finishSession();

        }

    }, 1000);

}



function finishSession() {

    stopTimer();

    state.sessions++;

    state.xp += 20;

    state.coins += 10;

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    save();

    updateUI();

}



function stopTimer() { clearInterval(state.interval); state.isRunning = false; }

function resetTimer() { stopTimer(); state.seconds = state.chosenMinutes * 60; updateUI(); }



function updateDurationSetting() {

    state.chosenMinutes = document.getElementById('duration-slider').value;

    resetTimer();

}



function addTask() {

    const input = document.getElementById('task-input');

    if (!input.value) return;

    state.tasks.push(input.value);

    input.value = "";

    save();

    renderTasks();

}



function renderTasks() {

    const list = document.getElementById('task-list');

    const compList = document.getElementById('completed-list');

    list.innerHTML = "";

    compList.innerHTML = "";



    state.tasks.forEach((t, i) => {

        const li = document.createElement('li');

        if (state.activeTask === t) li.className = "active-task";

        li.innerHTML = `

            <span onclick="selectTask('${t}')" style="flex:1; cursor:pointer; font-weight:500;">${t}</span>

            <button onclick="completeTask(${i})" class="btn-check">✓</button>

        `;

        list.appendChild(li);

    });



    state.completedTasks.forEach(t => {

        const li = document.createElement('li');

        li.innerHTML = `<span style="opacity:0.6; text-decoration:line-through;">${t.name}</span> <small style="color:var(--success)">${t.date}</small>`;

        compList.appendChild(li);

    });

}



function selectTask(name) {

    state.activeTask = name;

    updateUI();

    renderTasks();

}



function completeTask(index) {

    const name = state.tasks.splice(index, 1)[0];

    state.completedTasks.push({name: name, date: new Date().toLocaleDateString()});

    state.xp += 30;

    state.coins += 20;

    if (state.activeTask === name) state.activeTask = null;

    confetti({ colors: ['#0ea5e9', '#10b981'] });

    save();

    updateUI();

    renderTasks();

}



function switchTab(tab) {

    ['pending', 'completed', 'shop'].forEach(t => {

        document.getElementById(`${t}-container`).classList.add('hidden');

        document.getElementById(`tab-btn-${t}`).classList.remove('active');

    });

    document.getElementById(`${tab}-container`).classList.remove('hidden');

    document.getElementById(`tab-btn-${tab}`).classList.add('active');

}



function buyItem(name, price) {

    if (state.coins >= price) {

        state.coins -= price;

        if(name === 'Poção de XP') state.xp += 50;

        alert(`Você usou: ${name}!`);

        save();

        updateUI();

    } else {

        alert("Moedas insuficientes!");

    }

}



function toggleAmbient(type, btn) {

    btn.classList.toggle('active');

    // Aqui você pode adicionar um som real se desejar

}



function toggleMode() { document.body.classList.toggle('dark-mode'); }
