// import {BrowserRouter, Route, Routes} from "react-router-dom";
// import {FormComponent, Main, ProtectedRoute, UsersideUpdate} from "./components";

// import ArchitectPortal from "./pages/ArichitechPortal/Index";

// import {Activity, Architect, ContactUs, LeadContent, PageNotFound, Static, UserLogin, Testfile} from "./pages";

// import Leads from "./pages/Leads/LeadItems";
// import {Design, DesignContent} from "./pages/Design";
// import {Work, WorkContent} from "./pages/Work";

// function App() {
//   return (
//     <>
//       {/* <BrowserRouter>
//         <Routes>
//           <Route path="/test" element={<Testfile />} />
//           <Route path="/architect" element={<ArchitectPortal portalType="architect" />} />
//           <Route path="/master" element={<ArchitectPortal portalType="master" />} />
//           <Route path="/" element={<Static />} />
//           <Route path="/login" element={<UserLogin />} />
//           <Route path="/contactus" element={<ContactUs />} />
//           <Route path="/userupdate" element={<UsersideUpdate />} />
//           <Route element={<ProtectedRoute />}>
//             <Route path="/pannel" element={<Main />}>
//               <Route index element={<Leads />} />
//               <Route path="leads" element={<Leads />} />
//               <Route path="leaditem/:id" element={<LeadContent />} />
//               <Route path="design" element={<Design />} />
//               <Route path="designitem/:id" element={<DesignContent />} />
//               <Route path="add/design" element={<FormComponent mode={"add"} />} />
//               <Route path="activity" element={<Activity />} />
//               <Route path="architect" element={<Architect />} />
//               <Route path="work" element={<Work />} />
//               <Route path="workitem/:id" element={<WorkContent />} />
//             </Route>
//           </Route>
//           <Route path="*" element={<PageNotFound />} />
//         </Routes>
//       </BrowserRouter> */}
//       <BrowserRouter>
//         <Routes>
//           <Route path="/test" element={<Testfile />} />
//           <Route path="/architect" element={<ArchitectPortal portalType="architect" />} />
//           <Route path="/master" element={<ArchitectPortal portalType="master" />} />
//           <Route path="/" element={<Static />} />
//           <Route path="/login" element={<UserLogin />} />
//           <Route path="/contactus" element={<ContactUs />} />
//           <Route path="/userupdate" element={<UsersideUpdate />} />

//           {/* Protect /pannel routes */}
//           <Route element={<ProtectedRoute />}>
//             <Route path="/pannel" element={<Main />}>
//               <Route index element={<Leads />} />
//               <Route path="leads" element={<Leads />} />
//               <Route path="leaditem/:id" element={<LeadContent />} />
//               <Route path="design" element={<Design />} />
//               <Route path="designitem/:id" element={<DesignContent />} />
//               <Route path="add/design" element={<FormComponent mode={"add"} />} />
//               <Route path="activity" element={<Activity />} />
//               <Route path="architect" element={<Architect />} />
//               <Route path="work" element={<Work />} />
//               <Route path="workitem/:id" element={<WorkContent />} />
//             </Route>
//           </Route>
//           <Route path="*" element={<PageNotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {FormComponent, Main, UsersideUpdate} from "./components";
import ArchitectPortal from "./pages/ArichitechPortal/Index";
// import { Activity, Architect, ContactUs, LeadContent, PageNotFound, Static, UserLogin, Testfile } from "./pages";
import {
  Activity,
  Architect,
  ContactUs,
  LeadContent,
  LiveEstimation,
  PageNotFound,
  Static,
  Testfile,
  UserLogin,
  UserUpdates,
} from "./pages";
import Leads from "./pages/Leads/LeadItems";

import UndeProcessing from "./pages/UnderProcessing";
import {Design, DesignContent} from "./pages/Design";
import {Work, WorkContent} from "./pages/Work";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = sessionStorage.getItem("jwt");
  return token ? true : false;
};

// Protected Route Component
const ProtectedRoute = ({children}) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/maintenance" element={<UndeProcessing />} />
          <Route path="/test" element={<Testfile />} />
          <Route path="/architect" element={<ArchitectPortal portalType="architect" />} />
          <Route path="/master" element={<ArchitectPortal portalType="master" />} />
          <Route path="/" element={<Static />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/contactpage" element={<ContactUs />} />

          <Route
            path="/userupdate/:id"
            element={
              <ProtectedRoute roles={["customer"]}>
                <UserUpdates />
              </ProtectedRoute>
            }
          />
          <Route path="/liveestimation" element={<LiveEstimation />} />

          <Route
            path="/pannel"
            element={
              <ProtectedRoute roles={["architect", "master"]}>
                <Main />
              </ProtectedRoute>
            }
          >
            <Route index element={<Leads />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leaditem/:id" element={<LeadContent />} />
            <Route path="design" element={<Design />} />
            <Route path="designitem/:id" element={<DesignContent />} />
            <Route path="add/design" element={<FormComponent mode={"design"} />} />
            <Route path="editdesign/:id" element={<FormComponent mode={"design"} />} />
            <Route path="activity" element={<Activity />} />
            <Route path="architect" element={<Architect />} />
            <Route path="work" element={<Work />} />
            <Route path="workitem/:id" element={<WorkContent />} />
            <Route path="add/work" element={<FormComponent mode={"work"} />} />
            <Route path="editwork/:id" element={<FormComponent mode={"work"} />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
