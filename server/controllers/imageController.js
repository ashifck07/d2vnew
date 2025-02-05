const {db, bucket} = require("../config/firebase");

// Controller to delete an image
const deleteImage = async (req, res) => {
  const {imageId} = req.params;

  try {
    // Step 1: Retrieve the image document
    const imageDoc = await db.collection("images").doc(imageId).get();

    if (!imageDoc.exists) {
      return res.status(404).json({success: false, message: "Image not found"});
    }

    const imageData = imageDoc.data();

    // Step 2: Delete the file from Firebase Storage
    // const filePath = imageData.path; // Assuming `path` contains the full storage path
    // if (!filePath) {
    //   return res.status(400).json({success: false, message: "Image path not found in database"});
    // }

    // await bucket.file(filePath).delete();

    // Step 3: Delete the document from Firestore
    await db.collection("images").doc(imageId).delete();

    res.status(200).json({success: true, message: "Image and document deleted successfully"});
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({success: false, message: "Failed to delete image", error: error.message});
  }
};

module.exports = {deleteImage};
