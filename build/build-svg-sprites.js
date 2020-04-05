const fs = require('fs')
const mkdirp = require('mkdirp');
const dirnames = process.mainModule.filename.includes('pro') ?
    ['solid', 'linear']
  : ['free', 'brand', 'flag']

const prefixes = {
  brand:  'cib-',
  flag:   'cif-',
  free:   'cil-',
  linear: 'cil-',
  solid:  'cis-'
} 

const getAttributeValue = (string, attribute) => {
  const regex = new RegExp(`${attribute}="([^"]+)"`, 'g')
  return string.match(regex, '')[0]
                .match(/"(.*?)"/ig, '')[0]
                .replace(/"/g, '')
}

mkdirp('sprites/', function(err) {
  if (err) {
    return
  } 

  dirnames.forEach(setName => {
    const dirname = `svg/${setName}/`
    const svgs = fs.readdirSync(dirname)
    let symbols = []
    svgs.forEach((svg, idx, svgs) => {
      let symbol = {}
      const file = dirname + svg
      const content = fs.readFileSync(file, 'utf8')
      const viewBox = getAttributeValue(content, 'viewBox')
      const computedContent = content.replace(/(<svg([^>]+)>)|(<\/svg>)/ig, '')
      .replace(/\n/g, '').replace(/"/g, '\'')
      .replace('<!-- Generated by IcoMoon.io -->', '')
      symbol = `<symbol id="${svg.replace('.svg', '').toLowerCase()}" viewBox="${viewBox}">\n${computedContent}\n</symbol>`
      idx === svgs.length - 1 ? symbols.push(symbol) : symbols.push(`${symbol}\n`)
    })
    fs.writeFile(
      `sprites/${setName}.svg`,
      `<svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
${symbols.join('')}
</defs>
</svg>`,
      () => ''
    ) 
  })
})