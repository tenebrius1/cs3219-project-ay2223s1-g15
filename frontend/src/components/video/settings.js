import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

export const config = { mode: "rtc", codec: "vp8" };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
