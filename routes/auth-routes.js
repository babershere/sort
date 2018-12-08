const db = require("../models");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authCtrl = require("../controller/auth/auth-ctrl");
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//user creatiion
router.post("/new", authCtrl.register);
//user login
router.post("/login", authCtrl.login);
//user update
router.put("/update", authCtrl.update);

router.get("/search", (req, res) => {
    let searchParams = {
        where: {},
        attributes: {
            exclude: ['hash', 'salt', "updatedAt"]
        },

    }
    if (req.query.userId) {
        searchParams.where.id = req.query.userId
    }

    if (req.query.physicianId) {
        searchParams.where.PhysicianId = req.query.physicianId
    }

    if (req.query.name) {
        searchParams = {
            where: {
                name: {
                    like: '%' + req.query.name + '%'
                }
            },
        }
    }

    if (req.query.username) {
        searchParams = {
            where: {
                username: {
                    like: '%' + req.query.username + '%'
                }
            },
        }
    }

    if (req.query.email) {
        searchParams = {
            where: {
                email: {
                    like: '%' + req.query.email + '%'
                }
            },
        }
    }

    if (req.query.physIdArray) {
        const ids = req.query.physIdArray.split(',').map((elem) => {
            return '%' + elem + '%'
        });
        if (ids.length > 1) {
            const opLikes = ids.map((elem) => {
                return { [Op.like]: elem }
            })
            searchParams.where.PhysicianId = {
                [Op.or]: opLikes
            }
        } else {
            searchParams.where.PhysicianId = {
                [Op.like]: roles[0]
            }
        }
    }

    if (req.query.role) {
        searchParams.where.role = req.query.role
    }

    

    if (req.query.userRole) {
        if (req.query.userRole.match(/,.*,.*,.*,.*,.*,.*,.*,.*,.*,.*,.*,/)) { // Check if there are 2 commas
            str = str.replace(',', ''); // Remove the first one
        }
        const roles = req.query.userRole.split(',').map((elem) => {
            return '%' + elem + '%'
        });
        if (roles.length > 1) {
            const opLikes = roles.map((elem) => {
                return { [Op.like]: elem }
            })
            searchParams.where.role = {
                [Op.or]: opLikes
            }
        } else {
            searchParams.where.role = {
                [Op.like]: roles[0]
            }
        }
    }

    console.log(req.query);
    db.User
        .findAll(searchParams)
        .then((response) => {
            res.json({
                success: true,
                response: response
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Error (500): Internal Server Error", error: err })
        })
})

module.exports = router;