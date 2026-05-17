// PARTY UP — mock data for CS2 (Faceit-based) teammate finder
(function(){
  const GAMES = { cs2: { name: 'CS2', short: 'CS2', cls: 'gchip-cs2' } };

  const ALL_MAPS = ['Mirage', 'Inferno', 'Ancient', 'Anubis', 'Nuke', 'Dust2', 'Overpass', 'Vertigo', 'Train'];
  const ROLES = ['AWPer', 'IGL', 'Entry', 'Lurker', 'Support', 'Rifler'];
  const SIDES = ['A-site', 'B-site', 'Both'];
  // Mood/vibe tags shown on card top
  const VIBE_TAGS = ['Chill', 'Sweat', 'Турниры', 'Скримы'];

  const PROFILES = [
    {
      id: 1, nick: 'shadowclap', name: 'Миша', age: 22, region: 'EU West',
      online: true, verified: true, hasMic: true, vibe: 'Sweat',
      bio: 'Ищу пиплу в премьер. Калмовые коммсы, без рейджа. Тиммейт ≠ психотерапевт.',
      faceitNick: 'sh4dowclap', faceitUrl: 'faceit.com/en/players/sh4dowclap',
      elo: 2150, peak: 2280,
      role: 'AWPer', side: 'B-site', hours: 1800,
      maps: ['Mirage', 'Inferno', 'Ancient', 'Anubis'],
      playTime: 'Вечером · 19–23',
      langs: ['RU', 'EN'],
      tags: ['Микрофон', 'Без алко', 'Турниры', 'Discord'],
      contacts: { tg: '@shadowclap', steam: 'shadowclap22', discord: 'shadowclap#1408' },
      gradient: ['#3A1E54', '#0D2A4C'],
    },
    {
      id: 2, nick: 'mira.exe', name: 'Мира', age: 20, region: 'EU East',
      online: true, verified: true, hasMic: true, vibe: 'Chill',
      bio: 'Support-мейн. Дам флешку как мама в детстве — точно по времени. Ищу постоянное звено.',
      faceitNick: 'miraex', faceitUrl: 'faceit.com/en/players/miraex',
      elo: 1450, peak: 1610,
      role: 'Support', side: 'A-site', hours: 1200,
      maps: ['Mirage', 'Nuke', 'Overpass'],
      playTime: 'Днём · 14–18',
      langs: ['RU'],
      tags: ['Микрофон', 'Каждый день', 'Стримлю'],
      contacts: { tg: '@mira_ex', vk: 'vk.com/miraex' },
      gradient: ['#5B1A3E', '#1E1042'],
    },
    {
      id: 3, nick: 'verdict', name: 'Артём', age: 24, region: 'EU West',
      online: false, verified: true, hasMic: true, vibe: 'Турниры',
      bio: 'CS с 2012. Не топ-1 фрагер, но смок учу правильно. Ищу IGL-овых тиммейтов.',
      faceitNick: 'VerdictRu', faceitUrl: 'faceit.com/en/players/VerdictRu',
      elo: 2680, peak: 2840,
      role: 'IGL', side: 'Both', hours: 5400,
      maps: ['Inferno', 'Mirage', 'Ancient', 'Anubis', 'Nuke'],
      playTime: 'Выходные · с утра',
      langs: ['RU', 'EN'],
      tags: ['Микрофон', 'Турниры', 'Опытный', 'Скримы'],
      contacts: { tg: '@verdict_cs', discord: 'verdict#0001', steam: 'verdictru' },
      gradient: ['#2A3D1F', '#0F2530'],
    },
    {
      id: 4, nick: 'orchid.k', name: 'Кира', age: 21, region: 'CIS',
      online: true, verified: false, hasMic: true, vibe: 'Sweat',
      bio: 'Entry-мейн. Не люблю когда люди молчат на пуш. Звено на 3 каждый вечер.',
      faceitNick: 'orchid_k', faceitUrl: null,
      elo: 1820, peak: 1940,
      role: 'Entry', side: 'A-site', hours: 980,
      maps: ['Mirage', 'Dust2', 'Anubis'],
      playTime: 'Вечером · 20–24',
      langs: ['RU', 'EN'],
      tags: ['Микрофон', 'Вечерами'],
      contacts: { tg: '@orchid_k' },
      gradient: ['#1A3F4D', '#2A1740'],
    },
    {
      id: 5, nick: 'zen0', name: 'Никита', age: 26, region: 'EU East',
      online: false, verified: true, hasMic: true, vibe: 'Chill',
      bio: 'Командный, спокойный. Турниры по выходным, премьер по будням. Без флейма принципиально.',
      faceitNick: 'zen0_cs', faceitUrl: 'faceit.com/en/players/zen0_cs',
      elo: 2350, peak: 2520,
      role: 'Lurker', side: 'Both', hours: 3800,
      maps: ['Inferno', 'Vertigo', 'Train', 'Ancient'],
      playTime: 'Ночь · 22–02',
      langs: ['RU', 'EN'],
      tags: ['Микрофон', 'Турниры', 'Выходные'],
      contacts: { tg: '@zen0', discord: 'zen0#2611' },
      gradient: ['#3A2510', '#1A2025'],
    },
    {
      id: 6, nick: 'feline', name: 'Алиса', age: 19, region: 'CIS',
      online: true, verified: true, hasMic: true, vibe: 'Скримы',
      bio: 'Топ-1500 регион. Ищу скрим-партнёров для рангов. Серьёзный подход.',
      faceitNick: 'feline_awp', faceitUrl: 'faceit.com/en/players/feline_awp',
      elo: 2950, peak: 3050,
      role: 'AWPer', side: 'A-site', hours: 4500,
      maps: ['Mirage', 'Inferno', 'Nuke', 'Ancient', 'Anubis'],
      playTime: 'Каждый день · 18+',
      langs: ['RU'],
      tags: ['Микрофон', 'Скримы', 'Каждый день', 'Опытный'],
      contacts: { tg: '@feline_awp', steam: 'felineawp', discord: 'feline#9001', vk: 'vk.com/feline_awp' },
      gradient: ['#0F3A38', '#1A1F40'],
    },
  ];

  const ME = {
    id: 99, nick: 'crowley',
    name: 'Виталий',
    age: 22, region: 'EU West', completion: 78,
    online: true, verified: true, hasMic: true, vibe: 'Sweat',
    bio: 'Rifler с подбегом. Ищу команду на ранги, играть могу почти каждый вечер.',
    faceitNick: 'crow1ey', faceitUrl: 'faceit.com/en/players/crow1ey',
    elo: 1880, peak: 2010,
    role: 'Rifler', side: 'B-site', hours: 1400,
    maps: ['Mirage', 'Inferno', 'Anubis'],
    playTime: 'Вечером · 19–23',
    langs: ['RU', 'EN'],
    tags: ['Микрофон', 'Вечерами', 'Discord'],
    contacts: { tg: '@crowley', steam: 'crowley22', discord: 'crowley#0099' },
    superLikes: 3,
    boosts: 1,
  };

  const LIKED_ME = [
    { id: 11, nick: 'soulflame', name: 'Лена',    age: 23, elo: 1650, role: 'Entry',  online: true,  hue: 320 },
    { id: 12, nick: 'wraith',    name: 'Денис',   age: 25, elo: 2480, role: 'IGL',    online: false, hue: 45 },
    { id: 13, nick: 'pulse',     name: 'Илья',    age: 21, elo: 1320, role: 'Rifler', online: true,  hue: 200 },
    { id: 14, nick: 'aria',      name: 'Аня',     age: 20, elo: 980,  role: 'Support',online: true,  hue: 165 },
    { id: 15, nick: 'frostbyte', name: 'Кирилл',  age: 26, elo: 2780, role: 'AWPer',  online: false, hue: 30 },
    { id: 16, nick: 'velvet',    name: 'Соня',    age: 22, elo: 1730, role: 'Lurker', online: true,  hue: 280 },
  ];

  const MATCHES = [
    { id: 21, nick: 'anastasia',  name: 'Настя',  elo: 1880, role: 'AWPer',  online: true,  hue: 320, last: 'Закинем катку?', time: '12м', unread: 2, isNew: false },
    { id: 22, nick: 'k_o_d_a',    name: 'Даня',   elo: 1240, role: 'Entry',  online: false, hue: 45,  last: 'gg, ливаем',     time: '1ч',  unread: 0, isNew: false },
    { id: 23, nick: 'svetlana_94',name: 'Света',  elo: 2120, role: 'IGL',    online: true,  hue: 200, last: 'мне понравилось, спам мут вкл', time: '4ч', unread: 0, isNew: false },
    { id: 24, nick: 'orchid.k',   name: 'Кира',   elo: 1820, role: 'Entry',  online: true,  hue: 190, last: 'НОВЫЙ МЭТЧ',     time: '',    unread: 0, isNew: true },
  ];

  // Moderation queue — pending profile reviews for admins
  const MOD_QUEUE = [
    { id: 'm1', kind: 'new',    name: 'Кирилл', nick: 'kkk_one', age: 19, elo: 1240, role: 'Entry',
      reason: 'Новая анкета', faceitNick: 'kkk_one', verified: true, ts: '2 мин', hue: 30, severity: 'low' },
    { id: 'm2', kind: 'report', name: 'Аноним', nick: 'spam_alex', age: 24, elo: 850, role: 'Rifler',
      reason: 'Жалоба: спам в био', count: 4, faceitNick: null, verified: false, ts: '8 мин', hue: 0, severity: 'high' },
    { id: 'm3', kind: 'photo',  name: 'Денис', nick: 'wraith', age: 25, elo: 2480, role: 'IGL',
      reason: 'Фото на проверке', faceitNick: 'wraithcs', verified: true, ts: '14 мин', hue: 45, severity: 'low' },
    { id: 'm4', kind: 'report', name: 'Игорь', nick: 'toxic_one', age: 28, elo: 1450, role: 'AWPer',
      reason: 'Токсичность · мут в чате', count: 2, faceitNick: 'igor_awp', verified: true, ts: '23 мин', hue: 200, severity: 'med' },
    { id: 'm5', kind: 'new',    name: 'Полина', nick: 'pln', age: 20, elo: 1670, role: 'Support',
      reason: 'Новая анкета', faceitNick: 'pln_sup', verified: true, ts: '32 мин', hue: 320, severity: 'low' },
    { id: 'm6', kind: 'edit',   name: 'Стас', nick: 'staz', age: 23, elo: 1980, role: 'Lurker',
      reason: 'Изменил bio · нужна проверка', faceitNick: 'staz_lurk', verified: true, ts: '1 ч', hue: 165, severity: 'low' },
  ];

  window.GAME_CATALOG = GAMES;
  window.PROFILES = PROFILES;
  window.ME = ME;
  window.LIKED_ME = LIKED_ME;
  window.MATCHES = MATCHES;
  window.ALL_MAPS = ALL_MAPS;
  window.ROLES = ROLES;
  window.SIDES = SIDES;
  window.VIBE_TAGS = VIBE_TAGS;
  window.MOD_QUEUE = MOD_QUEUE;
})();
