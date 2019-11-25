/**
 * 玩家类
 */

class Player {
    /**
     * 初始化玩家信息
     * @param {*} index 玩家编号
     * @param {*} array 牌组
     */
    constructor(index, array) {
        this.isLandlord = false;    // 初始化玩家身份
        this.pIndex = index;    // 初始化玩家编号
        this.isAi = true;    // 是否是AI玩家
        this.cardList = array;    // 初始化牌组
        this.nextPlayer = null;    // 下一家
        this.score = 0;    // 初始化分数
    }

    /**
     * 设置玩家分数
     * @param {*} score 分数
     */
    follow(score) {
        this.score = score;
    }
}

module.exports = Player;