"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = exports.loginValidationSchema = exports.registerValidationSchema = void 0;
const zod_1 = require("zod");
exports.registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    }),
});
exports.loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
exports.AuthValidation = {
    registerValidationSchema: exports.registerValidationSchema,
    loginValidationSchema: exports.loginValidationSchema,
};
