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
    const physicianLink = '/physicians/'
    const physician = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        specialization: req.query.specialization,
        group: req.query.group,
        rep: req.query.rep,
        DEA: req.query.DEA,
        NPI: req.query.NPI,
        phone: req.query.phone,
        fax: req.query.fax,
        email: req.query.fax,
        contact: req.query.contact,
        addressStreet: req.query.addressStreet,
        addressCity: req.query.addressCity,
        addressState: req.query.addressState,
        addressZipCode: req.query.addressZipCode,
        physicianWarning: req.query.physicianWarning,
        link: physicianLink,
    }

    fs.mkdir("./physicians/", (err) => {
        if ((err) && (err.code !== 'EEXIST')) {
            console.error(err)
        } else {
            const physicianPath = './physicians/'
            // console.log("dir created");
            // console.log("file saved");
            db.Physicians
                .create(physician)
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
        where: {
            id: {
                [Op.not]: 1
              }
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    }

    // searchParams.where.id === 2;

    if (req.query.physicianId) {
        searchParams.where.id = req.query.physicianId
    }

    if (req.query.name) {
        searchParams = {
            where: {
                [Op.or]: [{
                    firstName: {
                        like: '%' + req.query.name + '%'
                    }
                }, {
                    lastName: {
                        like: '%' + req.query.name + '%'
                    }
                }]
            }
        }
    }

  

    if ((req.query.dupFirstName) && (req.query.dupLastName)) {
        searchParams.where.firstName = req.query.dupFirstName,
        searchParams.where.lastName = req.query.dupLastName
    }

    if (req.query.group) {
        searchParams.where.group = req.query.group
    }

    if (req.query.rep) {
        searchParams.where.rep = req.query.rep
    }

    if (req.query.searchGroup) {
        searchParams = {
            where: {
                group: {
                    like: '%' + req.query.searchGroup + '%'
                }
            }
        }
    }

    if (req.query.searchSpec) {
        searchParams.where.specialization = req.query.searchSpec
    }

    if (req.query.address) {
        searchParams = {
            where: {
                [Op.or]: [{
                    addressStreet: {
                        like: '%' + req.query.address + '%'
                    }
                }, {
                    addressCity: {
                        like: '%' + req.query.address + '%'
                    }
                }]
            }
        }
    }

    // if (req.query.address) {
    //     searchParams.where.addressStreet = {
    //         [Op.like]: '%' + req.query.address + '%'
    //     }
    // }

    // if (req.query.address) {
    //     searchParams = {
    //         where: {
    //             [Op.or]: [{
    //                 addressStreet: {
    //                     like: '%' + req.query.address + '%'
    //                 }
    //             }, {
    //                 addressCity: {
    //                     like: '%' + req.query.address + '%'
    //                 }
    //             }, {
    //                 addressState: {
    //                     like: '%' + req.query.address + '%'
    //                 }
    //             }, {
    //                 addressZipCode: {
    //                     like: '%' + req.query.address + '%'
    //                 }
    //             }]
    //         }
    //     }
    // }

    console.log(searchParams);
    db.Physicians
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
    const physician = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        specialization: req.query.specialization,
        group: req.query.group,
        rep: req.query.rep,
        DEA: req.query.DEA,
        NPI: req.query.NPI,
        phone: req.query.phone,
        fax: req.query.fax,
        email: req.query.fax,
        contact: req.query.contact,
        addressStreet: req.query.addressStreet,
        addressCity: req.query.addressCity,
        addressState: req.query.addressState,
        addressZipCode: req.query.addressZipCode,
        physicianWarning: req.query.physicianWarning,
    }

    db.Physicians.update(physician, { where: { id: req.query.id } })
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