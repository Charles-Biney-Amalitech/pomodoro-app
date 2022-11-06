// Modal variables
let modal = document.getElementById('modal')

// Modal functions
document.getElementById('open_modal').addEventListener('click', () => {
    modal.style.display = 'flex';
})

function closeModal() {
    modal.style.display = 'none';
}

document.getElementById('close_modal').addEventListener('click', closeModal)

const increment = (id) => { // Increase function for settings number input
    let field = document.getElementById(id)
    field.value = parseInt(field.value) + 1
}
const decrement = (id) => { // Decrease function for settings number input
    let field = document.getElementById(id)
    if (field.value <= 1) {
        field.value = 1
    } else {
        field.value = parseInt(field.value) - 1
    }
}

// Timer variables
const timerBtn = document.getElementById('timer_btn')
const timerForm = document.getElementById('timer_form')
let timerRing = document.getElementById('timer_ring')
let timer = document.getElementById('timer')
let isPaused = false;

// Get circumference of SVG ring
let radius = timerRing.getAttribute('r')
let circumference = 2 * (Math.PI * radius)
document.documentElement.style.setProperty('--circumference', circumference);

// Set property functions
const setAccentColor = (color) => {
    document.documentElement.style.setProperty('--accent-color', `#${color}`);
}

const setFont = (font) => {
    document.documentElement.style.setProperty('--font', `"${font}"`);
}

// Set Mode
const setMode = (event) => {
    let children = event.target.parentNode.children
    children = [...children]
    children.forEach(child => child.classList.remove('active'))
    event.target.classList.add('active')
    timerObject.mode = event.target.id.slice(5);
    setTimer(timerObject.time * 60)
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

    timer.setAttribute('data-current-timer', time)
    return timer.innerHTML = `${minutes}:${seconds}`;

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
timer.setAttribute('data-current-timer', (timerObject.time * 60))

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
    setTimer(timerObject.time * 60)

    // Close Settings Modal when done
    closeModal()
}

const startTimer = (event) => {
    let payload = event.target;
    let time = timer.getAttribute('data-current-timer')
    let ringDashOffSet = timerRing.getAttribute('stroke-dashoffset')
    ringDashOffSet < 1 ? ringDashOffSet = circumference : ringDashOffSet
    let x = ringDashOffSet / time;

    switch (payload.innerHTML.toLowerCase()) { // Switch functionality based on button innerHTML
        case 'pause':
            isPaused = true
            payload.innerHTML = 'RESUME'
            break;
        default:
            isPaused = false
            payload.innerHTML = 'PAUSE'
    }

    let countDown = setInterval(() => { // Probably should take this 1 step above to fix pause bug
        if (time <= 0) {
            clearInterval(countDown)
            payload.innerHTML = 'RESTART'
            timer.setAttribute('data-current-timer', (timerObject.time * 60))
        } else if (!isPaused) {
            time--;
            ringDashOffSet -= x
            timerRing.setAttribute('stroke-dashoffset', ringDashOffSet)
            setTimer(time)
        }
    }, 1000)
}

timerBtn.onclick = startTimer;