const test = require('node:test'); const assert = require('node:assert'); const { execSync } = require('child_process');
const { start, sleep } = require('../../tools/th'); const tmpProject = require('./cycle');
const { dir, ENV } = tmpProject(); const g = c => execSync(c, { cwd: dir, env: ENV, shell: '/bin/bash', encoding: 'utf8', stdio: 'pipe' });
test.before(() => { g('git init -q && git add . && git commit -qm "Add /health endpoint for uptime checks" && git remote add origin ../remote.git'); });
test('Push to main with auto-deploy ON (local equivalent) -> push accepted, remote main updated to trigger the redeploy', () => {
  g('git push -q origin main'); g('sed -i "s/v1/v2/" server.js && git commit -qam "Update welcome message to v2" && git push -q origin main');
  assert.equal(g('git rev-parse main').trim(), execSync('git rev-parse main', { cwd: dir + '/../remote.git' }).toString().trim()); });
test("GET /health after successful deploy -> 200, { status: 'ok', uptime: <number> }, uptime increasing", async () => {
  const s = await start(dir, 'npm start', {}, 3000); const a = await fetch('http://localhost:3000/health'); const ba = await a.json(); await sleep(1200); const bb = await (await fetch('http://localhost:3000/health')).json();
  assert.equal(a.status, 200); assert.equal(ba.status, 'ok'); assert.equal(typeof ba.uptime, 'number'); assert.ok(bb.uptime > ba.uptime); assert.match(await (await fetch('http://localhost:3000/')).text(), /v2/); await s.stop(); });
test('Trigger rollback to previous build -> app reverts to prior version (v1); /health still responds 200', async () => {
  g('git checkout -q HEAD~1'); const s = await start(dir, 'npm start', {}, 3000);
  assert.match(await (await fetch('http://localhost:3000/')).text(), /v1/); const h = await fetch('http://localhost:3000/health'); assert.equal(h.status, 200); assert.equal((await h.json()).status, 'ok'); await s.stop(); });
