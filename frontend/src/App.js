import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./components/signuppage/SignupPage";
import Dashboard from "./components/dashboard/Dashboard";
import CodingPage from "./components/codingpage/CodingPage";
import SignInPage from "./components/signinpage/SignInPage";
import MatchingPage from "./components/matching/MatchingPage";
import PasswordResetPage from "./components/passwordreset/PasswordResetPage";
import PasswordResetConfirm from "./components/passwordreset/PasswordResetConfirm";
import HistoryPage from "./components/historypage/HistoryPage";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles.css";
import { RoomContextProvider } from "./contexts/RoomContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { UserContextProvider } from "./contexts/UserContext";
import NotFoundPage from "./components/notfoundpage/NotFoundPage";

export const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#3B4252",
    },
    secondary: {
      main: "#ECEFF4",
    },
    background: {
      default: "#2E3440",
      paper: "#3B4252",
    },
    divider: "#4C566A",
    text: {
      primary: "#ECEFF4",
    },
  },
});

function App() {
  return (
    <UserContextProvider>
      <RoomContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box className="App">
            <Router>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={<Navigate replace to="/login" />}
                />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/passwordreset" element={<PasswordResetPage />} />
                <Route
                  path="/passwordresetconfirm/:resetToken/"
                  element={<PasswordResetConfirm />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/codingpage"
                  element={
                    <PrivateRoute>
                      <CodingPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/matching"
                  element={
                    <PrivateRoute>
                      <MatchingPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <HistoryPage />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </Box>
        </ThemeProvider>
      </RoomContextProvider>
    </UserContextProvider>
  );
}

export default App;
