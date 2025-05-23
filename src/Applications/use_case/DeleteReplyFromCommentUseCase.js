/* eslint-disable no-undef */
class DeleteReplyFromCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ replyId, owner }) {
    await this._threadRepository.verifyReplyAccess(replyId, owner);
    await this._threadRepository.deleteReplyFromComment(replyId);
  }
}
module.exports = DeleteReplyFromCommentUseCase;