const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000'

const PREFIX_USER_SVC = '/api/user'

const URI_VIDEO_SVC = process.env.URI_VIDEO_SVC || 'http://localhost:8003'

const PREFIX_VIDEO_SVC = '/rtctoken'

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC
export const URL_VIDEO_SVC = URI_VIDEO_SVC + PREFIX_VIDEO_SVC
