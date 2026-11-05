function BgMusic(options) {
    var audio = document.createElement('audio');
    audio.src = options.src;
    audio.loop = "loop";
    audio.autoplay = true;
    audio.id = 'createBgAudio';
    document.body.appendChild(audio);
    this.audio = audio;
    var isHandle = false; //使用者和頁面首次交互
    function testAutoPlay() {
        //傳回一個promise以告訴呼叫者檢測結果
        return new Promise(resolve => {
            var autoplay;
            audio.play().then(() => { //支援自動播放
                autoplay = true;
                options.on && options.on();
            }).catch(err => { //不支援自動播放
                autoplay = false;
                options.off && options.off();
            }).finally((e) => {
                resolve(autoplay);
            });
        });
    }
    testAutoPlay().then(autoplay => {
        if (!autoplay) {
            //當使用者沒有和頁面有任何互動時，綁定觸發事件
            if (!isHandle) {
                setAutoPlayWhenClick();
            }
        }
    });
    function setAutoPlayWhenClick() {
        function setAutoPlay() {
            isHandle = true;
            testAutoPlay(); //繼續嘗試播放
            document.removeEventListener('click', setAutoPlay);
            // document.removeEventListener('touchend', setAutoPlay);
        }
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { //如果是微信，等WeixinJSBridgeReady後繼續嘗試播放
            document.addEventListener('WeixinJSBridgeReady', () => {
                testAutoPlay();
            });
        } else { //綁定觸發方法
            document.addEventListener('click', setAutoPlay);
            // document.addEventListener('touchend', setAutoPlay);
        }
    }
}