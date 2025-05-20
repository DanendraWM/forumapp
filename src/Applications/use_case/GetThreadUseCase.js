/* eslint-disable no-undef */
class GetThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
      }
     
      async execute(useCasePayload) {
        return this._threadRepository.getDetailThreadById(useCasePayload);
      }
}

module.exports = GetThreadUseCase;