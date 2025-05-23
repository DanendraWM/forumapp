const DeleteReplyFromCommentUseCase = require("../DeleteReplyFromCommentUseCase");

/* eslint-disable no-undef */
describe("DeleteReplyFromCommentUseCase", () => {
  it("should throw NotFoundError when reply is not found", async () => {
    // Arrange
    const useCasePayload = {
      replyId: "reply-123",
      owner: "user-123",
    };

    // mocking repository
    const mockThreadRepository = (() => {
      return {
        verifyReplyAccess: jest.fn(() => Promise.reject(new Error("REPLY_NOT_FOUND"))),
        deleteReplyFromComment: jest.fn(),
      };
    })();

    const deleteReplyFromCommentUseCase = new DeleteReplyFromCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteReplyFromCommentUseCase.execute(useCasePayload)).rejects.toThrowError("REPLY_NOT_FOUND");
  });

  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      replyId: "reply-123",
      owner: "user-123",
    };

    // mocking repository
    const mockThreadRepository = (() => {
      return {
        verifyReplyAccess: jest.fn(),
        deleteReplyFromComment: jest.fn(),
      };
    })();

    const deleteReplyFromCommentUseCase = new DeleteReplyFromCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyFromCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyReplyAccess).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockThreadRepository.deleteReplyFromComment).toBeCalledWith(useCasePayload.replyId);
  });
});
