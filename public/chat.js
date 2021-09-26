const socket = io(); 

const urlSeach = new URLSearchParams(window.location.search);
const username = urlSeach.get('username');
const room = urlSeach.get('select_room');
