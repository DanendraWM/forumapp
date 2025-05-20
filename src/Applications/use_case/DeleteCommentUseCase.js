/* eslint-disable no-undef */
class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyCommentOwner(useCasePayload.commentId, useCasePayload.owner);
    await this._threadRepository.deleteComment(useCasePayload.commentId);
  }
}

module.exports = DeleteCommentUseCase;