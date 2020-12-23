const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');

const sql =
`SELECT *
FROM accounts acc
LEFT JOIN webhooks AS rh ON acc.registration_hook_sid = rh.webhook_sid
WHERE acc.account_sid = (SELECT account_sid from phone_numbers WHERE number = ?)`;

/**
 * Lookup the account by phone_number
 * @param {*} sequelize
 * @param {*} logger
 */
async function lookupAccountByPhoneNumber(sequelize, logger, phoneNumber) {
  const r = await sequelize.query(sql, {
    replacements: [phoneNumber],
    type: QueryTypes.SELECT
  });
  debug(`results: ${JSON.stringify(r)}`);
  if (r.length > 0) {
    const obj = r[0];
    //Object.assign(obj, {registration_hook: r[0].rh});
    //if (!obj.registration_hook.url) delete obj.registration_hook;
    logger.debug(`retrieved account: ${JSON.stringify(obj)}`);
    return obj;
  }
  return null;
}

module.exports = lookupAccountByPhoneNumber;
