import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import https from "https";
import fs from "fs";
import encryptRouter from "./routes/encrypt"
import decryptRouter from "./routes/decrypt"

dotenv.config({ path: "./.env" })

const app = express();
const PORT = parseInt(process.env.API_PORT!);
const ADDRESS = process.env.API_ADDRESS!;
const httpsOptions = {
    key: fs.readFileSync("../ssl/server.key"),
    cert: fs.readFileSync("../ssl/server.crt"),
};

app.use(express.json());
app.use(cors({
    origin: "*"
}));


// ===========================================================================
//   routes
// ===========================================================================
app.use("/api", encryptRouter);
app.use("/api", decryptRouter);

app.get("/", (req, res) => {
    return res.status(200).send("Grazie per aver accettato il certificato. Ora puoi iniziare a utilizzare l'app.");
});


https.createServer(httpsOptions, app).listen(PORT, ADDRESS, () => {
    console.log(`Server running on https://${ADDRESS}:${PORT}`);
}).on("error", err => {
    console.error(err);
    if (err.message.includes("ECONNRESET")) {
        console.warn("Connection reset by peer.");
    }
});