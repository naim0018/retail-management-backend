import { Router } from "express";
import { AuthRoute } from "../../modules/Auth/auth.route";
import { TransactionRoutes } from "../../modules/Transaction/transaction.route";
import { PlatformBalanceRoutes } from "../../modules/PlatformBalance/platformBalance.route";
import { TargetRoutes } from "../../modules/Target/target.route";

const router = Router()

const moduleRoute = [
    {
        path:'/auth',
        route: AuthRoute
    },
    {
        path: '/transactions',
        route: TransactionRoutes
    },
    {
        path: '/platform-balances',
        route: PlatformBalanceRoutes
    },
    {
        path: '/targets',
        route: TargetRoutes
    }
]

moduleRoute.forEach((route)=>router.use(route.path,route.route))

export default router