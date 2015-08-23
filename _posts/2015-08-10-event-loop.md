---
layout: post
tumblr_id: 1121202947
disqus_comments: true
date: 2015-08-10 10:00:00 UTC
title: Asynchronous functions for Javascript
---

# Introduction

They are a lot of hard things to get it right in Javascript. Hopefully, some good fellows can help to level-up with no time. Kiles Simpson (aka getify) with his books [You don't know JS](https://github.com/getify/You-Dont-Know-JS), the alway sharp [blog](http://www.2ality.com/) from Dr. Axel Rauschmayer and finally the talk from Robert Phillip about the <a href="http://latentflip.com/loupe/?code=!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D" >event-loop</a>.

The event-loop is the way Javascript deal with asynchronicity. Before you read this article i hope you to watch this video. The asumption about the event loop used by Robert Philip is quite simple, and so has the enormous value to fix three or four key-concepts in a deadly simple way. 
I will first present the asynchronicity in Javascript, and some tricky problems with it.
Then i will show all the way you can do asynchronous call in JS, where and why use them.
Then i will try to identify them in some well used library code and use some snippet to show some key features.

# Asynchronicity in JS

Javascript is completely single-threaded (with the subtle exception of web workers, which still cannot share memory between threads), but also completely asynchronous [[async]](http://blog.slaks.net/2014-12-23/parallelism-async-threading-explained/). 

```js
console.log("one!");
fetch(url_for_something)
.then(function(response) {
  console.log("fetching url is done ");
})
console.log("tree!");
//we do not wait for fetching url to be done and proceed this code will return
//"one!"
//"fetching url is done "
//"tree!"
```

```js
console.log("one!");
setTimeout(function(){console.log("two!");},1000);
console.log("tree!");
//the setTimeout 1000 will not block until be done :
//"one!"
//"tree!"
//"two!"
```


will produce "one,three, two" in console, the second instruction has been deffered by asynchronicity, but only one process for execution has been necessary.

Parallelism come with a very expensive cost (race condition, mutex, ...) for the develloper.
Javascript decide to never deal with parallelism (well, webworker will be one of the exception, but today the restrition about the hand cuff are very strict to avoid mutex, race condition and so on).



## Event loop.

So far, we know
The first time i encounter this code i really think it looks stupid.

```js
console.log("one!");
setTimeout(function(){console.log("two!");},0);
console.log("tree!");
//will return
//"one"
//"tree"
//"two"
```

Event loop is the way to coordinate the intrinsic asynchrousity of javascript.

Suppose for now that the event loop is just as a process that look for something to do at every tick. If nothing is in the stack and if something as been deffered asynchronously (by setTimout as an exemple), then it will be process.
But how this task will be ordered in regard to the tick ? just before it ? just after ? what if i add a heavy time consumming task in this deffered task ? and if i make a recursif asyncronous function, do the recursive call have to be processed in the next tick or in current tick ?
Well, let do a taxonomy on this caracteristic on the async functions.

In the snippet above we used setTimout to create asynchroous code, what are the others functions to deal with asynchronicity ?

Here come one of the first paradox in javascript, it does not have any function from it own to deal with asynchronicity.
SetTimeout, ajax request, setImediate, process.nextTick and requestanimationframe are build in functions added To Object class, they are not define in V8 or Spider monkey,...
Javascript has only functions as first object citizen, and asynchonicity is done by the Event loop and the Web api for Brower (libuv for node.js context).


### macro versus micro
//To quote  :
https://github.com/YuzuJS/setImmediate#macrotasks-and-microtasks

### event loop in Node.js

Draw event loop in node
http://dailyjs.com/2013/03/11/node-stable/

## Zalgo

After all if we don't deal with parallelism we are not exempt to be under attack of some very weird monsters.
Zalgo is the name some dev give to one of the most common pitfall about asynchronicity.


http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony
http://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/

1
staffing object option before execute it.
Zalgo ! i recognize him now ! it was him on the example from the introduction of this article !

2
memoiosation

Hey ! this is pure function i can memoize it result and return with not time !
Zalgo ! now the code 2 will be execute after the function one. Soon or later, it will have some effect you don't want.

3 other form of mixin synchronous and async code

Zalgo bite you when you don't think about it.  

```
for(i = 0;i < 10;i++)
setTimout(function(console.log(i);)), 100);
```

Zalgo ? wel yes or no, it depend of what you expect from this code. If you want 10 time then it's ok, else...
Anyway it can look as a simple exemple, but suppose this code is note about setTimout but about a callback from an  asynchronose function like an ajax request : 

```
for(i = 0;i < 10;i++)
	fetch(url + i, function(){console.log(i);});
```

The pitfall is less obvious.
Anyway, if it is not already, Zalgo will bite you soon or later. The best way to deal with Zalgo is to give it a name, and to think about him when you code.


## setTimeout

```js
setTimeout(function(){console.log("hello!");},1000);
```

## setImmediate

-on browser only on window.
-Worst name ever
-dirty trick to polyfill from the library

On node.js cntext : setImmediate change is mind between the [look for ref and verion] of node. More on this in the next section.

Absurd citation from
https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10

 "process.nextTick happens at the end of the current tick, immediately after the current stack unwinds. If you are currently using recursive nextTick calls, use setImmediate instead."
-->seems like we chnage order for functions

## process.nextTick

process.nextTick is the perfect way in node.js to deal with Zalgo.
only for node.js

## requestanimationframe

https://html.spec.whatwg.org/multipage/webappapis.html#dom-window-requestanimationframe


only for Browser, the answer from other browser to internet explorer and his setImmediate function. 

## Promise deffered



# Let play with our new friends ! 

Let "prove" the way all these methods deal with the event loop. 
Maybe one or two surprise will come.
In this section we use the console with color enabled, because we are in 2015.


Strange things

Bug (for discussion)
https://github.com/joyent/node/pull/3872#issuecomment-7804775


setTimeout before setImmmediate : https://github.com/joyent/node/issues/6034
setTimeout versus setImmmediate : https://github.com/joyent/node/issues/5943
doc setImmediate (for the intersting discussion) https://github.com/joyent/node/pull/5950
						leaving to https://github.com/joyent/node/blob/master/doc/api/process.markdown


# the futurs friends
For Generators Async await
https://blog.risingstack.com/asynchronous-javascript/

# Our friends is the wilde life

The wild life or the code "for the street" is alway a little bit more tricky that it may.
We first introduce the king of the wild life in javascript, his name is Zalgo.

After that, we will try to understand  async.js ilbrary. This libray deal with asynchronous code both on browser side and in node.js side. By the way it must have a lot to say about our friends, and maybe about Zalgo too.


## async.js

async.js is a well now library fro the node.js side. It can also be used from the browser.
The library is "just" about one file async.js. 
We will not explain in detai all the code from this library, but we want to give a eagle eye on it.
We will use the library from this state. 

The X first line and the Y line are about :
 * dealing with same code loade two time
 * function defined by underscore/lodash from the functional way. A load from this libray will be suffisant but remenber this libray is used in front end dev, so maybe we do not want in this context to force dev to load aother library that can conflict and that will be load consuming)
 * dealing with UMD module patern, to have an unified lib for AMD, common.js and script inline load.  

So remain Z lines of dense code very intreresting. 
Most of the time, it is used two or three private swiss knife functions to construct several public functions.
What about our friends fom the event loop ? we ar used of course. 
First we are a polyfill fest from here to here. And so we use the polyfill setImmediate and .... 

## phaser


## browserify


Browserify has nothing to do with asynchronous, it have to deal with loading a module common.js in the browser.
