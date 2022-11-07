import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import TabPanel from "./TabPanel";
import "./codingpage.css";
import Typography from "@mui/material/Typography";

function BasicTab({ output }) {
  const [value, setValue] = useState(0);
  const [isEndTurn, setIsEndTurn] = useState(false);
  const tabPanelHeight = "75vh";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleEndTurn = () => {
    setIsEndTurn(true);
  };

  const handleEndTurnCancel = () => {
    setIsEndTurn(false);
  };

  return (
    <>
      <Box className="adminArea">
        <Box sx={{ borderColor: "divider" }}>
          <Tabs
            value={value}
            variant={"fullWidth"}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor={"secondary"}
            indicatorColor={"secondary"}
          >
            <Tab label="Question" {...a11yProps(0)} />
            <Tab label="Notes" {...a11yProps(1)} />
            <Tab label="Output" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel
          children={
            "Mollit adipisicing incididunt magna qui occaecat cupidatat. Qui ipsum ipsum aute veniam aute quis magna minim exercitation enim elit. Laboris excepteur occaecat tempor sint sit amet ullamco veniam. Eiusmod ut incididunt esse ex exercitation labore Lorem adipisicing aliquip deserunt ipsum in nostrud magna. Pariatur dolor pariatur culpa est veniam non laborum cillum nostrud. Officia commodo proident fugiat officia tempor mollit adipisicing laborum quis ipsum et. Ullamco culpa Lorem nostrud aliqua consequat irure tempor anim fugiat ullamco. Duis nostrud exercitation nisi dolor duis quis est laboris labore cillum minim. Non elit veniam ad commodo. Lorem Lorem adipisicing esse commodo exercitation pariatur incididunt commodo exercitation. Do fugiat aute voluptate officia esse ut veniam magna. Pariatur voluptate qui magna veniam est sint excepteur voluptate ullamco eu eiusmod ut quis. Nulla anim adipisicing ad adipisicing ut. Nisi veniam reprehenderit proident laborum dolor velit veniam sint. Cillum aute anim aliqua nisi officia occaecat irure nisi fugiat ex. Lorem reprehenderit ut quis pariatur deserunt laborum qui consectetur in officia. Ex fugiat ex tempor nisi excepteur laborum enim amet fugiat officia aliquip. Reprehenderit deserunt magna ipsum elit sunt nisi do. Velit incididunt minim sint mollit cupidatat Lorem eu. Ullamco ex qui ullamco nisi eiusmod ut ea. Exercitation commodo nostrud velit consequat eu sunt voluptate cupidatat id quis nostrud anim. Deserunt est aute officia nulla."
          }
          value={value}
          index={0}
          height={tabPanelHeight}
        />
        <TabPanel
          children={
            <TextField
              fullWidth
              multiline
              variant="filled"
              placeholder={"Write your notes here"}
              color={"secondary"}
              focused={true}
              InputProps={{
                disableUnderline: true,
                sx: {
                  height: "75vh",
                  maxHeight: "75vh",
                  alignItems: "flex-start",
                  overflow: "auto",
                },
              }}
              margin="none"
            />
          }
          value={value}
          index={1}
          height={tabPanelHeight}
        />
        <TabPanel
          children={output}
          value={value}
          index={2}
          height={tabPanelHeight}
        />
      </Box>
      <Box className="endTurnBox">
        {isEndTurn ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "50%",
              }}
            >
              <CircularProgress
                size={"1rem"}
                color="inherit"
                sx={{ marginLeft: "2%", marginRight: "5%" }}
              />
              <Typography variant="caption">Swapping roles...</Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={handleEndTurnCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "50%",
              }}
            ></Box>
            <Button variant="outlined" color="error" onClick={handleEndTurn}>
              End Turn
            </Button>
          </>
        )}
      </Box>
    </>
  );
}

export default BasicTab;
