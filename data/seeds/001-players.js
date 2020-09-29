exports.seed = function (knex) {
    return knex("players")
        .truncate()
        .then(function () {
            return knex("players").insert([
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
