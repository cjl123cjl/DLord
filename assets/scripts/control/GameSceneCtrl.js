/**
 * 游戏场景控制组件
 */

var CardManager = require("CardManager");

cc.Class({
    extends: cc.Component,

    properties: {
        tip1: {
            default: null,
            type: cc.Label
        },
        tip2: {
            default: null,
            type: cc.Label
        },
        tip3: {
            default: null,
            type: cc.Label
        },
        playerIconSp1: {
            default: null,        
            type: cc.Sprite, 
        },
        playerIconSp2: {
            default: null,        
            type: cc.Sprite, 
        },
        playerIconSp3: {
            default: null,        
            type: cc.Sprite, 
        },
        prepareBtn: {
            default: null,
            type: cc.Button
        },
        canvas:{
            default: null,
            type: cc.Node
        },        
        player1CardLayer:{
            default: null,
            type: cc.Node
        },
        playerCardLayer:{
            default: null,
            type: cc.Node
        },
        player3CardLayer:{
            default: null,
            type: cc.Node
        },
        promptCardLayer:{
            default: null,
            type: cc.Node
        },
        qiangNode:{
            default: null,
            type: cc.Node
        },
        playNode:{
            default: null,
            type: cc.Node
        },
        cardPrefabs:{
            default: null,
            type: cc.Prefab
        },
        cardBackPrefabs:{
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let test = new CardManager();
        test.randomCard();
    },

    // update (dt) {},
});
