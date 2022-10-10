import { createContext } from "react";

const DifficultyContext = createContext({
    currentDifficulty: "None",
    setCurrentDifficulty: (difficulty) => {}
})

export default DifficultyContext;