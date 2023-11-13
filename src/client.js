(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`);
  const chats = document.getElementById('chats');
  const input = document.getElementById('input');
  const button = document.getElementById('button');
  const formEl = document.getElementById('form');

  const chatsData = [];

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.send(
      JSON.stringify({
        message: input.value,
        nickname: '누구세요',
      }),
    );
    input.value = '';
  });

  socket.addEventListener('message', (event) => {
    chatsData.push(JSON.parse(event.data));
    chats.innerHTML = '';

    chatsData.forEach(({ message, nickname }) => {
      const div = document.createElement('div');
      div.innerText = `${nickname} : ${message}`;
      chats.appendChild(div);
    });
  });
})();
