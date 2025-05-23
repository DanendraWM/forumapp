/* eslint-disable no-undef */
const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forumapp_jwt",
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentToThreadsHandler,
    options: {
      auth: "forumapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentFromThreadsHandler,
    options: {
      auth: "forumapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadByIdHandler,
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyToCommentsHandler,
    options: {
      auth: "forumapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyFromCommentsHandler,
    options: {
      auth: "forumapp_jwt",
    },
  }
];

module.exports = routes;
