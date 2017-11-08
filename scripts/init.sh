#! /bin/bash
cd packages;
npm install;
files=(*)
for item in ${files[*]}
do
  if [ -d $item ]; then
    cd $item;
    cp -R ../../node_modules ./
    npm install;
    gulp build;
    cd ..;
  fi
done