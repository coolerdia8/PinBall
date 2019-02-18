// 読み込みが終わってから初期化
window.addEventListener("load", init);
function init() {
    // 初期化
    let stage = new createjs.Stage("myCanvas");
    let Vx = []; // 初期の速さ
    let Vy = [];
    let oldX = 0;
    let oldY = 0;
    let flag = [];
    let radius = 145 / 2;
    let blank = 0;
    let reqHeight = stage.canvas.height - blank;
    let number = [];
    let link_r = 145 / 2;
    let xLine = 4;
    let top2y = 80;
    let left2x = 50;
    let interval_x = 150;
    let interval_y = 150;
    let manifest = [];
    let linkfiles = [];

    let linkText1 = "#";//"http://enjoy-asia.seesaa.net/";
    let ballList = [];
    let linkballList = [];

    // タッチ操作をサポートしているブラウザーならば
    if (createjs.Touch.isSupported() === true) {
        // タッチ操作を有効にします。
        createjs.Touch.enable(stage);
    }
    let file = ["", "ball_img.png", "ball_img.png", "ball_img.png"];
    let ballnumber = file.length;
    //falseや0で初期化
    for (let i = 1; i < ballnumber; i++) {
        flag[i] = false;
        Vx[i] = 0;
        Vy[i] = 0;
        number[i] = i;
    }

    for (let test = 1; test < 8 + 1; test++) {
        linkfiles[test] = "javaball.png";
        linkballList[test] = "#";
    }
    let linknumber = linkfiles.length;
    let linkballX, linkballY;

    //リンクの玉
    for (let y = 0; y < 2; y++) {
        for (let x = 0; x < xLine; x++) {
            let myLinkball = new createjs.Bitmap(linkfiles[x * y + 1]);
            linkballX = left2x + link_r + x * (interval_x + link_r);
            linkballY = top2y + link_r + y * (interval_y + link_r);
            setAppearance(myLinkball, linkballX, linkballY);
            myLinkball.addEventListener("click", on_click);
        }
    }

    function on_click(e) {
        window.location = linkballList[e.target.id];
    }

    //　ボールsを作成
    let loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", draw);
    for (var balnum = 1; balnum < ballnumber; balnum++) {
        var myball = new createjs.Bitmap(file[balnum]);
        manifest[balnum - 1] = { src: file[balnum], data: myball };
        setAppearance(myball, stage.canvas.width / (1.5 * balnum * Math.random()), 0);
        ballList[balnum] = myball;
    }
    loader.loadManifest(manifest, true);

    function setAppearance(instance, nX, nY) {
        instance.x = nX;
        instance.y = nY;
        stage.addChild(instance);
    }
    function draw(eventObject) {
        let myBitmap = eventObject.item.data;
        let myImage = eventObject.result;
        myBitmap.regX = myImage.width / 2;
        myBitmap.regY = myImage.height / 2;
        stage.update();
    }

    for (let Ballnum = 1; Ballnum < ballnumber; Ballnum++) {
        // インタラクティブの設定(マウスイベントの登録)
        ballList[Ballnum].addEventListener("mousedown", mouseHandler);// ボールを押したときの処理です
        ballList[Ballnum].addEventListener("pressmove", mouseHandler);   //ドラッグ中
        ballList[Ballnum].addEventListener("pressup", mouseHandler);// ボールからマウスを離したときの処理です
    }

    function mouseHandler(e) {
        switch (e.type) {
            case "mousedown":
                HandleDown(flag, number[e.target.id - linkfiles.length + 1]);
                break;
            case "pressmove":
                HandleMove(ballList[e.target.id - linkfiles.length + 1]);
                break;
            case "pressup":
                HandleUp(Vx, Vy, flag, number[e.target.id - linkfiles.length + 1]);
                break;
        }
    }

    function HandleDown(FlagDown, num) {
        // マウスの位置を保存
        oldX = stage.mouseX;
        oldY = stage.mouseY;
        // ボールの速度を無効にする
        FlagDown[num] = true;
    }

    function HandleMove(ball) {
        ball.x = stage.mouseX;
        ball.y = stage.mouseY;
    }

    function HandleUp(Vx0, Vy0, FlagUp, num) {
        // ボールの速度を有効にする(ドラッグした距離に応じて、速度を設定)
        Vx0[num] = stage.mouseX - oldX;
        Vy0[num] = stage.mouseY - oldY;
        FlagUp[num] = false;
    }

    // 時間制御
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", stage);  // 自動的に画面更新させます。
    createjs.Ticker.addEventListener("tick", handleTick);

    function handleTick() {
        for (let num = 1; num < ballList.length; num++) {

            // ボールをドラッグ中でないときだけ物理演算
            if (flag[num] === false) {

                let ball = ballList[num];
                ball.vx = Vx[num];
                ball.vy = Vy[num];

                //重力
                ball.vy += 0.5;
                // 摩擦
                ball.vx *= 0.97;
                ball.vy *= 0.97;
                // ボールに物理演算を適用
                ball.x += ball.vx;
                ball.y += ball.vy;

                // 画面の端からはみ出さないようにする処理
                if (ball.x + radius > stage.canvas.width) {
                    ball.x = stage.canvas.width - radius;
                    ball.vx *= -0.7;
                } else if (ball.x - radius < 0) {
                    ball.x = radius;
                    ball.vx *= -0.7;
                }
                if (ball.y + radius > reqHeight) {
                    ball.y = reqHeight - radius;
                    ball.vy *= -0.7;
                } else if (ball.y - radius < 0) {
                    ball.y = radius;
                    ball.vy *= -0.7;
                }

                Vx[num] = ball.vx;
                Vy[num] = ball.vy;
            }
        }
    }
}