"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const auth_constant_1 = require("./auth.constant");
const auth_model_1 = require("./auth.model");
const seedAdmin = async () => {
    for (const seedUser of auth_constant_1.seedUsers) {
        const isUserExist = await auth_model_1.User.findOne({ email: seedUser.email });
        if (!isUserExist) {
            // user.create will trigger pre-save hook for password hash
            await auth_model_1.User.create(seedUser);
        }
    }
};
exports.seedAdmin = seedAdmin;
