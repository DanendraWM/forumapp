/* eslint-disable no-undef */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
 
const ThreadTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'test', body = 'test', owner = 'user-123',
  }) {
    const createAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $5)',
      values: [id, title, body, owner, createAt],
    };
 
    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };
 
    const result = await pool.query(query);
    return result.rows;
  },

  async findLikeById(threadId, commentId, owner) {
    const query = {
      text: 'SELECT * FROM like_comments WHERE thread_id = $1 AND comment_id = $2 AND owner = $3',
      values: [threadId, commentId, owner],
    };
 
    const result = await pool.query(query);
    return result.rows;
  },
 
  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads RESTART IDENTITY CASCADE');
  },
};
 
module.exports = ThreadTableTestHelper;