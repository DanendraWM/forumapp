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
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(
      useCasePayload
    );
    expect(mockThreadRepository.getDetailThreadById).not.toBeCalled();
    expect(mockThreadRepository.formatDetailThread).not.toBeCalled();
  });

  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const useCasePayload = "thread-123";

    const expectedThread = {
      id: "thread-123",
      title: "A thread",
      body: "A body",
      date: "2025-05-25T04:03:04.986Z",
      username: "user-123",
      comments: [
        {
          id: "comment-123",
          username: "user-123",
          date: "2025-05-25T04:03:04.986Z",
          replies: [
            {
              id: "reply-123",
              username: "user-456",
              date: "2025-05-25T04:03:04.987Z",
              content: "A reply",
            },
          ],
          content: "A comment",
          likeCount: 0,
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
              title_thread: "A thread",
              body_thread: "A body",
              date: "2025-05-25T04:03:04.986Z",
              u_thread: "user-123",
              id_comment: "comment-123",
              u_comment: "user-123",
              content_comment: "A comment",
              is_deleted_comment: false,
              id_reply: "reply-123",
              content_reply: "A reply",
              created_at: "2025-05-25T04:03:04.987Z",
              u_reply: "user-456",
              is_deleted_reply: false,
            },
          ])
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
  });
});


