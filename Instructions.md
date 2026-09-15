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

След curriculum analysis и coverage map НЕ преминавай директно към:

- accordion sections;
- tags;
- activities;
- component registry;
- `interactions.json`;
- quiz;
- JSON implementation.

Първо генерирай **4 до 6 фундаментално различни pedagogical architectures** за целия урок.

Architecture означава организиращата логика на learning experience.

Възможни families могат да бъдат:

- investigation;
- construction;
- progressive reveal;
- reverse engineering;
- system exploration;
- evolving model;
- continuous process;
- authentic workflow;
- experiment;
- comparison space;
- decision environment;
- problem space;
- simulation;
- transformation;
- evidence-based inquiry;
- друга topic-specific структура.

Това са inspiration categories, не задължителни templates.

## 4.2. КАКВО НЕ СЕ БРОИ ЗА РАЗЛИЧНА АРХИТЕКТУРА

Следните варианти НЕ са фундаментално различни:

- същите textbook topics с различни components;
- `Точка 1 + matching -> Точка 2 + timeline -> Точка 3 + quiz`;
- същият lesson skeleton с друга visual theme;
- story wrapper върху традиционен lesson;
- mission title, под което има `text -> check`;
- нови accordion titles без нова organizing logic;
- силна original activity само в Moment 1, след което се връщаме към textbook sections.

Ако всички architecture candidates могат да бъдат описани като:

> `Introduction -> Topic 1 -> activity -> Topic 2 -> activity -> Topic 3 -> activity -> final check`

ARCHITECTURE DIVERSITY STATUS = FAIL.

## 4.3. ИЗБОР НА АРХИТЕКТУРА

За всяка candidate architecture оцени:

- fit към конкретното съдържание;
- cognitive action;
- възможност за discovery;
- възможност за application;
- coverage;
- transfer;
- continuity;
- moderation;
- различимост спрямо вече разработените уроци.

Избери една architecture.

Не избирай най-ефектната. Избери тази, която най-добре превръща точно това съдържание в understanding и skill.

---

# 5. STRUCTURAL FINGERPRINT

След избора на architecture, но преди sections и components, формулирай **structural fingerprint** в 1-3 изречения.

Fingerprint описва:

> **Какво прави и преживява ученикът от началото до края.**

Fingerprint НЕ описва:

- layout;
- component names;
- броя accordion items;
- tags;
- позицията на quiz;
- визуалната тема.

Слаб fingerprint:

> `Въведение -> 4 точки -> Sandbox -> Дискусия -> Quiz -> Речник`

Силен fingerprint:

> `Ученикът изгражда един модел, който постепенно става по-пълен; всяка нова стъпка използва вече построеното, а финалната ситуация изисква целият модел да бъде приложен.`

Ако fingerprint може да бъде заменен с fingerprint на предишен урок без съществена промяна, architecture трябва да се преосмисли.

---

# 6. COVERAGE MAP ПРЕДИ IMPLEMENTATION

Създай вътрешна coverage map:

| Задължително знание / умение | Къде ученикът го среща | Как го използва | Как се проверява |
|---|---|---|---|

Coverage map:

- гарантира completeness;
- НЕ е outline на страницата;
- НЕ е accordion structure;
- НЕ означава едно понятие = една section.

---

# 7. ARCHITECTURE CONTINUITY - THROUGHLINE

## 7.1. ARCHITECTURE Е GLOBAL CONSTRAINT

Избраната architecture не е:

- hook;
- theme;
- story decoration;
- introductory gimmick.

Тя е **глобалната organizing logic на целия урок**.

Всеки major learning moment трябва да прави поне едно от следните:

- да продължава architecture;
- да я задълбочава;
- да добавя нов layer или state;
- да използва резултат от предишен moment;
- да поставя построеното под изпитание;
- да го трансформира;
- да го прилага в нов context;
- да води към естествено следващо discovery.

## 7.2. NARRATIVE CONTINUITY ≠ LEARNING CONTINUITY

Свързващи фрази като:

- `След като видяхме...`;
- `Вече знаем...`;
- `Оттук преминаваме...`;

НЕ доказват throughline.

Continuity трябва да се вижда в:

- learner actions;
- persistent state;
- model evolution;
- dependency;
- artifact;
- evidence;
- decisions;
- output.

Ако само prose свързва sections, но самите activities са независими, throughline е слаб.

## 7.3. THROUGHLINE TEST

За всеки major learning moment отговори:

> **Как този moment продължава същото learning experience?**

FAIL, ако отговорът е:

- `Това е следващата тема.`
- `Това още не е покрито.`
- `Тук ще използваме друг component.`
- `Това е следващата точка от учебника.`

## 7.4. ONE-SENTENCE TEST

Завърши:

> **От началото до края ученикът...**

Ако едно смислено изречение описва целия lesson, throughline вероятно е реален.

Ако изречението неизбежно се превръща в:

> `Първо..., после има секция за..., после учи..., после решава quiz...`

THROUGHLINE STATUS = FAIL.

---

# 8. NO TOPICAL FALLBACK

Curriculum topics са **coverage obligations**, не automatic page sections.

След architecture selection не се връщай автоматично към:

- Определение;
- Видове;
- Функции;
- Примери;
- Проверка;

или друга структура, наследена от учебника.

Когато дадено задължително понятие още не е покрито, първо попитай:

