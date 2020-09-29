const router = require("express").Router();

const users = require("../users/user-model.js");
const restricted = require("../../auth/restricted-middleware.js");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../../data/secrets.js");
const { isValid } = require("../../auth/auth-user.js");

// adding/editing/validating users
router.get("/", (req, res) => {
    users
        .find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    users
        .findById(id)
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "No user by that id" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error getting that user" });
        });
});
router.post("/add-user", (req, res) => {
    const userData = req.body;
    users
        .add(userData)
        .then((addedUser) => {
            res.status(201).json(addedUser);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: error.message });
        });
});
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    users
        .findById(id)
        .then((user) => {
            if (user) {
                users.update(changes, id).then((updatedUser) => {
                    res.json(updatedUser);
                });
            } else {
                res.status(404).json({ message: "No user by that id" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error updating the user" });
        });
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    users
        .remove(id)
        .then((deleted) => {
            if (deleted) {
                res.json({ removed: deleted });
            } else {
                res.status(404).json({ message: "Could not find that user" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error deleting the user" });
        });
});

router.post("/register", (req, res) => {
    const credentials = req.body;
    if (isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcryptjs.hashSync(credentials.password, rounds);
        credentials.password = hash;
        users
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
        users
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
