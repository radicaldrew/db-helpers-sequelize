const fs = require('fs');
const test = require('tape').test ;
const exec = require('child_process').exec ;
const config = require('config');
const dbOpts = config.get('db');

test('creating jambones_test database', (t) => {
  if(dbOpts.dialect === 'postgres'){
    exec(`pgsql -h 127.0.0.1 -u root --protocol=tcp < ${__dirname}/db/postgres/create_test_db.sql`, (err, stdout, stderr) => {
      if (err) return t.end(err);
      t.pass('database successfully created');
      t.end();
    });
  }else{
    exec(`mysql -h 127.0.0.1 -u root --protocol=tcp < ${__dirname}/db/mysql/create_test_db.sql`, (err, stdout, stderr) => {
      if (err) return t.end(err);
      t.pass('database successfully created');
      t.end();
    });
  }
});

test('creating schema', (t) => {
  if(dbOpts.dialect === 'postgres'){
    exec(`pgsql -h 127.0.0.1 -u root --protocol=tcp -D jambones_test < ${__dirname}/db/postgres/jambones-sql.sql`, (err, stdout, stderr) => {
      if (err) return t.end(err);
      t.pass('schema successfully created');
      t.end();
    });
  }else{
   exec(`mysql -h 127.0.0.1 -u root --protocol=tcp -D jambones_test < ${__dirname}/db/mysql/jambones-sql.sql`, (err, stdout, stderr) => {
      if (err) return t.end(err);
      t.pass('schema successfully created');
      t.end();
    });
  }
});

test('populating test database', (t) => {
  if(dbOpts.dialect === 'postgres'){
    exec(`pgsql -h 127.0.0.1 -u root --protocol=tcp -D jambones_test < ${__dirname}/db/postgres/populate-test-data.sql`, (err, stdout, stderr) => {
      if (err) return t.end(err);
      t.pass('create test data');
      t.end();
    });
  }else{
    exec(`mysql -h 127.0.0.1 -u root --protocol=tcp -D jambones_test < ${__dirname}/db/mysql/populate-test-data.sql`, (err, stdout, stderr) => {
      if (err) return t.end(err);
      t.pass('create test data');
      t.end();
    });    
  }
});
