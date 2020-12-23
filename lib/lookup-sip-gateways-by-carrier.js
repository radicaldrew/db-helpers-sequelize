const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');
const sql = 'SELECT * FROM sip_gateways WHERE voip_carrier_sid = ?';

/**
 * Lookup all sip gateways for a voip_carriers
 * @param {*} sequelize
 * @param {*} logger
 * @param {*} sip_realm
 */
async function lookupSipGatewaysByCarrier(sequelize, logger, voip_carrier_sid) {
  const r = await sequelize.query(sql, {
    //logging: logger,
    plain: false,
    raw: true,
    replacements: [voip_carrier_sid],
    type: QueryTypes.SELECT
  });
  debug(`results: ${JSON.stringify(r)}`);
  return r;
}

module.exports = lookupSipGatewaysByCarrier;
