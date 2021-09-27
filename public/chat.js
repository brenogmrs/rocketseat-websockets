const socket = io(); 

const urlSeach = new URLSearchParams(window.location.search);
const username = urlSeach.get('username');
const room = urlSeach.get('select_room');

document.getElementById('username').innerHTML = `Olá ${username} você está na sala de ${room}`

socket.emit('select_room', {
  username, 
  room
}, messages => {
  messages.forEach(message => {
    createMessage(message)
  })
});

document
  .getElementById('message_input')
  .addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const message = event.target.value;

      const data = {
        room,
        message,
        username
      };

      socket.emit('message', data);

      event.target.value = '';
    }
})

socket.on('message', data => {
  createMessage(data);
})

const createMessage = (data) => {
  const messageDiv = document.getElementById('messages');
  messageDiv.innerHTML =`
    <div class="new_message">
      <label class="form-label">
        <strong>${data.username}:</strong>
        <span>
          ${data.text} - ${dayjs(data.createdAt).format('DD/MM HH:mm')}
        </span>
      </label>
    </div>
    `
}

document
  .getElementById('logout')
  .addEventListener('click', (event) => {
    window.location.href = "index.html"
  })
