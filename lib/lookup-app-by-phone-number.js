const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');

const select = 'SELECT * FROM applications app LEFT JOIN webhooks AS';
const where = 'WHERE app.application_sid = (SELECT application_sid from phone_numbers where number = ?)';
const ch_query = `${select} ch ON app.call_hook_sid = ch.webhook_sid ${where}`;
const sh_query = `${select} sh ON app.call_status_hook_sid = sh.webhook_sid ${where}`;
const mh_query = `${select} mh ON app.messaging_hook_sid = mh.webhook_sid ${where}`;


const sqlCallRoutes =
`SELECT cr.regex, cr.application_sid
FROM call_routes cr, phone_numbers ph
WHERE ph.number = ?
AND ph.account_sid = cr.account_sid
ORDER BY cr.priority ASC
`;

/**
 * Lookup the application which should be invoked when a call arrives on a phone number
 * @param {*} sequelize
 * @param {*} logger
 * @param {*} phoneNumber - phone number that was dialed
 */
async function lookupAppByPhoneNumber(sequelize, logger, phoneNumber) {
  // first see if the phone number is directly assigned to an app
  const querylookup = async(query) =>  await sequelize.query(query, {
    replacements: [phoneNumber],
    type: QueryTypes.SELECT
  });
  const result = await Promise.allSettled([querylookup(ch_query), querylookup(sh_query), querylookup(mh_query)]);
  debug(`results from querying phone_numbers for application: ${JSON.stringify(result)}`);
  if (result.length > 0) {
    const obj = {
      call_hook: (result[0].value.length > 0) ? result[0].value[0] : {},
      call_status_hook: (result[1].value.length > 0) ? result[1].value[0] : {},
      messaging_hook: (result[2].value.length > 0) ? result[2].value[0] : {},
    };
    if (!obj.call_hook.url) delete obj.call_hook;
    if (!obj.call_status_hook.url) delete obj.call_status_hook;
    if (!obj.messaging_hook.url) delete obj.messaging_hook;
    //console.log(`retrieved application: ${JSON.stringify(obj)}`);
    return obj;
  }

  // if not, check the regex patterns that have been set up
  // for the account that owns the phone number
  const callRoutes = await sequelize.query(sqlCallRoutes, {
    //logging: logger,
    //plain: false,
    //raw: true,
    replacements: [phoneNumber],
    type: QueryTypes.SELECT
  });
  const selectedRoute = callRoutes.find((cr) => RegExp(cr.RegExp).test(phoneNumber));
  if (!selectedRoute) return null;

  const lookupAppBySid = require('./lookup-app-by-sid').bind(null, sequelize, logger);
  return await lookupAppBySid(selectedRoute.application_sid);
}

module.exports = lookupAppByPhoneNumber;
