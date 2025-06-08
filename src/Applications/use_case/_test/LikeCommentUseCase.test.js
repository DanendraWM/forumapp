/* eslint-disable no-undef */
const LikeCommentUseCase = require("../LikeCommentUseCase");

describe('LikeCommentUseCase', () => {
    it('should unlike comment when the comment is already liked', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        
        const mockThreadRepository = (() => {
            return {
                verifyThreadExists: jest.fn(() => Promise.resolve()),
                verifyCommentExists: jest.fn(() => Promise.resolve()),
                verifyLikeExist: jest.fn(() => Promise.resolve(true)),
                deleteLike: jest.fn(() => Promise.resolve()),
                addLike: jest.fn(() => Promise.resolve()),
            }
        })();
        
        // create use case instance
        const likeCommentUseCase = new LikeCommentUseCase({
            threadRepository: mockThreadRepository,
        });
    
        // Action
        await likeCommentUseCase.execute(useCasePayload);
    
        // Assert
        expect(mockThreadRepository.verifyThreadExists)
            .toBeCalledWith('thread-123');
        expect(mockThreadRepository.verifyCommentExists)
            .toBeCalledWith('comment-123');
        expect(mockThreadRepository.verifyLikeExist)
            .toBeCalledWith('thread-123', 'comment-123', 'user-123');
        expect(mockThreadRepository.deleteLike)
            .toBeCalledWith('thread-123', 'comment-123', 'user-123');  
    });

    it('should orchestrating the like comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        
        const mockThreadRepository = (() => {
            return {
               verifyThreadExists: jest.fn(() => Promise.resolve()),
                verifyCommentExists: jest.fn(() => Promise.resolve()),
                verifyLikeExist: jest.fn(() => Promise.resolve(false)),
                deleteLike: jest.fn(() => Promise.resolve()),
                addLike: jest.fn(() => Promise.resolve()),
            }
        })();
        
    
        // create use case instance
        const likeCommentUseCase = new LikeCommentUseCase({
            threadRepository: mockThreadRepository,
        });
    
        // Action
        await likeCommentUseCase.execute(useCasePayload);
    
        // Assert
        expect(mockThreadRepository.verifyThreadExists)
        .toBeCalledWith('thread-123');
        expect(mockThreadRepository.verifyCommentExists)
        .toBeCalledWith('comment-123');
        expect(mockThreadRepository.verifyLikeExist)
        .toBeCalledWith('thread-123', 'comment-123', 'user-123');
        expect(mockThreadRepository.addLike)
        .toBeCalledWith('thread-123', 'comment-123', 'user-123');
    });
});