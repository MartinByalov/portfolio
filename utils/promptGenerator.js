// Educational Realistic Image Prompt Generator
// Analyzes educational terms & glossary definitions to produce strictly photorealistic photography prompts.

import { GoogleGenAI } from '@google/genai';

export const STANDARD_NEGATIVE_PROMPT =
  'cartoon, anime, illustration, 3d render, CGI, fantasy, surreal, unrealistic, distorted, deformed, blurry, low quality, oversaturated, bad anatomy, duplicate objects, text, watermark, logo, labels, diagram, infographic';

// High-fidelity curated prompts for educational & IT curriculum terms
const PRECOMPUTED_PROMPTS = {
  // Historical computing & calculating machines (it-8-2-1)
  'абак': {
    image_prompt:
      'Authentic macro photography of a traditional vintage wooden abacus (counting frame) with smooth polished dark hardwood beads arranged on brass rods inside a carved solid wood frame, resting on a weathered rustic oak desk with an old parchment manuscript beside it. 50mm lens, shallow depth of field, warm directional studio lighting, extremely sharp details of wood grain and brass texture.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'сметало': {
    image_prompt:
      'Authentic macro photography of a traditional vintage wooden abacus with smooth polished dark hardwood beads arranged on brass rods inside a carved solid wood frame, resting on a weathered rustic oak desk. 50mm lens, shallow depth of field, warm directional studio lighting, extremely sharp details of wood grain.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'паскалина': {
    image_prompt:
      'Museum-quality close-up photograph of Pascal’s calculator (Pascaline mechanical adding machine), showing ornate brass casing with numbered rotating cogwheel dials, interlocking gear teeth, and viewed display windows, resting on a velvet museum display surface with dramatic directional gallery spotlighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'сметачна машина на паскал': {
    image_prompt:
      'Museum-quality close-up photograph of Pascal’s calculator (Pascaline mechanical adding machine), showing ornate brass casing with numbered rotating cogwheel dials, interlocking gear teeth, and viewed display windows, resting on a velvet museum display surface with dramatic directional gallery spotlighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'аналитична машина': {
    image_prompt:
      'Historical museum photograph of Charles Babbage’s mechanical calculating engine mechanism, featuring intricate polished bronze gears, vertical brass counting columns, and mechanical escapement levers, dramatic side illumination with warm highlights on polished metal.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'перфокарта': {
    image_prompt:
      'Detailed macro documentary photograph of vintage 80-column paper punch cards (punched cards) used in early computing, showing precise rectangular punched holes with printed numbers along the top edge, resting beside an antique card punch machine mechanism on a technical workstation. High contrast, sharp focus, authentic historical computing photography.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'двоична бройна система': {
    image_prompt:
      'Macro photograph of a glowing mechanical switchboard and binary indicator toggle switches with small amber neon lamps illuminated in sequence (1 and 0 states) inside a vintage electronic computing laboratory, sharp focus, dramatic warm backlighting, authentic retro-tech.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'реле': {
    image_prompt:
      'Close-up macro photography of an electromechanical telephone relay from early computing era, showing copper wire coil winding, metallic armature contact points with visible air gap, mounted on an electrical bakelite chassis. Crisp focus on contact points, soft natural studio lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'архитектура на фон нойман': {
    image_prompt:
      'Historical documentary photograph of a 1950s computing mainframe room (Von Neumann architecture era) with vacuum tube racks, magnetic core memory panels, control console with indicator lights, and an engineer in a vintage white lab coat taking readings, authentic museum archive aesthetic.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'поколение компютри': {
    image_prompt:
      'Curated museum exhibition photograph showing the physical progression of computer calculating elements: an electromechanical relay, a glass vacuum tube, a discrete germanium transistor, a ceramic dual in-line integrated circuit, and a modern silicon microprocessor chip, neatly displayed on a dark velvet museum tray under directional museum spotlighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'вакуумна лампа': {
    image_prompt:
      'Macro photograph of a vintage triode glass vacuum tube glowing with warm orange filament light in a darkened engineering workshop, detailed internal metallic plates, grid wires, and glass envelope reflection, beautiful bokeh, 85mm lens.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'електронна лампа': {
    image_prompt:
      'Macro photograph of a vintage electronic vacuum tube glowing with warm orange filament light in a darkened engineering workshop, detailed internal metallic plates, grid wires, and glass envelope reflection, beautiful bokeh, 85mm lens.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'транзистор': {
    image_prompt:
      'Detailed macro photograph of classic discrete electronic transistors (TO-92 and TO-3 metal cans) with silver contact leads soldered into a vintage green printed circuit board, sharp focus on the silicon components, soft workshop lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'интегрална схема': {
    image_prompt:
      'High-magnification macro photograph of a ceramic dual in-line package (DIP) integrated circuit microchip on a circuit board, golden pins, microscopic silicon die visible under a glass window, crisp industrial electronics photography.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'микропроцесор': {
    image_prompt:
      'Close-up macro photograph of a modern high-performance silicon central processing unit (CPU) microprocessor chip held gently by an anti-static glove, showing the mirror-polished metallic integrated heat spreader and gold contact pad grid (LGA) underneath, high-end studio lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },

  // Computer systems & Hardware (it-8-1, it-8-2-2)
  'компютърна система': {
    image_prompt:
      'Documentary studio photography of a complete modern desktop computer workstation on a solid natural oak desk. Showing a sleek brushed aluminum tower with a transparent tempered glass side panel displaying an illuminated motherboard with copper heatpipes and RAM modules, paired with dual ultra-thin bezel monitors showing data charts, an ergonomic mechanical keyboard, and a precision mouse. Natural daylight streaming from an office window, authentic depth of field, 50mm lens.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'компютърна конфигурация': {
    image_prompt:
      'Studio photography of a custom-built high-performance modern desktop PC setup on a clean wooden desk, transparent glass side panel showing a motherboard with illuminated RGB heat shields, liquid cooling tubes, braided cables, mechanical keyboard, and dual monitors.',
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
  'cpu (централен процесор)': {
    image_prompt:
      'Close-up macro photograph of a modern high-performance silicon central processing unit (CPU) chip resting on an anti-static foam pad, showing the laser-engraved metal heat spreader, delicate ceramic substrate, and gold contact pad grid, high-end studio lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'централен процесор': {
    image_prompt:
      'Close-up macro photograph of a modern high-performance silicon central processing unit (CPU) chip resting on an anti-static foam pad, showing the laser-engraved metal heat spreader, delicate ceramic substrate, and gold contact pad grid, high-end studio lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'alu (аритметично-логическо устройство)': {
    image_prompt:
      'High-magnification macro photograph of a decapped silicon microprocessor die under a laboratory optical microscope, displaying the microscopic intricate geometry of arithmetic logic unit circuitry and silicon logic gates in iridescent colors.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'ram (оперативна памет)': {
    image_prompt:
      'Macro photograph of two modern high-speed DDR5 desktop RAM memory modules installed into DIMM slots on a motherboard, matte black aluminum heat spreaders with embossed logos, sharp focus on the gold-plated connector edge and latching clips.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'оперативна памет': {
    image_prompt:
      'Macro photograph of two modern high-speed DDR5 desktop RAM memory modules installed into DIMM slots on a motherboard, matte black aluminum heat spreaders with embossed logos, sharp focus on the gold-plated connector edge and latching clips.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'rom / firmware': {
    image_prompt:
      'Macro photograph of an SPI flash ROM BIOS microchip with 8 pins soldered on a high-density computer motherboard, microscopic copper traces, yellow SMD capacitors nearby, crisp macro electronics focus.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'ssd (solid state drive)': {
    image_prompt:
      'Macro photograph of a high-speed M.2 NVMe solid-state drive (SSD) installed on a motherboard, showing NAND flash memory chips, controller chip with thermal pad, and golden PCIe pins, soft side lighting, sharp technological details.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'hdd (hard disk drive)': {
    image_prompt:
      'Macro photograph of a precision disassembled 3.5-inch mechanical hard disk drive, revealing the mirror-polished reflective magnetic disk platter and the delicate metallic read/write actuator arm hovering over the surface, dramatic studio lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'шина (bus)': {
    image_prompt:
      'High-magnification macro photograph of parallel golden and copper bus traces etched onto a multi-layer fiberglass computer circuit board (PCB), routing high-speed data between chipset and expansion slots, crisp focus.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'периферно устройство': {
    image_prompt:
      'Studio product photograph of modern ergonomic computer peripherals arranged on a dark desk mat: a mechanical keyboard with custom keycaps, an optical gaming mouse, a USB condenser microphone, and a drawing tablet with stylus, soft diffused studio light.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'дънна платка': {
    image_prompt:
      'Overhead high-angle studio photograph of a modern ATX computer motherboard laid flat on an anti-static mat, featuring CPU socket, VRM heatsinks, PCIe slots, and intricate copper conductive traces, professional hardware photography.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'захранващ блок': {
    image_prompt:
      'Product studio photograph of a fully modular ATX power supply unit (PSU) with a matte black metal chassis, honeycomb cooling fan grille, and neatly organized braided modular cables on a clean workshop surface.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'видеокарта': {
    image_prompt:
      'Studio photograph of a modern triple-fan graphics card (GPU) with heavy aluminum heatsink fins and copper heatpipes, positioned at an angle on a clean desk, dramatic accent lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },

  // Operating systems & System software (it-8-2-3)
  'операционна система (ос)': {
    image_prompt:
      'Realistic photograph of a dual-monitor workstation showing a modern operating system desktop environment with organized application windows, terminal emulator, file manager, and system performance widgets, natural office lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'операционна система': {
    image_prompt:
      'Realistic photograph of a dual-monitor workstation showing a modern operating system desktop environment with organized application windows, terminal emulator, file manager, and system performance widgets, natural office lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'системен софтуер': {
    image_prompt:
      'Realistic documentary photo of a system administrator monitoring low-level kernel diagnostics and operating system services on an ultra-wide curved display in a clean tech office.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'приложен софтуер (applications)': {
    image_prompt:
      'Realistic photo of an organized creative workspace showing open productivity and media editing software suites across dual high-resolution displays, mechanical keyboard, and coffee mug on a natural wooden desk.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'приложен софтуер': {
    image_prompt:
      'Realistic photo of an organized creative workspace showing open productivity and media editing software suites across dual high-resolution displays, mechanical keyboard, and coffee mug on a natural wooden desk.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'ядро (kernel)': {
    image_prompt:
      'Realistic close-up photograph of a computer display showing Linux kernel boot log messages and memory initialization routines in a glowing monochrome console terminal, atmospheric ambient lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'ядро': {
    image_prompt:
      'Realistic close-up photograph of a computer display showing Linux kernel boot log messages and memory initialization routines in a glowing monochrome console terminal, atmospheric ambient lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'драйвер (device driver)': {
    image_prompt:
      'Realistic photo of a hardware engineer connecting an oscilloscope and USB logic analyzer to a custom hardware circuit while testing device driver communication on an open laptop screen.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'драйвер': {
    image_prompt:
      'Realistic photo of a hardware engineer connecting an oscilloscope and USB logic analyzer to a custom hardware circuit while testing device driver communication on an open laptop screen.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'cli (command line interface)': {
    image_prompt:
      'Close-up photograph of a programmer terminal screen displaying a command-line interface with dark background, green and white monospaced text commands and directories, shallow depth of field, mechanical keyboard in foreground.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'gui (graphical user interface)': {
    image_prompt:
      'Photograph of a designer interacting with a modern graphical user interface on a bright touchscreen display, clean intuitive visual desktop icons, windows, and responsive control buttons.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'мултитаскинг (multitasking)': {
    image_prompt:
      'Realistic wide shot of a modern software engineer workstation running multiple synchronized tasks across three high-resolution monitors: live code compilation, database queries, and video conference stream, bright daylight office.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'виртуална памет (swap / paging file)': {
    image_prompt:
      'Realistic photograph of a server management monitor displaying real-time RAM utilization graphs and swap paging file activity telemetry in a modern data center control room.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'виртуална памет': {
    image_prompt:
      'Realistic photograph of a server management monitor displaying real-time RAM utilization graphs and swap paging file activity telemetry in a modern data center control room.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'диспечер на задачите (task manager / activity monitor)': {
    image_prompt:
      'Close-up crisp photo of a high-resolution laptop screen displaying the Task Manager performance tab with real-time CPU core utilization graphs, memory allocation, and disk throughput charts, naturally lit desk.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'диспечер на задачите': {
    image_prompt:
      'Close-up crisp photo of a high-resolution laptop screen displaying the Task Manager performance tab with real-time CPU core utilization graphs, memory allocation, and disk throughput charts, naturally lit desk.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'отворен код (open source)': {
    image_prompt:
      'Realistic photograph of diverse programmers collaborating around a shared table in a modern co-working space, discussing open-source code repository pull requests on their laptops, natural daylight, genuine collaboration.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'отворен код': {
    image_prompt:
      'Realistic photograph of diverse programmers collaborating around a shared table in a modern co-working space, discussing open-source code repository pull requests on their laptops, natural daylight, genuine collaboration.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'проприетарен (търговски) софтуер': {
    image_prompt:
      'Studio product photograph of a boxed commercial enterprise software license package alongside a metallic cryptographic security USB hardware key on an executive desk.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },

  // Networks & Internet (it-8-1)
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

  // Social & Security (it-8-2)
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

  // E-Learning & Cloud collaboration (it-8-1-2, it-8-1-3, it-8-1-5)
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
  'облачна услуга': {
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
  'работа в споделен документ': {
    image_prompt:
      'Realistic photograph of two students seated across from each other with laptops at a library study table, simultaneously editing the same live collaborative presentation, coffee cups and textbooks on the table, natural daytime library lighting.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'история на версиите (version history)': {
    image_prompt:
      'Realistic close-up photograph of a programmer or student reviewing revision timestamps and color-coded changes of a collaborative document on a clear high-resolution monitor, hands on keyboard, quiet evening study environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'история на версиите': {
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
  'етичен код': {
    image_prompt:
      'Realistic photo of high school students collaborating on classroom rules and digital netiquette guidelines posted on a whiteboard, bright modern classroom, natural daylight.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },

  // Search engines & Operators (it-8-1-4)
  'ефективно търсене': {
    image_prompt:
      'Realistic eye-level photograph of a student researcher seated at a minimalist wooden desk using an advanced search engine on a slim laptop with filtered search operators, coffee cup and open notebook with highlighted notes, warm natural daylight.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'поле за търсене': {
    image_prompt:
      'Macro photograph of hands typing focused search queries into a search bar on a high-resolution laptop screen, soft natural lighting, shallow depth of field on the keyboard keys.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'ключови думи': {
    image_prompt:
      'Macro photograph of hands typing focused search keywords into a search bar on a high-resolution laptop screen, soft natural lighting, shallow depth of field on the keyboard keys.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'заявка за търсене': {
    image_prompt:
      'Close-up photograph of a student typing targeted Boolean search terms and quotation marks into a search bar on a high-resolution laptop display, bright classroom environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'глобални символи (wildcards)': {
    image_prompt:
      'Close-up photograph of a terminal screen showing wildcard search commands (* and ?) filtering structured directory files in an IDE file explorer, clean developer workstation.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'глобален символ (wildcard)': {
    image_prompt:
      'Close-up photograph of a terminal screen showing wildcard search commands (* and ?) filtering structured directory files in an IDE file explorer, clean developer workstation.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'търсеща машина (търсачка)': {
    image_prompt:
      'Realistic eye-level photograph of a researcher seated at a minimalist wooden desk using an advanced search engine on a slim laptop with filtered keyword queries, coffee cup and open notebook with highlighted notes, warm daylight.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'търсещ оператор': {
    image_prompt:
      'Close-up photograph of a student typing targeted Boolean search terms (AND, OR, NOT) into a search bar on a high-resolution laptop display, bright classroom environment.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'уеб браузър (клиент)': {
    image_prompt:
      'Realistic photograph taken from behind the shoulder of a high school student using a modern laptop in a bright school library, navigating educational web pages inside a web browser window on the screen, natural window light illuminating the wooden library desk.',
    negative_prompt: STANDARD_NEGATIVE_PROMPT
  },
  'достоверност на източник': {
    image_prompt:
      'Authentic documentary photograph of a student researcher comparing digital academic journal articles on a tablet with physical reference books and verified encyclopedias on a library desk, natural library lighting.',
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
    .replace(/\s*\(.*?\)\s*/g, ' ') // Strip parentheses for matching (e.g. "Абак (Сметало)" -> "абак")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Analyzes term and definition to determine category and synthesize a photorealistic prompt.
 * Strictly adheres to:
 * - Photorealistic photography, natural lighting, high detail
 * - Concrete physical scene / object / phenomenon
 * - No cartoon, anime, 3D render, CGI
 * - No text, labels, watermarks in image
 */
export function buildRealisticImagePrompt(term, definition) {
  const norm = normalizeKey(term);
  const rawLower = String(term || '').toLowerCase().trim();

  // 1. Exact match in curated database
  if (PRECOMPUTED_PROMPTS[norm]) {
    return PRECOMPUTED_PROMPTS[norm];
  }
  if (PRECOMPUTED_PROMPTS[rawLower]) {
    return PRECOMPUTED_PROMPTS[rawLower];
  }

  // 2. Partial match in curated database
  for (const [k, v] of Object.entries(PRECOMPUTED_PROMPTS)) {
    if (norm === k || norm.startsWith(k) || k.startsWith(norm)) {
      return v;
    }
  }

  // 3. Fallback rule-based domain analyzer for arbitrary terms & definitions
  const defLower = String(definition || '').toLowerCase();
  const combo = (norm + ' ' + defLower).toLowerCase();

  let sceneSubject = '';
  let setting = '';
  let cameraStyle = 'Sharp 50mm lens, natural soft lighting, shallow depth of field, authentic photography, documentary style.';

  // Historical Computing & Calculating Devices
  if (/абак|сметал|паскал|перфокарт|вакуумн|електронна ламп|реле|нойман|бабидж/i.test(combo)) {
    if (/абак|сметал/i.test(combo)) {
      sceneSubject = 'Authentic macro photography of an antique traditional wooden abacus with dark polished wooden beads on brass rods, resting on a rustic oak study desk';
      setting = 'historic study setting, soft warm directional lighting, high-detail wood texture';
    } else if (/перфокарт/i.test(combo)) {
      sceneSubject = 'Close-up photograph of vintage paper punched cards with precise rectangular holes next to an early computing card-reader mechanism';
      setting = 'historical computing laboratory, sharp focus, authentic museum lighting';
    } else if (/вакуумн|електронна ламп/i.test(combo)) {
      sceneSubject = 'Macro photograph of a vintage glowing glass vacuum tube with warm filament illumination and intricate interior metal plates';
      setting = 'darkened vintage engineering workshop, warm bokeh, high-detail macro shot';
    } else {
      sceneSubject = `Historic documentary museum photograph of early computing artifact representing ${term}`;
      setting = 'authentic museum archive setting, warm directional spotlighting, sharp details';
    }
  } else if (/ток|електро|хими|реакци|лаборатор|разтвор|киселин/i.test(combo)) {
    // Chemical / Physical phenomenon
    sceneSubject = `Realistic laboratory documentary photograph of an active scientific experiment demonstrating ${term}. Clear laboratory glassware, beakers, subtle bubbling reaction, precision measuring equipment on a clean laboratory bench`;
    setting = 'authentic scientific chemistry laboratory, bright neutral lighting, crisp focus';
  } else if (/клетк|орган|биолог|бактери|тъкан|микроскоп/i.test(combo)) {
    // Biological concept
    sceneSubject = `High-resolution realistic scientific macro photography of ${term}, revealing microscopic biological structures and natural organic textures`;
    setting = 'laboratory microscopy capture, natural specimen illumination, high optical clarity';
  } else if (/процесор|cpu|alu|памет|ram|rom|ssd|hdd|дънна платка|видеокарт|захранващ|чип|хардуер/i.test(combo)) {
    // Hardware / Microelectronics
    sceneSubject = `Macro documentary photograph of real computer hardware microchip and electronic component representing ${term}. Crisp view of circuit board traces, gold-plated contacts, and silicon surface`;
    setting = 'modern tech workshop with anti-static work mat, clean neutral lighting, sharp detail';
  } else if (/сървър|мреж|рутер|кабел|оптичен|интернет|datacenter|tcp|ip адрес/i.test(combo)) {
    // Networking / Infrastructure
    sceneSubject = `Realistic documentary photograph of real network infrastructure equipment representing ${term}. Clean view of rackmount switches, glowing status LEDs, and routed fiber-optic cables`;
    setting = 'modern enterprise data center or telecom rack, cool ambient lighting, sharp focus';
  } else if (/софтуер|програм|код|база|система|операционн|ядро|драйвер|cli|gui|браузър/i.test(combo)) {
    // Software / Operating systems
    sceneSubject = `Documentary photograph of a modern computer workstation displaying real professional interfaces and tools for ${term}, hands on a mechanical keyboard, clean minimalist workspace`;
    setting = 'naturally lit modern office, soft window light, realistic work environment';
  } else if (/обучени|учен|клас|училищ|тест|въпрос|упражнени|lms/i.test(combo)) {
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
    const systemInstruction = `You are a world-class prompt engineer specializing in PHOTOREALISTIC, ACCURATE, and PEDAGOGICALLY SOUND image generation prompts for educational flashcards.

When given a TERM and DEFINITION (often in Bulgarian from an IT / Computer Science curriculum):
1. Identify the EXACT PHYSICAL ARTIFACT, HISTORICAL OBJECT, HARDWARE COMPONENT, or AUTHENTIC WORKPLACE SCENARIO that physically represents this concept.
   - For historical calculating devices (e.g., "Абак" / Abacus, "Перфокарта" / Punch card, "Паскалина" / Pascaline, "Вакуумна лампа" / Vacuum tube, "Реле" / Relay): Describe the authentic historical physical object with precise materials (wood grain, brass rods, glass tubes, punched holes, copper coils) in a museum or studio photography setting.
   - For computer hardware (CPU, RAM, Motherboard, SSD, HDD, GPU, Bus): Describe the physical silicon chip, circuit board, gold contact pins, heat spreader, or open drive mechanism in clean macro photography.
   - For networking / infrastructure (Server, Router, Fiber optics, Data center): Describe the real enterprise hardware with status LEDs, Ethernet/optical patch cables, and server rack bays.
   - For software / OS / educational concepts: Describe a realistic workstation screen in an authentic study/work environment.
2. Produce a single detailed ENGLISH image generation prompt that specifies:
   - Primary physical object and materials (e.g. "polished dark walnut wood frame with brass rods and wooden beads")
   - Lighting and camera angle (e.g. "Macro studio photography, 50mm lens, shallow depth of field, warm directional lighting")
   - Context/setting (e.g. "resting on a rustic wooden desk beside parchment")
3. STRICT NEGATIVE CONSTRAINTS:
   - Strictly NO cartoons, anime, 3D renders, CGI, illustrations, or fantasy art.
   - NO text, words, labels, watermarks, or diagrams rendered into the image.

Output Format:
Return ONLY the following structure:
IMAGE_PROMPT:
[Detailed English photorealistic prompt]
NEGATIVE_PROMPT:
cartoon, anime, illustration, 3d render, CGI, fantasy, surreal, unrealistic, distorted, deformed, blurry, low quality, oversaturated, bad anatomy, duplicate objects, text, watermark, logo, labels, diagram, infographic`;

    const userPrompt = `Term:\n"${term}"\n\nDefinition:\n"${definition}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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

