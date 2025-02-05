const {db} = require("../config/firebase");

async function registerCustomer(data) {
  try {
    const {name, phoneNumber, email, projectid, type} = data;

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error("Phone number must be exactly 10 digits");
    }

    // Check if a customer with the given phone number already exists
    const CustomerSnapshot = await db.collection("customers").where("phoneNumber", "==", phoneNumber).get();

    if (!CustomerSnapshot.empty) {
      // Update the existing customer's projectid
      const existingDoc = CustomerSnapshot.docs[0];
      await existingDoc.ref.update({
        projectid,
        updatedAt: new Date().toISOString(), // Optional: Add updated timestamp
      });
      console.log("Updated existing customer's projectid.");
      return {id: existingDoc.id, message: "Customer updated successfully."};
    } else {
      // Create a new customer record
      const createdAt = new Date().toISOString();

      const newCustomer = {
        name,
        phoneNumber,
        email,
        projectid,
        otp: null,
        role: "customer",
        expiresAt: null,
        createdAt,
      };

      const newCustomerRef = await db.collection("customers").add(newCustomer);
      console.log("Created new customer:", newCustomerRef.id);
      return {id: newCustomerRef.id, message: "Customer created successfully."};
    }
  } catch (error) {
    throw new Error(`Failed to register Customer: ${error.message}`);
  }
}

async function loginCustomer(phoneNumber, otp) {
  try {
    // Fetch customer by phone number
    const CustomerSnapshot = await db.collection("customers").where("phoneNumber", "==", phoneNumber).get();

    if (CustomerSnapshot.empty) {
      throw new Error("No Customer Found with this Number");
    }

    const CustomerDoc = CustomerSnapshot.docs[0];
    const CustomerData = CustomerDoc.data();
    console.log("suer", CustomerData);

    if (!otp) {
      // Generate OTP if it's a new login attempt
      // const newOtp = Math.floor(100000 + Math.random() * 900000);
      const newOtp = 123456;

      const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes validity

      await db.collection("customers").doc(CustomerDoc.id).update({
        otp: newOtp,
        expiresAt: expiresAt.toISOString(),
      });

      console.log(`Generated OTP for ${phoneNumber}:`, newOtp); // Integrate with SMS service here
      return {message: "OTP sent successfully"};
    }

    const currentTime = new Date().getTime();
    const otpExpiresAt = new Date(CustomerData.expiresAt).getTime();

    console.log("OTP from Customer:", otp); // Log OTP from the request
    console.log("Stored OTP:", CustomerData.otp); // Log stored OTP
    console.log("Current Time:", currentTime); // Log current timestamp
    console.log("OTP Expiration Time:", otpExpiresAt); // Log OTP expiration timestamp

    // Ensure otp is a number for comparison
    if (CustomerData.otp !== Number(otp)) {
      throw new Error("Invalid OTP.");
    }

    // Ensure current time is within expiration time
    if (currentTime > otpExpiresAt) {
      throw new Error("Expired OTP.");
    }

    // Reset OTP after successful login
    await db.collection("customers").doc(CustomerDoc.id).update({otp: null});

    return {uid: CustomerDoc.id, phoneNumber: CustomerData.phoneNumber, role: CustomerData.role};
  } catch (error) {
    throw new Error(`${error}`);
  }
}

// async function getCustomerById(userId) {
//   try {
//     // Fetch the customer document by ID

//     const userDoc = await db.collection("customers").doc(userId).get();
//     if (!userDoc.exists) {
//       throw new Error("Customer not found.");
//     }

//     // Extract customer data
//     const customerData = {id: userDoc.id, ...userDoc.data()};
//     console.log("customer data",customerData);

//     // Fetch the project details using projectId
//     const projectId = customerData.projectid;
//     if (!projectId) {
//       throw new Error("No project associated with this customer.");
//     }

//     const projectDoc = await db.collection("projects").doc(projectId).get();
//     if (!projectDoc.exists) {
//       throw new Error("Project not found.");
//     }

//     // Combine customer and project details
//     const projectData = {id: projectDoc.id, ...projectDoc.data()};

//     return {
//       customer: customerData,
//       project: projectData,
//     };
//   } catch (error) {
//     throw new Error(`Failed to retrieve customer and project details: ${error.message}`);
//   }
// }

