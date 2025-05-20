/* eslint-disable no-undef */

class CreateCommentThread {
    constructor(payload) {
        this._verifyPayload(payload);
        const { threadId, content, owner } = payload;
    
        this.content = content;
        this.threadId = threadId;
        this.owner = owner;
    }
    
    _verifyPayload({ threadId, content, owner }) {
        if (!content || !threadId || !owner) {
        throw new Error('CREATE_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }
    
        if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
        throw new Error('CREATE_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
};

module.exports = CreateCommentThread;