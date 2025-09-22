import http from "node:http";
import app from "./app";

const PORT = 8000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
