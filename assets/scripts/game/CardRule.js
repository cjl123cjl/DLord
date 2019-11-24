/**
 * 游戏规则模块
 */

class CardRule {
    constructor() {
        console.log("CardRule Constructro.");

    }

    // 定义牌型
    ONE = 1;    // 单张
    PAIRS = 2;    // 对子
    THREE = 3;    // 三张
    THREE_WITH_ONE = 4;    // 三带一
    THREE_WITH_PAIRS = 5;    // 三代二
    PROGRESSION = 6;    // 顺子
    PROGRESSION_PAIRS = 7;    // 连对
    PLANE = 8;    // 飞机
    PLANE_WITH_ONE = 9;    // 飞机带单张
    PLANE_WITH_PAIRS = 10;    // 飞机带对子
    FOUR_WITH_TWO = 11;    // 四带二
    FOUR_WITH_TWO_PAIRS = 12;    // 四带两对
    BOMB = 13;    // 炸弹
    KING_BOMB = 14;    // 王炸

    /**
     * 是否是对子
     * @param {*} cards 
     */
    isPairs(cards) {
        return cards[0].val === cards[1].val;
    };

    /**
     * 是否是王炸
     * @param {*} cards 
     */
    isKingBomb(cards) {
        return cards[0].type == '0' && cards[1].type == '0';
    };

    /**
     * 是否是三张
     * @param {*} cards 
     */
    isThree(cards) {
        return (cards[0].val === cards[1].val && cards[1].val === cards[2].val);
    };

    /**
     * 是否是三带一
     * @param {*} cards 
     */
    isThreeWithOne(cards) {
        if (cards.length != 4)
            return false;
        var c = this.valCount(cards);
        return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
    }

    /**
     * 是否是三带二
     * @param {*} cards 
     */
    isThreeWithPairs(cards) {
        if (cards.length != 5)
            return false;
        var c = this.valCount(cards);
        return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
    };

    /**
     * 是否是顺子
     * @param {*} cards 
     */
    isProgression(cards) {
        if (cards.length < 5 || cards[0].val === 15)
            return false;
        for (var i = 0; i < cards.length; i++) {
            if (i != (cards.length - 1) && (cards[i].val - 1) != cards[i + 1].val) {
                return false;
            }
        }
        return true;
    };

    /**
     * 是否是连对
     * @param {*} cards 
     */
    isProgressionPairs(cards) {
        if (cards.length < 6 || cards.length % 2 != 0 || cards[0].val === 15)
            return false;
        for (var i = 0; i < cards.length; i += 2) {
            if (i != (cards.length - 2) && (cards[i].val != cards[i + 1].val || (cards[i].val - 1) != cards[i + 2].val)) {
                return false;
            }
        }
        return true;
    };

    /**
     * 是否是飞机
     * @param {*} cards 
     */
    isPlane(cards) {
        if (cards.length < 6 || cards.length % 3 != 0 || cards[0].val === 15)
            return false;
        for (var i = 0; i < cards.length; i += 3) {
            if (i != (cards.length - 3) && (cards[i].val != cards[i + 1].val || cards[i].val != cards[i + 2].val || (cards[i].val - 1) != cards[i + 3].val)) {
                return false;
            }
        }
        return true;
    };

    /**
     * 是否是飞机带单张
     * @param {*} cards 
     */
    isPlaneWithOne(cards) {
        if (cards.length < 8 || cards.length % 4 != 0)
            return false;
        var c = this.valCount(cards)
        var threeList = []
        var threeCount = cards.length / 4;
        for (var i = 0; i < c.length; i++) {
            if (c[i].count == 3) {
                threeList.push(c[i]);
            }
        }
        if (threeList.length != threeCount || threeList[0].val === 15) {//检测三根数量和不能为2
            return false;
        }
        for (i = 0; i < threeList.length; i++) {//检测三根是否连续
            if (i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val) {
                return false;
            }
        }
        return true;
    };

    /**
     * 是否是飞机带一对
     * @param {*} cards 
     */
    isPlaneWithPairs(cards) {
        if (cards.length < 10 || cards.length % 5 != 0)
            return false;
        var c = this.valCount(cards)
        var threeList = []
        var pairsList = []
        var groupCount = cards.length / 5;
        for (var i = 0; i < c.length; i++) {
            if (c[i].count == 3) {
                threeList.push(c[i]);
            }
            else if (c[i].count == 2) {
                pairsList.push(c[i]);
            } else {
                return false;
            }
        }
        if (threeList.length != groupCount || pairsList.length != groupCount || threeList[0].val === 15) {//检测三根数量和对子数量和不能为2
            return false;
        }
        for (i = 0; i < threeList.length; i++) {//检测三根是否连续
            if (i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val) {
                return false;
            }
        }
        return true;
    };

