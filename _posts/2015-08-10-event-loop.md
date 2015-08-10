---
layout: post
tumblr_id: 1121202947
disqus_comments: true
date: 2015-08-10 10:00:00 UTC
title: Event loop
---

# Introduction

I remenber some time ago debugging some UI functions with some other fellow devs. The thing we do was about adding a setTimeout(...,0) around our function and we see the bug vanish. In fact it was my first meet with the event loop, but i don't know yet, for me we just added some goofy code on another goofy code and it does the trick, period. I feel confortable to explain it like a Yoda speaking backward or a magicien eating a word for two from an heroic fantasy that tell you something like : "Use the setTimout but with not time my friend, and so the bug canno't be no more in present nor in the futur, as the lord say, when i say "Now!" it is already the past". 

The good news is .... it's the perfect time to (re)learn Javascript and other stuff from web dev. Because you do not have to deal with IE6 bug anymore (damn, i hope for you), and "Can i use" give you the green light most of the time for everything you desire. There are also some very good news from the community itself : some good fellow can help you to level-up with no time. The three pillars for redemption were for me : Kiles Simpson with his book "you don't know javascript", the alway sharp blog from Dr Shaumeyer and finally the talk from Robert Phillip about the <a href="http://latentflip.com/loupe/?code=!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D" >event-loop</a>.

Before you read this article i beg you to watch this video. The asumption about the event loop used by Robert Philip is quite simple, and so has the enormous value to fix three or four key-concepts in a deadly simple way. Well really, this video is perfect to start a discussion on the event loop, and the present 
 article is about the event loop, and all the way i know so far to "deal" whith it. I will try to limit myself
on things directly visibe to the develloper.


# Event loop and the different way to deal with it.

Event loop is the way to coordinate the intrinsic asynchrousity of javascript.
Like the introduction from this article, i think it is important to clarify two notions :

 * parrallism is about executing two instructions in the very same time,
 * asynchronism is about deffering one particular task because it need some resources/work from another process, while continue some other tasks without waiting for the particuar task to be done. 

we can do asynchronicity without parallelism. For an exemple, the execution of the code :

```js
console.log("one!");
setTimeout(function(){console.log("two!");},1000);
console.log("tree!");
```
will produce "one,three, two" in console, the second instruction has been deffered by asynchronicity,but only one process for execution has been necessary.  

Parallelism come with a very expensive cost (race condition, mutex, ...) for the develloper.
Javascript decide to never deal with parallelism (well, webworker will be one of the exception, but today the restrition about the hand cuff are very strict to avoid mutex, race condition and so on).
On the other hand, javascript embrace the asynchronous philosophy. As Crockford say, javacript [citation]

In the snippet above we used setTimout to create asynchroous code, what are the others functions to deal with asynchronicity ?

Here come one of the first paradox in javascript, it does not have any function from it own to deal with asynchronicity.
SetTimeout, ajax request, setImediate, process.nextTick [todo frametruc] are build in functions added To Object class, they are not define in V8 or Spider monkey,...
Javascript has only functions as first object citizen, and asynchonicity is done by the Event loop and the Web api for Brower (libuv for node.js context). 

Suppose for now that the event loop is just as a process that look for something to do at every tick. If nothing is in the stack and if something as been deffered asynchronously (by setTimout as an exemple), then it will be process.
But how this task will be ordered in regard to the tick ? just before it ? just after ? what if i add a heavy time consumming task in this deffered task ? and if i make a recursif asyncronous function, do the recursive call have to be processed in the next tick or in current tick ?
Well, let do a taxonomy on this caracteristic on the async functions.

## setTimeout

```js
setTimeout(function(){console.log("hello!");},1000);
```

## setImmediate

-on browser only on window. 
-Worst name ever
-dirty trick to polyfill from the library

On node.js cntext : setImmediate change is mind between the [look for ref and verion] of node. More on this in the next section.

## process.nextTick

only for node.js

## waitForNextFrame

only for Browser, the answer from other browser to internet explorer and his setImmediate function. 

## Promise deffered

# Let play with our new friends ! 

Let "prove" the way all these methods deal with the event loop. 
Maybe one or two surprise will come.
In this section we use the console with color enabled, because we are in 2015.

# Our friends is the wilde life

The wild life or the code "for the street" is alway a little bit more tricky that it may.
We first introduce the king of the wild life in javascript, his name is Zalgo.

After that, we will try to understand  async.js ilbrary. This libray deal with asynchronous code both on browser side and in node.js side. By the way it must have a lot to say about our friends, and maybe about Zalgo too.


## Zalgo

After all if we don't deal with parallelism we are not exempt to be under attack of some very weird monsters.
Zalgo is the name some dev give to one of the most common pitfall about asynchronicity.

1
staffing object option before execute it.
Zalgo ! i recognize him now ! it was him on the example from the introduction of this article !

2
memoiosation

Hey ! this is pure function i can memoize it result and return with not time !
Zalgo ! now the code 2 will be execute after the function one. Soon or later, it will have some effect you don't want.

3 Real form of Zalgo

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
