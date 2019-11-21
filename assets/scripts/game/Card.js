/**
 * 卡牌类
 */

class Card {
    /**
     * 初始化牌张信息
     * @param {*} name 图片资源
     * @param {*} ctype 花色
     * @param {*} val 点数
     */
    constructor(name, ctype, val) {
        this.name = name;
        this.ctype = ctype;
        this.val = val;
    }

    /**
     * 打印牌张信息
     */
    print() {
        console.log("card name(图片资源):" + this.name + " | card ctype（花色）:" + this.ctype + " | card val（牌型）:" + this.val);
    }
}

module.exports = Card;