if [ ! $1 ]; then
  istanbul cover ./node_modules/mocha/bin/_mocha --reporter spec --timeout 2000 --recursive ./test
  exit;
else
  istanbul cover ./node_modules/mocha/bin/_mocha --reporter spec --timeout 2000 --recursive ./packages/$1/test
  exit;
fi
