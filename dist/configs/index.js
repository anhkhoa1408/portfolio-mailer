"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev = {
    app: {
        port: process.env.PORT || 8080,
    },
};
const configs = { dev };
const env = process.env.NODE_ENV || "dev";
exports.default = configs[env];
