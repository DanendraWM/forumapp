/* eslint-disable no-undef */

exports.up = (pgm) => {
    pgm.createTable("like_comments", {
      id: {
        type: "VARCHAR(50)",
        primaryKey: true,
      },
      thread_id: {
        type: "VARCHAR(50)",
        notNull: false,
        references: "threads",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      comment_id: {
        type: "VARCHAR(50)",
        notNull: false,
        references: "comments",
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
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable("like_comments");
  };
  