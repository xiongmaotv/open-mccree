#!/bin/bash

dir=$(ls -l ./packages | awk '/^d/ {printf $NF}')

for i in $dir
do
  cd ./packages/$i
  npm install
  gulp build
  cd ../../
done

lerna bootstrap
