<template>
  <div class="test-container">
    <div class="game-board">
      <h1>In-Between Card Game</h1>
      <p><strong>Pot:</strong> {{ gameStore.pot }}</p>

      <div v-if="!gameStore.gameOver">
        <div v-if="gameStore.awaitingEqualChoice" class="equal-cards-choice">
          <h3>Cards are Equal! Choose your play:</h3>
          <button @click="gameStore.handleEqualCardsChoice('higher')">Play Higher</button>
          <button @click="gameStore.handleEqualCardsChoice('lower')">Play Lower</button>
        </div>

        <!-- If third card not drawn yet -->
        <div v-if="!gameStore.currentCard">
          <h3>Face-up Cards:</h3>
          <div class="face-up-cards">
            <div v-for="(card, index) in gameStore.faceUpCards" :key="index" class="card">
              {{ card.rank }} of {{ card.suit }}
            </div>
          </div>

          <div class="bet-section">
            <input type="number" v-model.number="betAmount" placeholder="Enter your bet" />
            <button @click="placeBet">Place Bet</button>
            <button @click="drawThirdCard">Draw Third Card</button>
          </div>
          <p class="message">{{ gameStore.message }}</p>
        </div>
      </div>

      <!-- Game over section -->
      <div v-else>
        <h2>Game Over!</h2>
        <p class="message">{{ gameStore.message }}</p>
        <button @click="restartGame">Restart Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'
import { ref } from 'vue'

// Access the game store
const gameStore = useGameStore()

// Start a new game when the component loads.
gameStore.startGame()

// Reactive local state for the bet input.
const betAmount = ref<number>(0)

// Trigger the store action to place a bet.
function placeBet() {
  gameStore.placeBet(betAmount.value)
}

// Draw the third card.
function drawThirdCard() {
  gameStore.drawThirdCard()
}

// Restart the game.
function restartGame() {
  betAmount.value = 0
  gameStore.startGame()
}
</script>

<style scoped>
.test-container {
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.game-board {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  font-family: sans-serif;
}

.face-up-cards {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.card {
  border: 1px solid #aaa;
  padding: 10px;
  border-radius: 4px;
  min-width: 80px;
}

.bet-section input {
  width: 100px;
  margin-right: 10px;
}

.message {
  margin-top: 1rem;
  font-style: italic;
}
</style>
