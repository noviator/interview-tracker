const AdminBro = require("admin-bro");
const mongoose = require("mongoose");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
require("../models/User");
require("../models/Topic");
require("../models/Question");

AdminBro.registerAdapter(AdminBroMongoose);

// const express = require("express");
// const app = express();

const adminBro = new AdminBro({
    databases: [mongoose],
    rootPath: "/admin",
    branding: {
        companyName: "Interview Tracker",
    },
});

const ADMIN = {
    email: "test@test.com",
    password: "test.test",
};

const routerAdmin = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async(email, password) => {
        if (ADMIN.password === password && ADMIN.email === email) {
            return ADMIN;
        }
        return null;
    },
    cookieName: "adminbro",
    cookiePassword: "someCookiePasswordDefault",
});

module.exports = routerAdmin;