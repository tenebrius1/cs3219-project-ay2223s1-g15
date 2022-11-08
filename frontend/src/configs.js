const URI_GATEWAY =
  process.env.ENV === "PROD"
    ? process.env.URI_GATEWAY
    : "http://localhost:8080";

const PREFIX_USER_SVC = "/user";
const PREFIX_MATCHING_SVC = "/matching";
const PREFIX_CODING_SVC = "/coding";
const PREFIX_HISTORY_SVC = "/history";
const PREFIX_QUESTION_SVC = "/question";

const URI_VIDEO_SVC =
  process.env.ENV === "PROD"
    ? process.env.URI_VIDEO_SVC
    : "http://localhost:8003";

const PREFIX_VIDEO_SVC = "/video";

export const URL_USER_SVC = URI_GATEWAY + PREFIX_USER_SVC;
export const URL_VIDEO_SVC = URI_GATEWAY + PREFIX_VIDEO_SVC;
export const URL_HISTORY_SVC = URI_GATEWAY + PREFIX_HISTORY_SVC;
export const URL_QUESTION_SVC = URI_GATEWAY + PREFIX_QUESTION_SVC;
