/*
 Public Domain

 @example
 var rng = new RNG('Example');
 rng.random(40, 50);  // =>  42
 rng.uniform();       // =>  0.7972798995050903
 rng.normal();        // => -0.6698504543216376
 rng.exponential();   // =>  1.0547367609131555
 rng.poisson(4);      // =>  2
 rng.gamma(4);        // =>  2.781724687386858
*/
String.prototype.getBytes=function(){for(var a=[],b=0;b<this.length;b++){var c=this.charCodeAt(b),d=[];do d.push(c&255),c>>=8;while(0<c);a=a.concat(d.reverse())}return a};function RC4(a){this.s=Array(256);for(var b=this.j=this.i=0;256>b;b++)this.s[b]=b;a&&this.mix(a)}RC4.prototype._swap=function(a,b){var c=this.s[a];this.s[a]=this.s[b];this.s[b]=c};RC4.prototype.mix=function(a){a=a.getBytes();for(var b=0,c=0;c<this.s.length;c++)b+=this.s[c]+a[c%a.length],b%=256,this._swap(c,b)};
RC4.prototype.next=function(){this.i=(this.i+1)%256;this.j=(this.j+this.s[this.i])%256;this._swap(this.i,this.j);return this.s[(this.s[this.i]+this.s[this.j])%256]};function print_call_stack(){console.log(Error().stack)}
function RNG(a){this.seed=a;null==a?a=(Math.random()+Date.now()).toString():"function"===typeof a?(this.uniform=a,this.nextByte=function(){return~~(256*this.uniform())},a=null):"[object String]"!==Object.prototype.toString.call(a)&&(a=JSON.stringify(a));this._normal=null;this._state=a?new RC4(a):null}RNG.prototype.nextByte=function(){return this._state.next()};RNG.prototype.uniform=function(){for(var a=0,b=0;7>b;b++)a*=256,a+=this.nextByte();return a/(Math.pow(2,56)-1)};
RNG.prototype.random=function(a,b){if(null==a)return this.uniform();null==b&&(b=a,a=0);return a+Math.floor(this.uniform()*(b-a))};RNG.prototype.normal=function(){if(null!==this._normal){var a=this._normal;this._normal=null;return a}a=this.uniform()||Math.pow(2,-53);var b=this.uniform();this._normal=Math.sqrt(-2*Math.log(a))*Math.sin(2*Math.PI*b);return Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*b)};RNG.prototype.exponential=function(){return-Math.log(this.uniform()||Math.pow(2,-53))};
RNG.prototype.poisson=function(a){a=Math.exp(-(a||1));var b=0,c=1;do b++,c*=this.uniform();while(c>a);return b-1};RNG.prototype.gamma=function(a){var b=(1>a?1+a:a)-1/3,c=1/Math.sqrt(9*b);do{do var d=this.normal(),e=Math.pow(c*d+1,3);while(0>=e);var f=this.uniform();d=Math.pow(d,2)}while(f>=1-.0331*d*d&&Math.log(f)>=.5*d+b*(1-e+Math.log(e)));return 1>a?b*e*Math.exp(this.exponential()/-a):b*e};
RNG.roller=function(a,b){a=a.split(/(\d+)?d(\d+)([+-]\d+)?/).slice(1);var c=parseFloat(a[0])||1,d=parseFloat(a[1]),e=parseFloat(a[2])||0;b=b||new RNG;return function(){for(var a=c+e,g=0;g<c;g++)a+=b.random(d);return a}};
