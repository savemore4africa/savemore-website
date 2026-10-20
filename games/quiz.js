/*
  SAVEMORE GAMES: Quiz Challenge (Stage 1)
  - Runs entirely in the browser. No Firebase, no login, no network calls.
  - Scores are for fun only. Nothing is sent or stored on any server.
  - The only thing saved is the player's best score per category,
    in this device's own browser storage.
*/
(function () {
  'use strict';

  var ROUND_SIZE = 10;
  var POINTS_PER_CORRECT = 10;
  var STORE_KEY = 'smg_quiz_best_v1';
  var LETTERS = ['A', 'B', 'C', 'D'];
  var MIXED = { id: 'mixed', name: 'Mixed challenge', blurb: 'Questions from every category.' };

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

  var screens = { pick: $('screenPick'), play: $('screenPlay'), result: $('screenResult') };
  var data = window.SM_QUIZ;

  if (!data || !data.categories || !data.questions) {
    screens.pick.textContent = 'The quiz could not be loaded. Please refresh the page.';
    return;
  }

  var round = null;

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
    return null;
  }

  function poolFor(catId) {
    if (catId === MIXED.id) return data.questions.slice();
    return data.questions.filter(function (q) { return q.cat === catId; });
  }

  /* ---------- best scores (this device only) ---------- */

  function loadBest() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveBest(all) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(all));
    } catch (e) { /* storage unavailable: ignore */ }
  }

  /* ---------- screen 1: categories ---------- */

  function buildPick() {
    var list = $('catList');
    clear(list);
    var best = loadBest();
    var cats = data.categories.concat([MIXED]);

    cats.forEach(function (cat) {
      var count = poolFor(cat.id).length;
      if (!count) return;

      var btn = el('button', 'cat-card');
      btn.type = 'button';
      btn.appendChild(el('strong', '', cat.name));
      btn.appendChild(el('span', 'blurb', cat.blurb));

      var b = best[cat.id];
      var meta = b ? 'Your best: ' + b.correct + '/' + b.total + ' correct.' : 'Not played yet.';
      btn.appendChild(el('span', 'meta', meta));

      btn.addEventListener('click', function () { startRound(cat.id); });
      list.appendChild(btn);
    });

    show('pick');
  }

  /* ---------- screen 2: play ---------- */

  function prepare(q) {
    var order = shuffle([0, 1, 2, 3]);
    var opts = order.map(function (i) { return q.options[i]; });
    return { q: q, options: opts, correctPos: order.indexOf(q.answer), locked: false };
  }

  function startRound(catId) {
    var pool = shuffle(poolFor(catId)).slice(0, ROUND_SIZE);
    round = {
      catId: catId,
      items: pool.map(prepare),
      index: 0,
      correct: 0,
      missed: []
    };
    $('pointsNow').textContent = '0';
    show('play');
    renderQuestion();
  }

  function setProgress(done) {
    var total = round.items.length;
    $('barFill').style.width = Math.round((done / total) * 100) + '%';
    $('bar').setAttribute('aria-valuemax', String(total));
    $('bar').setAttribute('aria-valuenow', String(done));
  }

  function renderQuestion() {
    var total = round.items.length;
    var item = round.items[round.index];

    $('progText').textContent = 'Question ' + (round.index + 1) + ' of ' + total;
    setProgress(round.index);
    $('catTag').textContent = categoryById(item.q.cat).name;
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
  }

  function onAnswer(pos) {
    var item = round.items[round.index];
    if (item.locked) return;
    item.locked = true;

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
      round.correct++;
      $('fbTitle').textContent = 'Correct! +' + POINTS_PER_CORRECT + ' points';
      $('fbAnswer').textContent = '';
      $('fbAnswer').hidden = true;
    } else {
      round.missed.push(item);
      $('fbTitle').textContent = 'Not quite.';
      $('fbAnswer').hidden = false;
      $('fbAnswer').textContent = 'The correct answer is ' + LETTERS[item.correctPos] + ': ' + item.options[item.correctPos];
    }
    $('fbExplain').textContent = item.q.explain;
    $('pointsNow').textContent = String(round.correct * POINTS_PER_CORRECT);

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

  /* ---------- screen 3: results ---------- */

  function tierText(correct, total) {
    var share = total ? correct / total : 0;
    if (share >= 0.9) return 'Excellent! You really know your money.';
    if (share >= 0.7) return 'Great work. Your money knowledge is strong.';
    if (share >= 0.5) return 'Good start. Review the questions below and try again.';
    return 'Keep learning. Every round makes you better.';
  }

  function showResults() {
    var total = round.items.length;
    var correct = round.correct;
    var cat = categoryById(round.catId);

    $('resCat').textContent = cat.name;
    $('resScore').textContent = correct + '/' + total;
    $('resTier').textContent = tierText(correct, total);
    $('resPoints').textContent = 'Game points this round: ' + (correct * POINTS_PER_CORRECT);

    var best = loadBest();
    var prev = best[round.catId];
    if (!prev || correct > prev.correct) {
      best[round.catId] = { correct: correct, total: total };
      saveBest(best);
      $('resBest').textContent = prev ? 'New best for this category!' : 'Your first score in this category is saved on this device.';
    } else {
      $('resBest').textContent = 'Your best here: ' + prev.correct + '/' + prev.total + '.';
    }

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

    var pageUrl = window.location.href.split('#')[0].split('?')[0];
    var msg = 'I scored ' + correct + '/' + total + ' on the SAVEMORE Quiz Challenge (' + cat.name + '). Can you beat me? ' + pageUrl;
    $('shareBtn').href = 'https://wa.me/?text=' + encodeURIComponent(msg);

    show('result');
    $('resHeading').focus();
  }

  /* ---------- wiring ---------- */

  $('nextBtn').addEventListener('click', onNext);

  $('exitBtn').addEventListener('click', function () {
    if (window.confirm('Leave this quiz? Your progress in this round will be lost.')) {
      round = null;
      buildPick();
    }
  });

  $('againBtn').addEventListener('click', function () {
    if (round) startRound(round.catId);
  });

  $('changeBtn').addEventListener('click', function () {
    round = null;
    buildPick();
  });

  buildPick();
})();
