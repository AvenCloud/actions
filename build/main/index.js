require('./sourcemap-register.js');module.exports=function(e,r){"use strict";var t={};function __webpack_require__(r){if(t[r]){return t[r].exports}var n=t[r]={i:r,l:false,exports:{}};e[r].call(n.exports,n,n.exports,__webpack_require__);n.l=true;return n.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(408)}r(__webpack_require__);return startup()}({20:function(e,r,t){"use strict";const n=t(129);const s=t(568);const o=t(881);function spawn(e,r,t){const i=s(e,r,t);const a=n.spawn(i.command,i.args,i.options);o.hookChildProcess(a,i);return a}function spawnSync(e,r,t){const i=s(e,r,t);const a=n.spawnSync(i.command,i.args,i.options);a.error=a.error||o.verifyENOENTSync(a.status,i);return a}e.exports=spawn;e.exports.spawn=spawn;e.exports.sync=spawnSync;e.exports._parse=s;e.exports._enoent=o},39:function(e){"use strict";e.exports=(e=>{e=e||{};const r=e.env||process.env;const t=e.platform||process.platform;if(t!=="win32"){return"PATH"}return Object.keys(r).find(e=>e.toUpperCase()==="PATH")||"Path"})},46:function(e,r,t){const n=t(747);const s=t(622);const o=t(20);const i=t(960);let a;let c;let u;function clearCache(){a=undefined;c=undefined;u=undefined}function hasYarn(){if(a!==undefined)return a;try{const e=o.sync("yarn",["--version"]);const r=e.stdout&&e.stdout.toString().trim();a=!!r}catch(e){a=false}return a}function hasNpm(){if(c!==undefined)return c;try{const e=o.sync("npm",["--version"]);const r=e.stdout&&e.stdout.toString().trim();c=!!r}catch(e){c=false}return c}function yarnOrNpm(){if(u!==undefined)return u;const e=i.sync();if(e){const r=s.join(e,"package-lock.json");const t=s.join(e,"yarn.lock");try{n.statSync(t);u="yarn";return u}catch(e){}try{n.statSync(r);u="npm";return u}catch(e){}}return hasYarn()?"yarn":"npm"}function spawn(...e){e.unshift(yarnOrNpm());return o(...e)}function spawnSync(...e){e.unshift(yarnOrNpm());return o.sync(...e)}yarnOrNpm.hasYarn=hasYarn;yarnOrNpm.hasNpm=hasNpm;yarnOrNpm.spawn=spawn;yarnOrNpm.spawn.sync=spawnSync;yarnOrNpm.clearCache=clearCache;e.exports=yarnOrNpm},129:function(e){e.exports=require("child_process")},197:function(e,r,t){e.exports=isexe;isexe.sync=sync;var n=t(747);function isexe(e,r,t){n.stat(e,function(e,n){t(e,e?false:checkStat(n,r))})}function sync(e,r){return checkStat(n.statSync(e),r)}function checkStat(e,r){return e.isFile()&&checkMode(e,r)}function checkMode(e,r){var t=e.mode;var n=e.uid;var s=e.gid;var o=r.uid!==undefined?r.uid:process.getuid&&process.getuid();var i=r.gid!==undefined?r.gid:process.getgid&&process.getgid();var a=parseInt("100",8);var c=parseInt("010",8);var u=parseInt("001",8);var f=a|c;var l=t&u||t&c&&s===i||t&a&&n===o||t&f&&o===0;return l}},311:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:true});const n=t(129);const s=t(669);const o="/bin/bash";function spawn(e,r,...t){const s={stdio:"inherit"};const i=typeof r==="string"?n.spawn(e,[r,...t],s):n.spawn(e,t,r===true?Object.assign(Object.assign({},s),{shell:o}):Object.assign(Object.assign({},s),r));const a=new Promise((e,r)=>{i.on("exit",t=>{if(t){r(new Error(`Exit code: ${t}`))}else{e()}})});a.child=i;return a}r.spawn=spawn;const i=s.promisify(n.exec);function exec(e,r=true){if(r===null){return i(e)}if(r===true)r=o;return i(e,{shell:r})}r.exec=exec},343:function(e,r,t){"use strict";const n=t(747);const{promisify:s}=t(669);const o=s(n.access);e.exports=(async e=>{try{await o(e);return true}catch(e){return false}});e.exports.sync=(e=>{try{n.accessSync(e);return true}catch(e){return false}})},389:function(e,r,t){"use strict";const n=t(747);const s=t(866);function readShebang(e){const r=150;let t;if(Buffer.alloc){t=Buffer.alloc(r)}else{t=new Buffer(r);t.fill(0)}let o;try{o=n.openSync(e,"r");n.readSync(o,t,0,r,0);n.closeSync(o)}catch(e){}return s(t.toString())}e.exports=readShebang},408:function(e,r,t){"use strict";e=t.nmd(e);var n=this&&this.__awaiter||function(e,r,t,n){function adopt(e){return e instanceof t?e:new t(function(r){r(e)})}return new(t||(t=Promise))(function(t,s){function fulfilled(e){try{step(n.next(e))}catch(e){s(e)}}function rejected(e){try{step(n["throw"](e))}catch(e){s(e)}}function step(e){e.done?t(e.value):adopt(e.value).then(fulfilled,rejected)}step((n=n.apply(e,r||[])).next())})};var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(r,"__esModule",{value:true});const o=t(311);const i=s(t(46));const a=t(901);function main(){return n(this,void 0,void 0,function*(){yield o.spawn(i.default(),"run","build")})}r.main=main;if(!e.parent)main().catch(a.reportError)},462:function(e){"use strict";const r=/([()\][%!^"`<>&|;, *?])/g;function escapeCommand(e){e=e.replace(r,"^$1");return e}function escapeArgument(e,t){e=`${e}`;e=e.replace(/(\\*)"/g,'$1$1\\"');e=e.replace(/(\\*)$/,"$1$1");e=`"${e}"`;e=e.replace(r,"^$1");if(t){e=e.replace(r,"^$1")}return e}e.exports.command=escapeCommand;e.exports.argument=escapeArgument},470:function(e,r){r=e.exports=SemVer;var t;if(typeof process==="object"&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)){t=function(){var e=Array.prototype.slice.call(arguments,0);e.unshift("SEMVER");console.log.apply(console,e)}}else{t=function(){}}r.SEMVER_SPEC_VERSION="2.0.0";var n=256;var s=Number.MAX_SAFE_INTEGER||9007199254740991;var o=16;var i=r.re=[];var a=r.src=[];var c=0;var u=c++;a[u]="0|[1-9]\\d*";var f=c++;a[f]="[0-9]+";var l=c++;a[l]="\\d*[a-zA-Z-][a-zA-Z0-9-]*";var p=c++;a[p]="("+a[u]+")\\."+"("+a[u]+")\\."+"("+a[u]+")";var h=c++;a[h]="("+a[f]+")\\."+"("+a[f]+")\\."+"("+a[f]+")";var v=c++;a[v]="(?:"+a[u]+"|"+a[l]+")";var d=c++;a[d]="(?:"+a[f]+"|"+a[l]+")";var y=c++;a[y]="(?:-("+a[v]+"(?:\\."+a[v]+")*))";var w=c++;a[w]="(?:-?("+a[d]+"(?:\\."+a[d]+")*))";var m=c++;a[m]="[0-9A-Za-z-]+";var g=c++;a[g]="(?:\\+("+a[m]+"(?:\\."+a[m]+")*))";var E=c++;var S="v?"+a[p]+a[y]+"?"+a[g]+"?";a[E]="^"+S+"$";var x="[v=\\s]*"+a[h]+a[w]+"?"+a[g]+"?";var j=c++;a[j]="^"+x+"$";var b=c++;a[b]="((?:<|>)?=?)";var C=c++;a[C]=a[f]+"|x|X|\\*";var V=c++;a[V]=a[u]+"|x|X|\\*";var N=c++;a[N]="[v=\\s]*("+a[V]+")"+"(?:\\.("+a[V]+")"+"(?:\\.("+a[V]+")"+"(?:"+a[y]+")?"+a[g]+"?"+")?)?";var R=c++;a[R]="[v=\\s]*("+a[C]+")"+"(?:\\.("+a[C]+")"+"(?:\\.("+a[C]+")"+"(?:"+a[w]+")?"+a[g]+"?"+")?)?";var O=c++;a[O]="^"+a[b]+"\\s*"+a[N]+"$";var P=c++;a[P]="^"+a[b]+"\\s*"+a[R]+"$";var k=c++;a[k]="(?:^|[^\\d])"+"(\\d{1,"+o+"})"+"(?:\\.(\\d{1,"+o+"}))?"+"(?:\\.(\\d{1,"+o+"}))?"+"(?:$|[^\\d])";var T=c++;a[T]="(?:~>?)";var $=c++;a[$]="(\\s*)"+a[T]+"\\s+";i[$]=new RegExp(a[$],"g");var _="$1~";var I=c++;a[I]="^"+a[T]+a[N]+"$";var X=c++;a[X]="^"+a[T]+a[R]+"$";var A=c++;a[A]="(?:\\^)";var q=c++;a[q]="(\\s*)"+a[A]+"\\s+";i[q]=new RegExp(a[q],"g");var F="$1^";var D=c++;a[D]="^"+a[A]+a[N]+"$";var L=c++;a[L]="^"+a[A]+a[R]+"$";var B=c++;a[B]="^"+a[b]+"\\s*("+x+")$|^$";var H=c++;a[H]="^"+a[b]+"\\s*("+S+")$|^$";var U=c++;a[U]="(\\s*)"+a[b]+"\\s*("+x+"|"+a[N]+")";i[U]=new RegExp(a[U],"g");var G="$1$2$3";var Y=c++;a[Y]="^\\s*("+a[N]+")"+"\\s+-\\s+"+"("+a[N]+")"+"\\s*$";var Z=c++;a[Z]="^\\s*("+a[R]+")"+"\\s+-\\s+"+"("+a[R]+")"+"\\s*$";var z=c++;a[z]="(<|>)?=?\\s*\\*";for(var W=0;W<c;W++){t(W,a[W]);if(!i[W]){i[W]=new RegExp(a[W])}}r.parse=parse;function parse(e,r){if(!r||typeof r!=="object"){r={loose:!!r,includePrerelease:false}}if(e instanceof SemVer){return e}if(typeof e!=="string"){return null}if(e.length>n){return null}var t=r.loose?i[j]:i[E];if(!t.test(e)){return null}try{return new SemVer(e,r)}catch(e){return null}}r.valid=valid;function valid(e,r){var t=parse(e,r);return t?t.version:null}r.clean=clean;function clean(e,r){var t=parse(e.trim().replace(/^[=v]+/,""),r);return t?t.version:null}r.SemVer=SemVer;function SemVer(e,r){if(!r||typeof r!=="object"){r={loose:!!r,includePrerelease:false}}if(e instanceof SemVer){if(e.loose===r.loose){return e}else{e=e.version}}else if(typeof e!=="string"){throw new TypeError("Invalid Version: "+e)}if(e.length>n){throw new TypeError("version is longer than "+n+" characters")}if(!(this instanceof SemVer)){return new SemVer(e,r)}t("SemVer",e,r);this.options=r;this.loose=!!r.loose;var o=e.trim().match(r.loose?i[j]:i[E]);if(!o){throw new TypeError("Invalid Version: "+e)}this.raw=e;this.major=+o[1];this.minor=+o[2];this.patch=+o[3];if(this.major>s||this.major<0){throw new TypeError("Invalid major version")}if(this.minor>s||this.minor<0){throw new TypeError("Invalid minor version")}if(this.patch>s||this.patch<0){throw new TypeError("Invalid patch version")}if(!o[4]){this.prerelease=[]}else{this.prerelease=o[4].split(".").map(function(e){if(/^[0-9]+$/.test(e)){var r=+e;if(r>=0&&r<s){return r}}return e})}this.build=o[5]?o[5].split("."):[];this.format()}SemVer.prototype.format=function(){this.version=this.major+"."+this.minor+"."+this.patch;if(this.prerelease.length){this.version+="-"+this.prerelease.join(".")}return this.version};SemVer.prototype.toString=function(){return this.version};SemVer.prototype.compare=function(e){t("SemVer.compare",this.version,this.options,e);if(!(e instanceof SemVer)){e=new SemVer(e,this.options)}return this.compareMain(e)||this.comparePre(e)};SemVer.prototype.compareMain=function(e){if(!(e instanceof SemVer)){e=new SemVer(e,this.options)}return compareIdentifiers(this.major,e.major)||compareIdentifiers(this.minor,e.minor)||compareIdentifiers(this.patch,e.patch)};SemVer.prototype.comparePre=function(e){if(!(e instanceof SemVer)){e=new SemVer(e,this.options)}if(this.prerelease.length&&!e.prerelease.length){return-1}else if(!this.prerelease.length&&e.prerelease.length){return 1}else if(!this.prerelease.length&&!e.prerelease.length){return 0}var r=0;do{var n=this.prerelease[r];var s=e.prerelease[r];t("prerelease compare",r,n,s);if(n===undefined&&s===undefined){return 0}else if(s===undefined){return 1}else if(n===undefined){return-1}else if(n===s){continue}else{return compareIdentifiers(n,s)}}while(++r)};SemVer.prototype.inc=function(e,r){switch(e){case"premajor":this.prerelease.length=0;this.patch=0;this.minor=0;this.major++;this.inc("pre",r);break;case"preminor":this.prerelease.length=0;this.patch=0;this.minor++;this.inc("pre",r);break;case"prepatch":this.prerelease.length=0;this.inc("patch",r);this.inc("pre",r);break;case"prerelease":if(this.prerelease.length===0){this.inc("patch",r)}this.inc("pre",r);break;case"major":if(this.minor!==0||this.patch!==0||this.prerelease.length===0){this.major++}this.minor=0;this.patch=0;this.prerelease=[];break;case"minor":if(this.patch!==0||this.prerelease.length===0){this.minor++}this.patch=0;this.prerelease=[];break;case"patch":if(this.prerelease.length===0){this.patch++}this.prerelease=[];break;case"pre":if(this.prerelease.length===0){this.prerelease=[0]}else{var t=this.prerelease.length;while(--t>=0){if(typeof this.prerelease[t]==="number"){this.prerelease[t]++;t=-2}}if(t===-1){this.prerelease.push(0)}}if(r){if(this.prerelease[0]===r){if(isNaN(this.prerelease[1])){this.prerelease=[r,0]}}else{this.prerelease=[r,0]}}break;default:throw new Error("invalid increment argument: "+e)}this.format();this.raw=this.version;return this};r.inc=inc;function inc(e,r,t,n){if(typeof t==="string"){n=t;t=undefined}try{return new SemVer(e,t).inc(r,n).version}catch(e){return null}}r.diff=diff;function diff(e,r){if(eq(e,r)){return null}else{var t=parse(e);var n=parse(r);var s="";if(t.prerelease.length||n.prerelease.length){s="pre";var o="prerelease"}for(var i in t){if(i==="major"||i==="minor"||i==="patch"){if(t[i]!==n[i]){return s+i}}}return o}}r.compareIdentifiers=compareIdentifiers;var J=/^[0-9]+$/;function compareIdentifiers(e,r){var t=J.test(e);var n=J.test(r);if(t&&n){e=+e;r=+r}return e===r?0:t&&!n?-1:n&&!t?1:e<r?-1:1}r.rcompareIdentifiers=rcompareIdentifiers;function rcompareIdentifiers(e,r){return compareIdentifiers(r,e)}r.major=major;function major(e,r){return new SemVer(e,r).major}r.minor=minor;function minor(e,r){return new SemVer(e,r).minor}r.patch=patch;function patch(e,r){return new SemVer(e,r).patch}r.compare=compare;function compare(e,r,t){return new SemVer(e,t).compare(new SemVer(r,t))}r.compareLoose=compareLoose;function compareLoose(e,r){return compare(e,r,true)}r.rcompare=rcompare;function rcompare(e,r,t){return compare(r,e,t)}r.sort=sort;function sort(e,t){return e.sort(function(e,n){return r.compare(e,n,t)})}r.rsort=rsort;function rsort(e,t){return e.sort(function(e,n){return r.rcompare(e,n,t)})}r.gt=gt;function gt(e,r,t){return compare(e,r,t)>0}r.lt=lt;function lt(e,r,t){return compare(e,r,t)<0}r.eq=eq;function eq(e,r,t){return compare(e,r,t)===0}r.neq=neq;function neq(e,r,t){return compare(e,r,t)!==0}r.gte=gte;function gte(e,r,t){return compare(e,r,t)>=0}r.lte=lte;function lte(e,r,t){return compare(e,r,t)<=0}r.cmp=cmp;function cmp(e,r,t,n){switch(r){case"===":if(typeof e==="object")e=e.version;if(typeof t==="object")t=t.version;return e===t;case"!==":if(typeof e==="object")e=e.version;if(typeof t==="object")t=t.version;return e!==t;case"":case"=":case"==":return eq(e,t,n);case"!=":return neq(e,t,n);case">":return gt(e,t,n);case">=":return gte(e,t,n);case"<":return lt(e,t,n);case"<=":return lte(e,t,n);default:throw new TypeError("Invalid operator: "+r)}}r.Comparator=Comparator;function Comparator(e,r){if(!r||typeof r!=="object"){r={loose:!!r,includePrerelease:false}}if(e instanceof Comparator){if(e.loose===!!r.loose){return e}else{e=e.value}}if(!(this instanceof Comparator)){return new Comparator(e,r)}t("comparator",e,r);this.options=r;this.loose=!!r.loose;this.parse(e);if(this.semver===K){this.value=""}else{this.value=this.operator+this.semver.version}t("comp",this)}var K={};Comparator.prototype.parse=function(e){var r=this.options.loose?i[B]:i[H];var t=e.match(r);if(!t){throw new TypeError("Invalid comparator: "+e)}this.operator=t[1];if(this.operator==="="){this.operator=""}if(!t[2]){this.semver=K}else{this.semver=new SemVer(t[2],this.options.loose)}};Comparator.prototype.toString=function(){return this.value};Comparator.prototype.test=function(e){t("Comparator.test",e,this.options.loose);if(this.semver===K){return true}if(typeof e==="string"){e=new SemVer(e,this.options)}return cmp(e,this.operator,this.semver,this.options)};Comparator.prototype.intersects=function(e,r){if(!(e instanceof Comparator)){throw new TypeError("a Comparator is required")}if(!r||typeof r!=="object"){r={loose:!!r,includePrerelease:false}}var t;if(this.operator===""){t=new Range(e.value,r);return satisfies(this.value,t,r)}else if(e.operator===""){t=new Range(this.value,r);return satisfies(e.semver,t,r)}var n=(this.operator===">="||this.operator===">")&&(e.operator===">="||e.operator===">");var s=(this.operator==="<="||this.operator==="<")&&(e.operator==="<="||e.operator==="<");var o=this.semver.version===e.semver.version;var i=(this.operator===">="||this.operator==="<=")&&(e.operator===">="||e.operator==="<=");var a=cmp(this.semver,"<",e.semver,r)&&((this.operator===">="||this.operator===">")&&(e.operator==="<="||e.operator==="<"));var c=cmp(this.semver,">",e.semver,r)&&((this.operator==="<="||this.operator==="<")&&(e.operator===">="||e.operator===">"));return n||s||o&&i||a||c};r.Range=Range;function Range(e,r){if(!r||typeof r!=="object"){r={loose:!!r,includePrerelease:false}}if(e instanceof Range){if(e.loose===!!r.loose&&e.includePrerelease===!!r.includePrerelease){return e}else{return new Range(e.raw,r)}}if(e instanceof Comparator){return new Range(e.value,r)}if(!(this instanceof Range)){return new Range(e,r)}this.options=r;this.loose=!!r.loose;this.includePrerelease=!!r.includePrerelease;this.raw=e;this.set=e.split(/\s*\|\|\s*/).map(function(e){return this.parseRange(e.trim())},this).filter(function(e){return e.length});if(!this.set.length){throw new TypeError("Invalid SemVer Range: "+e)}this.format()}Range.prototype.format=function(){this.range=this.set.map(function(e){return e.join(" ").trim()}).join("||").trim();return this.range};Range.prototype.toString=function(){return this.range};Range.prototype.parseRange=function(e){var r=this.options.loose;e=e.trim();var n=r?i[Z]:i[Y];e=e.replace(n,hyphenReplace);t("hyphen replace",e);e=e.replace(i[U],G);t("comparator trim",e,i[U]);e=e.replace(i[$],_);e=e.replace(i[q],F);e=e.split(/\s+/).join(" ");var s=r?i[B]:i[H];var o=e.split(" ").map(function(e){return parseComparator(e,this.options)},this).join(" ").split(/\s+/);if(this.options.loose){o=o.filter(function(e){return!!e.match(s)})}o=o.map(function(e){return new Comparator(e,this.options)},this);return o};Range.prototype.intersects=function(e,r){if(!(e instanceof Range)){throw new TypeError("a Range is required")}return this.set.some(function(t){return t.every(function(t){return e.set.some(function(e){return e.every(function(e){return t.intersects(e,r)})})})})};r.toComparators=toComparators;function toComparators(e,r){return new Range(e,r).set.map(function(e){return e.map(function(e){return e.value}).join(" ").trim().split(" ")})}function parseComparator(e,r){t("comp",e,r);e=replaceCarets(e,r);t("caret",e);e=replaceTildes(e,r);t("tildes",e);e=replaceXRanges(e,r);t("xrange",e);e=replaceStars(e,r);t("stars",e);return e}function isX(e){return!e||e.toLowerCase()==="x"||e==="*"}function replaceTildes(e,r){return e.trim().split(/\s+/).map(function(e){return replaceTilde(e,r)}).join(" ")}function replaceTilde(e,r){var n=r.loose?i[X]:i[I];return e.replace(n,function(r,n,s,o,i){t("tilde",e,r,n,s,o,i);var a;if(isX(n)){a=""}else if(isX(s)){a=">="+n+".0.0 <"+(+n+1)+".0.0"}else if(isX(o)){a=">="+n+"."+s+".0 <"+n+"."+(+s+1)+".0"}else if(i){t("replaceTilde pr",i);a=">="+n+"."+s+"."+o+"-"+i+" <"+n+"."+(+s+1)+".0"}else{a=">="+n+"."+s+"."+o+" <"+n+"."+(+s+1)+".0"}t("tilde return",a);return a})}function replaceCarets(e,r){return e.trim().split(/\s+/).map(function(e){return replaceCaret(e,r)}).join(" ")}function replaceCaret(e,r){t("caret",e,r);var n=r.loose?i[L]:i[D];return e.replace(n,function(r,n,s,o,i){t("caret",e,r,n,s,o,i);var a;if(isX(n)){a=""}else if(isX(s)){a=">="+n+".0.0 <"+(+n+1)+".0.0"}else if(isX(o)){if(n==="0"){a=">="+n+"."+s+".0 <"+n+"."+(+s+1)+".0"}else{a=">="+n+"."+s+".0 <"+(+n+1)+".0.0"}}else if(i){t("replaceCaret pr",i);if(n==="0"){if(s==="0"){a=">="+n+"."+s+"."+o+"-"+i+" <"+n+"."+s+"."+(+o+1)}else{a=">="+n+"."+s+"."+o+"-"+i+" <"+n+"."+(+s+1)+".0"}}else{a=">="+n+"."+s+"."+o+"-"+i+" <"+(+n+1)+".0.0"}}else{t("no pr");if(n==="0"){if(s==="0"){a=">="+n+"."+s+"."+o+" <"+n+"."+s+"."+(+o+1)}else{a=">="+n+"."+s+"."+o+" <"+n+"."+(+s+1)+".0"}}else{a=">="+n+"."+s+"."+o+" <"+(+n+1)+".0.0"}}t("caret return",a);return a})}function replaceXRanges(e,r){t("replaceXRanges",e,r);return e.split(/\s+/).map(function(e){return replaceXRange(e,r)}).join(" ")}function replaceXRange(e,r){e=e.trim();var n=r.loose?i[P]:i[O];return e.replace(n,function(r,n,s,o,i,a){t("xRange",e,r,n,s,o,i,a);var c=isX(s);var u=c||isX(o);var f=u||isX(i);var l=f;if(n==="="&&l){n=""}if(c){if(n===">"||n==="<"){r="<0.0.0"}else{r="*"}}else if(n&&l){if(u){o=0}i=0;if(n===">"){n=">=";if(u){s=+s+1;o=0;i=0}else{o=+o+1;i=0}}else if(n==="<="){n="<";if(u){s=+s+1}else{o=+o+1}}r=n+s+"."+o+"."+i}else if(u){r=">="+s+".0.0 <"+(+s+1)+".0.0"}else if(f){r=">="+s+"."+o+".0 <"+s+"."+(+o+1)+".0"}t("xRange return",r);return r})}function replaceStars(e,r){t("replaceStars",e,r);return e.trim().replace(i[z],"")}function hyphenReplace(e,r,t,n,s,o,i,a,c,u,f,l,p){if(isX(t)){r=""}else if(isX(n)){r=">="+t+".0.0"}else if(isX(s)){r=">="+t+"."+n+".0"}else{r=">="+r}if(isX(c)){a=""}else if(isX(u)){a="<"+(+c+1)+".0.0"}else if(isX(f)){a="<"+c+"."+(+u+1)+".0"}else if(l){a="<="+c+"."+u+"."+f+"-"+l}else{a="<="+a}return(r+" "+a).trim()}Range.prototype.test=function(e){if(!e){return false}if(typeof e==="string"){e=new SemVer(e,this.options)}for(var r=0;r<this.set.length;r++){if(testSet(this.set[r],e,this.options)){return true}}return false};function testSet(e,r,n){for(var s=0;s<e.length;s++){if(!e[s].test(r)){return false}}if(r.prerelease.length&&!n.includePrerelease){for(s=0;s<e.length;s++){t(e[s].semver);if(e[s].semver===K){continue}if(e[s].semver.prerelease.length>0){var o=e[s].semver;if(o.major===r.major&&o.minor===r.minor&&o.patch===r.patch){return true}}}return false}return true}r.satisfies=satisfies;function satisfies(e,r,t){try{r=new Range(r,t)}catch(e){return false}return r.test(e)}r.maxSatisfying=maxSatisfying;function maxSatisfying(e,r,t){var n=null;var s=null;try{var o=new Range(r,t)}catch(e){return null}e.forEach(function(e){if(o.test(e)){if(!n||s.compare(e)===-1){n=e;s=new SemVer(n,t)}}});return n}r.minSatisfying=minSatisfying;function minSatisfying(e,r,t){var n=null;var s=null;try{var o=new Range(r,t)}catch(e){return null}e.forEach(function(e){if(o.test(e)){if(!n||s.compare(e)===1){n=e;s=new SemVer(n,t)}}});return n}r.minVersion=minVersion;function minVersion(e,r){e=new Range(e,r);var t=new SemVer("0.0.0");if(e.test(t)){return t}t=new SemVer("0.0.0-0");if(e.test(t)){return t}t=null;for(var n=0;n<e.set.length;++n){var s=e.set[n];s.forEach(function(e){var r=new SemVer(e.semver.version);switch(e.operator){case">":if(r.prerelease.length===0){r.patch++}else{r.prerelease.push(0)}r.raw=r.format();case"":case">=":if(!t||gt(t,r)){t=r}break;case"<":case"<=":break;default:throw new Error("Unexpected operation: "+e.operator)}})}if(t&&e.test(t)){return t}return null}r.validRange=validRange;function validRange(e,r){try{return new Range(e,r).range||"*"}catch(e){return null}}r.ltr=ltr;function ltr(e,r,t){return outside(e,r,"<",t)}r.gtr=gtr;function gtr(e,r,t){return outside(e,r,">",t)}r.outside=outside;function outside(e,r,t,n){e=new SemVer(e,n);r=new Range(r,n);var s,o,i,a,c;switch(t){case">":s=gt;o=lte;i=lt;a=">";c=">=";break;case"<":s=lt;o=gte;i=gt;a="<";c="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(satisfies(e,r,n)){return false}for(var u=0;u<r.set.length;++u){var f=r.set[u];var l=null;var p=null;f.forEach(function(e){if(e.semver===K){e=new Comparator(">=0.0.0")}l=l||e;p=p||e;if(s(e.semver,l.semver,n)){l=e}else if(i(e.semver,p.semver,n)){p=e}});if(l.operator===a||l.operator===c){return false}if((!p.operator||p.operator===a)&&o(e,p.semver)){return false}else if(p.operator===c&&i(e,p.semver)){return false}}return true}r.prerelease=prerelease;function prerelease(e,r){var t=parse(e,r);return t&&t.prerelease.length?t.prerelease:null}r.intersects=intersects;function intersects(e,r,t){e=new Range(e,t);r=new Range(r,t);return e.intersects(r)}r.coerce=coerce;function coerce(e){if(e instanceof SemVer){return e}if(typeof e!=="string"){return null}var r=e.match(i[k]);if(r==null){return null}return parse(r[1]+"."+(r[2]||"0")+"."+(r[3]||"0"))}},489:function(e,r,t){"use strict";const n=t(622);const s=t(814);const o=t(39)();function resolveCommandAttempt(e,r){const t=process.cwd();const i=e.options.cwd!=null;if(i){try{process.chdir(e.options.cwd)}catch(e){}}let a;try{a=s.sync(e.command,{path:(e.options.env||process.env)[o],pathExt:r?n.delimiter:undefined})}catch(e){}finally{process.chdir(t)}if(a){a=n.resolve(i?e.options.cwd:"",a)}return a}function resolveCommand(e){return resolveCommandAttempt(e)||resolveCommandAttempt(e,true)}e.exports=resolveCommand},537:function(e,r,t){"use strict";const n=t(622);const s=t(605);const o=t(343);const i=Symbol("findUp.stop");e.exports=(async(e,r={})=>{let t=n.resolve(r.cwd||"");const{root:o}=n.parse(t);const a=[].concat(e);const c=async r=>{if(typeof e!=="function"){return s(a,r)}const t=await e(r.cwd);if(typeof t==="string"){return s([t],r)}return t};while(true){const e=await c({...r,cwd:t});if(e===i){return}if(e){return n.resolve(t,e)}if(t===o){return}t=n.dirname(t)}});e.exports.sync=((e,r={})=>{let t=n.resolve(r.cwd||"");const{root:o}=n.parse(t);const a=[].concat(e);const c=r=>{if(typeof e!=="function"){return s.sync(a,r)}const t=e(r.cwd);if(typeof t==="string"){return s.sync([t],r)}return t};while(true){const e=c({...r,cwd:t});if(e===i){return}if(e){return n.resolve(t,e)}if(t===o){return}t=n.dirname(t)}});e.exports.exists=o;e.exports.sync.exists=o.sync;e.exports.stop=i},565:function(e,r,t){"use strict";const n=t(570);const s=e=>{if(!((Number.isInteger(e)||e===Infinity)&&e>0)){return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"))}const r=[];let t=0;const s=()=>{t--;if(r.length>0){r.shift()()}};const o=(e,r,...o)=>{t++;const i=n(e,...o);r(i);i.then(s,s)};const i=(n,s,...i)=>{if(t<e){o(n,s,...i)}else{r.push(o.bind(null,n,s,...i))}};const a=(e,...r)=>new Promise(t=>i(e,t,...r));Object.defineProperties(a,{activeCount:{get:()=>t},pendingCount:{get:()=>r.length}});return a};e.exports=s;e.exports.default=s},568:function(e,r,t){"use strict";const n=t(622);const s=t(948);const o=t(489);const i=t(462);const a=t(389);const c=t(470);const u=process.platform==="win32";const f=/\.(?:com|exe)$/i;const l=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;const p=s(()=>c.satisfies(process.version,"^4.8.0 || ^5.7.0 || >= 6.0.0",true))||false;function detectShebang(e){e.file=o(e);const r=e.file&&a(e.file);if(r){e.args.unshift(e.file);e.command=r;return o(e)}return e.file}function parseNonShell(e){if(!u){return e}const r=detectShebang(e);const t=!f.test(r);if(e.options.forceShell||t){const t=l.test(r);e.command=n.normalize(e.command);e.command=i.command(e.command);e.args=e.args.map(e=>i.argument(e,t));const s=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${s}"`];e.command=process.env.comspec||"cmd.exe";e.options.windowsVerbatimArguments=true}return e}function parseShell(e){if(p){return e}const r=[e.command].concat(e.args).join(" ");if(u){e.command=typeof e.options.shell==="string"?e.options.shell:process.env.comspec||"cmd.exe";e.args=["/d","/s","/c",`"${r}"`];e.options.windowsVerbatimArguments=true}else{if(typeof e.options.shell==="string"){e.command=e.options.shell}else if(process.platform==="android"){e.command="/system/bin/sh"}else{e.command="/bin/sh"}e.args=["-c",r]}return e}function parse(e,r,t){if(r&&!Array.isArray(r)){t=r;r=null}r=r?r.slice(0):[];t=Object.assign({},t);const n={command:e,args:r,options:t,file:undefined,original:{command:e,args:r}};return t.shell?parseShell(n):parseNonShell(n)}e.exports=parse},570:function(e){"use strict";const r=(e,...r)=>new Promise(t=>{t(e(...r))});e.exports=r;e.exports.default=r},605:function(e,r,t){"use strict";const n=t(622);const s=t(747);const{promisify:o}=t(669);const i=t(893);const a=o(s.stat);const c=o(s.lstat);const u={directory:"isDirectory",file:"isFile"};function checkType({type:e}){if(e in u){return}throw new Error(`Invalid type specified: ${e}`)}const f=(e,r)=>e===undefined||r[u[e]]();e.exports=(async(e,r)=>{r={cwd:process.cwd(),type:"file",allowSymlinks:true,...r};checkType(r);const t=r.allowSymlinks?a:c;return i(e,async e=>{try{const s=await t(n.resolve(r.cwd,e));return f(r.type,s)}catch(e){return false}},r)});e.exports.sync=((e,r)=>{r={cwd:process.cwd(),allowSymlinks:true,type:"file",...r};checkType(r);const t=r.allowSymlinks?s.statSync:s.lstatSync;for(const s of e){try{const e=t(n.resolve(r.cwd,s));if(f(r.type,e)){return s}}catch(e){}}})},622:function(e){e.exports=require("path")},669:function(e){e.exports=require("util")},742:function(e,r,t){var n=t(747);var s;if(process.platform==="win32"||global.TESTING_WINDOWS){s=t(818)}else{s=t(197)}e.exports=isexe;isexe.sync=sync;function isexe(e,r,t){if(typeof r==="function"){t=r;r={}}if(!t){if(typeof Promise!=="function"){throw new TypeError("callback not provided")}return new Promise(function(t,n){isexe(e,r||{},function(e,r){if(e){n(e)}else{t(r)}})})}s(e,r||{},function(e,n){if(e){if(e.code==="EACCES"||r&&r.ignoreErrors){e=null;n=false}}t(e,n)})}function sync(e,r){try{return s.sync(e,r||{})}catch(e){if(r&&r.ignoreErrors||e.code==="EACCES"){return false}else{throw e}}}},747:function(e){e.exports=require("fs")},814:function(e,r,t){e.exports=which;which.sync=whichSync;var n=process.platform==="win32"||process.env.OSTYPE==="cygwin"||process.env.OSTYPE==="msys";var s=t(622);var o=n?";":":";var i=t(742);function getNotFoundError(e){var r=new Error("not found: "+e);r.code="ENOENT";return r}function getPathInfo(e,r){var t=r.colon||o;var s=r.path||process.env.PATH||"";var i=[""];s=s.split(t);var a="";if(n){s.unshift(process.cwd());a=r.pathExt||process.env.PATHEXT||".EXE;.CMD;.BAT;.COM";i=a.split(t);if(e.indexOf(".")!==-1&&i[0]!=="")i.unshift("")}if(e.match(/\//)||n&&e.match(/\\/))s=[""];return{env:s,ext:i,extExe:a}}function which(e,r,t){if(typeof r==="function"){t=r;r={}}var n=getPathInfo(e,r);var o=n.env;var a=n.ext;var c=n.extExe;var u=[];(function F(n,f){if(n===f){if(r.all&&u.length)return t(null,u);else return t(getNotFoundError(e))}var l=o[n];if(l.charAt(0)==='"'&&l.slice(-1)==='"')l=l.slice(1,-1);var p=s.join(l,e);if(!l&&/^\.[\\\/]/.test(e)){p=e.slice(0,2)+p}(function E(e,s){if(e===s)return F(n+1,f);var o=a[e];i(p+o,{pathExt:c},function(n,i){if(!n&&i){if(r.all)u.push(p+o);else return t(null,p+o)}return E(e+1,s)})})(0,a.length)})(0,o.length)}function whichSync(e,r){r=r||{};var t=getPathInfo(e,r);var n=t.env;var o=t.ext;var a=t.extExe;var c=[];for(var u=0,f=n.length;u<f;u++){var l=n[u];if(l.charAt(0)==='"'&&l.slice(-1)==='"')l=l.slice(1,-1);var p=s.join(l,e);if(!l&&/^\.[\\\/]/.test(e)){p=e.slice(0,2)+p}for(var h=0,v=o.length;h<v;h++){var d=p+o[h];var y;try{y=i.sync(d,{pathExt:a});if(y){if(r.all)c.push(d);else return d}}catch(e){}}}if(r.all&&c.length)return c;if(r.nothrow)return null;throw getNotFoundError(e)}},816:function(e){"use strict";e.exports=/^#!.*/},818:function(e,r,t){e.exports=isexe;isexe.sync=sync;var n=t(747);function checkPathExt(e,r){var t=r.pathExt!==undefined?r.pathExt:process.env.PATHEXT;if(!t){return true}t=t.split(";");if(t.indexOf("")!==-1){return true}for(var n=0;n<t.length;n++){var s=t[n].toLowerCase();if(s&&e.substr(-s.length).toLowerCase()===s){return true}}return false}function checkStat(e,r,t){if(!e.isSymbolicLink()&&!e.isFile()){return false}return checkPathExt(r,t)}function isexe(e,r,t){n.stat(e,function(n,s){t(n,n?false:checkStat(s,e,r))})}function sync(e,r){return checkStat(n.statSync(e),e,r)}},866:function(e,r,t){"use strict";var n=t(816);e.exports=function(e){var r=e.match(n);if(!r){return null}var t=r[0].replace(/#! ?/,"").split(" ");var s=t[0].split("/").pop();var o=t[1];return s==="env"?o:s+(o?" "+o:"")}},881:function(e){"use strict";const r=process.platform==="win32";function notFoundError(e,r){return Object.assign(new Error(`${r} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${r} ${e.command}`,path:e.command,spawnargs:e.args})}function hookChildProcess(e,t){if(!r){return}const n=e.emit;e.emit=function(r,s){if(r==="exit"){const r=verifyENOENT(s,t,"spawn");if(r){return n.call(e,"error",r)}}return n.apply(e,arguments)}}function verifyENOENT(e,t){if(r&&e===1&&!t.file){return notFoundError(t.original,"spawn")}return null}function verifyENOENTSync(e,t){if(r&&e===1&&!t.file){return notFoundError(t.original,"spawnSync")}return null}e.exports={hookChildProcess:hookChildProcess,verifyENOENT:verifyENOENT,verifyENOENTSync:verifyENOENTSync,notFoundError:notFoundError}},893:function(e,r,t){"use strict";const n=t(565);class EndError extends Error{constructor(e){super();this.value=e}}const s=async(e,r)=>r(await e);const o=async e=>{const r=await Promise.all(e);if(r[1]===true){throw new EndError(r[0])}return false};const i=async(e,r,t)=>{t={concurrency:Infinity,preserveOrder:true,...t};const i=n(t.concurrency);const a=[...e].map(e=>[e,i(s,e,r)]);const c=n(t.preserveOrder?1:Infinity);try{await Promise.all(a.map(e=>c(o,e)))}catch(e){if(e instanceof EndError){return e.value}throw e}};e.exports=i;e.exports.default=i},901:function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:true});function reportError(e){process.exitCode=1;console.log("Error in run!");console.log(e)}r.reportError=reportError},948:function(e){"use strict";e.exports=function(e){try{return e()}catch(e){}}},960:function(e,r,t){"use strict";const n=t(622);const s=t(537);const o=async e=>{const r=await s("package.json",{cwd:e});return r&&n.dirname(r)};e.exports=o;e.exports.default=o;e.exports.sync=(e=>{const r=s.sync("package.json",{cwd:e});return r&&n.dirname(r)})}},function(e){"use strict";!function(){e.nmd=function(e){e.paths=[];if(!e.children)e.children=[];Object.defineProperty(e,"loaded",{enumerable:true,get:function(){return e.l}});Object.defineProperty(e,"id",{enumerable:true,get:function(){return e.i}});return e}}()});
//# sourceMappingURL=index.js.map