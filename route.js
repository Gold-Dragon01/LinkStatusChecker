const { userHandler,tokenHandler,checkHandler } = require("./Handler/Handler");

const routes = {
    user : userHandler,
    token: tokenHandler,
    check: checkHandler
};

module.exports = routes;