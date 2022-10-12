import { createContext } from "react";

const DifficultyContext = createContext({
    currentDifficulty: "",
    setCurrentDifficulty: (difficulty) => {}
})

export default DifficultyContext;