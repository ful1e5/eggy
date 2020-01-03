// tslint:disable-next-line: no-var-requires
require("dotenv").config({ path: "secret.env" });
import createServer from "./createServer";
import db from "./db";

const server = createServer();

// TODO use express middleware to handle coockie(JWT)
// TODO use express middleware to produce current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    // tslint:disable-next-line: no-invalid-template-strings
    console.log(`🚀 Server running on http://localhost:${deets.port}`);
  }
);
