/**
 * AI逻辑
 */

class AILogic {
    constructor(p) {
        console.log("AILogic");
        this.player = p;
        this.nextAIPlayer = null;
        //this.cards = p.cardList.slice(0);
        //this.analyse();

    }

    /**
     * 手牌评分，用于叫分阶段
     */
    judgeScore() {
        var self = this,
            score = 0;
        score += self._bomb.length * 6;//有炸弹加六分
        if (self._kingBomb.length > 0) {//王炸8分
            score += 8;
        } else {
            if (self.cards[0].val === 17) {
                score += 4;
            } else if (self.cards[0].val === 16) {
                score += 3;
            }
        }
        for (var i = 0; i < self.cards.length; i++) {
            if (self.cards[i].val === 15) {
                score += 2;
            }
        }
        console.log(self.player.name + "手牌评分：" + score);
        if (score >= 7) {
            return 3;
        } else if (score >= 5) {
            return 2;
        } else if (score >= 3) {
            return 1;
        } else {//4相当于不叫
            return 4;
        }
    }


}
