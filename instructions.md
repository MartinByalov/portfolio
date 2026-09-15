# МЕТОДИЧЕСКИ ИНСТРУКЦИИ ЗА СЪЗДАВАНЕ НА УРОЦИ ПО ИНФОРМАЦИОННИ ТЕХНОЛОГИИ (8. КЛАС)

## Единна инструкция за lesson creation, pedagogical architecture, interactions, components и visual grammar

Този файл е **нормативният source of truth** за начина, по който се проектират и имплементират уроците в платформата.

Той определя:

- педагогическата философия;
- процеса за анализ на учебното съдържание;
- процеса за избор на **архитектура на целия урок**;
- начина за използване на `interactions.json`;
- постоянната визуална граматика;
- правилата за accordion, sidebar, tags, cards, modals, feedback и assessment;
- начина за избор, повторна употреба, разширяване и създаване на components;
- правилата за изображения, resource files и lesson JSON;
- критериите за умерен обем, оригиналност и качество.

`interactions.json` е **библиотека от възможности и идеи**.

`/components/` и component registry са **техническият source of truth за вече реализираните components**.

Трите източника имат различна функция:

> **`instructions.md` = как мислим и какви правила спазваме**  
> **`interactions.json` = от какви interaction possibilities можем да черпим идеи**  
> **component registry / `/components/` = какво вече е реализирано технически**

---

# 0. НАЙ-ВАЖНОТО РАЗГРАНИЧЕНИЕ

## DESIGN SYSTEM ≠ LESSON TEMPLATE

Платформата има **единна и задължителна визуална граматика**, но **няма единна педагогическа архитектура на урока**.

### ЗАДЪЛЖИТЕЛНО СЕ ЗАПАЗВАТ

- общият page layout;
- accordion като основен page container;
- визуалният стил на accordion елементите;
- типографията;
- spacing;
- border radius;
- controls и feedback states;
- standard tag semantics;
- цветовете и иконите на established tags;
- `callout-highlight-box`;
- `text` tone cards с цветна лява граница;
- sidebar логиката;
- modal поведението;
- responsive conventions;
- accessibility conventions;
- JSON и component conventions.

### НЕ СЕ СТАНДАРТИЗИРАТ

- педагогическият прочит;
- начинът, по който започва урокът;
- организиращата идея на урока;
- броят и логиката на основните части;
- редът, в който се появяват теория, практика и обратна връзка;
- позицията на `Упражнение`, `Задача`, `Дискусия`, `Sandbox`, assessment или reflection;
- interaction mechanics;
- начинът на представяне на информацията;
- начинът, по който ученикът достига до понятие или извод;
- начинът на проверка;
- финалът;
- комбинацията от съществуващи и нови components.

> **Reuse the visual language. Do not reuse the pedagogical sentence.**

> **Reuse the building blocks. Do not reuse the building plan.**

> **ONE DESIGN SYSTEM. MANY LEARNING EXPERIENCES. NO LESSON TEMPLATE.**

---

# 1. РОЛЯ НА АГЕНТА

Агентът е **главен методист, instructional designer и педагогически архитект**, а не JSON генератор и не редактор на електронен учебник.

Неговата задача е да превърне задължителното учебно съдържание в **самостоятелна педагогическа и методическа единица, проектирана за дигитална среда**.

Урокът трябва едновременно:

- да покрива учебната програма;
- да бъде научно и технически коректен;
- да е подходящ за възрастта;
- да изгражда разбиране;
- да поддържа любопитство и внимание;
- да кара ученика да извършва смислени действия;
- да превръща знания в умения;
- да предоставя полезна обратна връзка;
- да използва дигиталната среда там, където тя добавя стойност;
- да изглежда като част от същата платформа;
- да бъде **умерен като обем и плътност**.

---

# 2. НЕ ДИГИТАЛИЗИРАМЕ УЧЕБНИК

Предоставените учебници, презентации, тетрадки и работни листове определят преди всичко:

> **КАКВО трябва да бъде усвоено.**

Те не определят автоматично:

> **КАК трябва да бъде усвоено в интерактивна дигитална среда.**

Не копирай механично:

- реда на учебника;
- реда на параграфите;
- заглавията на подточките;
- структурата `теория -> пример -> въпрос`;
- печатните упражнения едно към едно;
- текста на учебника като основно съдържание на страницата.

Разрешено и препоръчително е:

- понятията да бъдат пренареждани;
- свързани идеи да бъдат обединявани;
- понятие да бъде въведено след наблюдение или действие;
- статична схема да стане explorable model;
- описание да стане simulation;
- задача да стане реална работа с resource file;
- ученикът първо да прогнозира, а после да получи обяснение;
- едно действие да се използва за разкриване на няколко понятия;
- съдържание от различни абзаци да бъде интегрирано в една учебна ситуация.

Единственото твърдо условие е:

> **До края на урока задължителните знания, понятия, зависимости и умения трябва да са коректно покрити.**

---

# 3. НЕ ПРОЕКТИРАЙ СТРАНИЦА. ПРОЕКТИРАЙ УЧЕНЕ.

Преди да се мисли за раздели, components или `interactions.json`, изясни:

1. Какво трябва да разбере ученикът?
2. Какво трябва да запомни?
3. Какво трябва да може да направи?
4. Кои зависимости трябва да открие?
5. Кои типични заблуди са вероятни?
6. Какво може да бъде показано вместо обяснено?
7. Какво може да бъде открито вместо съобщено?
8. Какво може да бъде манипулирано вместо само наблюдавано?
9. Какво може да бъде приложено веднага?
10. Какво реално действие, проблем, процес или система може да придаде смисъл на знанието?
11. Как ще разберем, че ученикът действително е разбрал, а не само е прочел?

---

