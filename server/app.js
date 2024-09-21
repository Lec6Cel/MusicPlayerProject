const express = require("express");
const app = express();
require("dotenv/config");

const cors = require("cors");
const {default : mongoose} = require("mongoose");

app.use(cors({origin : true}));
app.use(express.json());

app.get("/",(req, res) => {
    return res.json("Hi there...")
})
//user authentication route
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// //artist routes
const artistsRoutes = require("./routes/artist");
app.use("/api/artists", artistsRoutes);

// //albums routes
const albumsRoutes = require("./routes/albums");
app.use("/api/albums", albumsRoutes);

// //songs routes
const songsRoutes = require("./routes/songs");
app.use("/api/songs", songsRoutes);


mongoose.connect(process.env.DB_STRING);
mongoose.connection
.once("open", () => console.log("Connected"))
.on("error", (error) => {
    console.log(`ERROR : ${error}`);
})
app.listen(4000, () => console.log("Listening to port 4000"));