

// import React, {useState} from "react";
// import {Steps, Form, Input, Upload, Button, message} from "antd";

// const {Step} = Steps;

// const CustomStepper = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({});
//   const [premiumDoc, setPremiumDoc] = useState([]);
//   const [luxuryDoc, setLuxuryDoc] = useState([]);

//   // Your data model
//   const projectData = {
//     id: "7kBs89Zz9kuG2fuR7zD9",
//     projectId: "D2V32",
//     type: "design",
//     name: "Design1",
//     email: "client@example.com",
//     phone: "0484577598",
//     assignedArchitect: "Athul",
//     createdAt: "2025-01-28T03:06:52.528Z",
//     amount: "170070",
//     status: "Estimation Confirmed",
//     stages: {
//       stage1: {
//         images: [],
//         name: "Mood Board",
//         enabled: true,
//         updatedAt: "2025-01-28T03:26:30.962Z",
//       },
//       stage2: {
//         images: [],
//         name: "Basic Design",
//         enabled: true,
//         updatedAt: "2025-01-28T03:06:52.528Z",
//       },
//       stage3: {
//         images: [],
//         name: "Final Design",
//         enabled: true,
//         updatedAt: "2025-01-28T03:06:52.528Z",
//         approved: false,
//       },
//       stage4: {
//         name: "Premium/Luxury",
//         estimate: [
//           {
//             premium: {
//               data: ["Detaiils of this "],
//               fileUpload: ["datasss"],
//               selected: false,
//             },
//           },
//           {
//             luxury: {
//               fileUpload: [],
//               data: ["details of this"],
//               selected: false,
//             },
//           },
//         ],
//         enabled: true,
//         updatedAt: "2025-01-28T03:26:49.146Z",
//         approved: false,
//       },
//       stage5: {
//         name: "Final Estimation",
//         selectedDesign: {},
//         amount: "170070",
//         enabled: true,
//         updatedAt: "2025-01-28T03:14:41.075Z",
//         approved: false,
//       },
//       stage6: {
//         name: "Estimation Confirmed",
//         selectedDesign: {},
//         amount: "170070",
//         enabled: true,
//         updatedAt: "2025-01-28T03:58:46.049Z",
//         approved: false,
//       },
//     },
//     updatedAt: "2025-01-28T03:58:46.049Z",
//   };

//   const onStepChange = (step) => {
//     setCurrentStep(step);
//   };

//   // Reusable component for the first three stages
//   const renderImageUploadStep = (stageName) => {
//     return (
//       <div>
//         <h3>{stageName}</h3>
//         <Form layout="vertical">
//           <Form.Item label={`Upload Images for ${stageName}`}>
//             <Upload
//               listType="picture"
//               multiple
//               beforeUpload={(file) => {
//                 message.success(`${file.name} file uploaded successfully.`);
//                 return false; // Prevent automatic upload
//               }}
//             >
//               <Button>Upload Images</Button>
//             </Upload>
//           </Form.Item>
//         </Form>
//       </div>
//     );
//   };

//   const renderStepContent = () => {
//     const currentStage = projectData.stages[`stage${currentStep + 1}`];

//     if (!currentStage || !currentStage.enabled) {
//       return <p>This stage is currently disabled or does not exist.</p>;
//     }

//     switch (currentStep) {
//       case 0: // Mood Board
//       case 1: // Basic Design
//       case 2: // Final Design
//         return renderImageUploadStep(currentStage.name);

//       case 3: // Premium/Luxury
//         return (
//           <div>
//             <h3>{currentStage.name}</h3>
//             <Form layout="vertical">
//               <Form.Item label="Premium Documents">
//                 <Upload listType="picture" multiple onChange={({fileList}) => setPremiumDoc(fileList)}>
//                   <Button>Upload Premium Documents</Button>
//                 </Upload>
//               </Form.Item>
//               <Form.Item label="Luxury Documents">
//                 <Upload listType="picture" multiple onChange={({fileList}) => setLuxuryDoc(fileList)}>
//                   <Button>Upload Luxury Documents</Button>
//                 </Upload>
//               </Form.Item>
//             </Form>
//           </div>
//         );

//       case 4: // Final Estimation
//         return (
//           <div>
//             <h3>{currentStage.name}</h3>
//             <Form layout="vertical">
//               <Form.Item
//                 label="Final Amount"
//                 name="amount"
//                 rules={[{required: true, message: "Please enter an amount"}]}
//               >
//                 <Input
//                   type="number"
//                   placeholder="Enter final amount"
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       amount: e.target.value,
//                     }))
//                   }
//                 />
//               </Form.Item>
//             </Form>
//           </div>
//         );

//       case 5: // Estimation Confirmed
//         return (
//           <div>
//             <h3>{currentStage.name}</h3>
//             <p>Estimation has been confirmed. No further actions are required.</p>
//           </div>
//         );

//       default:
//         return <p>Invalid step</p>;
//     }
//   };

//   return (
//     <div style={{padding: "20px"}}>
//       {/* Steps Navigation */}
//       <Steps current={currentStep} onChange={onStepChange} direction="horizontal">
//         {Object.keys(projectData.stages).map((key, index) => {
//           const stage = projectData.stages[key];
//           return (
//             <Step
//               key={index}
//               title={stage.name}
//               description={stage.enabled ? "Enabled" : "Disabled"}
//               disabled={!stage.enabled}
//             />
//           );
//         })}
//       </Steps>

//       {/* Content for the current step */}
//       <div
//         style={{
//           marginTop: "20px",
//           border: "1px solid #f0f0f0",
//           padding: "20px",
//           borderRadius: "4px",
//         }}
//       >
//         {renderStepContent()}
//       </div>
//     </div>
//   );
// };

// export default CustomStepper;

import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const CustomStepper = () => {
    const { quill, quillRef } = useQuill();
    const [valuesArray, setValuesArray] = useState([]);

    useEffect(() => {
        if (quill) {
            quill.on("text-change", () => {
                setValuesArray((prev) => [...prev.slice(-4), quill.root.innerHTML]); // Keep only last 5 entries
            });
        }
    }, [quill]);

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ width: "30%", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                <h3 style={{ textAlign: "center" }}>Submitted Values</h3>
                <ul style={{ padding: 0, listStyle: "none" }}>
                    {valuesArray.map((val, i) => (
                        <li key={i} style={{ borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                            <div dangerouslySetInnerHTML={{ __html: val }} />
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ width: "70%" }}>
                <div ref={quillRef} style={{ height: 200, border: "1px solid #ccc", borderRadius: "5px" }} />
            </div>
        </div>
    );
};

export default CustomStepper;
