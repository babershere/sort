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

    const product = {
        name: req.query.name,
        NDC: req.query.NDC,
        quantity: req.query.quantity,
        packageSize: req.query.packageSize,
        cost: req.query.cost,
        schedule: req.query.schedule,
        dosage: req.query.dosage,
        form: req.query.form,
        unitMeasure: req.query.unitMeasure,
        type: req.query.type,
        refrigerated: req.query.refrigerated,
        active: req.query.active
    }

    db.Products
        .create(product)
        .then((resp) => {
            res.status(200).json({ message: "Upload successful!" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal server error.", error: err });
        })
}
);


router.get("/search", (req, res) => {
    let searchParams = {
        where: {},
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
    }

    if (req.query.name) {
        searchParams.where.name = req.query.name
    }

    if (req.query.productId) {
        searchParams.where.id = req.query.productId
    }

    if (req.query.search) {
        searchParams = {
            where: {
                [Op.or]: [{
                    name: {
                        like: '%' + req.query.search + '%'
                    }
                }, {
                    NDC: {
                        like: '%' + req.query.search + '%'
                    }
                }]
            }
        }
    }

    console.log(searchParams);
    db.Products
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

    const product = {
        name: req.query.name,
        NDC: req.query.NDC,
        quantity: req.query.quantity,
        packageSize: req.query.packageSize,
        cost: req.query.cost,
        schedule: req.query.schedule,
        dosage: req.query.dosage,
        form: req.query.form,
        unitMeasure: req.query.unitMeasure,
        type: req.query.type,
        refrigerated: req.query.refrigerated,
        active: req.query.active
    }

    db.Products.update(product, { where: { id: req.query.id } })
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