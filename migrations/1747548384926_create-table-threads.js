/* eslint-disable no-undef */

exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    body: {
        type: "VARCHAR(1000)",
        notNull: true,
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
  pgm.dropTable("threads");
};
