/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary(); // Auto-incrementing primary key
    table.string("name", 255).notNullable(); // Name column (string, not null)
    table.string("email", 255).notNullable().unique(); // Email column (unique, not null)
    table.string("password").notNullable();

    table.timestamps(true, true); // Adds created_at and updated_at columns
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
