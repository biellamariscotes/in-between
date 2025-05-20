<template>
  <el-dialog v-model="showRules" title="GameRules" width="1200" align-center>
    <div class="demo-collapse">
      <h2><b>GAME RULES</b></h2>
      <br />
      <el-collapse>
        <el-collapse-item title="Game Objective" name="1">
          <div>
            Win the pot by drawing a card that meets the winning condition based on your initial two
            cards.
          </div>
          <div>
            Example: you start with the cards 1 and 6, you must decide whether to bet any amount, go
            all-in, or fold during the betting phase. To win the round, you need to draw a card with
            a value between 2 and 5. If you draw a 3, for instance, you win the pot. However, if you
            draw a card equal to 1 or 6, or any card higher than 6 (such as 7, 8, 9, 10, J, Q, or
            K), you lose the round.
          </div>
        </el-collapse-item>

        <el-collapse-item title="Player Composition" name="2">
          <div>
            The game requires a minimum of 3 players to begin and can accommodate a maximum of 6.
            For the best and most balanced gameplay experience, it is recommended to have between
            three to six players participating in each round.
          </div>
        </el-collapse-item>

        <el-collapse-item title="Deck and Cards" name="3">
          <div>
            The game utilizes four standard 52-card decks combined, resulting in a total of 208
            cards. Each deck consists of 13 cards in each of the four suits: Hearts, Diamonds,
            Clubs, and Spades.
          </div>
          <div>
            The cards are ranked as follows: Ace (A), numbers 2 through 10, followed by Jack (J),
            Queen (Q), and King (K).
          </div>
        </el-collapse-item>

        <el-collapse-item title="Starting Pot" name="4">
          <div>
            At the beginning of each round, every player is required to contribute a fixed amount of
            100 PHP to form the starting pot. This ensures that there are initial stakes in play
            before the betting phase begins.
          </div>
          <div>
            For example, if there are four players participating in the round, the total starting
            pot will amount to 400 PHP. The accumulated pot will continue to grow as players place
            additional bets throughout the game, with the final pot awarded to the winner of the
            round.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Betting Rules" name="5">
          <div>
            During the betting phase, each player may bet, go all-in, or pass on their turn. The
            minimum bet is 100 PHP, while the maximum bet is equal to the current pot amount.
          </div>
          <div>
            Players have 30 seconds to act, and failure to do so results in an automatic fold.
          </div>
        </el-collapse-item>

        <el-collapse-item title="Turn Order" name="6">
          <div>
            Player 1 will be the first to take their turn at the start of the round. After Player 1
            has acted, play will continue in a counterclockwise direction,
          </div>
          <div>
            moving systematically from one player to the next until the round is complete. This
            order ensures a fair and organized flow of gameplay throughout the entire session.
          </div>
        </el-collapse-item>

        <el-collapse-item title="Gameplay Flow" name="7">
          <div>
            At the start of each round, every player is dealt two face-down cards. On your turn, you
            may choose to bet, go all-in, or pass. If you decide to bet, you will draw one card from
            the deck. For players with non-pair starting cards, the goal is to draw a card with a
            value strictly between the two initial cards to win; drawing a card equal to either or
            outside the range results in a loss.
          </div>
          <div>
            For players with pair starting cards, they must choose whether the next drawn card will
            be higher or lower. The player wins if the drawn card satisfies their chosen condition
            and loses if the card is equal to or breaks that condition. When a player wins, they
            collect the pot minus any applicable tax, and a new round begins. If a player loses, the
            turn passes to the next player to continue the game.
          </div>
        </el-collapse-item>

        <el-collapse-item title="Comission/Tax" name="8">
          <div>
            A 5% commission fee is deducted from the total pot whenever a player wins by either
            going all-in or placing any amount as a bet. This fee is collected before awarding the
            remaining winnings to the player and serves as the standard commission for every
            victorious round.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Special Conditions" name="9">
          <div>
            An All-In Win triggers the start of a new round, requiring all players to contribute the
            initial starting pot once again. To ensure fairness, equal contributions from every
            player are enforced at the beginning of each round.
          </div>
          <div>
            Additionally, it is recommended to keep the number of players between three to six, as
            gameplay tends to slow down and become less manageable with more than six participants.
            This ideal player count helps maintain a smooth and engaging pace throughout the game.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Game End Condition" name="10">
          <div>
            The game ends when the entire deck has been used. Once this happens, a new deck will be
            provided to continue the game.
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
const showRules = defineModel()
</script>

<style scooped></style>