# 4. ЗАДЪЛЖИТЕЛЕН ЕТАП: ARCHITECTURE EXPLORATION

## 4.1. НЕ ПРОЕКТИРАЙ УРОКА ОЩЕ

След анализа на съдържанието **не преминавай директно към accordion sections, activities или components**.

Преди това генерирай **4 до 6 фундаментално различни педагогически архитектури** за целия урок.

Те трябва да се различават по **организиращата логика на преживяването**, а не просто по component type.

Различна архитектура може да организира материала като например:

- изследване;
- постепенно разкриване;
- конструкция;
- reverse engineering;
- система;
- непрекъснат процес;
- реален workflow;
- comparison space;
- problem space;
- simulation;
- decision environment;
- transformation;
- case progression;
- experiment;
- evidence-based investigation;
- друга структура, която произтича естествено от темата.

Това са **семейства на мислене**, не списък със задължителни формати.

## 4.2. КАКВО НЕ СЕ БРОИ ЗА РАЗЛИЧНА АРХИТЕКТУРА

Следните варианти не са фундаментално различни:

- `Точка 1 + matching -> Точка 2 + timeline -> Точка 3 + quiz`;
- същите учебникови точки, но с различни интеракции;
- същата структура с друга визуална тема;
- `мисия`, която на практика остава поредица от теория и въпроси;
- различни имена на accordion sections без промяна в учебната логика;
- същият сценарий с подменени компоненти.

Ако всички предложени архитектури могат да бъдат описани като:

> `Introduction -> Topic 1 -> activity -> Topic 2 -> activity -> Topic 3 -> activity -> final quiz`

значи architecture exploration е неуспешен и трябва да бъде повторен.

## 4.3. ИЗБОР НА АРХИТЕКТУРА

За всяка кандидат-архитектура оцени кратко:

- защо пасва на конкретното съдържание;
- как ученикът се движи през знанието;
- кое се открива, а не просто се казва;
- къде се превръща знанието в действие;
- дали позволява всички задължителни цели да бъдат покрити;
- дали не прилича прекалено на вече разработен урок;
- дали може да бъде реализирана без излишно раздуване.

Избери **една** архитектура и едва след това продължи.

---

# 5. STRUCTURAL FINGERPRINT

След избора на архитектура, но преди components, формулирай **structural fingerprint** на урока в 1-3 изречения.

Fingerprint-ът трябва да описва **какво преживява ученикът**, не layout-а.

Добър fingerprint описва например:

- как ученикът постепенно разкрива система;
- как конструира нещо и чрез конструкцията открива понятия;
- как проследява един процес от начало до край;
- как сравнява различни решения чрез общ модел;
- как работи с доказателства и достига до извод;
- как преминава през реален workflow.

Слаб fingerprint:

> `Въведение -> 4 accordion точки -> Sandbox -> Дискусия -> Quiz -> Речник`

Слаб fingerprint показва, че урокът все още е проектиран като page template.

### Fingerprint test

Ако fingerprint-ът на новия урок може да се замени с fingerprint-а на предишен урок без съществена промяна, преосмисли архитектурата.

---

# 6. COVERAGE MAP ПРЕДИ IMPLEMENTATION

Създай вътрешна coverage map:

| Задължително знание / умение | Къде ученикът го среща | Как го използва | Как се проверява |
|---|---|---|---|

Coverage map не е lesson template.

Тя гарантира, че урокът няма да бъде:

- красив, но непълен;
- интерактивен, но повърхностен;
- пълен, но пасивен.

---

# 7. ОТ АРХИТЕКТУРА КЪМ LEARNING MOMENTS

Едва след избора на архитектура раздели преживяването на **learning moments**.

Learning moment е момент, в който ученикът трябва да:

- наблюдава;
- прогнозира;
- припомни;
- сравни;
- класифицира;
- свърже;
- подреди;
- изследва;
- открие;
- конструира;
- манипулира;
- тества;
- диагностицира;
- избере;
- обоснове;
- поправи;
- приложи;
- създаде;
- рефлектира;
- получи обяснение;
- види доказателство;
- прехвърли знание в нов контекст.

Не превръщай всяко понятие в отделен learning moment.

Един силен moment може да покрие няколко взаимно свързани понятия.

---

# 8. КОГА СЕ ОТВАРЯ `interactions.json`

## 8.1. НЕ ПРЕДИ АРХИТЕКТУРАТА

**Не използвай `interactions.json` за измисляне на архитектурата на урока.**

Причината е, че богатият каталог лесно закотвя агента към:

> `избирам interaction -> търся къде да го сложа`

Правилният ред е:

> **curriculum -> learning goals -> competing lesson architectures -> chosen architecture -> structural fingerprint -> learning moments -> `interactions.json` -> component resolution**

## 8.2. РОЛЯ НА `interactions.json`

`interactions.json` е **idea space**, не checklist и не списък с components.

За всеки learning moment използвай библиотеката, за да разгледаш различни начини за реализация.

Мисли по оси като:

- learning action;
- response mechanic;
- visual/media surface;
- framing;
- feedback;
- progression;
- social mode;
- artifact/output.

Една и съща учебна цел може да има десетки реализации.

Не избирай първия очевиден pattern.

Направи кратък shortlist на подходящите варианти и избери този, който:

- изисква правилното мисловно действие;
- е естествен за съдържанието;
- е достатъчно ясен;
- не дублира излишно друга дейност;
- не прави урока по-дълъг без стойност;
- добавя смислена дигитална възможност.

## 8.3. `interactions.json` НЕ Е КВОТА ЗА РАЗНООБРАЗИЕ

Не се стреми към:

- максимален брой mechanics;
- максимален брой components;
- interaction от всяко семейство;
- нарочно различен тип за всяка секция.

> **Разнообразието е средство. Не е KPI.**

`interactions.json` трябва да увеличава **качеството на избора**, не броя на activities.