> **Как това понятие може да се появи естествено вътре в избраната architecture?**

Създай отделна thematic section само ако това е реално най-добрият pedagogical choice.

---

# 9. LEARNING MOMENTS

Едва след architecture и fingerprint дефинирай major learning moments.

Learning moment е момент, в който ученикът:

- наблюдава;
- прогнозира;
- припомня;
- сравнява;
- класифицира;
- свързва;
- подрежда;
- изследва;
- открива;
- конструира;
- манипулира;
- тества;
- диагностицира;
- избира;
- обосновава;
- поправя;
- прилага;
- създава;
- рефлектира;
- прехвърля знание в нов context.

Не използвай правило:

> едно понятие = един learning moment.

Един силен moment може да покрие няколко related concepts.

---

# 10. LEARNING MOMENT AUDIT - ЗАДЪЛЖИТЕЛНО

Преди `interactions.json`, registry и JSON implementation създай вътрешна таблица:

| Moment | Throughline role | Какво ново се научава | Къде се научава | Learner action | Interaction weight | Persistent object/state |
|---|---|---|---|---|---|---|

Колоната **Къде се научава** трябва конкретно да посочи:

- text;
- visual;
- interaction;
- simulation;
- resource file;
- external software;
- discussion;
- комбинация.

Тази таблица не е documentation decoration.

Тя се използва за PASS/FAIL gates.

---

# 11. INTERACTION WEIGHT TEST

Класифицирай major activities като `LIGHT`, `MEDIUM` или `HEAVY`.

## LIGHT

Interaction основно:

- recall-ва;
- разпознава;
- проверява;
- повтаря информация, която вече е била дадена.

Например:

- text дава categories -> sorter проверява същите categories;
- text дава sequence -> ordering повтаря sequence;
- text дава conclusion -> true/false paraphrase-ва conclusion.

LIGHT activity може да е полезна.

Проблемът е lesson, изграден само от LIGHT checks.

## MEDIUM

Ученикът:

- прилага knowledge към нов case;
- прави non-trivial comparison;
- reorganizes information;
- избира по criteria;
- диагностицира нова ситуация;
- комбинира няколко concepts.

## HEAVY

Interaction/environment носи значителна част от learning content.

Ученикът:

- открива;
- строи;
- manipulates;
- experiments;
- променя state;
- наблюдава consequences;
- създава artifact;
- диагностицира dynamic system;
- изследва multiple paths;
- builds или repairs model.

### HARD GATE

> **Ако всички major interactions са LIGHT, INTERACTION WEIGHT STATUS = FAIL.**

Не въвеждай quota от типа:

- точно 2 heavy interactions;
- точно 1 simulation;
- точно 3 activities.

Но когато темата включва:

- system;
- process;
- configuration;
- data;
- network;
- resources;
- troubleshooting;
- dynamic relationships;

не я свеждай само до exposition + recall checks, ако digital environment позволява по-силен experience.

---

# 12. TEXT-TO-CHECK DUPLICATION GATE

Сравни всяка major activity с непосредствено предхождащото content.

## FAIL CONDITIONS

FAIL, ако text вече предоставя напълно:

- правилния sequence, а след това interaction иска същия sequence;
- categories, а после sorter иска очевидното разпределение;
- mapping, а после matching повтаря mapping-а;
- conclusion, а после true/false го paraphrase-ва;
- answer, а после multiple choice пита същия факт;
- procedure, а после interaction само я възпроизвежда.

При FAIL направи едно от двете:

### A. Discovery first

Намали предварителното explanation и позволи interaction да генерира understanding.

### B. Deeper application

Запази explanation, но замени activity с:

- application;
- transfer;
- diagnosis;
- construction;
- comparison;
- scenario;
- practical task;
- another deeper mechanic.

---

# 13. NO SECTION RECIPE

Не приемай, че всеки accordion item трябва да бъде:

> `text -> interaction -> accent card`

или:

> `explanation -> check -> next section`

Accordion item може да бъде:

- една rich interactive environment;
- visual + prediction;
- practical resource file;
- evolving model;
- short explanation;
- comparison surface;
- няколко state-а на една interaction;
- guided investigation;
- authentic workflow;
- друга composition, която architecture изисква.

## SECTION SKELETON AUDIT

Преди implementation опиши skeleton-а:

```text
M1: ...
M2: ...
M3: ...
M4: ...
```

Warning example:

```text
M1: long explanation -> light check
M2: long explanation -> light check
M3: long explanation -> light check
M4: long explanation -> light check
```

Ако pedagogical role се повтаря механично:

> **NO SECTION RECIPE STATUS = FAIL**

дори component names да са различни.

---

# 14. PERSISTENT LEARNING OBJECT

Когато темата позволява, провери дали lesson може да развива **един persistent learning object** вместо поредица disconnected widgets.

Persistent object може да бъде:

- system;
- model;
- map;
- configuration;
- case file;
- dataset;
- project;
- artifact;
- timeline;
- diagram;
- simulation state;
- network;
- another evolving object.

Всеки learning moment може:

- да добавя layer;
- да променя state;
- да добавя constraint;
- да използва previous output;
- да коригира hypothesis;
- да transform-ва същия object.

Persistent object НЕ е задължителен template.

Но когато content естествено позволява evolving state, тази възможност трябва да бъде разгледана.

## PERSISTENT OBJECT CHECK

