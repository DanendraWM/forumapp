/* eslint-disable no-undef */
const CreateReplyComment = require("../CreateReplyComment");

describe('CreateReplyComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'This is a reply comment',
            threadId: 'thread-123',
            parentId: 'comment-123',
            owner: 'user-123',
        };
        // Action and Assert
        expect(() => new CreateReplyComment(payload)).toThrowError('CREATE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 123,
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        // Action and Assert
        expect(() => new CreateReplyComment(payload)).toThrowError('CREATE_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create CreateReplyComment object correctly', () => {
        const payload = {
            content: 'This is a reply comment',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        // Action
        const createReplyComment = new CreateReplyComment(payload);

        // Assert
        expect(createReplyComment.content).toEqual(payload.content);
        expect(createReplyComment.threadId).toEqual(payload.threadId);
        expect(createReplyComment.commentId).toEqual(payload.commentId);
        expect(createReplyComment.owner).toEqual(payload.owner);
    });
});