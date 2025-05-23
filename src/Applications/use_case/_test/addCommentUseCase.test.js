/* eslint-disable no-undef */

const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
    it("should orchestrating the add comment action correctly", async () => {
        // Arrange
        const useCasePayload = {
            content: "A comment",
            threadId: "thread-123",
            owner: "user-123",
        };
    
        const expectedAddedComment = {
            id: "comment-123",
            content: "A comment",
            owner: "user-123",
        };
    
        // mocking repository
        const mockThreadRepository = (() => {
        return {
            addCommentToThread: jest.fn(() => Promise.resolve(expectedAddedComment)),
        };
        })();
    
        const addCommentUseCase = new AddCommentUseCase({
        threadRepository: mockThreadRepository,
        });
    
        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload);
    
        // Assert
        expect(addedComment).toEqual(expectedAddedComment);
        expect(mockThreadRepository.addCommentToThread).toBeCalledWith(useCasePayload);
    });
});