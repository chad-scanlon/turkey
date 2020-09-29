exports.up = function (knex) {
    return knex.schema.createTable("users", (tbl) => {
        tbl.increments();
        tbl.text("name").notNullable();
        tbl.text("position");
        tbl.text("rating");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users");
};
