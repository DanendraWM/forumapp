/* eslint-disable no-undef */

const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        };
    
        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
        title: 123,
        body: 'Dicoding Indonesia',
        owner: 'user-123',
        };
    
        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
    it('should create createThread object correctly', () => {
        // Arrange
        const payload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        owner: 'user-123',
        };
    
        // Action
        const createThread = new CreateThread(payload);
    
        // Assert
        expect(createThread.title).toEqual(payload.title);
        expect(createThread.body).toEqual(payload.body);
        expect(createThread.owner).toEqual(payload.owner);
    });
});