async function getCustomerById(userId) {
  try {
    // Fetch the customer document by ID
    const userDoc = await db.collection("customers").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("Customer not found.");
    }

    // Extract customer data
    const customerData = {id: userDoc.id, ...userDoc.data()};
    console.log("customer data", customerData);

    // Fetch the project details using projectId
    const projectId = customerData.projectid;
    if (!projectId) {
      throw new Error("No project associated with this customer.");
    }

    const projectDoc = await db.collection("projects").doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error("Project not found.");
    }

    // Combine customer and project details
    const projectData = {id: projectDoc.id, ...projectDoc.data()};
    // Fetch the architect details if assigned
    let architectData = {};
    if (projectData.assignedArchitect) {
      const architectDoc = await db.collection("architects").doc(projectData.assignedArchitect).get();
      if (architectDoc.exists) {
        const architectInfo = architectDoc.data();
        architectData = {
          id: architectDoc.id,
          name: architectInfo.name,
          phone: architectInfo.phone,
        };
      }
    }

    // Add architectData to projectData
    projectData.assignedArchitect = architectData;
    // Fetch images associated with the project
    const imagesSnapshot = await db.collection("images").where("projectId", "==", projectId).get();
    const images = imagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      path: doc.data().path, // Only include the `path` field from image data
      stageId: doc.data().stageId,
    }));

    // Group images by their stageId and assign them to the corresponding stage in the project
    const stagesWithImages = {...projectData.stages};
    images.forEach((image) => {
      if (stagesWithImages[image.stageId]) {
        if (!stagesWithImages[image.stageId].images) {
          stagesWithImages[image.stageId].images = [];
        }
        stagesWithImages[image.stageId].images.push(image.path);
      }
    });
    // Step 3: Fetch estimates for the premium and luxury types for this project
    const estimatesSnapshot = await db.collection("estimates").where("projectId", "==", projectDoc.id).get();
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

    // Include updated stages with images in the project data
    const updatedProjectData = {
      ...projectData,
      stages: stagesWithImages,
    };

    return {
      customer: customerData,
      project: updatedProjectData,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve customer and project details: ${error.message}`);
  }
}

async function updateCustomer(userId, data) {
  try {
    await db.collection("users").doc(userId).update(data);
    return {message: "User updated successfully."};
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}
// async function designApproval(projectId, otp, selected, stageName, requestBody) {
//   try {
//     const projectRef = db.collection("projects").doc(projectId);
//     const designDoc = await projectRef.get();
//     if (!designDoc.exists) {
//       throw new Error("Design not found.");
//     }
//     const designData = designDoc.data();
//     const timestamp = new Date().toISOString();
//     Object.keys(designData.stages).forEach((key) => {
//       console.log(`Stage ${key}:`, designData.stages[key].approved, designData.stages[key].enabled);
//     });
//     console.log("Design stages:", designData.stages);
//     const currentStageKey = Object.keys(designData.stages).find((key) => {
//       const stage = designData.stages[key];
//       console.log(`Checking stage ${key}: approved=${stage.approved}, enabled=${stage.enabled}`);
//       return stage.approved === false && stage.enabled === true;
//     });
//     console.log("currentstagekey", currentStageKey);
//     if (!currentStageKey) {
//       throw new Error("No actionable stage found.");
//     }
//     console.log("Fetching customer details using email:", designData.email);
//     const customerSnapshot = await db.collection("customers").where("email", "==", designData.email).get();
//     if (customerSnapshot.empty) {
//       console.error("No customer found with email:", designData.email);
//       throw new Error("Customer not found.");
//     }
//     const customerDoc = customerSnapshot.docs[0];
//     const customerData = customerDoc.data();
//     console.log("Customer data fetched:", customerData);
//     if (!customerData.otp) {
//       const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
//       console.log("Generated OTP:", generatedOtp, "For Project ID:", projectId);
//       await customerDoc.ref.update({otp: generatedOtp});
//       console.log("OTP saved successfully.");
//       return {message: "OTP generated and saved. Please verify to approve."};
//     }
//     console.log("Existing OTP:", customerData.otp);
//     const isOtpVerified = true;
//     if (!isOtpVerified) {
//       return {message: "OTP verification failed."};
//     }
//     console.log("OTP verified. Proceeding with approval...");
//     const stageData = designData.stages[currentStageKey];
//     // Stage-specific logic
//     if (currentStageKey.startsWith("stage3")) {
//       stageData.approved = true;
//       stageData.updatedAt = timestamp;
//       const nextStageKey = `stage${parseInt(currentStageKey.replace("stage", "")) + 1}`;
//       if (designData.stages[nextStageKey]) {
//         designData.stages[nextStageKey].enabled = true;
//       }
//     }
//     if (currentStageKey.startsWith("stage4")) {
//       const {selection} = requestBody;
//       if (!["premium", "luxury"].includes(selection)) {
//         throw new Error("Invalid selection for stage 4.");
//       }
//       if (!stageData.estimate || !Array.isArray(stageData.estimate) || stageData.estimate.length === 0) {
//         throw new Error("Invalid stage data: 'estimate' is missing, empty, or not an array.");
//       }
//       const selectedDesignObj = stageData.estimate.find((item) => item[selection]);
//       if (!selectedDesignObj) {
//         throw new Error(`Invalid selection: ${selection} not found in estimate.`);
//       }
//       selectedDesignObj[selection].selected = true;
//       stageData.approved = true;
//       stageData.updatedAt = timestamp;
//       const nextStageKey = `stage${parseInt(currentStageKey.replace("stage", "")) + 1}`;
//       if (designData.stages[nextStageKey]) {
//         designData.stages[nextStageKey].enabled = true;
//         designData.stages[nextStageKey].selectedDesign = {...selectedDesignObj};
//         designData.stages[nextStageKey].updatedAt = timestamp;
//       }
//     }
//     if (currentStageKey.startsWith("stage5")) {
//       if (!designData.amount) {
//         throw new Error("Only with an amount can be approved.");
//       }
//       const updatedSelectedDesign = {
//         premium: {
//           ...stageData.selectedDesign.premium,
//           selected: stageData.selectedDesign.premium?.selected || false,
//         },
//         luxury: {
//           ...stageData.selectedDesign.luxury,
//           selected: stageData.selectedDesign.luxury?.selected || false,
//         },
//       };
//       stageData.selectedDesign = updatedSelectedDesign;
//       console.log("stageData", stageData);
//       stageData.approved = true;
//       stageData.updatedAt = timestamp;
//       const nextStageKey = `stage${parseInt(currentStageKey.replace("stage", "")) + 1}`;
//       if (designData.stages[nextStageKey]) {
//         designData.stages[nextStageKey] = {
//           ...designData.stages[nextStageKey],
//           enabled: true,
//           selectedDesign: updatedSelectedDesign,
//           updatedAt: timestamp,
//         };
//       }
//     }
//     if (currentStageKey.startsWith("stage6")) {
//       const selectedDesignFromStage5 = designData.stages["stage5"].selectedDesign;
//       const amountFromStage5 = designData.stages["stage5"].amount;
//       if (amountFromStage5 == null) {
//         throw new Error("Amount must be added before approving stage 6.");
//       }
//       stageData.selectedDesign = selectedDesignFromStage5;
//       stageData.amount = amountFromStage5;
//       stageData.approved = true;
//       stageData.updatedAt = timestamp;
//       const nextStageKey = `stage${parseInt(currentStageKey.replace("stage", "")) + 1}`;
//       if (designData.stages[nextStageKey]) {
//         designData.stages[nextStageKey].enabled = true;
//         designData.stages[nextStageKey].selectedDesign = selectedDesignFromStage5;
//         designData.stages[nextStageKey].amount = amountFromStage5;
//         designData.stages[nextStageKey].updatedAt = timestamp;
//       }
//     }
//     designData.stages[currentStageKey].approved = true;
//     designData.stages[currentStageKey].updatedAt = timestamp;
//     designData.updatedAt = timestamp;
//     // await projectRef.update(designData);
//     // await customerDoc.ref.update({otp: null});
//     console.log("OTP nullified after stage approval.");
//     return designData;
//   } catch (error) {
//     throw new Error(`Failed to approve design: ${error.message}`);
//   }
// }

async function designApproval(projectId, requestBody, userId) {
  try {
    const {otp} = requestBody;
    const projectRef = db.collection("projects").doc(projectId);
    const designDoc = await projectRef.get();
    if (!designDoc.exists) throw new Error("Design not found.");
    const designData = designDoc.data();
    const stageName = requestBody.stageName;

    if (!stageName) throw new Error("Stage name must be provided.");
    const stageData = designData.stages[stageName];

    if (!stageData) throw new Error(`Stage ${stageName} not found.`);
    const customerSnapshot = await db.collection("customers").where("email", "==", designData.email).get();

    if (customerSnapshot.empty) throw new Error("Customer not found.");
    const customerDoc = customerSnapshot.docs[0];
    const customerId = customerDoc.id;
    const customerData = customerDoc.data();
    const timestamp = new Date().toISOString();
    const stageOtpField = `${stageName}Otp`;

    if (!otp) {
      // Generate OTP if it's a new login attempt
      // const newOtp = Math.floor(100000 + Math.random() * 900000);
      const newOtp = 123456;

      const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes validity

      await db.collection("customers").doc(customerId).update({
        otp: newOtp,
        expiresAt: expiresAt.toISOString(),
      });

      console.log(`Generated OTP :`, newOtp); // Integrate with SMS service here
      return {message: "OTP sent successfully"};
    } else {
      const currentTime = new Date().getTime();
      const otpExpiresAt = new Date(customerData.expiresAt).getTime();

      console.log("OTP from Customer:", otp); // Log OTP from the request
      console.log("Stored OTP:", customerData.otp); // Log stored OTP

      // Ensure otp is a number for comparison
      if (customerData.otp !== Number(otp)) {
        console.log(customerData, "iuhiuhiuhii");

        return {message: `OTP verification failed , Invalid OTP`};
      }

      // Ensure current time is within expiration time
      if (currentTime > otpExpiresAt) {
        return {message: `OTP verification failed , Expired OTP`};
      }
      console.log("OTP verified for", stageName);

      // Reset OTP after successful login
      await db.collection("customers").doc(userId).update({otp: null});
    }

    stageData.approved = true;
    stageData.updatedAt = timestamp;
    const nextStageKey = `stage${parseInt(stageName.replace("stage", "")) + 1}`;

    if (designData.stages[nextStageKey]) {
      designData.stages[nextStageKey].enabled = true;
      designData.stages[nextStageKey].loading = true;
    }
    // Handle Stage 4 Logic
    if (stageName.startsWith("stage4")) {
      const {selection} = requestBody;
      if (!["premium", "luxury"].includes(selection)) throw new Error("Invalid selection for stage 4.");
      console.log("selected stage data", stageData[selection]);
      const selectedDesignObj = stageData[selection];
      if (!selectedDesignObj) throw new Error(`Invalid selection: ${selection} not found in estimate.`);
      selectedDesignObj.selected = true;
      designData.status = "Final Estimation";
      // designData.stages[nextStageKey].selectedDesign = {...selectedDesignObj};
    }
    // Handle Stage 5 Logic
    if (stageName.startsWith("stage5")) {
      if (!stageData.amount) throw new Error("Only with an amount can be approved.");
      stageData.selectedDesign = {
        premium: {...stageData.selectedDesign?.premium, selected: stageData.selectedDesign?.premium?.selected || false},
        luxury: {...stageData.selectedDesign?.luxury, selected: stageData.selectedDesign?.luxury?.selected || false},
      };
      designData.stages[nextStageKey].amount = stageData?.amount;
      designData.status = "Estimation Confirmed";
    }
    // Handle Stage 6 Logic
    // if (stageName.startsWith("stage6")) {
    //   const previousStage = designData.stages["stage5"];
    //   if (!previousStage.amount) throw new Error("Amount must be added before approving stage 6.");
    //   stageData.selectedDesign = previousStage.selectedDesign;
    //   stageData.amount = previousStage.amount;
    //   designData.stages[nextStageKey].selectedDesign = previousStage.selectedDesign;
    //   designData.stages[nextStageKey].amount = previousStage.amount;
    // }
    designData.stages[stageName] = stageData;
    designData.updatedAt = timestamp;
    await projectRef.update(designData);
    // await customerDoc.ref.update({otp: null});
    return designData;
  } catch (error) {
    throw new Error(`Failed to approve design: ${error.stack}`);
  }
}
module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerById,
  updateCustomer,
  designApproval,
};
