// Exit Ticket reflection component

export function render(comp) {
  const id = comp.id || 'exit-ticket';
  const title = comp.title || 'Изходен билет (Индивидуална рефлексия)';
  const subtitle = comp.subtitle || 'Отделете 2 минути, за да обобщите наученото в днешния час:';

  return `
    <section class="component exit-ticket-card" id="${id}">
      <div class="exit-ticket-header">
        <div class="exit-ticket-badge">
          <i class="fas fa-ticket-simple"></i>
          <span>${title}</span>
        </div>
        <p class="exit-ticket-subtitle">${subtitle}</p>
      </div>
      <form class="exit-ticket-form" id="${id}-form">
        <div class="exit-ticket-field">
          <label for="${id}-learned"><i class="fas fa-lightbulb"></i> Днес научих, че:</label>
          <textarea id="${id}-learned" name="learned" rows="2" placeholder="Напишете най-важното ново понятие или правило от днес..." required></textarea>
        </div>
        <div class="exit-ticket-field">
          <label for="${id}-wondering"><i class="fas fa-circle-question"></i> Все още се чудя за / Имам въпрос за:</label>
          <textarea id="${id}-wondering" name="wondering" rows="2" placeholder="Има ли нещо неясно или тема, за която искате да научите повече?"></textarea>
        </div>
        <div class="exit-ticket-field">
          <label><i class="fas fa-chart-simple"></i> Оценка на моето разбиране:</label>
          <div class="exit-ticket-ratings">
            <label class="rating-pill"><input type="radio" name="understanding" value="3" checked> 🟢 Разбрах всичко и мога да го приложа</label>
            <label class="rating-pill"><input type="radio" name="understanding" value="2"> 🟡 Имам нужда от още малко упражнения</label>
            <label class="rating-pill"><input type="radio" name="understanding" value="1"> 🔴 Беше ми трудно и имам въпроси</label>
          </div>
        </div>
        <div class="exit-ticket-actions">
          <button type="submit" class="btn-activity exit-ticket-btn">
            <i class="fas fa-paper-plane"></i> Изпрати изходен билет
          </button>
        </div>
        <div class="exit-ticket-feedback" style="display:none;"></div>
      </form>
    </section>
  `;
}

export function init(comp) {
  const id = comp.id || 'exit-ticket';
  const root = document.getElementById(id);
  if (!root) return;
  const form = root.querySelector('.exit-ticket-form');
  const feedback = root.querySelector('.exit-ticket-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const learned = form.querySelector('[name="learned"]').value.trim();
    if (!learned) return;

    feedback.innerHTML = '<i class="fas fa-circle-check"></i> Браво! Вашият изходен билет е записан успешно. Страхотна работа в днешния час!';
    feedback.style.display = 'block';
    feedback.className = 'exit-ticket-feedback success';
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
    }
  });
}
