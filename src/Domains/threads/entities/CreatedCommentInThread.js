/* eslint-disable no-undef */

class CreatedCommentInThread {
    constructor(payload) {
        this._verifyPayload(payload);
        const { id, content, owner } = payload;

        this.id = id;
        this.content = content;
        this.owner = owner;
    }

    _verifyPayload({ id, content, owner }) {
        if (!id || !owner || !content) {
            throw new Error('CREATE_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
            throw new Error('CREATE_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CreatedCommentInThread;