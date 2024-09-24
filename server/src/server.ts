import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import app from "./app";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

const isHttps = process.env.USE_HTTPS === "true";

if (isHttps) {
  const projectRoot = path.dirname(__dirname);
  const key = fs.readFileSync(
    path.resolve(projectRoot, process.env.SSL_KEY_PATH || "./certs/server.key"),
  );
  const cert = fs.readFileSync(
    path.resolve(
      projectRoot,
      process.env.SSL_CERT_PATH || "./certs/server.cert",
    ),
  );
  const options = { key, cert };
  const httpsServer = https.createServer(options, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS Recipe Server is running on port: ${HTTPS_PORT}`);
  });
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(HTTP_PORT, () =>
    console.log(`HTTP Recipe Server is running on port: ${HTTP_PORT}`),
  );
}
