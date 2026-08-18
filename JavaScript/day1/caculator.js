function start() {
    let formula = prompt("계산할 식을 입력하세요 (예: 3 + 5 * 2 - 4 / 2)");
    let result = eval(formula);

    console.log(result);
}