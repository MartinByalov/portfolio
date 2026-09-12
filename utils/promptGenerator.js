// Educational Realistic Image Prompt Generator
// Analyzes educational terms & glossary definitions to produce strictly photorealistic photography prompts.

import { GoogleGenAI } from '@google/genai';

export const STANDARD_NEGATIVE_PROMPT =
  'cartoon, anime, illustration, 3d render, CGI, fantasy, surreal, unrealistic, distorted, deformed, blurry, low quality, oversaturated, bad anatomy, duplicate objects, text, watermark, logo';

// High-fidelity curated prompts for educational & IT curriculum terms
const PRECOMPUTED_PROMPTS = {
  // Chemical / Physical example from prompt
  'електролиза': {
    image_prompt:
      'Realistic laboratory photography of an electrolysis experiment in a clear glass beaker filled with blue copper sulfate electrolyte solution. Two pure copper electrodes submerged in the liquid, small effervescent bubbles actively rising around the cathode, connected with insulated red and black wire clips to a benchtop DC power supply on a dark chemical-resistant lab bench. Crisp focus, macro shot, natural bright laboratory lighting, sharp detail, authentic scientific lab setting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  // Lesson 1.1 terms (it-8-1)
  'компютърна система': {
    image_prompt:
      'Documentary studio photography of a complete modern desktop computer workstation on a solid natural oak desk. Showing a sleek brushed aluminum tower with a transparent tempered glass side panel displaying an illuminated motherboard with copper heatpipes and RAM modules, paired with dual ultra-thin bezel monitors showing data charts, an ergonomic mechanical keyboard, and a precision mouse. Natural daylight streaming from an office window, authentic depth of field, 50mm lens.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'хардуер': {
    image_prompt:
      'Macro documentary photograph of real computer hardware components arranged neatly on an anti-static work mat on a technician workbench. A multi-core CPU chip with golden contact pins visible, two DDR5 RAM sticks with matte black heat spreaders, an NVMe solid-state drive, and a precision magnetic screwdriver resting nearby under soft neutral workshop lighting, hyper-realistic, extremely detailed texture of printed circuit board traces.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'софтуер': {
    image_prompt:
      'Realistic professional photograph of a software engineer sitting in front of dual high-resolution monitors in a contemporary sunlit office, writing clean code in an IDE with syntax highlighting, hands resting on a mechanical keyboard, a notebook with architecture notes and a ceramic coffee mug on the desk. Shallow depth of field, warm ambient morning light, authentic workplace atmosphere.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'данни': {
    image_prompt:
      'Realistic eye-level photograph inside a high-security modern enterprise data center corridor. Clean perspective view of tall server racks with blinking green and amber status LEDs, neatly bundled blue and yellow Ethernet patch cables, polished reflective raised floor tiles, cool ambient overhead illumination, sharp focus, professional industrial architectural photography.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'интернет': {
    image_prompt:
      'Close-up documentary photograph of glowing undersea fiber optic telecommunication cables being connected inside an industrial switching station. Bright points of light emanating from glass fiber strands, precision optical transceiver modules with metallic shielding, realistic depth of field, authentic industrial network engineering photography.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'браузър': {
    image_prompt:
      'Realistic photograph taken from behind the shoulder of a high school student using a modern laptop in a bright school library, navigating educational web pages inside a web browser window on the screen, natural window light illuminating the wooden library desk, authentic educational environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'интернет доставчик (isp)': {
    image_prompt:
      'Authentic documentary photograph of an internet service provider field technician wearing high-visibility gear and safety gloves, carefully splicing delicate optical fiber ribbons inside an outdoor weather-resistant telecommunications cabinet on a city street during daytime, natural lighting, sharp focus on tools and optical fiber cassette.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'сървър': {
    image_prompt:
      'Realistic close-up photograph of enterprise rackmount servers in a data center. High-density server blades with hot-swap hard drive bays, active cooling fan grilles, status indicator lights, and blue network patch cables neatly routed with velcro straps, cool atmospheric lighting, shallow depth of field, industrial technology photography.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'ip адрес': {
    image_prompt:
      'Macro photograph of an Ethernet network cable with a clear RJ45 modular connector clicked securely into the glowing port of an enterprise network router, label tags visible on the cable sleeve, warm ambient room lighting, realistic tech equipment photo.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'tcp/ip': {
    image_prompt:
      'Documentary photograph of a network engineer using a handheld digital cable tester and network analyzer on a patch panel inside a clean telecom rack, multi-colored patch cords neatly organized in cable management rings, realistic focus on the device screen and physical cables.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'пакет': {
    image_prompt:
      'Realistic macro photograph of high-speed optical transceiver ports in a network switch, showing light pulses through clear fiber-optic LC duplex connectors, detailed metallic shielding, shallow depth of field, authentic data transmission hardware.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'приложни програми': {
    image_prompt:
      'Realistic photograph of a creative professional designer using a stylus pen on an active graphics tablet beside a large color-calibrated display showing an open productivity application and spreadsheet, bright minimalist desk environment, natural morning illumination.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'растерно изображение': {
    image_prompt:
      'Macro photograph of a high-resolution LCD display panel viewed up close, revealing the physical sub-pixel arrangement of red, green, and blue microscopic phosphor dots forming part of a vivid digital photograph, authentic optical magnification, scientific display technology photo.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'проект': {
    image_prompt:
      'Realistic candid photograph of two high school students collaborating on an IT STEM project at a wide wooden table in a well-lit classroom, reviewing printed flowcharts and interactive laptop screens, sticky notes on the wall behind them, natural daylight, authentic school setting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },

  // Lesson 1.2 terms (it-8-2)
  'чат': {
    image_prompt:
      'Realistic photo of a person holding a modern smartphone in their hands in a cozy cafe, thumbs typing on the touchscreen with a messaging app open, soft blurred background with warm ambient cafe lighting, natural shallow depth of field.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'блог': {
    image_prompt:
      'Documentary photograph of an independent content creator working in a bright home studio, typing a structured article on a slim laptop with a camera on a tripod and a notebook beside them, warm afternoon sunlight, authentic creative workstation.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'блогър': {
    image_prompt:
      'Realistic photograph of a young technological blogger reviewing a new tech device at a clean studio desk with a ring light, microphone with a pop filter, and a mirrorless camera on a desk mount, natural and professional lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'микроблог': {
    image_prompt:
      'Candid street photograph of a commuter on a modern passenger train checking quick social news updates on a smartphone held in one hand, morning city sunlight reflecting through the train window, sharp focus on the phone and hand.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'социална мрежа': {
    image_prompt:
      'Realistic photograph of a diverse group of three young university students gathered around a tablet device on an outdoor campus bench, smiling and discussing a shared multimedia post, natural outdoor golden hour lighting, authentic lifestyle photo.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'форум': {
    image_prompt:
      'Documentary photograph of an IT student seated at a library computer desk researching community troubleshooting threads on a wide monitor, taking notes with a pen in a spiral notebook, quiet library atmosphere with soft overhead lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'нетикет': {
    image_prompt:
      'Realistic close-up photograph of hands typing thoughtfully on a modern backlit laptop keyboard in a calm, organized study room, soft natural morning window light, cup of tea beside the keyboard, peaceful and respectful digital communication setting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'киберсигурност': {
    image_prompt:
      'Realistic documentary photograph of a cyber defense operations center with an IT security analyst observing security monitoring consoles and telemetry status dashboards on wall-mounted screens, dimly lit blue ambient room lighting, authentic cybersecurity operations environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'метаданни (exif)': {
    image_prompt:
      'Realistic macro photograph of a professional digital SLR camera resting on a wooden table next to an open laptop showing photo EXIF metadata properties such as shutter speed, aperture, and GPS coordinates on the screen, natural window lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'двуфакторно удостоверяване': {
    image_prompt:
      'Realistic close-up photograph of a person holding a smartphone showing a 6-digit one-time security authentication code in an authenticator app, with a laptop login prompt slightly blurred in the background on the desk, natural indoor lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'настройки за поверителност': {
    image_prompt:
      'Realistic photograph of a user sitting at a modern desk adjusting privacy and permission toggles on an open tablet device, clean minimalist workspace with a small indoor plant, soft daylight from a nearby window.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },

  // Lesson 1.3 terms (it-8-3)
  'електронно обучение (e-learning)': {
    image_prompt:
      'Realistic documentary photograph of a student participating in an interactive online lecture on a laptop with headphones on, sitting at a clean study desk by a sunlit window with open textbooks and handwritten summary notes, authentic learning atmosphere.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'lms (learning management system)': {
    image_prompt:
      'Realistic photograph of a high school teacher in a modern digital classroom reviewing student assignment submissions on an interactive touch smartboard, clean modern school classroom, natural bright lighting, authentic teaching environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'синхронно обучение': {
    image_prompt:
      'Realistic photograph of a live video conference classroom in progress on a large monitor, showing an instructor speaking with multiple engaged students visible in participant grid tiles, classroom setting with soft natural light.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'асинхронно обучение': {
    image_prompt:
      'Warm realistic photograph of an independent learner studying course video modules and downloading assignment PDFs on a laptop at a quiet public library desk in the evening, desk lamp providing focused warm light.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'облачна услуга (cloud service)': {
    image_prompt:
      'Realistic architectural photography of a large-scale enterprise cloud datacenter interior, symmetric aisles of high-performance server cabinets with blue indicator lights, clean white cable trays suspended overhead, pristine cleanroom environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'споделяне (sharing)': {
    image_prompt:
      'Realistic photograph of two colleagues sitting side-by-side at a collaborative desk, pointing at a shared cloud document on a screen and discussing revisions, warm natural office daylight, genuine teamwork setting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'права за достъп (permissions)': {
    image_prompt:
      'Realistic eye-level photograph of an office administrator reviewing user role access cards and digital security credentials on a desktop monitor, sleek minimalist desk with an ID badge and secure card reader, natural office lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'съвместно редактиране (co-authoring)': {
    image_prompt:
      'Realistic photograph of two students seated across from each other with laptops at a library study table, simultaneously editing the same live collaborative presentation, coffee cups and textbooks on the table, natural daytime library lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'история на версиите (version history)': {
    image_prompt:
      'Realistic close-up photograph of a programmer or student reviewing revision timestamps and color-coded changes of a collaborative document on a clear high-resolution monitor, hands on keyboard, quiet evening study environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'групов електронен адрес': {
    image_prompt:
      'Realistic photograph of a school project team of four diverse students gathered around a shared project laptop in an innovation lab, checking group notifications and planning tasks together, bright daylight through large windows.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'онлайн сесия': {
    image_prompt:
      'Realistic photograph of a student wearing a lightweight headset with a boom microphone, smiling while actively speaking during an interactive virtual classroom session on a desktop computer, natural room lighting, genuine study context.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },

  // Lesson 1.4 terms (it-8-4 Google Forms)
  'google forms (google формуляри)': {
    image_prompt:
      'Realistic photography of a modern laptop screen displaying a clean web-based survey builder with multiple question blocks and purple accent header, resting on a clean wooden teacher desk with a notebook and pen, warm natural daylight.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'режим „тест“ (quiz mode)': {
    image_prompt:
      'Realistic photograph of a teacher setting up an online quiz in a digital classroom, screen showing point values and answer options, tablet and stylus on the side, soft daytime classroom lighting, authentic educational technology photograph.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'ключ за отговори (answer key)': {
    image_prompt:
      'Realistic close-up photograph of a teacher grading digital student assignments on a high-resolution display, pointing with a pen to verified correct answer keys and scoring breakdown, neat desk setting with natural ambient lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'автоматично оценяване': {
    image_prompt:
      'Realistic documentary photograph of a student checking their instant test score and feedback breakdown on a tablet screen right after submitting an online exam, sitting in a bright modern classroom, candid expression of relief.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'shorten url (скъсен url адрес)': {
    image_prompt:
      'Realistic macro photograph of a smartphone screen displaying a concise shared link and QR code, placed on an open notebook beside a laptop keyboard on a bright wooden school desk, natural lighting, sharp focus.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  }
};

/**
 * Normalizes term string for dictionary lookup.
 */
function normalizeKey(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[«»„“"']/g, '')
    .trim();
}

/**
 * Analyzes term and definition to determine category and synthesize a photorealistic prompt.
 * Strictly adheres to:
 * - Photorealistic photography, natural lighting, high detail
 * - No cartoon, anime, 3D render, CGI
 * - No text, labels, watermarks in image
 * - Concrete physical scene / object / phenomenon
 */
export function buildRealisticImagePrompt(term, definition) {
  const norm = normalizeKey(term);

  // Check precomputed curated database first
  if (PRECOMPUTED_PROMPTS[norm]) {
    return PRECOMPUTED_PROMPTS[norm];
  }

  // Partial match in database
  for (const [k, v] of Object.entries(PRECOMPUTED_PROMPTS)) {
    if (norm.includes(k) || k.includes(norm)) {
      return v;
    }
  }

  // Fallback rule-based domain analyzer for arbitrary terms & definitions
  const defLower = String(definition || '').toLowerCase();
  let sceneSubject = '';
  let setting = '';
  let cameraStyle = 'Sharp 50mm lens, natural soft lighting, shallow depth of field, authentic photography, documentary style.';

  if (/ток|електро|хими|реакци|лаборатор|разтвор|киселин/i.test(term + ' ' + defLower)) {
    // Chemical / Physical phenomenon
    sceneSubject = `Realistic laboratory documentary photograph of an active scientific experiment demonstrating ${term}. Clear laboratory glassware, beakers, subtle bubbling reaction, precision measuring equipment on a clean laboratory bench`;
    setting = 'authentic scientific chemistry laboratory, bright neutral lighting, crisp focus';
  } else if (/клетк|орган|биолог|бактери|тъкан|микроскоп/i.test(term + ' ' + defLower)) {
    // Biological concept
    sceneSubject = `High-resolution realistic scientific macro photography of ${term}, revealing microscopic biological structures and natural organic textures`;
    setting = 'laboratory microscopy capture, natural specimen illumination, high optical clarity';
  } else if (/сървър|мреж|хардуер|кабел|устройств|чип|процесор|памет|диск/i.test(term + ' ' + defLower)) {
    // Hardware / Infrastructure object
    sceneSubject = `Detailed realistic documentary photograph of real physical computer hardware and electronic components representing ${term}. Crisp view of circuit board, metallic connectors, and indicator lights`;
    setting = 'modern tech workshop or server room, clean lighting, sharp detail';
  } else if (/софтуер|програм|код|база|система|сайт|браузър/i.test(term + ' ' + defLower)) {
    // Software / Computing
    sceneSubject = `Documentary photograph of a modern computer workstation on a wooden desk displaying real professional tools for ${term}, hands on a keyboard, clean minimalist workspace`;
    setting = 'naturally lit modern office, soft window light, realistic work environment';
  } else if (/обучени|учен|клас|училищ|тест|въпрос|упражнени/i.test(term + ' ' + defLower)) {
    // Educational process
    sceneSubject = `Authentic candid photograph of students collaborating and actively learning about ${term} in a modern classroom, laptop and notebooks open on a wooden table`;
    setting = 'bright educational classroom, natural daylight, authentic student life';
  } else {
    // General concrete realistic physical context
    sceneSubject = `Authentic documentary photograph of a real-life physical scenario representing the concept of ${term} (${definition.slice(0, 100)})`;
    setting = 'realistic contemporary setting, natural daylight, genuine documentary atmosphere';
  }

  const prompt = `${sceneSubject}, situated in an ${setting}. ${cameraStyle} Highly detailed, crisp focus, photorealistic, physically plausible scene.`;

  return {
    image_prompt: prompt,
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  };
}

/**
 * Dynamic Gemini-based prompt generation using the user's prompt engineering specifications.
 */
let genAIClient = null;
function getGenAI() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      genAIClient = new GoogleGenAI({ apiKey });
    }
  }
  return genAIClient;
}

export async function generateRealisticPromptWithGemini(term, definition) {
  const fallback = buildRealisticImagePrompt(term, definition);
  const ai = getGenAI();
  if (!ai) {
    return fallback;
  }

  try {
    const systemInstruction = `Ти си експертен консултант за генериране на РЕАЛИСТИЧНИ изображения за образователни цели.
Получаваш ПОНЯТИЕ и ДЕФИНИЦИЯ от речник.
Твоята задача:
Първо анализирай понятието и дефиницията и определи КАКВО физически или визуално явление, обект, процес, структура или ситуация най-добре представя това понятие.
След това създай подробен image-generation prompt на английски език за фотореалистично изображение.

Изисквания:
- САМО фотореалистично (photorealistic, realistic photography, highly detailed, natural lighting)
- БЕЗ анимационен стил (no cartoon, anime, illustration, 3D render, CGI)
- БЕЗ абстрактни метафори ако понятието описва реално явление или обект
- БЕЗ текст, надписи, диаграми или графики в самото изображение
- Научно коректно
- Естествена професионална фотография (macro photography, documentary photo, studio shot)

Output:
След анализа върни САМО два резултата в следния формат:
IMAGE_PROMPT:
[подробният английски prompt]
NEGATIVE_PROMPT:
cartoon, anime, illustration, 3d render, CGI, fantasy, surreal, unrealistic, distorted, deformed, blurry, low quality, oversaturated, bad anatomy, duplicate objects, text, watermark, logo`;

    const userPrompt = `Понятие:\n"${term}"\n\nОписание:\n"${definition}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }
      ]
    });

    const text = response?.text || '';
    const imgMatch = text.match(/IMAGE_PROMPT:\s*([\s\S]+?)(?=NEGATIVE_PROMPT:|$)/i);
    const negMatch = text.match(/NEGATIVE_PROMPT:\s*([\s\S]+?)$/i);

    if (imgMatch && imgMatch[1].trim()) {
      return {
        image_prompt: imgMatch[1].trim().replace(/^\[|\]$/g, ''),
        negative_prompt: negMatch ? negMatch[1].trim().replace(/^\[|\]$/g, '') : STANDARD_NEGATIVE_PROMPT
      };
    }
  } catch (err) {
    console.warn('[promptGenerator] Gemini fallback used:', err.message);
  }

  return fallback;
}
