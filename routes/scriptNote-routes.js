const db = require("../models");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authCtrl = require("../controller/auth/auth-ctrl");
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.post("/add", (req, res) => {
    const noteLink = '/notes/';
    const note = {
        name: req.query.name,
        note: req.query.note,
        link: noteLink,
        userImage: req.query.userImage,
        ScriptId: req.query.scriptId,
        UserId: req.query.userId
    }

    fs.mkdir("./notes/", (err) => {
        if ((err) && (err.code !== 'EEXIST')) {
            console.error(err)
        } else {
            db.scriptNotes
                .create(note)
                .then((resp) => {
                    res.status(200).json({ message: "Upload successful!" });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({ message: "Internal server error.", error: err });
                })

        }
    })
});


router.get("/search", (req, res) => {
    let searchParams = {
        where: {},
        attributes: {
            exclude: ["updatedAt"]
        },
        // include: [{
        //     model: db.User,
        //     attributes: ["id", "username"]
        // }]
    }

    if (req.query.ScriptId) {
        searchParams.where.ScriptId = req.query.ScriptId
    }

    console.log(searchParams);
    db.scriptNotes
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