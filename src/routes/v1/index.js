const express = require('express');
const accountRoute = require('./account.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/account',
        route: accountRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
