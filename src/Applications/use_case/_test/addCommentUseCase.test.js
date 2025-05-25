/* eslint-disable no-undef */

const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
    it("should throw not found error when thread does not exist", async () => {
        // Arrange
        const useCasePayload = {
            content: "A comment",
            threadId: "thread-123",
            owner: "user-123",
        };

        // mocking repository
        const mockThreadRepository = (() => {
            return {
                verifyThreadExists: jest.fn(() => Promise.reject(new Error("THREAD_NOT_FOUND"))),
                addCommentToThread: jest.fn(),
            };
        })();

        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action & Assert
        await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError("THREAD_NOT_FOUND");
    });
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
            verifyThreadExists: jest.fn(() => Promise.resolve()),
            addCommentToThread: jest.fn(() => Promise.resolve({
                id: "comment-123",
                content: "A comment",
                owner: "user-123",
            })),
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