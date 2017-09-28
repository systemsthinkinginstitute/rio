// lifted and modified from https://github.com/jotform/css.js/blob/master/css.js

'use strict';

var fi = function() {

  this.cssImportStatements = [];
  this.cssKeyframeStatements = [];

  this.cssRegex = new RegExp('([\\s\\S]*?){([\\s\\S]*?)}', 'gi');
  this.cssMediaQueryRegex = '((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
  this.cssKeyframeRegex = '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
  this.combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'; //to match css & media queries together
  this.cssCommentsRegex = '(\\/\\*[\\s\\S]*?\\*\\/)';
  this.cssImportStatementRegex = new RegExp('@import .*?;', 'gi');
};

/*
  Strip outs css comments and returns cleaned css string

  @param css, the original css string to be stipped out of comments

  @return cleanedCSS contains no css comments
*/
fi.prototype.stripComments = function(cssString) {
  var regex = new RegExp(this.cssCommentsRegex, 'gi');

  return cssString.replace(regex, '');
};

/*
  Parses given css string, and returns css object
  keys as selectors and values are css rules
  eliminates all css comments before parsing

  @param source css string to be parsed

  @return object css
*/
fi.prototype.parse = function(source) {

  if (source === undefined) {
    return [];
  }

  var css = [];
  //strip out comments
  //source = this.stripComments(source);

  //get import statements

  while (true) {
    var imports = this.cssImportStatementRegex.exec(source);
    if (imports !== null) {
      this.cssImportStatements.push(imports[0]);
      css.push({
        selector: '@imports',
        type: 'imports',
        styles: imports[0]
      });
    } else {
      break;
    }
  }
  source = source.replace(this.cssImportStatementRegex, '');
  //get keyframe statements
  var keyframesRegex = new RegExp(this.cssKeyframeRegex, 'gi');
  var arr;
  while (true) {
    arr = keyframesRegex.exec(source);
    if (arr === null) {
      break;
    }
    css.push({
      selector: '@keyframes',
      type: 'keyframes',
      styles: arr[0]
    });
  }
  source = source.replace(keyframesRegex, '');

  //unified regex
  var unified = new RegExp(this.combinedCSSRegex, 'gi');

  while (true) {
    arr = unified.exec(source);
    if (arr === null) {
      break;
    }
    var selector = '';
    if (arr[2] === undefined) {
      selector = arr[5].split('\r\n').join('\n').trim();
    } else {
      selector = arr[2].split('\r\n').join('\n').trim();
    }

    /*
      fetch comments and associate it with current selector
    */
    var commentsRegex = new RegExp(this.cssCommentsRegex, 'gi');
    var comments = commentsRegex.exec(selector);
    if (comments !== null) {
      selector = selector.replace(commentsRegex, '').trim();
    }

    // Never have more than a single line break in a row
    selector = selector.replace(/\n+/, "\n");

    //determine the type
    if (selector.indexOf('@media') !== -1) {
      //we have a media query
      var cssObject = {
        selector: selector,
        type: 'media',
        subStyles: this.parse(arr[3] + '\n}') //recursively parse media query inner css
      };
      if (comments !== null) {
        cssObject.comments = comments[0];
      }
      css.push(cssObject);
    } else {
      //we have standard css
      var rules = this.parseRules(arr[6]);
      var style = {
        selector: selector,
        rules: rules
      };
      if (selector === '@font-face') {
        style.type = 'font-face';
      }
      if (comments !== null) {
        style.comments = comments[0];
      }
      css.push(style);
    }
  }

  return css;
};

/*
  parses given string containing css directives
  and returns an array of objects containing ruleName:ruleValue pairs

  @param rules, css directive string example
      \n\ncolor:white;\n    font-size:18px;\n
*/
fi.prototype.parseRules = function(rules) {
  //convert all windows style line endings to unix style line endings
  rules = rules.split('\r\n').join('\n');
  var ret = [];

  rules = rules.split(';');

  //proccess rules line by line
  for (var i = 0; i < rules.length; i++) {
    var line = rules[i];

    //determine if line is a valid css directive, ie color:white;
    line = line.trim();
    if (line.indexOf(':') !== -1) {
      //line contains :
      line = line.split(':');
      var cssDirective = line[0].trim();
      var cssValue = line.slice(1).join(':').trim();

      //more checks
      if (cssDirective.length < 1 || cssValue.length < 1) {
        continue; //there is no css directive or value that is of length 1 or 0
        // PLAIN WRONG WHAT ABOUT margin:0; ?
      }

      //push rule
      ret.push({
        directive: cssDirective,
        value: cssValue
      });
    } else {
      //if there is no ':', but what if it was mis splitted value which starts with base64
      if (line.trim().substr(0, 7) === 'base64,') { //hack :)
        ret[ret.length - 1].value += line.trim();
      } else {
        //add rule, even if it is defective
        if (line.length > 0) {
          ret.push({
            directive: '',
            value: line,
            defective: true
          });
        }
      }
    }
  }

  return ret; //we are done!
};

