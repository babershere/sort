const models = require("../../models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const ctrl = {};
const fs = require('fs')
const path = require('path');

function getHash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}
function getSalt() {
    return crypto.randomBytes(16).toString("hex");
}
function generateJWT(user) {
    let expire = new Date();
    expire.setDate(expire.getDate() + 7);
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        exp: expire.getTime() / 1000
    }, process.env.JWT_SECRET);
}
ctrl.login = function (req, res) {
    let user = req.body.user;
    let password = req.body.password;
    console.log(user);
    models.User.findOne({
        where: {
            [Op.or]: [{
                email: user
            }, {
                username: user
            }]
        }
    })
        .then(function (resp) {
            if (resp) {
                //login
                var inputHash = getHash(password, resp.salt);
                console.log(inputHash.toString(), resp.hash);
                if (inputHash === resp.hash) {
                    res.json({ token: generateJWT(resp) });
                }
                else {
                    return res.status(400).end('Wrong Password');
                }
            }
            else {
                //err
                return res.status(404).end('User not found');
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong', error: err })
        })
};
ctrl.register = function (req, res) {

    const title = "";
    var user = {
        username: req.query.username.trim(),
        name: req.query.name,
        email: req.query.email.trim().toLowerCase(),
        role: req.query.role,
        link: title,
        active: req.query.active,
        PhysicianId: req.query.physicianId
    }
    var salt = getSalt();
    var hash = getHash(req.query.password, salt);
    user.salt = salt;
    user.hash = hash;
    models.User.create(user)
        .then(function (resp) {
            res.json({ success: true, token: generateJWT(resp) });
            if (req.files.picFile) {
                const imageFile = req.files.picFile;
                const title = req.files.picFile.name;

                fs.mkdir("./client/public/images/" + resp.dataValues.id, (err) => {
                    if ((err) && (err.code !== 'EEXIST')) {
                        console.error(err)
                    } else {
                        const imagePath = './client/public/images/' + resp.dataValues.id + '/' + title.trim();
                        console.log("dir created");
                        imageFile
                            .mv(imagePath)
                            .then((response) => {
                                console.log("file saved");
                                // fs.copyFile("./client/public/assets/images/users/mstile=150x150.png", "./client/public/assets/images/users/" + resp.dataValues.id + "/user.png", (err) => {
                                //     if (err) {
                                //         console.error(err)
                                //     } else {
                                //         // res.json({success: true, token: generateJWT(resp)});
                                //         return;
                                //     }
                                // })
                            })
                    }
                })
                return;
            }
        })
        // .then(function(resp) {
        //     console.log(resp);
        //     fs.mkdir("./public/assets/images/users/" + resp.dataValues.id, (err) => {
        //         if ((err) && (err.code !== 'EEXIST')) {
        //             console.error(err)
        //             window.location = '/team';
        //         } else {
        //             fs.copyFile("./public/assets/images/defaultUser.png", "./public/assets/images/users/" + resp.dataValues.id + "/user.png", (err) => {
        //                 if (err) {
        //                     console.error(err)
        //                     window.location = '/team';
        //                 } else {
        //                     res.json({success: true, token: generateJWT(resp)});
        //                     window.location = '/team';
        //                 }
        //             })
        //         }
        //     })
        // })
        .catch(function (err) {
            console.error(err);
            return res.status(500).end('Registration FAILED' + err.toString());
            window.location = '/team';
            throw err;
        });
};

ctrl.update = function (req, res) {

    let user = {}
    if (req.query.username) {
        user.username = req.query.username.trim();
    }
    if (req.query.name) {
        user.name = req.query.name
    }
    if (req.query.email) {
        user.email = req.query.email.trim().toLowerCase()
    }

    if (req.query.password) {

        models.User.findOne({
            where: {
                [Op.or]: [{
                    email: req.query.username
                }, {
                    username: req.query.username
                }]
            }
        })
            .then(function (resp) {
                if (resp) {
                    //login
                    var inputHash = getHash(req.query.oldPassword, resp.salt);
                    console.log(inputHash.toString(), resp.hash);
                    if (inputHash === resp.hash) {
                        user.salt = getSalt();
                        user.hash = getHash(req.query.password, user.salt);
                    }
                    else {
                        return res.status(400).end('Wrong Password');
                    }
                }
                else {
                    //err
                    return res.status(404).end('User not found');
                }
            })

        user.salt = getSalt();
        user.hash = getHash(req.query.password, user.salt);
    }
    if (req.query.active) {
        user.active = req.query.active;
    }
    if (req.query.physicianId) {
        user.PhysicianId = req.query.physicianId
    }
    if (req.query.title) { user.title = req.query.title }
    if (req.query.phone) { user.phone = req.query.phone }
    if (req.query.fax) { user.fax = req.query.fax }

    user.notifyReceived = req.query.notifyReceived
    user.notifyProcess = req.query.notifyProcess

    user.notifyPriorAuth = req.query.notifyPriorAuth

    user.notifyCopayAssistance = req.query.notifyCopayAssistance

    user.notifyShipped = req.query.notifyShipped

    if (req.query.image === "true") {
        const imageFile = req.files.picFile;
        const title = req.files.picFile.name;
        user.link = title;
        console.log({ user })
        fs.mkdir("./client/public/images/" + req.query.id, (err) => {
            if ((err) && (err.code !== 'EEXIST')) {
                console.error(err)
            } else {
                const directory = "./client/public/images/" + req.query.id;

                fs.readdir(directory, (err, files) => {
                    if (err) throw err;

                    for (const file of files) {
                        fs.unlink(path.join(directory, file), err => {
                            if (err) throw err;
                            console.log(`Deleted ${file}`);
                        });
                    }
                });
                const imagePath = './client/public/images/' + req.query.id + '/' + title.trim();
                console.log("dir created");
                imageFile
                    .mv(imagePath)
                    .then((response) => {
                        console.log("file saved");
                        // fs.copyFile("./client/public/assets/images/users/mstile=150x150.png", "./client/public/assets/images/users/" + resp.dataValues.id + "/user.png", (err) => {
                        //     if (err) {
                        //         console.error(err)
                        //     } else {
                        //         // res.json({success: true, token: generateJWT(resp)});
                        //         return;
                        //     }
                        // })
                    })
            }
        })
    } else if (req.query.image === "false") {

    }

    models.User.update(user, { where: { id: req.query.id } })
        .then(function (resp) {
            console.log(user)
            res.json({ success: true });


            // if ((req.files) && (req.files.picFile)) {
            //     req.files.picFile.mv("./public/assets/images/users/" + req.payload.id + "/user.png")
            // }
        })
        .catch(function (err) {
            console.error(err);
            return res.status(500).end('Update FAILED' + err.toString());
            throw err;
        });
};





module.exports = ctrl;
