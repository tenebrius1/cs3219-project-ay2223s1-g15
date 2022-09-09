import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import "./dashboard.css";
import { useState, useEffect } from "react";

function Dashboard() {
    const [buttonToggleEasy, setButtonToggleEasy] = useState(false);
    const [buttonToggleMedium, setButtonToggleMedium] = useState(false);
    const [buttonToggleHard, setButtonToggleHard] = useState(false);

    const toggleButtonEasy = (event) => {
        event.preventDefault();
        if (!(buttonToggleEasy || buttonToggleMedium || buttonToggleHard)) {
            setButtonToggleEasy(true);
        } else {
            setButtonToggleEasy(false);
        }
    }

    const toggleButtonMedium = (event) => {
        event.preventDefault();
        if (!(buttonToggleEasy || buttonToggleMedium || buttonToggleHard)) {
            setButtonToggleMedium(true);
        } else {
            setButtonToggleMedium(false);
        }
    }

    const toggleButtonHard = (event) => {
        event.preventDefault();
        if (!(buttonToggleEasy || buttonToggleMedium || buttonToggleHard)) {
            setButtonToggleHard(!buttonToggleHard);
        } else {
            setButtonToggleHard(false);
        }
    }

    const handleClickEasy = () => buttonToggleEasy ? "contained" : "outlined";
    const handleClickMedium = () => buttonToggleMedium ? "contained" : "outlined";
    const handleClickHard = () => buttonToggleHard ? "contained" : "outlined";

    return (
        <Box className="mainBox">
            <Box className="topBar">
                <Typography variant={"h3"}>PeerPrep</Typography>
                <Avatar />
            </Box>
            <Box className="mainContent">
                <Box className="leftBox">
                    Reprehenderit occaecat nulla ex laboris do. Anim magna laboris ad dolore pariatur ex non aliquip ipsum non nisi. Esse exercitation et voluptate laborum eiusmod id ex magna laborum amet. Sunt nostrud officia enim officia excepteur non deserunt adipisicing amet reprehenderit anim sunt exercitation aute. Minim quis adipisicing laboris proident officia non non fugiat reprehenderit amet. Velit consectetur eiusmod aliquip ea qui ipsum ad veniam reprehenderit pariatur.
                </Box>
                <Box className="rightBox">
                    <Typography className="difficultyButton" variant={"h5"}>Difficulty</Typography>
                    <Button className="difficultyButton" color={"success"} variant={handleClickEasy()} onClick={toggleButtonEasy}>Easy</Button>
                    <Button className="difficultyButton" color={"warning"} variant={handleClickMedium()} onClick={toggleButtonMedium}>Medium</Button>
                    <Button className="difficultyButton" color={"error"} variant={handleClickHard()} onClick={toggleButtonHard}>Hard</Button>
                    <Button className="queueUpButton" color={"info"} variant={"contained"}>Queue Up</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard;
