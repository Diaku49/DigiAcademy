const fs = require('fs');
const path = require('path');

const deleteFile = async(filePath)=>{
    try {
        await fs.promises.unlink(filePath);
        console.log('File deleted:', filePath);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}

const ClearFile = async(filePaths)=>{
    try {
        if (Array.isArray(filePaths)) {
            // If filePaths is an array, delete each file in parallel
            await Promise.all(filePaths.map(deleteFile));
        } else {
            // If filePaths is a single path, delete the file
            await deleteFile(filePaths);
        }
    } catch (error) {
        console.error('Error deleting file(s):', error);
        throw error;
    }
}

module.exports = ClearFile;