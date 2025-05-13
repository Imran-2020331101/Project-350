/**
 * Helper function to convert a file buffer and MIME type into a Google Generative AI compatible part.
 * @param {Buffer} data - The file buffer.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {object} - An object representing the file data in the required format.
 */
function fileToGenerativePart(data, mimeType) {
    return {
        inlineData: {
            data: data.toString('base64'),
            mimeType,
        },
    };
}

export {fileToGenerativePart}