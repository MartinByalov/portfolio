// Lesson accordion component

import { initAccordion } from './accordion-behavior.js';
import { renderRichBlock } from './lesson-media.js';
import * as InteractiveMatching from './interactive-matching.js';
import * as InteractiveFill from './interactive-fill.js';
import * as InteractiveStepGuide from './interactive-step-guide.js';
import * as MoodAnimalGenerator from './mood-animal-generator.js';
import * as Emotiometer from './emotiometer.js';
import * as ResourceDownloadBox from './resource-download-box.js';
import * as DragAndDrop from './drag-and-drop.js';
import * as UiHotspots from './ui-hotspots.js';
import * as SpotTheBug from './spot-the-bug.js';
import * as InteractiveChecklist from './interactive-checklist.js';
import * as TrueFalseSwipe from './true-false-swipe.js';
import * as WildcardVisualizer from './wildcard-visualizer.js';
import * as VennLogicDiagram from './venn-logic-diagram.js';
import * as BeforeAfterSlider from './before-after-slider.js';
import * as QueryBuilder from './query-builder.js';
import * as LiveSearchSandbox from './live-search-sandbox.js';
import * as CategorySorter from './category-sorter.js';
import * as ImageWithInstruction from './image-with-instruction.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

// Nested content blocks

function renderImageBlock(b) {
  return '<figure class="lb-image">'
    + '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy">'
    + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '')
    + '</figure>';
}

function renderImagePlaceholderBlock(b) {
  const label = b.label || b.title || 'Място за екранна снимка';
  const desc = b.description || b.desc || '';
  const icon = b.icon || 'fas fa-image';
  const step = b.step ? '<span class="placeholder-step">' + esc(b.step) + '</span>' : '';
  return '<div class="lesson-image-placeholder">'
    + '<div class="placeholder-badge"><i class="fas fa-camera"></i> ' + (step || 'Екранна снимка (Placeholder)') + '</div>'
    + '<div class="placeholder-body">'
    + '<div class="placeholder-icon-wrap"><i class="' + esc(icon) + '"></i></div>'
    + '<div class="placeholder-text-wrap">'
    + '<h4 class="placeholder-heading">' + esc(label) + '</h4>'
    + (desc ? '<p class="placeholder-desc">' + esc(desc) + '</p>' : '')
    + '</div>'
    + '</div>'
    + '</div>';
}

function renderGalleryBlock(b) {
  const figs = (b.items || []).map(g =>
    '<figure class="lb-gallery-item">'
    + '<img src="' + esc(g.src) + '" alt="' + esc(g.alt || '') + '" loading="lazy">'
    + (g.title ? '<figcaption>' + esc(g.title) + '</figcaption>' : '')
    + '</figure>'
  ).join('');
  return '<div class="lb-gallery">'
    + (b.title ? '<div class="lb-gallery-title">' + esc(b.title) + '</div>' : '')
    + '<div class="lb-gallery-grid">' + figs + '</div>'
    + '</div>';
}

function renderVizBlock(b) {
  const d = b.diagram || {};
  const nodes = d.nodes || b.nodes || b.steps || [];
  const flow = d.flow || b.flow || '';
  const layout = d.layout || b.layout || 'flow';
  const split = layout === 'split';

  const nodeHtml = nodes.map((n, i) => {
    const img = n.image
      ? '<div class="viz-node-img"><img src="' + esc(n.image) + '" alt="' + esc(n.label || '') + '" loading="lazy"></div>'
      : '';
    return '<div class="viz-node step-pop" style="animation-delay:' + (i * 140) + 'ms">'
      + img
      + '<div class="viz-node-label">' + esc(n.label || '') + '</div>'
      + (n.description ? '<div class="viz-node-desc">' + esc(n.description) + '</div>' : '')
      + '</div>';
  }).join(split ? '' : '<div class="viz-link">&#8594;</div>');

  return '<div class="lb-viz"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>'
    + (b.title ? '<div class="lb-viz-title">' + esc(b.title) + '</div>' : '')
    + (flow ? '<div class="viz-flow">' + esc(flow) + '</div>' : '')
    + '<div class="viz-nodes' + (split ? ' split' : '') + '">' + nodeHtml + '</div>'
    + '</div>';
}

