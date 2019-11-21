/**
 * 游戏场景控制组件
 */

var CardManager = require("CardManager");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let test = new CardManager();
        test.randomCard();
    },

    // update (dt) {},
});
