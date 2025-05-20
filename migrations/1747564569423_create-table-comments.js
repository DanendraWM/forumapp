/* eslint-disable no-undef */

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "VARCHAR(1000)",
      notNull: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: false,
      references: "threads",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: false,
      references: "users",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
    is_deleted: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
