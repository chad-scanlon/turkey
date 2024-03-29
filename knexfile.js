const pgConnection = process.env.DATABASE_URL || "";

module.exports = {
    development: {
        client: "sqlite3",
        useNullAsDefault: true,
        connection: {
            filename: "./data/players.db3",
        },
        pool: {
            min: 2,
            max: 10,
        },
        useNullAsDefault: true,

        migrations: {
            directory: "./data/migrations",
        },
        seeds: {
            directory: "./data/seeds",
        },

        pool: {
            afterCreate: (conn, done) => {
                conn.run("PRAGMA foreign_keys = ON", done);
            },
        },
    },
    testing: {
        client: "sqlite3",
        connection: {
            filename: "./data/players.db3",
        },
        useNullAsDefault: true,

        migrations: {
            directory: "./data/migrations",
        },
        seeds: {
            directory: "./data/seeds",
        },
        pool: {
            afterCreate: (conn, done) => {
                conn.run("PRAGMA foreign_keys = ON", done);
            },
        },
    },

    production: {
        client: "sqlite3",
        connection: {
            filename: "./data/players.db3",
        },
        // client: "pg",
        // connection: process.env.DATABASE_URL,
        useNullAsDefault: true,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./data/migrations",
        },
        seeds: {
            directory: "./data/seeds",
        },
    },
};
