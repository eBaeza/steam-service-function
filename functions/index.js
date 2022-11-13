const functions = require("firebase-functions");
const axios = require("axios");
const defaultAvatar = "https://storage.googleapis.com/aoe3-companion.appspot.com/public/flag_random_1x1.png";
const steamDefaultHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";

const baseURL = "https://api.steampowered.com";

exports.steamSummary = functions.https.onRequest((req, res) => {
  const steamId = req.query.steamId;
  let playerSummary = null;

  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    return res.status(204).send("");
  }

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
