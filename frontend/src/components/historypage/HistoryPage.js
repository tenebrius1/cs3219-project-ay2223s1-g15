import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const HistoryPage = ({ title, date, time, interviewer, difficulty }) => {
  const ptitle = "Two sum";
  const pdate = "5 October 2022";
  const ptime = "20:20";
  const pinterviewer = "Me";
  const pdifficulty = "Easy";
  let decideColor = "";

  if (pdifficulty === "Easy") {
    decideColor = "green";
  } else if (pdifficulty === "Medium") {
    decideColor = "orange";
  } else if (pdifficulty === "Hard") {
    decideColor = "red";
  } else {
    decideColor = "white";
  }

  return (
    <>
      <Box
        className="mainHistoryPageBox"
        sx={{
          marginTop: "2%",
          padding: "0 10%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          className="leftHistoryPageBox"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "75%",
            height: "90vh",
            marginRight: "2%",
            backgroundColor: "#2a2e38",
          }}
        >
          <Box
            className="historyPageQuestionInfo"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "2% 2%",
            }}
          >
            <Box
              className="historyPageCombinedInfo"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box
                className="historyPageTitleDifficulty"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant={"h5"}>{ptitle}&nbsp;</Typography>
                <Typography color={decideColor}>{pdifficulty}</Typography>
              </Box>
              <Typography>Interviewer: {pinterviewer}</Typography>
              <Typography>
                {ptime}, {pdate}
              </Typography>
            </Box>
          </Box>
          <Divider variant="middle" />
          <Box className="historyPageCode" sx={{ padding: "2% 2%" }}>
            <Typography>Code</Typography>
          </Box>
        </Box>
        <Box
          className="historyPageInterviewerComments"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "25%",
            height: "90vh",
            borderColor: "divider",
            backgroundColor: "#2a2e38",
          }}
        >
          <Typography sx={{ padding: "5% 2%" }} variant={"h5"}>
            Interviewer comments
          </Typography>
          <Divider variant="middle" />
          <Typography
            style={{ wordWrap: "break-word" }}
            sx={{ padding: "5% 2%" }}
          >
            Aliquip amet in labore nostrud incididunt. Ad sit nisi mollit amet
            velit officia eiusmod ut excepteur labore. Magna ut minim fugiat ea
            laborum.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default HistoryPage;
