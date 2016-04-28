!function e(t,i,n){function s(o,a){if(!i[o]){if(!t[o]){var u="function"==typeof require&&require;if(!a&&u)return u(o,!0);if(r)return r(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var h=i[o]={exports:{}};t[o][0].call(h.exports,function(e){var i=t[o][1][e];return s(i?i:e)},h,h.exports,e,t,i,n)}return i[o].exports}for(var r="function"==typeof require&&require,o=0;o<n.length;o++)s(n[o]);return s}({1:[function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var s=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),r=function(){function e(t,i){var s=this;return n(this,e),this._stateChangeCb=t,this._subscriptionUpdate=i,this._state={UNSUPPORTED:{id:"UNSUPPORTED",interactive:!1,pushEnabled:!1},INITIALISING:{id:"INITIALISING",interactive:!1,pushEnabled:!1},PERMISSION_DENIED:{id:"PERMISSION_DENIED",interactive:!1,pushEnabled:!1},PERMISSION_GRANTED:{id:"PERMISSION_GRANTED",interactive:!0},PERMISSION_PROMPT:{id:"PERMISSION_PROMPT",interactive:!0,pushEnabled:!1},ERROR:{id:"ERROR",interactive:!1,pushEnabled:!1},STARTING_SUBSCRIBE:{id:"STARTING_SUBSCRIBE",interactive:!1,pushEnabled:!0},SUBSCRIBED:{id:"SUBSCRIBED",interactive:!0,pushEnabled:!0},STARTING_UNSUBSCRIBE:{id:"STARTING_UNSUBSCRIBE",interactive:!1,pushEnabled:!1},UNSUBSCRIBED:{id:"UNSUBSCRIBED",interactive:!0,pushEnabled:!1}},"serviceWorker"in navigator&&"PushManager"in window&&"showNotification"in ServiceWorkerRegistration.prototype?void navigator.serviceWorker.ready.then(function(){s._stateChangeCb(s._state.INITIALISING),s.setUpPushPermission()}):void this._stateChangeCb(this._state.UNSUPPORTED)}return s(e,[{key:"_permissionStateChange",value:function(e){switch(e){case"denied":this._stateChangeCb(this._state.PERMISSION_DENIED);break;case"granted":this._stateChangeCb(this._state.PERMISSION_GRANTED);break;case"default":this._stateChangeCb(this._state.PERMISSION_PROMPT);break;default:console.error("Unexpected permission state: ",e)}}},{key:"setUpPushPermission",value:function(){var e=this;return this._permissionStateChange(Notification.permission),navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(t){t&&(e._stateChangeCb(e._state.SUBSCRIBED),e._subscriptionUpdate(t))})["catch"](function(t){console.log(t),e._stateChangeCb(e._state.ERROR,t)})}},{key:"subscribeDevice",value:function(){var e=this;this._stateChangeCb(this._state.STARTING_SUBSCRIBE),navigator.serviceWorker.ready.then(function(e){return e.pushManager.subscribe({userVisibleOnly:!0})}).then(function(t){e._stateChangeCb(e._state.SUBSCRIBED),e._subscriptionUpdate(t)})["catch"](function(t){e._permissionStateChange(Notification.permission),"denied"!==Notification.permission&&"default"!==Notification.permission&&e._stateChangeCb(e._state.ERROR,t)})}},{key:"unsubscribeDevice",value:function(){var e=this;this._stateChangeCb(this._state.STARTING_UNSUBSCRIBE),navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(t){return t?t.unsubscribe().then(function(e){e||console.error("We were unable to unregister from push")}):(e._stateChangeCb(e._state.UNSUBSCRIBED),void e._subscriptionUpdate(null))}).then(function(){e._stateChangeCb(e._state.UNSUBSCRIBED),e._subscriptionUpdate(null)})["catch"](function(e){console.error("Error thrown while revoking push notifications. Most likely because push was never registered",e)})}}]),e}(),o=function(){function e(){var t=this;n(this,e),this._PUSH_SERVER_URL="",this._API_KEY="AIzaSyBBh4ddPa96rQQNxqiq_qQj7sq1JdsNQUQ",this._sendPushOptions=document.querySelector(".js-send-push-options");var i=document.querySelector(".js-push-toggle-switch");i.classList.contains("is-upgraded")?(this.ready=Promise.resolve(),this._uiInitialised(i.MaterialSwitch)):this.ready=new Promise(function(e){var n=function s(){i.classList.contains("is-upgraded")&&(t._uiInitialised(i.MaterialSwitch),document.removeEventListener(s),e())};document.addEventListener("mdl-componentupgraded",n)})}return s(e,[{key:"_uiInitialised",value:function(e){var t=this;this._stateChangeListener=this._stateChangeListener.bind(this),this._subscriptionUpdate=this._subscriptionUpdate.bind(this),this._toggleSwitch=e,this._pushClient=new r(this._stateChangeListener,this._subscriptionUpdate),document.querySelector(".js-push-toggle-switch > input").addEventListener("click",function(e){e.target.checked?t._pushClient.subscribeDevice():t._pushClient.unsubscribeDevice()})}},{key:"registerServiceWorker",value:function(){var e=this;"serviceWorker"in navigator?navigator.serviceWorker.register("./service-worker.js")["catch"](function(){e.showErrorMessage("Unable to Register SW","Sorry this demo requires a service worker to work and it was didn't seem to install - sorry :(")}):this.showErrorMessage("Service Worker Not Supported","Sorry this demo requires service worker support in your browser. Please try this demo in Chrome or Firefox Nightly.")}},{key:"_stateChangeListener",value:function(e,t){switch("undefined"!=typeof e.interactive&&(e.interactive?this._toggleSwitch.enable():this._toggleSwitch.disable()),"undefined"!=typeof e.pushEnabled&&(e.pushEnabled?this._toggleSwitch.on():this._toggleSwitch.off()),e.id){case"ERROR":this.showErrorMessage("Ooops a Problem Occurred",t)}}},{key:"_subscriptionUpdate",value:function(e){var t=this;if(!e)return void(this._sendPushOptions.style.opacity=0);var i;i=0===e.endpoint.indexOf("https://android.googleapis.com/gcm/send")?this.produceGCMProprietaryCURLCommand(e):this.produceWebPushProtocolCURLCommand(e);var n=document.querySelector(".js-curl-code");n.innerHTML=i;var s=document.querySelector(".js-send-push-button");s.addEventListener("click",function(){t.sendPushMessage(e)}),this._sendPushOptions.style.opacity=1}},{key:"sendPushMessage",value:function(e){0===e.endpoint.indexOf("https://android.googleapis.com/gcm/send")?this.useGCMProtocol(e):this.useWebPushProtocol(e)}},{key:"useGCMProtocol",value:function(e){var t=this;console.log("Sending XHR to GCM Protocol endpoint");var i=new Headers;i.append("Content-Type","application/json"),i.append("Authorization","key="+this._API_KEY);var n=e.endpoint.split("/"),s=n[n.length-1];fetch("https://android.googleapis.com/gcm/send",{method:"post",headers:i,body:JSON.stringify({registration_ids:[s]})}).then(function(e){return e.json()}).then(function(e){if(0!==e.failure)throw console.log("Failed GCM response: ",e),new Error("Failed to send push message via GCM")})["catch"](function(e){t.showErrorMessage("Ooops Unable to Send a Push",e)})}},{key:"useWebPushProtocol",value:function(e){var t=this;console.log("Sending XHR to Web Push Protocol endpoint"),fetch(e.endpoint,{method:"post",headers:{TTL:"60"}}).then(function(e){if(e.status>=400&&e.status<500)throw console.log("Failed web push response: ",e,e.status),new Error("Failed to send push message via web push protocol")})["catch"](function(e){t.showErrorMessage("Ooops Unable to Send a Push",e)})}},{key:"produceGCMProprietaryCURLCommand",value:function(e){var t="https://android.googleapis.com/gcm/send",i=e.endpoint.split("/"),n=i[i.length-1],s='curl --header "Authorization: key='+this._API_KEY+'" --header Content-Type:"application/json" '+t+' -d "{\\"registration_ids\\":[\\"'+n+'\\"]}"';return s}},{key:"produceWebPushProtocolCURLCommand",value:function(e){var t=e.endpoint,i='curl -H "TTL: 60" --request POST '+t;return i}},{key:"showErrorMessage",value:function(e,t){var i=document.querySelector(".js-error-message-container"),n=i.querySelector(".js-error-title"),s=i.querySelector(".js-error-message");n.textContent=e,s.innerHTML=t,i.style.opacity=1;var r=document.querySelector(".js-send-push-options");r.style.display="none"}}]),e}();window.onload=function(){var e=new o;e.ready.then(function(){return document.body.dataset.simplePushDemoLoaded=!0,-1===window.location.protocol.indexOf("https")&&"localhost"!==window.location.hostname?void e.showErrorMessage("You Need to be HTTPs",'Please check out the <a href="https://gauntface.github.io/simple-push-demo/">HTTPs version of this page here</a>'):void e.registerServiceWorker()})}},{}]},{},[1]);
//# sourceMappingURL=main.js.map
