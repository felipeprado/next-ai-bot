
# install bun
curl -fsSL https://bun.sh/install | bash -s
# install dependencies
cd ./
bun add ai @ai-sdk/openai dayjs lottie-react tailwind-variants
bun add gulp gulp-replace gulp-insert gulp-if gulp-prettier child_process @types/gulp esbuild-register -d
cd ./src/app/ai-bot
# execute gulp tasks
gulp
