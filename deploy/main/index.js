require('./sourcemap-register.js');module.exports=function(e,t){"use strict";var n={};function __webpack_require__(t){if(n[t]){return n[t].exports}var r=n[t]={i:t,l:false,exports:{}};e[t].call(r.exports,r,r.exports,__webpack_require__);r.l=true;return r.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(403)}t(__webpack_require__);return startup()}({87:function(e){e.exports=require("os")},129:function(e){e.exports=require("child_process")},311:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:true});const r=n(129);const i=n(669);const o="/bin/bash";function spawn(e,t,...n){const i={stdio:"inherit"};const s=typeof t==="string"?r.spawn(e,[t,...n],i):r.spawn(e,n,t===true?Object.assign(Object.assign({},i),{shell:o}):Object.assign(Object.assign({},i),t));const u=new Promise((e,t)=>{s.on("exit",n=>{if(n){t(new Error(`Exit code: ${n}`))}else{e()}})});u.child=s;return u}t.spawn=spawn;const s=i.promisify(r.exec);function exec(e,t=true){if(t===null){return s(e)}if(t===true)t=o;return s(e,{shell:t})}t.exec=exec},394:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const i=n(311);function prepareRemoteServer(){return r(this,void 0,void 0,function*(){yield i.spawn("rsync","--compress","--links","--executability",`${__dirname}/../remote/`,"aven.json","runtime-server:");yield i.spawn("ssh","runtime-server","bash","setup.sh")})}t.prepareRemoteServer=prepareRemoteServer},403:function(e,t,n){"use strict";e=n.nmd(e);var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const i=n(935);const o=n(394);const s=n(901);const u=n(311);const c=n(747);const a=n(684);const d=n(808);const{mkdir:l}=c.promises;function setupShhConfig(){return r(this,void 0,void 0,function*(){yield l(`${process.env.HOME}/.ssh`,{recursive:true});const e=[];const t=yield i.input("deploy-key");const n=`${process.env.HOME}/.ssh/id_rsa`;e.push(d.ensureFileIs(n,t,384));const r=(yield a.readAvenConfig()).domains[0];const o=(yield u.exec(`ssh-keyscan ${r}`)).stdout;console.log("Using host keys:");console.log(o);e.push(d.ensureFileContains(`${process.env.HOME}/.ssh/known_hosts`,o));const s=`\nHost runtime-server\n  HostName ${r}\n  Port 22\n  User root\n  CheckHostIP no\n`;e.push(d.ensureFileIs(`${process.env.HOME}/.ssh/config`,s));yield Promise.all(e)})}function copySources(){var e;return r(this,void 0,void 0,function*(){const t=yield i.input("deploy-directory");const n=yield a.readAvenConfig();const r=(e=n.serviceName,e!==null&&e!==void 0?e:n.domains[0]);yield u.spawn("rsync","--recursive","--links","--delete","--executability",t,`runtime-server:/opt/${r}`)})}function restartApplication(){return r(this,void 0,void 0,function*(){console.log("restart")})}function main(){return r(this,void 0,void 0,function*(){yield setupShhConfig();yield o.prepareRemoteServer();yield copySources();yield restartApplication()})}t.main=main;if(!e.parent)main().catch(s.reportError)},431:function(e,t,n){"use strict";var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const i=r(n(87));function issueCommand(e,t,n){const r=new Command(e,t,n);process.stdout.write(r.toString()+i.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const o="::";class Command{constructor(e,t,n){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=n}toString(){let e=o+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const n in this.properties){if(this.properties.hasOwnProperty(n)){const r=this.properties[n];if(r){if(t){t=false}else{e+=","}e+=`${n}=${escapeProperty(r)}`}}}}e+=`${o}${escapeData(this.message)}`;return e}}function escapeData(e){return(e||"").replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return(e||"").replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},470:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=n(431);const s=i(n(87));const u=i(n(622));var c;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(c=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){process.env[e]=t;o.issueCommand("set-env",{name:e},t)}t.exportVariable=exportVariable;function setSecret(e){o.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){o.issueCommand("add-path",{},e);process.env["PATH"]=`${e}${u.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const n=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!n){throw new Error(`Input required and not supplied: ${e}`)}return n.trim()}t.getInput=getInput;function setOutput(e,t){o.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setFailed(e){process.exitCode=c.Failure;error(e)}t.setFailed=setFailed;function debug(e){o.issueCommand("debug",{},e)}t.debug=debug;function error(e){o.issue("error",e)}t.error=error;function warning(e){o.issue("warning",e)}t.warning=warning;function info(e){process.stdout.write(e+s.EOL)}t.info=info;function startGroup(e){o.issue("group",e)}t.startGroup=startGroup;function endGroup(){o.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return r(this,void 0,void 0,function*(){startGroup(e);let n;try{n=yield t()}finally{endGroup()}return n})}t.group=group;function saveState(e,t){o.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState},622:function(e){e.exports=require("path")},669:function(e){e.exports=require("util")},684:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const i=n(747);const{readFile:o}=i.promises;let s;function readAvenConfig(){return r(this,void 0,void 0,function*(){if(s===undefined){const e=yield o("aven.json");s=JSON.parse(e.toString());if(!s.domains){throw new Error("`domains` not defined in `aven.json`.")}if(!Array.isArray(s.domains)){throw new Error("`domains` in `aven.json` is not an Array.")}if(s.domains.length<1){throw new Error("Need at least one domain defined")}}return s})}t.readAvenConfig=readAvenConfig},747:function(e){e.exports=require("fs")},808:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const i=n(747);const{readFile:o,writeFile:s,symlink:u,readlink:c,unlink:a}=i.promises;function ensureFileContains(e,t){return r(this,void 0,void 0,function*(){const n=(yield o(e).catch(()=>"")).toString();if(n.includes(t))return false;yield s(e,n+t);return true})}t.ensureFileContains=ensureFileContains;function ensureFileIs(e,t,n){return r(this,void 0,void 0,function*(){const r=(yield o(e).catch(()=>"")).toString();if(r===t)return false;yield s(e,t,{mode:n});return true})}t.ensureFileIs=ensureFileIs;function ensureFilesAre(e){return r(this,void 0,void 0,function*(){yield Promise.all(e.map(({filename:e,contents:t})=>ensureFileIs(e,t)))})}t.ensureFilesAre=ensureFilesAre;function ensureLinkIs(e,t){return r(this,void 0,void 0,function*(){const n=yield c(t).catch(e=>{if(e.code==="ENOENT")return undefined;throw e});if(e===n)return;if(n!==undefined)yield a(t);yield u(e,t)})}t.ensureLinkIs=ensureLinkIs},899:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.isGitHubAction=process.env.GITHUB_ACTIONS==="true"},901:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});function reportError(e){process.exitCode=1;console.log("Error in run!");console.log(e)}t.reportError=reportError},935:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const i=n(470);const o=n(899);function input(e){return r(this,void 0,void 0,function*(){if(!o.isGitHubAction){throw new Error("Not made to work in other environments yet!")}return i.getInput(e)})}t.input=input}},function(e){"use strict";!function(){e.nmd=function(e){e.paths=[];if(!e.children)e.children=[];Object.defineProperty(e,"loaded",{enumerable:true,get:function(){return e.l}});Object.defineProperty(e,"id",{enumerable:true,get:function(){return e.i}});return e}}()});
//# sourceMappingURL=index.js.map