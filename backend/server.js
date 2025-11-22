import http from "http"
import app from "./index.js"
import "dotenv/config"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})


io.use((socket, next) => {
    
   try {
        
       const token =  socket.headers?.authorization?.split(" ")[1] || socket.handshake.auth.token ;

       if(!token){
         throw new Error("Authorization error")
       }

       const decoded = jwt.verify(token, process.env.JWT_SECRET)

       if(!decoded){
        throw new Error("Authorization Error")
       }

       socket.userId = decoded.userId

       next()
    
   } catch (error) {
       next(error)
   }

})

io.on('connection', (socket) => {
  console.log(`this is the user connected :- ${socket.id}`);
});

const PORT = process.env.PORT

server.listen(PORT, ()=> {
    console.log(`server is running on this port http://localhost:${PORT}`)
})
