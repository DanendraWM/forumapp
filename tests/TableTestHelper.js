/* eslint-disable no-undef */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const TableTestHelper = {
    async cleanTable() {
      await pool.query('TRUNCATE TABLE users, threads, comments, authentications RESTART IDENTITY CASCADE');
    },
  };
   
  module.exports = TableTestHelper;