---

# 9. TAG ≠ INTERACTION TYPE

Tags описват **педагогическата функция**, не вътрешната механика.

Например:

## `Упражнение`

Може да бъде:

- кратка интерактивна практика;
- работа в реално приложение;
- starter file;
- broken file;
- partially completed file;
- resource pack;
- screenshot task;
- guided procedure;
- simulation;
- practical challenge;
- друг подходящ формат от `interactions.json`.

## `Задача`

Може да бъде:

- самостоятелно решение;
- продукт;
- mini-project;
- configuration;
- comparison;
- analysis;
- generated artifact;
- practical file work;
- transfer task.

## `Дискусия`

Може да бъде:

- казус;
- позиция;
- ranking;
- debate;
- evidence comparison;
- poll -> discuss -> poll again;
- critique of two solutions;
- избор с аргументация.

## `Sandbox`

Може да бъде:

- свободно експериментиране;
- simulation;
- virtual lab;
- safe terminal;
- file-system environment;
- query laboratory;
- process/memory model;
- permissions lab;
- network model;
- configuration environment;
- друг manipulable system.

Tag-ът **не предписва** interaction mechanics.

---

# 10. ANTI-APPENDIX RULE

Не третирай:

- `Упражнение`;
- `Задача`;
- `Дискусия`;
- `Sandbox`;
- quiz;
- reflection;
- checklist;
- assessment;

като автоматични приложения след „основната теория“.

Постави ги **точно там, където ученикът има нужда от съответното действие**.

Следствия:

- `Дискусия` може да отвори урока;
- `Sandbox` може да бъде основната среда на целия урок;
- `Упражнение` може да генерира знанието, вместо да го следва;
- assessment може да е вграден в хода на урока;
- теория може да се появи след действие;
- lesson може да завърши без quiz;
- lesson може да завърши без glossary;
- lesson може да завърши без reflection;
- няма задължителен footer от activity blocks.

Ако структурата изглежда като:

> `main lesson -> sandbox -> discussion -> test -> glossary`

провери дали тези елементи действително принадлежат там или са добавени по навик.

---

# 11. COMPONENT-LAST DESIGN

След като interaction model е избран, провери component registry и `/components/`.

Редът е:

> **Pedagogical need -> Learning moment -> Interaction model -> Existing component -> Adapt / compose -> New component**

Не започвай от component registry.

Не мисли:

> `Имаме matching. Къде да сложа matching?`

Мисли:

> `Какво трябва да направи ученикът и какъв interface най-добре поддържа това действие?`

Съществуващ component може да бъде:

- използван директно;
- конфигуриран по нов начин;
- комбиниран;
- разширен;
- използван в нов контекст.

Ако не пасва, създай нов component.

> **Никога не изкривявай педагогиката, за да пасне на наличния component.**

---

# 12. COMPONENT REGISTRY НЕ Е PEDAGOGICAL INSPIRATION LIST

Не изброявай subject-specific components в lesson plan преди архитектурата да е избрана.

Не използвай component names като заместител на instructional design.

Файловете в `/components/` и registry са технически reference след избора на interaction model.

Това предотвратява anchoring към вече разработени уроци.

---

# 13. PEDAGOGICAL FUNCTIONS, НЕ СЕКЦИИ

В един урок може да има функции като:

> curiosity -> observation -> discovery -> explanation -> experimentation -> application -> feedback -> transfer

Това **не е задължителна последователност**.

Функциите могат:

- да се преплитат;
- да се повтарят;
- да липсват;
- да се реализират едновременно;
- да бъдат организирани по напълно различен начин.

Не създавай accordion item само за да „отметнеш“ педагогически етап.

---

# 14. ИНТЕРАКТИВНОСТТА ТРЯБВА ДА ИЗИСКВА МИСЛЕНЕ

Кликването само по себе си не е педагогическа интеракция.

Не е достатъчно ученикът просто да:

- отваря cards;
- сменя tabs;
- натиска hotspot;
- разгъва accordion;
- натиска `Следващ`;
- разкрива предварително написан текст.

Смислената интеракция изисква поне едно от следните:

- решение;
- предположение;
- прогнозиране;
- сравнение;
- класифициране;
- откриване на зависимост;
- изграждане;
- диагностика;
- анализ на грешка;
- приложение на правило;
- проверка на хипотеза;
- създаване на продукт;
- аргументация.

Винаги питай:

> **Какво мисли ученикът, докато взаимодейства?**

---

# 15. НЕ ВСИЧКО ТРЯБВА ДА Е ИНТЕРАКТИВНО

Понякога най-силният формат е:

- една фотография;
- кратък текст;
- screenshot;
- диаграма;
- таблица;
- infographic;
- animation;
- video;
- пример;
- кратко сравнение.

Използвай **най-простия формат, който постига желаното разбиране**.

Не добавяй interaction, ако той само увеличава friction.

---

# 16. RESOURCE FILES СА ЧАСТ ОТ PEDAGOGICAL DESIGN

Агентът може и трябва да създава resource files, когато това превръща задачата в реална практика.

Възможни ресурси:

- DOCX;
- XLSX;
- PPTX;
- CSV;
- TXT;
- ZIP;
- изображения;
- screenshots;
- starter project files;
- broken files;
- partially completed files;
- two-version comparison files;
- data packs;
- folder structures;
- templates.

Примерна логика:

> Вместо ученикът да чете как се организират файлове, може да получи ZIP с разбъркани файлове и реално да изгради структура.

> Вместо да чете за spreadsheet formulas, може да получи XLSX с данни и липсващи формули.

Resource file не е decoration. Той е учебна среда или изходен материал.

---

# 17. ASSESSMENT Е ДОКАЗАТЕЛСТВО, НЕ РИТУАЛ

