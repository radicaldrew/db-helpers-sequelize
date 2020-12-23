const { Sequelize } = require('sequelize');

module.exports = function(config, logger) {
  let sequelize;
  const dialects = ['mysql', 'mariadb', 'postgres', 'mssql'];
  if (config.dialect && dialects.includes(config.dialect)) {
    sequelize = new Sequelize(config.database, config.user, config.password, {
      host: config.host,
      dialect: config.dialect,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  } else {
    throw new Error('Invalid database dialect chosen');
  }

  logger = logger || {info: () => {}, error: () => {}, debug: () => {}};
  sequelize
    .authenticate()
    // eslint-disable-next-line promise/always-return
    .then((_response) => {
      logger.info('Successfully established connection to database');
    })
    .catch((err) => {
      throw err;
    });

  return {
    lookupAuthHook: require('./lib/lookup-auth-hook').bind(null, sequelize, logger),
    lookupSipGatewayBySignalingAddress:
      require('./lib/lookup-sip-gateway-by-signaling-address').bind(null, sequelize, logger),
    performLcr: require('./lib/perform-lcr').bind(null, sequelize, logger),
    lookupAppByPhoneNumber: require('./lib/lookup-app-by-phone-number').bind(null, sequelize, logger),
    lookupAppBySid: require('./lib/lookup-app-by-sid').bind(null, sequelize, logger),
    lookupAppByRealm: require('./lib/lookup-app-by-realm').bind(null, sequelize, logger),
    lookupAppByTeamsTenant: require('./lib/lookup-app-by-teams-tenant').bind(null, sequelize, logger),
    lookupAccountBySid: require('./lib/lookup-account-by-sid').bind(null, sequelize, logger),
    lookupAccountBySipRealm: require('./lib/lookup-account-by-sip-realm').bind(null, sequelize, logger),
    lookupAccountByPhoneNumber: require('./lib/lookup-account-by-phone-number').bind(null, sequelize, logger),
    addSbcAddress: require('./lib/add-sbc-address').bind(null, sequelize, logger),
    lookupAllTeamsFQDNs: require('./lib/lookup-all-teams-fqdns').bind(null, sequelize, logger),
    lookupTeamsByAccount: require('./lib/lookup-teams-by-account').bind(null, sequelize, logger),
    lookupAllVoipCarriers: require('./lib/lookup-all-voip-carriers').bind(null, sequelize, logger),
    lookupSipGatewaysByCarrier: require('./lib/lookup-sip-gateways-by-carrier').bind(null, sequelize, logger)
  };
};
