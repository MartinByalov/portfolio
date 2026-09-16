// Lesson accordion component

import { initAccordion } from './accordion-behavior.js';
import { renderRichBlock } from './lesson-media.js';
import { getCleanMediaInfo } from '../utils/media.js';
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
import * as SearchMissionLab from './search-mission-lab.js';
import * as InteractiveTimelineMachine from './interactive-timeline-machine.js';
import * as InventorInvestigationCards from './inventor-investigation-cards.js';
import * as GenerationHardwareSorter from './generation-hardware-sorter.js';
import * as AppleVsPravetzComparator from './apple-vs-pravetz-comparator.js';
import * as Infographic from './infographic.js';
import * as Tag from './tag.js';
import { renderComponent, initComponent } from '../renderer/registry.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

// Nested content blocks

function renderImageBlock(b) {
  return '<figure class="lb-image">'
    + '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy" onerror="if(this.src.includes(\'cdn.jsdelivr.net\')){this.src=this.src.replace(\'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\',\'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\');}">'
    + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '')
    + '</figure>';
}

function getCleanDescription(desc) {
  if (!desc) return '';
  return String(desc).replace(/(?:[\.\,\s\-\—]*)(?:\(|\[)?(?:Файл|файл|File|file):\s*([a-zA-Z0-9_\-\.\/]+)(?:\)|\])?/gi, '').trim();
}

function renderImagePlaceholderBlock(b) {
  const label = b.label || b.title || 'Място за екранна снимка';
  const desc = b.description || b.desc || '';
  const cleanDesc = getCleanDescription(desc);
  const icon = b.icon || 'fas fa-image';
  const stepText = b.step || b.badge || 'Екранна снимка (Placeholder)';
  const rawPath = b.src || b.path || b.fileName || '';
  const isMini = b.size === 'mini' || b.variant === 'mini' || b.size === 'compact' || b.variant === 'compact';
  const isFloat = b.float === 'right' || b.align === 'right';

  const { fullPath, relativePath, fileName } = getCleanMediaInfo(rawPath);
  const displayTitle = fileName && !label.includes(fileName) ? (label + ' - ' + fileName) : label;
  const displayFile = relativePath || fileName;

  if (isMini) {
    const wrapClass = isFloat ? 'lesson-media-float' : 'lesson-inline-media-wrap';
    const wrapStyle = isFloat ? '' : 'margin: 1rem 0; max-width: 260px;';
    return '<div class="' + wrapClass + '"' + (wrapStyle ? ' style="' + wrapStyle + '"' : '') + '>'
      + '<div class="lesson-inline-media-card">'
      + (rawPath ? '<img src="' + esc(fullPath || rawPath) + '" alt="' + esc(label) + '" loading="eager" class="lesson-placeholder-img" onload="const c = this.closest(\'.lesson-inline-media-card\'); if(c){ c.classList.add(\'image-loaded\'); c.classList.remove(\'image-failed\'); }" onerror="const c = this.closest(\'.lesson-inline-media-card\'); if(this.src && this.src.includes(\'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\')){ this.src = this.src.replace(\'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\', \'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\'); } else if(this.src && this.src.includes(\'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\')){ this.src = this.src.replace(\'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\', \'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\'); } else { if(c){ c.classList.remove(\'image-loaded\'); c.classList.add(\'image-failed\'); } }">' : '')
      + '<div class="lesson-micro-placeholder-box">'
      + '<span class="lesson-micro-badge"><i class="' + esc(icon) + '"></i> ' + esc(stepText) + '</span>'
      + '<div class="lesson-micro-title">' + esc(displayTitle) + '</div>'
      + (displayFile ? '<div class="lesson-micro-path" title="Очакван файл: ' + esc(displayFile) + '"><i class="fas fa-file-image" style="margin-right: 4px;"></i>' + esc(fileName || displayFile) + '</div>' : '')
      + '</div>'
      + ((cleanDesc || displayFile) ? '<div class="lesson-micro-caption">' + (cleanDesc ? esc(cleanDesc) : '') + (fileName ? '<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ' + esc(fileName) + '</span>' : '') + '</div>' : '')
      + '</div>'
      + '</div>';
  }

  return '<figure class="lb-image image-placeholder-wrapper" style="margin: 1.5rem 0; text-align: center;">'
    + (rawPath ? '<img src="' + esc(fullPath || rawPath) + '" alt="' + esc(label) + '" loading="eager" class="lesson-placeholder-img" onload="const c = this.closest(\'.image-placeholder-wrapper\'); if(c){ c.classList.add(\'image-loaded\'); c.classList.remove(\'image-failed\'); }" onerror="const c = this.closest(\'.image-placeholder-wrapper\'); if(this.src && this.src.includes(\'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\')){ this.src = this.src.replace(\'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\', \'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\'); } else if(this.src && this.src.includes(\'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\')){ this.src = this.src.replace(\'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\', \'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\'); } else { if(c){ c.classList.remove(\'image-loaded\'); c.classList.add(\'image-failed\'); } }">' : '')
    + '<div class="lesson-image-placeholder">'
    + '<div class="placeholder-badge"><i class="fas fa-camera"></i> ' + esc(stepText)
    + (fileName ? ' <span class="placeholder-filename-badge" style="margin-left: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; text-transform: none; color: #1e40af; background: #dbeafe; padding: 2px 8px; border-radius: 4px; border: 1px solid #bfdbfe;"><i class="fas fa-file-image" style="margin-right: 4px;"></i>' + esc(fileName) + '</span>' : '')
    + '</div>'
    + '<div class="placeholder-body">'
    + '<div class="placeholder-icon-wrap"><i class="' + esc(icon) + '"></i></div>'
    + '<div class="placeholder-text-wrap">'
    + '<h4 class="placeholder-heading">' + esc(displayTitle) + '</h4>'
    + (desc ? '<p class="placeholder-desc">' + esc(desc) + '</p>' : '')
    + (displayFile ? '<div class="placeholder-file-path" style="margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.84rem; font-weight: 600; color: #334155; background: #e2e8f0; padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1;"><i class="fas fa-file-image" style="color: #64748b;"></i> <span>Очакван файл:</span> <code style="color: #0f172a; background: #ffffff; padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">' + esc(displayFile) + '</code></div>' : '')
    + '</div>'
    + '</div>'
    + '</div>'
    + (label || cleanDesc ? '<figcaption class="image-placeholder-caption" style="margin-top: 0.6rem; font-size: 0.88rem; color: #64748b;"><strong>' + esc(label) + '</strong>' + (cleanDesc ? ' – ' + esc(cleanDesc) : '') + (fileName ? '<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ' + esc(fileName) + '</span>' : '') + '</figcaption>' : '')
    + '</figure>';
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
    if (/^<(h[1-6]|p|div|ul|ol|table|blockquote|figure)/i.test(b)) return b;
    return '<p>' + b.replace(/\n/g, '<br>') + '</p>';
  });
  return blocks.join('');
}

