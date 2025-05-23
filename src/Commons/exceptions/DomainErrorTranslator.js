/* eslint-disable no-undef */
const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
  ),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai"
  ),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
    "tidak dapat membuat user baru karena karakter username melebihi batas limit"
  ),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
    "tidak dapat membuat user baru karena username mengandung karakter terlarang"
  ),
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan username dan password"
  ),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "username dan password harus string"
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError(
    "harus mengirimkan token refresh"
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "refresh token harus string"
  ),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError(
    "harus mengirimkan token refresh"
  ),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "refresh token harus string"
  ),
  "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan id , title, dan owner"
  ),
  "CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "id, title dan owner harus string"
  ),
  "CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan title, body dan owner"
  ),
  "CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "body, title dan owner harus string"
  ),
  "CREATE_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "harus mengirimkan content"
  ),
  "CREATE_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "content harus string"
  ),
  "CREATE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan content"
  ),
  "CREATE_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "content harus string"
  ),
  "CREATED_REPLY_IN_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan content, id, dan owner"
  ),
  "CCREATED_REPLY_IN_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "content, owner harus string"
  ),
}

module.exports = DomainErrorTranslator;
