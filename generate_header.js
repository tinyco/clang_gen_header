const fs = require('fs')
let init = filename => fs.writeFileSync (filename, '')
let write = (filename, str) => fs.appendFileSync(filename, str + '\n')

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
          .filter(i => {
            let j = i.split('//')
            return j.length > 1 && j[1].indexOf('PUBLIC') !== -1
          })
          .map(i => i.replace('//','').replace('PUBLIC',''))
          .map(i => write(h_file, i))

        write(h_file, '#endif')
      }
    })
  })
}
