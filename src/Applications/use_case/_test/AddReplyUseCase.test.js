/* eslint-disable no-undef */
const AddReplyUseCase = require("../AddReplyUseCase");

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
            addReplyToComment: jest.fn(() => Promise.resolve(expectedAddedReply)),
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
    });
});