(function(e){function t(t){for(var c,b,l=t[0],i=t[1],u=t[2],a=0,O=[];a<l.length;a++)b=l[a],Object.prototype.hasOwnProperty.call(r,b)&&r[b]&&O.push(r[b][0]),r[b]=0;for(c in i)Object.prototype.hasOwnProperty.call(i,c)&&(e[c]=i[c]);s&&s(t);while(O.length)O.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],c=!0,l=1;l<n.length;l++){var i=n[l];0!==r[i]&&(c=!1)}c&&(o.splice(t--,1),e=b(b.s=n[0]))}return e}var c={},r={app:0},o=[];function b(t){if(c[t])return c[t].exports;var n=c[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,b),n.l=!0,n.exports}b.m=e,b.c=c,b.d=function(e,t,n){b.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},b.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},b.t=function(e,t){if(1&t&&(e=b(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(b.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)b.d(n,c,function(t){return e[t]}.bind(null,c));return n},b.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return b.d(t,"a",t),t},b.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},b.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],i=l.push.bind(l);l.push=t,l=l.slice();for(var u=0;u<l.length;u++)t(l[u]);var s=i;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},1937:function(e,t,n){},"24a6":function(e,t,n){"use strict";n("1937")},"2db2":function(e,t,n){"use strict";n("863c")},"314c":function(e,t,n){"use strict";n("8275")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var c=n("7a23"),r={class:"app"},o={key:0,class:"lobby-setting"},b=Object(c["f"])("div",{class:"title"},[Object(c["f"])("pre",{class:"title"}," ___ ___  ___                        \n| _ \\ _ \\/ __|                       \n|   /  _/\\__ \\                       \n|_|_\\_|__|___/  _ ___ _  _ _____   __\n|_   _/ _ \\| | | | _ \\ \\| | __\\ \\ / /\n  | || (_) | |_| |   / .` | _| \\ V / \n|_| \\___/ \\___/|_|_\\_|\\_|___| |_|"),Object(c["f"])("br")],-1),l={class:"version-info"};function i(e,t,n,i,u,s){var a=Object(c["n"])("Login"),O=Object(c["n"])("Lobby"),f=Object(c["n"])("Game"),j=Object(c["n"])("ErrorMessage");return Object(c["i"])(),Object(c["e"])("div",r,[i.lobbyStarted?Object(c["d"])("",!0):(Object(c["i"])(),Object(c["e"])("div",o,[b,i.inLobby?Object(c["d"])("",!0):(Object(c["i"])(),Object(c["c"])(a,{key:0,onConnect:i.Connect},null,8,["onConnect"])),i.inLobby?(Object(c["i"])(),Object(c["c"])(O,{key:1,onBegin:i.Begin,lobby:i.lobby,selfID:i.userSocket.id},null,8,["onBegin","lobby","selfID"])):Object(c["d"])("",!0),Object(c["f"])("div",l," Ver. "+Object(c["o"])(i.VERSION)+" on "+Object(c["o"])(i.DEBUG?"Test Server":"Live Server"),1)])),i.lobbyStarted?(Object(c["i"])(),Object(c["c"])(f,{key:1,lobby:i.lobby,userSocket:i.userSocket,userChoice:i.userChoice,gameOver:i.gameOver,onSelect:i.Select},null,8,["lobby","userSocket","userChoice","gameOver","onSelect"])):Object(c["d"])("",!0),""!=i.errorMessage?(Object(c["i"])(),Object(c["c"])(j,{key:2,onResetError:i.ResetError,errorMessage:i.errorMessage},null,8,["onResetError","errorMessage"])):Object(c["d"])("",!0)])}n("b0c0");var u=n("daa8"),s=function(e){return Object(c["k"])("data-v-66f547e0"),e=e(),Object(c["j"])(),e},a={class:"error"},O=s((function(){return Object(c["f"])("div",{class:"error-background"},null,-1)})),f={class:"error-message"};function j(e,t,n,r,o,b){return Object(c["i"])(),Object(c["e"])("div",a,[O,Object(c["f"])("div",f,[Object(c["f"])("div",null,Object(c["o"])(n.errorMessage),1),Object(c["f"])("button",{onClick:t[0]||(t[0]=function(e){return r.ResetError()})},"OK")])])}var d={props:{errorMessage:String},emits:["resetError"],setup:function(e,t){var n=t.emit;function c(){n("resetError")}return{ResetError:c}}},v=(n("2db2"),n("6b0d")),p=n.n(v);const y=p()(d,[["render",j],["__scopeId","data-v-66f547e0"]]);var m=y,_=function(e){return Object(c["k"])("data-v-57271baf"),e=e(),Object(c["j"])(),e},g={class:"lobby"},h={class:"lobby-title"},k={class:"lobby-players"},S=_((function(){return Object(c["f"])("div",null,"Players Connected:",-1)})),C=["disabled"];function I(e,t,n,r,o,b){return Object(c["i"])(),Object(c["e"])("div",g,[Object(c["f"])("div",h,"In lobby: "+Object(c["o"])(n.lobby.name),1),Object(c["f"])("div",k,[S,(Object(c["i"])(!0),Object(c["e"])(c["a"],null,Object(c["m"])(n.lobby.players,(function(e){return Object(c["i"])(),Object(c["e"])("div",{key:e.id},Object(c["o"])(e.name)+" "+Object(c["o"])(n.lobby.host.id==e.id?"(host)":"")+" "+Object(c["o"])(n.selfID==e.id?"(you)":""),1)})),128))]),Object(c["f"])("button",{disabled:n.selfID!=n.lobby.host.id,class:"lobby-start",onClick:t[0]||(t[0]=function(e){return r.Begin()})},"begin",8,C)])}var M={props:{lobby:Object,isHost:Boolean,selfID:String},emits:["begin"],setup:function(e,t){var n=t.emit;function c(){n("begin")}return{Begin:c}}};n("bd92");const E=p()(M,[["render",I],["__scopeId","data-v-57271baf"]]);var w=E,B={ref:"nameInput",type:"text",placeholder:"Name"},L={ref:"lobbyInput",type:"text",placeholder:"Lobby"};function x(e,t,n,r,o,b){return Object(c["i"])(),Object(c["e"])("form",{class:"login",onSubmit:t[1]||(t[1]=Object(c["p"])((function(e){e.preventDefault()}),["prevent"]))},[Object(c["f"])("input",B,null,512),Object(c["f"])("input",L,null,512),Object(c["f"])("input",{onClick:t[0]||(t[0]=function(e){return r.Connect()}),type:"submit",value:"join"})],32)}var D={props:{},emits:["connect"],setup:function(e,t){var n=t.emit,r=Object(c["l"])(null),o=Object(c["l"])(null);function b(){n("connect",r.value.value,o.value.value)}return{nameInput:r,lobbyInput:o,Connect:b}}};n("24a6");const P=p()(D,[["render",x],["__scopeId","data-v-b9c840e8"]]);var R=P,G=n("2909"),N=function(e){return Object(c["k"])("data-v-21dc4c7e"),e=e(),Object(c["j"])(),e},T={key:0,class:"game"},V={class:"game-info"},H={class:"game-info-matches"},J=N((function(){return Object(c["f"])("div",null,"Matches this Set:",-1)})),U={class:"game-info-log"},F=N((function(){return Object(c["f"])("div",null,"Game Transcript:",-1)})),K={class:"game-info-log-scroll"},W={key:0,class:"game-options"},q={key:1,class:"results"},z={class:"results-top"},A=N((function(){return Object(c["f"])("div",null,"Game is Over!",-1)})),Q=N((function(){return Object(c["f"])("br",null,null,-1)})),X={class:"results-bottom"},Y=Object(c["g"])(" Full Game Transcript: "),Z={class:"transcript"};function $(e,t,n,r,o,b){return Object(c["i"])(),Object(c["e"])("div",null,[n.gameOver?Object(c["d"])("",!0):(Object(c["i"])(),Object(c["e"])("div",T,[Object(c["f"])("div",V,[Object(c["f"])("div",H,[J,(Object(c["i"])(!0),Object(c["e"])(c["a"],null,Object(c["m"])(n.lobby.matches,(function(e){return Object(c["i"])(),Object(c["e"])("div",{key:e.players[0].id},Object(c["o"])(e.players[0].name+(e.players[0].id==n.userSocket.id?" (you)":""))+" vs "+Object(c["o"])(e.players[1].name+(e.players[1].id==n.userSocket.id?" (you)":""))+" "+Object(c["o"])(e==n.lobby.matches[n.lobby.currentMatch]?"(current)":""),1)})),128))]),Object(c["f"])("div",U,[F,Object(c["f"])("div",K,[(Object(c["i"])(!0),Object(c["e"])(c["a"],null,Object(c["m"])(Object(G["a"])(n.lobby.messages).reverse(),(function(e){return Object(c["i"])(),Object(c["e"])("div",{key:e.id},Object(c["o"])(e.content),1)})),128))])])]),n.lobby.matches.length>0&&n.userSocket.id==n.lobby.matches[n.lobby.currentMatch].players[0].id||n.userSocket.id==n.lobby.matches[n.lobby.currentMatch].players[1].id?(Object(c["i"])(),Object(c["e"])("div",W,[Object(c["f"])("button",{class:Object(c["h"])("rock"==n.userChoice?"game-option selected":"game-option"),onClick:t[0]||(t[0]=function(e){return r.Select("rock")})},"🪨",2),Object(c["f"])("button",{class:Object(c["h"])("paper"==n.userChoice?"game-option selected":"game-option"),onClick:t[1]||(t[1]=function(e){return r.Select("paper")})},"📜",2),Object(c["f"])("button",{class:Object(c["h"])("scissor"==n.userChoice?"game-option selected":"game-option"),onClick:t[2]||(t[2]=function(e){return r.Select("scissor")})},"✂️",2)])):Object(c["d"])("",!0)])),n.gameOver?(Object(c["i"])(),Object(c["e"])("div",q,[Object(c["f"])("div",z,[A,Q,Object(c["f"])("div",null,"Winner: "+Object(c["o"])(n.lobby.winners.first.name),1),Object(c["f"])("div",null,"Honored: "+Object(c["o"])(n.lobby.winners.second.name),1)]),Object(c["f"])("div",X,[Y,Object(c["f"])("pre",Z,Object(c["o"])(n.lobby.transcript)+"\r\n            ",1)])])):Object(c["d"])("",!0)])}var ee={props:{lobby:Object,userSocket:Object,userChoice:String,gameOver:Boolean},emits:["select"],setup:function(e,t){var n=t.emit;function c(e){n("select",e)}return{Select:c}}};n("314c");const te=p()(ee,[["render",$],["__scopeId","data-v-21dc4c7e"]]);var ne=te,ce={components:{ErrorMessage:m,Lobby:w,Login:R,Game:ne},setup:function(){var e=Object(c["l"])("a1.1"),t=Object(c["l"])(!1),n=t.value?"http://localhost:3000":"https://tteok-rps.herokuapp.com/",r=Object(c["l"])(""),o=Object(c["l"])(""),b=Object(c["l"])(!1),l=Object(c["l"])(!1),i=Object(c["l"])(!1),s=Object(c["l"])(null),a=Object(c["l"])(null);function O(e,t){""!=e&&""!=t?(s.value=Object(u["a"])(n),s.value.on("lobby-update",(function(e){b.value=!0,a.value=e,o.value=""})),s.value.on("connect",(function(){console.log("Connected to Server!"),s.value.emit("login",{name:e,id:s.value.id,lobby:t})})),s.value.on("error",(function(e){r.value=e})),s.value.on("start-game",(function(){l.value=!0})),s.value.on("end-game",(function(){i.value=!0})),s.value.on("new-message",(function(e){a.value.messages=e}))):r.value="Invalid Name/Lobby"}function f(){s.value.emit("start-game",a.value.name)}function j(){r.value=""}function d(e){o.value=e,s.value.emit("choose",{lobbyName:a.value.name,choice:e})}return{VERSION:e,DEBUG:t,errorMessage:r,userChoice:o,inLobby:b,lobbyStarted:l,gameOver:i,userSocket:s,lobby:a,Connect:O,Begin:f,ResetError:j,Select:d}}};n("990e");const re=p()(ce,[["render",i]]);var oe=re;Object(c["b"])(oe).mount("#app")},8062:function(e,t,n){},8275:function(e,t,n){},"863c":function(e,t,n){},"990e":function(e,t,n){"use strict";n("f88a")},bd92:function(e,t,n){"use strict";n("8062")},f88a:function(e,t,n){}});
//# sourceMappingURL=app.12045e7c.js.map