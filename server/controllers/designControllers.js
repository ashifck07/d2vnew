const designService = require("../services/designServices");
const {getNextProjectId, logActivity} = require("../helpers/projectIdHelper");
const {db, bucket} = require("../config/firebase");
const {registerCustomer} = require("../models/customerModel");
const uploadImage = async (file) => {
  try {
    // const filePath = `images/${file.originalname}`;
    let filePath;
    if (file.mimetype === "application/pdf") {
      filePath = `documents/${file.originalname}`; // Store PDFs in a "documents" folder
    } else if (file.mimetype.startsWith("image/")) {
      filePath = `images/${file.originalname}`; // Store images in an "images" folder
    } else {
      throw new Error("Unsupported file type. Only images and PDFs are allowed.");
    }
    const firebaseFile = bucket.file(filePath);
    await firebaseFile.save(file.buffer, {
      contentType: file.mimetype,
      public: true,
    });
    await firebaseFile.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    console.log("Image uploaded successfully. URL:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error.message);
    throw new Error("Error uploading image to Firebase Storage: " + error.message);
  }
};
// const uploadFile = async (file) => {
//   try {
//     const filePath = `uploads/${file.originalname}`;
//     const firebaseFile = bucket.file(filePath);

//     // Check the file type and set content type
//     let contentType = file.mimetype;

//     // Optionally, you can handle different types differently (e.g., images vs PDFs)
//     if (contentType.startsWith("image/")) {
//       // It's an image
//       console.log("Uploading an image file");
//     } else if (contentType === "application/pdf") {
//       // It's a PDF
//       console.log("Uploading a PDF file");
//     } else {
//       console.log("Uploading a file of type: " + contentType);
//     }

//     // Save the file to Firebase Storage
//     await firebaseFile.save(file.buffer, {
//       contentType: contentType,
//       public: true, // or false if you don't want to make it public
//     });

//     await firebaseFile.makePublic();
//     const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
//     console.log("File uploaded successfully. URL:", fileUrl);
//     return fileUrl;
//   } catch (error) {
//     console.error("Error uploading file to Firebase Storage:", error.message);
//     throw new Error("Error uploading file to Firebase Storage: " + error.message);
//   }
// };

const createDesign = async (req, res) => {
  try {
    const {type, name, email, phone, assignedArchitect, status, estimate, amount} = req.body;
    const userRole = req.user?.role;
    const projectId = await getNextProjectId();
    const defaultStages = {
      stage1: {name: "Mood Board", images: [], enabled: false, updatedAt: null},
      stage2: {name: "Basic Design", images: [], enabled: false, updatedAt: null},
      stage3: {name: "Final Design", images: [], enabled: false, updatedAt: null, approved: false},
      stage4: {
        name: "Premium/Luxury",
        premium: {
          file: {},
          data: {},
          selected: false,
        },
        luxury: {
          file: {},
          data: {},
          selected: false,
        },
        enabled: false,
        updatedAt: null,
        approved: false,
        loading: false,
      },
      stage5: {
        name: "Final Estimation",
        selectedDesign: {},
        amount: amount || null,
        enabled: false,
        updatedAt: null,
        approved: false,
        loading: false,
      },
      stage6: {
        name: "Estimation Confirmed",
        selectedDesign: {},
        amount: amount || null,
        enabled: false,
        updatedAt: null,
        approved: false,
        loading: false,
      },
    };
    const stageKey = Object.keys(defaultStages).find((key) => defaultStages[key].name === status);
    if (amount && status === "Final Estimation") {
      // Role-based check for "Final Estimation" status
      if (userRole !== "master") {
        return res.status(403).json({
          success: false,
          message: "Only users with role 'master' can add amount for Final Estimation.",
        });
      }
      defaultStages[stageKey].amount = amount;
    }
    if (amount && stageKey) {
      // Set the amount only for the matched stage
      defaultStages[stageKey].amount = amount;
    }
    // Avoid assigning `amount` to other stages unless explicitly needed
    defaultStages.stage5.amount = stageKey === "stage5" ? amount || null : null;
    defaultStages.stage6.amount = stageKey === "stage6" ? amount || null : null;
    let stageFound = false;
    const timestamp = new Date().toISOString();
    for (const key of Object.keys(defaultStages)) {
      defaultStages[key].enabled = true;
      defaultStages[key].updatedAt = timestamp;
      if (defaultStages[key].name === status) {
        stageFound = true;
        break;
      }
    }
    if (!stageFound) {
      return res.status(400).json({success: false, message: "Invalid status"});
    }
    if (estimate && Array.isArray(estimate)) {
      defaultStages.stage4.estimate = estimate;
    }
    let uploadedImages = [];
    if (req.files && req.files.img) {
      for (const file of req.files.img) {
        const fileUrl = await uploadImage(file);
        // const fileUrl = "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1";
        uploadedImages.push({path: fileUrl, stageId: stageKey, projectId: ""});
      }
    }
    // if (uploadedImages.length > 0) {
    //   defaultStages[stageKey].images = uploadedImages;
    // }
    const newProject = {
      count: projectId,
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
    const designRef = await db.collection("projects").add(newProject);
    const projectIdRef = designRef.id;
    uploadedImages = uploadedImages.map((img) => ({...img, projectId: projectIdRef}));
    const imagesCollection = db.collection("images");
    for (const image of uploadedImages) {
      await imagesCollection.add(image);
    }
    try {
      await registerCustomer({name, phoneNumber: phone, email, projectid: projectIdRef, type});
    } catch (error) {
      console.error("Error adding/updating customer:", error.message);
      return res.status(500).json({success: false, message: "Failed to add or update customer data."});
    }
    res.status(201).json({success: true, id: designRef.id, ...newProject});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: error.message});
  }
};

