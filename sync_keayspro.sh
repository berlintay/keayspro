#!/bin/bash

SRC_DIR="/home/tayke/keayspro/"

DEST_DIR="/var/www/keays.pro/"

rsync -aAXv --delete "$SRC_DIR" "$DEST_DIR"

systemctl restart nginx
