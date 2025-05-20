/* eslint-disable no-undef */

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const TableTestHelper = require('../../../../tests/TableTestHelper');


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
            await threadRepositoryPostgres.addThread(createThread);
            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
            expect(threads).toHaveLength(1);
            expect(threads[0].id).toEqual('thread-123');
            expect(threads[0].title).toEqual('dicoding');
            expect(threads[0].owner).toEqual('user-123');
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
            await threadRepositoryPostgres.addCommentToThread(createCommentThread);
            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
            const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
            expect(comments).toHaveLength(1);
            expect(threads).toHaveLength(1);
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

    describe('getThreadDetailById function', () => {
        it('should throw NotFoundError when thread is not found', async () => {
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
            await expect(threadRepositoryPostgres.getDetailThreadById('thread-999')).rejects.toThrowError(NotFoundError);
        });

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
            // Action
            const threadDetail = await threadRepositoryPostgres.getDetailThreadById('thread-123');
            // Assert
            expect(threadDetail).toEqual({
                id: 'thread-123',
                title: 'dicoding',
                body: 'dicoding indonesia',
                date: expect.any(String),
                username: 'dicoding',
                comments: [
                  {
                    id: 'comment-123',
                    username: 'dicoding',
                    date: expect.any(String),
                    content: 'dicoding indonesia',
                  },
                ],
              });
        });
    });
});