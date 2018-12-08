const db = require("../models");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authCtrl = require("../controller/auth/auth-ctrl.js");
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const open = require("open");
const aws = require('aws-sdk');



router.post("/upload", (req, res) => {
    const attachmentFile = req.files.attachmentFile;
    const title = req.files.attachmentFile.name;
    // const attachmentLink = '/attachments/' + req.query.userId + '/' + title.trim() + ".pdf";
    const attachment = {
        title,
        attachedBy: req.query.attachedBy,
        type: req.query.type,
        link: `https://s3-us-west-1.amazonaws.com/sortpak/scripts/attachments/${req.query.scriptId}/${title}`,
        ScriptId: req.query.scriptId,
        UserId: req.query.userId
    }

    fs.mkdir("./attachments/attachments/" + req.query.userId.toString(), (err) => {
        if ((err) && (err.code !== 'EEXIST')) {
            console.error(err)
        } else {
            const attachmentPath = './attachments/attachments/' + req.query.userId + '/' + title.trim() + ".pdf";
            console.log("dir created");
            attachmentFile
                .mv(attachmentPath)
                .then((response) => {
                    console.log("file saved");
                    db.scriptAttachments
                        .create(attachment)
                        .then((resp) => {
                            res.status(200).json({ message: "Upload successful!" });
                            // open('/attachment/' + , function (err) {
                            //     if (err) throw err;
                            // });
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
});

router.get("/search", (req, res) => {
    let searchParams = {
        where: {},
        attributes: {
            exclude: ["updatedAt"]
        },
        // include: [{
        //     model: db.User,
        //     where: {},
        // }],
    }

    if (req.query.attachmentId) {
        searchParams.where.id = req.query.attachmentId
    }
    if (req.query.title) {
        searchParams.where.title = {
            [Op.like]: '%' + req.query.title + '%'
        }
    }

    if (req.query.ScriptId) {
        searchParams.where.ScriptId = req.query.ScriptId
    }

    console.log(searchParams)
    db.scriptAttachments
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


const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-west-1';

router.get("/sign-s3", (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: "scripts/attachments/" + req.query.scriptId + "/" + fileName.trim(),
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: 'https://s3-us-west-1.amazonaws.com/sortpak/scripts/attachments/' + req.query.scriptId + '/' + fileName.trim()
        };
        console.log(returnData)
        res.write(JSON.stringify(returnData));
        res.end();
        // open('https://s3-us-west-1.amazonaws.com/sortpak/scripts/attachments/' + req.query.scriptId + '/' + fileName.trim(), function (err) {
        //     if (err) throw err;
        // });
    });
});

router.put("/upload/:id", (req, res) => {
    var attachment = {
        title: req.body.title.trim(),
        genre: req.body.genre,
        pageCount: req.body.pageCount.trim()
    }

    db.scriptAttachments.update({
        attachment, where: {
            id: req.param.id
        }
    })
        .then(function (resp) {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).end('Attachment update failed' + err.toString());
        });
});

router.delete("/delete/:id", (req, res) => {
    var attachment = {
        title: req.body.title.trim(),
        genre: req.body.genre,
        pageCount: req.body.pageCount.trim()
    }

    db.scriptAttachments.destroy({
        where: {
            id: req.param.id
        }
    })
        .then(function (resp) {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).end(err.toString());
        });
});

module.exports = router;