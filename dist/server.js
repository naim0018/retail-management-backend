"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const auth_seed_1 = require("./modules/Auth/auth.seed");
let server;
async function main() {
    try {
        await mongoose_1.default.connect(config_1.default.db);
        await (0, auth_seed_1.seedAdmin)();
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`App running on port -${config_1.default.port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}
main();
process.on('unhandledRejection', (err) => {
    console.log("Unhandled Rejection, shutting down the server ", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtRejection', () => {
    console.log("Uncaught Rejection, shutting down the server");
    process.exit(1);
});
