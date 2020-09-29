exports.seed = function (knex) {
    return knex("users")
        .truncate()
        .then(function () {
            return knex("users").insert([
                {
                    id: 1,
                    name: "QB Bills",
                    position: "QB",
                    rating: "92",
                },
                {
                    id: 2,
                    name: "QB Eagles",
                    position: "QB",
                    rating: "92",
                },
            ]);
        });
};