Отговори:

1. Има ли model/object/state, който може да се развива през няколко moments?
2. Губим ли learning value, ако го разбием на отделни activities?
3. Може ли final task да използва state/output, построен по-рано?

---

# 15. `interactions.json` - IDEA LIBRARY, НЕ ARCHITECTURE ENGINE

## 15.1. КОГА СЕ ОТВАРЯ

Правилният ред е:

> **Curriculum -> Coverage -> Architectures -> Chosen Architecture -> Fingerprint -> Learning Moments -> `interactions.json`**

Не отваряй `interactions.json` преди architecture selection.

## 15.2. ЗА КАКВО СЕ ИЗПОЛЗВА

За конкретен learning moment библиотеката помага да се разгледат:

- response mechanics;
- visual/media surfaces;
- simulation approaches;
- game mechanics;
- feedback models;
- assessment forms;
- collaboration modes;
- resource-file activities;
- alternative interaction patterns.

Направи кратък shortlist на подходящи alternatives.

Не избирай първия obvious pattern.

## 15.3. НЕ Е QUOTA ЗА VARIETY

Не се стреми към:

- maximum number of mechanics;
- activity от всяка family;
- различен component във всяка section;
- maximum gamification.

> **Разнообразието е средство, не KPI.**

`interactions.json` трябва да увеличава качеството на избора, не броя на activities.

---

# 16. IDEAL INTERACTION FIRST

За всеки major moment първо опиши **идеалното interaction**, без да гледаш component registry.

Опиши:

- learner goal;
- initial state;
- manipulable objects;
- available actions;
- changing state;
- rules;
- consequences;
- feedback;
- success condition;
- retry/reset logic;
- what new understanding emerges.

Примерна specification:

```text
Learner controls several processes.
CPU and RAM values change.
Starting another process creates resource pressure.
When RAM reaches a threshold, swap appears.
Changing priority changes responsiveness.
The learner observes consequences rather than reading them first.
```

Това е interaction specification.

Не е component name.

---

# 17. PEDAGOGICAL FIDELITY OVER IMPLEMENTATION CONVENIENCE

## 17.1. CORE RULE

> **Implementation adapts to pedagogical design. Pedagogical design must not collapse to fit the current implementation.**

Existing component е приемлив само ако запазва core learning mechanic.

## 17.2. DO NOT DOWNGRADE THE INTERACTION

Не заменяй:

- simulation със sorter;
- construction environment с matching;
- stateful system с quiz;
- exploration с cards;
- branching consequences с true/false;
- dynamic comparison със static text;

само защото готовият component е по-лесен.

## 17.3. НЕВАЛИДНИ АРГУМЕНТИ

Следните reasoning patterns са FAIL:

- `Този component вече съществува.`
- `Sorter приблизително покрива идеята.`
- `Quiz е достатъчно близо.`
- `Нов component изисква повече код.`

Implementation effort не е pedagogical argument.

---

# 18. COMPONENT FIDELITY CHECK

След ideal interaction specification провери registry.

За всеки reuse candidate сравни required mechanics с actual capabilities.

Пример:

| Required mechanic | Supported? |
|---|---|
| persistent state | yes/no |
| manipulation | yes/no |
| dynamic consequences | yes/no |
| live feedback | yes/no |
| multiple paths | yes/no |
| construction | yes/no |
| learner-generated state | yes/no |

Редовете се адаптират към конкретното interaction.

Ако existing component не запазва core mechanic:

> **REUSE = REJECTED**

След това:

- adapt existing;
- compose several components;
- или build new.

---

# 19. NEW COMPONENT IS NOT A LAST RESORT

Създаването на new component е нормална част от lesson creation.

> **IF THE SELECTED PEDAGOGICAL DESIGN REQUIRES A NEW COMPONENT, IMPLEMENTING IT IS NOT OPTIONAL.**

Нов component е необходим, когато:

- existing mechanics не покриват interaction specification;
- reuse би загубил core mechanic;
- reuse би превърнал discovery в recall;
- reuse би превърнал simulation в static check;
- reuse би превърнал construction в selection;
- новият mechanic има реална learning value.

## 19.1. NEW COMPONENT IMPLEMENTATION CONTRACT

Не добавяй въображаем `type` само в lesson JSON.

Ако е нужен new component:

1. създай component file;
2. дефинирай JSON API/contract;
3. имплементирай state;
4. имплементирай actions;
5. имплементирай feedback;
6. имплементирай reset/retry, ако е приложимо;
7. използвай established design tokens;
8. направи responsive behavior;
9. осигури keyboard usability, когато е приложимо;
10. не разчитай само на color;
11. register component-а;
12. използвай го в lesson JSON;
13. test-вай real route;
14. отстрани console errors;
15. изпълни lint/compile, ако tooling е наличен.

## 19.2. NO FAKE NOVELTY

Не създавай усещане за нов interaction само чрез:

- fancy title;
- metaphor;
- icon;
- renamed existing component;
- story label.

Например:

> `Хронологичен симулатор`

не е simulation, ако отдолу е само standard sequence sorting без state, consequences или exploration.

---

# 19A. TAG ≠ INTERACTION TYPE

Tags описват pedagogical role, не mechanic.

`Упражнение`, `Задача`, `Дискусия`, `Sandbox` могат да бъдат реализирани по много различни начини от `interactions.json`.

