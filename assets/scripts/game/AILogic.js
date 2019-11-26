/**
 * AI逻辑
 */

class AICardType {
    constructor(v, list) {
        this.val = v;
        this.cardList = list;
    }
}

class AILogic {
    constructor(p) {
        console.log("AILogic");
        this.player = p;
        this.nextAIPlayer = null;
        //this.cards = p.cardList.slice(0);
        //this.analyse();

    }

    /**
     * 跟牌，AI根据上家牌出牌
     * @param {object} winc 当前牌面最大的牌
     * @param {boolean} isWinnerIsLandlord 当前最大是否是地主
     * @param {number} winnerCardCount 当前最大那家剩余手牌数
     */
    follow(winc, isWinnerIsLandlord, winnerCardCount) {
        var self = this;
        self.log();
        var result = (function () {
            switch (winc.cardKind) {//判断牌型
                case cardRule.ONE://单牌
                    var one = self.matchCards(self._one, cardRule.ONE, winc, isWinnerIsLandlord, winnerCardCount);
                    if (!one) {
                        if (isWinnerIsLandlord || self.player.isLandlord) {
                            for (var i = 0; i < self.cards.length; i++) {
                                if (self.cards[i].val <= 15 && self.cards[i].val > winc.val) {
                                    return {
                                        cardList: self.cards.slice(i, i + 1),
                                        cardKind: cardRule.ONE,
                                        size: 1,
                                        val: self.cards[i].val
                                    };
                                }
                            }
                        }
                        if (self.times <= 1 && self._pairs.length > 0 && self._pairs[0].val > 10) {//剩下一对大于10拆牌
                            var c = self.cards.slice(0, 1);
                            if (c[0].val > winc.val) {
                                return {
                                    cardList: c,
                                    cardKind: cardRule.ONE,
                                    size: 1,
                                    val: c[0].val
                                };
                            } else {
                                return null;
                            }
                        }
                    }
                    return one;
                case cardRule.PAIRS://对子
                    var pairs = self._pairs.length > 0 ? self.matchCards(self._pairs, cardRule.PAIRS, winc, isWinnerIsLandlord, winnerCardCount) : null;
                    if (pairs == null && (isWinnerIsLandlord || self.player.isLandlord)) {//对手需要拆牌大之
                        //从连对中拿对
                        if (self._progressionPairs.length > 0) {
                            for (var i = self._progressionPairs.length - 1; i >= 0; i--) {
                                if (winc.val >= self._progressionPairs[i].val) continue;
                                for (var j = self._progressionPairs[i].cardList.length - 1; j >= 0; j -= 2) {
                                    if (self._progressionPairs[i].cardList[j].val > winc.val) {
                                        var pairsFromPP = self._progressionPairs[i].cardList.splice(j - 1, 2);
                                        return {
                                            cardList: pairsFromPP,
                                            cardKind: cardRule.PAIRS,
                                            size: 2,
                                            val: pairsFromPP[0].val
                                        };
                                    }
                                }
                            }
                        } else if (self._three.length > 0) {
                            for (var i = self._three.length - 1; i >= 0; i--) {
                                if (self._three[i].val > winc.val) {
                                    return {
                                        cardList: self._three[i].cardList.slice(0, 2),
                                        cardKind: cardRule.PAIRS,
                                        size: 2,
                                        val: self._three[i].val
                                    };
                                }
                            }
                        }
                    }
                    return pairs;
                case cardRule.THREE://三根
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    return self.matchCards(self._three, cardRule.THREE, winc, isWinnerIsLandlord, winnerCardCount);

                case cardRule.THREE_WITH_ONE://三带一
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    var three = self.minCards(self._three, cardRule.THREE, winc.val);
                    if (three) {
                        var one = self.minOne(2, three.val);
                        if (!one) {
                            return null;
                        } else {
                            three.cardList.push(one);
                        }
                        three.cardKind = cardRule.THREE_WITH_ONE;
                        three.size = 4;
                    }
                    return three;

                case cardRule.THREE_WITH_PAIRS: //三带一对
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    var three = self.minCards(self._three, cardRule.THREE, winc.val);
                    if (three) {
                        var pairs = self.minCards(self._pairs, cardRule.PAIRS);
                        while (true) {//避免对子三根重叠
                            if (pairs.cardList[0].val === three.val) {
                                pairs = self.minCards(self._pairs, cardRule.PAIRS, pairs.cardList[0].val);
                            } else {
                                break;
                            }
                        }
                        if (pairs) {
                            three.cardList = three.cardList.concat(pairs.cardList);
                        } else {
                            return null;
                        }
                        three.cardKind = cardRule.THREE_WITH_PAIRS;
                        three.size = 5;
                    }
                    return three;

                case cardRule.PROGRESSION://顺子
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    if (self._progression.length > 0) {
                        for (var i = self._progression.length - 1; i >= 0; i--) {//从小值开始判断
                            if (winc.val < self._progression[i].val && winc.size <= self._progression[i].cardList.length) {
                                if (winc.size === self._progression[i].cardList.length) {
                                    return self.setCardKind(self._progression[i], cardRule.PROGRESSION);
                                } else {
                                    if (self.player.isLandlord || isWinnerIsLandlord) {
                                        var valDiff = self._progression[i].val - winc.val,
                                            sizeDiff = self._progression[i].cardList.length - winc.size;
                                        for (var j = 0; j < sizeDiff; j++) {//拆顺
                                            if (valDiff > 1) {
                                                self._progression[i].cardList.shift();
                                                self._progression[i].val--;
                                                valDiff--;
                                                continue;
                                            }
                                            self._progression[i].cardList.pop();
                                        }
                                        return self.setCardKind(self._progression[i], cardRule.PROGRESSION);
                                    } else {
                                        return null;
                                    }
                                }
                            }
                        }
                    }
                    return null;

                case cardRule.PROGRESSION_PAIRS://连对
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    if (self._progressionPairs.length > 0) {
                        for (var i = self._progressionPairs.length - 1; i >= 0; i--) {//从小值开始判断
                            if (winc.val < self._progressionPairs[i].val && winc.size <= self._progressionPairs[i].cardList.length) {
                                if (winc.size === self._progressionPairs[i].cardList.length) {
                                    return self.setCardKind(self._progressionPairs[i], cardRule.PROGRESSION_PAIRS);
                                } else {
                                    if (self.player.isLandlord || isWinnerIsLandlord) {
                                        var valDiff = self._progressionPairs[i].val - winc.val,
                                            sizeDiff = (self._progressionPairs[i].cardList.length - winc.size) / 2;
                                        for (var j = 0; j < sizeDiff; j++) {//拆顺
                                            if (valDiff > 1) {
                                                self._progressionPairs[i].cardList.shift();
                                                self._progressionPairs[i].cardList.shift();
                                                valDiff--;
                                                continue;
                                            }
                                            self._progressionPairs[i].cardList.pop();
                                            self._progressionPairs[i].cardList.pop();
                                        }
                                        return self.setCardKind(self._progressionPairs[i], cardRule.PROGRESSION_PAIRS);
                                    } else {
                                        return null;
                                    }
                                }
                            }
                        }
                    }
                    return null;

                case cardRule.PLANE://三顺
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    return self.minPlane(winc.size, winc);
                case cardRule.PLANE_WITH_ONE: //飞机带单
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    var cnt = winc.size / 4,
                        plane = self.minPlane(cnt * 3, winc);
                    if (plane) {
                        var currOneVal = 2;
                        for (var i = 0; i < cnt; i++) {
                            var one = self.minOne(currOneVal, plane.val);//拿一张单牌
                            if (one) {
                                plane.cardList.push(one);
                                currOneVal = one.val;
                            } else {
                                return null;
                            }
                        }
                        plane.cardKind = cardRule.PLANE_WITH_ONE;
                        plane.size = plane.cardList.length;
                    }
                    return plane;
                case cardRule.PLANE_WITH_PAIRS://飞机带对
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {
                        return null;
                    }
                    var cnt = winc.size / 5,
                        plane = self.minPlane(cnt * 3, winc);
                    if (plane) {
                        var currPairsVal = 2;
                        for (var i = 0; i < cnt; i++) {
                            var pairs = self.minCards(self._pairs, cardRule.PAIRS, currPairsVal);//拿一对
                            if (pairs) {
                                plane.cardList = plane.cardList.concat(pairs.cardList);
                                currPairsVal = pairs.val;
                            } else {
                                return null;
                            }
                        }
                        plane.cardKind = cardRule.PLANE_WITH_PAIRS;
                        plane.size = plane.cardList.length;
                    }
                    return plane;

                case cardRule.BOMB://炸弹
                    if (!isWinnerIsLandlord && !self.player.isLandlord) {//同是农民不压炸弹
                        return null;
                    }
                    var bomb = self.minCards(self._bomb, cardRule.BOMB, winc.val);
                    if (bomb) {
                        return bomb;
                    } else {
                        if (self._kingBomb.length > 0) {
                            if ((isWinnerIsLandlord && winnerCardCount < 6)
                                || (self.player.isLandlord && self.player.cardList.length < 6)) {
                                return self.setCardKind(self._kingBomb[0], cardRule.KING_BOMB);
                            }
                        }
                        return null;
                    }
                case cardRule.FOUR_WITH_TWO:
                    return self.minCards(self._bomb, cardRule.BOMB, winc.val);
                case cardRule.FOUR_WITH_TWO_PAIRS:
                    return self.minCards(self._bomb, cardRule.BOMB, winc.val);
                case cardRule.KING_BOMB:
                    return null;
                default:
                    return null;
            }
        })();

        //如果有炸弹，根据牌数量确定是否出
        if (result) {
            return result;
        } else if (winc.cardKind != cardRule.BOMB && winc.cardKind != cardRule.KING_BOMB
            && (self._bomb.length > 0 || self._kingBomb.length > 0)) {
            if ((isWinnerIsLandlord && winnerCardCount < 5)
                || (self.player.isLandlord && (self.player.cardList.length < 5 || (self.player.nextPlayer.cardList.length < 5 || self.player.nextPlayer.nextPlayer.cardList.length < 6)))
                || self.times() <= 2) {//自己只有两手牌或只有炸弹必出炸弹
                if (self._bomb.length > 0) {
                    return self.minCards(self._bomb, cardRule.BOMB);
                } else {
                    return self.setCardKind(self._kingBomb[0], cardRule.KING_BOMB);
                }
            }
        } else {
            return null;
        }
    }

