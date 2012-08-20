# Agile arena 
This implementation is in nodejs

## Setup
1. Download and install [nodejs](http://nodejs.org/)
2. Download and setup [mongodb](http://www.mongodb.org/downloads) (currently 2.0.5)
3. Download redis [redis-for-windows](https://github.com/dmajkic/redis/downloads) (currently 2.4.5) or [redis](http://redis.io)
4. Install java (needed for the css+js bundling, need to be able to run java from console)
5. Clone this repo
6. In the repo-folder, do npm-install (to install all dependencies)
7. First time (temporary until smoother solution exist), uncomment bundle code in app.js, run the app, stop app and put back commented code
8. Run the app (nodejs app.js)

## Toolkit
- Recommended dev-tools is [sublime text 2](http://www.sublimetext.com/2)
- Checkout [nodemon](https://github.com/remy/nodemon) (filewatcher that restarts the node-server upon changes, npm install nodemon -g)