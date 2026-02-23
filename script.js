let sec=0
let interval=null

function update(){
sec++
let m=Math.floor(sec/60)
let s=sec%60

document.getElementById('timer').innerText=
String(m).padStart(2,'0')+":"+String(s).padStart(2,'0')
}

function startTimer(){
if(!interval){
interval=setInterval(update,1000)
document.getElementById('status').innerText="Focando..."
}
}

function stopTimer(){
clearInterval(interval)
interval=null
document.getElementById('status').innerText="Pausado"
}

function resetTimer(){
sec=0
document.getElementById('timer').innerText="00:00"
document.getElementById('status').innerText="Pronto para focar"
}

function toggleMode(){
document.body.classList.toggle('dark')
}