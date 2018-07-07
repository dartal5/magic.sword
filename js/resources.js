class Resources {
    
    static use(urlArr, callbackArr=[]) {
        Resources.onReady(callbackArr);
        Resources.load(urlArr); 
    }

    static get(url) {
        return Resources.cache[url];
    }

    static clearCache() {
        Resources.cache = {};
    }

    static onReady(callbackArr) {
        Resources.callbacks = callbackArr;
    }

    static load(urlArr) {
        urlArr.forEach(function(url, i, urlArr) {
            if(Resources.cache[url]) return;

            var img = new Image();
            img.onload = function() {
                Resources.cache[url] = img;
                if(Resources.isReady(urlArr)) Resources.forceCallbacks();
            };  
            img.src = url; 
        });
    }

    static isReady(urlArr) {
        for(var i = 0; i < urlArr.length; i++) {
            if(!Resources.cache[urlArr[i]]) return false;
        }
        return true;
    }

    static clearCallbacks() {
        Resources.callbacks = [];
    }

    static forceCallbacks() {
        Resources.callbacks.forEach(function(func) { func() });
        Resources.callbacks = [];
    }

}

Resources.cache = {};
Resources.callbacks = [];