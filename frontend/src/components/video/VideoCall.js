import { useState, useEffect, useContext } from "react";
import { useClient, useMicrophoneAndCameraTracks } from "./settings.js";
import Video from "./Video";
import Controls from "./Controls";
import RoomContext from "../../contexts/RoomContext";
import { useAuth } from "../../contexts/AuthContext";
import { URL_VIDEO_SVC } from "./../../configs";
import axios from "axios";
import Grid from "@mui/material/Grid";

const appId = process.env.AGORA_APP_ID ?? "";

export default function VideoCall(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const { user } = useAuth();
  const { roomId } = useContext(RoomContext);

  const getToken = async (roomId) => {
    const res = await axios
      .post(`${URL_VIDEO_SVC}`, { roomId })
      .then((res) => {
        console.log(res);
        return res.token;
      })
      .catch((err) => {
        return "";
      });
    return res;
  };

  useEffect(() => {
    if (!appId) {
      return;
    }
    let init = async (channelName) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      try {
        const token = await getToken(channelName);
        await client.join(appId, channelName, token, null);
      } catch (error) {
        console.log("error");
      }

      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
      }
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(roomId);
      } catch (error) {
        console.log(error);
      }
    }
  }, [roomId, client, ready, tracks]);

  if (!client || !user) {
    return null;
  }

  return (
    <Grid container direction="column" style={{ height: "100%" }}>
      <Grid item style={{ height: "5%" }}>
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </Grid>
      <Grid item style={{ height: "95%" }}>
        {start && tracks && <Video tracks={tracks} users={users} />}
      </Grid>
    </Grid>
  );
}
