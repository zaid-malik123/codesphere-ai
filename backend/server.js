import http from "http"
import app from "./index.js"
import "dotenv/config"


const server = http.createServer(app)

const PORT = process.env.PORT

server.listen(PORT, ()=> {
    console.log(`server is running on this port http://localhost:${PORT}`)
})
