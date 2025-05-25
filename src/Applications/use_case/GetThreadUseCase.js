/* eslint-disable no-undef */
class GetThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
      }
     
      async execute(useCasePayload) {
        await this._threadRepository.verifyThreadExists(useCasePayload);
        const mapThread = await this._threadRepository.getDetailThreadById(useCasePayload);
        return await this._threadRepository.formatDetailThread(mapThread);
      }
}

module.exports = GetThreadUseCase;