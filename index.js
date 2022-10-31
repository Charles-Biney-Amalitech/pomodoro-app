// Modal variables
const openModalBtn = document.getElementById('open_modal')
const closeModalBtn = document.getElementById('close_modal')
let modal = document.getElementById('modal')

// Timer variables
const timerBtn = document.getElementById('timer_btn')
const timerForm = document.getElementById('timer_form')
let timerRing = document.getElementById('timer_ring')
let timer = document.getElementById('timer')

// Modal functions
function closeModal() {
    modal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModal)

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
})
// Set property functions
const setAccentColor = (color) => {
    document.documentElement.style.setProperty('--accent-color', `#${color}`);
}

const setFont = (font) => {
    document.documentElement.style.setProperty('--font', `"${font}"`);
}


// Set Mode
const setMode = (event) => {
    timerObject.mode = event.target.id.slice(5);
    setTimer(timerObject.time*60)
}

let modes = document.getElementById('mode_selector').children
modes = [...modes]
modes.forEach(mode => { mode.onclick = setMode })

// Set Timer
const setTimer = (time) => {
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60);

    seconds < 10 ? seconds = `0${seconds}` : seconds;
    minutes < 10 ? minutes = `0${minutes}` : minutes;

    return timer.innerHTML = `${minutes}:${seconds}`
}

// Timer functions
const timerObject = {
    _time: {
        pomodoro: 25,
        short_break: 5,
        long_break: 15,
    },
    _mode: 'pomodoro',
    set time(time) { if (time) { this._time = time; } },
    set mode(mode) { if (mode) { this._mode = mode; } },
    get mode() { return this._mode },
    get time() { return this._time[`${this._mode}`] },
}

timerForm.onsubmit = (e) => {
    e.preventDefault();
    let time = {
        pomodoro: timerForm.elements['pomodoro'].value,
        short_break: timerForm.elements['short_break'].value,
        long_break: timerForm.elements['long_break'].value,
    }
    let font = timerForm.elements['font'].value
    let color = timerForm.elements['color'].value

    timerObject.time = time;

    setAccentColor(color)
    setFont(font)
    setTimer(timerObject.time*60)

    // Close Settings Modal when done
    closeModal()
}

const startTimer = () => {
    let time = timerObject.time * 60;
    let countDown = setInterval(() => {
        if (time <= 0) {
            clearInterval(countDown)
        }
        setTimer(time)
        time--;
    }, 1000)
}

timerBtn.onclick = startTimer;

timerRing.style.animationDuration = '12s';