    /**
     * 出牌，默认出包含最小牌的牌
     * @param {array} landlordCardsCnt 
     */
    play(landlordCardsCnt) {
        var self = this;
        self.log();
        var cardsWithMin = function (idx) {
            var minCard = self.cards[idx];
            //单张
            for (var i = 0; i < self._one.length; i++) {
                if (self._one[i].val === minCard.val) {
                    return self.minCards(self._one, cardRule.ONE);
                }
            }
            //对子
            for (i = 0; i < self._pairs.length; i++) {
                if (self._pairs[i].val === minCard.val) {
                    return self.minCards(self._pairs, cardRule.PAIRS);
                }
            }
            //三根
            for (i = 0; i < self._three.length; i++) {
                if (self._three[i].val === minCard.val) {
                    return self.minCards(self._three, cardRule.THREE);
                }
            }
            //炸弹
            for (i = 0; i < self._bomb.length; i++) {
                if (self._bomb[i].val === minCard.val) {
                    return self.minCards(self._bomb, cardRule.BOMB);
                }
            }
            //三顺
            for (i = 0; i < self._plane.length; i++) {
                for (var j = 0; j < self._plane[i].cardList.length; j++) {
                    if (self._plane[i].cardList[j].val === minCard.val && self._plane[i].cardList[j].type === minCard.type) {
                        return self.minCards(self._plane, cardRule.PLANE);
                    }
                }
            }
            //顺子
            for (i = 0; i < self._progression.length; i++) {
                for (var j = 0; j < self._progression[i].cardList.length; j++) {
                    if (self._progression[i].cardList[j].val === minCard.val && self._progression[i].cardList[j].type === minCard.type) {
                        return self.minCards(self._progression, cardRule.PROGRESSION);
                    }
                }
            }
            //连对
            for (i = 0; i < self._progressionPairs.length; i++) {
                for (var j = 0; j < self._progressionPairs[i].cardList.length; j++) {
                    if (self._progressionPairs[i].cardList[j].val === minCard.val && self._progressionPairs[i].cardList[j].type === minCard.type) {
                        return self.minCards(self._progressionPairs, cardRule.PROGRESSION_PAIRS);
                    }
                }
            }
            if (self._kingBomb.length > 0) {
                return self.minCards(self._kingBomb, cardRule.KING_BOMB);
            }
        };
        for (var i = self.cards.length - 1; i >= 0; i--) {
            var r = cardsWithMin(i);
            if (r.cardKind === cardRule.ONE) {
                if (self._plane.length > 0) {//三顺
                    var plane = self.minCards(self._plane, cardRulee.PLANE);
                    var len = plane.cardList.length / 3;
                    var currOneVal = 2;
                    for (var i = 0; i < len; i++) {
                        var one = self.minOne(currOneVal, plane.val);//拿一张单牌
                        plane.cardList.push(one);
                        currOneVal = one.val;
                    }
                    return self.setCardKind(plane, cardRule.PLANE_WITH_ONE);
                }
                else if (self._three.length > 0) {//三带一
                    var three = self.minCards(self._three, cardRule.THREE);
                    var len = three.cardList.length / 3;
                    var one = self.minOne(currOneVal, three.val);//拿一张单牌
                    three.cardList.push(one);
                    if (three.val < 14)
                        return self.setCardKind(three, cardRule.THREE_WITH_ONE);
                }
                if (self.player.isLandlord) {//坐庄打法
                    if (self.player.isLandlord) {//坐庄打法
                        if (self.player.nextPlayer.cardList.length <= 2 || self.player.nextPlayer.nextPlayer.cardList.length <= 2)
                            return self.playOneAtTheEnd(landlordCardsCnt);
                        else
                            return self.minCards(self._one, cardRule.ONE);
                    }
                } else {//偏家打法
                    if (landlordCardsCnt <= 2)
                        return self.playOneAtTheEnd(landlordCardsCnt);
                    else
                        return self.minCards(self._one, cardRule.ONE);
                }
            } else if (r.cardKind === cardRuleTHREE) {
                var three = self.minCards(self._three, cardRule.THREE);
                var len = three.cardList.length / 3;
                if (self._one.length >= 0) {//单根多带单
                    var one = self.minOne(currOneVal, three.val);//拿一张单牌
                    three.cardList.push(one);
                    return self.setCardKind(three, cardRule.THREE_WITH_ONE);
                } else if (self._pairs.length > 0) {
                    var pairs = self.minCards(self._pairs, cardRule.PAIRS, currPairsVal);//拿一对
                    three.cardList = three.cardList.concat(pairs.cardList);
                    return self.setCardKind(three, cardRule.THREE_WITH_PAIRS);
                } else {
                    return self.setCardKind(three, cardRule.THREE);
                }
            } else if (r.cardKind === cardRule.PLANE) {
                var plane = self.minCards(self._plane, cardRule.PLANE);
                var len = plane.cardList.length / 3;
                if (self._one.length > len && self._pairs.length > len) {
                    if (self._one.length >= self._pairs.length) {//单根多带单
                        var currOneVal = 2;
                        for (var i = 0; i < len; i++) {
                            var one = self.minOne(currOneVal, plane.val);//拿一张单牌
                            plane.cardList.push(one);
                            currOneVal = one.val;
                        }
                        return self.setCardKind(plane, cardRule.PLANE_WITH_ONE);
                    } else {
                        var currPairsVal = 2;
                        for (var i = 0; i < len; i++) {
                            var pairs = self.minCards(self._pairs, cardRule.PAIRS, currPairsVal);//拿一对
                            plane.cardList = plane.cardList.concat(pairs.cardList);
                            currPairsVal = pairs.val;
                        }
                        return self.setCardKind(plane, cardRule.PLANE_WITH_PAIRS);
                    }
                } else if (self._pairs.length > len) {
                    var currPairsVal = 2;
                    for (var i = 0; i < len; i++) {
                        var pairs = self.minCards(self._pairs, cardRule.PAIRS, currPairsVal);//拿一对
                        plane.cardList = plane.cardList.concat(pairs.cardList);
                        currPairsVal = pairs.val;
                    }
                    return self.setCardKind(plane, cardRule.PLANE_WITH_PAIRS);
                } else if (self._one.length > len) {
                    var currOneVal = 2;
                    for (var i = 0; i < len; i++) {
                        var one = self.minOne(currOneVal, plane.val);//拿一张单牌
                        plane.cardList.push(one);
                        currOneVal = one.val;
                    }
                    return self.setCardKind(plane, cardRule.PLANE_WITH_ONE);
                } else {
                    return self.setCardKind(plane, cardRule.PLANE);
                }
            } else if (r.cardKind === cardRule.BOMB && self.times() === 1) {
                return r;
            } else if (r.cardKind === cardRuleBOMB && self.times() != 1) {
                continue;
            } else {
                return r;
            }
        }
    }

