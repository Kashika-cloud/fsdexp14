// helper shared by test + screenshots: copy project to a temp dir with its own git repo + bare remote
const fs = require('fs'), os = require('os'), path = require('path'); const { execSync } = require('child_process');
const ENV = { ...process.env, GIT_CONFIG_GLOBAL: '/tmp/gitcfg' };
module.exports = function tmpProject() {
  const b = fs.mkdtempSync(path.join(os.tmpdir(), 'd14c-')); execSync(`git init -q --bare remote.git && mkdir fullstack-app && cp ${__dirname}/{server.js,package.json,.gitignore} fullstack-app/ && ln -s /home/claude/work/tools/node_modules fullstack-app/node_modules`, { cwd: b, shell: '/bin/bash' });
  return { dir: path.join(b, 'fullstack-app'), ENV };
};