function renderSubsectionBlock(b) {
  const inner = (b.content || []).map(renderBlock).join('');
  return '<div class="lb-subsection">'
    + (b.heading ? '<h4 class="lb-subsection-heading">' + esc(b.heading) + '</h4>' : '')
    + inner
    + '</div>';
}

function renderFeatureListBlock(b) {
  const items = (b.items || []).map(it =>
    '<li><i class="fas fa-check"></i><span>' + esc(it) + '</span></li>'
  ).join('');
  return '<div class="lb-feature-list"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>'
    + (b.title ? '<div class="lb-feature-title">' + esc(b.title) + '</div>' : '')
    + '<ul class="lb-feature-items">' + items + '</ul>'
    + (b.advantage ? '<div class="lb-feature-advantage"><span>' + esc(b.advantage) + '</span></div>' : '')
    + '</div>';
}

function renderDiscussionBlock(b) {
  const paras = (b.paragraphs && b.paragraphs.length ? b.paragraphs : (b.text ? [b.text] : []));
  const html = paras.map(p => '<p>' + esc(p) + '</p>').join('');
  const showBadge = b.title !== '' && b.title !== null && b.title !== false;
  const badgeHtml = showBadge
    ? '<div class="lb-discussion-badge"><i class="fas fa-comments"></i><span>' + esc(b.title || 'Дискусия') + '</span></div>'
    : '';
  return '<div class="lb-discussion"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>'
    + badgeHtml
    + '<div class="lb-discussion-body">' + html + '</div>'
    + '</div>';
}

function renderQuizBlock(b) {
  const questions = (b.questions || []).map((q, qi) => {
    const options = (q.options || []).map((opt, oi) =>
      '<label>'
      + '<input type="radio" name="' + esc(b.id || 'quiz') + '-q' + qi + '" value="' + oi + '">'
      + esc(opt)
      + '</label>'
    ).join('');

    const qText = /^\d+[\.\)]\s*/.test(q.question) ? esc(q.question) : (qi + 1) + '. ' + esc(q.question);
    const expl = q.explanation
      ? '<div class="quiz-explanation" style="display:none;"><i class="fas fa-lightbulb"></i> <span>' + esc(q.explanation) + '</span></div>'
      : '';

    return '<div class="quiz-question" data-correct="' + esc(q.correctIndex) + '">'
      + '<p class="quiz-question-text">' + qText + '</p>'
      + '<div class="quiz-options">' + options + '</div>'
      + expl
      + '</div>';
  }).join('');

  return '<form class="quiz-form"' + (b.id ? ' id="' + esc(b.id) + '-form"' : '') + '>'
    + (b.title ? '<h4 class="quiz-block-title">' + esc(b.title) + '</h4>' : '')
    + questions
    + '<div class="quiz-actions">'
    + '<button type="button" class="btn-activity quiz-submit">Провери</button>'
    + '<button type="button" class="btn-activity quiz-reset" style="display:none;">Нов опит</button>'
    + '</div>'
    + '<div class="quiz-result" style="display:none;"></div>'
    + '</form>';
}

