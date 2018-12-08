const db = require("../models");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authCtrl = require("../controller/auth/auth-ctrl.js");
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.put("/add", (req, res) => {
    const currentPatientLink = '/current/';
    const currentPatient = {
        patientId: req.query.patientId,
        link: currentPatientLink,
    }

    fs.mkdir("./currentPatient/", (err) => {
        if ((err) && (err.code !== 'EEXIST')) {
            console.error(err)
        } else {
            const currentPatientPath = './currentPatient/'
            // console.log("dir created");
                    // console.log("file saved");
                    db.currentPatient.update(currentPatient, {where: {id: 1}})
                    .then(function(resp) {
                        res.json({success: true});
                    })
                    .catch(function(err) {
                        console.error(err);
                        return res.status(500).end('Update FAILED' + err.toString());
                        throw err;
                        
                    });
        }
    })
})



router.get("/search", (req, res) => {
    let searchParams = {
        where: {},
        attributes: {
            exclude: ["createdAt", "UserId"]
        }
    }
  
    db.currentPatient
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