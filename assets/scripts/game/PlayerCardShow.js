cc.Class({
    extends: cc.Component,

    properties: {
        sprite: {
            default: null,
            type: cc.Sprite,
        },
    },

    //设置显示的图片
    setCardShow(name) {
        var self = this
        cc.log("setCardShow->" + name)
        cc.loader.loadRes("pic1/" + name, cc.SpriteFrame, function (err, spriteFrame) {
            cc.log("cc.loader.loadRes->" + name)
            self.sprite.spriteFrame = spriteFrame;
        });
    },

    //设置是否可以点击
    setIsCanChick() {
        var self = this
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {

            /* var touches = event.getTouches()
            var touchLoc = touches[0].getLocation()
            var pos = self.node.parent.convertToNodeSpaceAR(touchLoc)
            var x = pos.x
            var y = pos.y
            if(y < 20 || y > 90)
                return
            if(x >= 90 + self.index * 20 && x < 110 + self.index * 20)
                self.setCardYPos(true) */

            self.setCardYPos(self.node);

        }, self.node)
    },

    setCanvas(canvas) {
        this.canvas = canvas
    },

    setIndex(index) {
        this.index = index
    },

    /* setCardYPos(isOut) {
        if (isOut) {
            var pos = this.node.getPosition()
            pos.y = 70
            this.node.setPosition(pos.y)
            this.isChoose = true
        }
        else {
            var pos = this.node.getPosition()
            pos.y = 60
            this.node.setPositionY(pos)
            this.isChoose = false
        }
    }, */

    setCardYPos(node) {
        let pos = node.getPosition();
        if (pos.y == 70) {
            console.log("落牌");

            node.y = 60;
        } else if (pos.y == 60) {
            console.log("提牌");

            node.y = 70;
        }
    },

    onLoad() {
        this.isChoose = false
    },

    start() {

    },
});