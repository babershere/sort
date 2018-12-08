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
    const pastInsurance = {
        plan: req.query.plan,
        BIN: req.query.BIN,
        PCN: req.query.PCN,
        insID: req.query.insID,
        group: req.query.group,
        type: req.query.type,
        PatientId: req.query.patientId
    }

    db.pastInsurance
        .create(pastInsurance)
        .then((resp) => {
            res.status(200).json({ message: "Upload successful!" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal server error.", error: err });
        })

})



router.get("/search", (req, res) => {
    let searchParams = {
        where: {},
        attributes: {
            exclude: ["updatedAt"]
        }
    }
    if (req.query.patientId) {
        searchParams.where.PatientId = req.query.patientId
    }

    console.log(searchParams);
    db.pastInsurance
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