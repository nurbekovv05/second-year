// Определяем действующие элементы на странице
const year = document.querySelector('#year');
const days = document.querySelector('#days');
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');
const countdown = document.querySelector('#countdown');
const preloader = document.querySelector('#preloader');

// Делаем расчеты
const currentYear = new Date().getFullYear(); // 2020
const nextYear = new Date(`January 01 ${currentYear + 1} 00:00:00`);

// Устанавливаем год на страницу
year.innerText = currentYear + 1;

function updateCounter() {
	const currentTime = new Date();
	const diff = nextYear - currentTime;

	// Перевод в дни
	const daysLeft = Math.floor(diff / 1000 / 60 / 60 / 24);
	// Часов всего, далее остаток от деления на 24 (преобразования в дни), получаем 8 часов
	const hoursLeft = Math.floor(diff / 1000 / 60 / 60) % 24;
	// Минут всего, далее остаток от преобразования в часы, минут осталось
	const minutesLeft = Math.floor(diff / 1000 / 60) % 60;
	// Секундк всего, далее остаток от преобразования в минуты, секунд осталось
	const secondsLeft = Math.floor(diff / 1000) % 60;

	console.log(daysLeft, hoursLeft, minutesLeft, secondsLeft);

	days.innerText = daysLeft;
	hours.innerText = hoursLeft < 10 ? '0' + hoursLeft : hoursLeft;
	minutes.innerText = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
	seconds.innerText = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
}

// Запускаем расчет 1 раз в секунду (каждую секунду)
setInterval(updateCounter, 1000);

setTimeout(function () {
    preloader.remove();
    countdown.style.display = 'flex';
}, 1000);

'use strict';

let _createClass = function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

let Balls = function () {
	function Balls(context, buffer) {
		_classCallCheck(this, Balls);

		this.context = context;
		this.buffer = buffer;
	}

	_createClass(Balls, [{
		key: 'setup',
		value: function setup() {
			this.gainNode = this.context.createGain();
			this.source = this.context.createBufferSource();
			this.source.buffer = this.buffer;
			this.source.connect(this.gainNode);
			this.gainNode.connect(this.context.destination);
			this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
		}
	}, {
		key: 'play',
		value: function play() {
			this.setup();
			this.source.start(this.context.currentTime);
		}
	}, {
		key: 'stop',
		value: function stop() {
			let ct = this.context.currentTime + 1;
			this.gainNode.gain.exponentialRampToValueAtTime(.1, ct);
			this.source.stop(ct);
		}
	}]);

	return Balls;
}();

let Buffer = function () {
	function Buffer(context, urls) {
		_classCallCheck(this, Buffer);

		this.context = context;
		this.urls = urls;
		this.buffer = [];
	}

	_createClass(Buffer, [{
		key: 'loadSound',
		value: function loadSound(url, index) {
			let request = new XMLHttpRequest();
			request.open('get', url, true);
			request.responseType = 'arraybuffer';
			let thisBuffer = this;
			request.onload = function () {
				thisBuffer.context.decodeAudioData(request.response, function (buffer) {
					thisBuffer.buffer[index] = buffer;
					if (index === thisBuffer.urls.length - 1) {
						thisBuffer.loaded();
					}
				});
			};
			request.send();
		}
	}, {
		key: 'getBuffer',
		value: function getBuffer() {
			let _this = this;

			this.urls.forEach(function (url, index) {
				_this.loadSound(url, index);
			});
		}
	}, {
		key: 'loaded',
		value: function loaded() {
			_loaded = true;
		}
	}, {
		key: 'getSound',
		value: function getSound(index) {
			return this.buffer[index];
		}
	}]);

	return Buffer;
}();

let balls = null,
	preset = 0,
	_loaded = false;
let path = 'audio/';
let sounds = [path + 'sound1.mp3', path + 'sound2.mp3', path + 'sound3.mp3', path + 'sound4.mp3', path + 'sound5.mp3', path + 'sound6.mp3', path + 'sound7.mp3', path + 'sound8.mp3', path + 'sound9.mp3', path + 'sound10.mp3', path + 'sound11.mp3', path + 'sound12.mp3', path + 'sound13.mp3', path + 'sound14.mp3', path + 'sound15.mp3', path + 'sound16.mp3', path + 'sound17.mp3', path + 'sound18.mp3', path + 'sound19.mp3', path + 'sound20.mp3', path + 'sound21.mp3', path + 'sound22.mp3', path + 'sound23.mp3', path + 'sound24.mp3', path + 'sound25.mp3', path + 'sound26.mp3', path + 'sound27.mp3', path + 'sound28.mp3', path + 'sound29.mp3', path + 'sound30.mp3', path + 'sound31.mp3', path + 'sound32.mp3', path + 'sound33.mp3', path + 'sound34.mp3', path + 'sound35.mp3', path + 'sound36.mp3'];
let context = new (window.AudioContext || window.webkitAudioContext)();

function playBalls() {
	let index = parseInt(this.dataset.note) + preset;
	balls = new Balls(context, buffer.getSound(index));
	balls.play();
}

function stopBalls() {
	balls.stop();
}

let buffer = new Buffer(context, sounds);
let ballsSound = buffer.getBuffer();
let buttons = document.querySelectorAll('.b-ball_bounce');
buttons.forEach(function (button) {
	button.addEventListener('mouseenter', playBalls.bind(button));
	button.addEventListener('mouseleave', stopBalls);
});

function ballBounce(e) {
	let i = e;
	if (e.className.indexOf(" bounce") > -1) {
		return;
	}
	toggleBounce(i);
}

function toggleBounce(i) {
	i.classList.add("bounce");
	function n() {
		i.classList.remove("bounce");
		i.classList.add("bounce1");
		function o() {
			i.classList.remove("bounce1");
			i.classList.add("bounce2");
			function p() {
				i.classList.remove("bounce2");
				i.classList.add("bounce3");
				function q() {
					i.classList.remove("bounce3");
				}
				setTimeout(q, 300);
			}
			setTimeout(p, 300);
		}
		setTimeout(o, 300);
	}
	setTimeout(n, 300);
}

let array1 = document.querySelectorAll('.b-ball_bounce');
let array2 = document.querySelectorAll('.b-ball_bounce .b-ball__right');

for (let i = 0; i < array1.length; i++) {
	array1[i].addEventListener('mouseenter', function () {
		ballBounce(this);
	});
}

for (let i = 0; i < array2.length; i++) {
	array2[i].addEventListener('mouseenter', function () {
		ballBounce(this);
	});
}

let l = ["49", "50", "51", "52", "53", "54", "55", "56", "57", "48", "189", "187", "81", "87", "69", "82", "84", "89", "85", "73", "79", "80", "219", "221", "65", "83", "68", "70", "71", "72", "74", "75", "76", "186", "222", "220"];
let k = ["90", "88", "67", "86", "66", "78", "77", "188", "190", "191"];
let a = {};
for (let e = 0, c = l.length; e < c; e++) {
	a[l[e]] = e;
}
for (let _e = 0, _c = k.length; _e < _c; _e++) {
	a[k[_e]] = _e;
}

document.addEventListener('keydown', function (j) {
	let i = j.target;
	if (j.which in a) {
		let index = parseInt(a[j.which]);
		balls = new Balls(context, buffer.getSound(index));
		balls.play();
		let ball = document.querySelector('[data-note="' + index + '"]');
		toggleBounce(ball);
	}
});
