import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const PORT = process.env.HTTP_PORT;

app.listen(PORT, () =>
  console.log(`Recipe Server is running on port: ${PORT}`),
);
