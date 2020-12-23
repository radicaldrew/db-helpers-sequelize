const test = require('tape').test ;
const exec = require('child_process').exec ;
const dbOpts = config.get('db');
const pwd = process.env.TRAVIS ? '' : '-p$MYSQL_ROOT_PASSWORD';

test('dropping jambones_test database', (t) => {
  exec(`mysql -h localhost -u root ${pwd} < ${__dirname}/db/${dbOpts.dialect}/remove_test_db.sql`, (err, stdout, stderr) => {
    if (err) return t.end(err);
    t.pass('database successfully dropped');
    t.end();
    process.exit(0);
  });
});
