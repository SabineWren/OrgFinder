#!/bin/bash
cd /var/www/html/OrgFinder/db_update
pwd
echo Running OrgFinder update $(date).
./db_update <db_username> <db_name> <password> &&
echo Finished OrgFinder update AT $(date).
cd ../db_delete
./db_delete <db_username> <db_name> <password> &&
echo Finished Deleting orgs AT $(date).
mogrify -path /var/www/html/org_icons -filter Triangle -define filter:support=2 -thumbnail 50 -unsharp 0.25x0.08+8.3+0.045 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB /var/www/html/org_icons_new/* &&
mv /var/www/html/org_icons_new/* /var/www/html/org_icons_fullsize/
echo FINISHED AT $(date)
echo ''

##org_icons et cetera may have different locations depending on which server hosts; modify accordingly

#@Usage:
# crontab -e
#
# add the following lines
##!/bin/bash
# 10 0 * * * $HOME/nightly_script.sh >> $HOME/log_script 2&>>$HOME/error_script
#
#caveats:
#ensure cron uses BASH (#!/bin/bash)
# * means EVERY, so 10 0 * * * means every day at 00:10;, while 10 * * * * means every hour at **:10
# place a blank line at the bottom of the cron tab if there isn't one
# > results in garbage output; append using >> and manually delete the log file
#

