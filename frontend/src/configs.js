const URI_GATEWAY = process.env.URI_GATEWAY || 'http://localhost:8080';

const PREFIX_USER_SVC = '/user';
const PREFIX_MATCHING_SVC = '/matching';
const PREFIX_CODING_SVC = '/coding';
const PREFIX_HISTORY_SVC = '/history';

const URI_VIDEO_SVC = process.env.URI_VIDEO_SVC || 'http://localhost:8003';

const PREFIX_VIDEO_SVC = '/rtctoken';

export const URL_USER_SVC = URI_GATEWAY + PREFIX_USER_SVC;
export const URL_VIDEO_SVC = URI_VIDEO_SVC + PREFIX_VIDEO_SVC;
export const URL_HISTORY_SVC = URI_GATEWAY + PREFIX_HISTORY_SVC;
