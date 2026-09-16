// Central resolver for glossary and flashcard images hosted in the GitHub assets repository:
// https://github.com/MartinByalov/it-media-assets/tree/main/assets/glossary

export const GLOSSARY_MEDIA_BASE_URL = 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/glossary/';
export const GLOSSARY_RAW_GITHUB_BASE_URL = 'https://raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/glossary/';

// Cyrillic to Latin transliteration table
const BG_TO_LAT = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z','и':'i','й':'y',
  'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u',
  'ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sht','ъ':'a','ь':'y','ю':'yu','я':'ya'
};

export function transliterate(str) {
  const s = String(str || '').toLowerCase().trim();
  let res = '';
  for (let ch of s) {
    res += BG_TO_LAT[ch] !== undefined ? BG_TO_LAT[ch] : ch;
  }
  return res;
}

export function slugify(str) {
  return transliterate(str).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Complete mapping of terms to ready-made image filenames from GLOSSARY_PROMPTS.md
export const GLOSSARY_TERM_MAP = {
  '5G': '5g.png',
  '5G (Пето поколение мобилна мрежа)': '5g.png',
  'Пето поколение мобилна мрежа': '5g.png',
  'Абак': 'abak.png',
  'Акселерометър': 'akselerometar.png',
  'Архитектура на фон Нойман': 'arhitektura-na-fon-noyman.png',
  'Асинхронно обучение': 'asinhronno-obuchenie.png',
  'Блог': 'blog.png',
  'Блогър': 'blogar.png',
  'Браузър': 'brauzar.png',
  'Уеб браузър': 'ueb-brauzar-klient.png',
  'Уеб браузър (Клиент)': 'ueb-brauzar-klient.png',
  'Виртуална памет (Swap / Paging file)': 'virtualna-pamet-swap-paging-file.png',
  'Виртуална памет': 'virtualna-pamet-swap-paging-file.png',
  'Swap': 'virtualna-pamet-swap-paging-file.png',
  'Paging': 'virtualna-pamet-swap-paging-file.png',
  'Глобални символи (Wildcards)': 'globalni-simvoli-wildcards.png',
  'Глобален символ (Wildcard)': 'globalni-simvoli-wildcards.png',
  'Глобални символи': 'globalni-simvoli-wildcards.png',
  'Глобален символ': 'globalni-simvoli-wildcards.png',
  'Wildcard': 'globalni-simvoli-wildcards.png',
  'Wildcards': 'globalni-simvoli-wildcards.png',
  'Групов електронен адрес': 'grupov-elektronen-adres.png',
  'Данни': 'danni.png',
  'Двоична бройна система': 'dvoichna-broyna-sistema.png',
  'Двуфакторно удостоверяване': 'dvufaktorno-udostoveryavane.png',
  'Двуфакторно удостоверяване (2FA)': 'dvufaktorno-udostoveryavane.png',
  '2FA': 'dvufaktorno-udostoveryavane.png',
  'Диспечер на задачите': 'dispecher-na-zadachite-task-manager-activity-monitor.png',
  'Диспечер на задачите (Task Manager / Activity Monitor)': 'dispecher-na-zadachite-task-manager-activity-monitor.png',
  'Task Manager': 'dispecher-na-zadachite-task-manager-activity-monitor.png',
  'Activity Monitor': 'dispecher-na-zadachite-task-manager-activity-monitor.png',
  'Достоверност на източник': 'dostovernost-na-iztochnik.png',
  'Драйвер': 'drayver-device-driver.png',
  'Драйвер (Device Driver)': 'drayver-device-driver.png',
  'Device Driver': 'drayver-device-driver.png',
  'Електронно обучение': 'elektronno-obuchenie-e-learning.png',
  'Електронно обучение (E-learning)': 'elektronno-obuchenie-e-learning.png',
  'E-learning': 'elektronno-obuchenie-e-learning.png',
  'Етичен код': 'etichen-kod.png',
  'Ефективно търсене': 'efektivno-tarsene.png',
  'Жироскоп': 'zhiroskop.png',
  'Заявка за търсене': 'zayavka-za-tarsene.png',
  'Интернет': 'internet.png',
  'Интернет доставчик (ISP)': 'internet-dostavchik-isp.png',
  'Интернет доставчик': 'internet-dostavchik-isp.png',
  'ISP': 'internet-dostavchik-isp.png',
  'История на версиите': 'istoriya-na-versiite-version-history.png',
  'История на версиите (Version History)': 'istoriya-na-versiite-version-history.png',
  'Version History': 'istoriya-na-versiite-version-history.png',
  'Капацитивен сензорен дисплей': 'kapatsitiven-senzoren-displey.png',
  'Капацитивен екран': 'kapatsitiven-senzoren-displey.png',
  'Киберсигурност': 'kibersigurnost.png',
  'Клетъчна мрежа (Cellular Network)': 'kletachna-mrezha-cellular-network.png',
  'Клетъчна мрежа': 'kletachna-mrezha-cellular-network.png',
  'Cellular Network': 'kletachna-mrezha-cellular-network.png',
  'Ключови думи': 'klyuchovi-dumi.png',
  'Компютърна конфигурация': 'kompyutarna-konfiguratsiya.png',
  'Компютърна система': 'kompyutarna-sistema.png',
  'Метаданни (EXIF)': 'metadanni-exif.png',
  'Метаданни': 'metadanni-exif.png',
  'EXIF': 'metadanni-exif.png',
  'Микроблог': 'mikroblog.png',
  'Мултитаскинг': 'multitasking-multitasking.png',
  'Мултитаскинг (Multitasking)': 'multitasking-multitasking.png',
  'Multitasking': 'multitasking-multitasking.png',
  'Настройки за поверителност': 'nastroyki-za-poveritelnost.png',
  'Нетикет': 'netiket.png',
  'Облачна услуга': 'oblachna-usluga-cloud-service.png',
  'Облачна услуга (Cloud Service)': 'oblachna-usluga-cloud-service.png',
  'Облачна услуга (Cloud service)': 'oblachna-usluga-cloud-service.png',
  'Cloud Service': 'oblachna-usluga-cloud-service.png',
  'Онлайн сесия': 'onlayn-sesiya.png',
  'Операционна система (ОС)': 'operatsionna-sistema-os.png',
  'Операционна система': 'operatsionna-sistema-os.png',
  'ОС': 'operatsionna-sistema-os.png',
  'Оптичен кабел': 'optichen-kabel.png',
  'Отворен код (Open Source)': 'otvoren-kod-open-source.png',
  'Отворен код': 'otvoren-kod-open-source.png',
  'Open Source': 'otvoren-kod-open-source.png',
  'Пакет': 'paket.png',
  'Мрежов пакет': 'paket.png',
  'Периферно устройство': 'periferno-ustroystvo.png',
  'Перфокарта': 'perfokarta.png',
  'Поколение компютри': 'pokolenie-kompyutri.png',
  'Поле за търсене': 'pole-za-tarsene.png',
  'Права за достъп (Permissions)': 'prava-za-dostap-permissions.png',
  'Права за достъп': 'prava-za-dostap-permissions.png',
  'Приложен софтуер (Applications)': 'prilozhen-softuer-applications.png',
  'Приложен софтуер': 'prilozhen-softuer-applications.png',
  'Приложни програми': 'prilozhen-softuer-applications.png',
  'Applications': 'prilozhen-softuer-applications.png',
  'Проект': 'proekt.png',
  'Проприетарен софтуер': 'proprietaren-targovski-softuer.png',
  'Проприетарен (търговски) софтуер': 'proprietaren-targovski-softuer.png',
  'Търговски софтуер': 'proprietaren-targovski-softuer.png',
  'Пясъчник (Sandbox)': 'pyasachnik-sandbox.png',
  'Пясъчник (Sandbox / Sandboxing)': 'pyasachnik-sandbox.png',
  'Пясъчник (Sandboxing)': 'pyasachnik-sandbox.png',
  'Sandbox': 'pyasachnik-sandbox.png',
  'Sandboxing': 'pyasachnik-sandbox.png',
  'Работа в споделен документ': 'rabota-v-spodelen-dokument.png',
  'Разрешения за сигурност (Permissions)': 'sistemni-razresheniya-permissions.png',
  'Растерно изображение': 'rasterno-izobrazhenie.png',
  'Реле': 'rele.png',
  'Сензор за близост (Proximity)': 'senzor-za-blizost-proximity.png',
  'Сензор за близост': 'senzor-za-blizost-proximity.png',
  'Proximity sensor': 'senzor-za-blizost-proximity.png',
  'Синхронно обучение': 'sinhronno-obuchenie.png',
  'Системен софтуер': 'sistemen-softuer.png',
  'Системни разрешения (Permissions)': 'sistemni-razresheniya-permissions.png',
  'Системни разрешения': 'sistemni-razresheniya-permissions.png',
  'Permissions': 'sistemni-razresheniya-permissions.png',
  'Софтуер': 'softuer.png',
  'Социална мрежа': 'sotsialna-mrezha.png',
  'Споделяне (Sharing)': 'spodelyane-sharing.png',
  'Споделяне': 'spodelyane-sharing.png',
  'Sharing': 'spodelyane-sharing.png',
  'Суич (Switch)': 'suich-switch.png',
  'Суич': 'suich-switch.png',
  'Switch': 'suich-switch.png',
  'Съвместно редактиране (Co-authoring)': 'savmestno-redaktirane-co-authoring.png',
  'Съвместно редактиране': 'savmestno-redaktirane-co-authoring.png',
  'Co-authoring': 'savmestno-redaktirane-co-authoring.png',
  'Сървър': 'sarvar.png',
  'Server': 'sarvar.png',
  'Термален тротлинг (Thermal Throttling)': 'termalen-trotling-thermal-throttling.png',
  'Термален тротлинг': 'termalen-trotling-thermal-throttling.png',
  'Thermal Throttling': 'termalen-trotling-thermal-throttling.png',
  'Търсещ оператор': 'tarsesht-operator.png',
  'Търсеща машина (Търсачка)': 'tarseshta-mashina-tarsachka.png',
  'Търсеща машина': 'tarseshta-mashina-tarsachka.png',
  'Търсачка': 'tarseshta-mashina-tarsachka.png',
  'Search Engine': 'tarseshta-mashina-tarsachka.png',
  'Форум': 'forum.png',
  'Хардуер': 'harduer.png',
  'Hardware': 'harduer.png',
  'Чат': 'chat.png',
  'Шина (Bus)': 'shina-bus.png',
  'Шина': 'shina-bus.png',
  'Bus': 'shina-bus.png',
  'Ядро (Kernel)': 'yadro-kernel.png',
  'Ядро': 'yadro-kernel.png',
  'Kernel': 'yadro-kernel.png',
  'ALU (Аритметично-логическо устройство)': 'alu-aritmetichno-logichesko-ustroystvo.png',
  'ALU': 'alu-aritmetichno-logichesko-ustroystvo.png',
  'Аритметично-логическо устройство': 'alu-aritmetichno-logichesko-ustroystvo.png',
  'CLI (Command Line Interface)': 'cli-command-line-interface.png',
  'CLI': 'cli-command-line-interface.png',
  'Command Line Interface': 'cli-command-line-interface.png',
  'Команден ред': 'cli-command-line-interface.png',
  'Client–Server': 'client-server.png',
  'Client-Server': 'client-server.png',
  'Client–Server архитектура': 'client-server.png',
  'Клиент-Сървър': 'client-server.png',
  'Cloud Storage': 'cloud-storage.png',
  'Облачно хранилище': 'cloud-storage.png',
  'COUNTIF': 'countif.png',
  'COUNTIF функция': 'countif.png',
  'CPU (Централен процесор)': 'cpu-tsentralen-protsesor.png',
  'CPU': 'cpu-tsentralen-protsesor.png',
  'Централен процесор': 'cpu-tsentralen-protsesor.png',
  'Процесор': 'cpu-tsentralen-protsesor.png',
  'Data Validation': 'data-validation.png',
  'Data Validation (Валидиране на данни)': 'data-validation.png',
  'Валидиране на данни': 'data-validation.png',
  'DNS': 'dns.png',
  'DNS (Domain Name System)': 'dns.png',
  'Firewall': 'firewall.png',
  'Firewall (Защитна стена)': 'firewall.png',
  'Защитна стена': 'firewall.png',
  'GPS': 'gps.png',
  'GPS (Global Positioning System)': 'gps.png',
  'GUI (Graphical User Interface)': 'gui-graphical-user-interface.png',
  'GUI': 'gui-graphical-user-interface.png',
  'GUI (Графичен потребителски интерфейс)': 'gui-graphical-user-interface.png',
  'Графичен потребителски интерфейс': 'gui-graphical-user-interface.png',
  'Handover (Хендоувър)': 'handover-hendouvar.png',
  'Handover': 'handover-hendouvar.png',
  'Хендоувър': 'handover-hendouvar.png',
  'HDD (Hard Disk Drive)': 'hdd-hard-disk-drive.png',
  'HDD': 'hdd-hard-disk-drive.png',
  'HDD (Твърд диск)': 'hdd-hard-disk-drive.png',
  'Твърд диск': 'hdd-hard-disk-drive.png',
  'IP адрес': 'ip-adres.png',
  'IP': 'ip-adres.png',
  'LAN': 'lan.png',
  'LAN (Local Area Network)': 'lan.png',
  'Локална мрежа': 'lan.png',
  'LMS (Learning Management System)': 'lms-learning-management-system.png',
  'LMS': 'lms-learning-management-system.png',
  'Система за управление на обучението': 'lms-learning-management-system.png',
  'LTPO AMOLED': 'ltpo-amoled.png',
  'LTPO AMOLED дисплей': 'ltpo-amoled.png',
  'LTPO': 'ltpo-amoled.png',
  'AMOLED': 'ltpo-amoled.png',
  'MAN': 'man.png',
  'MAN (Metropolitan Area Network)': 'man.png',
  'MTP (Media Transfer Protocol)': 'mtp-media-transfer-protocol.png',
  'MTP': 'mtp-media-transfer-protocol.png',
  'NFC (Near Field Communication)': 'nfc-near-field-communication.png',
  'NFC': 'nfc-near-field-communication.png',
  'Peer-to-Peer (P2P)': 'peer-to-peer-p2p.png',
  'Peer-to-Peer': 'peer-to-peer-p2p.png',
  'P2P': 'peer-to-peer-p2p.png',
  'RAM (Оперативна памет)': 'ram-operativna-pamet.png',
  'RAM': 'ram-operativna-pamet.png',
  'Оперативна памет': 'ram-operativna-pamet.png',
  'ROM / Firmware': 'rom-firmware.png',
  'ROM': 'rom-firmware.png',
  'Firmware': 'rom-firmware.png',
  'SoC (System on a Chip)': 'soc-system-on-a-chip.png',
  'SoC': 'soc-system-on-a-chip.png',
  'System on a Chip': 'soc-system-on-a-chip.png',
  'SSD (Solid State Drive)': 'ssd-solid-state-drive.png',
  'SSD': 'ssd-solid-state-drive.png',
  'Solid State Drive': 'ssd-solid-state-drive.png',
  'TCP/IP': 'tcp-ip.png',
  'UFS (Universal Flash Storage)': 'ufs-universal-flash-storage.png',
  'UFS': 'ufs-universal-flash-storage.png',
  'Universal Flash Storage': 'ufs-universal-flash-storage.png',
  'WAN': 'wan.png',
  'WAN (Wide Area Network)': 'wan.png',
  'Wi-Fi Direct (Quick Share / AirDrop)': 'wi-fi-direct-quick-share-airdrop.png',
  'Wi-Fi Direct': 'wi-fi-direct-quick-share-airdrop.png',
  'Quick Share': 'wi-fi-direct-quick-share-airdrop.png',
  'AirDrop': 'wi-fi-direct-quick-share-airdrop.png'
};

/**
 * Resolves a glossary term or phrase to its corresponding .png file in assets/glossary/
 * @param {string} term
 * @returns {string} filename e.g. '5g.png'
 */
export function getGlossaryFilename(term) {
  if (!term) return 'internet.png';
  const clean = String(term).trim();
  if (GLOSSARY_TERM_MAP[clean]) return GLOSSARY_TERM_MAP[clean];

  const cleanLower = clean.toLowerCase();
  for (const [k, v] of Object.entries(GLOSSARY_TERM_MAP)) {
    if (k.toLowerCase() === cleanLower) return v;
  }

  const slug = slugify(clean);
  for (const [k, v] of Object.entries(GLOSSARY_TERM_MAP)) {
    if (slugify(k) === slug || v.replace('.png', '') === slug) return v;
  }

  // Check prefix or partial match
  for (const [k, v] of Object.entries(GLOSSARY_TERM_MAP)) {
    const kSlug = slugify(k);
    if (kSlug.includes(slug) || slug.includes(kSlug)) return v;
  }

  return slug ? `${slug}.png` : 'internet.png';
}

/**
 * Returns the primary CDN URL for a glossary term's ready-made illustration
 * @param {string} term
 * @returns {string}
 */
export function resolveGlossaryImageUrl(term) {
  const file = getGlossaryFilename(term);
  return `${GLOSSARY_MEDIA_BASE_URL}${encodeURIComponent(file)}`;
}

/**
 * Returns the raw GitHub fallback URL for a glossary term's image
 * @param {string} term
 * @returns {string}
 */
export function resolveGlossaryRawUrl(term) {
  const file = getGlossaryFilename(term);
  return `${GLOSSARY_RAW_GITHUB_BASE_URL}${encodeURIComponent(file)}`;
}
