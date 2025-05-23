/* eslint-disable no-undef */
const CreatedReplyInComment = require("../CreatedReplyInComment");

describe('CreatedReplyInComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'This is a reply',
        };

        // Action and Assert
        expect(() => new CreatedReplyInComment(payload)).toThrowError(
            'CREATED_REPLY_IN_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 'This is a reply',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new CreatedReplyInComment(payload)).toThrowError(
            'CREATED_REPLY_IN_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });
    it('should create CreatedReplyInComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'This is a reply',
            owner: 'user-123',
        };

        // Action
        const createdReplyInComment = new CreatedReplyInComment(payload);

        // Assert
        expect(createdReplyInComment).toBeInstanceOf(CreatedReplyInComment);
        expect(createdReplyInComment.id).toEqual(payload.id);
        expect(createdReplyInComment.content).toEqual(payload.content);
        expect(createdReplyInComment.owner).toEqual(payload.owner);
    });
});