import { io } from './http';

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string;
  text: string;
  username: string;
  createdAt: Date;
}

const users: RoomUser[] = []
const messages: Message[] = []

io.on('connection', socket => {

  socket.on('select_room', (data, callback) => {

    socket.join(data.room);

    const userInRoom = users.find(
      user => 
        data.username === user.username && 
        data.room === user.room
    )

    if (userInRoom) {
      userInRoom.socket_id = socket.id
    } else { 
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id
      })
    }

    const messagesFromRoom = getMessagesRoom(data.room);
    callback(messagesFromRoom);
  });

  socket.on('message', data => {
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date()
    };

    messages.push(message);

    io.to(data.room).emit('message', message)
  })
});

const getMessagesRoom = (room: string) => {
  const messagesFromRoom = messages.filter(message => message.room === room);

  return messagesFromRoom;
}