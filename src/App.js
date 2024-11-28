import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingBar1 from './loadingbar/LoadingBar1';
import ADSignIn from './admin pages/ADSignIn/SignIn';
import AdHome from './admin pages/ADHome/AdHome';
import AdEntry from './admin pages/ADEntry/AdEntry';
import AdLeaderboard from './admin pages/ADLeaderboard/AdLeaderboard';
import AdProfile from './admin pages/ADProfile/AdProfile';
import AdLogout from './admin pages/ADLogout/Logout';
import LogoutDialog from './components/LogoutDialog'; // Corrected import path
import SUSignIn from './SuperUser pages/SUSignIn/SUSignIn';
import SUHome from './SuperUser pages/SUHome/SUHome';
import SUInsight from './SuperUser pages/SUInsight/SUInsight';
import SUDirectory from './SuperUser pages/SUDirectory/SUDirectory';
import SULeaderboard from './SuperUser pages/SULeaderboard/SULeaderboard';
import SUProfile from './SuperUser pages/SUProfile/SUProfile';
import WSInsightAnalytics from './admin pages/ADInsight/WSInsightAnalytics';

const App = () => {
  const handleClose = () => {
    console.log('Pop-up closed');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/loadingbar1" />} />
        <Route path="/loadingbar1" element={<LoadingBar1 />} />
        <Route path="/adsignin" element={<ADSignIn />} />
        <Route path="/adhome" element={<AdHome />} />
        <Route path="/adentry" element={<AdEntry />} />
        <Route path="/adleaderboard" element={<AdLeaderboard />} />
        <Route path="/adprofile" element={<AdProfile />} />
        <Route path="/adlogout" element={<AdLogout />} />
        <Route path="/adinsight" element={<WSInsightAnalytics />} />
        <Route path="/logoutdialog" element={<LogoutDialog />} />
        <Route path="/susignin" element={<SUSignIn />} />
        <Route path="/suhome" element={<SUHome />} />
        <Route path="/suinsight" element={<SUInsight />} />
        <Route path="/sudirectory" element={<SUDirectory />} />
        <Route path="/suleaderboard" element={<SULeaderboard />} />
        <Route path="/suprofile" element={<SUProfile />} />
<<<<<<< Updated upstream
       </Routes>
=======
        <Route path="/loadingbar2" element={<LoadingBar2 />} />
        <Route path="/wslandingpage" element={<WSLandingPage />} />
        <Route path="/wscontactus" element={<ContactUs />} />
        <Route path="/wsaboutus" element={<WSAboutUs />} />
        <Route path="/wsaboutus2" element={<WSAboutUs2 />} />
        <Route path="/wsaboutus3" element={<WSAboutUs3 />} />
        <Route path="/wsaboutus4" element={<WSAboutUs4 />} />
        <Route path="/wsaboutus5" element={<WSAboutUs5 />} />
        <Route path="/wssignupsignin" element={<SignUpSignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/successfullyregistered" element={<SuccessfullyRegistered />} />
        <Route path="/wshomepage" element={<WSHomepage />} />
        <Route path="/wscomment" element={<WSComment />} />
        <Route path="/wsreport" element={<WSReport />} />
        <Route path="/popupreport" element={<PopUpReport />} />
        <Route path="/popupfinal" element={<PopUpReportFinal />} />
        <Route path="/popuppermission" element={<PopUpPermission />} />
        <Route path="/popuppermissionloc" element={<PopUpPermissionLoc />} />
        <Route path="/popupconfirm" element={<PopUpConfirm />} />
        <Route path="/wsleaderboards" element={<WSLeaderboards />} />
        <Route path="/insightanalytics" element={<WSInsightAnalytics />} />
        <Route path="/wsprofile" element={<WSProfile />} />
        <Route path="/updatedpopup" element={<UpdatedPopUp />} />
        <Route path="/wslogout" element={<WSLogout />} />
        <Route path="/confirmlogout" element={<ConfirmLogout />} />
      </Routes>
>>>>>>> Stashed changes
    </Router>
  );
};

export default App;
