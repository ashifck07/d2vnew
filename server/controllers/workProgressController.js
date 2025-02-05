const workProgressService = require("../services/workProgressService");
const {getNextProjectId, logActivity} = require("../helpers/projectIdHelper");
const {db, bucket} = require("../config/firebase");
const {registerCustomer} = require("../models/customerModel");
const uploadImage = async (file) => {
  try {
    const filePath = `images/${file.originalname}`;
    const firebaseFile = bucket.file(filePath);

    // Upload image buffer to Firebase Storage
    await firebaseFile.save(file.buffer, {
      contentType: file.mimetype,
      public: true,
    });

    // Make the file publicly accessible
    await firebaseFile.makePublic();

    // Get the public URL of the uploaded image
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    console.log("url", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error.message);
    throw new Error("Error uploading image to Firebase Storage: " + error.message);
  }
};

const createWorkProgress = async (req, res) => {
  try {
    const {type, name, email, phone, assignedArchitect, status} = req.body;
    // Check for existing projects with type="work" and the same phone number
    if (type === "work") {
      const existingProjectSnapshot = await db
        .collection("projects")
        .where("type", "==", "work")
        .where("phone", "==", phone)
        .get();

      if (!existingProjectSnapshot.empty) {
        return res.status(400).json({success: false, message: "A project already exists with this phone number."});
      }
    }
    // Default stages
    const defaultStages = {
      stage1: {name: "Work Started", description: "", enabled: false, images: [], updatedAt: null},
      stage2: {name: "Materials Arrived", description: "", enabled: false, images: [], updatedAt: null},
      stage3: {name: "Assembly Finished", description: "", enabled: false, images: [], updatedAt: null},
      stage4: {name: "Ready to Deliver", description: "", enabled: false, images: [], updatedAt: null},
    };

    // Identify the stage based on status
    const stageKey = Object.keys(defaultStages).find((key) => defaultStages[key].name === status);

    if (!stageKey) {
      return res.status(400).json({success: false, message: "Invalid status"});
    }
    const count = await getNextProjectId();

    // Process images
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // const fileUrl = "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1";
        const fileUrl = await uploadImage(file);
        uploadedImages.push({
          path: fileUrl,
          stageId: stageKey,
          projectId: "", // Will add after project creation
        });
      }
    }
    console.log("uploaded image data", uploadedImages);

    const timestamp = new Date().toISOString();

    defaultStages[stageKey].enabled = true;
    defaultStages[stageKey].updatedAt = timestamp;

    const newProject = {
      count: count,
      type,
      name,
      email,
      phone,
      assignedArchitect,
      status,
      stages: defaultStages,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const projectRef = await db.collection("projects").add(newProject);
    const projectId = projectRef.id;

    // Add projectId to images
    uploadedImages = uploadedImages.map((img) => ({
      ...img,
      projectId,
    }));

    // Save images to a separate Firestore collection
    const imagesCollection = db.collection("images");
    for (const image of uploadedImages) {
      await imagesCollection.add(image);
    }
    // Add customer data to the "customers" collection
    // const newCustomer = {
    //   name,
    //   phone,
    //   email,
    //   projectId,
    //   otp: null,
    //   expiresAt: timestamp,
    //   createdAt: timestamp,
    // };

    // await db.collection("customers").add(newCustomer);
    try {
      await registerCustomer({name, phoneNumber: phone, email, projectid: projectId, type});
    } catch (error) {
      console.error("Error adding/updating customer:", error.message);
      return res.status(500).json({success: false, message: "Failed to add or update customer data."});
    }
    res.status(201).json({success: true, project: newProject});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: error.message});
  }
};

