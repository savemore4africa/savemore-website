/*
  SAVEMORE GAMES: Quiz Challenge (Stage 2)
  - Runs entirely in the browser. No Firebase, no login, no network calls.
  - Scores, points and badges are for fun only and are never sent anywhere.
  - Best scores, points and badges are kept in this device's own browser
    storage. They are not a record and cannot affect any SAVEMORE balance.
*/
(function () {
  'use strict';

  var ROUND_SIZE = 10;
  var TIME_LIMIT = 20;          // seconds per question when the timer is on
  var SPEED_BONUS = 5;          // extra points for a correct answer with 10+ seconds left
  var POINTS = { easy: 10, medium: 15, hard: 20 };
  var RANK = { easy: 0, medium: 1, hard: 2 };
  var LEVEL_NAME = { mixed: 'Mixed', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  var BEST_KEY = 'smg_quiz_best_v2';
  var PROFILE_KEY = 'smg_quiz_profile_v1';
  var LETTERS = ['A', 'B', 'C', 'D'];
  var MIXED = { id: 'mixed', name: 'Mixed challenge', blurb: 'Questions from every category.' };

  var BADGES = [
    { id: 'first-round', name: 'First Round', desc: 'Finish your first quiz round.' },
    { id: 'perfect', name: 'Perfect Score', desc: 'Answer every question in a round correctly.' },
    { id: 'hard-hitter', name: 'Hard Hitter', desc: 'Get 7 or more right in a Hard round.' },
    { id: 'beat-clock', name: 'Beat the Clock', desc: 'Get 7 or more right in a timed round.' },
    { id: 'explorer', name: 'Explorer', desc: 'Finish rounds in 3 different categories.' },
    { id: 'streak-3', name: '3-Day Streak', desc: 'Play on 3 days in a row.' }
  ];

  function $(id) { return document.getElementById(id); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  var screens = {
    pick: $('screenPick'),
    setup: $('screenSetup'),
    play: $('screenPlay'),
    result: $('screenResult'),
    badges: $('screenBadges')
  };
  var data = window.SM_QUIZ;

  if (!data || !data.categories || !data.questions) {
    screens.pick.textContent = 'The quiz could not be loaded. Please refresh the page.';
    return;
  }

  var round = null;
  var setupCat = null;
  var lastScreen = 'pick';

  /* ---------- storage (this device only) ---------- */

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : null;
      return (parsed && typeof parsed === 'object') ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  function loadProfile() {
    var p = readJSON(PROFILE_KEY, {});
    p.badges = p.badges || {};
    p.cats = p.cats || {};
    p.days = Array.isArray(p.days) ? p.days : [];
    p.rounds = p.rounds || 0;
    p.points = p.points || 0;
    p.prefs = p.prefs || { level: 'mixed', timer: false };
    return p;
  }

  /* ---------- helpers ---------- */

  function show(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].hidden = (key !== name);
    });
    window.scrollTo(0, 0);
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function categoryById(id) {
    if (id === MIXED.id) return MIXED;
    for (var i = 0; i < data.categories.length; i++) {
      if (data.categories[i].id === id) return data.categories[i];
    }
    return MIXED;
  }

  function poolFor(catId) {
    if (catId === MIXED.id) return data.questions.slice();
    return data.questions.filter(function (q) { return q.cat === catId; });
  }

  // Choose the questions for one round. If there are not enough questions at the
  // chosen level, the nearest levels fill the round up to ROUND_SIZE.
  function buildRound(catId, level) {
    var all = poolFor(catId);
    if (level === 'mixed') return shuffle(all).slice(0, ROUND_SIZE);

    var same = shuffle(all.filter(function (q) { return q.level === level; }));
    if (same.length >= ROUND_SIZE) return same.slice(0, ROUND_SIZE);

    var target = RANK[level];
    var others = shuffle(all.filter(function (q) { return q.level !== level; }))
      .sort(function (a, b) {
        return Math.abs(RANK[a.level] - target) - Math.abs(RANK[b.level] - target);
      });
    return shuffle(same.concat(others).slice(0, ROUND_SIZE));
  }

  function todayString() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function dayNumber(str) {
    var p = str.split('-');
    return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000);
  }

  function hasThreeDayStreak(days) {
    var set = {};
    days.forEach(function (d) { set[dayNumber(d)] = true; });
    var n = dayNumber(todayString());
    return !!(set[n] && set[n - 1] && set[n - 2]);
  }

  /* ---------- screen 1: categories ---------- */

  function buildPick() {
    var list = $('catList');
    clear(list);
    var best = readJSON(BEST_KEY, {});
    var cats = data.categories.concat([MIXED]);

    cats.forEach(function (cat) {
      if (!poolFor(cat.id).length) return;

      var btn = el('button', 'cat-card');
      btn.type = 'button';
      btn.appendChild(el('strong', '', cat.name));
      btn.appendChild(el('span', 'blurb', cat.blurb));

      var b = best[cat.id];
      btn.appendChild(el('span', 'meta',
        b ? 'Your best: ' + b.correct + '/' + b.total + ' correct, ' + b.points + ' points.' : 'Not played yet.'));

      btn.addEventListener('click', function () { openSetup(cat.id); });
      list.appendChild(btn);
    });

    var p = loadProfile();
    var line = $('statsLine');
    clear(line);
    if (p.rounds) {
      line.appendChild(document.createTextNode('Rounds played: '));
      line.appendChild(el('strong', '', String(p.rounds)));
      line.appendChild(document.createTextNode('  |  Game points: '));
      line.appendChild(el('strong', '', String(p.points)));
      line.appendChild(document.createTextNode('  |  Badges: '));
      line.appendChild(el('strong', '', Object.keys(p.badges).length + '/' + BADGES.length));
    }

    lastScreen = 'pick';
    show('pick');
  }

  /* ---------- screen 2: setup ---------- */

  function openSetup(catId) {
    setupCat = catId;
    var cat = categoryById(catId);
    $('setupCat').textContent = cat.name + '. ' + cat.blurb;

    var prefs = loadProfile().prefs;
    var radios = document.getElementsByName('level');
    for (var i = 0; i < radios.length; i++) {
      radios[i].checked = (radios[i].value === prefs.level);
    }
    if (!document.querySelector('input[name="level"]:checked')) radios[0].checked = true;
    $('timerOn').checked = !!prefs.timer;

    show('setup');
  }

  function onStart() {
    var checked = document.querySelector('input[name="level"]:checked');
    var level = checked ? checked.value : 'mixed';
    var timed = $('timerOn').checked;

    var p = loadProfile();
    p.prefs = { level: level, timer: timed };
    writeJSON(PROFILE_KEY, p);

    startRound(setupCat, level, timed);
  }

  /* ---------- screen 3: play ---------- */

  function prepare(q) {
    var order = shuffle([0, 1, 2, 3]);
    var opts = order.map(function (i) { return q.options[i]; });
    return { q: q, options: opts, correctPos: order.indexOf(q.answer), locked: false, leftMs: 0 };
  }

  function startRound(catId, level, timed) {
    var picks = buildRound(catId, level);
    round = {
      catId: catId,
      level: level,
      timed: timed,
      items: picks.map(prepare),
      index: 0,
      correct: 0,
      points: 0,
      missed: [],
      timerId: null,
      deadline: 0
    };
    $('pointsNow').textContent = '0';
    $('timerChip').hidden = !timed;
    show('play');
    renderQuestion();
  }

  function setProgress(done) {
    var total = round.items.length;
    $('barFill').style.width = Math.round((done / total) * 100) + '%';
    $('bar').setAttribute('aria-valuemax', String(total));
    $('bar').setAttribute('aria-valuenow', String(done));
  }

  /* timer */

  function stopTimer() {
    if (round && round.timerId) {
      window.clearInterval(round.timerId);
      round.timerId = null;
    }
  }

  function paintTimer(leftMs) {
    var secs = Math.ceil(leftMs / 1000);
    $('timerNum').textContent = String(secs);
    $('timerChip').className = 'timer-chip' + (secs <= 5 ? ' low' : '');
  }

  function startTimer() {
    stopTimer();
    if (!round.timed) return;
    round.deadline = Date.now() + TIME_LIMIT * 1000;
    paintTimer(TIME_LIMIT * 1000);
    round.timerId = window.setInterval(function () {
      var left = Math.max(0, round.deadline - Date.now());
      paintTimer(left);
      if (left <= 0) onAnswer(-1);
    }, 250);
  }

  function renderQuestion() {
    var total = round.items.length;
    var item = round.items[round.index];

    $('progText').textContent = 'Question ' + (round.index + 1) + ' of ' + total;
    setProgress(round.index);
    $('catTag').textContent = categoryById(item.q.cat).name + ' | ' + LEVEL_NAME[item.q.level];
    $('qText').textContent = item.q.q;

    var box = $('options');
    clear(box);
    item.options.forEach(function (text, pos) {
      var btn = el('button', 'option');
      btn.type = 'button';
      btn.appendChild(el('span', 'opt-letter', LETTERS[pos]));
      btn.appendChild(el('span', 'opt-text', text));
      btn.appendChild(el('span', 'opt-mark', ''));
      btn.addEventListener('click', function () { onAnswer(pos); });
      box.appendChild(btn);
    });

    $('feedback').hidden = true;
    $('nextBtn').hidden = true;
    window.scrollTo(0, 0);
    startTimer();
  }

  function onAnswer(pos) {
    if (!round) return;
    var item = round.items[round.index];
    if (item.locked) return;
    item.locked = true;

    item.leftMs = round.timed ? Math.max(0, round.deadline - Date.now()) : 0;
    stopTimer();

    var timedOut = (pos === -1);
    var isRight = (pos === item.correctPos);
    var buttons = $('options').children;

    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var mark = b.lastChild;
      b.classList.add('locked');
      b.setAttribute('aria-disabled', 'true');
      if (i === item.correctPos) {
        b.classList.add('correct');
        mark.textContent = '\u2713 Correct';
      } else if (i === pos) {
        b.classList.add('wrong');
        mark.textContent = '\u2717 Your answer';
      } else {
        b.classList.add('dim');
      }
    }

    var fb = $('feedback');
    fb.className = 'feedback ' + (isRight ? 'good' : 'bad');

    if (isRight) {
      var gain = POINTS[item.q.level] || 10;
      var fast = round.timed && item.leftMs >= (TIME_LIMIT * 1000) / 2;
      if (fast) gain += SPEED_BONUS;
      round.correct++;
      round.points += gain;
      $('fbTitle').textContent = 'Correct! +' + gain + ' points' + (fast ? ' (includes speed bonus)' : '');
      $('fbAnswer').textContent = '';
      $('fbAnswer').hidden = true;
    } else {
      round.missed.push(item);
      $('fbTitle').textContent = timedOut ? 'Time is up.' : 'Not quite.';
      $('fbAnswer').hidden = false;
      $('fbAnswer').textContent = 'The correct answer is ' + LETTERS[item.correctPos] + ': ' + item.options[item.correctPos];
    }
    $('fbExplain').textContent = item.q.explain;
    $('pointsNow').textContent = String(round.points);

    setProgress(round.index + 1);

    var isLast = (round.index === round.items.length - 1);
    var next = $('nextBtn');
    next.textContent = isLast ? 'See my results' : 'Next question';
    fb.hidden = false;
    next.hidden = false;
    fb.focus();
  }

  function onNext() {
    if (round.index < round.items.length - 1) {
      round.index++;
      renderQuestion();
    } else {
      showResults();
    }
  }

  /* ---------- badges ---------- */

  function awardBadges(profile, correct, total) {
    var earned = [];
    function give(id) {
      if (!profile.badges[id]) {
        profile.badges[id] = todayString();
        earned.push(id);
      }
    }
    give('first-round');
    if (total >= 5 && correct === total) give('perfect');
    if (round.level === 'hard' && correct >= 7) give('hard-hitter');
    if (round.timed && correct >= 7) give('beat-clock');
    if (Object.keys(profile.cats).length >= 3) give('explorer');
    if (hasThreeDayStreak(profile.days)) give('streak-3');
    return earned;
  }

  function badgeById(id) {
    for (var i = 0; i < BADGES.length; i++) if (BADGES[i].id === id) return BADGES[i];
    return null;
  }

  function showBadges(from) {
    lastScreen = from || 'pick';
    var p = loadProfile();
    var count = Object.keys(p.badges).length;
    $('badgesSummary').textContent = count + ' of ' + BADGES.length + ' badges earned. Game points on this device: ' + p.points + '.';

    var list = $('badgeList');
    clear(list);
    BADGES.forEach(function (b) {
      var done = p.badges[b.id];
      var li = el('li', 'badge-item ' + (done ? 'earned' : 'locked'));
      li.appendChild(el('span', 'b-icon', done ? '\u2605' : '?'));
      var box = el('div');
      box.appendChild(el('strong', '', b.name + (done ? ' (earned)' : '')));
      box.appendChild(el('small', '', b.desc));
      li.appendChild(box);
      list.appendChild(li);
    });
    show('badges');
  }

  /* ---------- screen 4: results ---------- */

  function tierText(correct, total) {
    var share = total ? correct / total : 0;
    if (share >= 0.9) return 'Excellent! You really know your stuff.';
    if (share >= 0.7) return 'Great work. Your knowledge is strong.';
    if (share >= 0.5) return 'Good start. Review the questions below and try again.';
    return 'Keep learning. Every round makes you better.';
  }

  function showResults() {
    stopTimer();
    var total = round.items.length;
    var correct = round.correct;
    var cat = categoryById(round.catId);

    $('resCat').textContent = cat.name + ' | ' + LEVEL_NAME[round.level] + (round.timed ? ' | Timed' : '');
    $('resScore').textContent = correct + '/' + total;
    $('resTier').textContent = tierText(correct, total);
    $('resPoints').textContent = 'Game points this round: ' + round.points;

    // best score for this category (by points)
    var best = readJSON(BEST_KEY, {});
    var prev = best[round.catId];
    if (!prev || round.points > prev.points) {
      best[round.catId] = { correct: correct, total: total, points: round.points };
      writeJSON(BEST_KEY, best);
      $('resBest').textContent = prev ? 'New best for this category!' : 'Your first score here is saved on this device.';
    } else {
      $('resBest').textContent = 'Your best here: ' + prev.correct + '/' + prev.total + ' (' + prev.points + ' points).';
    }

    // profile and badges
    var profile = loadProfile();
    profile.rounds += 1;
    profile.points += round.points;
    if (round.catId !== MIXED.id) profile.cats[round.catId] = true;
    var today = todayString();
    if (profile.days.indexOf(today) === -1) profile.days.push(today);
    if (profile.days.length > 60) profile.days = profile.days.slice(-60);
    var earned = awardBadges(profile, correct, total);
    writeJSON(PROFILE_KEY, profile);

    var bBox = $('resBadges');
    clear(bBox);
    if (earned.length) {
      bBox.appendChild(el('h2', '', earned.length === 1 ? 'New badge unlocked!' : 'New badges unlocked!'));
      earned.forEach(function (id) {
        var b = badgeById(id);
        var p = el('p');
        p.appendChild(el('strong', '', b.name + ': '));
        p.appendChild(document.createTextNode(b.desc));
        bBox.appendChild(p);
      });
      bBox.hidden = false;
    } else {
      bBox.hidden = true;
    }

    // questions to revisit
    var missedBox = $('missedBox');
    var list = $('missedList');
    clear(list);
    if (round.missed.length) {
      round.missed.forEach(function (item) {
        var row = el('div', 'missed-item');
        row.appendChild(el('p', 'missed-q', item.q.q));
        row.appendChild(el('p', 'missed-a', 'Correct answer: ' + item.options[item.correctPos]));
        row.appendChild(el('p', 'missed-e', item.q.explain));
        list.appendChild(row);
      });
      $('missedSummary').textContent = 'Questions to revisit (' + round.missed.length + ')';
      missedBox.open = false;
      missedBox.hidden = false;
    } else {
      missedBox.hidden = true;
    }

    // "?r=wa" gives WhatsApp a fresh address to read, so it builds a new preview card instead of reusing an old cached one.
    var pageUrl = window.location.href.split('#')[0].split('?')[0] + '?r=wa';
    var msg = 'I scored ' + correct + '/' + total + ' (' + round.points + ' points) on the SAVEMORE Quiz Challenge: ' +
      cat.name + ', ' + LEVEL_NAME[round.level] + '. Can you beat me? ' + pageUrl;
    $('shareBtn').href = 'https://wa.me/?text=' + encodeURIComponent(msg);

    lastScreen = 'result';
    show('result');
    $('resHeading').focus();
  }

  /* ---------- wiring ---------- */

  $('startBtn').addEventListener('click', onStart);
  $('setupBack').addEventListener('click', buildPick);
  $('nextBtn').addEventListener('click', onNext);
  $('badgesBtn').addEventListener('click', function () { showBadges('pick'); });
  $('resBadgesBtn').addEventListener('click', function () { showBadges('result'); });
  $('badgesBack').addEventListener('click', function () {
    if (lastScreen === 'result' && round) { show('result'); } else { buildPick(); }
  });

  $('exitBtn').addEventListener('click', function () {
    if (window.confirm('Leave this quiz? Your progress in this round will be lost.')) {
      stopTimer();
      round = null;
      buildPick();
    }
  });

  $('againBtn').addEventListener('click', function () {
    if (round) startRound(round.catId, round.level, round.timed);
  });

  $('changeBtn').addEventListener('click', function () {
    stopTimer();
    round = null;
    buildPick();
  });

  buildPick();
})();