Не допускай tag label да диктува component type.

---

# 19B. ANTI-APPENDIX RULE

Не третирай:

- `Упражнение`;
- `Задача`;
- `Дискусия`;
- `Sandbox`;
- quiz;
- exit ticket;
- reflection;
- glossary;

като автоматичен footer след „основния урок“.

Постави ги там, където изпълняват learning function.

Допустимо е:

- discussion да отвори lesson;
- sandbox да бъде core environment;
- exercise да генерира знанието;
- assessment да е distributed;
- lesson да няма final quiz;
- lesson да няма glossary;
- lesson да няма reflection.

## FUNCTIONAL APPENDIX TEST

Не гледай само техническата nesting структура.

Pattern остава appendix, дори ако е скрит в една последна section:

> `exercise + discussion + quiz + exit ticket + glossary`

събрани накуп.

Ако elements са добавени само защото „трябва да ги има“:

> **ANTI-APPENDIX STATUS = FAIL**

---

# 19C. RESOURCE FILES СА ЧАСТ ОТ PEDAGOGICAL DESIGN

Агентът може да създава:

- DOCX;
- XLSX;
- PPTX;
- CSV;
- TXT;
- ZIP;
- images;
- screenshots;
- starter projects;
- broken files;
- partially completed files;
- multiple versions;
- templates;
- datasets;
- folder structures.

Resource file може да бъде самата learning environment.

---

# 19D. ASSESSMENT Е EVIDENCE, НЕ РИТУАЛ

Assessment доказва learning goal.

Може да бъде:

- quiz;
- typed response;
- cloze;
- matching;
- sorting;
- sequence;
- hotspot;
- diagnosis;
- debugging;
- configuration;
- practical file;
- simulation challenge;
- explanation;
- comparison;
- transfer task;
- mini-project;
- reflection.

`Бързи 5 въпроса` е optional pattern, не mandatory ending.

Ако се използва, 5 items НЕ означава 5 multiple-choice questions.

---

# 19E. УМЕРЕН ОБЕМ И ПЛЪТНОСТ

Урокът трябва да бъде:

> **нито твърде кратък и схематичен, нито твърде дълъг и раздут.**

Няма fixed quota за:

- words;
- accordion items;
- activities;
- interactions;
- visuals;
- assessment items.

## TOO SHORT

Lesson е твърде кратък, ако:

- прилича на summary;
- дава definitions без development;
- важни relationships са само споменати;
- няма достатъчно practice;
- ученикът не използва key skills;
- final task изисква повече, отколкото lesson е построил.

## TOO BLOATED

Lesson е твърде раздут, ако:

- една идея се обяснява многократно;
- всяко понятие получава собствен component;
- има activity след activity;
- interactions дублират една и съща функция;
- novelty е decorative;
- text компенсира weak interaction;
- има постоянен context switching.

## TEXT-COMPENSATION ANTI-PATTERN

Не компенсирай липсващ strong interaction чрез:

> `дълъг текст, който обяснява всичко -> light check`

Ако concept е по-подходящ за manipulation, simulation, construction или exploration, реализирай това experience.

## STOP RULE

Спри да добавяш, когато:

- coverage е complete;
- major relationships са ясни;
- key skills са exercised;
- има достатъчно evidence;
- transfer е покрит, когато е нужен;
- next element ще повтори existing pedagogical function.

> **`interactions.json` увеличава качеството на избора, не количеството на lesson.**

---


# 19F. GOAL DISCIPLINE - ЦЕЛТА Е СИНТЕЗ, НЕ СЪДЪРЖАНИЕ НА УРОКА

Полето `goal` трябва да бъде кратко и синтезирано.

## HARD RULE

- предпочитай 1 изречение;
- максимум 2 кратки изречения;
- не изброявай всички подтеми;
- не описвай всички activities;
- не превръщай `goal` в curriculum summary.

Добра цел описва главния learning outcome.

Слабо:

> Учениците разбират A, разглеждат B, анализират C, сравняват D, упражняват E и използват F...

По-добре:

> Учениците разбират ролята на операционната система и могат да свържат основните й функции с реалната работа на компютъра.

Ако целта звучи като table of contents:

> **GOAL DISCIPLINE STATUS = FAIL**

---

# 19G. LABEL AND TITLE HYGIENE

Не поставяй излишни meta labels в titles.

## 19G.1. НЕ ПОВТАРЯЙ ТИПА НА COMPONENT-А В ЗАГЛАВИЕТО

Избягвай по подразбиране:

- `Интерактивна лаборатория: ...`
- `Интерактивна карта: ...`
- `Симулатор: ...`
- `Интерактивно упражнение: ...`
- `Проверка: ...`
- `Тест: ...`
- `Визуализация: ...`

ако самият component, tag или context вече показва какъв е interaction type.

Вместо:

> `Интерактивна лаборатория: Подсистемите на операционната система`

предпочитай:

> `Подсистемите в действие`

Вместо:

> `Симулатор: Диспечер на задачите`

предпочитай:

> `Диспечер на задачите`

или конкретна action-oriented title според задачата.

## 19G.2. TITLE ОПИСВА СЪДЪРЖАНИЕТО ИЛИ ДЕЙСТВИЕТО

Title трябва да казва:

- какво се изследва;
- какво се прави;
- какъв проблем се решава.

Не трябва да казва само какъв UI component се използва.

