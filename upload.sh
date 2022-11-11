#!/bin/bash

# rm -rf dist dist.tar.gz

yarn build


# # rsync -avz -e "ssh" dist root@10.71.107.79:/root/lottery/dist
# # rsync -avz -e "ssh" dist root@10.71.107.79:/root/lottery/dist
# fe
rm -rf fe
mkdir fe
cp -r dist/index.html fe/index.html
mkdir fe/admin_archimedes
cp -r dist/admin_archimedes/index.html fe/admin_archimedes/index.html

# be
rm -rf be
mkdir be
cp -r server be/server
cp -r xlsx be/xlsx
cp -r data.json be/data.json
cp -r package.json be/package.json
cp -r yarn.lock be/yarn.lock

rm -rf lottery
mkdir lottery
mv fe lottery/lottery_fe
mv be lottery/lottery_be

cd lottery

tar zcf lottery_fe.tar.gz lottery_fe
echo "put lottery_fe.tar.gz /root/lottery/lottery_fe.tar.gz" | sftp 10.71.107.79

tar zcf lottery_be.tar.gz lottery_be
echo "put lottery_be.tar.gz /root/lottery/lottery_be.tar.gz" | sftp 10.71.107.79

cd ..
rm -rf lottery