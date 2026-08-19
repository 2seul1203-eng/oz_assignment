const display = document.querySelector('#display');
const onOffBtn = document.querySelector('.on-off');
const clearBtn = document.querySelector('.clear');
const enterBtn = document.querySelector('.enter');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');

let currentFormula = "";
let isPowerOn = true;
let isCalculated = false;

window.onload = function () {
    onOffBtn.classList.add('on');
};

onOffBtn.addEventListener('click', togglePower);
clearBtn.addEventListener('click', clearDisplay);
enterBtn.addEventListener('click', performCalculate);

numberBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        appendNumber(btn.textContent);
    });
});

operatorBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        appendOperator(btn.textContent);
    });
});

function togglePower() {
    isPowerOn = !isPowerOn;
    const buttons = document.querySelectorAll('button:not(.on-off)');

    if (isPowerOn) {
        display.value = "0";
        onOffBtn.classList.add('on');
        buttons.forEach(btn => btn.disabled = false);
    } else {
        display.value = "";
        onOffBtn.classList.remove('on');
        buttons.forEach(btn => btn.disabled = true);
        currentFormula = "";
        isCalculated = false;
    }
}

function appendNumber(number) {
    if (!isPowerOn) return;

    if (isCalculated) {
        display.value = "";
        currentFormula = "";
        isCalculated = false;
    }

    if (display.value === "0" || display.value === "Error") {
        display.value = number;
        currentFormula = number;
    } else {
        display.value += number;
        currentFormula += number;
    }
}

function appendOperator(operator) {
    if (!isPowerOn) return;
    if (display.value === "Error") return;

    isCalculated = false;
    currentFormula += operator;
    display.value = currentFormula;
}

function clearDisplay() {
    if (!isPowerOn) return;
    display.value = "0";
    currentFormula = "";
    isCalculated = false;
}

function performCalculate() {
    if (!isPowerOn || !currentFormula) return;

    let result;
    try {
        result = eval(currentFormula);
    } catch (e) {
        result = "Error";
    }

    display.value = result;
    isCalculated = true;
    currentFormula = (result === "Error") ? "" : result.toString();
}