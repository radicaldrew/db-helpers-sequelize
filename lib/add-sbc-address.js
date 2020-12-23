const debug = require('debug')('jambonz:db-helpers');
const uuid = require('uuid').v4;
const { QueryTypes } = require('sequelize');

const sql = `INSERT into sbc_addresses 
(sbc_address_sid, ipv4) 
values (?, ?)`;

/**
 * Lookup the account by account_sid
 * @param {*} sequelize
 * @param {*} logger
 */
async function addSbcAddress(sequelize, logger, ipv4) {
  try {
    debug(`select with ${ipv4}`);
    const r = await sequelize.query('SELECT * FROM sbc_addresses where ipv4 = ?', {
      replacements: [ipv4],
      type: QueryTypes.SELECT
    });
    debug(`results from searching for sbc address ${ipv4}: ${JSON.stringify(r)}`);
    if (r.length > 0) return;
    const r2 = await sequelize.query(sql, {
      replacements: [uuid(), ipv4],
      type: QueryTypes.INSERT
    });
    debug(`results from inserting sbc address ${ipv4}: ${JSON.stringify(r2)}`);
  } catch (err) {
    debug(err);
    logger.error({err}, 'Error adding SBC address to the database');
  }
}

module.exports = addSbcAddress;
