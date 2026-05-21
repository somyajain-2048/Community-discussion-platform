import dotenv from "dotenv";
dotenv.config();
import http from "http";

import app from "./app";
import { initSocket } from "./config/socket";

const PORT= process.env.PORT || 8000;

const server = http.createServer(app);
initSocket(server);



server.listen(PORT,()=>{
    console.log(`server running on port:${PORT}`)
})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         