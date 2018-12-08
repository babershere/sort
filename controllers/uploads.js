const {
  getAttachmentFolderByType,
} = require('../lib')

const {
  Attachment,
} = require('../models')

const uploads = require('../services/uploads')

module.exports = {
  async getSignedUrl(req, res) {
    const { fileType, type } = req.query

    const folder = getAttachmentFolderByType(type)

    const { url, file } = await uploads.generateSignedUrl({fileType, folder})

    const data = {
      file,
      type,
      userId: req.self.id,
    }
    const attachment = await Attachment.create(data)

    res.json({
      success: true,
      attachment,
      url,
    })
  },
}