## 19G.3. НЕ ДУБЛИРАЙ STANDARD TAG

Ако `Упражнение`, `Задача`, `Дискусия` или `Sandbox` вече са показани чрез standard tag, не ги повтаряй в title освен ако думата е реално част от смисъла.

## 19G.4. SUBTITLE НЕ Е ЗАДЪЛЖИТЕЛЕН

Не добавяй subtitle към всеки component по навик.

Subtitle се използва само когато:

- добавя важна orientation;
- обяснява unusual interaction;
- задава кратка задача, която не е очевидна от interface-а.

Ако subtitle само перифразира title-а, премахни го.

## 19G.5. MAIN ACCORDION TITLES СА ЧИСТИ

По подразбиране main accordion titles:

- нямат decorative icons;
- нямат badge;
- нямат kicker;
- нямат decorative numbering, ако numbering не помага за orientation;
- нямат tone само за decoration.

Semantic icon е допустима само ако platform convention или конкретна accessibility/navigation функция го изисква.

---

# 19H. MEDIA AND IMAGE PLACEHOLDER DISCIPLINE

Урокът не трябва да бъде само текст + interactive components.

При planning провери къде изображение, screenshot, diagram, photo или visual reference реално подобрява understanding.

## 19H.1. IMAGE OPPORTUNITY PASS

За всеки major moment попитай:

- има ли реален интерфейс, който ученикът трябва да разпознае;
- има ли физически object/device, който е по-добре да се види;
- има ли before/after state;
- има ли process, който се нуждае от diagram;
- има ли comparison, което се възприема по-добре visual;
- има ли historical/contextual image, която добавя смисъл.

Не добавяй изображение само за decoration.

## 19H.2. PLACEHOLDER Е ЗАДЪЛЖИТЕЛЕН, КОГАТО VISUAL Е ПЛАНИРАН, НО ASSET ЛИПСВА

В lesson plan запиши за всеки липсващ visual:

- placeholder id;
- proposed filename;
- visual type;
- кратко описание на композицията;
- какво трябва да се вижда;
- pedagogical function;
- `alt`;
- source/generation note.

Пример:

```text
[IMAGE PLACEHOLDER]
id: os-task-manager-real
filename: it-8-9/task-manager-processes.png
type: screenshot
content: Windows Task Manager, Processes view, visible CPU and Memory columns
purpose: learner recognizes where real process and resource data are observed
alt: Диспечер на задачите с колони за процесор и памет
```

## 19H.3. PRODUCTION JSON

Не записвай placeholder prose като fake `src`.

Когато platform има `image-placeholder` component, използвай него за липсващ asset.

Когато asset съществува, използвай normal short relative path.

Placeholder е design contract за бъдещия visual, не декоративен празен правоъгълник.

---

# 19I. REAL SYSTEM FIRST - НЕ СИМУЛИРАЙ ТОВА, КОЕТО УЧЕНИКЪТ МОЖЕ СМИСЛЕНО ДА НАПРАВИ В РЕАЛНАТА СРЕДА

Simulation е силен инструмент, но не е автоматично по-добра от реална практика.

Преди да създадеш simulation, попитай:

> **Може ли ученикът безопасно, ясно и реалистично да извърши това действие в истинската операционна система или приложение?**

Ако да, предпочитай authentic exercise или hybrid design.

## 19I.1. PREFER REAL SYSTEM WHEN

Реалната система е по-добър избор, когато activity включва:

- отваряне на Task Manager / Activity Monitor / System Monitor;
- наблюдение на CPU, RAM, disk или processes;
- създаване, преместване, преименуване и търсене на files;
- безопасни basic terminal commands;
- проверка на file properties;
- работа с folders;
- basic application settings;
- реални productivity tools;
- реален browser/search workflow;
- създаване или редактиране на document/spreadsheet/presentation.

Тогава lesson може да даде:

- кратко условие;
- standard `Упражнение` tag;
- exact steps;
- observation questions;
- screenshot evidence;
- checklist или short report.

## 19I.2. PREFER SIMULATION WHEN

Simulation е оправдана, когато реалният процес е:

- невидим отвън;
- опасен;
- destructive;
- изисква admin/root access;
- твърде зависим от конкретен OS/device;
- трудно възпроизводим в classroom;
- изисква controlled fault;
- изисква repeatable state;
- изисква compressed time;
- невъзможен за ученика без специален hardware/software.

Примери:

- CPU scheduling;
- memory allocation и swap mechanics;
- packet routing;
- boot internals;
- fault injection;
- permission escalation;
- hardware failure;
- hidden system calls.

## 19I.3. HYBRID Е ЧЕСТО НАЙ-СИЛНИЯТ ВАРИАНТ

Използвай simulation за невидимия mechanism и реална система за authentic observation/application.

Примерен принцип:

> simulation показва защо RAM pressure води до swap -> реално упражнение кара ученика да отвори Task Manager и да наблюдава Memory/Processes.

## 19I.4. REAL-SYSTEM FIDELITY GATE

FAIL, ако:

- се изгражда сложна simulation на действие, което ученикът може по-смислено да направи безопасно в реалната система;
- simulation замества authentic tool use без pedagogical reason;
- lesson симулира почти всяка тема само защото custom components са позволени.

> **Не симулирай всичко. Симулирай скритото, рисковото, трудно възпроизводимото или това, което има нужда от контролирани consequences.**

