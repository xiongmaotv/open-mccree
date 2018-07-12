#!/bin/bash
str="server {
  listen       80;
  server_name  ${USER}.mccree.panda.tv;

  charset utf8;

  add_header 'Access-Control-Expose-Headers' 'Location';

  root /home/${USER}/devspace/panda-mccree/packages/panda-mccree-live/;

  location / {
    index index.html;
  }
}";
echo -e "$str" > ~/devspace/panda-mccree/server/${USER}_mccree_dev_ngx.conf;
sudo ln -s ~/devspace/panda-mccree/server/${USER}_mccree_dev_ngx.conf /usr/local/nginx/conf/include/${USER}_mccree_dev_ngx.conf;
sudo nginx -s reload;