function initQuizBlock(root, b) {
  // Find quiz scope matching rendered element id
  const scope = b.id
    ? (root.querySelector('#' + CSS.escape(b.id)) || root.querySelector('#' + CSS.escape(b.id + '-form')) || root)
    : root;
  if (!scope) return;
  const form = scope.tagName === 'FORM' ? scope : scope.querySelector('.quiz-form');
  if (!form) return;

  const submitBtn = form.querySelector('.quiz-submit');
  const resetBtn = form.querySelector('.quiz-reset');
  const resultBox = form.querySelector('.quiz-result');
  const questions = form.querySelectorAll('.quiz-question');
  if (!submitBtn || !resetBtn || !resultBox) return;

  const showResult = (text, type) => {
    resultBox.textContent = text;
    resultBox.style.display = 'block';
    resultBox.className = 'quiz-result quiz-result-' + type;
  };

  submitBtn.addEventListener('click', () => {
    const formData = new FormData(form);
    let answered = 0;
    questions.forEach(q => {
      const name = q.querySelector('input').name;
      if (formData.has(name)) answered++;
    });

    if (answered < questions.length) {
      showResult('Моля, отговорете на всички въпроси преди проверка!', 'error');
      return;
    }

    let score = 0;
    questions.forEach(q => {
      const correct = q.dataset.correct;
      const name = q.querySelector('input').name;
      const userChoice = formData.get(name);

      q.querySelectorAll('label').forEach(label => {
        const input = label.querySelector('input');
        label.classList.remove('correct', 'incorrect');
        if (input.value === correct) label.classList.add('correct');
        if (input.checked && input.value !== correct) label.classList.add('incorrect');
        input.disabled = true;
      });

      if (userChoice === correct) score++;
      const expl = q.querySelector('.quiz-explanation');
      if (expl) expl.style.display = 'flex';
    });

    showResult('Резултат: ' + score + ' от ' + questions.length + ' верни.', 'info');
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    questions.forEach(q => {
      q.querySelectorAll('label').forEach(label => {
        label.classList.remove('correct', 'incorrect');
        label.querySelector('input').disabled = false;
      });
      const expl = q.querySelector('.quiz-explanation');
      if (expl) expl.style.display = 'none';
    });
    resultBox.style.display = 'none';
    submitBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
  });
}