/*
  computes string for ace editor using this.css or given cssBase optional parameter

  @param [optional] cssBase, if given computes cssString from cssObject array
*/
fi.prototype.serialize = function(cssBase) {
  var depth = 0;
  var ret = '';
  if (cssBase === undefined) {
    cssBase = this.css;
  }
  //append imports
  for (var i = 0; i < cssBase.length; i++) {
    if (cssBase[i].type === 'imports') {
      ret += cssBase[i].styles + '\n\n';
    }
  }
  for (i = 0; i < cssBase.length; i++) {
    var tmp = cssBase[i];
    if (tmp.selector === undefined) { //temporarily omit media queries
      continue;
    }
    var comments = "";
    if (tmp.comments !== undefined) {
      comments = tmp.comments + '\n';
    }

    if (tmp.type === 'media') { //also put media queries to output
      ret += comments + tmp.selector + '{\n';
      ret += this.getCSSForEditor(tmp.subStyles, depth + 1);
      ret += '}\n\n';
    } else if (tmp.type !== 'keyframes' && tmp.type !== 'imports') {
      ret += this.getSpaces(depth) + comments + tmp.selector + ' {\n';
      ret += this.getCSSOfRules(tmp.rules, depth + 1);
      ret += this.getSpaces(depth) + '}\n\n';
    }
  }

  //append keyFrames
  for (i = 0; i < cssBase.length; i++) {
    if (cssBase[i].type === 'keyframes') {
      ret += cssBase[i].styles + '\n\n';
    }
  }

  return ret;
};

/*
  given rules array, returns visually formatted css string
  to be used inside editor
*/
fi.prototype.getCSSOfRules = function(rules, depth) {
  var ret = '';
  for (var i = 0; i < rules.length; i++) {
    if (rules[i] === undefined) {
      continue;
    }
    if (rules[i].defective === undefined) {
      ret += this.getSpaces(depth) + rules[i].directive + ': ' + rules[i].value + ';\n';
    } else {
      ret += this.getSpaces(depth) + rules[i].value + ';\n';
    }

  }
  return ret || '\n';
};

/*
    A very simple helper function returns number of spaces appended in a single string,
    the number depends input parameter, namely input*2
*/
fi.prototype.getSpaces = function(num) {
  var ret = '';
  for (var i = 0; i < num * 4; i++) {
    ret += ' ';
  }
  return ret;
};

/*
  Given css string or objectArray, parses it and then for every selector,
  prepends this.cssPreviewNamespace to prevent css collision issues

  @returns css string in which this.cssPreviewNamespace prepended
*/
fi.prototype.namespace = function(css, forcedNamespace) {
  var cssObjectArray = css;
  var namespaceClass = forcedNamespace;

  if (typeof css === 'string') {
    cssObjectArray = this.parse(css);
  }

  for (var i = 0; i < cssObjectArray.length; i++) {
    var obj = cssObjectArray[i];

    //bypass namespacing for @font-face @keyframes @import
    if(obj.selector.indexOf('@font-face') > -1 || obj.selector.indexOf('keyframes') > -1 || obj.selector.indexOf('@import') > -1 || obj.selector.indexOf('.form-all') > -1 || obj.selector.indexOf('#stage') > -1){
      continue;
    }

    if (obj.type !== 'media') {
      var selector = obj.selector.split(',');
      var newSelector = [];
      for (var j = 0; j < selector.length; j++) {
        const descendantSelector = `${namespaceClass} ${selector[j]}`;
        const rootSelector = selector[j].trim().replace(/\s|$/, namespaceClass + " ");
      
        newSelector.push(`${descendantSelector},${rootSelector}`);
      }
      obj.selector = newSelector.join(',');
    } else {
      obj.subStyles = this.namespace(obj.subStyles, forcedNamespace); //handle media queries as well
    }
  }

  return cssObjectArray;
};


module.exports = new fi();
