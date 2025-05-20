/* eslint-disable no-undef */
// const InvariantError = require('../../Commons/exceptions/InvariantError');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CreatedCommentInThread = require('../../Domains/threads/entities/CreatedCommentInThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
 
  async addThread(createThread) {
    const { title, body, owner } = createThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
 
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt],
    };
 
    const result = await this._pool.query(query);
 
    return new CreatedThread({ ...result.rows[0] });
  }

  async addCommentToThread(createCommentThread) {
    const { threadId, content, owner } = createCommentThread;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const queryCheckThread = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const thread = await this._pool.query(queryCheckThread);

    if (!thread.rows.length) {
      throw new NotFoundError('lagu gagal ditambahkan. Id tidak ditemukan');
    }
 
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner',
      values: [id, content, threadId , owner, createdAt],
    };
 
    const result = await this._pool.query(query);
 
    return new CreatedCommentInThread({ ...result.rows[0] });
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('Tidak dapat mengakses resource ini');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getDetailThreadById(id) {
    const query = {
      text: `select  t.id as thread_id , t.title as title_thread , t.body as body_thread, t.created_at as date , u_thread.username  as username_thread
            , c.id as id_comment, u.username as username_comment, c.created_at as date, 
            CASE 
                    WHEN c.is_deleted = true THEN '**komentar telah dihapus**'
                    ELSE c.content
                END AS content 
            from "comments" c 
            left join users u on u.id = c."owner" 
            left join threads t on t.id  = c.thread_id  
            left join users u_thread on u_thread.id = t."owner" 
            where thread_id = $1
            order by c.created_at asc`,
      values: [id],
    };

    const result = await this._pool.query(query);
    console.log("🚀 ~ ThreadRepositoryPostgres ~ getDetailThreadById ~ result:", result)

    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const mapThread = {
      id: result.rows[0].thread_id,
      title: result.rows[0].title_thread,
      body: result.rows[0].body_thread,
      date: result.rows[0].date,
      username: result.rows[0].username_thread,
      comments: [
        ...result.rows.map((row) => ({
          id: row.id_comment,
          username: row.username_comment,
          date: row.date,
          content: row.content,
        })),
      ],
    }; 

    return mapThread;
  }
}
 
module.exports = ThreadRepositoryPostgres;