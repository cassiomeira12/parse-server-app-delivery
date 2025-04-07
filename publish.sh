#!/bin/bash # prints the input

mv cloud/package cloud/package.json
rm -r ../Back4App/app_sos/cloud/
mkdir ../Back4App/app_sos/cloud/
cp -r cloud/ ../Back4App/app_sos/cloud/
cd ../Back4App/app_sos
b4a deploy
cd ../../parse-server-app-sos
mv cloud/package.json cloud/package