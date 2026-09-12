// Registry mapping lesson component types to renderers

import * as TextGroup from '../components/text-group.js';
import * as AnimatedDiagram from '../components/animated-diagram.js';
import * as Activities from '../components/activities.js';
import * as ExerciseModal from '../components/exercise-modal.js';
import * as Quiz from '../components/quiz.js';
import * as Accordion from '../components/accordion.js';
import * as Tag from '../components/tag.js';
import * as ExitTicket from '../components/exit-ticket.js';
import * as InteractiveMatching from '../components/interactive-matching.js';
import * as InteractiveFill from '../components/interactive-fill.js';
import * as InteractiveStepGuide from '../components/interactive-step-guide.js';
import * as MoodAnimalGenerator from '../components/mood-animal-generator.js';
import * as ResourceDownloadBox from '../components/resource-download-box.js';
import * as DragAndDrop from '../components/drag-and-drop.js';
import * as ImagePlaceholder from '../components/image-placeholder.js';
import * as UiHotspots from '../components/ui-hotspots.js';
import * as SpotTheBug from '../components/spot-the-bug.js';
import * as InteractiveChecklist from '../components/interactive-checklist.js';
import * as TrueFalseSwipe from '../components/true-false-swipe.js';
import * as WildcardVisualizer from '../components/wildcard-visualizer.js';
import * as VennLogicDiagram from '../components/venn-logic-diagram.js';
import * as BeforeAfterSlider from '../components/before-after-slider.js';
import * as QueryBuilder from '../components/query-builder.js';
import * as LiveSearchSandbox from '../components/live-search-sandbox.js';
import * as CategorySorter from '../components/category-sorter.js';
import * as ImageWithInstruction from '../components/image-with-instruction.js';

const registry = {
  'text-group': TextGroup,
  'animated-diagram': AnimatedDiagram,
  'activities': Activities,
  'exercise-modal': ExerciseModal,
  'quiz': Quiz,
  'accordion': Accordion,
  'tag': Tag,
  'exit-ticket': ExitTicket,
  'interactive-matching': InteractiveMatching,
  'match-pairs': InteractiveMatching,
  'interactive-fill': InteractiveFill,
  'interactive-step-guide': InteractiveStepGuide,
  'mood-animal-generator': MoodAnimalGenerator,
  'resource-download-box': ResourceDownloadBox,
  'drag-and-drop': DragAndDrop,
  'ui-hotspots': UiHotspots,
  'spot-the-bug': SpotTheBug,
  'interactive-checklist': InteractiveChecklist,
  'true-false-swipe': TrueFalseSwipe,
  'wildcard-visualizer': WildcardVisualizer,
  'venn-logic-diagram': VennLogicDiagram,
  'before-after-slider': BeforeAfterSlider,
  'query-builder': QueryBuilder,
  'live-search-sandbox': LiveSearchSandbox,
  'category-sorter': CategorySorter,
  'image-with-instruction': ImageWithInstruction,
};

export function renderComponent(comp) {
  const mod = registry[comp.type];
  if (!mod) {
    console.warn(`[renderer] Unknown component type: "${comp.type}"`);
    return `<!-- unknown component type: ${comp.type} -->`;
  }
  return mod.render(comp);
}

export function initComponent(comp) {
  const mod = registry[comp.type];
  if (mod && typeof mod.init === 'function') mod.init(comp);
}
