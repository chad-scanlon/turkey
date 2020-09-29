const router = require("express").Router();

const players = require("./player-model.js");
const restricted = require("../../auth/restricted-middleware.js");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../../data/secrets.js");
const { isValid } = require("../../auth/auth-user.js");

// adding/editing/validating players
router.get("/", (req, res) => {
    players
        .find()
        .then((players) => {
            res.status(200).json(players);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    players
        .findById(id)
        .then((player) => {
            if (player) {
                res.json(player);
            } else {
                res.status(404).json({ message: "No player by that id" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error getting that player" });
        });
});
router.post("/add-player", (req, res) => {
    const playerData = req.body;
    players
        .add(playerData)
        .then((addedPlayer) => {
            res.status(201).json(addedPlayer);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: error.message });
        });
});
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    players
        .findById(id)
        .then((player) => {
            if (player) {
                players.update(changes, id).then((updatedPlayer) => {
                    res.json(updatedPlayer);
                });
            } else {
                res.status(404).json({ message: "No player by that id" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error updating the player" });
        });
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    players
        .remove(id)
        .then((deleted) => {
            if (deleted) {
                res.json({ removed: deleted });
            } else {
                res.status(404).json({ message: "Could not find that player" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error deleting the player" });
        });
});

router.post("/register", (req, res) => {
    const credentials = req.body;
    if (isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcryptjs.hashSync(credentials.password, rounds);
        credentials.password = hash;
        players
            .add(credentials)
            .then((user) => {
                res.status(201).json(user);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ message: error.message });
            });
    } else {
        console.log(error);
        res.status(400).json({
            message: "please provide username and password",
        });
    }
});
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (isValid(req.body)) {
        players
            .findBy({ username: username })
            .then(([user]) => {
                if (user && bcryptjs.compareSync(password, user.password)) {
                    const token = generateToken(user);
                    res.status(200).json({
                        message: `Welcome to Thunderdome, ${user.username}`,
                        id: `${user.id}`,
                        username: `${user.username}`,
                        name: `${user.name}`,
                        about: `${user.about}`,
                        token,
                    });
                } else {
                    res.status(401).json({ message: "Invalid credentials" });
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ message: error.message });
            });
    } else {
        res.status(400).json({
            message: "please provide username and password",
        });
    }
});
// getting/adding classes to user profile

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };
    const secret = secrets.jwtSecret;

    const options = {
        expiresIn: "1h",
    };

    return jwt.sign(payload, secret, options);
}
module.exports = router;
