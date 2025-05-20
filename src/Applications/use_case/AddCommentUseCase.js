/* eslint-disable no-undef */
const CreateCommentThread = require('../../Domains/threads/entities/CreateCommentThread');
 
class AddCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }
 
  async execute(useCasePayload) {
    const createCommentThread = new CreateCommentThread(useCasePayload);
    return this._threadRepository.addCommentToThread(createCommentThread);
  }
}
 
module.exports = AddCommentUseCase;