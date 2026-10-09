// Professional experience page renderer

export function renderExperiencePage() {
  return `
<section class="experience-section">
        <div class="container">
            <div class="section-title">
                <h2>Професионално развитие и квалификация</h2>
                <div class="underline"></div>
            </div>

            <div class="exp-grid">

                <div class="exp-column">
                    <h3 class="column-header"><i class="fas fa-briefcase"></i> Професионален опит</h3>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-date">2025 - 2026</div>
                            <h4 class="timeline-title">Учител по информационни технологии</h4>
                            <p class="timeline-location">СПГ „Княгиня Евдокия“, гр. София</p>
                            <ul class="timeline-desc">
                                <li>Преподаване на ИТ (VIII - X клас).</li>
                                <li>Преподаване на професионални дисциплини и учебни практики по специалност „Икономическо информационно осигуряване“ (XI, XII клас).</li>
                                <li>Подготовка на учениците за държавен изпит за придобиване на професионална квалификация.</li>
                            </ul>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2023 - 2024</div>
                            <h4 class="timeline-title">Учител по компютърно моделиране и информационни технологии</h4>
                            <p class="timeline-location">131 СУ „Климент А. Тимирязев“, гр. София</p>
                            <ul class="timeline-desc">
                                <li>Преподаване на КМИТ (V - VII клас).</li>
                                <li>Преподаване на ИТ в профилирана подготовка (VIII - XI клас).</li>
                            </ul>
                            <div class="item-links">
                                <a href="https://131su.eu/events.php?id=677" target="_blank" class="timeline-link"><i
                                        class="fas fa-link"></i> НОИТ</a>
                                <a href="https://drive.google.com/file/d/1-PgN1HsV33VsYcmkDMTjW0qQIGIfxT1_/view?usp=drive_link"
                                    target="_blank" class="timeline-link"><span class="timeline-tag"><i
                                            class="fas fa-award"></i> Грамота</span></a>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2022</div>
                            <h4 class="timeline-title">Учител по информационни технологии</h4>
                            <p class="timeline-location">2АЕГ „Томас Джеферсън“, гр. София</p>
                            <p class="timeline-desc">Преподаване на ИТ (VIII - XI клас).</p>
                            <div class="item-links">
                                <a href="https://martinbyalov.github.io/gallery/" target="_blank"
                                    class="timeline-link"><i class="fas fa-external-link-alt"></i> Проект: Галерия</a>
                                <a href="https://drive.google.com/file/d/1Kbbi3ZacQtoxOYGIG8t6n4a1aUfPfAu-/view?usp=drive_link"
                                    target="_blank" class="timeline-link"><span class="timeline-tag"><i
                                            class="fas fa-award"></i> SELFIE Сертификат</span></a>
                            </div>
                        </div>
                    </div>

                    <h3 class="column-header"><i class="fas fa-graduation-cap"></i> Образование</h3>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-date">2017 - 2024</div>
                            <h4 class="timeline-title">Бакалавър по математика и информатика</h4>
                            <p class="timeline-location">СУ „Св. Климент Охридски“, ФМИ, гр. София</p>
                            <a href="https://students.nacid.bg/graduated" target="_blank" class="timeline-link">
                                Диплома Серия А-2023 СУ / № 273356
                            </a>
                            <hr class="experience-separator">

                            <div class="extra-activities">
                                <a href="https://byalovvmartin.wixsite.com/cleaning-services" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Wix</a>
                                <a href="experiences/ai-bot/ai-bot.exe" download="ai-bot.exe" class="badge-link">
                                    <i class="fas fa-download"></i> AI Bot</a>
                                <a href="experiences/gallery/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Галерия</a>
                                <a href="experiences/morphemes/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Морфеми</a>
                                <a href="experiences/triangle-game/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Триъгълни игри</a>
                                <a href="experiences/distance-velocity-time/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Път, скорост, време</a>
                                <a href="experiences/equal-triangles/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Еднакви триъгълници</a>
                                <a href="experiences/littlePhysics/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Трети принцип на механиката</a>
                                <a href="experiences/redhood/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Олимпиада по компютърно моделиране · III клас</a>
                                <a href="experiences/newfriend/index.html" target="_blank"
                                    class="badge-link"><i class="fas fa-chevron-right"></i> Олимпиада по компютърно моделиране · IV клас</a>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2002 - 2014</div>
                            <h4 class="timeline-title">Профил „География и английски език“</h4>
                            <p class="timeline-location">ХГ „Св. св. Кирил и Методий“, гр. Добрич</p>
                        </div>
                    </div>
                </div>

                <div class="exp-column">
                    <h3 class="column-header"><i class="fas fa-leaf"></i> Програма PandaLabs</h3>
                    <div class="cards-list">
                        <div class="info-card gold">
                            <div class="card-icon"><i class="fas fa-award"></i></div>
                            <div class="card-content">
                                <a href="https://drive.google.com/file/d/1-nChN7aPV_NGy2bY6IDIQayIz7RWqCrV/view?usp=drive_link"
                                    target="_blank" class="badge-link">Грамота</a><br>
                                <a href="https://drive.google.com/file/d/1O0LuKzT2JTz_-SdN1CgJ3KAbLtXVSBNw/view?usp=drive_link"
                                    target="_blank" class="badge-link">Удостоверение (1 кредит)</a>

                            </div>
                        </div>
                        <div class="info-card">
                            <div class="card-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                            <div class="card-content">
                                <a href="https://drive.google.com/file/d/1J4tRbhDfQOpGIRhOI3lIRUOgJnIsnQ9p/view?usp=drive_link"
                                    target="_blank" class="badge-link">💡 Зеленият стълб</a><br>
                                <a href="https://spgke.com/uspeh-za-spg-knqginq-evdokia-v-predpriemacheskata-programa-panda-labs/"
                                    target="_blank" class="badge-link">🏆 Зеленоваторите</a>
                            </div>
                        </div>
                    </div>

                    <h3 class="column-header"><i class="fas fa-school"></i> Проект Училища за пример</h3>
                    <div class="cards-list">
                        <div class="info-card gold">
                            <div class="card-icon"><i class="fas fa-award"></i></div>
                            <div class="card-content">
                                <a href="https://drive.google.com/file/d/1xih_isX4kz9MUh_JclJY73zVL8GiohM1/view?usp=drive_link"
                                    target="_blank" class="badge-link">Удостоверение (3 кредита)</a><br>
                                <a href="experiences/zaednovchas/index.html" target="_blank"
                                    class="badge-link">Времева линия</a>

                            </div>
                        </div>
                    </div>

                    <h3 class="column-header"><i class="fas fa-share-nodes"></i> Добри практики</h3>
                    <div class="cards-list">
                        <div class="info-card">
                            <div class="card-icon"><i class="fas fa-vr-cardboard"></i></div>
                            <div class="card-content">

                                <a href="https://drive.google.com/drive/folders/1zeuZvG3AwPQf2NgRovDIVqGXI--Vb7Kd?usp=sharing"
                                    target="_blank" class="badge-link">#Versailles - 8.ж</a><br>
                                <a href="https://drive.google.com/drive/folders/1mlbTulC5BWBXVATPT8CeDAa3VZyMtDPH?usp=sharing"
                                    target="_blank" class="badge-link">Личните данни - Стефан 12.а</a><br>
                                <a href="https://drive.google.com/file/d/16aQPpTpsLcN3HgLqwM6gaGCPjLZz5fk8/view?usp=drive_link"
                                    target="_blank" class="badge-link">Ден на отворените врати - Пламена 8.д (2025)</a><br>
                                <a href="https://mihaelamiteva2029.wixsite.com/mysite" target="_blank"
                                    class="badge-link">Ресторант Boris's mehana - Борис, Михаела - 8.а (2025)</a>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  `;
}
