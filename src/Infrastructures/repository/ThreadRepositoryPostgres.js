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

    return new CreatedThread({ ...result.rows[0] });
  }

  async addCommentToThread(createCommentThread) {
    const { threadId, content, owner } = createCommentThread;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const queryCheckThread = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const thread = await this._pool.query(queryCheckThread);

    if (!thread.rows.length) {
      throw new NotFoundError("lagu gagal ditambahkan. Id tidak ditemukan");
    }

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner",
      values: [id, content, threadId, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new CreatedCommentInThread({ ...result.rows[0] });
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

  formatDetailThread(rows) {
    if (rows.length === 0) return null;

    const thread = {
      id: rows[0].thread_id,
      title: rows[0].title_thread,
      body: rows[0].body_thread,
      date: rows[0].date,
      username: rows[0].u_thread,
      comments: [],
    };

    const commentMap = {};

    for (const row of rows) {
      const commentId = row.id_comment;

      if (!commentMap[commentId]) {
        commentMap[commentId] = {
          id: commentId,
          username: row.u_comment,
          date: row.date,
          replies: [],
          content: row.content_comment,
        };
      thread.comments.push(commentMap[commentId]);
      }

      if (row.id_reply) {
        commentMap[commentId].replies.push({
          id: row.id_reply,
          content: row.content_reply,
          date: row.created_at,
          username: row.u_reply,
        });
      }

    }

    return  thread;
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
              CASE 
                WHEN c.is_deleted = true THEN '**komentar telah dihapus**'
                  ELSE c.content
              END AS content_comment ,
              r.id as id_reply,
              CASE 
                WHEN r.is_deleted = true THEN '**balasan telah dihapus**'
                  ELSE r.content
              END AS content_reply ,
              r.created_at ,
              u_reply.username as u_reply
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
    console.log(
      "🚀 ~ ThreadRepositoryPostgres ~ getDetailThreadById ~ result:",
      result
    );

    if (!result.rows.length) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    const mapThread = this.formatDetailThread(result.rows);

    return mapThread;
  }

  async addReplyToComment(createReplyComment) {
    const { threadId, commentId, content, owner } = createReplyComment;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const queryCheckThread = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const thread = await this._pool.query(queryCheckThread);

    if (!thread.rows.length) {
      throw new NotFoundError("komentar tidak ditemukan");
    }

    const queryCheckComment = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const comment = await this._pool.query(queryCheckComment);

    if (!comment.rows.length) {
      throw new NotFoundError("komentar tidak ditemukan");
    }

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $6) RETURNING id, content, owner",
      values: [id, content, threadId, commentId, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new CreatedReplyInComment({ ...result.rows[0] });
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