exports.up = function (knex) {
    return knex.schema.createTable("players", (tbl) => {
        tbl.increments();
        tbl.text("name").notNullable();
        tbl.text("position");
        tbl.text("rating");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("players");
};