    /**
     * 出牌，将单张放最后出牌
     * @param {array} landlordCardsCnt 
     */
    playOneAtTheEnd(landlordCardsCnt) {
        var self = this;
        if (self._progression.length > 0) {//出顺子
            return self.minCards(self._progression, cardRule.PROGRESSION);
        }
        else if (self._plane.length > 0) {//三顺
            var plane = self.minCards(self._plane, cardRule.PLANE);
            var len = plane.cardList.length / 3;
            if (self._one.length > len && self._pairs.length > len) {
                if (self._one.length >= self._pairs.length) {//单根多带单
                    var currOneVal = 2;
                    for (var i = 0; i < len; i++) {
                        var one = self.minOne(currOneVal, plane.val);//拿一张单牌
                        plane.cardList.push(one);
                        currOneVal = one.val;
                    }
                    return self.setCardKind(plane, cardRule.PLANE_WITH_ONE);
                } else {
                    var currPairsVal = 2;
                    for (var i = 0; i < len; i++) {
                        var pairs = self.minCards(self._pairs, cardRule.PAIRS, currPairsVal);//拿一对
                        plane.cardList = plane.cardList.concat(pairs.cardList);
                        currPairsVal = pairs.val;
                    }
                    return self.setCardKind(plane, cardRule.PLANE_WITH_PAIRS);
                }
            } else if (self._pairs.length > len) {
                var currPairsVal = 2;
                for (var i = 0; i < len; i++) {
                    var pairs = self.minCards(self._pairs, cardRule.PAIRS, currPairsVal);//拿一对
                    plane.cardList = plane.cardList.concat(pairs.cardList);
                    currPairsVal = pairs.val;
                }
                return self.setCardKind(plane, cardRule.PLANE_WITH_PAIRS);
            } else if (self._one.length > len) {
                var currOneVal = 2;
                for (var i = 0; i < len; i++) {
                    var one = self.minOne(currOneVal, plane.val);//拿一张单牌
                    plane.cardList.push(one);
                    currOneVal = one.val;
                }
                return self.setCardKind(plane, cardRule.PLANE_WITH_ONE);
            } else {
                return self.setCardKind(plane, cardRule.PLANE);
            }
        }
        else if (self._progressionPairs.length > 0) {//出连对
            return self.minCards(self._progressionPairs, cardRule.PROGRESSION_PAIRS);
        }
        else if (self._three.length > 0) {//三根、三带一、三带对
            var three = self.minCards(self._three, cardRule.THREE);
            var len = three.cardList.length / 3;
            if (self._one.length >= 0) {//单根多带单
                var one = self.minOne(currOneVal, three.val);//拿一张单牌
                three.cardList.push(one);
                return self.setCardKind(three, cardRule.THREE_WITH_ONE);
            } else if (self._pairs.length > 0) {
                var pairs = self.minCards(self._pairs, cardRule.PAIRS, currPairsVal);//拿一对
                three.cardList = three.cardList.concat(pairs.cardList);
                return self.setCardKind(three, cardRule.THREE_WITH_PAIRS);
            } else {
                return self.setCardKind(three, cardRule.THREE);
            }
        }
        else if (self._pairs.length > 0) {//对子
            if ((self.player.isLandlord && (self.player.nextPlayer.cardList.length === 2 || self.player.nextPlayer.nextPlayer.cardList.length === 2))
                || (!self.player.isLandlord && landlordCardsCnt === 2))
                return self.maxCards(self._pairs, cardRule.PAIRS);
            else
                return self.minCards(self._pairs, cardRule.PAIRS);
        }
        else if (self._one.length > 0) {//出单牌
            if ((self.player.isLandlord && (self.player.nextPlayer.cardList.length <= 2 || self.player.nextPlayer.nextPlayer.cardList.length <= 2))
                || (!self.player.isLandlord && landlordCardsCnt <= 2))
                return self.maxCards(self._one, cardRule.ONE);
            else
                return self.minCards(self._one, cardRule.ONE);
        } else {//都计算无结果出最小的那张牌
            var one = null;
            if ((self.player.isLandlord && (self.player.nextPlayer.cardList.length <= 2 || self.player.nextPlayer.nextPlayer.cardList.length <= 2))
                || (!self.player.isLandlord && landlordCardsCnt <= 2))
                one = self.cards.slice(self.cards.length - 1, self.cards.length);
            else
                one = self.cards.slice(0, 1);
            return {
                size: 1,
                cardKind: cardRule.ONE,
                cardList: one,
                val: one[0].val
            };
        }
    }