---

# 19J. COMPONENT MODERATION

Фактът, че агентът има право да създава new components, не означава, че всеки learning moment трябва да получи custom component.

Създай new component само когато той:

- запазва mechanic, който existing components не могат;
- носи значима learning value;
- прави невидим process видим;
- позволява manipulation/state/consequences;
- служи на architecture.

Не създавай custom simulation за:

- simple factual comparison;
- действие, което може да бъде реално упражнение;
- content, което diagram/image/table представя по-добре;
- кратък recall check.

> **Pedagogical fidelity не означава maximum component creation.**

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

- решава реална pedagogical need;
- existing components не запазват required mechanic;
- adaptation би довела до неестествен UX;
- reuse би downgrade-нал discovery, simulation, construction или exploration;
- новият interaction има достатъчно learning value.

Не използвай принцип:

> `new component only as absolute last resort`

Използвай принцип:

> **reuse when faithful; build new when fidelity requires it**

Нов component трябва:

- да следва visual language;
- да използва established spacing/radius/control patterns;
- да има ясно initial state;
- да има ясни actions;
- да има meaningful feedback;
- да има reset/retry, когато е приложимо;
- да работи responsive;
- да бъде keyboard-usable, когато е приложимо;
- да не разчита само на color;
- да има defined JSON contract;
- да бъде registered;
- да има unique `id`;
- да бъде тестван в реалния lesson route;
- да не въвежда произволно нов design system.

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

Plan е pedagogical source of truth.

JSON е implementation.

## A. Curriculum analysis

Запиши:

- facts;
- concepts;
- relationships;
- procedures;
- skills;
- misconceptions;
- required examples.

## B. Coverage map

## C. Architecture exploration

Опиши 4-6 fundamentally different candidates.

## D. Chosen architecture

Запиши:

- rationale;
- защо другите candidates са по-слаби;
- structural fingerprint.

## E. Learning moments

Опиши major moments без component names.

## F. Learning Moment Audit

| Moment | Throughline role | Какво ново се научава | Къде се научава | Learner action | Weight | Persistent object/state |
|---|---|---|---|---|---|---|

## G. Persistent Learning Object Check

Отговори дали evolving object/state е приложим.

## H. `interactions.json` shortlist

Само след architecture selection.

За major moment запиши няколко възможности, които реално са разгледани.

## I. Ideal Interaction Specifications

За важните moments опиши mechanic без component registry.

## J. Component Fidelity Check

Запиши:

- existing component candidate;
- required mechanics;
- preserved mechanics;
- missing mechanics;
- decision: reuse / adapt / compose / new.

## K. Media and resources

Опиши:

- images;
- diagrams;
- screenshots;
- animations;
- generated assets;
- resource files.

## L. Assessment / transfer

Опиши как се доказва learning.

## M. Moderation pass

Запиши какво е премахнато като излишно и защо lesson не е нито кратък, нито раздут.

## N. Gate Report

Задължителен преди JSON.

---

# 43. GATE REPORT - ЗАДЪЛЖИТЕЛЕН

Преди JSON implementation plan трябва да съдържа:

| Gate | Status | Evidence / reason |
|---|---|---|
| Architecture Diversity | PASS/FAIL | |
| Structural Fingerprint | PASS/FAIL | |
| Throughline | PASS/FAIL | |
| No Topical Fallback | PASS/FAIL | |
| Text-to-Check Duplication | PASS/FAIL | |
| No Section Recipe | PASS/FAIL | |
| Interaction Weight | PASS/FAIL | |
| Pedagogical Fidelity | PASS/FAIL | |
| Persistent Object Check | PASS/FAIL/NOT APPLICABLE | |
| Anti-Appendix | PASS/FAIL | |
| Goal Discipline | PASS/FAIL | |
| Label & Title Hygiene | PASS/FAIL | |
| Media Placeholder Pass | PASS/FAIL/NOT APPLICABLE | |
| Real-System-First | PASS/FAIL/NOT APPLICABLE | |
| Component Moderation | PASS/FAIL | |
| Moderation | PASS/FAIL | |
| Coverage | PASS/FAIL | |

## ABSOLUTE RULE

> **JSON IMPLEMENTATION MUST NOT BEGIN UNTIL ALL APPLICABLE GATES PASS.**

Не отбелязвай `PASS` декларативно.

Колоната `Evidence / reason` трябва да показва конкретно защо gate е минат.

Ако gate е `FAIL`:

1. redesign plan;
2. update audit;
3. run gates again;
4. чак след това продължи.

---

# 44. GATE DEFINITIONS

## 44.1. Architecture Diversity

PASS само ако candidates са различни по organizing logic, не само по component choice.

## 44.2. Structural Fingerprint

PASS само ако fingerprint описва learning experience от начало до край.

## 44.3. Throughline

PASS само ако architecture е проследима във всеки major moment чрез learner action/state, не само чрез transition prose.

## 44.4. No Topical Fallback

PASS само ако curriculum topics са integrated в architecture.

## 44.5. Text-to-Check Duplication

PASS само ако major activities не възпроизвеждат answer, даден непосредствено преди тях.

## 44.6. No Section Recipe

PASS само ако major moments не повтарят механично еднакъв pedagogical recipe.

## 44.7. Interaction Weight

