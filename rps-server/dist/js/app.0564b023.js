(function(e){function t(t){for(var o,b,l=t[0],u=t[1],a=t[2],s=0,f=[];s<l.length;s++)b=l[s],Object.prototype.hasOwnProperty.call(c,b)&&c[b]&&f.push(c[b][0]),c[b]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);i&&i(t);while(f.length)f.shift()();return r.push.apply(r,a||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,l=1;l<n.length;l++){var u=n[l];0!==c[u]&&(o=!1)}o&&(r.splice(t--,1),e=b(b.s=n[0]))}return e}var o={},c={app:0},r=[];function b(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,b),n.l=!0,n.exports}b.m=e,b.c=o,b.d=function(e,t,n){b.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},b.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},b.t=function(e,t){if(1&t&&(e=b(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(b.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)b.d(n,o,function(t){return e[t]}.bind(null,o));return n},b.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return b.d(t,"a",t),t},b.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},b.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],u=l.push.bind(l);l.push=t,l=l.slice();for(var a=0;a<l.length;a++)t(l[a]);var i=u;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("7a23"),c=(n("b0c0"),{class:"app"}),r={key:0},b={key:1},l={key:0,class:"game"},u={key:0},a={class:"options-box"},i={key:1,class:"results"},s=Object(o["f"])("div",null,"Game is Over!",-1);function f(e,t,n,f,j,d){var O=Object(o["l"])("Login"),p=Object(o["l"])("Lobby"),v=Object(o["l"])("ErrorMessage");return Object(o["g"])(),Object(o["e"])("div",c,[f.lobbyStarted?Object(o["d"])("",!0):(Object(o["g"])(),Object(o["e"])("div",r,[f.inLobby?Object(o["d"])("",!0):(Object(o["g"])(),Object(o["c"])(O,{key:0,onConnect:f.Connect},null,8,["onConnect"])),f.inLobby?(Object(o["g"])(),Object(o["c"])(p,{key:1,onBegin:f.Begin,lobby:f.lobby,selfID:f.userSocket.id},null,8,["onBegin","lobby","selfID"])):Object(o["d"])("",!0)])),f.lobbyStarted?(Object(o["g"])(),Object(o["e"])("div",b,[f.gameOver?Object(o["d"])("",!0):(Object(o["g"])(),Object(o["e"])("div",l,[(Object(o["g"])(!0),Object(o["e"])(o["a"],null,Object(o["k"])(f.lobby.matches,(function(e){return Object(o["g"])(),Object(o["e"])("div",{key:e.players[0].id},Object(o["m"])(e.players[0].name+(e.players[0].id==f.userSocket.id?" (you)":""))+" vs "+Object(o["m"])(e.players[1].name+(e.players[1].id==f.userSocket.id?" (you)":""))+" "+Object(o["m"])(e==f.lobby.matches[f.lobby.currentMatch]?"(current)":""),1)})),128)),f.userSocket.id==f.lobby.matches[f.lobby.currentMatch].players[0].id||f.userSocket.id==f.lobby.matches[f.lobby.currentMatch].players[1].id?(Object(o["g"])(),Object(o["e"])("div",u,[Object(o["f"])("div",a,[Object(o["f"])("button",{class:"option",onClick:t[0]||(t[0]=function(e){return f.Select("rock")})},"🪨"),Object(o["f"])("button",{class:"option",onClick:t[1]||(t[1]=function(e){return f.Select("paper")})},"📜"),Object(o["f"])("button",{class:"option",onClick:t[2]||(t[2]=function(e){return f.Select("scissor")})},"✂️")])])):Object(o["d"])("",!0)])),f.gameOver?(Object(o["g"])(),Object(o["e"])("div",i,[s,Object(o["f"])("div",null,"Total Players: "+Object(o["m"])(f.lobby.players.length),1),Object(o["f"])("div",null,"Winner: "+Object(o["m"])(f.lobby.winners.first.name),1),Object(o["f"])("div",null,"Honored: "+Object(o["m"])(f.lobby.winners.second.name),1)])):Object(o["d"])("",!0)])):Object(o["d"])("",!0),""!=f.errorMessage?(Object(o["g"])(),Object(o["c"])(v,{key:2,onResetError:f.ResetError,errorMessage:f.errorMessage},null,8,["onResetError","errorMessage"])):Object(o["d"])("",!0)])}var j=n("daa8"),d={class:"error-message"};function O(e,t,n,c,r,b){return Object(o["g"])(),Object(o["e"])("div",d,[Object(o["f"])("div",null,Object(o["m"])(n.errorMessage),1),Object(o["f"])("button",{onClick:t[0]||(t[0]=function(e){return c.ResetError()})},"OK")])}var p={props:{errorMessage:String},emits:["resetError"],setup:function(e,t){var n=t.emit;function o(){n("resetError")}return{ResetError:o}}},v=(n("701f"),n("6b0d")),y=n.n(v);const g=y()(p,[["render",O],["__scopeId","data-v-8635e610"]]);var m=g,h=function(e){return Object(o["i"])("data-v-c41bc676"),e=e(),Object(o["h"])(),e},k={class:"lobby"},S={class:"lobby-title"},M={class:"lobby-players"},C=h((function(){return Object(o["f"])("div",null,"Players Connected:",-1)})),I=["disabled"];function w(e,t,n,c,r,b){return Object(o["g"])(),Object(o["e"])("div",k,[Object(o["f"])("div",S,"In lobby: "+Object(o["m"])(n.lobby.name),1),Object(o["f"])("div",M,[C,(Object(o["g"])(!0),Object(o["e"])(o["a"],null,Object(o["k"])(n.lobby.players,(function(e){return Object(o["g"])(),Object(o["e"])("div",{key:e.id},Object(o["m"])(e.name)+" "+Object(o["m"])(n.lobby.host.id==e.id?"(host)":"")+" "+Object(o["m"])(n.selfID==e.id?"(you)":""),1)})),128))]),Object(o["f"])("button",{disabled:n.selfID!=n.lobby.host.id,class:"lobby-start",onClick:t[0]||(t[0]=function(e){return c.Begin()})},"begin",8,I)])}var _={props:{lobby:Object,isHost:Boolean,selfID:String},emits:["begin"],setup:function(e,t){var n=t.emit;function o(){n("begin")}return{Begin:o}}};n("dcd9");const E=y()(_,[["render",w],["__scopeId","data-v-c41bc676"]]);var x=E,L={ref:"nameInput",type:"text",placeholder:"Name"},P={ref:"lobbyInput",type:"text",placeholder:"Lobby"};function B(e,t,n,c,r,b){return Object(o["g"])(),Object(o["e"])("form",{class:"login",onSubmit:t[1]||(t[1]=Object(o["n"])((function(e){e.preventDefault()}),["prevent"]))},[Object(o["f"])("input",L,null,512),Object(o["f"])("input",P,null,512),Object(o["f"])("input",{onClick:t[0]||(t[0]=function(e){return c.Connect()}),type:"submit",value:"join"})],32)}var D={props:{},emits:["connect"],setup:function(e,t){var n=t.emit,c=Object(o["j"])(null),r=Object(o["j"])(null);function b(){n("connect",c.value.value,r.value.value)}return{nameInput:c,lobbyInput:r,Connect:b}}};n("b4bc");const R=y()(D,[["render",B],["__scopeId","data-v-3a1833f3"]]);var N=R,T={components:{ErrorMessage:m,Lobby:x,Login:N},setup:function(){var e=!0,t=e?"http://localhost:3000":"https://tteok-rps.herokuapp.com/",n=Object(o["j"])(""),c=Object(o["j"])(!1),r=Object(o["j"])(!1),b=Object(o["j"])(!1),l=Object(o["j"])(null),u=Object(o["j"])(null);function a(e,o){""!=e&&""!=o?(l.value=Object(j["a"])(t),l.value.on("lobby-update",(function(e){c.value=!0,u.value=e,console.log("lobby update: "),console.log(e)})),l.value.on("connect",(function(){console.log("Connected to Server!"),l.value.emit("login",{name:e,id:l.value.id,lobby:o})})),l.value.on("error",(function(e){n.value=e})),l.value.on("start-game",(function(){r.value=!0,console.log(u.value)})),l.value.on("end-game",(function(){b.value=!0}))):n.value="Invalid Name/Lobby"}function i(){l.value.emit("start-game",u.value.name)}function s(){n.value=""}function f(e){console.log("attempting to choose..."),l.value.emit("choose",{lobbyName:u.value.name,choice:e})}return{errorMessage:n,inLobby:c,lobbyStarted:r,gameOver:b,userSocket:l,lobby:u,Connect:a,Begin:i,ResetError:s,Select:f}}};n("e301");const H=y()(T,[["render",f]]);var J=H;Object(o["b"])(J).mount("#app")},"701f":function(e,t,n){"use strict";n("c23f")},7733:function(e,t,n){},"909d":function(e,t,n){},a599:function(e,t,n){},b4bc:function(e,t,n){"use strict";n("a599")},c23f:function(e,t,n){},dcd9:function(e,t,n){"use strict";n("909d")},e301:function(e,t,n){"use strict";n("7733")}});
//# sourceMappingURL=app.0564b023.js.map