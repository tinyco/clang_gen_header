const fs = require('fs')
let error = i => i && console.log(JSON.stringify(i, null, 4))
let init = filename => fs.writeFile (filename, '' , err => error(err))
let write = (filename,str) => fs.appendFile(filename, str ? str + '\n' : '' , err => error(err))

if (process.argv.length < 3) {
  console.log('Error: illegal argument.')
} else {
  let args = process.argv.filter(i => i.endsWith('.c'))
  args.map(c_file => {
    fs.readFile(c_file, 'utf8', (err, sorce_code) => {
      if(err) {
        error(err)
      } else {
        let h_file = c_file.replace(/.c$/,'.gen.h')
        init(h_file)
        const flag = c_file.toUpperCase().replace(/[\/\.]/g,'_')
        write(h_file, '//This file is auto-generated from ' + c_file)
        write(h_file, '#ifndef ' + flag)
        write(h_file, '#define ' + flag)

        write(h_file, '//EXPORT')
        sorce_code
          .split('/*')
          .map(i => i.split('*/')[0])
          .filter(i => i.indexOf('EXPORT') === 0)
          .map(i => i.replace('EXPORT\n',''))
          .map(i => write(h_file, i))

        write(h_file, '//PUBLIC')
        sorce_code
          .split('\n')
          .filter(i => i.indexOf('//PUBLIC') !== -1)
          .map(i => i.replace('//PUBLIC',''))
          .map(i => write(h_file, i))

        write(h_file, '#endif')
      }
    })
  })
}