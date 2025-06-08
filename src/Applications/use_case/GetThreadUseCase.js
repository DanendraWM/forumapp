/* eslint-disable no-undef */
class GetThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
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
              content: row.is_deleted_comment ? "**komentar telah dihapus**" : row.content_comment,
              likeCount: parseInt(row.like_count_comment) || 0,
            };
          thread.comments.push(commentMap[commentId]);
          }
    
          if (row.id_reply) {
            commentMap[commentId].replies.push({
              id: row.id_reply,
              content: row.is_deleted_reply ? "**balasan telah dihapus**" : row.content_reply,
              date: row.created_at,
              username: row.u_reply,
            });
          }
    
        }
    
        return  thread;
      }
     
      async execute(useCasePayload) {
        await this._threadRepository.verifyThreadExists(useCasePayload);
        const mapThread = await this._threadRepository.getDetailThreadById(useCasePayload);
        return this.formatDetailThread(mapThread);
      }
}

module.exports = GetThreadUseCase;