import { CHAPTERS, CHARACTERS, ACHIEVEMENTS, availableCharacters } from './data.js';

const COPY = {
  en: { new: 'NEW JOURNEY', continue: 'CONTINUE', chapters: 'CHAPTER SELECT', characters: 'CHARACTERS', upgrades: 'UPGRADES', settings: 'SETTINGS', how: 'HOW TO PLAY', resume: 'RESUME', restart: 'RESTART CHAPTER', main: 'MAIN MENU', start: 'BEGIN MISSION', next: 'NEXT CHAPTER', retry: 'TRY AGAIN', victory: 'CHAPTER COMPLETE', defeat: 'JOURNEY INTERRUPTED', completed: 'COMPLETED', locked: 'LOCKED', select: 'SELECT', back: 'BACK', save: 'SAVE & RETURN', language: 'LANGUAGE', difficulty: 'DIFFICULTY', sound: 'SOUND', easy: 'STORY', normal: 'NORMAL', hard: 'VETERAN', shards: 'UPGRADE SHARDS', buy: 'UPGRADE', health: 'VITALITY', blade: 'BLADE POWER', bow: 'ARCHERY', objective: 'OBJECTIVE', chapter: 'CHAPTER', healthLabel: 'HEALTH', boss: 'BOSS', pause: 'PAUSED', howText: 'Move: A / D or ← / → · Jump: W / ↑ · Light: J · Heavy: K · Bow: L · Dodge: SHIFT · Special: Q · Interact: E · Pause: ESC. On mobile, use the on-screen controls. Defeat the boss to finish each chapter.', earned: 'SHARDS EARNED', rating: 'MISSION RATING', achievements: 'ACHIEVEMENTS', campaign: 'CAMPAIGN COMPLETE', character: 'PLAY AS', choose: 'Choose a character', notEnough: 'Not enough shards.' },
  hi: { new: 'नई यात्रा', continue: 'जारी रखें', chapters: 'अध्याय चुनें', characters: 'पात्र', upgrades: 'अपग्रेड', settings: 'सेटिंग्स', how: 'कैसे खेलें', resume: 'जारी रखें', restart: 'अध्याय दोबारा खेलें', main: 'मुख्य मेनू', start: 'मिशन शुरू करें', next: 'अगला अध्याय', retry: 'फिर प्रयास करें', victory: 'अध्याय पूरा हुआ', defeat: 'यात्रा रुक गई', completed: 'पूरा', locked: 'बंद', select: 'चुनें', back: 'वापस', save: 'सेव करके लौटें', language: 'भाषा', difficulty: 'कठिनाई', sound: 'ध्वनि', easy: 'कहानी', normal: 'सामान्य', hard: 'कठिन', shards: 'अपग्रेड शार्ड', buy: 'अपग्रेड', health: 'स्वास्थ्य', blade: 'तलवार की ताकत', bow: 'तीरंदाजी', objective: 'लक्ष्य', chapter: 'अध्याय', healthLabel: 'स्वास्थ्य', boss: 'बॉस', pause: 'रुका हुआ', howText: 'चलें: A / D या ← / → · कूदें: W / ↑ · हल्का वार: J · भारी वार: K · तीर: L · बचाव: SHIFT · खास क्षमता: Q · बातचीत: E · रोकें: ESC। मोबाइल पर स्क्रीन के बटन इस्तेमाल करें। हर अध्याय पूरा करने के लिए बॉस को हराएँ।', earned: 'मिले शार्ड', rating: 'मिशन रेटिंग', achievements: 'उपलब्धियाँ', campaign: 'अभियान पूरा', character: 'पात्र चुनें', choose: 'अपना पात्र चुनें', notEnough: 'पर्याप्त शार्ड नहीं हैं।' }
};
const HI_CHAPTERS = ['ऑरेलिया का उत्तराधिकारी','जंगल की पुकार','खोई हुई चुनौती','ऑरेलिया का पतन','अपहरण','खोए राज्य के साथी','महान यात्रा','निषिद्ध साम्राज्य','दो राज्यों का युद्ध','अंतिम साया','ऑरेलिया की वापसी'];
const HI_OBJECTIVES = ['राजसी योद्धा परीक्षाएँ पूरी करें और अखाड़े के विजेता को हराएँ।','जंगल के रास्ते पार करें, चौकी की रक्षा करें और वनराज को रोकें।','आयरनहोल्ड की परीक्षाओं में टिकें और गठबंधन हासिल करें।','सीमावर्ती रास्ता पार करें और कैएल तथा एलारा की रक्षा करें।','मालग्राव की सेना को पार कर तट तक पहुँचें।','राइडेन को उसका किला वापस दिलाएँ और कबीले का साथ पाएँ।','समुद्री रास्ता पार करें और बाहरी चौकी में प्रवेश करें।','किले में घुसें, एलारा को खोजें और महल से निकलें।','दुश्मन की पंक्ति तोड़ें, साथियों को बचाएँ और कोलोसस को गिराएँ।','मालग्राव को हराकर युद्ध समाप्त करें।','ऑरेलिया लौटें और अंतिम मैत्रीपूर्ण परीक्षा पूरी करें।'];
const HI_INTROS = [
  'ऑरेलिया घाटी के ऊपर चमकता है। युवा अरिन राजा एल्ड्रिक की निगरानी में प्रशिक्षण लेता है। आज अंतिम परीक्षा शुरू होती है।',
  'दूर के गाँवों पर जंगल के जीव हमले कर रहे हैं। अरिन अनुभवी खोजी एल्डेन के साथ छिपे रास्तों की ओर निकलता है।',
  'लोहे के पुलों और भट्टियों वाला आयरनहोल्ड अरिन से राजवंश नहीं, कौशल का प्रमाण माँगता है।',
  'विश्वासघात से ऑरेलिया में फूट पड़ती है। अरिन कैएल और एलारा के साथ राजधानी से दूर निकलता है।',
  'मिस्टफॉल में मालग्राव जाल बिछाता है। धुएँ और लहरों के बीच एलारा को बंदी बनाकर नॉक्टर्निया ले जाया जाता है।',
  'सनकन वैली में अरिन की मुलाकात राइडेन से होती है। उसका कबीला अपने ही पुराने सेनापति से लड़ रहा है।',
  'लाल तट से होकर साथी समुद्री सफर पर निकलते हैं। असाधारण ताकत वाला तोरन उनके साथ जुड़ता है।',
  'अरिन नॉक्टर्निया में गुप्त रूप से प्रवेश करता है। किले के भीतर उसे एलारा महल के बगीचे में मिलती है।',
  'मित्र सेनाएँ काले मैदान में नॉक्टर्निया की सेना से भिड़ती हैं। अंतिम मोर्चे पर सभी साथी एकजुट होते हैं।',
  'नॉक्टर्निया के केंद्र में अरिन का सामना मालग्राव से होता है। हर सीख और हर साथी इस अंतिम मुकाबले तक लाए हैं।',
  'युद्ध समाप्त हो चुका है। साथी ऑरेलिया लौटते हैं और राजा एल्ड्रिक उन्हें पुनर्निर्माण करते नगर में स्वागत करते हैं।'
];
const HI_OUTROS = ['अरिन शाही रक्षक का पदचिह्न अर्जित करता है। दूर हरे क्षितिज पर धुआँ उठता दिखाई देता है।','गाँव सुरक्षित हैं। एल्डेन को पूर्व दिशा में जाते काले लोहे के निशान मिलते हैं।','आयरनहोल्ड साथ देने का वचन देता है। सुबह होने से पहले ऑरेलिया से एक मुहरबंद संदेश आता है।','जाली आदेशों से मालग्राव का नाम सामने आता है। मिस्टफॉल के पास काला बेड़ा देखा गया है।','युद्धपोत लाल चट्टानों के पार गायब हो जाता है। अरिन को सनकन वैली का रास्ता मिलता है।','राइडेन खोज में शामिल होता है। उसके गुप्तचर लाल तट तक जाने वाला रास्ता ढूँढते हैं।','बाहरी किला गिर जाता है। धुंध के पार नॉक्टर्निया के काले मीनार दिखाई देते हैं।','एलारा सुरक्षित निकल आती है। किले का अलार्म सभी सेनापतियों को युद्धभूमि में बुलाता है।','कोलोसस गिर जाता है। अब शाही किले का रास्ता खुल गया है।','काले झंडे गिर जाते हैं। सेनाएँ हथियार रख देती हैं और किले तक सुबह की रोशनी पहुँचती है।','ऑरेलिया फिर उठ खड़ा होता है। अरिन की कहानी लोगों को साथ लाने के लिए याद रखी जाती है।'
];
const HI_DIALOGUE = [
  [['एल्ड्रिक','पद विरासत में मिलता है। भरोसा कमाना पड़ता है।'],['अरिन','तो मेरे काम ही मेरी बात कहेंगे।'],['कैएल','कोशिश करना कि विजेता को बहुत आसानी से न हराओ।']],
  [['एल्डेन','जंगल डरा हुआ है। डरी हुई चीज़ें खतरनाक हो सकती हैं।'],['अरिन','तो लोगों को सुरक्षित निकलने का समय देते हैं।'],['एल्डेन','अच्छा। जड़ों के ऊपर भी नज़र रखना।']],
  [['योद्धा','मजबूत बाजू आम हैं। स्थिर दिमाग दुर्लभ है।'],['अरिन','तो दोनों की परीक्षा लो।'],['एलारा','आयरनहोल्ड ने वर्षों से किसी साथी का स्वागत नहीं किया।']],
  [['एल्ड्रिक','दरवाज़े बंद होने से पहले निकल जाओ। लोगों को लड़ाई से बचाओ।'],['कैएल','मैं इस बार पीछे नहीं रहूँगा।'],['एलारा','सच इस संदेश में है। हमें तट तक पहुँचना होगा।']],
  [['मालग्राव','उम्मीद एक उपयोगी बेड़ी है।'],['जोराथ','भागो, अरिन! यह रास्ता हमेशा नहीं टिकेगा।'],['अरिन','मैं उसे ढूँढकर रहूँगा।']],
  [['राइडेन','हम ताज के पीछे नहीं चलते। हम उनके साथ चलते हैं जो साथ खड़े हों।'],['अरिन','तो मेरे पीछे नहीं, मेरे साथ खड़े रहो।'],['राइडेन','यह बात मुझे मंज़ूर है।']],
  [['तोरन','मैं आया या न आता, पुल गिरने ही वाला था।'],['राइडेन','तुम हर बार कुछ तोड़कर परिचय देते हो?'],['तोरन','सिर्फ़ तब, जब उसे टूटना चाहिए।']],
  [['एलारा','मुझे पता था तुम रास्ता ढूँढ लोगे।'],['अरिन','हम साथ निकलेंगे। अब कोई अकेला नहीं भागेगा।'],['एलारा','तो पहरेदारों को रास्ते में आने का पछतावा होने दो।']],
  [['कैएल','तुम कठिन रास्ते से आए। मैंने मुख्य दरवाज़ा लिया।'],['राइडेन','मेरा अतीत यहीं खत्म होगा।'],['तोरन','तो चलो, एक बड़ा रास्ता बनाते हैं।']],
  [['मालग्राव','दो राज्य, एक सिंहासन। मैंने बस उनका डर दिखाया।'],['अरिन','तुमने डर को ताकत समझ लिया।'],['एलारा','हम तुम्हारे साथ हैं, अरिन। इसे खत्म करो।']],
  [['एल्ड्रिक','तुम सिर्फ़ जीत नहीं, लोगों को साथ लेकर लौटे हो।'],['अरिन','राज्य उसकी दीवारें नहीं होता। वह उसके लोग होते हैं।'],['एलारा','तो कुछ ऐसा बनाएँ जिसकी रक्षा करना सार्थक हो।']]
];