PASS само ако lesson не е изграден изцяло от LIGHT interactions.

## 44.8. Pedagogical Fidelity

PASS само ако existing components не са използвани чрез downgrade на ideal mechanic.

## 44.9. Persistent Object Check

PASS, ако подходящ evolving object е използван смислено.

`NOT APPLICABLE`, ако темата реално не предполага такъв model/state.

## 44.10. Anti-Appendix

PASS само ако exercise/discussion/sandbox/assessment/glossary не са автоматично струпани в края.

## 44.11. Goal Discipline

PASS само ако `goal` е синтезиран learning outcome в 1, максимум 2 кратки изречения.

## 44.12. Label & Title Hygiene

PASS само ако titles не повтарят UI type, няма излишни meta labels, subtitle не е автоматичен и main accordion titles са визуално чисти.

## 44.13. Media Placeholder Pass

PASS, ако необходимите visuals са планирани и липсващите assets имат конкретни placeholders.

`NOT APPLICABLE`, ако темата реално не се нуждае от допълнителни visuals.

## 44.14. Real-System-First

PASS, ако simulation се използва само когато има pedagogical reason и authentic real-system practice е предпочетена там, където е по-силна.

## 44.15. Component Moderation

PASS, ако new components са създадени за уникална learning value, а не защото custom components са позволени.

## 44.16. Moderation

PASS само ако lesson е достатъчен, но не раздут.

## 44.17. Coverage

PASS само ако coverage map е изпълнена.

---

# 45. РАБОТЕН ПОТОК - ЗАДЪЛЖИТЕЛЕН РЕД

## STEP 1
Прочети materials.

## STEP 2
Извлечи curriculum model.

## STEP 3
Създай coverage map.

## STEP 4
Генерирай 4-6 architectures.

**Не отваряй `interactions.json`.**

**Не използвай subject-specific component names.**

## STEP 5
Избери architecture.

## STEP 6
Напиши structural fingerprint.

## STEP 7
Определи learning moments.

## STEP 8
Направи Learning Moment Audit.

## STEP 9
Run Throughline и No Topical Fallback tests.

## STEP 10
Направи Persistent Learning Object Check.

## STEP 11
Едва сега консултирай `interactions.json`.

## STEP 12
Опиши ideal interaction за major moments.

## STEP 13
Класифицирай interaction weight.

## STEP 14
Run Text-to-Check Duplication и No Section Recipe tests.

## STEP 15
Провери component registry.

## STEP 16
Направи Component Fidelity Check.

## STEP 17
Reuse / adapt / compose / build new.

## STEP 18
Планирай media и resource files.

## STEP 19
Планирай assessment и transfer.

## STEP 20
Run Anti-Appendix и Moderation tests.

## STEP 20A
Run Goal Discipline и Label/Title Hygiene pass.

## STEP 20B
Направи Media/Image Opportunity Pass и добави placeholders за липсващи assets.

## STEP 20C
Run Real-System-First test: замени ненужните simulations с authentic exercises или hybrid design.

## STEP 20D
Run Component Moderation test.

## STEP 21
Попълни Gate Report.

## STEP 22
При който и да е FAIL - върни се към plan.

## STEP 23
Само при всички applicable PASS - започни JSON implementation.

## STEP 24
Ако има new component - implement, register и test.

## STEP 25
Validate lesson.

---

# 46. TECHNICAL RULES

## 46.1. IDs

Всеки component трябва да има unique и stable `id`.

## 46.2. `skipNav`

Local activities, tags, modals, quizzes и secondary blocks използват `skipNav: true`, когато navigation logic го изисква.

## 46.3. Unicode em dash

Не използвай Unicode em dash (`U+2014`).

Използвай normal hyphen (`-`).

## 46.4. JSON validation

След промяна:

- validate JSON;
- провери ids;
- провери modal targets;
- провери asset paths;
- провери component types;
- провери route loading.

## 46.5. New component validation

При new component:

- file exists;
- component registered;
- JSON contract matches renderer;
- state works;
- feedback works;
- reset/retry works, ако е приложимо;
- keyboard/accessibility works;
- responsive behavior works;
- no console errors.

## 46.6. Lint / compile

Изпълни актуалните project commands, ако tooling ги предоставя.

---

# 47. QUALITY CHECKLIST

## Curriculum

- [ ] Coverage map е complete.
- [ ] Knowledge е correct.
- [ ] Skills са covered.
- [ ] Terminology е accurate.
- [ ] Не е пропуснат required content.

## Architecture

- [ ] 4-6 real architectures са разгледани.
- [ ] Architecture е избрана преди `interactions.json`.
- [ ] Structural fingerprint описва целия lesson.
- [ ] Throughline се запазва във всеки major moment.
- [ ] Narrative transitions не са единствената continuity.
- [ ] Няма topical fallback.
- [ ] Curriculum topics не са автоматично sections.

## Learning Moment Audit

- [ ] Всеки major moment има ясна learning function.
- [ ] Ясно е къде се случва learning.
- [ ] Interaction weight е класифициран.
- [ ] Persistent object/state е разгледан.

## Interaction

- [ ] Няма text-to-check duplication.
- [ ] Няма repeated `explain -> check` recipe без причина.
- [ ] Не всички major interactions са LIGHT.
- [ ] Ideal interaction е описано преди registry lookup.
- [ ] Existing components са проверени за fidelity.
- [ ] Няма mechanic downgrade за удобство.
- [ ] New component е създаден, когато е необходим.
- [ ] Няма fake novelty чрез fancy title върху стар mechanic.

