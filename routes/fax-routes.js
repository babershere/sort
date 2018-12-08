const db = require("../models");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authCtrl = require("../controller/auth/auth-ctrl");
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var moment = require('moment');

const { config } = require('dotenv');
config();
if (process.env.PHAXIOKEY === undefined || process.env.PHAXIOSECRET === undefined) {
    console.log('No `PHAXIOKEY` or `PHAXIOSECRET` found in file `.env`. Exiting.');
    process.exit();
}

const Phaxio = require('phaxio-official');
const phaxio = new Phaxio("x149vbyucj80jtaot4754bm7pr1hboox4hwm68y0", "oxtmq5sxrfipk6z8pwqc3xqa0iblmqgnketycld6");


router.post("/upload", (req, res) => {

    const currentDate = moment().format('MM-DD-YYYY');

    const faxFile = req.files.faxFile;
    console.log(req.payload);
    const faxLink = '/faxes/' + '/download' + ".pdf";
    const fax = {
        PatientId: req.query.patientId,
        ScriptId: req.query.scriptId,
        link: faxLink,
    }

    const faxNumber = req.query.faxNumber.trim().replace(/\D/g,'');
    console.log(faxNumber);

    fs.mkdir(`./faxes/${req.query.scriptId}_${currentDate}`, (err) => {
        if ((err) && (err.code !== 'EEXIST')) {
            console.error(err)
        } else {
            const faxPath = `./faxes/${req.query.scriptId}_${currentDate}` + '/Fax' + ".pdf";
            console.log(faxPath);
            console.log("dir created");
            faxFile
                .mv(faxPath)
                .then((response) => {
                    console.log("file saved");
                    
                        phaxio.faxes.create({
                            // to: '+15555555555', // Replace this with a number that can receive faxes.
                            to: '+1' + faxNumber,
                            file: `./faxes/${req.query.scriptId}_${currentDate}` + '/Fax' + ".pdf"
                        })
                        .then((fax) => {
                            // The `create` method returns a fax object with methods attached to it for doing things
                            // like cancelling, resending, getting info, etc.

                            // Wait 5 seconds to let the fax send, then get the status of the fax by getting its info from the API.
                            return setTimeout(() => {
                                fax.getInfo()
                            }, 5000)
                        })
                        .then(status => console.log('Fax status response:\n', JSON.stringify(status, null, 2)))
                        .catch((err) => { throw err; });

                    // Get a list of all the faxes you have sent in the past and re-send the most recent one.
                    phaxio.faxes.listFaxes({ direction: 'sent' })
                        .then((faxes) => {
                            const mostRecent = faxes.data.reduce((acc, cv) => {
                                const accCreated = new Date(acc.created_at);
                                const cvCreated = new Date(cv.created_at);
                                const output = accCreated > cvCreated ? acc : cv;
                                return output;
                            }, { created_at: '1970-01-01T00:00:00.000Z' });

                            return phaxio.faxes.resend({ id: mostRecent.id });
                        })
                        .then(response => console.log('Response from resending most recent fax:\n', JSON.stringify(response, null, 2))
                            .catch((err) => { throw err; }))
                    db.Faxes
                        .create(fax)
                        .then((resp) => {
                            res.status(200).json({ message: "Upload successful!" });
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).json({ message: "Internal server error.", error: err });
                        })
                    
                        .catch((err) => {
                            console.error(err);
                            res.status(500).json({ message: "Internal server error.", error: err });
                        })
                })
        }
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
    db.Faxes
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