export class GameUI {
  constructor() {
    this.layer = document.getElementById('screen-layer'); this.hud = document.getElementById('hud'); this.touch = document.getElementById('touch-controls');
    this.onAction = () => {}; this.layer.addEventListener('click', e => { const b = e.target.closest('[data-action]'); if (b && !b.disabled) this.onAction(b.dataset.action, b); });
    document.getElementById('pause-button').addEventListener('click', () => this.onAction('pause'));
    this.dialogueNext = null;
  }
  t(key, lang = 'en') { return (COPY[lang] || COPY.en)[key] || COPY.en[key] || key; }
  showScreen(html) { this.layer.innerHTML = html; this.layer.classList.remove('hidden'); }
  hideScreen() { this.layer.innerHTML = ''; this.layer.classList.add('hidden'); }
  showMenu(save) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    const done = save.completed.length;
    this.showScreen(`<section class="menu-shell"><div class="menu-brand"><div class="brand-kicker">GAMERKIE PRESENTS</div><img class="menu-logo" src="assets/logo/shadow-reign.svg" alt="Shadow Reign – GamerKie Edition"><h1 class="visually-hidden">SHADOW REIGN</h1><p>ONE WARRIOR. ONE LOST KINGDOM. AN EPIC JOURNEY.</p></div><div class="menu-actions"><button data-action="new" class="primary">NEW JOURNEY</button><button data-action="continue" ${done ? '' : 'disabled'}>CONTINUE <small>${done ? `CHAPTER ${Math.min(11, done + 1)} READY` : 'NO SAVE YET'}</small></button><button data-action="chapters">CHAPTER SELECT</button><button data-action="characters">CHARACTERS</button><button data-action="upgrades">UPGRADES</button><button data-action="settings">SETTINGS</button><button data-action="achievements">ACHIEVEMENTS</button><button data-action="how">HOW TO PLAY</button></div><div class="menu-bottom"><span>AN ORIGINAL FANTASY ADVENTURE</span><span>© 2026 GAMERKIE</span></div></section>`);
  }
  showChapters(save) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    const cards = CHAPTERS.map(ch => {
      const unlocked = ch.id === 1 || save.completed.includes(ch.id - 1) || save.completed.includes(ch.id);
      const complete = save.completed.includes(ch.id);
      return `<button class="chapter-card ${unlocked ? '' : 'locked'} ${complete ? 'done' : ''}" data-action="play-chapter" data-id="${ch.id}" ${unlocked ? '' : 'disabled'}><span class="chapter-no">CHAPTER ${String(ch.id).padStart(2,'0')}</span><strong>${save.language === 'hi' ? HI_CHAPTERS[ch.id - 1] : ch.title}</strong><small>${ch.region} · ${ch.subtitle}</small><em>${complete ? '✓ COMPLETED' : unlocked ? 'PLAY CHAPTER' : 'LOCKED'}</em></button>`;
    }).join('');
    this.showScreen(`<section class="panel wide"><header><div><span class="eyebrow">THE CONTINENT OF ELDORIA</span><h2>${this.t('chapters', save.language)}</h2></div><button class="icon-button" data-action="menu">✕</button></header><div class="chapter-grid">${cards}</div><footer><button class="secondary" data-action="menu">${this.t('back', save.language)}</button><span>${save.completed.length}/11 ${save.language === 'hi' ? 'अध्याय पूरे' : 'CHAPTERS COMPLETE'}</span></footer></section>`);
  }
  showCharacters(save) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    const unlocked = availableCharacters(save.completed);
    const cards = Object.values(CHARACTERS).map(c => {
      const can = unlocked.some(x => x.id === c.id), selected = save.selectedCharacter === c.id;
      return `<article class="character-card ${can ? '' : 'locked'} ${selected ? 'selected' : ''}"><div class="character-art ${c.id}"><i></i><b></b></div><span class="eyebrow">${can ? (selected ? 'CURRENT FIGHTER' : 'AVAILABLE') : `UNLOCK AT CHAPTER ${c.unlockedAt}`}</span><h3>${c.name}</h3><p>${c.title}</p><small>${c.description}</small><button data-action="select-character" data-id="${c.id}" ${can ? '' : 'disabled'}>${selected ? 'SELECTED' : this.t('select', save.language)}</button></article>`;
    }).join('');
    this.showScreen(`<section class="panel wide"><header><div><span class="eyebrow">FOUR FIGHTERS · FOUR STYLES</span><h2>${this.t('characters', save.language)}</h2></div><button class="icon-button" data-action="menu">✕</button></header><div class="character-grid">${cards}</div><footer><button class="secondary" data-action="menu">${this.t('back', save.language)}</button></footer></section>`);
  }
  showUpgrades(save) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    const costs = { health: 2 + save.upgrades.health * 2, blade: 2 + save.upgrades.blade * 2, bow: 2 + save.upgrades.bow * 2 };
    const labels = { health: this.t('health', save.language), blade: this.t('blade', save.language), bow: this.t('bow', save.language) };
    const rows = Object.keys(costs).map(k => `<div class="upgrade-row"><div><strong>${labels[k]}</strong><small>LEVEL ${save.upgrades[k]} · COST ${costs[k]} SHARDS</small></div><button data-action="upgrade" data-id="${k}" ${save.shards < costs[k] || save.upgrades[k] >= 5 ? 'disabled' : ''}>${this.t('buy', save.language)}</button></div>`).join('');
    this.showScreen(`<section class="panel compact"><header><div><span class="eyebrow">PERMANENT CHARACTER IMPROVEMENTS</span><h2>${this.t('upgrades', save.language)}</h2></div><button class="icon-button" data-action="menu">✕</button></header><div class="shard-balance">✦ <strong>${save.shards}</strong> ${this.t('shards', save.language)}</div>${rows}<p class="muted">Complete chapters to earn shards. Upgrades are saved on this device.</p><footer><button class="secondary" data-action="menu">${this.t('back', save.language)}</button></footer></section>`);
  }
  showSettings(save, soundOn) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    this.showScreen(`<section class="panel compact"><header><div><span class="eyebrow">PREFERENCES</span><h2>${this.t('settings', save.language)}</h2></div><button class="icon-button" data-action="menu">✕</button></header><div class="setting-row"><span>${this.t('language', save.language)}</span><div><button data-action="language" data-id="en" class="${save.language === 'en' ? 'active' : ''}">ENGLISH</button><button data-action="language" data-id="hi" class="${save.language === 'hi' ? 'active' : ''}">हिन्दी</button></div></div><div class="setting-row"><span>${this.t('difficulty', save.language)}</span><div><button data-action="difficulty" data-id="story" class="${save.difficulty === 'story' ? 'active' : ''}">STORY</button><button data-action="difficulty" data-id="normal" class="${save.difficulty === 'normal' ? 'active' : ''}">NORMAL</button><button data-action="difficulty" data-id="veteran" class="${save.difficulty === 'veteran' ? 'active' : ''}">VETERAN</button></div></div><div class="setting-row"><span>${this.t('sound', save.language)}</span><button data-action="sound">${soundOn ? 'ON' : 'OFF'}</button></div><footer><button class="secondary" data-action="menu">${this.t('back', save.language)}</button></footer></section>`);
  }
  showHow(save) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    this.showScreen(`<section class="panel compact"><header><div><span class="eyebrow">THE FIELD MANUAL</span><h2>${this.t('how', save.language)}</h2></div><button class="icon-button" data-action="menu">✕</button></header><p class="manual-copy">${this.t('howText', save.language)}</p><div class="manual-grid"><span><b>A / D</b> MOVE</span><span><b>W</b> JUMP</span><span><b>J</b> LIGHT</span><span><b>K</b> HEAVY</span><span><b>L</b> BOW</span><span><b>SHIFT</b> DODGE</span><span><b>Q</b> SPECIAL</span><span><b>ESC</b> PAUSE</span></div><footer><button class="secondary" data-action="menu">${this.t('back', save.language)}</button></footer></section>`);
  }
  showIntro(chapter, lang, onStart) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    const title = lang === 'hi' ? HI_CHAPTERS[chapter.id - 1] : chapter.title;
    const intro = lang === 'hi' ? HI_INTROS[chapter.id - 1] : chapter.intro;
    this.dialogueNext = onStart;
    this.showScreen(`<section class="cinematic"><span class="eyebrow">CHAPTER ${String(chapter.id).padStart(2,'0')} · ${chapter.region}</span><h2>${title}</h2><h3>${chapter.subtitle}</h3><p>${intro}</p><div class="cinematic-objective"><small>${this.t('objective', lang)}</small><strong>${lang === 'hi' ? HI_OBJECTIVES[chapter.id - 1] : chapter.objective}</strong></div><button class="primary" data-action="intro-start">${this.t('start', lang)} <b>→</b></button></section>`);
  }
  showDialogue(speaker, line, lang, next) {
    const translate = lang === 'hi' ? this.findHindiLine(speaker, line) : null;
    this.dialogueNext = next;
    this.showScreen(`<section class="dialogue-card"><div class="speaker">${lang === 'hi' && translate ? translate[0] : speaker}</div><p>${lang === 'hi' && translate ? translate[1] : line}</p><button data-action="dialogue-next">${lang === 'hi' ? 'आगे बढ़ें' : 'CONTINUE'} <b>→</b></button><span class="skip-hint">${lang === 'hi' ? 'स्किप करने के लिए ESC' : 'ESC TO SKIP'}</span></section>`);
  }
  findHindiLine(speaker, line) {
    for (let i = 0; i < HI_DIALOGUE.length; i++) for (let j = 0; j < HI_DIALOGUE[i].length; j++) {
      const [enSpeaker, enLine] = (awaitlessLine(i, j));
      if (enSpeaker === speaker && enLine === line) return HI_DIALOGUE[i][j];
    }
    return null;
  }
  hideDialogue() { this.dialogueNext = null; this.hideScreen(); }
  beginDialogue() { const fn = this.dialogueNext; this.dialogueNext = null; fn?.(); }
  showPause(lang) {
    this.touch.classList.add('hidden');
    this.showScreen(`<section class="panel compact pause-panel"><span class="eyebrow">SHADOW REIGN</span><h2>${this.t('pause', lang)}</h2><button class="primary" data-action="resume">${this.t('resume', lang)}</button><button data-action="restart">${this.t('restart', lang)}</button><button data-action="how">${this.t('how', lang)}</button><button class="secondary" data-action="menu">${this.t('main', lang)}</button></section>`);
  }
  showResult(win, chapter, save, nextAvailable = false, stats = {}) {
    this.hud.classList.add('hidden'); this.touch.classList.add('hidden');
    const lang = save.language; const title = lang === 'hi' ? HI_CHAPTERS[chapter.id - 1] : chapter.title;
    const completeCopy = win ? this.t('victory', lang) : this.t('defeat', lang);
    const outro = win ? (lang === 'hi' ? HI_OUTROS[chapter.id - 1] : chapter.outro) : (lang === 'hi' ? 'साथियों को आपकी ज़रूरत है। फिर से प्रयास करें।' : 'Your allies still need you. Regroup and try again.');
    const ratio = stats.healthRatio ?? ((stats.health ?? 0) > 75 ? 1 : .4);
    const rating = ratio > .75 ? 'S' : ratio > .4 ? 'A' : 'B';
    this.showScreen(`<section class="result-card"><span class="eyebrow">${win ? 'MISSION REPORT' : 'FIELD REPORT'}</span><h2>${completeCopy}</h2><h3>${title}</h3><p>${outro}</p>${win ? `<div class="result-stats"><div><b>✦ ${stats.shardsEarned ?? (2 + Math.min(3, Math.floor(chapter.id / 3)))}</b><small>${this.t('earned', lang)}</small></div><div><b>${chapter.id}/11</b><small>CHAPTER</small></div><div><b>${save.completed.length}/11</b><small>CAMPAIGN</small></div><div><b>${rating}</b><small>${this.t('rating', lang)}</small></div></div>` : ''}<div class="result-actions">${win && nextAvailable ? `<button class="primary" data-action="next">${this.t('next', lang)} →</button>` : win && chapter.id === 11 ? `<button class="primary" data-action="challenge">CHALLENGE MODE →</button>` : `<button class="primary" data-action="retry">${win ? this.t('chapters', lang) : this.t('retry', lang)}</button>`}<button class="secondary" data-action="menu">${this.t('main', lang)}</button></div></section>`);
  }
  showHud(chapter, player, boss, visible, objective, save) {
    this.hud.classList.remove('hidden'); this.touch.classList.remove('hidden');
    document.getElementById('hud-chapter').textContent = `CHAPTER ${String(chapter.id).padStart(2,'0')} · ${chapter.region}`;
    document.getElementById('hud-character').textContent = player.character.name;
    document.getElementById('health-fill').style.width = `${Math.max(0, player.hp / player.maxHp * 100)}%`;
    document.getElementById('health-text').textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
    document.getElementById('objective-text').textContent = objective;
    const bossWrap = document.getElementById('boss-hud'); bossWrap.classList.toggle('hidden', !visible || !boss?.alive);
    if (boss) { document.getElementById('boss-name').textContent = boss.name; document.getElementById('boss-fill').style.width = `${Math.max(0, boss.hp / boss.maxHp * 100)}%`; }
    document.getElementById('shards-count').textContent = save.shards;
  }
  showToast(message) {
    const el = document.getElementById('toast'); if (!el) return; el.textContent = message; el.classList.add('show'); clearTimeout(this.toastTimer); this.toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
}

