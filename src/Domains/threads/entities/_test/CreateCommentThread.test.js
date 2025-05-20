/* eslint-disable no-undef */
const CreateCommentThread = require('../CreateCommentThread');

describe('a CreateCommentThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'content',
            owner: 'user-123',
        };
    
        // Action and Assert
        expect(() => new CreateCommentThread(payload)).toThrowError('CREATE_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
        threadId: 123,
        content: 'content',
        owner: 'user-123',
        };
    
        // Action and Assert
        expect(() => new CreateCommentThread(payload)).toThrowError('CREATE_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
    it('should create createCommentThread object correctly', () => {
        // Arrange
        const payload = {
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
        };
    
        // Action
        const createCommentThread = new CreateCommentThread(payload);
    
        // Assert
        expect(createCommentThread.content).toEqual(payload.content);
        expect(createCommentThread.threadId).toEqual(payload.threadId);
        expect(createCommentThread.owner).toEqual(payload.owner);
    });
});