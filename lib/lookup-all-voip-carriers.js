const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');
const sql = 'SELECT * FROM voip_carriers';

/**
 * Lookup all voip_carriers
 * @param {*} sequelize
 * @param {*} logger
 * @param {*} sip_realm
 */
async function lookupAllVoipCarriers(sequelize, logger) {
  const r = await sequelize.query(sql, {
    type: QueryTypes.SELECT
  });
  debug(`results: ${JSON.stringify(r)}`);
  return r;
}

module.exports = lookupAllVoipCarriers;
