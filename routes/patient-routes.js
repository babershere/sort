const db = require("../models");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authCtrl = require("../controller/auth/auth-ctrl.js");
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.post("/add", (req, res) => {
    const patientLink = '/patients/' + req.payload.id + '/' + req.query.firstName.trim() + ".pdf";
    const patient = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        dob: req.query.dob,
        sex: req.query.sex,
        email: req.query.email,
        patientWarning: req.query.patientWarning,
        conditions: req.query.conditions,
        allergies: req.query.allergies,
        primInsPlan: req.query.primInsPlan,
        primInsBIN: req.query.primInsBIN,
        primInsPCN: req.query.primInsPCN,
        primInsID: req.query.primInsID,
        primInsGroup: req.query.primInsGroup,
        primInsType: req.query.primInsType,
        secInsPlan: req.query.secInsPlan,
        secInsBIN: req.query.secInsBIN,
        secInsPCN: req.query.secInsPCN,
        secInsID: req.query.secInsID,
        secInsGroup: req.query.secInsGroup,
        secInsType: req.query.secInsType,
        addressStreet: req.query.addressStreet,
        addressCity: req.query.addressCity,
        addressState: req.query.addressState,
        addressZipCode: req.query.addressZipCode,
        address2Street: req.query.address2Street,
        address2City: req.query.address2City,
        address2State: req.query.address2State,
        address2ZipCode: req.query.address2ZipCode,
        address3Street: req.query.address3Street,
        address3City: req.query.address3City,
        address3State: req.query.address3State,
        address3ZipCode: req.query.address3ZipCode,
        phone: req.query.phone,
        phone2: req.query.phone2,
        phone3: req.query.phone3,
        link: patientLink,
        UserId: req.payload.id
    }

    fs.mkdir("./patients/", (err) => {
        if ((err) && (err.code !== 'EEXIST')) {
            console.error(err)
        } else {
            const patientPath = './patients/' + req.payload.id + '/' + req.query.firstName.trim() + ".pdf";
            // console.log("dir created");
            // console.log("file saved");
            db.Patients
                .create(patient)
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
            exclude: ["updatedAt", "UserId"]
        }
    }
    if (req.query.patientId) {
        searchParams.where.id = req.query.patientId
    }

//     if (req.query.name) {
//         searchParams.where.firstName = { 
//             [Op.or]: [{
//                 firstName: {
//                     like: '%' + req.query.name + '%'
//                 }
//         }, {
//             lastName: {
//                 like: '%' + req.query.name + '%'
//             }
//         }]
//     }
// }

if (req.query.name) {
    searchParams = {
        where: {
            [Op.or]:  [{
                firstName: {
                    like: '%'+ req.query.name + '%'
                }
            }, {
                lastName: {
                    like: '%' + req.query.name + '%'
                }
            }]
        }
    }
}

if (req.query.dob) {
    searchParams.where.dob = req.query.dob
}

// if (req.query.address) {
//        searchParams.where = {
//         firstName: { like: '%' + req.query.name + '%' },
// }

    console.log(searchParams);
    db.Patients
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

router.put("/update", function (req, res) {
    console.log("update")
    const patient = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        dob: req.query.dob,
        sex: req.query.sex,
        email: req.query.email,
        patientWarning: req.query.patientWarning,
        conditions: req.query.conditions,
        allergies: req.query.allergies,
        addressStreet: req.query.addressStreet,
        addressCity: req.query.addressCity,
        addressState: req.query.addressState,
        addressZipCode: req.query.addressZipCode,
        primInsPlan: req.query.primInsPlan,
        primInsBIN: req.query.primInsBIN,
        primInsPCN: req.query.primInsPCN,
        primInsID: req.query.primInsID,
        primInsGroup: req.query.primInsGroup,
        primInsType: req.query.primInsType,
        secInsPlan: req.query.secInsPlan,
        secInsBIN: req.query.secInsBIN,
        secInsPCN: req.query.secInsPCN,
        secInsID: req.query.secInsID,
        secInsGroup: req.query.secInsGroup,
        secInsType: req.query.secInsType,
        addressStreet: req.query.addressStreet,
        addressCity: req.query.addressCity,
        addressState: req.query.addressState,
        addressZipCode: req.query.addressZipCode,
        addressStreet2: req.query.addressStreet,
        addressCity2: req.query.addressCity,
        addressState2: req.query.addressState,
        addressZipCode2: req.query.addressZipCode,
        addressStreet3: req.query.addressStreet,
        addressCity3: req.query.addressCity,
        addressState3: req.query.addressState,
        addressZipCode3: req.query.addressZipCode,
        phone: req.query.phone,
        phone2: req.query.phone2,
        phone3: req.query.phone3,
    }

    db.Patients.update(patient, { where: { id: req.query.id } })
        .then(function (resp) {
            res.json({ success: true });
        })
        .catch(function (err) {
            console.error(err);
            return res.status(500).end('Update FAILED' + err.toString());
            throw err;
        });
})


module.exports = router;