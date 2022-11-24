const functions = require("firebase-functions");
const axios = require("axios");
const defaultAvatar = "https://storage.googleapis.com/aoe3-companion.appspot.com/public/flag_random_1x1.png";
const steamDefaultHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";
const cors = require("cors")({origin: true});
const baseURL = "https://api.steampowered.com";
const appid = "933110";

exports.steamSummary = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const steamId = req.query.steamId;
    let playerSummary = null;

    axios.get(`${baseURL}/ISteamUser/GetPlayerSummaries/v2/`, {
      params: {
        key: process.env.STEAM_KEY,
        steamids: steamId,
      },
    }).then((resp) => {
      if (resp.data) {
        const [player] = resp.data.response.players;

        if (player) {
          playerSummary = player;

          if (playerSummary.avatarhash === steamDefaultHash) {
            playerSummary.avatarfull = defaultAvatar;
          }
        }
      }

      res.send(playerSummary);
    }).catch((error) => {
      return res.status(500).json({error});
    });
  });
});


exports.getCurrentPlayers = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    axios.get(`${baseURL}/ISteamUserStats/GetNumberOfCurrentPlayers/v1/`, {
      params: {
        key: process.env.STEAM_KEY,
        appid,
      },
    }).then((resp) => {
      res.send(resp.data.response);
    }).catch((error) => {
      return res.status(500).json({error});
    });
  });
});
