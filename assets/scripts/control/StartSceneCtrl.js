/**
 * 开始场景控制组件
 */

cc.Class({
    extends: cc.Component,

    properties: {
        bt_StartGame: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bt_StartGame.node.on("touchstart", this.onStartGameTouchStart, this);

    },

    // update (dt) {},

    onStartGameTouchStart() {
        console.log("onStartGameTouchStart.");

        cc.director.loadScene("GameScene");
    }
});
