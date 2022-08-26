const { response } = require('express')
const path = require('path')

const uploadFile = (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).json({ msg: 'No files were uploaded' })
    return
  }

  const { file } = req.files
  // dirname llega hasta el controller, con el segundo parametro se sale hacia atras
  const uploadPath = path.join(__dirname, '../uploads/', file.name)

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({ err })
    }

    res.json({ msg: 'File uploaded to ' + uploadPath })
  })
}

module.exports = {
  uploadFile,
}
