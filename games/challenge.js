/*
  SAVEMORE GAMES: Daily Challenge and Leaderboards (member features)

  - Does nothing unless games-config.js says enabled: true.
  - The browser never calculates or sends a score. It only sends the answers a player picked;
    the server (Cloud Functions) grades them and writes every result.
  - Members are recognised by their existing SAVEMORE Member Portal login (same site, same session).
    This page never asks for or handles a password.
  - The Firebase login library is loaded only when a player opens the Daily Challenge,
    so guests who just play the practice quiz download nothing extra.
*/
(function () {
  'use strict';

  var cfg = window.SM_GAMES_CONFIG;
  var SMG = window.SMG;
  if (!cfg || !cfg.enabled || !SMG) return;

  function $(id) { return document.getElementById(id); }
  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function mmss(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  var LETTERS = ['A', 'B', 'C', 'D'];
  var LEVEL_NAME = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

  $('memberBox').hidden = false;

  /* ---------- Firebase login (loaded on demand) ---------- */

  var fbReady = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Could not load the login library. Check your internet connection and try again.')); };
      document.head.appendChild(s);
    });
  }

  function ensureFirebase() {
    if (fbReady) return fbReady;
    var base = 'https://www.gstatic.com/firebasejs/' + cfg.sdkVersion + '/';
    fbReady = loadScript(base + 'firebase-app-compat.js')
      .then(function () { return loadScript(base + 'firebase-auth-compat.js'); })
      .then(function () {
        if (!window.firebase.apps.length) window.firebase.initializeApp(cfg.firebase);
        return new Promise(function (resolve) {
          var done = false;
          window.firebase.auth().onAuthStateChanged(function (u) {
            if (!done) { done = true; resolve(u); }
          });
          window.setTimeout(function () {
            if (!done) { done = true; resolve(window.firebase.auth().currentUser); }
          }, 6000);
        });
      });
    fbReady.catch(function () { fbReady = null; });
    return fbReady;
  }

  function currentUser() {
    return (window.firebase && window.firebase.auth) ? window.firebase.auth().currentUser : null;
  }

  /* ---------- server calls ---------- */

  function api(name, data, withToken) {
    var user = withToken ? currentUser() : null;
    var tokenP = user ? user.getIdToken() : Promise.resolve(null);
    return tokenP.then(function (token) {
      var headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = 'Bearer ' + token;
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = window.setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
      return fetch(cfg.apiBase + '/' + name, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ data: data || {} }),
        signal: ctl ? ctl.signal : undefined
      }).then(function (res) {
        window.clearTimeout(timer);
        return res.json().catch(function () { return {}; }).then(function (j) {
          if (j && j.result !== undefined) return j.result;
          var err = new Error((j && j.error && j.error.message) || 'Something went wrong. Please try again.');
          err.status = j && j.error && j.error.status;
          throw err;
        });
      }).catch(function (e) {
        window.clearTimeout(timer);
        if (e && e.name === 'AbortError') throw new Error('The server took too long to answer. Please try again.');
        if (e instanceof TypeError) throw new Error('Could not reach the server. Check your internet connection and try again.');
        throw e;
      });
    });
  }

  /* ---------- Daily Challenge ---------- */

  var D = { questions: [], index: 0, answers: [], deadline: 0, timerId: null, submitting: false };

  function stopTimer() {
    if (D.timerId) { window.clearInterval(D.timerId); D.timerId = null; }
  }

  function setMsg(text) { $('dailyMsg').textContent = text; $('dailyMsg').hidden = !text; }

  function resetDaily() {
    stopTimer();
    D.submitting = false;
    clear($('dailyInfo'));
    clear($('dailyActions'));
    clear($('dailyResult'));
    $('dailyPlay').hidden = true;
    $('dailyResult').hidden = true;
  }

  function action(label, className, handler) {
    var b = el('button', className || 'btn', label);
    b.type = 'button';
    b.addEventListener('click', handler);
    $('dailyActions').appendChild(b);
    return b;
  }

  function openDaily() {
    SMG.show('daily');
    resetDaily();
    setMsg('Checking your account\u2026');
    $('dailyTitle').focus();
    ensureFirebase().then(function (first) {
      // use the latest login state, not only the state seen when the library first loaded
      var user = currentUser() || first;
      if (!user) { showSignedOut(); return null; }
      return api('gamesStatus', {}, true).then(renderStatus);
    }).catch(showError);
  }

  function showError(e) {
    resetDaily();
    setMsg(e && e.message ? e.message : 'Something went wrong. Please try again.');
    action('Try again', 'btn', openDaily);
    action('Back to the quiz', 'btn btn-ghost', SMG.home);
  }

  function showSignedOut() {
    resetDaily();
    setMsg('The Daily Challenge is for SAVEMORE members. Log in to the Member Portal, then come back to this page.');
    var a = el('a', 'btn', 'Go to the Member Portal');
    a.href = '../portal.html';
    $('dailyActions').appendChild(a);
    action('I have logged in, check again', 'btn btn-ghost', function () {
      if (currentUser()) { openDaily(); } else { window.location.reload(); }
    });
  }

  function statRow(profile) {
    var row = el('div', 'stat-row');
    [['Points', profile.totalPoints], ['Day streak', profile.currentStreak], ['Challenges', profile.challenges]].forEach(function (s) {
      var box = el('div', 'stat');
      box.appendChild(el('b', '', String(s[1])));
      box.appendChild(document.createTextNode(s[0]));
      row.appendChild(box);
    });
    return row;
  }

  function badgeLine(profile) {
    var got = (profile.badges || []).filter(function (b) { return b.earnedOn; }).map(function (b) { return b.name; });
    return got.length ? 'Badges earned: ' + got.join(', ') + '.' : 'No challenge badges yet. Finish today\u2019s challenge to earn your first.';
  }

  function renderStatus(st) {
    resetDaily();
    if (st.status === 'signed-out') { showSignedOut(); return; }
    if (st.status === 'not-member') {
      setMsg('We could not find a SAVEMORE member profile for this account. The Daily Challenge is for registered members.');
      action('Back to the quiz', 'btn btn-ghost', SMG.home);
      return;
    }

    var info = $('dailyInfo');
    var card = el('div', 'info-card');
    card.appendChild(el('p', '', 'Playing as: '));
    card.firstChild.appendChild(el('strong', '', st.nickname));
    card.appendChild(statRow(st.profile));
    card.appendChild(el('p', 'hint', badgeLine(st.profile)));
    info.appendChild(card);

    if (st.status === 'ready') {
      setMsg('10 questions, 10 minutes, and one attempt per day. Answers are revealed after you submit.');
      action('Start today\u2019s challenge', 'btn', startChallenge);
    } else if (st.status === 'in-progress') {
      setMsg('You have a challenge in progress. You can carry on where you left off, but the clock keeps running.');
      action('Resume the challenge', 'btn', startChallenge);
    } else if (st.status === 'done') {
      setMsg('You have finished today\u2019s challenge: ' + st.result.correct + '/' + st.result.total +
        ' correct, ' + st.result.points + ' points. Come back tomorrow for a new one!');
      action('See the leaderboards', 'btn', function () { openLb('daily'); });
    } else if (st.status === 'rejected') {
      setMsg('Today\u2019s answers arrived too quickly to be counted. Come back tomorrow for a new challenge!');
    } else {
      setMsg('Time ran out for today\u2019s attempt. Come back tomorrow for a new challenge!');
    }
    action('Back to the quiz', 'btn btn-ghost', SMG.home);
  }

  function startChallenge() {
    setMsg('Getting your questions\u2026');
    clear($('dailyActions'));
    api('startDailyChallenge', {}, true).then(beginPlay).catch(showError);
  }

  function beginPlay(payload) {
    resetDaily();
    setMsg('');
    D.questions = payload.questions;
    D.answers = payload.questions.map(function () { return -1; });
    D.index = 0;
    D.deadline = Date.now() + payload.remainingMs;
    $('dailyPlay').hidden = false;
    renderDQ();
    tickTimer();
    D.timerId = window.setInterval(tickTimer, 500);
  }

  function tickTimer() {
    var left = D.deadline - Date.now();
    $('dTimer').textContent = mmss(left);
    $('dTimerChip').className = 'timer-chip' + (left <= 60000 ? ' low' : '');
    if (left <= 0 && !D.submitting) submitAnswers();
  }

  function renderDQ() {
    var n = D.questions.length;
    var q = D.questions[D.index];
    $('dCount').textContent = (D.index + 1) + ' / ' + n;
    $('dBarFill').style.width = Math.round((D.index / n) * 100) + '%';
    $('dBar').setAttribute('aria-valuemax', String(n));
    $('dBar').setAttribute('aria-valuenow', String(D.index));
    $('dTag').textContent = q.cat.charAt(0).toUpperCase() + q.cat.slice(1) + ' | ' + (LEVEL_NAME[q.level] || '');
    $('dQ').textContent = q.q;

    var box = $('dOptions');
    clear(box);
    q.options.forEach(function (text, pos) {
      var b = el('button', 'option');
      b.type = 'button';
      b.appendChild(el('span', 'opt-letter', LETTERS[pos]));
      b.appendChild(el('span', 'opt-text', text));
      b.addEventListener('click', function () {
        D.answers[D.index] = pos;
        Array.prototype.forEach.call(box.children, function (c, i) { c.classList.toggle('picked', i === pos); });
        $('dNext').disabled = false;
      });
      box.appendChild(b);
    });
    $('dNext').disabled = true;
    $('dNext').textContent = (D.index === n - 1) ? 'Submit answers' : 'Next question';
    window.scrollTo(0, 0);
  }

  function submitAnswers() {
    if (D.submitting) return;
    D.submitting = true;
    stopTimer();
    $('dailyPlay').hidden = true;
    setMsg('Submitting your answers\u2026');
    api('submitDailyChallenge', { answers: D.answers }, true).then(showResult).catch(function (e) {
      var final = e && e.status && e.status !== 'UNAVAILABLE';
      resetDaily();
      setMsg(e && e.message ? e.message : 'Something went wrong.');
      if (!final) {
        D.submitting = false;
        action('Try submitting again', 'btn', function () { clear($('dailyActions')); submitAnswers(); });
      }
      action('Back to the quiz', 'btn btn-ghost', SMG.home);
    });
  }

  function showResult(r) {
    resetDaily();
    setMsg('');
    var box = $('dailyResult');
    box.hidden = false;

    var card = el('div', 'result-card');
    card.appendChild(el('p', 'res-line', 'Daily Challenge'));
    card.appendChild(el('p', 'big', r.correct + '/' + r.total));
    card.appendChild(el('p', 'res-tier', r.points + ' points in ' + mmss(r.elapsedMs)));
    var ranks = [];
    if (r.dailyRank) ranks.push('Today: #' + r.dailyRank);
    if (r.weeklyRank) ranks.push('This week: #' + r.weeklyRank + ' (' + r.weeklyPoints + ' points)');
    if (ranks.length) card.appendChild(el('p', 'res-line', ranks.join('  |  ')));
    card.appendChild(el('p', 'res-line', 'Day streak: ' + r.profile.currentStreak + '  |  Total points: ' + r.profile.totalPoints));
    box.appendChild(card);

    if (r.newBadges && r.newBadges.length) {
      var nb = el('div', 'new-badges');
      nb.appendChild(el('h2', '', r.newBadges.length === 1 ? 'New badge unlocked!' : 'New badges unlocked!'));
      r.newBadges.forEach(function (b) {
        var p = el('p');
        p.appendChild(el('strong', '', b.name + ': '));
        p.appendChild(document.createTextNode(b.desc));
        nb.appendChild(p);
      });
      box.appendChild(nb);
    }

    var wa = el('a', 'btn btn-wa', 'Share my score on WhatsApp');
    var url = window.location.href.split('#')[0].split('?')[0] + '?r=wa';
    wa.href = 'https://wa.me/?text=' + encodeURIComponent('I scored ' + r.correct + '/' + r.total + ' (' + r.points +
      ' points) in today\u2019s SAVEMORE Daily Challenge. Can you beat me? ' + url);
    wa.target = '_blank';
    wa.rel = 'noopener';
    box.appendChild(wa);

    var lb = el('button', 'btn', 'See the leaderboards');
    lb.type = 'button';
    lb.addEventListener('click', function () { openLb('daily'); });
    box.appendChild(lb);

    var back = el('button', 'btn btn-ghost', 'Back to the quiz');
    back.type = 'button';
    back.addEventListener('click', SMG.home);
    box.appendChild(back);

    box.appendChild(el('h2', '', 'Review your answers'));
    r.review.forEach(function (it) {
      var row = el('div', 'review-item ' + (it.right ? 'ok' : 'no'));
      row.appendChild(el('p', 'review-q', it.q));
      row.appendChild(el('p', 'review-a', 'Correct answer: ' + LETTERS[it.correctPos] + '. ' + it.options[it.correctPos]));
      if (!it.right) {
        row.appendChild(el('p', 'review-y', it.yourPos >= 0
          ? 'Your answer: ' + LETTERS[it.yourPos] + '. ' + it.options[it.yourPos]
          : 'You did not answer this one.'));
      }
      row.appendChild(el('p', 'review-e', it.explain));
      box.appendChild(row);
    });
    $('dailyTitle').focus();
    window.scrollTo(0, 0);
  }

  /* ---------- Leaderboards ---------- */

  var lbPeriod = 'daily';

  function setPeriod(p) {
    lbPeriod = p;
    $('lbDaily').classList.toggle('on', p === 'daily');
    $('lbWeekly').classList.toggle('on', p === 'weekly');
    $('lbDaily').setAttribute('aria-pressed', String(p === 'daily'));
    $('lbWeekly').setAttribute('aria-pressed', String(p === 'weekly'));
  }

  function openLb(period) {
    SMG.show('lb');
    setPeriod(period || 'daily');
    loadLb();
  }

  function loadLb() {
    var list = $('lbList');
    clear(list);
    $('lbMsg').textContent = 'Loading\u2026';
    api('getLeaderboards', { period: lbPeriod }, true).then(function (r) {
      if (!r.entries.length) {
        $('lbMsg').textContent = lbPeriod === 'daily'
          ? 'No scores yet today. Be the first on the board!'
          : 'No scores yet this week. Be the first on the board!';
        return;
      }
      var line = r.total + (r.total === 1 ? ' player' : ' players') + (lbPeriod === 'daily' ? ' today.' : ' this week.');
      if (r.youRank) line += ' Your rank: #' + r.youRank + '.';
      $('lbMsg').textContent = line;
      r.entries.forEach(function (e) {
        var li = el('li', 'lb-row' + (e.you ? ' you' : ''));
        li.appendChild(el('span', 'lb-rank', String(e.rank)));
        var name = el('span', 'lb-name', e.nickname + (e.you ? ' (you)' : ''));
        var sub = lbPeriod === 'daily'
          ? e.correct + ' correct in ' + mmss(e.seconds * 1000)
          : e.days + (e.days === 1 ? ' day played' : ' days played');
        name.appendChild(el('small', '', sub));
        li.appendChild(name);
        li.appendChild(el('span', 'lb-pts', e.points + ' pts'));
        list.appendChild(li);
      });
    }).catch(function (e) {
      $('lbMsg').textContent = e && e.message ? e.message : 'Could not load the leaderboard.';
    });
  }

  /* ---------- wiring ---------- */

  $('dailyBtn').addEventListener('click', openDaily);
  $('lbBtn').addEventListener('click', function () { openLb('daily'); });
  $('lbDaily').addEventListener('click', function () { setPeriod('daily'); loadLb(); });
  $('lbWeekly').addEventListener('click', function () { setPeriod('weekly'); loadLb(); });
  $('lbBack').addEventListener('click', SMG.home);
  $('dailyBack').addEventListener('click', function () {
    if (!$('dailyPlay').hidden && !window.confirm('Leave the challenge? The clock keeps running, but you can resume until time is up.')) return;
    resetDaily();
    SMG.home();
  });
  $('dNext').addEventListener('click', function () {
    if (D.index < D.questions.length - 1) { D.index++; renderDQ(); } else { submitAnswers(); }
  });
})();
