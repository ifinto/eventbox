var _ = require('underscore')

module.exports = function (text1, text2) {
  var similarRate = check_it(text1, text2)
  
  return similarRate;
  
  function get_shingle(text,n) {
      n = !!n ? n : 3; 
      var shingles = [];
      var text = clean_text(text);
      var elements = text.split(" ");
      for (i=0;i<elements.length-n+1;i++) {
          var shingle = '';
          for (j=0;j<n;j++){
              shingle += (elements[i+j]).trim().toLowerCase() + " ";
          }
          if(((shingle).trim()).length)
            shingles[i] = shingle.replace('-', '').trim();
      }
      return shingles;    
  }
  
  function clean_text(text) {
      text = text.replace("[\,|\.|\'|\"|\\|\/]","");
      text = text.replace("[\n|\t]"," ");
      text = text.trim();
      text = text.replace('/(\s\s+)/', ' ');
      return text;
  }
  
  function check_it(first, second) {
    if (!first || !second) {
        console.log("Отсутствуют оба или один из текстов!");
        return 0;
    }
    
    if ((first.length)>200000 || (second.length)>200000) {
        console.log("Длина обоих или одного из текстов превысила допустимую!");
        return 0;
    }
    
    
    // for (var i=1;i<5;i++) {
    var first_shingles = array_unique(get_shingle(first,1));
    var second_shingles = array_unique(get_shingle(second,1));


    // if(first_shingles.length < i-1 || (second_shingles).length < i-1) {
    //   console.log("Количество слов в тексте меньше чем длинна шинглы<br />");
    //   continue;
    // }
      
    var intersect = _.intersection(first_shingles,second_shingles);
    var merge = array_unique(first_shingles.concat(second_shingles));
    
    diff = (intersect.length/merge.length)/0.01;
      
    return Math.round(diff)
    // }
  }


  function array_unique( array ) {  // Removes duplicate values from an array
    // 
    // +   original by: Carlos R. L. Rodrigues

    var p, i, j;
    for(i = array.length; i;){
      for(p = --i; p > 0;){
        if(array[i] === array[--p]){
          for(j = p; --p && array[i] === array[p];);
          i -= array.splice(p + 1, j - p).length;
        }
      }
    }

    return array;
  }
  
}