const updateWorkProgress = async (req, res) => {
  try {
    const projectId = req.params.id;
    const {status, stageName, description, assignedArchitect ,editedpersonalData} = req.body;

    let uploadedImages = [];

    if (!projectId) {
      return res.status(400).json({success: false, message: "Project ID is required."});
    }

    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({success: false, message: "Project not found."});
    }

    const projectData = projectDoc.data();
    const timestamp = new Date().toISOString();
    let previousStatus = projectData.status;
    // If status is provided, update project status and enable the corresponding stage
    if (status) {
      const stageKeyForStatus = Object.keys(projectData.stages).find((key) => projectData.stages[key].name === status);

      if (!stageKeyForStatus) {
        return res.status(400).json({
          success: false,
          message: `No stage found with the name "${status}".`,
        });
      }

      // Enable the corresponding stage and update the `updatedAt` field
      projectData.stages[stageKeyForStatus] = {
        ...projectData.stages[stageKeyForStatus],
        enabled: true,
        updatedAt: timestamp,
      };

      projectData.status = status;
      const name = req.user.name;
      const projectId = projectData.count;
      const type = projectData.type;
      const newStatus = status;
      logActivity(name, projectId, type, previousStatus, newStatus);
    }

    // If stageName is provided, update the specific stage
    if (stageName) {
      const stageKey = Object.keys(projectData.stages).find((key) => projectData.stages[key].name === stageName);

      if (!stageKey) {
        return res.status(400).json({
          success: false,
          message: `Stage with name "${stageName}" not found.`,
        });
      }

      // Process images if provided
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileUrl = await uploadImage(file); // uncomment when on production
          // const fileUrl = "https://chiedesign.in/wp-content/uploads/2022/05/Luxury-Interior-Design-Living-Room.jpg"; // uncomment when on production
          uploadedImages.push({
            path: fileUrl,
            stageId: stageKey,
            projectId,
          });
        }

        // Save uploaded images to the Firestore collection and associate them with the stage
        const imagesCollection = db.collection("images");
        for (const image of uploadedImages) {
          await imagesCollection.add(image);
        }
      }

      // Update the stage with the new description and enable it
      projectData.stages[stageKey] = {
        ...projectData.stages[stageKey],
        enabled: true,
        description: description || projectData.stages[stageKey].description,
        updatedAt: timestamp,
      };
    }
    // New Condition: Update assignedArchitect field if provided**
    if (assignedArchitect) {
      projectData.assignedArchitect = assignedArchitect;
    }
    // Update the project document in Firestore
    projectData.updatedAt = timestamp;
    await projectRef.update(projectData);

    res.status(200).json({
      success: true,
      message: "Work progress updated successfully.",
      project: projectData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: error.message});
  }
};

const getWorkProgressById = async (req, res) => {
  try {
    const {id} = req.params;
    const projectDoc = await db.collection("projects").doc(id).get();

    if (!projectDoc.exists) {
      return res.status(404).json({success: false, message: "Project not found"});
    }

    const projectData = projectDoc.data();

    // Fetch images associated with the project
    const imagesSnapshot = await db.collection("images").where("projectId", "==", id).get();
    const images = imagesSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    // Group images by their stageId and assign them to the corresponding stage in the project
    const stagesWithImages = {...projectData.stages};
    images.forEach((image) => {
      if (stagesWithImages[image.stageId]) {
        if (!stagesWithImages[image.stageId].images) {
          stagesWithImages[image.stageId].images = [];
        }
        stagesWithImages[image.stageId].images.push(image);
      }
    });

    // Include updated stages with images in the project data
    const updatedProjectData = {
      ...projectData,
      stages: stagesWithImages,
    };

    res.status(200).json({success: true, project: updatedProjectData});
  } catch (error) {
    console.error("Error fetching work progress by ID:", error.message);
    res.status(500).json({success: false, message: error.message});
  }
};

const deleteWorkProgress = async (req, res) => {
  try {
    const workProgressId = req.params.id;
    const result = await workProgressService.deleteWorkProgress(workProgressId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting work progress:", error);
    res.status(500).json({message: "Failed to delete work progress", error: error.message});
  }
};

const getAllWorkProgresses = async (req, res) => {
  try {
    const type = "work";
    const userId = req.user.uid;
    const role = req.user.role;
    const allWorkProgresses = await workProgressService.getAllWorkProgresses(type, userId, role);

    res.status(200).json(allWorkProgresses);
  } catch (error) {
    console.error("Error retrieving work progresses:", error);
    res.status(500).json({message: "Failed to retrieve work progresses", error: error.message});
  }
};

module.exports = {
  createWorkProgress,
  updateWorkProgress,
  getAllWorkProgresses,
  getWorkProgressById,
  deleteWorkProgress,
};
