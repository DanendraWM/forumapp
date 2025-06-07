/* eslint-disable no-undef */
// const InvariantError = require('../../Commons/exceptions/InvariantError');
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const CreatedCommentInThread = require("../../Domains/threads/entities/CreatedCommentInThread");
const CreatedReplyInComment = require("../../Domains/threads/entities/CreatedReplyInComment");

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
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5, $5) RETURNING id, title, owner",
      values: [id, title, body, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new CreatedThread(result.rows[0]);
  }

  async addCommentToThread(createCommentThread) {
    const { threadId, content, owner } = createCommentThread;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner",
      values: [id, content, threadId, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new CreatedCommentInThread(result.rows[0]);
  }

  async verifyThreadExists(threadId) {
    const queryCheckThread = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const { rowCount } = await this._pool.query(queryCheckThread);

    if (!rowCount) {
      throw new NotFoundError("lagu gagal ditambahkan. Id tidak ditemukan");
    }
  }

  async verifyCommentExists(commentId) {
    const queryCheckComment = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const comment = await this._pool.query(queryCheckComment);

    if (!comment.rows.length) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("comment tidak ditemukan");
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError("Tidak dapat mengakses resource ini");
    }
  }

  async deleteComment(id) {
    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id",
      values: [id],
    };

    await this._pool.query(query);
  }

  async getDetailThreadById(id) {
    const query = {
      text: `select 
            t.id as thread_id , 
            t.title as title_thread , 
            t.body as body_thread, 
            t.created_at as date , 
            u_thread.username  as u_thread, 
            c.id as id_comment, 
            u_comment.username as u_comment, 
            c.created_at as date, 
            c.content AS content_comment ,
            c.is_deleted as is_deleted_comment,
            r.id as id_reply,
            r.content AS content_reply ,
            r.created_at ,
            u_reply.username as u_reply,
            r.is_deleted as is_deleted_reply
          from threads t 
          left join "comments" c on c.thread_id  = t.id 
          left join replies r on r.comment_id  = c.id
          left join users u_reply on u_reply.id = r."owner" 
          left join users u_comment on u_comment.id  = c."owner" 
          left join users u_thread on u_thread.id  = t."owner" 
          where t.id  = $1
          order by c.created_at asc, r.created_at asc;`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async addReplyToComment(createReplyComment) {
    const { threadId, commentId, content, owner } = createReplyComment;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $6) RETURNING id, content, owner",
      values: [id, content, threadId, commentId, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new CreatedReplyInComment(result.rows[0]);
  }

  async verifyReplyAccess(id, owner) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("reply tidak ditemukan");
    }

    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError("Tidak dapat mengakses resource ini");
    }
  }

  async deleteReplyFromComment(id) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1 RETURNING id",
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgres;