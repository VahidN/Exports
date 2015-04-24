"format register";

System.register("rtts_assert/src/rtts_assert", [], function($__export) {
  "use strict";
  var __moduleName = "rtts_assert/src/rtts_assert";
  var _global,
      POSITION_NAME,
      primitives,
      genericType,
      string,
      boolean,
      number,
      currentStack,
      prop;
  function argPositionName(i) {
    var position = (i / 2) + 1;
    return POSITION_NAME[position] || (position + 'th');
  }
  function proxy() {}
  function assertArgumentTypes() {
    for (var params = [],
        $__0 = 0; $__0 < arguments.length; $__0++)
      params[$__0] = arguments[$__0];
    var actual,
        type;
    var currentArgErrors;
    var errors = [];
    var msg;
    for (var i = 0,
        l = params.length; i < l; i = i + 2) {
      actual = params[i];
      type = params[i + 1];
      currentArgErrors = [];
      if (!isType(actual, type, currentArgErrors)) {
        errors.push(argPositionName(i) + ' argument has to be an instance of ' + prettyPrint(type) + ', got ' + prettyPrint(actual));
        if (currentArgErrors.length) {
          errors.push(currentArgErrors);
        }
      }
    }
    if (errors.length) {
      throw new Error('Invalid arguments given!\n' + formatErrors(errors));
    }
  }
  function prettyPrint(value, depth) {
    if (typeof(depth) === 'undefined') {
      depth = 0;
    }
    if (depth++ > 3) {
      return '[...]';
    }
    if (typeof value === 'undefined') {
      return 'undefined';
    }
    if (typeof value === 'string') {
      return '"' + value + '"';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'object') {
      if (value.__assertName) {
        return value.__assertName;
      }
      if (value.map && typeof value.map === 'function') {
        return '[' + value.map((function(v) {
          return prettyPrint(v, depth);
        })).join(', ') + ']';
      }
      var properties = Object.keys(value);
      var suffix = '}';
      if (properties.length > 20) {
        properties.length = 20;
        suffix = ', ... }';
      }
      return '{' + properties.map((function(p) {
        return p + ': ' + prettyPrint(value[p], depth);
      })).join(', ') + suffix;
    }
    return value.__assertName || value.name || value.toString();
  }
  function isType(value, T, errors) {
    if (T && T.type) {
      T = T.type;
    }
    if (T === primitives.void) {
      return typeof value === 'undefined';
    }
    if (_isProxy(value)) {
      return true;
    }
    if (T === primitives.any || value === null) {
      return true;
    }
    if (T === primitives.string) {
      return typeof value === 'string';
    }
    if (T === primitives.number) {
      return typeof value === 'number';
    }
    if (T === primitives.boolean) {
      return typeof value === 'boolean';
    }
    if (typeof T.assert === 'function') {
      var parentStack = currentStack;
      var isValid;
      currentStack = errors;
      try {
        isValid = T.assert(value);
      } catch (e) {
        fail(e.message);
        isValid = false;
      }
      currentStack = parentStack;
      if (typeof isValid === 'undefined') {
        isValid = errors.length === 0;
      }
      return isValid;
    }
    return value instanceof T;
  }
  function _isProxy(obj) {
    if (!obj || !obj.constructor || !obj.constructor.annotations)
      return false;
    return obj.constructor.annotations.filter((function(a) {
      return a instanceof proxy;
    })).length > 0;
  }
  function formatErrors(errors) {
    var indent = arguments[1] !== (void 0) ? arguments[1] : '  ';
    return errors.map((function(e) {
      if (typeof e === 'string')
        return indent + '- ' + e;
      return formatErrors(e, indent + '  ');
    })).join('\n');
  }
  function type(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
    return actual;
  }
  function returnType(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected to return an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
    return actual;
  }
  function arrayOf() {
    for (var types = [],
        $__1 = 0; $__1 < arguments.length; $__1++)
      types[$__1] = arguments[$__1];
    return assert.define('array of ' + types.map(prettyPrint).join('/'), function(value) {
      var $__3;
      if (assert(value).is(Array)) {
        for (var i = 0; i < value.length; i++) {
          ($__3 = assert(value[i])).is.apply($__3, $traceurRuntime.spread(types));
        }
      }
    });
  }
  function structure(definition) {
    var properties = Object.keys(definition);
    return assert.define('object with properties ' + properties.join(', '), function(value) {
      if (assert(value).is(Object)) {
        for (var i = 0; i < properties.length; i++) {
          var property = properties[i];
          assert(value[property]).is(definition[property]);
        }
      }
    });
  }
  function fail(message) {
    currentStack.push(message);
  }
  function define(classOrName, check) {
    var cls = classOrName;
    if (typeof classOrName === 'string') {
      cls = function() {};
      cls.__assertName = classOrName;
    }
    cls.assert = function(value) {
      return check(value);
    };
    return cls;
  }
  function assert(value) {
    return {is: function is() {
        var $__3;
        for (var types = [],
            $__2 = 0; $__2 < arguments.length; $__2++)
          types[$__2] = arguments[$__2];
        var allErrors = [];
        var errors;
        for (var i = 0; i < types.length; i++) {
          var type = types[i];
          errors = [];
          if (isType(value, type, errors)) {
            return true;
          }
          allErrors.push(prettyPrint(value) + ' is not instance of ' + prettyPrint(type));
          if (errors.length) {
            allErrors.push(errors);
          }
        }
        ($__3 = currentStack).push.apply($__3, $traceurRuntime.spread(allErrors));
        return false;
      }};
  }
  $__export("proxy", proxy);
  return {
    setters: [],
    execute: function() {
      _global = typeof window === 'object' ? window : global;
      POSITION_NAME = ['', '1st', '2nd', '3rd'];
      if (typeof $traceurRuntime === 'object') {
        primitives = $traceurRuntime.type;
        genericType = $traceurRuntime.genericType;
      } else {
        primitives = {
          any: {name: 'any'},
          boolean: {name: 'boolean'},
          number: {name: 'number'},
          string: {name: 'string'},
          symbol: {name: 'symbol'},
          void: {name: 'void'}
        };
        genericType = function(type, args) {
          return {
            type: type,
            args: args
          };
        };
      }
      Object.keys(primitives).forEach(function(name) {
        primitives[name].__assertName = name;
      });
      string = type.string = define('string', function(value) {
        return typeof value === 'string';
      });
      boolean = type.boolean = define('boolean', function(value) {
        return typeof value === 'boolean';
      });
      number = type.number = define('number', function(value) {
        return typeof value === 'number';
      });
      currentStack = [];
      assert.type = type;
      for (prop in primitives) {
        assert.type[prop] = primitives[prop];
      }
      assert.genericType = genericType;
      assert.argumentTypes = assertArgumentTypes;
      assert.returnType = returnType;
      assert.define = define;
      assert.fail = fail;
      assert.string = string;
      assert.number = number;
      assert.boolean = boolean;
      assert.arrayOf = arrayOf;
      assert.structure = structure;
      $__export("assert", assert);
    }
  };
});



System.register("angular2/src/facade/lang", ["rtts_assert/rtts_assert"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/lang";
  var assert,
      _global,
      Type,
      Math,
      Date,
      assertionsEnabled_,
      int,
      CONST,
      ABSTRACT,
      IMPLEMENTS,
      StringWrapper,
      StringJoiner,
      NumberParseError,
      NumberWrapper,
      RegExp,
      RegExpWrapper,
      RegExpMatcherWrapper,
      FunctionWrapper,
      BaseException,
      Json,
      DateWrapper;
  function isPresent(obj) {
    return assert.returnType((obj !== undefined && obj !== null), assert.type.boolean);
  }
  function isBlank(obj) {
    return assert.returnType((obj === undefined || obj === null), assert.type.boolean);
  }
  function isString(obj) {
    return assert.returnType((typeof obj === "string"), assert.type.boolean);
  }
  function stringify(token) {
    if (typeof token === 'string') {
      return assert.returnType((token), assert.type.string);
    }
    if (token === undefined || token === null) {
      return assert.returnType(('' + token), assert.type.string);
    }
    if (token.name) {
      return assert.returnType((token.name), assert.type.string);
    }
    return assert.returnType((token.toString()), assert.type.string);
  }
  function looseIdentical(a, b) {
    return assert.returnType((a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)), assert.type.boolean);
  }
  function getMapKey(value) {
    return value;
  }
  function normalizeBlank(obj) {
    return isBlank(obj) ? null : obj;
  }
  function isJsObject(o) {
    return assert.returnType((o !== null && (typeof o === "function" || typeof o === "object")), assert.type.boolean);
  }
  function assertionsEnabled() {
    return assert.returnType((assertionsEnabled_), assert.type.boolean);
  }
  function print(obj) {
    if (obj instanceof Error) {
      console.log(obj.stack);
    } else {
      console.log(obj);
    }
  }
  $__export("isPresent", isPresent);
  $__export("isBlank", isBlank);
  $__export("isString", isString);
  $__export("stringify", stringify);
  $__export("looseIdentical", looseIdentical);
  $__export("getMapKey", getMapKey);
  $__export("normalizeBlank", normalizeBlank);
  $__export("isJsObject", isJsObject);
  $__export("assertionsEnabled", assertionsEnabled);
  $__export("print", print);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }],
    execute: function() {
      _global = typeof window === 'undefined' ? global : window;
      $__export("global", _global);
      Type = $__export("Type", Function);
      Math = $__export("Math", _global.Math);
      Date = $__export("Date", _global.Date);
      assertionsEnabled_ = typeof assert !== 'undefined';
      if (assertionsEnabled_) {
        _global.assert = assert;
        $__export("int", int = assert.define('int', function(value) {
          return typeof value === 'number' && value % 1 === 0;
        }));
      } else {
        $__export("int", int = {});
        _global.assert = function() {};
      }
      $__export("int", int);
      CONST = $__export("CONST", (function() {
        var CONST = function CONST() {};
        return ($traceurRuntime.createClass)(CONST, {}, {});
      }()));
      ABSTRACT = $__export("ABSTRACT", (function() {
        var ABSTRACT = function ABSTRACT() {};
        return ($traceurRuntime.createClass)(ABSTRACT, {}, {});
      }()));
      IMPLEMENTS = $__export("IMPLEMENTS", (function() {
        var IMPLEMENTS = function IMPLEMENTS() {};
        return ($traceurRuntime.createClass)(IMPLEMENTS, {}, {});
      }()));
      StringWrapper = $__export("StringWrapper", (function() {
        var StringWrapper = function StringWrapper() {};
        return ($traceurRuntime.createClass)(StringWrapper, {}, {
          fromCharCode: function(code) {
            assert.argumentTypes(code, int);
            return assert.returnType((String.fromCharCode(code)), assert.type.string);
          },
          charCodeAt: function(s, index) {
            assert.argumentTypes(s, assert.type.string, index, int);
            return s.charCodeAt(index);
          },
          split: function(s, regExp) {
            assert.argumentTypes(s, assert.type.string, regExp, RegExp);
            return s.split(regExp.multiple);
          },
          equals: function(s, s2) {
            assert.argumentTypes(s, assert.type.string, s2, assert.type.string);
            return assert.returnType((s === s2), assert.type.boolean);
          },
          replace: function(s, from, replace) {
            assert.argumentTypes(s, assert.type.string, from, assert.type.any, replace, assert.type.string);
            if (typeof(from) === "string") {
              return assert.returnType((s.replace(from, replace)), assert.type.string);
            } else {
              return assert.returnType((s.replace(from.single, replace)), assert.type.string);
            }
          },
          replaceAll: function(s, from, replace) {
            assert.argumentTypes(s, assert.type.string, from, RegExp, replace, assert.type.string);
            return assert.returnType((s.replace(from.multiple, replace)), assert.type.string);
          },
          startsWith: function(s, start) {
            assert.argumentTypes(s, assert.type.string, start, assert.type.string);
            return s.startsWith(start);
          },
          substring: function(s, start) {
            var end = arguments[2] !== (void 0) ? arguments[2] : null;
            assert.argumentTypes(s, assert.type.string, start, int, end, int);
            return s.substring(start, end === null ? undefined : end);
          },
          replaceAllMapped: function(s, from, cb) {
            assert.argumentTypes(s, assert.type.string, from, RegExp, cb, Function);
            return assert.returnType((s.replace(from.multiple, function() {
              for (var matches = [],
                  $__1 = 0; $__1 < arguments.length; $__1++)
                matches[$__1] = arguments[$__1];
              matches.splice(-2, 2);
              return cb(matches);
            })), assert.type.string);
          },
          contains: function(s, substr) {
            assert.argumentTypes(s, assert.type.string, substr, assert.type.string);
            return assert.returnType((s.indexOf(substr) != -1), assert.type.boolean);
          }
        });
      }()));
      Object.defineProperty(StringWrapper.fromCharCode, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(StringWrapper.charCodeAt, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
      Object.defineProperty(StringWrapper.split, "parameters", {get: function() {
          return [[assert.type.string], [RegExp]];
        }});
      Object.defineProperty(StringWrapper.equals, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.replace, "parameters", {get: function() {
          return [[assert.type.string], [], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.replaceAll, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.startsWith, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.substring, "parameters", {get: function() {
          return [[assert.type.string], [int], [int]];
        }});
      Object.defineProperty(StringWrapper.replaceAllMapped, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [Function]];
        }});
      Object.defineProperty(StringWrapper.contains, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      StringJoiner = $__export("StringJoiner", (function() {
        var StringJoiner = function StringJoiner() {
          this.parts = [];
        };
        return ($traceurRuntime.createClass)(StringJoiner, {
          add: function(part) {
            assert.argumentTypes(part, assert.type.string);
            this.parts.push(part);
          },
          toString: function() {
            return assert.returnType((this.parts.join("")), assert.type.string);
          }
        }, {});
      }()));
      Object.defineProperty(StringJoiner.prototype.add, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      NumberParseError = $__export("NumberParseError", (function($__super) {
        var NumberParseError = function NumberParseError(message) {
          $traceurRuntime.superConstructor(NumberParseError).call(this);
          this.message = message;
        };
        return ($traceurRuntime.createClass)(NumberParseError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error)));
      NumberWrapper = $__export("NumberWrapper", (function() {
        var NumberWrapper = function NumberWrapper() {};
        return ($traceurRuntime.createClass)(NumberWrapper, {}, {
          toFixed: function(n, fractionDigits) {
            assert.argumentTypes(n, assert.type.number, fractionDigits, int);
            return assert.returnType((n.toFixed(fractionDigits)), assert.type.string);
          },
          equal: function(a, b) {
            return assert.returnType((a === b), assert.type.boolean);
          },
          parseIntAutoRadix: function(text) {
            assert.argumentTypes(text, assert.type.string);
            var result = assert.type(parseInt(text), int);
            if (isNaN(result)) {
              throw new NumberParseError("Invalid integer literal when parsing " + text);
            }
            return assert.returnType((result), int);
          },
          parseInt: function(text, radix) {
            assert.argumentTypes(text, assert.type.string, radix, int);
            if (radix == 10) {
              if (/^(\-|\+)?[0-9]+$/.test(text)) {
                return assert.returnType((parseInt(text, radix)), int);
              }
            } else if (radix == 16) {
              if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
                return assert.returnType((parseInt(text, radix)), int);
              }
            } else {
              var result = assert.type(parseInt(text, radix), int);
              if (!isNaN(result)) {
                return assert.returnType((result), int);
              }
            }
            throw new NumberParseError("Invalid integer literal when parsing " + text + " in base " + radix);
          },
          parseFloat: function(text) {
            assert.argumentTypes(text, assert.type.string);
            return assert.returnType((parseFloat(text)), assert.type.number);
          },
          get NaN() {
            return assert.returnType((NaN), assert.type.number);
          },
          isNaN: function(value) {
            return assert.returnType((isNaN(value)), assert.type.boolean);
          },
          isInteger: function(value) {
            return assert.returnType((Number.isInteger(value)), assert.type.boolean);
          }
        });
      }()));
      Object.defineProperty(NumberWrapper.toFixed, "parameters", {get: function() {
          return [[assert.type.number], [int]];
        }});
      Object.defineProperty(NumberWrapper.parseIntAutoRadix, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(NumberWrapper.parseInt, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
      Object.defineProperty(NumberWrapper.parseFloat, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      RegExp = $__export("RegExp", RegExp);
      if (assertionsEnabled_) {
        $__export("RegExp", RegExp = assert.define('RegExp', function(obj) {
          assert(obj).is(assert.structure({
            single: _global.RegExp,
            multiple: _global.RegExp
          }));
        }));
      } else {
        $__export("RegExp", RegExp = {});
      }
      RegExpWrapper = $__export("RegExpWrapper", (function() {
        var RegExpWrapper = function RegExpWrapper() {};
        return ($traceurRuntime.createClass)(RegExpWrapper, {}, {
          create: function(regExpStr) {
            var flags = arguments[1] !== (void 0) ? arguments[1] : '';
            assert.argumentTypes(regExpStr, assert.type.any, flags, assert.type.string);
            flags = flags.replace(/g/g, '');
            return assert.returnType(({
              multiple: new _global.RegExp(regExpStr, flags + 'g'),
              single: new _global.RegExp(regExpStr, flags)
            }), RegExp);
          },
          firstMatch: function(regExp, input) {
            return input.match(regExp.single);
          },
          matcher: function(regExp, input) {
            return {
              re: regExp.multiple,
              input: input
            };
          }
        });
      }()));
      Object.defineProperty(RegExpWrapper.create, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      RegExpMatcherWrapper = $__export("RegExpMatcherWrapper", (function() {
        var RegExpMatcherWrapper = function RegExpMatcherWrapper() {};
        return ($traceurRuntime.createClass)(RegExpMatcherWrapper, {}, {next: function(matcher) {
            return matcher.re.exec(matcher.input);
          }});
      }()));
      FunctionWrapper = $__export("FunctionWrapper", (function() {
        var FunctionWrapper = function FunctionWrapper() {};
        return ($traceurRuntime.createClass)(FunctionWrapper, {}, {apply: function(fn, posArgs) {
            assert.argumentTypes(fn, Function, posArgs, assert.type.any);
            return fn.apply(null, posArgs);
          }});
      }()));
      Object.defineProperty(FunctionWrapper.apply, "parameters", {get: function() {
          return [[Function], []];
        }});
      BaseException = $__export("BaseException", Error);
      Json = $__export("Json", _global.JSON);
      DateWrapper = $__export("DateWrapper", (function() {
        var DateWrapper = function DateWrapper() {};
        return ($traceurRuntime.createClass)(DateWrapper, {}, {
          fromMillis: function(ms) {
            return new Date(ms);
          },
          toMillis: function(date) {
            assert.argumentTypes(date, Date);
            return date.getTime();
          },
          now: function() {
            return new Date();
          },
          toJson: function(date) {
            return date.toJSON();
          }
        });
      }()));
      Object.defineProperty(DateWrapper.toMillis, "parameters", {get: function() {
          return [[Date]];
        }});
    }
  };
});



System.register("angular2/src/facade/collection", ["rtts_assert/rtts_assert", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/collection";
  var assert,
      int,
      isJsObject,
      global,
      List,
      Map,
      Set,
      StringMap,
      MapWrapper,
      StringMapWrapper,
      ListWrapper,
      SetWrapper;
  function isListLikeIterable(obj) {
    if (!isJsObject(obj))
      return assert.returnType((false), assert.type.boolean);
    return assert.returnType((ListWrapper.isList(obj) || (!(obj instanceof Map) && Symbol.iterator in obj)), assert.type.boolean);
  }
  function iterateListLike(obj, fn) {
    assert.argumentTypes(obj, assert.type.any, fn, Function);
    if (ListWrapper.isList(obj)) {
      for (var i = 0; i < obj.length; i++) {
        fn(obj[i]);
      }
    } else {
      var iterator = obj[Symbol.iterator]();
      var item;
      while (!((item = iterator.next()).done)) {
        fn(item.value);
      }
    }
  }
  $__export("isListLikeIterable", isListLikeIterable);
  $__export("iterateListLike", iterateListLike);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      int = $__m.int;
      isJsObject = $__m.isJsObject;
      global = $__m.global;
    }],
    execute: function() {
      List = $__export("List", global.Array);
      Map = $__export("Map", global.Map);
      Set = $__export("Set", global.Set);
      StringMap = $__export("StringMap", global.Object);
      MapWrapper = $__export("MapWrapper", (function() {
        var MapWrapper = function MapWrapper() {};
        return ($traceurRuntime.createClass)(MapWrapper, {}, {
          create: function() {
            return assert.returnType((new Map()), Map);
          },
          clone: function(m) {
            assert.argumentTypes(m, Map);
            return assert.returnType((new Map(m)), Map);
          },
          createFromStringMap: function(stringMap) {
            var result = MapWrapper.create();
            for (var prop = void 0 in stringMap) {
              MapWrapper.set(result, prop, stringMap[prop]);
            }
            return assert.returnType((result), Map);
          },
          createFromPairs: function(pairs) {
            assert.argumentTypes(pairs, List);
            return assert.returnType((new Map(pairs)), Map);
          },
          get: function(m, k) {
            return m.get(k);
          },
          set: function(m, k, v) {
            m.set(k, v);
          },
          contains: function(m, k) {
            return m.has(k);
          },
          forEach: function(m, fn) {
            m.forEach(fn);
          },
          size: function(m) {
            return m.size;
          },
          delete: function(m, k) {
            m.delete(k);
          },
          clear: function(m) {
            m.clear();
          },
          clearValues: function(m) {
            var keyIterator = m.keys();
            var k;
            while (!((k = keyIterator.next()).done)) {
              m.set(k.value, null);
            }
          },
          iterable: function(m) {
            return m;
          },
          keys: function(m) {
            return m.keys();
          },
          values: function(m) {
            return m.values();
          }
        });
      }()));
      Object.defineProperty(MapWrapper.clone, "parameters", {get: function() {
          return [[Map]];
        }});
      Object.defineProperty(MapWrapper.createFromPairs, "parameters", {get: function() {
          return [[List]];
        }});
      StringMapWrapper = $__export("StringMapWrapper", (function() {
        var StringMapWrapper = function StringMapWrapper() {};
        return ($traceurRuntime.createClass)(StringMapWrapper, {}, {
          create: function() {
            return assert.returnType(({}), Object);
          },
          contains: function(map, key) {
            return map.hasOwnProperty(key);
          },
          get: function(map, key) {
            return map.hasOwnProperty(key) ? map[key] : undefined;
          },
          set: function(map, key, value) {
            map[key] = value;
          },
          isEmpty: function(map) {
            for (var prop = void 0 in map) {
              return false;
            }
            return true;
          },
          forEach: function(map, callback) {
            for (var prop = void 0 in map) {
              if (map.hasOwnProperty(prop)) {
                callback(map[prop], prop);
              }
            }
          },
          merge: function(m1, m2) {
            var m = {};
            for (var attr = void 0 in m1) {
              if (m1.hasOwnProperty(attr)) {
                m[attr] = m1[attr];
              }
            }
            for (var attr = void 0 in m2) {
              if (m2.hasOwnProperty(attr)) {
                m[attr] = m2[attr];
              }
            }
            return m;
          }
        });
      }()));
      ListWrapper = $__export("ListWrapper", (function() {
        var ListWrapper = function ListWrapper() {};
        return ($traceurRuntime.createClass)(ListWrapper, {}, {
          create: function() {
            return assert.returnType((new List()), List);
          },
          createFixedSize: function(size) {
            return assert.returnType((new List(size)), List);
          },
          get: function(m, k) {
            return m[k];
          },
          set: function(m, k, v) {
            m[k] = v;
          },
          clone: function(array) {
            assert.argumentTypes(array, List);
            return array.slice(0);
          },
          map: function(array, fn) {
            return array.map(fn);
          },
          forEach: function(array, fn) {
            assert.argumentTypes(array, List, fn, Function);
            for (var i = 0; i < array.length; i++) {
              fn(array[i]);
            }
          },
          push: function(array, el) {
            array.push(el);
          },
          first: function(array) {
            if (!array)
              return null;
            return array[0];
          },
          last: function(array) {
            if (!array || array.length == 0)
              return null;
            return array[array.length - 1];
          },
          find: function(list, pred) {
            assert.argumentTypes(list, List, pred, Function);
            for (var i = 0; i < list.length; ++i) {
              if (pred(list[i]))
                return list[i];
            }
            return null;
          },
          reduce: function(list, fn, init) {
            assert.argumentTypes(list, List, fn, Function, init, assert.type.any);
            return list.reduce(fn, init);
          },
          filter: function(array, pred) {
            assert.argumentTypes(array, assert.type.any, pred, Function);
            return array.filter(pred);
          },
          any: function(list, pred) {
            assert.argumentTypes(list, List, pred, Function);
            for (var i = 0; i < list.length; ++i) {
              if (pred(list[i]))
                return true;
            }
            return false;
          },
          contains: function(list, el) {
            assert.argumentTypes(list, List, el, assert.type.any);
            return list.indexOf(el) !== -1;
          },
          reversed: function(array) {
            var a = ListWrapper.clone(array);
            return a.reverse();
          },
          concat: function(a, b) {
            return a.concat(b);
          },
          isList: function(list) {
            return Array.isArray(list);
          },
          insert: function(list, index, value) {
            assert.argumentTypes(list, assert.type.any, index, int, value, assert.type.any);
            list.splice(index, 0, value);
          },
          removeAt: function(list, index) {
            assert.argumentTypes(list, assert.type.any, index, int);
            var res = list[index];
            list.splice(index, 1);
            return res;
          },
          removeAll: function(list, items) {
            for (var i = 0; i < items.length; ++i) {
              var index = list.indexOf(items[i]);
              list.splice(index, 1);
            }
          },
          removeLast: function(list) {
            assert.argumentTypes(list, List);
            return list.pop();
          },
          remove: function(list, el) {
            var index = list.indexOf(el);
            if (index > -1) {
              list.splice(index, 1);
              return assert.returnType((true), assert.type.boolean);
            }
            return assert.returnType((false), assert.type.boolean);
          },
          clear: function(list) {
            list.splice(0, list.length);
          },
          join: function(list, s) {
            return list.join(s);
          },
          isEmpty: function(list) {
            return list.length == 0;
          },
          fill: function(list, value) {
            var start = arguments[2] !== (void 0) ? arguments[2] : 0;
            var end = arguments[3] !== (void 0) ? arguments[3] : null;
            assert.argumentTypes(list, List, value, assert.type.any, start, int, end, int);
            list.fill(value, start, end === null ? undefined : end);
          },
          equals: function(a, b) {
            assert.argumentTypes(a, List, b, List);
            if (a.length != b.length)
              return assert.returnType((false), assert.type.boolean);
            for (var i = 0; i < a.length; ++i) {
              if (a[i] !== b[i])
                return assert.returnType((false), assert.type.boolean);
            }
            return assert.returnType((true), assert.type.boolean);
          },
          slice: function(l, from, to) {
            assert.argumentTypes(l, List, from, int, to, int);
            return assert.returnType((l.slice(from, to)), List);
          },
          sort: function(l, compareFn) {
            assert.argumentTypes(l, List, compareFn, Function);
            l.sort(compareFn);
          }
        });
      }()));
      Object.defineProperty(ListWrapper.clone, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ListWrapper.forEach, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(ListWrapper.find, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(ListWrapper.reduce, "parameters", {get: function() {
          return [[List], [Function], []];
        }});
      Object.defineProperty(ListWrapper.filter, "parameters", {get: function() {
          return [[], [Function]];
        }});
      Object.defineProperty(ListWrapper.any, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(ListWrapper.contains, "parameters", {get: function() {
          return [[List], []];
        }});
      Object.defineProperty(ListWrapper.insert, "parameters", {get: function() {
          return [[], [int], []];
        }});
      Object.defineProperty(ListWrapper.removeAt, "parameters", {get: function() {
          return [[], [int]];
        }});
      Object.defineProperty(ListWrapper.removeLast, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ListWrapper.fill, "parameters", {get: function() {
          return [[List], [], [int], [int]];
        }});
      Object.defineProperty(ListWrapper.equals, "parameters", {get: function() {
          return [[List], [List]];
        }});
      Object.defineProperty(ListWrapper.slice, "parameters", {get: function() {
          return [[List], [int], [int]];
        }});
      Object.defineProperty(ListWrapper.sort, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(iterateListLike, "parameters", {get: function() {
          return [[], [Function]];
        }});
      SetWrapper = $__export("SetWrapper", (function() {
        var SetWrapper = function SetWrapper() {};
        return ($traceurRuntime.createClass)(SetWrapper, {}, {
          createFromList: function(lst) {
            assert.argumentTypes(lst, List);
            return new Set(lst);
          },
          has: function(s, key) {
            assert.argumentTypes(s, Set, key, assert.type.any);
            return assert.returnType((s.has(key)), assert.type.boolean);
          }
        });
      }()));
      Object.defineProperty(SetWrapper.createFromList, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(SetWrapper.has, "parameters", {get: function() {
          return [[Set], []];
        }});
    }
  };
});



System.register("angular2/src/change_detection/parser/context_with_variable_bindings", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/context_with_variable_bindings";
  var assert,
      MapWrapper,
      BaseException,
      ContextWithVariableBindings;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      ContextWithVariableBindings = $__export("ContextWithVariableBindings", (function() {
        var ContextWithVariableBindings = function ContextWithVariableBindings(parent, varBindings) {
          assert.argumentTypes(parent, assert.type.any, varBindings, Map);
          this.parent = parent;
          this.varBindings = varBindings;
        };
        return ($traceurRuntime.createClass)(ContextWithVariableBindings, {
          hasBinding: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((MapWrapper.contains(this.varBindings, name)), assert.type.boolean);
          },
          get: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return MapWrapper.get(this.varBindings, name);
          },
          set: function(name, value) {
            assert.argumentTypes(name, assert.type.string, value, assert.type.any);
            if (this.hasBinding(name)) {
              MapWrapper.set(this.varBindings, name, value);
            } else {
              throw new BaseException('VariableBindings do not support setting of new keys post-construction.');
            }
          },
          clearValues: function() {
            MapWrapper.clearValues(this.varBindings);
          }
        }, {});
      }()));
      Object.defineProperty(ContextWithVariableBindings, "parameters", {get: function() {
          return [[assert.type.any], [Map]];
        }});
      Object.defineProperty(ContextWithVariableBindings.prototype.hasBinding, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ContextWithVariableBindings.prototype.get, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ContextWithVariableBindings.prototype.set, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
    }
  };
});



System.register("angular2/src/change_detection/parser/lexer", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/lexer";
  var assert,
      List,
      ListWrapper,
      SetWrapper,
      int,
      NumberWrapper,
      StringJoiner,
      StringWrapper,
      TOKEN_TYPE_CHARACTER,
      TOKEN_TYPE_IDENTIFIER,
      TOKEN_TYPE_KEYWORD,
      TOKEN_TYPE_STRING,
      TOKEN_TYPE_OPERATOR,
      TOKEN_TYPE_NUMBER,
      Lexer,
      Token,
      EOF,
      $EOF,
      $TAB,
      $LF,
      $VTAB,
      $FF,
      $CR,
      $SPACE,
      $BANG,
      $DQ,
      $HASH,
      $$,
      $PERCENT,
      $AMPERSAND,
      $SQ,
      $LPAREN,
      $RPAREN,
      $STAR,
      $PLUS,
      $COMMA,
      $MINUS,
      $PERIOD,
      $SLASH,
      $COLON,
      $SEMICOLON,
      $LT,
      $EQ,
      $GT,
      $QUESTION,
      $0,
      $9,
      $A,
      $B,
      $C,
      $D,
      $E,
      $F,
      $G,
      $H,
      $I,
      $J,
      $K,
      $L,
      $M,
      $N,
      $O,
      $P,
      $Q,
      $R,
      $S,
      $T,
      $U,
      $V,
      $W,
      $X,
      $Y,
      $Z,
      $LBRACKET,
      $BACKSLASH,
      $RBRACKET,
      $CARET,
      $_,
      $a,
      $b,
      $c,
      $d,
      $e,
      $f,
      $g,
      $h,
      $i,
      $j,
      $k,
      $l,
      $m,
      $n,
      $o,
      $p,
      $q,
      $r,
      $s,
      $t,
      $u,
      $v,
      $w,
      $x,
      $y,
      $z,
      $LBRACE,
      $BAR,
      $RBRACE,
      $TILDE,
      $NBSP,
      ScannerError,
      _Scanner,
      OPERATORS,
      KEYWORDS;
  function newCharacterToken(index, code) {
    assert.argumentTypes(index, int, code, int);
    return assert.returnType((new Token(index, TOKEN_TYPE_CHARACTER, code, StringWrapper.fromCharCode(code))), Token);
  }
  function newIdentifierToken(index, text) {
    assert.argumentTypes(index, int, text, assert.type.string);
    return assert.returnType((new Token(index, TOKEN_TYPE_IDENTIFIER, 0, text)), Token);
  }
  function newKeywordToken(index, text) {
    assert.argumentTypes(index, int, text, assert.type.string);
    return assert.returnType((new Token(index, TOKEN_TYPE_KEYWORD, 0, text)), Token);
  }
  function newOperatorToken(index, text) {
    assert.argumentTypes(index, int, text, assert.type.string);
    return assert.returnType((new Token(index, TOKEN_TYPE_OPERATOR, 0, text)), Token);
  }
  function newStringToken(index, text) {
    assert.argumentTypes(index, int, text, assert.type.string);
    return assert.returnType((new Token(index, TOKEN_TYPE_STRING, 0, text)), Token);
  }
  function newNumberToken(index, n) {
    assert.argumentTypes(index, int, n, assert.type.number);
    return assert.returnType((new Token(index, TOKEN_TYPE_NUMBER, n, "")), Token);
  }
  function isWhitespace(code) {
    assert.argumentTypes(code, int);
    return assert.returnType(((code >= $TAB && code <= $SPACE) || (code == $NBSP)), assert.type.boolean);
  }
  function isIdentifierStart(code) {
    assert.argumentTypes(code, int);
    return assert.returnType((($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == $$)), assert.type.boolean);
  }
  function isIdentifierPart(code) {
    assert.argumentTypes(code, int);
    return assert.returnType((($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) || (code == $_) || (code == $$)), assert.type.boolean);
  }
  function isDigit(code) {
    assert.argumentTypes(code, int);
    return assert.returnType(($0 <= code && code <= $9), assert.type.boolean);
  }
  function isExponentStart(code) {
    assert.argumentTypes(code, int);
    return assert.returnType((code == $e || code == $E), assert.type.boolean);
  }
  function isExponentSign(code) {
    assert.argumentTypes(code, int);
    return assert.returnType((code == $MINUS || code == $PLUS), assert.type.boolean);
  }
  function unescape(code) {
    assert.argumentTypes(code, int);
    switch (code) {
      case $n:
        return assert.returnType(($LF), int);
      case $f:
        return assert.returnType(($FF), int);
      case $r:
        return assert.returnType(($CR), int);
      case $t:
        return assert.returnType(($TAB), int);
      case $v:
        return assert.returnType(($VTAB), int);
      default:
        return assert.returnType((code), int);
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      SetWrapper = $__m.SetWrapper;
    }, function($__m) {
      int = $__m.int;
      NumberWrapper = $__m.NumberWrapper;
      StringJoiner = $__m.StringJoiner;
      StringWrapper = $__m.StringWrapper;
    }],
    execute: function() {
      TOKEN_TYPE_CHARACTER = $__export("TOKEN_TYPE_CHARACTER", 1);
      TOKEN_TYPE_IDENTIFIER = $__export("TOKEN_TYPE_IDENTIFIER", 2);
      TOKEN_TYPE_KEYWORD = $__export("TOKEN_TYPE_KEYWORD", 3);
      TOKEN_TYPE_STRING = $__export("TOKEN_TYPE_STRING", 4);
      TOKEN_TYPE_OPERATOR = $__export("TOKEN_TYPE_OPERATOR", 5);
      TOKEN_TYPE_NUMBER = $__export("TOKEN_TYPE_NUMBER", 6);
      Lexer = $__export("Lexer", (function() {
        var Lexer = function Lexer() {};
        return ($traceurRuntime.createClass)(Lexer, {tokenize: function(text) {
            assert.argumentTypes(text, assert.type.string);
            var scanner = new _Scanner(text);
            var tokens = [];
            var token = scanner.scanToken();
            while (token != null) {
              ListWrapper.push(tokens, token);
              token = scanner.scanToken();
            }
            return assert.returnType((tokens), List);
          }}, {});
      }()));
      Object.defineProperty(Lexer.prototype.tokenize, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Token = $__export("Token", (function() {
        var Token = function Token(index, type, numValue, strValue) {
          assert.argumentTypes(index, int, type, int, numValue, assert.type.number, strValue, assert.type.string);
          this.index = index;
          this.type = type;
          this._numValue = numValue;
          this._strValue = strValue;
        };
        return ($traceurRuntime.createClass)(Token, {
          isCharacter: function(code) {
            assert.argumentTypes(code, int);
            return assert.returnType(((this.type == TOKEN_TYPE_CHARACTER && this._numValue == code)), assert.type.boolean);
          },
          isNumber: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_NUMBER)), assert.type.boolean);
          },
          isString: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_STRING)), assert.type.boolean);
          },
          isOperator: function(operater) {
            assert.argumentTypes(operater, assert.type.string);
            return assert.returnType(((this.type == TOKEN_TYPE_OPERATOR && this._strValue == operater)), assert.type.boolean);
          },
          isIdentifier: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_IDENTIFIER)), assert.type.boolean);
          },
          isKeyword: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_KEYWORD)), assert.type.boolean);
          },
          isKeywordVar: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_KEYWORD && this._strValue == "var")), assert.type.boolean);
          },
          isKeywordNull: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_KEYWORD && this._strValue == "null")), assert.type.boolean);
          },
          isKeywordUndefined: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_KEYWORD && this._strValue == "undefined")), assert.type.boolean);
          },
          isKeywordTrue: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_KEYWORD && this._strValue == "true")), assert.type.boolean);
          },
          isKeywordFalse: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_KEYWORD && this._strValue == "false")), assert.type.boolean);
          },
          toNumber: function() {
            return assert.returnType(((this.type == TOKEN_TYPE_NUMBER) ? this._numValue : -1), assert.type.number);
          },
          toString: function() {
            var type = assert.type(this.type, int);
            if (type >= TOKEN_TYPE_CHARACTER && type <= TOKEN_TYPE_STRING) {
              return assert.returnType((this._strValue), assert.type.string);
            } else if (type == TOKEN_TYPE_NUMBER) {
              return assert.returnType((this._numValue.toString()), assert.type.string);
            } else {
              return assert.returnType((null), assert.type.string);
            }
          }
        }, {});
      }()));
      Object.defineProperty(Token, "parameters", {get: function() {
          return [[int], [int], [assert.type.number], [assert.type.string]];
        }});
      Object.defineProperty(Token.prototype.isCharacter, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(Token.prototype.isOperator, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(newCharacterToken, "parameters", {get: function() {
          return [[int], [int]];
        }});
      Object.defineProperty(newIdentifierToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newKeywordToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newOperatorToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newStringToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newNumberToken, "parameters", {get: function() {
          return [[int], [assert.type.number]];
        }});
      EOF = $__export("EOF", assert.type(new Token(-1, 0, 0, ""), Token));
      $EOF = $__export("$EOF", 0);
      $TAB = $__export("$TAB", 9);
      $LF = $__export("$LF", 10);
      $VTAB = $__export("$VTAB", 11);
      $FF = $__export("$FF", 12);
      $CR = $__export("$CR", 13);
      $SPACE = $__export("$SPACE", 32);
      $BANG = $__export("$BANG", 33);
      $DQ = $__export("$DQ", 34);
      $HASH = $__export("$HASH", 35);
      $$ = $__export("$$", 36);
      $PERCENT = $__export("$PERCENT", 37);
      $AMPERSAND = $__export("$AMPERSAND", 38);
      $SQ = $__export("$SQ", 39);
      $LPAREN = $__export("$LPAREN", 40);
      $RPAREN = $__export("$RPAREN", 41);
      $STAR = $__export("$STAR", 42);
      $PLUS = $__export("$PLUS", 43);
      $COMMA = $__export("$COMMA", 44);
      $MINUS = $__export("$MINUS", 45);
      $PERIOD = $__export("$PERIOD", 46);
      $SLASH = $__export("$SLASH", 47);
      $COLON = $__export("$COLON", 58);
      $SEMICOLON = $__export("$SEMICOLON", 59);
      $LT = $__export("$LT", 60);
      $EQ = $__export("$EQ", 61);
      $GT = $__export("$GT", 62);
      $QUESTION = $__export("$QUESTION", 63);
      $0 = 48;
      $9 = 57;
      $A = 65, $B = 66, $C = 67, $D = 68, $E = 69, $F = 70, $G = 71, $H = 72, $I = 73, $J = 74, $K = 75, $L = 76, $M = 77, $N = 78, $O = 79, $P = 80, $Q = 81, $R = 82, $S = 83, $T = 84, $U = 85, $V = 86, $W = 87, $X = 88, $Y = 89, $Z = 90;
      $LBRACKET = $__export("$LBRACKET", 91);
      $BACKSLASH = $__export("$BACKSLASH", 92);
      $RBRACKET = $__export("$RBRACKET", 93);
      $CARET = 94;
      $_ = 95;
      $a = 97, $b = 98, $c = 99, $d = 100, $e = 101, $f = 102, $g = 103, $h = 104, $i = 105, $j = 106, $k = 107, $l = 108, $m = 109, $n = 110, $o = 111, $p = 112, $q = 113, $r = 114, $s = 115, $t = 116, $u = 117, $v = 118, $w = 119, $x = 120, $y = 121, $z = 122;
      $LBRACE = $__export("$LBRACE", 123);
      $BAR = $__export("$BAR", 124);
      $RBRACE = $__export("$RBRACE", 125);
      $TILDE = 126;
      $NBSP = 160;
      ScannerError = $__export("ScannerError", (function($__super) {
        var ScannerError = function ScannerError(message) {
          $traceurRuntime.superConstructor(ScannerError).call(this);
          this.message = message;
        };
        return ($traceurRuntime.createClass)(ScannerError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error)));
      _Scanner = (function() {
        var _Scanner = function _Scanner(input) {
          assert.argumentTypes(input, assert.type.string);
          this.input = input;
          this.length = input.length;
          this.peek = 0;
          this.index = -1;
          this.advance();
        };
        return ($traceurRuntime.createClass)(_Scanner, {
          advance: function() {
            this.peek = ++this.index >= this.length ? $EOF : StringWrapper.charCodeAt(this.input, this.index);
          },
          scanToken: function() {
            var input = this.input,
                length = this.length,
                peek = this.peek,
                index = this.index;
            while (peek <= $SPACE) {
              if (++index >= length) {
                peek = $EOF;
                break;
              } else {
                peek = StringWrapper.charCodeAt(input, index);
              }
            }
            this.peek = peek;
            this.index = index;
            if (index >= length) {
              return assert.returnType((null), Token);
            }
            if (isIdentifierStart(peek))
              return assert.returnType((this.scanIdentifier()), Token);
            if (isDigit(peek))
              return assert.returnType((this.scanNumber(index)), Token);
            var start = assert.type(index, int);
            switch (peek) {
              case $PERIOD:
                this.advance();
                return assert.returnType((isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, $PERIOD)), Token);
              case $LPAREN:
              case $RPAREN:
              case $LBRACE:
              case $RBRACE:
              case $LBRACKET:
              case $RBRACKET:
              case $COMMA:
              case $COLON:
              case $SEMICOLON:
                return assert.returnType((this.scanCharacter(start, peek)), Token);
              case $SQ:
              case $DQ:
                return assert.returnType((this.scanString()), Token);
              case $HASH:
                return assert.returnType((this.scanOperator(start, StringWrapper.fromCharCode(peek))), Token);
              case $PLUS:
              case $MINUS:
              case $STAR:
              case $SLASH:
              case $PERCENT:
              case $CARET:
              case $QUESTION:
                return assert.returnType((this.scanOperator(start, StringWrapper.fromCharCode(peek))), Token);
              case $LT:
              case $GT:
              case $BANG:
              case $EQ:
                return assert.returnType((this.scanComplexOperator(start, $EQ, StringWrapper.fromCharCode(peek), '=')), Token);
              case $AMPERSAND:
                return assert.returnType((this.scanComplexOperator(start, $AMPERSAND, '&', '&')), Token);
              case $BAR:
                return assert.returnType((this.scanComplexOperator(start, $BAR, '|', '|')), Token);
              case $TILDE:
                return assert.returnType((this.scanComplexOperator(start, $SLASH, '~', '/')), Token);
              case $NBSP:
                while (isWhitespace(this.peek))
                  this.advance();
                return assert.returnType((this.scanToken()), Token);
            }
            this.error(("Unexpected character [" + StringWrapper.fromCharCode(peek) + "]"), 0);
            return assert.returnType((null), Token);
          },
          scanCharacter: function(start, code) {
            assert.argumentTypes(start, int, code, int);
            assert(this.peek == code);
            this.advance();
            return assert.returnType((newCharacterToken(start, code)), Token);
          },
          scanOperator: function(start, str) {
            assert.argumentTypes(start, int, str, assert.type.string);
            assert(this.peek == StringWrapper.charCodeAt(str, 0));
            assert(SetWrapper.has(OPERATORS, str));
            this.advance();
            return assert.returnType((newOperatorToken(start, str)), Token);
          },
          scanComplexOperator: function(start, code, one, two) {
            assert.argumentTypes(start, int, code, int, one, assert.type.string, two, assert.type.string);
            assert(this.peek == StringWrapper.charCodeAt(one, 0));
            this.advance();
            var str = assert.type(one, assert.type.string);
            if (this.peek == code) {
              this.advance();
              str += two;
            }
            assert(SetWrapper.has(OPERATORS, str));
            return assert.returnType((newOperatorToken(start, str)), Token);
          },
          scanIdentifier: function() {
            assert(isIdentifierStart(this.peek));
            var start = assert.type(this.index, int);
            this.advance();
            while (isIdentifierPart(this.peek))
              this.advance();
            var str = assert.type(this.input.substring(start, this.index), assert.type.string);
            if (SetWrapper.has(KEYWORDS, str)) {
              return assert.returnType((newKeywordToken(start, str)), Token);
            } else {
              return assert.returnType((newIdentifierToken(start, str)), Token);
            }
          },
          scanNumber: function(start) {
            assert.argumentTypes(start, int);
            assert(isDigit(this.peek));
            var simple = assert.type((this.index === start), assert.type.boolean);
            this.advance();
            while (true) {
              if (isDigit(this.peek)) {} else if (this.peek == $PERIOD) {
                simple = false;
              } else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                  this.advance();
                if (!isDigit(this.peek))
                  this.error('Invalid exponent', -1);
                simple = false;
              } else {
                break;
              }
              this.advance();
            }
            var str = assert.type(this.input.substring(start, this.index), assert.type.string);
            var value = assert.type(simple ? NumberWrapper.parseIntAutoRadix(str) : NumberWrapper.parseFloat(str), assert.type.number);
            return assert.returnType((newNumberToken(start, value)), Token);
          },
          scanString: function() {
            assert(this.peek == $SQ || this.peek == $DQ);
            var start = assert.type(this.index, int);
            var quote = assert.type(this.peek, int);
            this.advance();
            var buffer;
            var marker = assert.type(this.index, int);
            var input = assert.type(this.input, assert.type.string);
            while (this.peek != quote) {
              if (this.peek == $BACKSLASH) {
                if (buffer == null)
                  buffer = new StringJoiner();
                buffer.add(input.substring(marker, this.index));
                this.advance();
                var unescapedCode = void 0;
                if (this.peek == $u) {
                  var hex = assert.type(input.substring(this.index + 1, this.index + 5), assert.type.string);
                  try {
                    unescapedCode = NumberWrapper.parseInt(hex, 16);
                  } catch (e) {
                    this.error(("Invalid unicode escape [\\u" + hex + "]"), 0);
                  }
                  for (var i = assert.type(0, int); i < 5; i++) {
                    this.advance();
                  }
                } else {
                  unescapedCode = unescape(this.peek);
                  this.advance();
                }
                buffer.add(StringWrapper.fromCharCode(unescapedCode));
                marker = this.index;
              } else if (this.peek == $EOF) {
                this.error('Unterminated quote', 0);
              } else {
                this.advance();
              }
            }
            var last = assert.type(input.substring(marker, this.index), assert.type.string);
            this.advance();
            var unescaped = assert.type(last, assert.type.string);
            if (buffer != null) {
              buffer.add(last);
              unescaped = buffer.toString();
            }
            return assert.returnType((newStringToken(start, unescaped)), Token);
          },
          error: function(message, offset) {
            assert.argumentTypes(message, assert.type.string, offset, int);
            var position = assert.type(this.index + offset, int);
            throw new ScannerError(("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]"));
          }
        }, {});
      }());
      Object.defineProperty(_Scanner, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_Scanner.prototype.scanCharacter, "parameters", {get: function() {
          return [[int], [int]];
        }});
      Object.defineProperty(_Scanner.prototype.scanOperator, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(_Scanner.prototype.scanComplexOperator, "parameters", {get: function() {
          return [[int], [int], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(_Scanner.prototype.scanNumber, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_Scanner.prototype.error, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
      Object.defineProperty(isWhitespace, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isIdentifierStart, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isIdentifierPart, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isDigit, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isExponentStart, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isExponentSign, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(unescape, "parameters", {get: function() {
          return [[int]];
        }});
      OPERATORS = SetWrapper.createFromList(['+', '-', '*', '/', '~/', '%', '^', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '&', '|', '!', '?', '#']);
      KEYWORDS = SetWrapper.createFromList(['var', 'null', 'undefined', 'true', 'false']);
    }
  };
});



System.register("angular2/src/reflection/types", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/types";
  var SetterFn,
      GetterFn,
      MethodFn;
  return {
    setters: [],
    execute: function() {
      SetterFn = $__export("SetterFn", Function);
      GetterFn = $__export("GetterFn", Function);
      MethodFn = $__export("MethodFn", Function);
    }
  };
});



System.register("angular2/src/reflection/reflection_capabilities", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./types"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/reflection_capabilities";
  var assert,
      Type,
      isPresent,
      List,
      ListWrapper,
      GetterFn,
      SetterFn,
      MethodFn,
      ReflectionCapabilities;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      GetterFn = $__m.GetterFn;
      SetterFn = $__m.SetterFn;
      MethodFn = $__m.MethodFn;
    }],
    execute: function() {
      ReflectionCapabilities = $__export("ReflectionCapabilities", (function() {
        var ReflectionCapabilities = function ReflectionCapabilities() {};
        return ($traceurRuntime.createClass)(ReflectionCapabilities, {
          factory: function(type) {
            assert.argumentTypes(type, Type);
            switch (type.length) {
              case 0:
                return assert.returnType((function() {
                  return new type();
                }), Function);
              case 1:
                return assert.returnType((function(a1) {
                  return new type(a1);
                }), Function);
              case 2:
                return assert.returnType((function(a1, a2) {
                  return new type(a1, a2);
                }), Function);
              case 3:
                return assert.returnType((function(a1, a2, a3) {
                  return new type(a1, a2, a3);
                }), Function);
              case 4:
                return assert.returnType((function(a1, a2, a3, a4) {
                  return new type(a1, a2, a3, a4);
                }), Function);
              case 5:
                return assert.returnType((function(a1, a2, a3, a4, a5) {
                  return new type(a1, a2, a3, a4, a5);
                }), Function);
              case 6:
                return assert.returnType((function(a1, a2, a3, a4, a5, a6) {
                  return new type(a1, a2, a3, a4, a5, a6);
                }), Function);
              case 7:
                return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7) {
                  return new type(a1, a2, a3, a4, a5, a6, a7);
                }), Function);
              case 8:
                return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7, a8) {
                  return new type(a1, a2, a3, a4, a5, a6, a7, a8);
                }), Function);
              case 9:
                return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                  return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9);
                }), Function);
              case 10:
                return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
                  return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
                }), Function);
            }
            ;
            throw new Error("Factory cannot take more than 10 arguments");
          },
          parameters: function(typeOfFunc) {
            return assert.returnType((isPresent(typeOfFunc.parameters) ? typeOfFunc.parameters : ListWrapper.createFixedSize(typeOfFunc.length)), assert.genericType(List, List));
          },
          annotations: function(typeOfFunc) {
            return assert.returnType((isPresent(typeOfFunc.annotations) ? typeOfFunc.annotations : []), List);
          },
          getter: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((new Function('o', 'return o.' + name + ';')), GetterFn);
          },
          setter: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((new Function('o', 'v', 'return o.' + name + ' = v;')), SetterFn);
          },
          method: function(name) {
            assert.argumentTypes(name, assert.type.string);
            var method = ("o." + name);
            return assert.returnType((new Function('o', 'args', ("if (!" + method + ") throw new Error('\"" + name + "\" is undefined');") + ("return " + method + ".apply(o, args);"))), MethodFn);
          }
        }, {});
      }()));
      Object.defineProperty(ReflectionCapabilities.prototype.factory, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ReflectionCapabilities.prototype.getter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ReflectionCapabilities.prototype.setter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ReflectionCapabilities.prototype.method, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/proto_record", ["rtts_assert/rtts_assert", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/proto_record";
  var assert,
      List,
      RECORD_TYPE_SELF,
      RECORD_TYPE_CONST,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_INTERPOLATE,
      ProtoRecord;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      List = $__m.List;
    }],
    execute: function() {
      RECORD_TYPE_SELF = $__export("RECORD_TYPE_SELF", 0);
      RECORD_TYPE_CONST = $__export("RECORD_TYPE_CONST", 1);
      RECORD_TYPE_PRIMITIVE_OP = $__export("RECORD_TYPE_PRIMITIVE_OP", 2);
      RECORD_TYPE_PROPERTY = $__export("RECORD_TYPE_PROPERTY", 3);
      RECORD_TYPE_INVOKE_METHOD = $__export("RECORD_TYPE_INVOKE_METHOD", 4);
      RECORD_TYPE_INVOKE_CLOSURE = $__export("RECORD_TYPE_INVOKE_CLOSURE", 5);
      RECORD_TYPE_KEYED_ACCESS = $__export("RECORD_TYPE_KEYED_ACCESS", 6);
      RECORD_TYPE_PIPE = $__export("RECORD_TYPE_PIPE", 8);
      RECORD_TYPE_INTERPOLATE = $__export("RECORD_TYPE_INTERPOLATE", 9);
      ProtoRecord = $__export("ProtoRecord", (function() {
        var ProtoRecord = function ProtoRecord(mode, name, funcOrValue, args, fixedArgs, contextIndex, selfIndex, bindingMemento, directiveMemento, expressionAsString, lastInBinding, lastInDirective) {
          assert.argumentTypes(mode, assert.type.number, name, assert.type.string, funcOrValue, assert.type.any, args, List, fixedArgs, List, contextIndex, assert.type.number, selfIndex, assert.type.number, bindingMemento, assert.type.any, directiveMemento, assert.type.any, expressionAsString, assert.type.string, lastInBinding, assert.type.boolean, lastInDirective, assert.type.boolean);
          this.mode = mode;
          this.name = name;
          this.funcOrValue = funcOrValue;
          this.args = args;
          this.fixedArgs = fixedArgs;
          this.contextIndex = contextIndex;
          this.selfIndex = selfIndex;
          this.bindingMemento = bindingMemento;
          this.directiveMemento = directiveMemento;
          this.lastInBinding = lastInBinding;
          this.lastInDirective = lastInDirective;
          this.expressionAsString = expressionAsString;
        };
        return ($traceurRuntime.createClass)(ProtoRecord, {isPureFunction: function() {
            return assert.returnType((this.mode === RECORD_TYPE_INTERPOLATE || this.mode === RECORD_TYPE_PRIMITIVE_OP), assert.type.boolean);
          }}, {});
      }()));
      Object.defineProperty(ProtoRecord, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [], [List], [List], [assert.type.number], [assert.type.number], [assert.type.any], [assert.type.any], [assert.type.string], [assert.type.boolean], [assert.type.boolean]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/interfaces", ["rtts_assert/rtts_assert", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/interfaces";
  var assert,
      List,
      ChangeRecord,
      CHECK_ONCE,
      CHECKED,
      CHECK_ALWAYS,
      DETACHED,
      ChangeDispatcher,
      ChangeDetector;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      List = $__m.List;
    }],
    execute: function() {
      ChangeRecord = $__export("ChangeRecord", (function() {
        var ChangeRecord = function ChangeRecord(bindingMemento, change) {
          this.bindingMemento = bindingMemento;
          this.change = change;
        };
        return ($traceurRuntime.createClass)(ChangeRecord, {
          get currentValue() {
            return this.change.currentValue;
          },
          get previousValue() {
            return this.change.previousValue;
          }
        }, {});
      }()));
      CHECK_ONCE = $__export("CHECK_ONCE", "CHECK_ONCE");
      CHECKED = $__export("CHECKED", "CHECKED");
      CHECK_ALWAYS = $__export("CHECK_ALWAYS", "ALWAYS_CHECK");
      DETACHED = $__export("DETACHED", "DETACHED");
      ChangeDispatcher = $__export("ChangeDispatcher", (function() {
        var ChangeDispatcher = function ChangeDispatcher() {};
        return ($traceurRuntime.createClass)(ChangeDispatcher, {onRecordChange: function(directiveMemento, records) {
            assert.argumentTypes(directiveMemento, assert.type.any, records, assert.genericType(List, ChangeRecord));
          }}, {});
      }()));
      Object.defineProperty(ChangeDispatcher.prototype.onRecordChange, "parameters", {get: function() {
          return [[], [assert.genericType(List, ChangeRecord)]];
        }});
      ChangeDetector = $__export("ChangeDetector", (function() {
        var ChangeDetector = function ChangeDetector() {};
        return ($traceurRuntime.createClass)(ChangeDetector, {
          addChild: function(cd) {
            assert.argumentTypes(cd, ChangeDetector);
          },
          removeChild: function(cd) {
            assert.argumentTypes(cd, ChangeDetector);
          },
          remove: function() {},
          hydrate: function(context) {
            assert.argumentTypes(context, assert.type.any);
          },
          dehydrate: function() {},
          markPathToRootAsCheckOnce: function() {},
          detectChanges: function() {},
          checkNoChanges: function() {}
        }, {});
      }()));
      Object.defineProperty(ChangeDetector.prototype.addChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(ChangeDetector.prototype.removeChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(ChangeDetector.prototype.hydrate, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/pipes/pipe", ["rtts_assert/rtts_assert"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/pipe";
  var assert,
      NO_CHANGE,
      Pipe;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }],
    execute: function() {
      NO_CHANGE = $__export("NO_CHANGE", new Object());
      Pipe = $__export("Pipe", (function() {
        var Pipe = function Pipe() {};
        return ($traceurRuntime.createClass)(Pipe, {
          supports: function(obj) {
            return assert.returnType((false), assert.type.boolean);
          },
          onDestroy: function() {},
          transform: function(value) {
            assert.argumentTypes(value, assert.type.any);
            return assert.returnType((null), assert.type.any);
          }
        }, {});
      }()));
      Object.defineProperty(Pipe.prototype.transform, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/abstract_change_detector", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./interfaces"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/abstract_change_detector";
  var assert,
      isPresent,
      List,
      ListWrapper,
      ChangeDetector,
      CHECK_ALWAYS,
      CHECK_ONCE,
      CHECKED,
      DETACHED,
      AbstractChangeDetector;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      ChangeDetector = $__m.ChangeDetector;
      CHECK_ALWAYS = $__m.CHECK_ALWAYS;
      CHECK_ONCE = $__m.CHECK_ONCE;
      CHECKED = $__m.CHECKED;
      DETACHED = $__m.DETACHED;
    }],
    execute: function() {
      AbstractChangeDetector = $__export("AbstractChangeDetector", (function($__super) {
        var AbstractChangeDetector = function AbstractChangeDetector() {
          $traceurRuntime.superConstructor(AbstractChangeDetector).call(this);
          this.children = [];
          this.mode = CHECK_ALWAYS;
        };
        return ($traceurRuntime.createClass)(AbstractChangeDetector, {
          addChild: function(cd) {
            assert.argumentTypes(cd, ChangeDetector);
            ListWrapper.push(this.children, cd);
            cd.parent = this;
          },
          removeChild: function(cd) {
            assert.argumentTypes(cd, ChangeDetector);
            ListWrapper.remove(this.children, cd);
          },
          remove: function() {
            this.parent.removeChild(this);
          },
          detectChanges: function() {
            this._detectChanges(false);
          },
          checkNoChanges: function() {
            this._detectChanges(true);
          },
          _detectChanges: function(throwOnChange) {
            assert.argumentTypes(throwOnChange, assert.type.boolean);
            if (this.mode === DETACHED || this.mode === CHECKED)
              return ;
            this.detectChangesInRecords(throwOnChange);
            this._detectChangesInChildren(throwOnChange);
            if (this.mode === CHECK_ONCE)
              this.mode = CHECKED;
          },
          detectChangesInRecords: function(throwOnChange) {
            assert.argumentTypes(throwOnChange, assert.type.boolean);
          },
          _detectChangesInChildren: function(throwOnChange) {
            assert.argumentTypes(throwOnChange, assert.type.boolean);
            var children = this.children;
            for (var i = 0; i < children.length; ++i) {
              children[i]._detectChanges(throwOnChange);
            }
          },
          markPathToRootAsCheckOnce: function() {
            var c = this;
            while (isPresent(c) && c.mode != DETACHED) {
              if (c.mode === CHECKED)
                c.mode = CHECK_ONCE;
              c = c.parent;
            }
          }
        }, {}, $__super);
      }(ChangeDetector)));
      Object.defineProperty(AbstractChangeDetector.prototype.addChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype.removeChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype._detectChanges, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype.detectChangesInRecords, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype._detectChangesInChildren, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/pipes/pipe_registry", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang", "./pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/pipe_registry";
  var assert,
      List,
      ListWrapper,
      isBlank,
      isPresent,
      BaseException,
      CONST,
      Pipe,
      PipeRegistry;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      CONST = $__m.CONST;
    }, function($__m) {
      Pipe = $__m.Pipe;
    }],
    execute: function() {
      PipeRegistry = $__export("PipeRegistry", (function() {
        var PipeRegistry = function PipeRegistry(config) {
          this.config = config;
        };
        return ($traceurRuntime.createClass)(PipeRegistry, {get: function(type, obj) {
            var listOfConfigs = this.config[type];
            if (isBlank(listOfConfigs)) {
              throw new BaseException(("Cannot find a pipe for type '" + type + "' object '" + obj + "'"));
            }
            var matchingConfig = ListWrapper.find(listOfConfigs, (function(pipeConfig) {
              return pipeConfig.supports(obj);
            }));
            if (isBlank(matchingConfig)) {
              throw new BaseException(("Cannot find a pipe for type '" + type + "' object '" + obj + "'"));
            }
            return assert.returnType((matchingConfig.create()), Pipe);
          }}, {});
      }()));
      Object.defineProperty(PipeRegistry.prototype.get, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
    }
  };
});



System.register("angular2/src/change_detection/change_detection_jit_generator", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./parser/context_with_variable_bindings", "./abstract_change_detector", "./change_detection_util", "./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/change_detection_jit_generator";
  var assert,
      isPresent,
      isBlank,
      BaseException,
      Type,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      ContextWithVariableBindings,
      AbstractChangeDetector,
      ChangeDetectionUtil,
      ProtoRecord,
      RECORD_TYPE_SELF,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_CONST,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_INTERPOLATE,
      ABSTRACT_CHANGE_DETECTOR,
      UTIL,
      DISPATCHER_ACCESSOR,
      PIPE_REGISTRY_ACCESSOR,
      PROTOS_ACCESSOR,
      CHANGE_LOCAL,
      CHANGES_LOCAL,
      TEMP_LOCAL,
      ChangeDetectorJITGenerator;
  function typeTemplate(type, cons, detectChanges, setContext) {
    assert.argumentTypes(type, assert.type.string, cons, assert.type.string, detectChanges, assert.type.string, setContext, assert.type.string);
    return assert.returnType((("\n" + cons + "\n" + detectChanges + "\n" + setContext + ";\n\nreturn function(dispatcher, pipeRegistry) {\n  return new " + type + "(dispatcher, pipeRegistry, protos);\n}\n")), assert.type.string);
  }
  function constructorTemplate(type, fieldsDefinitions) {
    assert.argumentTypes(type, assert.type.string, fieldsDefinitions, assert.type.string);
    return assert.returnType((("\nvar " + type + " = function " + type + "(dispatcher, pipeRegistry, protos) {\n" + ABSTRACT_CHANGE_DETECTOR + ".call(this);\n" + DISPATCHER_ACCESSOR + " = dispatcher;\n" + PIPE_REGISTRY_ACCESSOR + " = pipeRegistry;\n" + PROTOS_ACCESSOR + " = protos;\n" + fieldsDefinitions + "\n}\n\n" + type + ".prototype = Object.create(" + ABSTRACT_CHANGE_DETECTOR + ".prototype);\n")), assert.type.string);
  }
  function pipeOnDestroyTemplate(pipeNames) {
    return pipeNames.map((function(p) {
      return (p + ".onDestroy()");
    })).join("\n");
  }
  function hydrateTemplate(type, fieldsDefinitions, pipeOnDestroy) {
    assert.argumentTypes(type, assert.type.string, fieldsDefinitions, assert.type.string, pipeOnDestroy, assert.type.string);
    return assert.returnType((("\n" + type + ".prototype.hydrate = function(context) {\n  this.context = context;\n}\n" + type + ".prototype.dehydrate = function() {\n  " + pipeOnDestroy + "\n  " + fieldsDefinitions + "\n}\n" + type + ".prototype.hydrated = function() {\n  return this.context !== " + UTIL + ".unitialized();\n}\n")), assert.type.string);
  }
  function detectChangesTemplate(type, body) {
    assert.argumentTypes(type, assert.type.string, body, assert.type.string);
    return assert.returnType((("\n" + type + ".prototype.detectChangesInRecords = function(throwOnChange) {\n  " + body + "\n}\n")), assert.type.string);
  }
  function bodyTemplate(localDefinitions, changeDefinitions, records) {
    assert.argumentTypes(localDefinitions, assert.type.string, changeDefinitions, assert.type.string, records, assert.type.string);
    return assert.returnType((("\n" + localDefinitions + "\n" + changeDefinitions + "\nvar " + TEMP_LOCAL + ";\nvar " + CHANGE_LOCAL + ";\nvar " + CHANGES_LOCAL + " = null;\n\ncontext = this.context;\n" + records + "\n")), assert.type.string);
  }
  function notifyTemplate(index) {
    assert.argumentTypes(index, assert.type.number);
    return assert.returnType((("\nif (" + CHANGES_LOCAL + " && " + CHANGES_LOCAL + ".length > 0) {\n  if(throwOnChange) " + UTIL + ".throwOnChange(" + PROTOS_ACCESSOR + "[" + index + "], " + CHANGES_LOCAL + "[0]);\n  " + DISPATCHER_ACCESSOR + ".onRecordChange(" + PROTOS_ACCESSOR + "[" + index + "].directiveMemento, " + CHANGES_LOCAL + ");\n  " + CHANGES_LOCAL + " = null;\n}\n")), assert.type.string);
  }
  function pipeCheckTemplate(context, pipe, pipeType, value, change, addRecord, notify) {
    assert.argumentTypes(context, assert.type.string, pipe, assert.type.string, pipeType, assert.type.string, value, assert.type.string, change, assert.type.string, addRecord, assert.type.string, notify, assert.type.string);
    return assert.returnType((("\nif (" + pipe + " === " + UTIL + ".unitialized()) {\n  " + pipe + " = " + PIPE_REGISTRY_ACCESSOR + ".get('" + pipeType + "', " + context + ");\n} else if (!" + pipe + ".supports(" + context + ")) {\n  " + pipe + ".onDestroy();\n  " + pipe + " = " + PIPE_REGISTRY_ACCESSOR + ".get('" + pipeType + "', " + context + ");\n}\n\n" + CHANGE_LOCAL + " = " + pipe + ".transform(" + context + ");\nif (! " + UTIL + ".noChangeMarker(" + CHANGE_LOCAL + ")) {\n  " + value + " = " + CHANGE_LOCAL + ";\n  " + change + " = true;\n  " + addRecord + "\n}\n" + notify + "\n")), assert.type.string);
  }
  function referenceCheckTemplate(assignment, newValue, oldValue, change, addRecord, notify) {
    return ("\n" + assignment + "\nif (" + newValue + " !== " + oldValue + " || (" + newValue + " !== " + newValue + ") && (" + oldValue + " !== " + oldValue + ")) {\n  " + change + " = true;\n  " + addRecord + "\n  " + oldValue + " = " + newValue + ";\n}\n" + notify + "\n");
  }
  function assignmentTemplate(field, value) {
    assert.argumentTypes(field, assert.type.string, value, assert.type.string);
    return (field + " = " + value + ";");
  }
  function propertyReadTemplate(name, context, newValue) {
    assert.argumentTypes(name, assert.type.string, context, assert.type.string, newValue, assert.type.string);
    return ("\n" + TEMP_LOCAL + " = " + UTIL + ".findContext(\"" + name + "\", " + context + ");\nif (" + TEMP_LOCAL + " instanceof ContextWithVariableBindings) {\n  " + newValue + " = " + TEMP_LOCAL + ".get('" + name + "');\n} else {\n  " + newValue + " = " + TEMP_LOCAL + "." + name + ";\n}\n");
  }
  function invokeMethodTemplate(name, args, context, newValue) {
    assert.argumentTypes(name, assert.type.string, args, assert.type.string, context, assert.type.string, newValue, assert.type.string);
    return ("\n" + TEMP_LOCAL + " = " + UTIL + ".findContext(\"" + name + "\", " + context + ");\nif (" + TEMP_LOCAL + " instanceof ContextWithVariableBindings) {\n  " + newValue + " = " + TEMP_LOCAL + ".get('" + name + "').apply(null, [" + args + "]);\n} else {\n  " + newValue + " = " + context + "." + name + "(" + args + ");\n}\n");
  }
  function localDefinitionsTemplate(names) {
    return assert.returnType((names.map((function(n) {
      return ("var " + n + ";");
    })).join("\n")), assert.type.string);
  }
  function changeDefinitionsTemplate(names) {
    return assert.returnType((names.map((function(n) {
      return ("var " + n + " = false;");
    })).join("\n")), assert.type.string);
  }
  function fieldDefinitionsTemplate(names) {
    return assert.returnType((names.map((function(n) {
      return (n + " = " + UTIL + ".unitialized();");
    })).join("\n")), assert.type.string);
  }
  function ifChangedGuardTemplate(changeNames, body) {
    assert.argumentTypes(changeNames, List, body, assert.type.string);
    var cond = changeNames.join(" || ");
    return assert.returnType((("\nif (" + cond + ") {\n  " + body + "\n}\n")), assert.type.string);
  }
  function addSimpleChangeRecordTemplate(protoIndex, oldValue, newValue) {
    assert.argumentTypes(protoIndex, assert.type.number, oldValue, assert.type.string, newValue, assert.type.string);
    return (CHANGES_LOCAL + " = " + UTIL + ".addRecord(" + CHANGES_LOCAL + ",\n    " + UTIL + ".simpleChangeRecord(" + PROTOS_ACCESSOR + "[" + protoIndex + "].bindingMemento, " + oldValue + ", " + newValue + "));");
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      Type = $__m.Type;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      ContextWithVariableBindings = $__m.ContextWithVariableBindings;
    }, function($__m) {
      AbstractChangeDetector = $__m.AbstractChangeDetector;
    }, function($__m) {
      ChangeDetectionUtil = $__m.ChangeDetectionUtil;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      RECORD_TYPE_PROPERTY = $__m.RECORD_TYPE_PROPERTY;
      RECORD_TYPE_INVOKE_METHOD = $__m.RECORD_TYPE_INVOKE_METHOD;
      RECORD_TYPE_CONST = $__m.RECORD_TYPE_CONST;
      RECORD_TYPE_INVOKE_CLOSURE = $__m.RECORD_TYPE_INVOKE_CLOSURE;
      RECORD_TYPE_PRIMITIVE_OP = $__m.RECORD_TYPE_PRIMITIVE_OP;
      RECORD_TYPE_KEYED_ACCESS = $__m.RECORD_TYPE_KEYED_ACCESS;
      RECORD_TYPE_PIPE = $__m.RECORD_TYPE_PIPE;
      RECORD_TYPE_INTERPOLATE = $__m.RECORD_TYPE_INTERPOLATE;
    }],
    execute: function() {
      ABSTRACT_CHANGE_DETECTOR = "AbstractChangeDetector";
      UTIL = "ChangeDetectionUtil";
      DISPATCHER_ACCESSOR = "this.dispatcher";
      PIPE_REGISTRY_ACCESSOR = "this.pipeRegistry";
      PROTOS_ACCESSOR = "this.protos";
      CHANGE_LOCAL = "change";
      CHANGES_LOCAL = "changes";
      TEMP_LOCAL = "temp";
      Object.defineProperty(typeTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(constructorTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(pipeOnDestroyTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(hydrateTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(detectChangesTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(bodyTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(notifyTemplate, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(pipeCheckTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(assignmentTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(propertyReadTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(invokeMethodTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(localDefinitionsTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(changeDefinitionsTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(fieldDefinitionsTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ifChangedGuardTemplate, "parameters", {get: function() {
          return [[List], [assert.type.string]];
        }});
      Object.defineProperty(addSimpleChangeRecordTemplate, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [assert.type.string]];
        }});
      ChangeDetectorJITGenerator = $__export("ChangeDetectorJITGenerator", (function() {
        var ChangeDetectorJITGenerator = function ChangeDetectorJITGenerator(typeName, records) {
          assert.argumentTypes(typeName, assert.type.string, records, assert.genericType(List, ProtoRecord));
          this.typeName = typeName;
          this.records = records;
          this.localNames = this.getLocalNames(records);
          this.changeNames = this.getChangeNames(this.localNames);
          this.fieldNames = this.getFieldNames(this.localNames);
          this.pipeNames = this.getPipeNames(this.localNames);
        };
        return ($traceurRuntime.createClass)(ChangeDetectorJITGenerator, {
          getLocalNames: function(records) {
            assert.argumentTypes(records, assert.genericType(List, ProtoRecord));
            var index = 0;
            var names = records.map((function(r) {
              var sanitizedName = r.name.replace(new RegExp("\\W", "g"), '');
              return ("" + sanitizedName + index++);
            }));
            return assert.returnType((["context"].concat(names)), assert.genericType(List, String));
          },
          getChangeNames: function(localNames) {
            return assert.returnType((localNames.map((function(n) {
              return ("change_" + n);
            }))), assert.genericType(List, String));
          },
          getFieldNames: function(localNames) {
            return assert.returnType((localNames.map((function(n) {
              return ("this." + n);
            }))), assert.genericType(List, String));
          },
          getPipeNames: function(localNames) {
            return assert.returnType((localNames.map((function(n) {
              return ("this." + n + "_pipe");
            }))), assert.genericType(List, String));
          },
          generate: function() {
            var text = typeTemplate(this.typeName, this.genConstructor(), this.genDetectChanges(), this.genHydrate());
            return assert.returnType((new Function('AbstractChangeDetector', 'ChangeDetectionUtil', 'ContextWithVariableBindings', 'protos', text)(AbstractChangeDetector, ChangeDetectionUtil, ContextWithVariableBindings, this.records)), Function);
          },
          genConstructor: function() {
            return assert.returnType((constructorTemplate(this.typeName, this.genFieldDefinitions())), assert.type.string);
          },
          genHydrate: function() {
            return assert.returnType((hydrateTemplate(this.typeName, this.genFieldDefinitions(), pipeOnDestroyTemplate(this.getnonNullPipeNames()))), assert.type.string);
          },
          genFieldDefinitions: function() {
            var fields = [];
            fields = fields.concat(this.fieldNames);
            fields = fields.concat(this.getnonNullPipeNames());
            return fieldDefinitionsTemplate(fields);
          },
          getnonNullPipeNames: function() {
            var $__0 = this;
            var pipes = [];
            this.records.forEach((function(r) {
              if (r.mode === RECORD_TYPE_PIPE) {
                pipes.push($__0.pipeNames[r.selfIndex]);
              }
            }));
            return assert.returnType((pipes), assert.genericType(List, String));
          },
          genDetectChanges: function() {
            var body = this.genBody();
            return assert.returnType((detectChangesTemplate(this.typeName, body)), assert.type.string);
          },
          genBody: function() {
            var $__0 = this;
            var rec = this.records.map((function(r) {
              return $__0.genRecord(r);
            })).join("\n");
            return assert.returnType((bodyTemplate(this.genLocalDefinitions(), this.genChangeDefinitions(), rec)), assert.type.string);
          },
          genLocalDefinitions: function() {
            return assert.returnType((localDefinitionsTemplate(this.localNames)), assert.type.string);
          },
          genChangeDefinitions: function() {
            return assert.returnType((changeDefinitionsTemplate(this.changeNames)), assert.type.string);
          },
          genRecord: function(r) {
            assert.argumentTypes(r, ProtoRecord);
            if (r.mode === RECORD_TYPE_PIPE) {
              return assert.returnType((this.genPipeCheck(r)), assert.type.string);
            } else {
              return assert.returnType((this.genReferenceCheck(r)), assert.type.string);
            }
          },
          genPipeCheck: function(r) {
            assert.argumentTypes(r, ProtoRecord);
            var context = this.localNames[r.contextIndex];
            var pipe = this.pipeNames[r.selfIndex];
            var newValue = this.localNames[r.selfIndex];
            var oldValue = this.fieldNames[r.selfIndex];
            var change = this.changeNames[r.selfIndex];
            var addRecord = addSimpleChangeRecordTemplate(r.selfIndex - 1, oldValue, newValue);
            var notify = this.genNotify(r);
            return assert.returnType((pipeCheckTemplate(context, pipe, r.name, newValue, change, addRecord, notify)), assert.type.string);
          },
          genReferenceCheck: function(r) {
            assert.argumentTypes(r, ProtoRecord);
            var newValue = this.localNames[r.selfIndex];
            var oldValue = this.fieldNames[r.selfIndex];
            var change = this.changeNames[r.selfIndex];
            var assignment = this.genUpdateCurrentValue(r);
            var addRecord = addSimpleChangeRecordTemplate(r.selfIndex - 1, oldValue, newValue);
            var notify = this.genNotify(r);
            var check = referenceCheckTemplate(assignment, newValue, oldValue, change, r.lastInBinding ? addRecord : '', notify);
            ;
            if (r.isPureFunction()) {
              return assert.returnType((this.ifChangedGuard(r, check)), assert.type.string);
            } else {
              return assert.returnType((check), assert.type.string);
            }
          },
          genUpdateCurrentValue: function(r) {
            assert.argumentTypes(r, ProtoRecord);
            var context = this.localNames[r.contextIndex];
            var newValue = this.localNames[r.selfIndex];
            var args = this.genArgs(r);
            switch (r.mode) {
              case RECORD_TYPE_SELF:
                return assert.returnType((assignmentTemplate(newValue, context)), assert.type.string);
              case RECORD_TYPE_CONST:
                return assert.returnType(((newValue + " = " + this.genLiteral(r.funcOrValue))), assert.type.string);
              case RECORD_TYPE_PROPERTY:
                if (r.contextIndex == 0) {
                  return assert.returnType((propertyReadTemplate(r.name, context, newValue)), assert.type.string);
                } else {
                  return assert.returnType((assignmentTemplate(newValue, (context + "." + r.name))), assert.type.string);
                }
              case RECORD_TYPE_INVOKE_METHOD:
                if (r.contextIndex == 0) {
                  return assert.returnType((invokeMethodTemplate(r.name, args, context, newValue)), assert.type.string);
                } else {
                  return assert.returnType((assignmentTemplate(newValue, (context + "." + r.name + "(" + args + ")"))), assert.type.string);
                }
              case RECORD_TYPE_INVOKE_CLOSURE:
                return assert.returnType((assignmentTemplate(newValue, (context + "(" + args + ")"))), assert.type.string);
              case RECORD_TYPE_PRIMITIVE_OP:
                return assert.returnType((assignmentTemplate(newValue, (UTIL + "." + r.name + "(" + args + ")"))), assert.type.string);
              case RECORD_TYPE_INTERPOLATE:
                return assert.returnType((assignmentTemplate(newValue, this.genInterpolation(r))), assert.type.string);
              case RECORD_TYPE_KEYED_ACCESS:
                var key = this.localNames[r.args[0]];
                return assert.returnType((assignmentTemplate(newValue, (context + "[" + key + "]"))), assert.type.string);
              default:
                throw new BaseException(("Unknown operation " + r.mode));
            }
          },
          ifChangedGuard: function(r, body) {
            var $__0 = this;
            return assert.returnType((ifChangedGuardTemplate(r.args.map((function(a) {
              return $__0.changeNames[a];
            })), body)), assert.type.string);
          },
          genInterpolation: function(r) {
            assert.argumentTypes(r, ProtoRecord);
            var res = "";
            for (var i = 0; i < r.args.length; ++i) {
              res += this.genLiteral(r.fixedArgs[i]);
              res += " + ";
              res += this.localNames[r.args[i]];
              res += " + ";
            }
            res += this.genLiteral(r.fixedArgs[r.args.length]);
            return assert.returnType((res), assert.type.string);
          },
          genLiteral: function(value) {
            return assert.returnType((JSON.stringify(value)), assert.type.string);
          },
          genNotify: function(r) {
            return assert.returnType((r.lastInDirective ? notifyTemplate(r.selfIndex - 1) : ''), assert.type.string);
          },
          genArgs: function(r) {
            var $__0 = this;
            return assert.returnType((r.args.map((function(arg) {
              return $__0.localNames[arg];
            })).join(", ")), assert.type.string);
          }
        }, {});
      }()));
      Object.defineProperty(ChangeDetectorJITGenerator, "parameters", {get: function() {
          return [[assert.type.string], [assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getLocalNames, "parameters", {get: function() {
          return [[assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getChangeNames, "parameters", {get: function() {
          return [[assert.genericType(List, String)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getFieldNames, "parameters", {get: function() {
          return [[assert.genericType(List, String)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getPipeNames, "parameters", {get: function() {
          return [[assert.genericType(List, String)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genRecord, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genPipeCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genReferenceCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genUpdateCurrentValue, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.ifChangedGuard, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.string]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genInterpolation, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genArgs, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/coalesce", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/coalesce";
  var assert,
      isPresent,
      List,
      ListWrapper,
      Map,
      MapWrapper,
      RECORD_TYPE_SELF,
      ProtoRecord;
  function coalesce(records) {
    assert.argumentTypes(records, assert.genericType(List, ProtoRecord));
    var res = ListWrapper.create();
    var indexMap = MapWrapper.create();
    for (var i = 0; i < records.length; ++i) {
      var r = records[i];
      var record = _replaceIndices(r, res.length + 1, indexMap);
      var matchingRecord = _findMatching(record, res);
      if (isPresent(matchingRecord) && record.lastInBinding) {
        ListWrapper.push(res, _selfRecord(record, matchingRecord.selfIndex, res.length + 1));
        MapWrapper.set(indexMap, r.selfIndex, matchingRecord.selfIndex);
      } else if (isPresent(matchingRecord) && !record.lastInBinding) {
        MapWrapper.set(indexMap, r.selfIndex, matchingRecord.selfIndex);
      } else {
        ListWrapper.push(res, record);
        MapWrapper.set(indexMap, r.selfIndex, record.selfIndex);
      }
    }
    return assert.returnType((res), assert.genericType(List, ProtoRecord));
  }
  function _selfRecord(r, contextIndex, selfIndex) {
    assert.argumentTypes(r, ProtoRecord, contextIndex, assert.type.number, selfIndex, assert.type.number);
    return assert.returnType((new ProtoRecord(RECORD_TYPE_SELF, "self", null, [], r.fixedArgs, contextIndex, selfIndex, r.bindingMemento, r.directiveMemento, r.expressionAsString, r.lastInBinding, r.lastInDirective)), ProtoRecord);
  }
  function _findMatching(r, rs) {
    return ListWrapper.find(rs, (function(rr) {
      return rr.mode === r.mode && rr.funcOrValue === r.funcOrValue && rr.contextIndex === r.contextIndex && ListWrapper.equals(rr.args, r.args);
    }));
  }
  function _replaceIndices(r, selfIndex, indexMap) {
    var args = ListWrapper.map(r.args, (function(a) {
      return _map(indexMap, a);
    }));
    var contextIndex = _map(indexMap, r.contextIndex);
    return new ProtoRecord(r.mode, r.name, r.funcOrValue, args, r.fixedArgs, contextIndex, selfIndex, r.bindingMemento, r.directiveMemento, r.expressionAsString, r.lastInBinding, r.lastInDirective);
  }
  function _map(indexMap, value) {
    assert.argumentTypes(indexMap, Map, value, assert.type.number);
    var r = MapWrapper.get(indexMap, value);
    return isPresent(r) ? r : value;
  }
  $__export("coalesce", coalesce);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      ProtoRecord = $__m.ProtoRecord;
    }],
    execute: function() {
      Object.defineProperty(coalesce, "parameters", {get: function() {
          return [[assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(_selfRecord, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.number], [assert.type.number]];
        }});
      Object.defineProperty(_findMatching, "parameters", {get: function() {
          return [[ProtoRecord], [assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(_replaceIndices, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.number], [Map]];
        }});
      Object.defineProperty(_map, "parameters", {get: function() {
          return [[Map], [assert.type.number]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/pipes/array_changes", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang", "./pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/array_changes";
  var assert,
      isListLikeIterable,
      iterateListLike,
      ListWrapper,
      MapWrapper,
      int,
      isBlank,
      isPresent,
      stringify,
      getMapKey,
      looseIdentical,
      NO_CHANGE,
      Pipe,
      ArrayChangesFactory,
      ArrayChanges,
      CollectionChangeRecord,
      _DuplicateItemRecordList,
      _DuplicateMap;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isListLikeIterable = $__m.isListLikeIterable;
      iterateListLike = $__m.iterateListLike;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      stringify = $__m.stringify;
      getMapKey = $__m.getMapKey;
      looseIdentical = $__m.looseIdentical;
    }, function($__m) {
      NO_CHANGE = $__m.NO_CHANGE;
      Pipe = $__m.Pipe;
    }],
    execute: function() {
      ArrayChangesFactory = $__export("ArrayChangesFactory", (function() {
        var ArrayChangesFactory = function ArrayChangesFactory() {};
        return ($traceurRuntime.createClass)(ArrayChangesFactory, {
          supports: function(obj) {
            return assert.returnType((ArrayChanges.supportsObj(obj)), assert.type.boolean);
          },
          create: function() {
            return assert.returnType((new ArrayChanges()), Pipe);
          }
        }, {});
      }()));
      ArrayChanges = $__export("ArrayChanges", (function($__super) {
        var ArrayChanges = function ArrayChanges() {
          $traceurRuntime.superConstructor(ArrayChanges).call(this);
          this._collection = null;
          this._length = null;
          this._linkedRecords = null;
          this._unlinkedRecords = null;
          this._previousItHead = null;
          this._itHead = null;
          this._itTail = null;
          this._additionsHead = null;
          this._additionsTail = null;
          this._movesHead = null;
          this._movesTail = null;
          this._removalsHead = null;
          this._removalsTail = null;
        };
        return ($traceurRuntime.createClass)(ArrayChanges, {
          supports: function(obj) {
            return assert.returnType((ArrayChanges.supportsObj(obj)), assert.type.boolean);
          },
          get collection() {
            return this._collection;
          },
          get length() {
            return assert.returnType((this._length), int);
          },
          forEachItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._itHead; record !== null; record = record._next) {
              fn(record);
            }
          },
          forEachPreviousItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
              fn(record);
            }
          },
          forEachAddedItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              fn(record);
            }
          },
          forEachMovedItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._movesHead; record !== null; record = record._nextMoved) {
              fn(record);
            }
          },
          forEachRemovedItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              fn(record);
            }
          },
          transform: function(collection) {
            if (this.check(collection)) {
              return this;
            } else {
              return NO_CHANGE;
            }
          },
          check: function(collection) {
            var $__0 = this;
            this._reset();
            var record = assert.type(this._itHead, CollectionChangeRecord);
            var mayBeDirty = assert.type(false, assert.type.boolean);
            var index,
                item;
            if (ListWrapper.isList(collection)) {
              var list = collection;
              this._length = collection.length;
              for (index = 0; index < this._length; index++) {
                item = list[index];
                if (record === null || !looseIdentical(record.item, item)) {
                  record = this._mismatch(record, item, index);
                  mayBeDirty = true;
                } else if (mayBeDirty) {
                  record = this._verifyReinsertion(record, item, index);
                }
                record = record._next;
              }
            } else {
              index = 0;
              iterateListLike(collection, (function(item) {
                if (record === null || !looseIdentical(record.item, item)) {
                  record = $__0._mismatch(record, item, index);
                  mayBeDirty = true;
                } else if (mayBeDirty) {
                  record = $__0._verifyReinsertion(record, item, index);
                }
                record = record._next;
                index++;
              }));
              this._length = index;
            }
            this._truncate(record);
            this._collection = collection;
            return assert.returnType((this.isDirty), assert.type.boolean);
          },
          get isDirty() {
            return assert.returnType((this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null), assert.type.boolean);
          },
          _reset: function() {
            if (this.isDirty) {
              var record;
              var nextRecord;
              for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
              }
              for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                record.previousIndex = record.currentIndex;
              }
              this._additionsHead = this._additionsTail = null;
              for (record = this._movesHead; record !== null; record = nextRecord) {
                record.previousIndex = record.currentIndex;
                nextRecord = record._nextMoved;
              }
              this._movesHead = this._movesTail = null;
              this._removalsHead = this._removalsTail = null;
            }
          },
          _mismatch: function(record, item, index) {
            assert.argumentTypes(record, CollectionChangeRecord, item, assert.type.any, index, int);
            var previousRecord;
            if (record === null) {
              previousRecord = this._itTail;
            } else {
              previousRecord = record._prev;
              this._remove(record);
            }
            record = this._linkedRecords === null ? null : this._linkedRecords.get(item, index);
            if (record !== null) {
              this._moveAfter(record, previousRecord, index);
            } else {
              record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(item);
              if (record !== null) {
                this._reinsertAfter(record, previousRecord, index);
              } else {
                record = this._addAfter(new CollectionChangeRecord(item), previousRecord, index);
              }
            }
            return assert.returnType((record), CollectionChangeRecord);
          },
          _verifyReinsertion: function(record, item, index) {
            assert.argumentTypes(record, CollectionChangeRecord, item, assert.type.any, index, int);
            var reinsertRecord = assert.type(this._unlinkedRecords === null ? null : this._unlinkedRecords.get(item), CollectionChangeRecord);
            if (reinsertRecord !== null) {
              record = this._reinsertAfter(reinsertRecord, record._prev, index);
            } else if (record.currentIndex != index) {
              record.currentIndex = index;
              this._addToMoves(record, index);
            }
            return assert.returnType((record), CollectionChangeRecord);
          },
          _truncate: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            while (record !== null) {
              var nextRecord = assert.type(record._next, CollectionChangeRecord);
              this._addToRemovals(this._unlink(record));
              record = nextRecord;
            }
            if (this._unlinkedRecords !== null) {
              this._unlinkedRecords.clear();
            }
            if (this._additionsTail !== null) {
              this._additionsTail._nextAdded = null;
            }
            if (this._movesTail !== null) {
              this._movesTail._nextMoved = null;
            }
            if (this._itTail !== null) {
              this._itTail._next = null;
            }
            if (this._removalsTail !== null) {
              this._removalsTail._nextRemoved = null;
            }
          },
          _reinsertAfter: function(record, prevRecord, index) {
            assert.argumentTypes(record, CollectionChangeRecord, prevRecord, CollectionChangeRecord, index, int);
            if (this._unlinkedRecords !== null) {
              this._unlinkedRecords.remove(record);
            }
            var prev = record._prevRemoved;
            var next = record._nextRemoved;
            if (prev === null) {
              this._removalsHead = next;
            } else {
              prev._nextRemoved = next;
            }
            if (next === null) {
              this._removalsTail = prev;
            } else {
              next._prevRemoved = prev;
            }
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return assert.returnType((record), CollectionChangeRecord);
          },
          _moveAfter: function(record, prevRecord, index) {
            assert.argumentTypes(record, CollectionChangeRecord, prevRecord, CollectionChangeRecord, index, int);
            this._unlink(record);
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return assert.returnType((record), CollectionChangeRecord);
          },
          _addAfter: function(record, prevRecord, index) {
            assert.argumentTypes(record, CollectionChangeRecord, prevRecord, CollectionChangeRecord, index, int);
            this._insertAfter(record, prevRecord, index);
            if (this._additionsTail === null) {
              this._additionsTail = this._additionsHead = record;
            } else {
              this._additionsTail = this._additionsTail._nextAdded = record;
            }
            return assert.returnType((record), CollectionChangeRecord);
          },
          _insertAfter: function(record, prevRecord, index) {
            assert.argumentTypes(record, CollectionChangeRecord, prevRecord, CollectionChangeRecord, index, int);
            var next = assert.type(prevRecord === null ? this._itHead : prevRecord._next, CollectionChangeRecord);
            record._next = next;
            record._prev = prevRecord;
            if (next === null) {
              this._itTail = record;
            } else {
              next._prev = record;
            }
            if (prevRecord === null) {
              this._itHead = record;
            } else {
              prevRecord._next = record;
            }
            if (this._linkedRecords === null) {
              this._linkedRecords = new _DuplicateMap();
            }
            this._linkedRecords.put(record);
            record.currentIndex = index;
            return assert.returnType((record), CollectionChangeRecord);
          },
          _remove: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            return assert.returnType((this._addToRemovals(this._unlink(record))), CollectionChangeRecord);
          },
          _unlink: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            if (this._linkedRecords !== null) {
              this._linkedRecords.remove(record);
            }
            var prev = record._prev;
            var next = record._next;
            if (prev === null) {
              this._itHead = next;
            } else {
              prev._next = next;
            }
            if (next === null) {
              this._itTail = prev;
            } else {
              next._prev = prev;
            }
            return assert.returnType((record), CollectionChangeRecord);
          },
          _addToMoves: function(record, toIndex) {
            assert.argumentTypes(record, CollectionChangeRecord, toIndex, int);
            if (record.previousIndex === toIndex) {
              return assert.returnType((record), CollectionChangeRecord);
            }
            if (this._movesTail === null) {
              this._movesTail = this._movesHead = record;
            } else {
              this._movesTail = this._movesTail._nextMoved = record;
            }
            return assert.returnType((record), CollectionChangeRecord);
          },
          _addToRemovals: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            if (this._unlinkedRecords === null) {
              this._unlinkedRecords = new _DuplicateMap();
            }
            this._unlinkedRecords.put(record);
            record.currentIndex = null;
            record._nextRemoved = null;
            if (this._removalsTail === null) {
              this._removalsTail = this._removalsHead = record;
              record._prevRemoved = null;
            } else {
              record._prevRemoved = this._removalsTail;
              this._removalsTail = this._removalsTail._nextRemoved = record;
            }
            return assert.returnType((record), CollectionChangeRecord);
          },
          toString: function() {
            var record;
            var list = [];
            for (record = this._itHead; record !== null; record = record._next) {
              ListWrapper.push(list, record);
            }
            var previous = [];
            for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
              ListWrapper.push(previous, record);
            }
            var additions = [];
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              ListWrapper.push(additions, record);
            }
            var moves = [];
            for (record = this._movesHead; record !== null; record = record._nextMoved) {
              ListWrapper.push(moves, record);
            }
            var removals = [];
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              ListWrapper.push(removals, record);
            }
            return assert.returnType(("collection: " + list.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "moves: " + moves.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n"), assert.type.string);
          }
        }, {supportsObj: function(obj) {
            return assert.returnType((isListLikeIterable(obj)), assert.type.boolean);
          }}, $__super);
      }(Pipe)));
      Object.defineProperty(ArrayChanges.prototype.forEachItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(ArrayChanges.prototype.forEachPreviousItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(ArrayChanges.prototype.forEachAddedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(ArrayChanges.prototype.forEachMovedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(ArrayChanges.prototype.forEachRemovedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(ArrayChanges.prototype._mismatch, "parameters", {get: function() {
          return [[CollectionChangeRecord], [], [int]];
        }});
      Object.defineProperty(ArrayChanges.prototype._verifyReinsertion, "parameters", {get: function() {
          return [[CollectionChangeRecord], [], [int]];
        }});
      Object.defineProperty(ArrayChanges.prototype._truncate, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(ArrayChanges.prototype._reinsertAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(ArrayChanges.prototype._moveAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(ArrayChanges.prototype._addAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(ArrayChanges.prototype._insertAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(ArrayChanges.prototype._remove, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(ArrayChanges.prototype._unlink, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(ArrayChanges.prototype._addToMoves, "parameters", {get: function() {
          return [[CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(ArrayChanges.prototype._addToRemovals, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      CollectionChangeRecord = $__export("CollectionChangeRecord", (function() {
        var CollectionChangeRecord = function CollectionChangeRecord(item) {
          this.currentIndex = null;
          this.previousIndex = null;
          this.item = item;
          this._nextPrevious = null;
          this._prev = null;
          this._next = null;
          this._prevDup = null;
          this._nextDup = null;
          this._prevRemoved = null;
          this._nextRemoved = null;
          this._nextAdded = null;
          this._nextMoved = null;
        };
        return ($traceurRuntime.createClass)(CollectionChangeRecord, {toString: function() {
            return assert.returnType((this.previousIndex === this.currentIndex ? stringify(this.item) : stringify(this.item) + '[' + stringify(this.previousIndex) + '->' + stringify(this.currentIndex) + ']'), assert.type.string);
          }}, {});
      }()));
      _DuplicateItemRecordList = (function() {
        var _DuplicateItemRecordList = function _DuplicateItemRecordList() {
          this._head = null;
          this._tail = null;
        };
        return ($traceurRuntime.createClass)(_DuplicateItemRecordList, {
          add: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            if (this._head === null) {
              this._head = this._tail = record;
              record._nextDup = null;
              record._prevDup = null;
            } else {
              this._tail._nextDup = record;
              record._prevDup = this._tail;
              record._nextDup = null;
              this._tail = record;
            }
          },
          get: function(item, afterIndex) {
            assert.argumentTypes(item, assert.type.any, afterIndex, int);
            var record;
            for (record = this._head; record !== null; record = record._nextDup) {
              if ((afterIndex === null || afterIndex < record.currentIndex) && looseIdentical(record.item, item)) {
                return assert.returnType((record), CollectionChangeRecord);
              }
            }
            return assert.returnType((null), CollectionChangeRecord);
          },
          remove: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            var prev = assert.type(record._prevDup, CollectionChangeRecord);
            var next = assert.type(record._nextDup, CollectionChangeRecord);
            if (prev === null) {
              this._head = next;
            } else {
              prev._nextDup = next;
            }
            if (next === null) {
              this._tail = prev;
            } else {
              next._prevDup = prev;
            }
            return assert.returnType((this._head === null), assert.type.boolean);
          }
        }, {});
      }());
      Object.defineProperty(_DuplicateItemRecordList.prototype.add, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(_DuplicateItemRecordList.prototype.get, "parameters", {get: function() {
          return [[], [int]];
        }});
      Object.defineProperty(_DuplicateItemRecordList.prototype.remove, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      _DuplicateMap = (function() {
        var _DuplicateMap = function _DuplicateMap() {
          this.map = MapWrapper.create();
        };
        return ($traceurRuntime.createClass)(_DuplicateMap, {
          put: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            var key = getMapKey(record.item);
            var duplicates = MapWrapper.get(this.map, key);
            if (!isPresent(duplicates)) {
              duplicates = new _DuplicateItemRecordList();
              MapWrapper.set(this.map, key, duplicates);
            }
            duplicates.add(record);
          },
          get: function(value) {
            var afterIndex = arguments[1] !== (void 0) ? arguments[1] : null;
            var key = getMapKey(value);
            var recordList = MapWrapper.get(this.map, key);
            return assert.returnType((isBlank(recordList) ? null : recordList.get(value, afterIndex)), CollectionChangeRecord);
          },
          remove: function(record) {
            assert.argumentTypes(record, CollectionChangeRecord);
            var key = getMapKey(record.item);
            var recordList = assert.type(MapWrapper.get(this.map, key), _DuplicateItemRecordList);
            if (recordList.remove(record)) {
              MapWrapper.delete(this.map, key);
            }
            return assert.returnType((record), CollectionChangeRecord);
          },
          get isEmpty() {
            return assert.returnType((MapWrapper.size(this.map) === 0), assert.type.boolean);
          },
          clear: function() {
            MapWrapper.clear(this.map);
          },
          toString: function() {
            return assert.returnType(('_DuplicateMap(' + stringify(this.map) + ')'), assert.type.string);
          }
        }, {});
      }());
      Object.defineProperty(_DuplicateMap.prototype.put, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(_DuplicateMap.prototype.remove, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/pipes/keyvalue_changes", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang", "./pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/keyvalue_changes";
  var assert,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      stringify,
      looseIdentical,
      isJsObject,
      NO_CHANGE,
      Pipe,
      KeyValueChangesFactory,
      KeyValueChanges,
      KVChangeRecord;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      stringify = $__m.stringify;
      looseIdentical = $__m.looseIdentical;
      isJsObject = $__m.isJsObject;
    }, function($__m) {
      NO_CHANGE = $__m.NO_CHANGE;
      Pipe = $__m.Pipe;
    }],
    execute: function() {
      KeyValueChangesFactory = $__export("KeyValueChangesFactory", (function() {
        var KeyValueChangesFactory = function KeyValueChangesFactory() {};
        return ($traceurRuntime.createClass)(KeyValueChangesFactory, {
          supports: function(obj) {
            return assert.returnType((KeyValueChanges.supportsObj(obj)), assert.type.boolean);
          },
          create: function() {
            return assert.returnType((new KeyValueChanges()), Pipe);
          }
        }, {});
      }()));
      KeyValueChanges = $__export("KeyValueChanges", (function($__super) {
        var KeyValueChanges = function KeyValueChanges() {
          $traceurRuntime.superConstructor(KeyValueChanges).call(this);
          this._records = MapWrapper.create();
          this._mapHead = null;
          this._previousMapHead = null;
          this._changesHead = null;
          this._changesTail = null;
          this._additionsHead = null;
          this._additionsTail = null;
          this._removalsHead = null;
          this._removalsTail = null;
        };
        return ($traceurRuntime.createClass)(KeyValueChanges, {
          supports: function(obj) {
            return assert.returnType((KeyValueChanges.supportsObj(obj)), assert.type.boolean);
          },
          transform: function(map) {
            if (this.check(map)) {
              return this;
            } else {
              return NO_CHANGE;
            }
          },
          get isDirty() {
            return assert.returnType((this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null), assert.type.boolean);
          },
          forEachItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._mapHead; record !== null; record = record._next) {
              fn(record);
            }
          },
          forEachPreviousItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
              fn(record);
            }
          },
          forEachChangedItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
              fn(record);
            }
          },
          forEachAddedItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              fn(record);
            }
          },
          forEachRemovedItem: function(fn) {
            assert.argumentTypes(fn, Function);
            var record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              fn(record);
            }
          },
          check: function(map) {
            var $__0 = this;
            this._reset();
            var records = this._records;
            var oldSeqRecord = assert.type(this._mapHead, KVChangeRecord);
            var lastOldSeqRecord = assert.type(null, KVChangeRecord);
            var lastNewSeqRecord = assert.type(null, KVChangeRecord);
            var seqChanged = assert.type(false, assert.type.boolean);
            this._forEach(map, (function(value, key) {
              var newSeqRecord;
              if (oldSeqRecord !== null && key === oldSeqRecord.key) {
                newSeqRecord = oldSeqRecord;
                if (!looseIdentical(value, oldSeqRecord._currentValue)) {
                  oldSeqRecord._previousValue = oldSeqRecord._currentValue;
                  oldSeqRecord._currentValue = value;
                  $__0._addToChanges(oldSeqRecord);
                }
              } else {
                seqChanged = true;
                if (oldSeqRecord !== null) {
                  oldSeqRecord._next = null;
                  $__0._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                  $__0._addToRemovals(oldSeqRecord);
                }
                if (MapWrapper.contains(records, key)) {
                  newSeqRecord = MapWrapper.get(records, key);
                } else {
                  newSeqRecord = new KVChangeRecord(key);
                  MapWrapper.set(records, key, newSeqRecord);
                  newSeqRecord._currentValue = value;
                  $__0._addToAdditions(newSeqRecord);
                }
              }
              if (seqChanged) {
                if ($__0._isInRemovals(newSeqRecord)) {
                  $__0._removeFromRemovals(newSeqRecord);
                }
                if (lastNewSeqRecord == null) {
                  $__0._mapHead = newSeqRecord;
                } else {
                  lastNewSeqRecord._next = newSeqRecord;
                }
              }
              lastOldSeqRecord = oldSeqRecord;
              lastNewSeqRecord = newSeqRecord;
              oldSeqRecord = oldSeqRecord === null ? null : oldSeqRecord._next;
            }));
            this._truncate(lastOldSeqRecord, oldSeqRecord);
            return assert.returnType((this.isDirty), assert.type.boolean);
          },
          _reset: function() {
            if (this.isDirty) {
              var record;
              for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
              }
              for (record = this._changesHead; record !== null; record = record._nextChanged) {
                record._previousValue = record._currentValue;
              }
              for (record = this._additionsHead; record != null; record = record._nextAdded) {
                record._previousValue = record._currentValue;
              }
              this._changesHead = this._changesTail = null;
              this._additionsHead = this._additionsTail = null;
              this._removalsHead = this._removalsTail = null;
            }
          },
          _truncate: function(lastRecord, record) {
            assert.argumentTypes(lastRecord, KVChangeRecord, record, KVChangeRecord);
            while (record !== null) {
              if (lastRecord === null) {
                this._mapHead = null;
              } else {
                lastRecord._next = null;
              }
              var nextRecord = record._next;
              this._addToRemovals(record);
              lastRecord = record;
              record = nextRecord;
            }
            for (var rec = assert.type(this._removalsHead, KVChangeRecord); rec !== null; rec = rec._nextRemoved) {
              rec._previousValue = rec._currentValue;
              rec._currentValue = null;
              MapWrapper.delete(this._records, rec.key);
            }
          },
          _isInRemovals: function(record) {
            assert.argumentTypes(record, KVChangeRecord);
            return record === this._removalsHead || record._nextRemoved !== null || record._prevRemoved !== null;
          },
          _addToRemovals: function(record) {
            assert.argumentTypes(record, KVChangeRecord);
            if (this._removalsHead === null) {
              this._removalsHead = this._removalsTail = record;
            } else {
              this._removalsTail._nextRemoved = record;
              record._prevRemoved = this._removalsTail;
              this._removalsTail = record;
            }
          },
          _removeFromSeq: function(prev, record) {
            assert.argumentTypes(prev, KVChangeRecord, record, KVChangeRecord);
            var next = record._next;
            if (prev === null) {
              this._mapHead = next;
            } else {
              prev._next = next;
            }
          },
          _removeFromRemovals: function(record) {
            assert.argumentTypes(record, KVChangeRecord);
            var prev = record._prevRemoved;
            var next = record._nextRemoved;
            if (prev === null) {
              this._removalsHead = next;
            } else {
              prev._nextRemoved = next;
            }
            if (next === null) {
              this._removalsTail = prev;
            } else {
              next._prevRemoved = prev;
            }
            record._prevRemoved = record._nextRemoved = null;
          },
          _addToAdditions: function(record) {
            assert.argumentTypes(record, KVChangeRecord);
            if (this._additionsHead === null) {
              this._additionsHead = this._additionsTail = record;
            } else {
              this._additionsTail._nextAdded = record;
              this._additionsTail = record;
            }
          },
          _addToChanges: function(record) {
            assert.argumentTypes(record, KVChangeRecord);
            if (this._changesHead === null) {
              this._changesHead = this._changesTail = record;
            } else {
              this._changesTail._nextChanged = record;
              this._changesTail = record;
            }
          },
          toString: function() {
            var items = [];
            var previous = [];
            var changes = [];
            var additions = [];
            var removals = [];
            var record;
            for (record = this._mapHead; record !== null; record = record._next) {
              ListWrapper.push(items, stringify(record));
            }
            for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
              ListWrapper.push(previous, stringify(record));
            }
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
              ListWrapper.push(changes, stringify(record));
            }
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              ListWrapper.push(additions, stringify(record));
            }
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              ListWrapper.push(removals, stringify(record));
            }
            return assert.returnType(("map: " + items.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "changes: " + changes.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n"), assert.type.string);
          },
          _forEach: function(obj, fn) {
            assert.argumentTypes(obj, assert.type.any, fn, Function);
            if (obj instanceof Map) {
              MapWrapper.forEach(obj, fn);
            } else {
              StringMapWrapper.forEach(obj, fn);
            }
          }
        }, {supportsObj: function(obj) {
            return assert.returnType((obj instanceof Map || isJsObject(obj)), assert.type.boolean);
          }}, $__super);
      }(Pipe)));
      Object.defineProperty(KeyValueChanges.prototype.forEachItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachPreviousItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachChangedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachAddedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachRemovedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._truncate, "parameters", {get: function() {
          return [[KVChangeRecord], [KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._isInRemovals, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._addToRemovals, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._removeFromSeq, "parameters", {get: function() {
          return [[KVChangeRecord], [KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._removeFromRemovals, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._addToAdditions, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._addToChanges, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._forEach, "parameters", {get: function() {
          return [[], [Function]];
        }});
      KVChangeRecord = $__export("KVChangeRecord", (function() {
        var KVChangeRecord = function KVChangeRecord(key) {
          this.key = key;
          this._previousValue = null;
          this._currentValue = null;
          this._nextPrevious = null;
          this._next = null;
          this._nextAdded = null;
          this._nextRemoved = null;
          this._prevRemoved = null;
          this._nextChanged = null;
        };
        return ($traceurRuntime.createClass)(KVChangeRecord, {toString: function() {
            return assert.returnType((looseIdentical(this._previousValue, this._currentValue) ? stringify(this.key) : (stringify(this.key) + '[' + stringify(this._previousValue) + '->' + stringify(this._currentValue) + ']')), assert.type.string);
          }}, {});
      }()));
    }
  };
});



System.register("angular2/src/change_detection/pipes/null_pipe", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "./pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/null_pipe";
  var assert,
      isBlank,
      Pipe,
      NO_CHANGE,
      NullPipeFactory,
      NullPipe;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isBlank = $__m.isBlank;
    }, function($__m) {
      Pipe = $__m.Pipe;
      NO_CHANGE = $__m.NO_CHANGE;
    }],
    execute: function() {
      NullPipeFactory = $__export("NullPipeFactory", (function() {
        var NullPipeFactory = function NullPipeFactory() {};
        return ($traceurRuntime.createClass)(NullPipeFactory, {
          supports: function(obj) {
            return assert.returnType((NullPipe.supportsObj(obj)), assert.type.boolean);
          },
          create: function() {
            return assert.returnType((new NullPipe()), Pipe);
          }
        }, {});
      }()));
      NullPipe = $__export("NullPipe", (function($__super) {
        var NullPipe = function NullPipe() {
          $traceurRuntime.superConstructor(NullPipe).call(this);
          this.called = false;
        };
        return ($traceurRuntime.createClass)(NullPipe, {
          supports: function(obj) {
            return NullPipe.supportsObj(obj);
          },
          transform: function(value) {
            if (!this.called) {
              this.called = true;
              return null;
            } else {
              return NO_CHANGE;
            }
          }
        }, {supportsObj: function(obj) {
            return assert.returnType((isBlank(obj)), assert.type.boolean);
          }}, $__super);
      }(Pipe)));
    }
  };
});



System.register("angular2/src/core/annotations/annotations", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/annotations";
  var assert,
      ABSTRACT,
      CONST,
      normalizeBlank,
      isPresent,
      ListWrapper,
      List,
      Directive,
      Component,
      Decorator,
      Viewport,
      onDestroy,
      onChange;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      CONST = $__m.CONST;
      normalizeBlank = $__m.normalizeBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }],
    execute: function() {
      Directive = $__export("Directive", (function() {
        var Directive = function Directive() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              bind = $__1.bind,
              events = $__1.events,
              implementsTypes = $__1.implementsTypes,
              lifecycle = $__1.lifecycle;
          this.selector = selector;
          this.implementsTypes = implementsTypes;
          this.bind = bind;
          this.events = events;
          this.lifecycle = lifecycle;
        };
        return ($traceurRuntime.createClass)(Directive, {hasLifecycleHook: function(hook) {
            assert.argumentTypes(hook, assert.type.string);
            return assert.returnType((isPresent(this.lifecycle) ? ListWrapper.contains(this.lifecycle, hook) : false), assert.type.boolean);
          }}, {});
      }()));
      Object.defineProperty(Directive, "annotations", {get: function() {
          return [new ABSTRACT(), new CONST()];
        }});
      Object.defineProperty(Directive.prototype.hasLifecycleHook, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Component = $__export("Component", (function($__super) {
        var Component = function Component() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              bind = $__1.bind,
              events = $__1.events,
              services = $__1.services,
              implementsTypes = $__1.implementsTypes,
              lifecycle = $__1.lifecycle;
          $traceurRuntime.superConstructor(Component).call(this, {
            selector: selector,
            bind: bind,
            events: events,
            implementsTypes: implementsTypes,
            lifecycle: lifecycle
          });
          this.services = services;
        };
        return ($traceurRuntime.createClass)(Component, {}, {}, $__super);
      }(Directive)));
      Object.defineProperty(Component, "annotations", {get: function() {
          return [new CONST()];
        }});
      Decorator = $__export("Decorator", (function($__super) {
        var Decorator = function Decorator() {
          var $__2;
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              bind = $__1.bind,
              events = $__1.events,
              implementsTypes = $__1.implementsTypes,
              lifecycle = $__1.lifecycle,
              compileChildren = ($__2 = $__1.compileChildren) === void 0 ? true : $__2;
          this.compileChildren = compileChildren;
          $traceurRuntime.superConstructor(Decorator).call(this, {
            selector: selector,
            bind: bind,
            events: events,
            implementsTypes: implementsTypes,
            lifecycle: lifecycle
          });
        };
        return ($traceurRuntime.createClass)(Decorator, {}, {}, $__super);
      }(Directive)));
      Object.defineProperty(Decorator, "annotations", {get: function() {
          return [new CONST()];
        }});
      Viewport = $__export("Viewport", (function($__super) {
        var Viewport = function Viewport() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              bind = $__1.bind,
              events = $__1.events,
              implementsTypes = $__1.implementsTypes,
              lifecycle = $__1.lifecycle;
          $traceurRuntime.superConstructor(Viewport).call(this, {
            selector: selector,
            bind: bind,
            events: events,
            implementsTypes: implementsTypes,
            lifecycle: lifecycle
          });
        };
        return ($traceurRuntime.createClass)(Viewport, {}, {}, $__super);
      }(Directive)));
      Object.defineProperty(Viewport, "annotations", {get: function() {
          return [new CONST()];
        }});
      onDestroy = $__export("onDestroy", "onDestroy");
      onChange = $__export("onChange", "onChange");
    }
  };
});



System.register("angular2/src/di/annotations", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/annotations";
  var CONST,
      Inject,
      InjectPromise,
      InjectLazy,
      Optional,
      DependencyAnnotation;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
    }],
    execute: function() {
      Inject = $__export("Inject", (function() {
        var Inject = function Inject(token) {
          this.token = token;
        };
        return ($traceurRuntime.createClass)(Inject, {}, {});
      }()));
      Object.defineProperty(Inject, "annotations", {get: function() {
          return [new CONST()];
        }});
      InjectPromise = $__export("InjectPromise", (function() {
        var InjectPromise = function InjectPromise(token) {
          this.token = token;
        };
        return ($traceurRuntime.createClass)(InjectPromise, {}, {});
      }()));
      Object.defineProperty(InjectPromise, "annotations", {get: function() {
          return [new CONST()];
        }});
      InjectLazy = $__export("InjectLazy", (function() {
        var InjectLazy = function InjectLazy(token) {
          this.token = token;
        };
        return ($traceurRuntime.createClass)(InjectLazy, {}, {});
      }()));
      Object.defineProperty(InjectLazy, "annotations", {get: function() {
          return [new CONST()];
        }});
      Optional = $__export("Optional", (function() {
        var Optional = function Optional() {};
        return ($traceurRuntime.createClass)(Optional, {}, {});
      }()));
      Object.defineProperty(Optional, "annotations", {get: function() {
          return [new CONST()];
        }});
      DependencyAnnotation = $__export("DependencyAnnotation", (function() {
        var DependencyAnnotation = function DependencyAnnotation() {};
        return ($traceurRuntime.createClass)(DependencyAnnotation, {}, {});
      }()));
      Object.defineProperty(DependencyAnnotation, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});



System.register("angular2/src/di/exceptions", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/exceptions";
  var assert,
      ListWrapper,
      List,
      stringify,
      KeyMetadataError,
      ProviderError,
      NoProviderError,
      AsyncBindingError,
      CyclicDependencyError,
      InstantiationError,
      InvalidBindingError,
      NoAnnotationError;
  function findFirstClosedCycle(keys) {
    assert.argumentTypes(keys, List);
    var res = [];
    for (var i = 0; i < keys.length; ++i) {
      if (ListWrapper.contains(res, keys[i])) {
        ListWrapper.push(res, keys[i]);
        return res;
      } else {
        ListWrapper.push(res, keys[i]);
      }
    }
    return res;
  }
  function constructResolvingPath(keys) {
    if (keys.length > 1) {
      var reversed = findFirstClosedCycle(ListWrapper.reversed(keys));
      var tokenStrs = ListWrapper.map(reversed, (function(k) {
        return stringify(k.token);
      }));
      return " (" + tokenStrs.join(' -> ') + ")";
    } else {
      return "";
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }, function($__m) {
      stringify = $__m.stringify;
    }],
    execute: function() {
      Object.defineProperty(findFirstClosedCycle, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(constructResolvingPath, "parameters", {get: function() {
          return [[List]];
        }});
      KeyMetadataError = $__export("KeyMetadataError", (function($__super) {
        var KeyMetadataError = function KeyMetadataError() {
          $traceurRuntime.superConstructor(KeyMetadataError).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(KeyMetadataError, {}, {}, $__super);
      }(Error)));
      ProviderError = $__export("ProviderError", (function($__super) {
        var ProviderError = function ProviderError(key, constructResolvingMessage) {
          assert.argumentTypes(key, assert.type.any, constructResolvingMessage, Function);
          $traceurRuntime.superConstructor(ProviderError).call(this);
          this.keys = [key];
          this.constructResolvingMessage = constructResolvingMessage;
          this.message = this.constructResolvingMessage(this.keys);
        };
        return ($traceurRuntime.createClass)(ProviderError, {
          addKey: function(key) {
            ListWrapper.push(this.keys, key);
            this.message = this.constructResolvingMessage(this.keys);
          },
          toString: function() {
            return this.message;
          }
        }, {}, $__super);
      }(Error)));
      Object.defineProperty(ProviderError, "parameters", {get: function() {
          return [[], [Function]];
        }});
      NoProviderError = $__export("NoProviderError", (function($__super) {
        var NoProviderError = function NoProviderError(key) {
          $traceurRuntime.superConstructor(NoProviderError).call(this, key, function(keys) {
            assert.argumentTypes(keys, List);
            var first = stringify(ListWrapper.first(keys).token);
            return ("No provider for " + first + "!" + constructResolvingPath(keys));
          });
        };
        return ($traceurRuntime.createClass)(NoProviderError, {}, {}, $__super);
      }(ProviderError)));
      AsyncBindingError = $__export("AsyncBindingError", (function($__super) {
        var AsyncBindingError = function AsyncBindingError(key) {
          $traceurRuntime.superConstructor(AsyncBindingError).call(this, key, function(keys) {
            assert.argumentTypes(keys, List);
            var first = stringify(ListWrapper.first(keys).token);
            return ("Cannot instantiate " + first + " synchronously. ") + ("It is provided as a promise!" + constructResolvingPath(keys));
          });
        };
        return ($traceurRuntime.createClass)(AsyncBindingError, {}, {}, $__super);
      }(ProviderError)));
      CyclicDependencyError = $__export("CyclicDependencyError", (function($__super) {
        var CyclicDependencyError = function CyclicDependencyError(key) {
          $traceurRuntime.superConstructor(CyclicDependencyError).call(this, key, function(keys) {
            assert.argumentTypes(keys, List);
            return ("Cannot instantiate cyclic dependency!" + constructResolvingPath(keys));
          });
        };
        return ($traceurRuntime.createClass)(CyclicDependencyError, {}, {}, $__super);
      }(ProviderError)));
      InstantiationError = $__export("InstantiationError", (function($__super) {
        var InstantiationError = function InstantiationError(originalException, key) {
          $traceurRuntime.superConstructor(InstantiationError).call(this, key, function(keys) {
            assert.argumentTypes(keys, List);
            var first = stringify(ListWrapper.first(keys).token);
            return ("Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".") + (" ORIGINAL ERROR: " + originalException);
          });
        };
        return ($traceurRuntime.createClass)(InstantiationError, {}, {}, $__super);
      }(ProviderError)));
      InvalidBindingError = $__export("InvalidBindingError", (function($__super) {
        var InvalidBindingError = function InvalidBindingError(binding) {
          $traceurRuntime.superConstructor(InvalidBindingError).call(this);
          this.message = ("Invalid binding " + binding);
        };
        return ($traceurRuntime.createClass)(InvalidBindingError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error)));
      NoAnnotationError = $__export("NoAnnotationError", (function($__super) {
        var NoAnnotationError = function NoAnnotationError(typeOrFunc) {
          $traceurRuntime.superConstructor(NoAnnotationError).call(this);
          this.message = ("Cannot resolve all parameters for " + stringify(typeOrFunc));
        };
        return ($traceurRuntime.createClass)(NoAnnotationError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error)));
    }
  };
});



System.register("angular2/src/facade/async", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/async";
  var assert,
      int,
      global,
      List,
      Promise,
      PromiseWrapper;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      int = $__m.int;
      global = $__m.global;
    }, function($__m) {
      List = $__m.List;
    }],
    execute: function() {
      Promise = $__export("Promise", global.Promise);
      PromiseWrapper = $__export("PromiseWrapper", (function() {
        var PromiseWrapper = function PromiseWrapper() {};
        return ($traceurRuntime.createClass)(PromiseWrapper, {}, {
          resolve: function(obj) {
            return assert.returnType((Promise.resolve(obj)), Promise);
          },
          reject: function(obj) {
            return assert.returnType((Promise.reject(obj)), Promise);
          },
          catchError: function(promise, onError) {
            assert.argumentTypes(promise, Promise, onError, Function);
            return assert.returnType((promise.catch(onError)), Promise);
          },
          all: function(promises) {
            assert.argumentTypes(promises, List);
            if (promises.length == 0)
              return assert.returnType((Promise.resolve([])), Promise);
            return assert.returnType((Promise.all(promises)), Promise);
          },
          then: function(promise, success, rejection) {
            assert.argumentTypes(promise, Promise, success, Function, rejection, Function);
            return assert.returnType((promise.then(success, rejection)), Promise);
          },
          completer: function() {
            var resolve;
            var reject;
            var p = new Promise(function(res, rej) {
              resolve = res;
              reject = rej;
            });
            return {
              promise: p,
              resolve: resolve,
              reject: reject
            };
          },
          setTimeout: function(fn, millis) {
            assert.argumentTypes(fn, Function, millis, int);
            global.setTimeout(fn, millis);
          },
          isPromise: function(maybePromise) {
            return assert.returnType((maybePromise instanceof Promise), assert.type.boolean);
          }
        });
      }()));
      Object.defineProperty(PromiseWrapper.catchError, "parameters", {get: function() {
          return [[Promise], [Function]];
        }});
      Object.defineProperty(PromiseWrapper.all, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(PromiseWrapper.then, "parameters", {get: function() {
          return [[Promise], [Function], [Function]];
        }});
      Object.defineProperty(PromiseWrapper.setTimeout, "parameters", {get: function() {
          return [[Function], [int]];
        }});
    }
  };
});



System.register("angular2/src/di/opaque_token", ["rtts_assert/rtts_assert"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/opaque_token";
  var assert,
      OpaqueToken;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }],
    execute: function() {
      OpaqueToken = $__export("OpaqueToken", (function() {
        var OpaqueToken = function OpaqueToken(desc) {
          assert.argumentTypes(desc, assert.type.string);
          this._desc = ("Token(" + desc + ")");
        };
        return ($traceurRuntime.createClass)(OpaqueToken, {toString: function() {
            return this._desc;
          }}, {});
      }()));
      Object.defineProperty(OpaqueToken, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/interfaces", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/interfaces";
  var OnChange;
  return {
    setters: [],
    execute: function() {
      OnChange = $__export("OnChange", (function() {
        var OnChange = function OnChange() {};
        return ($traceurRuntime.createClass)(OnChange, {onChange: function(changes) {
            throw "OnChange.onChange is not implemented";
          }}, {});
      }()));
    }
  };
});



System.register("angular2/src/core/annotations/template", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/template";
  var ABSTRACT,
      CONST,
      Type,
      Template;
  return {
    setters: [function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      CONST = $__m.CONST;
      Type = $__m.Type;
    }],
    execute: function() {
      Template = $__export("Template", (function() {
        var Template = function Template($__1) {
          var $__2 = $__1,
              url = $__2.url,
              inline = $__2.inline,
              directives = $__2.directives,
              formatters = $__2.formatters,
              source = $__2.source,
              locale = $__2.locale,
              device = $__2.device;
          this.url = url;
          this.inline = inline;
          this.directives = directives;
          this.formatters = formatters;
          this.source = source;
          this.locale = locale;
          this.device = device;
        };
        return ($traceurRuntime.createClass)(Template, {}, {});
      }()));
      Object.defineProperty(Template, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});



System.register("angular2/src/dom/dom_adapter", ["rtts_assert/rtts_assert", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/dom/dom_adapter";
  var assert,
      ABSTRACT,
      BaseException,
      DOM,
      DomAdapter;
  function setRootDomAdapter(adapter) {
    assert.argumentTypes(adapter, DomAdapter);
    $__export("DOM", DOM = adapter);
  }
  function _abstract() {
    return new BaseException('This method is abstract');
  }
  $__export("setRootDomAdapter", setRootDomAdapter);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      DOM = $__export("DOM", DOM);
      Object.defineProperty(setRootDomAdapter, "parameters", {get: function() {
          return [[DomAdapter]];
        }});
      DomAdapter = $__export("DomAdapter", (function() {
        var DomAdapter = function DomAdapter() {};
        return ($traceurRuntime.createClass)(DomAdapter, {
          get attrToPropMap() {
            throw _abstract();
          },
          parse: function(templateHtml) {
            assert.argumentTypes(templateHtml, assert.type.string);
            throw _abstract();
          },
          query: function(selector) {
            assert.argumentTypes(selector, assert.type.string);
            throw _abstract();
          },
          querySelector: function(el, selector) {
            assert.argumentTypes(el, assert.type.any, selector, assert.type.string);
            throw _abstract();
          },
          querySelectorAll: function(el, selector) {
            assert.argumentTypes(el, assert.type.any, selector, assert.type.string);
            throw _abstract();
          },
          on: function(el, evt, listener) {
            throw _abstract();
          },
          dispatchEvent: function(el, evt) {
            throw _abstract();
          },
          createMouseEvent: function(eventType) {
            throw _abstract();
          },
          createEvent: function(eventType) {
            throw _abstract();
          },
          getInnerHTML: function(el) {
            throw _abstract();
          },
          getOuterHTML: function(el) {
            throw _abstract();
          },
          nodeName: function(node) {
            throw _abstract();
          },
          nodeValue: function(node) {
            throw _abstract();
          },
          type: function(node) {
            throw _abstract();
          },
          content: function(node) {
            throw _abstract();
          },
          firstChild: function(el) {
            throw _abstract();
          },
          nextSibling: function(el) {
            throw _abstract();
          },
          parentElement: function(el) {
            throw _abstract();
          },
          childNodes: function(el) {
            throw _abstract();
          },
          childNodesAsList: function(el) {
            throw _abstract();
          },
          clearNodes: function(el) {
            throw _abstract();
          },
          appendChild: function(el, node) {
            throw _abstract();
          },
          removeChild: function(el, node) {
            throw _abstract();
          },
          remove: function(el) {
            throw _abstract();
          },
          insertBefore: function(el, node) {
            throw _abstract();
          },
          insertAllBefore: function(el, nodes) {
            throw _abstract();
          },
          insertAfter: function(el, node) {
            throw _abstract();
          },
          setInnerHTML: function(el, value) {
            throw _abstract();
          },
          getText: function(el) {
            throw _abstract();
          },
          setText: function(el, value) {
            assert.argumentTypes(el, assert.type.any, value, assert.type.string);
            throw _abstract();
          },
          getValue: function(el) {
            throw _abstract();
          },
          setValue: function(el, value) {
            assert.argumentTypes(el, assert.type.any, value, assert.type.string);
            throw _abstract();
          },
          getChecked: function(el) {
            throw _abstract();
          },
          setChecked: function(el, value) {
            assert.argumentTypes(el, assert.type.any, value, assert.type.boolean);
            throw _abstract();
          },
          createTemplate: function(html) {
            throw _abstract();
          },
          createElement: function(tagName) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : null;
            throw _abstract();
          },
          createTextNode: function(text) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : null;
            assert.argumentTypes(text, assert.type.string, doc, assert.type.any);
            throw _abstract();
          },
          createScriptTag: function(attrName, attrValue) {
            var doc = arguments[2] !== (void 0) ? arguments[2] : null;
            assert.argumentTypes(attrName, assert.type.string, attrValue, assert.type.string, doc, assert.type.any);
            throw _abstract();
          },
          createStyleElement: function(css) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : null;
            assert.argumentTypes(css, assert.type.string, doc, assert.type.any);
            throw _abstract();
          },
          createShadowRoot: function(el) {
            throw _abstract();
          },
          getShadowRoot: function(el) {
            throw _abstract();
          },
          clone: function(node) {
            throw _abstract();
          },
          hasProperty: function(element, name) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string);
            throw _abstract();
          },
          getElementsByClassName: function(element, name) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string);
            throw _abstract();
          },
          getElementsByTagName: function(element, name) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string);
            throw _abstract();
          },
          classList: function(element) {
            throw _abstract();
          },
          addClass: function(element, classname) {
            assert.argumentTypes(element, assert.type.any, classname, assert.type.string);
            throw _abstract();
          },
          removeClass: function(element, classname) {
            assert.argumentTypes(element, assert.type.any, classname, assert.type.string);
            throw _abstract();
          },
          hasClass: function(element, classname) {
            assert.argumentTypes(element, assert.type.any, classname, assert.type.string);
            throw _abstract();
          },
          setStyle: function(element, stylename, stylevalue) {
            assert.argumentTypes(element, assert.type.any, stylename, assert.type.string, stylevalue, assert.type.string);
            throw _abstract();
          },
          removeStyle: function(element, stylename) {
            assert.argumentTypes(element, assert.type.any, stylename, assert.type.string);
            throw _abstract();
          },
          getStyle: function(element, stylename) {
            assert.argumentTypes(element, assert.type.any, stylename, assert.type.string);
            throw _abstract();
          },
          tagName: function(element) {
            throw _abstract();
          },
          attributeMap: function(element) {
            throw _abstract();
          },
          getAttribute: function(element, attribute) {
            assert.argumentTypes(element, assert.type.any, attribute, assert.type.string);
            throw _abstract();
          },
          setAttribute: function(element, name, value) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string, value, assert.type.string);
            throw _abstract();
          },
          removeAttribute: function(element, attribute) {
            assert.argumentTypes(element, assert.type.any, attribute, assert.type.string);
            throw _abstract();
          },
          templateAwareRoot: function(el) {
            throw _abstract();
          },
          createHtmlDocument: function() {
            throw _abstract();
          },
          defaultDoc: function() {
            throw _abstract();
          },
          getTitle: function() {
            throw _abstract();
          },
          setTitle: function(newTitle) {
            assert.argumentTypes(newTitle, assert.type.string);
            throw _abstract();
          },
          elementMatches: function(n, selector) {
            assert.argumentTypes(n, assert.type.any, selector, assert.type.string);
            throw _abstract();
          },
          isTemplateElement: function(el) {
            assert.argumentTypes(el, assert.type.any);
            throw _abstract();
          },
          isTextNode: function(node) {
            throw _abstract();
          },
          isCommentNode: function(node) {
            throw _abstract();
          },
          isElementNode: function(node) {
            throw _abstract();
          },
          hasShadowRoot: function(node) {
            throw _abstract();
          },
          importIntoDoc: function(node) {
            throw _abstract();
          },
          isPageRule: function(rule) {
            throw _abstract();
          },
          isStyleRule: function(rule) {
            throw _abstract();
          },
          isMediaRule: function(rule) {
            throw _abstract();
          },
          isKeyframesRule: function(rule) {
            throw _abstract();
          },
          getHref: function(element) {
            throw _abstract();
          },
          resolveAndSetHref: function(element, baseUrl, href) {
            assert.argumentTypes(element, assert.type.any, baseUrl, assert.type.string, href, assert.type.string);
            throw _abstract();
          },
          cssToRules: function(css) {
            assert.argumentTypes(css, assert.type.string);
            throw _abstract();
          }
        }, {});
      }()));
      Object.defineProperty(DomAdapter, "annotations", {get: function() {
          return [new ABSTRACT()];
        }});
      Object.defineProperty(DomAdapter.prototype.parse, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.query, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.querySelector, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.querySelectorAll, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setText, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setValue, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setChecked, "parameters", {get: function() {
          return [[], [assert.type.boolean]];
        }});
      Object.defineProperty(DomAdapter.prototype.createTextNode, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(DomAdapter.prototype.createScriptTag, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
      Object.defineProperty(DomAdapter.prototype.createStyleElement, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(DomAdapter.prototype.hasProperty, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getElementsByClassName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getElementsByTagName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.addClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.removeClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.hasClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setStyle, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.removeStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setAttribute, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.removeAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setTitle, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.elementMatches, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.isTemplateElement, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(DomAdapter.prototype.resolveAndSetHref, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.cssToRules, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/dom/generic_browser_adapter", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./dom_adapter"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/dom/generic_browser_adapter";
  var assert,
      ABSTRACT,
      List,
      ListWrapper,
      isPresent,
      DomAdapter,
      GenericBrowserDomAdapter;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      DomAdapter = $__m.DomAdapter;
    }],
    execute: function() {
      GenericBrowserDomAdapter = $__export("GenericBrowserDomAdapter", (function($__super) {
        var GenericBrowserDomAdapter = function GenericBrowserDomAdapter() {
          $traceurRuntime.superConstructor(GenericBrowserDomAdapter).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(GenericBrowserDomAdapter, {
          resolveAndSetHref: function(el, baseUrl, href) {
            assert.argumentTypes(el, assert.type.any, baseUrl, assert.type.string, href, assert.type.string);
            el.href = href == null ? baseUrl : baseUrl + '/../' + href;
          },
          cssToRules: function(css) {
            assert.argumentTypes(css, assert.type.string);
            var style = this.createStyleElement(css);
            this.appendChild(this.defaultDoc().head, style);
            var rules = ListWrapper.create();
            if (isPresent(style.sheet)) {
              try {
                var rawRules = style.sheet.cssRules;
                rules = ListWrapper.createFixedSize(rawRules.length);
                for (var i = 0; i < rawRules.length; i++) {
                  rules[i] = rawRules[i];
                }
              } catch (e) {}
            } else {}
            this.remove(style);
            return assert.returnType((rules), List);
          }
        }, {}, $__super);
      }(DomAdapter)));
      Object.defineProperty(GenericBrowserDomAdapter, "annotations", {get: function() {
          return [new ABSTRACT()];
        }});
      Object.defineProperty(GenericBrowserDomAdapter.prototype.resolveAndSetHref, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(GenericBrowserDomAdapter.prototype.cssToRules, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/directive_metadata", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/core/annotations/annotations"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/directive_metadata";
  var assert,
      Type,
      Directive,
      DirectiveMetadata;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
    }, function($__m) {
      Directive = $__m.Directive;
    }],
    execute: function() {
      DirectiveMetadata = $__export("DirectiveMetadata", (function() {
        var DirectiveMetadata = function DirectiveMetadata(type, annotation) {
          assert.argumentTypes(type, Type, annotation, Directive);
          this.annotation = annotation;
          this.type = type;
        };
        return ($traceurRuntime.createClass)(DirectiveMetadata, {}, {});
      }()));
      Object.defineProperty(DirectiveMetadata, "parameters", {get: function() {
          return [[Type], [Directive]];
        }});
    }
  };
});



System.register("angular2/src/facade/math", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/math";
  var global,
      Math,
      NaN;
  return {
    setters: [function($__m) {
      global = $__m.global;
    }],
    execute: function() {
      Math = $__export("Math", global.Math);
      NaN = $__export("NaN", global.NaN);
    }
  };
});



System.register("angular2/src/core/annotations/di", ["angular2/src/facade/lang", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/di";
  var CONST,
      DependencyAnnotation,
      EventEmitter,
      PropertySetter;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
    }, function($__m) {
      DependencyAnnotation = $__m.DependencyAnnotation;
    }],
    execute: function() {
      EventEmitter = $__export("EventEmitter", (function($__super) {
        var EventEmitter = function EventEmitter(eventName) {
          $traceurRuntime.superConstructor(EventEmitter).call(this);
          this.eventName = eventName;
        };
        return ($traceurRuntime.createClass)(EventEmitter, {}, {}, $__super);
      }(DependencyAnnotation)));
      Object.defineProperty(EventEmitter, "annotations", {get: function() {
          return [new CONST()];
        }});
      PropertySetter = $__export("PropertySetter", (function($__super) {
        var PropertySetter = function PropertySetter(propName) {
          $traceurRuntime.superConstructor(PropertySetter).call(this);
          this.propName = propName;
        };
        return ($traceurRuntime.createClass)(PropertySetter, {}, {}, $__super);
      }(DependencyAnnotation)));
      Object.defineProperty(PropertySetter, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});



System.register("angular2/src/core/zone/vm_turn_zone", ["angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/zone/vm_turn_zone";
  var List,
      ListWrapper,
      StringMapWrapper,
      normalizeBlank,
      isPresent,
      global,
      VmTurnZone;
  return {
    setters: [function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      normalizeBlank = $__m.normalizeBlank;
      isPresent = $__m.isPresent;
      global = $__m.global;
    }],
    execute: function() {
      VmTurnZone = $__export("VmTurnZone", (function() {
        var VmTurnZone = function VmTurnZone($__2) {
          var enableLongStackTrace = $__2.enableLongStackTrace;
          this._nestedRunCounter = 0;
          this._onTurnStart = null;
          this._onTurnDone = null;
          this._onErrorHandler = null;
          this._outerZone = global.zone;
          this._innerZone = this._createInnerZone(this._outerZone, enableLongStackTrace);
        };
        return ($traceurRuntime.createClass)(VmTurnZone, {
          initCallbacks: function() {
            var $__2 = arguments[0] !== (void 0) ? arguments[0] : {},
                onTurnStart = $__2.onTurnStart,
                onTurnDone = $__2.onTurnDone,
                onScheduleMicrotask = $__2.onScheduleMicrotask,
                onErrorHandler = $__2.onErrorHandler;
            this._onTurnStart = normalizeBlank(onTurnStart);
            this._onTurnDone = normalizeBlank(onTurnDone);
            this._onErrorHandler = normalizeBlank(onErrorHandler);
          },
          run: function(fn) {
            return this._innerZone.run(fn);
          },
          runOutsideAngular: function(fn) {
            return this._outerZone.run(fn);
          },
          _createInnerZone: function(zone, enableLongStackTrace) {
            var $__0 = this;
            var vmTurnZone = this;
            var errorHandling;
            if (enableLongStackTrace) {
              errorHandling = StringMapWrapper.merge(Zone.longStackTraceZone, {onError: function(e) {
                  vmTurnZone._onError(this, e);
                }});
            } else {
              errorHandling = {onError: function(e) {
                  vmTurnZone._onError(this, e);
                }};
            }
            return zone.fork(errorHandling).fork({
              beforeTask: (function() {
                $__0._beforeTask();
              }),
              afterTask: (function() {
                $__0._afterTask();
              })
            });
          },
          _beforeTask: function() {
            this._nestedRunCounter++;
            if (this._nestedRunCounter === 1 && this._onTurnStart) {
              this._onTurnStart();
            }
          },
          _afterTask: function() {
            this._nestedRunCounter--;
            if (this._nestedRunCounter === 0 && this._onTurnDone) {
              this._onTurnDone();
            }
          },
          _onError: function(zone, e) {
            if (isPresent(this._onErrorHandler)) {
              var trace = [normalizeBlank(e.stack)];
              while (zone && zone.constructedAtException) {
                trace.push(zone.constructedAtException.get());
                zone = zone.parent;
              }
              this._onErrorHandler(e, trace);
            } else {
              throw e;
            }
          }
        }, {});
      }()));
    }
  };
});



System.register("angular2/src/core/dom/element", ["rtts_assert/rtts_assert", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/dom/element";
  var assert,
      DOM,
      normalizeBlank,
      NgElement;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      normalizeBlank = $__m.normalizeBlank;
    }],
    execute: function() {
      NgElement = $__export("NgElement", (function() {
        var NgElement = function NgElement(domElement) {
          this.domElement = domElement;
        };
        return ($traceurRuntime.createClass)(NgElement, {getAttribute: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return normalizeBlank(DOM.getAttribute(this.domElement, name));
          }}, {});
      }()));
      Object.defineProperty(NgElement.prototype.getAttribute, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/binding_propagation_config", ["rtts_assert/rtts_assert", "angular2/change_detection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/binding_propagation_config";
  var assert,
      ChangeDetector,
      CHECK_ONCE,
      DETACHED,
      CHECK_ALWAYS,
      BindingPropagationConfig;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ChangeDetector = $__m.ChangeDetector;
      CHECK_ONCE = $__m.CHECK_ONCE;
      DETACHED = $__m.DETACHED;
      CHECK_ALWAYS = $__m.CHECK_ALWAYS;
    }],
    execute: function() {
      BindingPropagationConfig = $__export("BindingPropagationConfig", (function() {
        var BindingPropagationConfig = function BindingPropagationConfig(cd) {
          assert.argumentTypes(cd, ChangeDetector);
          this._cd = cd;
        };
        return ($traceurRuntime.createClass)(BindingPropagationConfig, {
          shouldBePropagated: function() {
            this._cd.mode = CHECK_ONCE;
          },
          shouldBePropagatedFromRoot: function() {
            this._cd.markPathToRootAsCheckOnce();
          },
          shouldNotPropagate: function() {
            this._cd.mode = DETACHED;
          },
          shouldAlwaysPropagate: function() {
            this._cd.mode = CHECK_ALWAYS;
          }
        }, {});
      }()));
      Object.defineProperty(BindingPropagationConfig, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/element_binder", ["rtts_assert/rtts_assert", "./element_injector", "./directive_metadata", "angular2/src/facade/collection", "./view"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/element_binder";
  var assert,
      ProtoElementInjector,
      DirectiveMetadata,
      List,
      StringMap,
      ProtoView,
      ElementBinder;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ProtoElementInjector = $__m.ProtoElementInjector;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      List = $__m.List;
      StringMap = $__m.StringMap;
    }, function($__m) {
      ProtoView = $__m.ProtoView;
    }],
    execute: function() {
      ElementBinder = $__export("ElementBinder", (function() {
        var ElementBinder = function ElementBinder(protoElementInjector, componentDirective, viewportDirective) {
          assert.argumentTypes(protoElementInjector, ProtoElementInjector, componentDirective, DirectiveMetadata, viewportDirective, DirectiveMetadata);
          this.protoElementInjector = protoElementInjector;
          this.componentDirective = componentDirective;
          this.viewportDirective = viewportDirective;
          this.events = null;
          this.textNodeIndices = null;
          this.hasElementPropertyBindings = false;
          this.nestedProtoView = null;
        };
        return ($traceurRuntime.createClass)(ElementBinder, {}, {});
      }()));
      Object.defineProperty(ElementBinder, "parameters", {get: function() {
          return [[ProtoElementInjector], [DirectiveMetadata], [DirectiveMetadata]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/shadow_dom_emulation/shadow_css", ["rtts_assert/rtts_assert", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/shadow_dom_emulation/shadow_css";
  var assert,
      DOM,
      List,
      ListWrapper,
      StringWrapper,
      RegExp,
      RegExpWrapper,
      RegExpMatcherWrapper,
      isPresent,
      isBlank,
      BaseException,
      int,
      ShadowCss,
      _cssContentNextSelectorRe,
      _cssContentRuleRe,
      _cssContentUnscopedRuleRe,
      _polyfillHost,
      _polyfillHostContext,
      _parenSuffix,
      _cssColonHostRe,
      _cssColonHostContextRe,
      _polyfillHostNoCombinator,
      _shadowDOMSelectorsRe,
      _selectorReSuffix,
      _polyfillHostRe,
      _colonHostRe,
      _colonHostContextRe;
  function _cssToRules(cssText) {
    assert.argumentTypes(cssText, assert.type.string);
    return DOM.cssToRules(cssText);
  }
  function _withCssRules(cssText, callback) {
    assert.argumentTypes(cssText, assert.type.string, callback, Function);
    if (isBlank(callback))
      return ;
    var rules = _cssToRules(cssText);
    callback(rules);
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      StringWrapper = $__m.StringWrapper;
      RegExp = $__m.RegExp;
      RegExpWrapper = $__m.RegExpWrapper;
      RegExpMatcherWrapper = $__m.RegExpMatcherWrapper;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      int = $__m.int;
    }],
    execute: function() {
      ShadowCss = $__export("ShadowCss", (function() {
        var ShadowCss = function ShadowCss() {
          this.strictStyling = true;
        };
        return ($traceurRuntime.createClass)(ShadowCss, {
          shimStyle: function(style, selector) {
            var hostSelector = arguments[2] !== (void 0) ? arguments[2] : '';
            assert.argumentTypes(style, assert.type.any, selector, assert.type.string, hostSelector, assert.type.string);
            var cssText = DOM.getText(style);
            return assert.returnType((this.shimCssText(cssText, selector, hostSelector)), assert.type.string);
          },
          shimCssText: function(cssText, selector) {
            var hostSelector = arguments[2] !== (void 0) ? arguments[2] : '';
            assert.argumentTypes(cssText, assert.type.string, selector, assert.type.string, hostSelector, assert.type.string);
            cssText = this._insertDirectives(cssText);
            return assert.returnType((this._scopeCssText(cssText, selector, hostSelector)), assert.type.string);
          },
          _insertDirectives: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            cssText = this._insertPolyfillDirectivesInCssText(cssText);
            return assert.returnType((this._insertPolyfillRulesInCssText(cssText)), assert.type.string);
          },
          _insertPolyfillDirectivesInCssText: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            return assert.returnType((StringWrapper.replaceAllMapped(cssText, _cssContentNextSelectorRe, function(m) {
              return m[1] + '{';
            })), assert.type.string);
          },
          _insertPolyfillRulesInCssText: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            return assert.returnType((StringWrapper.replaceAllMapped(cssText, _cssContentRuleRe, function(m) {
              var rule = m[0];
              rule = StringWrapper.replace(rule, m[1], '');
              rule = StringWrapper.replace(rule, m[2], '');
              return m[3] + rule;
            })), assert.type.string);
          },
          _scopeCssText: function(cssText, scopeSelector, hostSelector) {
            var $__0 = this;
            assert.argumentTypes(cssText, assert.type.string, scopeSelector, assert.type.string, hostSelector, assert.type.string);
            var unscoped = this._extractUnscopedRulesFromCssText(cssText);
            cssText = this._insertPolyfillHostInCssText(cssText);
            cssText = this._convertColonHost(cssText);
            cssText = this._convertColonHostContext(cssText);
            cssText = this._convertShadowDOMSelectors(cssText);
            if (isPresent(scopeSelector)) {
              _withCssRules(cssText, (function(rules) {
                cssText = $__0._scopeRules(rules, scopeSelector, hostSelector);
              }));
            }
            cssText = cssText + '\n' + unscoped;
            return assert.returnType((cssText.trim()), assert.type.string);
          },
          _extractUnscopedRulesFromCssText: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            var r = '',
                m;
            var matcher = RegExpWrapper.matcher(_cssContentUnscopedRuleRe, cssText);
            while (isPresent(m = RegExpMatcherWrapper.next(matcher))) {
              var rule = m[0];
              rule = StringWrapper.replace(rule, m[2], '');
              rule = StringWrapper.replace(rule, m[1], m[3]);
              r = rule + '\n\n';
            }
            return assert.returnType((r), assert.type.string);
          },
          _convertColonHost: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            return assert.returnType((this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer)), assert.type.string);
          },
          _convertColonHostContext: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            return assert.returnType((this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer)), assert.type.string);
          },
          _convertColonRule: function(cssText, regExp, partReplacer) {
            assert.argumentTypes(cssText, assert.type.string, regExp, RegExp, partReplacer, Function);
            return assert.returnType((StringWrapper.replaceAllMapped(cssText, regExp, function(m) {
              if (isPresent(m[2])) {
                var parts = m[2].split(','),
                    r = [];
                for (var i = 0; i < parts.length; i++) {
                  var p = parts[i];
                  if (isBlank(p))
                    break;
                  p = p.trim();
                  ListWrapper.push(r, partReplacer(_polyfillHostNoCombinator, p, m[3]));
                }
                return r.join(',');
              } else {
                return _polyfillHostNoCombinator + m[3];
              }
            })), assert.type.string);
          },
          _colonHostContextPartReplacer: function(host, part, suffix) {
            assert.argumentTypes(host, assert.type.string, part, assert.type.string, suffix, assert.type.string);
            if (StringWrapper.contains(part, _polyfillHost)) {
              return assert.returnType((this._colonHostPartReplacer(host, part, suffix)), assert.type.string);
            } else {
              return assert.returnType((host + part + suffix + ', ' + part + ' ' + host + suffix), assert.type.string);
            }
          },
          _colonHostPartReplacer: function(host, part, suffix) {
            assert.argumentTypes(host, assert.type.string, part, assert.type.string, suffix, assert.type.string);
            return assert.returnType((host + StringWrapper.replace(part, _polyfillHost, '') + suffix), assert.type.string);
          },
          _convertShadowDOMSelectors: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            for (var i = 0; i < _shadowDOMSelectorsRe.length; i++) {
              cssText = StringWrapper.replaceAll(cssText, _shadowDOMSelectorsRe[i], ' ');
            }
            return assert.returnType((cssText), assert.type.string);
          },
          _scopeRules: function(cssRules, scopeSelector, hostSelector) {
            assert.argumentTypes(cssRules, assert.type.any, scopeSelector, assert.type.string, hostSelector, assert.type.string);
            var cssText = '';
            if (isPresent(cssRules)) {
              for (var i = 0; i < cssRules.length; i++) {
                var rule = cssRules[i];
                if (DOM.isStyleRule(rule) || DOM.isPageRule(rule)) {
                  cssText += this._scopeSelector(rule.selectorText, scopeSelector, hostSelector, this.strictStyling) + ' {\n';
                  cssText += this._propertiesFromRule(rule) + '\n}\n\n';
                } else if (DOM.isMediaRule(rule)) {
                  cssText += '@media ' + rule.media.mediaText + ' {\n';
                  cssText += this._scopeRules(rule.cssRules, scopeSelector, hostSelector);
                  cssText += '\n}\n\n';
                } else {
                  try {
                    if (isPresent(rule.cssText)) {
                      cssText += rule.cssText + '\n\n';
                    }
                  } catch (x) {
                    if (DOM.isKeyframesRule(rule) && isPresent(rule.cssRules)) {
                      cssText += this._ieSafeCssTextFromKeyFrameRule(rule);
                    }
                  }
                }
              }
            }
            return assert.returnType((cssText), assert.type.string);
          },
          _ieSafeCssTextFromKeyFrameRule: function(rule) {
            var cssText = '@keyframes ' + rule.name + ' {';
            for (var i = 0; i < rule.cssRules.length; i++) {
              var r = rule.cssRules[i];
              cssText += ' ' + r.keyText + ' {' + r.style.cssText + '}';
            }
            cssText += ' }';
            return assert.returnType((cssText), assert.type.string);
          },
          _scopeSelector: function(selector, scopeSelector, hostSelector, strict) {
            assert.argumentTypes(selector, assert.type.string, scopeSelector, assert.type.string, hostSelector, assert.type.string, strict, assert.type.boolean);
            var r = [],
                parts = selector.split(',');
            for (var i = 0; i < parts.length; i++) {
              var p = parts[i];
              p = p.trim();
              if (this._selectorNeedsScoping(p, scopeSelector)) {
                p = strict && !StringWrapper.contains(p, _polyfillHostNoCombinator) ? this._applyStrictSelectorScope(p, scopeSelector) : this._applySelectorScope(p, scopeSelector, hostSelector);
              }
              ListWrapper.push(r, p);
            }
            return assert.returnType((r.join(', ')), assert.type.string);
          },
          _selectorNeedsScoping: function(selector, scopeSelector) {
            assert.argumentTypes(selector, assert.type.string, scopeSelector, assert.type.string);
            var re = this._makeScopeMatcher(scopeSelector);
            return assert.returnType((!isPresent(RegExpWrapper.firstMatch(re, selector))), assert.type.boolean);
          },
          _makeScopeMatcher: function(scopeSelector) {
            assert.argumentTypes(scopeSelector, assert.type.string);
            var lre = RegExpWrapper.create('\\[');
            var rre = RegExpWrapper.create('\\]');
            scopeSelector = StringWrapper.replaceAll(scopeSelector, lre, '\\[');
            scopeSelector = StringWrapper.replaceAll(scopeSelector, rre, '\\]');
            return assert.returnType((RegExpWrapper.create('^(' + scopeSelector + ')' + _selectorReSuffix, 'm')), RegExp);
          },
          _applySelectorScope: function(selector, scopeSelector, hostSelector) {
            assert.argumentTypes(selector, assert.type.string, scopeSelector, assert.type.string, hostSelector, assert.type.string);
            return assert.returnType((this._applySimpleSelectorScope(selector, scopeSelector, hostSelector)), assert.type.string);
          },
          _applySimpleSelectorScope: function(selector, scopeSelector, hostSelector) {
            assert.argumentTypes(selector, assert.type.string, scopeSelector, assert.type.string, hostSelector, assert.type.string);
            if (isPresent(RegExpWrapper.firstMatch(_polyfillHostRe, selector))) {
              var replaceBy = this.strictStyling ? ("[" + hostSelector + "]") : scopeSelector;
              selector = StringWrapper.replace(selector, _polyfillHostNoCombinator, replaceBy);
              return assert.returnType((StringWrapper.replaceAll(selector, _polyfillHostRe, replaceBy + ' ')), assert.type.string);
            } else {
              return assert.returnType((scopeSelector + ' ' + selector), assert.type.string);
            }
          },
          _applyStrictSelectorScope: function(selector, scopeSelector) {
            var isRe = RegExpWrapper.create('\\[is=([^\\]]*)\\]');
            scopeSelector = StringWrapper.replaceAllMapped(scopeSelector, isRe, (function(m) {
              return m[1];
            }));
            var splits = [' ', '>', '+', '~'],
                scoped = selector,
                attrName = '[' + scopeSelector + ']';
            for (var i = 0; i < splits.length; i++) {
              var sep = splits[i];
              var parts = scoped.split(sep);
              scoped = ListWrapper.map(parts, function(p) {
                var t = StringWrapper.replaceAll(p.trim(), _polyfillHostRe, '');
                if (t.length > 0 && !ListWrapper.contains(splits, t) && !StringWrapper.contains(t, attrName)) {
                  var re = RegExpWrapper.create('([^:]*)(:*)(.*)');
                  var m = RegExpWrapper.firstMatch(re, t);
                  if (isPresent(m)) {
                    p = m[1] + attrName + m[2] + m[3];
                  }
                }
                return p;
              }).join(sep);
            }
            return assert.returnType((scoped), assert.type.string);
          },
          _insertPolyfillHostInCssText: function(selector) {
            assert.argumentTypes(selector, assert.type.string);
            selector = StringWrapper.replaceAll(selector, _colonHostContextRe, _polyfillHostContext);
            selector = StringWrapper.replaceAll(selector, _colonHostRe, _polyfillHost);
            return assert.returnType((selector), assert.type.string);
          },
          _propertiesFromRule: function(rule) {
            var cssText = rule.style.cssText;
            var attrRe = RegExpWrapper.create('[\'"]+|attr');
            if (rule.style.content.length > 0 && !isPresent(RegExpWrapper.firstMatch(attrRe, rule.style.content))) {
              var contentRe = RegExpWrapper.create('content:[^;]*;');
              cssText = StringWrapper.replaceAll(cssText, contentRe, 'content: \'' + rule.style.content + '\';');
            }
            return assert.returnType((cssText), assert.type.string);
          }
        }, {});
      }()));
      Object.defineProperty(ShadowCss.prototype.shimStyle, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype.shimCssText, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertDirectives, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertPolyfillDirectivesInCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertPolyfillRulesInCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._scopeCssText, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._extractUnscopedRulesFromCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertColonHost, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertColonHostContext, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertColonRule, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [Function]];
        }});
      Object.defineProperty(ShadowCss.prototype._colonHostContextPartReplacer, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._colonHostPartReplacer, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertShadowDOMSelectors, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._scopeRules, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._scopeSelector, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.boolean]];
        }});
      Object.defineProperty(ShadowCss.prototype._selectorNeedsScoping, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._makeScopeMatcher, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._applySelectorScope, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._applySimpleSelectorScope, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._applyStrictSelectorScope, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertPolyfillHostInCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      _cssContentNextSelectorRe = RegExpWrapper.create('polyfill-next-selector[^}]*content:[\\s]*?[\'"](.*?)[\'"][;\\s]*}([^{]*?){', 'im');
      _cssContentRuleRe = RegExpWrapper.create('(polyfill-rule)[^}]*(content:[\\s]*[\'"](.*?)[\'"])[;\\s]*[^}]*}', 'im');
      _cssContentUnscopedRuleRe = RegExpWrapper.create('(polyfill-unscoped-rule)[^}]*(content:[\\s]*[\'"](.*?)[\'"])[;\\s]*[^}]*}', 'im');
      _polyfillHost = '-shadowcsshost';
      _polyfillHostContext = '-shadowcsscontext';
      _parenSuffix = ')(?:\\((' + '(?:\\([^)(]*\\)|[^)(]*)+?' + ')\\))?([^,{]*)';
      _cssColonHostRe = RegExpWrapper.create('(' + _polyfillHost + _parenSuffix, 'im');
      _cssColonHostContextRe = RegExpWrapper.create('(' + _polyfillHostContext + _parenSuffix, 'im');
      _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
      _shadowDOMSelectorsRe = [RegExpWrapper.create('/shadow/'), RegExpWrapper.create('/shadow-deep/'), RegExpWrapper.create('::shadow'), RegExpWrapper.create('/deep/'), RegExpWrapper.create('::content')];
      _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
      _polyfillHostRe = RegExpWrapper.create(_polyfillHost, 'im');
      _colonHostRe = RegExpWrapper.create(':host', 'im');
      _colonHostContextRe = RegExpWrapper.create(':host-context', 'im');
      Object.defineProperty(_cssToRules, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_withCssRules, "parameters", {get: function() {
          return [[assert.type.string], [Function]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/xhr/xhr", ["rtts_assert/rtts_assert", "angular2/src/facade/async"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/xhr/xhr";
  var assert,
      Promise,
      XHR;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Promise = $__m.Promise;
    }],
    execute: function() {
      XHR = $__export("XHR", (function() {
        var XHR = function XHR() {};
        return ($traceurRuntime.createClass)(XHR, {get: function(url) {
            assert.argumentTypes(url, assert.type.string);
            return assert.returnType((null), assert.genericType(Promise, assert.type.string));
          }}, {});
      }()));
      Object.defineProperty(XHR.prototype.get, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/url_resolver", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/dom/dom_adapter"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/url_resolver";
  var assert,
      isPresent,
      isBlank,
      RegExpWrapper,
      BaseException,
      DOM,
      UrlResolver,
      _schemeRe;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      RegExpWrapper = $__m.RegExpWrapper;
      BaseException = $__m.BaseException;
    }, function($__m) {
      DOM = $__m.DOM;
    }],
    execute: function() {
      UrlResolver = $__export("UrlResolver", (function() {
        var UrlResolver = function UrlResolver() {
          if (isBlank(UrlResolver.a)) {
            UrlResolver.a = DOM.createElement('a');
          }
        };
        return ($traceurRuntime.createClass)(UrlResolver, {resolve: function(baseUrl, url) {
            assert.argumentTypes(baseUrl, assert.type.string, url, assert.type.string);
            if (isBlank(baseUrl)) {
              DOM.resolveAndSetHref(UrlResolver.a, url, null);
              return assert.returnType((DOM.getHref(UrlResolver.a)), assert.type.string);
            }
            if (isBlank(url) || url == '')
              return assert.returnType((baseUrl), assert.type.string);
            if (url[0] == '/') {
              throw new BaseException(("Could not resolve the url " + url + " from " + baseUrl));
            }
            var m = RegExpWrapper.firstMatch(_schemeRe, url);
            if (isPresent(m[1])) {
              return assert.returnType((url), assert.type.string);
            }
            DOM.resolveAndSetHref(UrlResolver.a, baseUrl, url);
            return assert.returnType((DOM.getHref(UrlResolver.a)), assert.type.string);
          }}, {});
      }()));
      Object.defineProperty(UrlResolver.prototype.resolve, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      _schemeRe = RegExpWrapper.create('^([^:/?#]+:)?');
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/util", ["rtts_assert/rtts_assert", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/util";
  var assert,
      StringWrapper,
      RegExpWrapper,
      DASH_CASE_REGEXP,
      CAMEL_CASE_REGEXP;
  function dashCaseToCamelCase(input) {
    assert.argumentTypes(input, assert.type.string);
    return StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, (function(m) {
      return m[1].toUpperCase();
    }));
  }
  function camelCaseToDashCase(input) {
    assert.argumentTypes(input, assert.type.string);
    return StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, (function(m) {
      return '-' + m[1].toLowerCase();
    }));
  }
  $__export("dashCaseToCamelCase", dashCaseToCamelCase);
  $__export("camelCaseToDashCase", camelCaseToDashCase);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      StringWrapper = $__m.StringWrapper;
      RegExpWrapper = $__m.RegExpWrapper;
    }],
    execute: function() {
      DASH_CASE_REGEXP = RegExpWrapper.create('-([a-z])');
      CAMEL_CASE_REGEXP = RegExpWrapper.create('([A-Z])');
      Object.defineProperty(dashCaseToCamelCase, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(camelCaseToDashCase, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/compile_control", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./compile_element", "./compile_step"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/compile_control";
  var assert,
      isBlank,
      List,
      ListWrapper,
      CompileElement,
      CompileStep,
      CompileControl;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isBlank = $__m.isBlank;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }],
    execute: function() {
      CompileControl = $__export("CompileControl", (function() {
        var CompileControl = function CompileControl(steps) {
          this._steps = steps;
          this._currentStepIndex = 0;
          this._parent = null;
          this._results = null;
          this._additionalChildren = null;
        };
        return ($traceurRuntime.createClass)(CompileControl, {
          internalProcess: function(results, startStepIndex, parent, current) {
            assert.argumentTypes(results, assert.type.any, startStepIndex, assert.type.any, parent, CompileElement, current, CompileElement);
            this._results = results;
            var previousStepIndex = this._currentStepIndex;
            var previousParent = this._parent;
            for (var i = startStepIndex; i < this._steps.length; i++) {
              var step = this._steps[i];
              this._parent = parent;
              this._currentStepIndex = i;
              step.process(parent, current, this);
              parent = this._parent;
            }
            ListWrapper.push(results, current);
            this._currentStepIndex = previousStepIndex;
            this._parent = previousParent;
            var localAdditionalChildren = this._additionalChildren;
            this._additionalChildren = null;
            return localAdditionalChildren;
          },
          addParent: function(newElement) {
            assert.argumentTypes(newElement, CompileElement);
            this.internalProcess(this._results, this._currentStepIndex + 1, this._parent, newElement);
            this._parent = newElement;
          },
          addChild: function(element) {
            assert.argumentTypes(element, CompileElement);
            if (isBlank(this._additionalChildren)) {
              this._additionalChildren = ListWrapper.create();
            }
            ListWrapper.push(this._additionalChildren, element);
          }
        }, {});
      }()));
      Object.defineProperty(CompileControl.prototype.internalProcess, "parameters", {get: function() {
          return [[], [], [CompileElement], [CompileElement]];
        }});
      Object.defineProperty(CompileControl.prototype.addParent, "parameters", {get: function() {
          return [[CompileElement]];
        }});
      Object.defineProperty(CompileControl.prototype.addChild, "parameters", {get: function() {
          return [[CompileElement]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/view_pool", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "./view"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/view_pool";
  var assert,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      List,
      viewModule,
      ViewPool;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      viewModule = $__m;
    }],
    execute: function() {
      ViewPool = $__export("ViewPool", (function() {
        var ViewPool = function ViewPool(capacity) {
          assert.argumentTypes(capacity, assert.type.number);
          this._views = [];
          this._capacity = capacity;
        };
        return ($traceurRuntime.createClass)(ViewPool, {
          pop: function() {
            return assert.returnType((ListWrapper.isEmpty(this._views) ? null : ListWrapper.removeLast(this._views)), viewModule.View);
          },
          push: function(view) {
            assert.argumentTypes(view, viewModule.View);
            if (this._views.length < this._capacity) {
              ListWrapper.push(this._views, view);
            }
          },
          length: function() {
            return this._views.length;
          }
        }, {});
      }()));
      Object.defineProperty(ViewPool, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ViewPool.prototype.push, "parameters", {get: function() {
          return [[viewModule.View]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/compile_pipeline", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "./compile_element", "./compile_control", "./compile_step"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/compile_pipeline";
  var assert,
      isPresent,
      List,
      ListWrapper,
      DOM,
      CompileElement,
      CompileControl,
      CompileStep,
      CompilePipeline;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }],
    execute: function() {
      CompilePipeline = $__export("CompilePipeline", (function() {
        var CompilePipeline = function CompilePipeline(steps) {
          assert.argumentTypes(steps, assert.genericType(List, CompileStep));
          this._control = new CompileControl(steps);
        };
        return ($traceurRuntime.createClass)(CompilePipeline, {
          process: function(rootElement) {
            var compilationCtxtDescription = arguments[1] !== (void 0) ? arguments[1] : '';
            assert.argumentTypes(rootElement, assert.type.any, compilationCtxtDescription, assert.type.string);
            var results = ListWrapper.create();
            this._process(results, null, new CompileElement(rootElement, compilationCtxtDescription), compilationCtxtDescription);
            return assert.returnType((results), List);
          },
          _process: function(results, parent, current) {
            var compilationCtxtDescription = arguments[3] !== (void 0) ? arguments[3] : '';
            assert.argumentTypes(results, assert.type.any, parent, CompileElement, current, CompileElement, compilationCtxtDescription, assert.type.string);
            var additionalChildren = this._control.internalProcess(results, 0, parent, current);
            if (current.compileChildren) {
              var node = DOM.firstChild(DOM.templateAwareRoot(current.element));
              while (isPresent(node)) {
                var nextNode = DOM.nextSibling(node);
                if (DOM.isElementNode(node)) {
                  this._process(results, current, new CompileElement(node, compilationCtxtDescription));
                }
                node = nextNode;
              }
            }
            if (isPresent(additionalChildren)) {
              for (var i = 0; i < additionalChildren.length; i++) {
                this._process(results, current, additionalChildren[i]);
              }
            }
          }
        }, {});
      }()));
      Object.defineProperty(CompilePipeline, "parameters", {get: function() {
          return [[assert.genericType(List, CompileStep)]];
        }});
      Object.defineProperty(CompilePipeline.prototype.process, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(CompilePipeline.prototype._process, "parameters", {get: function() {
          return [[], [CompileElement], [CompileElement], [assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/property_binding_parser", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/change_detection", "./compile_step", "./compile_element", "./compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/property_binding_parser";
  var assert,
      isPresent,
      isBlank,
      RegExpWrapper,
      BaseException,
      MapWrapper,
      Parser,
      AST,
      ExpressionWithSource,
      CompileStep,
      CompileElement,
      CompileControl,
      BIND_NAME_REGEXP,
      PropertyBindingParser;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      RegExpWrapper = $__m.RegExpWrapper;
      BaseException = $__m.BaseException;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      Parser = $__m.Parser;
      AST = $__m.AST;
      ExpressionWithSource = $__m.ExpressionWithSource;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }],
    execute: function() {
      BIND_NAME_REGEXP = RegExpWrapper.create('^(?:(?:(bind)|(var)|(on))-(.+))|\\[([^\\]]+)\\]|\\(([^\\)]+)\\)|(#)(.+)');
      PropertyBindingParser = $__export("PropertyBindingParser", (function($__super) {
        var PropertyBindingParser = function PropertyBindingParser(parser) {
          assert.argumentTypes(parser, Parser);
          $traceurRuntime.superConstructor(PropertyBindingParser).call(this);
          this._parser = parser;
        };
        return ($traceurRuntime.createClass)(PropertyBindingParser, {
          process: function(parent, current, control) {
            var $__0 = this;
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            if (current.ignoreBindings) {
              return ;
            }
            var attrs = current.attrs();
            var newAttrs = MapWrapper.create();
            var desc = current.elementDescription;
            MapWrapper.forEach(attrs, (function(attrValue, attrName) {
              var bindParts = RegExpWrapper.firstMatch(BIND_NAME_REGEXP, attrName);
              if (isPresent(bindParts)) {
                if (isPresent(bindParts[1])) {
                  current.addPropertyBinding(bindParts[4], $__0._parseBinding(attrValue, desc));
                  MapWrapper.set(newAttrs, bindParts[4], attrValue);
                } else if (isPresent(bindParts[2]) || isPresent(bindParts[7])) {
                  var identifier = (isPresent(bindParts[4]) && bindParts[4] !== '') ? bindParts[4] : bindParts[8];
                  var value = attrValue == '' ? '\$implicit' : attrValue;
                  current.addVariableBinding(identifier, value);
                  MapWrapper.set(newAttrs, identifier, value);
                } else if (isPresent(bindParts[3])) {
                  current.addEventBinding(bindParts[4], $__0._parseAction(attrValue, desc));
                } else if (isPresent(bindParts[5])) {
                  current.addPropertyBinding(bindParts[5], $__0._parseBinding(attrValue, desc));
                  MapWrapper.set(newAttrs, bindParts[5], attrValue);
                } else if (isPresent(bindParts[6])) {
                  current.addEventBinding(bindParts[6], $__0._parseBinding(attrValue, desc));
                }
              } else {
                var ast = $__0._parseInterpolation(attrValue, desc);
                if (isPresent(ast)) {
                  current.addPropertyBinding(attrName, ast);
                }
              }
            }));
            MapWrapper.forEach(newAttrs, (function(attrValue, attrName) {
              MapWrapper.set(attrs, attrName, attrValue);
            }));
          },
          _parseInterpolation: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.string);
            return assert.returnType((this._parser.parseInterpolation(input, location)), AST);
          },
          _parseBinding: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.string);
            return assert.returnType((this._parser.parseBinding(input, location)), AST);
          },
          _parseAction: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.string);
            return assert.returnType((this._parser.parseAction(input, location)), AST);
          }
        }, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(PropertyBindingParser, "parameters", {get: function() {
          return [[Parser]];
        }});
      Object.defineProperty(PropertyBindingParser.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(PropertyBindingParser.prototype._parseInterpolation, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(PropertyBindingParser.prototype._parseBinding, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(PropertyBindingParser.prototype._parseAction, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/text_interpolation_parser", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/change_detection", "./compile_step", "./compile_element", "./compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/text_interpolation_parser";
  var assert,
      RegExpWrapper,
      StringWrapper,
      isPresent,
      DOM,
      Parser,
      CompileStep,
      CompileElement,
      CompileControl,
      TextInterpolationParser;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
      isPresent = $__m.isPresent;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }],
    execute: function() {
      TextInterpolationParser = $__export("TextInterpolationParser", (function($__super) {
        var TextInterpolationParser = function TextInterpolationParser(parser) {
          assert.argumentTypes(parser, Parser);
          $traceurRuntime.superConstructor(TextInterpolationParser).call(this);
          this._parser = parser;
        };
        return ($traceurRuntime.createClass)(TextInterpolationParser, {
          process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            if (!current.compileChildren || current.ignoreBindings) {
              return ;
            }
            var element = current.element;
            var childNodes = DOM.childNodes(DOM.templateAwareRoot(element));
            for (var i = 0; i < childNodes.length; i++) {
              var node = childNodes[i];
              if (DOM.isTextNode(node)) {
                this._parseTextNode(current, node, i);
              }
            }
          },
          _parseTextNode: function(pipelineElement, node, nodeIndex) {
            var ast = this._parser.parseInterpolation(DOM.nodeValue(node), pipelineElement.elementDescription);
            if (isPresent(ast)) {
              DOM.setText(node, ' ');
              pipelineElement.addTextNodeBinding(nodeIndex, ast);
            }
          }
        }, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(TextInterpolationParser, "parameters", {get: function() {
          return [[Parser]];
        }});
      Object.defineProperty(TextInterpolationParser.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/selector", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/selector";
  var assert,
      List,
      Map,
      ListWrapper,
      MapWrapper,
      isPresent,
      isBlank,
      RegExpWrapper,
      RegExpMatcherWrapper,
      StringWrapper,
      BaseException,
      _EMPTY_ATTR_VALUE,
      _SELECTOR_REGEXP,
      CssSelector,
      SelectorMatcher,
      SelectorContext;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      List = $__m.List;
      Map = $__m.Map;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      RegExpWrapper = $__m.RegExpWrapper;
      RegExpMatcherWrapper = $__m.RegExpMatcherWrapper;
      StringWrapper = $__m.StringWrapper;
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      _EMPTY_ATTR_VALUE = '';
      _SELECTOR_REGEXP = RegExpWrapper.create('(\\:not\\()|' + '([-\\w]+)|' + '(?:\\.([-\\w]+))|' + '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])');
      CssSelector = $__export("CssSelector", (function() {
        var CssSelector = function CssSelector() {
          this.element = null;
          this.classNames = ListWrapper.create();
          this.attrs = ListWrapper.create();
          this.notSelector = null;
        };
        return ($traceurRuntime.createClass)(CssSelector, {
          setElement: function() {
            var element = arguments[0] !== (void 0) ? arguments[0] : null;
            assert.argumentTypes(element, assert.type.string);
            if (isPresent(element)) {
              element = element.toLowerCase();
            }
            this.element = element;
          },
          addAttribute: function(name) {
            var value = arguments[1] !== (void 0) ? arguments[1] : _EMPTY_ATTR_VALUE;
            assert.argumentTypes(name, assert.type.string, value, assert.type.string);
            ListWrapper.push(this.attrs, name.toLowerCase());
            if (isPresent(value)) {
              value = value.toLowerCase();
            } else {
              value = _EMPTY_ATTR_VALUE;
            }
            ListWrapper.push(this.attrs, value);
          },
          addClassName: function(name) {
            assert.argumentTypes(name, assert.type.string);
            ListWrapper.push(this.classNames, name.toLowerCase());
          },
          toString: function() {
            var res = '';
            if (isPresent(this.element)) {
              res += this.element;
            }
            if (isPresent(this.classNames)) {
              for (var i = 0; i < this.classNames.length; i++) {
                res += '.' + this.classNames[i];
              }
            }
            if (isPresent(this.attrs)) {
              for (var i = 0; i < this.attrs.length; ) {
                var attrName = this.attrs[i++];
                var attrValue = this.attrs[i++];
                res += '[' + attrName;
                if (attrValue.length > 0) {
                  res += '=' + attrValue;
                }
                res += ']';
              }
            }
            if (isPresent(this.notSelector)) {
              res += ":not(" + this.notSelector.toString() + ")";
            }
            return assert.returnType((res), assert.type.string);
          }
        }, {parse: function(selector) {
            assert.argumentTypes(selector, assert.type.string);
            var cssSelector = new CssSelector();
            var matcher = RegExpWrapper.matcher(_SELECTOR_REGEXP, selector);
            var match;
            var current = cssSelector;
            while (isPresent(match = RegExpMatcherWrapper.next(matcher))) {
              if (isPresent(match[1])) {
                if (isPresent(cssSelector.notSelector)) {
                  throw new BaseException('Nesting :not is not allowed in a selector');
                }
                current.notSelector = new CssSelector();
                current = current.notSelector;
              }
              if (isPresent(match[2])) {
                current.setElement(match[2]);
              }
              if (isPresent(match[3])) {
                current.addClassName(match[3]);
              }
              if (isPresent(match[4])) {
                current.addAttribute(match[4], match[5]);
              }
            }
            if (isPresent(cssSelector.notSelector) && isBlank(cssSelector.element) && ListWrapper.isEmpty(cssSelector.classNames) && ListWrapper.isEmpty(cssSelector.attrs)) {
              cssSelector.element = "*";
            }
            return assert.returnType((cssSelector), CssSelector);
          }});
      }()));
      Object.defineProperty(CssSelector.parse, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(CssSelector.prototype.setElement, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(CssSelector.prototype.addAttribute, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(CssSelector.prototype.addClassName, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      SelectorMatcher = $__export("SelectorMatcher", (function() {
        var SelectorMatcher = function SelectorMatcher() {
          this._elementMap = MapWrapper.create();
          this._elementPartialMap = MapWrapper.create();
          this._classMap = MapWrapper.create();
          this._classPartialMap = MapWrapper.create();
          this._attrValueMap = MapWrapper.create();
          this._attrValuePartialMap = MapWrapper.create();
        };
        return ($traceurRuntime.createClass)(SelectorMatcher, {
          addSelectable: function(cssSelector, callbackCtxt) {
            assert.argumentTypes(cssSelector, CssSelector, callbackCtxt, assert.type.any);
            var matcher = this;
            var element = cssSelector.element;
            var classNames = cssSelector.classNames;
            var attrs = cssSelector.attrs;
            var selectable = new SelectorContext(cssSelector, callbackCtxt);
            if (isPresent(element)) {
              var isTerminal = attrs.length === 0 && classNames.length === 0;
              if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
              } else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
              }
            }
            if (isPresent(classNames)) {
              for (var index = 0; index < classNames.length; index++) {
                var isTerminal = attrs.length === 0 && index === classNames.length - 1;
                var className = classNames[index];
                if (isTerminal) {
                  this._addTerminal(matcher._classMap, className, selectable);
                } else {
                  matcher = this._addPartial(matcher._classPartialMap, className);
                }
              }
            }
            if (isPresent(attrs)) {
              for (var index = 0; index < attrs.length; ) {
                var isTerminal = index === attrs.length - 2;
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                var map = isTerminal ? matcher._attrValueMap : matcher._attrValuePartialMap;
                var valuesMap = MapWrapper.get(map, attrName);
                if (isBlank(valuesMap)) {
                  valuesMap = MapWrapper.create();
                  MapWrapper.set(map, attrName, valuesMap);
                }
                if (isTerminal) {
                  this._addTerminal(valuesMap, attrValue, selectable);
                } else {
                  matcher = this._addPartial(valuesMap, attrValue);
                }
              }
            }
          },
          _addTerminal: function(map, name, selectable) {
            assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.string, selectable, assert.type.any);
            var terminalList = MapWrapper.get(map, name);
            if (isBlank(terminalList)) {
              terminalList = ListWrapper.create();
              MapWrapper.set(map, name, terminalList);
            }
            ListWrapper.push(terminalList, selectable);
          },
          _addPartial: function(map, name) {
            assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.string);
            var matcher = MapWrapper.get(map, name);
            if (isBlank(matcher)) {
              matcher = new SelectorMatcher();
              MapWrapper.set(map, name, matcher);
            }
            return matcher;
          },
          match: function(cssSelector, matchedCallback) {
            assert.argumentTypes(cssSelector, CssSelector, matchedCallback, Function);
            var result = false;
            var element = cssSelector.element;
            var classNames = cssSelector.classNames;
            var attrs = cssSelector.attrs;
            result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
            result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) || result;
            if (isPresent(classNames)) {
              for (var index = 0; index < classNames.length; index++) {
                var className = classNames[index];
                result = this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result = this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) || result;
              }
            }
            if (isPresent(attrs)) {
              for (var index = 0; index < attrs.length; ) {
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                var valuesMap = MapWrapper.get(this._attrValueMap, attrName);
                if (!StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                  result = this._matchTerminal(valuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) || result;
                }
                result = this._matchTerminal(valuesMap, attrValue, cssSelector, matchedCallback) || result;
                valuesMap = MapWrapper.get(this._attrValuePartialMap, attrName);
                result = this._matchPartial(valuesMap, attrValue, cssSelector, matchedCallback) || result;
              }
            }
            return assert.returnType((result), assert.type.boolean);
          },
          _matchTerminal: function() {
            var map = arguments[0] !== (void 0) ? arguments[0] : null;
            var name = arguments[1];
            var cssSelector = arguments[2];
            var matchedCallback = arguments[3];
            assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.any, cssSelector, assert.type.any, matchedCallback, assert.type.any);
            if (isBlank(map) || isBlank(name)) {
              return assert.returnType((false), assert.type.boolean);
            }
            var selectables = MapWrapper.get(map, name);
            var starSelectables = MapWrapper.get(map, "*");
            if (isPresent(starSelectables)) {
              selectables = ListWrapper.concat(selectables, starSelectables);
            }
            if (isBlank(selectables)) {
              return assert.returnType((false), assert.type.boolean);
            }
            var selectable;
            var result = false;
            for (var index = 0; index < selectables.length; index++) {
              selectable = selectables[index];
              result = selectable.finalize(cssSelector, matchedCallback) || result;
            }
            return assert.returnType((result), assert.type.boolean);
          },
          _matchPartial: function() {
            var map = arguments[0] !== (void 0) ? arguments[0] : null;
            var name = arguments[1];
            var cssSelector = arguments[2];
            var matchedCallback = arguments[3];
            assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.any, cssSelector, assert.type.any, matchedCallback, assert.type.any);
            if (isBlank(map) || isBlank(name)) {
              return assert.returnType((false), assert.type.boolean);
            }
            var nestedSelector = MapWrapper.get(map, name);
            if (isBlank(nestedSelector)) {
              return assert.returnType((false), assert.type.boolean);
            }
            return assert.returnType((nestedSelector.match(cssSelector, matchedCallback)), assert.type.boolean);
          }
        }, {});
      }()));
      Object.defineProperty(SelectorMatcher.prototype.addSelectable, "parameters", {get: function() {
          return [[CssSelector], []];
        }});
      Object.defineProperty(SelectorMatcher.prototype._addTerminal, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [assert.type.string], []];
        }});
      Object.defineProperty(SelectorMatcher.prototype._addPartial, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [assert.type.string]];
        }});
      Object.defineProperty(SelectorMatcher.prototype.match, "parameters", {get: function() {
          return [[CssSelector], [Function]];
        }});
      Object.defineProperty(SelectorMatcher.prototype._matchTerminal, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [], [], []];
        }});
      Object.defineProperty(SelectorMatcher.prototype._matchPartial, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [], [], []];
        }});
      SelectorContext = (function() {
        var SelectorContext = function SelectorContext(selector, cbContext) {
          assert.argumentTypes(selector, CssSelector, cbContext, assert.type.any);
          this.selector = selector;
          this.notSelector = selector.notSelector;
          this.cbContext = cbContext;
        };
        return ($traceurRuntime.createClass)(SelectorContext, {finalize: function(cssSelector, callback) {
            assert.argumentTypes(cssSelector, CssSelector, callback, assert.type.any);
            var result = true;
            if (isPresent(this.notSelector)) {
              var notMatcher = new SelectorMatcher();
              notMatcher.addSelectable(this.notSelector, null);
              result = !notMatcher.match(cssSelector, null);
            }
            if (result && isPresent(callback)) {
              callback(this.selector, this.cbContext);
            }
            return result;
          }}, {});
      }());
      Object.defineProperty(SelectorContext, "parameters", {get: function() {
          return [[CssSelector], []];
        }});
      Object.defineProperty(SelectorContext.prototype.finalize, "parameters", {get: function() {
          return [[CssSelector], []];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/element_binder_builder", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/reflection/reflection", "angular2/change_detection", "../directive_metadata", "./compile_step", "./compile_element", "./compile_control", "./util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/element_binder_builder";
  var assert,
      int,
      isPresent,
      isBlank,
      Type,
      BaseException,
      StringWrapper,
      RegExpWrapper,
      isString,
      stringify,
      DOM,
      ListWrapper,
      List,
      MapWrapper,
      StringMapWrapper,
      reflector,
      Parser,
      ProtoChangeDetector,
      DirectiveMetadata,
      CompileStep,
      CompileElement,
      CompileControl,
      dashCaseToCamelCase,
      camelCaseToDashCase,
      DOT_REGEXP,
      ARIA_PREFIX,
      ariaSettersCache,
      CLASS_PREFIX,
      classSettersCache,
      STYLE_PREFIX,
      styleSettersCache,
      ROLE_ATTR,
      ElementBinderBuilder;
  function ariaSetterFactory(attrName) {
    assert.argumentTypes(attrName, assert.type.string);
    var setterFn = StringMapWrapper.get(ariaSettersCache, attrName);
    var ariaAttrName;
    if (isBlank(setterFn)) {
      ariaAttrName = camelCaseToDashCase(attrName);
      setterFn = function(element, value) {
        if (isPresent(value)) {
          DOM.setAttribute(element, ariaAttrName, stringify(value));
        } else {
          DOM.removeAttribute(element, ariaAttrName);
        }
      };
      StringMapWrapper.set(ariaSettersCache, attrName, setterFn);
    }
    return setterFn;
  }
  function classSetterFactory(className) {
    assert.argumentTypes(className, assert.type.string);
    var setterFn = StringMapWrapper.get(classSettersCache, className);
    if (isBlank(setterFn)) {
      setterFn = function(element, value) {
        if (value) {
          DOM.addClass(element, className);
        } else {
          DOM.removeClass(element, className);
        }
      };
      StringMapWrapper.set(classSettersCache, className, setterFn);
    }
    return setterFn;
  }
  function styleSetterFactory(styleName, stylesuffix) {
    assert.argumentTypes(styleName, assert.type.string, stylesuffix, assert.type.string);
    var cacheKey = styleName + stylesuffix;
    var setterFn = StringMapWrapper.get(styleSettersCache, cacheKey);
    var dashCasedStyleName;
    if (isBlank(setterFn)) {
      dashCasedStyleName = camelCaseToDashCase(styleName);
      setterFn = function(element, value) {
        var valAsStr;
        if (isPresent(value)) {
          valAsStr = stringify(value);
          DOM.setStyle(element, dashCasedStyleName, valAsStr + stylesuffix);
        } else {
          DOM.removeStyle(element, dashCasedStyleName);
        }
      };
      StringMapWrapper.set(classSettersCache, cacheKey, setterFn);
    }
    return setterFn;
  }
  function roleSetter(element, value) {
    if (isString(value)) {
      DOM.setAttribute(element, ROLE_ATTR, value);
    } else {
      DOM.removeAttribute(element, ROLE_ATTR);
      if (isPresent(value)) {
        throw new BaseException("Invalid role attribute, only string values are allowed, got '" + stringify(value) + "'");
      }
    }
  }
  function isSpecialProperty(propName) {
    assert.argumentTypes(propName, assert.type.string);
    return StringWrapper.startsWith(propName, ARIA_PREFIX) || StringWrapper.startsWith(propName, CLASS_PREFIX) || StringWrapper.startsWith(propName, STYLE_PREFIX) || StringMapWrapper.contains(DOM.attrToPropMap, propName);
  }
  $__export("isSpecialProperty", isSpecialProperty);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      int = $__m.int;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      Type = $__m.Type;
      BaseException = $__m.BaseException;
      StringWrapper = $__m.StringWrapper;
      RegExpWrapper = $__m.RegExpWrapper;
      isString = $__m.isString;
      stringify = $__m.stringify;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      reflector = $__m.reflector;
    }, function($__m) {
      Parser = $__m.Parser;
      ProtoChangeDetector = $__m.ProtoChangeDetector;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      dashCaseToCamelCase = $__m.dashCaseToCamelCase;
      camelCaseToDashCase = $__m.camelCaseToDashCase;
    }],
    execute: function() {
      DOT_REGEXP = RegExpWrapper.create('\\.');
      ARIA_PREFIX = 'aria';
      ariaSettersCache = StringMapWrapper.create();
      Object.defineProperty(ariaSetterFactory, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      CLASS_PREFIX = 'class.';
      classSettersCache = StringMapWrapper.create();
      Object.defineProperty(classSetterFactory, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      STYLE_PREFIX = 'style.';
      styleSettersCache = StringMapWrapper.create();
      Object.defineProperty(styleSetterFactory, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      ROLE_ATTR = 'role';
      Object.defineProperty(isSpecialProperty, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      ElementBinderBuilder = $__export("ElementBinderBuilder", (function($__super) {
        var ElementBinderBuilder = function ElementBinderBuilder(parser) {
          assert.argumentTypes(parser, Parser);
          $traceurRuntime.superConstructor(ElementBinderBuilder).call(this);
          this._parser = parser;
        };
        return ($traceurRuntime.createClass)(ElementBinderBuilder, {
          process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var elementBinder = null;
            if (current.hasBindings) {
              var protoView = current.inheritedProtoView;
              var protoInjectorWasBuilt = isBlank(parent) ? true : current.inheritedProtoElementInjector !== parent.inheritedProtoElementInjector;
              var currentProtoElementInjector = protoInjectorWasBuilt ? current.inheritedProtoElementInjector : null;
              elementBinder = protoView.bindElement(currentProtoElementInjector, current.componentDirective, current.viewportDirective);
              if (isPresent(current.textNodeBindings)) {
                this._bindTextNodes(protoView, current);
              }
              if (isPresent(current.propertyBindings)) {
                this._bindElementProperties(protoView, current);
              }
              if (isPresent(current.eventBindings)) {
                this._bindEvents(protoView, current);
              }
              var directives = current.getAllDirectives();
              this._bindDirectiveProperties(directives, current);
              this._bindDirectiveEvents(directives, current);
            } else if (isPresent(parent)) {
              elementBinder = parent.inheritedElementBinder;
            }
            current.inheritedElementBinder = elementBinder;
          },
          _bindTextNodes: function(protoView, compileElement) {
            MapWrapper.forEach(compileElement.textNodeBindings, (function(expression, indexInParent) {
              protoView.bindTextNode(indexInParent, expression);
            }));
          },
          _bindElementProperties: function(protoView, compileElement) {
            var $__0 = this;
            MapWrapper.forEach(compileElement.propertyBindings, (function(expression, property) {
              var setterFn,
                  styleParts,
                  styleSuffix;
              if (StringWrapper.startsWith(property, ARIA_PREFIX)) {
                setterFn = ariaSetterFactory(property);
              } else if (StringWrapper.equals(property, ROLE_ATTR)) {
                setterFn = roleSetter;
              } else if (StringWrapper.startsWith(property, CLASS_PREFIX)) {
                setterFn = classSetterFactory(StringWrapper.substring(property, CLASS_PREFIX.length));
              } else if (StringWrapper.startsWith(property, STYLE_PREFIX)) {
                styleParts = StringWrapper.split(property, DOT_REGEXP);
                styleSuffix = styleParts.length > 2 ? ListWrapper.get(styleParts, 2) : '';
                setterFn = styleSetterFactory(ListWrapper.get(styleParts, 1), styleSuffix);
              } else {
                property = $__0._resolvePropertyName(property);
                if (StringWrapper.equals(property, 'innerHTML')) {
                  setterFn = (function(element, value) {
                    return DOM.setInnerHTML(element, value);
                  });
                } else if (DOM.hasProperty(compileElement.element, property) || StringWrapper.equals(property, 'innerHtml')) {
                  setterFn = reflector.setter(property);
                }
              }
              if (isPresent(setterFn)) {
                protoView.bindElementProperty(expression.ast, property, setterFn);
              }
            }));
          },
          _bindEvents: function(protoView, compileElement) {
            MapWrapper.forEach(compileElement.eventBindings, (function(expression, eventName) {
              protoView.bindEvent(eventName, expression);
            }));
          },
          _bindDirectiveEvents: function(directives, compileElement) {
            var $__0 = this;
            assert.argumentTypes(directives, assert.genericType(List, DirectiveMetadata), compileElement, CompileElement);
            for (var directiveIndex = 0; directiveIndex < directives.length; directiveIndex++) {
              var directive = directives[directiveIndex];
              var annotation = directive.annotation;
              if (isBlank(annotation.events))
                continue;
              var protoView = compileElement.inheritedProtoView;
              StringMapWrapper.forEach(annotation.events, (function(action, eventName) {
                var expression = $__0._parser.parseAction(action, compileElement.elementDescription);
                protoView.bindEvent(eventName, expression, directiveIndex);
              }));
            }
          },
          _bindDirectiveProperties: function(directives, compileElement) {
            var $__0 = this;
            assert.argumentTypes(directives, assert.genericType(List, DirectiveMetadata), compileElement, CompileElement);
            var protoView = compileElement.inheritedProtoView;
            for (var directiveIndex = 0; directiveIndex < directives.length; directiveIndex++) {
              var directive = ListWrapper.get(directives, directiveIndex);
              var annotation = directive.annotation;
              if (isBlank(annotation.bind))
                continue;
              StringMapWrapper.forEach(annotation.bind, (function(bindConfig, dirProp) {
                var pipes = $__0._splitBindConfig(bindConfig);
                var elProp = ListWrapper.removeAt(pipes, 0);
                var bindingAst = isPresent(compileElement.propertyBindings) ? MapWrapper.get(compileElement.propertyBindings, dashCaseToCamelCase(elProp)) : null;
                if (isBlank(bindingAst)) {
                  var attributeValue = MapWrapper.get(compileElement.attrs(), elProp);
                  if (isPresent(attributeValue)) {
                    bindingAst = $__0._parser.wrapLiteralPrimitive(attributeValue, compileElement.elementDescription);
                  }
                }
                if (isPresent(bindingAst)) {
                  var fullExpAstWithBindPipes = $__0._parser.addPipes(bindingAst, pipes);
                  protoView.bindDirectiveProperty(directiveIndex, fullExpAstWithBindPipes, dirProp, reflector.setter(dashCaseToCamelCase(dirProp)));
                }
              }));
            }
          },
          _splitBindConfig: function(bindConfig) {
            return ListWrapper.map(bindConfig.split('|'), (function(s) {
              return s.trim();
            }));
          },
          _resolvePropertyName: function(attrName) {
            assert.argumentTypes(attrName, assert.type.string);
            var mappedPropName = StringMapWrapper.get(DOM.attrToPropMap, attrName);
            return isPresent(mappedPropName) ? mappedPropName : attrName;
          }
        }, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(ElementBinderBuilder, "parameters", {get: function() {
          return [[Parser]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype._bindDirectiveEvents, "parameters", {get: function() {
          return [[assert.genericType(List, DirectiveMetadata)], [CompileElement]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype._bindDirectiveProperties, "parameters", {get: function() {
          return [[assert.genericType(List, DirectiveMetadata)], [CompileElement]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype._splitBindConfig, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype._resolvePropertyName, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/view_splitter", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/change_detection", "./compile_step", "./compile_element", "./compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/view_splitter";
  var assert,
      isBlank,
      isPresent,
      BaseException,
      DOM,
      MapWrapper,
      ListWrapper,
      Parser,
      CompileStep,
      CompileElement,
      CompileControl,
      StringWrapper,
      ViewSplitter;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }],
    execute: function() {
      ViewSplitter = $__export("ViewSplitter", (function($__super) {
        var ViewSplitter = function ViewSplitter(parser) {
          assert.argumentTypes(parser, Parser);
          $traceurRuntime.superConstructor(ViewSplitter).call(this);
          this._parser = parser;
        };
        return ($traceurRuntime.createClass)(ViewSplitter, {
          process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var attrs = current.attrs();
            var templateBindings = MapWrapper.get(attrs, 'template');
            var hasTemplateBinding = isPresent(templateBindings);
            MapWrapper.forEach(attrs, (function(attrValue, attrName) {
              if (StringWrapper.startsWith(attrName, '*')) {
                var key = StringWrapper.substring(attrName, 1);
                if (hasTemplateBinding) {
                  throw new BaseException("Only one template directive per element is allowed: " + (templateBindings + " and " + key + " cannot be used simultaneously ") + ("in " + current.elementDescription));
                } else {
                  templateBindings = (attrValue.length == 0) ? key : key + ' ' + attrValue;
                  hasTemplateBinding = true;
                }
              }
            }));
            if (isBlank(parent)) {
              current.isViewRoot = true;
            } else {
              if (DOM.isTemplateElement(current.element)) {
                if (!current.isViewRoot) {
                  var viewRoot = new CompileElement(DOM.createTemplate(''));
                  var currentElement = current.element;
                  var viewRootElement = viewRoot.element;
                  this._moveChildNodes(DOM.content(currentElement), DOM.content(viewRootElement));
                  viewRoot.elementDescription = current.elementDescription;
                  viewRoot.isViewRoot = true;
                  control.addChild(viewRoot);
                }
              } else {
                if (hasTemplateBinding) {
                  var newParent = new CompileElement(DOM.createTemplate(''));
                  newParent.elementDescription = current.elementDescription;
                  current.isViewRoot = true;
                  this._parseTemplateBindings(templateBindings, newParent);
                  this._addParentElement(current.element, newParent.element);
                  control.addParent(newParent);
                  DOM.remove(current.element);
                }
              }
            }
          },
          _moveChildNodes: function(source, target) {
            var next = DOM.firstChild(source);
            while (isPresent(next)) {
              DOM.appendChild(target, next);
              next = DOM.firstChild(source);
            }
          },
          _addParentElement: function(currentElement, newParentElement) {
            DOM.insertBefore(currentElement, newParentElement);
            DOM.appendChild(newParentElement, currentElement);
          },
          _parseTemplateBindings: function(templateBindings, compileElement) {
            assert.argumentTypes(templateBindings, assert.type.string, compileElement, CompileElement);
            var bindings = this._parser.parseTemplateBindings(templateBindings, compileElement.elementDescription);
            for (var i = 0; i < bindings.length; i++) {
              var binding = bindings[i];
              if (binding.keyIsVar) {
                compileElement.addVariableBinding(binding.key, binding.name);
                MapWrapper.set(compileElement.attrs(), binding.key, binding.name);
              } else if (isPresent(binding.expression)) {
                compileElement.addPropertyBinding(binding.key, binding.expression);
                MapWrapper.set(compileElement.attrs(), binding.key, binding.expression.source);
              } else {
                DOM.setAttribute(compileElement.element, binding.key, '');
              }
            }
          }
        }, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(ViewSplitter, "parameters", {get: function() {
          return [[Parser]];
        }});
      Object.defineProperty(ViewSplitter.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(ViewSplitter.prototype._parseTemplateBindings, "parameters", {get: function() {
          return [[assert.type.string], [CompileElement]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/element_binding_marker", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "./compile_step", "./compile_element", "./compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/element_binding_marker";
  var assert,
      isPresent,
      MapWrapper,
      DOM,
      CompileStep,
      CompileElement,
      CompileControl,
      NG_BINDING_CLASS,
      ElementBindingMarker;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }],
    execute: function() {
      NG_BINDING_CLASS = 'ng-binding';
      ElementBindingMarker = $__export("ElementBindingMarker", (function($__super) {
        var ElementBindingMarker = function ElementBindingMarker() {
          $traceurRuntime.superConstructor(ElementBindingMarker).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(ElementBindingMarker, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            if (current.ignoreBindings) {
              return ;
            }
            var hasBindings = (isPresent(current.textNodeBindings) && MapWrapper.size(current.textNodeBindings) > 0) || (isPresent(current.propertyBindings) && MapWrapper.size(current.propertyBindings) > 0) || (isPresent(current.variableBindings) && MapWrapper.size(current.variableBindings) > 0) || (isPresent(current.eventBindings) && MapWrapper.size(current.eventBindings) > 0) || (isPresent(current.decoratorDirectives) && current.decoratorDirectives.length > 0) || isPresent(current.viewportDirective) || isPresent(current.componentDirective);
            if (hasBindings) {
              var element = current.element;
              DOM.addClass(element, NG_BINDING_CLASS);
              current.hasBindings = true;
            }
          }}, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(ElementBindingMarker.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/proto_view_builder", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "../view", "angular2/change_detection", "./compile_step", "./compile_element", "./compile_control", "../shadow_dom_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/proto_view_builder";
  var assert,
      isPresent,
      BaseException,
      ListWrapper,
      MapWrapper,
      ProtoView,
      ChangeDetection,
      CompileStep,
      CompileElement,
      CompileControl,
      ShadowDomStrategy,
      ProtoViewBuilder;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      ProtoView = $__m.ProtoView;
    }, function($__m) {
      ChangeDetection = $__m.ChangeDetection;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }],
    execute: function() {
      ProtoViewBuilder = $__export("ProtoViewBuilder", (function($__super) {
        var ProtoViewBuilder = function ProtoViewBuilder(changeDetection, shadowDomStrategy) {
          assert.argumentTypes(changeDetection, ChangeDetection, shadowDomStrategy, ShadowDomStrategy);
          $traceurRuntime.superConstructor(ProtoViewBuilder).call(this);
          this._shadowDomStrategy = shadowDomStrategy;
          this.changeDetection = changeDetection;
        };
        return ($traceurRuntime.createClass)(ProtoViewBuilder, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var inheritedProtoView = null;
            if (current.isViewRoot) {
              var protoChangeDetector = this.changeDetection.createProtoChangeDetector('dummy');
              inheritedProtoView = new ProtoView(current.element, protoChangeDetector, this._shadowDomStrategy);
              if (isPresent(parent)) {
                if (isPresent(parent.inheritedElementBinder.nestedProtoView)) {
                  throw new BaseException('Only one nested view per element is allowed');
                }
                parent.inheritedElementBinder.nestedProtoView = inheritedProtoView;
                if (isPresent(parent.variableBindings)) {
                  MapWrapper.forEach(parent.variableBindings, (function(mappedName, varName) {
                    inheritedProtoView.bindVariable(varName, mappedName);
                  }));
                }
              }
            } else if (isPresent(parent)) {
              inheritedProtoView = parent.inheritedProtoView;
            }
            if (isPresent(current.variableBindings)) {
              MapWrapper.forEach(current.variableBindings, (function(mappedName, varName) {
                MapWrapper.set(inheritedProtoView.protoContextLocals, mappedName, null);
              }));
            }
            current.inheritedProtoView = inheritedProtoView;
          }}, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(ProtoViewBuilder, "parameters", {get: function() {
          return [[ChangeDetection], [ShadowDomStrategy]];
        }});
      Object.defineProperty(ProtoViewBuilder.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/proto_element_injector_builder", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "../element_injector", "./compile_step", "./compile_element", "./compile_control", "../directive_metadata"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/proto_element_injector_builder";
  var assert,
      isPresent,
      isBlank,
      ListWrapper,
      MapWrapper,
      ProtoElementInjector,
      ComponentKeyMetaData,
      DirectiveBinding,
      CompileStep,
      CompileElement,
      CompileControl,
      DirectiveMetadata,
      ProtoElementInjectorBuilder;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      ProtoElementInjector = $__m.ProtoElementInjector;
      ComponentKeyMetaData = $__m.ComponentKeyMetaData;
      DirectiveBinding = $__m.DirectiveBinding;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }],
    execute: function() {
      ProtoElementInjectorBuilder = $__export("ProtoElementInjectorBuilder", (function($__super) {
        var ProtoElementInjectorBuilder = function ProtoElementInjectorBuilder() {
          $traceurRuntime.superConstructor(ProtoElementInjectorBuilder).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(ProtoElementInjectorBuilder, {
          internalCreateProtoElementInjector: function(parent, index, directives, firstBindingIsComponent, distance) {
            return new ProtoElementInjector(parent, index, directives, firstBindingIsComponent, distance);
          },
          process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var distanceToParentInjector = this._getDistanceToParentInjector(parent, current);
            var parentProtoElementInjector = this._getParentProtoElementInjector(parent, current);
            var injectorBindings = ListWrapper.map(current.getAllDirectives(), this._createBinding);
            if (injectorBindings.length > 0 || isPresent(current.variableBindings)) {
              var protoView = current.inheritedProtoView;
              var hasComponent = isPresent(current.componentDirective);
              current.inheritedProtoElementInjector = this.internalCreateProtoElementInjector(parentProtoElementInjector, protoView.elementBinders.length, injectorBindings, hasComponent, distanceToParentInjector);
              current.distanceToParentInjector = 0;
              if (isPresent(current.variableBindings) && !isPresent(current.viewportDirective)) {
                current.inheritedProtoElementInjector.exportComponent = hasComponent;
                current.inheritedProtoElementInjector.exportElement = !hasComponent;
                var exportImplicitName = MapWrapper.get(current.variableBindings, '\$implicit');
                if (isPresent(exportImplicitName)) {
                  current.inheritedProtoElementInjector.exportImplicitName = exportImplicitName;
                }
              }
            } else {
              current.inheritedProtoElementInjector = parentProtoElementInjector;
              current.distanceToParentInjector = distanceToParentInjector;
            }
          },
          _getDistanceToParentInjector: function(parent, current) {
            return isPresent(parent) ? parent.distanceToParentInjector + 1 : 0;
          },
          _getParentProtoElementInjector: function(parent, current) {
            if (isPresent(parent) && !current.isViewRoot) {
              return parent.inheritedProtoElementInjector;
            }
            return null;
          },
          _createBinding: function(d) {
            assert.argumentTypes(d, DirectiveMetadata);
            return assert.returnType((DirectiveBinding.createFromType(d.type, d.annotation)), DirectiveBinding);
          }
        }, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(ProtoElementInjectorBuilder.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(ProtoElementInjectorBuilder.prototype._createBinding, "parameters", {get: function() {
          return [[DirectiveMetadata]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/css_processor", ["rtts_assert/rtts_assert", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "angular2/src/facade/collection", "./pipeline/compile_step", "./pipeline/compile_element", "./pipeline/compile_control", "./shadow_dom_strategy", "./directive_metadata"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/css_processor";
  var assert,
      DOM,
      isPresent,
      List,
      CompileStep,
      CompileElement,
      CompileControl,
      ShadowDomStrategy,
      DirectiveMetadata,
      CssProcessor,
      CssTransformer,
      _CssProcessorStep;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }],
    execute: function() {
      CssProcessor = $__export("CssProcessor", (function() {
        var CssProcessor = function CssProcessor(transformers) {
          assert.argumentTypes(transformers, assert.genericType(List, CssTransformer));
          this._transformers = transformers;
        };
        return ($traceurRuntime.createClass)(CssProcessor, {getCompileStep: function(cmpMetadata, shadowDomStrategy, templateUrl) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata, shadowDomStrategy, ShadowDomStrategy, templateUrl, assert.type.string);
            var strategyStep = shadowDomStrategy.getStyleCompileStep(cmpMetadata, templateUrl);
            return new _CssProcessorStep(strategyStep, this._transformers);
          }}, {});
      }()));
      Object.defineProperty(CssProcessor, "parameters", {get: function() {
          return [[assert.genericType(List, CssTransformer)]];
        }});
      Object.defineProperty(CssProcessor.prototype.getCompileStep, "parameters", {get: function() {
          return [[DirectiveMetadata], [ShadowDomStrategy], [assert.type.string]];
        }});
      CssTransformer = $__export("CssTransformer", (function() {
        var CssTransformer = function CssTransformer() {};
        return ($traceurRuntime.createClass)(CssTransformer, {transform: function(styleElement) {}}, {});
      }()));
      _CssProcessorStep = (function($__super) {
        var _CssProcessorStep = function _CssProcessorStep(strategyStep, transformers) {
          assert.argumentTypes(strategyStep, CompileStep, transformers, assert.genericType(List, CssTransformer));
          $traceurRuntime.superConstructor(_CssProcessorStep).call(this);
          this._strategyStep = strategyStep;
          this._transformers = transformers;
        };
        return ($traceurRuntime.createClass)(_CssProcessorStep, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            if (DOM.tagName(current.element) == 'STYLE') {
              current.ignoreBindings = true;
              if (isPresent(this._transformers)) {
                var styleEl = current.element;
                for (var i = 0; i < this._transformers.length; i++) {
                  this._transformers[i].transform(styleEl);
                }
              }
              if (isPresent(this._strategyStep)) {
                this._strategyStep.process(parent, current, control);
              }
            }
          }}, {}, $__super);
      }(CompileStep));
      Object.defineProperty(_CssProcessorStep, "parameters", {get: function() {
          return [[CompileStep], [assert.genericType(List, CssTransformer)]];
        }});
      Object.defineProperty(_CssProcessorStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/template_loader", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "./xhr/xhr", "angular2/src/core/annotations/template", "./url_resolver"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/template_loader";
  var assert,
      isBlank,
      isPresent,
      BaseException,
      stringify,
      Map,
      MapWrapper,
      StringMapWrapper,
      StringMap,
      DOM,
      XHR,
      Template,
      UrlResolver,
      TemplateLoader;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      stringify = $__m.stringify;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
      StringMap = $__m.StringMap;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      Template = $__m.Template;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }],
    execute: function() {
      TemplateLoader = $__export("TemplateLoader", (function() {
        var TemplateLoader = function TemplateLoader(xhr, urlResolver) {
          assert.argumentTypes(xhr, XHR, urlResolver, UrlResolver);
          this._xhr = xhr;
          this._urlResolver = urlResolver;
          this._htmlCache = StringMapWrapper.create();
          this._baseUrls = MapWrapper.create();
          this._urlCache = MapWrapper.create();
        };
        return ($traceurRuntime.createClass)(TemplateLoader, {
          load: function(template) {
            assert.argumentTypes(template, Template);
            if (isPresent(template.inline)) {
              return DOM.createTemplate(template.inline);
            }
            if (isPresent(template.url)) {
              var url = this.getTemplateUrl(template);
              var promise = StringMapWrapper.get(this._htmlCache, url);
              if (isBlank(promise)) {
                promise = this._xhr.get(url).then(function(html) {
                  var template = DOM.createTemplate(html);
                  return template;
                });
                StringMapWrapper.set(this._htmlCache, url, promise);
              }
              return promise;
            }
            throw new BaseException('Templates should have either their url or inline property set');
          },
          setBaseUrl: function(template, baseUrl) {
            assert.argumentTypes(template, Template, baseUrl, assert.type.string);
            MapWrapper.set(this._baseUrls, template, baseUrl);
            MapWrapper.delete(this._urlCache, template);
          },
          getTemplateUrl: function(template) {
            assert.argumentTypes(template, Template);
            if (!MapWrapper.contains(this._urlCache, template)) {
              var baseUrl = MapWrapper.get(this._baseUrls, template);
              if (isBlank(baseUrl)) {
                throw new BaseException('The template base URL is not set');
              }
              var templateUrl;
              if (isPresent(template.url)) {
                templateUrl = this._urlResolver.resolve(baseUrl, template.url);
              } else {
                templateUrl = baseUrl;
              }
              MapWrapper.set(this._urlCache, template, templateUrl);
            }
            return MapWrapper.get(this._urlCache, template);
          }
        }, {});
      }()));
      Object.defineProperty(TemplateLoader, "parameters", {get: function() {
          return [[XHR], [UrlResolver]];
        }});
      Object.defineProperty(TemplateLoader.prototype.load, "parameters", {get: function() {
          return [[Template]];
        }});
      Object.defineProperty(TemplateLoader.prototype.setBaseUrl, "parameters", {get: function() {
          return [[Template], [assert.type.string]];
        }});
      Object.defineProperty(TemplateLoader.prototype.getTemplateUrl, "parameters", {get: function() {
          return [[Template]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/template_resolver", ["rtts_assert/rtts_assert", "angular2/src/core/annotations/template", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/template_resolver";
  var assert,
      Template,
      Type,
      stringify,
      isBlank,
      BaseException,
      Map,
      MapWrapper,
      List,
      ListWrapper,
      reflector,
      TemplateResolver;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Template = $__m.Template;
    }, function($__m) {
      Type = $__m.Type;
      stringify = $__m.stringify;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
      TemplateResolver = $__export("TemplateResolver", (function() {
        var TemplateResolver = function TemplateResolver() {
          this._cache = MapWrapper.create();
        };
        return ($traceurRuntime.createClass)(TemplateResolver, {
          resolve: function(component) {
            assert.argumentTypes(component, Type);
            var template = MapWrapper.get(this._cache, component);
            if (isBlank(template)) {
              template = this._resolve(component);
              MapWrapper.set(this._cache, component, template);
            }
            return assert.returnType((template), Template);
          },
          _resolve: function(component) {
            assert.argumentTypes(component, Type);
            var annotations = reflector.annotations(component);
            for (var i = 0; i < annotations.length; i++) {
              var annotation = annotations[i];
              if (annotation instanceof Template) {
                return annotation;
              }
            }
            throw new BaseException(("No template found for " + stringify(component)));
          }
        }, {});
      }()));
      Object.defineProperty(TemplateResolver.prototype.resolve, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(TemplateResolver.prototype._resolve, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/component_url_mapper", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/component_url_mapper";
  var assert,
      Type,
      isPresent,
      Map,
      MapWrapper,
      ComponentUrlMapper,
      RuntimeComponentUrlMapper;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }],
    execute: function() {
      ComponentUrlMapper = $__export("ComponentUrlMapper", (function() {
        var ComponentUrlMapper = function ComponentUrlMapper() {};
        return ($traceurRuntime.createClass)(ComponentUrlMapper, {getUrl: function(component) {
            assert.argumentTypes(component, Type);
            return assert.returnType(('./'), assert.type.string);
          }}, {});
      }()));
      Object.defineProperty(ComponentUrlMapper.prototype.getUrl, "parameters", {get: function() {
          return [[Type]];
        }});
      RuntimeComponentUrlMapper = $__export("RuntimeComponentUrlMapper", (function($__super) {
        var RuntimeComponentUrlMapper = function RuntimeComponentUrlMapper() {
          $traceurRuntime.superConstructor(RuntimeComponentUrlMapper).call(this);
          this._componentUrls = MapWrapper.create();
        };
        return ($traceurRuntime.createClass)(RuntimeComponentUrlMapper, {
          setComponentUrl: function(component, url) {
            assert.argumentTypes(component, Type, url, assert.type.string);
            MapWrapper.set(this._componentUrls, component, url);
          },
          getUrl: function(component) {
            assert.argumentTypes(component, Type);
            var url = MapWrapper.get(this._componentUrls, component);
            if (isPresent(url))
              return assert.returnType((url), assert.type.string);
            return assert.returnType(($traceurRuntime.superGet(this, RuntimeComponentUrlMapper.prototype, "getUrl").call(this, component)), assert.type.string);
          }
        }, {}, $__super);
      }(ComponentUrlMapper)));
      Object.defineProperty(RuntimeComponentUrlMapper.prototype.setComponentUrl, "parameters", {get: function() {
          return [[Type], [assert.type.string]];
        }});
      Object.defineProperty(RuntimeComponentUrlMapper.prototype.getUrl, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});



System.register("angular2/src/core/exception_handler", ["angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/exception_handler";
  var isPresent,
      print,
      ListWrapper,
      isListLikeIterable,
      ExceptionHandler;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      print = $__m.print;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      isListLikeIterable = $__m.isListLikeIterable;
    }],
    execute: function() {
      ExceptionHandler = $__export("ExceptionHandler", (function() {
        var ExceptionHandler = function ExceptionHandler() {};
        return ($traceurRuntime.createClass)(ExceptionHandler, {call: function(error) {
            var stackTrace = arguments[1] !== (void 0) ? arguments[1] : null;
            var reason = arguments[2] !== (void 0) ? arguments[2] : null;
            var longStackTrace = isListLikeIterable(stackTrace) ? ListWrapper.join(stackTrace, "\n\n") : stackTrace;
            var reasonStr = isPresent(reason) ? ("\n" + reason) : '';
            print(("" + error + reasonStr + "\nSTACKTRACE:\n" + longStackTrace));
          }}, {});
      }()));
    }
  };
});



System.register("angular2/src/core/life_cycle/life_cycle", ["rtts_assert/rtts_assert", "angular2/change_detection", "angular2/src/core/zone/vm_turn_zone", "angular2/src/core/exception_handler", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/life_cycle/life_cycle";
  var assert,
      ChangeDetector,
      VmTurnZone,
      ExceptionHandler,
      isPresent,
      LifeCycle;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ChangeDetector = $__m.ChangeDetector;
    }, function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }, function($__m) {
      ExceptionHandler = $__m.ExceptionHandler;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      LifeCycle = $__export("LifeCycle", (function() {
        var LifeCycle = function LifeCycle(exceptionHandler) {
          var changeDetector = arguments[1] !== (void 0) ? arguments[1] : null;
          var enforceNoNewChanges = arguments[2] !== (void 0) ? arguments[2] : false;
          assert.argumentTypes(exceptionHandler, ExceptionHandler, changeDetector, ChangeDetector, enforceNoNewChanges, assert.type.boolean);
          this._errorHandler = (function(exception, stackTrace) {
            exceptionHandler.call(exception, stackTrace);
            throw exception;
          });
          this._changeDetector = changeDetector;
          this._enforceNoNewChanges = enforceNoNewChanges;
        };
        return ($traceurRuntime.createClass)(LifeCycle, {
          registerWith: function(zone) {
            var changeDetector = arguments[1] !== (void 0) ? arguments[1] : null;
            var $__0 = this;
            if (isPresent(changeDetector)) {
              this._changeDetector = changeDetector;
            }
            zone.initCallbacks({
              onErrorHandler: this._errorHandler,
              onTurnDone: (function() {
                return $__0.tick();
              })
            });
          },
          tick: function() {
            this._changeDetector.detectChanges();
            if (this._enforceNoNewChanges) {
              this._changeDetector.checkNoChanges();
            }
          }
        }, {});
      }()));
      Object.defineProperty(LifeCycle, "parameters", {get: function() {
          return [[ExceptionHandler], [ChangeDetector], [assert.type.boolean]];
        }});
      Object.defineProperty(LifeCycle.prototype.registerWith, "parameters", {get: function() {
          return [[VmTurnZone], [ChangeDetector]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/xhr/xhr_impl", ["rtts_assert/rtts_assert", "angular2/src/facade/async", "./xhr"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/xhr/xhr_impl";
  var assert,
      Promise,
      PromiseWrapper,
      XHR,
      XHRImpl;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      XHR = $__m.XHR;
    }],
    execute: function() {
      XHRImpl = $__export("XHRImpl", (function($__super) {
        var XHRImpl = function XHRImpl() {
          $traceurRuntime.superConstructor(XHRImpl).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(XHRImpl, {get: function(url) {
            assert.argumentTypes(url, assert.type.string);
            var completer = PromiseWrapper.completer();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'text';
            xhr.onload = function() {
              var status = xhr.status;
              if (200 <= status && status <= 300) {
                completer.resolve(xhr.responseText);
              } else {
                completer.reject(("Failed to load " + url));
              }
            };
            xhr.onerror = function() {
              completer.reject(("Failed to load " + url));
            };
            xhr.send();
            return assert.returnType((completer.promise), assert.genericType(Promise, assert.type.string));
          }}, {}, $__super);
      }(XHR)));
      Object.defineProperty(XHRImpl.prototype.get, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/core/events/hammer_common", ["rtts_assert/rtts_assert", "./event_manager", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/events/hammer_common";
  var assert,
      EventManagerPlugin,
      StringMapWrapper,
      _eventNames,
      HammerGesturesPluginCommon;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      EventManagerPlugin = $__m.EventManagerPlugin;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
    }],
    execute: function() {
      _eventNames = {
        'pan': true,
        'panstart': true,
        'panmove': true,
        'panend': true,
        'pancancel': true,
        'panleft': true,
        'panright': true,
        'panup': true,
        'pandown': true,
        'pinch': true,
        'pinchstart': true,
        'pinchmove': true,
        'pinchend': true,
        'pinchcancel': true,
        'pinchin': true,
        'pinchout': true,
        'press': true,
        'pressup': true,
        'rotate': true,
        'rotatestart': true,
        'rotatemove': true,
        'rotateend': true,
        'rotatecancel': true,
        'swipe': true,
        'swipeleft': true,
        'swiperight': true,
        'swipeup': true,
        'swipedown': true,
        'tap': true
      };
      HammerGesturesPluginCommon = $__export("HammerGesturesPluginCommon", (function($__super) {
        var HammerGesturesPluginCommon = function HammerGesturesPluginCommon() {
          $traceurRuntime.superConstructor(HammerGesturesPluginCommon).call(this);
        };
        return ($traceurRuntime.createClass)(HammerGesturesPluginCommon, {supports: function(eventName) {
            assert.argumentTypes(eventName, assert.type.string);
            eventName = eventName.toLowerCase();
            return assert.returnType((StringMapWrapper.contains(_eventNames, eventName)), assert.type.boolean);
          }}, {}, $__super);
      }(EventManagerPlugin)));
      Object.defineProperty(HammerGesturesPluginCommon.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/directives/foreach", ["rtts_assert/rtts_assert", "angular2/src/core/annotations/annotations", "angular2/src/core/compiler/view_container", "angular2/src/core/compiler/view", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/foreach";
  var assert,
      Viewport,
      ViewContainer,
      View,
      isPresent,
      isBlank,
      ListWrapper,
      Foreach,
      RecordViewTuple;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Viewport = $__m.Viewport;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      View = $__m.View;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
    }],
    execute: function() {
      Foreach = $__export("Foreach", (function() {
        var Foreach = function Foreach(viewContainer) {
          assert.argumentTypes(viewContainer, ViewContainer);
          $traceurRuntime.superConstructor(Foreach).call(this);
          this.viewContainer = viewContainer;
        };
        return ($traceurRuntime.createClass)(Foreach, {
          set iterableChanges(changes) {
            if (isBlank(changes)) {
              this.viewContainer.clear();
              return ;
            }
            var recordViewTuples = [];
            changes.forEachRemovedItem((function(removedRecord) {
              return ListWrapper.push(recordViewTuples, new RecordViewTuple(removedRecord, null));
            }));
            changes.forEachMovedItem((function(movedRecord) {
              return ListWrapper.push(recordViewTuples, new RecordViewTuple(movedRecord, null));
            }));
            var insertTuples = Foreach.bulkRemove(recordViewTuples, this.viewContainer);
            changes.forEachAddedItem((function(addedRecord) {
              return ListWrapper.push(insertTuples, new RecordViewTuple(addedRecord, null));
            }));
            Foreach.bulkInsert(insertTuples, this.viewContainer);
            for (var i = 0; i < insertTuples.length; i++) {
              this.perViewChange(insertTuples[i].view, insertTuples[i].record);
            }
          },
          perViewChange: function(view, record) {
            view.setLocal('\$implicit', record.item);
            view.setLocal('index', record.currentIndex);
          }
        }, {
          bulkRemove: function(tuples, viewContainer) {
            tuples.sort((function(a, b) {
              return a.record.previousIndex - b.record.previousIndex;
            }));
            var movedTuples = [];
            for (var i = tuples.length - 1; i >= 0; i--) {
              var tuple = tuples[i];
              if (isPresent(tuple.record.currentIndex)) {
                tuple.view = viewContainer.detach(tuple.record.previousIndex);
                ListWrapper.push(movedTuples, tuple);
              } else {
                viewContainer.remove(tuple.record.previousIndex);
              }
            }
            return movedTuples;
          },
          bulkInsert: function(tuples, viewContainer) {
            tuples.sort((function(a, b) {
              return a.record.currentIndex - b.record.currentIndex;
            }));
            for (var i = 0; i < tuples.length; i++) {
              var tuple = tuples[i];
              if (isPresent(tuple.view)) {
                viewContainer.insert(tuple.view, tuple.record.currentIndex);
              } else {
                tuple.view = viewContainer.create(tuple.record.currentIndex);
              }
            }
            return tuples;
          }
        });
      }()));
      Object.defineProperty(Foreach, "annotations", {get: function() {
          return [new Viewport({
            selector: '[foreach][in]',
            bind: {'iterableChanges': 'in | iterableDiff'}
          })];
        }});
      Object.defineProperty(Foreach, "parameters", {get: function() {
          return [[ViewContainer]];
        }});
      RecordViewTuple = (function() {
        var RecordViewTuple = function RecordViewTuple(record, view) {
          this.record = record;
          this.view = view;
        };
        return ($traceurRuntime.createClass)(RecordViewTuple, {}, {});
      }());
    }
  };
});



System.register("angular2/src/directives/if", ["rtts_assert/rtts_assert", "angular2/src/core/annotations/annotations", "angular2/src/core/compiler/view_container", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/if";
  var assert,
      Viewport,
      ViewContainer,
      isBlank,
      If;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Viewport = $__m.Viewport;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      isBlank = $__m.isBlank;
    }],
    execute: function() {
      If = $__export("If", (function() {
        var If = function If(viewContainer) {
          assert.argumentTypes(viewContainer, ViewContainer);
          this.viewContainer = viewContainer;
          this.prevCondition = null;
        };
        return ($traceurRuntime.createClass)(If, {set condition(newCondition) {
            if (newCondition && (isBlank(this.prevCondition) || !this.prevCondition)) {
              this.prevCondition = true;
              this.viewContainer.create();
            } else if (!newCondition && (isBlank(this.prevCondition) || this.prevCondition)) {
              this.prevCondition = false;
              this.viewContainer.clear();
            }
          }}, {});
      }()));
      Object.defineProperty(If, "annotations", {get: function() {
          return [new Viewport({
            selector: '[if]',
            bind: {'condition': 'if'}
          })];
        }});
      Object.defineProperty(If, "parameters", {get: function() {
          return [[ViewContainer]];
        }});
    }
  };
});



System.register("angular2/src/directives/non_bindable", ["angular2/src/core/annotations/annotations"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/non_bindable";
  var Decorator,
      NonBindable;
  return {
    setters: [function($__m) {
      Decorator = $__m.Decorator;
    }],
    execute: function() {
      NonBindable = $__export("NonBindable", (function() {
        var NonBindable = function NonBindable() {};
        return ($traceurRuntime.createClass)(NonBindable, {}, {});
      }()));
      Object.defineProperty(NonBindable, "annotations", {get: function() {
          return [new Decorator({
            selector: '[non-bindable]',
            compileChildren: false
          })];
        }});
    }
  };
});



System.register("angular2/src/directives/switch", ["rtts_assert/rtts_assert", "angular2/src/core/annotations/annotations", "angular2/src/core/compiler/view_container", "angular2/src/core/dom/element", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/core/annotations/visibility"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/switch";
  var assert,
      Decorator,
      Viewport,
      ViewContainer,
      NgElement,
      isPresent,
      isBlank,
      normalizeBlank,
      ListWrapper,
      List,
      MapWrapper,
      Map,
      Parent,
      Switch,
      SwitchWhen,
      SwitchDefault,
      _whenDefault;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Decorator = $__m.Decorator;
      Viewport = $__m.Viewport;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      normalizeBlank = $__m.normalizeBlank;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
    }, function($__m) {
      Parent = $__m.Parent;
    }],
    execute: function() {
      Switch = $__export("Switch", (function() {
        var Switch = function Switch() {
          this._valueViewContainers = MapWrapper.create();
          this._activeViewContainers = ListWrapper.create();
          this._useDefault = false;
        };
        return ($traceurRuntime.createClass)(Switch, {
          set value(value) {
            this._emptyAllActiveViewContainers();
            this._useDefault = false;
            var containers = MapWrapper.get(this._valueViewContainers, value);
            if (isBlank(containers)) {
              this._useDefault = true;
              containers = normalizeBlank(MapWrapper.get(this._valueViewContainers, _whenDefault));
            }
            this._activateViewContainers(containers);
            this._switchValue = value;
          },
          _onWhenValueChanged: function(oldWhen, newWhen, viewContainer) {
            assert.argumentTypes(oldWhen, assert.type.any, newWhen, assert.type.any, viewContainer, ViewContainer);
            this._deregisterViewContainer(oldWhen, viewContainer);
            this._registerViewContainer(newWhen, viewContainer);
            if (oldWhen === this._switchValue) {
              viewContainer.remove();
              ListWrapper.remove(this._activeViewContainers, viewContainer);
            } else if (newWhen === this._switchValue) {
              if (this._useDefault) {
                this._useDefault = false;
                this._emptyAllActiveViewContainers();
              }
              viewContainer.create();
              ListWrapper.push(this._activeViewContainers, viewContainer);
            }
            if (this._activeViewContainers.length === 0 && !this._useDefault) {
              this._useDefault = true;
              this._activateViewContainers(MapWrapper.get(this._valueViewContainers, _whenDefault));
            }
          },
          _emptyAllActiveViewContainers: function() {
            var activeContainers = this._activeViewContainers;
            for (var i = 0; i < activeContainers.length; i++) {
              activeContainers[i].remove();
            }
            this._activeViewContainers = ListWrapper.create();
          },
          _activateViewContainers: function(containers) {
            assert.argumentTypes(containers, assert.genericType(List, ViewContainer));
            if (isPresent(containers)) {
              for (var i = 0; i < containers.length; i++) {
                containers[i].create();
              }
              this._activeViewContainers = containers;
            }
          },
          _registerViewContainer: function(value, container) {
            assert.argumentTypes(value, assert.type.any, container, ViewContainer);
            var containers = MapWrapper.get(this._valueViewContainers, value);
            if (isBlank(containers)) {
              containers = ListWrapper.create();
              MapWrapper.set(this._valueViewContainers, value, containers);
            }
            ListWrapper.push(containers, container);
          },
          _deregisterViewContainer: function(value, container) {
            assert.argumentTypes(value, assert.type.any, container, ViewContainer);
            if (value == _whenDefault)
              return ;
            var containers = MapWrapper.get(this._valueViewContainers, value);
            if (containers.length == 1) {
              MapWrapper.delete(this._valueViewContainers, value);
            } else {
              ListWrapper.remove(containers, container);
            }
          }
        }, {});
      }()));
      Object.defineProperty(Switch, "annotations", {get: function() {
          return [new Decorator({
            selector: '[switch]',
            bind: {'value': 'switch'}
          })];
        }});
      Object.defineProperty(Switch.prototype._onWhenValueChanged, "parameters", {get: function() {
          return [[], [], [ViewContainer]];
        }});
      Object.defineProperty(Switch.prototype._activateViewContainers, "parameters", {get: function() {
          return [[assert.genericType(List, ViewContainer)]];
        }});
      Object.defineProperty(Switch.prototype._registerViewContainer, "parameters", {get: function() {
          return [[], [ViewContainer]];
        }});
      Object.defineProperty(Switch.prototype._deregisterViewContainer, "parameters", {get: function() {
          return [[], [ViewContainer]];
        }});
      SwitchWhen = $__export("SwitchWhen", (function() {
        var SwitchWhen = function SwitchWhen(el, viewContainer, sswitch) {
          assert.argumentTypes(el, NgElement, viewContainer, ViewContainer, sswitch, Switch);
          this._value = _whenDefault;
          this._switch = sswitch;
          this._viewContainer = viewContainer;
        };
        return ($traceurRuntime.createClass)(SwitchWhen, {set when(value) {
            this._switch._onWhenValueChanged(this._value, value, this._viewContainer);
            this._value = value;
          }}, {});
      }()));
      Object.defineProperty(SwitchWhen, "annotations", {get: function() {
          return [new Viewport({
            selector: '[switch-when]',
            bind: {'when': 'switch-when'}
          })];
        }});
      Object.defineProperty(SwitchWhen, "parameters", {get: function() {
          return [[NgElement], [ViewContainer], [Switch, new Parent()]];
        }});
      SwitchDefault = $__export("SwitchDefault", (function() {
        var SwitchDefault = function SwitchDefault(viewContainer, sswitch) {
          assert.argumentTypes(viewContainer, ViewContainer, sswitch, Switch);
          sswitch._registerViewContainer(_whenDefault, viewContainer);
        };
        return ($traceurRuntime.createClass)(SwitchDefault, {}, {});
      }()));
      Object.defineProperty(SwitchDefault, "annotations", {get: function() {
          return [new Viewport({selector: '[switch-default]'})];
        }});
      Object.defineProperty(SwitchDefault, "parameters", {get: function() {
          return [[ViewContainer], [Switch, new Parent()]];
        }});
      _whenDefault = new Object();
    }
  };
});



System.register("angular2/src/forms/validators", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./model"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/validators";
  var assert,
      isBlank,
      isPresent,
      List,
      ListWrapper,
      StringMapWrapper,
      modelModule;
  function required(c) {
    assert.argumentTypes(c, modelModule.Control);
    return isBlank(c.value) || c.value == "" ? {"required": true} : null;
  }
  function nullValidator(c) {
    assert.argumentTypes(c, modelModule.Control);
    return null;
  }
  function compose(validators) {
    assert.argumentTypes(validators, assert.genericType(List, Function));
    return assert.returnType((function(c) {
      assert.argumentTypes(c, modelModule.Control);
      var res = ListWrapper.reduce(validators, (function(res, validator) {
        var errors = validator(c);
        return isPresent(errors) ? StringMapWrapper.merge(res, errors) : res;
      }), {});
      return StringMapWrapper.isEmpty(res) ? null : res;
    }), Function);
  }
  function controlGroupValidator(c) {
    assert.argumentTypes(c, modelModule.ControlGroup);
    var res = {};
    StringMapWrapper.forEach(c.controls, (function(control, name) {
      if (c.contains(name) && isPresent(control.errors)) {
        StringMapWrapper.forEach(control.errors, (function(value, error) {
          if (!StringMapWrapper.contains(res, error)) {
            res[error] = [];
          }
          ListWrapper.push(res[error], control);
        }));
      }
    }));
    return StringMapWrapper.isEmpty(res) ? null : res;
  }
  $__export("required", required);
  $__export("nullValidator", nullValidator);
  $__export("compose", compose);
  $__export("controlGroupValidator", controlGroupValidator);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      modelModule = $__m;
    }],
    execute: function() {
      Object.defineProperty(required, "parameters", {get: function() {
          return [[modelModule.Control]];
        }});
      Object.defineProperty(nullValidator, "parameters", {get: function() {
          return [[modelModule.Control]];
        }});
      Object.defineProperty(compose, "parameters", {get: function() {
          return [[assert.genericType(List, Function)]];
        }});
      Object.defineProperty(controlGroupValidator, "parameters", {get: function() {
          return [[modelModule.ControlGroup]];
        }});
    }
  };
});



System.register("angular2/src/forms/directives", ["rtts_assert/rtts_assert", "angular2/core", "angular2/di", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "angular2/src/facade/collection", "./model", "./validators"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/directives";
  var assert,
      Template,
      Component,
      Decorator,
      NgElement,
      Ancestor,
      onChange,
      Optional,
      DOM,
      isBlank,
      isPresent,
      isString,
      CONST,
      StringMapWrapper,
      ListWrapper,
      ControlGroup,
      Control,
      validators,
      ControlValueAccessor,
      DefaultControlValueAccessor,
      CheckboxControlValueAccessor,
      controlValueAccessors,
      ControlDirective,
      ControlGroupDirective,
      FormDirectives;
  function controlValueAccessorFor(controlType) {
    assert.argumentTypes(controlType, assert.type.string);
    var accessor = StringMapWrapper.get(controlValueAccessors, controlType);
    if (isPresent(accessor)) {
      return assert.returnType((accessor), ControlValueAccessor);
    } else {
      return assert.returnType((StringMapWrapper.get(controlValueAccessors, "text")), ControlValueAccessor);
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Template = $__m.Template;
      Component = $__m.Component;
      Decorator = $__m.Decorator;
      NgElement = $__m.NgElement;
      Ancestor = $__m.Ancestor;
      onChange = $__m.onChange;
    }, function($__m) {
      Optional = $__m.Optional;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      isString = $__m.isString;
      CONST = $__m.CONST;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      ControlGroup = $__m.ControlGroup;
      Control = $__m.Control;
    }, function($__m) {
      validators = $__m;
    }],
    execute: function() {
      ControlValueAccessor = $__export("ControlValueAccessor", (function() {
        var ControlValueAccessor = function ControlValueAccessor() {};
        return ($traceurRuntime.createClass)(ControlValueAccessor, {
          readValue: function(el) {},
          writeValue: function(el, value) {}
        }, {});
      }()));
      Object.defineProperty(ControlValueAccessor, "annotations", {get: function() {
          return [new CONST()];
        }});
      DefaultControlValueAccessor = (function($__super) {
        var DefaultControlValueAccessor = function DefaultControlValueAccessor() {
          $traceurRuntime.superConstructor(DefaultControlValueAccessor).call(this);
        };
        return ($traceurRuntime.createClass)(DefaultControlValueAccessor, {
          readValue: function(el) {
            return DOM.getValue(el);
          },
          writeValue: function(el, value) {
            DOM.setValue(el, value);
          }
        }, {}, $__super);
      }(ControlValueAccessor));
      Object.defineProperty(DefaultControlValueAccessor, "annotations", {get: function() {
          return [new CONST()];
        }});
      CheckboxControlValueAccessor = (function($__super) {
        var CheckboxControlValueAccessor = function CheckboxControlValueAccessor() {
          $traceurRuntime.superConstructor(CheckboxControlValueAccessor).call(this);
        };
        return ($traceurRuntime.createClass)(CheckboxControlValueAccessor, {
          readValue: function(el) {
            return assert.returnType((DOM.getChecked(el)), assert.type.boolean);
          },
          writeValue: function(el, value) {
            assert.argumentTypes(el, assert.type.any, value, assert.type.boolean);
            DOM.setChecked(el, value);
          }
        }, {}, $__super);
      }(ControlValueAccessor));
      Object.defineProperty(CheckboxControlValueAccessor, "annotations", {get: function() {
          return [new CONST()];
        }});
      Object.defineProperty(CheckboxControlValueAccessor.prototype.writeValue, "parameters", {get: function() {
          return [[], [assert.type.boolean]];
        }});
      controlValueAccessors = {
        "checkbox": new CheckboxControlValueAccessor(),
        "text": new DefaultControlValueAccessor()
      };
      Object.defineProperty(controlValueAccessorFor, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      ControlDirective = $__export("ControlDirective", (function() {
        var ControlDirective = function ControlDirective(groupDirective, el) {
          assert.argumentTypes(groupDirective, ControlGroupDirective, el, NgElement);
          this._groupDirective = groupDirective;
          this._el = el;
          this.validator = validators.nullValidator;
        };
        return ($traceurRuntime.createClass)(ControlDirective, {
          onChange: function(_) {
            this._initialize();
          },
          _initialize: function() {
            var $__0 = this;
            this._groupDirective.addDirective(this);
            var c = this._control();
            c.validator = validators.compose([c.validator, this.validator]);
            if (isBlank(this.valueAccessor)) {
              this.valueAccessor = controlValueAccessorFor(this.type);
            }
            this._updateDomValue();
            DOM.on(this._el.domElement, "change", (function(_) {
              return $__0._updateControlValue();
            }));
          },
          _updateDomValue: function() {
            this.valueAccessor.writeValue(this._el.domElement, this._control().value);
          },
          _updateControlValue: function() {
            this._control().updateValue(this.valueAccessor.readValue(this._el.domElement));
          },
          _control: function() {
            return this._groupDirective.findControl(this.controlName);
          }
        }, {});
      }()));
      Object.defineProperty(ControlDirective, "annotations", {get: function() {
          return [new Decorator({
            lifecycle: [onChange],
            selector: '[control]',
            bind: {
              'controlName': 'control',
              'type': 'type'
            }
          })];
        }});
      Object.defineProperty(ControlDirective, "parameters", {get: function() {
          return [[ControlGroupDirective, new Ancestor()], [NgElement]];
        }});
      ControlGroupDirective = $__export("ControlGroupDirective", (function() {
        var ControlGroupDirective = function ControlGroupDirective(groupDirective) {
          assert.argumentTypes(groupDirective, ControlGroupDirective);
          $traceurRuntime.superConstructor(ControlGroupDirective).call(this);
          this._groupDirective = groupDirective;
          this._directives = ListWrapper.create();
        };
        return ($traceurRuntime.createClass)(ControlGroupDirective, {
          set controlGroup(controlGroup) {
            if (isString(controlGroup)) {
              this._controlGroupName = controlGroup;
            } else {
              this._controlGroup = controlGroup;
            }
            this._updateDomValue();
          },
          _updateDomValue: function() {
            ListWrapper.forEach(this._directives, (function(cd) {
              return cd._updateDomValue();
            }));
          },
          addDirective: function(c) {
            assert.argumentTypes(c, ControlDirective);
            ListWrapper.push(this._directives, c);
          },
          findControl: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((this._getControlGroup().controls[name]), assert.type.any);
          },
          _getControlGroup: function() {
            if (isPresent(this._controlGroupName)) {
              return assert.returnType((this._groupDirective.findControl(this._controlGroupName)), ControlGroup);
            } else {
              return assert.returnType((this._controlGroup), ControlGroup);
            }
          }
        }, {});
      }()));
      Object.defineProperty(ControlGroupDirective, "annotations", {get: function() {
          return [new Decorator({
            selector: '[control-group]',
            bind: {'controlGroup': 'control-group'}
          })];
        }});
      Object.defineProperty(ControlGroupDirective, "parameters", {get: function() {
          return [[ControlGroupDirective, new Optional(), new Ancestor()]];
        }});
      Object.defineProperty(ControlGroupDirective.prototype.addDirective, "parameters", {get: function() {
          return [[ControlDirective]];
        }});
      Object.defineProperty(ControlGroupDirective.prototype.findControl, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      FormDirectives = $__export("FormDirectives", [ControlGroupDirective, ControlDirective]);
    }
  };
});



System.register("angular2/src/forms/validator_directives", ["rtts_assert/rtts_assert", "angular2/core", "angular2/forms"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/validator_directives";
  var assert,
      Decorator,
      ControlDirective,
      validators,
      RequiredValidatorDirective;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Decorator = $__m.Decorator;
    }, function($__m) {
      ControlDirective = $__m.ControlDirective;
      validators = $__m;
    }],
    execute: function() {
      RequiredValidatorDirective = $__export("RequiredValidatorDirective", (function() {
        var RequiredValidatorDirective = function RequiredValidatorDirective(c) {
          assert.argumentTypes(c, ControlDirective);
          c.validator = validators.compose([c.validator, validators.required]);
        };
        return ($traceurRuntime.createClass)(RequiredValidatorDirective, {}, {});
      }()));
      Object.defineProperty(RequiredValidatorDirective, "annotations", {get: function() {
          return [new Decorator({selector: '[required]'})];
        }});
      Object.defineProperty(RequiredValidatorDirective, "parameters", {get: function() {
          return [[ControlDirective]];
        }});
    }
  };
});



System.register("angular2/src/forms/form_builder", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang", "./model"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/form_builder";
  var assert,
      StringMapWrapper,
      ListWrapper,
      isPresent,
      modelModule,
      FormBuilder;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      modelModule = $__m;
    }],
    execute: function() {
      FormBuilder = $__export("FormBuilder", (function() {
        var FormBuilder = function FormBuilder() {};
        return ($traceurRuntime.createClass)(FormBuilder, {
          group: function(controlsConfig) {
            var extra = arguments[1] !== (void 0) ? arguments[1] : null;
            var controls = this._reduceControls(controlsConfig);
            var optionals = isPresent(extra) ? StringMapWrapper.get(extra, "optionals") : null;
            var validator = isPresent(extra) ? StringMapWrapper.get(extra, "validator") : null;
            if (isPresent(validator)) {
              return assert.returnType((new modelModule.ControlGroup(controls, optionals, validator)), modelModule.ControlGroup);
            } else {
              return assert.returnType((new modelModule.ControlGroup(controls, optionals)), modelModule.ControlGroup);
            }
          },
          control: function(value) {
            var validator = arguments[1] !== (void 0) ? arguments[1] : null;
            assert.argumentTypes(value, assert.type.any, validator, Function);
            if (isPresent(validator)) {
              return assert.returnType((new modelModule.Control(value, validator)), modelModule.Control);
            } else {
              return assert.returnType((new modelModule.Control(value)), modelModule.Control);
            }
          },
          _reduceControls: function(controlsConfig) {
            var $__0 = this;
            var controls = {};
            StringMapWrapper.forEach(controlsConfig, (function(controlConfig, controlName) {
              controls[controlName] = $__0._createControl(controlConfig);
            }));
            return controls;
          },
          _createControl: function(controlConfig) {
            if (controlConfig instanceof modelModule.Control || controlConfig instanceof modelModule.ControlGroup) {
              return controlConfig;
            } else if (ListWrapper.isList(controlConfig)) {
              var value = ListWrapper.get(controlConfig, 0);
              var validator = controlConfig.length > 1 ? controlConfig[1] : null;
              return this.control(value, validator);
            } else {
              return this.control(controlConfig);
            }
          }
        }, {});
      }()));
      Object.defineProperty(FormBuilder.prototype.control, "parameters", {get: function() {
          return [[], [Function]];
        }});
    }
  };
});



System.register("rtts_assert/rtts_assert", ["./src/rtts_assert"], function($__export) {
  "use strict";
  var __moduleName = "rtts_assert/rtts_assert";
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});



System.register("angular2/src/change_detection/parser/ast", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./context_with_variable_bindings"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/ast";
  var assert,
      autoConvertAdd,
      isBlank,
      isPresent,
      FunctionWrapper,
      BaseException,
      List,
      Map,
      ListWrapper,
      StringMapWrapper,
      ContextWithVariableBindings,
      AST,
      EmptyExpr,
      ImplicitReceiver,
      Chain,
      Conditional,
      AccessMember,
      KeyedAccess,
      Pipe,
      LiteralPrimitive,
      LiteralArray,
      LiteralMap,
      Interpolation,
      Binary,
      PrefixNot,
      Assignment,
      MethodCall,
      FunctionCall,
      ASTWithSource,
      TemplateBinding,
      AstVisitor,
      _evalListCache;
  function evalList(context, exps) {
    assert.argumentTypes(context, assert.type.any, exps, List);
    var length = exps.length;
    var result = _evalListCache[length];
    for (var i = 0; i < length; i++) {
      result[i] = exps[i].eval(context);
    }
    return result;
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      autoConvertAdd = $__m.autoConvertAdd;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      FunctionWrapper = $__m.FunctionWrapper;
      BaseException = $__m.BaseException;
    }, function($__m) {
      List = $__m.List;
      Map = $__m.Map;
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      ContextWithVariableBindings = $__m.ContextWithVariableBindings;
    }],
    execute: function() {
      AST = $__export("AST", (function() {
        var AST = function AST() {};
        return ($traceurRuntime.createClass)(AST, {
          eval: function(context) {
            throw new BaseException("Not supported");
          },
          get isAssignable() {
            return false;
          },
          assign: function(context, value) {
            throw new BaseException("Not supported");
          },
          visit: function(visitor) {},
          toString: function() {
            return assert.returnType(("AST"), assert.type.string);
          }
        }, {});
      }()));
      EmptyExpr = $__export("EmptyExpr", (function($__super) {
        var EmptyExpr = function EmptyExpr() {
          $traceurRuntime.superConstructor(EmptyExpr).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(EmptyExpr, {
          eval: function(context) {
            return null;
          },
          visit: function(visitor) {}
        }, {}, $__super);
      }(AST)));
      ImplicitReceiver = $__export("ImplicitReceiver", (function($__super) {
        var ImplicitReceiver = function ImplicitReceiver() {
          $traceurRuntime.superConstructor(ImplicitReceiver).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(ImplicitReceiver, {
          eval: function(context) {
            return context;
          },
          visit: function(visitor) {
            return visitor.visitImplicitReceiver(this);
          }
        }, {}, $__super);
      }(AST)));
      Chain = $__export("Chain", (function($__super) {
        var Chain = function Chain(expressions) {
          assert.argumentTypes(expressions, List);
          $traceurRuntime.superConstructor(Chain).call(this);
          this.expressions = expressions;
        };
        return ($traceurRuntime.createClass)(Chain, {
          eval: function(context) {
            var result;
            for (var i = 0; i < this.expressions.length; i++) {
              var last = this.expressions[i].eval(context);
              if (isPresent(last))
                result = last;
            }
            return result;
          },
          visit: function(visitor) {
            return visitor.visitChain(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(Chain, "parameters", {get: function() {
          return [[List]];
        }});
      Conditional = $__export("Conditional", (function($__super) {
        var Conditional = function Conditional(condition, trueExp, falseExp) {
          assert.argumentTypes(condition, AST, trueExp, AST, falseExp, AST);
          $traceurRuntime.superConstructor(Conditional).call(this);
          this.condition = condition;
          this.trueExp = trueExp;
          this.falseExp = falseExp;
        };
        return ($traceurRuntime.createClass)(Conditional, {
          eval: function(context) {
            if (this.condition.eval(context)) {
              return this.trueExp.eval(context);
            } else {
              return this.falseExp.eval(context);
            }
          },
          visit: function(visitor) {
            return visitor.visitConditional(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(Conditional, "parameters", {get: function() {
          return [[AST], [AST], [AST]];
        }});
      AccessMember = $__export("AccessMember", (function($__super) {
        var AccessMember = function AccessMember(receiver, name, getter, setter) {
          assert.argumentTypes(receiver, AST, name, assert.type.string, getter, Function, setter, Function);
          $traceurRuntime.superConstructor(AccessMember).call(this);
          this.receiver = receiver;
          this.name = name;
          this.getter = getter;
          this.setter = setter;
        };
        return ($traceurRuntime.createClass)(AccessMember, {
          eval: function(context) {
            var evaluatedContext = this.receiver.eval(context);
            while (evaluatedContext instanceof ContextWithVariableBindings) {
              if (evaluatedContext.hasBinding(this.name)) {
                return evaluatedContext.get(this.name);
              }
              evaluatedContext = evaluatedContext.parent;
            }
            return this.getter(evaluatedContext);
          },
          get isAssignable() {
            return true;
          },
          assign: function(context, value) {
            var evaluatedContext = this.receiver.eval(context);
            while (evaluatedContext instanceof ContextWithVariableBindings) {
              if (evaluatedContext.hasBinding(this.name)) {
                throw new BaseException(("Cannot reassign a variable binding " + this.name));
              }
              evaluatedContext = evaluatedContext.parent;
            }
            return this.setter(evaluatedContext, value);
          },
          visit: function(visitor) {
            return visitor.visitAccessMember(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(AccessMember, "parameters", {get: function() {
          return [[AST], [assert.type.string], [Function], [Function]];
        }});
      KeyedAccess = $__export("KeyedAccess", (function($__super) {
        var KeyedAccess = function KeyedAccess(obj, key) {
          assert.argumentTypes(obj, AST, key, AST);
          $traceurRuntime.superConstructor(KeyedAccess).call(this);
          this.obj = obj;
          this.key = key;
        };
        return ($traceurRuntime.createClass)(KeyedAccess, {
          eval: function(context) {
            var obj = this.obj.eval(context);
            var key = this.key.eval(context);
            return obj[key];
          },
          get isAssignable() {
            return true;
          },
          assign: function(context, value) {
            var obj = this.obj.eval(context);
            var key = this.key.eval(context);
            obj[key] = value;
            return value;
          },
          visit: function(visitor) {
            return visitor.visitKeyedAccess(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(KeyedAccess, "parameters", {get: function() {
          return [[AST], [AST]];
        }});
      Pipe = $__export("Pipe", (function($__super) {
        var Pipe = function Pipe(exp, name, args) {
          assert.argumentTypes(exp, AST, name, assert.type.string, args, List);
          $traceurRuntime.superConstructor(Pipe).call(this);
          this.exp = exp;
          this.name = name;
          this.args = args;
        };
        return ($traceurRuntime.createClass)(Pipe, {visit: function(visitor) {
            return visitor.visitPipe(this);
          }}, {}, $__super);
      }(AST)));
      Object.defineProperty(Pipe, "parameters", {get: function() {
          return [[AST], [assert.type.string], [List]];
        }});
      LiteralPrimitive = $__export("LiteralPrimitive", (function($__super) {
        var LiteralPrimitive = function LiteralPrimitive(value) {
          $traceurRuntime.superConstructor(LiteralPrimitive).call(this);
          this.value = value;
        };
        return ($traceurRuntime.createClass)(LiteralPrimitive, {
          eval: function(context) {
            return this.value;
          },
          visit: function(visitor) {
            return visitor.visitLiteralPrimitive(this);
          }
        }, {}, $__super);
      }(AST)));
      LiteralArray = $__export("LiteralArray", (function($__super) {
        var LiteralArray = function LiteralArray(expressions) {
          assert.argumentTypes(expressions, List);
          $traceurRuntime.superConstructor(LiteralArray).call(this);
          this.expressions = expressions;
        };
        return ($traceurRuntime.createClass)(LiteralArray, {
          eval: function(context) {
            return ListWrapper.map(this.expressions, (function(e) {
              return e.eval(context);
            }));
          },
          visit: function(visitor) {
            return visitor.visitLiteralArray(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(LiteralArray, "parameters", {get: function() {
          return [[List]];
        }});
      LiteralMap = $__export("LiteralMap", (function($__super) {
        var LiteralMap = function LiteralMap(keys, values) {
          assert.argumentTypes(keys, List, values, List);
          $traceurRuntime.superConstructor(LiteralMap).call(this);
          this.keys = keys;
          this.values = values;
        };
        return ($traceurRuntime.createClass)(LiteralMap, {
          eval: function(context) {
            var res = StringMapWrapper.create();
            for (var i = 0; i < this.keys.length; ++i) {
              StringMapWrapper.set(res, this.keys[i], this.values[i].eval(context));
            }
            return res;
          },
          visit: function(visitor) {
            return visitor.visitLiteralMap(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(LiteralMap, "parameters", {get: function() {
          return [[List], [List]];
        }});
      Interpolation = $__export("Interpolation", (function($__super) {
        var Interpolation = function Interpolation(strings, expressions) {
          assert.argumentTypes(strings, List, expressions, List);
          $traceurRuntime.superConstructor(Interpolation).call(this);
          this.strings = strings;
          this.expressions = expressions;
        };
        return ($traceurRuntime.createClass)(Interpolation, {
          eval: function(context) {
            throw new BaseException("evaluating an Interpolation is not supported");
          },
          visit: function(visitor) {
            visitor.visitInterpolation(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(Interpolation, "parameters", {get: function() {
          return [[List], [List]];
        }});
      Binary = $__export("Binary", (function($__super) {
        var Binary = function Binary(operation, left, right) {
          assert.argumentTypes(operation, assert.type.string, left, AST, right, AST);
          $traceurRuntime.superConstructor(Binary).call(this);
          this.operation = operation;
          this.left = left;
          this.right = right;
        };
        return ($traceurRuntime.createClass)(Binary, {
          eval: function(context) {
            var left = this.left.eval(context);
            switch (this.operation) {
              case '&&':
                return left && this.right.eval(context);
              case '||':
                return left || this.right.eval(context);
            }
            var right = this.right.eval(context);
            switch (this.operation) {
              case '+':
                return left + right;
              case '-':
                return left - right;
              case '*':
                return left * right;
              case '/':
                return left / right;
              case '%':
                return left % right;
              case '==':
                return left == right;
              case '!=':
                return left != right;
              case '<':
                return left < right;
              case '>':
                return left > right;
              case '<=':
                return left <= right;
              case '>=':
                return left >= right;
              case '^':
                return left ^ right;
              case '&':
                return left & right;
            }
            throw 'Internal error [$operation] not handled';
          },
          visit: function(visitor) {
            return visitor.visitBinary(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(Binary, "parameters", {get: function() {
          return [[assert.type.string], [AST], [AST]];
        }});
      PrefixNot = $__export("PrefixNot", (function($__super) {
        var PrefixNot = function PrefixNot(expression) {
          assert.argumentTypes(expression, AST);
          $traceurRuntime.superConstructor(PrefixNot).call(this);
          this.expression = expression;
        };
        return ($traceurRuntime.createClass)(PrefixNot, {
          eval: function(context) {
            return !this.expression.eval(context);
          },
          visit: function(visitor) {
            return visitor.visitPrefixNot(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(PrefixNot, "parameters", {get: function() {
          return [[AST]];
        }});
      Assignment = $__export("Assignment", (function($__super) {
        var Assignment = function Assignment(target, value) {
          assert.argumentTypes(target, AST, value, AST);
          $traceurRuntime.superConstructor(Assignment).call(this);
          this.target = target;
          this.value = value;
        };
        return ($traceurRuntime.createClass)(Assignment, {
          eval: function(context) {
            return this.target.assign(context, this.value.eval(context));
          },
          visit: function(visitor) {
            return visitor.visitAssignment(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(Assignment, "parameters", {get: function() {
          return [[AST], [AST]];
        }});
      MethodCall = $__export("MethodCall", (function($__super) {
        var MethodCall = function MethodCall(receiver, name, fn, args) {
          assert.argumentTypes(receiver, AST, name, assert.type.string, fn, Function, args, List);
          $traceurRuntime.superConstructor(MethodCall).call(this);
          this.receiver = receiver;
          this.fn = fn;
          this.args = args;
          this.name = name;
        };
        return ($traceurRuntime.createClass)(MethodCall, {
          eval: function(context) {
            var evaluatedContext = this.receiver.eval(context);
            var evaluatedArgs = evalList(context, this.args);
            while (evaluatedContext instanceof ContextWithVariableBindings) {
              if (evaluatedContext.hasBinding(this.name)) {
                var fn = evaluatedContext.get(this.name);
                return FunctionWrapper.apply(fn, evaluatedArgs);
              }
              evaluatedContext = evaluatedContext.parent;
            }
            return this.fn(evaluatedContext, evaluatedArgs);
          },
          visit: function(visitor) {
            return visitor.visitMethodCall(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(MethodCall, "parameters", {get: function() {
          return [[AST], [assert.type.string], [Function], [List]];
        }});
      FunctionCall = $__export("FunctionCall", (function($__super) {
        var FunctionCall = function FunctionCall(target, args) {
          assert.argumentTypes(target, AST, args, List);
          $traceurRuntime.superConstructor(FunctionCall).call(this);
          this.target = target;
          this.args = args;
        };
        return ($traceurRuntime.createClass)(FunctionCall, {
          eval: function(context) {
            var obj = this.target.eval(context);
            if (!(obj instanceof Function)) {
              throw new BaseException((obj + " is not a function"));
            }
            return FunctionWrapper.apply(obj, evalList(context, this.args));
          },
          visit: function(visitor) {
            return visitor.visitFunctionCall(this);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(FunctionCall, "parameters", {get: function() {
          return [[AST], [List]];
        }});
      ASTWithSource = $__export("ASTWithSource", (function($__super) {
        var ASTWithSource = function ASTWithSource(ast, source, location) {
          assert.argumentTypes(ast, AST, source, assert.type.string, location, assert.type.string);
          $traceurRuntime.superConstructor(ASTWithSource).call(this);
          this.source = source;
          this.location = location;
          this.ast = ast;
        };
        return ($traceurRuntime.createClass)(ASTWithSource, {
          eval: function(context) {
            return this.ast.eval(context);
          },
          get isAssignable() {
            return this.ast.isAssignable;
          },
          assign: function(context, value) {
            return this.ast.assign(context, value);
          },
          visit: function(visitor) {
            return this.ast.visit(visitor);
          },
          toString: function() {
            return assert.returnType(((this.source + " in " + this.location)), assert.type.string);
          }
        }, {}, $__super);
      }(AST)));
      Object.defineProperty(ASTWithSource, "parameters", {get: function() {
          return [[AST], [assert.type.string], [assert.type.string]];
        }});
      TemplateBinding = $__export("TemplateBinding", (function() {
        var TemplateBinding = function TemplateBinding(key, keyIsVar, name, expression) {
          assert.argumentTypes(key, assert.type.string, keyIsVar, assert.type.boolean, name, assert.type.string, expression, ASTWithSource);
          $traceurRuntime.superConstructor(TemplateBinding).call(this);
          this.key = key;
          this.keyIsVar = keyIsVar;
          this.name = name;
          this.expression = expression;
        };
        return ($traceurRuntime.createClass)(TemplateBinding, {}, {});
      }()));
      Object.defineProperty(TemplateBinding, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.boolean], [assert.type.string], [ASTWithSource]];
        }});
      AstVisitor = $__export("AstVisitor", (function() {
        var AstVisitor = function AstVisitor() {};
        return ($traceurRuntime.createClass)(AstVisitor, {
          visitAccessMember: function(ast) {
            assert.argumentTypes(ast, AccessMember);
          },
          visitAssignment: function(ast) {
            assert.argumentTypes(ast, Assignment);
          },
          visitBinary: function(ast) {
            assert.argumentTypes(ast, Binary);
          },
          visitChain: function(ast) {
            assert.argumentTypes(ast, Chain);
          },
          visitConditional: function(ast) {
            assert.argumentTypes(ast, Conditional);
          },
          visitPipe: function(ast) {
            assert.argumentTypes(ast, Pipe);
          },
          visitFunctionCall: function(ast) {
            assert.argumentTypes(ast, FunctionCall);
          },
          visitImplicitReceiver: function(ast) {
            assert.argumentTypes(ast, ImplicitReceiver);
          },
          visitKeyedAccess: function(ast) {
            assert.argumentTypes(ast, KeyedAccess);
          },
          visitLiteralArray: function(ast) {
            assert.argumentTypes(ast, LiteralArray);
          },
          visitLiteralMap: function(ast) {
            assert.argumentTypes(ast, LiteralMap);
          },
          visitLiteralPrimitive: function(ast) {
            assert.argumentTypes(ast, LiteralPrimitive);
          },
          visitMethodCall: function(ast) {
            assert.argumentTypes(ast, MethodCall);
          },
          visitPrefixNot: function(ast) {
            assert.argumentTypes(ast, PrefixNot);
          }
        }, {});
      }()));
      Object.defineProperty(AstVisitor.prototype.visitAccessMember, "parameters", {get: function() {
          return [[AccessMember]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitAssignment, "parameters", {get: function() {
          return [[Assignment]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitBinary, "parameters", {get: function() {
          return [[Binary]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitChain, "parameters", {get: function() {
          return [[Chain]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitConditional, "parameters", {get: function() {
          return [[Conditional]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitPipe, "parameters", {get: function() {
          return [[Pipe]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitFunctionCall, "parameters", {get: function() {
          return [[FunctionCall]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitImplicitReceiver, "parameters", {get: function() {
          return [[ImplicitReceiver]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitKeyedAccess, "parameters", {get: function() {
          return [[KeyedAccess]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitLiteralArray, "parameters", {get: function() {
          return [[LiteralArray]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitLiteralMap, "parameters", {get: function() {
          return [[LiteralMap]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitLiteralPrimitive, "parameters", {get: function() {
          return [[LiteralPrimitive]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitMethodCall, "parameters", {get: function() {
          return [[MethodCall]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitPrefixNot, "parameters", {get: function() {
          return [[PrefixNot]];
        }});
      _evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];
      Object.defineProperty(evalList, "parameters", {get: function() {
          return [[], [List]];
        }});
    }
  };
});



System.register("angular2/src/reflection/reflector", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./types"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/reflector";
  var assert,
      Type,
      isPresent,
      stringify,
      BaseException,
      List,
      ListWrapper,
      Map,
      MapWrapper,
      StringMapWrapper,
      SetterFn,
      GetterFn,
      MethodFn,
      Reflector;
  function _mergeMaps(target, config) {
    StringMapWrapper.forEach(config, (function(v, k) {
      return MapWrapper.set(target, k, v);
    }));
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      stringify = $__m.stringify;
      BaseException = $__m.BaseException;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      SetterFn = $__m.SetterFn;
      GetterFn = $__m.GetterFn;
      MethodFn = $__m.MethodFn;
      $__export("SetterFn", $__m.SetterFn);
      $__export("GetterFn", $__m.GetterFn);
      $__export("MethodFn", $__m.MethodFn);
    }],
    execute: function() {
      Reflector = $__export("Reflector", (function() {
        var Reflector = function Reflector(reflectionCapabilities) {
          this._typeInfo = MapWrapper.create();
          this._getters = MapWrapper.create();
          this._setters = MapWrapper.create();
          this._methods = MapWrapper.create();
          this.reflectionCapabilities = reflectionCapabilities;
        };
        return ($traceurRuntime.createClass)(Reflector, {
          registerType: function(type, typeInfo) {
            MapWrapper.set(this._typeInfo, type, typeInfo);
          },
          registerGetters: function(getters) {
            _mergeMaps(this._getters, getters);
          },
          registerSetters: function(setters) {
            _mergeMaps(this._setters, setters);
          },
          registerMethods: function(methods) {
            _mergeMaps(this._methods, methods);
          },
          factory: function(type) {
            assert.argumentTypes(type, Type);
            if (MapWrapper.contains(this._typeInfo, type)) {
              return assert.returnType((MapWrapper.get(this._typeInfo, type)["factory"]), Function);
            } else {
              return assert.returnType((this.reflectionCapabilities.factory(type)), Function);
            }
          },
          parameters: function(typeOfFunc) {
            if (MapWrapper.contains(this._typeInfo, typeOfFunc)) {
              return assert.returnType((MapWrapper.get(this._typeInfo, typeOfFunc)["parameters"]), List);
            } else {
              return assert.returnType((this.reflectionCapabilities.parameters(typeOfFunc)), List);
            }
          },
          annotations: function(typeOfFunc) {
            if (MapWrapper.contains(this._typeInfo, typeOfFunc)) {
              return assert.returnType((MapWrapper.get(this._typeInfo, typeOfFunc)["annotations"]), List);
            } else {
              return assert.returnType((this.reflectionCapabilities.annotations(typeOfFunc)), List);
            }
          },
          getter: function(name) {
            assert.argumentTypes(name, assert.type.string);
            if (MapWrapper.contains(this._getters, name)) {
              return assert.returnType((MapWrapper.get(this._getters, name)), GetterFn);
            } else {
              return assert.returnType((this.reflectionCapabilities.getter(name)), GetterFn);
            }
          },
          setter: function(name) {
            assert.argumentTypes(name, assert.type.string);
            if (MapWrapper.contains(this._setters, name)) {
              return assert.returnType((MapWrapper.get(this._setters, name)), SetterFn);
            } else {
              return assert.returnType((this.reflectionCapabilities.setter(name)), SetterFn);
            }
          },
          method: function(name) {
            assert.argumentTypes(name, assert.type.string);
            if (MapWrapper.contains(this._methods, name)) {
              return assert.returnType((MapWrapper.get(this._methods, name)), MethodFn);
            } else {
              return assert.returnType((this.reflectionCapabilities.method(name)), MethodFn);
            }
          }
        }, {});
      }()));
      Object.defineProperty(Reflector.prototype.factory, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(Reflector.prototype.getter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(Reflector.prototype.setter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(Reflector.prototype.method, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_mergeMaps, "parameters", {get: function() {
          return [[Map], []];
        }});
    }
  };
});



System.register("angular2/src/change_detection/exceptions", ["rtts_assert/rtts_assert", "./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/exceptions";
  var assert,
      ProtoRecord,
      ExpressionChangedAfterItHasBeenChecked,
      ChangeDetectionError;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
    }],
    execute: function() {
      ExpressionChangedAfterItHasBeenChecked = $__export("ExpressionChangedAfterItHasBeenChecked", (function($__super) {
        var ExpressionChangedAfterItHasBeenChecked = function ExpressionChangedAfterItHasBeenChecked(proto, change) {
          assert.argumentTypes(proto, ProtoRecord, change, assert.type.any);
          $traceurRuntime.superConstructor(ExpressionChangedAfterItHasBeenChecked).call(this);
          this.message = ("Expression '" + proto.expressionAsString + "' has changed after it was checked. ") + ("Previous value: '" + change.previousValue + "'. Current value: '" + change.currentValue + "'");
        };
        return ($traceurRuntime.createClass)(ExpressionChangedAfterItHasBeenChecked, {toString: function() {
            return assert.returnType((this.message), assert.type.string);
          }}, {}, $__super);
      }(Error)));
      Object.defineProperty(ExpressionChangedAfterItHasBeenChecked, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.any]];
        }});
      ChangeDetectionError = $__export("ChangeDetectionError", (function($__super) {
        var ChangeDetectionError = function ChangeDetectionError(proto, originalException) {
          assert.argumentTypes(proto, ProtoRecord, originalException, assert.type.any);
          $traceurRuntime.superConstructor(ChangeDetectionError).call(this);
          this.originalException = originalException;
          this.location = proto.expressionAsString;
          this.message = (this.originalException + " in [" + this.location + "]");
        };
        return ($traceurRuntime.createClass)(ChangeDetectionError, {toString: function() {
            return assert.returnType((this.message), assert.type.string);
          }}, {}, $__super);
      }(Error)));
      Object.defineProperty(ChangeDetectionError, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.any]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/change_detection_util", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./parser/context_with_variable_bindings", "./proto_record", "./exceptions", "./pipes/pipe", "./interfaces"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/change_detection_util";
  var assert,
      isPresent,
      isBlank,
      BaseException,
      Type,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      ContextWithVariableBindings,
      ProtoRecord,
      ExpressionChangedAfterItHasBeenChecked,
      NO_CHANGE,
      ChangeRecord,
      ChangeDetector,
      CHECK_ALWAYS,
      CHECK_ONCE,
      CHECKED,
      DETACHED,
      uninitialized,
      SimpleChange,
      _simpleChangesIndex,
      _simpleChanges,
      _changeRecordsIndex,
      _changeRecords,
      _singleElementList,
      ChangeDetectionUtil;
  function _simpleChange(previousValue, currentValue) {
    var index = _simpleChangesIndex++ % 20;
    var s = _simpleChanges[index];
    s.previousValue = previousValue;
    s.currentValue = currentValue;
    return s;
  }
  function _changeRecord(bindingMemento, change) {
    var index = _changeRecordsIndex++ % 20;
    var s = _changeRecords[index];
    s.bindingMemento = bindingMemento;
    s.change = change;
    return s;
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      Type = $__m.Type;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      ContextWithVariableBindings = $__m.ContextWithVariableBindings;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
    }, function($__m) {
      ExpressionChangedAfterItHasBeenChecked = $__m.ExpressionChangedAfterItHasBeenChecked;
    }, function($__m) {
      NO_CHANGE = $__m.NO_CHANGE;
    }, function($__m) {
      ChangeRecord = $__m.ChangeRecord;
      ChangeDetector = $__m.ChangeDetector;
      CHECK_ALWAYS = $__m.CHECK_ALWAYS;
      CHECK_ONCE = $__m.CHECK_ONCE;
      CHECKED = $__m.CHECKED;
      DETACHED = $__m.DETACHED;
    }],
    execute: function() {
      uninitialized = $__export("uninitialized", new Object());
      SimpleChange = $__export("SimpleChange", (function() {
        var SimpleChange = function SimpleChange(previousValue, currentValue) {
          assert.argumentTypes(previousValue, assert.type.any, currentValue, assert.type.any);
          this.previousValue = previousValue;
          this.currentValue = currentValue;
        };
        return ($traceurRuntime.createClass)(SimpleChange, {}, {});
      }()));
      Object.defineProperty(SimpleChange, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any]];
        }});
      _simpleChangesIndex = 0;
      _simpleChanges = [new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null)];
      _changeRecordsIndex = 0;
      _changeRecords = [new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null)];
      _singleElementList = [null];
      ChangeDetectionUtil = $__export("ChangeDetectionUtil", (function() {
        var ChangeDetectionUtil = function ChangeDetectionUtil() {};
        return ($traceurRuntime.createClass)(ChangeDetectionUtil, {}, {
          unitialized: function() {
            return uninitialized;
          },
          arrayFn0: function() {
            return [];
          },
          arrayFn1: function(a1) {
            return [a1];
          },
          arrayFn2: function(a1, a2) {
            return [a1, a2];
          },
          arrayFn3: function(a1, a2, a3) {
            return [a1, a2, a3];
          },
          arrayFn4: function(a1, a2, a3, a4) {
            return [a1, a2, a3, a4];
          },
          arrayFn5: function(a1, a2, a3, a4, a5) {
            return [a1, a2, a3, a4, a5];
          },
          arrayFn6: function(a1, a2, a3, a4, a5, a6) {
            return [a1, a2, a3, a4, a5, a6];
          },
          arrayFn7: function(a1, a2, a3, a4, a5, a6, a7) {
            return [a1, a2, a3, a4, a5, a6, a7];
          },
          arrayFn8: function(a1, a2, a3, a4, a5, a6, a7, a8) {
            return [a1, a2, a3, a4, a5, a6, a7, a8];
          },
          arrayFn9: function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            return [a1, a2, a3, a4, a5, a6, a7, a8, a9];
          },
          operation_negate: function(value) {
            return !value;
          },
          operation_add: function(left, right) {
            return left + right;
          },
          operation_subtract: function(left, right) {
            return left - right;
          },
          operation_multiply: function(left, right) {
            return left * right;
          },
          operation_divide: function(left, right) {
            return left / right;
          },
          operation_remainder: function(left, right) {
            return left % right;
          },
          operation_equals: function(left, right) {
            return left == right;
          },
          operation_not_equals: function(left, right) {
            return left != right;
          },
          operation_less_then: function(left, right) {
            return left < right;
          },
          operation_greater_then: function(left, right) {
            return left > right;
          },
          operation_less_or_equals_then: function(left, right) {
            return left <= right;
          },
          operation_greater_or_equals_then: function(left, right) {
            return left >= right;
          },
          operation_logical_and: function(left, right) {
            return left && right;
          },
          operation_logical_or: function(left, right) {
            return left || right;
          },
          cond: function(cond, trueVal, falseVal) {
            return cond ? trueVal : falseVal;
          },
          mapFn: function(keys) {
            function buildMap(values) {
              var res = StringMapWrapper.create();
              for (var i = 0; i < keys.length; ++i) {
                StringMapWrapper.set(res, keys[i], values[i]);
              }
              return res;
            }
            switch (keys.length) {
              case 0:
                return (function() {
                  return [];
                });
              case 1:
                return (function(a1) {
                  return buildMap([a1]);
                });
              case 2:
                return (function(a1, a2) {
                  return buildMap([a1, a2]);
                });
              case 3:
                return (function(a1, a2, a3) {
                  return buildMap([a1, a2, a3]);
                });
              case 4:
                return (function(a1, a2, a3, a4) {
                  return buildMap([a1, a2, a3, a4]);
                });
              case 5:
                return (function(a1, a2, a3, a4, a5) {
                  return buildMap([a1, a2, a3, a4, a5]);
                });
              case 6:
                return (function(a1, a2, a3, a4, a5, a6) {
                  return buildMap([a1, a2, a3, a4, a5, a6]);
                });
              case 7:
                return (function(a1, a2, a3, a4, a5, a6, a7) {
                  return buildMap([a1, a2, a3, a4, a5, a6, a7]);
                });
              case 8:
                return (function(a1, a2, a3, a4, a5, a6, a7, a8) {
                  return buildMap([a1, a2, a3, a4, a5, a6, a7, a8]);
                });
              case 9:
                return (function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                  return buildMap([a1, a2, a3, a4, a5, a6, a7, a8, a9]);
                });
              default:
                throw new BaseException("Does not support literal maps with more than 9 elements");
            }
          },
          keyedAccess: function(obj, args) {
            return obj[args[0]];
          },
          findContext: function(name, c) {
            assert.argumentTypes(name, assert.type.string, c, assert.type.any);
            while (c instanceof ContextWithVariableBindings) {
              if (c.hasBinding(name)) {
                return c;
              }
              c = c.parent;
            }
            return c;
          },
          noChangeMarker: function(value) {
            return assert.returnType((value === NO_CHANGE), assert.type.boolean);
          },
          throwOnChange: function(proto, change) {
            assert.argumentTypes(proto, ProtoRecord, change, assert.type.any);
            throw new ExpressionChangedAfterItHasBeenChecked(proto, change);
          },
          simpleChange: function(previousValue, currentValue) {
            assert.argumentTypes(previousValue, assert.type.any, currentValue, assert.type.any);
            return assert.returnType((_simpleChange(previousValue, currentValue)), SimpleChange);
          },
          changeRecord: function(memento, change) {
            assert.argumentTypes(memento, assert.type.any, change, assert.type.any);
            return assert.returnType((_changeRecord(memento, change)), ChangeRecord);
          },
          simpleChangeRecord: function(memento, previousValue, currentValue) {
            assert.argumentTypes(memento, assert.type.any, previousValue, assert.type.any, currentValue, assert.type.any);
            return assert.returnType((_changeRecord(memento, _simpleChange(previousValue, currentValue))), ChangeRecord);
          },
          addRecord: function(updatedRecords, changeRecord) {
            assert.argumentTypes(updatedRecords, List, changeRecord, ChangeRecord);
            if (isBlank(updatedRecords)) {
              updatedRecords = _singleElementList;
              updatedRecords[0] = changeRecord;
            } else if (updatedRecords === _singleElementList) {
              updatedRecords = [_singleElementList[0], changeRecord];
            } else {
              ListWrapper.push(updatedRecords, changeRecord);
            }
            return assert.returnType((updatedRecords), List);
          }
        });
      }()));
      Object.defineProperty(ChangeDetectionUtil.mapFn, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ChangeDetectionUtil.findContext, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(ChangeDetectionUtil.throwOnChange, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(ChangeDetectionUtil.simpleChange, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any]];
        }});
      Object.defineProperty(ChangeDetectionUtil.changeRecord, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any]];
        }});
      Object.defineProperty(ChangeDetectionUtil.simpleChangeRecord, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any], [assert.type.any]];
        }});
      Object.defineProperty(ChangeDetectionUtil.addRecord, "parameters", {get: function() {
          return [[List], [ChangeRecord]];
        }});
    }
  };
});



System.register("angular2/src/change_detection/dynamic_change_detector", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./parser/context_with_variable_bindings", "./abstract_change_detector", "./pipes/pipe_registry", "./change_detection_util", "./proto_record", "./exceptions"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/dynamic_change_detector";
  var assert,
      isPresent,
      isBlank,
      BaseException,
      FunctionWrapper,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      ContextWithVariableBindings,
      AbstractChangeDetector,
      PipeRegistry,
      ChangeDetectionUtil,
      SimpleChange,
      uninitialized,
      ProtoRecord,
      RECORD_TYPE_SELF,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_CONST,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_INTERPOLATE,
      ExpressionChangedAfterItHasBeenChecked,
      ChangeDetectionError,
      DynamicChangeDetector,
      _singleElementList;
  function isSame(a, b) {
    if (a === b)
      return true;
    if (a instanceof String && b instanceof String && a == b)
      return true;
    if ((a !== a) && (b !== b))
      return true;
    return false;
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      FunctionWrapper = $__m.FunctionWrapper;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      ContextWithVariableBindings = $__m.ContextWithVariableBindings;
    }, function($__m) {
      AbstractChangeDetector = $__m.AbstractChangeDetector;
    }, function($__m) {
      PipeRegistry = $__m.PipeRegistry;
    }, function($__m) {
      ChangeDetectionUtil = $__m.ChangeDetectionUtil;
      SimpleChange = $__m.SimpleChange;
      uninitialized = $__m.uninitialized;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      RECORD_TYPE_PROPERTY = $__m.RECORD_TYPE_PROPERTY;
      RECORD_TYPE_INVOKE_METHOD = $__m.RECORD_TYPE_INVOKE_METHOD;
      RECORD_TYPE_CONST = $__m.RECORD_TYPE_CONST;
      RECORD_TYPE_INVOKE_CLOSURE = $__m.RECORD_TYPE_INVOKE_CLOSURE;
      RECORD_TYPE_PRIMITIVE_OP = $__m.RECORD_TYPE_PRIMITIVE_OP;
      RECORD_TYPE_KEYED_ACCESS = $__m.RECORD_TYPE_KEYED_ACCESS;
      RECORD_TYPE_PIPE = $__m.RECORD_TYPE_PIPE;
      RECORD_TYPE_INTERPOLATE = $__m.RECORD_TYPE_INTERPOLATE;
    }, function($__m) {
      ExpressionChangedAfterItHasBeenChecked = $__m.ExpressionChangedAfterItHasBeenChecked;
      ChangeDetectionError = $__m.ChangeDetectionError;
    }],
    execute: function() {
      DynamicChangeDetector = $__export("DynamicChangeDetector", (function($__super) {
        var DynamicChangeDetector = function DynamicChangeDetector(dispatcher, pipeRegistry, protoRecords) {
          assert.argumentTypes(dispatcher, assert.type.any, pipeRegistry, PipeRegistry, protoRecords, assert.genericType(List, ProtoRecord));
          $traceurRuntime.superConstructor(DynamicChangeDetector).call(this);
          this.dispatcher = dispatcher;
          this.pipeRegistry = pipeRegistry;
          this.values = ListWrapper.createFixedSize(protoRecords.length + 1);
          this.pipes = ListWrapper.createFixedSize(protoRecords.length + 1);
          this.prevContexts = ListWrapper.createFixedSize(protoRecords.length + 1);
          this.changes = ListWrapper.createFixedSize(protoRecords.length + 1);
          ListWrapper.fill(this.values, uninitialized);
          ListWrapper.fill(this.pipes, null);
          ListWrapper.fill(this.prevContexts, uninitialized);
          ListWrapper.fill(this.changes, false);
          this.protos = protoRecords;
        };
        return ($traceurRuntime.createClass)(DynamicChangeDetector, {
          hydrate: function(context) {
            assert.argumentTypes(context, assert.type.any);
            this.values[0] = context;
          },
          dehydrate: function() {
            this._destroyPipes();
            ListWrapper.fill(this.values, uninitialized);
            ListWrapper.fill(this.changes, false);
            ListWrapper.fill(this.pipes, null);
            ListWrapper.fill(this.prevContexts, uninitialized);
          },
          _destroyPipes: function() {
            for (var i = 0; i < this.pipes.length; ++i) {
              if (isPresent(this.pipes[i])) {
                this.pipes[i].onDestroy();
              }
            }
          },
          hydrated: function() {
            return assert.returnType((this.values[0] !== uninitialized), assert.type.boolean);
          },
          detectChangesInRecords: function(throwOnChange) {
            assert.argumentTypes(throwOnChange, assert.type.boolean);
            var protos = assert.type(this.protos, assert.genericType(List, ProtoRecord));
            var updatedRecords = null;
            for (var i = 0; i < protos.length; ++i) {
              var proto = assert.type(protos[i], ProtoRecord);
              var change = this._check(proto);
              if (isPresent(change)) {
                var record = ChangeDetectionUtil.changeRecord(proto.bindingMemento, change);
                updatedRecords = ChangeDetectionUtil.addRecord(updatedRecords, record);
              }
              if (proto.lastInDirective && isPresent(updatedRecords)) {
                if (throwOnChange)
                  ChangeDetectionUtil.throwOnChange(proto, updatedRecords[0]);
                this.dispatcher.onRecordChange(proto.directiveMemento, updatedRecords);
                updatedRecords = null;
              }
            }
          },
          _check: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            try {
              if (proto.mode == RECORD_TYPE_PIPE) {
                return this._pipeCheck(proto);
              } else {
                return this._referenceCheck(proto);
              }
            } catch (e) {
              throw new ChangeDetectionError(proto, e);
            }
          },
          _referenceCheck: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            if (this._pureFuncAndArgsDidNotChange(proto)) {
              this._setChanged(proto, false);
              return null;
            }
            var prevValue = this._readSelf(proto);
            var currValue = this._calculateCurrValue(proto);
            if (!isSame(prevValue, currValue)) {
              this._writeSelf(proto, currValue);
              this._setChanged(proto, true);
              if (proto.lastInBinding) {
                return ChangeDetectionUtil.simpleChange(prevValue, currValue);
              } else {
                return null;
              }
            } else {
              this._setChanged(proto, false);
              return null;
            }
          },
          _calculateCurrValue: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            switch (proto.mode) {
              case RECORD_TYPE_SELF:
                return this._readContext(proto);
              case RECORD_TYPE_CONST:
                return proto.funcOrValue;
              case RECORD_TYPE_PROPERTY:
                var context = this._readContext(proto);
                var c = ChangeDetectionUtil.findContext(proto.name, context);
                if (c instanceof ContextWithVariableBindings) {
                  return c.get(proto.name);
                } else {
                  var propertyGetter = assert.type(proto.funcOrValue, Function);
                  return propertyGetter(c);
                }
                break;
              case RECORD_TYPE_INVOKE_METHOD:
                var context = this._readContext(proto);
                var args = this._readArgs(proto);
                var c = ChangeDetectionUtil.findContext(proto.name, context);
                if (c instanceof ContextWithVariableBindings) {
                  return FunctionWrapper.apply(c.get(proto.name), args);
                } else {
                  var methodInvoker = assert.type(proto.funcOrValue, Function);
                  return methodInvoker(c, args);
                }
                break;
              case RECORD_TYPE_KEYED_ACCESS:
                var arg = this._readArgs(proto)[0];
                return this._readContext(proto)[arg];
              case RECORD_TYPE_INVOKE_CLOSURE:
                return FunctionWrapper.apply(this._readContext(proto), this._readArgs(proto));
              case RECORD_TYPE_INTERPOLATE:
              case RECORD_TYPE_PRIMITIVE_OP:
                return FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto));
              default:
                throw new BaseException(("Unknown operation " + proto.mode));
            }
          },
          _pipeCheck: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            var context = this._readContext(proto);
            var pipe = this._pipeFor(proto, context);
            var newValue = pipe.transform(context);
            if (!ChangeDetectionUtil.noChangeMarker(newValue)) {
              var prevValue = this._readSelf(proto);
              this._writeSelf(proto, newValue);
              this._setChanged(proto, true);
              if (proto.lastInBinding) {
                return ChangeDetectionUtil.simpleChange(prevValue, newValue);
              } else {
                return null;
              }
            } else {
              this._setChanged(proto, false);
              return null;
            }
          },
          _pipeFor: function(proto, context) {
            assert.argumentTypes(proto, ProtoRecord, context, assert.type.any);
            var storedPipe = this._readPipe(proto);
            if (isPresent(storedPipe) && storedPipe.supports(context)) {
              return storedPipe;
            }
            if (isPresent(storedPipe)) {
              storedPipe.onDestroy();
            }
            var pipe = this.pipeRegistry.get(proto.name, context);
            this._writePipe(proto, pipe);
            return pipe;
          },
          _readContext: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            return this.values[proto.contextIndex];
          },
          _readSelf: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            return this.values[proto.selfIndex];
          },
          _writeSelf: function(proto, value) {
            assert.argumentTypes(proto, ProtoRecord, value, assert.type.any);
            this.values[proto.selfIndex] = value;
          },
          _readPipe: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            return this.pipes[proto.selfIndex];
          },
          _writePipe: function(proto, value) {
            assert.argumentTypes(proto, ProtoRecord, value, assert.type.any);
            this.pipes[proto.selfIndex] = value;
          },
          _setChanged: function(proto, value) {
            assert.argumentTypes(proto, ProtoRecord, value, assert.type.boolean);
            this.changes[proto.selfIndex] = value;
          },
          _pureFuncAndArgsDidNotChange: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            return assert.returnType((proto.isPureFunction() && !this._argsChanged(proto)), assert.type.boolean);
          },
          _argsChanged: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            var args = proto.args;
            for (var i = 0; i < args.length; ++i) {
              if (this.changes[args[i]]) {
                return assert.returnType((true), assert.type.boolean);
              }
            }
            return assert.returnType((false), assert.type.boolean);
          },
          _readArgs: function(proto) {
            assert.argumentTypes(proto, ProtoRecord);
            var res = ListWrapper.createFixedSize(proto.args.length);
            var args = proto.args;
            for (var i = 0; i < args.length; ++i) {
              res[i] = this.values[args[i]];
            }
            return res;
          }
        }, {}, $__super);
      }(AbstractChangeDetector)));
      Object.defineProperty(DynamicChangeDetector, "parameters", {get: function() {
          return [[assert.type.any], [PipeRegistry], [assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype.hydrate, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype.detectChangesInRecords, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._check, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._referenceCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._calculateCurrValue, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._pipeCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._pipeFor, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readContext, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readSelf, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._writeSelf, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readPipe, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._writePipe, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._setChanged, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.boolean]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._argsChanged, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readArgs, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      _singleElementList = [null];
    }
  };
});



System.register("angular2/src/di/key", ["rtts_assert/rtts_assert", "./exceptions", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/key";
  var assert,
      KeyMetadataError,
      MapWrapper,
      Map,
      int,
      isPresent,
      Key,
      KeyRegistry,
      _globalKeyRegistry;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      KeyMetadataError = $__m.KeyMetadataError;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
    }, function($__m) {
      int = $__m.int;
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      Key = $__export("Key", (function() {
        var Key = function Key(token, id) {
          assert.argumentTypes(token, assert.type.any, id, int);
          this.token = token;
          this.id = id;
          this.metadata = null;
        };
        return ($traceurRuntime.createClass)(Key, {}, {
          setMetadata: function(key, metadata) {
            assert.argumentTypes(key, Key, metadata, assert.type.any);
            if (isPresent(key.metadata) && key.metadata !== metadata) {
              throw new KeyMetadataError();
            }
            key.metadata = metadata;
            return assert.returnType((key), Key);
          },
          get: function(token) {
            return assert.returnType((_globalKeyRegistry.get(token)), Key);
          },
          get numberOfKeys() {
            return assert.returnType((_globalKeyRegistry.numberOfKeys), int);
          }
        });
      }()));
      Object.defineProperty(Key, "parameters", {get: function() {
          return [[], [int]];
        }});
      Object.defineProperty(Key.setMetadata, "parameters", {get: function() {
          return [[Key], []];
        }});
      KeyRegistry = $__export("KeyRegistry", (function() {
        var KeyRegistry = function KeyRegistry() {
          this._allKeys = MapWrapper.create();
        };
        return ($traceurRuntime.createClass)(KeyRegistry, {
          get: function(token) {
            if (token instanceof Key)
              return assert.returnType((token), Key);
            if (MapWrapper.contains(this._allKeys, token)) {
              return assert.returnType((MapWrapper.get(this._allKeys, token)), Key);
            }
            var newKey = new Key(token, Key.numberOfKeys);
            MapWrapper.set(this._allKeys, token, newKey);
            return assert.returnType((newKey), Key);
          },
          get numberOfKeys() {
            return assert.returnType((MapWrapper.size(this._allKeys)), int);
          }
        }, {});
      }()));
      _globalKeyRegistry = new KeyRegistry();
    }
  };
});



System.register("angular2/src/dom/browser_adapter", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/facade/lang", "./dom_adapter", "./generic_browser_adapter"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/dom/browser_adapter";
  var assert,
      List,
      MapWrapper,
      ListWrapper,
      isPresent,
      setRootDomAdapter,
      GenericBrowserDomAdapter,
      _attrToPropMap,
      BrowserDomAdapter;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      setRootDomAdapter = $__m.setRootDomAdapter;
    }, function($__m) {
      GenericBrowserDomAdapter = $__m.GenericBrowserDomAdapter;
    }],
    execute: function() {
      _attrToPropMap = {
        'innerHtml': 'innerHTML',
        'readonly': 'readOnly',
        'tabindex': 'tabIndex'
      };
      BrowserDomAdapter = $__export("BrowserDomAdapter", (function($__super) {
        var BrowserDomAdapter = function BrowserDomAdapter() {
          $traceurRuntime.superConstructor(BrowserDomAdapter).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(BrowserDomAdapter, {
          get attrToPropMap() {
            return _attrToPropMap;
          },
          query: function(selector) {
            assert.argumentTypes(selector, assert.type.string);
            return document.querySelector(selector);
          },
          querySelector: function(el, selector) {
            assert.argumentTypes(el, assert.type.any, selector, assert.type.string);
            return assert.returnType((el.querySelector(selector)), Node);
          },
          querySelectorAll: function(el, selector) {
            assert.argumentTypes(el, assert.type.any, selector, assert.type.string);
            return assert.returnType((el.querySelectorAll(selector)), NodeList);
          },
          on: function(el, evt, listener) {
            el.addEventListener(evt, listener, false);
          },
          dispatchEvent: function(el, evt) {
            el.dispatchEvent(evt);
          },
          createMouseEvent: function(eventType) {
            var evt = new MouseEvent(eventType);
            evt.initEvent(eventType, true, true);
            return evt;
          },
          createEvent: function(eventType) {
            return new Event(eventType, true);
          },
          getInnerHTML: function(el) {
            return el.innerHTML;
          },
          getOuterHTML: function(el) {
            return el.outerHTML;
          },
          nodeName: function(node) {
            assert.argumentTypes(node, Node);
            return assert.returnType((node.nodeName), assert.type.string);
          },
          nodeValue: function(node) {
            assert.argumentTypes(node, Node);
            return assert.returnType((node.nodeValue), assert.type.string);
          },
          type: function(node) {
            assert.argumentTypes(node, assert.type.string);
            return node.type;
          },
          content: function(node) {
            assert.argumentTypes(node, HTMLTemplateElement);
            return assert.returnType((node.content), Node);
          },
          firstChild: function(el) {
            return assert.returnType((el.firstChild), Node);
          },
          nextSibling: function(el) {
            return assert.returnType((el.nextSibling), Node);
          },
          parentElement: function(el) {
            return el.parentElement;
          },
          childNodes: function(el) {
            return assert.returnType((el.childNodes), NodeList);
          },
          childNodesAsList: function(el) {
            var childNodes = el.childNodes;
            var res = ListWrapper.createFixedSize(childNodes.length);
            for (var i = 0; i < childNodes.length; i++) {
              res[i] = childNodes[i];
            }
            return assert.returnType((res), List);
          },
          clearNodes: function(el) {
            for (var i = 0; i < el.childNodes.length; i++) {
              this.remove(el.childNodes[i]);
            }
          },
          appendChild: function(el, node) {
            el.appendChild(node);
          },
          removeChild: function(el, node) {
            el.removeChild(node);
          },
          remove: function(el) {
            var parent = el.parentNode;
            parent.removeChild(el);
            return el;
          },
          insertBefore: function(el, node) {
            el.parentNode.insertBefore(node, el);
          },
          insertAllBefore: function(el, nodes) {
            ListWrapper.forEach(nodes, (function(n) {
              el.parentNode.insertBefore(n, el);
            }));
          },
          insertAfter: function(el, node) {
            el.parentNode.insertBefore(node, el.nextSibling);
          },
          setInnerHTML: function(el, value) {
            el.innerHTML = value;
          },
          getText: function(el) {
            return el.textContent;
          },
          setText: function(el, value) {
            assert.argumentTypes(el, assert.type.any, value, assert.type.string);
            el.textContent = value;
          },
          getValue: function(el) {
            return el.value;
          },
          setValue: function(el, value) {
            assert.argumentTypes(el, assert.type.any, value, assert.type.string);
            el.value = value;
          },
          getChecked: function(el) {
            return el.checked;
          },
          setChecked: function(el, value) {
            assert.argumentTypes(el, assert.type.any, value, assert.type.boolean);
            el.checked = value;
          },
          createTemplate: function(html) {
            var t = document.createElement('template');
            t.innerHTML = html;
            return t;
          },
          createElement: function(tagName) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : document;
            return doc.createElement(tagName);
          },
          createTextNode: function(text) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : document;
            assert.argumentTypes(text, assert.type.string, doc, assert.type.any);
            return doc.createTextNode(text);
          },
          createScriptTag: function(attrName, attrValue) {
            var doc = arguments[2] !== (void 0) ? arguments[2] : document;
            assert.argumentTypes(attrName, assert.type.string, attrValue, assert.type.string, doc, assert.type.any);
            var el = doc.createElement('SCRIPT');
            el.setAttribute(attrName, attrValue);
            return el;
          },
          createStyleElement: function(css) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : document;
            assert.argumentTypes(css, assert.type.string, doc, assert.type.any);
            var style = doc.createElement('STYLE');
            style.innerText = css;
            return assert.returnType((style), HTMLStyleElement);
          },
          createShadowRoot: function(el) {
            assert.argumentTypes(el, HTMLElement);
            return assert.returnType((el.createShadowRoot()), ShadowRoot);
          },
          getShadowRoot: function(el) {
            assert.argumentTypes(el, HTMLElement);
            return assert.returnType((el.shadowRoot), ShadowRoot);
          },
          clone: function(node) {
            assert.argumentTypes(node, Node);
            return node.cloneNode(true);
          },
          hasProperty: function(element, name) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string);
            return name in element;
          },
          getElementsByClassName: function(element, name) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string);
            return element.getElementsByClassName(name);
          },
          getElementsByTagName: function(element, name) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string);
            return element.getElementsByTagName(name);
          },
          classList: function(element) {
            return assert.returnType((Array.prototype.slice.call(element.classList, 0)), List);
          },
          addClass: function(element, classname) {
            assert.argumentTypes(element, assert.type.any, classname, assert.type.string);
            element.classList.add(classname);
          },
          removeClass: function(element, classname) {
            assert.argumentTypes(element, assert.type.any, classname, assert.type.string);
            element.classList.remove(classname);
          },
          hasClass: function(element, classname) {
            assert.argumentTypes(element, assert.type.any, classname, assert.type.string);
            return element.classList.contains(classname);
          },
          setStyle: function(element, stylename, stylevalue) {
            assert.argumentTypes(element, assert.type.any, stylename, assert.type.string, stylevalue, assert.type.string);
            element.style[stylename] = stylevalue;
          },
          removeStyle: function(element, stylename) {
            assert.argumentTypes(element, assert.type.any, stylename, assert.type.string);
            element.style[stylename] = null;
          },
          getStyle: function(element, stylename) {
            assert.argumentTypes(element, assert.type.any, stylename, assert.type.string);
            return element.style[stylename];
          },
          tagName: function(element) {
            return assert.returnType((element.tagName), assert.type.string);
          },
          attributeMap: function(element) {
            var res = MapWrapper.create();
            var elAttrs = element.attributes;
            for (var i = 0; i < elAttrs.length; i++) {
              var attrib = elAttrs[i];
              MapWrapper.set(res, attrib.name, attrib.value);
            }
            return res;
          },
          getAttribute: function(element, attribute) {
            assert.argumentTypes(element, assert.type.any, attribute, assert.type.string);
            return element.getAttribute(attribute);
          },
          setAttribute: function(element, name, value) {
            assert.argumentTypes(element, assert.type.any, name, assert.type.string, value, assert.type.string);
            element.setAttribute(name, value);
          },
          removeAttribute: function(element, attribute) {
            assert.argumentTypes(element, assert.type.any, attribute, assert.type.string);
            return element.removeAttribute(attribute);
          },
          templateAwareRoot: function(el) {
            return el instanceof HTMLTemplateElement ? el.content : el;
          },
          createHtmlDocument: function() {
            return document.implementation.createHTMLDocument();
          },
          defaultDoc: function() {
            return document;
          },
          getTitle: function() {
            return document.title;
          },
          setTitle: function(newTitle) {
            assert.argumentTypes(newTitle, assert.type.string);
            document.title = newTitle;
          },
          elementMatches: function(n, selector) {
            assert.argumentTypes(n, assert.type.any, selector, assert.type.string);
            return assert.returnType((n instanceof HTMLElement && n.matches(selector)), assert.type.boolean);
          },
          isTemplateElement: function(el) {
            assert.argumentTypes(el, assert.type.any);
            return assert.returnType((el instanceof HTMLTemplateElement), assert.type.boolean);
          },
          isTextNode: function(node) {
            assert.argumentTypes(node, Node);
            return assert.returnType((node.nodeType === Node.TEXT_NODE), assert.type.boolean);
          },
          isCommentNode: function(node) {
            assert.argumentTypes(node, Node);
            return assert.returnType((node.nodeType === Node.TEXT_NODE), assert.type.boolean);
          },
          isElementNode: function(node) {
            assert.argumentTypes(node, Node);
            return assert.returnType((node.nodeType === Node.ELEMENT_NODE), assert.type.boolean);
          },
          hasShadowRoot: function(node) {
            return assert.returnType((node instanceof HTMLElement && isPresent(node.shadowRoot)), assert.type.boolean);
          },
          importIntoDoc: function(node) {
            assert.argumentTypes(node, Node);
            var result = document.importNode(node, true);
            if (this.isTemplateElement(result) && !result.content.childNodes.length && node.content.childNodes.length) {
              var childNodes = node.content.childNodes;
              for (var i = 0; i < childNodes.length; ++i) {
                result.content.appendChild(this.importIntoDoc(childNodes[i]));
              }
            }
            return result;
          },
          isPageRule: function(rule) {
            return assert.returnType((rule.type === CSSRule.PAGE_RULE), assert.type.boolean);
          },
          isStyleRule: function(rule) {
            return assert.returnType((rule.type === CSSRule.STYLE_RULE), assert.type.boolean);
          },
          isMediaRule: function(rule) {
            return assert.returnType((rule.type === CSSRule.MEDIA_RULE), assert.type.boolean);
          },
          isKeyframesRule: function(rule) {
            return assert.returnType((rule.type === CSSRule.KEYFRAMES_RULE), assert.type.boolean);
          },
          getHref: function(el) {
            assert.argumentTypes(el, Element);
            return assert.returnType((el.href), assert.type.string);
          }
        }, {makeCurrent: function() {
            setRootDomAdapter(new BrowserDomAdapter());
          }}, $__super);
      }(GenericBrowserDomAdapter)));
      Object.defineProperty(BrowserDomAdapter.prototype.query, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.querySelector, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.querySelectorAll, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.nodeName, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.nodeValue, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.type, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.content, "parameters", {get: function() {
          return [[HTMLTemplateElement]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setText, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setValue, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setChecked, "parameters", {get: function() {
          return [[], [assert.type.boolean]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createTextNode, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createScriptTag, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createStyleElement, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createShadowRoot, "parameters", {get: function() {
          return [[HTMLElement]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getShadowRoot, "parameters", {get: function() {
          return [[HTMLElement]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.clone, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.hasProperty, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getElementsByClassName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getElementsByTagName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.addClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.removeClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.hasClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setStyle, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.removeStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setAttribute, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.removeAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setTitle, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.elementMatches, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isTemplateElement, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isTextNode, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isCommentNode, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isElementNode, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.importIntoDoc, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getHref, "parameters", {get: function() {
          return [[Element]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/directive_metadata_reader", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "../annotations/annotations", "./directive_metadata", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/directive_metadata_reader";
  var assert,
      Type,
      isPresent,
      BaseException,
      stringify,
      Directive,
      DirectiveMetadata,
      reflector,
      DirectiveMetadataReader;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      stringify = $__m.stringify;
    }, function($__m) {
      Directive = $__m.Directive;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
      DirectiveMetadataReader = $__export("DirectiveMetadataReader", (function() {
        var DirectiveMetadataReader = function DirectiveMetadataReader() {};
        return ($traceurRuntime.createClass)(DirectiveMetadataReader, {read: function(type) {
            assert.argumentTypes(type, Type);
            var annotations = reflector.annotations(type);
            if (isPresent(annotations)) {
              for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                if (annotation instanceof Directive) {
                  return assert.returnType((new DirectiveMetadata(type, annotation)), DirectiveMetadata);
                }
              }
            }
            throw new BaseException(("No Directive annotation found on " + stringify(type)));
          }}, {});
      }()));
      Object.defineProperty(DirectiveMetadataReader.prototype.read, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});



System.register("angular2/src/core/events/event_manager", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/core/zone/vm_turn_zone"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/events/event_manager";
  var assert,
      isBlank,
      BaseException,
      isPresent,
      StringWrapper,
      DOM,
      List,
      ListWrapper,
      MapWrapper,
      VmTurnZone,
      BUBBLE_SYMBOL,
      EventManager,
      EventManagerPlugin,
      DomEventsPlugin;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      isPresent = $__m.isPresent;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }],
    execute: function() {
      BUBBLE_SYMBOL = '^';
      EventManager = $__export("EventManager", (function() {
        var EventManager = function EventManager(plugins, zone) {
          assert.argumentTypes(plugins, assert.genericType(List, EventManagerPlugin), zone, VmTurnZone);
          this._zone = zone;
          this._plugins = plugins;
          for (var i = 0; i < plugins.length; i++) {
            plugins[i].manager = this;
          }
        };
        return ($traceurRuntime.createClass)(EventManager, {
          addEventListener: function(element, eventName, handler) {
            assert.argumentTypes(element, assert.type.any, eventName, assert.type.string, handler, Function);
            var shouldSupportBubble = eventName[0] == BUBBLE_SYMBOL;
            if (shouldSupportBubble) {
              eventName = StringWrapper.substring(eventName, 1);
            }
            var plugin = this._findPluginFor(eventName);
            plugin.addEventListener(element, eventName, handler, shouldSupportBubble);
          },
          getZone: function() {
            return assert.returnType((this._zone), VmTurnZone);
          },
          _findPluginFor: function(eventName) {
            assert.argumentTypes(eventName, assert.type.string);
            var plugins = this._plugins;
            for (var i = 0; i < plugins.length; i++) {
              var plugin = plugins[i];
              if (plugin.supports(eventName)) {
                return assert.returnType((plugin), EventManagerPlugin);
              }
            }
            throw new BaseException(("No event manager plugin found for event " + eventName));
          }
        }, {});
      }()));
      Object.defineProperty(EventManager, "parameters", {get: function() {
          return [[assert.genericType(List, EventManagerPlugin)], [VmTurnZone]];
        }});
      Object.defineProperty(EventManager.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function]];
        }});
      Object.defineProperty(EventManager.prototype._findPluginFor, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      EventManagerPlugin = $__export("EventManagerPlugin", (function() {
        var EventManagerPlugin = function EventManagerPlugin() {};
        return ($traceurRuntime.createClass)(EventManagerPlugin, {
          supports: function(eventName) {
            assert.argumentTypes(eventName, assert.type.string);
            return assert.returnType((false), assert.type.boolean);
          },
          addEventListener: function(element, eventName, handler, shouldSupportBubble) {
            assert.argumentTypes(element, assert.type.any, eventName, assert.type.string, handler, Function, shouldSupportBubble, assert.type.boolean);
            throw "not implemented";
          }
        }, {});
      }()));
      Object.defineProperty(EventManagerPlugin.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(EventManagerPlugin.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
      DomEventsPlugin = $__export("DomEventsPlugin", (function($__super) {
        var DomEventsPlugin = function DomEventsPlugin() {
          $traceurRuntime.superConstructor(DomEventsPlugin).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(DomEventsPlugin, {
          supports: function(eventName) {
            assert.argumentTypes(eventName, assert.type.string);
            return assert.returnType((true), assert.type.boolean);
          },
          addEventListener: function(element, eventName, handler, shouldSupportBubble) {
            assert.argumentTypes(element, assert.type.any, eventName, assert.type.string, handler, Function, shouldSupportBubble, assert.type.boolean);
            var outsideHandler = shouldSupportBubble ? DomEventsPlugin.bubbleCallback(element, handler, this.manager._zone) : DomEventsPlugin.sameElementCallback(element, handler, this.manager._zone);
            this.manager._zone.runOutsideAngular((function() {
              DOM.on(element, eventName, outsideHandler);
            }));
          }
        }, {
          sameElementCallback: function(element, handler, zone) {
            return (function(event) {
              if (event.target === element) {
                zone.run((function() {
                  return handler(event);
                }));
              }
            });
          },
          bubbleCallback: function(element, handler, zone) {
            return (function(event) {
              return zone.run((function() {
                return handler(event);
              }));
            });
          }
        }, $__super);
      }(EventManagerPlugin)));
      Object.defineProperty(DomEventsPlugin.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomEventsPlugin.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/shadow_dom_emulation/content_tag", ["rtts_assert/rtts_assert", "../../annotations/annotations", "./light_dom", "angular2/di", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/core/dom/element"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/shadow_dom_emulation/content_tag";
  var assert,
      Decorator,
      ldModule,
      Inject,
      DOM,
      isPresent,
      List,
      ListWrapper,
      NgElement,
      ContentStrategy,
      RenderedContent,
      IntermediateContent,
      Content;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Decorator = $__m.Decorator;
    }, function($__m) {
      ldModule = $__m;
    }, function($__m) {
      Inject = $__m.Inject;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }],
    execute: function() {
      ContentStrategy = (function() {
        var ContentStrategy = function ContentStrategy() {};
        return ($traceurRuntime.createClass)(ContentStrategy, {insert: function(nodes) {
            assert.argumentTypes(nodes, List);
          }}, {});
      }());
      Object.defineProperty(ContentStrategy.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
      RenderedContent = (function($__super) {
        var RenderedContent = function RenderedContent(contentEl) {
          $traceurRuntime.superConstructor(RenderedContent).call(this);
          this._replaceContentElementWithScriptTags(contentEl);
          this.nodes = [];
        };
        return ($traceurRuntime.createClass)(RenderedContent, {
          _scriptTemplate: function() {
            if (!isPresent(RenderedContent._lazyScriptTemplate)) {
              RenderedContent._lazyScriptTemplate = DOM.createScriptTag('type', 'ng/content');
            }
            return RenderedContent._lazyScriptTemplate;
          },
          insert: function(nodes) {
            assert.argumentTypes(nodes, List);
            this.nodes = nodes;
            DOM.insertAllBefore(this.endScript, nodes);
            this._removeNodesUntil(ListWrapper.isEmpty(nodes) ? this.endScript : nodes[0]);
          },
          _replaceContentElementWithScriptTags: function(contentEl) {
            this.beginScript = DOM.clone(this._scriptTemplate());
            this.endScript = DOM.clone(this._scriptTemplate());
            DOM.insertBefore(contentEl, this.beginScript);
            DOM.insertBefore(contentEl, this.endScript);
            DOM.removeChild(DOM.parentElement(contentEl), contentEl);
          },
          _removeNodesUntil: function(node) {
            var p = DOM.parentElement(this.beginScript);
            for (var next = DOM.nextSibling(this.beginScript); next !== node; next = DOM.nextSibling(this.beginScript)) {
              DOM.removeChild(p, next);
            }
          }
        }, {}, $__super);
      }(ContentStrategy));
      Object.defineProperty(RenderedContent.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
      IntermediateContent = (function($__super) {
        var IntermediateContent = function IntermediateContent(destinationLightDom) {
          assert.argumentTypes(destinationLightDom, ldModule.LightDom);
          $traceurRuntime.superConstructor(IntermediateContent).call(this);
          this.destinationLightDom = destinationLightDom;
          this.nodes = [];
        };
        return ($traceurRuntime.createClass)(IntermediateContent, {insert: function(nodes) {
            assert.argumentTypes(nodes, List);
            this.nodes = nodes;
            this.destinationLightDom.redistribute();
          }}, {}, $__super);
      }(ContentStrategy));
      Object.defineProperty(IntermediateContent, "parameters", {get: function() {
          return [[ldModule.LightDom]];
        }});
      Object.defineProperty(IntermediateContent.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
      Content = $__export("Content", (function() {
        var Content = function Content(destinationLightDom, contentEl) {
          assert.argumentTypes(destinationLightDom, assert.type.any, contentEl, NgElement);
          this.select = contentEl.getAttribute('select');
          this._strategy = isPresent(destinationLightDom) ? new IntermediateContent(destinationLightDom) : new RenderedContent(contentEl.domElement);
        };
        return ($traceurRuntime.createClass)(Content, {
          nodes: function() {
            return assert.returnType((this._strategy.nodes), List);
          },
          insert: function(nodes) {
            assert.argumentTypes(nodes, List);
            this._strategy.insert(nodes);
          }
        }, {});
      }()));
      Object.defineProperty(Content, "annotations", {get: function() {
          return [new Decorator({selector: 'content'})];
        }});
      Object.defineProperty(Content, "parameters", {get: function() {
          return [[new Inject(ldModule.DestinationLightDom)], [NgElement]];
        }});
      Object.defineProperty(Content.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/style_url_resolver", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "./url_resolver"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/style_url_resolver";
  var assert,
      RegExp,
      RegExpWrapper,
      StringWrapper,
      UrlResolver,
      StyleUrlResolver,
      _cssUrlRe,
      _cssImportRe,
      _quoteRe;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      RegExp = $__m.RegExp;
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }],
    execute: function() {
      StyleUrlResolver = $__export("StyleUrlResolver", (function() {
        var StyleUrlResolver = function StyleUrlResolver(resolver) {
          assert.argumentTypes(resolver, UrlResolver);
          this._resolver = resolver;
        };
        return ($traceurRuntime.createClass)(StyleUrlResolver, {
          resolveUrls: function(cssText, baseUrl) {
            assert.argumentTypes(cssText, assert.type.string, baseUrl, assert.type.string);
            cssText = this._replaceUrls(cssText, _cssUrlRe, baseUrl);
            cssText = this._replaceUrls(cssText, _cssImportRe, baseUrl);
            return cssText;
          },
          _replaceUrls: function(cssText, re, baseUrl) {
            var $__0 = this;
            assert.argumentTypes(cssText, assert.type.string, re, RegExp, baseUrl, assert.type.string);
            return StringWrapper.replaceAllMapped(cssText, re, (function(m) {
              var pre = m[1];
              var url = StringWrapper.replaceAll(m[2], _quoteRe, '');
              var post = m[3];
              var resolvedUrl = $__0._resolver.resolve(baseUrl, url);
              return pre + "'" + resolvedUrl + "'" + post;
            }));
          }
        }, {});
      }()));
      Object.defineProperty(StyleUrlResolver, "parameters", {get: function() {
          return [[UrlResolver]];
        }});
      Object.defineProperty(StyleUrlResolver.prototype.resolveUrls, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StyleUrlResolver.prototype._replaceUrls, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [assert.type.string]];
        }});
      _cssUrlRe = RegExpWrapper.create('(url\\()([^)]*)(\\))');
      _cssImportRe = RegExpWrapper.create('(@import[\\s]+(?!url\\())[\'"]([^\'"]*)[\'"](.*;)');
      _quoteRe = RegExpWrapper.create('[\'"]');
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/compile_element", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "../directive_metadata", "../../annotations/annotations", "../element_binder", "../element_injector", "../view", "./util", "angular2/change_detection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/compile_element";
  var assert,
      List,
      Map,
      ListWrapper,
      MapWrapper,
      DOM,
      int,
      isBlank,
      isPresent,
      Type,
      StringJoiner,
      assertionsEnabled,
      DirectiveMetadata,
      Decorator,
      Component,
      Viewport,
      ElementBinder,
      ProtoElementInjector,
      ProtoView,
      dashCaseToCamelCase,
      AST,
      CompileElement;
  function getElementDescription(domElement) {
    var buf = new StringJoiner();
    var atts = DOM.attributeMap(domElement);
    buf.add("<");
    buf.add(DOM.tagName(domElement).toLowerCase());
    addDescriptionAttribute(buf, "id", MapWrapper.get(atts, "id"));
    addDescriptionAttribute(buf, "class", MapWrapper.get(atts, "class"));
    MapWrapper.forEach(atts, (function(attValue, attName) {
      if (attName !== "id" && attName !== "class") {
        addDescriptionAttribute(buf, attName, attValue);
      }
    }));
    buf.add(">");
    return assert.returnType((buf.toString()), assert.type.string);
  }
  function addDescriptionAttribute(buffer, attName, attValue) {
    assert.argumentTypes(buffer, StringJoiner, attName, assert.type.string, attValue, assert.type.any);
    if (isPresent(attValue)) {
      if (attValue.length === 0) {
        buffer.add(' ' + attName);
      } else {
        buffer.add(' ' + attName + '="' + attValue + '"');
      }
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      List = $__m.List;
      Map = $__m.Map;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      Type = $__m.Type;
      StringJoiner = $__m.StringJoiner;
      assertionsEnabled = $__m.assertionsEnabled;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      Decorator = $__m.Decorator;
      Component = $__m.Component;
      Viewport = $__m.Viewport;
    }, function($__m) {
      ElementBinder = $__m.ElementBinder;
    }, function($__m) {
      ProtoElementInjector = $__m.ProtoElementInjector;
    }, function($__m) {
      ProtoView = $__m.ProtoView;
    }, function($__m) {
      dashCaseToCamelCase = $__m.dashCaseToCamelCase;
    }, function($__m) {
      AST = $__m.AST;
    }],
    execute: function() {
      CompileElement = $__export("CompileElement", (function() {
        var CompileElement = function CompileElement(element) {
          var compilationUnit = arguments[1] !== (void 0) ? arguments[1] : '';
          this.element = element;
          this._attrs = null;
          this._classList = null;
          this.textNodeBindings = null;
          this.propertyBindings = null;
          this.eventBindings = null;
          this.variableBindings = null;
          this.decoratorDirectives = null;
          this.viewportDirective = null;
          this.componentDirective = null;
          this._allDirectives = null;
          this.isViewRoot = false;
          this.hasBindings = false;
          this.inheritedProtoView = null;
          this.inheritedProtoElementInjector = null;
          this.inheritedElementBinder = null;
          this.distanceToParentInjector = 0;
          this.compileChildren = true;
          this.ignoreBindings = false;
          var tplDesc = assertionsEnabled() ? getElementDescription(element) : null;
          if (compilationUnit !== '') {
            this.elementDescription = compilationUnit;
            if (isPresent(tplDesc))
              this.elementDescription += ": " + tplDesc;
          } else {
            this.elementDescription = tplDesc;
          }
        };
        return ($traceurRuntime.createClass)(CompileElement, {
          refreshAttrs: function() {
            this._attrs = null;
          },
          attrs: function() {
            if (isBlank(this._attrs)) {
              this._attrs = DOM.attributeMap(this.element);
            }
            return assert.returnType((this._attrs), assert.genericType(Map, assert.type.string, assert.type.string));
          },
          refreshClassList: function() {
            this._classList = null;
          },
          classList: function() {
            if (isBlank(this._classList)) {
              this._classList = ListWrapper.create();
              var elClassList = DOM.classList(this.element);
              for (var i = 0; i < elClassList.length; i++) {
                ListWrapper.push(this._classList, elClassList[i]);
              }
            }
            return assert.returnType((this._classList), assert.genericType(List, assert.type.string));
          },
          addTextNodeBinding: function(indexInParent, expression) {
            assert.argumentTypes(indexInParent, int, expression, AST);
            if (isBlank(this.textNodeBindings)) {
              this.textNodeBindings = MapWrapper.create();
            }
            MapWrapper.set(this.textNodeBindings, indexInParent, expression);
          },
          addPropertyBinding: function(property, expression) {
            assert.argumentTypes(property, assert.type.string, expression, AST);
            if (isBlank(this.propertyBindings)) {
              this.propertyBindings = MapWrapper.create();
            }
            MapWrapper.set(this.propertyBindings, dashCaseToCamelCase(property), expression);
          },
          addVariableBinding: function(variableName, variableValue) {
            assert.argumentTypes(variableName, assert.type.string, variableValue, assert.type.string);
            if (isBlank(this.variableBindings)) {
              this.variableBindings = MapWrapper.create();
            }
            MapWrapper.set(this.variableBindings, variableValue, variableName);
          },
          addEventBinding: function(eventName, expression) {
            assert.argumentTypes(eventName, assert.type.string, expression, AST);
            if (isBlank(this.eventBindings)) {
              this.eventBindings = MapWrapper.create();
            }
            MapWrapper.set(this.eventBindings, eventName, expression);
          },
          addDirective: function(directive) {
            assert.argumentTypes(directive, DirectiveMetadata);
            var annotation = directive.annotation;
            this._allDirectives = null;
            if (annotation instanceof Decorator) {
              if (isBlank(this.decoratorDirectives)) {
                this.decoratorDirectives = ListWrapper.create();
              }
              ListWrapper.push(this.decoratorDirectives, directive);
              if (!annotation.compileChildren) {
                this.compileChildren = false;
              }
            } else if (annotation instanceof Viewport) {
              this.viewportDirective = directive;
            } else if (annotation instanceof Component) {
              this.componentDirective = directive;
            }
          },
          getAllDirectives: function() {
            if (this._allDirectives === null) {
              var directives = ListWrapper.create();
              if (isPresent(this.componentDirective)) {
                ListWrapper.push(directives, this.componentDirective);
              }
              if (isPresent(this.viewportDirective)) {
                ListWrapper.push(directives, this.viewportDirective);
              }
              if (isPresent(this.decoratorDirectives)) {
                directives = ListWrapper.concat(directives, this.decoratorDirectives);
              }
              this._allDirectives = directives;
            }
            return assert.returnType((this._allDirectives), assert.genericType(List, DirectiveMetadata));
          }
        }, {});
      }()));
      Object.defineProperty(CompileElement.prototype.addTextNodeBinding, "parameters", {get: function() {
          return [[int], [AST]];
        }});
      Object.defineProperty(CompileElement.prototype.addPropertyBinding, "parameters", {get: function() {
          return [[assert.type.string], [AST]];
        }});
      Object.defineProperty(CompileElement.prototype.addVariableBinding, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(CompileElement.prototype.addEventBinding, "parameters", {get: function() {
          return [[assert.type.string], [AST]];
        }});
      Object.defineProperty(CompileElement.prototype.addDirective, "parameters", {get: function() {
          return [[DirectiveMetadata]];
        }});
      Object.defineProperty(addDescriptionAttribute, "parameters", {get: function() {
          return [[StringJoiner], [assert.type.string], []];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/directive_parser", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "../selector", "../directive_metadata", "../../annotations/annotations", "./compile_step", "./compile_element", "./compile_control", "./element_binder_builder", "./util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/directive_parser";
  var assert,
      isPresent,
      isBlank,
      BaseException,
      assertionsEnabled,
      RegExpWrapper,
      List,
      MapWrapper,
      StringMapWrapper,
      DOM,
      SelectorMatcher,
      CssSelector,
      DirectiveMetadata,
      Component,
      Viewport,
      CompileStep,
      CompileElement,
      CompileControl,
      isSpecialProperty,
      dashCaseToCamelCase,
      camelCaseToDashCase,
      PROPERTY_BINDING_REGEXP,
      DirectiveParser;
  function updateMatchedProperties(matchedProperties, selector, directive) {
    if (assertionsEnabled()) {
      var attrs = selector.attrs;
      if (!isPresent(matchedProperties)) {
        matchedProperties = StringMapWrapper.create();
      }
      if (isPresent(attrs)) {
        for (var idx = 0; idx < attrs.length; idx += 2) {
          StringMapWrapper.set(matchedProperties, dashCaseToCamelCase(attrs[idx]), true);
        }
      }
      if (isPresent(directive.annotation) && isPresent(directive.annotation.bind)) {
        var bindMap = directive.annotation.bind;
        StringMapWrapper.forEach(bindMap, (function(value, key) {
          var bindProp = RegExpWrapper.firstMatch(PROPERTY_BINDING_REGEXP, value);
          if (isPresent(bindProp) && isPresent(bindProp[1])) {
            StringMapWrapper.set(matchedProperties, dashCaseToCamelCase(bindProp[1]), true);
          }
        }));
      }
    }
    return matchedProperties;
  }
  function checkDirectiveValidity(directive, current, isTemplateElement) {
    if (directive.annotation instanceof Viewport) {
      if (!isTemplateElement) {
        throw new BaseException("Viewport directives need to be placed on <template> elements or elements " + ("with template attribute - check " + current.elementDescription));
      } else if (isPresent(current.viewportDirective)) {
        throw new BaseException(("Only one viewport directive can be used per element - check " + current.elementDescription));
      }
    } else if (isTemplateElement) {
      throw new BaseException(("Only template directives are allowed on template elements - check " + current.elementDescription));
    } else if ((directive.annotation instanceof Component) && isPresent(current.componentDirective)) {
      throw new BaseException(("Multiple component directives not allowed on the same element - check " + current.elementDescription));
    }
  }
  function checkMissingDirectives(current, matchedProperties, isTemplateElement) {
    if (assertionsEnabled()) {
      var ppBindings = current.propertyBindings;
      if (isPresent(ppBindings)) {
        MapWrapper.forEach(ppBindings, (function(expression, prop) {
          if (!DOM.hasProperty(current.element, prop) && !isSpecialProperty(prop)) {
            if (!isPresent(matchedProperties) || !isPresent(StringMapWrapper.get(matchedProperties, prop))) {
              throw new BaseException(("Missing directive to handle '" + camelCaseToDashCase(prop) + "' in " + current.elementDescription));
            }
          }
        }));
      }
      if (isTemplateElement && !current.isViewRoot && !isPresent(current.viewportDirective)) {
        throw new BaseException(("Missing directive to handle: " + current.elementDescription));
      }
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      assertionsEnabled = $__m.assertionsEnabled;
      RegExpWrapper = $__m.RegExpWrapper;
    }, function($__m) {
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      SelectorMatcher = $__m.SelectorMatcher;
      CssSelector = $__m.CssSelector;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      Component = $__m.Component;
      Viewport = $__m.Viewport;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      isSpecialProperty = $__m.isSpecialProperty;
    }, function($__m) {
      dashCaseToCamelCase = $__m.dashCaseToCamelCase;
      camelCaseToDashCase = $__m.camelCaseToDashCase;
    }],
    execute: function() {
      PROPERTY_BINDING_REGEXP = RegExpWrapper.create('^ *([^\\s\\|]+)');
      DirectiveParser = $__export("DirectiveParser", (function($__super) {
        var DirectiveParser = function DirectiveParser(directives) {
          assert.argumentTypes(directives, assert.genericType(List, DirectiveMetadata));
          $traceurRuntime.superConstructor(DirectiveParser).call(this);
          var selector;
          this._selectorMatcher = new SelectorMatcher();
          for (var i = 0; i < directives.length; i++) {
            var directiveMetadata = directives[i];
            selector = CssSelector.parse(directiveMetadata.annotation.selector);
            this._selectorMatcher.addSelectable(selector, directiveMetadata);
          }
        };
        return ($traceurRuntime.createClass)(DirectiveParser, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var attrs = current.attrs();
            var classList = current.classList();
            var cssSelector = new CssSelector();
            cssSelector.setElement(DOM.nodeName(current.element));
            for (var i = 0; i < classList.length; i++) {
              cssSelector.addClassName(classList[i]);
            }
            MapWrapper.forEach(attrs, (function(attrValue, attrName) {
              cssSelector.addAttribute(attrName, attrValue);
            }));
            var isTemplateElement = DOM.isTemplateElement(current.element);
            var matchedProperties;
            this._selectorMatcher.match(cssSelector, (function(selector, directive) {
              matchedProperties = updateMatchedProperties(matchedProperties, selector, directive);
              checkDirectiveValidity(directive, current, isTemplateElement);
              current.addDirective(directive);
            }));
            checkMissingDirectives(current, matchedProperties, isTemplateElement);
          }}, {}, $__super);
      }(CompileStep)));
      Object.defineProperty(DirectiveParser, "parameters", {get: function() {
          return [[assert.genericType(List, DirectiveMetadata)]];
        }});
      Object.defineProperty(DirectiveParser.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
    }
  };
});



System.register("angular2/src/core/events/hammer_gestures", ["rtts_assert/rtts_assert", "./hammer_common", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/events/hammer_gestures";
  var assert,
      HammerGesturesPluginCommon,
      isPresent,
      BaseException,
      HammerGesturesPlugin;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      HammerGesturesPluginCommon = $__m.HammerGesturesPluginCommon;
    }, function($__m) {
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      HammerGesturesPlugin = $__export("HammerGesturesPlugin", (function($__super) {
        var HammerGesturesPlugin = function HammerGesturesPlugin() {
          $traceurRuntime.superConstructor(HammerGesturesPlugin).call(this);
        };
        return ($traceurRuntime.createClass)(HammerGesturesPlugin, {
          supports: function(eventName) {
            assert.argumentTypes(eventName, assert.type.string);
            if (!$traceurRuntime.superGet(this, HammerGesturesPlugin.prototype, "supports").call(this, eventName))
              return assert.returnType((false), assert.type.boolean);
            if (!isPresent(window.Hammer)) {
              throw new BaseException(("Hammer.js is not loaded, can not bind " + eventName + " event"));
            }
            return assert.returnType((true), assert.type.boolean);
          },
          addEventListener: function(element, eventName, handler, shouldSupportBubble) {
            assert.argumentTypes(element, assert.type.any, eventName, assert.type.string, handler, Function, shouldSupportBubble, assert.type.boolean);
            if (shouldSupportBubble)
              throw new BaseException('Hammer.js plugin does not support bubbling gestures.');
            var zone = this.manager.getZone();
            eventName = eventName.toLowerCase();
            zone.runOutsideAngular(function() {
              var mc = new Hammer(element);
              mc.get('pinch').set({enable: true});
              mc.get('rotate').set({enable: true});
              mc.on(eventName, function(eventObj) {
                zone.run(function() {
                  handler(eventObj);
                });
              });
            });
          }
        }, {}, $__super);
      }(HammerGesturesPluginCommon)));
      Object.defineProperty(HammerGesturesPlugin.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(HammerGesturesPlugin.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
    }
  };
});



System.register("angular2/directives", ["./src/directives/foreach", "./src/directives/if", "./src/directives/non_bindable", "./src/directives/switch"], function($__export) {
  "use strict";
  var __moduleName = "angular2/directives";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});



System.register("angular2/src/forms/model", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./validators"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/model";
  var assert,
      isPresent,
      StringMap,
      StringMapWrapper,
      nullValidator,
      controlGroupValidator,
      VALID,
      INVALID,
      AbstractControl,
      Control,
      ControlGroup;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      StringMap = $__m.StringMap;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      nullValidator = $__m.nullValidator;
      controlGroupValidator = $__m.controlGroupValidator;
    }],
    execute: function() {
      VALID = $__export("VALID", "VALID");
      INVALID = $__export("INVALID", "INVALID");
      AbstractControl = $__export("AbstractControl", (function() {
        var AbstractControl = function AbstractControl() {
          var validator = arguments[0] !== (void 0) ? arguments[0] : nullValidator;
          assert.argumentTypes(validator, Function);
          this.validator = validator;
          this._dirty = true;
        };
        return ($traceurRuntime.createClass)(AbstractControl, {
          get value() {
            this._updateIfNeeded();
            return this._value;
          },
          get status() {
            this._updateIfNeeded();
            return this._status;
          },
          get valid() {
            this._updateIfNeeded();
            return this._status === VALID;
          },
          get errors() {
            this._updateIfNeeded();
            return this._errors;
          },
          setParent: function(parent) {
            this._parent = parent;
          },
          _updateIfNeeded: function() {},
          _updateParent: function() {
            if (isPresent(this._parent)) {
              this._parent._controlChanged();
            }
          }
        }, {});
      }()));
      Object.defineProperty(AbstractControl, "parameters", {get: function() {
          return [[Function]];
        }});
      Control = $__export("Control", (function($__super) {
        var Control = function Control(value) {
          var validator = arguments[1] !== (void 0) ? arguments[1] : nullValidator;
          assert.argumentTypes(value, assert.type.any, validator, Function);
          $traceurRuntime.superConstructor(Control).call(this, validator);
          this._value = value;
        };
        return ($traceurRuntime.createClass)(Control, {
          updateValue: function(value) {
            assert.argumentTypes(value, assert.type.any);
            this._value = value;
            this._dirty = true;
            this._updateParent();
          },
          _updateIfNeeded: function() {
            if (this._dirty) {
              this._dirty = false;
              this._errors = this.validator(this);
              this._status = isPresent(this._errors) ? INVALID : VALID;
            }
          }
        }, {}, $__super);
      }(AbstractControl)));
      Object.defineProperty(Control, "parameters", {get: function() {
          return [[assert.type.any], [Function]];
        }});
      Object.defineProperty(Control.prototype.updateValue, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      ControlGroup = $__export("ControlGroup", (function($__super) {
        var ControlGroup = function ControlGroup(controls) {
          var optionals = arguments[1] !== (void 0) ? arguments[1] : null;
          var validator = arguments[2] !== (void 0) ? arguments[2] : controlGroupValidator;
          assert.argumentTypes(controls, assert.type.any, optionals, assert.type.any, validator, Function);
          $traceurRuntime.superConstructor(ControlGroup).call(this, validator);
          this.controls = controls;
          this.optionals = isPresent(optionals) ? optionals : {};
          this._setParentForControls();
        };
        return ($traceurRuntime.createClass)(ControlGroup, {
          include: function(controlName) {
            assert.argumentTypes(controlName, assert.type.string);
            this._dirty = true;
            StringMapWrapper.set(this.optionals, controlName, true);
          },
          exclude: function(controlName) {
            assert.argumentTypes(controlName, assert.type.string);
            this._dirty = true;
            StringMapWrapper.set(this.optionals, controlName, false);
          },
          contains: function(controlName) {
            assert.argumentTypes(controlName, assert.type.string);
            var c = StringMapWrapper.contains(this.controls, controlName);
            return c && this._included(controlName);
          },
          _setParentForControls: function() {
            var $__0 = this;
            StringMapWrapper.forEach(this.controls, (function(control, name) {
              control.setParent($__0);
            }));
          },
          _updateIfNeeded: function() {
            if (this._dirty) {
              this._dirty = false;
              this._value = this._reduceValue();
              this._errors = this.validator(this);
              this._status = isPresent(this._errors) ? INVALID : VALID;
            }
          },
          _reduceValue: function() {
            var $__0 = this;
            var newValue = {};
            StringMapWrapper.forEach(this.controls, (function(control, name) {
              if ($__0._included(name)) {
                newValue[name] = control.value;
              }
            }));
            return newValue;
          },
          _controlChanged: function() {
            this._dirty = true;
            this._updateParent();
          },
          _included: function(controlName) {
            assert.argumentTypes(controlName, assert.type.string);
            var isOptional = StringMapWrapper.contains(this.optionals, controlName);
            return assert.returnType((!isOptional || StringMapWrapper.get(this.optionals, controlName)), assert.type.boolean);
          }
        }, {}, $__super);
      }(AbstractControl)));
      Object.defineProperty(ControlGroup, "parameters", {get: function() {
          return [[], [], [Function]];
        }});
      Object.defineProperty(ControlGroup.prototype.include, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ControlGroup.prototype.exclude, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ControlGroup.prototype.contains, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ControlGroup.prototype._included, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});



System.register("angular2/src/reflection/reflection", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./reflector", "./reflection_capabilities"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/reflection";
  var Type,
      isPresent,
      List,
      ListWrapper,
      Reflector,
      ReflectionCapabilities,
      reflector;
  return {
    setters: [function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Reflector = $__m.Reflector;
      $__export("Reflector", $__m.Reflector);
    }, function($__m) {
      ReflectionCapabilities = $__m.ReflectionCapabilities;
    }],
    execute: function() {
      reflector = $__export("reflector", new Reflector(new ReflectionCapabilities()));
    }
  };
});



System.register("angular2/src/change_detection/proto_change_detector", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./parser/ast", "./interfaces", "./change_detection_util", "./dynamic_change_detector", "./change_detection_jit_generator", "./pipes/pipe_registry", "./coalesce", "./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/proto_change_detector";
  var assert,
      isPresent,
      isBlank,
      BaseException,
      Type,
      isString,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      AccessMember,
      Assignment,
      AST,
      ASTWithSource,
      AstVisitor,
      Binary,
      Chain,
      Conditional,
      Pipe,
      FunctionCall,
      ImplicitReceiver,
      Interpolation,
      KeyedAccess,
      LiteralArray,
      LiteralMap,
      LiteralPrimitive,
      MethodCall,
      PrefixNot,
      ChangeRecord,
      ChangeDispatcher,
      ChangeDetector,
      ChangeDetectionUtil,
      DynamicChangeDetector,
      ChangeDetectorJITGenerator,
      PipeRegistry,
      coalesce,
      ProtoRecord,
      RECORD_TYPE_SELF,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_CONST,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_INTERPOLATE,
      ProtoChangeDetector,
      BindingRecord,
      DynamicProtoChangeDetector,
      _jitProtoChangeDetectorClassCounter,
      JitProtoChangeDetector,
      ProtoRecordBuilder,
      _ConvertAstIntoProtoRecords;
  function _arrayFn(length) {
    assert.argumentTypes(length, assert.type.number);
    switch (length) {
      case 0:
        return assert.returnType((ChangeDetectionUtil.arrayFn0), Function);
      case 1:
        return assert.returnType((ChangeDetectionUtil.arrayFn1), Function);
      case 2:
        return assert.returnType((ChangeDetectionUtil.arrayFn2), Function);
      case 3:
        return assert.returnType((ChangeDetectionUtil.arrayFn3), Function);
      case 4:
        return assert.returnType((ChangeDetectionUtil.arrayFn4), Function);
      case 5:
        return assert.returnType((ChangeDetectionUtil.arrayFn5), Function);
      case 6:
        return assert.returnType((ChangeDetectionUtil.arrayFn6), Function);
      case 7:
        return assert.returnType((ChangeDetectionUtil.arrayFn7), Function);
      case 8:
        return assert.returnType((ChangeDetectionUtil.arrayFn8), Function);
      case 9:
        return assert.returnType((ChangeDetectionUtil.arrayFn9), Function);
      default:
        throw new BaseException("Does not support literal maps with more than 9 elements");
    }
  }
  function _mapPrimitiveName(keys) {
    var stringifiedKeys = ListWrapper.join(ListWrapper.map(keys, (function(k) {
      return isString(k) ? ("\"" + k + "\"") : ("" + k);
    })), ", ");
    return ("mapFn([" + stringifiedKeys + "])");
  }
  function _operationToPrimitiveName(operation) {
    assert.argumentTypes(operation, assert.type.string);
    switch (operation) {
      case '+':
        return assert.returnType(("operation_add"), assert.type.string);
      case '-':
        return assert.returnType(("operation_subtract"), assert.type.string);
      case '*':
        return assert.returnType(("operation_multiply"), assert.type.string);
      case '/':
        return assert.returnType(("operation_divide"), assert.type.string);
      case '%':
        return assert.returnType(("operation_remainder"), assert.type.string);
      case '==':
        return assert.returnType(("operation_equals"), assert.type.string);
      case '!=':
        return assert.returnType(("operation_not_equals"), assert.type.string);
      case '<':
        return assert.returnType(("operation_less_then"), assert.type.string);
      case '>':
        return assert.returnType(("operation_greater_then"), assert.type.string);
      case '<=':
        return assert.returnType(("operation_less_or_equals_then"), assert.type.string);
      case '>=':
        return assert.returnType(("operation_greater_or_equals_then"), assert.type.string);
      case '&&':
        return assert.returnType(("operation_logical_and"), assert.type.string);
      case '||':
        return assert.returnType(("operation_logical_or"), assert.type.string);
      default:
        throw new BaseException(("Unsupported operation " + operation));
    }
  }
  function _operationToFunction(operation) {
    assert.argumentTypes(operation, assert.type.string);
    switch (operation) {
      case '+':
        return assert.returnType((ChangeDetectionUtil.operation_add), Function);
      case '-':
        return assert.returnType((ChangeDetectionUtil.operation_subtract), Function);
      case '*':
        return assert.returnType((ChangeDetectionUtil.operation_multiply), Function);
      case '/':
        return assert.returnType((ChangeDetectionUtil.operation_divide), Function);
      case '%':
        return assert.returnType((ChangeDetectionUtil.operation_remainder), Function);
      case '==':
        return assert.returnType((ChangeDetectionUtil.operation_equals), Function);
      case '!=':
        return assert.returnType((ChangeDetectionUtil.operation_not_equals), Function);
      case '<':
        return assert.returnType((ChangeDetectionUtil.operation_less_then), Function);
      case '>':
        return assert.returnType((ChangeDetectionUtil.operation_greater_then), Function);
      case '<=':
        return assert.returnType((ChangeDetectionUtil.operation_less_or_equals_then), Function);
      case '>=':
        return assert.returnType((ChangeDetectionUtil.operation_greater_or_equals_then), Function);
      case '&&':
        return assert.returnType((ChangeDetectionUtil.operation_logical_and), Function);
      case '||':
        return assert.returnType((ChangeDetectionUtil.operation_logical_or), Function);
      default:
        throw new BaseException(("Unsupported operation " + operation));
    }
  }
  function s(v) {
    return isPresent(v) ? ("" + v) : '';
  }
  function _interpolationFn(strings) {
    var length = strings.length;
    var c0 = length > 0 ? strings[0] : null;
    var c1 = length > 1 ? strings[1] : null;
    var c2 = length > 2 ? strings[2] : null;
    var c3 = length > 3 ? strings[3] : null;
    var c4 = length > 4 ? strings[4] : null;
    var c5 = length > 5 ? strings[5] : null;
    var c6 = length > 6 ? strings[6] : null;
    var c7 = length > 7 ? strings[7] : null;
    var c8 = length > 8 ? strings[8] : null;
    var c9 = length > 9 ? strings[9] : null;
    switch (length - 1) {
      case 1:
        return (function(a1) {
          return c0 + s(a1) + c1;
        });
      case 2:
        return (function(a1, a2) {
          return c0 + s(a1) + c1 + s(a2) + c2;
        });
      case 3:
        return (function(a1, a2, a3) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3;
        });
      case 4:
        return (function(a1, a2, a3, a4) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4;
        });
      case 5:
        return (function(a1, a2, a3, a4, a5) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5;
        });
      case 6:
        return (function(a1, a2, a3, a4, a5, a6) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6;
        });
      case 7:
        return (function(a1, a2, a3, a4, a5, a6, a7) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7;
        });
      case 8:
        return (function(a1, a2, a3, a4, a5, a6, a7, a8) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7 + s(a8) + c8;
        });
      case 9:
        return (function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7 + s(a8) + c8 + s(a9) + c9;
        });
      default:
        throw new BaseException("Does not support more than 9 expressions");
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      Type = $__m.Type;
      isString = $__m.isString;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      AccessMember = $__m.AccessMember;
      Assignment = $__m.Assignment;
      AST = $__m.AST;
      ASTWithSource = $__m.ASTWithSource;
      AstVisitor = $__m.AstVisitor;
      Binary = $__m.Binary;
      Chain = $__m.Chain;
      Conditional = $__m.Conditional;
      Pipe = $__m.Pipe;
      FunctionCall = $__m.FunctionCall;
      ImplicitReceiver = $__m.ImplicitReceiver;
      Interpolation = $__m.Interpolation;
      KeyedAccess = $__m.KeyedAccess;
      LiteralArray = $__m.LiteralArray;
      LiteralMap = $__m.LiteralMap;
      LiteralPrimitive = $__m.LiteralPrimitive;
      MethodCall = $__m.MethodCall;
      PrefixNot = $__m.PrefixNot;
    }, function($__m) {
      ChangeRecord = $__m.ChangeRecord;
      ChangeDispatcher = $__m.ChangeDispatcher;
      ChangeDetector = $__m.ChangeDetector;
    }, function($__m) {
      ChangeDetectionUtil = $__m.ChangeDetectionUtil;
    }, function($__m) {
      DynamicChangeDetector = $__m.DynamicChangeDetector;
    }, function($__m) {
      ChangeDetectorJITGenerator = $__m.ChangeDetectorJITGenerator;
    }, function($__m) {
      PipeRegistry = $__m.PipeRegistry;
    }, function($__m) {
      coalesce = $__m.coalesce;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      RECORD_TYPE_PROPERTY = $__m.RECORD_TYPE_PROPERTY;
      RECORD_TYPE_INVOKE_METHOD = $__m.RECORD_TYPE_INVOKE_METHOD;
      RECORD_TYPE_CONST = $__m.RECORD_TYPE_CONST;
      RECORD_TYPE_INVOKE_CLOSURE = $__m.RECORD_TYPE_INVOKE_CLOSURE;
      RECORD_TYPE_PRIMITIVE_OP = $__m.RECORD_TYPE_PRIMITIVE_OP;
      RECORD_TYPE_KEYED_ACCESS = $__m.RECORD_TYPE_KEYED_ACCESS;
      RECORD_TYPE_PIPE = $__m.RECORD_TYPE_PIPE;
      RECORD_TYPE_INTERPOLATE = $__m.RECORD_TYPE_INTERPOLATE;
    }],
    execute: function() {
      ProtoChangeDetector = $__export("ProtoChangeDetector", (function() {
        var ProtoChangeDetector = function ProtoChangeDetector() {};
        return ($traceurRuntime.createClass)(ProtoChangeDetector, {
          addAst: function(ast, bindingMemento) {
            var directiveMemento = arguments[2] !== (void 0) ? arguments[2] : null;
            assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any);
          },
          instantiate: function(dispatcher, bindingRecords) {
            assert.argumentTypes(dispatcher, assert.type.any, bindingRecords, List);
            return assert.returnType((null), ChangeDetector);
          }
        }, {});
      }()));
      Object.defineProperty(ProtoChangeDetector.prototype.addAst, "parameters", {get: function() {
          return [[AST], [assert.type.any], [assert.type.any]];
        }});
      Object.defineProperty(ProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
          return [[assert.type.any], [List]];
        }});
      BindingRecord = $__export("BindingRecord", (function() {
        var BindingRecord = function BindingRecord(ast, bindingMemento, directiveMemento) {
          assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any);
          this.ast = ast;
          this.bindingMemento = bindingMemento;
          this.directiveMemento = directiveMemento;
        };
        return ($traceurRuntime.createClass)(BindingRecord, {}, {});
      }()));
      Object.defineProperty(BindingRecord, "parameters", {get: function() {
          return [[AST], [assert.type.any], [assert.type.any]];
        }});
      DynamicProtoChangeDetector = $__export("DynamicProtoChangeDetector", (function($__super) {
        var DynamicProtoChangeDetector = function DynamicProtoChangeDetector(pipeRegistry) {
          assert.argumentTypes(pipeRegistry, PipeRegistry);
          $traceurRuntime.superConstructor(DynamicProtoChangeDetector).call(this);
          this._pipeRegistry = pipeRegistry;
        };
        return ($traceurRuntime.createClass)(DynamicProtoChangeDetector, {
          instantiate: function(dispatcher, bindingRecords) {
            assert.argumentTypes(dispatcher, assert.type.any, bindingRecords, List);
            this._createRecordsIfNecessary(bindingRecords);
            return new DynamicChangeDetector(dispatcher, this._pipeRegistry, this._records);
          },
          _createRecordsIfNecessary: function(bindingRecords) {
            assert.argumentTypes(bindingRecords, List);
            if (isBlank(this._records)) {
              var recordBuilder = new ProtoRecordBuilder();
              ListWrapper.forEach(bindingRecords, (function(r) {
                recordBuilder.addAst(r.ast, r.bindingMemento, r.directiveMemento);
              }));
              this._records = coalesce(recordBuilder.records);
            }
          }
        }, {}, $__super);
      }(ProtoChangeDetector)));
      Object.defineProperty(DynamicProtoChangeDetector, "parameters", {get: function() {
          return [[PipeRegistry]];
        }});
      Object.defineProperty(DynamicProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
          return [[assert.type.any], [List]];
        }});
      Object.defineProperty(DynamicProtoChangeDetector.prototype._createRecordsIfNecessary, "parameters", {get: function() {
          return [[List]];
        }});
      _jitProtoChangeDetectorClassCounter = assert.type(0, assert.type.number);
      JitProtoChangeDetector = $__export("JitProtoChangeDetector", (function($__super) {
        var JitProtoChangeDetector = function JitProtoChangeDetector(pipeRegistry) {
          $traceurRuntime.superConstructor(JitProtoChangeDetector).call(this);
          this._pipeRegistry = pipeRegistry;
          this._factory = null;
        };
        return ($traceurRuntime.createClass)(JitProtoChangeDetector, {
          instantiate: function(dispatcher, bindingRecords) {
            assert.argumentTypes(dispatcher, assert.type.any, bindingRecords, List);
            this._createFactoryIfNecessary(bindingRecords);
            return this._factory(dispatcher, this._pipeRegistry);
          },
          _createFactoryIfNecessary: function(bindingRecords) {
            assert.argumentTypes(bindingRecords, List);
            if (isBlank(this._factory)) {
              var recordBuilder = new ProtoRecordBuilder();
              ListWrapper.forEach(bindingRecords, (function(r) {
                recordBuilder.addAst(r.ast, r.bindingMemento, r.directiveMemento);
              }));
              var c = _jitProtoChangeDetectorClassCounter++;
              var records = coalesce(recordBuilder.records);
              var typeName = ("ChangeDetector" + c);
              this._factory = new ChangeDetectorJITGenerator(typeName, records).generate();
            }
          }
        }, {}, $__super);
      }(ProtoChangeDetector)));
      Object.defineProperty(JitProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
          return [[assert.type.any], [List]];
        }});
      Object.defineProperty(JitProtoChangeDetector.prototype._createFactoryIfNecessary, "parameters", {get: function() {
          return [[List]];
        }});
      ProtoRecordBuilder = (function() {
        var ProtoRecordBuilder = function ProtoRecordBuilder() {
          this.records = [];
        };
        return ($traceurRuntime.createClass)(ProtoRecordBuilder, {addAst: function(ast, bindingMemento) {
            var directiveMemento = arguments[2] !== (void 0) ? arguments[2] : null;
            assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any);
            var last = ListWrapper.last(this.records);
            if (isPresent(last) && last.directiveMemento == directiveMemento) {
              last.lastInDirective = false;
            }
            var pr = _ConvertAstIntoProtoRecords.convert(ast, bindingMemento, directiveMemento, this.records.length);
            if (!ListWrapper.isEmpty(pr)) {
              var last = ListWrapper.last(pr);
              last.lastInBinding = true;
              last.lastInDirective = true;
              this.records = ListWrapper.concat(this.records, pr);
            }
          }}, {});
      }());
      Object.defineProperty(ProtoRecordBuilder.prototype.addAst, "parameters", {get: function() {
          return [[AST], [assert.type.any], [assert.type.any]];
        }});
      _ConvertAstIntoProtoRecords = (function() {
        var _ConvertAstIntoProtoRecords = function _ConvertAstIntoProtoRecords(bindingMemento, directiveMemento, contextIndex, expressionAsString) {
          assert.argumentTypes(bindingMemento, assert.type.any, directiveMemento, assert.type.any, contextIndex, assert.type.number, expressionAsString, assert.type.string);
          this.protoRecords = [];
          this.bindingMemento = bindingMemento;
          this.directiveMemento = directiveMemento;
          this.contextIndex = contextIndex;
          this.expressionAsString = expressionAsString;
        };
        return ($traceurRuntime.createClass)(_ConvertAstIntoProtoRecords, {
          visitImplicitReceiver: function(ast) {
            assert.argumentTypes(ast, ImplicitReceiver);
            return 0;
          },
          visitInterpolation: function(ast) {
            assert.argumentTypes(ast, Interpolation);
            var args = this._visitAll(ast.expressions);
            return this._addRecord(RECORD_TYPE_INTERPOLATE, "interpolate", _interpolationFn(ast.strings), args, ast.strings, 0);
          },
          visitLiteralPrimitive: function(ast) {
            assert.argumentTypes(ast, LiteralPrimitive);
            return this._addRecord(RECORD_TYPE_CONST, "literal", ast.value, [], null, 0);
          },
          visitAccessMember: function(ast) {
            assert.argumentTypes(ast, AccessMember);
            var receiver = ast.receiver.visit(this);
            return this._addRecord(RECORD_TYPE_PROPERTY, ast.name, ast.getter, [], null, receiver);
          },
          visitMethodCall: function(ast) {
            assert.argumentTypes(ast, MethodCall);
            var receiver = ast.receiver.visit(this);
            var args = this._visitAll(ast.args);
            return this._addRecord(RECORD_TYPE_INVOKE_METHOD, ast.name, ast.fn, args, null, receiver);
          },
          visitFunctionCall: function(ast) {
            assert.argumentTypes(ast, FunctionCall);
            var target = ast.target.visit(this);
            var args = this._visitAll(ast.args);
            return this._addRecord(RECORD_TYPE_INVOKE_CLOSURE, "closure", null, args, null, target);
          },
          visitLiteralArray: function(ast) {
            assert.argumentTypes(ast, LiteralArray);
            var primitiveName = ("arrayFn" + ast.expressions.length);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, primitiveName, _arrayFn(ast.expressions.length), this._visitAll(ast.expressions), null, 0);
          },
          visitLiteralMap: function(ast) {
            assert.argumentTypes(ast, LiteralMap);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, _mapPrimitiveName(ast.keys), ChangeDetectionUtil.mapFn(ast.keys), this._visitAll(ast.values), null, 0);
          },
          visitBinary: function(ast) {
            assert.argumentTypes(ast, Binary);
            var left = ast.left.visit(this);
            var right = ast.right.visit(this);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, _operationToPrimitiveName(ast.operation), _operationToFunction(ast.operation), [left, right], null, 0);
          },
          visitPrefixNot: function(ast) {
            assert.argumentTypes(ast, PrefixNot);
            var exp = ast.expression.visit(this);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, "operation_negate", ChangeDetectionUtil.operation_negate, [exp], null, 0);
          },
          visitConditional: function(ast) {
            assert.argumentTypes(ast, Conditional);
            var c = ast.condition.visit(this);
            var t = ast.trueExp.visit(this);
            var f = ast.falseExp.visit(this);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, "cond", ChangeDetectionUtil.cond, [c, t, f], null, 0);
          },
          visitPipe: function(ast) {
            assert.argumentTypes(ast, Pipe);
            var value = ast.exp.visit(this);
            return this._addRecord(RECORD_TYPE_PIPE, ast.name, ast.name, [], null, value);
          },
          visitKeyedAccess: function(ast) {
            assert.argumentTypes(ast, KeyedAccess);
            var obj = ast.obj.visit(this);
            var key = ast.key.visit(this);
            return this._addRecord(RECORD_TYPE_KEYED_ACCESS, "keyedAccess", ChangeDetectionUtil.keyedAccess, [key], null, obj);
          },
          _visitAll: function(asts) {
            assert.argumentTypes(asts, List);
            var res = ListWrapper.createFixedSize(asts.length);
            for (var i = 0; i < asts.length; ++i) {
              res[i] = asts[i].visit(this);
            }
            return res;
          },
          _addRecord: function(type, name, funcOrValue, args, fixedArgs, context) {
            var selfIndex = ++this.contextIndex;
            ListWrapper.push(this.protoRecords, new ProtoRecord(type, name, funcOrValue, args, fixedArgs, context, selfIndex, this.bindingMemento, this.directiveMemento, this.expressionAsString, false, false));
            return selfIndex;
          }
        }, {convert: function(ast, bindingMemento, directiveMemento, contextIndex) {
            assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any, contextIndex, assert.type.number);
            var c = new _ConvertAstIntoProtoRecords(bindingMemento, directiveMemento, contextIndex, ast.toString());
            ast.visit(c);
            return c.protoRecords;
          }});
      }());
      Object.defineProperty(_ConvertAstIntoProtoRecords, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any], [assert.type.number], [assert.type.string]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.convert, "parameters", {get: function() {
          return [[AST], [assert.type.any], [assert.type.any], [assert.type.number]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitImplicitReceiver, "parameters", {get: function() {
          return [[ImplicitReceiver]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitInterpolation, "parameters", {get: function() {
          return [[Interpolation]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralPrimitive, "parameters", {get: function() {
          return [[LiteralPrimitive]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitAccessMember, "parameters", {get: function() {
          return [[AccessMember]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitMethodCall, "parameters", {get: function() {
          return [[MethodCall]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitFunctionCall, "parameters", {get: function() {
          return [[FunctionCall]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralArray, "parameters", {get: function() {
          return [[LiteralArray]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralMap, "parameters", {get: function() {
          return [[LiteralMap]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitBinary, "parameters", {get: function() {
          return [[Binary]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitPrefixNot, "parameters", {get: function() {
          return [[PrefixNot]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitConditional, "parameters", {get: function() {
          return [[Conditional]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitPipe, "parameters", {get: function() {
          return [[Pipe]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitKeyedAccess, "parameters", {get: function() {
          return [[KeyedAccess]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype._visitAll, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(_arrayFn, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(_mapPrimitiveName, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(_operationToPrimitiveName, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_operationToFunction, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_interpolationFn, "parameters", {get: function() {
          return [[List]];
        }});
    }
  };
});



System.register("angular2/src/di/binding", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/reflection/reflection", "./key", "./annotations", "./exceptions"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/binding";
  var assert,
      Type,
      isBlank,
      isPresent,
      List,
      MapWrapper,
      ListWrapper,
      reflector,
      Key,
      Inject,
      InjectLazy,
      InjectPromise,
      Optional,
      DependencyAnnotation,
      NoAnnotationError,
      Dependency,
      Binding,
      BindingBuilder;
  function bind(token) {
    return assert.returnType((new BindingBuilder(token)), BindingBuilder);
  }
  function _dependenciesFor(typeOrFunc) {
    var params = reflector.parameters(typeOrFunc);
    if (isBlank(params))
      return assert.returnType(([]), List);
    if (ListWrapper.any(params, (function(p) {
      return isBlank(p);
    })))
      throw new NoAnnotationError(typeOrFunc);
    return assert.returnType((ListWrapper.map(params, (function(p) {
      return _extractToken(typeOrFunc, p);
    }))), List);
  }
  function _extractToken(typeOrFunc, annotations) {
    var depProps = [];
    var token = null;
    var optional = false;
    var lazy = false;
    var asPromise = false;
    for (var i = 0; i < annotations.length; ++i) {
      var paramAnnotation = annotations[i];
      if (paramAnnotation instanceof Type) {
        token = paramAnnotation;
      } else if (paramAnnotation instanceof Inject) {
        token = paramAnnotation.token;
      } else if (paramAnnotation instanceof InjectPromise) {
        token = paramAnnotation.token;
        asPromise = true;
      } else if (paramAnnotation instanceof InjectLazy) {
        token = paramAnnotation.token;
        lazy = true;
      } else if (paramAnnotation instanceof Optional) {
        optional = true;
      } else if (paramAnnotation instanceof DependencyAnnotation) {
        ListWrapper.push(depProps, paramAnnotation);
      }
    }
    if (isPresent(token)) {
      return _createDependency(token, asPromise, lazy, optional, depProps);
    } else {
      throw new NoAnnotationError(typeOrFunc);
    }
  }
  function _createDependency(token, asPromise, lazy, optional, depProps) {
    return assert.returnType((new Dependency(Key.get(token), asPromise, lazy, optional, depProps)), Dependency);
  }
  $__export("bind", bind);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      reflector = $__m.reflector;
    }, function($__m) {
      Key = $__m.Key;
    }, function($__m) {
      Inject = $__m.Inject;
      InjectLazy = $__m.InjectLazy;
      InjectPromise = $__m.InjectPromise;
      Optional = $__m.Optional;
      DependencyAnnotation = $__m.DependencyAnnotation;
    }, function($__m) {
      NoAnnotationError = $__m.NoAnnotationError;
    }],
    execute: function() {
      Dependency = $__export("Dependency", (function() {
        var Dependency = function Dependency(key, asPromise, lazy, optional, properties) {
          assert.argumentTypes(key, Key, asPromise, assert.type.boolean, lazy, assert.type.boolean, optional, assert.type.boolean, properties, List);
          this.key = key;
          this.asPromise = asPromise;
          this.lazy = lazy;
          this.optional = optional;
          this.properties = properties;
        };
        return ($traceurRuntime.createClass)(Dependency, {}, {fromKey: function(key) {
            assert.argumentTypes(key, Key);
            return new Dependency(key, false, false, false, []);
          }});
      }()));
      Object.defineProperty(Dependency, "parameters", {get: function() {
          return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean], [List]];
        }});
      Object.defineProperty(Dependency.fromKey, "parameters", {get: function() {
          return [[Key]];
        }});
      Binding = $__export("Binding", (function() {
        var Binding = function Binding(key, factory, dependencies, providedAsPromise) {
          assert.argumentTypes(key, Key, factory, Function, dependencies, List, providedAsPromise, assert.type.boolean);
          this.key = key;
          this.factory = factory;
          this.dependencies = dependencies;
          this.providedAsPromise = providedAsPromise;
        };
        return ($traceurRuntime.createClass)(Binding, {}, {});
      }()));
      Object.defineProperty(Binding, "parameters", {get: function() {
          return [[Key], [Function], [List], [assert.type.boolean]];
        }});
      BindingBuilder = $__export("BindingBuilder", (function() {
        var BindingBuilder = function BindingBuilder(token) {
          this.token = token;
        };
        return ($traceurRuntime.createClass)(BindingBuilder, {
          toClass: function(type) {
            assert.argumentTypes(type, Type);
            return assert.returnType((new Binding(Key.get(this.token), reflector.factory(type), _dependenciesFor(type), false)), Binding);
          },
          toValue: function(value) {
            return assert.returnType((new Binding(Key.get(this.token), (function() {
              return value;
            }), [], false)), Binding);
          },
          toAlias: function(aliasToken) {
            return assert.returnType((new Binding(Key.get(this.token), (function(aliasInstance) {
              return aliasInstance;
            }), [Dependency.fromKey(Key.get(aliasToken))], false)), Binding);
          },
          toFactory: function(factoryFunction) {
            var dependencies = arguments[1] !== (void 0) ? arguments[1] : null;
            assert.argumentTypes(factoryFunction, Function, dependencies, List);
            return assert.returnType((new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), false)), Binding);
          },
          toAsyncFactory: function(factoryFunction) {
            var dependencies = arguments[1] !== (void 0) ? arguments[1] : null;
            assert.argumentTypes(factoryFunction, Function, dependencies, List);
            return assert.returnType((new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), true)), Binding);
          },
          _constructDependencies: function(factoryFunction, dependencies) {
            return isBlank(dependencies) ? _dependenciesFor(factoryFunction) : ListWrapper.map(dependencies, (function(t) {
              return Dependency.fromKey(Key.get(t));
            }));
          }
        }, {});
      }()));
      Object.defineProperty(BindingBuilder.prototype.toClass, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(BindingBuilder.prototype.toFactory, "parameters", {get: function() {
          return [[Function], [List]];
        }});
      Object.defineProperty(BindingBuilder.prototype.toAsyncFactory, "parameters", {get: function() {
          return [[Function], [List]];
        }});
      Object.defineProperty(BindingBuilder.prototype._constructDependencies, "parameters", {get: function() {
          return [[Function], [List]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/view_container", ["rtts_assert/rtts_assert", "./view", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/di", "angular2/src/core/compiler/element_injector", "angular2/src/core/events/event_manager", "./shadow_dom_emulation/light_dom"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/view_container";
  var assert,
      viewModule,
      DOM,
      ListWrapper,
      MapWrapper,
      List,
      BaseException,
      Injector,
      eiModule,
      isPresent,
      isBlank,
      EventManager,
      ldModule,
      ViewContainer;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      List = $__m.List;
    }, function($__m) {
      BaseException = $__m.BaseException;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      Injector = $__m.Injector;
    }, function($__m) {
      eiModule = $__m;
    }, function($__m) {
      EventManager = $__m.EventManager;
    }, function($__m) {
      ldModule = $__m;
    }],
    execute: function() {
      ViewContainer = $__export("ViewContainer", (function() {
        var ViewContainer = function ViewContainer(parentView, templateElement, defaultProtoView, elementInjector, eventManager) {
          var lightDom = arguments[5] !== (void 0) ? arguments[5] : null;
          assert.argumentTypes(parentView, viewModule.View, templateElement, assert.type.any, defaultProtoView, viewModule.ProtoView, elementInjector, eiModule.ElementInjector, eventManager, EventManager, lightDom, assert.type.any);
          this.parentView = parentView;
          this.templateElement = templateElement;
          this.defaultProtoView = defaultProtoView;
          this.elementInjector = elementInjector;
          this._lightDom = lightDom;
          this._views = [];
          this.appInjector = null;
          this.hostElementInjector = null;
          this.hostLightDom = null;
          this._eventManager = eventManager;
        };
        return ($traceurRuntime.createClass)(ViewContainer, {
          hydrate: function(appInjector, hostElementInjector) {
            assert.argumentTypes(appInjector, Injector, hostElementInjector, eiModule.ElementInjector);
            this.appInjector = appInjector;
            this.hostElementInjector = hostElementInjector;
            this.hostLightDom = isPresent(hostElementInjector) ? hostElementInjector.get(ldModule.LightDom) : null;
          },
          dehydrate: function() {
            this.appInjector = null;
            this.hostElementInjector = null;
            this.hostLightDom = null;
            this.clear();
          },
          clear: function() {
            for (var i = this._views.length - 1; i >= 0; i--) {
              this.remove(i);
            }
          },
          get: function(index) {
            assert.argumentTypes(index, assert.type.number);
            return assert.returnType((this._views[index]), viewModule.View);
          },
          get length() {
            return this._views.length;
          },
          _siblingToInsertAfter: function(index) {
            assert.argumentTypes(index, assert.type.number);
            if (index == 0)
              return this.templateElement;
            return ListWrapper.last(this._views[index - 1].nodes);
          },
          hydrated: function() {
            return isPresent(this.appInjector);
          },
          create: function() {
            var atIndex = arguments[0] !== (void 0) ? arguments[0] : -1;
            if (!this.hydrated())
              throw new BaseException('Cannot create views on a dehydrated ViewContainer');
            var newView = this.defaultProtoView.instantiate(this.hostElementInjector, this._eventManager);
            this.insert(newView, atIndex);
            newView.hydrate(this.appInjector, this.hostElementInjector, this.parentView.context);
            if (isPresent(this.hostLightDom)) {
              this.hostLightDom.redistribute();
            }
            return assert.returnType((newView), viewModule.View);
          },
          insert: function(view) {
            var atIndex = arguments[1] !== (void 0) ? arguments[1] : -1;
            if (atIndex == -1)
              atIndex = this._views.length;
            ListWrapper.insert(this._views, atIndex, view);
            if (isBlank(this._lightDom)) {
              ViewContainer.moveViewNodesAfterSibling(this._siblingToInsertAfter(atIndex), view);
            } else {
              this._lightDom.redistribute();
            }
            this.parentView.changeDetector.addChild(view.changeDetector);
            this._linkElementInjectors(view);
            return assert.returnType((view), viewModule.View);
          },
          remove: function() {
            var atIndex = arguments[0] !== (void 0) ? arguments[0] : -1;
            if (atIndex == -1)
              atIndex = this._views.length - 1;
            var view = this.detach(atIndex);
            view.dehydrate();
            this.defaultProtoView.returnToPool(view);
          },
          detach: function() {
            var atIndex = arguments[0] !== (void 0) ? arguments[0] : -1;
            if (atIndex == -1)
              atIndex = this._views.length - 1;
            var detachedView = this.get(atIndex);
            ListWrapper.removeAt(this._views, atIndex);
            if (isBlank(this._lightDom)) {
              ViewContainer.removeViewNodesFromParent(this.templateElement.parentNode, detachedView);
            } else {
              this._lightDom.redistribute();
            }
            if (isPresent(this.hostLightDom)) {
              this.hostLightDom.redistribute();
            }
            detachedView.changeDetector.remove();
            this._unlinkElementInjectors(detachedView);
            return assert.returnType((detachedView), viewModule.View);
          },
          contentTagContainers: function() {
            return this._views;
          },
          nodes: function() {
            var r = [];
            for (var i = 0; i < this._views.length; ++i) {
              r = ListWrapper.concat(r, this._views[i].nodes);
            }
            return assert.returnType((r), List);
          },
          _linkElementInjectors: function(view) {
            for (var i = 0; i < view.rootElementInjectors.length; ++i) {
              view.rootElementInjectors[i].parent = this.elementInjector;
            }
          },
          _unlinkElementInjectors: function(view) {
            for (var i = 0; i < view.rootElementInjectors.length; ++i) {
              view.rootElementInjectors[i].parent = null;
            }
          }
        }, {
          moveViewNodesAfterSibling: function(sibling, view) {
            for (var i = view.nodes.length - 1; i >= 0; --i) {
              DOM.insertAfter(sibling, view.nodes[i]);
            }
          },
          removeViewNodesFromParent: function(parent, view) {
            for (var i = view.nodes.length - 1; i >= 0; --i) {
              DOM.removeChild(parent, view.nodes[i]);
            }
          }
        });
      }()));
      Object.defineProperty(ViewContainer, "parameters", {get: function() {
          return [[viewModule.View], [], [viewModule.ProtoView], [eiModule.ElementInjector], [EventManager], []];
        }});
      Object.defineProperty(ViewContainer.prototype.hydrate, "parameters", {get: function() {
          return [[Injector], [eiModule.ElementInjector]];
        }});
      Object.defineProperty(ViewContainer.prototype.get, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ViewContainer.prototype._siblingToInsertAfter, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/style_inliner", ["rtts_assert/rtts_assert", "angular2/src/core/compiler/xhr/xhr", "angular2/src/core/compiler/style_url_resolver", "angular2/src/core/compiler/url_resolver", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/facade/async"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/style_inliner";
  var assert,
      XHR,
      StyleUrlResolver,
      UrlResolver,
      ListWrapper,
      isBlank,
      isPresent,
      RegExp,
      RegExpWrapper,
      StringWrapper,
      normalizeBlank,
      Promise,
      PromiseWrapper,
      StyleInliner,
      _importRe,
      _urlRe,
      _mediaQueryRe;
  function _extractUrl(importRule) {
    assert.argumentTypes(importRule, assert.type.string);
    var match = RegExpWrapper.firstMatch(_urlRe, importRule);
    if (isBlank(match))
      return assert.returnType((null), assert.type.string);
    return assert.returnType((isPresent(match[1]) ? match[1] : match[2]), assert.type.string);
  }
  function _extractMediaQuery(importRule) {
    assert.argumentTypes(importRule, assert.type.string);
    var match = RegExpWrapper.firstMatch(_mediaQueryRe, importRule);
    if (isBlank(match))
      return assert.returnType((null), assert.type.string);
    var mediaQuery = match[1].trim();
    return assert.returnType(((mediaQuery.length > 0) ? mediaQuery : null), assert.type.string);
  }
  function _wrapInMediaRule(css, query) {
    assert.argumentTypes(css, assert.type.string, query, assert.type.string);
    return assert.returnType(((isBlank(query)) ? css : ("@media " + query + " {\n" + css + "\n}")), assert.type.string);
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      RegExp = $__m.RegExp;
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
      normalizeBlank = $__m.normalizeBlank;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }],
    execute: function() {
      StyleInliner = $__export("StyleInliner", (function() {
        var StyleInliner = function StyleInliner(xhr, styleUrlResolver, urlResolver) {
          assert.argumentTypes(xhr, XHR, styleUrlResolver, StyleUrlResolver, urlResolver, UrlResolver);
          this._xhr = xhr;
          this._urlResolver = urlResolver;
          this._styleUrlResolver = styleUrlResolver;
        };
        return ($traceurRuntime.createClass)(StyleInliner, {
          inlineImports: function(cssText, baseUrl) {
            assert.argumentTypes(cssText, assert.type.string, baseUrl, assert.type.string);
            return this._inlineImports(cssText, baseUrl, []);
          },
          _inlineImports: function(cssText, baseUrl, inlinedUrls) {
            var $__0 = this;
            var partIndex = 0;
            var parts = StringWrapper.split(cssText, _importRe);
            if (parts.length === 1) {
              return cssText;
            }
            var promises = [];
            while (partIndex < parts.length - 1) {
              var prefix = parts[partIndex];
              var rule = parts[partIndex + 1];
              var url = _extractUrl(rule);
              if (isPresent(url)) {
                url = this._urlResolver.resolve(baseUrl, url);
              }
              var mediaQuery = _extractMediaQuery(rule);
              var promise = void 0;
              if (isBlank(url)) {
                promise = PromiseWrapper.resolve(("/* Invalid import rule: \"@import " + rule + ";\" */"));
              } else if (ListWrapper.contains(inlinedUrls, url)) {
                promise = PromiseWrapper.resolve(prefix);
              } else {
                ListWrapper.push(inlinedUrls, url);
                promise = PromiseWrapper.then(this._xhr.get(url), (function(css) {
                  css = $__0._inlineImports(css, url, inlinedUrls);
                  if (PromiseWrapper.isPromise(css)) {
                    return css.then((function(css) {
                      return prefix + $__0._transformImportedCss(css, mediaQuery, url) + '\n';
                    }));
                  } else {
                    return prefix + $__0._transformImportedCss(css, mediaQuery, url) + '\n';
                  }
                }), (function(error) {
                  return ("/* failed to import " + url + " */\n");
                }));
              }
              ListWrapper.push(promises, promise);
              partIndex += 2;
            }
            return PromiseWrapper.all(promises).then(function(cssParts) {
              var cssText = cssParts.join('');
              if (partIndex < parts.length) {
                cssText += parts[partIndex];
              }
              return cssText;
            });
          },
          _transformImportedCss: function(css, mediaQuery, url) {
            assert.argumentTypes(css, assert.type.string, mediaQuery, assert.type.string, url, assert.type.string);
            css = this._styleUrlResolver.resolveUrls(css, url);
            return assert.returnType((_wrapInMediaRule(css, mediaQuery)), assert.type.string);
          }
        }, {});
      }()));
      Object.defineProperty(StyleInliner, "parameters", {get: function() {
          return [[XHR], [StyleUrlResolver], [UrlResolver]];
        }});
      Object.defineProperty(StyleInliner.prototype.inlineImports, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StyleInliner.prototype._inlineImports, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.genericType(List, assert.type.string)]];
        }});
      Object.defineProperty(StyleInliner.prototype._transformImportedCss, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(_extractUrl, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_extractMediaQuery, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_wrapInMediaRule, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      _importRe = RegExpWrapper.create('@import\\s+([^;]+);');
      _urlRe = RegExpWrapper.create('url\\(\\s*?[\'"]?([^\'")]+)[\'"]?|' + '[\'"]([^\'")]+)[\'"]');
      _mediaQueryRe = RegExpWrapper.create('[\'"][^\'"]+[\'"]\\s*\\)?\\s*(.*)');
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/compile_step", ["rtts_assert/rtts_assert", "./compile_element", "./compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/compile_step";
  var assert,
      CompileElement,
      CompileControl,
      CompileStep;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }],
    execute: function() {
      CompileStep = $__export("CompileStep", (function() {
        var CompileStep = function CompileStep() {};
        return ($traceurRuntime.createClass)(CompileStep, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
          }}, {});
      }()));
      Object.defineProperty(CompileStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/pipeline/default_steps", ["rtts_assert/rtts_assert", "angular2/change_detection", "angular2/src/facade/collection", "angular2/src/facade/lang", "./property_binding_parser", "./text_interpolation_parser", "./directive_parser", "./view_splitter", "./element_binding_marker", "./proto_view_builder", "./proto_element_injector_builder", "./element_binder_builder", "angular2/src/core/compiler/css_processor", "angular2/src/core/compiler/directive_metadata", "angular2/src/core/compiler/shadow_dom_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/pipeline/default_steps";
  var assert,
      ChangeDetection,
      Parser,
      List,
      ListWrapper,
      isPresent,
      PropertyBindingParser,
      TextInterpolationParser,
      DirectiveParser,
      ViewSplitter,
      ElementBindingMarker,
      ProtoViewBuilder,
      ProtoElementInjectorBuilder,
      ElementBinderBuilder,
      CssProcessor,
      DirectiveMetadata,
      ShadowDomStrategy,
      EmulatedScopedShadowDomStrategy;
  function createDefaultSteps(changeDetection, parser, compiledComponent, directives, shadowDomStrategy, templateUrl, cssProcessor) {
    assert.argumentTypes(changeDetection, ChangeDetection, parser, Parser, compiledComponent, DirectiveMetadata, directives, assert.genericType(List, DirectiveMetadata), shadowDomStrategy, ShadowDomStrategy, templateUrl, assert.type.string, cssProcessor, CssProcessor);
    var steps = [new ViewSplitter(parser), cssProcessor.getCompileStep(compiledComponent, shadowDomStrategy, templateUrl), new PropertyBindingParser(parser), new DirectiveParser(directives), new TextInterpolationParser(parser), new ElementBindingMarker(), new ProtoViewBuilder(changeDetection, shadowDomStrategy), new ProtoElementInjectorBuilder(), new ElementBinderBuilder(parser)];
    var shadowDomStep = shadowDomStrategy.getTemplateCompileStep(compiledComponent);
    if (isPresent(shadowDomStep)) {
      ListWrapper.push(steps, shadowDomStep);
    }
    return steps;
  }
  $__export("createDefaultSteps", createDefaultSteps);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ChangeDetection = $__m.ChangeDetection;
      Parser = $__m.Parser;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      PropertyBindingParser = $__m.PropertyBindingParser;
    }, function($__m) {
      TextInterpolationParser = $__m.TextInterpolationParser;
    }, function($__m) {
      DirectiveParser = $__m.DirectiveParser;
    }, function($__m) {
      ViewSplitter = $__m.ViewSplitter;
    }, function($__m) {
      ElementBindingMarker = $__m.ElementBindingMarker;
    }, function($__m) {
      ProtoViewBuilder = $__m.ProtoViewBuilder;
    }, function($__m) {
      ProtoElementInjectorBuilder = $__m.ProtoElementInjectorBuilder;
    }, function($__m) {
      ElementBinderBuilder = $__m.ElementBinderBuilder;
    }, function($__m) {
      CssProcessor = $__m.CssProcessor;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
      EmulatedScopedShadowDomStrategy = $__m.EmulatedScopedShadowDomStrategy;
    }],
    execute: function() {
      Object.defineProperty(createDefaultSteps, "parameters", {get: function() {
          return [[ChangeDetection], [Parser], [DirectiveMetadata], [assert.genericType(List, DirectiveMetadata)], [ShadowDomStrategy], [assert.type.string], [CssProcessor]];
        }});
    }
  };
});



System.register("angular2/forms", ["./src/forms/model", "./src/forms/directives", "./src/forms/validators", "./src/forms/validator_directives", "./src/forms/form_builder"], function($__export) {
  "use strict";
  var __moduleName = "angular2/forms";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});



System.register("angular2/src/change_detection/parser/parser", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "./lexer", "angular2/src/reflection/reflection", "./ast"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/parser";
  var assert,
      int,
      isBlank,
      isPresent,
      BaseException,
      StringWrapper,
      RegExpWrapper,
      ListWrapper,
      List,
      Lexer,
      EOF,
      Token,
      $PERIOD,
      $COLON,
      $SEMICOLON,
      $LBRACKET,
      $RBRACKET,
      $COMMA,
      $LBRACE,
      $RBRACE,
      $LPAREN,
      $RPAREN,
      reflector,
      Reflector,
      AST,
      EmptyExpr,
      ImplicitReceiver,
      AccessMember,
      LiteralPrimitive,
      Expression,
      Binary,
      PrefixNot,
      Conditional,
      Pipe,
      Assignment,
      Chain,
      KeyedAccess,
      LiteralArray,
      LiteralMap,
      Interpolation,
      MethodCall,
      FunctionCall,
      TemplateBindings,
      TemplateBinding,
      ASTWithSource,
      _implicitReceiver,
      INTERPOLATION_REGEXP,
      QUOTE_REGEXP,
      Parser,
      _ParseAST;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      StringWrapper = $__m.StringWrapper;
      RegExpWrapper = $__m.RegExpWrapper;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }, function($__m) {
      Lexer = $__m.Lexer;
      EOF = $__m.EOF;
      Token = $__m.Token;
      $PERIOD = $__m.$PERIOD;
      $COLON = $__m.$COLON;
      $SEMICOLON = $__m.$SEMICOLON;
      $LBRACKET = $__m.$LBRACKET;
      $RBRACKET = $__m.$RBRACKET;
      $COMMA = $__m.$COMMA;
      $LBRACE = $__m.$LBRACE;
      $RBRACE = $__m.$RBRACE;
      $LPAREN = $__m.$LPAREN;
      $RPAREN = $__m.$RPAREN;
    }, function($__m) {
      reflector = $__m.reflector;
      Reflector = $__m.Reflector;
    }, function($__m) {
      AST = $__m.AST;
      EmptyExpr = $__m.EmptyExpr;
      ImplicitReceiver = $__m.ImplicitReceiver;
      AccessMember = $__m.AccessMember;
      LiteralPrimitive = $__m.LiteralPrimitive;
      Expression = $__m.Expression;
      Binary = $__m.Binary;
      PrefixNot = $__m.PrefixNot;
      Conditional = $__m.Conditional;
      Pipe = $__m.Pipe;
      Assignment = $__m.Assignment;
      Chain = $__m.Chain;
      KeyedAccess = $__m.KeyedAccess;
      LiteralArray = $__m.LiteralArray;
      LiteralMap = $__m.LiteralMap;
      Interpolation = $__m.Interpolation;
      MethodCall = $__m.MethodCall;
      FunctionCall = $__m.FunctionCall;
      TemplateBindings = $__m.TemplateBindings;
      TemplateBinding = $__m.TemplateBinding;
      ASTWithSource = $__m.ASTWithSource;
    }],
    execute: function() {
      _implicitReceiver = new ImplicitReceiver();
      INTERPOLATION_REGEXP = RegExpWrapper.create('\\{\\{(.*?)\\}\\}');
      QUOTE_REGEXP = RegExpWrapper.create("'");
      Parser = $__export("Parser", (function() {
        var Parser = function Parser(lexer) {
          var providedReflector = arguments[1] !== (void 0) ? arguments[1] : null;
          assert.argumentTypes(lexer, Lexer, providedReflector, Reflector);
          this._lexer = lexer;
          this._reflector = isPresent(providedReflector) ? providedReflector : reflector;
        };
        return ($traceurRuntime.createClass)(Parser, {
          parseAction: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.any);
            var tokens = this._lexer.tokenize(input);
            var ast = new _ParseAST(input, location, tokens, this._reflector, true).parseChain();
            return assert.returnType((new ASTWithSource(ast, input, location)), ASTWithSource);
          },
          parseBinding: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.any);
            var tokens = this._lexer.tokenize(input);
            var ast = new _ParseAST(input, location, tokens, this._reflector, false).parseChain();
            return assert.returnType((new ASTWithSource(ast, input, location)), ASTWithSource);
          },
          addPipes: function(bindingAst, pipes) {
            if (ListWrapper.isEmpty(pipes))
              return assert.returnType((bindingAst), ASTWithSource);
            var res = ListWrapper.reduce(pipes, (function(result, currentPipeName) {
              return new Pipe(result, currentPipeName, []);
            }), bindingAst.ast);
            return assert.returnType((new ASTWithSource(res, bindingAst.source, bindingAst.location)), ASTWithSource);
          },
          parseTemplateBindings: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.any);
            var tokens = this._lexer.tokenize(input);
            return assert.returnType((new _ParseAST(input, location, tokens, this._reflector, false).parseTemplateBindings()), assert.genericType(List, TemplateBinding));
          },
          parseInterpolation: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.any);
            var parts = StringWrapper.split(input, INTERPOLATION_REGEXP);
            if (parts.length <= 1) {
              return assert.returnType((null), ASTWithSource);
            }
            var strings = [];
            var expressions = [];
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              if (i % 2 === 0) {
                ListWrapper.push(strings, part);
              } else {
                var tokens = this._lexer.tokenize(part);
                var ast = new _ParseAST(input, location, tokens, this._reflector, false).parseChain();
                ListWrapper.push(expressions, ast);
              }
            }
            return assert.returnType((new ASTWithSource(new Interpolation(strings, expressions), input, location)), ASTWithSource);
          },
          wrapLiteralPrimitive: function(input, location) {
            assert.argumentTypes(input, assert.type.string, location, assert.type.any);
            return assert.returnType((new ASTWithSource(new LiteralPrimitive(input), input, location)), ASTWithSource);
          }
        }, {});
      }()));
      Object.defineProperty(Parser, "parameters", {get: function() {
          return [[Lexer], [Reflector]];
        }});
      Object.defineProperty(Parser.prototype.parseAction, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.parseBinding, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.addPipes, "parameters", {get: function() {
          return [[ASTWithSource], [assert.genericType(List, String)]];
        }});
      Object.defineProperty(Parser.prototype.parseTemplateBindings, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.parseInterpolation, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.wrapLiteralPrimitive, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      _ParseAST = (function() {
        var _ParseAST = function _ParseAST(input, location, tokens, reflector, parseAction) {
          assert.argumentTypes(input, assert.type.string, location, assert.type.any, tokens, List, reflector, Reflector, parseAction, assert.type.boolean);
          this.input = input;
          this.location = location;
          this.tokens = tokens;
          this.index = 0;
          this.reflector = reflector;
          this.parseAction = parseAction;
        };
        return ($traceurRuntime.createClass)(_ParseAST, {
          peek: function(offset) {
            assert.argumentTypes(offset, int);
            var i = this.index + offset;
            return assert.returnType((i < this.tokens.length ? this.tokens[i] : EOF), Token);
          },
          get next() {
            return assert.returnType((this.peek(0)), Token);
          },
          get inputIndex() {
            return assert.returnType(((this.index < this.tokens.length) ? this.next.index : this.input.length), int);
          },
          advance: function() {
            this.index++;
          },
          optionalCharacter: function(code) {
            assert.argumentTypes(code, int);
            if (this.next.isCharacter(code)) {
              this.advance();
              return assert.returnType((true), assert.type.boolean);
            } else {
              return assert.returnType((false), assert.type.boolean);
            }
          },
          optionalKeywordVar: function() {
            if (this.peekKeywordVar()) {
              this.advance();
              return assert.returnType((true), assert.type.boolean);
            } else {
              return assert.returnType((false), assert.type.boolean);
            }
          },
          peekKeywordVar: function() {
            return assert.returnType((this.next.isKeywordVar() || this.next.isOperator('#')), assert.type.boolean);
          },
          expectCharacter: function(code) {
            assert.argumentTypes(code, int);
            if (this.optionalCharacter(code))
              return ;
            this.error(("Missing expected " + StringWrapper.fromCharCode(code)));
          },
          optionalOperator: function(op) {
            assert.argumentTypes(op, assert.type.string);
            if (this.next.isOperator(op)) {
              this.advance();
              return assert.returnType((true), assert.type.boolean);
            } else {
              return assert.returnType((false), assert.type.boolean);
            }
          },
          expectOperator: function(operator) {
            assert.argumentTypes(operator, assert.type.string);
            if (this.optionalOperator(operator))
              return ;
            this.error(("Missing expected operator " + operator));
          },
          expectIdentifierOrKeyword: function() {
            var n = this.next;
            if (!n.isIdentifier() && !n.isKeyword()) {
              this.error(("Unexpected token " + n + ", expected identifier or keyword"));
            }
            this.advance();
            return assert.returnType((n.toString()), assert.type.string);
          },
          expectIdentifierOrKeywordOrString: function() {
            var n = this.next;
            if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
              this.error(("Unexpected token " + n + ", expected identifier, keyword, or string"));
            }
            this.advance();
            return assert.returnType((n.toString()), assert.type.string);
          },
          parseChain: function() {
            var exprs = [];
            while (this.index < this.tokens.length) {
              var expr = this.parsePipe();
              ListWrapper.push(exprs, expr);
              if (this.optionalCharacter($SEMICOLON)) {
                if (!this.parseAction) {
                  this.error("Binding expression cannot contain chained expression");
                }
                while (this.optionalCharacter($SEMICOLON)) {}
              } else if (this.index < this.tokens.length) {
                this.error(("Unexpected token '" + this.next + "'"));
              }
            }
            if (exprs.length == 0)
              return assert.returnType((new EmptyExpr()), AST);
            if (exprs.length == 1)
              return assert.returnType((exprs[0]), AST);
            return assert.returnType((new Chain(exprs)), AST);
          },
          parsePipe: function() {
            var result = this.parseExpression();
            while (this.optionalOperator("|")) {
              if (this.parseAction) {
                this.error("Cannot have a pipe in an action expression");
              }
              var name = this.expectIdentifierOrKeyword();
              var args = ListWrapper.create();
              while (this.optionalCharacter($COLON)) {
                ListWrapper.push(args, this.parseExpression());
              }
              result = new Pipe(result, name, args);
            }
            return result;
          },
          parseExpression: function() {
            var start = this.inputIndex;
            var result = this.parseConditional();
            while (this.next.isOperator('=')) {
              if (!result.isAssignable) {
                var end = this.inputIndex;
                var expression = this.input.substring(start, end);
                this.error(("Expression " + expression + " is not assignable"));
              }
              if (!this.parseAction) {
                this.error("Binding expression cannot contain assignments");
              }
              this.expectOperator('=');
              result = new Assignment(result, this.parseConditional());
            }
            return result;
          },
          parseConditional: function() {
            var start = this.inputIndex;
            var result = this.parseLogicalOr();
            if (this.optionalOperator('?')) {
              var yes = this.parseExpression();
              if (!this.optionalCharacter($COLON)) {
                var end = this.inputIndex;
                var expression = this.input.substring(start, end);
                this.error(("Conditional expression " + expression + " requires all 3 expressions"));
              }
              var no = this.parseExpression();
              return new Conditional(result, yes, no);
            } else {
              return result;
            }
          },
          parseLogicalOr: function() {
            var result = this.parseLogicalAnd();
            while (this.optionalOperator('||')) {
              result = new Binary('||', result, this.parseLogicalAnd());
            }
            return result;
          },
          parseLogicalAnd: function() {
            var result = this.parseEquality();
            while (this.optionalOperator('&&')) {
              result = new Binary('&&', result, this.parseEquality());
            }
            return result;
          },
          parseEquality: function() {
            var result = this.parseRelational();
            while (true) {
              if (this.optionalOperator('==')) {
                result = new Binary('==', result, this.parseRelational());
              } else if (this.optionalOperator('!=')) {
                result = new Binary('!=', result, this.parseRelational());
              } else {
                return result;
              }
            }
          },
          parseRelational: function() {
            var result = this.parseAdditive();
            while (true) {
              if (this.optionalOperator('<')) {
                result = new Binary('<', result, this.parseAdditive());
              } else if (this.optionalOperator('>')) {
                result = new Binary('>', result, this.parseAdditive());
              } else if (this.optionalOperator('<=')) {
                result = new Binary('<=', result, this.parseAdditive());
              } else if (this.optionalOperator('>=')) {
                result = new Binary('>=', result, this.parseAdditive());
              } else {
                return result;
              }
            }
          },
          parseAdditive: function() {
            var result = this.parseMultiplicative();
            while (true) {
              if (this.optionalOperator('+')) {
                result = new Binary('+', result, this.parseMultiplicative());
              } else if (this.optionalOperator('-')) {
                result = new Binary('-', result, this.parseMultiplicative());
              } else {
                return result;
              }
            }
          },
          parseMultiplicative: function() {
            var result = this.parsePrefix();
            while (true) {
              if (this.optionalOperator('*')) {
                result = new Binary('*', result, this.parsePrefix());
              } else if (this.optionalOperator('%')) {
                result = new Binary('%', result, this.parsePrefix());
              } else if (this.optionalOperator('/')) {
                result = new Binary('/', result, this.parsePrefix());
              } else {
                return result;
              }
            }
          },
          parsePrefix: function() {
            if (this.optionalOperator('+')) {
              return this.parsePrefix();
            } else if (this.optionalOperator('-')) {
              return new Binary('-', new LiteralPrimitive(0), this.parsePrefix());
            } else if (this.optionalOperator('!')) {
              return new PrefixNot(this.parsePrefix());
            } else {
              return this.parseCallChain();
            }
          },
          parseCallChain: function() {
            var result = this.parsePrimary();
            while (true) {
              if (this.optionalCharacter($PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result);
              } else if (this.optionalCharacter($LBRACKET)) {
                var key = this.parseExpression();
                this.expectCharacter($RBRACKET);
                result = new KeyedAccess(result, key);
              } else if (this.optionalCharacter($LPAREN)) {
                var args = this.parseCallArguments();
                this.expectCharacter($RPAREN);
                result = new FunctionCall(result, args);
              } else {
                return assert.returnType((result), AST);
              }
            }
          },
          parsePrimary: function() {
            if (this.optionalCharacter($LPAREN)) {
              var result = this.parsePipe();
              this.expectCharacter($RPAREN);
              return result;
            } else if (this.next.isKeywordNull() || this.next.isKeywordUndefined()) {
              this.advance();
              return new LiteralPrimitive(null);
            } else if (this.next.isKeywordTrue()) {
              this.advance();
              return new LiteralPrimitive(true);
            } else if (this.next.isKeywordFalse()) {
              this.advance();
              return new LiteralPrimitive(false);
            } else if (this.optionalCharacter($LBRACKET)) {
              var elements = this.parseExpressionList($RBRACKET);
              this.expectCharacter($RBRACKET);
              return new LiteralArray(elements);
            } else if (this.next.isCharacter($LBRACE)) {
              return this.parseLiteralMap();
            } else if (this.next.isIdentifier()) {
              return this.parseAccessMemberOrMethodCall(_implicitReceiver);
            } else if (this.next.isNumber()) {
              var value = this.next.toNumber();
              this.advance();
              return new LiteralPrimitive(value);
            } else if (this.next.isString()) {
              var value = this.next.toString();
              this.advance();
              return new LiteralPrimitive(value);
            } else if (this.index >= this.tokens.length) {
              this.error(("Unexpected end of expression: " + this.input));
            } else {
              this.error(("Unexpected token " + this.next));
            }
          },
          parseExpressionList: function(terminator) {
            assert.argumentTypes(terminator, int);
            var result = [];
            if (!this.next.isCharacter(terminator)) {
              do {
                ListWrapper.push(result, this.parseExpression());
              } while (this.optionalCharacter($COMMA));
            }
            return assert.returnType((result), List);
          },
          parseLiteralMap: function() {
            var keys = [];
            var values = [];
            this.expectCharacter($LBRACE);
            if (!this.optionalCharacter($RBRACE)) {
              do {
                var key = this.expectIdentifierOrKeywordOrString();
                ListWrapper.push(keys, key);
                this.expectCharacter($COLON);
                ListWrapper.push(values, this.parseExpression());
              } while (this.optionalCharacter($COMMA));
              this.expectCharacter($RBRACE);
            }
            return new LiteralMap(keys, values);
          },
          parseAccessMemberOrMethodCall: function(receiver) {
            var id = this.expectIdentifierOrKeyword();
            if (this.optionalCharacter($LPAREN)) {
              var args = this.parseCallArguments();
              this.expectCharacter($RPAREN);
              var fn = this.reflector.method(id);
              return assert.returnType((new MethodCall(receiver, id, fn, args)), AST);
            } else {
              var getter = this.reflector.getter(id);
              var setter = this.reflector.setter(id);
              return assert.returnType((new AccessMember(receiver, id, getter, setter)), AST);
            }
          },
          parseCallArguments: function() {
            if (this.next.isCharacter($RPAREN))
              return [];
            var positionals = [];
            do {
              ListWrapper.push(positionals, this.parseExpression());
            } while (this.optionalCharacter($COMMA));
            return positionals;
          },
          expectTemplateBindingKey: function() {
            var result = '';
            var operatorFound = false;
            do {
              result += this.expectIdentifierOrKeywordOrString();
              operatorFound = this.optionalOperator('-');
              if (operatorFound) {
                result += '-';
              }
            } while (operatorFound);
            return result.toString();
          },
          parseTemplateBindings: function() {
            var bindings = [];
            while (this.index < this.tokens.length) {
              var keyIsVar = assert.type(this.optionalKeywordVar(), assert.type.boolean);
              var key = this.expectTemplateBindingKey();
              this.optionalCharacter($COLON);
              var name = null;
              var expression = null;
              if (this.next !== EOF) {
                if (keyIsVar) {
                  if (this.optionalOperator("=")) {
                    name = this.expectTemplateBindingKey();
                  } else {
                    name = '\$implicit';
                  }
                } else if (!this.peekKeywordVar()) {
                  var start = this.inputIndex;
                  var ast = this.parsePipe();
                  var source = this.input.substring(start, this.inputIndex);
                  expression = new ASTWithSource(ast, source, this.location);
                }
              }
              ListWrapper.push(bindings, new TemplateBinding(key, keyIsVar, name, expression));
              if (!this.optionalCharacter($SEMICOLON)) {
                this.optionalCharacter($COMMA);
              }
              ;
            }
            return bindings;
          },
          error: function(message) {
            var index = arguments[1] !== (void 0) ? arguments[1] : null;
            assert.argumentTypes(message, assert.type.string, index, int);
            if (isBlank(index))
              index = this.index;
            var location = (index < this.tokens.length) ? ("at column " + (this.tokens[index].index + 1) + " in") : "at the end of the expression";
            throw new BaseException(("Parser Error: " + message + " " + location + " [" + this.input + "] in " + this.location));
          }
        }, {});
      }());
      Object.defineProperty(_ParseAST, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any], [List], [Reflector], [assert.type.boolean]];
        }});
      Object.defineProperty(_ParseAST.prototype.peek, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.optionalCharacter, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.expectCharacter, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.optionalOperator, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_ParseAST.prototype.expectOperator, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_ParseAST.prototype.parseExpressionList, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.error, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
    }
  };
});



System.register("angular2/src/di/injector", ["rtts_assert/rtts_assert", "angular2/src/facade/collection", "./binding", "./exceptions", "angular2/src/facade/lang", "angular2/src/facade/async", "./key"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/injector";
  var assert,
      Map,
      List,
      MapWrapper,
      ListWrapper,
      Binding,
      BindingBuilder,
      bind,
      ProviderError,
      NoProviderError,
      InvalidBindingError,
      AsyncBindingError,
      CyclicDependencyError,
      InstantiationError,
      FunctionWrapper,
      Type,
      isPresent,
      isBlank,
      Promise,
      PromiseWrapper,
      Key,
      _constructing,
      _notFound,
      _Waiting,
      Injector,
      _SyncInjectorStrategy,
      _AsyncInjectorStrategy;
  function _isWaiting(obj) {
    return assert.returnType((obj instanceof _Waiting), assert.type.boolean);
  }
  function _flattenBindings(bindings, res) {
    assert.argumentTypes(bindings, List, res, Map);
    ListWrapper.forEach(bindings, function(b) {
      if (b instanceof Binding) {
        MapWrapper.set(res, b.key.id, b);
      } else if (b instanceof Type) {
        var s = bind(b).toClass(b);
        MapWrapper.set(res, s.key.id, s);
      } else if (b instanceof List) {
        _flattenBindings(b, res);
      } else if (b instanceof BindingBuilder) {
        throw new InvalidBindingError(b.token);
      } else {
        throw new InvalidBindingError(b);
      }
    });
    return res;
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Map = $__m.Map;
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Binding = $__m.Binding;
      BindingBuilder = $__m.BindingBuilder;
      bind = $__m.bind;
    }, function($__m) {
      ProviderError = $__m.ProviderError;
      NoProviderError = $__m.NoProviderError;
      InvalidBindingError = $__m.InvalidBindingError;
      AsyncBindingError = $__m.AsyncBindingError;
      CyclicDependencyError = $__m.CyclicDependencyError;
      InstantiationError = $__m.InstantiationError;
    }, function($__m) {
      FunctionWrapper = $__m.FunctionWrapper;
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      Key = $__m.Key;
    }],
    execute: function() {
      _constructing = new Object();
      _notFound = new Object();
      _Waiting = (function() {
        var _Waiting = function _Waiting(promise) {
          assert.argumentTypes(promise, Promise);
          this.promise = promise;
        };
        return ($traceurRuntime.createClass)(_Waiting, {}, {});
      }());
      Object.defineProperty(_Waiting, "parameters", {get: function() {
          return [[Promise]];
        }});
      Injector = $__export("Injector", (function() {
        var Injector = function Injector(bindings) {
          var $__3,
              $__4;
          var $__2 = arguments[1] !== (void 0) ? arguments[1] : {},
              parent = ($__3 = $__2.parent) === void 0 ? null : $__3,
              defaultBindings = ($__4 = $__2.defaultBindings) === void 0 ? false : $__4;
          assert.argumentTypes(bindings, List);
          var flatten = _flattenBindings(bindings, MapWrapper.create());
          this._bindings = this._createListOfBindings(flatten);
          this._instances = this._createInstances();
          this._parent = parent;
          this._defaultBindings = defaultBindings;
          this._asyncStrategy = new _AsyncInjectorStrategy(this);
          this._syncStrategy = new _SyncInjectorStrategy(this);
        };
        return ($traceurRuntime.createClass)(Injector, {
          get: function(token) {
            return this._getByKey(Key.get(token), false, false, false);
          },
          getOptional: function(token) {
            return this._getByKey(Key.get(token), false, false, true);
          },
          asyncGet: function(token) {
            return this._getByKey(Key.get(token), true, false, false);
          },
          createChild: function(bindings) {
            assert.argumentTypes(bindings, List);
            return assert.returnType((new Injector(bindings, {parent: this})), Injector);
          },
          _createListOfBindings: function(flattenBindings) {
            var bindings = ListWrapper.createFixedSize(Key.numberOfKeys + 1);
            MapWrapper.forEach(flattenBindings, (function(v, keyId) {
              return bindings[keyId] = v;
            }));
            return assert.returnType((bindings), List);
          },
          _createInstances: function() {
            return assert.returnType((ListWrapper.createFixedSize(Key.numberOfKeys + 1)), List);
          },
          _getByKey: function(key, returnPromise, returnLazy, optional) {
            var $__0 = this;
            if (returnLazy) {
              return (function() {
                return $__0._getByKey(key, returnPromise, false, optional);
              });
            }
            var strategy = returnPromise ? this._asyncStrategy : this._syncStrategy;
            var instance = strategy.readFromCache(key);
            if (instance !== _notFound)
              return instance;
            instance = strategy.instantiate(key);
            if (instance !== _notFound)
              return instance;
            if (isPresent(this._parent)) {
              return this._parent._getByKey(key, returnPromise, returnLazy, optional);
            }
            if (optional) {
              return null;
            } else {
              throw new NoProviderError(key);
            }
          },
          _resolveDependencies: function(key, binding, forceAsync) {
            var $__0 = this;
            try {
              var getDependency = (function(d) {
                return $__0._getByKey(d.key, forceAsync || d.asPromise, d.lazy, d.optional);
              });
              return assert.returnType((ListWrapper.map(binding.dependencies, getDependency)), List);
            } catch (e) {
              this._clear(key);
              if (e instanceof ProviderError)
                e.addKey(key);
              throw e;
            }
          },
          _getInstance: function(key) {
            assert.argumentTypes(key, Key);
            if (this._instances.length <= key.id)
              return null;
            return ListWrapper.get(this._instances, key.id);
          },
          _setInstance: function(key, obj) {
            assert.argumentTypes(key, Key, obj, assert.type.any);
            ListWrapper.set(this._instances, key.id, obj);
          },
          _getBinding: function(key) {
            assert.argumentTypes(key, Key);
            var binding = this._bindings.length <= key.id ? null : ListWrapper.get(this._bindings, key.id);
            if (isBlank(binding) && this._defaultBindings) {
              return bind(key.token).toClass(key.token);
            } else {
              return binding;
            }
          },
          _markAsConstructing: function(key) {
            assert.argumentTypes(key, Key);
            this._setInstance(key, _constructing);
          },
          _clear: function(key) {
            assert.argumentTypes(key, Key);
            this._setInstance(key, null);
          }
        }, {});
      }()));
      Object.defineProperty(Injector, "parameters", {get: function() {
          return [[List], []];
        }});
      Object.defineProperty(Injector.prototype.createChild, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(Injector.prototype._getByKey, "parameters", {get: function() {
          return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean]];
        }});
      Object.defineProperty(Injector.prototype._resolveDependencies, "parameters", {get: function() {
          return [[Key], [Binding], [assert.type.boolean]];
        }});
      Object.defineProperty(Injector.prototype._getInstance, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(Injector.prototype._setInstance, "parameters", {get: function() {
          return [[Key], []];
        }});
      Object.defineProperty(Injector.prototype._getBinding, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(Injector.prototype._markAsConstructing, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(Injector.prototype._clear, "parameters", {get: function() {
          return [[Key]];
        }});
      _SyncInjectorStrategy = (function() {
        var _SyncInjectorStrategy = function _SyncInjectorStrategy(injector) {
          assert.argumentTypes(injector, Injector);
          this.injector = injector;
        };
        return ($traceurRuntime.createClass)(_SyncInjectorStrategy, {
          readFromCache: function(key) {
            assert.argumentTypes(key, Key);
            if (key.token === Injector) {
              return this.injector;
            }
            var instance = this.injector._getInstance(key);
            if (instance === _constructing) {
              throw new CyclicDependencyError(key);
            } else if (isPresent(instance) && !_isWaiting(instance)) {
              return instance;
            } else {
              return _notFound;
            }
          },
          instantiate: function(key) {
            assert.argumentTypes(key, Key);
            var binding = this.injector._getBinding(key);
            if (isBlank(binding))
              return _notFound;
            if (binding.providedAsPromise)
              throw new AsyncBindingError(key);
            this.injector._markAsConstructing(key);
            var deps = this.injector._resolveDependencies(key, binding, false);
            return this._createInstance(key, binding, deps);
          },
          _createInstance: function(key, binding, deps) {
            assert.argumentTypes(key, Key, binding, Binding, deps, List);
            try {
              var instance = FunctionWrapper.apply(binding.factory, deps);
              this.injector._setInstance(key, instance);
              return instance;
            } catch (e) {
              this.injector._clear(key);
              throw new InstantiationError(e, key);
            }
          }
        }, {});
      }());
      Object.defineProperty(_SyncInjectorStrategy, "parameters", {get: function() {
          return [[Injector]];
        }});
      Object.defineProperty(_SyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_SyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_SyncInjectorStrategy.prototype._createInstance, "parameters", {get: function() {
          return [[Key], [Binding], [List]];
        }});
      _AsyncInjectorStrategy = (function() {
        var _AsyncInjectorStrategy = function _AsyncInjectorStrategy(injector) {
          assert.argumentTypes(injector, Injector);
          this.injector = injector;
        };
        return ($traceurRuntime.createClass)(_AsyncInjectorStrategy, {
          readFromCache: function(key) {
            assert.argumentTypes(key, Key);
            if (key.token === Injector) {
              return PromiseWrapper.resolve(this.injector);
            }
            var instance = this.injector._getInstance(key);
            if (instance === _constructing) {
              throw new CyclicDependencyError(key);
            } else if (_isWaiting(instance)) {
              return instance.promise;
            } else if (isPresent(instance)) {
              return PromiseWrapper.resolve(instance);
            } else {
              return _notFound;
            }
          },
          instantiate: function(key) {
            var $__0 = this;
            var binding = this.injector._getBinding(key);
            if (isBlank(binding))
              return _notFound;
            this.injector._markAsConstructing(key);
            var deps = this.injector._resolveDependencies(key, binding, true);
            var depsPromise = PromiseWrapper.all(deps);
            var promise = PromiseWrapper.then(depsPromise, null, (function(e) {
              return $__0._errorHandler(key, e);
            })).then((function(deps) {
              return $__0._findOrCreate(key, binding, deps);
            })).then((function(instance) {
              return $__0._cacheInstance(key, instance);
            }));
            this.injector._setInstance(key, new _Waiting(promise));
            return promise;
          },
          _errorHandler: function(key, e) {
            assert.argumentTypes(key, Key, e, assert.type.any);
            if (e instanceof ProviderError)
              e.addKey(key);
            return assert.returnType((PromiseWrapper.reject(e)), Promise);
          },
          _findOrCreate: function(key, binding, deps) {
            assert.argumentTypes(key, Key, binding, Binding, deps, List);
            try {
              var instance = this.injector._getInstance(key);
              if (!_isWaiting(instance))
                return instance;
              return FunctionWrapper.apply(binding.factory, deps);
            } catch (e) {
              this.injector._clear(key);
              throw new InstantiationError(e, key);
            }
          },
          _cacheInstance: function(key, instance) {
            this.injector._setInstance(key, instance);
            return instance;
          }
        }, {});
      }());
      Object.defineProperty(_AsyncInjectorStrategy, "parameters", {get: function() {
          return [[Injector]];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype._errorHandler, "parameters", {get: function() {
          return [[Key], []];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype._findOrCreate, "parameters", {get: function() {
          return [[Key], [Binding], [List]];
        }});
      Object.defineProperty(_flattenBindings, "parameters", {get: function() {
          return [[List], [Map]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/shadow_dom_emulation/light_dom", ["rtts_assert/rtts_assert", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/facade/lang", "../view", "../element_injector", "../view_container", "./content_tag"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/shadow_dom_emulation/light_dom";
  var assert,
      DOM,
      List,
      ListWrapper,
      isBlank,
      isPresent,
      viewModule,
      ElementInjector,
      ViewContainer,
      Content,
      DestinationLightDom,
      _Root,
      LightDom;
  function redistributeNodes(contents, nodes) {
    for (var i = 0; i < contents.length; ++i) {
      var content = contents[i];
      var select = content.select;
      var matchSelector = (function(n) {
        return DOM.elementMatches(n, select);
      });
      if (isBlank(select)) {
        content.insert(nodes);
        ListWrapper.clear(nodes);
      } else {
        var matchingNodes = ListWrapper.filter(nodes, matchSelector);
        content.insert(matchingNodes);
        ListWrapper.removeAll(nodes, matchingNodes);
      }
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      ElementInjector = $__m.ElementInjector;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      Content = $__m.Content;
    }],
    execute: function() {
      DestinationLightDom = $__export("DestinationLightDom", (function() {
        var DestinationLightDom = function DestinationLightDom() {};
        return ($traceurRuntime.createClass)(DestinationLightDom, {}, {});
      }()));
      _Root = (function() {
        var _Root = function _Root(node, injector) {
          this.node = node;
          this.injector = injector;
        };
        return ($traceurRuntime.createClass)(_Root, {}, {});
      }());
      LightDom = $__export("LightDom", (function() {
        var LightDom = function LightDom(lightDomView, shadowDomView, element) {
          assert.argumentTypes(lightDomView, viewModule.View, shadowDomView, viewModule.View, element, assert.type.any);
          this.lightDomView = lightDomView;
          this.shadowDomView = shadowDomView;
          this.nodes = DOM.childNodesAsList(element);
          this.roots = null;
        };
        return ($traceurRuntime.createClass)(LightDom, {
          redistribute: function() {
            var tags = this.contentTags();
            if (tags.length > 0) {
              redistributeNodes(tags, this.expandedDomNodes());
            }
          },
          contentTags: function() {
            return assert.returnType((this._collectAllContentTags(this.shadowDomView, [])), assert.genericType(List, Content));
          },
          _collectAllContentTags: function(view, acc) {
            var $__0 = this;
            assert.argumentTypes(view, viewModule.View, acc, assert.genericType(List, Content));
            var eis = view.elementInjectors;
            for (var i = 0; i < eis.length; ++i) {
              var ei = eis[i];
              if (isBlank(ei))
                continue;
              if (ei.hasDirective(Content)) {
                ListWrapper.push(acc, ei.get(Content));
              } else if (ei.hasPreBuiltObject(ViewContainer)) {
                var vc = ei.get(ViewContainer);
                ListWrapper.forEach(vc.contentTagContainers(), (function(view) {
                  $__0._collectAllContentTags(view, acc);
                }));
              }
            }
            return assert.returnType((acc), assert.genericType(List, Content));
          },
          expandedDomNodes: function() {
            var res = [];
            var roots = this._roots();
            for (var i = 0; i < roots.length; ++i) {
              var root = roots[i];
              var ei = root.injector;
              if (isPresent(ei) && ei.hasPreBuiltObject(ViewContainer)) {
                var vc = root.injector.get(ViewContainer);
                res = ListWrapper.concat(res, vc.nodes());
              } else if (isPresent(ei) && ei.hasDirective(Content)) {
                var content = root.injector.get(Content);
                res = ListWrapper.concat(res, content.nodes());
              } else {
                ListWrapper.push(res, root.node);
              }
            }
            return assert.returnType((res), List);
          },
          _roots: function() {
            if (isPresent(this.roots))
              return this.roots;
            var viewInj = this.lightDomView.elementInjectors;
            this.roots = ListWrapper.map(this.nodes, (function(n) {
              return new _Root(n, ListWrapper.find(viewInj, (function(inj) {
                return isPresent(inj) ? inj.forElement(n) : false;
              })));
            }));
            return this.roots;
          }
        }, {});
      }()));
      Object.defineProperty(LightDom, "parameters", {get: function() {
          return [[viewModule.View], [viewModule.View], []];
        }});
      Object.defineProperty(LightDom.prototype._collectAllContentTags, "parameters", {get: function() {
          return [[viewModule.View], [assert.genericType(List, Content)]];
        }});
      Object.defineProperty(redistributeNodes, "parameters", {get: function() {
          return [[assert.genericType(List, Content)], [List]];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/shadow_dom_strategy", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/facade/async", "angular2/src/dom/dom_adapter", "./view", "./shadow_dom_emulation/content_tag", "./shadow_dom_emulation/light_dom", "./shadow_dom_emulation/shadow_css", "./style_inliner", "./style_url_resolver", "./directive_metadata", "./pipeline/compile_step", "./pipeline/compile_element", "./pipeline/compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/shadow_dom_strategy";
  var assert,
      Type,
      isBlank,
      isPresent,
      int,
      List,
      ListWrapper,
      MapWrapper,
      Map,
      PromiseWrapper,
      DOM,
      viewModule,
      Content,
      LightDom,
      ShadowCss,
      StyleInliner,
      StyleUrlResolver,
      DirectiveMetadata,
      NS,
      CompileElement,
      CompileControl,
      ShadowDomStrategy,
      EmulatedUnscopedShadowDomStrategy,
      EmulatedScopedShadowDomStrategy,
      NativeShadowDomStrategy,
      _ShimShadowDomStep,
      _EmulatedUnscopedCssStep,
      _EmulatedScopedCssStep,
      _NativeCssStep,
      _componentUIDs,
      _nextComponentUID,
      _sharedStyleTexts,
      _lastInsertedStyleEl;
  function _moveViewNodesIntoParent(parent, view) {
    for (var i = 0; i < view.nodes.length; ++i) {
      DOM.appendChild(parent, view.nodes[i]);
    }
  }
  function _getComponentId(component) {
    assert.argumentTypes(component, Type);
    var id = MapWrapper.get(_componentUIDs, component);
    if (isBlank(id)) {
      id = _nextComponentUID++;
      MapWrapper.set(_componentUIDs, component, id);
    }
    return id;
  }
  function _insertStyleElement(host, styleEl) {
    if (isBlank(_lastInsertedStyleEl)) {
      var firstChild = DOM.firstChild(host);
      if (isPresent(firstChild)) {
        DOM.insertBefore(firstChild, styleEl);
      } else {
        DOM.appendChild(host, styleEl);
      }
    } else {
      DOM.insertAfter(_lastInsertedStyleEl, styleEl);
    }
    _lastInsertedStyleEl = styleEl;
  }
  function _getHostAttribute(id) {
    assert.argumentTypes(id, int);
    return ("_nghost-" + id);
  }
  function _getContentAttribute(id) {
    assert.argumentTypes(id, int);
    return ("_ngcontent-" + id);
  }
  function _shimCssForComponent(cssText, component) {
    assert.argumentTypes(cssText, assert.type.string, component, Type);
    var id = _getComponentId(component);
    var shadowCss = new ShadowCss();
    return assert.returnType((shadowCss.shimCssText(cssText, _getContentAttribute(id), _getHostAttribute(id))), assert.type.string);
  }
  function resetShadowDomCache() {
    MapWrapper.clear(_componentUIDs);
    _nextComponentUID = 0;
    MapWrapper.clear(_sharedStyleTexts);
    _lastInsertedStyleEl = null;
  }
  $__export("resetShadowDomCache", resetShadowDomCache);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      int = $__m.int;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
    }, function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      Content = $__m.Content;
    }, function($__m) {
      LightDom = $__m.LightDom;
    }, function($__m) {
      ShadowCss = $__m.ShadowCss;
    }, function($__m) {
      StyleInliner = $__m.StyleInliner;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      NS = $__m;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }],
    execute: function() {
      ShadowDomStrategy = $__export("ShadowDomStrategy", (function() {
        var ShadowDomStrategy = function ShadowDomStrategy() {};
        return ($traceurRuntime.createClass)(ShadowDomStrategy, {
          attachTemplate: function(el, view) {
            assert.argumentTypes(el, assert.type.any, view, viewModule.View);
          },
          constructLightDom: function(lightDomView, shadowDomView, el) {
            assert.argumentTypes(lightDomView, viewModule.View, shadowDomView, viewModule.View, el, assert.type.any);
            return assert.returnType((null), LightDom);
          },
          polyfillDirectives: function() {
            return assert.returnType(([]), assert.genericType(List, Type));
          },
          getStyleCompileStep: function(cmpMetadata, templateUrl) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata, templateUrl, assert.type.string);
            return assert.returnType((null), NS.CompileStep);
          },
          getTemplateCompileStep: function(cmpMetadata) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata);
            return assert.returnType((null), NS.CompileStep);
          },
          shimAppElement: function(cmpMetadata, element) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata, element, assert.type.any);
          }
        }, {});
      }()));
      Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[], [viewModule.View]];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
          return [[viewModule.View], [viewModule.View], []];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.getStyleCompileStep, "parameters", {get: function() {
          return [[DirectiveMetadata], [assert.type.string]];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.getTemplateCompileStep, "parameters", {get: function() {
          return [[DirectiveMetadata]];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.shimAppElement, "parameters", {get: function() {
          return [[DirectiveMetadata], []];
        }});
      EmulatedUnscopedShadowDomStrategy = $__export("EmulatedUnscopedShadowDomStrategy", (function($__super) {
        var EmulatedUnscopedShadowDomStrategy = function EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost) {
          assert.argumentTypes(styleUrlResolver, StyleUrlResolver, styleHost, assert.type.any);
          $traceurRuntime.superConstructor(EmulatedUnscopedShadowDomStrategy).call(this);
          this._styleUrlResolver = styleUrlResolver;
          this._styleHost = styleHost;
        };
        return ($traceurRuntime.createClass)(EmulatedUnscopedShadowDomStrategy, {
          attachTemplate: function(el, view) {
            assert.argumentTypes(el, assert.type.any, view, viewModule.View);
            DOM.clearNodes(el);
            _moveViewNodesIntoParent(el, view);
          },
          constructLightDom: function(lightDomView, shadowDomView, el) {
            assert.argumentTypes(lightDomView, viewModule.View, shadowDomView, viewModule.View, el, assert.type.any);
            return assert.returnType((new LightDom(lightDomView, shadowDomView, el)), LightDom);
          },
          polyfillDirectives: function() {
            return assert.returnType(([Content]), assert.genericType(List, Type));
          },
          getStyleCompileStep: function(cmpMetadata, templateUrl) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata, templateUrl, assert.type.string);
            return assert.returnType((new _EmulatedUnscopedCssStep(cmpMetadata, templateUrl, this._styleUrlResolver, this._styleHost)), NS.CompileStep);
          }
        }, {}, $__super);
      }(ShadowDomStrategy)));
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy, "parameters", {get: function() {
          return [[StyleUrlResolver], []];
        }});
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[], [viewModule.View]];
        }});
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
          return [[viewModule.View], [viewModule.View], []];
        }});
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.getStyleCompileStep, "parameters", {get: function() {
          return [[DirectiveMetadata], [assert.type.string]];
        }});
      EmulatedScopedShadowDomStrategy = $__export("EmulatedScopedShadowDomStrategy", (function($__super) {
        var EmulatedScopedShadowDomStrategy = function EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost) {
          assert.argumentTypes(styleInliner, StyleInliner, styleUrlResolver, StyleUrlResolver, styleHost, assert.type.any);
          $traceurRuntime.superConstructor(EmulatedScopedShadowDomStrategy).call(this, styleUrlResolver, styleHost);
          this._styleInliner = styleInliner;
        };
        return ($traceurRuntime.createClass)(EmulatedScopedShadowDomStrategy, {
          getStyleCompileStep: function(cmpMetadata, templateUrl) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata, templateUrl, assert.type.string);
            return assert.returnType((new _EmulatedScopedCssStep(cmpMetadata, templateUrl, this._styleInliner, this._styleUrlResolver, this._styleHost)), NS.CompileStep);
          },
          getTemplateCompileStep: function(cmpMetadata) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata);
            return assert.returnType((new _ShimShadowDomStep(cmpMetadata)), NS.CompileStep);
          },
          shimAppElement: function(cmpMetadata, element) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata, element, assert.type.any);
            var cmpType = cmpMetadata.type;
            var hostAttribute = _getHostAttribute(_getComponentId(cmpType));
            DOM.setAttribute(element, hostAttribute, '');
          }
        }, {}, $__super);
      }(EmulatedUnscopedShadowDomStrategy)));
      Object.defineProperty(EmulatedScopedShadowDomStrategy, "parameters", {get: function() {
          return [[StyleInliner], [StyleUrlResolver], []];
        }});
      Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.getStyleCompileStep, "parameters", {get: function() {
          return [[DirectiveMetadata], [assert.type.string]];
        }});
      Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.getTemplateCompileStep, "parameters", {get: function() {
          return [[DirectiveMetadata]];
        }});
      Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.shimAppElement, "parameters", {get: function() {
          return [[DirectiveMetadata], []];
        }});
      NativeShadowDomStrategy = $__export("NativeShadowDomStrategy", (function($__super) {
        var NativeShadowDomStrategy = function NativeShadowDomStrategy(styleUrlResolver) {
          assert.argumentTypes(styleUrlResolver, StyleUrlResolver);
          $traceurRuntime.superConstructor(NativeShadowDomStrategy).call(this);
          this._styleUrlResolver = styleUrlResolver;
        };
        return ($traceurRuntime.createClass)(NativeShadowDomStrategy, {
          attachTemplate: function(el, view) {
            assert.argumentTypes(el, assert.type.any, view, viewModule.View);
            _moveViewNodesIntoParent(DOM.createShadowRoot(el), view);
          },
          getStyleCompileStep: function(cmpMetadata, templateUrl) {
            assert.argumentTypes(cmpMetadata, DirectiveMetadata, templateUrl, assert.type.string);
            return assert.returnType((new _NativeCssStep(templateUrl, this._styleUrlResolver)), NS.CompileStep);
          }
        }, {}, $__super);
      }(ShadowDomStrategy)));
      Object.defineProperty(NativeShadowDomStrategy, "parameters", {get: function() {
          return [[StyleUrlResolver]];
        }});
      Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[], [viewModule.View]];
        }});
      Object.defineProperty(NativeShadowDomStrategy.prototype.getStyleCompileStep, "parameters", {get: function() {
          return [[DirectiveMetadata], [assert.type.string]];
        }});
      _ShimShadowDomStep = (function($__super) {
        var _ShimShadowDomStep = function _ShimShadowDomStep(cmpMetadata) {
          assert.argumentTypes(cmpMetadata, DirectiveMetadata);
          $traceurRuntime.superConstructor(_ShimShadowDomStep).call(this);
          var id = _getComponentId(cmpMetadata.type);
          this._contentAttribute = _getContentAttribute(id);
        };
        return ($traceurRuntime.createClass)(_ShimShadowDomStep, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            if (current.ignoreBindings) {
              return ;
            }
            DOM.setAttribute(current.element, this._contentAttribute, '');
            var host = current.componentDirective;
            if (isPresent(host)) {
              var hostId = _getComponentId(host.type);
              var hostAttribute = _getHostAttribute(hostId);
              DOM.setAttribute(current.element, hostAttribute, '');
            }
          }}, {}, $__super);
      }(NS.CompileStep));
      Object.defineProperty(_ShimShadowDomStep, "parameters", {get: function() {
          return [[DirectiveMetadata]];
        }});
      Object.defineProperty(_ShimShadowDomStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      _EmulatedUnscopedCssStep = (function($__super) {
        var _EmulatedUnscopedCssStep = function _EmulatedUnscopedCssStep(cmpMetadata, templateUrl, styleUrlResolver, styleHost) {
          assert.argumentTypes(cmpMetadata, DirectiveMetadata, templateUrl, assert.type.string, styleUrlResolver, StyleUrlResolver, styleHost, assert.type.any);
          $traceurRuntime.superConstructor(_EmulatedUnscopedCssStep).call(this);
          this._templateUrl = templateUrl;
          this._styleUrlResolver = styleUrlResolver;
          this._styleHost = styleHost;
        };
        return ($traceurRuntime.createClass)(_EmulatedUnscopedCssStep, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var styleEl = current.element;
            var cssText = DOM.getText(styleEl);
            cssText = this._styleUrlResolver.resolveUrls(cssText, this._templateUrl);
            DOM.setText(styleEl, cssText);
            DOM.remove(styleEl);
            if (!MapWrapper.contains(_sharedStyleTexts, cssText)) {
              MapWrapper.set(_sharedStyleTexts, cssText, true);
              _insertStyleElement(this._styleHost, styleEl);
            }
          }}, {}, $__super);
      }(NS.CompileStep));
      Object.defineProperty(_EmulatedUnscopedCssStep, "parameters", {get: function() {
          return [[DirectiveMetadata], [assert.type.string], [StyleUrlResolver], []];
        }});
      Object.defineProperty(_EmulatedUnscopedCssStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      _EmulatedScopedCssStep = (function($__super) {
        var _EmulatedScopedCssStep = function _EmulatedScopedCssStep(cmpMetadata, templateUrl, styleInliner, styleUrlResolver, styleHost) {
          assert.argumentTypes(cmpMetadata, DirectiveMetadata, templateUrl, assert.type.string, styleInliner, StyleInliner, styleUrlResolver, StyleUrlResolver, styleHost, assert.type.any);
          $traceurRuntime.superConstructor(_EmulatedScopedCssStep).call(this);
          this._templateUrl = templateUrl;
          this._component = cmpMetadata.type;
          this._styleInliner = styleInliner;
          this._styleUrlResolver = styleUrlResolver;
          this._styleHost = styleHost;
        };
        return ($traceurRuntime.createClass)(_EmulatedScopedCssStep, {process: function(parent, current, control) {
            var $__0 = this;
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var styleEl = current.element;
            var cssText = DOM.getText(styleEl);
            cssText = this._styleUrlResolver.resolveUrls(cssText, this._templateUrl);
            var css = this._styleInliner.inlineImports(cssText, this._templateUrl);
            if (PromiseWrapper.isPromise(css)) {
              DOM.setText(styleEl, '');
              ListWrapper.push(parent.inheritedProtoView.stylePromises, css);
              return css.then((function(css) {
                css = _shimCssForComponent(css, $__0._component);
                DOM.setText(styleEl, css);
              }));
            } else {
              css = _shimCssForComponent(css, this._component);
              DOM.setText(styleEl, css);
            }
            DOM.remove(styleEl);
            _insertStyleElement(this._styleHost, styleEl);
          }}, {}, $__super);
      }(NS.CompileStep));
      Object.defineProperty(_EmulatedScopedCssStep, "parameters", {get: function() {
          return [[DirectiveMetadata], [assert.type.string], [StyleInliner], [StyleUrlResolver], []];
        }});
      Object.defineProperty(_EmulatedScopedCssStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      _NativeCssStep = (function($__super) {
        var _NativeCssStep = function _NativeCssStep(templateUrl, styleUrlResover) {
          assert.argumentTypes(templateUrl, assert.type.string, styleUrlResover, StyleUrlResolver);
          $traceurRuntime.superConstructor(_NativeCssStep).call(this);
          this._styleUrlResolver = styleUrlResover;
          this._templateUrl = templateUrl;
        };
        return ($traceurRuntime.createClass)(_NativeCssStep, {process: function(parent, current, control) {
            assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
            var styleEl = current.element;
            var cssText = DOM.getText(styleEl);
            cssText = this._styleUrlResolver.resolveUrls(cssText, this._templateUrl);
            DOM.setText(styleEl, cssText);
          }}, {}, $__super);
      }(NS.CompileStep));
      Object.defineProperty(_NativeCssStep, "parameters", {get: function() {
          return [[assert.type.string], [StyleUrlResolver]];
        }});
      Object.defineProperty(_NativeCssStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      _componentUIDs = assert.type(MapWrapper.create(), assert.genericType(Map, Type, int));
      _nextComponentUID = assert.type(0, int);
      _sharedStyleTexts = assert.type(MapWrapper.create(), assert.genericType(Map, assert.type.string, assert.type.boolean));
      Object.defineProperty(_getComponentId, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(_getHostAttribute, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_getContentAttribute, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_shimCssForComponent, "parameters", {get: function() {
          return [[assert.type.string], [Type]];
        }});
    }
  };
});



System.register("angular2/change_detection", ["rtts_assert/rtts_assert", "./src/change_detection/parser/ast", "./src/change_detection/parser/lexer", "./src/change_detection/parser/parser", "./src/change_detection/parser/context_with_variable_bindings", "./src/change_detection/exceptions", "./src/change_detection/interfaces", "./src/change_detection/proto_change_detector", "./src/change_detection/dynamic_change_detector", "./src/change_detection/pipes/pipe_registry", "./src/change_detection/change_detection_util", "./src/change_detection/pipes/pipe", "./src/change_detection/pipes/array_changes", "./src/change_detection/pipes/keyvalue_changes", "./src/change_detection/pipes/null_pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/change_detection";
  var assert,
      ProtoChangeDetector,
      DynamicProtoChangeDetector,
      JitProtoChangeDetector,
      PipeRegistry,
      ArrayChangesFactory,
      KeyValueChangesFactory,
      NullPipeFactory,
      ChangeDetection,
      defaultPipes,
      DynamicChangeDetection,
      JitChangeDetection,
      _registry,
      dynamicChangeDetection,
      jitChangeDetection;
  var $__exportNames = {
    ChangeDetection: true,
    defaultPipes: true,
    DynamicChangeDetection: true,
    JitChangeDetection: true,
    dynamicChangeDetection: true,
    jitChangeDetection: true,
    undefined: true
  };
  var $__exportNames = {
    ChangeDetection: true,
    defaultPipes: true,
    DynamicChangeDetection: true,
    JitChangeDetection: true,
    dynamicChangeDetection: true,
    jitChangeDetection: true,
    undefined: true
  };
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      $__export("AST", $__m.AST);
    }, function($__m) {
      $__export("Lexer", $__m.Lexer);
    }, function($__m) {
      $__export("Parser", $__m.Parser);
    }, function($__m) {
      $__export("ContextWithVariableBindings", $__m.ContextWithVariableBindings);
    }, function($__m) {
      $__export("ExpressionChangedAfterItHasBeenChecked", $__m.ExpressionChangedAfterItHasBeenChecked);
      $__export("ChangeDetectionError", $__m.ChangeDetectionError);
    }, function($__m) {
      $__export("ChangeRecord", $__m.ChangeRecord);
      $__export("ChangeDispatcher", $__m.ChangeDispatcher);
      $__export("ChangeDetector", $__m.ChangeDetector);
      $__export("CHECK_ONCE", $__m.CHECK_ONCE);
      $__export("CHECK_ALWAYS", $__m.CHECK_ALWAYS);
      $__export("DETACHED", $__m.DETACHED);
      $__export("CHECKED", $__m.CHECKED);
    }, function($__m) {
      ProtoChangeDetector = $__m.ProtoChangeDetector;
      DynamicProtoChangeDetector = $__m.DynamicProtoChangeDetector;
      JitProtoChangeDetector = $__m.JitProtoChangeDetector;
      $__export("ProtoChangeDetector", $__m.ProtoChangeDetector);
      $__export("DynamicProtoChangeDetector", $__m.DynamicProtoChangeDetector);
      $__export("JitProtoChangeDetector", $__m.JitProtoChangeDetector);
      $__export("BindingRecord", $__m.BindingRecord);
    }, function($__m) {
      $__export("DynamicChangeDetector", $__m.DynamicChangeDetector);
    }, function($__m) {
      PipeRegistry = $__m.PipeRegistry;
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      $__export("uninitialized", $__m.uninitialized);
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      ArrayChangesFactory = $__m.ArrayChangesFactory;
    }, function($__m) {
      KeyValueChangesFactory = $__m.KeyValueChangesFactory;
    }, function($__m) {
      NullPipeFactory = $__m.NullPipeFactory;
    }],
    execute: function() {
      ChangeDetection = $__export("ChangeDetection", (function() {
        var ChangeDetection = function ChangeDetection() {};
        return ($traceurRuntime.createClass)(ChangeDetection, {createProtoChangeDetector: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((null), ProtoChangeDetector);
          }}, {});
      }()));
      Object.defineProperty(ChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      defaultPipes = $__export("defaultPipes", {
        "iterableDiff": [new ArrayChangesFactory(), new NullPipeFactory()],
        "keyValDiff": [new KeyValueChangesFactory(), new NullPipeFactory()]
      });
      DynamicChangeDetection = $__export("DynamicChangeDetection", (function($__super) {
        var DynamicChangeDetection = function DynamicChangeDetection(registry) {
          assert.argumentTypes(registry, PipeRegistry);
          $traceurRuntime.superConstructor(DynamicChangeDetection).call(this);
          this.registry = registry;
        };
        return ($traceurRuntime.createClass)(DynamicChangeDetection, {createProtoChangeDetector: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((new DynamicProtoChangeDetector(this.registry)), ProtoChangeDetector);
          }}, {}, $__super);
      }(ChangeDetection)));
      Object.defineProperty(DynamicChangeDetection, "parameters", {get: function() {
          return [[PipeRegistry]];
        }});
      Object.defineProperty(DynamicChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      JitChangeDetection = $__export("JitChangeDetection", (function($__super) {
        var JitChangeDetection = function JitChangeDetection(registry) {
          assert.argumentTypes(registry, PipeRegistry);
          $traceurRuntime.superConstructor(JitChangeDetection).call(this);
          this.registry = registry;
        };
        return ($traceurRuntime.createClass)(JitChangeDetection, {createProtoChangeDetector: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((new JitProtoChangeDetector(this.registry)), ProtoChangeDetector);
          }}, {}, $__super);
      }(ChangeDetection)));
      Object.defineProperty(JitChangeDetection, "parameters", {get: function() {
          return [[PipeRegistry]];
        }});
      Object.defineProperty(JitChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      _registry = new PipeRegistry(defaultPipes);
      dynamicChangeDetection = $__export("dynamicChangeDetection", new DynamicChangeDetection(_registry));
      jitChangeDetection = $__export("jitChangeDetection", new JitChangeDetection(_registry));
    }
  };
});



System.register("angular2/di", ["./src/di/annotations", "./src/di/injector", "./src/di/binding", "./src/di/key", "./src/di/exceptions", "./src/di/opaque_token"], function($__export) {
  "use strict";
  var __moduleName = "angular2/di";
  return {
    setters: [function($__m) {
      $__export("Inject", $__m.Inject);
      $__export("InjectPromise", $__m.InjectPromise);
      $__export("InjectLazy", $__m.InjectLazy);
      $__export("Optional", $__m.Optional);
      $__export("DependencyAnnotation", $__m.DependencyAnnotation);
    }, function($__m) {
      $__export("Injector", $__m.Injector);
    }, function($__m) {
      $__export("Binding", $__m.Binding);
      $__export("Dependency", $__m.Dependency);
      $__export("bind", $__m.bind);
    }, function($__m) {
      $__export("Key", $__m.Key);
      $__export("KeyRegistry", $__m.KeyRegistry);
    }, function($__m) {
      $__export("KeyMetadataError", $__m.KeyMetadataError);
      $__export("NoProviderError", $__m.NoProviderError);
      $__export("ProviderError", $__m.ProviderError);
      $__export("AsyncBindingError", $__m.AsyncBindingError);
      $__export("CyclicDependencyError", $__m.CyclicDependencyError);
      $__export("InstantiationError", $__m.InstantiationError);
      $__export("InvalidBindingError", $__m.InvalidBindingError);
      $__export("NoAnnotationError", $__m.NoAnnotationError);
    }, function($__m) {
      $__export("OpaqueToken", $__m.OpaqueToken);
    }],
    execute: function() {}
  };
});



System.register("angular2/src/core/compiler/element_injector", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/math", "angular2/src/facade/collection", "angular2/di", "angular2/src/core/annotations/visibility", "angular2/src/core/annotations/di", "angular2/src/core/compiler/view", "angular2/src/core/compiler/shadow_dom_emulation/light_dom", "angular2/src/core/compiler/view_container", "angular2/src/core/dom/element", "angular2/src/core/annotations/annotations", "angular2/src/core/compiler/binding_propagation_config", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/element_injector";
  var assert,
      isPresent,
      isBlank,
      Type,
      int,
      BaseException,
      Math,
      List,
      ListWrapper,
      MapWrapper,
      Injector,
      Key,
      Dependency,
      bind,
      Binding,
      NoProviderError,
      ProviderError,
      CyclicDependencyError,
      Parent,
      Ancestor,
      EventEmitter,
      PropertySetter,
      viewModule,
      LightDom,
      DestinationLightDom,
      ViewContainer,
      NgElement,
      Directive,
      onChange,
      onDestroy,
      BindingPropagationConfig,
      reflector,
      _MAX_DIRECTIVE_CONSTRUCTION_COUNTER,
      MAX_DEPTH,
      _undefined,
      _staticKeys,
      StaticKeys,
      TreeNode,
      DirectiveDependency,
      DirectiveBinding,
      PreBuiltObjects,
      ProtoElementInjector,
      ElementInjector,
      OutOfBoundsAccess;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      Type = $__m.Type;
      int = $__m.int;
      BaseException = $__m.BaseException;
    }, function($__m) {
      Math = $__m.Math;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      Injector = $__m.Injector;
      Key = $__m.Key;
      Dependency = $__m.Dependency;
      bind = $__m.bind;
      Binding = $__m.Binding;
      NoProviderError = $__m.NoProviderError;
      ProviderError = $__m.ProviderError;
      CyclicDependencyError = $__m.CyclicDependencyError;
    }, function($__m) {
      Parent = $__m.Parent;
      Ancestor = $__m.Ancestor;
    }, function($__m) {
      EventEmitter = $__m.EventEmitter;
      PropertySetter = $__m.PropertySetter;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      LightDom = $__m.LightDom;
      DestinationLightDom = $__m.DestinationLightDom;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }, function($__m) {
      Directive = $__m.Directive;
      onChange = $__m.onChange;
      onDestroy = $__m.onDestroy;
    }, function($__m) {
      BindingPropagationConfig = $__m.BindingPropagationConfig;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
      _MAX_DIRECTIVE_CONSTRUCTION_COUNTER = 10;
      MAX_DEPTH = Math.pow(2, 30) - 1;
      _undefined = new Object();
      StaticKeys = (function() {
        var StaticKeys = function StaticKeys() {
          this.viewId = Key.get(viewModule.View).id;
          this.ngElementId = Key.get(NgElement).id;
          this.viewContainerId = Key.get(ViewContainer).id;
          this.destinationLightDomId = Key.get(DestinationLightDom).id;
          this.lightDomId = Key.get(LightDom).id;
          this.bindingPropagationConfigId = Key.get(BindingPropagationConfig).id;
        };
        return ($traceurRuntime.createClass)(StaticKeys, {}, {instance: function() {
            if (isBlank(_staticKeys))
              _staticKeys = new StaticKeys();
            return _staticKeys;
          }});
      }());
      TreeNode = (function() {
        var TreeNode = function TreeNode(parent) {
          assert.argumentTypes(parent, TreeNode);
          this._parent = parent;
          this._head = null;
          this._tail = null;
          this._next = null;
          if (isPresent(parent))
            parent._addChild(this);
        };
        return ($traceurRuntime.createClass)(TreeNode, {
          _addChild: function(child) {
            assert.argumentTypes(child, TreeNode);
            if (isPresent(this._tail)) {
              this._tail._next = child;
              this._tail = child;
            } else {
              this._tail = this._head = child;
            }
          },
          get parent() {
            return this._parent;
          },
          set parent(node) {
            assert.argumentTypes(node, TreeNode);
            this._parent = node;
          },
          get children() {
            var res = [];
            var child = this._head;
            while (child != null) {
              ListWrapper.push(res, child);
              child = child._next;
            }
            return res;
          }
        }, {});
      }());
      Object.defineProperty(TreeNode, "parameters", {get: function() {
          return [[TreeNode]];
        }});
      Object.defineProperty(TreeNode.prototype._addChild, "parameters", {get: function() {
          return [[TreeNode]];
        }});
      Object.defineProperty(Object.getOwnPropertyDescriptor(TreeNode.prototype, "parent").set, "parameters", {get: function() {
          return [[TreeNode]];
        }});
      DirectiveDependency = $__export("DirectiveDependency", (function($__super) {
        var DirectiveDependency = function DirectiveDependency(key, asPromise, lazy, optional, properties, depth, eventEmitterName, propSetterName) {
          assert.argumentTypes(key, Key, asPromise, assert.type.boolean, lazy, assert.type.boolean, optional, assert.type.boolean, properties, List, depth, int, eventEmitterName, assert.type.string, propSetterName, assert.type.string);
          $traceurRuntime.superConstructor(DirectiveDependency).call(this, key, asPromise, lazy, optional, properties);
          this.depth = depth;
          this.eventEmitterName = eventEmitterName;
          this.propSetterName = propSetterName;
        };
        return ($traceurRuntime.createClass)(DirectiveDependency, {}, {
          createFrom: function(d) {
            assert.argumentTypes(d, Dependency);
            return assert.returnType((new DirectiveDependency(d.key, d.asPromise, d.lazy, d.optional, d.properties, DirectiveDependency._depth(d.properties), DirectiveDependency._eventEmitterName(d.properties), DirectiveDependency._propSetterName(d.properties))), Dependency);
          },
          _depth: function(properties) {
            if (properties.length == 0)
              return assert.returnType((0), int);
            if (ListWrapper.any(properties, (function(p) {
              return p instanceof Parent;
            })))
              return assert.returnType((1), int);
            if (ListWrapper.any(properties, (function(p) {
              return p instanceof Ancestor;
            })))
              return assert.returnType((MAX_DEPTH), int);
            return assert.returnType((0), int);
          },
          _eventEmitterName: function(properties) {
            for (var i = 0; i < properties.length; i++) {
              if (properties[i] instanceof EventEmitter) {
                return assert.returnType((properties[i].eventName), assert.type.string);
              }
            }
            return assert.returnType((null), assert.type.string);
          },
          _propSetterName: function(properties) {
            for (var i = 0; i < properties.length; i++) {
              if (properties[i] instanceof PropertySetter) {
                return assert.returnType((properties[i].propName), assert.type.string);
              }
            }
            return assert.returnType((null), assert.type.string);
          }
        }, $__super);
      }(Dependency)));
      Object.defineProperty(DirectiveDependency, "parameters", {get: function() {
          return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean], [List], [int], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(DirectiveDependency.createFrom, "parameters", {get: function() {
          return [[Dependency]];
        }});
      DirectiveBinding = $__export("DirectiveBinding", (function($__super) {
        var DirectiveBinding = function DirectiveBinding(key, factory, dependencies, providedAsPromise, annotation) {
          assert.argumentTypes(key, Key, factory, Function, dependencies, List, providedAsPromise, assert.type.boolean, annotation, Directive);
          $traceurRuntime.superConstructor(DirectiveBinding).call(this, key, factory, dependencies, providedAsPromise);
          this.callOnDestroy = isPresent(annotation) && annotation.hasLifecycleHook(onDestroy);
          this.callOnChange = isPresent(annotation) && annotation.hasLifecycleHook(onChange);
        };
        return ($traceurRuntime.createClass)(DirectiveBinding, {}, {
          createFromBinding: function(b, annotation) {
            assert.argumentTypes(b, Binding, annotation, Directive);
            var deps = ListWrapper.map(b.dependencies, DirectiveDependency.createFrom);
            return assert.returnType((new DirectiveBinding(b.key, b.factory, deps, b.providedAsPromise, annotation)), Binding);
          },
          createFromType: function(type, annotation) {
            assert.argumentTypes(type, Type, annotation, Directive);
            var binding = bind(type).toClass(type);
            return assert.returnType((DirectiveBinding.createFromBinding(binding, annotation)), Binding);
          },
          _hasEventEmitter: function(eventName, binding) {
            return ListWrapper.any(binding.dependencies, (function(d) {
              return (d.eventEmitterName == eventName);
            }));
          }
        }, $__super);
      }(Binding)));
      Object.defineProperty(DirectiveBinding, "parameters", {get: function() {
          return [[Key], [Function], [List], [assert.type.boolean], [Directive]];
        }});
      Object.defineProperty(DirectiveBinding.createFromBinding, "parameters", {get: function() {
          return [[Binding], [Directive]];
        }});
      Object.defineProperty(DirectiveBinding.createFromType, "parameters", {get: function() {
          return [[Type], [Directive]];
        }});
      Object.defineProperty(DirectiveBinding._hasEventEmitter, "parameters", {get: function() {
          return [[assert.type.string], [DirectiveBinding]];
        }});
      PreBuiltObjects = $__export("PreBuiltObjects", (function() {
        var PreBuiltObjects = function PreBuiltObjects(view, element, viewContainer, lightDom, bindingPropagationConfig) {
          assert.argumentTypes(view, assert.type.any, element, NgElement, viewContainer, ViewContainer, lightDom, LightDom, bindingPropagationConfig, BindingPropagationConfig);
          this.view = view;
          this.element = element;
          this.viewContainer = viewContainer;
          this.lightDom = lightDom;
          this.bindingPropagationConfig = bindingPropagationConfig;
        };
        return ($traceurRuntime.createClass)(PreBuiltObjects, {}, {});
      }()));
      Object.defineProperty(PreBuiltObjects, "parameters", {get: function() {
          return [[], [NgElement], [ViewContainer], [LightDom], [BindingPropagationConfig]];
        }});
      ProtoElementInjector = $__export("ProtoElementInjector", (function() {
        var ProtoElementInjector = function ProtoElementInjector(parent, index, bindings) {
          var firstBindingIsComponent = arguments[3] !== (void 0) ? arguments[3] : false;
          var distanceToParent = arguments[4] !== (void 0) ? arguments[4] : 0;
          assert.argumentTypes(parent, ProtoElementInjector, index, int, bindings, List, firstBindingIsComponent, assert.type.boolean, distanceToParent, assert.type.number);
          this.parent = parent;
          this.index = index;
          this.distanceToParent = distanceToParent;
          this.exportComponent = false;
          this.exportElement = false;
          this._binding0IsComponent = firstBindingIsComponent;
          this._binding0 = null;
          this._keyId0 = null;
          this._binding1 = null;
          this._keyId1 = null;
          this._binding2 = null;
          this._keyId2 = null;
          this._binding3 = null;
          this._keyId3 = null;
          this._binding4 = null;
          this._keyId4 = null;
          this._binding5 = null;
          this._keyId5 = null;
          this._binding6 = null;
          this._keyId6 = null;
          this._binding7 = null;
          this._keyId7 = null;
          this._binding8 = null;
          this._keyId8 = null;
          this._binding9 = null;
          this._keyId9 = null;
          var length = bindings.length;
          if (length > 0) {
            this._binding0 = this._createBinding(bindings[0]);
            this._keyId0 = this._binding0.key.id;
          }
          if (length > 1) {
            this._binding1 = this._createBinding(bindings[1]);
            this._keyId1 = this._binding1.key.id;
          }
          if (length > 2) {
            this._binding2 = this._createBinding(bindings[2]);
            this._keyId2 = this._binding2.key.id;
          }
          if (length > 3) {
            this._binding3 = this._createBinding(bindings[3]);
            this._keyId3 = this._binding3.key.id;
          }
          if (length > 4) {
            this._binding4 = this._createBinding(bindings[4]);
            this._keyId4 = this._binding4.key.id;
          }
          if (length > 5) {
            this._binding5 = this._createBinding(bindings[5]);
            this._keyId5 = this._binding5.key.id;
          }
          if (length > 6) {
            this._binding6 = this._createBinding(bindings[6]);
            this._keyId6 = this._binding6.key.id;
          }
          if (length > 7) {
            this._binding7 = this._createBinding(bindings[7]);
            this._keyId7 = this._binding7.key.id;
          }
          if (length > 8) {
            this._binding8 = this._createBinding(bindings[8]);
            this._keyId8 = this._binding8.key.id;
          }
          if (length > 9) {
            this._binding9 = this._createBinding(bindings[9]);
            this._keyId9 = this._binding9.key.id;
          }
          if (length > 10) {
            throw 'Maximum number of directives per element has been reached.';
          }
        };
        return ($traceurRuntime.createClass)(ProtoElementInjector, {
          instantiate: function(parent, host) {
            assert.argumentTypes(parent, ElementInjector, host, ElementInjector);
            return assert.returnType((new ElementInjector(this, parent, host)), ElementInjector);
          },
          directParent: function() {
            return assert.returnType((this.distanceToParent < 2 ? this.parent : null), ProtoElementInjector);
          },
          _createBinding: function(bindingOrType) {
            if (bindingOrType instanceof DirectiveBinding) {
              return bindingOrType;
            } else {
              var b = bind(bindingOrType).toClass(bindingOrType);
              return DirectiveBinding.createFromBinding(b, null);
            }
          },
          get hasBindings() {
            return assert.returnType((isPresent(this._binding0)), assert.type.boolean);
          },
          hasEventEmitter: function(eventName) {
            assert.argumentTypes(eventName, assert.type.string);
            var p = this;
            if (isPresent(p._binding0) && DirectiveBinding._hasEventEmitter(eventName, p._binding0))
              return true;
            if (isPresent(p._binding1) && DirectiveBinding._hasEventEmitter(eventName, p._binding1))
              return true;
            if (isPresent(p._binding2) && DirectiveBinding._hasEventEmitter(eventName, p._binding2))
              return true;
            if (isPresent(p._binding3) && DirectiveBinding._hasEventEmitter(eventName, p._binding3))
              return true;
            if (isPresent(p._binding4) && DirectiveBinding._hasEventEmitter(eventName, p._binding4))
              return true;
            if (isPresent(p._binding5) && DirectiveBinding._hasEventEmitter(eventName, p._binding5))
              return true;
            if (isPresent(p._binding6) && DirectiveBinding._hasEventEmitter(eventName, p._binding6))
              return true;
            if (isPresent(p._binding7) && DirectiveBinding._hasEventEmitter(eventName, p._binding7))
              return true;
            if (isPresent(p._binding8) && DirectiveBinding._hasEventEmitter(eventName, p._binding8))
              return true;
            if (isPresent(p._binding9) && DirectiveBinding._hasEventEmitter(eventName, p._binding9))
              return true;
            return false;
          }
        }, {});
      }()));
      Object.defineProperty(ProtoElementInjector, "parameters", {get: function() {
          return [[ProtoElementInjector], [int], [List], [assert.type.boolean], [assert.type.number]];
        }});
      Object.defineProperty(ProtoElementInjector.prototype.instantiate, "parameters", {get: function() {
          return [[ElementInjector], [ElementInjector]];
        }});
      Object.defineProperty(ProtoElementInjector.prototype.hasEventEmitter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      ElementInjector = $__export("ElementInjector", (function($__super) {
        var ElementInjector = function ElementInjector(proto, parent, host) {
          assert.argumentTypes(proto, ProtoElementInjector, parent, ElementInjector, host, ElementInjector);
          $traceurRuntime.superConstructor(ElementInjector).call(this, parent);
          if (isPresent(parent) && isPresent(host)) {
            throw new BaseException('Only either parent or host is allowed');
          }
          this._host = null;
          if (isPresent(parent)) {
            this._host = parent._host;
          } else {
            this._host = host;
          }
          this._proto = proto;
          this._preBuiltObjects = null;
          this._lightDomAppInjector = null;
          this._shadowDomAppInjector = null;
          this._obj0 = null;
          this._obj1 = null;
          this._obj2 = null;
          this._obj3 = null;
          this._obj4 = null;
          this._obj5 = null;
          this._obj6 = null;
          this._obj7 = null;
          this._obj8 = null;
          this._obj9 = null;
          this._constructionCounter = 0;
        };
        return ($traceurRuntime.createClass)(ElementInjector, {
          clearDirectives: function() {
            this._preBuiltObjects = null;
            this._lightDomAppInjector = null;
            this._shadowDomAppInjector = null;
            var p = this._proto;
            if (isPresent(p._binding0) && p._binding0.callOnDestroy) {
              this._obj0.onDestroy();
            }
            if (isPresent(p._binding1) && p._binding1.callOnDestroy) {
              this._obj1.onDestroy();
            }
            if (isPresent(p._binding2) && p._binding2.callOnDestroy) {
              this._obj2.onDestroy();
            }
            if (isPresent(p._binding3) && p._binding3.callOnDestroy) {
              this._obj3.onDestroy();
            }
            if (isPresent(p._binding4) && p._binding4.callOnDestroy) {
              this._obj4.onDestroy();
            }
            if (isPresent(p._binding5) && p._binding5.callOnDestroy) {
              this._obj5.onDestroy();
            }
            if (isPresent(p._binding6) && p._binding6.callOnDestroy) {
              this._obj6.onDestroy();
            }
            if (isPresent(p._binding7) && p._binding7.callOnDestroy) {
              this._obj7.onDestroy();
            }
            if (isPresent(p._binding8) && p._binding8.callOnDestroy) {
              this._obj8.onDestroy();
            }
            if (isPresent(p._binding9) && p._binding9.callOnDestroy) {
              this._obj9.onDestroy();
            }
            this._obj0 = null;
            this._obj1 = null;
            this._obj2 = null;
            this._obj3 = null;
            this._obj4 = null;
            this._obj5 = null;
            this._obj6 = null;
            this._obj7 = null;
            this._obj8 = null;
            this._obj9 = null;
            this._constructionCounter = 0;
          },
          instantiateDirectives: function(lightDomAppInjector, shadowDomAppInjector, preBuiltObjects) {
            assert.argumentTypes(lightDomAppInjector, Injector, shadowDomAppInjector, Injector, preBuiltObjects, PreBuiltObjects);
            this._checkShadowDomAppInjector(shadowDomAppInjector);
            this._preBuiltObjects = preBuiltObjects;
            this._lightDomAppInjector = lightDomAppInjector;
            this._shadowDomAppInjector = shadowDomAppInjector;
            var p = this._proto;
            if (isPresent(p._keyId0))
              this._getDirectiveByKeyId(p._keyId0);
            if (isPresent(p._keyId1))
              this._getDirectiveByKeyId(p._keyId1);
            if (isPresent(p._keyId2))
              this._getDirectiveByKeyId(p._keyId2);
            if (isPresent(p._keyId3))
              this._getDirectiveByKeyId(p._keyId3);
            if (isPresent(p._keyId4))
              this._getDirectiveByKeyId(p._keyId4);
            if (isPresent(p._keyId5))
              this._getDirectiveByKeyId(p._keyId5);
            if (isPresent(p._keyId6))
              this._getDirectiveByKeyId(p._keyId6);
            if (isPresent(p._keyId7))
              this._getDirectiveByKeyId(p._keyId7);
            if (isPresent(p._keyId8))
              this._getDirectiveByKeyId(p._keyId8);
            if (isPresent(p._keyId9))
              this._getDirectiveByKeyId(p._keyId9);
          },
          _checkShadowDomAppInjector: function(shadowDomAppInjector) {
            assert.argumentTypes(shadowDomAppInjector, Injector);
            if (this._proto._binding0IsComponent && isBlank(shadowDomAppInjector)) {
              throw new BaseException('A shadowDomAppInjector is required as this ElementInjector contains a component');
            } else if (!this._proto._binding0IsComponent && isPresent(shadowDomAppInjector)) {
              throw new BaseException('No shadowDomAppInjector allowed as there is not component stored in this ElementInjector');
            }
          },
          get: function(token) {
            return this._getByKey(Key.get(token), 0, false, null);
          },
          hasDirective: function(type) {
            assert.argumentTypes(type, Type);
            return assert.returnType((this._getDirectiveByKeyId(Key.get(type).id) !== _undefined), assert.type.boolean);
          },
          hasPreBuiltObject: function(type) {
            assert.argumentTypes(type, Type);
            var pb = this._getPreBuiltObjectByKeyId(Key.get(type).id);
            return assert.returnType((pb !== _undefined && isPresent(pb)), assert.type.boolean);
          },
          forElement: function(el) {
            return assert.returnType((this._preBuiltObjects.element.domElement === el), assert.type.boolean);
          },
          getNgElement: function() {
            return this._preBuiltObjects.element;
          },
          getComponent: function() {
            if (this._proto._binding0IsComponent) {
              return this._obj0;
            } else {
              throw new BaseException('There is not component stored in this ElementInjector');
            }
          },
          directParent: function() {
            return assert.returnType((this._proto.distanceToParent < 2 ? this.parent : null), ElementInjector);
          },
          _isComponentKey: function(key) {
            assert.argumentTypes(key, Key);
            return this._proto._binding0IsComponent && key.id === this._proto._keyId0;
          },
          _new: function(binding) {
            assert.argumentTypes(binding, Binding);
            if (this._constructionCounter++ > _MAX_DIRECTIVE_CONSTRUCTION_COUNTER) {
              throw new CyclicDependencyError(binding.key);
            }
            var factory = binding.factory;
            var deps = binding.dependencies;
            var length = deps.length;
            var d0,
                d1,
                d2,
                d3,
                d4,
                d5,
                d6,
                d7,
                d8,
                d9;
            try {
              d0 = length > 0 ? this._getByDependency(deps[0], binding.key) : null;
              d1 = length > 1 ? this._getByDependency(deps[1], binding.key) : null;
              d2 = length > 2 ? this._getByDependency(deps[2], binding.key) : null;
              d3 = length > 3 ? this._getByDependency(deps[3], binding.key) : null;
              d4 = length > 4 ? this._getByDependency(deps[4], binding.key) : null;
              d5 = length > 5 ? this._getByDependency(deps[5], binding.key) : null;
              d6 = length > 6 ? this._getByDependency(deps[6], binding.key) : null;
              d7 = length > 7 ? this._getByDependency(deps[7], binding.key) : null;
              d8 = length > 8 ? this._getByDependency(deps[8], binding.key) : null;
              d9 = length > 9 ? this._getByDependency(deps[9], binding.key) : null;
            } catch (e) {
              if (e instanceof ProviderError)
                e.addKey(binding.key);
              throw e;
            }
            var obj;
            switch (length) {
              case 0:
                obj = factory();
                break;
              case 1:
                obj = factory(d0);
                break;
              case 2:
                obj = factory(d0, d1);
                break;
              case 3:
                obj = factory(d0, d1, d2);
                break;
              case 4:
                obj = factory(d0, d1, d2, d3);
                break;
              case 5:
                obj = factory(d0, d1, d2, d3, d4);
                break;
              case 6:
                obj = factory(d0, d1, d2, d3, d4, d5);
                break;
              case 7:
                obj = factory(d0, d1, d2, d3, d4, d5, d6);
                break;
              case 8:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
                break;
              case 9:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                break;
              case 10:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
                break;
              default:
                throw ("Directive " + binding.key.token + " can only have up to 10 dependencies.");
            }
            return obj;
          },
          _getByDependency: function(dep, requestor) {
            assert.argumentTypes(dep, DirectiveDependency, requestor, Key);
            if (isPresent(dep.eventEmitterName))
              return this._buildEventEmitter(dep);
            if (isPresent(dep.propSetterName))
              return this._buildPropSetter(dep);
            return this._getByKey(dep.key, dep.depth, dep.optional, requestor);
          },
          _buildEventEmitter: function(dep) {
            var $__0 = this;
            var view = this._getPreBuiltObjectByKeyId(StaticKeys.instance().viewId);
            return (function(event) {
              view.triggerEventHandlers(dep.eventEmitterName, event, $__0._proto.index);
            });
          },
          _buildPropSetter: function(dep) {
            var ngElement = this._getPreBuiltObjectByKeyId(StaticKeys.instance().ngElementId);
            var domElement = ngElement.domElement;
            var setter = reflector.setter(dep.propSetterName);
            return function(v) {
              setter(domElement, v);
            };
          },
          _getByKey: function(key, depth, optional, requestor) {
            assert.argumentTypes(key, Key, depth, assert.type.number, optional, assert.type.boolean, requestor, Key);
            var ei = this;
            if (!this._shouldIncludeSelf(depth)) {
              depth -= ei._proto.distanceToParent;
              ei = ei._parent;
            }
            while (ei != null && depth >= 0) {
              var preBuiltObj = ei._getPreBuiltObjectByKeyId(key.id);
              if (preBuiltObj !== _undefined)
                return preBuiltObj;
              var dir = ei._getDirectiveByKeyId(key.id);
              if (dir !== _undefined)
                return dir;
              depth -= ei._proto.distanceToParent;
              ei = ei._parent;
            }
            if (isPresent(this._host) && this._host._isComponentKey(key)) {
              return this._host.getComponent();
            } else if (optional) {
              return this._appInjector(requestor).getOptional(key);
            } else {
              return this._appInjector(requestor).get(key);
            }
          },
          _appInjector: function(requestor) {
            assert.argumentTypes(requestor, Key);
            if (isPresent(requestor) && this._isComponentKey(requestor)) {
              return this._shadowDomAppInjector;
            } else {
              return this._lightDomAppInjector;
            }
          },
          _shouldIncludeSelf: function(depth) {
            assert.argumentTypes(depth, int);
            return depth === 0;
          },
          _getPreBuiltObjectByKeyId: function(keyId) {
            assert.argumentTypes(keyId, int);
            var staticKeys = StaticKeys.instance();
            if (keyId === staticKeys.viewId)
              return this._preBuiltObjects.view;
            if (keyId === staticKeys.ngElementId)
              return this._preBuiltObjects.element;
            if (keyId === staticKeys.viewContainerId)
              return this._preBuiltObjects.viewContainer;
            if (keyId === staticKeys.bindingPropagationConfigId)
              return this._preBuiltObjects.bindingPropagationConfig;
            if (keyId === staticKeys.destinationLightDomId) {
              var p = assert.type(this.directParent(), ElementInjector);
              return isPresent(p) ? p._preBuiltObjects.lightDom : null;
            }
            if (keyId === staticKeys.lightDomId) {
              return this._preBuiltObjects.lightDom;
            }
            return _undefined;
          },
          _getDirectiveByKeyId: function(keyId) {
            assert.argumentTypes(keyId, int);
            var p = this._proto;
            if (p._keyId0 === keyId) {
              if (isBlank(this._obj0)) {
                this._obj0 = this._new(p._binding0);
              }
              return this._obj0;
            }
            if (p._keyId1 === keyId) {
              if (isBlank(this._obj1)) {
                this._obj1 = this._new(p._binding1);
              }
              return this._obj1;
            }
            if (p._keyId2 === keyId) {
              if (isBlank(this._obj2)) {
                this._obj2 = this._new(p._binding2);
              }
              return this._obj2;
            }
            if (p._keyId3 === keyId) {
              if (isBlank(this._obj3)) {
                this._obj3 = this._new(p._binding3);
              }
              return this._obj3;
            }
            if (p._keyId4 === keyId) {
              if (isBlank(this._obj4)) {
                this._obj4 = this._new(p._binding4);
              }
              return this._obj4;
            }
            if (p._keyId5 === keyId) {
              if (isBlank(this._obj5)) {
                this._obj5 = this._new(p._binding5);
              }
              return this._obj5;
            }
            if (p._keyId6 === keyId) {
              if (isBlank(this._obj6)) {
                this._obj6 = this._new(p._binding6);
              }
              return this._obj6;
            }
            if (p._keyId7 === keyId) {
              if (isBlank(this._obj7)) {
                this._obj7 = this._new(p._binding7);
              }
              return this._obj7;
            }
            if (p._keyId8 === keyId) {
              if (isBlank(this._obj8)) {
                this._obj8 = this._new(p._binding8);
              }
              return this._obj8;
            }
            if (p._keyId9 === keyId) {
              if (isBlank(this._obj9)) {
                this._obj9 = this._new(p._binding9);
              }
              return this._obj9;
            }
            return _undefined;
          },
          getDirectiveAtIndex: function(index) {
            assert.argumentTypes(index, int);
            if (index == 0)
              return this._obj0;
            if (index == 1)
              return this._obj1;
            if (index == 2)
              return this._obj2;
            if (index == 3)
              return this._obj3;
            if (index == 4)
              return this._obj4;
            if (index == 5)
              return this._obj5;
            if (index == 6)
              return this._obj6;
            if (index == 7)
              return this._obj7;
            if (index == 8)
              return this._obj8;
            if (index == 9)
              return this._obj9;
            throw new OutOfBoundsAccess(index);
          },
          getDirectiveBindingAtIndex: function(index) {
            assert.argumentTypes(index, int);
            var p = this._proto;
            if (index == 0)
              return p._binding0;
            if (index == 1)
              return p._binding1;
            if (index == 2)
              return p._binding2;
            if (index == 3)
              return p._binding3;
            if (index == 4)
              return p._binding4;
            if (index == 5)
              return p._binding5;
            if (index == 6)
              return p._binding6;
            if (index == 7)
              return p._binding7;
            if (index == 8)
              return p._binding8;
            if (index == 9)
              return p._binding9;
            throw new OutOfBoundsAccess(index);
          },
          hasInstances: function() {
            return this._constructionCounter > 0;
          },
          hasEventEmitter: function(eventName) {
            assert.argumentTypes(eventName, assert.type.string);
            return this._proto.hasEventEmitter(eventName);
          },
          isExportingComponent: function() {
            return this._proto.exportComponent;
          },
          isExportingElement: function() {
            return this._proto.exportElement;
          },
          getExportImplicitName: function() {
            return this._proto.exportImplicitName;
          }
        }, {}, $__super);
      }(TreeNode)));
      Object.defineProperty(ElementInjector, "parameters", {get: function() {
          return [[ProtoElementInjector], [ElementInjector], [ElementInjector]];
        }});
      Object.defineProperty(ElementInjector.prototype.instantiateDirectives, "parameters", {get: function() {
          return [[Injector], [Injector], [PreBuiltObjects]];
        }});
      Object.defineProperty(ElementInjector.prototype._checkShadowDomAppInjector, "parameters", {get: function() {
          return [[Injector]];
        }});
      Object.defineProperty(ElementInjector.prototype.hasDirective, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ElementInjector.prototype.hasPreBuiltObject, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ElementInjector.prototype._isComponentKey, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._new, "parameters", {get: function() {
          return [[Binding]];
        }});
      Object.defineProperty(ElementInjector.prototype._getByDependency, "parameters", {get: function() {
          return [[DirectiveDependency], [Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._getByKey, "parameters", {get: function() {
          return [[Key], [assert.type.number], [assert.type.boolean], [Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._appInjector, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._shouldIncludeSelf, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype._getPreBuiltObjectByKeyId, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype._getDirectiveByKeyId, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype.getDirectiveAtIndex, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype.getDirectiveBindingAtIndex, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype.hasEventEmitter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      OutOfBoundsAccess = (function($__super) {
        var OutOfBoundsAccess = function OutOfBoundsAccess(index) {
          $traceurRuntime.superConstructor(OutOfBoundsAccess).call(this);
          this.message = ("Index " + index + " is out-of-bounds.");
        };
        return ($traceurRuntime.createClass)(OutOfBoundsAccess, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
    }
  };
});



System.register("angular2/src/core/annotations/visibility", ["angular2/src/facade/lang", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/visibility";
  var CONST,
      DependencyAnnotation,
      Parent,
      Ancestor;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
    }, function($__m) {
      DependencyAnnotation = $__m.DependencyAnnotation;
    }],
    execute: function() {
      Parent = $__export("Parent", (function($__super) {
        var Parent = function Parent() {
          $traceurRuntime.superConstructor(Parent).call(this);
        };
        return ($traceurRuntime.createClass)(Parent, {}, {}, $__super);
      }(DependencyAnnotation)));
      Object.defineProperty(Parent, "annotations", {get: function() {
          return [new CONST()];
        }});
      Ancestor = $__export("Ancestor", (function($__super) {
        var Ancestor = function Ancestor() {
          $traceurRuntime.superConstructor(Ancestor).call(this);
        };
        return ($traceurRuntime.createClass)(Ancestor, {}, {}, $__super);
      }(DependencyAnnotation)));
      Object.defineProperty(Ancestor, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});



System.register("angular2/src/core/compiler/view", ["rtts_assert/rtts_assert", "angular2/src/dom/dom_adapter", "angular2/src/facade/async", "angular2/src/facade/collection", "angular2/change_detection", "./element_injector", "./binding_propagation_config", "./element_binder", "./directive_metadata", "angular2/src/reflection/types", "angular2/src/facade/lang", "angular2/di", "angular2/src/core/dom/element", "./view_container", "./shadow_dom_emulation/light_dom", "./shadow_dom_strategy", "./view_pool", "angular2/src/core/events/event_manager"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/view";
  var assert,
      DOM,
      Promise,
      ListWrapper,
      MapWrapper,
      Map,
      StringMapWrapper,
      List,
      AST,
      ContextWithVariableBindings,
      ChangeDispatcher,
      ProtoChangeDetector,
      ChangeDetector,
      ChangeRecord,
      BindingRecord,
      uninitialized,
      ProtoElementInjector,
      ElementInjector,
      PreBuiltObjects,
      BindingPropagationConfig,
      ElementBinder,
      DirectiveMetadata,
      SetterFn,
      IMPLEMENTS,
      int,
      isPresent,
      isBlank,
      BaseException,
      Injector,
      NgElement,
      ViewContainer,
      LightDom,
      DestinationLightDom,
      ShadowDomStrategy,
      ViewPool,
      EventManager,
      NG_BINDING_CLASS,
      NG_BINDING_CLASS_SELECTOR,
      VIEW_POOL_CAPACITY,
      VIEW_POOL_PREFILL,
      View,
      ProtoView,
      ElementBindingMemento,
      DirectiveBindingMemento,
      _directiveMementos,
      DirectiveMemento,
      PropertyUpdate;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      AST = $__m.AST;
      ContextWithVariableBindings = $__m.ContextWithVariableBindings;
      ChangeDispatcher = $__m.ChangeDispatcher;
      ProtoChangeDetector = $__m.ProtoChangeDetector;
      ChangeDetector = $__m.ChangeDetector;
      ChangeRecord = $__m.ChangeRecord;
      BindingRecord = $__m.BindingRecord;
      uninitialized = $__m.uninitialized;
    }, function($__m) {
      ProtoElementInjector = $__m.ProtoElementInjector;
      ElementInjector = $__m.ElementInjector;
      PreBuiltObjects = $__m.PreBuiltObjects;
    }, function($__m) {
      BindingPropagationConfig = $__m.BindingPropagationConfig;
    }, function($__m) {
      ElementBinder = $__m.ElementBinder;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      SetterFn = $__m.SetterFn;
    }, function($__m) {
      IMPLEMENTS = $__m.IMPLEMENTS;
      int = $__m.int;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      Injector = $__m.Injector;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      LightDom = $__m.LightDom;
      DestinationLightDom = $__m.DestinationLightDom;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      ViewPool = $__m.ViewPool;
    }, function($__m) {
      EventManager = $__m.EventManager;
    }],
    execute: function() {
      NG_BINDING_CLASS = 'ng-binding';
      NG_BINDING_CLASS_SELECTOR = '.ng-binding';
      VIEW_POOL_CAPACITY = 10000;
      VIEW_POOL_PREFILL = 0;
      View = $__export("View", (function() {
        var View = function View(proto, nodes, protoContextLocals) {
          assert.argumentTypes(proto, ProtoView, nodes, List, protoContextLocals, Map);
          this.proto = proto;
          this.nodes = nodes;
          this.changeDetector = null;
          this.elementInjectors = null;
          this.rootElementInjectors = null;
          this.textNodes = null;
          this.bindElements = null;
          this.componentChildViews = null;
          this.viewContainers = null;
          this.preBuiltObjects = null;
          this.context = null;
          this.contextWithLocals = (MapWrapper.size(protoContextLocals) > 0) ? new ContextWithVariableBindings(null, MapWrapper.clone(protoContextLocals)) : null;
        };
        return ($traceurRuntime.createClass)(View, {
          init: function(changeDetector, elementInjectors, rootElementInjectors, textNodes, bindElements, viewContainers, preBuiltObjects, componentChildViews) {
            assert.argumentTypes(changeDetector, ChangeDetector, elementInjectors, List, rootElementInjectors, List, textNodes, List, bindElements, List, viewContainers, List, preBuiltObjects, List, componentChildViews, List);
            this.changeDetector = changeDetector;
            this.elementInjectors = elementInjectors;
            this.rootElementInjectors = rootElementInjectors;
            this.textNodes = textNodes;
            this.bindElements = bindElements;
            this.viewContainers = viewContainers;
            this.preBuiltObjects = preBuiltObjects;
            this.componentChildViews = componentChildViews;
          },
          setLocal: function(contextName, value) {
            assert.argumentTypes(contextName, assert.type.string, value, assert.type.any);
            if (!this.hydrated())
              throw new BaseException('Cannot set locals on dehydrated view.');
            if (!MapWrapper.contains(this.proto.variableBindings, contextName)) {
              return ;
            }
            var templateName = MapWrapper.get(this.proto.variableBindings, contextName);
            this.context.set(templateName, value);
          },
          hydrated: function() {
            return isPresent(this.context);
          },
          _hydrateContext: function(newContext) {
            if (isPresent(this.contextWithLocals)) {
              this.contextWithLocals.parent = newContext;
              this.context = this.contextWithLocals;
            } else {
              this.context = newContext;
            }
            this.changeDetector.hydrate(this.context);
          },
          _dehydrateContext: function() {
            if (isPresent(this.contextWithLocals)) {
              this.contextWithLocals.clearValues();
            }
            this.context = null;
            this.changeDetector.dehydrate();
          },
          hydrate: function(appInjector, hostElementInjector, context) {
            assert.argumentTypes(appInjector, Injector, hostElementInjector, ElementInjector, context, Object);
            if (this.hydrated())
              throw new BaseException('The view is already hydrated.');
            this._hydrateContext(context);
            for (var i = 0; i < this.viewContainers.length; i++) {
              this.viewContainers[i].hydrate(appInjector, hostElementInjector);
            }
            var binders = this.proto.elementBinders;
            var componentChildViewIndex = 0;
            for (var i = 0; i < binders.length; ++i) {
              var componentDirective = binders[i].componentDirective;
              var shadowDomAppInjector = null;
              if (isPresent(componentDirective)) {
                var services = componentDirective.annotation.services;
                if (isPresent(services))
                  shadowDomAppInjector = appInjector.createChild(services);
                else {
                  shadowDomAppInjector = appInjector;
                }
              } else {
                shadowDomAppInjector = null;
              }
              var elementInjector = this.elementInjectors[i];
              if (isPresent(elementInjector)) {
                elementInjector.instantiateDirectives(appInjector, shadowDomAppInjector, this.preBuiltObjects[i]);
                var exportImplicitName = elementInjector.getExportImplicitName();
                if (elementInjector.isExportingComponent()) {
                  this.context.set(exportImplicitName, elementInjector.getComponent());
                } else if (elementInjector.isExportingElement()) {
                  this.context.set(exportImplicitName, elementInjector.getNgElement().domElement);
                }
              }
              if (isPresent(componentDirective)) {
                this.componentChildViews[componentChildViewIndex++].hydrate(shadowDomAppInjector, elementInjector, elementInjector.getComponent());
              }
            }
            for (var i = 0; i < binders.length; ++i) {
              var componentDirective = binders[i].componentDirective;
              if (isPresent(componentDirective)) {
                var lightDom = this.preBuiltObjects[i].lightDom;
                if (isPresent(lightDom)) {
                  lightDom.redistribute();
                }
              }
            }
          },
          dehydrate: function() {
            for (var i = 0; i < this.componentChildViews.length; i++) {
              this.componentChildViews[i].dehydrate();
            }
            for (var i = 0; i < this.elementInjectors.length; i++) {
              if (isPresent(this.elementInjectors[i])) {
                this.elementInjectors[i].clearDirectives();
              }
            }
            if (isPresent(this.viewContainers)) {
              for (var i = 0; i < this.viewContainers.length; i++) {
                this.viewContainers[i].dehydrate();
              }
            }
            this._dehydrateContext();
          },
          triggerEventHandlers: function(eventName, eventObj, binderIndex) {
            assert.argumentTypes(eventName, assert.type.string, eventObj, assert.type.any, binderIndex, int);
            var handlers = this.proto.eventHandlers[binderIndex];
            if (isBlank(handlers))
              return ;
            var handler = StringMapWrapper.get(handlers, eventName);
            if (isBlank(handler))
              return ;
            handler(eventObj, this);
          },
          onRecordChange: function(directiveMemento, records) {
            assert.argumentTypes(directiveMemento, assert.type.any, records, List);
            this._invokeMementos(records);
            if (directiveMemento instanceof DirectiveMemento) {
              this._notifyDirectiveAboutChanges(directiveMemento, records);
            }
          },
          _invokeMementos: function(records) {
            assert.argumentTypes(records, List);
            for (var i = 0; i < records.length; ++i) {
              this._invokeMementoFor(records[i]);
            }
          },
          _notifyDirectiveAboutChanges: function(directiveMemento, records) {
            assert.argumentTypes(directiveMemento, assert.type.any, records, List);
            var dir = directiveMemento.directive(this.elementInjectors);
            var binding = directiveMemento.directiveBinding(this.elementInjectors);
            if (binding.callOnChange) {
              dir.onChange(this._collectChanges(records));
            }
          },
          _invokeMementoFor: function(record) {
            assert.argumentTypes(record, ChangeRecord);
            var memento = record.bindingMemento;
            if (memento instanceof DirectiveBindingMemento) {
              var directiveMemento = assert.type(memento, DirectiveBindingMemento);
              directiveMemento.invoke(record, this.elementInjectors);
            } else if (memento instanceof ElementBindingMemento) {
              var elementMemento = assert.type(memento, ElementBindingMemento);
              elementMemento.invoke(record, this.bindElements);
            } else {
              var textNodeIndex = assert.type(memento, assert.type.number);
              DOM.setText(this.textNodes[textNodeIndex], record.currentValue);
            }
          },
          _collectChanges: function(records) {
            assert.argumentTypes(records, List);
            var changes = StringMapWrapper.create();
            for (var i = 0; i < records.length; ++i) {
              var record = records[i];
              var propertyUpdate = new PropertyUpdate(record.currentValue, record.previousValue);
              StringMapWrapper.set(changes, record.bindingMemento._setterName, propertyUpdate);
            }
            return changes;
          }
        }, {});
      }()));
      Object.defineProperty(View, "annotations", {get: function() {
          return [new IMPLEMENTS(ChangeDispatcher)];
        }});
      Object.defineProperty(View, "parameters", {get: function() {
          return [[ProtoView], [List], [Map]];
        }});
      Object.defineProperty(View.prototype.init, "parameters", {get: function() {
          return [[ChangeDetector], [List], [List], [List], [List], [List], [List], [List]];
        }});
      Object.defineProperty(View.prototype.setLocal, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(View.prototype.hydrate, "parameters", {get: function() {
          return [[Injector], [ElementInjector], [Object]];
        }});
      Object.defineProperty(View.prototype.triggerEventHandlers, "parameters", {get: function() {
          return [[assert.type.string], [], [int]];
        }});
      Object.defineProperty(View.prototype.onRecordChange, "parameters", {get: function() {
          return [[], [List]];
        }});
      Object.defineProperty(View.prototype._invokeMementos, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(View.prototype._notifyDirectiveAboutChanges, "parameters", {get: function() {
          return [[], [List]];
        }});
      Object.defineProperty(View.prototype._invokeMementoFor, "parameters", {get: function() {
          return [[ChangeRecord]];
        }});
      Object.defineProperty(View.prototype._collectChanges, "parameters", {get: function() {
          return [[List]];
        }});
      ProtoView = $__export("ProtoView", (function() {
        var ProtoView = function ProtoView(template, protoChangeDetector, shadowDomStrategy) {
          assert.argumentTypes(template, assert.type.any, protoChangeDetector, ProtoChangeDetector, shadowDomStrategy, ShadowDomStrategy);
          this.element = template;
          this.elementBinders = [];
          this.variableBindings = MapWrapper.create();
          this.protoContextLocals = MapWrapper.create();
          this.protoChangeDetector = protoChangeDetector;
          this.textNodesWithBindingCount = 0;
          this.elementsWithBindingCount = 0;
          this.instantiateInPlace = false;
          this.rootBindingOffset = (isPresent(this.element) && DOM.hasClass(this.element, NG_BINDING_CLASS)) ? 1 : 0;
          this.isTemplateElement = DOM.isTemplateElement(this.element);
          this.shadowDomStrategy = shadowDomStrategy;
          this._viewPool = new ViewPool(VIEW_POOL_CAPACITY);
          this.stylePromises = [];
          this.eventHandlers = [];
          this.bindingRecords = [];
        };
        return ($traceurRuntime.createClass)(ProtoView, {
          instantiate: function(hostElementInjector, eventManager) {
            assert.argumentTypes(hostElementInjector, ElementInjector, eventManager, EventManager);
            if (this._viewPool.length() == 0)
              this._preFillPool(hostElementInjector, eventManager);
            var view = this._viewPool.pop();
            return assert.returnType((isPresent(view) ? view : this._instantiate(hostElementInjector, eventManager)), View);
          },
          _preFillPool: function(hostElementInjector, eventManager) {
            assert.argumentTypes(hostElementInjector, ElementInjector, eventManager, EventManager);
            for (var i = 0; i < VIEW_POOL_PREFILL; i++) {
              this._viewPool.push(this._instantiate(hostElementInjector, eventManager));
            }
          },
          _instantiate: function(hostElementInjector, eventManager) {
            assert.argumentTypes(hostElementInjector, ElementInjector, eventManager, EventManager);
            var rootElementClone = this.instantiateInPlace ? this.element : DOM.importIntoDoc(this.element);
            var elementsWithBindingsDynamic;
            if (this.isTemplateElement) {
              elementsWithBindingsDynamic = DOM.querySelectorAll(DOM.content(rootElementClone), NG_BINDING_CLASS_SELECTOR);
            } else {
              elementsWithBindingsDynamic = DOM.getElementsByClassName(rootElementClone, NG_BINDING_CLASS);
            }
            var elementsWithBindings = ListWrapper.createFixedSize(elementsWithBindingsDynamic.length);
            for (var binderIdx = 0; binderIdx < elementsWithBindingsDynamic.length; ++binderIdx) {
              elementsWithBindings[binderIdx] = elementsWithBindingsDynamic[binderIdx];
            }
            var viewNodes;
            if (this.isTemplateElement) {
              var childNode = DOM.firstChild(DOM.content(rootElementClone));
              viewNodes = [];
              while (childNode != null) {
                ListWrapper.push(viewNodes, childNode);
                childNode = DOM.nextSibling(childNode);
              }
            } else {
              viewNodes = [rootElementClone];
            }
            var view = new View(this, viewNodes, this.protoContextLocals);
            var changeDetector = this.protoChangeDetector.instantiate(view, this.bindingRecords);
            var binders = this.elementBinders;
            var elementInjectors = ListWrapper.createFixedSize(binders.length);
            var eventHandlers = ListWrapper.createFixedSize(binders.length);
            var rootElementInjectors = [];
            var textNodes = [];
            var elementsWithPropertyBindings = [];
            var preBuiltObjects = ListWrapper.createFixedSize(binders.length);
            var viewContainers = [];
            var componentChildViews = [];
            for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
              var binder = binders[binderIdx];
              var element = void 0;
              if (binderIdx === 0 && this.rootBindingOffset === 1) {
                element = rootElementClone;
              } else {
                element = elementsWithBindings[binderIdx - this.rootBindingOffset];
              }
              var elementInjector = null;
              var protoElementInjector = binder.protoElementInjector;
              if (isPresent(protoElementInjector)) {
                if (isPresent(protoElementInjector.parent)) {
                  var parentElementInjector = elementInjectors[protoElementInjector.parent.index];
                  elementInjector = protoElementInjector.instantiate(parentElementInjector, null);
                } else {
                  elementInjector = protoElementInjector.instantiate(null, hostElementInjector);
                  ListWrapper.push(rootElementInjectors, elementInjector);
                }
              }
              elementInjectors[binderIdx] = elementInjector;
              if (binder.hasElementPropertyBindings) {
                ListWrapper.push(elementsWithPropertyBindings, element);
              }
              var textNodeIndices = binder.textNodeIndices;
              if (isPresent(textNodeIndices)) {
                var childNode = DOM.firstChild(DOM.templateAwareRoot(element));
                for (var j = 0,
                    k = 0; j < textNodeIndices.length; j++) {
                  for (var index = textNodeIndices[j]; k < index; k++) {
                    childNode = DOM.nextSibling(childNode);
                  }
                  ListWrapper.push(textNodes, childNode);
                }
              }
              var lightDom = null;
              var bindingPropagationConfig = null;
              if (isPresent(binder.componentDirective)) {
                var strategy = this.shadowDomStrategy;
                var childView = binder.nestedProtoView.instantiate(elementInjector, eventManager);
                changeDetector.addChild(childView.changeDetector);
                lightDom = strategy.constructLightDom(view, childView, element);
                strategy.attachTemplate(element, childView);
                bindingPropagationConfig = new BindingPropagationConfig(changeDetector);
                ListWrapper.push(componentChildViews, childView);
              }
              var viewContainer = null;
              if (isPresent(binder.viewportDirective)) {
                var destLightDom = this._directParentElementLightDom(protoElementInjector, preBuiltObjects);
                viewContainer = new ViewContainer(view, element, binder.nestedProtoView, elementInjector, eventManager, destLightDom);
                ListWrapper.push(viewContainers, viewContainer);
              }
              if (isPresent(elementInjector)) {
                preBuiltObjects[binderIdx] = new PreBuiltObjects(view, new NgElement(element), viewContainer, lightDom, bindingPropagationConfig);
              }
              if (isPresent(binder.events)) {
                eventHandlers[binderIdx] = StringMapWrapper.create();
                StringMapWrapper.forEach(binder.events, (function(eventMap, eventName) {
                  var handler = ProtoView.buildEventHandler(eventMap, binderIdx);
                  StringMapWrapper.set(eventHandlers[binderIdx], eventName, handler);
                  if (isBlank(elementInjector) || !elementInjector.hasEventEmitter(eventName)) {
                    eventManager.addEventListener(element, eventName, (function(event) {
                      handler(event, view);
                    }));
                  }
                }));
              }
            }
            this.eventHandlers = eventHandlers;
            view.init(changeDetector, elementInjectors, rootElementInjectors, textNodes, elementsWithPropertyBindings, viewContainers, preBuiltObjects, componentChildViews);
            return assert.returnType((view), View);
          },
          returnToPool: function(view) {
            assert.argumentTypes(view, View);
            this._viewPool.push(view);
          },
          _directParentElementLightDom: function(protoElementInjector, preBuiltObjects) {
            assert.argumentTypes(protoElementInjector, ProtoElementInjector, preBuiltObjects, List);
            var p = protoElementInjector.directParent();
            return assert.returnType((isPresent(p) ? preBuiltObjects[p.index].lightDom : null), LightDom);
          },
          bindVariable: function(contextName, templateName) {
            assert.argumentTypes(contextName, assert.type.string, templateName, assert.type.string);
            MapWrapper.set(this.variableBindings, contextName, templateName);
            MapWrapper.set(this.protoContextLocals, templateName, null);
          },
          bindElement: function(protoElementInjector) {
            var componentDirective = arguments[1] !== (void 0) ? arguments[1] : null;
            var viewportDirective = arguments[2] !== (void 0) ? arguments[2] : null;
            assert.argumentTypes(protoElementInjector, ProtoElementInjector, componentDirective, DirectiveMetadata, viewportDirective, DirectiveMetadata);
            var elBinder = new ElementBinder(protoElementInjector, componentDirective, viewportDirective);
            ListWrapper.push(this.elementBinders, elBinder);
            return assert.returnType((elBinder), ElementBinder);
          },
          bindTextNode: function(indexInParent, expression) {
            assert.argumentTypes(indexInParent, int, expression, AST);
            var elBinder = this.elementBinders[this.elementBinders.length - 1];
            if (isBlank(elBinder.textNodeIndices)) {
              elBinder.textNodeIndices = ListWrapper.create();
            }
            ListWrapper.push(elBinder.textNodeIndices, indexInParent);
            var memento = this.textNodesWithBindingCount++;
            ListWrapper.push(this.bindingRecords, new BindingRecord(expression, memento, null));
          },
          bindElementProperty: function(expression, setterName, setter) {
            assert.argumentTypes(expression, AST, setterName, assert.type.string, setter, SetterFn);
            var elBinder = this.elementBinders[this.elementBinders.length - 1];
            if (!elBinder.hasElementPropertyBindings) {
              elBinder.hasElementPropertyBindings = true;
              this.elementsWithBindingCount++;
            }
            var memento = new ElementBindingMemento(this.elementsWithBindingCount - 1, setterName, setter);
            ListWrapper.push(this.bindingRecords, new BindingRecord(expression, memento, null));
          },
          bindEvent: function(eventName, expression) {
            var directiveIndex = arguments[2] !== (void 0) ? arguments[2] : -1;
            assert.argumentTypes(eventName, assert.type.string, expression, AST, directiveIndex, int);
            var elBinder = this.elementBinders[this.elementBinders.length - 1];
            var events = elBinder.events;
            if (isBlank(events)) {
              events = StringMapWrapper.create();
              elBinder.events = events;
            }
            var event = StringMapWrapper.get(events, eventName);
            if (isBlank(event)) {
              event = MapWrapper.create();
              StringMapWrapper.set(events, eventName, event);
            }
            MapWrapper.set(event, directiveIndex, expression);
          },
          bindDirectiveProperty: function(directiveIndex, expression, setterName, setter) {
            assert.argumentTypes(directiveIndex, assert.type.number, expression, AST, setterName, assert.type.string, setter, SetterFn);
            var bindingMemento = new DirectiveBindingMemento(this.elementBinders.length - 1, directiveIndex, setterName, setter);
            var directiveMemento = DirectiveMemento.get(bindingMemento);
            ListWrapper.push(this.bindingRecords, new BindingRecord(expression, bindingMemento, directiveMemento));
          }
        }, {
          buildEventHandler: function(eventMap, injectorIdx) {
            assert.argumentTypes(eventMap, Map, injectorIdx, int);
            var locals = MapWrapper.create();
            return (function(event, view) {
              if (view.hydrated()) {
                MapWrapper.set(locals, '$event', event);
                MapWrapper.forEach(eventMap, (function(expr, directiveIndex) {
                  var context;
                  if (directiveIndex === -1) {
                    context = view.context;
                  } else {
                    context = view.elementInjectors[injectorIdx].getDirectiveAtIndex(directiveIndex);
                  }
                  expr.eval(new ContextWithVariableBindings(context, locals));
                }));
              }
            });
          },
          createRootProtoView: function(protoView, insertionElement, rootComponentAnnotatedType, protoChangeDetector, shadowDomStrategy) {
            assert.argumentTypes(protoView, ProtoView, insertionElement, assert.type.any, rootComponentAnnotatedType, DirectiveMetadata, protoChangeDetector, ProtoChangeDetector, shadowDomStrategy, ShadowDomStrategy);
            DOM.addClass(insertionElement, NG_BINDING_CLASS);
            var cmpType = rootComponentAnnotatedType.type;
            var rootProtoView = new ProtoView(insertionElement, protoChangeDetector, shadowDomStrategy);
            rootProtoView.instantiateInPlace = true;
            var binder = rootProtoView.bindElement(new ProtoElementInjector(null, 0, [cmpType], true));
            binder.componentDirective = rootComponentAnnotatedType;
            binder.nestedProtoView = protoView;
            shadowDomStrategy.shimAppElement(rootComponentAnnotatedType, insertionElement);
            return assert.returnType((rootProtoView), ProtoView);
          }
        });
      }()));
      Object.defineProperty(ProtoView, "parameters", {get: function() {
          return [[], [ProtoChangeDetector], [ShadowDomStrategy]];
        }});
      Object.defineProperty(ProtoView.prototype.instantiate, "parameters", {get: function() {
          return [[ElementInjector], [EventManager]];
        }});
      Object.defineProperty(ProtoView.prototype._preFillPool, "parameters", {get: function() {
          return [[ElementInjector], [EventManager]];
        }});
      Object.defineProperty(ProtoView.prototype._instantiate, "parameters", {get: function() {
          return [[ElementInjector], [EventManager]];
        }});
      Object.defineProperty(ProtoView.prototype.returnToPool, "parameters", {get: function() {
          return [[View]];
        }});
      Object.defineProperty(ProtoView.buildEventHandler, "parameters", {get: function() {
          return [[Map], [int]];
        }});
      Object.defineProperty(ProtoView.prototype._directParentElementLightDom, "parameters", {get: function() {
          return [[ProtoElementInjector], [List]];
        }});
      Object.defineProperty(ProtoView.prototype.bindVariable, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ProtoView.prototype.bindElement, "parameters", {get: function() {
          return [[ProtoElementInjector], [DirectiveMetadata], [DirectiveMetadata]];
        }});
      Object.defineProperty(ProtoView.prototype.bindTextNode, "parameters", {get: function() {
          return [[int], [AST]];
        }});
      Object.defineProperty(ProtoView.prototype.bindElementProperty, "parameters", {get: function() {
          return [[AST], [assert.type.string], [SetterFn]];
        }});
      Object.defineProperty(ProtoView.prototype.bindEvent, "parameters", {get: function() {
          return [[assert.type.string], [AST], [int]];
        }});
      Object.defineProperty(ProtoView.prototype.bindDirectiveProperty, "parameters", {get: function() {
          return [[assert.type.number], [AST], [assert.type.string], [SetterFn]];
        }});
      Object.defineProperty(ProtoView.createRootProtoView, "parameters", {get: function() {
          return [[ProtoView], [], [DirectiveMetadata], [ProtoChangeDetector], [ShadowDomStrategy]];
        }});
      ElementBindingMemento = $__export("ElementBindingMemento", (function() {
        var ElementBindingMemento = function ElementBindingMemento(elementIndex, setterName, setter) {
          assert.argumentTypes(elementIndex, int, setterName, assert.type.string, setter, SetterFn);
          this._elementIndex = elementIndex;
          this._setterName = setterName;
          this._setter = setter;
        };
        return ($traceurRuntime.createClass)(ElementBindingMemento, {invoke: function(record, bindElements) {
            assert.argumentTypes(record, ChangeRecord, bindElements, List);
            var element = bindElements[this._elementIndex];
            this._setter(element, record.currentValue);
          }}, {});
      }()));
      Object.defineProperty(ElementBindingMemento, "parameters", {get: function() {
          return [[int], [assert.type.string], [SetterFn]];
        }});
      Object.defineProperty(ElementBindingMemento.prototype.invoke, "parameters", {get: function() {
          return [[ChangeRecord], [List]];
        }});
      DirectiveBindingMemento = $__export("DirectiveBindingMemento", (function() {
        var DirectiveBindingMemento = function DirectiveBindingMemento(elementInjectorIndex, directiveIndex, setterName, setter) {
          assert.argumentTypes(elementInjectorIndex, assert.type.number, directiveIndex, assert.type.number, setterName, assert.type.string, setter, SetterFn);
          this._elementInjectorIndex = elementInjectorIndex;
          this._directiveIndex = directiveIndex;
          this._setterName = setterName;
          this._setter = setter;
        };
        return ($traceurRuntime.createClass)(DirectiveBindingMemento, {invoke: function(record, elementInjectors) {
            assert.argumentTypes(record, ChangeRecord, elementInjectors, assert.genericType(List, ElementInjector));
            var elementInjector = assert.type(elementInjectors[this._elementInjectorIndex], ElementInjector);
            var directive = elementInjector.getDirectiveAtIndex(this._directiveIndex);
            this._setter(directive, record.currentValue);
          }}, {});
      }()));
      Object.defineProperty(DirectiveBindingMemento, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.number], [assert.type.string], [SetterFn]];
        }});
      Object.defineProperty(DirectiveBindingMemento.prototype.invoke, "parameters", {get: function() {
          return [[ChangeRecord], [assert.genericType(List, ElementInjector)]];
        }});
      _directiveMementos = MapWrapper.create();
      DirectiveMemento = (function() {
        var DirectiveMemento = function DirectiveMemento(elementInjectorIndex, directiveIndex) {
          assert.argumentTypes(elementInjectorIndex, assert.type.number, directiveIndex, assert.type.number);
          this._elementInjectorIndex = elementInjectorIndex;
          this._directiveIndex = directiveIndex;
        };
        return ($traceurRuntime.createClass)(DirectiveMemento, {
          directive: function(elementInjectors) {
            assert.argumentTypes(elementInjectors, assert.genericType(List, ElementInjector));
            var elementInjector = assert.type(elementInjectors[this._elementInjectorIndex], ElementInjector);
            return elementInjector.getDirectiveAtIndex(this._directiveIndex);
          },
          directiveBinding: function(elementInjectors) {
            assert.argumentTypes(elementInjectors, assert.genericType(List, ElementInjector));
            var elementInjector = assert.type(elementInjectors[this._elementInjectorIndex], ElementInjector);
            return elementInjector.getDirectiveBindingAtIndex(this._directiveIndex);
          }
        }, {get: function(memento) {
            assert.argumentTypes(memento, DirectiveBindingMemento);
            var elementInjectorIndex = memento._elementInjectorIndex;
            var directiveIndex = memento._directiveIndex;
            var id = elementInjectorIndex * 100 + directiveIndex;
            if (!MapWrapper.contains(_directiveMementos, id)) {
              MapWrapper.set(_directiveMementos, id, new DirectiveMemento(elementInjectorIndex, directiveIndex));
            }
            return MapWrapper.get(_directiveMementos, id);
          }});
      }());
      Object.defineProperty(DirectiveMemento, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.number]];
        }});
      Object.defineProperty(DirectiveMemento.get, "parameters", {get: function() {
          return [[DirectiveBindingMemento]];
        }});
      Object.defineProperty(DirectiveMemento.prototype.directive, "parameters", {get: function() {
          return [[assert.genericType(List, ElementInjector)]];
        }});
      Object.defineProperty(DirectiveMemento.prototype.directiveBinding, "parameters", {get: function() {
          return [[assert.genericType(List, ElementInjector)]];
        }});
      PropertyUpdate = $__export("PropertyUpdate", (function() {
        var PropertyUpdate = function PropertyUpdate(currentValue, previousValue) {
          this.currentValue = currentValue;
          this.previousValue = previousValue;
        };
        return ($traceurRuntime.createClass)(PropertyUpdate, {}, {createWithoutPrevious: function(currentValue) {
            return new PropertyUpdate(currentValue, uninitialized);
          }});
      }()));
    }
  };
});



System.register("angular2/src/core/compiler/compiler", ["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/collection", "angular2/change_detection", "./directive_metadata_reader", "./view", "./pipeline/compile_pipeline", "./pipeline/compile_element", "./pipeline/default_steps", "./template_loader", "./template_resolver", "./directive_metadata", "../annotations/template", "./shadow_dom_strategy", "./pipeline/compile_step", "./component_url_mapper", "./url_resolver", "./css_processor"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/compiler";
  var assert,
      Type,
      isBlank,
      isPresent,
      BaseException,
      normalizeBlank,
      stringify,
      Promise,
      PromiseWrapper,
      List,
      ListWrapper,
      Map,
      MapWrapper,
      ChangeDetection,
      Parser,
      DirectiveMetadataReader,
      ProtoView,
      CompilePipeline,
      CompileElement,
      createDefaultSteps,
      TemplateLoader,
      TemplateResolver,
      DirectiveMetadata,
      Template,
      ShadowDomStrategy,
      CompileStep,
      ComponentUrlMapper,
      UrlResolver,
      CssProcessor,
      CompilerCache,
      Compiler;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      normalizeBlank = $__m.normalizeBlank;
      stringify = $__m.stringify;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      ChangeDetection = $__m.ChangeDetection;
      Parser = $__m.Parser;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      ProtoView = $__m.ProtoView;
    }, function($__m) {
      CompilePipeline = $__m.CompilePipeline;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      createDefaultSteps = $__m.createDefaultSteps;
    }, function($__m) {
      TemplateLoader = $__m.TemplateLoader;
    }, function($__m) {
      TemplateResolver = $__m.TemplateResolver;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      Template = $__m.Template;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      ComponentUrlMapper = $__m.ComponentUrlMapper;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }, function($__m) {
      CssProcessor = $__m.CssProcessor;
    }],
    execute: function() {
      CompilerCache = $__export("CompilerCache", (function() {
        var CompilerCache = function CompilerCache() {
          this._cache = MapWrapper.create();
        };
        return ($traceurRuntime.createClass)(CompilerCache, {
          set: function(component, protoView) {
            assert.argumentTypes(component, Type, protoView, ProtoView);
            MapWrapper.set(this._cache, component, protoView);
          },
          get: function(component) {
            assert.argumentTypes(component, Type);
            var result = MapWrapper.get(this._cache, component);
            return assert.returnType((normalizeBlank(result)), ProtoView);
          },
          clear: function() {
            MapWrapper.clear(this._cache);
          }
        }, {});
      }()));
      Object.defineProperty(CompilerCache.prototype.set, "parameters", {get: function() {
          return [[Type], [ProtoView]];
        }});
      Object.defineProperty(CompilerCache.prototype.get, "parameters", {get: function() {
          return [[Type]];
        }});
      Compiler = $__export("Compiler", (function() {
        var Compiler = function Compiler(changeDetection, templateLoader, reader, parser, cache, shadowDomStrategy, templateResolver, componentUrlMapper, urlResolver, cssProcessor) {
          assert.argumentTypes(changeDetection, ChangeDetection, templateLoader, TemplateLoader, reader, DirectiveMetadataReader, parser, Parser, cache, CompilerCache, shadowDomStrategy, ShadowDomStrategy, templateResolver, TemplateResolver, componentUrlMapper, ComponentUrlMapper, urlResolver, UrlResolver, cssProcessor, CssProcessor);
          this._changeDetection = changeDetection;
          this._reader = reader;
          this._parser = parser;
          this._compilerCache = cache;
          this._templateLoader = templateLoader;
          this._compiling = MapWrapper.create();
          this._shadowDomStrategy = shadowDomStrategy;
          this._shadowDomDirectives = [];
          var types = shadowDomStrategy.polyfillDirectives();
          for (var i = 0; i < types.length; i++) {
            ListWrapper.push(this._shadowDomDirectives, reader.read(types[i]));
          }
          this._templateResolver = templateResolver;
          this._componentUrlMapper = componentUrlMapper;
          this._urlResolver = urlResolver;
          this._appUrl = urlResolver.resolve(null, './');
          this._cssProcessor = cssProcessor;
        };
        return ($traceurRuntime.createClass)(Compiler, {
          createSteps: function(component, template) {
            var $__0 = this;
            var dirMetadata = [];
            var tplMetadata = ListWrapper.map(this._flattenDirectives(template), (function(d) {
              return $__0._reader.read(d);
            }));
            dirMetadata = ListWrapper.concat(dirMetadata, tplMetadata);
            dirMetadata = ListWrapper.concat(dirMetadata, this._shadowDomDirectives);
            var cmpMetadata = this._reader.read(component);
            var templateUrl = this._templateLoader.getTemplateUrl(template);
            return assert.returnType((createDefaultSteps(this._changeDetection, this._parser, cmpMetadata, dirMetadata, this._shadowDomStrategy, templateUrl, this._cssProcessor)), assert.genericType(List, CompileStep));
          },
          compile: function(component) {
            assert.argumentTypes(component, Type);
            var protoView = this._compile(component);
            return assert.returnType((PromiseWrapper.isPromise(protoView) ? protoView : PromiseWrapper.resolve(protoView)), assert.genericType(Promise, ProtoView));
          },
          _compile: function(component) {
            var $__0 = this;
            var protoView = this._compilerCache.get(component);
            if (isPresent(protoView)) {
              return protoView;
            }
            var pvPromise = MapWrapper.get(this._compiling, component);
            if (isPresent(pvPromise)) {
              return pvPromise;
            }
            var template = this._templateResolver.resolve(component);
            var componentUrl = this._componentUrlMapper.getUrl(component);
            var baseUrl = this._urlResolver.resolve(this._appUrl, componentUrl);
            this._templateLoader.setBaseUrl(template, baseUrl);
            var tplElement = this._templateLoader.load(template);
            if (PromiseWrapper.isPromise(tplElement)) {
              pvPromise = PromiseWrapper.then(tplElement, (function(el) {
                return $__0._compileTemplate(template, el, component);
              }), (function(_) {
                throw new BaseException(("Failed to load the template for " + stringify(component)));
              }));
              MapWrapper.set(this._compiling, component, pvPromise);
              return pvPromise;
            }
            return this._compileTemplate(template, tplElement, component);
          },
          _compileTemplate: function(template, tplElement, component) {
            var pipeline = new CompilePipeline(this.createSteps(component, template));
            var compileElements;
            try {
              compileElements = pipeline.process(tplElement, stringify(component));
            } catch (ex) {
              return PromiseWrapper.reject(ex);
            }
            var protoView = compileElements[0].inheritedProtoView;
            this._compilerCache.set(component, protoView);
            MapWrapper.delete(this._compiling, component);
            var nestedPVPromises = [];
            for (var i = 0; i < compileElements.length; i++) {
              var ce = compileElements[i];
              if (isPresent(ce.componentDirective)) {
                this._compileNestedProtoView(ce, nestedPVPromises);
              }
            }
            if (protoView.stylePromises.length > 0) {
              var syncProtoView = protoView;
              protoView = PromiseWrapper.all(syncProtoView.stylePromises).then((function(_) {
                return syncProtoView;
              }));
            }
            if (nestedPVPromises.length > 0) {
              return PromiseWrapper.then(PromiseWrapper.all(nestedPVPromises), (function(_) {
                return protoView;
              }), (function(e) {
                throw new BaseException((e.message + " -> Failed to compile " + stringify(component)));
              }));
            }
            return protoView;
          },
          _compileNestedProtoView: function(ce, promises) {
            assert.argumentTypes(ce, CompileElement, promises, assert.genericType(List, Promise));
            var protoView = this._compile(ce.componentDirective.type);
            if (PromiseWrapper.isPromise(protoView)) {
              ListWrapper.push(promises, protoView.then(function(pv) {
                ce.inheritedElementBinder.nestedProtoView = pv;
              }));
            } else {
              ce.inheritedElementBinder.nestedProtoView = protoView;
            }
          },
          _flattenDirectives: function(template) {
            assert.argumentTypes(template, Template);
            if (isBlank(template.directives))
              return assert.returnType(([]), assert.genericType(List, Type));
            var directives = [];
            this._flattenList(template.directives, directives);
            return assert.returnType((directives), assert.genericType(List, Type));
          },
          _flattenList: function(tree, out) {
            assert.argumentTypes(tree, assert.genericType(List, assert.type.any), out, assert.genericType(List, Type));
            for (var i = 0; i < tree.length; i++) {
              var item = tree[i];
              if (ListWrapper.isList(item)) {
                this._flattenList(item, out);
              } else {
                ListWrapper.push(out, item);
              }
            }
          }
        }, {});
      }()));
      Object.defineProperty(Compiler, "parameters", {get: function() {
          return [[ChangeDetection], [TemplateLoader], [DirectiveMetadataReader], [Parser], [CompilerCache], [ShadowDomStrategy], [TemplateResolver], [ComponentUrlMapper], [UrlResolver], [CssProcessor]];
        }});
      Object.defineProperty(Compiler.prototype.createSteps, "parameters", {get: function() {
          return [[Type], [Template]];
        }});
      Object.defineProperty(Compiler.prototype.compile, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(Compiler.prototype._compile, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(Compiler.prototype._compileTemplate, "parameters", {get: function() {
          return [[Template], [], [Type]];
        }});
      Object.defineProperty(Compiler.prototype._compileNestedProtoView, "parameters", {get: function() {
          return [[CompileElement], [assert.genericType(List, Promise)]];
        }});
      Object.defineProperty(Compiler.prototype._flattenDirectives, "parameters", {get: function() {
          return [[Template]];
        }});
      Object.defineProperty(Compiler.prototype._flattenList, "parameters", {get: function() {
          return [[assert.genericType(List, assert.type.any)], [assert.genericType(List, Type)]];
        }});
    }
  };
});



System.register("angular2/src/core/application", ["rtts_assert/rtts_assert", "angular2/di", "angular2/src/facade/lang", "angular2/src/dom/browser_adapter", "angular2/src/dom/dom_adapter", "./compiler/compiler", "./compiler/view", "angular2/src/reflection/reflection", "angular2/change_detection", "./exception_handler", "./compiler/template_loader", "./compiler/template_resolver", "./compiler/directive_metadata_reader", "angular2/src/facade/collection", "angular2/src/facade/async", "angular2/src/core/zone/vm_turn_zone", "angular2/src/core/life_cycle/life_cycle", "angular2/src/core/compiler/shadow_dom_strategy", "angular2/src/core/compiler/xhr/xhr", "angular2/src/core/compiler/xhr/xhr_impl", "angular2/src/core/events/event_manager", "angular2/src/core/events/hammer_gestures", "angular2/src/di/binding", "angular2/src/core/compiler/component_url_mapper", "angular2/src/core/compiler/url_resolver", "angular2/src/core/compiler/style_url_resolver", "angular2/src/core/compiler/style_inliner", "angular2/src/core/compiler/css_processor"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/application";
  var assert,
      Injector,
      bind,
      OpaqueToken,
      Type,
      isBlank,
      isPresent,
      BaseException,
      assertionsEnabled,
      print,
      BrowserDomAdapter,
      DOM,
      Compiler,
      CompilerCache,
      ProtoView,
      Reflector,
      reflector,
      Parser,
      Lexer,
      ChangeDetection,
      dynamicChangeDetection,
      jitChangeDetection,
      ExceptionHandler,
      TemplateLoader,
      TemplateResolver,
      DirectiveMetadataReader,
      List,
      ListWrapper,
      Promise,
      PromiseWrapper,
      VmTurnZone,
      LifeCycle,
      ShadowDomStrategy,
      NativeShadowDomStrategy,
      EmulatedUnscopedShadowDomStrategy,
      XHR,
      XHRImpl,
      EventManager,
      DomEventsPlugin,
      HammerGesturesPlugin,
      Binding,
      ComponentUrlMapper,
      UrlResolver,
      StyleUrlResolver,
      StyleInliner,
      CssProcessor,
      _rootInjector,
      _rootBindings,
      appViewToken,
      appChangeDetectorToken,
      appElementToken,
      appComponentAnnotatedTypeToken,
      appDocumentToken;
  function _injectorBindings(appComponentType) {
    return assert.returnType(([bind(appDocumentToken).toValue(DOM.defaultDoc()), bind(appComponentAnnotatedTypeToken).toFactory((function(reader) {
      return reader.read(appComponentType);
    }), [DirectiveMetadataReader]), bind(appElementToken).toFactory((function(appComponentAnnotatedType, appDocument) {
      var selector = appComponentAnnotatedType.annotation.selector;
      var element = DOM.querySelector(appDocument, selector);
      if (isBlank(element)) {
        throw new BaseException(("The app selector \"" + selector + "\" did not match any elements"));
      }
      return element;
    }), [appComponentAnnotatedTypeToken, appDocumentToken]), bind(appViewToken).toAsyncFactory((function(changeDetection, compiler, injector, appElement, appComponentAnnotatedType, strategy, eventManager) {
      return compiler.compile(appComponentAnnotatedType.type).then((function(protoView) {
        var appProtoView = ProtoView.createRootProtoView(protoView, appElement, appComponentAnnotatedType, changeDetection.createProtoChangeDetector('root'), strategy);
        var view = appProtoView.instantiate(null, eventManager);
        view.hydrate(injector, null, new Object());
        return view;
      }));
    }), [ChangeDetection, Compiler, Injector, appElementToken, appComponentAnnotatedTypeToken, ShadowDomStrategy, EventManager]), bind(appChangeDetectorToken).toFactory((function(rootView) {
      return rootView.changeDetector;
    }), [appViewToken]), bind(appComponentType).toFactory((function(rootView) {
      return rootView.elementInjectors[0].getComponent();
    }), [appViewToken]), bind(LifeCycle).toFactory((function(exceptionHandler) {
      return new LifeCycle(exceptionHandler, null, assertionsEnabled());
    }), [ExceptionHandler]), bind(EventManager).toFactory((function(zone) {
      var plugins = [new HammerGesturesPlugin(), new DomEventsPlugin()];
      return new EventManager(plugins, zone);
    }), [VmTurnZone]), bind(ShadowDomStrategy).toFactory((function(styleUrlResolver, doc) {
      return new EmulatedUnscopedShadowDomStrategy(styleUrlResolver, doc.head);
    }), [StyleUrlResolver, appDocumentToken]), Compiler, CompilerCache, TemplateResolver, bind(ChangeDetection).toValue(dynamicChangeDetection), TemplateLoader, DirectiveMetadataReader, Parser, Lexer, ExceptionHandler, bind(XHR).toValue(new XHRImpl()), ComponentUrlMapper, UrlResolver, StyleUrlResolver, StyleInliner, bind(CssProcessor).toFactory((function() {
      return new CssProcessor(null);
    }), [])]), assert.genericType(List, Binding));
  }
  function _createVmZone(givenReporter) {
    assert.argumentTypes(givenReporter, Function);
    var defaultErrorReporter = (function(exception, stackTrace) {
      var longStackTrace = ListWrapper.join(stackTrace, "\n\n-----async gap-----\n");
      print((exception + "\n\n" + longStackTrace));
      throw exception;
    });
    var reporter = isPresent(givenReporter) ? givenReporter : defaultErrorReporter;
    var zone = new VmTurnZone({enableLongStackTrace: assertionsEnabled()});
    zone.initCallbacks({onErrorHandler: reporter});
    return assert.returnType((zone), VmTurnZone);
  }
  function bootstrap(appComponentType) {
    var componentServiceBindings = arguments[1] !== (void 0) ? arguments[1] : null;
    var errorReporter = arguments[2] !== (void 0) ? arguments[2] : null;
    assert.argumentTypes(appComponentType, Type, componentServiceBindings, assert.genericType(List, Binding), errorReporter, Function);
    BrowserDomAdapter.makeCurrent();
    var bootstrapProcess = PromiseWrapper.completer();
    var zone = _createVmZone(errorReporter);
    zone.run((function() {
      var appInjector = _createAppInjector(appComponentType, componentServiceBindings, zone);
      PromiseWrapper.then(appInjector.asyncGet(appViewToken), (function(rootView) {
        var lc = appInjector.get(LifeCycle);
        lc.registerWith(zone, rootView.changeDetector);
        lc.tick();
        bootstrapProcess.resolve(appInjector);
      }), (function(err) {
        bootstrapProcess.reject(err);
      }));
    }));
    return assert.returnType((bootstrapProcess.promise), assert.genericType(Promise, Injector));
  }
  function _createAppInjector(appComponentType, bindings, zone) {
    assert.argumentTypes(appComponentType, Type, bindings, assert.genericType(List, Binding), zone, VmTurnZone);
    if (isBlank(_rootInjector))
      _rootInjector = new Injector(_rootBindings);
    var mergedBindings = isPresent(bindings) ? ListWrapper.concat(_injectorBindings(appComponentType), bindings) : _injectorBindings(appComponentType);
    ListWrapper.push(mergedBindings, bind(VmTurnZone).toValue(zone));
    return assert.returnType((_rootInjector.createChild(mergedBindings)), Injector);
  }
  $__export("bootstrap", bootstrap);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Injector = $__m.Injector;
      bind = $__m.bind;
      OpaqueToken = $__m.OpaqueToken;
    }, function($__m) {
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      assertionsEnabled = $__m.assertionsEnabled;
      print = $__m.print;
    }, function($__m) {
      BrowserDomAdapter = $__m.BrowserDomAdapter;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Compiler = $__m.Compiler;
      CompilerCache = $__m.CompilerCache;
    }, function($__m) {
      ProtoView = $__m.ProtoView;
    }, function($__m) {
      Reflector = $__m.Reflector;
      reflector = $__m.reflector;
    }, function($__m) {
      Parser = $__m.Parser;
      Lexer = $__m.Lexer;
      ChangeDetection = $__m.ChangeDetection;
      dynamicChangeDetection = $__m.dynamicChangeDetection;
      jitChangeDetection = $__m.jitChangeDetection;
    }, function($__m) {
      ExceptionHandler = $__m.ExceptionHandler;
    }, function($__m) {
      TemplateLoader = $__m.TemplateLoader;
    }, function($__m) {
      TemplateResolver = $__m.TemplateResolver;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }, function($__m) {
      LifeCycle = $__m.LifeCycle;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
      NativeShadowDomStrategy = $__m.NativeShadowDomStrategy;
      EmulatedUnscopedShadowDomStrategy = $__m.EmulatedUnscopedShadowDomStrategy;
    }, function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      XHRImpl = $__m.XHRImpl;
    }, function($__m) {
      EventManager = $__m.EventManager;
      DomEventsPlugin = $__m.DomEventsPlugin;
    }, function($__m) {
      HammerGesturesPlugin = $__m.HammerGesturesPlugin;
    }, function($__m) {
      Binding = $__m.Binding;
    }, function($__m) {
      ComponentUrlMapper = $__m.ComponentUrlMapper;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      StyleInliner = $__m.StyleInliner;
    }, function($__m) {
      CssProcessor = $__m.CssProcessor;
    }],
    execute: function() {
      _rootBindings = [bind(Reflector).toValue(reflector)];
      appViewToken = $__export("appViewToken", new OpaqueToken('AppView'));
      appChangeDetectorToken = $__export("appChangeDetectorToken", new OpaqueToken('AppChangeDetector'));
      appElementToken = $__export("appElementToken", new OpaqueToken('AppElement'));
      appComponentAnnotatedTypeToken = $__export("appComponentAnnotatedTypeToken", new OpaqueToken('AppComponentAnnotatedType'));
      appDocumentToken = $__export("appDocumentToken", new OpaqueToken('AppDocument'));
      Object.defineProperty(_createVmZone, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(bootstrap, "parameters", {get: function() {
          return [[Type], [assert.genericType(List, Binding)], [Function]];
        }});
      Object.defineProperty(_createAppInjector, "parameters", {get: function() {
          return [[Type], [assert.genericType(List, Binding)], [VmTurnZone]];
        }});
    }
  };
});



System.register("angular2/core", ["./src/core/annotations/annotations", "./src/core/annotations/visibility", "./src/core/compiler/interfaces", "./src/core/annotations/template", "./src/core/application", "./src/core/compiler/compiler", "./src/core/compiler/template_loader", "./src/core/compiler/view", "./src/core/compiler/view_container", "./src/core/compiler/binding_propagation_config", "./src/core/dom/element"], function($__export) {
  "use strict";
  var __moduleName = "angular2/core";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});



System.register("angular2/angular2", ["./change_detection", "./core", "./directives", "./forms"], function($__export) {
  "use strict";
  var __moduleName = "angular2/angular2";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

