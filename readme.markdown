# Agile arena 
This implementation is in nodejs

## Setup
1. Download and install [nodejs](http://nodejs.org/)
2. Download and setup [mongodb](http://www.mongodb.org/downloads) (currently 2.0.5)
3. Download redis [redis-for-windows](https://github.com/dmajkic/redis/downloads) (currently 2.4.5) or [redis](http://redis.io)
4. Clone this repo
5. In the repo-folder, do npm-install (to install all dependencies)
6. Run the app => nodejs app.js (make sure mongodb and redis is running)

## Toolkit
- Recommended dev-tools is [sublime text 2](http://www.sublimetext.com/2)
- Use [grunt](https://github.com/cowboy/grunt) to run lint, tests etc. 
(npm install grunt -g, to run tests => grunt test, to run lint => grunt lint,
or to run auto => grunt watch. Will include to let grunt minify js&css)
- Checkout [run](https://github.com/DTrejo/run.js) (filewatcher that restarts the node-server upon changes, npm install run -g)