"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    admin: 'admin',
    user: 'user',
};
exports.seedUsers = [
    {
        name: 'Super Admin',
        email: 'aziz@gmail.com',
        password: '123456789',
        role: 'admin',
    },
    {
        name: 'General User',
        email: 'user@gmail.com',
        password: '123456789',
        role: 'user',
    },
];