Assessment трябва да измерва учебната цел.

Той може да бъде:

- quiz;
- typed response;
- cloze;
- matching;
- sorting;
- sequencing;
- hotspot;
- diagnosis;
- debugging;
- scenario decision;
- configuration task;
- practical file;
- mini-project;
- simulation challenge;
- explanation;
- comparison;
- transfer task;
- exit ticket;
- reflection;
- комбинация от подходящи mechanics.

## 17.1. „Бързи 5 въпроса“

`Бързи 5 въпроса` е **наличен assessment label/pattern**, не задължителен финал.

Ако се използва, той означава **пет кратки assessment items**, а не непременно пет multiple-choice въпроса.

Възможно е да съдържа комбинация от:

- single choice;
- multiple choice;
- true/false;
- fill blank;
- drag word;
- short answer;
- image choice;
- hotspot;
- matching;
- ordering;
- answer + reason;
- correction of misconception;
- друг кратък pattern от `interactions.json`.

Не смесвай mechanics само за показност.

Избери форма според това, което се проверява.

---

# 18. УМЕРЕН ОБЕМ И ПЛЪТНОСТ

Урокът трябва да бъде:

> **нито твърде кратък и схематичен, нито твърде дълъг и раздут.**

Няма фиксирана квота за:

- думи;
- accordion items;
- interactions;
- изображения;
- activities;
- assessment items.

Темата определя нужната дължина.

## 18.1. УРОКЪТ Е ТВЪРДЕ КРАТЪК, АКО

- прилича на резюме;
- дава само определения;
- важни зависимости са само споменати;
- няма достатъчно практика;
- ученикът няма шанс да приложи основните умения;
- assessment проверява повече от това, което урокът реално е изградил;
- важен процес е сведен до едно изречение без достатъчно опора.

## 18.2. УРОКЪТ Е ТВЪРДЕ РАЗДУТ, АКО

- една идея се обяснява многократно;
- всяко понятие получава собствен component;
- има activity след activity без време за осмисляне;
- различни interactions проверяват едно и също;
- добавени са interactions само за variety;
- всяка секция има задължително text + activity;
- gamification не носи нова учебна стойност;
- материалът може да бъде съкратен без загуба на разбиране или умение.

## 18.3. STOP RULE

Спри да добавяш съдържание, когато:

- coverage map е покрит;
- основните зависимости са ясни;
- ключовите умения са упражнени;
- има достатъчно evidence за разбиране;
- има transfer или application, когато темата го позволява;
- следващият елемент би повторил вече изпълнена педагогическа функция.

> **`interactions.json` увеличава качеството на избора, не количеството на урока.**

---

# 19. РИТЪМ НА УРОКА

Урокът може да сменя режими:

- наблюдение;
- четене;
- взаимодействие;
- мислене;
- практическо действие;
- feedback;
- synthesis.

Не ги превръщай в sequence template.

Целта е да няма прекалено дълги пасивни участъци или прекомерно постоянно interaction switching.

---

# 20. PLATFORM VISUAL GRAMMAR - ЗАДЪЛЖИТЕЛНА

Тази секция е **нормативна**.

Педагогическата свобода не дава право да се измисля нов visual language във всеки урок.

---

# 21. ОСНОВЕН PAGE LAYOUT

По подразбиране lesson JSON използва:

```json
"layout": {
  "type": "lesson",
  "contentWidth": "wide",
  "planType": "accordion",
  "accordion": {
    "itemsAlign": "stretch",
    "titleAlign": "left",
    "contentInsideItem": true,
    "singleOpen": false
  }
}
```

Това е standard page grammar.

---

# 22. ACCORDION Е STRUCTURAL CONTAINER, НЕ УЧЕБНИКОВА ТОЧКА

Accordion е основният визуален гръбнак на страницата.

Но:

> **Accordion ≠ textbook chapter**

Accordion item може да съдържа:

- narrative;
- visual;
- interaction;
- simulation;
- practical activity;
- feedback;
- comparison;
- synthesis;
- resource work;
- няколко свързани learning moments.

Заглавието трябва да обозначава **смислена част от избраната педагогическа архитектура**.

Не създавай accordion item само защото учебникът има отделен подзаглавен абзац.

### Standard container

```json
{
  "type": "accordion",
  "id": "lesson-main",
  "options": {
    "itemsAlign": "stretch",
    "titleAlign": "left",
    "singleOpen": false
  },
  "items": []
}
```

При нужда може да се използва:

```json
"startClosed": true
```

### Accordion title standard

Основните заглавия са:

- чисти;
- без decorative kicker;
- без badge над заглавието;
- без grip handle;
- без излишна декоративна икона;
- без tone само за украса.

Номерацията е допустима, ако действително помага за ориентация. Не е задължителна.

---

# 23. STANDARD TAG SYSTEM

Tags са **семантични action labels**, не decorative badges.

| Етикет | variant | tone | icon | Функция |
|---|---|---|---|---|
| **Упражнение** | `exercise` | `green` | `fas fa-dumbbell` | Практическо изпълнение |
| **Задача** | `task` | `blue` | `fas fa-list-check` | Самостоятелна или учебна задача |
| **Дискусия** | `discussion` | `purple` | `fas fa-comments` | Аргументация, казус, обсъждане |
| **Чек-лист преди предаване** | `checklist` | `orange` | `fas fa-list-check` | Самопроверка |
| **Рефлексия** | `reflection` | `purple` | `fas fa-paw` | Осмисляне и самооценка |
| **Речник** | `glossary` | `dark` | `fas fa-book-bookmark` | Терминология |
| **Пробно Входно ниво** | `trial-quiz` | `green` | `fas fa-clipboard-question` | Диагностична тестова проверка |

### Standard colors

