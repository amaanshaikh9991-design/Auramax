import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import CognitiveTest from "./pages/CognitiveTest";
import Chat from "./pages/Chat";
import MyJourney from "./pages/MyJourney";
import Explore from "./pages/Explore";
import ResourceDetails from "./pages/ResourceDetails";
import Support from "./pages/Support";
import Profile from "./pages/Profile";

import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/app/home"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />

        <Route
          path="/app/check-in"
          element={
            <AppLayout>
              <CheckIn />
            </AppLayout>
          }
        />

        <Route
          path="/app/cognitive-test"
          element={
            <AppLayout>
              <CognitiveTest />
            </AppLayout>
          }
        />

      <Route
  path="/app/chat"
  element={
    <AppLayout>
      <Chat />
    </AppLayout>
  }
/>

<Route
  path="/app/chat/:sessionId"
  element={
    <AppLayout>
      <Chat />
    </AppLayout>
  }
/>
        <Route
          path="/app/journey"
          element={
            <AppLayout>
              <MyJourney />
            </AppLayout>
          }
        />

        <Route
          path="/app/explore"
          element={
            <AppLayout>
              <Explore />
            </AppLayout>
          }
        />

        <Route
          path="/app/explore/:topic"
          element={
            <AppLayout>
              <ResourceDetails />
            </AppLayout>
          }
        />

        <Route
          path="/app/support"
          element={
            <AppLayout>
              <Support />
            </AppLayout>
          }
        />

        <Route
          path="/app/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;