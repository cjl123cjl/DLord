/**
 * 游戏场景控制组件
 */

var CardManager = require("CardManager");
var Player = require("Player");

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
        canvas: {
            default: null,
            type: cc.Node
        },
        player1CardLayer: {
            default: null,
            type: cc.Node
        },
        playerCardLayer: {
            default: null,
            type: cc.Node
        },
        player3CardLayer: {
            default: null,
            type: cc.Node
        },
        promptCardLayer: {
            default: null,
            type: cc.Node
        },
        qiangNode: {
            default: null,
            type: cc.Node
        },
        playNode: {
            default: null,
            type: cc.Node
        },
        cardPrefabs: {
            default: null,
            type: cc.Prefab
        },
        cardBackPrefabs: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cardManager = new CardManager();
        this.index = 0;
        this.playerCard = new Array(20);
        this.player1Card = new Array(20);
        this.player3Card = new Array(20);
    },

    start() {

    },

    // update (dt) {},

    restartGame() {
        console.log("restartGame");

        //按钮消失
        this.prepareBtn.node.setPosition(cc.v2(-1000, -1000));

        //洗牌
        this.cardManager.randomCard();

        //初始化玩家
        this.player1 = new Player(1, this.cardManager.array_player[0])
        this.player2 = new Player(2, this.cardManager.array_player[1])
        this.player3 = new Player(3, this.cardManager.array_player[2])

        //下家
        this.player1.nextPlayer = this.player2
        this.player2.nextPlayer = this.player3
        this.player3.nextPlayer = this.player1

        //是否AI
        this.player1.isAI = true
        this.player2.isAI = false
        this.player3.isAI = true
        //创建AI逻辑
        /* this.AILogic1 = new AILogic(this.player1)
        this.AILogic2 = new AILogic(this.player2)
        this.AILogic3 = new AILogic(this.player3)

        this.AILogic1.nextAIPlayer = this.AILogic2
        this.AILogic2.nextAIPlayer = this.AILogic3
        this.AILogic3.nextAIPlayer = this.AILogic1 */

        //显示牌
        //this.curPlayerAI = this.AILogic1
        this.playerCardLayer.removeAllChildren()
        this.player1CardLayer.removeAllChildren()
        this.player3CardLayer.removeAllChildren()
        for (var i = 0; i < 17; i++) {
            // 设置玩家牌张显示
            this.playerCard[i] = cc.instantiate(this.cardPrefabs)
            this.playerCard[i].setPosition(cc.v2(110 + i * 20, 60))
            this.playerCard[i].setScale(0.6)
            //this.playerCard[i].getComponent("PlayerCardShow").setCanvas(this.canvas)
            cc.log("this.cardManager.array_player->" + this.cardManager.array_player[1][i].name)
            this.playerCard[i].getComponent("PlayerCardShow").setCardShow(this.cardManager.array_player[1][i].name)    // 设置显示的图片
            this.playerCard[i].getComponent("PlayerCardShow").setIndex(i)    // 设置索引
            this.playerCard[i].getComponent("PlayerCardShow").setIsCanChick()    // 设置能否别选中
            this.playerCardLayer.addChild(this.playerCard[i])

            // 设置玩家1牌张显示
            this.player1Card[i] = cc.instantiate(this.cardBackPrefabs)
            this.player1Card[i].setPosition(cc.v2(20, -20 + 5 * i))
            this.player1Card[i].setScale(0.3)
            this.player1CardLayer.addChild(this.player1Card[i])

            // 设置玩家2牌张显示
            this.player3Card[i] = cc.instantiate(this.cardBackPrefabs)
            this.player3Card[i].setPosition(cc.v2(-20, -20 + 5 * i))
            this.player3Card[i].setScale(0.3)
            this.player3CardLayer.addChild(this.player3Card[i])
        }
        //this.showCardforower()
        //开始抢地主
        this.snatchIndex = -1    // 是否有人叫分
        this.snatchRound = 1    // 抢地主次数
        this.snatchScore = 0    // 抢地主分数
        //this.snatchLandlord()
    },

    /**
     * 每轮结算，如果叫地主次数大于3次或者有人叫三分，则停止轮转
     */
    sumLandlord() {
        this.snatchRound++
        if (this.snatchRound > 3) {
            if (this.snatchIndex != -1) {
                this.endSnatch()
            }
            else {
                cc.log("重新洗牌")
                this.restartGame()
            }
        } else {
            if (this.snatchScore == 3) {
                this.endSnatch()
            }
            else {
                //this.curPlayerAI = this.curPlayerAI.nextAIPlayer
                //this.snatchLandlord()
            }
        }
    },

    /**
     * 设置抢地主状态，并将状态打印到tip上
     * @param {*} ret 
     */
    setSnatchState(ret) {
        var retstr
        if (ret < 4 && ret > this.snatchScore) {
            retstr = "抢地主 " + ret + "分"
            this.snatchIndex = this.curPlayerAI.player.pIndex
            this.snatchScore = ret
        }
        else {
            retstr = "不抢"
        }
        this["tip" + this.snatchRound].string = retstr
        this.sumLandlord()
    },

    endSnatch() {
        console.log("endSnatch");

    }
});
