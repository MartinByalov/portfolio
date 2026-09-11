/* renderer/registry.js
   Single place that maps a lesson component's "type" to the module that
   knows how to render and initialize it. Adding a new component type to
   the platform means: write components/your-type.js, register it here.
*/

import * as TextGroup from '../components/text-group.js';
import * as AnimatedDiagram from '../components/animated-diagram.js';
import * as Activities from '../components/activities.js';
import * as ExerciseModal from '../components/exercise-modal.js';
import * as Quiz from '../components/quiz.js';
import * as Accordion from '../components/accordion.js';
import * as Tag from '../components/tag.js';

const registry = {
  'text-group': TextGroup,
  'animated-diagram': AnimatedDiagram,
  'activities': Activities,
  'exercise-modal': ExerciseModal,
  'quiz': Quiz,
  'accordion': Accordion,
  'tag': Tag,
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
