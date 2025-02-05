const {db} = require("../config/firebase"); // Firebase Firestore instance

// Function to get the last used project ID and increment it
const getNextProjectId = async () => {
  const projectIdRef = db.collection("counters").doc("projectcounter");
  const doc = await projectIdRef.get();

  if (!doc.exists) {
    // If the document doesn't exist, initialize it with ID 1
    await projectIdRef.set({lastProjectId: 1});
    return "D2V001";
  } else {
    const lastProjectId = doc.data().lastProjectId;
    const nextProjectId = lastProjectId + 1;
    // Update the counter with the new project ID
    await projectIdRef.update({lastProjectId: nextProjectId});
    return `D2V${nextProjectId}`;
  }
};
const logActivity = async (architectName, projectId, type, previousStatus, newStatus) => {
  try {
    
    const activityLogRef = db.collection("activitylog");
    const timestamp = new Date().toISOString();

    const message = `${architectName} changed ${projectId} ${type} status from '${previousStatus}' to '${newStatus}'`;

    await activityLogRef.add({
      message,
      createdAt: timestamp,
    });

    console.log("Activity logged successfully:", message);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
const getEstimateForStage = async (stageName, selection)=> {
  const estimateQuerySnapshot = await db
    .collection("estimates")
    .where("stageId", "==", stageName)
    .where("type", "==", selection)
    .get();

  if (!estimateQuerySnapshot.empty) {
    const estimateDoc = estimateQuerySnapshot.docs[0];
    return estimateDoc.data(); // Return the data of the first matched estimate
  }
  return null; // Return null if no estimate found
}

module.exports = {
  getNextProjectId,
  logActivity,
  getEstimateForStage
};
