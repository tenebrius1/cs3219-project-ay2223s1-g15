import { useState, useEffect, useContext } from "react";
import Grid from "@mui/material/Grid";
import {
    useClient,
    useMicrophoneAndCameraTracks,
  } from "./settings.js";
import Video from "./Video";
import Controls from "./Controls";
import RoomContext from '../../contexts/RoomContext';
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from "../../api/video/video.js";

const appId = process.env.REACT_APP_AGORA_APP_ID ?? '';

export default function VideoCall(props) {
    const { setInCall } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const { user } = useAuth();
    const { roomId } = useContext(RoomContext);

    const generateToken = async (roomId) => {
      const token = await getToken(roomId);
      console.log(token)
      return token;
    }

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
    

        const token = await generateToken(channelName);

        console.log('join:', token)
        if(!token) {
          return;
        }

        await client.join(appId, channelName, token, null);

        if (tracks) {
            await client.publish([tracks[0], tracks[1]]);
        }
          setStart(true);
        };
    
        if (ready && tracks) {
            init(roomId);
        }
      }, [roomId, client, ready, tracks]);

      if (!client) {
        return null;
      }

      return (

        <Grid container direction="column" style={{ height: "100%" }}>
          <Grid item style={{ height: "20%" }}>
            {ready && tracks && (
              <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
            )}
          </Grid>
          <Grid item style={{ height: "80%" }}>
            {start && tracks && <Video tracks={tracks} users={users} />}
          </Grid>
        </Grid>

      );
}