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
  }
   
module.exports = ThreadRepository;