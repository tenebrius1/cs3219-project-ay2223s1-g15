import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;
import "dotenv/config";

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

export const generateAccessToken = (req, res) => {
  const { channel } = req.body;
  if (!channel) {
    return res.status(500).json({message:"Channel is missing!"});
  }

  const role = RtcRole.PUBLISHER;
  const uid = Math.floor(Math.random() * 100000);
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
  const token = RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channel,
    uid,
    role,
    privilegeExpiredTs,
  );
  return res.json({ token });
};