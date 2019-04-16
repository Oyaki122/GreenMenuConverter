const fs = require('fs')
const exec = require('child_process').execSync
const iconv = require('iconv-lite')
const dairyFileName = require('./tools/dairyFileName')

const ddfilelist = process.argv.slice(0, process.argv.length) // argvをコピーする
ddfilelist.splice(0, 2) // 3番目以降がコマンドライン引数なのでその部分だけ取得

const dir = process.cwd()

exec(
  `pushd ${dir} &&  cd tools && xlsx2csv.exe ${
    ddfilelist[0]
  } ../tmp/tmp.csv -i -e && popd`,
  (err, stdout, stderr) => {
    console.log(err)
    if (err) fs.writeFileSync('log.txt', iconv.decode(err, 'Shift_JIS'))
    console.log(iconv.decode(stderr, 'Shift_JIS'))
    fs.writeFileSync('test.txt', iconv.decode(stdout, 'Shift_JIS'))
  }
)

const csv = fs.readFileSync('tmp/tmp.csv', 'utf8')
const replaced = csv
  // .replace(/(?<="[^",]+?)\n(?=[^",]+?")/g, '')
  .replace(/食塩相当量/g, '')
  .replace(/\\n/g, '')
  .replace(/"|\\|￥/g, '')
const row = replaced.split(/\r\n|\n|\r/)
let data = []
for (let i = 0; i < row.length; i++) {
  data[i] = row[i].split(',')
}

let lunch = []
for (let i = 0; i < 5; i++) {
  lunch[i] = {
    title: data[2][2 * (i + 1) - 1],
    price: parseInt(data[2][2 * (i + 1)])
  }
}
let rice = []
for (let i = 0; i < 5; i++) {
  rice[i] = {
    title: data[4][2 * (i + 1) - 1],
    price: parseInt(data[4][2 * (i + 1)])
  }
}
console.log(lunch)
console.log(rice)
const fileName = dairyFileName(data[1][1])

fs.writeFileSync(fileName, 'day,lunch,lunch_price,rice,rice_price\n')
for (let i = 0; i < 5; i++) {
  fs.appendFileSync(
    fileName,
    `${i + 1},${lunch[i].title},${lunch[i].price},${rice[i].title},${
      rice[i].price
    }\n`
  )
}
