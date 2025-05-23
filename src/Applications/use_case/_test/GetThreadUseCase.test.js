/* eslint-disable no-undef */
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
    it("should orchestrating the get thread action correctly", async () => {
        // Arrange
        const useCasePayload = "thread-123";

        const expectedThread = {
            id: "thread-123",
            title: 'A thread',
            body: 'A body',
            date: '2023-10-01T00:00:00.000Z',
            username: 'user-123',
            comments: [
                {
                    id: 'comment-123',
                    username: 'user-123',
                    date: '2023-10-01T00:00:00.000Z',
                    content: 'A comment',
                },
            ],
        };

        // mocking repository
        const mockThreadRepository = (() => {
            return {
                getDetailThreadById: jest.fn(() => Promise.resolve(expectedThread)),
            };
        })();

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const thread = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(thread).toEqual(expectedThread);
        expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCasePayload);
    });
});