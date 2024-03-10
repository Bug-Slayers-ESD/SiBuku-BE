const imageValidations = (req) => {
    if (!req.files) {
        return {
            error: true,
            message: 'Image is required!'
        }
    }

    const image = req.files.image
    const imageExt = image.name.split('.').pop()
    const allowedExt = ['jpg', 'jpeg', 'png']

    if (!allowedExt.includes(imageExt)) {
        return {
            error: true,
            message: 'Only JPG, JPEG and PNG files are allowed!'
        }
    }

    return {
        error: false,
        message: 'Success'
    }
}

module.exports = { imageValidations }