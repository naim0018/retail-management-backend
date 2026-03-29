"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../../modules/Auth/auth.route");
const transaction_route_1 = require("../../modules/Transaction/transaction.route");
const platformBalance_route_1 = require("../../modules/PlatformBalance/platformBalance.route");
const target_route_1 = require("../../modules/Target/target.route");
const router = (0, express_1.Router)();
const moduleRoute = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoute
    },
    {
        path: '/transactions',
        route: transaction_route_1.TransactionRoutes
    },
    {
        path: '/platform-balances',
        route: platformBalance_route_1.PlatformBalanceRoutes
    },
    {
        path: '/targets',
        route: target_route_1.TargetRoutes
    }
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
