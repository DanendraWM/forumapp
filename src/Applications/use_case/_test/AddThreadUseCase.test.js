/* eslint-disable no-undef */

const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "A thread",
      body: "A body",
      owner: "user-123",
    };

    const expectedAddedThread = {
      id: "thread-123",
      title: "A thread",
      owner: "user-123",
    };

    // mocking repository
    const mockThreadRepository = (() => {
      return {
        addThread: jest.fn(() => Promise.resolve(expectedAddedThread)),
      };
    })();

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);
    
    // Assert
    expect(addedThread).toEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload);
  });
});
