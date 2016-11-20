var _ = require('underscore')

function get_shingle(text,n) {
    n = !!n ? n : 3; 
    var shingles = []
    var text = clean_text(text)
    var elements = text.split(" ")
    for (i=0;i<elements.length-n+1;i++) {
        var shingle = ''
        for (j=0;j<n;j++){
            shingle += (elements[i+j]).trim().toLowerCase() + " "
        }
        if(((shingle).trim()).length)
          shingles[i] = shingle.replace('-', '').trim()
    }
    return _.compact(shingles)  
}

function clean_text(text) {
    text = text.replace(/[\,|\.|\'|\"|\\|\/]/g,"");
    text = text.replace(/[\n|\t]/g," ")
    text = text.trim();
    text = text.replace('/(\s\s+)/g', ' ')
    return text;js
}

var generateShingles = module.exports.generateShingles = (text) => {
  var arr = _.uniq(get_shingle(text, 1))
  return arr.join(',')
}

module.exports.getUniqueness = (text1, shinglesStr2) => {
  if (!text1 || !shinglesStr2 || text1 === '' || shinglesStr2 == '') {
    console.log('No texts provided or empty texts')
    return 0
  }
  var shingles1 = _.uniq(get_shingle(text1, 1))
  var shingles2 = shinglesStr2.split(',')
  var intersect = _.intersection(shingles1, shingles2)
  var merge = _.uniq(shingles1.concat(shingles2))
  var diff = (intersect.length/merge.length)
    
  return Math.round(diff, 2)
}