#!/bin/bash
#Start Stop pm2 for socket and start
sudo pm2 stop start
cd /var/www/healers-and-teachers-backend/
npm i
sudo pm2 start start
