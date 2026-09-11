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
  'interactive-fill': InteractiveFill,
  'interactive-step-guide': InteractiveStepGuide,
  'mood-animal-generator': MoodAnimalGenerator,
  'resource-download-box': ResourceDownloadBox,
  'drag-and-drop': DragAndDrop,
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