- `green`: text `#1c7a3d`, background `#e6f6ec`, border `#bfe6cc`
- `blue`: text `#1e3a8a`, background `#e8f1fd`, border `#c4dbf7`
- `orange`: text `#c2410c`, background `#fdeadd`, border `#f6c9a8`
- `purple`: text `#4c1d95`, background `#f1e8fa`, border `#d6bdf0`
- `dark`: text `#1d1b31`, background `#eef0f6`, border `#d5d9e5`

### Exercise tag

```json
{
  "type": "tag",
  "id": "exercise-tag",
  "icon": "fas fa-dumbbell",
  "text": "Упражнение",
  "modalTarget": "exerciseModal",
  "tone": "green",
  "variant": "exercise",
  "skipNav": true
}
```

### Task tag

```json
{
  "type": "tag",
  "id": "task-tag",
  "icon": "fas fa-list-check",
  "text": "Задача",
  "modalTarget": "taskModal",
  "tone": "blue",
  "variant": "task",
  "skipNav": true
}
```

### Discussion tag

```json
{
  "type": "tag",
  "id": "discussion-tag",
  "icon": "fas fa-comments",
  "text": "Дискусия",
  "modalTarget": "discussionModal",
  "tone": "purple",
  "variant": "discussion",
  "skipNav": true
}
```

---

# 24. SANDBOX TAG

`Sandbox` е установена педагогическа функция за експериментиране.

При използване на отделен tag:

- text: `Sandbox`
- variant: `sandbox`
- tone: `accent`
- icon: `fas fa-flask`

Той трябва да следва общата tag grammar и да бъде дефиниран в `styles/tag-standards.json`.

---

# 25. НОВИ TAGS

Нов tag се създава само ако има **нова устойчива педагогическа функция**, която не се покрива от съществуващите.

Нов tag трябва да има:

- ясно име;
- ясна семантика;
- постоянен `variant`;
- постоянен `tone`;
- постоянна icon;
- запис в `styles/tag-standards.json`;
- съвместим CSS.

Не измисляй еднократни decorative tags за variety.

---

# 26. STANDARD CONTENT PRIMITIVES

## 26.1. Обикновен text block

```json
{
  "type": "text",
  "id": "text-block-id",
  "content": "..."
}
```

Използва се за основния narrative и обяснителен текст.

## 26.2. Accent text card с цветна лява граница

Използва се `type: "text"` с `tone`.

### Orange

```json
{
  "type": "text",
  "id": "concept-card-orange",
  "tone": "orange",
  "content": "**Ключова идея:** ..."
}
```

Visual standard:

- светъл фон;
- `border-left: 4px solid #f97316`;
- radius `8px`.

### Blue

```json
{
  "type": "text",
  "id": "concept-card-blue",
  "tone": "blue",
  "content": "**Запомнете:** ..."
}
```

Visual standard:

- светъл фон;
- `border-left: 4px solid #2563eb`;
- radius `8px`.

### Purple

```json
{
  "type": "text",
  "id": "concept-card-purple",
  "tone": "purple",
  "content": "**Помислете:** ..."
}
```

Visual standard:

- светъл лилав фон;
- `border-left: 4px solid #8b5cf6`;
- radius `8px`.

### Tone card rule

Tone card е семантичен акцент.

Използвай го за:

- ключова идея;
- принцип;
- кратко предупреждение;
- наблюдение;
- съществен извод;
- концептуална рамка.

Не превръщай всеки text block в tone card.

## 26.3. Important card

Използва се:

`callout-highlight-box`

```html
<div class="callout-highlight-box">
  <i class="fas fa-triangle-exclamation"></i>
  <div><strong>Важно:</strong> Текст...</div>
</div>
```

Standard:

- светъл amber background;
- border;
- 4px amber left border;
- radius `8px`;
- icon вляво;
- dark-mode variant.

Използвай само за действително важна информация.

## 26.4. Light bordered card

Established primitive:

`.lb-light-border`

Standard:

- `1px` neutral border;
- `12px` radius;
- white surface;
- padding.

Не го използвай декоративно.

---

# 27. SIDEBAR - ЗЛАТНО ПРАВИЛО

Sidebar показва **само основната учебна навигация**.

## В sidebar влизат

1. Основните accordion parts на педагогическата архитектура.
2. `Речник`, ако съществува и е самостоятелна основна точка.

## В sidebar НЕ влизат по подразбиране

- `tag`;
- `exercise-modal`;
- quiz;
- checkpoint;
- simulator;
- sandbox;
- visualization;
- diagram;
- checklist;
- practical task;
- local discussion;
- локална activity.

Използвай `skipNav: true`, когато renderer/navigation logic го изисква.

---

# 28. MODALS

## 28.1. `exercise-modal`

Използва се, когато дейността има нужда от:

- по-подробни инструкции;
- външен файл;
- downloadable resource;
- resource links;
- workflow, който не е добре да стои целият в основната страница.

```json
{
  "type": "exercise-modal",
  "id": "exerciseModal",
  "title": "Конкретно заглавие",
  "skipNav": true,
  "instructions": "<div class='exercise-instructions'><p class='exercise-text'>Инструкции...</p></div>",
  "resources": []
}
```

### Formatting rules

- Заглавието е конкретно.
- Инструкциите са изпълними.
- Използвай списък при последователни стъпки.
- При `*` в HTML/Markdown контекст използвай `&#42;`, ако има риск от italic parsing.
- File patterns използват `<code>`.
- UI transitions могат да използват `&rarr;`.

Пример:

```html
<code>&#42;.pptx</code>
<code>&#42;проект&#42;.docx</code>
<code>тест?.docx</code>
```

## 28.2. Resources

```json
"resources": [
  {
    "icon": "fa-solid fa-folder-open",
    "label": "име_на_ресурса",
    "href": "https://..."
  }
]
```

Ако няма:

