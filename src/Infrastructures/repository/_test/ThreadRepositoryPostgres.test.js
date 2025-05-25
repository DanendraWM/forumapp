/* eslint-disable no-undef */

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const TableTestHelper = require('../../../../tests/TableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/ReplyTableTestHelper');


describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await pool.end();
    });
    
    describe('addThread function', () => {
        it('should persist create thread and return created thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({ username: 'user-123' });
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            // Action
            const createdThread = await threadRepositoryPostgres.addThread(createThread);
            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
            expect(threads).toHaveLength(1);
            expect(threads[0].id).toEqual('thread-123');
            expect(threads[0].title).toEqual('dicoding');
            expect(threads[0].owner).toEqual('user-123');

            expect(createdThread).toEqual({
                id: 'thread-123',
                title: 'dicoding',
                owner: 'user-123',
            });
        });
    });

    describe('addCommentToThread function', () => {
        it('should persist create comment and return created comment correctly', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            // Action
            const createdComment = await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
            const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
            expect(comments).toHaveLength(1);
            expect(threads).toHaveLength(1);

            expect(createdComment).toEqual({
                id: 'comment-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            });
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({ username: 'user-123' });
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyCommentOwner('comment-999', 'user-123')).rejects.toThrowError(NotFoundError);
        });

        it('should throw AuthorizationError when comment owner is not the same as the one in the database', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-999')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw NotFoundError when comment is found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('deleteComment function', () => {
        it('should not throw NotFoundError when comment is found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            // Action  
            await threadRepositoryPostgres.deleteComment('comment-123');
            // Assert
            const comments = await CommentsTableTestHelper.findCommentDeletedById('comment-123');
            expect(comments).toHaveLength(1);
        });
    });

    describe('verifyThreadExists function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadExists('thread-999')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when thread is found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });





    describe('formatDetailThread function', () => {
        it('should format thread detail correctly', async () => {
            // Arrange
            const threadDetail = [{
                thread_id: "thread-123",
                title_thread: "dicoding",
                body_thread: "dicoding indonesia",
                date: "2025-05-25T04:03:04.986Z",
                u_thread: "dicoding",
                id_comment: "comment-123",
                u_comment: "dicoding",
                content_comment: "dicoding indonesia",
                is_deleted_comment: false,
                id_reply: "reply-123",
                content_reply: "dicoding indonesia",
                created_at: "2025-05-25T04:03:04.987Z",
                u_reply: "dicoding",
                is_deleted_reply: false,
              }];
            const expectedFormattedThread = {
                id: 'thread-123',
                title: 'dicoding',
                body: 'dicoding indonesia',
                date: expect.any(String),
                username: 'dicoding',
                comments: [
                    {
                        id: 'comment-123',
                        content: 'dicoding indonesia',
                        date: expect.any(String),
                        username: 'dicoding',
                        replies: [
                            {
                                id: 'reply-123',
                                content: 'dicoding indonesia',
                                date: expect.any(String),
                                username: 'dicoding',
                            },
                        ],
                    },
                ],
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            // Action
            const formattedThread = await threadRepositoryPostgres.formatDetailThread(threadDetail);
            // Assert
            expect(formattedThread).toEqual(expectedFormattedThread);
        });
    });

    describe('getThreadDetailById function', () => {

        it('should return thread detail correctly', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread({
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            });
            await threadRepositoryPostgres.addReplyToComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            });
            // Action
            const threadDetail = await threadRepositoryPostgres.getDetailThreadById('thread-123');
            // Assert
            expect(threadDetail).toEqual([{
                thread_id: "thread-123",
                title_thread: "dicoding",
                body_thread: "dicoding indonesia",
                date: expect.any(String),
                u_thread: "dicoding",
                id_comment: "comment-123",
                u_comment: "dicoding",
                content_comment: "dicoding indonesia",
                is_deleted_comment: false,
                id_reply: "reply-123",
                content_reply: "dicoding indonesia",
                created_at: expect.any(String),
                u_reply: "dicoding",
                is_deleted_reply: false,
              }]);
        });
    });

    describe('verifyCommentExists function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyCommentExists('comment-999')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when comment is found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('verifyReplyAccess function', () => {
        it('should throw NotFoundError when reply not found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyReplyAccess('reply-999')).rejects.toThrowError(NotFoundError);
        });

        it('should throw AuthorizationError when reply owner is not the same as the one in the database', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            await threadRepositoryPostgres.addReplyToComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            });
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyReplyAccess('reply-123', 'user-999')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw NotFoundError when reply is found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            await threadRepositoryPostgres.addReplyToComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            });
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyReplyAccess('reply-123','user-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('deleteReplyFromComment function', () => {
        it('should not throw NotFoundError when reply is found', async () => {
            // Arrange
            await TableTestHelper.cleanTable();
            await UsersTableTestHelper.addUser({});
            const createThread = {
                title: 'dicoding',
                body : 'dicoding indonesia',
                owner: 'user-123',
            };
            const createCommentThread = {
                threadId: 'thread-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            };
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepositoryPostgres.addThread(createThread);
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            await threadRepositoryPostgres.addReplyToComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'dicoding indonesia',
                owner: 'user-123',
            });
            // Action  
            await threadRepositoryPostgres.deleteReplyFromComment('reply-123');
            // Assert
            const replies = await RepliesTableTestHelper.findReplyDeletedById('reply-123');
            expect(replies).toHaveLength(1);
        });
    });
});