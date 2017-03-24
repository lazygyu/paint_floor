if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // 우리는 반드시 특정한 케이스에 대해서 확인해야 합니다.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

if(typeof performance === 'undefined'){
    (function(){
        window.performance = {
            now:function(){
                return new Date().getTime();
            }
        }
    })();
}else if(typeof performance.now != 'function'){
    console.log("performance.now polyfill");
    (function(){
        
        performance.now = function(){
            return new Date().getTime();
        }
    })();
}

if( typeof requestAnimationFrame === 'undefined'){
    window.requestAnimationFrame = function(cb){
        setTimeout(cb, 1000/60);
    }
}