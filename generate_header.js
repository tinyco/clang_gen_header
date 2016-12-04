const fs = require('fs')
let error = i => i && console.log(JSON.stringify(i, null, 4))
let init = filename => fs.writeFile (filename, '' , err => error(err))
let write = (filename, str) => fs.appendFile(filename, str ? str + '\n' : '' , err => error(err)) + '\n'

if (process.argv.length < 3) {
  console.log('Error: illegal argument.')
} else {
  let args = process.argv.filter(i => i.endsWith('.c'))
  args.map(c_file => {
    fs.readFile(c_file, 'utf8', (err, sorce_code) => {
      if(err) {
        error(err)
      } else {
        let str = "";
        let h_file = c_file.replace(/.c$/,'.gen.h')
        const flag = c_file.toUpperCase().replace(/[\/\.]/g,'_')
        str = str + '//This file is auto-generated from ' + c_file + '\n'
        str = str + '#ifndef ' + flag + '\n'
        str = str + '#define ' + flag + '\n'

        str = str + '//EXPORT' + '\n'
        sorce_code
          .split('/*')
          .map(i => i.split('*/')[0])
          .filter(i => i.indexOf('EXPORT') === 0)
          .map(i => i.replace('EXPORT\n',''))
          .map(i => str = str + i + '\n')

        str = str + '//PUBLIC' + '\n'
        sorce_code
          .split('\n')
          .filter(i => i.indexOf('//PUBLIC') !== -1)
          .map(i => i.replace('//PUBLIC',''))
          .map(i => str = str + i + '\n')

        str = str + '#endif' + '\n'
        init(h_file)
        write(h_file, str)
      }
    })
  })
}