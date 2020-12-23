const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');
const accountSql = `SELECT * from accounts app, webhooks rh
WHERE app.registration_hook_sid = rh.webhook_sid
AND app.sip_realm = ?`;
const spSql = `SELECT * from service_providers sp, webhooks rh
WHERE sp.registration_hook_sid = rh.webhook_sid
AND sp.root_domain = ?`;

/**
 * Search for authentication webhook first at the account level, by sip domain / realm,
 * if not found then search at the service provider level by root domain
 * @param {*} sequelize - database pool
 * @param {*} logger - pino logger
 * @param {*} sipRealm - sip realm/domain to search for
 */
async function lookupAuthHook(sequelize, logger, sipRealm) {
  const r = await sequelize.query(accountSql, {
    //logging: logger,
    //plain: false,
    //raw: true,
    replacements: [sipRealm],
    type: QueryTypes.SELECT
  });

  debug(`results from querying account for sip realm ${sipRealm}: ${JSON.stringify(r)}`);
  if (r.length > 0) {
    return r[0];
  }
  const arr = /([^\.]+\.[^\.]+)$/.exec(sipRealm);
  if (!arr) return null;

  const rootDomain = arr[1];
  debug(`did not find hook at account level, checking service provider for ${rootDomain}`);
  const r2 = await sequelize.query(spSql, {
    // logging: logger,
    // plain: false,
    // raw: true,
    replacements: [rootDomain],
    type: QueryTypes.SELECT
  });
  debug(`results from querying service_providers for root domain ${rootDomain}: ${JSON.stringify(r2)}`);
  if (r2.length > 0) {
    return r2[0];
  }
  return null;
}

module.exports = lookupAuthHook;
