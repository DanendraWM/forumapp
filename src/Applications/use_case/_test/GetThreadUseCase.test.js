/* eslint-disable no-undef */
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should throw not found error when thread does not exist", async () => {
    // Arrange
    const useCasePayload = "thread-123";

    // mocking repository
    const mockThreadRepository = (() => {
      return {
        verifyThreadExists: jest.fn(() =>
          Promise.reject(new Error("THREAD_NOT_FOUND"))
        ),
        getDetailThreadById: jest.fn(),
        formatDetailThread: jest.fn(),
      };
    })();

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      "THREAD_NOT_FOUND"
    );
  });
  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const useCasePayload = "thread-123";

    const expectedThread = {
      id: "thread-123",
      title: "A thread",
      body: "A body",
      date: "2023-10-01T00:00:00.000Z",
      username: "user-123",
      comments: [
        {
          id: "comment-123",
          username: "user-123",
          date: "2023-10-01T00:00:00.000Z",
          replies: [
            {
              id: "reply-123",
              username: "user-456",
              date: "2023-10-01T00:00:00.000Z",
              content: "A reply",
            },
          ],
          content: "A comment",
        },
      ],
    };

    // mocking repository
    const mockThreadRepository = (() => {
      return {
        verifyThreadExists: jest.fn(() => Promise.resolve()),
        getDetailThreadById: jest.fn(() =>
          Promise.resolve([
            {
              thread_id: "thread-123",
              title_thread: "dicoding",
              body_thread: "dicoding indonesia",
              date: "2025-05-25T04:03:04.986Z",
              u_thread: "dicoding",
              id_comment: "comment-123",
              u_comment: "dicoding",
              content_comment: "dicoding indonesia",
              is_deleted_comment: false,
              id_reply: "reply-123",
              content_reply: "dicoding indonesia",
              created_at: "2025-05-25T04:03:04.987Z",
              u_reply: "dicoding",
              is_deleted_reply: false,
            },
          ])
        ),
        formatDetailThread: jest.fn(() =>
          Promise.resolve({
            id: "thread-123",
            title: "A thread",
            body: "A body",
            date: "2023-10-01T00:00:00.000Z",
            username: "user-123",
            comments: [
              {
                id: "comment-123",
                username: "user-123",
                date: "2023-10-01T00:00:00.000Z",
                replies: [
                  {
                    id: "reply-123",
                    username: "user-456",
                    date: "2023-10-01T00:00:00.000Z",
                    content: "A reply",
                  },
                ],
                content: "A comment",
              },
            ],
          })
        ),
      };
    })();

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toEqual(expectedThread);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(
      useCasePayload
    );
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(
      useCasePayload
    );
    expect(mockThreadRepository.formatDetailThread).toBeCalledWith(
      expect.any(Array)
    );
  });
});
