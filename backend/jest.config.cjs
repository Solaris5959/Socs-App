// jest.config.cjs
const path = require('path');
const envFile = path.join(__dirname, 'env.jest');

// Read the environment variables we use for Jest from our env.jest file
require('dotenv').config({ path: envFile });
module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js","json","node"],
  roots: ["<rootDir>/tests"],
};
