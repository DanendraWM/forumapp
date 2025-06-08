/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class ThreadRepository {
    async addThread(createThread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async addCommentToThread(createThread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async verifyCommentOwner(id, owner) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async deleteComment(id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }
      
      async getDetailThreadById(id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async addReplyToComment(createReplyComment) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async verifyReplyAccess(id, owner) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async deleteReplyFromComment(id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async verifyThreadExists(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async formatDetailThread(mapThread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async verifyCommentExists(commentId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async verifyLikeExist(threadId, commentId, owner) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }
      
      async addLike(threadId, commentId, owner) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }

      async deleteLike(threadId, commentId, owner) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }
  }
   
module.exports = ThreadRepository;