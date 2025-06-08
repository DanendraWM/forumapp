/* eslint-disable no-undef */
class LikeCommentUseCase {
    constructor({ threadRepository, commentRepository, likeCommentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeCommentRepository = likeCommentRepository;
    }
    
    async execute(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;
    
        await this._threadRepository.verifyThreadExists(threadId);
        await this._threadRepository.verifyCommentExists(commentId);
        const isLiked = await this._threadRepository.verifyLikeExist(threadId, commentId, owner);
    
        isLiked ? 
            await this._threadRepository.deleteLike(threadId, commentId, owner) : 
            await this._threadRepository.addLike(threadId, commentId, owner);
    }
}

module.exports = LikeCommentUseCase;