## Presentation discipline

- [ ] `goal` е 1, максимум 2 кратки изречения.
- [ ] Component titles не повтарят `Интерактивна`, `Лаборатория`, `Симулатор`, `Проверка` без реална нужда.
- [ ] Subtitles са добавени само когато носят orientation.
- [ ] Main accordion titles са без decorative icons по подразбиране.
- [ ] Visual opportunities са проверени.
- [ ] Missing visuals имат конкретни placeholders.
- [ ] Authentic real-system exercise е предпочетено пред ненужна simulation.
- [ ] Custom components са умерени и оправдани.

## Activities

- [ ] Tags описват role, не mechanic.
- [ ] Няма automatic appendix.
- [ ] Assessment е evidence.
- [ ] Glossary е justified, ако съществува.
- [ ] Resource files са създадени, когато подобряват практиката.

## Moderation

- [ ] Lesson не е summary-only.
- [ ] Lesson не е bloated.
- [ ] Няма duplicate explanations.
- [ ] Няма activity overload.
- [ ] Stop rule е приложен.

## Visual grammar

- [ ] Accordion styling е preserved.
- [ ] Main headings са clean.
- [ ] Standard tags използват правилни tone/icon/variant.
- [ ] `callout-highlight-box` е consistent.
- [ ] Tone cards са semantic.
- [ ] Sidebar съдържа само main navigation.
- [ ] Modals следват conventions.

## Media / accessibility

- [ ] Visuals имат pedagogical function.
- [ ] Asset paths са valid.
- [ ] Missing assets са описани в plan.
- [ ] Alt/accessibility е correct.

## Technical

- [ ] JSON valid.
- [ ] IDs unique.
- [ ] Component types registered.
- [ ] Modal targets exist.
- [ ] Route works.
- [ ] New components са implemented, не само referenced.
- [ ] No console errors.

---

# 48. FINAL DESIGN TEST

## Test 1 - Curriculum independence

> Ако учебникът изчезне и ученикът има само този lesson, може ли да разбере и използва required content?

Желан отговор: **ДА**.

## Test 2 - Digital value

> Ако lesson бъде разпечатан, ще се загуби ли смислена част от learning experience?

При подходяща тема: **ДА**.

## Test 3 - Architecture

> Може ли structural fingerprint да бъде прехвърлен почти без промяна върху предишен lesson?

Желан отговор: **НЕ**, освен при реална reason.

## Test 4 - Throughline

> Остава ли architecture вярна и в middle, и в end, не само в intro?

Желан отговор: **ДА**.

## Test 5 - Interaction weight

> Носат ли поне някои interactions самото learning, или всички само проверяват preceding text?

Не допускай второто.

## Test 6 - Fidelity

> Отслабен ли е ideal interaction само за да се използва готов component?

Желан отговор: **НЕ**.

## Test 7 - Moderation

> Ако премахна още един significant moment, ще загубя ли learning? Ако добавя още един, ще повторя ли existing function?

Търси оптималната граница.

---

# 49. КРАТКА ИНСТРУКЦИЯ КЪМ АГЕНТА

1. Анализирай materials.
2. Създай coverage map.
3. Генерирай 4-6 fundamentally different architectures.
4. Не гледай `interactions.json` и component registry още.
5. Избери architecture.
6. Напиши structural fingerprint.
7. Разпиши learning moments.
8. Провери throughline във всеки major moment.
9. Направи Learning Moment Audit.
10. Провери persistent object/state.
11. Едва тогава отвори `interactions.json`.
12. Опиши ideal interaction преди component lookup.
13. Класифицирай LIGHT / MEDIUM / HEAVY.
14. FAIL ако всички major interactions са LIGHT.
15. FAIL ако preceding text вече дава answer-а на activity.
16. FAIL при repeated `explain -> check` recipe без педагогическа причина.
17. Провери registry.
18. Не downgrade-вай mechanic заради наличен component.
19. Ако design изисква new component - implement-вай го.
20. Не използвай fake novelty чрез ново име върху стар mechanic.
21. Не струпвай exercise/discussion/quiz/glossary като footer.
22. Напиши `goal` в 1, максимум 2 кратки изречения.
23. Премахни излишни meta labels като `Интерактивна лаборатория:` и redundant subtitles.
24. Планирай нужните images/screenshots/diagrams и добави placeholders за липсващите assets.
25. Преди simulation провери дали real-system exercise не е по-силно.
26. Не създавай custom component, ако real tool, image, diagram или simple activity е по-подходящ.
27. Направи lesson умерен.
28. Попълни Gate Report с evidence.
29. Не започвай JSON при FAIL.
30. След PASS implement, register, validate и test.

> **Не дигитализирай учебника. Трансформирай ученето.**

> **Не започвай от component. Започвай от architecture.**

> **Не избирай interaction според това какво вече е лесно за кодиране.**

> **Не downgrade-вай learning experience, за да използваш готов component.**

> **Когато нов mechanic е нужен, създаването на component е част от задачата.**

> **`interactions.json` разширява въображението, но не определя architecture.**

> **ONE DESIGN SYSTEM. MANY LEARNING EXPERIENCES. NO LESSON TEMPLATE.**
