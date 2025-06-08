/* eslint-disable no-undef */
const pool = require("../../database/postgres/pool");
const threadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const commentTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const TableTestHelper = require("../../../../tests/TableTestHelper");
const usersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const authenticationTestHelper = require("../../../../tests/AuthenticationTestHelper");
const replyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await TableTestHelper.cleanTable();
    await usersTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      // Arrange
      await threadTableTestHelper.cleanTable();
      await usersTableTestHelper.cleanTable();
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      
      const accessToken = authenticationTestHelper.generateTestToken({});
      const requestPayload = {
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const requestPayload = {
        title: "Dicoding Indonesia",
      };
      const accessToken = authenticationTestHelper.generateTestToken({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should throw error 404 when thread not found", async () => {
      // Arrange

      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      const requestPayload = {
        content: "Ini adalah komentar",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/unknown-thread-id/comments",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      await threadTableTestHelper.addThread({
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      });
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 201 and persisted comment", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      await threadTableTestHelper.addThread({
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      });
      const requestPayload = {
        content: "Ini adalah komentar",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 404 when thread or comment not found", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/unknown-thread-id/comments/unknown-comment-id",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 200 and delete comment successfully", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      await threadTableTestHelper.addThread({
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      });
      await commentTableTestHelper.addComment({
        threadId: "thread-123",
        content: "Ini adalah komentar",
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 404 when thread not found", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/unknown-thread-id",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 200 and return thread details", async () => {
      // Arrange
      await threadTableTestHelper.cleanTable();
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await threadTableTestHelper.addThread({
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      });
      await commentTableTestHelper.addComment({
        threadId: "thread-123",
        content: "Ini adalah komentar",
      });
      await replyTableTestHelper.addReply({
        threadId: "thread-123",
        commentId: "comment-123",
        content: "Ini adalah balasan",
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/thread-123`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
    });
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 404 when thread or comment not found", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      const requestPayload = {
        content: "Ini adalah balasan",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/unknown-thread-id/comments/unknown-comment-id/replies",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      await threadTableTestHelper.addThread({
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      });
      await commentTableTestHelper.addComment({
        threadId: "thread-123",
        content: "Ini adalah komentar",
      });
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 201 and persisted reply", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      await threadTableTestHelper.addThread({
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      });
      await commentTableTestHelper.addComment({
        threadId: "thread-123",
        content: "Ini adalah komentar",
      });
      const requestPayload = {
        content: "Ini adalah balasan",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 404 when thread, comment, or reply not found", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/unknown-thread-id/comments/unknown-comment-id/replies/unknown-reply-id",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 200 and delete reply successfully", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const accessToken = authenticationTestHelper.generateTestToken({});
      await threadTableTestHelper.addThread({
        title: "Dicoding Indonesia",
        body: "Belajar membuat aplikasi web dengan Node.js",
      });
      await commentTableTestHelper.addComment({
        threadId: "thread-123",
        content: "Ini adalah komentar",
      });
      await replyTableTestHelper.addReply({
        threadId: "thread-123",
        commentId: "comment-123",
        content: "Ini adalah balasan",
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123/replies/reply-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
