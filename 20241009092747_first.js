/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("todos", function (table) {
    table.increments("id").primary(); // SERIAL  KEY
    table.varchar("title", 255).notNullable(); // INT NOT NULL
    table.text("description");
    table.VARCHAR("status", 50).notNullable(); // TEXT NOT NULL
    table.date("due_date");

    table.timestamp(true, true); // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
