#!/bin/bash
#Start Stop pm2 for socket and start
cd /var/www/healers-and-teachers-backend
sudo pm2 stop start
npm i
sudo pm2 start start