```json
"resources": []
```

## 28.3. Discussion modal

Discussion prompt трябва да изисква:

- аргументация;
- сравнение;
- оценка;
- избор;
- защита на позиция;
- работа с evidence.

Не използвай `Дискусия` за очевиден еднозначен factual question.

---

# 29. BUTTONS И FEEDBACK

Използвай кратки action labels:

- `Провери`
- `Нов опит`
- `Нулирай`, когато действието е реален reset

При scored activity резултатът по подразбиране е:

`Резултат X от Y`

Feedback трябва да **учи**.

Не се ограничавай до:

- `Правилно`;
- `Грешно`.

Когато е полезно, обясни:

- защо отговорът работи;
- кое правило е приложено;
- каква е заблудата;
- какво следствие има изборът;
- какво да провери ученикът при нов опит.

Избягвай празни похвали като:

- `Отлично!`;
- `Страхотна работа!`;

освен ако тонът действително го изисква.

---

# 30. GLOSSARY

Glossary се включва **само когато има реална нужда** ученикът да се връща към нова терминология.

Не е задължителен за всеки урок.

```json
{
  "type": "accordion",
  "id": "lesson-glossary",
  "options": {
    "itemsAlign": "stretch",
    "titleAlign": "left",
    "singleOpen": false,
    "startClosed": true
  },
  "items": [
    {
      "id": "section-glossary",
      "title": "Речник",
      "tone": "dark",
      "icon": "fas fa-book-bookmark",
      "content": [
        {
          "type": "glossary-list",
          "id": "glossary-it8-X",
          "items": []
        }
      ]
    }
  ]
}
```

Включвай само действително значими термини.

---

# 31. VISUALIZATION И MULTIMEDIA

Изображенията и визуализациите не са decoration.

Всяко значимо visual трябва да има функция:

- evidence;
- context;
- comparison;
- structure;
- process;
- scale;
- historical context;
- spatial understanding;
- interface recognition;
- change over time;
- data interpretation.

Преди дълъг текст попитай:

- Може ли това да бъде показано?
- Може ли да бъде сравнено?
- Може ли процесът да бъде анимиран?
- Може ли ученикът да манипулира параметър?
- Може ли да прогнозира преди reveal?
- Може ли screenshot да бъде по-автентичен от илюстрация?

Ако кратък текст е най-добрият носител - използвай кратък текст.

За конкретни visualization ideas консултирай `interactions.json` **след architecture selection**.

---

# 32. ГРАФИКИ И ДАННИ

Избирай графика според въпроса:

- bar chart - сравнение на категории;
- line chart - промяна по подредена ос;
- scatter plot - връзка между числови величини;
- histogram / box plot - разпределение;
- table - когато точните стойности са по-важни;
- matrix / heatmap - две измерения при ясна легенда;
- stacked bar - части от цяло, когато е подходящо.

Не използвай:

- 3D decoration;
- rainbow palette без семантика;
- misleading truncated axes;
- dual axes без реална необходимост;
- прекалено много серии.

Сложна диаграма трябва да има и текстово обяснение.

---

# 33. IMAGE PATHS И PLACEHOLDERS

В lesson JSON използвай кратък относителен path:

```json
"src": "it-8-7/relay-computer.png"
```

или:

```json
"image": "it-8-7/integrated-circuit.png"
```

Не записвай:

```text
[IMAGE_PLACEHOLDER: ...]
```

в `src`.

Ако файлът липсва, renderer pipeline показва placeholder.

## Media repository

Repository:

`https://github.com/MartinByalov/it-media-assets`

Directory:

`assets/<lesson-id>/`

CDN base:

`https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/`

В lesson JSON се записва краткият path без `assets/`.

## Lesson plan requirement за бъдещ asset

Опиши:

1. точен filename;
2. тип - screenshot, photograph, diagram, chart, illustration, generated visual;
3. композиция;
4. видими елементи;
5. педагогическа функция;
6. `alt`;
7. версия на интерфейса при screenshot;
8. fallback/upload instruction.

---

# 34. ACCESSIBILITY

За информативно изображение `alt` предава смисъла.

За декоративно изображение използвай празен alt.

За сложна графика или diagram информацията трябва да съществува и текстово.

Interactive component трябва, когато е приложимо:

- да работи с keyboard;
- да има видим focus;
- да не разчита само на color;
- да има ясни labels;
- да има достатъчен contrast;
- да предлага alternative input при drag-only interaction, когато е разумно.

---

# 35. ПРАВИЛА ЗА НОВ COMPONENT

Нов component се създава, когато:

- решава реална педагогическа нужда;
- съществуващите components не я покриват добре;
- адаптацията би довела до неестествен UX;
- interaction logic е достатъчно специфична или повторно използваема.

Нов component трябва:

- да следва visual language;
- да използва established spacing/radius/control patterns;
- да има ясно initial state;
- да има ясни actions;
- да има meaningful feedback;
- да е responsive;
- да бъде keyboard-usable, когато е приложимо;
- да не разчита само на color;
- да бъде регистриран;
- да има уникален `id`;
- да не въвежда нов design system.

---

# 36. LESSON JSON - МИНИМАЛЕН ДОГОВОР

Това е **технически договор, не lesson template**.

```json
{
  "id": "it-8-X",
  "title": "Урок 2.X: Заглавие",
  "grade": 8,
  "subject": "Информационни технологии",
  "goal": "Конкретна образователна цел, формулирана като резултат от обучението.",
  "layout": {
    "type": "lesson",
    "contentWidth": "wide",
    "planType": "accordion",
    "accordion": {
      "itemsAlign": "stretch",
      "titleAlign": "left",
      "contentInsideItem": true,
      "singleOpen": false
    }
  },
  "components": []
}
```

---

# 37. ПИСАНЕ НА ТЕКСТА

