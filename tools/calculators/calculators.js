// Calculators catalog logic

document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('calculatorModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');

    const searchInput = document.getElementById('calculatorSearch');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const catalogCards = document.querySelectorAll('.calculator-card');
    const catalogGroups = document.querySelectorAll('.catalog-group');
    const noResults = document.getElementById('noResults');

    // ========================================================================
    // CALCULATOR DEFINITIONS & IMPLEMENTATIONS
    // ========================================================================
    const calculators = {

        // Math calculators
        percentage: {
            title: "Проценти",
            desc: "Изчисли колко е X% от Y, или какъв процент е X спрямо Y.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form" id="pctForm">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="pctVal">Стойност (X)</label>
                                <input type="number" step="any" id="pctVal" placeholder="Напр. 20" required>
                            </div>
                            <div class="calc-group">
                                <label for="pctTotal">База / Общо (Y)</label>
                                <input type="number" step="any" id="pctTotal" placeholder="Напр. 150" required>
                            </div>
                        </div>

                        <div class="calc-group">
                            <label for="pctMode">Режим на изчисление</label>
                            <select id="pctMode">
                                <option value="of">Колко е X% от Y?</option>
                                <option value="is">Какъв процент е X от Y?</option>
                                <option value="change">Процентна промяна от X към Y?</option>
                            </select>
                        </div>

                        <div class="calc-result" id="pctResult" style="display: none;">
                            <div class="calc-result-title">Резултат</div>
                            <div class="calc-result-value" id="pctResultVal">-</div>
                            <div class="calc-result-detail" id="pctResultDetail"></div>
                        </div>
                    </form>
                `;

                const form = container.querySelector('#pctForm');
                const valInput = container.querySelector('#pctVal');
                const totalInput = container.querySelector('#pctTotal');
                const modeSelect = container.querySelector('#pctMode');
                const resultBox = container.querySelector('#pctResult');
                const resultVal = container.querySelector('#pctResultVal');
                const resultDetail = container.querySelector('#pctResultDetail');

                function calculate() {
                    const x = parseFloat(valInput.value);
                    const y = parseFloat(totalInput.value);
                    const mode = modeSelect.value;

                    if (isNaN(x) || isNaN(y)) {
                        resultBox.style.display = 'none';
                        return;
                    }

                    let res = 0;
                    let detail = "";

                    if (mode === 'of') {
                        res = (x / 100) * y;
                        detail = `${x}% от ${y} е равно на ${formatNumber(res)}`;
                    } else if (mode === 'is') {
                        if (y === 0) {
                            res = 0;
                            detail = "Не може да се дели на нула.";
                        } else {
                            res = (x / y) * 100;
                            detail = `${x} представлява ${formatNumber(res)}% от ${y}`;
                        }
                    } else if (mode === 'change') {
                        if (x === 0) {
                            detail = "Началната стойност не може да е нула.";
                        } else {
                            res = ((y - x) / x) * 100;
                            const sign = res > 0 ? "+" : "";
                            detail = `Промяната от ${x} до ${y} е ${sign}${formatNumber(res)}%`;
                        }
                    }

                    resultBox.style.display = 'block';
                    resultVal.textContent = formatNumber(res) + (mode !== 'of' ? '%' : '');
                    resultDetail.textContent = detail;
                }

                form.addEventListener('input', calculate);
            }
        },

        average: {
            title: "Средно аритметично",
            desc: "Въведи числа, разделени със запетая, интервал или нов ред.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form" id="avgForm">
                        <div class="calc-group">
                            <label for="avgInput">Списък с числа</label>
                            <textarea id="avgInput" rows="3" placeholder="Напр. 5, 12, 8, 23, 4" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border); border-radius: var(--radius-sm); font-family: var(--font-mono); outline: none;"></textarea>
                        </div>

                        <div class="calc-result" id="avgResult" style="display: none;">
                            <div class="calc-result-title">Статистика</div>
                            <div class="calc-result-grid">
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Средно</div>
                                    <div class="calc-result-item-val" id="avgMean">-</div>
                                </div>
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Сума</div>
                                    <div class="calc-result-item-val" id="avgSum">-</div>
                                </div>
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Брой</div>
                                    <div class="calc-result-item-val" id="avgCount">-</div>
                                </div>
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Мин / Макс</div>
                                    <div class="calc-result-item-val" id="avgMinMax">-</div>
                                </div>
                            </div>
                        </div>
                    </form>
                `;

                const input = container.querySelector('#avgInput');
                const resultBox = container.querySelector('#avgResult');
                const meanEl = container.querySelector('#avgMean');
                const sumEl = container.querySelector('#avgSum');
                const countEl = container.querySelector('#avgCount');
                const minMaxEl = container.querySelector('#avgMinMax');

                input.addEventListener('input', () => {
                    const raw = input.value.trim();
                    if (!raw) {
                        resultBox.style.display = 'none';
                        return;
                    }

                    const numbers = raw
                        .split(/[\s,]+/)
                        .map(Number)
                        .filter(n => !isNaN(n));

                    if (numbers.length === 0) {
                        resultBox.style.display = 'none';
                        return;
                    }

                    const sum = numbers.reduce((a, b) => a + b, 0);
                    const avg = sum / numbers.length;
                    const min = Math.min(...numbers);
                    const max = Math.max(...numbers);

                    resultBox.style.display = 'block';
                    meanEl.textContent = formatNumber(avg);
                    sumEl.textContent = formatNumber(sum);
                    countEl.textContent = numbers.length;
                    minMaxEl.textContent = `${formatNumber(min)} / ${formatNumber(max)}`;
                });
            }
        },

        pythagoras: {
            title: "Питагорова теорема",
            desc: "Пресметни страна от правоъгълен триъгълник: a² + b² = c².",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form" id="pytForm">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="sideA">Катет a</label>
                                <input type="number" step="any" id="sideA" placeholder="Остави празно ако търсиш a">
                            </div>
                            <div class="calc-group">
                                <label for="sideB">Катет b</label>
                                <input type="number" step="any" id="sideB" placeholder="Остави празно ако търсиш b">
                            </div>
                        </div>
                        <div class="calc-group">
                            <label for="sideC">Хипотенуза c</label>
                            <input type="number" step="any" id="sideC" placeholder="Остави празно ако търсиш c">
                        </div>

                        <div class="calc-result" id="pytResult" style="display: none;">
                            <div class="calc-result-title">Резултат</div>
                            <div class="calc-result-value" id="pytResultVal">-</div>
                            <div class="calc-result-detail" id="pytResultDetail"></div>
                        </div>
                    </form>
                `;

                const aInput = container.querySelector('#sideA');
                const bInput = container.querySelector('#sideB');
                const cInput = container.querySelector('#sideC');
                const resultBox = container.querySelector('#pytResult');
                const resultVal = container.querySelector('#pytResultVal');
                const resultDetail = container.querySelector('#pytResultDetail');

                function calculate() {
                    const a = parseFloat(aInput.value);
                    const b = parseFloat(bInput.value);
                    const c = parseFloat(cInput.value);

                    let res = null;
                    let detail = "";

                    // Търсим c
                    if (!isNaN(a) && !isNaN(b) && isNaN(c)) {
                        res = Math.sqrt(a * a + b * b);
                        detail = `Хипотенуза c = √(${a}² + ${b}²)`;
                    }
                    // Търсим a
                    else if (!isNaN(c) && !isNaN(b) && isNaN(a)) {
                        if (c <= b) {
                            detail = "Хипотенузата c трябва да е по-голяма от катета b.";
                        } else {
                            res = Math.sqrt(c * c - b * b);
                            detail = `Катет a = √(${c}² - ${b}²)`;
                        }
                    }
                    // Търсим b
                    else if (!isNaN(c) && !isNaN(a) && isNaN(b)) {
                        if (c <= a) {
                            detail = "Хипотенузата c трябва да е по-голяма от катета a.";
                        } else {
                            res = Math.sqrt(c * c - a * a);
                            detail = `Катет b = √(${c}² - ${a}²)`;
                        }
                    } else {
                        resultBox.style.display = 'none';
                        return;
                    }

                    resultBox.style.display = 'block';
                    if (res !== null) {
                        resultVal.textContent = formatNumber(res);
                        resultDetail.textContent = detail;
                    } else {
                        resultVal.textContent = "Невалидни данни";
                        resultDetail.textContent = detail;
                    }
                }

                aInput.addEventListener('input', calculate);
                bInput.addEventListener('input', calculate);
                cInput.addEventListener('input', calculate);
            }
        },

        quadratic: {
            title: "Квадратно уравнение",
            desc: "Пресмятане на корените на уравнението ax² + bx + c = 0.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form" id="quadForm">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
                            <div class="calc-group">
                                <label for="qA">Коефициент a</label>
                                <input type="number" step="any" id="qA" placeholder="a" required>
                            </div>
                            <div class="calc-group">
                                <label for="qB">Коефициент b</label>
                                <input type="number" step="any" id="qB" placeholder="b" required>
                            </div>
                            <div class="calc-group">
                                <label for="qC">Коефициент c</label>
                                <input type="number" step="any" id="qC" placeholder="c" required>
                            </div>
                        </div>

                        <div class="calc-result" id="quadResult" style="display: none;">
                            <div class="calc-result-title">Дискриминанта и корени</div>
                            <div class="calc-result-value" id="quadResultVal">-</div>
                            <div class="calc-result-detail" id="quadResultDetail"></div>
                        </div>
                    </form>
                `;

                const aIn = container.querySelector('#qA');
                const bIn = container.querySelector('#qB');
                const cIn = container.querySelector('#qC');
                const resultBox = container.querySelector('#quadResult');
                const resultVal = container.querySelector('#quadResultVal');
                const resultDetail = container.querySelector('#quadResultDetail');

                function calculate() {
                    const a = parseFloat(aIn.value);
                    const b = parseFloat(bIn.value);
                    const c = parseFloat(cIn.value);

                    if (isNaN(a) || isNaN(b) || isNaN(c)) {
                        resultBox.style.display = 'none';
                        return;
                    }

                    if (a === 0) {
                        resultBox.style.display = 'block';
                        resultVal.textContent = "Не е квадратно (a = 0)";
                        resultDetail.textContent = `Линейно уравнение: x = ${formatNumber(-c / b)}`;
                        return;
                    }

                    const D = b * b - 4 * a * c;
                    resultBox.style.display = 'block';

                    if (D > 0) {
                        const x1 = (-b + Math.sqrt(D)) / (2 * a);
                        const x2 = (-b - Math.sqrt(D)) / (2 * a);
                        resultVal.textContent = `x₁ = ${formatNumber(x1)}, x₂ = ${formatNumber(x2)}`;
                        resultDetail.textContent = `Дискриминанта D = ${formatNumber(D)} (D > 0: два реални корена)`;
                    } else if (D === 0) {
                        const x = -b / (2 * a);
                        resultVal.textContent = `x₁ = x₂ = ${formatNumber(x)}`;
                        resultDetail.textContent = `Дискриминанта D = 0 (един двоен корен)`;
                    } else {
                        const real = formatNumber(-b / (2 * a));
                        const imag = formatNumber(Math.sqrt(-D) / (2 * a));
                        resultVal.textContent = `x = ${real} ± ${imag}i`;
                        resultDetail.textContent = `Дискриминанта D = ${formatNumber(D)} (D < 0: комплексни корени)`;
                    }
                }

                aIn.addEventListener('input', calculate);
                bIn.addEventListener('input', calculate);
                cIn.addEventListener('input', calculate);
            }
        },

        // Programming calculators
        "number-system": {
            title: "Бройни системи",
            desc: "Въведи число в която и да е система, за да се конвертира във всички останали.",
            render(container) {
                container.innerHTML = `
                    <div class="calculator-form">
                        <div class="calc-group">
                            <label for="binIn">Двоична (BIN, Base 2)</label>
                            <input type="text" id="binIn" placeholder="Напр. 101010" style="font-family: var(--font-mono);">
                        </div>
                        <div class="calc-group">
                            <label for="decIn">Десетична (DEC, Base 10)</label>
                            <input type="text" id="decIn" placeholder="Напр. 42" style="font-family: var(--font-mono);">
                        </div>
                        <div class="calc-group">
                            <label for="hexIn">Шестнадесетична (HEX, Base 16)</label>
                            <input type="text" id="hexIn" placeholder="Напр. 2A" style="font-family: var(--font-mono);">
                        </div>
                        <div class="calc-group">
                            <label for="octIn">Осмична (OCT, Base 8)</label>
                            <input type="text" id="octIn" placeholder="Напр. 52" style="font-family: var(--font-mono);">
                        </div>
                    </div>
                `;

                const bin = container.querySelector('#binIn');
                const dec = container.querySelector('#decIn');
                const hex = container.querySelector('#hexIn');
                const oct = container.querySelector('#octIn');

                function updateAll(val, source) {
                    if (isNaN(val)) {
                        if (source !== bin) bin.value = '';
                        if (source !== dec) dec.value = '';
                        if (source !== hex) hex.value = '';
                        if (source !== oct) oct.value = '';
                        return;
                    }

                    if (source !== bin) bin.value = (val >>> 0).toString(2);
                    if (source !== dec) dec.value = val.toString(10);
                    if (source !== hex) hex.value = val.toString(16).toUpperCase();
                    if (source !== oct) oct.value = val.toString(8);
                }

                bin.addEventListener('input', () => {
                    const clean = bin.value.trim();
                    if (!clean) { updateAll(NaN, bin); return; }
                    const parsed = parseInt(clean, 2);
                    updateAll(parsed, bin);
                });

                dec.addEventListener('input', () => {
                    const clean = dec.value.trim();
                    if (!clean) { updateAll(NaN, dec); return; }
                    const parsed = parseInt(clean, 10);
                    updateAll(parsed, dec);
                });

                hex.addEventListener('input', () => {
                    const clean = hex.value.trim();
                    if (!clean) { updateAll(NaN, hex); return; }
                    const parsed = parseInt(clean, 16);
                    updateAll(parsed, hex);
                });

                oct.addEventListener('input', () => {
                    const clean = oct.value.trim();
                    if (!clean) { updateAll(NaN, oct); return; }
                    const parsed = parseInt(clean, 8);
                    updateAll(parsed, oct);
                });
            }
        },

        modulo: {
            title: "Modulo (Остатък)",
            desc: "Пресмята остатъка при деление на две числа: A mod B.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form" id="modForm">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="modA">Число (A)</label>
                                <input type="number" id="modA" placeholder="Делимо" required>
                            </div>
                            <div class="calc-group">
                                <label for="modB">Делител (B)</label>
                                <input type="number" id="modB" placeholder="Модул" required>
                            </div>
                        </div>

                        <div class="calc-result" id="modResult" style="display: none;">
                            <div class="calc-result-title">Резултат</div>
                            <div class="calc-result-value" id="modResultVal">-</div>
                            <div class="calc-result-detail" id="modResultDetail"></div>
                        </div>
                    </form>
                `;

                const aIn = container.querySelector('#modA');
                const bIn = container.querySelector('#modB');
                const resultBox = container.querySelector('#modResult');
                const resultVal = container.querySelector('#modResultVal');
                const resultDetail = container.querySelector('#modResultDetail');

                function calculate() {
                    const a = parseInt(aIn.value, 10);
                    const b = parseInt(bIn.value, 10);

                    if (isNaN(a) || isNaN(b)) {
                        resultBox.style.display = 'none';
                        return;
                    }

                    if (b === 0) {
                        resultBox.style.display = 'block';
                        resultVal.textContent = "Грешка";
                        resultDetail.textContent = "Деление на нула не е позволено.";
                        return;
                    }

                    const rem = ((a % b) + b) % b; // Математически коректен modulo за отрицателни числа
                    const quotient = Math.floor(a / b);

                    resultBox.style.display = 'block';
                    resultVal.textContent = rem;
                    resultDetail.textContent = `${a} = (${b} × ${quotient}) + ${rem}`;
                }

                aIn.addEventListener('input', calculate);
                bIn.addEventListener('input', calculate);
            }
        },

        ascii: {
            title: "ASCII / Unicode конвертор",
            desc: "Въведи текст за преглед на кодовете му или въведи десетичен код.",
            render(container) {
                container.innerHTML = `
                    <div class="calculator-form">
                        <div class="calc-group">
                            <label for="asciiText">Текст към кодове</label>
                            <input type="text" id="asciiText" placeholder="Въведи символи...">
                        </div>

                        <div class="calc-result" id="asciiResultText" style="display: none;">
                            <div class="calc-result-title">Кодове на символите</div>
                            <div class="calc-result-value" id="asciiResultCodes" style="font-size: 1rem; line-height: 1.6;">-</div>
                        </div>

                        <div class="calc-group" style="margin-top: 1rem;">
                            <label for="asciiCode">Десетичен код към символ</label>
                            <input type="number" id="asciiCode" placeholder="Напр. 65 за 'A'">
                        </div>

                        <div class="calc-result" id="asciiResultCharBox" style="display: none;">
                            <div class="calc-result-title">Символ</div>
                            <div class="calc-result-value" id="asciiResultChar">-</div>
                        </div>
                    </div>
                `;

                const textIn = container.querySelector('#asciiText');
                const resTextBox = container.querySelector('#asciiResultText');
                const resCodes = container.querySelector('#asciiResultCodes');

                const codeIn = container.querySelector('#asciiCode');
                const resCharBox = container.querySelector('#asciiResultCharBox');
                const resChar = container.querySelector('#asciiResultChar');

                textIn.addEventListener('input', () => {
                    const val = textIn.value;
                    if (!val) {
                        resTextBox.style.display = 'none';
                        return;
                    }

                    const codes = Array.from(val).map(char => {
                        const code = char.charCodeAt(0);
                        return `'${char}' → Dec: ${code}, Hex: 0x${code.toString(16).toUpperCase()}`;
                    });

                    resTextBox.style.display = 'block';
                    resCodes.innerHTML = codes.join('<br>');
                });

                codeIn.addEventListener('input', () => {
                    const code = parseInt(codeIn.value, 10);
                    if (isNaN(code) || code < 0) {
                        resCharBox.style.display = 'none';
                        return;
                    }

                    resCharBox.style.display = 'block';
                    try {
                        resChar.textContent = String.fromCharCode(code);
                    } catch (e) {
                        resChar.textContent = "Невалиден";
                    }
                });
            }
        },

        // Physics calculators
        speed: {
            title: "Скорост, път и време",
            desc: "Пресмятане по класическата формула v = s / t.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form" id="spdForm">
                        <div class="calc-group">
                            <label for="spdTarget">Какво търсиш?</label>
                            <select id="spdTarget">
                                <option value="v">Скорост (v)</option>
                                <option value="s">Път / Разстояние (s)</option>
                                <option value="t">Време (t)</option>
                            </select>
                        </div>

                        <div class="calc-row">
                            <div class="calc-group" id="groupIn1">
                                <label id="labelIn1" for="spdIn1">Разстояние (km)</label>
                                <input type="number" step="any" id="spdIn1" placeholder="s">
                            </div>
                            <div class="calc-group" id="groupIn2">
                                <label id="labelIn2" for="spdIn2">Време (h)</label>
                                <input type="number" step="any" id="spdIn2" placeholder="t">
                            </div>
                        </div>

                        <div class="calc-result" id="spdResult" style="display: none;">
                            <div class="calc-result-title">Резултат</div>
                            <div class="calc-result-value" id="spdResultVal">-</div>
                        </div>
                    </form>
                `;

                const targetSelect = container.querySelector('#spdTarget');
                const label1 = container.querySelector('#labelIn1');
                const label2 = container.querySelector('#labelIn2');
                const in1 = container.querySelector('#spdIn1');
                const in2 = container.querySelector('#spdIn2');
                const resultBox = container.querySelector('#spdResult');
                const resultVal = container.querySelector('#spdResultVal');

                function updateLabels() {
                    in1.value = '';
                    in2.value = '';
                    resultBox.style.display = 'none';

                    const mode = targetSelect.value;
                    if (mode === 'v') {
                        label1.textContent = "Разстояние s (km)";
                        label2.textContent = "Време t (h)";
                    } else if (mode === 's') {
                        label1.textContent = "Скорост v (km/h)";
                        label2.textContent = "Време t (h)";
                    } else if (mode === 't') {
                        label1.textContent = "Разстояние s (km)";
                        label2.textContent = "Скорост v (km/h)";
                    }
                }

                function calculate() {
                    const v1 = parseFloat(in1.value);
                    const v2 = parseFloat(in2.value);
                    const mode = targetSelect.value;

                    if (isNaN(v1) || isNaN(v2)) {
                        resultBox.style.display = 'none';
                        return;
                    }

                    let res = 0;
                    let unit = "";

                    if (mode === 'v') {
                        if (v2 === 0) return;
                        res = v1 / v2;
                        unit = "km/h";
                    } else if (mode === 's') {
                        res = v1 * v2;
                        unit = "km";
                    } else if (mode === 't') {
                        if (v2 === 0) return;
                        res = v1 / v2;
                        unit = "h";
                    }

                    resultBox.style.display = 'block';
                    resultVal.textContent = `${formatNumber(res)} ${unit}`;
                }

                targetSelect.addEventListener('change', updateLabels);
                in1.addEventListener('input', calculate);
                in2.addEventListener('input', calculate);
            }
        },

        ohm: {
            title: "Закон на Ом",
            desc: "Връзка между напрежение (U), ток (I) и съпротивление (R): U = I × R.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form" id="ohmForm">
                        <div class="calc-group">
                            <label for="ohmTarget">Търсена величина</label>
                            <select id="ohmTarget">
                                <option value="U">Напрежение U (V)</option>
                                <option value="I">Ток I (A)</option>
                                <option value="R">Съпротивление R (Ω)</option>
                            </select>
                        </div>

                        <div class="calc-row">
                            <div class="calc-group">
                                <label id="ohmLabel1" for="ohmIn1">Ток I (A)</label>
                                <input type="number" step="any" id="ohmIn1" placeholder="Стойност 1">
                            </div>
                            <div class="calc-group">
                                <label id="ohmLabel2" for="ohmIn2">Съпротивление R (Ω)</label>
                                <input type="number" step="any" id="ohmIn2" placeholder="Стойност 2">
                            </div>
                        </div>

                        <div class="calc-result" id="ohmResult" style="display: none;">
                            <div class="calc-result-title">Резултат</div>
                            <div class="calc-result-value" id="ohmResultVal">-</div>
                            <div class="calc-result-detail" id="ohmResultDetail"></div>
                        </div>
                    </form>
                `;

                const target = container.querySelector('#ohmTarget');
                const label1 = container.querySelector('#ohmLabel1');
                const label2 = container.querySelector('#ohmLabel2');
                const in1 = container.querySelector('#ohmIn1');
                const in2 = container.querySelector('#ohmIn2');
                const resBox = container.querySelector('#ohmResult');
                const resVal = container.querySelector('#ohmResultVal');
                const resDetail = container.querySelector('#ohmResultDetail');

                function update() {
                    in1.value = '';
                    in2.value = '';
                    resBox.style.display = 'none';

                    const t = target.value;
                    if (t === 'U') {
                        label1.textContent = "Ток I (A)";
                        label2.textContent = "Съпротивление R (Ω)";
                    } else if (t === 'I') {
                        label1.textContent = "Напрежение U (V)";
                        label2.textContent = "Съпротивление R (Ω)";
                    } else if (t === 'R') {
                        label1.textContent = "Напрежение U (V)";
                        label2.textContent = "Ток I (A)";
                    }
                }

                function calculate() {
                    const v1 = parseFloat(in1.value);
                    const v2 = parseFloat(in2.value);
                    const t = target.value;

                    if (isNaN(v1) || isNaN(v2)) {
                        resBox.style.display = 'none';
                        return;
                    }

                    let val = 0;
                    let pwr = 0;
                    let unit = "";

                    if (t === 'U') {
                        val = v1 * v2;
                        pwr = val * v1; // P = U * I
                        unit = "V";
                    } else if (t === 'I') {
                        if (v2 === 0) return;
                        val = v1 / v2;
                        pwr = v1 * val;
                        unit = "A";
                    } else if (t === 'R') {
                        if (v2 === 0) return;
                        val = v1 / v2;
                        pwr = v1 * v2;
                        unit = "Ω";
                    }

                    resBox.style.display = 'block';
                    resVal.textContent = `${formatNumber(val)} ${unit}`;
                    resDetail.textContent = `Мощност P = ${formatNumber(pwr)} W`;
                }

                target.addEventListener('change', update);
                in1.addEventListener('input', calculate);
                in2.addEventListener('input', calculate);
            }
        },

        force: {
            title: "Сила (Втори закон на Нютон)",
            desc: "Изчисляване на сила F по маса m и ускорение a: F = m × a.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="forceM">Маса m (kg)</label>
                                <input type="number" step="any" id="forceM" placeholder="Напр. 70">
                            </div>
                            <div class="calc-group">
                                <label for="forceA">Ускорение a (m/s²)</label>
                                <input type="number" step="any" id="forceA" placeholder="Напр. 9.8">
                            </div>
                        </div>

                        <div class="calc-result" id="forceResult" style="display: none;">
                            <div class="calc-result-title">Сила</div>
                            <div class="calc-result-value" id="forceResultVal">-</div>
                        </div>
                    </form>
                `;

                const mIn = container.querySelector('#forceM');
                const aIn = container.querySelector('#forceA');
                const resBox = container.querySelector('#forceResult');
                const resVal = container.querySelector('#forceResultVal');

                function calculate() {
                    const m = parseFloat(mIn.value);
                    const a = parseFloat(aIn.value);

                    if (isNaN(m) || isNaN(a)) {
                        resBox.style.display = 'none';
                        return;
                    }

                    const f = m * a;
                    resBox.style.display = 'block';
                    resVal.textContent = `${formatNumber(f)} N (Нютона)`;
                }

                mIn.addEventListener('input', calculate);
                aIn.addEventListener('input', calculate);
            }
        },

        // Finance calculators
        vat: {
            title: "ДДС Калкулатор",
            desc: "Бързо добавяне или изваждане на ДДС (по подразбиране 20% за България).",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="vatAmount">Сума (лв.)</label>
                                <input type="number" step="any" id="vatAmount" placeholder="100.00">
                            </div>
                            <div class="calc-group">
                                <label for="vatRate">Ставка ДДС (%)</label>
                                <input type="number" step="any" id="vatRate" value="20">
                            </div>
                        </div>

                        <div class="calc-group">
                            <label for="vatMode">Тип операция</label>
                            <select id="vatMode">
                                <option value="add">Сумата е БЕЗ ДДС (Начисли ДДС)</option>
                                <option value="remove">Сумата е С ДДС (Извади ДДС)</option>
                            </select>
                        </div>

                        <div class="calc-result" id="vatResult" style="display: none;">
                            <div class="calc-result-title">Разбивка</div>
                            <div class="calc-result-grid">
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Нето (без ДДС)</div>
                                    <div class="calc-result-item-val" id="vatNet">-</div>
                                </div>
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">ДДС сума</div>
                                    <div class="calc-result-item-val" id="vatTax">-</div>
                                </div>
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Бруто (крайна)</div>
                                    <div class="calc-result-item-val" id="vatGross">-</div>
                                </div>
                            </div>
                        </div>
                    </form>
                `;

                const amountIn = container.querySelector('#vatAmount');
                const rateIn = container.querySelector('#vatRate');
                const modeSelect = container.querySelector('#vatMode');
                const resBox = container.querySelector('#vatResult');
                const netEl = container.querySelector('#vatNet');
                const taxEl = container.querySelector('#vatTax');
                const grossEl = container.querySelector('#vatGross');

                function calculate() {
                    const amount = parseFloat(amountIn.value);
                    const rate = parseFloat(rateIn.value);
                    const mode = modeSelect.value;

                    if (isNaN(amount) || isNaN(rate)) {
                        resBox.style.display = 'none';
                        return;
                    }

                    let net = 0;
                    let tax = 0;
                    let gross = 0;

                    if (mode === 'add') {
                        net = amount;
                        tax = (net * rate) / 100;
                        gross = net + tax;
                    } else {
                        gross = amount;
                        net = gross / (1 + rate / 100);
                        tax = gross - net;
                    }

                    resBox.style.display = 'block';
                    netEl.textContent = `${formatNumber(net)} лв.`;
                    taxEl.textContent = `${formatNumber(tax)} лв.`;
                    grossEl.textContent = `${formatNumber(gross)} лв.`;
                }

                amountIn.addEventListener('input', calculate);
                rateIn.addEventListener('input', calculate);
                modeSelect.addEventListener('change', calculate);
            }
        },

        discount: {
            title: "Калкулатор за отстъпка",
            desc: "Пресметни колко спестяваш при намаление в процент.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="discOriginal">Първоначална цена</label>
                                <input type="number" step="any" id="discOriginal" placeholder="Напр. 80">
                            </div>
                            <div class="calc-group">
                                <label for="discPercent">Отстъпка (%)</label>
                                <input type="number" step="any" id="discPercent" placeholder="Напр. 25">
                            </div>
                        </div>

                        <div class="calc-result" id="discResult" style="display: none;">
                            <div class="calc-result-title">Крайна цена</div>
                            <div class="calc-result-value" id="discFinalVal">-</div>
                            <div class="calc-result-detail" id="discSavedDetail"></div>
                        </div>
                    </form>
                `;

                const origIn = container.querySelector('#discOriginal');
                const pctIn = container.querySelector('#discPercent');
                const resBox = container.querySelector('#discResult');
                const finalVal = container.querySelector('#discFinalVal');
                const savedDetail = container.querySelector('#discSavedDetail');

                function calculate() {
                    const orig = parseFloat(origIn.value);
                    const pct = parseFloat(pctIn.value);

                    if (isNaN(orig) || isNaN(pct)) {
                        resBox.style.display = 'none';
                        return;
                    }

                    const saved = (orig * pct) / 100;
                    const finalPrice = orig - saved;

                    resBox.style.display = 'block';
                    finalVal.textContent = `${formatNumber(finalPrice)} лв.`;
                    savedDetail.textContent = `Спестяваш: ${formatNumber(saved)} лв. (${pct}%)`;
                }

                origIn.addEventListener('input', calculate);
                pctIn.addEventListener('input', calculate);
            }
        },

        "compound-interest": {
            title: "Сложна лихва",
            desc: "Изчисляване на натрупването на лихва върху първоначална инвестиция.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="ciPrincipal">Главница (лв.)</label>
                                <input type="number" step="any" id="ciPrincipal" placeholder="Напр. 1000">
                            </div>
                            <div class="calc-group">
                                <label for="ciRate">Годишна лихва (%)</label>
                                <input type="number" step="any" id="ciRate" placeholder="Напр. 5">
                            </div>
                        </div>

                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="ciYears">Срок (години)</label>
                                <input type="number" id="ciYears" placeholder="Напр. 10">
                            </div>
                            <div class="calc-group">
                                <label for="ciFrequency">Капитализация</label>
                                <select id="ciFrequency">
                                    <option value="1">Годишно (1 път/год)</option>
                                    <option value="12" selected>Месечно (12 пъти/год)</option>
                                    <option value="365">Дневно (365 пъти/год)</option>
                                </select>
                            </div>
                        </div>

                        <div class="calc-result" id="ciResult" style="display: none;">
                            <div class="calc-result-title">Крайна стойност</div>
                            <div class="calc-result-value" id="ciFinalVal">-</div>
                            <div class="calc-result-detail" id="ciEarnedDetail"></div>
                        </div>
                    </form>
                `;

                const pIn = container.querySelector('#ciPrincipal');
                const rIn = container.querySelector('#ciRate');
                const tIn = container.querySelector('#ciYears');
                const nSelect = container.querySelector('#ciFrequency');
                const resBox = container.querySelector('#ciResult');
                const finalVal = container.querySelector('#ciFinalVal');
                const earnedDetail = container.querySelector('#ciEarnedDetail');

                function calculate() {
                    const P = parseFloat(pIn.value);
                    const r = parseFloat(rIn.value) / 100;
                    const t = parseFloat(tIn.value);
                    const n = parseInt(nSelect.value, 10);

                    if (isNaN(P) || isNaN(r) || isNaN(t)) {
                        resBox.style.display = 'none';
                        return;
                    }

                    // A = P * (1 + r/n)^(n*t)
                    const A = P * Math.pow(1 + (r / n), n * t);
                    const earned = A - P;

                    resBox.style.display = 'block';
                    finalVal.textContent = `${formatNumber(A)} лв.`;
                    earnedDetail.textContent = `Спечелена лихва: ${formatNumber(earned)} лв.`;
                }

                pIn.addEventListener('input', calculate);
                rIn.addEventListener('input', calculate);
                tIn.addEventListener('input', calculate);
                nSelect.addEventListener('change', calculate);
            }
        },

        inflation: {
            title: "Калкулатор за инфлация",
            desc: "Виж каква стойност би имала днешна сума пари след определен брой години при зададена инфлация.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="infAmount">Текуща сума (лв.)</label>
                                <input type="number" step="any" id="infAmount" placeholder="1000">
                            </div>
                            <div class="calc-group">
                                <label for="infRate">Годишна инфлация (%)</label>
                                <input type="number" step="any" id="infRate" placeholder="3">
                            </div>
                        </div>

                        <div class="calc-group">
                            <label for="infYears">Период (години)</label>
                            <input type="number" id="infYears" placeholder="10">
                        </div>

                        <div class="calc-result" id="infResult" style="display: none;">
                            <div class="calc-result-title">Бъдеща покупателна способност</div>
                            <div class="calc-result-value" id="infFutureVal">-</div>
                            <div class="calc-result-detail" id="infDetail"></div>
                        </div>
                    </form>
                `;

                const aIn = container.querySelector('#infAmount');
                const rIn = container.querySelector('#infRate');
                const yIn = container.querySelector('#infYears');
                const resBox = container.querySelector('#infResult');
                const resVal = container.querySelector('#infFutureVal');
                const resDetail = container.querySelector('#infDetail');

                function calculate() {
                    const amount = parseFloat(aIn.value);
                    const rate = parseFloat(rIn.value) / 100;
                    const years = parseFloat(yIn.value);

                    if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
                        resBox.style.display = 'none';
                        return;
                    }

                    // Сумата, нужна за да се купи същото нещо: Future Cost = amount * (1 + rate)^years
                    const futureCost = amount * Math.pow(1 + rate, years);
                    // Real purchasing power of money:
                    const realPower = amount / Math.pow(1 + rate, years);

                    resBox.style.display = 'block';
                    resVal.textContent = `${formatNumber(realPower)} лв.`;
                    resDetail.textContent = `За да купиш същото след ${years} г., ще са ти нужни ${formatNumber(futureCost)} лв.`;
                }

                aIn.addEventListener('input', calculate);
                rIn.addEventListener('input', calculate);
                yIn.addEventListener('input', calculate);
            }
        },

        investment: {
            title: "Инвестиционен калкулатор",
            desc: "Пресметни капиталовия растеж при сложна лихва и регулярни месечни вноски.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="invInit">Първоначална сума (лв.)</label>
                                <input type="number" step="any" id="invInit" placeholder="Напр. 5000" value="5000">
                            </div>
                            <div class="calc-group">
                                <label for="invMonthly">Месечна вноска (лв.)</label>
                                <input type="number" step="any" id="invMonthly" placeholder="Напр. 300" value="300">
                            </div>
                        </div>

                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="invReturn">Годишна доходност (%)</label>
                                <input type="number" step="any" id="invReturn" placeholder="Напр. 8" value="8">
                            </div>
                            <div class="calc-group">
                                <label for="invYears">Период (години)</label>
                                <input type="number" id="invYears" placeholder="Напр. 15" value="15">
                            </div>
                        </div>

                        <div class="calc-result" id="invResult" style="display: block;">
                            <div class="calc-result-title">Краен баланс след инвестиционния период</div>
                            <div class="calc-result-value" id="invTotalVal">-</div>
                            <div class="calc-result-grid" style="margin-top: 10px;">
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Внесени общо</div>
                                    <div class="calc-result-item-val" id="invPrincipalVal">-</div>
                                </div>
                                <div class="calc-result-item">
                                    <div class="calc-result-item-label">Спечелена лихва</div>
                                    <div class="calc-result-item-val" id="invInterestVal" style="color: #10b981;">-</div>
                                </div>
                            </div>
                            <div style="margin-top: 14px; text-align: center;">
                                <a href="/tools/inv.html" target="_blank" style="display: inline-block; padding: 8px 14px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.85rem;">
                                    📊 Отвори пълната симулация с графика и таблица →
                                </a>
                            </div>
                        </div>
                    </form>
                `;

                const initIn = container.querySelector('#invInit');
                const monthlyIn = container.querySelector('#invMonthly');
                const returnIn = container.querySelector('#invReturn');
                const yearsIn = container.querySelector('#invYears');

                const totalValEl = container.querySelector('#invTotalVal');
                const principalValEl = container.querySelector('#invPrincipalVal');
                const interestValEl = container.querySelector('#invInterestVal');

                function calculate() {
                    const init = Math.max(0, parseFloat(initIn.value) || 0);
                    const monthly = Math.max(0, parseFloat(monthlyIn.value) || 0);
                    const rate = Math.max(0, parseFloat(returnIn.value) || 0) / 100;
                    const years = Math.max(1, parseFloat(yearsIn.value) || 1);

                    let balance = init;
                    let totalInvested = init;
                    const monthlyRate = rate / 12;

                    for (let m = 1; m <= years * 12; m++) {
                        balance += monthly;
                        totalInvested += monthly;
                        balance += balance * monthlyRate;
                    }

                    const interest = balance - totalInvested;

                    totalValEl.textContent = `${formatNumber(balance)} лв.`;
                    principalValEl.textContent = `${formatNumber(totalInvested)} лв.`;
                    interestValEl.textContent = `+${formatNumber(interest)} лв.`;
                }

                initIn.addEventListener('input', calculate);
                monthlyIn.addEventListener('input', calculate);
                returnIn.addEventListener('input', calculate);
                yearsIn.addEventListener('input', calculate);

                calculate();
            }
        },

        // General tool calculators
        units: {
            title: "Преобразуване на мерни единици",
            desc: "Бърз конвертор за дължина, маса и температура.",
            render(container) {
                container.innerHTML = `
                    <form class="calculator-form">
                        <div class="calc-group">
                            <label for="unitCategory">Категория</label>
                            <select id="unitCategory">
                                <option value="length">Дължина</option>
                                <option value="mass">Маса / Тегло</option>
                                <option value="temp">Температура</option>
                            </select>
                        </div>

                        <div class="calc-group">
                            <label for="unitVal">Стойност за преобразуване</label>
                            <input type="number" step="any" id="unitVal" placeholder="Напр. 10">
                        </div>

                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="unitFrom">От</label>
                                <select id="unitFrom"></select>
                            </div>
                            <div class="calc-group">
                                <label for="unitTo">Към</label>
                                <select id="unitTo"></select>
                            </div>
                        </div>

                        <div class="calc-result" id="unitResult" style="display: none;">
                            <div class="calc-result-title">Резултат</div>
                            <div class="calc-result-value" id="unitResultVal">-</div>
                        </div>
                    </form>
                `;

                const catSelect = container.querySelector('#unitCategory');
                const valIn = container.querySelector('#unitVal');
                const fromSelect = container.querySelector('#unitFrom');
                const toSelect = container.querySelector('#unitTo');
                const resBox = container.querySelector('#unitResult');
                const resVal = container.querySelector('#unitResultVal');

                const definitions = {
                    length: {
                        units: {
                            m: { label: "Метри (m)", toBase: v => v, fromBase: v => v },
                            km: { label: "Километри (km)", toBase: v => v * 1000, fromBase: v => v / 1000 },
                            cm: { label: "Сантиметри (cm)", toBase: v => v / 100, fromBase: v => v * 100 },
                            mm: { label: "Милиметри (mm)", toBase: v => v / 1000, fromBase: v => v * 1000 },
                            mi: { label: "Мили (mi)", toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
                            ft: { label: "Футове (ft)", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
                            in: { label: "Инчове (in)", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 }
                        }
                    },
                    mass: {
                        units: {
                            kg: { label: "Килограми (kg)", toBase: v => v, fromBase: v => v },
                            g: { label: "Грамове (g)", toBase: v => v / 1000, fromBase: v => v * 1000 },
                            t: { label: "Тонове (t)", toBase: v => v * 1000, fromBase: v => v / 1000 },
                            lb: { label: "Паундове (lb)", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
                            oz: { label: "Унции (oz)", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 }
                        }
                    },
                    temp: {
                        units: {
                            c: { label: "Целзий (°C)", toBase: v => v, fromBase: v => v },
                            f: { label: "Фаренхайт (°F)", toBase: v => (v - 32) * (5/9), fromBase: v => (v * (9/5)) + 32 },
                            k: { label: "Келвин (K)", toBase: v => v - 273.15, fromBase: v => v + 273.15 }
                        }
                    }
                };

                function populateUnits() {
                    const cat = catSelect.value;
                    const u = definitions[cat].units;

                    fromSelect.innerHTML = '';
                    toSelect.innerHTML = '';

                    Object.keys(u).forEach((k, idx) => {
                        const opt1 = new Option(u[k].label, k);
                        const opt2 = new Option(u[k].label, k);
                        fromSelect.add(opt1);
                        toSelect.add(opt2);
                    });

                    if (toSelect.options.length > 1) {
                        toSelect.selectedIndex = 1;
                    }

                    calculate();
                }

                function calculate() {
                    const val = parseFloat(valIn.value);
                    if (isNaN(val)) {
                        resBox.style.display = 'none';
                        return;
                    }

                    const cat = catSelect.value;
                    const fromKey = fromSelect.value;
                    const toKey = toSelect.value;

                    const u = definitions[cat].units;
                    const baseVal = u[fromKey].toBase(val);
                    const finalVal = u[toKey].fromBase(baseVal);

                    resBox.style.display = 'block';
                    resVal.textContent = `${formatNumber(finalVal)} ${toSelect.options[toSelect.selectedIndex].text}`;
                }

                catSelect.addEventListener('change', populateUnits);
                valIn.addEventListener('input', calculate);
                fromSelect.addEventListener('change', calculate);
                toSelect.addEventListener('change', calculate);

                populateUnits();
            }
        },

        random: {
            title: "Генератор на случайни числа",
            desc: "Генерирай произволно число или хвърли виртуални зарове.",
            render(container) {
                container.innerHTML = `
                    <div class="calculator-form">
                        <div class="calc-row">
                            <div class="calc-group">
                                <label for="rndMin">Минимум</label>
                                <input type="number" id="rndMin" value="1">
                            </div>
                            <div class="calc-group">
                                <label for="rndMax">Максимум</label>
                                <input type="number" id="rndMax" value="100">
                            </div>
                        </div>

                        <button class="calc-action-btn" id="rndGenerateBtn" type="button">Генерирай число</button>

                        <div class="calc-result" id="rndResult" style="display: none; text-align: center;">
                            <div class="calc-result-title">Избрано число</div>
                            <div class="calc-result-value" id="rndResultVal" style="font-size: 2.5rem; color: var(--accent);">-</div>
                        </div>
                    </div>
                `;

                const minIn = container.querySelector('#rndMin');
                const maxIn = container.querySelector('#rndMax');
                const btn = container.querySelector('#rndGenerateBtn');
                const resBox = container.querySelector('#rndResult');
                const resVal = container.querySelector('#rndResultVal');

                btn.addEventListener('click', () => {
                    const min = parseInt(minIn.value, 10);
                    const max = parseInt(maxIn.value, 10);

                    if (isNaN(min) || isNaN(max) || min > max) {
                        alert("Моля, въведи коректен диапазон (Минимум <= Максимум).");
                        return;
                    }

                    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
                    resBox.style.display = 'block';
                    resVal.textContent = randomNum;
                });
            }
        }
    };

    // ========================================================================
    // MODAL CONTROL
    // ========================================================================
    function openCalculator(key) {
        const calc = calculators[key];
        if (!calc) return;

        modalTitle.textContent = calc.title;
        modalDesc.textContent = calc.desc;
        modalContent.innerHTML = '';

        calc.render(modalContent);

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Фокус върху първия интерактивен елемент
        setTimeout(() => {
            const firstInput = modalContent.querySelector('input, select, textarea, button');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    function closeCalculator() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modalContent.innerHTML = '';
    }

    // Събития за отваряне на калкулатор от картите
    // Preserve mode query param for sidebar navigation
    function withMode(url) {
        try {
            const q = new URLSearchParams(location.search).get('mode');
            if (q === 'portfolio' || q === 'learning') {
                const u = new URL(url, location.origin);
                if (!u.searchParams.get('mode')) u.searchParams.set('mode', q);
                return u.pathname + u.search + u.hash;
            }
        } catch (err) {}
        return url;
    }
    catalogCards.forEach(card => {
        card.addEventListener('click', () => {
            const href = card.getAttribute('data-href');
            if (href) {
                window.location.href = withMode(href);
                return;
            }
            const key = card.getAttribute('data-calculator');
            if (key === 'investment') {
                window.location.href = withMode('/tools/inv.html');
                return;
            }
            openCalculator(key);
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeCalculator);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCalculator();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCalculator();
        }
    });

    // Search and category filtering
    let currentCategory = 'all';
    let searchQuery = '';

    function filterCatalog() {
        let totalVisible = 0;

        catalogGroups.forEach(group => {
            const groupCategory = group.getAttribute('data-group');
            const cards = group.querySelectorAll('.calculator-card');
            let groupVisibleCards = 0;

            // Check group category match
            const categoryMatches = (currentCategory === 'all' || currentCategory === groupCategory);

            cards.forEach(card => {
                const title = card.querySelector('.calculator-card-title').textContent.toLowerCase();
                const desc = card.querySelector('.calculator-card-description').textContent.toLowerCase();
                const textMatches = title.includes(searchQuery) || desc.includes(searchQuery);

                if (categoryMatches && textMatches) {
                    card.style.display = 'flex';
                    groupVisibleCards++;
                    totalVisible++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide group if no calculators are visible
            if (groupVisibleCards > 0) {
                group.style.display = 'flex';
            } else {
                group.style.display = 'none';
            }
        });

        // Show empty results message when no matches found
        if (totalVisible === 0) {
            noResults.hidden = false;
        } else {
            noResults.hidden = true;
        }
    }

    // Search input handler
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterCatalog();
    });

    // Category button filter handler
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            filterCatalog();
        });
    });

    // Helpers
    function formatNumber(num) {
        if (isNaN(num)) return "-";
        // Round to 4 decimal places and strip trailing zeros
        return parseFloat(num.toFixed(4)).toString();
    }
});