describe('GetThreadUseCase.formatDetailThread', () => {
  it('should correctly format thread with comments and replies', () => {
    // Arrange
    const getThreadUseCase = new GetThreadUseCase({ threadRepository: {} });

    const inputRows = [
      {
        thread_id: 'thread-123',
        title_thread: 'Judul Thread',
        body_thread: 'Isi Thread',
        date: '2025-05-25T04:03:04.986Z',
        u_thread: 'user1',

        id_comment: 'comment-123',
        u_comment: 'user2',
        content_comment: 'Isi komentar',
        is_deleted_comment: false,

        id_reply: 'reply-456',
        content_reply: 'Isi balasan',
        created_at: '2025-05-25T05:00:00.000Z',
        u_reply: 'user3',
        is_deleted_reply: false,
      }
    ];

    const expected = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi Thread',
      date: '2025-05-25T04:03:04.986Z',
      username: 'user1',
      comments: [
        {
          id: 'comment-123',
          username: 'user2',
          date: '2025-05-25T04:03:04.986Z',
          content: 'Isi komentar',
          likeCount: 0,
          replies: [
            {
              id: 'reply-456',
              content: 'Isi balasan',
              date: '2025-05-25T05:00:00.000Z',
              username: 'user3',
            }
          ]
        }
      ]
    };

    // Act
    const result = getThreadUseCase.formatDetailThread(inputRows);

    // Assert
    expect(result).toEqual(expected);
  });

  it('should return null if no rows are given', () => {
    // Arrange
    const getThreadUseCase = new GetThreadUseCase({ threadRepository: {} });

    // Act
    const result = getThreadUseCase.formatDetailThread([]);

    // Assert
    expect(result).toBeNull();
  });

  it('should format deleted comment and reply correctly', () => {
    const getThreadUseCase = new GetThreadUseCase({ threadRepository: {} });

    const inputRows = [
      {
        thread_id: 'thread-1',
        title_thread: 'Judul',
        body_thread: 'Isi',
        date: '2025-01-01T00:00:00Z',
        u_thread: 'userX',

        id_comment: 'comment-1',
        u_comment: 'userY',
        content_comment: 'Komentar terhapus',
        is_deleted_comment: true,

        id_reply: 'reply-1',
        content_reply: 'Balasan terhapus',
        created_at: '2025-01-01T01:00:00Z',
        u_reply: 'userZ',
        is_deleted_reply: true,
      }
    ];

    const result = getThreadUseCase.formatDetailThread(inputRows);

    expect(result.comments[0].content).toBe('**komentar telah dihapus**');
    expect(result.comments[0].replies[0].content).toBe('**balasan telah dihapus**');
  });

  it('should not add the same comment twice if commentId already exists', () => {
    const getThreadUseCase = new GetThreadUseCase({ threadRepository: {} });
  
    const rows = [
      {
        thread_id: 'thread-123',
        title_thread: 'Judul',
        body_thread: 'Isi',
        date: '2025-05-25T04:03:04.986Z',
        u_thread: 'user-1',
  
        id_comment: 'comment-1',
        u_comment: 'user-2',
        content_comment: 'Isi komentar',
        is_deleted_comment: false,
  
        id_reply: 'reply-1',
        content_reply: 'Balasan pertama',
        created_at: '2025-05-25T05:00:00.000Z',
        u_reply: 'user-3',
        is_deleted_reply: false,
      },
      {
        thread_id: 'thread-123',
        title_thread: 'Judul',
        body_thread: 'Isi',
        date: '2025-05-25T04:03:04.986Z',
        u_thread: 'user-1',
  
        id_comment: 'comment-1',
        u_comment: 'user-2',
        content_comment: 'Isi komentar',
        is_deleted_comment: false,

        id_reply: 'reply-2',
        content_reply: 'Balasan kedua',
        created_at: '2025-05-25T05:10:00.000Z',
        u_reply: 'user-4',
        is_deleted_reply: false,
      }
    ];
  
    const result = getThreadUseCase.formatDetailThread(rows);
  
    expect(result.comments.length).toBe(1); // Hanya satu komentar
    expect(result.comments[0].replies.length).toBe(2); // Tapi dua balasan
  });
  
  it('should format replies correctly when reply exists in row', () => {
    // Arrange
    const rows = [
      {
        thread_id: 'thread-1',
        title_thread: 'Judul Thread',
        body_thread: 'Isi thread',
        date: '2025-05-25T04:03:04.986Z',
        u_thread: 'user-1',
        id_comment: 'comment-1',
        u_comment: 'user-2',
        content_comment: 'Komentar',
        is_deleted_comment: false,
        id_reply: 'reply-1',
        content_reply: 'Balasan',
        created_at: '2025-05-25T04:05:00.000Z',
        u_reply: 'user-3',
        is_deleted_reply: false,
      }
    ];

    const useCase = new GetThreadUseCase({ threadRepository: {} });

    // Act
    const result = useCase.formatDetailThread(rows);

    // Assert
    expect(result).toEqual({
      id: 'thread-1',
      title: 'Judul Thread',
      body: 'Isi thread',
      date: '2025-05-25T04:03:04.986Z',
      username: 'user-1',
      comments: [
        {
          id: 'comment-1',
          username: 'user-2',
          date: '2025-05-25T04:03:04.986Z',
          content: 'Komentar',
          likeCount: 0,
          replies: [
            {
              id: 'reply-1',
              content: 'Balasan',
              date: '2025-05-25T04:05:00.000Z',
              username: 'user-3'
            }
          ]
        }
      ]
    });
  });

  it('should show deleted comment message when is_deleted_comment is true', () => {
    // Arrange
    const rows = [
      {
        thread_id: 'thread-1',
        title_thread: 'Judul Thread',
        body_thread: 'Isi thread',
        date: '2025-05-25T04:03:04.986Z',
        u_thread: 'user-1',
        id_comment: 'comment-1',
        u_comment: 'user-2',
        content_comment: 'Komentar rahasia',
        is_deleted_comment: true,
        id_reply: null,
        content_reply: null,
        created_at: null,
        u_reply: null,
        is_deleted_reply: null,
      }
    ];

    const useCase = new GetThreadUseCase({ threadRepository: {} });

    // Act
    const result = useCase.formatDetailThread(rows);

    // Assert
    expect(result).toEqual({
      id: 'thread-1',
      title: 'Judul Thread',
      body: 'Isi thread',
      date: '2025-05-25T04:03:04.986Z',
      username: 'user-1',
      comments: [
        {
          id: 'comment-1',
          username: 'user-2',
          date: '2025-05-25T04:03:04.986Z',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: []
        }
      ]
    });
  });

  it('should show deleted reply message when is_deleted_reply is true', () => {
    const rows = [
      {
        thread_id: 'thread-1',
        title_thread: 'Judul Thread',
        body_thread: 'Isi thread',
        date: '2025-05-25T04:03:04.986Z',
        u_thread: 'user-1',
        id_comment: 'comment-1',
        u_comment: 'user-2',
        content_comment: 'Komentar',
        is_deleted_comment: false,
        id_reply: 'reply-1',
        content_reply: 'Balasan',
        created_at: '2025-05-25T04:05:00.000Z',
        u_reply: 'user-3',
        is_deleted_reply: true,
      }
    ];
  
    const useCase = new GetThreadUseCase({ threadRepository: {} });
  
    const result = useCase.formatDetailThread(rows);
  
    expect(result.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
  });
  
});