Не поставяй учебникова проза директно в lesson JSON.

Пиши за дигитално учене.

Предпочитай:

- кратки абзаци;
- ясни transitions;
- конкретни examples;
- context before definition;
- progressive disclosure;
- terminology след разбиране, когато е разумно;
- визуална подкрепа;
- език за 8. клас.

Избягвай:

- енциклопедични пасажи;
- walls of text;
- многократно повторение;
- дефиниции без context;
- сухо изброяване, когато структурата може да се покаже по-добре.

---

# 38. TRANSFORM KNOWLEDGE INTO SKILLS

За всяко важно понятие питай:

> **Какво би могъл да направи ученикът, ако наистина го разбира?**

Не е достатъчно да може само да:

- повтори определение;
- избере термин;
- разпознае дума.

Когато темата позволява, ученикът трябва да може да:

- избере;
- сравни;
- приложи;
- диагностицира;
- конфигурира;
- създаде;
- провери;
- оцени;
- обоснове;
- прехвърли знанието в нов контекст.

---

# 39. TEXTBOOK TRANSFORMATION TEST

За всяка голяма част попитай:

> **Може ли тази част почти без промяна да бъде отпечатана като страница в традиционен учебник?**

Ако да, провери дали дигиталната среда може да я подобри чрез:

- визуализация;
- exploration;
- manipulation;
- prediction;
- simulation;
- comparison;
- diagnosis;
- construction;
- immediate feedback;
- real resource file;
- authentic workflow.

Не всяка секция трябва да стане интерактивна.

Целта е да се предотврати **несъзнателна дигитализация на учебник**.

---

# 40. REPETITION TEST

Преди финализиране сравни новия lesson architecture с вече съществуващите.

Попитай:

> **Този урок изглежда ли така, защото темата го изисква, или защото вече сме правили урок така?**

Провери отделно:

- structural fingerprint;
- intro pattern;
- accordion logic;
- position of activities;
- signature interaction;
- assessment pattern;
- ending.

Техническата повторна употреба е добра.

Педагогическото клониране без причина не е.

---

# 41. WHY THIS WAY? TEST

За всяка значима част трябва да можеш да отговориш:

> **Защо това е добър начин да се научи точно тази идея?**

Слаби аргументи:

- `Компонентът вече съществува.`
- `Има го в interactions.json.`
- `Предишният урок използва нещо подобно.`
- `Прави страницата по-интерактивна.`

Силен аргумент описва:

- какво мисловно действие се изисква;
- защо избраната representation помага;
- как feedback подпомага разбирането;
- защо това е по-силно от по-проста алтернатива.

---

# 42. LESSON PLAN - PEDAGOGICAL SOURCE OF TRUTH

За всеки нов или съществено преработен урок се създава plan в:

`/lessons/lessons-plans/<course-id>/<course-id>-<заглавие>.md`

Plan-ът е педагогическият source of truth.

JSON е implementation.

## Plan трябва да съдържа

### A. Материали и coverage

- входни материали;
- задължителни знания;
- понятия;
- зависимости;
- процедури;
- умения;
- misconceptions;
- coverage map.

### B. Architecture exploration

Опиши 4-6 кандидат-архитектури, всяка в няколко изречения.

### C. Chosen architecture

Запиши:

- защо е избрана;
- защо останалите са по-слаби;
- structural fingerprint;
- как материалът се движи през урока.

### D. Learning moments

За всеки важен moment:

- какво трябва да направи ученикът;
- какво трябва да разбере;
- какво evidence за learning очакваме.

### E. Interaction ideation

Едва тук консултирай `interactions.json`.

Запиши само shortlisted patterns, които реално са разгледани за конкретните moments.

### F. Component resolution

За всеки избран interaction:

- existing component;
- adaptation;
- composition;
- new component.

### G. Media/resources

- images;
- diagrams;
- screenshots;
- generated assets;
- resource files.

### H. Assessment / transfer

- как се доказва learning;
- има ли нужда от final assessment;
- има ли transfer task.

### I. Moderation check

- какво е премахнато като излишно;
- защо lesson length е достатъчен;
- какво би било прекалено много.

---

# 43. РАБОТЕН ПОТОК - ЗАДЪЛЖИТЕЛЕН РЕД

## СТЪПКА 1 - Анализирай материалите

Извлечи:

- facts;
- concepts;
- relationships;
- procedures;
- skills;
- misconceptions.

## СТЪПКА 2 - Създай coverage map

Не избирай components.

## СТЪПКА 3 - Генерирай 4-6 competing lesson architectures

Не отваряй `interactions.json`.

Не гледай subject-specific component names.

## СТЪПКА 4 - Избери архитектура

Формулирай rationale.

## СТЪПКА 5 - Напиши structural fingerprint

Ако звучи като page layout, върни се назад.

## СТЪПКА 6 - Определи learning moments

Определи какво прави и мисли ученикът.

## СТЪПКА 7 - Консултирай `interactions.json`

Търси варианти за конкретните moments.

## СТЪПКА 8 - Избери interaction model

Не избирай механика само за novelty.

## СТЪПКА 9 - Провери component registry

Reuse / adapt / compose / build new.

## СТЪПКА 10 - Проектирайте media и resource files

Където са нужни.

## СТЪПКА 11 - Провери assessment и transfer

Не добавяй final quiz автоматично.

## СТЪПКА 12 - Moderation pass

Премахни излишното.

## СТЪПКА 13 - JSON implementation

Имплементирай според visual grammar.

## СТЪПКА 14 - Technical validation

Валидирай и тествай.

---

# 44. TECHNICAL RULES

## 44.1. IDs

Всеки component има уникален и стабилен `id`.

## 44.2. `skipNav`

Local activities, tags, modals, quizzes и secondary blocks използват `skipNav: true`, когато renderer/navigation logic го изисква.

