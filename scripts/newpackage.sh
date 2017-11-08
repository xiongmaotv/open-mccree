#!/bin/bash 
moduleTypes=('loader' 'controller' 'helper' 'demuxer' 'remuxer' 'plugin' 'core');
tempNo=0;
for i in ${moduleTypes[@]}; do
  echo "[${tempNo}]: ${i}";
  let tempNo+=1;
done

# read the module type
echo -e "Pls input module type \n请输入模块类型: "
read moduleType;

# read the module name
echo -e "pls input module name \n请输入模块名称：";
read moduleName;

moduleFoldername="mccree-${moduleTypes[moduleType]}-${moduleName}";

echo -e "R u sure to create ${moduleFoldername}?(y/N) \n请确认是否创建模块 ${moduleFoldername}? (y/N)";

read confirm;

if [ "${confirm}" == "y" ]; then
  ./scripts/createmodule.sh ${moduleFoldername};
else
  echo -e "See u next time \n 模块创建已完成";
fi