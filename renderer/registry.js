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
import * as ConceptMediaGrid from '../components/concept-media-grid.js';
import * as PortSelectionChallenge from '../components/port-selection-challenge.js';
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
import * as SearchMissionLab from '../components/search-mission-lab.js';
import * as InteractiveTimelineMachine from '../components/interactive-timeline-machine.js';
import * as InventorInvestigationCards from '../components/inventor-investigation-cards.js';
import * as GenerationHardwareSorter from '../components/generation-hardware-sorter.js';
import * as AppleVsPravetzComparator from '../components/apple-vs-pravetz-comparator.js';
import * as Visualization from '../components/visualization.js';
import * as InteractiveTimeline from '../components/interactive-timeline.js';
import * as ImageGallery from '../components/image-gallery.js';
import * as TitledImage from '../components/titled-image.js';
import * as Timeline from '../components/timeline.js';
import * as Infographic from '../components/infographic.js';
import * as HistoryDetectiveCase from '../components/history-detective-case.js';
import * as VisualHook from '../components/visual-hook.js';
import * as InteractiveEvolutionMap from '../components/interactive-evolution-map.js';
import * as VisualStory from '../components/visual-story.js';
import * as InteractiveWorkbench from '../components/interactive-workbench.js';
import * as InteractiveCutaway from '../components/interactive-cutaway.js';
import * as InteractiveCodeStory from '../components/interactive-code-story.js';
import * as TechnologyComparison from '../components/technology-comparison.js';
import * as InteractiveSystem from '../components/interactive-system.js';
import * as InteractiveScale from '../components/interactive-scale.js';
import * as ScaleComparison from '../components/scale-comparison.js';
import * as InteractiveChain from '../components/interactive-chain.js';
import * as Mission from '../components/mission.js';
import * as AdaptiveQuiz from '../components/adaptive-quiz.js';
import * as TextBlock from '../components/text.js';
import * as InteractiveCards from '../components/interactive-cards.js';
import * as InteractiveDiagram from '../components/interactive-diagram.js';
import * as GlossaryList from '../components/glossary-list.js';
import * as SystemBuilderLab from '../components/system-builder-lab.js';
import * as SystemAnatomyMap from '../components/system-anatomy-map.js';
import * as SequenceBuilder from '../components/sequence-builder.js';
import * as SessionReconstructor from '../components/session-reconstructor.js';
import * as OsArchitectureStack from '../components/os-architecture-stack.js';
import * as OsSubsystemsWorkbench from '../components/os-subsystems-workbench.js';
import * as OsTerminalLab from '../components/os-terminal-lab.js';
import * as OsEcosystemMatrix from '../components/os-ecosystem-matrix.js';
import * as OsTaskManagerSandbox from '../components/os-task-manager-sandbox.js';
import * as MobileSocAnatomy from '../components/mobile-soc-anatomy.js';
import * as MobileSensorLab from '../components/mobile-sensor-lab.js';
import * as MobileConnectivityWorkbench from '../components/mobile-connectivity-workbench.js';
import * as MobileDeviceProfiler from '../components/mobile-device-profiler.js';
import * as MobileTransferCalculator from '../components/mobile-transfer-calculator.js';
import * as MobilePermissionsAuditor from '../components/mobile-permissions-auditor.js';
import * as MobileBatteryOptimizer from '../components/mobile-battery-optimizer.js';
import * as Overview from '../components/overview.js';
import * as StepHeader from '../components/step-header.js';
import * as StepBlock from '../components/step-block.js';
import * as It10Sandbox from '../components/it10-sandbox.js';
import * as EntryLevelQuiz from '../components/entry-level-quiz.js';
import * as IframeViewer from '../components/iframe-viewer.js';

// IT 8 — Урок 2.6
import * as PeripheralInstallLab from '../components/peripheral-install-lab.js';
import * as SystemTriadWorkbench from '../components/system-triad-workbench.js';
import * as MillionaireQuiz from '../components/millionaire-quiz.js';


const registry = {
  'millionaire-quiz': MillionaireQuiz,
  'system-triad-workbench': SystemTriadWorkbench,
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
  'search-mission-lab': SearchMissionLab,

  'interactive-timeline-machine': InteractiveTimelineMachine,
  'inventor-investigation-cards': InventorInvestigationCards,
  'generation-hardware-sorter': GenerationHardwareSorter,
  'apple-vs-pravetz-comparator': AppleVsPravetzComparator,

  'visualization': Visualization,
  'interactive-timeline': InteractiveTimeline,
  'image-gallery': ImageGallery,

  'titled-image': TitledImage,
  'image': TitledImage,

  'timeline': Timeline,
  'infographic': Infographic,

  'history-detective-case': HistoryDetectiveCase,
  'investigation': HistoryDetectiveCase,

  'visual-hook': VisualHook,
  'interactive-evolution-map': InteractiveEvolutionMap,
  'visual-story': VisualStory,
  'interactive-workbench': InteractiveWorkbench,
  'interactive-cutaway': InteractiveCutaway,
  'interactive-code-story': InteractiveCodeStory,
  'technology-comparison': TechnologyComparison,
  'interactive-system': InteractiveSystem,
  'interactive-scale': InteractiveScale,
  'scale-comparison': ScaleComparison,
  'interactive-chain': InteractiveChain,

  'mission': Mission,
  'adaptive-quiz': AdaptiveQuiz,

  'text': TextBlock,

  'interactive-cards': InteractiveCards,
  'interactive-diagram': InteractiveDiagram,
  'glossary-list': GlossaryList,

  'system-anatomy-map': SystemAnatomyMap,
  'system-builder-lab': SystemBuilderLab,
  'sequence-builder': SequenceBuilder,
  'session-reconstructor': SessionReconstructor,

  'image-placeholder': ImagePlaceholder,
  'concept-media-grid': ConceptMediaGrid,
  'port-selection-challenge': PortSelectionChallenge,

  'os-architecture-stack': OsArchitectureStack,
  'os-subsystems-workbench': OsSubsystemsWorkbench,
  'os-terminal-lab': OsTerminalLab,
  'os-ecosystem-matrix': OsEcosystemMatrix,
  'os-task-manager-sandbox': OsTaskManagerSandbox,

  'mobile-soc-anatomy': MobileSocAnatomy,
  'mobile-sensor-lab': MobileSensorLab,
  'mobile-connectivity-workbench': MobileConnectivityWorkbench,
  'mobile-device-profiler': MobileDeviceProfiler,
  'mobile-transfer-calculator': MobileTransferCalculator,
  'mobile-permissions-auditor': MobilePermissionsAuditor,
  'mobile-battery-optimizer': MobileBatteryOptimizer,

  'overview': Overview,

  'step-header': StepHeader,
  'sh': StepHeader,

  'step-block': StepBlock,

  'it10-sandbox': It10Sandbox,
  'live-sandbox-block': It10Sandbox,

  'entry-level-quiz': EntryLevelQuiz,

  'iframe-viewer': IframeViewer,
  'sheet-embed': IframeViewer,
  'iframe': IframeViewer,
  'document-viewer': IframeViewer,
  'embed': IframeViewer,

  // IT 8 — Урок 2.6
  'peripheral-install-lab': PeripheralInstallLab,
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

  if (mod && typeof mod.init === 'function') {
    mod.init(comp);
  }
}