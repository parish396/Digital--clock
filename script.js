const clock = document.getElementById("clock");
const dateText = document.getElementById("dateText");
const analogClock = document.getElementById("analogClock");
const digitalClock = document.getElementById("digitalClock");
const timezoneSelect = document.getElementById("timezoneSelect");
const toggleView = document.getElementById("toggleView");
const toggleTheme = document.getElementById("toggleTheme");
const retroToggle = document.getElementById("retroToggle");
const beep = document.getElementById("beep");
const alarmTime = document.getElementById("alarmTime");
const alarmSound = document.getElementById("alarmSound");
const startPomodoro = document.getElementById("startPomodoro");
const pomodoroTimer = document.getElementById("pomodoroTimer");

let isAnalog = false;
let alarmTriggered = false;
let pomodoroInterval;

function getTime(tz) {
  const now = new Date();
  if (tz === "local") return now;
  return new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
}

function updateClock() {
  const tz = timezoneSelect.value;
  const now = getTime(tz);
  let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";

  if (m === 0 && s === 0) {
    beep.play();
    speak(`It's ${h % 12 || 12} o'clock ${ampm}`);
  }

  if (alarmTime.value === now.toTimeString().slice(0,5) && !alarmTriggered) {
    alarmSound.play();
    alert("⏰ Alarm Time!");
    alarmTriggered = true;
  } else if (alarmTime.value !== now.toTimeString().slice(0,5)) {
    alarmTriggered = false;
  }

  const padded = (n) => (n < 10 ? "0" + n : n);
  const h12 = h % 12 || 12;
  clock.textContent = `${padded(h12)}:${padded(m)}:${padded(s)} ${ampm}`;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dateText.textContent = `${days[now.getDay()]}, ${now.toLocaleDateString()}`;

  const hourDeg = ((h % 12) + m / 60) * 30;
  const minuteDeg = (m + s / 60) * 6;
  const secondDeg = s * 6;
  document.getElementById("hourHand").style.transform = `rotate(${hourDeg}deg)`;
  document.getElementById("minuteHand").style.transform = `rotate(${minuteDeg}deg)`;
  document.getElementById("secondHand").style.transform = `rotate(${secondDeg}deg)`;
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
}

setInterval(updateClock, 1000);
updateClock();

toggleView.onclick = () => {
  isAnalog = !isAnalog;
  analogClock.style.display = isAnalog ? "block" : "none";
  digitalClock.style.display = isAnalog ? "none" : "block";
};

toggleTheme.onclick = () => {
  document.body.classList.toggle("light");
  toggleTheme.textContent = document.body.classList.contains("light") ? "🌞 Light Mode" : "🌙 Dark Mode";
};

retroToggle.onclick = () => {
  document.body.classList.toggle("retro");
};

startPomodoro.onclick = () => {
  let minutes = 25, seconds = 0;
  pomodoroTimer.textContent = `${minutes}:00`;
  clearInterval(pomodoroInterval);
  pomodoroInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(pomodoroInterval);
        pomodoroTimer.textContent = "Done!";
        alarmSound.play();
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    pomodoroTimer.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, 1000);
};