    /**
     * 玩家出牌提示
     * @param {object} winc 
     */
    prompt(winc) {
        var self = this,
            stat = cardRule.valCount(self.cards);

        if (winc) {//跟牌
            var promptList = [];
            /**
             * 设置符合条件的提示牌
             * @method function
             * @param  {int} c 几张的牌，比如单牌：1，对子：2
             * @param  {int} winVal 要求大过的值
             * @param  {array} st 牌统计
             */
            var setPrompt = function (c, winVal, st) {
                var result = [];
                //除去不能大过当前的牌
                for (var i = st.length - 1; i >= 0; i--) {
                    if (st[i].count < c || st[i].val <= winVal) {
                        st.splice(i, 1);
                    }
                }
                st.sort(self.promptSort);
                //加入各个符合值的单牌
                for (i = 0; i < st.length; i++) {
                    for (j = 0; j < self.cards.length; j++) {
                        if (self.cards[j].val === st[i].val) {
                            result.push(self.cards.slice(j, j + c));
                            break;
                        }
                    }
                }
                return result;
            };
            /**
             * 获取三顺提示牌
             * @method function
             * @param  {int} n 数量(有几个三根)
             */
            var getPlanePrompt = function (n) {
                var result = [];
                if (winc.val < 14 && self.cards.length >= winc.size) {//不是最大顺子才有的比
                    for (var i = winc.val + 1; i < 15; i++) {
                        var proList = [];
                        for (var j = 0; j < self.cards.length; j++) {
                            if (self.cards[j].val < i && proList.length === 0) break;
                            if (self.cards[j].val > i || (proList.length > 0 && self.cards[j].val === proList[proList.length - 1].val)) {
                                continue;
                            }
                            if (self.cards[j].val === i
                                && self.cards[j + 1]
                                && self.cards[j + 1].val === i
                                && self.cards[j + 2]
                                && self.cards[j + 2].val === i
                                && proList.length === 0) {
                                proList = proList.concat(self.cards.slice(j, j + 3));
                                j += 2;
                                continue;
                            }
                            if (proList.length > 0
                                && proList[proList.length - 1].val - 1 === self.cards[j].val
                                && self.cards[j + 1]
                                && proList[proList.length - 1].val - 1 === self.cards[j + 1].val
                                && self.cards[j + 2]
                                && proList[proList.length - 1].val - 1 === self.cards[j + 2].val) {//判定递减
                                proList = proList.concat(self.cards.slice(j, j + 3));
                                j += 2;
                                if (proList.length === n * 3) {
                                    result.push(proList);
                                    break;
                                }
                            } else { break; }
                        }
                    }
                }
                return result;
            };
            switch (winc.cardKind) {
                case cardRule.ONE://单牌
                    promptList = setPrompt(1, winc.val, stat);
                    break;
                case cardRulee.PAIRS://对子
                    promptList = setPrompt(2, winc.val, stat);
                    break;
                case cardRuleTHREE://三根
                    promptList = setPrompt(3, winc.val, stat);
                    break;
                case cardRule.THREE_WITH_ONE://三带一
                    var threePrompt = setPrompt(3, winc.val, stat.slice(0)),
                        onePrompt = setPrompt(1, 2, stat.slice(0));
                    for (var i = 0; i < threePrompt.length; i++) {
                        for (var j = 0; j < onePrompt.length; j++) {
                            if (onePrompt[j][0].val != threePrompt[i][0].val) {
                                promptList.push(threePrompt[i].concat(onePrompt[j]));
                            }
                        }
                    }
                    break;
                case cardRule.THREE_WITH_PAIRS://三带对
                    var threePrompt = setPrompt(3, winc.val, stat.slice(0)),
                        pairsPrompt = setPrompt(2, 2, stat.slice(0));
                    for (var i = 0; i < threePrompt.length; i++) {
                        for (var j = 0; j < pairsPrompt.length; j++) {
                            if (pairsPrompt[j][0].val != threePrompt[i][0].val) {
                                promptList.push(threePrompt[i].concat(pairsPrompt[j]));
                            }
                        }
                    }
                    break;
                case cardRule.PROGRESSION://顺子
                    if (winc.val < 14 && self.cards.length >= winc.size) {//不是最大顺子才有的比
                        for (var i = winc.val + 1; i < 15; i++) {
                            var proList = [];
                            for (var j = 0; j < self.cards.length; j++) {
                                if (self.cards[j].val < i && proList.length === 0) break;
                                if (self.cards[j].val > i || (proList.length > 0 && self.cards[j].val === proList[proList.length - 1].val)) {
                                    continue;
                                }
                                if (self.cards[j].val === i && proList.length === 0) {
                                    proList.push(self.cards.slice(j, j + 1)[0]);
                                    continue;
                                }
                                if (proList[proList.length - 1].val - 1 === self.cards[j].val) {//判定递减
                                    proList.push(self.cards.slice(j, j + 1)[0]);
                                    if (proList.length === winc.size) {
                                        promptList.push(proList);
                                        break;
                                    }
                                } else { break; }
                            }
                        }
                    }
                    break;
                case cardRule.PROGRESSION_PAIRS://连对
                    if (winc.val < 14 && self.cards.length >= winc.size) {//不是最大顺子才有的比
                        for (var i = winc.val + 1; i < 15; i++) {
                            var proList = [];
                            for (var j = 0; j < self.cards.length; j++) {
                                if (self.cards[j].val < i && proList.length === 0) break;
                                if (self.cards[j].val > i || (proList.length > 0 && self.cards[j].val === proList[proList.length - 1].val)) {
                                    continue;
                                }
                                if (self.cards[j].val === i && self.cards[j + 1] && self.cards[j + 1].val === i && proList.length === 0) {
                                    proList = proList.concat(self.cards.slice(j, j + 2));
                                    j++;
                                    continue;
                                }
                                if (proList.length > 0
                                    && proList[proList.length - 1].val - 1 === self.cards[j].val
                                    && self.cards[j + 1]
                                    && proList[proList.length - 1].val - 1 === self.cards[j + 1].val) {//判定递减
                                    proList = proList.concat(self.cards.slice(j, j + 2));
                                    j++;
                                    if (proList.length === winc.size) {
                                        promptList.push(proList);
                                        break;
                                    }
                                } else { break; }
                            }
                        }
                    }
                    break;
                case cardRule.PLANE://三顺
                    promptList = getPlanePrompt(winc.size / 3);
                    break;
                case cardRule.PLANE_WITH_ONE:
                    promptList = getPlanePrompt(winc.size / 4);
                    break;
                case cardRule.PLANE_WITH_PAIRS:
                    promptList = getPlanePrompt(winc.size / 5);
                    break;
                case cardRule.FOUR_WITH_TWO:
                    promptList = setPrompt(4, winc.val, stat);
                    break;
                case cardRule.FOUR_WITH_TWO_PAIRS:
                    promptList = setPrompt(4, winc.val, stat);
                    break;
                case cardRule.BOMB:
                    promptList = setPrompt(4, winc.val, stat);
                    break;
                default:
                    break;
            }
            if (winc.cardKind != cardRule.KING_BOMB && winc.cardKind != cardRule.BOMB) {
                //炸弹加入
                if (self._bomb.length > 0) {
                    for (var i = self._bomb.length - 1; i >= 0; i--) {
                        promptList.push(self._bomb[i].cardList);
                    }
                }
            }
            if (winc.cardKind != cardRule.KING_BOMB) {
                //王炸加入
                if (self._kingBomb.length > 0) {
                    promptList.push(self._kingBomb[0].cardList);
                }
            }
            return promptList;
        } else {//出牌
            var promptList = [];
            for (var i = stat.length - 1; i >= 0; i--) {
                if (i != 0) {
                    promptList.push(self.cards.splice(self.cards.length - stat[i].count, self.cards.length - 1));
                } else {
                    promptList.push(self.cards);
                }
            }
            return promptList;
        }
    }

    /**
     * 获取指定张数的最小牌值
     * @param {number} n 张数
     * @param {number} v 需要大过的值
     */
    getMinVal(n, v){
        var self = this,
            c = cardRule.valCount(self.cards);
        for (var i = c.length - 1; i >= 0; i--) {
            if(c[i].count === n  && c[i].val > v){
                return self.cards.splice(i, 1);
            }
        }
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