function awaitlessLine(i, j) {
  const map = [
    [['ALDRIC','A title is inherited. Trust is earned.'],['ARIN','Then let my actions speak.'],['KAEL','Try not to make the champion look too easy.']],
    [['ELDEN','The forest is frightened. Frightened things can be dangerous.'],['ARIN','Then we give the people time to get clear.'],['ELDEN','Good. Keep your eyes above the roots.']],
    [['VETERAN','A strong arm is common. A steady mind is rare.'],['ARIN','Then test both.'],['ELARA','Ironhold has not welcomed an ally in years. You may have changed that.']],
    [['ALDRIC','Leave before the gates close. Save the people from the fighting.'],['KAEL','I am not staying behind again.'],['ELARA','The truth is in this dispatch. We have to reach the coast.']],
    [['MALGRAV','Hope makes a useful chain.'],['JORATH','Run, Arin! This pass will not hold forever.'],['ARIN','I will find her. I swear it.']],
    [['RYDEN','We do not follow crowns. We follow those who stand beside us.'],['ARIN','Then stand with me, not behind me.'],['RYDEN','That, I can respect.']],
    [['TORAN','That bridge was going to fall whether I arrived or not.'],['RYDEN','You always introduce yourself by breaking something?'],['TORAN','Only when it needs breaking.']],
    [['ELARA','I knew you would find a way.'],['ARIN','We leave together. No more running alone.'],['ELARA','Then make the guards regret standing in our way.']],
    [['KAEL','You took the hard road. I took the front gate.'],['RYDEN','My past ends here.'],['TORAN','Then let us make a very large opening.']],
    [['MALGRAV','Two kingdoms. One throne. I merely showed them what they already feared.'],['ARIN','You mistook fear for strength.'],['ELARA','We are with you, Arin. Finish this.']],
    [['ALDRIC','You returned with more than victory. You returned with people.'],['ARIN','A kingdom is not its walls. It is everyone who calls it home.'],['ELARA','Then let us build something worth protecting.']]
  ];
  return map[i]?.[j] || [];
}