function renderBlock(b) {
  switch (b.type) {
    case 'text':                   
      const toneCls = b.tone ? ' lb-tone-' + esc(b.tone) : '';
      return '<div class="lb-text' + toneCls + '">' + formatMarkdown(b.content || '') + '</div>';
    case 'feature-list':           return renderFeatureListBlock(b);
    case 'discussion':             return renderDiscussionBlock(b);
    case 'image':                  return renderImageBlock(b);
    case 'image-placeholder':      return renderImagePlaceholderBlock(b);
    case 'image-gallery':          return renderGalleryBlock(b);
    case 'visualization':          return b.visualType ? renderRichBlock(b) : renderVizBlock(b);
    case 'infographic':            return b.sections ? Infographic.render(b) : renderRichBlock(b);
    case 'ui-mockup':
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
    case 'search-mission-lab':     return SearchMissionLab.render(b);
    case 'interactive-timeline-machine': return InteractiveTimelineMachine.render(b);
    case 'inventor-investigation-cards': return InventorInvestigationCards.render(b);
    case 'generation-hardware-sorter':    return GenerationHardwareSorter.render(b);
    case 'apple-vs-pravetz-comparator':   return AppleVsPravetzComparator.render(b);
    case 'tag':                    return Tag.render(b);
    case 'accordion':              return render(b);
    default:                       return renderComponent(b);
  }
}

// Component renderer

let hasFirstAccordionRendered = false;

export function resetAccordionState() {
  hasFirstAccordionRendered = false;
}

export function render(comp) {
  const isFirstOnPage = !hasFirstAccordionRendered;
  hasFirstAccordionRendered = true;

  const startClosed = comp.options && comp.options.startClosed === true;
  const items = (comp.items || []).map((it, i) => {
    const toneCls = it.tone ? ' tone-' + esc(it.tone) : '';
    const variantCls = it.variant ? ' tag-' + esc(it.variant) : '';
    const toneIco = it.tone && it.icon
      ? '<span class="acc-tone-ico"><i class="' + esc(it.icon) + '"></i></span>'
      : '';
    const isActive = it.defaultOpen === true || (isFirstOnPage && !startClosed && it.defaultOpen !== false && i === 0);
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

function initBlock(b, root) {
  if (!b) return;
  initComponent(b);
  if (b.type === 'quiz' && b.id) initQuizBlock(root, b);
  if (b.type === 'accordion') init(b);
  if (b.type === 'subsection' && Array.isArray(b.content)) {
    b.content.forEach(subB => initBlock(subB, root));
  }
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;
  const accordion = root.querySelector('.accordion');
  const singleOpen = comp.options && comp.options.singleOpen === true;
  initAccordion(accordion, { singleOpen });

  // sync inline display with the pre-rendered .active class (first item open)
  accordion.querySelectorAll('.accordion-item').forEach(item => {
    const content = item.querySelector('.accordion-content');
    if (content) content.style.display = item.classList.contains('active') ? 'block' : 'none';
  });

  // wire up embedded interactive blocks inside items' content
  (comp.items || []).forEach(it => {
    (it.content || []).forEach(b => initBlock(b, root));
  });
}