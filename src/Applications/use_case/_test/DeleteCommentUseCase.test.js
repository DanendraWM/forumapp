/* eslint-disable no-undef */
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        // mocking repository
        const mockThreadRepository = (() => {
            return {
                verifyCommentOwner: jest.fn(() => Promise.resolve()),
                deleteComment: jest.fn(() => Promise.resolve( )),
            };
        })();
        
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockThreadRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
    });
});