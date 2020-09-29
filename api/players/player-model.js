const db = require("../../data/dbConfig");

module.exports = {
    add,
    find,
    findById,
    findBy,
    update,
    remove,
};

function find() {
    return db.select("*").from("players");
}

function findById(id) {
    return db("players").where({ id });
}

function findBy(filter) {
    return db("players").select("username", "password").where(filter);
}

function add(user) {
    return db("players")
        .insert(user, "id")
        .then((ids) => {
            const [id] = ids;
            return findById(id);
        });
}

function update(id, user) {
    return db("players").where("id", Number(id)).update(user);
}

function remove(id) {
    return db("players").where("id", Number(id)).del();
}
