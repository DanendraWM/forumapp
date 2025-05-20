/* eslint-disable no-undef */
const CreatedCommentInThread = require('../CreatedCommentInThread');

describe('a CreatedCommentInThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'This is a comment',
            owner: 'user-123',
        };
    
        // Action and Assert
        expect(() => new CreatedCommentInThread(payload)).toThrowError('CREATE_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
        id: 123,
        content: 'This is a comment',
        owner: true,
        };
    
        // Action and Assert
        expect(() => new CreatedCommentInThread(payload)).toThrowError('CREATE_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
    it('should create createdCommentInThread object correctly', () => {
        // Arrange
        const payload = {
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
        };
    
        // Action
        const createdCommentInThread = new CreatedCommentInThread(payload);
    
        // Assert
        expect(createdCommentInThread.id).toEqual(payload.id);
        expect(createdCommentInThread.content).toEqual(payload.content);
        expect(createdCommentInThread.owner).toEqual(payload.owner);
    });
});