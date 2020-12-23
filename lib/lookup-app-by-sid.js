const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');

const select = 'SELECT * FROM applications app LEFT JOIN webhooks AS';
const where = 'WHERE app.application_sid = ?';
const ch_query = `${select} ch ON app.call_hook_sid = ch.webhook_sid ${where}`;
const sh_query = `${select} sh ON app.call_status_hook_sid = sh.webhook_sid ${where}`;
const mh_query = `${select} mh ON app.messaging_hook_sid = mh.webhook_sid ${where}`;

/**
 * Lookup the application by application_sid
 * @param {*} sequelize
 * @param {*} logger
 * @param {*} application_sid
 */
async function lookupAppBySid(sequelize, logger, application_sid) {
  const querylookup = async(query) =>  await sequelize.query(query, {
    replacements: [application_sid],
    type: QueryTypes.SELECT
  });
  const result = await Promise.allSettled([querylookup(ch_query), querylookup(sh_query), querylookup(mh_query)]);

  debug(`results: ${JSON.stringify(result)}`);
  if (result.length > 0) {
    const obj = {
      call_hook: (result[0].value.length > 0) ? result[0].value[0] : {},
      call_status_hook: (result[1].value.length > 0) ? result[1].value[0] : {},
      messaging_hook: (result[2].value.length > 0) ? result[2].value[0] : {},
    };
    if (!obj.call_hook.url) delete obj.call_hook;
    if (!obj.call_status_hook.url) delete obj.call_status_hook;
    if (!obj.messaging_hook.url) delete obj.messaging_hook;
    logger.debug(`retrieved application: ${JSON.stringify(obj)}`);
    return obj;
  }
  return null;
}

module.exports = lookupAppBySid;