function formatMarkdown(text) {
  if (!text) return '';
  let s = String(text);
  s = s.replace(/### (.*?)(?:\n|$)/g, '<h4 class="wb-task-heading">$1</h4>\n');
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
  const blocks = s.split(/\n\s*\n/).map(b => {
    b = b.trim();
    if (!b) return '';
    if (/^<h[1-6]/.test(b)) return b;
    return '<p>' + b.replace(/\n/g, '<br>') + '</p>';
  });
  return blocks.join('');
}

function renderBlock(b) {
  switch (b.type) {
    case 'text':                   return '<div class="lb-text">' + formatMarkdown(b.content || '') + '</div>';
    case 'feature-list':           return renderFeatureListBlock(b);
    case 'discussion':             return renderDiscussionBlock(b);
    case 'image':                  return renderImageBlock(b);
    case 'image-placeholder':      return renderImagePlaceholderBlock(b);
    case 'image-gallery':          return renderGalleryBlock(b);
    case 'visualization':          return b.visualType ? renderRichBlock(b) : renderVizBlock(b);
    case 'ui-mockup':
    case 'infographic':
    case 'table':
    case 'glossary-list':
    case 'titled-image':
    case 'media-types':
    case 'video':                  return renderRichBlock(b);
    case 'subsection':             return renderSubsectionBlock(b);
    case 'quiz':                   return renderQuizBlock(b);
    case 'interactive-matching':
    case 'scattered-matching':
    case 'match-pairs':            return InteractiveMatching.render(b);
    case 'interactive-fill':       return InteractiveFill.render(b);
    case 'interactive-step-guide': return InteractiveStepGuide.render(b);
    case 'emotiometer':            return Emotiometer.render(b);
    case 'mood-animal-generator':  return MoodAnimalGenerator.render(b);
    case 'ui-hotspots':            return UiHotspots.render(b);
    case 'spot-the-bug':           return SpotTheBug.render(b);
    case 'interactive-checklist':  return InteractiveChecklist.render(b);
    case 'true-false-swipe':       return TrueFalseSwipe.render(b);
    case 'resource-download-box':  return ResourceDownloadBox.render(b);
    case 'drag-and-drop':          return DragAndDrop.render(b);
    case 'wildcard-visualizer':    return WildcardVisualizer.render(b);
    case 'venn-logic-diagram':     return VennLogicDiagram.render(b);
    case 'before-after-slider':    return BeforeAfterSlider.render(b);
    case 'query-builder':          return QueryBuilder.render(b);
    case 'live-search-sandbox':    return LiveSearchSandbox.render(b);
    case 'category-sorter':        return CategorySorter.render(b);
    case 'image-with-instruction': return ImageWithInstruction.render(b);
    default:                       return '<!-- unknown lesson block type: ' + esc(b.type) + ' -->';
  }
}

// Component renderer

export function render(comp) {
  const startClosed = comp.options && comp.options.startClosed === true;
  const items = (comp.items || []).map((it, i) => {
    const toneCls = it.tone ? ' tone-' + esc(it.tone) : '';
    const variantCls = it.variant ? ' tag-' + esc(it.variant) : '';
    const toneIco = it.tone && it.icon
      ? '<span class="acc-tone-ico"><i class="' + esc(it.icon) + '"></i></span>'
      : '';
    const isActive = it.defaultOpen === true || (!startClosed && it.defaultOpen !== false && i === 0);
    return '<div class="accordion-item' + (isActive ? ' active' : '') + toneCls + variantCls + '"'
      + (it.id ? ' id="' + esc(it.id) + '"' : '') + '>'
      + '<div class="accordion-header">'
      + toneIco
      + '<span class="card-title">' + esc(it.title || '') + '</span>'
      + '<i class="fas fa-chevron-down card-icon-mini"></i>'
      + '</div>'
      + '<div class="accordion-content">'
      + (it.content || []).map(renderBlock).join('')
      + '</div>'
      + '</div>';
  }).join('');

  const align = (comp.options && comp.options.titleAlign) || 'left';
  const stretch = comp.options && comp.options.itemsAlign === 'stretch';

  return '<section class="component accordion' + (stretch ? ' items-stretch' : '') + '"'
    + ' data-title-align="' + esc(align) + '"'
    + ' id="' + esc(comp.id || '') + '">'
    + (comp.heading ? '<h2 class="component-heading">' + esc(comp.heading) + '</h2>' : '')
    + '<div class="accordion">' + items + '</div>'
    + '</section>';
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;
  const accordion = root.querySelector('.accordion');
  const singleOpen = !(comp.options && comp.options.singleOpen === false);
  initAccordion(accordion, { singleOpen });

  // sync inline display with the pre-rendered .active class (first item open)
  accordion.querySelectorAll('.accordion-item').forEach(item => {
    const content = item.querySelector('.accordion-content');
    if (content) content.style.display = item.classList.contains('active') ? 'block' : 'none';
  });

  // wire up embedded interactive blocks inside items' content
  (comp.items || []).forEach(it => {
    (it.content || []).forEach(b => {
      if (!b) return;
      if (b.type === 'quiz' && b.id) initQuizBlock(root, b);
      if (b.type === 'interactive-matching' || b.type === 'scattered-matching' || b.type === 'match-pairs') InteractiveMatching.init(b);
      if (b.type === 'interactive-fill') InteractiveFill.init(b);
      if (b.type === 'interactive-step-guide') InteractiveStepGuide.init(b);
      if (b.type === 'emotiometer') Emotiometer.init(b);
      if (b.type === 'mood-animal-generator') MoodAnimalGenerator.init(b);
      if (b.type === 'ui-hotspots') UiHotspots.init(b);
      if (b.type === 'spot-the-bug') SpotTheBug.init(b);
      if (b.type === 'interactive-checklist') InteractiveChecklist.init(b);
      if (b.type === 'true-false-swipe') TrueFalseSwipe.init(b);
      if (b.type === 'resource-download-box') ResourceDownloadBox.init(b);
      if (b.type === 'drag-and-drop') DragAndDrop.init(b);
      if (b.type === 'wildcard-visualizer') WildcardVisualizer.init(b);
      if (b.type === 'venn-logic-diagram') VennLogicDiagram.init(b);
      if (b.type === 'before-after-slider') BeforeAfterSlider.init(b);
      if (b.type === 'query-builder') QueryBuilder.init(b);
      if (b.type === 'live-search-sandbox') LiveSearchSandbox.init(b);
      if (b.type === 'category-sorter') CategorySorter.init(b);
      if (b.type === 'image-with-instruction') ImageWithInstruction.init(b);
    });
  });
}