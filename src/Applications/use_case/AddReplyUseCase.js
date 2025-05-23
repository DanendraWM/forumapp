/* eslint-disable no-undef */
const CreateReplyComment = require("../../Domains/threads/entities/CreateReplyComment");

class AddReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const createReplyComment = new CreateReplyComment(useCasePayload); 
    return this._threadRepository.addReplyToComment(createReplyComment);
  }
}

module.exports = AddReplyUseCase;