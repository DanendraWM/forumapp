/* eslint-disable no-undef */
const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const GetThreadUseCase = require("../../../../Applications/use_case/GetThreadUseCase");
const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyFromCommentUseCase = require("../../../../Applications/use_case/DeleteReplyFromCommentUseCase");
const LikeCommentUseCase = require("../../../../Applications/use_case/LikeCommentUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentToThreadsHandler = this.postCommentToThreadsHandler.bind(this);
    this.deleteCommentFromThreadsHandler = this.deleteCommentFromThreadsHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    this.postReplyToCommentsHandler = this.postReplyToCommentsHandler.bind(this);
    this.deleteReplyFromCommentsHandler = this.deleteReplyFromCommentsHandler.bind(this);
    this.likeCommentHandler = this.likeCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
      const { title, body } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const useCasePayload = {
        title,
        body,
        owner: credentialId,
      };
      
      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
      const addedThread = await addThreadUseCase.execute(useCasePayload);

      const response = h.response({
        status: "success",
        data: {
          addedThread,
        },
      });
      response.code(201);
      return response;
  }

  async postCommentToThreadsHandler(request, h) {
    const { threadId } = request.params;
    const { content } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const useCasePayload = {
      threadId,
      content,
      owner: credentialId,
    };

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentFromThreadsHandler(request) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const useCasePayload = {
      threadId,
      commentId,
      owner: credentialId,
    };

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(useCasePayload);

    return {
      status: "success",
      message: "komentar berhasil dihapus",
    };
  }

  async getThreadByIdHandler(request) {
    const { threadId } = request.params;

    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(threadId);

    return {
      status: "success",
      data: {
        thread,
      },
    };
  }

  async postReplyToCommentsHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { content } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const useCasePayload = {
      threadId,
      commentId,
      content,
      owner: credentialId,
    };

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyFromCommentsHandler(request) {
    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const useCasePayload = {
      threadId,
      commentId,
      replyId,
      owner: credentialId,
    };

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyFromCommentUseCase.name);
    await deleteReplyUseCase.execute(useCasePayload);

    return {
      status: "success",
      message: "reply berhasil dihapus",
    };
  }

  async likeCommentHandler(request) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const useCasePayload = {
      threadId,
      commentId,
      owner: credentialId,
    };

    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute(useCasePayload);

    return {
      status: "success",
    };
  }
}

module.exports = ThreadsHandler;