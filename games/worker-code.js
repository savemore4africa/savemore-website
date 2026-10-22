const PROJECT_ID = 'savemore-portal';
const ALLOWED_ORIGIN = 'https://savemore4africa.github.io';
const MEMBER_CACHE_MS = 24 * 60 * 60 * 1000;
const POINTS = { easy: 10, medium: 15, hard: 20 };
const CHALLENGE_SIZE = 10;
const MAX_MS = 10 * 60 * 1000;      // a challenge must be finished within 10 minutes
const GRACE_MS = 20 * 1000;         // allowance for network delay when submitting
const MIN_MS_PER_QUESTION = 1500;   // faster than this on average cannot be a real player
const LAGOS_OFFSET_MS = 60 * 60 * 1000; // Africa/Lagos is UTC+1 all year (no daylight saving)
const BADGES = [
{ id: 'first-challenge', name: 'First Challenge', desc: 'Finish your first Daily Challenge.' },
{ id: 'perfect-day', name: 'Perfect Day', desc: 'Answer all 10 questions correctly in a Daily Challenge.' },
{ id: 'streak-3', name: '3-Day Streak', desc: 'Finish the Daily Challenge 3 days in a row.' },
{ id: 'streak-7', name: '7-Day Streak', desc: 'Finish the Daily Challenge 7 days in a row.' },
{ id: 'week-warrior', name: 'Week Warrior', desc: 'Finish the Daily Challenge on 5 days in the same week.' }
];
function dateKey(ms) {
return new Date(ms + LAGOS_OFFSET_MS).toISOString().slice(0, 10);
}
function addDays(key, n) {
const d = new Date(key + 'T00:00:00Z');
d.setUTCDate(d.getUTCDate() + n);
return d.toISOString().slice(0, 10);
}
function weekKey(key) {
const d = new Date(key + 'T00:00:00Z');
const back = (d.getUTCDay() + 6) % 7;
d.setUTCDate(d.getUTCDate() - back);
return d.toISOString().slice(0, 10);
}
function shuffle(list, rnd) {
const r = rnd || Math.random;
const a = list.slice();
for (let i = a.length - 1; i > 0; i--) {
const j = Math.floor(r() * (i + 1));
const t = a[i]; a[i] = a[j]; a[j] = t;
}
return a;
}
function chooseQuestions(all, used, rnd) {
const want = { easy: 4, medium: 4, hard: 2 };
const fresh = all.filter(q => !used.has(q.id));
const stale = all.filter(q => used.has(q.id));
const out = [];
const taken = new Set();
['hard', 'medium', 'easy'].forEach(level => {
const cand = shuffle(fresh.filter(q => q.level === level), rnd)
.concat(shuffle(stale.filter(q => q.level === level), rnd));
for (const q of cand) {
if (out.filter(x => x.level === level).length >= want[level]) break;
out.push(q); taken.add(q.id);
}
});
if (out.length < CHALLENGE_SIZE) {
const rest = shuffle(fresh.filter(q => !taken.has(q.id)), rnd)
.concat(shuffle(stale.filter(q => !taken.has(q.id)), rnd));
for (const q of rest) {
if (out.length >= CHALLENGE_SIZE) break;
out.push(q);
}
}
return shuffle(out, rnd).slice(0, CHALLENGE_SIZE).map(q => q.id);
}
function nicknameOf(fullName) {
const first = String(fullName || '').trim().split(/\s+/)[0] || '';
const clean = first.replace(/[^\p{L}'\-]/gu, '').slice(0, 20);
return clean || 'Member';
}
function gradeAttempt(att, questions, answers) {
let correct = 0;
let points = 0;
const review = att.qids.map((qid, i) => {
const q = questions[qid];
const order = att.orders[qid];
const pos = answers[i];
const original = pos >= 0 ? order[pos] : -1;
const right = original === q.answer;
if (right) { correct++; points += POINTS[q.level] || 10; }
return {
id: qid,
q: q.q,
options: order.map(k => q.options[k]),
yourPos: pos,
correctPos: order.indexOf(q.answer),
right: right,
explain: q.explain
};
});
return { correct, points, review };
}
function validateAnswers(answers, count) {
if (!Array.isArray(answers) || answers.length !== count) return false;
return answers.every(a => Number.isInteger(a) && a >= -1 && a <= 3);
}
function sortKey(points, elapsedMs) {
const t = Math.min(Math.max(Math.round(elapsedMs), 0), 9999999);
return points * 10000000 + (9999999 - t);
}
function updateProfile(profile, run) {
const p = Object.assign({
totalPoints: 0, challenges: 0, perfectDays: 0,
currentStreak: 0, bestStreak: 0, lastDate: null, badges: {}
}, profile || {});
p.badges = Object.assign({}, p.badges);
p.totalPoints += run.points;
p.challenges += 1;
if (run.correct === run.total) p.perfectDays += 1;
if (p.lastDate === addDays(run.dateKey, -1)) p.currentStreak += 1;
else if (p.lastDate !== run.dateKey) p.currentStreak = 1;
p.bestStreak = Math.max(p.bestStreak, p.currentStreak);
p.lastDate = run.dateKey;
p.nickname = run.nickname;
const earned = [];
function give(id) { if (!p.badges[id]) { p.badges[id] = run.dateKey; earned.push(id); } }
give('first-challenge');
if (run.correct === run.total) give('perfect-day');
if (p.currentStreak >= 3) give('streak-3');
if (p.currentStreak >= 7) give('streak-7');
if (run.weeklyDays >= 5) give('week-warrior');
return { profile: p, earned };
}
function badgeList(profile) {
const have = (profile && profile.badges) || {};
return BADGES.map(b => ({ id: b.id, name: b.name, desc: b.desc, earnedOn: have[b.id] || null }));
}
function validateQuestion(q) {
if (!q || typeof q !== 'object') return 'not an object';
if (typeof q.id !== 'string' || !/^[a-z0-9-]{3,40}$/.test(q.id)) return 'bad id';
if (typeof q.cat !== 'string' || q.cat.length < 2 || q.cat.length > 30) return 'bad category';
if (!['easy', 'medium', 'hard'].includes(q.level)) return 'bad level';
if (typeof q.q !== 'string' || q.q.length < 5 || q.q.length > 300) return 'bad question text';
if (!Array.isArray(q.options) || q.options.length !== 4) return 'need 4 options';
if (!q.options.every(o => typeof o === 'string' && o.length >= 1 && o.length <= 150)) return 'bad option text';
if (new Set(q.options).size !== 4) return 'options must differ';
if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) return 'bad answer index';
if (typeof q.explain !== 'string' || q.explain.length < 1 || q.explain.length > 400) return 'bad explanation';
return null;
}
class HttpError extends Error {
constructor(http, status, message) { super(message); this.http = http; this.status = status; }
}
const fail = (http, status, message) => { throw new HttpError(http, status, message); };
function corsHeaders(request) {
const h = {
'Access-Control-Allow-Methods': 'POST, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type, Authorization',
'Access-Control-Max-Age': '86400',
'Vary': 'Origin'
};
if (request.headers.get('Origin') === ALLOWED_ORIGIN) h['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
return h;
}
function reply(request, body, http) {
return new Response(JSON.stringify(body), {
status: http || 200,
headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, corsHeaders(request))
});
}
let jwksCache = { at: 0, keys: null };
const keyCache = {};
function b64urlToBytes(s) {
s = s.replace(/-/g, '+').replace(/_/g, '/');
while (s.length % 4) s += '=';
const bin = atob(s);
const out = new Uint8Array(bin.length);
for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
return out;
}
async function getJwks() {
if (jwksCache.keys && Date.now() - jwksCache.at < 60 * 60 * 1000) return jwksCache.keys;
const res = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
if (!res.ok) fail(503, 'UNAVAILABLE', 'Could not check your login right now. Please try again.');
const j = await res.json();
jwksCache = { at: Date.now(), keys: j.keys || [] };
return jwksCache.keys;
}
async function verifyIdToken(token) {
try {
const parts = String(token || '').split('.');
if (parts.length !== 3) return null;
const dec = new TextDecoder();
const header = JSON.parse(dec.decode(b64urlToBytes(parts[0])));
const payload = JSON.parse(dec.decode(b64urlToBytes(parts[1])));
if (header.alg !== 'RS256' || !header.kid) return null;
const now = Math.floor(Date.now() / 1000);
if (payload.aud !== PROJECT_ID) return null;
if (payload.iss !== 'https://securetoken.google.com/' + PROJECT_ID) return null;
if (!payload.sub || typeof payload.sub !== 'string' || payload.sub.length > 128) return null;
if (typeof payload.exp !== 'number' || payload.exp <= now) return null;
if (typeof payload.iat === 'number' && payload.iat > now + 300) return null;
let key = keyCache[header.kid];
if (!key) {
let keys = await getJwks();
let jwk = keys.find(k => k.kid === header.kid);
if (!jwk) {                                   // keys may have rotated: refresh once
jwksCache.at = 0;
keys = await getJwks();
jwk = keys.find(k => k.kid === header.kid);
}
if (!jwk) return null;
key = keyCache[header.kid] = await crypto.subtle.importKey(
'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
}
const ok = await crypto.subtle.verify(
'RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
return ok ? { uid: payload.sub, token: token } : null;
} catch (e) {
if (e instanceof HttpError) throw e;
return null;
}
}
async function authOptional(request) {
const h = request.headers.get('Authorization') || '';
if (!h.startsWith('Bearer ')) return null;
return verifyIdToken(h.slice(7));
}
async function authRequired(request) {
const h = request.headers.get('Authorization') || '';
if (!h.startsWith('Bearer ')) fail(401, 'UNAUTHENTICATED', 'Please log in to the Member Portal first, then come back.');
const who = await verifyIdToken(h.slice(7));
if (!who) fail(401, 'UNAUTHENTICATED', 'Your login could not be confirmed. Please log in to the Member Portal again.');
return who;
}
async function firestoreGet(path, token, field) {
const url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/' +
path + '?mask.fieldPaths=' + encodeURIComponent(field);
const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
if (res.status === 404 || res.status === 403) return null;
if (!res.ok) fail(503, 'UNAVAILABLE', 'Could not check your membership right now. Please try again.');
return res.json();
}
async function getMember(env, who) {
const now = Date.now();
const cached = await env.DB.prepare('SELECT nickname, checked_at FROM members_cache WHERE uid = ?').bind(who.uid).first();
if (cached && now - cached.checked_at < MEMBER_CACHE_MS) return { nickname: cached.nickname };
const doc = await firestoreGet('members/' + encodeURIComponent(who.uid), who.token, 'name');
if (!doc) {
fail(403, 'PERMISSION_DENIED', 'The Daily Challenge is for SAVEMORE members. We could not find a member profile for this account.');
}
const name = doc.fields && doc.fields.name && doc.fields.name.stringValue;
const nickname = nicknameOf(name);
await env.DB.prepare('INSERT OR REPLACE INTO members_cache (uid, nickname, checked_at) VALUES (?, ?, ?)')
.bind(who.uid, nickname, now).run();
return { nickname };
}
async function isAdmin(who) {
const doc = await firestoreGet('admins/' + encodeURIComponent(who.uid), who.token, 'x');
return !!doc;
}
async function loadQuestions(env, qids) {
const marks = qids.map(() => '?').join(',');
const rows = await env.DB.prepare('SELECT id, cat, level, q, options, answer, explain FROM questions WHERE id IN (' + marks + ')')
.bind(...qids).all();
const map = {};
rows.results.forEach(r => { map[r.id] = Object.assign({}, r, { options: JSON.parse(r.options) }); });
return map;
}
function parseAttempt(r) {
if (!r) return null;
return {
dateKey: r.date_key, uid: r.uid, startedAt: r.started_at, qids: JSON.parse(r.qids),
orders: JSON.parse(r.orders), status: r.status, nickname: r.nickname,
correct: r.correct, points: r.points, elapsedMs: r.elapsed_ms
};
}
async function getAttempt(env, key, uid) {
return parseAttempt(await env.DB.prepare('SELECT * FROM attempts WHERE date_key = ? AND uid = ?').bind(key, uid).first());
}
function payloadFor(att, questions, now) {
return {
total: att.qids.length,
remainingMs: Math.max(0, MAX_MS - (now - att.startedAt)),
questions: att.qids.map(id => {
const q = questions[id];
return { id, q: q.q, cat: q.cat, level: q.level, options: att.orders[id].map(k => q.options[k]) };
})
};
}
async function findOpenAttempt(env, uid, now) {
const today = dateKey(now);
for (const key of [today, addDays(today, -1)]) {
const att = await getAttempt(env, key, uid);
if (!att || att.status !== 'started') continue;
if (now - att.startedAt > MAX_MS + GRACE_MS) {
await env.DB.prepare("UPDATE attempts SET status = 'expired' WHERE date_key = ? AND uid = ? AND status = 'started'").bind(key, uid).run();
continue;
}
return att;
}
return null;
}
async function ensureDaily(env, key) {
let row = await env.DB.prepare('SELECT qids FROM daily WHERE date_key = ?').bind(key).first();
if (row) return JSON.parse(row.qids);
const recent = await env.DB.prepare('SELECT qids FROM daily WHERE date_key >= ? AND date_key < ?').bind(addDays(key, -14), key).all();
const used = new Set();
recent.results.forEach(r => JSON.parse(r.qids).forEach(id => used.add(id)));
const active = await env.DB.prepare('SELECT id, level FROM questions WHERE active = 1').all();
if (active.results.length < CHALLENGE_SIZE) {
fail(400, 'FAILED_PRECONDITION', 'Today\'s challenge is not ready yet. Please try again later.');
}
const chosen = chooseQuestions(active.results, used);
await env.DB.prepare('INSERT OR IGNORE INTO daily (date_key, qids) VALUES (?, ?)').bind(key, JSON.stringify(chosen)).run();
row = await env.DB.prepare('SELECT qids FROM daily WHERE date_key = ?').bind(key).first();
return JSON.parse(row.qids);
}
async function profileOf(env, uid) {
const r = await env.DB.prepare('SELECT data FROM profiles WHERE uid = ?').bind(uid).first();
return r ? JSON.parse(r.data) : null;
}
function profileSummary(p) {
p = p || {};
return {
totalPoints: p.totalPoints || 0, challenges: p.challenges || 0, perfectDays: p.perfectDays || 0,
currentStreak: p.currentStreak || 0, bestStreak: p.bestStreak || 0, badges: badgeList(p)
};
}
async function rankOf(env, table, keyCol, key, sortKeyValue) {
const r = await env.DB.prepare('SELECT COUNT(*) AS c FROM ' + table + ' WHERE ' + keyCol + ' = ? AND sort_key > ?').bind(key, sortKeyValue).first();
return r.c + 1;
}
const handlers = {
async gamesPing() {
return { ok: true, service: 'SAVEMORE GAMES', host: 'Cloudflare Workers', time: new Date().toISOString() };
},
async gamesStatus(request, env) {
const who = await authOptional(request);
if (!who) return { status: 'signed-out' };
let member;
try { member = await getMember(env, who); }
catch (e) { if (e instanceof HttpError && e.status === 'PERMISSION_DENIED') return { status: 'not-member' }; throw e; }
const now = Date.now();
const out = { nickname: member.nickname, profile: profileSummary(await profileOf(env, who.uid)), date: dateKey(now) };
const open = await findOpenAttempt(env, who.uid, now);
if (open) return Object.assign(out, { status: 'in-progress', remainingMs: Math.max(0, MAX_MS - (now - open.startedAt)) });
const today = await getAttempt(env, dateKey(now), who.uid);
if (!today) return Object.assign(out, { status: 'ready' });
if (today.status === 'finished') {
return Object.assign(out, { status: 'done', result: { correct: today.correct, total: today.qids.length, points: today.points, elapsedMs: today.elapsedMs } });
}
return Object.assign(out, { status: today.status });
},
async startDailyChallenge(request, env) {
const who = await authRequired(request);
const member = await getMember(env, who);
const now = Date.now();
const open = await findOpenAttempt(env, who.uid, now);
if (open) return payloadFor(open, await loadQuestions(env, open.qids), now);
const key = dateKey(now);
const used = await getAttempt(env, key, who.uid);
if (used) {
fail(409, 'ALREADY_EXISTS', used.status === 'finished'
? 'You have already completed today\'s challenge. Come back tomorrow!'
: 'Today\'s attempt has already been used. Come back tomorrow!');
}
const qids = await ensureDaily(env, key);
const questions = await loadQuestions(env, qids);
if (qids.some(id => !questions[id])) fail(400, 'FAILED_PRECONDITION', 'Today\'s challenge is not ready yet. Please try again later.');
const orders = {};
qids.forEach(id => { orders[id] = shuffle([0, 1, 2, 3]); });
try {
await env.DB.prepare("INSERT INTO attempts (date_key, uid, started_at, qids, orders, status, nickname) VALUES (?, ?, ?, ?, ?, 'started', ?)")
.bind(key, who.uid, now, JSON.stringify(qids), JSON.stringify(orders), member.nickname).run();
} catch (e) {  }
const att = await getAttempt(env, key, who.uid);
if (!att) fail(500, 'INTERNAL', 'Could not start the challenge. Please try again.');
return payloadFor(att, questions, now);
},
async submitDailyChallenge(request, env, body) {
const who = await authRequired(request);
await getMember(env, who);
const now = Date.now();
const answers = body && body.answers;
const today = dateKey(now);
let att = null;
for (const key of [today, addDays(today, -1)]) {
const a = await getAttempt(env, key, who.uid);
if (a && a.status === 'started') { att = a; break; }
}
if (!att) fail(400, 'FAILED_PRECONDITION', 'There is no challenge in progress. Open the Daily Challenge to start one.');
const setStatus = s => env.DB.prepare("UPDATE attempts SET status = ? WHERE date_key = ? AND uid = ? AND status = 'started'").bind(s, att.dateKey, who.uid).run();
const elapsed = now - att.startedAt;
if (elapsed > MAX_MS + GRACE_MS) {
await setStatus('expired');
fail(400, 'DEADLINE_EXCEEDED', 'Time ran out before the answers arrived, so this attempt could not be counted. Try again tomorrow!');
}
if (!validateAnswers(answers, att.qids.length)) fail(400, 'INVALID_ARGUMENT', 'The answers were not in the expected format.');
if (elapsed < att.qids.length * MIN_MS_PER_QUESTION) {
await setStatus('rejected');
fail(400, 'FAILED_PRECONDITION', 'Those answers arrived too quickly to be counted. Take your time with tomorrow\'s challenge!');
}
const questions = await loadQuestions(env, att.qids);
const graded = gradeAttempt(att, questions, answers);
const elapsedMs = Math.min(elapsed, MAX_MS);
const total = att.qids.length;
const key = att.dateKey;
const wk = weekKey(key);
const prof = await profileOf(env, who.uid);
const wRow = await env.DB.prepare('SELECT points, days, elapsed_ms FROM lb_weekly WHERE week_key = ? AND uid = ?').bind(wk, who.uid).first();
const w = wRow ? { points: wRow.points, days: wRow.days, elapsedMs: wRow.elapsed_ms } : { points: 0, days: 0, elapsedMs: 0 };
const weeklyDays = w.days + 1;
const upd = updateProfile(prof, { dateKey: key, points: graded.points, correct: graded.correct, total, nickname: att.nickname, weeklyDays });
const wPoints = w.points + graded.points;
const wElapsed = w.elapsedMs + elapsedMs;
const claim = await env.DB.prepare(
"UPDATE attempts SET status = 'finished', correct = ?, points = ?, elapsed_ms = ? WHERE date_key = ? AND uid = ? AND status = 'started'")
.bind(graded.correct, graded.points, elapsedMs, key, who.uid).run();
if (!claim.meta || claim.meta.changes !== 1) fail(400, 'FAILED_PRECONDITION', 'This challenge has already been submitted.');
await env.DB.batch([
env.DB.prepare('INSERT OR REPLACE INTO profiles (uid, data) VALUES (?, ?)').bind(who.uid, JSON.stringify(upd.profile)),
env.DB.prepare('INSERT OR REPLACE INTO lb_daily (date_key, uid, nickname, points, correct, elapsed_ms, sort_key) VALUES (?, ?, ?, ?, ?, ?, ?)')
.bind(key, who.uid, att.nickname, graded.points, graded.correct, elapsedMs, sortKey(graded.points, elapsedMs)),
env.DB.prepare('INSERT OR REPLACE INTO lb_weekly (week_key, uid, nickname, points, days, elapsed_ms, sort_key) VALUES (?, ?, ?, ?, ?, ?, ?)')
.bind(wk, who.uid, att.nickname, wPoints, weeklyDays, wElapsed, sortKey(wPoints, wElapsed))
]);
return {
correct: graded.correct, total, points: graded.points, elapsedMs, review: graded.review,
dailyRank: await rankOf(env, 'lb_daily', 'date_key', key, sortKey(graded.points, elapsedMs)),
weeklyRank: await rankOf(env, 'lb_weekly', 'week_key', wk, sortKey(wPoints, wElapsed)),
weeklyPoints: wPoints,
newBadges: upd.earned.map(id => BADGES.find(b => b.id === id)).filter(Boolean),
profile: { totalPoints: upd.profile.totalPoints, challenges: upd.profile.challenges, currentStreak: upd.profile.currentStreak, bestStreak: upd.profile.bestStreak }
};
},
async getLeaderboards(request, env, body) {
const period = body && body.period;
if (period !== 'daily' && period !== 'weekly') fail(400, 'INVALID_ARGUMENT', 'Choose daily or weekly.');
const who = await authOptional(request);
const day = dateKey(Date.now());
const key = period === 'daily' ? day : weekKey(day);
const table = period === 'daily' ? 'lb_daily' : 'lb_weekly';
const keyCol = period === 'daily' ? 'date_key' : 'week_key';
const rows = (await env.DB.prepare(
'SELECT uid, nickname, points, ' + (period === 'daily' ? 'correct' : 'days') + ' AS extra, elapsed_ms FROM ' + table +
' WHERE ' + keyCol + ' = ? ORDER BY sort_key DESC LIMIT 20').bind(key).all()).results;
const total = (await env.DB.prepare('SELECT COUNT(*) AS c FROM ' + table + ' WHERE ' + keyCol + ' = ?').bind(key).first()).c;
let youRank = null;
if (who) {
const idx = rows.findIndex(r => r.uid === who.uid);
if (idx >= 0) youRank = idx + 1;
else {
const mine = await env.DB.prepare('SELECT sort_key FROM ' + table + ' WHERE ' + keyCol + ' = ? AND uid = ?').bind(key, who.uid).first();
if (mine) youRank = await rankOf(env, table, keyCol, key, mine.sort_key);
}
}
return {
period, key, total, youRank,
entries: rows.map((r, i) => ({
rank: i + 1, nickname: r.nickname, points: r.points,
correct: period === 'daily' ? r.extra : null, days: period === 'weekly' ? r.extra : null,
seconds: Math.round((r.elapsed_ms || 0) / 1000), you: !!who && r.uid === who.uid
}))
};
},
async seedQuestions(request, env, body) {
const who = await authRequired(request);
if (!(await isAdmin(who))) fail(403, 'PERMISSION_DENIED', 'Administrators only.');
const list = body && body.questions;
if (!Array.isArray(list) || list.length === 0 || list.length > 500) fail(400, 'INVALID_ARGUMENT', 'Send between 1 and 500 questions.');
const seen = new Set();
for (let i = 0; i < list.length; i++) {
const problem = validateQuestion(list[i]);
if (problem) fail(400, 'INVALID_ARGUMENT', 'Question ' + (i + 1) + ': ' + problem);
if (seen.has(list[i].id)) fail(400, 'INVALID_ARGUMENT', 'Duplicate id: ' + list[i].id);
seen.add(list[i].id);
}
await env.DB.batch(list.map(q =>
env.DB.prepare('INSERT OR REPLACE INTO questions (id, cat, level, q, options, answer, explain, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
.bind(q.id, q.cat, q.level, q.q, JSON.stringify(q.options), q.answer, q.explain, q.active === false ? 0 : 1)));
return { imported: list.length };
}
};
export default {
async fetch(request, env) {
if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) });
const name = new URL(request.url).pathname.split('/').filter(Boolean).pop() || '';
if (request.method === 'GET' && name === '') return new Response('SAVEMORE GAMES server is running.', { status: 200 });
if (request.method !== 'POST') return reply(request, { error: { status: 'INVALID_ARGUMENT', message: 'Use POST.' } }, 405);
const handler = Object.prototype.hasOwnProperty.call(handlers, name) ? handlers[name] : null;
if (!handler) return reply(request, { error: { status: 'NOT_FOUND', message: 'Unknown request.' } }, 404);
try {
let payload = {};
try { payload = (await request.json()).data || {}; } catch (e) { payload = {}; }
return reply(request, { result: await handler(request, env, payload) });
} catch (e) {
if (e instanceof HttpError) return reply(request, { error: { status: e.status, message: e.message } }, e.http);
return reply(request, { error: { status: 'INTERNAL', message: 'Something went wrong on our side. Please try again.' } }, 500);
}
}
};
