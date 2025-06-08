/* eslint-disable no-undef */
/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123', content = 'test', threadId = 'thread-123', owner = 'user-123',
    }) {
        const createAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $5)',
            values: [id, content, threadId, owner, createAt],
        };
        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async findCommentDeletedById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 and is_deleted = true',
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async addLike({
        id = 'like-123', threadId='thread-123' , commentId = 'comment-123', owner = 'user-123',
    }) {
        const createAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO like_comments VALUES($1, $2, $3, $4, $5, $5)',
            values: [id,threadId, commentId, owner, createAt],
        };
        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
    },
};

module.exports = CommentsTableTestHelper;