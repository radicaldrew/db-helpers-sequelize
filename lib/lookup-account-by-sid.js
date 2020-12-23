const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');

const sql =
`SELECT *
FROM accounts acc
LEFT JOIN webhooks AS rh ON acc.registration_hook_sid = rh.webhook_sid
WHERE acc.account_sid = ?`;

/**
 * Lookup the account by account_sid
 * @param {*} sequelize
 * @param {*} logger
 */
async function lookupAccountBySid(sequelize, logger, account_sid) {
  const r = await sequelize.query(sql, {
    replacements: [account_sid],
    type: QueryTypes.SELECT
  });
  debug(`results: ${JSON.stringify(r)}`);
  if (r) {
    const obj = r[0];
    //Object.assign(obj, {registration_hook: r.rh});//r[0].rh
    //if (!obj.registration_hook.url) delete obj.registration_hook;
    logger.debug(`retrieved account: ${JSON.stringify(obj)}`);
    return obj;
  }
  return null;
}

module.exports = lookupAccountBySid;
