/* =========================================================
   CALCULATORS
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const modal = document.getElementById("calculatorModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

const searchInput = document.getElementById("calculatorSearch");
const categoryButtons = document.querySelectorAll(".category-btn");
const calculatorCards = document.querySelectorAll(".calculator-card");
const calculatorGroups = document.querySelectorAll(".catalog-group");
const noResults = document.getElementById("noResults");


/* =========================================================
   CURRENT STATE
   ========================================================= */

let currentCategory = "all";
let lastFocusedElement = null;


/* =========================================================
   CALCULATOR DATA
   ========================================================= */

const calculators = {

    percentage: {
        title: "Проценти",
        description: "Изчисляване на процент от число или процентна промяна.",

        render: () => `
            <form class="calculator-form" id="percentageForm">

                <label>
                    Какво искаш да изчислиш?

                    <select id="percentageType">
                        <option value="of">
                            Процент от число
                        </option>

                        <option value="change">
                            Процентна промяна
                        </option>
                    </select>
                </label>


                <div class="form-row">

                    <label>
                        Процент
                        <input
                            type="number"
                            id="percentageValue"
                            placeholder="20"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        Число
                        <input
                            type="number"
                            id="percentageNumber"
                            placeholder="150"
                            step="any"
                            required
                        >
                    </label>

                </div>


                <div id="percentageChangeFields" hidden>

                    <label>
                        Нова стойност
                        <input
                            type="number"
                            id="percentageNewValue"
                            placeholder="180"
                            step="any"
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="percentageResult"
                hidden
            ></div>
        `,

        init: () => {

            const form = document.getElementById("percentageForm");

            const type = document.getElementById("percentageType");

            const percent = document.getElementById("percentageValue");
            const number = document.getElementById("percentageNumber");

            const changeFields =
                document.getElementById("percentageChangeFields");

            const newValue =
                document.getElementById("percentageNewValue");

            const result =
                document.getElementById("percentageResult");


            type.addEventListener("change", () => {

                const isChange = type.value === "change";

                changeFields.hidden = !isChange;

                if (isChange) {
                    percent.parentElement.style.display = "none";
                    number.parentElement.querySelector("input").placeholder = "150";
                } else {
                    percent.parentElement.style.display = "";
                }

            });


            form.addEventListener("submit", event => {

                event.preventDefault();

                const p = Number(percent.value);
                const n = Number(number.value);

                if (type.value === "of") {

                    if (!Number.isFinite(p) || !Number.isFinite(n)) {
                        return;
                    }

                    const value = (p / 100) * n;

                    result.hidden = false;

                    result.innerHTML = `
                        <span class="calc-result-title">
                            Резултат
                        </span>

                        <span class="calc-result-value">
                            ${formatNumber(value)}
                        </span>

                        <span class="calc-result-formula">
                            ${formatNumber(p)}% от
                            ${formatNumber(n)}
                            =
                            ${formatNumber(value)}
                        </span>
                    `;

                    return;
                }


                const oldValue = n;
                const currentValue = Number(newValue.value);

                if (
                    !Number.isFinite(oldValue) ||
                    !Number.isFinite(currentValue) ||
                    oldValue === 0
                ) {
                    return;
                }

                const change =
                    ((currentValue - oldValue) / oldValue) * 100;

                const direction =
                    change >= 0 ? "увеличение" : "намаление";


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Резултат
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(change)}%
                    </span>

                    <span class="calc-result-formula">
                        ${direction} от
                        ${formatNumber(oldValue)}
                        до
                        ${formatNumber(currentValue)}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       AVERAGE
       ===================================================== */

    average: {

        title: "Средно аритметично",

        description:
            "Изчисляване на средната стойност на поредица от числа.",

        render: () => `
            <form class="calculator-form" id="averageForm">

                <label>
                    Числа

                    <input
                        type="text"
                        id="averageNumbers"
                        placeholder="10, 20, 30, 40"
                        required
                    >
                </label>

                <div class="calc-help">
                    Въведи числата, разделени със запетаи.
                </div>

                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>

            <div
                class="calc-result"
                id="averageResult"
                hidden
            ></div>
        `,

        init: () => {

            const form = document.getElementById("averageForm");

            const input =
                document.getElementById("averageNumbers");

            const result =
                document.getElementById("averageResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const numbers = input.value
                    .split(",")
                    .map(value => Number(value.trim()))
                    .filter(value => Number.isFinite(value));


                if (numbers.length === 0) {
                    return;
                }


                const sum =
                    numbers.reduce(
                        (total, value) => total + value,
                        0
                    );

                const average = sum / numbers.length;


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Средна стойност
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(average)}
                    </span>

                    <span class="calc-result-formula">
                        Сума:
                        ${formatNumber(sum)}
                        ÷
                        ${numbers.length}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       PYTHAGORAS
       ===================================================== */

    pythagoras: {

        title: "Питагорова теорема",

        description:
            "Изчисляване на страна от правоъгълен триъгълник.",

        render: () => `
            <form class="calculator-form" id="pythagorasForm">

                <label>
                    Избери какво да намериш

                    <select id="pythagorasType">

                        <option value="c">
                            Хипотенуза c
                        </option>

                        <option value="a">
                            Катет a
                        </option>

                        <option value="b">
                            Катет b
                        </option>

                    </select>

                </label>


                <div class="form-row">

                    <label>
                        a

                        <input
                            type="number"
                            id="sideA"
                            placeholder="3"
                            step="any"
                        >
                    </label>


                    <label>
                        b

                        <input
                            type="number"
                            id="sideB"
                            placeholder="4"
                            step="any"
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="pythagorasResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("pythagorasForm");

            const type =
                document.getElementById("pythagorasType");

            const a =
                document.getElementById("sideA");

            const b =
                document.getElementById("sideB");

            const result =
                document.getElementById("pythagorasResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const A = Number(a.value);
                const B = Number(b.value);

                let value;
                let formula;


                if (type.value === "c") {

                    if (A <= 0 || B <= 0) {
                        return;
                    }

                    value = Math.sqrt(A * A + B * B);

                    formula =
                        `c = √(${A}² + ${B}²)`;

                }


                if (type.value === "a") {

                    const C = Number(
                        prompt("Въведи хипотенузата c:")
                    );

                    if (
                        C <= 0 ||
                        B <= 0 ||
                        C <= B
                    ) {
                        return;
                    }

                    value = Math.sqrt(C * C - B * B);

                    formula =
                        `a = √(${C}² - ${B}²)`;

                }


                if (type.value === "b") {

                    const C = Number(
                        prompt("Въведи хипотенузата c:")
                    );

                    if (
                        C <= 0 ||
                        A <= 0 ||
                        C <= A
                    ) {
                        return;
                    }

                    value = Math.sqrt(C * C - A * A);

                    formula =
                        `b = √(${C}² - ${A}²)`;

                }


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Резултат
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(value)}
                    </span>

                    <span class="calc-result-formula">
                        ${formula}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       QUADRATIC
       ===================================================== */

    quadratic: {

        title: "Квадратно уравнение",

        description:
            "Намиране на корените на ax² + bx + c = 0.",

        render: () => `
            <form class="calculator-form" id="quadraticForm">

                <div class="form-row">

                    <label>
                        a

                        <input
                            type="number"
                            id="quadA"
                            placeholder="1"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        b

                        <input
                            type="number"
                            id="quadB"
                            placeholder="-5"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        c

                        <input
                            type="number"
                            id="quadC"
                            placeholder="6"
                            step="any"
                            required
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="quadraticResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("quadraticForm");

            const a =
                document.getElementById("quadA");

            const b =
                document.getElementById("quadB");

            const c =
                document.getElementById("quadC");

            const result =
                document.getElementById("quadraticResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const A = Number(a.value);
                const B = Number(b.value);
                const C = Number(c.value);


                if (A === 0) {
                    return;
                }


                const D =
                    B * B -
                    4 * A * C;


                if (D < 0) {

                    result.hidden = false;

                    result.innerHTML = `
                        <span class="calc-result-title">
                            Резултат
                        </span>

                        <span class="calc-result-value">
                            Няма реални корени
                        </span>

                        <span class="calc-result-formula">
                            Дискриминанта D = ${formatNumber(D)}
                        </span>
                    `;

                    return;
                }


                if (D === 0) {

                    const x =
                        -B / (2 * A);

                    result.hidden = false;

                    result.innerHTML = `
                        <span class="calc-result-title">
                            Един двоен корен
                        </span>

                        <span class="calc-result-value">
                            x = ${formatNumber(x)}
                        </span>

                        <span class="calc-result-formula">
                            D = 0
                        </span>
                    `;

                    return;
                }


                const x1 =
                    (-B + Math.sqrt(D)) / (2 * A);

                const x2 =
                    (-B - Math.sqrt(D)) / (2 * A);


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Корени
                    </span>

                    <span class="calc-result-value">
                        x₁ = ${formatNumber(x1)}
                        <br>
                        x₂ = ${formatNumber(x2)}
                    </span>

                    <span class="calc-result-formula">
                        D = ${formatNumber(D)}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       NUMBER SYSTEMS
       ===================================================== */

    "number-system": {

        title: "Бройни системи",

        description:
            "Преобразуване между двоична, десетична, осмична и шестнадесетична система.",

        render: () => `
            <form class="calculator-form" id="numberSystemForm">

                <div class="form-row">

                    <label>
                        От

                        <select id="fromBase">
                            <option value="2">Двоична</option>
                            <option value="8">Осмична</option>
                            <option value="10" selected>Десетична</option>
                            <option value="16">Шестнадесетична</option>
                        </select>
                    </label>


                    <label>
                        Към

                        <select id="toBase">
                            <option value="2">Двоична</option>
                            <option value="8">Осмична</option>
                            <option value="10">Десетична</option>
                            <option value="16">Шестнадесетична</option>
                        </select>
                    </label>

                </div>


                <label>
                    Число

                    <input
                        type="text"
                        id="numberInput"
                        placeholder="255"
                        required
                    >
                </label>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Преобразувай
                </button>

            </form>


            <div
                class="calc-result"
                id="numberSystemResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("numberSystemForm");

            const fromBase =
                document.getElementById("fromBase");

            const toBase =
                document.getElementById("toBase");

            const input =
                document.getElementById("numberInput");

            const result =
                document.getElementById("numberSystemResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const baseFrom = Number(fromBase.value);
                const baseTo = Number(toBase.value);

                const value =
                    parseInt(
                        input.value.trim(),
                        baseFrom
                    );


                if (
                    Number.isNaN(value) ||
                    value < 0
                ) {
                    return;
                }


                const converted =
                    value.toString(baseTo).toUpperCase();


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Резултат
                    </span>

                    <span class="calc-result-value">
                        ${converted}
                    </span>

                    <span class="calc-result-formula">
                        ${input.value}
                        (основа ${baseFrom})
                        →
                        ${converted}
                        (основа ${baseTo})
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       MODULO
       ===================================================== */

    modulo: {

        title: "Modulo",

        description:
            "Изчисляване на остатъка при целочислено деление.",

        render: () => `
            <form class="calculator-form" id="moduloForm">

                <div class="form-row">

                    <label>
                        Число

                        <input
                            type="number"
                            id="modA"
                            placeholder="17"
                            required
                        >
                    </label>


                    <label>
                        Делител

                        <input
                            type="number"
                            id="modB"
                            placeholder="5"
                            required
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="moduloResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("moduloForm");

            const a =
                document.getElementById("modA");

            const b =
                document.getElementById("modB");

            const result =
                document.getElementById("moduloResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const A = Number(a.value);
                const B = Number(b.value);


                if (B === 0) {
                    return;
                }


                const remainder = A % B;


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Остатък
                    </span>

                    <span class="calc-result-value">
                        ${remainder}
                    </span>

                    <span class="calc-result-formula">
                        ${A} % ${B} = ${remainder}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       ASCII
       ===================================================== */

    ascii: {

        title: "ASCII / Unicode",

        description:
            "Преобразуване между символ и неговия числов Unicode код.",

        render: () => `
            <form class="calculator-form" id="asciiForm">

                <label>
                    Символ

                    <input
                        type="text"
                        id="asciiCharacter"
                        maxlength="2"
                        placeholder="A"
                    >
                </label>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Преобразувай
                </button>

            </form>


            <div
                class="calc-result"
                id="asciiResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("asciiForm");

            const input =
                document.getElementById("asciiCharacter");

            const result =
                document.getElementById("asciiResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const character =
                    input.value.trim();


                if (!character) {
                    return;
                }


                const code =
                    character.codePointAt(0);


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Unicode код
                    </span>

                    <span class="calc-result-value">
                        ${code}
                    </span>

                    <span class="calc-result-formula">
                        „${character[0]}“
                        → U+${code.toString(16).toUpperCase().padStart(4, "0")}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       SPEED
       ===================================================== */

    speed: {

        title: "Скорост",

        description:
            "Изчисляване на скорост, разстояние или време.",

        render: () => `
            <form class="calculator-form" id="speedForm">

                <label>
                    Какво да изчислим?

                    <select id="speedType">

                        <option value="speed">
                            Скорост
                        </option>

                        <option value="distance">
                            Разстояние
                        </option>

                        <option value="time">
                            Време
                        </option>

                    </select>

                </label>


                <div class="form-row">

                    <label>
                        Разстояние (km)

                        <input
                            type="number"
                            id="distance"
                            placeholder="100"
                            step="any"
                        >
                    </label>


                    <label>
                        Време (h)

                        <input
                            type="number"
                            id="time"
                            placeholder="2"
                            step="any"
                        >
                    </label>

                </div>


                <label>
                    Скорост (km/h)

                    <input
                        type="number"
                        id="speed"
                        placeholder="50"
                        step="any"
                    >
                </label>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="speedResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("speedForm");

            const type =
                document.getElementById("speedType");

            const distance =
                document.getElementById("distance");

            const time =
                document.getElementById("time");

            const speed =
                document.getElementById("speed");

            const result =
                document.getElementById("speedResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const d = Number(distance.value);
                const t = Number(time.value);
                const v = Number(speed.value);

                let value;
                let formula;


                if (type.value === "speed") {

                    if (t === 0) return;

                    value = d / t;

                    formula = `${d} ÷ ${t} = ${value} km/h`;

                }


                if (type.value === "distance") {

                    value = v * t;

                    formula = `${v} × ${t} = ${value} km`;

                }


                if (type.value === "time") {

                    if (v === 0) return;

                    value = d / v;

                    formula = `${d} ÷ ${v} = ${value} h`;

                }


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Резултат
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(value)}
                    </span>

                    <span class="calc-result-formula">
                        ${formula}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       OHM
       ===================================================== */

    ohm: {

        title: "Закон на Ом",

        description:
            "Изчисляване на напрежение, ток или съпротивление.",

        render: () => `
            <form class="calculator-form" id="ohmForm">

                <label>
                    Какво да изчислим?

                    <select id="ohmType">

                        <option value="voltage">
                            Напрежение U
                        </option>

                        <option value="current">
                            Ток I
                        </option>

                        <option value="resistance">
                            Съпротивление R
                        </option>

                    </select>

                </label>


                <div class="form-row">

                    <label>
                        Напрежение U (V)

                        <input
                            type="number"
                            id="ohmU"
                            step="any"
                        >
                    </label>


                    <label>
                        Ток I (A)

                        <input
                            type="number"
                            id="ohmI"
                            step="any"
                        >
                    </label>

                </div>


                <label>
                    Съпротивление R (Ω)

                    <input
                        type="number"
                        id="ohmR"
                        step="any"
                    >
                </label>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="ohmResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("ohmForm");

            const type =
                document.getElementById("ohmType");

            const U =
                document.getElementById("ohmU");

            const I =
                document.getElementById("ohmI");

            const R =
                document.getElementById("ohmR");

            const result =
                document.getElementById("ohmResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const voltage = Number(U.value);
                const current = Number(I.value);
                const resistance = Number(R.value);

                let value;
                let unit;
                let formula;


                if (type.value === "voltage") {

                    value = current * resistance;
                    unit = "V";

                    formula = `U = I × R`;

                }


                if (type.value === "current") {

                    if (resistance === 0) return;

                    value = voltage / resistance;
                    unit = "A";

                    formula = `I = U ÷ R`;

                }


                if (type.value === "resistance") {

                    if (current === 0) return;

                    value = voltage / current;
                    unit = "Ω";

                    formula = `R = U ÷ I`;

                }


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Резултат
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(value)} ${unit}
                    </span>

                    <span class="calc-result-formula">
                        ${formula}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       FORCE
       ===================================================== */

    force: {

        title: "Сила",

        description:
            "Изчисляване на сила по формулата F = m × a.",

        render: () => `
            <form class="calculator-form" id="forceForm">

                <div class="form-row">

                    <label>
                        Маса m (kg)

                        <input
                            type="number"
                            id="forceMass"
                            placeholder="10"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        Ускорение a (m/s²)

                        <input
                            type="number"
                            id="forceAcceleration"
                            placeholder="9.81"
                            step="any"
                            required
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="forceResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("forceForm");

            const mass =
                document.getElementById("forceMass");

            const acceleration =
                document.getElementById("forceAcceleration");

            const result =
                document.getElementById("forceResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const m = Number(mass.value);
                const a = Number(acceleration.value);

                const force = m * a;


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Сила
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(force)} N
                    </span>

                    <span class="calc-result-formula">
                        F = m × a =
                        ${formatNumber(m)} ×
                        ${formatNumber(a)}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       VAT
       ===================================================== */

    vat: {

        title: "ДДС",

        description:
            "Добавяне или премахване на ДДС от цена.",

        render: () => `
            <form class="calculator-form" id="vatForm">

                <label>
                    Операция

                    <select id="vatType">

                        <option value="add">
                            Добави ДДС
                        </option>

                        <option value="remove">
                            Премахни ДДС
                        </option>

                    </select>

                </label>


                <div class="form-row">

                    <label>
                        Сума

                        <input
                            type="number"
                            id="vatAmount"
                            placeholder="100"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        ДДС (%)

                        <input
                            type="number"
                            id="vatPercent"
                            value="20"
                            step="any"
                            required
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="vatResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("vatForm");

            const type =
                document.getElementById("vatType");

            const amount =
                document.getElementById("vatAmount");

            const percent =
                document.getElementById("vatPercent");

            const result =
                document.getElementById("vatResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const value = Number(amount.value);
                const vat = Number(percent.value);


                let net;
                let gross;
                let tax;


                if (type.value === "add") {

                    net = value;
                    tax = net * vat / 100;
                    gross = net + tax;

                } else {

                    gross = value;
                    net = gross / (1 + vat / 100);
                    tax = gross - net;

                }


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Крайна цена
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(gross)} лв.
                    </span>

                    <span class="calc-result-formula">
                        Нетно:
                        ${formatNumber(net)} лв.
                        ·
                        ДДС:
                        ${formatNumber(tax)} лв.
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       DISCOUNT
       ===================================================== */

    discount: {

        title: "Отстъпка",

        description:
            "Изчисляване на крайната цена след отстъпка.",

        render: () => `
            <form class="calculator-form" id="discountForm">

                <div class="form-row">

                    <label>
                        Първоначална цена

                        <input
                            type="number"
                            id="discountPrice"
                            placeholder="100"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        Отстъпка (%)

                        <input
                            type="number"
                            id="discountPercent"
                            placeholder="20"
                            step="any"
                            required
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="discountResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("discountForm");

            const price =
                document.getElementById("discountPrice");

            const percent =
                document.getElementById("discountPercent");

            const result =
                document.getElementById("discountResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const p = Number(price.value);
                const d = Number(percent.value);

                const saved = p * d / 100;
                const finalPrice = p - saved;


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Крайна цена
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(finalPrice)} лв.
                    </span>

                    <span class="calc-result-formula">
                        Спестяваш:
                        ${formatNumber(saved)} лв.
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       COMPOUND INTEREST
       ===================================================== */

    "compound-interest": {

        title: "Сложна лихва",

        description:
            "Изчисляване на натрупана сума при сложна лихва.",

        render: () => `
            <form class="calculator-form" id="interestForm">

                <label>
                    Начална сума

                    <input
                        type="number"
                        id="interestPrincipal"
                        placeholder="1000"
                        step="any"
                        required
                    >
                </label>


                <div class="form-row">

                    <label>
                        Годишна лихва (%)

                        <input
                            type="number"
                            id="interestRate"
                            placeholder="5"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        Период (години)

                        <input
                            type="number"
                            id="interestYears"
                            placeholder="10"
                            step="any"
                            required
                        >
                    </label>

                </div>


                <label>
                    Капитализации годишно

                    <input
                        type="number"
                        id="interestFrequency"
                        value="1"
                        min="1"
                        step="1"
                        required
                    >
                </label>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="interestResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("interestForm");

            const principal =
                document.getElementById("interestPrincipal");

            const rate =
                document.getElementById("interestRate");

            const years =
                document.getElementById("interestYears");

            const frequency =
                document.getElementById("interestFrequency");

            const result =
                document.getElementById("interestResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const P = Number(principal.value);
                const r = Number(rate.value) / 100;
                const n = Number(frequency.value);
                const t = Number(years.value);


                const amount =
                    P *
                    Math.pow(
                        1 + r / n,
                        n * t
                    );


                const interest =
                    amount - P;


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Натрупана сума
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(amount)} лв.
                    </span>

                    <span class="calc-result-formula">
                        Печалба от лихва:
                        ${formatNumber(interest)} лв.
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       INFLATION
       ===================================================== */

    inflation: {

        title: "Инфлация",

        description:
            "Изчисляване на промяната в покупателната способност.",

        render: () => `
            <form class="calculator-form" id="inflationForm">

                <div class="form-row">

                    <label>
                        Сума

                        <input
                            type="number"
                            id="inflationAmount"
                            placeholder="100"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        Инфлация (%)

                        <input
                            type="number"
                            id="inflationRate"
                            placeholder="3"
                            step="any"
                            required
                        >
                    </label>

                </div>


                <label>
                    Период (години)

                    <input
                        type="number"
                        id="inflationYears"
                        placeholder="10"
                        step="any"
                        required
                    >
                </label>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Изчисли
                </button>

            </form>


            <div
                class="calc-result"
                id="inflationResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("inflationForm");

            const amount =
                document.getElementById("inflationAmount");

            const rate =
                document.getElementById("inflationRate");

            const years =
                document.getElementById("inflationYears");

            const result =
                document.getElementById("inflationResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const A = Number(amount.value);
                const r = Number(rate.value) / 100;
                const t = Number(years.value);


                const futureCost =
                    A * Math.pow(1 + r, t);


                const purchasingPower =
                    A / Math.pow(1 + r, t);


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Резултат
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(futureCost)} лв.
                    </span>

                    <span class="calc-result-formula">
                        Стока, която днес струва
                        ${formatNumber(A)} лв.,
                        би струвала приблизително
                        ${formatNumber(futureCost)} лв.
                        след ${t} години.
                        Покупателната способност на
                        ${formatNumber(A)} лв.
                        би била около
                        ${formatNumber(purchasingPower)} лв.
                        в днешна стойност.
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       UNITS
       ===================================================== */

    units: {

        title: "Преобразуване на единици",

        description:
            "Преобразуване между основни мерни единици.",

        render: () => `
            <form class="calculator-form" id="unitsForm">

                <div class="form-row">

                    <label>
                        Стойност

                        <input
                            type="number"
                            id="unitValue"
                            placeholder="100"
                            step="any"
                            required
                        >
                    </label>


                    <label>
                        От

                        <select id="unitFrom">

                            <option value="km">km</option>
                            <option value="m">m</option>
                            <option value="cm">cm</option>
                            <option value="mm">mm</option>

                        </select>
                    </label>


                    <label>
                        Към

                        <select id="unitTo">

                            <option value="m">m</option>
                            <option value="km">km</option>
                            <option value="cm">cm</option>
                            <option value="mm">mm</option>

                        </select>
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Преобразувай
                </button>

            </form>


            <div
                class="calc-result"
                id="unitsResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("unitsForm");

            const value =
                document.getElementById("unitValue");

            const from =
                document.getElementById("unitFrom");

            const to =
                document.getElementById("unitTo");

            const result =
                document.getElementById("unitsResult");


            const factors = {
                km: 1000,
                m: 1,
                cm: 0.01,
                mm: 0.001
            };


            form.addEventListener("submit", event => {

                event.preventDefault();

                const inputValue = Number(value.value);

                const meters =
                    inputValue * factors[from.value];

                const converted =
                    meters / factors[to.value];


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Резултат
                    </span>

                    <span class="calc-result-value">
                        ${formatNumber(converted)} ${to.value}
                    </span>

                    <span class="calc-result-formula">
                        ${formatNumber(inputValue)}
                        ${from.value}
                        =
                        ${formatNumber(converted)}
                        ${to.value}
                    </span>
                `;

            });

        }
    },


    /* =====================================================
       RANDOM
       ===================================================== */

    random: {

        title: "Случайно число",

        description:
            "Генериране на случайно число в зададен диапазон.",

        render: () => `
            <form class="calculator-form" id="randomForm">

                <div class="form-row">

                    <label>
                        Минимум

                        <input
                            type="number"
                            id="randomMin"
                            value="1"
                            step="1"
                            required
                        >
                    </label>


                    <label>
                        Максимум

                        <input
                            type="number"
                            id="randomMax"
                            value="100"
                            step="1"
                            required
                        >
                    </label>

                </div>


                <button
                    type="submit"
                    class="calc-btn"
                >
                    Генерирай
                </button>

            </form>


            <div
                class="calc-result"
                id="randomResult"
                hidden
            ></div>
        `,

        init: () => {

            const form =
                document.getElementById("randomForm");

            const min =
                document.getElementById("randomMin");

            const max =
                document.getElementById("randomMax");

            const result =
                document.getElementById("randomResult");


            form.addEventListener("submit", event => {

                event.preventDefault();

                const minimum = Number(min.value);
                const maximum = Number(max.value);


                if (minimum > maximum) {
                    return;
                }


                const random =
                    Math.floor(
                        Math.random() *
                        (maximum - minimum + 1)
                    ) + minimum;


                result.hidden = false;

                result.innerHTML = `
                    <span class="calc-result-title">
                        Случайно число
                    </span>

                    <span class="calc-result-value">
                        ${random}
                    </span>

                    <span class="calc-result-formula">
                        Диапазон:
                        ${minimum} – ${maximum}
                    </span>
                `;

            });

        }
    }

};


/* =========================================================
   OPEN CALCULATOR
   ========================================================= */

function openCalculator(calculatorId, triggerElement) {

    const calculator =
        calculators[calculatorId];


    if (!calculator) {
        return;
    }


    lastFocusedElement =
        triggerElement || document.activeElement;


    modalTitle.textContent =
        calculator.title;

    modalDescription.textContent =
        calculator.description;


    modalContent.innerHTML =
        calculator.render();


    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    if (typeof calculator.init === "function") {
        calculator.init();
    }


    requestAnimationFrame(() => {
        modalClose.focus();
    });

}


/* =========================================================
   CLOSE CALCULATOR
   ========================================================= */

function closeCalculator() {

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    modalContent.innerHTML = "";


    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {
        lastFocusedElement.focus();
    }

}


/* =========================================================
   CARD EVENTS
   ========================================================= */

calculatorCards.forEach(card => {

    card.addEventListener("click", () => {

        const calculatorId =
            card.dataset.calculator;

        openCalculator(
            calculatorId,
            card
        );

    });

});


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

modalClose.addEventListener(
    "click",
    closeCalculator
);


/* =========================================================
   CLICK OUTSIDE MODAL
   ========================================================= */

modal.addEventListener("click", event => {

    if (
        event.target === modal
    ) {
        closeCalculator();
    }

});


/* =========================================================
   ESCAPE
   ========================================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("active")
    ) {
        closeCalculator();
    }

});


/* =========================================================
   SEARCH + CATEGORY FILTER
   ========================================================= */

function filterCalculators() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    let visibleCount = 0;


    calculatorCards.forEach(card => {

        const category =
            card.dataset.category;

        const searchableText =
            card.textContent.toLowerCase();


        const categoryMatches =
            currentCategory === "all" ||
            category === currentCategory;


        const searchMatches =
            searchTerm === "" ||
            searchableText.includes(searchTerm);


        const visible =
            categoryMatches &&
            searchMatches;


        card.hidden = !visible;


        if (visible) {
            visibleCount++;
        }

    });


    calculatorGroups.forEach(group => {

        const visibleCards =
            group.querySelectorAll(
                ".calculator-card:not([hidden])"
            );


        group.hidden =
            visibleCards.length === 0;

    });


    noResults.hidden =
        visibleCount !== 0;

}


/* =========================================================
   SEARCH EVENT
   ========================================================= */

searchInput.addEventListener(
    "input",
    filterCalculators
);


/* =========================================================
   CATEGORY EVENTS
   ========================================================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        currentCategory =
            button.dataset.category;


        filterCalculators();

    });

});


/* =========================================================
   NUMBER FORMATTER
   ========================================================= */

function formatNumber(value) {

    if (!Number.isFinite(value)) {
        return "—";
    }


    return new Intl.NumberFormat(
        "bg-BG",
        {
            maximumFractionDigits: 6
        }
    ).format(value);

}