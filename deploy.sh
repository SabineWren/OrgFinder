#!/bin/bash
cd /var/www/html/OrgFinder &&
whoami 1>> /var/www/html/logs/deploy 2>&1 &&
git reset --hard 1>> /var/www/html/logs/deploy 2>&1 &&
git pull 1>> /var/www/html/logs/deploy 2>&1 &&
chmod 775 deploy.php &&
chmod 775 deploy.sh &&
chmod 775 build.sh &&
./build.sh