const updateDesign = async (req, res) => {
  try {
    const projectId = req.params.id;
    const {status, stageName, description, premium, luxury, amount, assignedArchitect} = req.body;
    console.log(req.body);

    if (!projectId) {
      return res.status(400).json({success: false, message: "Project ID is required."});
    }
    const userRole = req.user?.role;
    const designRef = db.collection("projects").doc(projectId);
    const designDoc = await designRef.get();
    if (!designDoc.exists) {
      return res.status(404).json({success: false, message: "Design not found."});
    }
    const designData = designDoc.data();
    const timestamp = new Date().toISOString();
    let previousStatus = designData.status;

    //  for changing the status only
    if (status) {
      const stageKeyForStatus = Object.keys(designData.stages).find((key) => designData.stages[key].name === status);
      if (!stageKeyForStatus) {
        return res.status(400).json({
          success: false,
          message: `No stage found with the name "${status}".`,
        });
      }

      designData.status = status;
      const name = req.user.name;
      const projectId = designData.count;
      const type = designData.type;
      const newStatus = status;
      logActivity(name, projectId, type, previousStatus, newStatus);
      designData.stages[stageKeyForStatus] = {
        ...designData.stages[stageKeyForStatus],
        enabled: true,
        updatedAt: timestamp,
      };
    }
    if (stageName) {
      //getting the stagekey with stageName
      const stageKey = Object.keys(designData.stages).find((key) => designData.stages[key].name === stageName);
      if (!stageKey) {
        return res.status(400).json({
          success: false,
          message: `Stage with name "${stageName}" not found.`,
        });
      }

      // hanlde image upload for first 3 stages
      if (stageName === "Mood Board" || stageName === "Basic Design" || stageName === "Final Design") {
        let uploadedImages = [];

        if (req.files && req.files.img) {
          for (const file of req.files.img) {
            const fileUrl = await uploadImage(file);
            // const fileUrl = "https://chiedesign.in/wp-content/uploads/2022/05/Luxury-Interior-Design-Living-Room.jpg"; // uncomment when on production
            uploadedImages.push({path: fileUrl, stageId: stageKey, projectId});
          }
          const imagesCollection = db.collection("images");
          for (const image of uploadedImages) {
            await imagesCollection.add(image);
          }
        }
        designData.stages[stageKey] = {
          ...designData.stages[stageKey],
          enabled: true,
          description: description || designData.stages[stageKey].description,
          updatedAt: timestamp,
        };
      } else if (stageName === "Premium/Luxury" && premium && luxury) {
        // Handle file uploads dynamically based on fieldname

        let uploadedFiles = [];
        if (req.files && req.files.premiumdoc && req.files.luxurydoc) {
          // Check for premiumdoc
          // req.files.premiumdoc.forEach((file) => {
          //   const fileUrl = await uploadImage(file); // Simulate file URL generation
          //   uploadedFiles.push({
          //     path: fileUrl,
          //     stageId: stageKey,
          //     projectId,
          //     type: "premium",
          //   });
          // });

          // // Check for luxurydoc
          // req.files.luxurydoc.forEach((file) => {
          //   const fileUrl = await uploadImage(file); // Simulate file URL generation
          //   uploadedFiles.push({
          //     path: fileUrl,
          //     stageId: stageKey,
          //     projectId,
          //     type: "luxury",
          //   });
          // });
          // Check for premiumdoc
          if (req.files.premiumdoc) {
            for (const file of req.files.premiumdoc) {
              const fileUrl = await uploadImage(file); // Simulate file URL generation
              uploadedFiles.push({
                path: fileUrl,
                stageId: stageKey,
                projectId,
                type: "premium",
              });
            }
          }

          // Check for luxurydoc
          if (req.files.luxurydoc) {
            for (const file of req.files.luxurydoc) {
              const fileUrl = await uploadImage(file); // Simulate file URL generation
              uploadedFiles.push({
                path: fileUrl,
                stageId: stageKey,
                projectId,
                type: "luxury",
              });
            }
          }
        }
        const estimateCollection = db.collection("estimates");
        for (const file of uploadedFiles) {
          await estimateCollection.add(file);
        }

        const stageData = designData.stages[stageKey];

        // Update the premium and luxury data fields with the respective text
        if (premium) {
          stageData.premium.data = premium || "";
        }

        if (luxury) {
          stageData.luxury.data = luxury || "";
        }

        stageData.enabled = true;
        stageData.loading = false;
        designData.stages[stageKey] = {
          ...stageData,
          updatedAt: timestamp,
        };
      } // for handling estimate amount upload form master
      else if (stageName === "Final Estimation" && amount) {
        if (userRole !== "master") {
          return res.status(403).json({
            success: false,
            message: "Only users with role 'master' can update the amount for Final Estimation.",
          });
        }
        designData.stages[stageKey] = {
          ...designData.stages[stageKey],
          loading: false,
          amount: amount,
          updatedAt: timestamp,
        };
      } else {
        console.log("no use with stagename");
      }
    }

    if (assignedArchitect) {
      designData.assignedArchitect = assignedArchitect;
    }
    designData.updatedAt = timestamp;
    await designRef.update(designData);
    res.status(200).json({id: projectId, ...designData});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: error.message});
  }
};
const getAllDesigns = async (req, res) => {
  try {
    const designs = await designService.getAllDesigns();
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getDesignById = async (req, res) => {
  try {
    const {id} = req.params;
    const projectDoc = await db.collection("projects").doc(id).get();
    if (!projectDoc.exists) {
      return res.status(404).json({success: false, message: "Project not found"});
    }
    const projectData = projectDoc.data();
    const imagesSnapshot = await db.collection("images").where("projectId", "==", id).get();
    const images = imagesSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    const stagesWithImages = {...projectData.stages};
    images.forEach((image) => {
      if (stagesWithImages[image.stageId]) {
        if (!stagesWithImages[image.stageId].images) {
          stagesWithImages[image.stageId].images = [];
        }
        stagesWithImages[image.stageId].images.push(image);
      }
    });
    // Step 3: Fetch estimates for the premium and luxury types for this project
    const estimatesSnapshot = await db.collection("estimates").where("projectId", "==", id).get();
    const estimates = estimatesSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    // Step 4: Loop through estimates and match with premium/luxury
    estimates.forEach((estimate) => {
      if (estimate.stageId === "stage4") {
        // Inject file data for premium
        if (estimate.type === "premium" && stagesWithImages.stage4.premium) {
          stagesWithImages.stage4.premium.file = {
            path: estimate.path, // Assuming you have a function to upload images, inject here
            id: estimate.id, // Add the estimate ID for reference
          };
        }

        // Inject file data for luxury
        if (estimate.type === "luxury" && stagesWithImages.stage4.luxury) {
          stagesWithImages.stage4.luxury.file = {
            path: estimate.path, // Inject the uploaded file path
            id: estimate.id, // Add the estimate ID for reference
          };
        }
      }
    });
    // if (stagesWithImages.stage4) {
    //   const selectedStage4 = stagesWithImages.stage4.premium?.selected     ? stagesWithImages.stage4.premium
    //     : stagesWithImages.stage4.luxury?.selected    ? stagesWithImages.stage4.luxury
    //     : null;

    //   if (selectedStage4) {
    //     if (stagesWithImages.stage5) {
    //       stagesWithImages.stage5.selectedDesign = {...selectedStage4};
    //     }
    //     if (stagesWithImages.stage6) {
    //       stagesWithImages.stage6.selectedDesign = {...selectedStage4};
    //     }
    //   }
    // }
    if (stagesWithImages.stage4) {
      const selectedStage4 = stagesWithImages.stage4.premium?.selected
        ? {...stagesWithImages.stage4.premium, name: "premium"}
        : stagesWithImages.stage4.luxury?.selected
        ? {...stagesWithImages.stage4.luxury, name: "luxury"}
        : null;

      if (selectedStage4) {
        if (stagesWithImages.stage5) {
          stagesWithImages.stage5.selectedDesign = {...selectedStage4};
        }
        if (stagesWithImages.stage6) {
          stagesWithImages.stage6.selectedDesign = {...selectedStage4};
        }
      }
    }

    const updatedProjectData = {
      ...projectData,
      stages: stagesWithImages,
    };
    res.status(200).json(updatedProjectData);
  } catch (error) {
    console.error("Error fetching work progress by ID:", error.message);
    res.status(500).json({success: false, message: error.message});
  }
};

const deleteDesign = async (req, res) => {
  try {
    const {id} = req.params;
    const design = await designService.getDesignById(id);
    if (!design) {
      return res.status(404).json({error: "Design not found"});
    }
    await designService.deleteDesign(id);
    res.status(200).json({message: "Design deleted successfully"});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
const getDesignByArchitect = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({message: "User ID is missing in the request"});
    }
    const projectsRef = db.collection("projects");
    const snapshot = await projectsRef
      .where("assignedArchitect", "==", userId)
      .where("projectType", "==", "design")
      .get();
    if (snapshot.empty) {
      return res.status(404).json({message: "No projects found for the current architect"});
    }
    const projects = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching progress by architect:", error.message);
    res.status(500).json({message: "Internal server error", error: error.message});
  }
};
module.exports = {
  createDesign,
  getAllDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getDesignByArchitect,
};
