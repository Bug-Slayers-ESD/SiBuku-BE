const path = require('path')

const imageSaver = async (image, slug) => {
    const filename = `${slug}.jpg`

    try {
        await image.mv(path.join(__dirname, `../public/image`, filename))
        return `/image/${filename}`
    } catch (error) {
        console.log(error)
        return {
            status: 400,
            message: 'Cannot save image!'
        }
    }
}

module.exports = { imageSaver }