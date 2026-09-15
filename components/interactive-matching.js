// Interactive Matching component
// Supports both standard dropdown matching and LearningApps-style scattered cards matching canvas

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function render(comp) {
  const id = comp.id || 'interactive-matching';
  const isScattered = comp.mode === 'scattered' || comp.type === 'scattered-matching' || comp.scattered === true;
  const rawPairs = comp.pairs || [];
  
  const pairs = rawPairs.map((p, idx) => ({
    id: idx,
    concept: p.concept || p.term || p.left || '',
    definition: p.definition || p.right || ''
  }));

  const title = comp.title || (isScattered ? 'Филтри за търсене във File Explorer' : 'Свържете понятията с правилното определение');

  if (isScattered) {
    // Generate scattered cards (2 per pair)
    const cardList = [];
    pairs.forEach((p, idx) => {
      cardList.push({
        pairId: idx,
        type: 'concept',
        label: 'Филтър',
        text: p.concept,
        rot: (Math.random() * 6 - 3).toFixed(1)
      });
      cardList.push({
        pairId: idx,
        type: 'definition',
        label: 'Стойност',
        text: p.definition,
        rot: (Math.random() * 6 - 3).toFixed(1)
      });
    });

    const shuffledCards = shuffleArray(cardList);

    const cardsHtml = shuffledCards.map((c, cIdx) => `
      <div class="scattered-card" 
           data-card-id="${cIdx}" 
           data-pair-id="${c.pairId}" 
           data-type="${c.type}"
           draggable="true"
           style="--card-rot: ${c.rot}deg;">
        <div class="scattered-pin"><i class="fas fa-thumbtack"></i></div>
        <div class="scattered-card-type">${esc(c.label)}</div>
        <div class="scattered-card-text">${esc(c.text)}</div>
      </div>
    `).join('');

    return `
      <div class="interactive-matching-card scattered-matching-container" id="${id}">
        <header class="scattered-matching-header">
          <h3>${esc(title)}</h3>
        </header>

        <div class="scattered-board-wrapper">
          <div class="scattered-board">
            ${cardsHtml}
          </div>

          <div class="scattered-success-banner" style="display: none;">
            <div class="scattered-success-content">
              <i class="fas fa-trophy text-amber-500 text-4xl mb-2"></i>
              <h3>Отлично представяне!</h3>
              <p>Браво! Всички карти бяха успешно свързани и изчистени от полето!</p>
              <button type="button" class="btn-activity scattered-reset-btn mt-3">Нов опит</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Standard dropdown matching mode
  const conceptOptions = pairs.map((p, idx) =>
    `<option value="${idx}">${esc(p.concept)}</option>`
  ).join('');

  const rows = pairs.map((p, idx) => {
    return `
      <div class="matching-item" data-correct-index="${idx}">
        <div class="matching-def">
          <span class="matching-num">${idx + 1}</span>
          <span class="matching-def-text">${esc(p.definition)}</span>
        </div>
        <div class="matching-picker">
          <select class="matching-select" aria-label="Изберете съответстващо понятие">
            <option value="">-- Изберете понятие --</option>
            ${conceptOptions}
          </select>
          <span class="matching-status-ico"></span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="interactive-matching-card" id="${id}">
      <header class="interactive-matching-header">
        <h3>${esc(title)}</h3>
      </header>
      <div class="matching-list">
        ${rows}
      </div>
      <div class="matching-actions">
        <button type="button" class="btn-activity matching-submit">
          Провери
        </button>
        <button type="button" class="btn-activity matching-reset" style="display:none;">
          Нов опит
        </button>
      </div>
      <div class="matching-feedback" style="display:none;"></div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'interactive-matching';
  const root = document.getElementById(id);
  if (!root) return;

  const isScattered = root.classList.contains('scattered-matching-container') || root.querySelector('.scattered-board');

  if (isScattered) {
    const board = root.querySelector('.scattered-board');
    const countBadge = root.querySelector('.scattered-count-badge');
    const successBanner = root.querySelector('.scattered-success-banner');
    const resetBtns = root.querySelectorAll('.scattered-reset-btn');

    let selectedCard = null;
    let isAnimating = false;
    let totalPairs = root.querySelectorAll('.scattered-card').length / 2;
    let remainingPairs = totalPairs;

    const cards = root.querySelectorAll('.scattered-card');

    function checkPairMatch(card1, card2) {
      if (!card1 || !card2 || card1 === card2) return;

      const p1 = card1.getAttribute('data-pair-id');
      const p2 = card2.getAttribute('data-pair-id');

      isAnimating = true;

      if (p1 === p2) {
        // MATCH SUCCESS!
        card1.classList.add('card-matched-correct');
        card2.classList.add('card-matched-correct');

        setTimeout(() => {
          card1.classList.add('card-hidden');
          card2.classList.add('card-hidden');
          
          remainingPairs--;
          if (countBadge) countBadge.textContent = remainingPairs;

          selectedCard = null;
          isAnimating = false;

          if (remainingPairs <= 0) {
            if (successBanner) successBanner.style.display = 'flex';
          }
        }, 500);

      } else {
        // MATCH FAIL!
        card1.classList.add('card-matched-wrong');
        card2.classList.add('card-matched-wrong');

        setTimeout(() => {
          card1.classList.remove('card-selected', 'card-matched-wrong');
          card2.classList.remove('card-selected', 'card-matched-wrong');
          selectedCard = null;
          isAnimating = false;
        }, 700);
      }
    }

    cards.forEach(card => {
      // Click interaction
      card.addEventListener('click', () => {
        if (isAnimating || card.classList.contains('card-hidden')) return;

        if (selectedCard === null) {
          selectedCard = card;
          card.classList.add('card-selected');
        } else if (selectedCard === card) {
          selectedCard.classList.remove('card-selected');
          selectedCard = null;
        } else {
          card.classList.add('card-selected');
          checkPairMatch(selectedCard, card);
        }
      });

      // Drag and Drop interaction
      card.addEventListener('dragstart', (e) => {
        if (isAnimating || card.classList.contains('card-hidden')) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData('text/plain', card.getAttribute('data-card-id'));
        card.classList.add('card-dragging');
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('card-dragging');
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!card.classList.contains('card-hidden')) {
          card.classList.add('card-drag-over');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('card-drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('card-drag-over');
        
        const sourceCardId = e.dataTransfer.getData('text/plain');
        if (!sourceCardId) return;

        const sourceCard = root.querySelector(`.scattered-card[data-card-id="${sourceCardId}"]`);
        if (sourceCard && sourceCard !== card) {
          sourceCard.classList.add('card-selected');
          card.classList.add('card-selected');
          checkPairMatch(sourceCard, card);
        }
      });
    });

    resetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        remainingPairs = totalPairs;
        if (countBadge) countBadge.textContent = remainingPairs;
        if (successBanner) successBanner.style.display = 'none';

        selectedCard = null;
        isAnimating = false;

        const cardArray = Array.from(cards);
        cardArray.forEach(card => {
          card.classList.remove('card-selected', 'card-matched-correct', 'card-matched-wrong', 'card-hidden', 'card-dragging', 'card-drag-over');
        });

        // Reshuffle DOM nodes
        const shuffled = shuffleArray(cardArray);
        shuffled.forEach(card => board.appendChild(card));
      });
    });

    return;
  }

  // Standard dropdown init logic
  const submitBtn = root.querySelector('.matching-submit');
  const resetBtn = root.querySelector('.matching-reset');
  const feedback = root.querySelector('.matching-feedback');
  const items = root.querySelectorAll('.matching-item');
  const selects = root.querySelectorAll('.matching-select');

  if (!submitBtn || !resetBtn || !feedback) return;

  submitBtn.addEventListener('click', () => {
    let answered = 0;
    selects.forEach(s => { if (s.value !== '') answered++; });

    if (answered < selects.length) {
      feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, изберете понятие за всяко едно от определенията!';
      feedback.className = 'matching-feedback feedback-error';
      feedback.style.display = 'block';
      return;
    }

    let correctCount = 0;
    items.forEach(item => {
      const correctIdx = item.getAttribute('data-correct-index');
      const sel = item.querySelector('.matching-select');
      const ico = item.querySelector('.matching-status-ico');

      sel.disabled = true;

      if (sel.value === correctIdx) {
        correctCount++;
        item.classList.add('match-correct');
        item.classList.remove('match-incorrect');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-check text-emerald-600"></i>';
      } else {
        item.classList.add('match-incorrect');
        item.classList.remove('match-correct');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-xmark text-rose-600"></i>';
      }
    });

    feedback.textContent = `Резултат ${correctCount} от ${items.length}`;
    feedback.className = `matching-feedback ${correctCount === items.length ? 'feedback-success' : 'feedback-info'}`;

    feedback.style.display = 'block';
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';
  });

  resetBtn.addEventListener('click', () => {
    items.forEach(item => {
      item.classList.remove('match-correct', 'match-incorrect');
      const sel = item.querySelector('.matching-select');
      if (sel) { sel.value = ''; sel.disabled = false; }
      const ico = item.querySelector('.matching-status-ico');
      if (ico) ico.innerHTML = '';
    });

    feedback.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';
  });
}
