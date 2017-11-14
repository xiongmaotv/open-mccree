#! /bin/bash
cd packages;
files=(*)
for item in ${files[*]}
do
  if [ -d $item ]; then
    cd $item;
    cp -R ../../node_modules ./
    gulp build;
    cd ..;
  fi
done