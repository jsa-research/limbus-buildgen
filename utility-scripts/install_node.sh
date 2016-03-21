
rm -fR nvm
git clone https://github.com/creationix/nvm.git ./nvm && cd nvm && git checkout `git describe --abbrev=0 --tags` && cd ..
. ./nvm/nvm.sh
nvm install $1