## 44.3. Unicode em dash

Не използвай Unicode em dash (`U+2014`).

Използвай normal hyphen (`-`).

## 44.4. JSON validation

След промяна провери:

- JSON syntax;
- unique ids;
- modalTarget references;
- asset paths;
- component types;
- route loading.

## 44.5. Lint / compile

Когато tooling го предоставя, изпълни актуалните lint / compile commands, докато няма грешки.

---

# 45. QUALITY CHECKLIST

## Curriculum

- [ ] Покрити са всички задължителни знания.
- [ ] Покрити са всички изисквани умения.
- [ ] Терминологията е коректна.
- [ ] Не е пропуснат съществен материал.
- [ ] Coverage map е изпълнен.

## Architecture

- [ ] Преди design са разгледани 4-6 фундаментално различни architectures.
- [ ] Architecture е избрана преди `interactions.json`.
- [ ] Structural fingerprint описва learning experience, не page layout.
- [ ] Architecture произтича от темата.
- [ ] Урокът не е копие на предишен structural fingerprint.
- [ ] Основните accordion items следват architecture, не учебниковите подточки.

## Learning

- [ ] Ученикът прави повече от четене.
- [ ] Основните знания се използват.
- [ ] Interaction изисква мислене.
- [ ] Feedback учи.
- [ ] Assessment измерва целта.
- [ ] Има transfer, когато темата го позволява.

## Interaction selection

- [ ] `interactions.json` е използван след architecture selection.
- [ ] Не е използван като checklist.
- [ ] Не са добавени interactions само за variety.
- [ ] Не е избран component само защото вече съществува.
- [ ] Няма ненужно повторение на една механика или педагогическа функция.

## Anti-template

- [ ] Няма автоматичен sequence `theory -> activity -> theory -> activity`.
- [ ] Няма автоматичен footer `Sandbox -> Discussion -> Quiz -> Glossary`.
- [ ] Tags са поставени там, където функцията им е нужна.
- [ ] Lesson ending е избран според architecture, не по навик.
- [ ] Glossary съществува само при реална нужда.
- [ ] Final quiz съществува само при реална нужда.

## Moderation

- [ ] Урокът не е твърде кратък.
- [ ] Урокът не е раздут.
- [ ] Няма duplicate explanations.
- [ ] Няма activity overload.
- [ ] Stop rule е приложен.
- [ ] Следващият възможен element не би добавил достатъчно нова learning value.

## Visual grammar

- [ ] Accordion styling е запазен.
- [ ] Main headings са чисти.
- [ ] Standard tags използват правилните tone/icon/variant.
- [ ] `callout-highlight-box` се използва консистентно.
- [ ] Tone cards следват established styling.
- [ ] Sidebar съдържа само main navigation.
- [ ] Modals и feedback следват platform patterns.

## Media/resources

- [ ] Visuals имат педагогическа функция.
- [ ] Asset paths са кратки и коректни.
- [ ] Missing assets са описани в lesson plan.
- [ ] Resource files са генерирани, когато реалната практика го изисква.
- [ ] Alt/accessibility е коректна.

## Technical

- [ ] JSON е валиден.
- [ ] IDs са unique.
- [ ] Component types са registered.
- [ ] Modal targets съществуват.
- [ ] Lesson route се зарежда.
- [ ] Няма console errors.

---

# 46. FINAL DESIGN TEST

Преди завършване задай следните въпроси.

## 1. Curriculum independence

> **Ако учебникът изчезне и ученикът има само този урок, ще разбере ли задължителното съдържание и ще може ли да го използва?**

Желан отговор: **ДА**.

## 2. Digital value

> **Ако урокът бъде разпечатан, ще се загуби ли смислена част от learning experience?**

При тема, която позволява interaction, желан отговор: **ДА**.

## 3. Architecture originality

> **Може ли структурата на този урок да бъде прехвърлена почти без промяна върху предишния урок?**

Желан отговор: **НЕ**, освен ако темите действително изискват сходна architecture.

## 4. Moderation

> **Ако премахна още един значим learning moment, ще загубя ли разбиране/умение? Ако добавя още един, ще повторя ли вече покрита функция?**

Търси точката между двете.

---

# 47. КРАТКА ИНСТРУКЦИЯ КЪМ АГЕНТА

Когато създаваш нов урок:

1. Прочети материалите.
2. Извлечи задължителното знание и умения.
3. Създай coverage map.
4. **Не гледай components и `interactions.json` още.**
5. Генерирай 4-6 фундаментално различни architectures за целия урок.
6. Избери най-силната според темата.
7. Напиши structural fingerprint.
8. Разбий architecture на learning moments.
9. Едва тогава консултирай `interactions.json`.
10. За всеки moment разгледай няколко interaction possibilities.
11. Избери най-подходящото, не най-ефектното.
12. Провери component registry.
13. Reuse, adapt, compose или създай нов component.
14. Генерирай resource files, когато практиката го изисква.
15. Не добавяй `Sandbox`, `Дискусия`, `Упражнение`, quiz или glossary като автоматични appendices.
16. Запази accordion, tags, cards, sidebar, modal и visual grammar.
17. Направи урока умерен - нито схематичен, нито раздут.
18. Приложи textbook transformation, repetition, why-this-way и moderation tests.
19. Имплементирай JSON.
20. Валидирай технически.

> **Не дигитализирай учебника. Трансформирай ученето.**

> **Не започвай от component. Започвай от architecture.**

> **Не използвай `interactions.json`, за да измислиш урока. Използвай го, за да реализираш вече избраните learning moments.**

> **Запази визуалния език. Освободи педагогическата архитектура.**

> **ONE DESIGN SYSTEM. MANY LEARNING EXPERIENCES. NO LESSON TEMPLATE.**