    /**
     * 是否是四带二
     * @param {*} cards 
     */
    isFourWithTwo(cards) {
        var c = this.valCount(cards);
        if (cards.length != 6 || c.length > 3) return false;
        for (var i = 0; i < c.length; i++) {
            if (c[i].count === 4)
                return true;
        }
        return false;
    };

    /**
     * 是否是四带两对
     * @param {*} cards 
     */
    isFourWithPairs(cards) {
        if (cards.length != 8) return false;
        var c = this.valCount(cards);
        if (c.length != 3) return false;
        for (var i = 0; i < c.length; i++) {
            if (c[i].count != 4 && c[i].count != 2)
                return false;
        }
        return true;
    };

    /**
     * 是否是炸弹
     * @param {*} cards 
     */
    isBomb(cards) {
        return cards.length === 4 && cards[0].val === cards[1].val && cards[0].val === cards[2].val && cards[0].val === cards[3].val;
    };

    /**
     * 牌型判定函数
     * @param {*} cards 
     */
    typeJudge(cards) {
        var len = cards.length;

        //根据张数来判定
        if (len == 1) {
            return { 'cardType': this.ONE, 'val': cards[0].val, 'size': len };
        } else if (len == 2) {
            if (this.isPairs(cards))
                return { 'cardType': this.PAIRS, 'val': cards[0].val, 'size': len };
            else if (this.isKingBomb(cards))
                return { 'cardType': this.KING_BOMB, 'val': cards[0].val, 'size': len };
            else
                return null;
        } else if (len == 3) {
            if (this.isThree(cards))
                return { 'cardType': this.THREE, 'val': cards[0].val, 'size': len };
            else
                return null;
        } else if (len == 4) {
            if (this.isThreeWithOne(cards)) {
                return { 'cardType': this.THREE_WITH_ONE, 'val': this.getMaxVal(cards, 3), 'size': len };
            } else if (this.isBomb(cards)) {
                return { 'cardType': this.BOMB, 'val': cards[0].val, 'size': len };
            }
            return null;
        } else {
            if (this.isProgression(cards))
                return { 'cardType': this.PROGRESSION, 'val': cards[0].val, 'size': len };
            else if (this.isProgressionPairs(cards))
                return { 'cardType': this.PROGRESSION_PAIRS, 'val': cards[0].val, 'size': len };
            else if (this.isThreeWithPairs(cards))
                return { 'cardType': this.THREE_WITH_PAIRS, 'val': this.getMaxVal(cards, 3), 'size': len };
            else if (this.isPlane(cards))
                return { 'cardType': this.PLANE, 'val': this.getMaxVal(cards, 3), 'size': len };
            else if (this.isPlaneWithOne(cards))
                return { 'cardType': this.PLANE_WITH_ONE, 'val': this.getMaxVal(cards, 3), 'size': len };
            else if (this.isPlaneWithPairs(cards))
                return { 'cardType': this.PLANE_WITH_PAIRS, 'val': this.getMaxVal(cards, 3), 'size': len };
            else if (this.isFourWithTwo(cards))
                return { 'cardType': this.FOUR_WITH_TWO, 'val': this.getMaxVal(cards, 4), 'size': len };
            else if (this.isFourWithPairs(cards))
                return { 'cardType': this.FOUR_WITH_TWO_PAIRS, 'val': this.getMaxVal(cards, 4), 'size': len };
            else
                return null;
        }
    }

    /**
     * 获取min到max之间的随机整数，min和max值都取得到
     * @param {*} min 
     * @param {*} max 
     */
    random(min, max) {
        min = min == null ? 0 : min;
        max = max == null ? 1 : max;
        var delta = (max - min) + 1;
        return Math.floor(Math.random() * delta + min);
    }

    /**
     * 牌统计，统计各个牌有多少张
     * @param {*} cards 
     */
    valCount(cards) {
        var result = [];
        var addCount = function (result, v) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].val == v) {
                    result[i].count++;
                    return;
                }
            }
            result.push({ 'val': v, 'count': 1 });
        };
        for (var i = 0; i < cards.length; i++) {
            addCount(result, cards[i].val);
        }
        return result;
    }

    /**
     * 获取指定张数的最大牌值
     * @param {*} cards 
     * @param {*} n 
     */
    getMaxVal(cards, n) {
        var c = this.valCount(cards);
        var max = 0;
        for (var i = 0; i < c.length; i++) {
            if (c[i].count === n && c[i].val > max) {
                max = c[i].val;
            }
        }
        return max;
    };
}

module.exports = CardRule;
