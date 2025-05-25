/* eslint-disable no-undef */
const CreateReplyComment = require("../../Domains/threads/entities/CreateReplyComment");

class AddReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const createReplyComment = new CreateReplyComment(useCasePayload); 
    await this._threadRepository.verifyThreadExists(createReplyComment.threadId);
    await this._threadRepository.verifyCommentExists(createReplyComment.commentId);
    return this._threadRepository.addReplyToComment(createReplyComment);
  }
}

module.exports = AddReplyUseCase;