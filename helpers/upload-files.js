const path = require('path')
const { v4: uuidv4 } = require('uuid')

const ext = ['png', 'jpg', 'jpeg', 'gif']

const uploadFileHelper = (files, validExtensions = ext, folder = '') => {
  return new Promise((resolve, reject) => {
    const { file } = files
    // dirname llega hasta el controller, con el segundo parametro se sale hacia atras
    const extension = file.name.split('.').pop()

    if (!validExtensions.includes(extension)) {
      return reject(`Extension ${extension} not valid. try with: ${validExtensions}`)
    }

    const tempName = uuidv4() + '.' + extension
    const uploadPath = path.join(__dirname, '../uploads/', folder, tempName)

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err)
      }
      resolve(tempName)
    })
  })
}

module.exports = {
  uploadFileHelper,
}
