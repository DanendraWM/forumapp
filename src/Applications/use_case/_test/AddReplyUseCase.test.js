/* eslint-disable no-undef */
const AddReplyUseCase = require("../AddReplyUseCase");
const createdReplyInComment = require("../../../Domains/threads/entities/CreatedReplyInComment");

describe("AddReplyUseCase", () => {
    it("should orchestrating the add reply action correctly", async () => {
        // Arrange
        const useCasePayload = {
            threadId: "thread-123",
            commentId: "comment-123",
            content: "A reply",
            owner: "user-123",
        };
    
        const expectedAddedReply = {
            id: "reply-123",
            content: "A reply",
            owner: "user-123",
        };
    
        // mocking repository
        const mockThreadRepository = (() => {
        return {
            verifyThreadExists: jest.fn(() => Promise.resolve()),
            verifyCommentExists: jest.fn(() => Promise.resolve()),
            addReplyToComment: jest.fn(() => Promise.resolve(new createdReplyInComment({
                id: "reply-123",
                content: "A reply",
                owner: "user-123",
            }))),
        };
        })();
    
        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
        });
    
        // Action
        const addedReply = await addReplyUseCase.execute(useCasePayload);
    
        // Assert
        expect(addedReply).toEqual(expectedAddedReply);
        expect(mockThreadRepository.addReplyToComment).toBeCalledWith(useCasePayload);
        expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    });
});