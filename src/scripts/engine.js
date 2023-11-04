const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points')
  },
  cardsSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card')
  },
  players: {
    player1: 'player-cards',
    player1BOX: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerBOX: document.querySelector('#computer-cards'),
  },
  actions: {
    button: document.getElementById('next-duel')
  },
};

const pathImages = './src/assets/icons/'

const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2]
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0]
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1]
  },
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function drawSelectedCard(id) {
  state.cardsSprites.avatar.src = cardData[id].img;
  state.cardsSprites.name.innerText = cardData[id].name;
  state.cardsSprites.type.innerText = 'Attribute : ' + cardData[id].type
}
async function removeAllCardsImages() {
  let { computerBOX, player1BOX }= state.players
  let imgElements = computerBOX.querySelectorAll('img');
  imgElements.forEach((img) => img.remove())

  imgElements = player1BOX.querySelectorAll('img');
  imgElements.forEach((img) => img.remove())
}

async function checkDuelResult(playerCardId, computerCardId) {
  let duelResults = "draw";
  let playerCard = cardData[playerCardId];

  if(playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win"
    await playAudio(duelResults)
    state.score.playerScore++
  }
  if(playerCard.LoseOf.includes(computerCardId)) {
    duelResults = 'lose';
    
    await playAudio(duelResults)
    state.score.computerScore++
  }

  return duelResults;
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = 'block';
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function showHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = 'block'
    state.fieldCards.computer.style.display = 'block'
  } else {
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
  }
}

async function setCardsFields(id) {
  await removeAllCardsImages();
  await showHiddenCardFieldsImages(true)
  
  let computerCardId = await getRandomCardId()

  state.fieldCards.player.src = cardData[id].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResult = await checkDuelResult(id, computerCardId)

  await updateScore();
  await drawButton(duelResult)
}

async function createCardImage(id, field) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '100px');
  cardImage.setAttribute('src', `${pathImages}card-back.png`);
  cardImage.setAttribute('data-id', id);
  cardImage.classList.add('card');
  if (field === state.players.player1) {
    cardImage.addEventListener('click', () => {
      setCardsFields(cardImage.getAttribute('data-id'))
    });
    cardImage.addEventListener('mouseover', () => {
      drawSelectedCard(id)
    });
  }

  return cardImage
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function playAudio(status){
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  try {
    audio.play()
  } catch (error) {
    
  }
}

function init() {
  drawCards(5, state.players.player1);
  drawCards(5, state.players.computer)
  const bgm = document.getElementById('bgm');
  bgm.play()
}

async function resetDuel() {
  state.cardsSprites.avatar.src = ''
  state.actions.button.style.display = 'none'
  state.fieldCards.player.style.display = 'none'
  state.fieldCards.computer.style.display = 'none'
  state.cardsSprites.name.innerText = '';
  state.cardsSprites.type.innerText = '';
  init()
}

init();