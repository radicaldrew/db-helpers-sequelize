const debug = require('debug')('jambonz:db-helpers');
const { QueryTypes } = require('sequelize');
const sql =
`SELECT sg.sip_gateway_sid, sg.voip_carrier_sid, vc.name, vc.account_sid, 
vc.application_sid, sg.inbound, sg.outbound, sg.is_active 
FROM sip_gateways sg, voip_carriers vc
WHERE sg.voip_carrier_sid = vc.voip_carrier_sid
AND ipv4 = ? and port = ?
`;

/**
 * Lookup the configured sip gateway and associated carrier for an ip address and port
 * @param {*} sequelize
 * @param {*} logger
 * @param {*} ipv4 - ip address
 * @param {*} port - port
 */
async function lookupSipGatewayBySignalingAddress(sequelize, logger, ipv4, port) {
  const r = await sequelize.query(sql, {
    //logging: logger,
    plain: false,
    raw: true,
    replacements: [ipv4, port],
    type: QueryTypes.SELECT
  });
  debug(`results: ${JSON.stringify(r)}`);
  return r.length === 1 ? r[0] : null;
}

module.exports = lookupSipGatewayBySignalingAddress;
