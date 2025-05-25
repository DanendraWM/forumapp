/* eslint-disable no-undef */
/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123', content = 'test reply', threadId = 'thread-123', commentId = 'comment-123', owner = 'user-123', 
    }) {
        const createAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5 ,$6, $6)',
            values: [id, content, threadId, commentId, owner, createAt],
        };
        await pool.query(query);
    },

    async findRepliesById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },
    

    async findReplyDeletedById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1 and is_deleted = true',
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE replies RESTART IDENTITY CASCADE');
    },
};

module.exports = RepliesTableTestHelper;