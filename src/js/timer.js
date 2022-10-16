import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('input'),
  startBtn: document.querySelector('button'),
  audio: document.querySelector('audio'),
};
let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      Notify.failure('Please choose a date in the future', {
        timeout: 6000,
        width: '300px',
        clickToClose: true,
        position: 'center-top',
      });
      return;
    }
    refs.startBtn.disabled = false;
    selectedDate = selectedDates[0];
  },
};

flatpickr('#datetime-picker', options);

class Timer {
  #timerId = null;
  #refs = {};
  #datasetValues = {
    days: ['день', 'дня', 'днів'],
    hours: ['година', 'години', 'годин'],
    minutes: ['хвилина', 'хвилини', 'хвилин'],
    seconds: ['секунда', 'секунди', 'секунд'],
  };

  constructor(selector) {
    this.selector = selector;
  }

  start() {
    this.#getRefs();
    refs.startBtn.disabled = true;
    refs.input.disabled = true;
    this.#timerId = setInterval(() => {
      const dif = selectedDate - Date.now();
      if (dif < 1000) {
        clearInterval(this.#timerId);
        refs.startBtn.disabled = false;
        refs.input.disabled = false;
        Notify.success('Target date');
        refs.audio.play();
      }

      const data = this.convertMs(dif);
      Object.entries(data).forEach(([name, value], index) => {
        this.#refs.output[index].textContent = this.addLeadingZero(value);
        this.#refs.output[index].dataset.title = this.#declensionNum(
          value,
          this.#datasetValues[name]
        );
        this.#drawCircle(index, value);
      });
    }, 1000);
  }

  #getRefs() {
    console.log(this.selector);
    this.#refs.output = {};
    this.#refs.output = document.querySelectorAll(
      `${this.selector} .timer__item`
    );
    this.#refs.canvas = {};
    this.#refs.canvas = document.querySelectorAll(
      `${this.selector} #stockGraph`
    );
    console.log(this.#refs);
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

  #declensionNum(num, words) {
    return words[
      num % 100 > 4 && num % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][num % 10 < 5 ? num % 10 : 5]
    ];
  }

  #drawCircle(index, value) {
    const ctx = this.#refs.canvas[index].getContext('2d');
    ctx.clearRect(0, 0, 200, 200);
    ctx.beginPath();
    ctx.strokeStyle = 'red';

    ctx.lineWidth = 4;
    // ctx.lineCap = 'round';

    let path = 60 / 2;
    if (index === 0) {
      path = 20 / 2;
    }

    if (index === 1) {
      path = 24 / 2;
    }
    ctx.arc(
      100,
      100,
      100 - 2,
      (Math.PI / path) * (value - path / 2),
      (Math.PI / path) * (path * 2 - path / 2 - 0.01),
      true
    );

    ctx.stroke();
  }
}

const timer = new Timer('.timer__items', selectedDate);
refs.startBtn.addEventListener('click', timer.start.bind(timer));
