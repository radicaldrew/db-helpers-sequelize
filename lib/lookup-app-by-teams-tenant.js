const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');
const select =
`SELECT *
FROM applications app
LEFT JOIN webhooks AS`;
const where = `WHERE application_sid = (
  SELECT application_sid 
  FROM ms_teams_tenants
  WHERE tenant_fqdn = ?
)`;
const ch_query = `${select} ch ON app.call_hook_sid = ch.webhook_sid ${where}`;
const sh_query = `${select} sh ON app.call_status_hook_sid = sh.webhook_sid ${where}`;


/**
 * Lookup the application by ms teams tenant
 * @param {*} sequelize
 * @param {*} logger
 * @param {*} sip_realm
 */
async function lookupAppByTeamsTenant(sequelize, logger, tenant_fqdn) {
  const querylookup = async(query) =>  await sequelize.query(query, {
    replacements: [tenant_fqdn],
    type: QueryTypes.SELECT
  });
  const result = await Promise.allSettled([querylookup(ch_query), querylookup(sh_query)]);
  debug(`results: ${JSON.stringify(result)}`);
  if (result.length > 0) {
    const obj = {
      call_hook: (result[0].value.length > 0) ? result[0].value[0] : {},
      call_status_hook: (result[1].value.length > 0) ? result[1].value[0] : {}
    };
    if (!obj.call_hook.url) delete obj.call_hook;
    if (!obj.call_status_hook.url) delete obj.call_status_hook;
    logger.debug(`retrieved application: ${JSON.stringify(obj)}`);
    return obj;
  }
  return null;
}

module.exports = lookupAppByTeamsTenant;
