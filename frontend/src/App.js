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
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles.css";

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App">
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={<Navigate replace to="/signup" />}
            ></Route>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/codingpage" element={<CodingPage />} />
            <Route path="/login" element={<SignInPage />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
