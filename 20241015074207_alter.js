/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("todos", function (table) {
    table.integer("user_id").unsigned(); // Add user_id column (integer and unsigned)
    table
      .foreign("user_id") // Make it a foreign key
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Optional: Handle deletion behavior
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
