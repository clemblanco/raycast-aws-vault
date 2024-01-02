"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/dequal/lite/index.js
var require_lite = __commonJS({
  "node_modules/dequal/lite/index.js"(exports) {
    var has = Object.prototype.hasOwnProperty;
    function dequal(foo, bar) {
      var ctor, len;
      if (foo === bar)
        return true;
      if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
        if (ctor === Date)
          return foo.getTime() === bar.getTime();
        if (ctor === RegExp)
          return foo.toString() === bar.toString();
        if (ctor === Array) {
          if ((len = foo.length) === bar.length) {
            while (len-- && dequal(foo[len], bar[len]))
              ;
          }
          return len === -1;
        }
        if (!ctor || typeof foo === "object") {
          len = 0;
          for (ctor in foo) {
            if (has.call(foo, ctor) && ++len && !has.call(bar, ctor))
              return false;
            if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor]))
              return false;
          }
          return Object.keys(bar).length === len;
        }
      }
      return foo !== foo && bar !== bar;
    }
    exports.dequal = dequal;
  }
});

// node_modules/@raycast/utils/dist/useDeepMemo.js
var require_useDeepMemo = __commonJS({
  "node_modules/@raycast/utils/dist/useDeepMemo.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDeepMemo = void 0;
    var react_1 = require("react");
    var lite_1 = require_lite();
    function useDeepMemo(value) {
      const ref = (0, react_1.useRef)(value);
      const signalRef = (0, react_1.useRef)(0);
      if (!(0, lite_1.dequal)(value, ref.current)) {
        ref.current = value;
        signalRef.current += 1;
      }
      return (0, react_1.useMemo)(() => ref.current, [signalRef.current]);
    }
    exports.useDeepMemo = useDeepMemo;
  }
});

// node_modules/@raycast/utils/dist/useLatest.js
var require_useLatest = __commonJS({
  "node_modules/@raycast/utils/dist/useLatest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useLatest = void 0;
    var react_1 = require("react");
    function useLatest(value) {
      const ref = (0, react_1.useRef)(value);
      ref.current = value;
      return ref;
    }
    exports.useLatest = useLatest;
  }
});

// node_modules/@raycast/utils/dist/usePromise.js
var require_usePromise = __commonJS({
  "node_modules/@raycast/utils/dist/usePromise.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.usePromise = void 0;
    var react_1 = require("react");
    var api_1 = require("@raycast/api");
    var useDeepMemo_1 = require_useDeepMemo();
    var useLatest_1 = require_useLatest();
    function usePromise(fn, args, options) {
      const lastCallId = (0, react_1.useRef)(0);
      const [state, set] = (0, react_1.useState)({ isLoading: true });
      const fnRef = (0, useLatest_1.useLatest)(fn);
      const latestAbortable = (0, useLatest_1.useLatest)(options?.abortable);
      const latestArgs = (0, useLatest_1.useLatest)(args || []);
      const latestOnError = (0, useLatest_1.useLatest)(options?.onError);
      const latestOnData = (0, useLatest_1.useLatest)(options?.onData);
      const latestOnWillExecute = (0, useLatest_1.useLatest)(options?.onWillExecute);
      const latestValue = (0, useLatest_1.useLatest)(state.data);
      const latestCallback = (0, react_1.useRef)();
      const callback = (0, react_1.useCallback)(
        (...args2) => {
          const callId = ++lastCallId.current;
          if (latestAbortable.current) {
            latestAbortable.current.current?.abort();
            latestAbortable.current.current = new AbortController();
          }
          latestOnWillExecute.current?.(args2);
          set((prevState) => ({ ...prevState, isLoading: true }));
          return fnRef.current(...args2).then((data) => {
            if (callId === lastCallId.current) {
              if (latestOnData.current) {
                latestOnData.current(data);
              }
              set({ data, isLoading: false });
            }
            return data;
          }, (error) => {
            if (error.name == "AbortError") {
              return error;
            }
            if (callId === lastCallId.current) {
              if (latestOnError.current) {
                latestOnError.current(error);
              } else {
                console.error(error);
                if (api_1.environment.launchType !== api_1.LaunchType.Background) {
                  (0, api_1.showToast)({
                    style: api_1.Toast.Style.Failure,
                    title: "Failed to fetch latest data",
                    message: error.message,
                    primaryAction: {
                      title: "Retry",
                      onAction(toast) {
                        toast.hide();
                        latestCallback.current?.(...latestArgs.current || []);
                      }
                    },
                    secondaryAction: {
                      title: "Copy Logs",
                      onAction(toast) {
                        toast.hide();
                        api_1.Clipboard.copy(error?.stack || error?.message || "");
                      }
                    }
                  });
                }
              }
              set({ error, isLoading: false });
            }
            return error;
          });
        },
        [latestAbortable, latestOnData, latestOnError, latestArgs, fnRef, set, latestCallback, latestOnWillExecute]
      );
      latestCallback.current = callback;
      const revalidate = (0, react_1.useCallback)(() => {
        return callback(...latestArgs.current || []);
      }, [callback, latestArgs]);
      const mutate = (0, react_1.useCallback)(async (asyncUpdate, options2) => {
        let dataBeforeOptimisticUpdate;
        try {
          if (options2?.optimisticUpdate) {
            if (typeof options2?.rollbackOnError !== "function" && options2?.rollbackOnError !== false) {
              dataBeforeOptimisticUpdate = structuredClone(latestValue.current?.value);
            }
            const update = options2.optimisticUpdate;
            set((prevState) => ({ ...prevState, data: update(prevState.data) }));
          }
          return await asyncUpdate;
        } catch (err) {
          if (typeof options2?.rollbackOnError === "function") {
            const update = options2.rollbackOnError;
            set((prevState) => ({ ...prevState, data: update(prevState.data) }));
          } else if (options2?.optimisticUpdate && options2?.rollbackOnError !== false) {
            set((prevState) => ({ ...prevState, data: dataBeforeOptimisticUpdate }));
          }
          throw err;
        } finally {
          if (options2?.shouldRevalidateAfter !== false) {
            if (api_1.environment.launchType === api_1.LaunchType.Background || api_1.environment.commandMode === "menu-bar") {
              await revalidate();
            } else {
              revalidate();
            }
          }
        }
      }, [revalidate, latestValue, set]);
      (0, react_1.useEffect)(() => {
        if (options?.execute !== false) {
          callback(...args || []);
        }
      }, [(0, useDeepMemo_1.useDeepMemo)([args, options?.execute, callback])]);
      (0, react_1.useEffect)(() => {
        return () => {
          if (latestAbortable.current) {
            latestAbortable.current.current?.abort();
          }
        };
      }, [latestAbortable]);
      return { ...state, revalidate, mutate };
    }
    exports.usePromise = usePromise;
  }
});

// node_modules/@raycast/utils/dist/useCachedState.js
var require_useCachedState = __commonJS({
  "node_modules/@raycast/utils/dist/useCachedState.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCachedState = void 0;
    var react_1 = require("react");
    var api_1 = require("@raycast/api");
    var useLatest_1 = require_useLatest();
    function replacer(key, _value) {
      const value = this[key];
      if (value instanceof Date) {
        return `__raycast_cached_date__${value.toString()}`;
      }
      if (Buffer.isBuffer(value)) {
        return `__raycast_cached_buffer__${value.toString("base64")}`;
      }
      return _value;
    }
    function reviver(_key, value) {
      if (typeof value === "string" && value.startsWith("__raycast_cached_date__")) {
        return new Date(value.replace("__raycast_cached_date__", ""));
      }
      if (typeof value === "string" && value.startsWith("__raycast_cached_buffer__")) {
        return Buffer.from(value.replace("__raycast_cached_buffer__", ""), "base64");
      }
      return value;
    }
    var rootCache = Symbol("cache without namespace");
    var cacheMap = /* @__PURE__ */ new Map();
    function useCachedState(key, initialState, config) {
      const cacheKey = config?.cacheNamespace || rootCache;
      const cache = cacheMap.get(cacheKey) || cacheMap.set(cacheKey, new api_1.Cache({ namespace: config?.cacheNamespace })).get(cacheKey);
      if (!cache) {
        throw new Error("Missing cache");
      }
      const keyRef = (0, useLatest_1.useLatest)(key);
      const initialValueRef = (0, useLatest_1.useLatest)(initialState);
      const cachedState = (0, react_1.useSyncExternalStore)(cache.subscribe, () => {
        try {
          return cache.get(keyRef.current);
        } catch (error) {
          console.error("Could not get Cache data:", error);
          return void 0;
        }
      });
      const state = (0, react_1.useMemo)(() => {
        if (typeof cachedState !== "undefined") {
          if (cachedState === "undefined") {
            return void 0;
          }
          return JSON.parse(cachedState, reviver);
        } else {
          return initialValueRef.current;
        }
      }, [cachedState, initialValueRef]);
      const stateRef = (0, useLatest_1.useLatest)(state);
      const setStateAndCache = (0, react_1.useCallback)((updater) => {
        const newValue = typeof updater === "function" ? updater(stateRef.current) : updater;
        if (typeof newValue === "undefined") {
          cache.set(keyRef.current, "undefined");
        } else {
          const stringifiedValue = JSON.stringify(newValue, replacer);
          cache.set(keyRef.current, stringifiedValue);
        }
        return newValue;
      }, [cache, keyRef, stateRef]);
      return [state, setStateAndCache];
    }
    exports.useCachedState = useCachedState;
  }
});

// node_modules/object-hash/index.js
var require_object_hash = __commonJS({
  "node_modules/object-hash/index.js"(exports, module2) {
    "use strict";
    var crypto = require("crypto");
    exports = module2.exports = objectHash;
    function objectHash(object, options) {
      options = applyDefaults(object, options);
      return hash(object, options);
    }
    exports.sha1 = function(object) {
      return objectHash(object);
    };
    exports.keys = function(object) {
      return objectHash(object, { excludeValues: true, algorithm: "sha1", encoding: "hex" });
    };
    exports.MD5 = function(object) {
      return objectHash(object, { algorithm: "md5", encoding: "hex" });
    };
    exports.keysMD5 = function(object) {
      return objectHash(object, { algorithm: "md5", encoding: "hex", excludeValues: true });
    };
    var hashes = crypto.getHashes ? crypto.getHashes().slice() : ["sha1", "md5"];
    hashes.push("passthrough");
    var encodings = ["buffer", "hex", "binary", "base64"];
    function applyDefaults(object, sourceOptions) {
      sourceOptions = sourceOptions || {};
      var options = {};
      options.algorithm = sourceOptions.algorithm || "sha1";
      options.encoding = sourceOptions.encoding || "hex";
      options.excludeValues = sourceOptions.excludeValues ? true : false;
      options.algorithm = options.algorithm.toLowerCase();
      options.encoding = options.encoding.toLowerCase();
      options.ignoreUnknown = sourceOptions.ignoreUnknown !== true ? false : true;
      options.respectType = sourceOptions.respectType === false ? false : true;
      options.respectFunctionNames = sourceOptions.respectFunctionNames === false ? false : true;
      options.respectFunctionProperties = sourceOptions.respectFunctionProperties === false ? false : true;
      options.unorderedArrays = sourceOptions.unorderedArrays !== true ? false : true;
      options.unorderedSets = sourceOptions.unorderedSets === false ? false : true;
      options.unorderedObjects = sourceOptions.unorderedObjects === false ? false : true;
      options.replacer = sourceOptions.replacer || void 0;
      options.excludeKeys = sourceOptions.excludeKeys || void 0;
      if (typeof object === "undefined") {
        throw new Error("Object argument required.");
      }
      for (var i = 0; i < hashes.length; ++i) {
        if (hashes[i].toLowerCase() === options.algorithm.toLowerCase()) {
          options.algorithm = hashes[i];
        }
      }
      if (hashes.indexOf(options.algorithm) === -1) {
        throw new Error('Algorithm "' + options.algorithm + '"  not supported. supported values: ' + hashes.join(", "));
      }
      if (encodings.indexOf(options.encoding) === -1 && options.algorithm !== "passthrough") {
        throw new Error('Encoding "' + options.encoding + '"  not supported. supported values: ' + encodings.join(", "));
      }
      return options;
    }
    function isNativeFunction(f) {
      if (typeof f !== "function") {
        return false;
      }
      var exp = /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i;
      return exp.exec(Function.prototype.toString.call(f)) != null;
    }
    function hash(object, options) {
      var hashingStream;
      if (options.algorithm !== "passthrough") {
        hashingStream = crypto.createHash(options.algorithm);
      } else {
        hashingStream = new PassThrough();
      }
      if (typeof hashingStream.write === "undefined") {
        hashingStream.write = hashingStream.update;
        hashingStream.end = hashingStream.update;
      }
      var hasher = typeHasher(options, hashingStream);
      hasher.dispatch(object);
      if (!hashingStream.update) {
        hashingStream.end("");
      }
      if (hashingStream.digest) {
        return hashingStream.digest(options.encoding === "buffer" ? void 0 : options.encoding);
      }
      var buf = hashingStream.read();
      if (options.encoding === "buffer") {
        return buf;
      }
      return buf.toString(options.encoding);
    }
    exports.writeToStream = function(object, options, stream) {
      if (typeof stream === "undefined") {
        stream = options;
        options = {};
      }
      options = applyDefaults(object, options);
      return typeHasher(options, stream).dispatch(object);
    };
    function typeHasher(options, writeTo, context) {
      context = context || [];
      var write = function(str) {
        if (writeTo.update) {
          return writeTo.update(str, "utf8");
        } else {
          return writeTo.write(str, "utf8");
        }
      };
      return {
        dispatch: function(value) {
          if (options.replacer) {
            value = options.replacer(value);
          }
          var type = typeof value;
          if (value === null) {
            type = "null";
          }
          return this["_" + type](value);
        },
        _object: function(object) {
          var pattern = /\[object (.*)\]/i;
          var objString = Object.prototype.toString.call(object);
          var objType = pattern.exec(objString);
          if (!objType) {
            objType = "unknown:[" + objString + "]";
          } else {
            objType = objType[1];
          }
          objType = objType.toLowerCase();
          var objectNumber = null;
          if ((objectNumber = context.indexOf(object)) >= 0) {
            return this.dispatch("[CIRCULAR:" + objectNumber + "]");
          } else {
            context.push(object);
          }
          if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
            write("buffer:");
            return write(object);
          }
          if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
            if (this["_" + objType]) {
              this["_" + objType](object);
            } else if (options.ignoreUnknown) {
              return write("[" + objType + "]");
            } else {
              throw new Error('Unknown object type "' + objType + '"');
            }
          } else {
            var keys = Object.keys(object);
            if (options.unorderedObjects) {
              keys = keys.sort();
            }
            if (options.respectType !== false && !isNativeFunction(object)) {
              keys.splice(0, 0, "prototype", "__proto__", "constructor");
            }
            if (options.excludeKeys) {
              keys = keys.filter(function(key) {
                return !options.excludeKeys(key);
              });
            }
            write("object:" + keys.length + ":");
            var self = this;
            return keys.forEach(function(key) {
              self.dispatch(key);
              write(":");
              if (!options.excludeValues) {
                self.dispatch(object[key]);
              }
              write(",");
            });
          }
        },
        _array: function(arr, unordered) {
          unordered = typeof unordered !== "undefined" ? unordered : options.unorderedArrays !== false;
          var self = this;
          write("array:" + arr.length + ":");
          if (!unordered || arr.length <= 1) {
            return arr.forEach(function(entry) {
              return self.dispatch(entry);
            });
          }
          var contextAdditions = [];
          var entries = arr.map(function(entry) {
            var strm = new PassThrough();
            var localContext = context.slice();
            var hasher = typeHasher(options, strm, localContext);
            hasher.dispatch(entry);
            contextAdditions = contextAdditions.concat(localContext.slice(context.length));
            return strm.read().toString();
          });
          context = context.concat(contextAdditions);
          entries.sort();
          return this._array(entries, false);
        },
        _date: function(date) {
          return write("date:" + date.toJSON());
        },
        _symbol: function(sym) {
          return write("symbol:" + sym.toString());
        },
        _error: function(err) {
          return write("error:" + err.toString());
        },
        _boolean: function(bool) {
          return write("bool:" + bool.toString());
        },
        _string: function(string) {
          write("string:" + string.length + ":");
          write(string.toString());
        },
        _function: function(fn) {
          write("fn:");
          if (isNativeFunction(fn)) {
            this.dispatch("[native]");
          } else {
            this.dispatch(fn.toString());
          }
          if (options.respectFunctionNames !== false) {
            this.dispatch("function-name:" + String(fn.name));
          }
          if (options.respectFunctionProperties) {
            this._object(fn);
          }
        },
        _number: function(number) {
          return write("number:" + number.toString());
        },
        _xml: function(xml) {
          return write("xml:" + xml.toString());
        },
        _null: function() {
          return write("Null");
        },
        _undefined: function() {
          return write("Undefined");
        },
        _regexp: function(regex) {
          return write("regex:" + regex.toString());
        },
        _uint8array: function(arr) {
          write("uint8array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint8clampedarray: function(arr) {
          write("uint8clampedarray:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int8array: function(arr) {
          write("int8array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint16array: function(arr) {
          write("uint16array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int16array: function(arr) {
          write("int16array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint32array: function(arr) {
          write("uint32array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int32array: function(arr) {
          write("int32array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _float32array: function(arr) {
          write("float32array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _float64array: function(arr) {
          write("float64array:");
          return this.dispatch(Array.prototype.slice.call(arr));
        },
        _arraybuffer: function(arr) {
          write("arraybuffer:");
          return this.dispatch(new Uint8Array(arr));
        },
        _url: function(url) {
          return write("url:" + url.toString(), "utf8");
        },
        _map: function(map) {
          write("map:");
          var arr = Array.from(map);
          return this._array(arr, options.unorderedSets !== false);
        },
        _set: function(set) {
          write("set:");
          var arr = Array.from(set);
          return this._array(arr, options.unorderedSets !== false);
        },
        _file: function(file) {
          write("file:");
          return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
        },
        _blob: function() {
          if (options.ignoreUnknown) {
            return write("[blob]");
          }
          throw Error('Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse "options.replacer" or "options.ignoreUnknown"\n');
        },
        _domwindow: function() {
          return write("domwindow");
        },
        _bigint: function(number) {
          return write("bigint:" + number.toString());
        },
        _process: function() {
          return write("process");
        },
        _timer: function() {
          return write("timer");
        },
        _pipe: function() {
          return write("pipe");
        },
        _tcp: function() {
          return write("tcp");
        },
        _udp: function() {
          return write("udp");
        },
        _tty: function() {
          return write("tty");
        },
        _statwatcher: function() {
          return write("statwatcher");
        },
        _securecontext: function() {
          return write("securecontext");
        },
        _connection: function() {
          return write("connection");
        },
        _zlib: function() {
          return write("zlib");
        },
        _context: function() {
          return write("context");
        },
        _nodescript: function() {
          return write("nodescript");
        },
        _httpparser: function() {
          return write("httpparser");
        },
        _dataview: function() {
          return write("dataview");
        },
        _signal: function() {
          return write("signal");
        },
        _fsevent: function() {
          return write("fsevent");
        },
        _tlswrap: function() {
          return write("tlswrap");
        }
      };
    }
    function PassThrough() {
      return {
        buf: "",
        write: function(b) {
          this.buf += b;
        },
        end: function(b) {
          this.buf += b;
        },
        read: function() {
          return this.buf;
        }
      };
    }
  }
});

// node_modules/@raycast/utils/dist/useCachedPromise.js
var require_useCachedPromise = __commonJS({
  "node_modules/@raycast/utils/dist/useCachedPromise.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCachedPromise = void 0;
    var react_1 = require("react");
    var object_hash_1 = __importDefault(require_object_hash());
    var useCachedState_1 = require_useCachedState();
    var usePromise_1 = require_usePromise();
    var useLatest_1 = require_useLatest();
    var emptyCache = Symbol();
    function useCachedPromise(fn, args, options) {
      const { initialData, keepPreviousData, ...usePromiseOptions } = options || {};
      const lastUpdateFrom = (0, react_1.useRef)();
      const [cachedData, mutateCache] = (0, useCachedState_1.useCachedState)((0, object_hash_1.default)(args || []), emptyCache, {
        cacheNamespace: (0, object_hash_1.default)(fn)
      });
      const laggyDataRef = (0, react_1.useRef)(cachedData !== emptyCache ? cachedData : initialData);
      const {
        mutate: _mutate,
        revalidate,
        ...state
      } = (0, usePromise_1.usePromise)(fn, args || [], {
        ...usePromiseOptions,
        onData(data2) {
          if (usePromiseOptions.onData) {
            usePromiseOptions.onData(data2);
          }
          lastUpdateFrom.current = "promise";
          laggyDataRef.current = data2;
          mutateCache(data2);
        }
      });
      const data = cachedData !== emptyCache ? cachedData : initialData;
      const returnedData = lastUpdateFrom.current === "promise" ? laggyDataRef.current : keepPreviousData ? cachedData !== emptyCache ? cachedData : laggyDataRef.current : data;
      const latestData = (0, useLatest_1.useLatest)(returnedData);
      const mutate = (0, react_1.useCallback)(async (asyncUpdate, options2) => {
        let dataBeforeOptimisticUpdate;
        try {
          if (options2?.optimisticUpdate) {
            if (typeof options2?.rollbackOnError !== "function" && options2?.rollbackOnError !== false) {
              dataBeforeOptimisticUpdate = structuredClone(latestData.current);
            }
            const data2 = options2.optimisticUpdate(latestData.current);
            lastUpdateFrom.current = "cache";
            laggyDataRef.current = data2;
            mutateCache(data2);
          }
          return await _mutate(asyncUpdate, { shouldRevalidateAfter: options2?.shouldRevalidateAfter });
        } catch (err) {
          if (typeof options2?.rollbackOnError === "function") {
            const data2 = options2.rollbackOnError(latestData.current);
            lastUpdateFrom.current = "cache";
            laggyDataRef.current = data2;
            mutateCache(data2);
          } else if (options2?.optimisticUpdate && options2?.rollbackOnError !== false) {
            lastUpdateFrom.current = "cache";
            laggyDataRef.current = dataBeforeOptimisticUpdate;
            mutateCache(dataBeforeOptimisticUpdate);
          }
          throw err;
        }
      }, [mutateCache, _mutate, latestData, laggyDataRef, lastUpdateFrom]);
      (0, react_1.useEffect)(() => {
        if (cachedData !== emptyCache) {
          lastUpdateFrom.current = "cache";
          laggyDataRef.current = cachedData;
        }
      }, [cachedData]);
      return {
        data: returnedData,
        isLoading: state.isLoading,
        error: state.error,
        mutate,
        revalidate
      };
    }
    exports.useCachedPromise = useCachedPromise;
  }
});

// node_modules/media-typer/index.js
var require_media_typer = __commonJS({
  "node_modules/media-typer/index.js"(exports) {
    "use strict";
    var SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
    var TYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
    var TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
    exports.format = format;
    exports.parse = parse;
    exports.test = test;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var subtype = obj.subtype;
      var suffix = obj.suffix;
      var type = obj.type;
      if (!type || !TYPE_NAME_REGEXP.test(type)) {
        throw new TypeError("invalid type");
      }
      if (!subtype || !SUBTYPE_NAME_REGEXP.test(subtype)) {
        throw new TypeError("invalid subtype");
      }
      var string = type + "/" + subtype;
      if (suffix) {
        if (!TYPE_NAME_REGEXP.test(suffix)) {
          throw new TypeError("invalid suffix");
        }
        string += "+" + suffix;
      }
      return string;
    }
    function test(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      return TYPE_REGEXP.test(string.toLowerCase());
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var match = TYPE_REGEXP.exec(string.toLowerCase());
      if (!match) {
        throw new TypeError("invalid media type");
      }
      var type = match[1];
      var subtype = match[2];
      var suffix;
      var index = subtype.lastIndexOf("+");
      if (index !== -1) {
        suffix = subtype.substr(index + 1);
        subtype = subtype.substr(0, index);
      }
      return new MediaType(type, subtype, suffix);
    }
    function MediaType(type, subtype, suffix) {
      this.type = type;
      this.subtype = subtype;
      this.suffix = suffix;
    }
  }
});

// node_modules/content-type/index.js
var require_content_type = __commonJS({
  "node_modules/content-type/index.js"(exports) {
    "use strict";
    var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
    var TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/;
    var TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
    var QUOTE_REGEXP = /([\\"])/g;
    var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    exports.format = format;
    exports.parse = parse;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var parameters = obj.parameters;
      var type = obj.type;
      if (!type || !TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid type");
      }
      var string = type;
      if (parameters && typeof parameters === "object") {
        var param;
        var params = Object.keys(parameters).sort();
        for (var i = 0; i < params.length; i++) {
          param = params[i];
          if (!TOKEN_REGEXP.test(param)) {
            throw new TypeError("invalid parameter name");
          }
          string += "; " + param + "=" + qstring(parameters[param]);
        }
      }
      return string;
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      var header = typeof string === "object" ? getcontenttype(string) : string;
      if (typeof header !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var index = header.indexOf(";");
      var type = index !== -1 ? header.substr(0, index).trim() : header.trim();
      if (!TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid media type");
      }
      var obj = new ContentType(type.toLowerCase());
      if (index !== -1) {
        var key;
        var match;
        var value;
        PARAM_REGEXP.lastIndex = index;
        while (match = PARAM_REGEXP.exec(header)) {
          if (match.index !== index) {
            throw new TypeError("invalid parameter format");
          }
          index += match[0].length;
          key = match[1].toLowerCase();
          value = match[2];
          if (value[0] === '"') {
            value = value.substr(1, value.length - 2).replace(QESC_REGEXP, "$1");
          }
          obj.parameters[key] = value;
        }
        if (index !== header.length) {
          throw new TypeError("invalid parameter format");
        }
      }
      return obj;
    }
    function getcontenttype(obj) {
      var header;
      if (typeof obj.getHeader === "function") {
        header = obj.getHeader("content-type");
      } else if (typeof obj.headers === "object") {
        header = obj.headers && obj.headers["content-type"];
      }
      if (typeof header !== "string") {
        throw new TypeError("content-type header is missing from object");
      }
      return header;
    }
    function qstring(val) {
      var str = String(val);
      if (TOKEN_REGEXP.test(str)) {
        return str;
      }
      if (str.length > 0 && !TEXT_REGEXP.test(str)) {
        throw new TypeError("invalid parameter value");
      }
      return '"' + str.replace(QUOTE_REGEXP, "\\$1") + '"';
    }
    function ContentType(type) {
      this.parameters = /* @__PURE__ */ Object.create(null);
      this.type = type;
    }
  }
});

// node_modules/webidl-conversions/lib/index.js
var require_lib = __commonJS({
  "node_modules/webidl-conversions/lib/index.js"(exports, module2) {
    "use strict";
    var conversions = {};
    module2.exports = conversions;
    function sign(x) {
      return x < 0 ? -1 : 1;
    }
    function evenRound(x) {
      if (x % 1 === 0.5 && (x & 1) === 0) {
        return Math.floor(x);
      } else {
        return Math.round(x);
      }
    }
    function createNumberConversion(bitLength, typeOpts) {
      if (!typeOpts.unsigned) {
        --bitLength;
      }
      const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
      const upperBound = Math.pow(2, bitLength) - 1;
      const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
      const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);
      return function(V, opts) {
        if (!opts)
          opts = {};
        let x = +V;
        if (opts.enforceRange) {
          if (!Number.isFinite(x)) {
            throw new TypeError("Argument is not a finite number");
          }
          x = sign(x) * Math.floor(Math.abs(x));
          if (x < lowerBound || x > upperBound) {
            throw new TypeError("Argument is not in byte range");
          }
          return x;
        }
        if (!isNaN(x) && opts.clamp) {
          x = evenRound(x);
          if (x < lowerBound)
            x = lowerBound;
          if (x > upperBound)
            x = upperBound;
          return x;
        }
        if (!Number.isFinite(x) || x === 0) {
          return 0;
        }
        x = sign(x) * Math.floor(Math.abs(x));
        x = x % moduloVal;
        if (!typeOpts.unsigned && x >= moduloBound) {
          return x - moduloVal;
        } else if (typeOpts.unsigned) {
          if (x < 0) {
            x += moduloVal;
          } else if (x === -0) {
            return 0;
          }
        }
        return x;
      };
    }
    conversions["void"] = function() {
      return void 0;
    };
    conversions["boolean"] = function(val) {
      return !!val;
    };
    conversions["byte"] = createNumberConversion(8, { unsigned: false });
    conversions["octet"] = createNumberConversion(8, { unsigned: true });
    conversions["short"] = createNumberConversion(16, { unsigned: false });
    conversions["unsigned short"] = createNumberConversion(16, { unsigned: true });
    conversions["long"] = createNumberConversion(32, { unsigned: false });
    conversions["unsigned long"] = createNumberConversion(32, { unsigned: true });
    conversions["long long"] = createNumberConversion(32, { unsigned: false, moduloBitLength: 64 });
    conversions["unsigned long long"] = createNumberConversion(32, { unsigned: true, moduloBitLength: 64 });
    conversions["double"] = function(V) {
      const x = +V;
      if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
      }
      return x;
    };
    conversions["unrestricted double"] = function(V) {
      const x = +V;
      if (isNaN(x)) {
        throw new TypeError("Argument is NaN");
      }
      return x;
    };
    conversions["float"] = conversions["double"];
    conversions["unrestricted float"] = conversions["unrestricted double"];
    conversions["DOMString"] = function(V, opts) {
      if (!opts)
        opts = {};
      if (opts.treatNullAsEmptyString && V === null) {
        return "";
      }
      return String(V);
    };
    conversions["ByteString"] = function(V, opts) {
      const x = String(V);
      let c = void 0;
      for (let i = 0; (c = x.codePointAt(i)) !== void 0; ++i) {
        if (c > 255) {
          throw new TypeError("Argument is not a valid bytestring");
        }
      }
      return x;
    };
    conversions["USVString"] = function(V) {
      const S = String(V);
      const n = S.length;
      const U = [];
      for (let i = 0; i < n; ++i) {
        const c = S.charCodeAt(i);
        if (c < 55296 || c > 57343) {
          U.push(String.fromCodePoint(c));
        } else if (56320 <= c && c <= 57343) {
          U.push(String.fromCodePoint(65533));
        } else {
          if (i === n - 1) {
            U.push(String.fromCodePoint(65533));
          } else {
            const d = S.charCodeAt(i + 1);
            if (56320 <= d && d <= 57343) {
              const a = c & 1023;
              const b = d & 1023;
              U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
              ++i;
            } else {
              U.push(String.fromCodePoint(65533));
            }
          }
        }
      }
      return U.join("");
    };
    conversions["Date"] = function(V, opts) {
      if (!(V instanceof Date)) {
        throw new TypeError("Argument is not a Date object");
      }
      if (isNaN(V)) {
        return void 0;
      }
      return V;
    };
    conversions["RegExp"] = function(V, opts) {
      if (!(V instanceof RegExp)) {
        V = new RegExp(V);
      }
      return V;
    };
  }
});

// node_modules/whatwg-url/lib/utils.js
var require_utils = __commonJS({
  "node_modules/whatwg-url/lib/utils.js"(exports, module2) {
    "use strict";
    module2.exports.mixin = function mixin(target, source) {
      const keys = Object.getOwnPropertyNames(source);
      for (let i = 0; i < keys.length; ++i) {
        Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
      }
    };
    module2.exports.wrapperSymbol = Symbol("wrapper");
    module2.exports.implSymbol = Symbol("impl");
    module2.exports.wrapperForImpl = function(impl) {
      return impl[module2.exports.wrapperSymbol];
    };
    module2.exports.implForWrapper = function(wrapper) {
      return wrapper[module2.exports.implSymbol];
    };
  }
});

// node_modules/tr46/lib/mappingTable.json
var require_mappingTable = __commonJS({
  "node_modules/tr46/lib/mappingTable.json"(exports, module2) {
    module2.exports = [[[0, 44], "disallowed_STD3_valid"], [[45, 46], "valid"], [[47, 47], "disallowed_STD3_valid"], [[48, 57], "valid"], [[58, 64], "disallowed_STD3_valid"], [[65, 65], "mapped", [97]], [[66, 66], "mapped", [98]], [[67, 67], "mapped", [99]], [[68, 68], "mapped", [100]], [[69, 69], "mapped", [101]], [[70, 70], "mapped", [102]], [[71, 71], "mapped", [103]], [[72, 72], "mapped", [104]], [[73, 73], "mapped", [105]], [[74, 74], "mapped", [106]], [[75, 75], "mapped", [107]], [[76, 76], "mapped", [108]], [[77, 77], "mapped", [109]], [[78, 78], "mapped", [110]], [[79, 79], "mapped", [111]], [[80, 80], "mapped", [112]], [[81, 81], "mapped", [113]], [[82, 82], "mapped", [114]], [[83, 83], "mapped", [115]], [[84, 84], "mapped", [116]], [[85, 85], "mapped", [117]], [[86, 86], "mapped", [118]], [[87, 87], "mapped", [119]], [[88, 88], "mapped", [120]], [[89, 89], "mapped", [121]], [[90, 90], "mapped", [122]], [[91, 96], "disallowed_STD3_valid"], [[97, 122], "valid"], [[123, 127], "disallowed_STD3_valid"], [[128, 159], "disallowed"], [[160, 160], "disallowed_STD3_mapped", [32]], [[161, 167], "valid", [], "NV8"], [[168, 168], "disallowed_STD3_mapped", [32, 776]], [[169, 169], "valid", [], "NV8"], [[170, 170], "mapped", [97]], [[171, 172], "valid", [], "NV8"], [[173, 173], "ignored"], [[174, 174], "valid", [], "NV8"], [[175, 175], "disallowed_STD3_mapped", [32, 772]], [[176, 177], "valid", [], "NV8"], [[178, 178], "mapped", [50]], [[179, 179], "mapped", [51]], [[180, 180], "disallowed_STD3_mapped", [32, 769]], [[181, 181], "mapped", [956]], [[182, 182], "valid", [], "NV8"], [[183, 183], "valid"], [[184, 184], "disallowed_STD3_mapped", [32, 807]], [[185, 185], "mapped", [49]], [[186, 186], "mapped", [111]], [[187, 187], "valid", [], "NV8"], [[188, 188], "mapped", [49, 8260, 52]], [[189, 189], "mapped", [49, 8260, 50]], [[190, 190], "mapped", [51, 8260, 52]], [[191, 191], "valid", [], "NV8"], [[192, 192], "mapped", [224]], [[193, 193], "mapped", [225]], [[194, 194], "mapped", [226]], [[195, 195], "mapped", [227]], [[196, 196], "mapped", [228]], [[197, 197], "mapped", [229]], [[198, 198], "mapped", [230]], [[199, 199], "mapped", [231]], [[200, 200], "mapped", [232]], [[201, 201], "mapped", [233]], [[202, 202], "mapped", [234]], [[203, 203], "mapped", [235]], [[204, 204], "mapped", [236]], [[205, 205], "mapped", [237]], [[206, 206], "mapped", [238]], [[207, 207], "mapped", [239]], [[208, 208], "mapped", [240]], [[209, 209], "mapped", [241]], [[210, 210], "mapped", [242]], [[211, 211], "mapped", [243]], [[212, 212], "mapped", [244]], [[213, 213], "mapped", [245]], [[214, 214], "mapped", [246]], [[215, 215], "valid", [], "NV8"], [[216, 216], "mapped", [248]], [[217, 217], "mapped", [249]], [[218, 218], "mapped", [250]], [[219, 219], "mapped", [251]], [[220, 220], "mapped", [252]], [[221, 221], "mapped", [253]], [[222, 222], "mapped", [254]], [[223, 223], "deviation", [115, 115]], [[224, 246], "valid"], [[247, 247], "valid", [], "NV8"], [[248, 255], "valid"], [[256, 256], "mapped", [257]], [[257, 257], "valid"], [[258, 258], "mapped", [259]], [[259, 259], "valid"], [[260, 260], "mapped", [261]], [[261, 261], "valid"], [[262, 262], "mapped", [263]], [[263, 263], "valid"], [[264, 264], "mapped", [265]], [[265, 265], "valid"], [[266, 266], "mapped", [267]], [[267, 267], "valid"], [[268, 268], "mapped", [269]], [[269, 269], "valid"], [[270, 270], "mapped", [271]], [[271, 271], "valid"], [[272, 272], "mapped", [273]], [[273, 273], "valid"], [[274, 274], "mapped", [275]], [[275, 275], "valid"], [[276, 276], "mapped", [277]], [[277, 277], "valid"], [[278, 278], "mapped", [279]], [[279, 279], "valid"], [[280, 280], "mapped", [281]], [[281, 281], "valid"], [[282, 282], "mapped", [283]], [[283, 283], "valid"], [[284, 284], "mapped", [285]], [[285, 285], "valid"], [[286, 286], "mapped", [287]], [[287, 287], "valid"], [[288, 288], "mapped", [289]], [[289, 289], "valid"], [[290, 290], "mapped", [291]], [[291, 291], "valid"], [[292, 292], "mapped", [293]], [[293, 293], "valid"], [[294, 294], "mapped", [295]], [[295, 295], "valid"], [[296, 296], "mapped", [297]], [[297, 297], "valid"], [[298, 298], "mapped", [299]], [[299, 299], "valid"], [[300, 300], "mapped", [301]], [[301, 301], "valid"], [[302, 302], "mapped", [303]], [[303, 303], "valid"], [[304, 304], "mapped", [105, 775]], [[305, 305], "valid"], [[306, 307], "mapped", [105, 106]], [[308, 308], "mapped", [309]], [[309, 309], "valid"], [[310, 310], "mapped", [311]], [[311, 312], "valid"], [[313, 313], "mapped", [314]], [[314, 314], "valid"], [[315, 315], "mapped", [316]], [[316, 316], "valid"], [[317, 317], "mapped", [318]], [[318, 318], "valid"], [[319, 320], "mapped", [108, 183]], [[321, 321], "mapped", [322]], [[322, 322], "valid"], [[323, 323], "mapped", [324]], [[324, 324], "valid"], [[325, 325], "mapped", [326]], [[326, 326], "valid"], [[327, 327], "mapped", [328]], [[328, 328], "valid"], [[329, 329], "mapped", [700, 110]], [[330, 330], "mapped", [331]], [[331, 331], "valid"], [[332, 332], "mapped", [333]], [[333, 333], "valid"], [[334, 334], "mapped", [335]], [[335, 335], "valid"], [[336, 336], "mapped", [337]], [[337, 337], "valid"], [[338, 338], "mapped", [339]], [[339, 339], "valid"], [[340, 340], "mapped", [341]], [[341, 341], "valid"], [[342, 342], "mapped", [343]], [[343, 343], "valid"], [[344, 344], "mapped", [345]], [[345, 345], "valid"], [[346, 346], "mapped", [347]], [[347, 347], "valid"], [[348, 348], "mapped", [349]], [[349, 349], "valid"], [[350, 350], "mapped", [351]], [[351, 351], "valid"], [[352, 352], "mapped", [353]], [[353, 353], "valid"], [[354, 354], "mapped", [355]], [[355, 355], "valid"], [[356, 356], "mapped", [357]], [[357, 357], "valid"], [[358, 358], "mapped", [359]], [[359, 359], "valid"], [[360, 360], "mapped", [361]], [[361, 361], "valid"], [[362, 362], "mapped", [363]], [[363, 363], "valid"], [[364, 364], "mapped", [365]], [[365, 365], "valid"], [[366, 366], "mapped", [367]], [[367, 367], "valid"], [[368, 368], "mapped", [369]], [[369, 369], "valid"], [[370, 370], "mapped", [371]], [[371, 371], "valid"], [[372, 372], "mapped", [373]], [[373, 373], "valid"], [[374, 374], "mapped", [375]], [[375, 375], "valid"], [[376, 376], "mapped", [255]], [[377, 377], "mapped", [378]], [[378, 378], "valid"], [[379, 379], "mapped", [380]], [[380, 380], "valid"], [[381, 381], "mapped", [382]], [[382, 382], "valid"], [[383, 383], "mapped", [115]], [[384, 384], "valid"], [[385, 385], "mapped", [595]], [[386, 386], "mapped", [387]], [[387, 387], "valid"], [[388, 388], "mapped", [389]], [[389, 389], "valid"], [[390, 390], "mapped", [596]], [[391, 391], "mapped", [392]], [[392, 392], "valid"], [[393, 393], "mapped", [598]], [[394, 394], "mapped", [599]], [[395, 395], "mapped", [396]], [[396, 397], "valid"], [[398, 398], "mapped", [477]], [[399, 399], "mapped", [601]], [[400, 400], "mapped", [603]], [[401, 401], "mapped", [402]], [[402, 402], "valid"], [[403, 403], "mapped", [608]], [[404, 404], "mapped", [611]], [[405, 405], "valid"], [[406, 406], "mapped", [617]], [[407, 407], "mapped", [616]], [[408, 408], "mapped", [409]], [[409, 411], "valid"], [[412, 412], "mapped", [623]], [[413, 413], "mapped", [626]], [[414, 414], "valid"], [[415, 415], "mapped", [629]], [[416, 416], "mapped", [417]], [[417, 417], "valid"], [[418, 418], "mapped", [419]], [[419, 419], "valid"], [[420, 420], "mapped", [421]], [[421, 421], "valid"], [[422, 422], "mapped", [640]], [[423, 423], "mapped", [424]], [[424, 424], "valid"], [[425, 425], "mapped", [643]], [[426, 427], "valid"], [[428, 428], "mapped", [429]], [[429, 429], "valid"], [[430, 430], "mapped", [648]], [[431, 431], "mapped", [432]], [[432, 432], "valid"], [[433, 433], "mapped", [650]], [[434, 434], "mapped", [651]], [[435, 435], "mapped", [436]], [[436, 436], "valid"], [[437, 437], "mapped", [438]], [[438, 438], "valid"], [[439, 439], "mapped", [658]], [[440, 440], "mapped", [441]], [[441, 443], "valid"], [[444, 444], "mapped", [445]], [[445, 451], "valid"], [[452, 454], "mapped", [100, 382]], [[455, 457], "mapped", [108, 106]], [[458, 460], "mapped", [110, 106]], [[461, 461], "mapped", [462]], [[462, 462], "valid"], [[463, 463], "mapped", [464]], [[464, 464], "valid"], [[465, 465], "mapped", [466]], [[466, 466], "valid"], [[467, 467], "mapped", [468]], [[468, 468], "valid"], [[469, 469], "mapped", [470]], [[470, 470], "valid"], [[471, 471], "mapped", [472]], [[472, 472], "valid"], [[473, 473], "mapped", [474]], [[474, 474], "valid"], [[475, 475], "mapped", [476]], [[476, 477], "valid"], [[478, 478], "mapped", [479]], [[479, 479], "valid"], [[480, 480], "mapped", [481]], [[481, 481], "valid"], [[482, 482], "mapped", [483]], [[483, 483], "valid"], [[484, 484], "mapped", [485]], [[485, 485], "valid"], [[486, 486], "mapped", [487]], [[487, 487], "valid"], [[488, 488], "mapped", [489]], [[489, 489], "valid"], [[490, 490], "mapped", [491]], [[491, 491], "valid"], [[492, 492], "mapped", [493]], [[493, 493], "valid"], [[494, 494], "mapped", [495]], [[495, 496], "valid"], [[497, 499], "mapped", [100, 122]], [[500, 500], "mapped", [501]], [[501, 501], "valid"], [[502, 502], "mapped", [405]], [[503, 503], "mapped", [447]], [[504, 504], "mapped", [505]], [[505, 505], "valid"], [[506, 506], "mapped", [507]], [[507, 507], "valid"], [[508, 508], "mapped", [509]], [[509, 509], "valid"], [[510, 510], "mapped", [511]], [[511, 511], "valid"], [[512, 512], "mapped", [513]], [[513, 513], "valid"], [[514, 514], "mapped", [515]], [[515, 515], "valid"], [[516, 516], "mapped", [517]], [[517, 517], "valid"], [[518, 518], "mapped", [519]], [[519, 519], "valid"], [[520, 520], "mapped", [521]], [[521, 521], "valid"], [[522, 522], "mapped", [523]], [[523, 523], "valid"], [[524, 524], "mapped", [525]], [[525, 525], "valid"], [[526, 526], "mapped", [527]], [[527, 527], "valid"], [[528, 528], "mapped", [529]], [[529, 529], "valid"], [[530, 530], "mapped", [531]], [[531, 531], "valid"], [[532, 532], "mapped", [533]], [[533, 533], "valid"], [[534, 534], "mapped", [535]], [[535, 535], "valid"], [[536, 536], "mapped", [537]], [[537, 537], "valid"], [[538, 538], "mapped", [539]], [[539, 539], "valid"], [[540, 540], "mapped", [541]], [[541, 541], "valid"], [[542, 542], "mapped", [543]], [[543, 543], "valid"], [[544, 544], "mapped", [414]], [[545, 545], "valid"], [[546, 546], "mapped", [547]], [[547, 547], "valid"], [[548, 548], "mapped", [549]], [[549, 549], "valid"], [[550, 550], "mapped", [551]], [[551, 551], "valid"], [[552, 552], "mapped", [553]], [[553, 553], "valid"], [[554, 554], "mapped", [555]], [[555, 555], "valid"], [[556, 556], "mapped", [557]], [[557, 557], "valid"], [[558, 558], "mapped", [559]], [[559, 559], "valid"], [[560, 560], "mapped", [561]], [[561, 561], "valid"], [[562, 562], "mapped", [563]], [[563, 563], "valid"], [[564, 566], "valid"], [[567, 569], "valid"], [[570, 570], "mapped", [11365]], [[571, 571], "mapped", [572]], [[572, 572], "valid"], [[573, 573], "mapped", [410]], [[574, 574], "mapped", [11366]], [[575, 576], "valid"], [[577, 577], "mapped", [578]], [[578, 578], "valid"], [[579, 579], "mapped", [384]], [[580, 580], "mapped", [649]], [[581, 581], "mapped", [652]], [[582, 582], "mapped", [583]], [[583, 583], "valid"], [[584, 584], "mapped", [585]], [[585, 585], "valid"], [[586, 586], "mapped", [587]], [[587, 587], "valid"], [[588, 588], "mapped", [589]], [[589, 589], "valid"], [[590, 590], "mapped", [591]], [[591, 591], "valid"], [[592, 680], "valid"], [[681, 685], "valid"], [[686, 687], "valid"], [[688, 688], "mapped", [104]], [[689, 689], "mapped", [614]], [[690, 690], "mapped", [106]], [[691, 691], "mapped", [114]], [[692, 692], "mapped", [633]], [[693, 693], "mapped", [635]], [[694, 694], "mapped", [641]], [[695, 695], "mapped", [119]], [[696, 696], "mapped", [121]], [[697, 705], "valid"], [[706, 709], "valid", [], "NV8"], [[710, 721], "valid"], [[722, 727], "valid", [], "NV8"], [[728, 728], "disallowed_STD3_mapped", [32, 774]], [[729, 729], "disallowed_STD3_mapped", [32, 775]], [[730, 730], "disallowed_STD3_mapped", [32, 778]], [[731, 731], "disallowed_STD3_mapped", [32, 808]], [[732, 732], "disallowed_STD3_mapped", [32, 771]], [[733, 733], "disallowed_STD3_mapped", [32, 779]], [[734, 734], "valid", [], "NV8"], [[735, 735], "valid", [], "NV8"], [[736, 736], "mapped", [611]], [[737, 737], "mapped", [108]], [[738, 738], "mapped", [115]], [[739, 739], "mapped", [120]], [[740, 740], "mapped", [661]], [[741, 745], "valid", [], "NV8"], [[746, 747], "valid", [], "NV8"], [[748, 748], "valid"], [[749, 749], "valid", [], "NV8"], [[750, 750], "valid"], [[751, 767], "valid", [], "NV8"], [[768, 831], "valid"], [[832, 832], "mapped", [768]], [[833, 833], "mapped", [769]], [[834, 834], "valid"], [[835, 835], "mapped", [787]], [[836, 836], "mapped", [776, 769]], [[837, 837], "mapped", [953]], [[838, 846], "valid"], [[847, 847], "ignored"], [[848, 855], "valid"], [[856, 860], "valid"], [[861, 863], "valid"], [[864, 865], "valid"], [[866, 866], "valid"], [[867, 879], "valid"], [[880, 880], "mapped", [881]], [[881, 881], "valid"], [[882, 882], "mapped", [883]], [[883, 883], "valid"], [[884, 884], "mapped", [697]], [[885, 885], "valid"], [[886, 886], "mapped", [887]], [[887, 887], "valid"], [[888, 889], "disallowed"], [[890, 890], "disallowed_STD3_mapped", [32, 953]], [[891, 893], "valid"], [[894, 894], "disallowed_STD3_mapped", [59]], [[895, 895], "mapped", [1011]], [[896, 899], "disallowed"], [[900, 900], "disallowed_STD3_mapped", [32, 769]], [[901, 901], "disallowed_STD3_mapped", [32, 776, 769]], [[902, 902], "mapped", [940]], [[903, 903], "mapped", [183]], [[904, 904], "mapped", [941]], [[905, 905], "mapped", [942]], [[906, 906], "mapped", [943]], [[907, 907], "disallowed"], [[908, 908], "mapped", [972]], [[909, 909], "disallowed"], [[910, 910], "mapped", [973]], [[911, 911], "mapped", [974]], [[912, 912], "valid"], [[913, 913], "mapped", [945]], [[914, 914], "mapped", [946]], [[915, 915], "mapped", [947]], [[916, 916], "mapped", [948]], [[917, 917], "mapped", [949]], [[918, 918], "mapped", [950]], [[919, 919], "mapped", [951]], [[920, 920], "mapped", [952]], [[921, 921], "mapped", [953]], [[922, 922], "mapped", [954]], [[923, 923], "mapped", [955]], [[924, 924], "mapped", [956]], [[925, 925], "mapped", [957]], [[926, 926], "mapped", [958]], [[927, 927], "mapped", [959]], [[928, 928], "mapped", [960]], [[929, 929], "mapped", [961]], [[930, 930], "disallowed"], [[931, 931], "mapped", [963]], [[932, 932], "mapped", [964]], [[933, 933], "mapped", [965]], [[934, 934], "mapped", [966]], [[935, 935], "mapped", [967]], [[936, 936], "mapped", [968]], [[937, 937], "mapped", [969]], [[938, 938], "mapped", [970]], [[939, 939], "mapped", [971]], [[940, 961], "valid"], [[962, 962], "deviation", [963]], [[963, 974], "valid"], [[975, 975], "mapped", [983]], [[976, 976], "mapped", [946]], [[977, 977], "mapped", [952]], [[978, 978], "mapped", [965]], [[979, 979], "mapped", [973]], [[980, 980], "mapped", [971]], [[981, 981], "mapped", [966]], [[982, 982], "mapped", [960]], [[983, 983], "valid"], [[984, 984], "mapped", [985]], [[985, 985], "valid"], [[986, 986], "mapped", [987]], [[987, 987], "valid"], [[988, 988], "mapped", [989]], [[989, 989], "valid"], [[990, 990], "mapped", [991]], [[991, 991], "valid"], [[992, 992], "mapped", [993]], [[993, 993], "valid"], [[994, 994], "mapped", [995]], [[995, 995], "valid"], [[996, 996], "mapped", [997]], [[997, 997], "valid"], [[998, 998], "mapped", [999]], [[999, 999], "valid"], [[1e3, 1e3], "mapped", [1001]], [[1001, 1001], "valid"], [[1002, 1002], "mapped", [1003]], [[1003, 1003], "valid"], [[1004, 1004], "mapped", [1005]], [[1005, 1005], "valid"], [[1006, 1006], "mapped", [1007]], [[1007, 1007], "valid"], [[1008, 1008], "mapped", [954]], [[1009, 1009], "mapped", [961]], [[1010, 1010], "mapped", [963]], [[1011, 1011], "valid"], [[1012, 1012], "mapped", [952]], [[1013, 1013], "mapped", [949]], [[1014, 1014], "valid", [], "NV8"], [[1015, 1015], "mapped", [1016]], [[1016, 1016], "valid"], [[1017, 1017], "mapped", [963]], [[1018, 1018], "mapped", [1019]], [[1019, 1019], "valid"], [[1020, 1020], "valid"], [[1021, 1021], "mapped", [891]], [[1022, 1022], "mapped", [892]], [[1023, 1023], "mapped", [893]], [[1024, 1024], "mapped", [1104]], [[1025, 1025], "mapped", [1105]], [[1026, 1026], "mapped", [1106]], [[1027, 1027], "mapped", [1107]], [[1028, 1028], "mapped", [1108]], [[1029, 1029], "mapped", [1109]], [[1030, 1030], "mapped", [1110]], [[1031, 1031], "mapped", [1111]], [[1032, 1032], "mapped", [1112]], [[1033, 1033], "mapped", [1113]], [[1034, 1034], "mapped", [1114]], [[1035, 1035], "mapped", [1115]], [[1036, 1036], "mapped", [1116]], [[1037, 1037], "mapped", [1117]], [[1038, 1038], "mapped", [1118]], [[1039, 1039], "mapped", [1119]], [[1040, 1040], "mapped", [1072]], [[1041, 1041], "mapped", [1073]], [[1042, 1042], "mapped", [1074]], [[1043, 1043], "mapped", [1075]], [[1044, 1044], "mapped", [1076]], [[1045, 1045], "mapped", [1077]], [[1046, 1046], "mapped", [1078]], [[1047, 1047], "mapped", [1079]], [[1048, 1048], "mapped", [1080]], [[1049, 1049], "mapped", [1081]], [[1050, 1050], "mapped", [1082]], [[1051, 1051], "mapped", [1083]], [[1052, 1052], "mapped", [1084]], [[1053, 1053], "mapped", [1085]], [[1054, 1054], "mapped", [1086]], [[1055, 1055], "mapped", [1087]], [[1056, 1056], "mapped", [1088]], [[1057, 1057], "mapped", [1089]], [[1058, 1058], "mapped", [1090]], [[1059, 1059], "mapped", [1091]], [[1060, 1060], "mapped", [1092]], [[1061, 1061], "mapped", [1093]], [[1062, 1062], "mapped", [1094]], [[1063, 1063], "mapped", [1095]], [[1064, 1064], "mapped", [1096]], [[1065, 1065], "mapped", [1097]], [[1066, 1066], "mapped", [1098]], [[1067, 1067], "mapped", [1099]], [[1068, 1068], "mapped", [1100]], [[1069, 1069], "mapped", [1101]], [[1070, 1070], "mapped", [1102]], [[1071, 1071], "mapped", [1103]], [[1072, 1103], "valid"], [[1104, 1104], "valid"], [[1105, 1116], "valid"], [[1117, 1117], "valid"], [[1118, 1119], "valid"], [[1120, 1120], "mapped", [1121]], [[1121, 1121], "valid"], [[1122, 1122], "mapped", [1123]], [[1123, 1123], "valid"], [[1124, 1124], "mapped", [1125]], [[1125, 1125], "valid"], [[1126, 1126], "mapped", [1127]], [[1127, 1127], "valid"], [[1128, 1128], "mapped", [1129]], [[1129, 1129], "valid"], [[1130, 1130], "mapped", [1131]], [[1131, 1131], "valid"], [[1132, 1132], "mapped", [1133]], [[1133, 1133], "valid"], [[1134, 1134], "mapped", [1135]], [[1135, 1135], "valid"], [[1136, 1136], "mapped", [1137]], [[1137, 1137], "valid"], [[1138, 1138], "mapped", [1139]], [[1139, 1139], "valid"], [[1140, 1140], "mapped", [1141]], [[1141, 1141], "valid"], [[1142, 1142], "mapped", [1143]], [[1143, 1143], "valid"], [[1144, 1144], "mapped", [1145]], [[1145, 1145], "valid"], [[1146, 1146], "mapped", [1147]], [[1147, 1147], "valid"], [[1148, 1148], "mapped", [1149]], [[1149, 1149], "valid"], [[1150, 1150], "mapped", [1151]], [[1151, 1151], "valid"], [[1152, 1152], "mapped", [1153]], [[1153, 1153], "valid"], [[1154, 1154], "valid", [], "NV8"], [[1155, 1158], "valid"], [[1159, 1159], "valid"], [[1160, 1161], "valid", [], "NV8"], [[1162, 1162], "mapped", [1163]], [[1163, 1163], "valid"], [[1164, 1164], "mapped", [1165]], [[1165, 1165], "valid"], [[1166, 1166], "mapped", [1167]], [[1167, 1167], "valid"], [[1168, 1168], "mapped", [1169]], [[1169, 1169], "valid"], [[1170, 1170], "mapped", [1171]], [[1171, 1171], "valid"], [[1172, 1172], "mapped", [1173]], [[1173, 1173], "valid"], [[1174, 1174], "mapped", [1175]], [[1175, 1175], "valid"], [[1176, 1176], "mapped", [1177]], [[1177, 1177], "valid"], [[1178, 1178], "mapped", [1179]], [[1179, 1179], "valid"], [[1180, 1180], "mapped", [1181]], [[1181, 1181], "valid"], [[1182, 1182], "mapped", [1183]], [[1183, 1183], "valid"], [[1184, 1184], "mapped", [1185]], [[1185, 1185], "valid"], [[1186, 1186], "mapped", [1187]], [[1187, 1187], "valid"], [[1188, 1188], "mapped", [1189]], [[1189, 1189], "valid"], [[1190, 1190], "mapped", [1191]], [[1191, 1191], "valid"], [[1192, 1192], "mapped", [1193]], [[1193, 1193], "valid"], [[1194, 1194], "mapped", [1195]], [[1195, 1195], "valid"], [[1196, 1196], "mapped", [1197]], [[1197, 1197], "valid"], [[1198, 1198], "mapped", [1199]], [[1199, 1199], "valid"], [[1200, 1200], "mapped", [1201]], [[1201, 1201], "valid"], [[1202, 1202], "mapped", [1203]], [[1203, 1203], "valid"], [[1204, 1204], "mapped", [1205]], [[1205, 1205], "valid"], [[1206, 1206], "mapped", [1207]], [[1207, 1207], "valid"], [[1208, 1208], "mapped", [1209]], [[1209, 1209], "valid"], [[1210, 1210], "mapped", [1211]], [[1211, 1211], "valid"], [[1212, 1212], "mapped", [1213]], [[1213, 1213], "valid"], [[1214, 1214], "mapped", [1215]], [[1215, 1215], "valid"], [[1216, 1216], "disallowed"], [[1217, 1217], "mapped", [1218]], [[1218, 1218], "valid"], [[1219, 1219], "mapped", [1220]], [[1220, 1220], "valid"], [[1221, 1221], "mapped", [1222]], [[1222, 1222], "valid"], [[1223, 1223], "mapped", [1224]], [[1224, 1224], "valid"], [[1225, 1225], "mapped", [1226]], [[1226, 1226], "valid"], [[1227, 1227], "mapped", [1228]], [[1228, 1228], "valid"], [[1229, 1229], "mapped", [1230]], [[1230, 1230], "valid"], [[1231, 1231], "valid"], [[1232, 1232], "mapped", [1233]], [[1233, 1233], "valid"], [[1234, 1234], "mapped", [1235]], [[1235, 1235], "valid"], [[1236, 1236], "mapped", [1237]], [[1237, 1237], "valid"], [[1238, 1238], "mapped", [1239]], [[1239, 1239], "valid"], [[1240, 1240], "mapped", [1241]], [[1241, 1241], "valid"], [[1242, 1242], "mapped", [1243]], [[1243, 1243], "valid"], [[1244, 1244], "mapped", [1245]], [[1245, 1245], "valid"], [[1246, 1246], "mapped", [1247]], [[1247, 1247], "valid"], [[1248, 1248], "mapped", [1249]], [[1249, 1249], "valid"], [[1250, 1250], "mapped", [1251]], [[1251, 1251], "valid"], [[1252, 1252], "mapped", [1253]], [[1253, 1253], "valid"], [[1254, 1254], "mapped", [1255]], [[1255, 1255], "valid"], [[1256, 1256], "mapped", [1257]], [[1257, 1257], "valid"], [[1258, 1258], "mapped", [1259]], [[1259, 1259], "valid"], [[1260, 1260], "mapped", [1261]], [[1261, 1261], "valid"], [[1262, 1262], "mapped", [1263]], [[1263, 1263], "valid"], [[1264, 1264], "mapped", [1265]], [[1265, 1265], "valid"], [[1266, 1266], "mapped", [1267]], [[1267, 1267], "valid"], [[1268, 1268], "mapped", [1269]], [[1269, 1269], "valid"], [[1270, 1270], "mapped", [1271]], [[1271, 1271], "valid"], [[1272, 1272], "mapped", [1273]], [[1273, 1273], "valid"], [[1274, 1274], "mapped", [1275]], [[1275, 1275], "valid"], [[1276, 1276], "mapped", [1277]], [[1277, 1277], "valid"], [[1278, 1278], "mapped", [1279]], [[1279, 1279], "valid"], [[1280, 1280], "mapped", [1281]], [[1281, 1281], "valid"], [[1282, 1282], "mapped", [1283]], [[1283, 1283], "valid"], [[1284, 1284], "mapped", [1285]], [[1285, 1285], "valid"], [[1286, 1286], "mapped", [1287]], [[1287, 1287], "valid"], [[1288, 1288], "mapped", [1289]], [[1289, 1289], "valid"], [[1290, 1290], "mapped", [1291]], [[1291, 1291], "valid"], [[1292, 1292], "mapped", [1293]], [[1293, 1293], "valid"], [[1294, 1294], "mapped", [1295]], [[1295, 1295], "valid"], [[1296, 1296], "mapped", [1297]], [[1297, 1297], "valid"], [[1298, 1298], "mapped", [1299]], [[1299, 1299], "valid"], [[1300, 1300], "mapped", [1301]], [[1301, 1301], "valid"], [[1302, 1302], "mapped", [1303]], [[1303, 1303], "valid"], [[1304, 1304], "mapped", [1305]], [[1305, 1305], "valid"], [[1306, 1306], "mapped", [1307]], [[1307, 1307], "valid"], [[1308, 1308], "mapped", [1309]], [[1309, 1309], "valid"], [[1310, 1310], "mapped", [1311]], [[1311, 1311], "valid"], [[1312, 1312], "mapped", [1313]], [[1313, 1313], "valid"], [[1314, 1314], "mapped", [1315]], [[1315, 1315], "valid"], [[1316, 1316], "mapped", [1317]], [[1317, 1317], "valid"], [[1318, 1318], "mapped", [1319]], [[1319, 1319], "valid"], [[1320, 1320], "mapped", [1321]], [[1321, 1321], "valid"], [[1322, 1322], "mapped", [1323]], [[1323, 1323], "valid"], [[1324, 1324], "mapped", [1325]], [[1325, 1325], "valid"], [[1326, 1326], "mapped", [1327]], [[1327, 1327], "valid"], [[1328, 1328], "disallowed"], [[1329, 1329], "mapped", [1377]], [[1330, 1330], "mapped", [1378]], [[1331, 1331], "mapped", [1379]], [[1332, 1332], "mapped", [1380]], [[1333, 1333], "mapped", [1381]], [[1334, 1334], "mapped", [1382]], [[1335, 1335], "mapped", [1383]], [[1336, 1336], "mapped", [1384]], [[1337, 1337], "mapped", [1385]], [[1338, 1338], "mapped", [1386]], [[1339, 1339], "mapped", [1387]], [[1340, 1340], "mapped", [1388]], [[1341, 1341], "mapped", [1389]], [[1342, 1342], "mapped", [1390]], [[1343, 1343], "mapped", [1391]], [[1344, 1344], "mapped", [1392]], [[1345, 1345], "mapped", [1393]], [[1346, 1346], "mapped", [1394]], [[1347, 1347], "mapped", [1395]], [[1348, 1348], "mapped", [1396]], [[1349, 1349], "mapped", [1397]], [[1350, 1350], "mapped", [1398]], [[1351, 1351], "mapped", [1399]], [[1352, 1352], "mapped", [1400]], [[1353, 1353], "mapped", [1401]], [[1354, 1354], "mapped", [1402]], [[1355, 1355], "mapped", [1403]], [[1356, 1356], "mapped", [1404]], [[1357, 1357], "mapped", [1405]], [[1358, 1358], "mapped", [1406]], [[1359, 1359], "mapped", [1407]], [[1360, 1360], "mapped", [1408]], [[1361, 1361], "mapped", [1409]], [[1362, 1362], "mapped", [1410]], [[1363, 1363], "mapped", [1411]], [[1364, 1364], "mapped", [1412]], [[1365, 1365], "mapped", [1413]], [[1366, 1366], "mapped", [1414]], [[1367, 1368], "disallowed"], [[1369, 1369], "valid"], [[1370, 1375], "valid", [], "NV8"], [[1376, 1376], "disallowed"], [[1377, 1414], "valid"], [[1415, 1415], "mapped", [1381, 1410]], [[1416, 1416], "disallowed"], [[1417, 1417], "valid", [], "NV8"], [[1418, 1418], "valid", [], "NV8"], [[1419, 1420], "disallowed"], [[1421, 1422], "valid", [], "NV8"], [[1423, 1423], "valid", [], "NV8"], [[1424, 1424], "disallowed"], [[1425, 1441], "valid"], [[1442, 1442], "valid"], [[1443, 1455], "valid"], [[1456, 1465], "valid"], [[1466, 1466], "valid"], [[1467, 1469], "valid"], [[1470, 1470], "valid", [], "NV8"], [[1471, 1471], "valid"], [[1472, 1472], "valid", [], "NV8"], [[1473, 1474], "valid"], [[1475, 1475], "valid", [], "NV8"], [[1476, 1476], "valid"], [[1477, 1477], "valid"], [[1478, 1478], "valid", [], "NV8"], [[1479, 1479], "valid"], [[1480, 1487], "disallowed"], [[1488, 1514], "valid"], [[1515, 1519], "disallowed"], [[1520, 1524], "valid"], [[1525, 1535], "disallowed"], [[1536, 1539], "disallowed"], [[1540, 1540], "disallowed"], [[1541, 1541], "disallowed"], [[1542, 1546], "valid", [], "NV8"], [[1547, 1547], "valid", [], "NV8"], [[1548, 1548], "valid", [], "NV8"], [[1549, 1551], "valid", [], "NV8"], [[1552, 1557], "valid"], [[1558, 1562], "valid"], [[1563, 1563], "valid", [], "NV8"], [[1564, 1564], "disallowed"], [[1565, 1565], "disallowed"], [[1566, 1566], "valid", [], "NV8"], [[1567, 1567], "valid", [], "NV8"], [[1568, 1568], "valid"], [[1569, 1594], "valid"], [[1595, 1599], "valid"], [[1600, 1600], "valid", [], "NV8"], [[1601, 1618], "valid"], [[1619, 1621], "valid"], [[1622, 1624], "valid"], [[1625, 1630], "valid"], [[1631, 1631], "valid"], [[1632, 1641], "valid"], [[1642, 1645], "valid", [], "NV8"], [[1646, 1647], "valid"], [[1648, 1652], "valid"], [[1653, 1653], "mapped", [1575, 1652]], [[1654, 1654], "mapped", [1608, 1652]], [[1655, 1655], "mapped", [1735, 1652]], [[1656, 1656], "mapped", [1610, 1652]], [[1657, 1719], "valid"], [[1720, 1721], "valid"], [[1722, 1726], "valid"], [[1727, 1727], "valid"], [[1728, 1742], "valid"], [[1743, 1743], "valid"], [[1744, 1747], "valid"], [[1748, 1748], "valid", [], "NV8"], [[1749, 1756], "valid"], [[1757, 1757], "disallowed"], [[1758, 1758], "valid", [], "NV8"], [[1759, 1768], "valid"], [[1769, 1769], "valid", [], "NV8"], [[1770, 1773], "valid"], [[1774, 1775], "valid"], [[1776, 1785], "valid"], [[1786, 1790], "valid"], [[1791, 1791], "valid"], [[1792, 1805], "valid", [], "NV8"], [[1806, 1806], "disallowed"], [[1807, 1807], "disallowed"], [[1808, 1836], "valid"], [[1837, 1839], "valid"], [[1840, 1866], "valid"], [[1867, 1868], "disallowed"], [[1869, 1871], "valid"], [[1872, 1901], "valid"], [[1902, 1919], "valid"], [[1920, 1968], "valid"], [[1969, 1969], "valid"], [[1970, 1983], "disallowed"], [[1984, 2037], "valid"], [[2038, 2042], "valid", [], "NV8"], [[2043, 2047], "disallowed"], [[2048, 2093], "valid"], [[2094, 2095], "disallowed"], [[2096, 2110], "valid", [], "NV8"], [[2111, 2111], "disallowed"], [[2112, 2139], "valid"], [[2140, 2141], "disallowed"], [[2142, 2142], "valid", [], "NV8"], [[2143, 2207], "disallowed"], [[2208, 2208], "valid"], [[2209, 2209], "valid"], [[2210, 2220], "valid"], [[2221, 2226], "valid"], [[2227, 2228], "valid"], [[2229, 2274], "disallowed"], [[2275, 2275], "valid"], [[2276, 2302], "valid"], [[2303, 2303], "valid"], [[2304, 2304], "valid"], [[2305, 2307], "valid"], [[2308, 2308], "valid"], [[2309, 2361], "valid"], [[2362, 2363], "valid"], [[2364, 2381], "valid"], [[2382, 2382], "valid"], [[2383, 2383], "valid"], [[2384, 2388], "valid"], [[2389, 2389], "valid"], [[2390, 2391], "valid"], [[2392, 2392], "mapped", [2325, 2364]], [[2393, 2393], "mapped", [2326, 2364]], [[2394, 2394], "mapped", [2327, 2364]], [[2395, 2395], "mapped", [2332, 2364]], [[2396, 2396], "mapped", [2337, 2364]], [[2397, 2397], "mapped", [2338, 2364]], [[2398, 2398], "mapped", [2347, 2364]], [[2399, 2399], "mapped", [2351, 2364]], [[2400, 2403], "valid"], [[2404, 2405], "valid", [], "NV8"], [[2406, 2415], "valid"], [[2416, 2416], "valid", [], "NV8"], [[2417, 2418], "valid"], [[2419, 2423], "valid"], [[2424, 2424], "valid"], [[2425, 2426], "valid"], [[2427, 2428], "valid"], [[2429, 2429], "valid"], [[2430, 2431], "valid"], [[2432, 2432], "valid"], [[2433, 2435], "valid"], [[2436, 2436], "disallowed"], [[2437, 2444], "valid"], [[2445, 2446], "disallowed"], [[2447, 2448], "valid"], [[2449, 2450], "disallowed"], [[2451, 2472], "valid"], [[2473, 2473], "disallowed"], [[2474, 2480], "valid"], [[2481, 2481], "disallowed"], [[2482, 2482], "valid"], [[2483, 2485], "disallowed"], [[2486, 2489], "valid"], [[2490, 2491], "disallowed"], [[2492, 2492], "valid"], [[2493, 2493], "valid"], [[2494, 2500], "valid"], [[2501, 2502], "disallowed"], [[2503, 2504], "valid"], [[2505, 2506], "disallowed"], [[2507, 2509], "valid"], [[2510, 2510], "valid"], [[2511, 2518], "disallowed"], [[2519, 2519], "valid"], [[2520, 2523], "disallowed"], [[2524, 2524], "mapped", [2465, 2492]], [[2525, 2525], "mapped", [2466, 2492]], [[2526, 2526], "disallowed"], [[2527, 2527], "mapped", [2479, 2492]], [[2528, 2531], "valid"], [[2532, 2533], "disallowed"], [[2534, 2545], "valid"], [[2546, 2554], "valid", [], "NV8"], [[2555, 2555], "valid", [], "NV8"], [[2556, 2560], "disallowed"], [[2561, 2561], "valid"], [[2562, 2562], "valid"], [[2563, 2563], "valid"], [[2564, 2564], "disallowed"], [[2565, 2570], "valid"], [[2571, 2574], "disallowed"], [[2575, 2576], "valid"], [[2577, 2578], "disallowed"], [[2579, 2600], "valid"], [[2601, 2601], "disallowed"], [[2602, 2608], "valid"], [[2609, 2609], "disallowed"], [[2610, 2610], "valid"], [[2611, 2611], "mapped", [2610, 2620]], [[2612, 2612], "disallowed"], [[2613, 2613], "valid"], [[2614, 2614], "mapped", [2616, 2620]], [[2615, 2615], "disallowed"], [[2616, 2617], "valid"], [[2618, 2619], "disallowed"], [[2620, 2620], "valid"], [[2621, 2621], "disallowed"], [[2622, 2626], "valid"], [[2627, 2630], "disallowed"], [[2631, 2632], "valid"], [[2633, 2634], "disallowed"], [[2635, 2637], "valid"], [[2638, 2640], "disallowed"], [[2641, 2641], "valid"], [[2642, 2648], "disallowed"], [[2649, 2649], "mapped", [2582, 2620]], [[2650, 2650], "mapped", [2583, 2620]], [[2651, 2651], "mapped", [2588, 2620]], [[2652, 2652], "valid"], [[2653, 2653], "disallowed"], [[2654, 2654], "mapped", [2603, 2620]], [[2655, 2661], "disallowed"], [[2662, 2676], "valid"], [[2677, 2677], "valid"], [[2678, 2688], "disallowed"], [[2689, 2691], "valid"], [[2692, 2692], "disallowed"], [[2693, 2699], "valid"], [[2700, 2700], "valid"], [[2701, 2701], "valid"], [[2702, 2702], "disallowed"], [[2703, 2705], "valid"], [[2706, 2706], "disallowed"], [[2707, 2728], "valid"], [[2729, 2729], "disallowed"], [[2730, 2736], "valid"], [[2737, 2737], "disallowed"], [[2738, 2739], "valid"], [[2740, 2740], "disallowed"], [[2741, 2745], "valid"], [[2746, 2747], "disallowed"], [[2748, 2757], "valid"], [[2758, 2758], "disallowed"], [[2759, 2761], "valid"], [[2762, 2762], "disallowed"], [[2763, 2765], "valid"], [[2766, 2767], "disallowed"], [[2768, 2768], "valid"], [[2769, 2783], "disallowed"], [[2784, 2784], "valid"], [[2785, 2787], "valid"], [[2788, 2789], "disallowed"], [[2790, 2799], "valid"], [[2800, 2800], "valid", [], "NV8"], [[2801, 2801], "valid", [], "NV8"], [[2802, 2808], "disallowed"], [[2809, 2809], "valid"], [[2810, 2816], "disallowed"], [[2817, 2819], "valid"], [[2820, 2820], "disallowed"], [[2821, 2828], "valid"], [[2829, 2830], "disallowed"], [[2831, 2832], "valid"], [[2833, 2834], "disallowed"], [[2835, 2856], "valid"], [[2857, 2857], "disallowed"], [[2858, 2864], "valid"], [[2865, 2865], "disallowed"], [[2866, 2867], "valid"], [[2868, 2868], "disallowed"], [[2869, 2869], "valid"], [[2870, 2873], "valid"], [[2874, 2875], "disallowed"], [[2876, 2883], "valid"], [[2884, 2884], "valid"], [[2885, 2886], "disallowed"], [[2887, 2888], "valid"], [[2889, 2890], "disallowed"], [[2891, 2893], "valid"], [[2894, 2901], "disallowed"], [[2902, 2903], "valid"], [[2904, 2907], "disallowed"], [[2908, 2908], "mapped", [2849, 2876]], [[2909, 2909], "mapped", [2850, 2876]], [[2910, 2910], "disallowed"], [[2911, 2913], "valid"], [[2914, 2915], "valid"], [[2916, 2917], "disallowed"], [[2918, 2927], "valid"], [[2928, 2928], "valid", [], "NV8"], [[2929, 2929], "valid"], [[2930, 2935], "valid", [], "NV8"], [[2936, 2945], "disallowed"], [[2946, 2947], "valid"], [[2948, 2948], "disallowed"], [[2949, 2954], "valid"], [[2955, 2957], "disallowed"], [[2958, 2960], "valid"], [[2961, 2961], "disallowed"], [[2962, 2965], "valid"], [[2966, 2968], "disallowed"], [[2969, 2970], "valid"], [[2971, 2971], "disallowed"], [[2972, 2972], "valid"], [[2973, 2973], "disallowed"], [[2974, 2975], "valid"], [[2976, 2978], "disallowed"], [[2979, 2980], "valid"], [[2981, 2983], "disallowed"], [[2984, 2986], "valid"], [[2987, 2989], "disallowed"], [[2990, 2997], "valid"], [[2998, 2998], "valid"], [[2999, 3001], "valid"], [[3002, 3005], "disallowed"], [[3006, 3010], "valid"], [[3011, 3013], "disallowed"], [[3014, 3016], "valid"], [[3017, 3017], "disallowed"], [[3018, 3021], "valid"], [[3022, 3023], "disallowed"], [[3024, 3024], "valid"], [[3025, 3030], "disallowed"], [[3031, 3031], "valid"], [[3032, 3045], "disallowed"], [[3046, 3046], "valid"], [[3047, 3055], "valid"], [[3056, 3058], "valid", [], "NV8"], [[3059, 3066], "valid", [], "NV8"], [[3067, 3071], "disallowed"], [[3072, 3072], "valid"], [[3073, 3075], "valid"], [[3076, 3076], "disallowed"], [[3077, 3084], "valid"], [[3085, 3085], "disallowed"], [[3086, 3088], "valid"], [[3089, 3089], "disallowed"], [[3090, 3112], "valid"], [[3113, 3113], "disallowed"], [[3114, 3123], "valid"], [[3124, 3124], "valid"], [[3125, 3129], "valid"], [[3130, 3132], "disallowed"], [[3133, 3133], "valid"], [[3134, 3140], "valid"], [[3141, 3141], "disallowed"], [[3142, 3144], "valid"], [[3145, 3145], "disallowed"], [[3146, 3149], "valid"], [[3150, 3156], "disallowed"], [[3157, 3158], "valid"], [[3159, 3159], "disallowed"], [[3160, 3161], "valid"], [[3162, 3162], "valid"], [[3163, 3167], "disallowed"], [[3168, 3169], "valid"], [[3170, 3171], "valid"], [[3172, 3173], "disallowed"], [[3174, 3183], "valid"], [[3184, 3191], "disallowed"], [[3192, 3199], "valid", [], "NV8"], [[3200, 3200], "disallowed"], [[3201, 3201], "valid"], [[3202, 3203], "valid"], [[3204, 3204], "disallowed"], [[3205, 3212], "valid"], [[3213, 3213], "disallowed"], [[3214, 3216], "valid"], [[3217, 3217], "disallowed"], [[3218, 3240], "valid"], [[3241, 3241], "disallowed"], [[3242, 3251], "valid"], [[3252, 3252], "disallowed"], [[3253, 3257], "valid"], [[3258, 3259], "disallowed"], [[3260, 3261], "valid"], [[3262, 3268], "valid"], [[3269, 3269], "disallowed"], [[3270, 3272], "valid"], [[3273, 3273], "disallowed"], [[3274, 3277], "valid"], [[3278, 3284], "disallowed"], [[3285, 3286], "valid"], [[3287, 3293], "disallowed"], [[3294, 3294], "valid"], [[3295, 3295], "disallowed"], [[3296, 3297], "valid"], [[3298, 3299], "valid"], [[3300, 3301], "disallowed"], [[3302, 3311], "valid"], [[3312, 3312], "disallowed"], [[3313, 3314], "valid"], [[3315, 3328], "disallowed"], [[3329, 3329], "valid"], [[3330, 3331], "valid"], [[3332, 3332], "disallowed"], [[3333, 3340], "valid"], [[3341, 3341], "disallowed"], [[3342, 3344], "valid"], [[3345, 3345], "disallowed"], [[3346, 3368], "valid"], [[3369, 3369], "valid"], [[3370, 3385], "valid"], [[3386, 3386], "valid"], [[3387, 3388], "disallowed"], [[3389, 3389], "valid"], [[3390, 3395], "valid"], [[3396, 3396], "valid"], [[3397, 3397], "disallowed"], [[3398, 3400], "valid"], [[3401, 3401], "disallowed"], [[3402, 3405], "valid"], [[3406, 3406], "valid"], [[3407, 3414], "disallowed"], [[3415, 3415], "valid"], [[3416, 3422], "disallowed"], [[3423, 3423], "valid"], [[3424, 3425], "valid"], [[3426, 3427], "valid"], [[3428, 3429], "disallowed"], [[3430, 3439], "valid"], [[3440, 3445], "valid", [], "NV8"], [[3446, 3448], "disallowed"], [[3449, 3449], "valid", [], "NV8"], [[3450, 3455], "valid"], [[3456, 3457], "disallowed"], [[3458, 3459], "valid"], [[3460, 3460], "disallowed"], [[3461, 3478], "valid"], [[3479, 3481], "disallowed"], [[3482, 3505], "valid"], [[3506, 3506], "disallowed"], [[3507, 3515], "valid"], [[3516, 3516], "disallowed"], [[3517, 3517], "valid"], [[3518, 3519], "disallowed"], [[3520, 3526], "valid"], [[3527, 3529], "disallowed"], [[3530, 3530], "valid"], [[3531, 3534], "disallowed"], [[3535, 3540], "valid"], [[3541, 3541], "disallowed"], [[3542, 3542], "valid"], [[3543, 3543], "disallowed"], [[3544, 3551], "valid"], [[3552, 3557], "disallowed"], [[3558, 3567], "valid"], [[3568, 3569], "disallowed"], [[3570, 3571], "valid"], [[3572, 3572], "valid", [], "NV8"], [[3573, 3584], "disallowed"], [[3585, 3634], "valid"], [[3635, 3635], "mapped", [3661, 3634]], [[3636, 3642], "valid"], [[3643, 3646], "disallowed"], [[3647, 3647], "valid", [], "NV8"], [[3648, 3662], "valid"], [[3663, 3663], "valid", [], "NV8"], [[3664, 3673], "valid"], [[3674, 3675], "valid", [], "NV8"], [[3676, 3712], "disallowed"], [[3713, 3714], "valid"], [[3715, 3715], "disallowed"], [[3716, 3716], "valid"], [[3717, 3718], "disallowed"], [[3719, 3720], "valid"], [[3721, 3721], "disallowed"], [[3722, 3722], "valid"], [[3723, 3724], "disallowed"], [[3725, 3725], "valid"], [[3726, 3731], "disallowed"], [[3732, 3735], "valid"], [[3736, 3736], "disallowed"], [[3737, 3743], "valid"], [[3744, 3744], "disallowed"], [[3745, 3747], "valid"], [[3748, 3748], "disallowed"], [[3749, 3749], "valid"], [[3750, 3750], "disallowed"], [[3751, 3751], "valid"], [[3752, 3753], "disallowed"], [[3754, 3755], "valid"], [[3756, 3756], "disallowed"], [[3757, 3762], "valid"], [[3763, 3763], "mapped", [3789, 3762]], [[3764, 3769], "valid"], [[3770, 3770], "disallowed"], [[3771, 3773], "valid"], [[3774, 3775], "disallowed"], [[3776, 3780], "valid"], [[3781, 3781], "disallowed"], [[3782, 3782], "valid"], [[3783, 3783], "disallowed"], [[3784, 3789], "valid"], [[3790, 3791], "disallowed"], [[3792, 3801], "valid"], [[3802, 3803], "disallowed"], [[3804, 3804], "mapped", [3755, 3737]], [[3805, 3805], "mapped", [3755, 3745]], [[3806, 3807], "valid"], [[3808, 3839], "disallowed"], [[3840, 3840], "valid"], [[3841, 3850], "valid", [], "NV8"], [[3851, 3851], "valid"], [[3852, 3852], "mapped", [3851]], [[3853, 3863], "valid", [], "NV8"], [[3864, 3865], "valid"], [[3866, 3871], "valid", [], "NV8"], [[3872, 3881], "valid"], [[3882, 3892], "valid", [], "NV8"], [[3893, 3893], "valid"], [[3894, 3894], "valid", [], "NV8"], [[3895, 3895], "valid"], [[3896, 3896], "valid", [], "NV8"], [[3897, 3897], "valid"], [[3898, 3901], "valid", [], "NV8"], [[3902, 3906], "valid"], [[3907, 3907], "mapped", [3906, 4023]], [[3908, 3911], "valid"], [[3912, 3912], "disallowed"], [[3913, 3916], "valid"], [[3917, 3917], "mapped", [3916, 4023]], [[3918, 3921], "valid"], [[3922, 3922], "mapped", [3921, 4023]], [[3923, 3926], "valid"], [[3927, 3927], "mapped", [3926, 4023]], [[3928, 3931], "valid"], [[3932, 3932], "mapped", [3931, 4023]], [[3933, 3944], "valid"], [[3945, 3945], "mapped", [3904, 4021]], [[3946, 3946], "valid"], [[3947, 3948], "valid"], [[3949, 3952], "disallowed"], [[3953, 3954], "valid"], [[3955, 3955], "mapped", [3953, 3954]], [[3956, 3956], "valid"], [[3957, 3957], "mapped", [3953, 3956]], [[3958, 3958], "mapped", [4018, 3968]], [[3959, 3959], "mapped", [4018, 3953, 3968]], [[3960, 3960], "mapped", [4019, 3968]], [[3961, 3961], "mapped", [4019, 3953, 3968]], [[3962, 3968], "valid"], [[3969, 3969], "mapped", [3953, 3968]], [[3970, 3972], "valid"], [[3973, 3973], "valid", [], "NV8"], [[3974, 3979], "valid"], [[3980, 3983], "valid"], [[3984, 3986], "valid"], [[3987, 3987], "mapped", [3986, 4023]], [[3988, 3989], "valid"], [[3990, 3990], "valid"], [[3991, 3991], "valid"], [[3992, 3992], "disallowed"], [[3993, 3996], "valid"], [[3997, 3997], "mapped", [3996, 4023]], [[3998, 4001], "valid"], [[4002, 4002], "mapped", [4001, 4023]], [[4003, 4006], "valid"], [[4007, 4007], "mapped", [4006, 4023]], [[4008, 4011], "valid"], [[4012, 4012], "mapped", [4011, 4023]], [[4013, 4013], "valid"], [[4014, 4016], "valid"], [[4017, 4023], "valid"], [[4024, 4024], "valid"], [[4025, 4025], "mapped", [3984, 4021]], [[4026, 4028], "valid"], [[4029, 4029], "disallowed"], [[4030, 4037], "valid", [], "NV8"], [[4038, 4038], "valid"], [[4039, 4044], "valid", [], "NV8"], [[4045, 4045], "disallowed"], [[4046, 4046], "valid", [], "NV8"], [[4047, 4047], "valid", [], "NV8"], [[4048, 4049], "valid", [], "NV8"], [[4050, 4052], "valid", [], "NV8"], [[4053, 4056], "valid", [], "NV8"], [[4057, 4058], "valid", [], "NV8"], [[4059, 4095], "disallowed"], [[4096, 4129], "valid"], [[4130, 4130], "valid"], [[4131, 4135], "valid"], [[4136, 4136], "valid"], [[4137, 4138], "valid"], [[4139, 4139], "valid"], [[4140, 4146], "valid"], [[4147, 4149], "valid"], [[4150, 4153], "valid"], [[4154, 4159], "valid"], [[4160, 4169], "valid"], [[4170, 4175], "valid", [], "NV8"], [[4176, 4185], "valid"], [[4186, 4249], "valid"], [[4250, 4253], "valid"], [[4254, 4255], "valid", [], "NV8"], [[4256, 4293], "disallowed"], [[4294, 4294], "disallowed"], [[4295, 4295], "mapped", [11559]], [[4296, 4300], "disallowed"], [[4301, 4301], "mapped", [11565]], [[4302, 4303], "disallowed"], [[4304, 4342], "valid"], [[4343, 4344], "valid"], [[4345, 4346], "valid"], [[4347, 4347], "valid", [], "NV8"], [[4348, 4348], "mapped", [4316]], [[4349, 4351], "valid"], [[4352, 4441], "valid", [], "NV8"], [[4442, 4446], "valid", [], "NV8"], [[4447, 4448], "disallowed"], [[4449, 4514], "valid", [], "NV8"], [[4515, 4519], "valid", [], "NV8"], [[4520, 4601], "valid", [], "NV8"], [[4602, 4607], "valid", [], "NV8"], [[4608, 4614], "valid"], [[4615, 4615], "valid"], [[4616, 4678], "valid"], [[4679, 4679], "valid"], [[4680, 4680], "valid"], [[4681, 4681], "disallowed"], [[4682, 4685], "valid"], [[4686, 4687], "disallowed"], [[4688, 4694], "valid"], [[4695, 4695], "disallowed"], [[4696, 4696], "valid"], [[4697, 4697], "disallowed"], [[4698, 4701], "valid"], [[4702, 4703], "disallowed"], [[4704, 4742], "valid"], [[4743, 4743], "valid"], [[4744, 4744], "valid"], [[4745, 4745], "disallowed"], [[4746, 4749], "valid"], [[4750, 4751], "disallowed"], [[4752, 4782], "valid"], [[4783, 4783], "valid"], [[4784, 4784], "valid"], [[4785, 4785], "disallowed"], [[4786, 4789], "valid"], [[4790, 4791], "disallowed"], [[4792, 4798], "valid"], [[4799, 4799], "disallowed"], [[4800, 4800], "valid"], [[4801, 4801], "disallowed"], [[4802, 4805], "valid"], [[4806, 4807], "disallowed"], [[4808, 4814], "valid"], [[4815, 4815], "valid"], [[4816, 4822], "valid"], [[4823, 4823], "disallowed"], [[4824, 4846], "valid"], [[4847, 4847], "valid"], [[4848, 4878], "valid"], [[4879, 4879], "valid"], [[4880, 4880], "valid"], [[4881, 4881], "disallowed"], [[4882, 4885], "valid"], [[4886, 4887], "disallowed"], [[4888, 4894], "valid"], [[4895, 4895], "valid"], [[4896, 4934], "valid"], [[4935, 4935], "valid"], [[4936, 4954], "valid"], [[4955, 4956], "disallowed"], [[4957, 4958], "valid"], [[4959, 4959], "valid"], [[4960, 4960], "valid", [], "NV8"], [[4961, 4988], "valid", [], "NV8"], [[4989, 4991], "disallowed"], [[4992, 5007], "valid"], [[5008, 5017], "valid", [], "NV8"], [[5018, 5023], "disallowed"], [[5024, 5108], "valid"], [[5109, 5109], "valid"], [[5110, 5111], "disallowed"], [[5112, 5112], "mapped", [5104]], [[5113, 5113], "mapped", [5105]], [[5114, 5114], "mapped", [5106]], [[5115, 5115], "mapped", [5107]], [[5116, 5116], "mapped", [5108]], [[5117, 5117], "mapped", [5109]], [[5118, 5119], "disallowed"], [[5120, 5120], "valid", [], "NV8"], [[5121, 5740], "valid"], [[5741, 5742], "valid", [], "NV8"], [[5743, 5750], "valid"], [[5751, 5759], "valid"], [[5760, 5760], "disallowed"], [[5761, 5786], "valid"], [[5787, 5788], "valid", [], "NV8"], [[5789, 5791], "disallowed"], [[5792, 5866], "valid"], [[5867, 5872], "valid", [], "NV8"], [[5873, 5880], "valid"], [[5881, 5887], "disallowed"], [[5888, 5900], "valid"], [[5901, 5901], "disallowed"], [[5902, 5908], "valid"], [[5909, 5919], "disallowed"], [[5920, 5940], "valid"], [[5941, 5942], "valid", [], "NV8"], [[5943, 5951], "disallowed"], [[5952, 5971], "valid"], [[5972, 5983], "disallowed"], [[5984, 5996], "valid"], [[5997, 5997], "disallowed"], [[5998, 6e3], "valid"], [[6001, 6001], "disallowed"], [[6002, 6003], "valid"], [[6004, 6015], "disallowed"], [[6016, 6067], "valid"], [[6068, 6069], "disallowed"], [[6070, 6099], "valid"], [[6100, 6102], "valid", [], "NV8"], [[6103, 6103], "valid"], [[6104, 6107], "valid", [], "NV8"], [[6108, 6108], "valid"], [[6109, 6109], "valid"], [[6110, 6111], "disallowed"], [[6112, 6121], "valid"], [[6122, 6127], "disallowed"], [[6128, 6137], "valid", [], "NV8"], [[6138, 6143], "disallowed"], [[6144, 6149], "valid", [], "NV8"], [[6150, 6150], "disallowed"], [[6151, 6154], "valid", [], "NV8"], [[6155, 6157], "ignored"], [[6158, 6158], "disallowed"], [[6159, 6159], "disallowed"], [[6160, 6169], "valid"], [[6170, 6175], "disallowed"], [[6176, 6263], "valid"], [[6264, 6271], "disallowed"], [[6272, 6313], "valid"], [[6314, 6314], "valid"], [[6315, 6319], "disallowed"], [[6320, 6389], "valid"], [[6390, 6399], "disallowed"], [[6400, 6428], "valid"], [[6429, 6430], "valid"], [[6431, 6431], "disallowed"], [[6432, 6443], "valid"], [[6444, 6447], "disallowed"], [[6448, 6459], "valid"], [[6460, 6463], "disallowed"], [[6464, 6464], "valid", [], "NV8"], [[6465, 6467], "disallowed"], [[6468, 6469], "valid", [], "NV8"], [[6470, 6509], "valid"], [[6510, 6511], "disallowed"], [[6512, 6516], "valid"], [[6517, 6527], "disallowed"], [[6528, 6569], "valid"], [[6570, 6571], "valid"], [[6572, 6575], "disallowed"], [[6576, 6601], "valid"], [[6602, 6607], "disallowed"], [[6608, 6617], "valid"], [[6618, 6618], "valid", [], "XV8"], [[6619, 6621], "disallowed"], [[6622, 6623], "valid", [], "NV8"], [[6624, 6655], "valid", [], "NV8"], [[6656, 6683], "valid"], [[6684, 6685], "disallowed"], [[6686, 6687], "valid", [], "NV8"], [[6688, 6750], "valid"], [[6751, 6751], "disallowed"], [[6752, 6780], "valid"], [[6781, 6782], "disallowed"], [[6783, 6793], "valid"], [[6794, 6799], "disallowed"], [[6800, 6809], "valid"], [[6810, 6815], "disallowed"], [[6816, 6822], "valid", [], "NV8"], [[6823, 6823], "valid"], [[6824, 6829], "valid", [], "NV8"], [[6830, 6831], "disallowed"], [[6832, 6845], "valid"], [[6846, 6846], "valid", [], "NV8"], [[6847, 6911], "disallowed"], [[6912, 6987], "valid"], [[6988, 6991], "disallowed"], [[6992, 7001], "valid"], [[7002, 7018], "valid", [], "NV8"], [[7019, 7027], "valid"], [[7028, 7036], "valid", [], "NV8"], [[7037, 7039], "disallowed"], [[7040, 7082], "valid"], [[7083, 7085], "valid"], [[7086, 7097], "valid"], [[7098, 7103], "valid"], [[7104, 7155], "valid"], [[7156, 7163], "disallowed"], [[7164, 7167], "valid", [], "NV8"], [[7168, 7223], "valid"], [[7224, 7226], "disallowed"], [[7227, 7231], "valid", [], "NV8"], [[7232, 7241], "valid"], [[7242, 7244], "disallowed"], [[7245, 7293], "valid"], [[7294, 7295], "valid", [], "NV8"], [[7296, 7359], "disallowed"], [[7360, 7367], "valid", [], "NV8"], [[7368, 7375], "disallowed"], [[7376, 7378], "valid"], [[7379, 7379], "valid", [], "NV8"], [[7380, 7410], "valid"], [[7411, 7414], "valid"], [[7415, 7415], "disallowed"], [[7416, 7417], "valid"], [[7418, 7423], "disallowed"], [[7424, 7467], "valid"], [[7468, 7468], "mapped", [97]], [[7469, 7469], "mapped", [230]], [[7470, 7470], "mapped", [98]], [[7471, 7471], "valid"], [[7472, 7472], "mapped", [100]], [[7473, 7473], "mapped", [101]], [[7474, 7474], "mapped", [477]], [[7475, 7475], "mapped", [103]], [[7476, 7476], "mapped", [104]], [[7477, 7477], "mapped", [105]], [[7478, 7478], "mapped", [106]], [[7479, 7479], "mapped", [107]], [[7480, 7480], "mapped", [108]], [[7481, 7481], "mapped", [109]], [[7482, 7482], "mapped", [110]], [[7483, 7483], "valid"], [[7484, 7484], "mapped", [111]], [[7485, 7485], "mapped", [547]], [[7486, 7486], "mapped", [112]], [[7487, 7487], "mapped", [114]], [[7488, 7488], "mapped", [116]], [[7489, 7489], "mapped", [117]], [[7490, 7490], "mapped", [119]], [[7491, 7491], "mapped", [97]], [[7492, 7492], "mapped", [592]], [[7493, 7493], "mapped", [593]], [[7494, 7494], "mapped", [7426]], [[7495, 7495], "mapped", [98]], [[7496, 7496], "mapped", [100]], [[7497, 7497], "mapped", [101]], [[7498, 7498], "mapped", [601]], [[7499, 7499], "mapped", [603]], [[7500, 7500], "mapped", [604]], [[7501, 7501], "mapped", [103]], [[7502, 7502], "valid"], [[7503, 7503], "mapped", [107]], [[7504, 7504], "mapped", [109]], [[7505, 7505], "mapped", [331]], [[7506, 7506], "mapped", [111]], [[7507, 7507], "mapped", [596]], [[7508, 7508], "mapped", [7446]], [[7509, 7509], "mapped", [7447]], [[7510, 7510], "mapped", [112]], [[7511, 7511], "mapped", [116]], [[7512, 7512], "mapped", [117]], [[7513, 7513], "mapped", [7453]], [[7514, 7514], "mapped", [623]], [[7515, 7515], "mapped", [118]], [[7516, 7516], "mapped", [7461]], [[7517, 7517], "mapped", [946]], [[7518, 7518], "mapped", [947]], [[7519, 7519], "mapped", [948]], [[7520, 7520], "mapped", [966]], [[7521, 7521], "mapped", [967]], [[7522, 7522], "mapped", [105]], [[7523, 7523], "mapped", [114]], [[7524, 7524], "mapped", [117]], [[7525, 7525], "mapped", [118]], [[7526, 7526], "mapped", [946]], [[7527, 7527], "mapped", [947]], [[7528, 7528], "mapped", [961]], [[7529, 7529], "mapped", [966]], [[7530, 7530], "mapped", [967]], [[7531, 7531], "valid"], [[7532, 7543], "valid"], [[7544, 7544], "mapped", [1085]], [[7545, 7578], "valid"], [[7579, 7579], "mapped", [594]], [[7580, 7580], "mapped", [99]], [[7581, 7581], "mapped", [597]], [[7582, 7582], "mapped", [240]], [[7583, 7583], "mapped", [604]], [[7584, 7584], "mapped", [102]], [[7585, 7585], "mapped", [607]], [[7586, 7586], "mapped", [609]], [[7587, 7587], "mapped", [613]], [[7588, 7588], "mapped", [616]], [[7589, 7589], "mapped", [617]], [[7590, 7590], "mapped", [618]], [[7591, 7591], "mapped", [7547]], [[7592, 7592], "mapped", [669]], [[7593, 7593], "mapped", [621]], [[7594, 7594], "mapped", [7557]], [[7595, 7595], "mapped", [671]], [[7596, 7596], "mapped", [625]], [[7597, 7597], "mapped", [624]], [[7598, 7598], "mapped", [626]], [[7599, 7599], "mapped", [627]], [[7600, 7600], "mapped", [628]], [[7601, 7601], "mapped", [629]], [[7602, 7602], "mapped", [632]], [[7603, 7603], "mapped", [642]], [[7604, 7604], "mapped", [643]], [[7605, 7605], "mapped", [427]], [[7606, 7606], "mapped", [649]], [[7607, 7607], "mapped", [650]], [[7608, 7608], "mapped", [7452]], [[7609, 7609], "mapped", [651]], [[7610, 7610], "mapped", [652]], [[7611, 7611], "mapped", [122]], [[7612, 7612], "mapped", [656]], [[7613, 7613], "mapped", [657]], [[7614, 7614], "mapped", [658]], [[7615, 7615], "mapped", [952]], [[7616, 7619], "valid"], [[7620, 7626], "valid"], [[7627, 7654], "valid"], [[7655, 7669], "valid"], [[7670, 7675], "disallowed"], [[7676, 7676], "valid"], [[7677, 7677], "valid"], [[7678, 7679], "valid"], [[7680, 7680], "mapped", [7681]], [[7681, 7681], "valid"], [[7682, 7682], "mapped", [7683]], [[7683, 7683], "valid"], [[7684, 7684], "mapped", [7685]], [[7685, 7685], "valid"], [[7686, 7686], "mapped", [7687]], [[7687, 7687], "valid"], [[7688, 7688], "mapped", [7689]], [[7689, 7689], "valid"], [[7690, 7690], "mapped", [7691]], [[7691, 7691], "valid"], [[7692, 7692], "mapped", [7693]], [[7693, 7693], "valid"], [[7694, 7694], "mapped", [7695]], [[7695, 7695], "valid"], [[7696, 7696], "mapped", [7697]], [[7697, 7697], "valid"], [[7698, 7698], "mapped", [7699]], [[7699, 7699], "valid"], [[7700, 7700], "mapped", [7701]], [[7701, 7701], "valid"], [[7702, 7702], "mapped", [7703]], [[7703, 7703], "valid"], [[7704, 7704], "mapped", [7705]], [[7705, 7705], "valid"], [[7706, 7706], "mapped", [7707]], [[7707, 7707], "valid"], [[7708, 7708], "mapped", [7709]], [[7709, 7709], "valid"], [[7710, 7710], "mapped", [7711]], [[7711, 7711], "valid"], [[7712, 7712], "mapped", [7713]], [[7713, 7713], "valid"], [[7714, 7714], "mapped", [7715]], [[7715, 7715], "valid"], [[7716, 7716], "mapped", [7717]], [[7717, 7717], "valid"], [[7718, 7718], "mapped", [7719]], [[7719, 7719], "valid"], [[7720, 7720], "mapped", [7721]], [[7721, 7721], "valid"], [[7722, 7722], "mapped", [7723]], [[7723, 7723], "valid"], [[7724, 7724], "mapped", [7725]], [[7725, 7725], "valid"], [[7726, 7726], "mapped", [7727]], [[7727, 7727], "valid"], [[7728, 7728], "mapped", [7729]], [[7729, 7729], "valid"], [[7730, 7730], "mapped", [7731]], [[7731, 7731], "valid"], [[7732, 7732], "mapped", [7733]], [[7733, 7733], "valid"], [[7734, 7734], "mapped", [7735]], [[7735, 7735], "valid"], [[7736, 7736], "mapped", [7737]], [[7737, 7737], "valid"], [[7738, 7738], "mapped", [7739]], [[7739, 7739], "valid"], [[7740, 7740], "mapped", [7741]], [[7741, 7741], "valid"], [[7742, 7742], "mapped", [7743]], [[7743, 7743], "valid"], [[7744, 7744], "mapped", [7745]], [[7745, 7745], "valid"], [[7746, 7746], "mapped", [7747]], [[7747, 7747], "valid"], [[7748, 7748], "mapped", [7749]], [[7749, 7749], "valid"], [[7750, 7750], "mapped", [7751]], [[7751, 7751], "valid"], [[7752, 7752], "mapped", [7753]], [[7753, 7753], "valid"], [[7754, 7754], "mapped", [7755]], [[7755, 7755], "valid"], [[7756, 7756], "mapped", [7757]], [[7757, 7757], "valid"], [[7758, 7758], "mapped", [7759]], [[7759, 7759], "valid"], [[7760, 7760], "mapped", [7761]], [[7761, 7761], "valid"], [[7762, 7762], "mapped", [7763]], [[7763, 7763], "valid"], [[7764, 7764], "mapped", [7765]], [[7765, 7765], "valid"], [[7766, 7766], "mapped", [7767]], [[7767, 7767], "valid"], [[7768, 7768], "mapped", [7769]], [[7769, 7769], "valid"], [[7770, 7770], "mapped", [7771]], [[7771, 7771], "valid"], [[7772, 7772], "mapped", [7773]], [[7773, 7773], "valid"], [[7774, 7774], "mapped", [7775]], [[7775, 7775], "valid"], [[7776, 7776], "mapped", [7777]], [[7777, 7777], "valid"], [[7778, 7778], "mapped", [7779]], [[7779, 7779], "valid"], [[7780, 7780], "mapped", [7781]], [[7781, 7781], "valid"], [[7782, 7782], "mapped", [7783]], [[7783, 7783], "valid"], [[7784, 7784], "mapped", [7785]], [[7785, 7785], "valid"], [[7786, 7786], "mapped", [7787]], [[7787, 7787], "valid"], [[7788, 7788], "mapped", [7789]], [[7789, 7789], "valid"], [[7790, 7790], "mapped", [7791]], [[7791, 7791], "valid"], [[7792, 7792], "mapped", [7793]], [[7793, 7793], "valid"], [[7794, 7794], "mapped", [7795]], [[7795, 7795], "valid"], [[7796, 7796], "mapped", [7797]], [[7797, 7797], "valid"], [[7798, 7798], "mapped", [7799]], [[7799, 7799], "valid"], [[7800, 7800], "mapped", [7801]], [[7801, 7801], "valid"], [[7802, 7802], "mapped", [7803]], [[7803, 7803], "valid"], [[7804, 7804], "mapped", [7805]], [[7805, 7805], "valid"], [[7806, 7806], "mapped", [7807]], [[7807, 7807], "valid"], [[7808, 7808], "mapped", [7809]], [[7809, 7809], "valid"], [[7810, 7810], "mapped", [7811]], [[7811, 7811], "valid"], [[7812, 7812], "mapped", [7813]], [[7813, 7813], "valid"], [[7814, 7814], "mapped", [7815]], [[7815, 7815], "valid"], [[7816, 7816], "mapped", [7817]], [[7817, 7817], "valid"], [[7818, 7818], "mapped", [7819]], [[7819, 7819], "valid"], [[7820, 7820], "mapped", [7821]], [[7821, 7821], "valid"], [[7822, 7822], "mapped", [7823]], [[7823, 7823], "valid"], [[7824, 7824], "mapped", [7825]], [[7825, 7825], "valid"], [[7826, 7826], "mapped", [7827]], [[7827, 7827], "valid"], [[7828, 7828], "mapped", [7829]], [[7829, 7833], "valid"], [[7834, 7834], "mapped", [97, 702]], [[7835, 7835], "mapped", [7777]], [[7836, 7837], "valid"], [[7838, 7838], "mapped", [115, 115]], [[7839, 7839], "valid"], [[7840, 7840], "mapped", [7841]], [[7841, 7841], "valid"], [[7842, 7842], "mapped", [7843]], [[7843, 7843], "valid"], [[7844, 7844], "mapped", [7845]], [[7845, 7845], "valid"], [[7846, 7846], "mapped", [7847]], [[7847, 7847], "valid"], [[7848, 7848], "mapped", [7849]], [[7849, 7849], "valid"], [[7850, 7850], "mapped", [7851]], [[7851, 7851], "valid"], [[7852, 7852], "mapped", [7853]], [[7853, 7853], "valid"], [[7854, 7854], "mapped", [7855]], [[7855, 7855], "valid"], [[7856, 7856], "mapped", [7857]], [[7857, 7857], "valid"], [[7858, 7858], "mapped", [7859]], [[7859, 7859], "valid"], [[7860, 7860], "mapped", [7861]], [[7861, 7861], "valid"], [[7862, 7862], "mapped", [7863]], [[7863, 7863], "valid"], [[7864, 7864], "mapped", [7865]], [[7865, 7865], "valid"], [[7866, 7866], "mapped", [7867]], [[7867, 7867], "valid"], [[7868, 7868], "mapped", [7869]], [[7869, 7869], "valid"], [[7870, 7870], "mapped", [7871]], [[7871, 7871], "valid"], [[7872, 7872], "mapped", [7873]], [[7873, 7873], "valid"], [[7874, 7874], "mapped", [7875]], [[7875, 7875], "valid"], [[7876, 7876], "mapped", [7877]], [[7877, 7877], "valid"], [[7878, 7878], "mapped", [7879]], [[7879, 7879], "valid"], [[7880, 7880], "mapped", [7881]], [[7881, 7881], "valid"], [[7882, 7882], "mapped", [7883]], [[7883, 7883], "valid"], [[7884, 7884], "mapped", [7885]], [[7885, 7885], "valid"], [[7886, 7886], "mapped", [7887]], [[7887, 7887], "valid"], [[7888, 7888], "mapped", [7889]], [[7889, 7889], "valid"], [[7890, 7890], "mapped", [7891]], [[7891, 7891], "valid"], [[7892, 7892], "mapped", [7893]], [[7893, 7893], "valid"], [[7894, 7894], "mapped", [7895]], [[7895, 7895], "valid"], [[7896, 7896], "mapped", [7897]], [[7897, 7897], "valid"], [[7898, 7898], "mapped", [7899]], [[7899, 7899], "valid"], [[7900, 7900], "mapped", [7901]], [[7901, 7901], "valid"], [[7902, 7902], "mapped", [7903]], [[7903, 7903], "valid"], [[7904, 7904], "mapped", [7905]], [[7905, 7905], "valid"], [[7906, 7906], "mapped", [7907]], [[7907, 7907], "valid"], [[7908, 7908], "mapped", [7909]], [[7909, 7909], "valid"], [[7910, 7910], "mapped", [7911]], [[7911, 7911], "valid"], [[7912, 7912], "mapped", [7913]], [[7913, 7913], "valid"], [[7914, 7914], "mapped", [7915]], [[7915, 7915], "valid"], [[7916, 7916], "mapped", [7917]], [[7917, 7917], "valid"], [[7918, 7918], "mapped", [7919]], [[7919, 7919], "valid"], [[7920, 7920], "mapped", [7921]], [[7921, 7921], "valid"], [[7922, 7922], "mapped", [7923]], [[7923, 7923], "valid"], [[7924, 7924], "mapped", [7925]], [[7925, 7925], "valid"], [[7926, 7926], "mapped", [7927]], [[7927, 7927], "valid"], [[7928, 7928], "mapped", [7929]], [[7929, 7929], "valid"], [[7930, 7930], "mapped", [7931]], [[7931, 7931], "valid"], [[7932, 7932], "mapped", [7933]], [[7933, 7933], "valid"], [[7934, 7934], "mapped", [7935]], [[7935, 7935], "valid"], [[7936, 7943], "valid"], [[7944, 7944], "mapped", [7936]], [[7945, 7945], "mapped", [7937]], [[7946, 7946], "mapped", [7938]], [[7947, 7947], "mapped", [7939]], [[7948, 7948], "mapped", [7940]], [[7949, 7949], "mapped", [7941]], [[7950, 7950], "mapped", [7942]], [[7951, 7951], "mapped", [7943]], [[7952, 7957], "valid"], [[7958, 7959], "disallowed"], [[7960, 7960], "mapped", [7952]], [[7961, 7961], "mapped", [7953]], [[7962, 7962], "mapped", [7954]], [[7963, 7963], "mapped", [7955]], [[7964, 7964], "mapped", [7956]], [[7965, 7965], "mapped", [7957]], [[7966, 7967], "disallowed"], [[7968, 7975], "valid"], [[7976, 7976], "mapped", [7968]], [[7977, 7977], "mapped", [7969]], [[7978, 7978], "mapped", [7970]], [[7979, 7979], "mapped", [7971]], [[7980, 7980], "mapped", [7972]], [[7981, 7981], "mapped", [7973]], [[7982, 7982], "mapped", [7974]], [[7983, 7983], "mapped", [7975]], [[7984, 7991], "valid"], [[7992, 7992], "mapped", [7984]], [[7993, 7993], "mapped", [7985]], [[7994, 7994], "mapped", [7986]], [[7995, 7995], "mapped", [7987]], [[7996, 7996], "mapped", [7988]], [[7997, 7997], "mapped", [7989]], [[7998, 7998], "mapped", [7990]], [[7999, 7999], "mapped", [7991]], [[8e3, 8005], "valid"], [[8006, 8007], "disallowed"], [[8008, 8008], "mapped", [8e3]], [[8009, 8009], "mapped", [8001]], [[8010, 8010], "mapped", [8002]], [[8011, 8011], "mapped", [8003]], [[8012, 8012], "mapped", [8004]], [[8013, 8013], "mapped", [8005]], [[8014, 8015], "disallowed"], [[8016, 8023], "valid"], [[8024, 8024], "disallowed"], [[8025, 8025], "mapped", [8017]], [[8026, 8026], "disallowed"], [[8027, 8027], "mapped", [8019]], [[8028, 8028], "disallowed"], [[8029, 8029], "mapped", [8021]], [[8030, 8030], "disallowed"], [[8031, 8031], "mapped", [8023]], [[8032, 8039], "valid"], [[8040, 8040], "mapped", [8032]], [[8041, 8041], "mapped", [8033]], [[8042, 8042], "mapped", [8034]], [[8043, 8043], "mapped", [8035]], [[8044, 8044], "mapped", [8036]], [[8045, 8045], "mapped", [8037]], [[8046, 8046], "mapped", [8038]], [[8047, 8047], "mapped", [8039]], [[8048, 8048], "valid"], [[8049, 8049], "mapped", [940]], [[8050, 8050], "valid"], [[8051, 8051], "mapped", [941]], [[8052, 8052], "valid"], [[8053, 8053], "mapped", [942]], [[8054, 8054], "valid"], [[8055, 8055], "mapped", [943]], [[8056, 8056], "valid"], [[8057, 8057], "mapped", [972]], [[8058, 8058], "valid"], [[8059, 8059], "mapped", [973]], [[8060, 8060], "valid"], [[8061, 8061], "mapped", [974]], [[8062, 8063], "disallowed"], [[8064, 8064], "mapped", [7936, 953]], [[8065, 8065], "mapped", [7937, 953]], [[8066, 8066], "mapped", [7938, 953]], [[8067, 8067], "mapped", [7939, 953]], [[8068, 8068], "mapped", [7940, 953]], [[8069, 8069], "mapped", [7941, 953]], [[8070, 8070], "mapped", [7942, 953]], [[8071, 8071], "mapped", [7943, 953]], [[8072, 8072], "mapped", [7936, 953]], [[8073, 8073], "mapped", [7937, 953]], [[8074, 8074], "mapped", [7938, 953]], [[8075, 8075], "mapped", [7939, 953]], [[8076, 8076], "mapped", [7940, 953]], [[8077, 8077], "mapped", [7941, 953]], [[8078, 8078], "mapped", [7942, 953]], [[8079, 8079], "mapped", [7943, 953]], [[8080, 8080], "mapped", [7968, 953]], [[8081, 8081], "mapped", [7969, 953]], [[8082, 8082], "mapped", [7970, 953]], [[8083, 8083], "mapped", [7971, 953]], [[8084, 8084], "mapped", [7972, 953]], [[8085, 8085], "mapped", [7973, 953]], [[8086, 8086], "mapped", [7974, 953]], [[8087, 8087], "mapped", [7975, 953]], [[8088, 8088], "mapped", [7968, 953]], [[8089, 8089], "mapped", [7969, 953]], [[8090, 8090], "mapped", [7970, 953]], [[8091, 8091], "mapped", [7971, 953]], [[8092, 8092], "mapped", [7972, 953]], [[8093, 8093], "mapped", [7973, 953]], [[8094, 8094], "mapped", [7974, 953]], [[8095, 8095], "mapped", [7975, 953]], [[8096, 8096], "mapped", [8032, 953]], [[8097, 8097], "mapped", [8033, 953]], [[8098, 8098], "mapped", [8034, 953]], [[8099, 8099], "mapped", [8035, 953]], [[8100, 8100], "mapped", [8036, 953]], [[8101, 8101], "mapped", [8037, 953]], [[8102, 8102], "mapped", [8038, 953]], [[8103, 8103], "mapped", [8039, 953]], [[8104, 8104], "mapped", [8032, 953]], [[8105, 8105], "mapped", [8033, 953]], [[8106, 8106], "mapped", [8034, 953]], [[8107, 8107], "mapped", [8035, 953]], [[8108, 8108], "mapped", [8036, 953]], [[8109, 8109], "mapped", [8037, 953]], [[8110, 8110], "mapped", [8038, 953]], [[8111, 8111], "mapped", [8039, 953]], [[8112, 8113], "valid"], [[8114, 8114], "mapped", [8048, 953]], [[8115, 8115], "mapped", [945, 953]], [[8116, 8116], "mapped", [940, 953]], [[8117, 8117], "disallowed"], [[8118, 8118], "valid"], [[8119, 8119], "mapped", [8118, 953]], [[8120, 8120], "mapped", [8112]], [[8121, 8121], "mapped", [8113]], [[8122, 8122], "mapped", [8048]], [[8123, 8123], "mapped", [940]], [[8124, 8124], "mapped", [945, 953]], [[8125, 8125], "disallowed_STD3_mapped", [32, 787]], [[8126, 8126], "mapped", [953]], [[8127, 8127], "disallowed_STD3_mapped", [32, 787]], [[8128, 8128], "disallowed_STD3_mapped", [32, 834]], [[8129, 8129], "disallowed_STD3_mapped", [32, 776, 834]], [[8130, 8130], "mapped", [8052, 953]], [[8131, 8131], "mapped", [951, 953]], [[8132, 8132], "mapped", [942, 953]], [[8133, 8133], "disallowed"], [[8134, 8134], "valid"], [[8135, 8135], "mapped", [8134, 953]], [[8136, 8136], "mapped", [8050]], [[8137, 8137], "mapped", [941]], [[8138, 8138], "mapped", [8052]], [[8139, 8139], "mapped", [942]], [[8140, 8140], "mapped", [951, 953]], [[8141, 8141], "disallowed_STD3_mapped", [32, 787, 768]], [[8142, 8142], "disallowed_STD3_mapped", [32, 787, 769]], [[8143, 8143], "disallowed_STD3_mapped", [32, 787, 834]], [[8144, 8146], "valid"], [[8147, 8147], "mapped", [912]], [[8148, 8149], "disallowed"], [[8150, 8151], "valid"], [[8152, 8152], "mapped", [8144]], [[8153, 8153], "mapped", [8145]], [[8154, 8154], "mapped", [8054]], [[8155, 8155], "mapped", [943]], [[8156, 8156], "disallowed"], [[8157, 8157], "disallowed_STD3_mapped", [32, 788, 768]], [[8158, 8158], "disallowed_STD3_mapped", [32, 788, 769]], [[8159, 8159], "disallowed_STD3_mapped", [32, 788, 834]], [[8160, 8162], "valid"], [[8163, 8163], "mapped", [944]], [[8164, 8167], "valid"], [[8168, 8168], "mapped", [8160]], [[8169, 8169], "mapped", [8161]], [[8170, 8170], "mapped", [8058]], [[8171, 8171], "mapped", [973]], [[8172, 8172], "mapped", [8165]], [[8173, 8173], "disallowed_STD3_mapped", [32, 776, 768]], [[8174, 8174], "disallowed_STD3_mapped", [32, 776, 769]], [[8175, 8175], "disallowed_STD3_mapped", [96]], [[8176, 8177], "disallowed"], [[8178, 8178], "mapped", [8060, 953]], [[8179, 8179], "mapped", [969, 953]], [[8180, 8180], "mapped", [974, 953]], [[8181, 8181], "disallowed"], [[8182, 8182], "valid"], [[8183, 8183], "mapped", [8182, 953]], [[8184, 8184], "mapped", [8056]], [[8185, 8185], "mapped", [972]], [[8186, 8186], "mapped", [8060]], [[8187, 8187], "mapped", [974]], [[8188, 8188], "mapped", [969, 953]], [[8189, 8189], "disallowed_STD3_mapped", [32, 769]], [[8190, 8190], "disallowed_STD3_mapped", [32, 788]], [[8191, 8191], "disallowed"], [[8192, 8202], "disallowed_STD3_mapped", [32]], [[8203, 8203], "ignored"], [[8204, 8205], "deviation", []], [[8206, 8207], "disallowed"], [[8208, 8208], "valid", [], "NV8"], [[8209, 8209], "mapped", [8208]], [[8210, 8214], "valid", [], "NV8"], [[8215, 8215], "disallowed_STD3_mapped", [32, 819]], [[8216, 8227], "valid", [], "NV8"], [[8228, 8230], "disallowed"], [[8231, 8231], "valid", [], "NV8"], [[8232, 8238], "disallowed"], [[8239, 8239], "disallowed_STD3_mapped", [32]], [[8240, 8242], "valid", [], "NV8"], [[8243, 8243], "mapped", [8242, 8242]], [[8244, 8244], "mapped", [8242, 8242, 8242]], [[8245, 8245], "valid", [], "NV8"], [[8246, 8246], "mapped", [8245, 8245]], [[8247, 8247], "mapped", [8245, 8245, 8245]], [[8248, 8251], "valid", [], "NV8"], [[8252, 8252], "disallowed_STD3_mapped", [33, 33]], [[8253, 8253], "valid", [], "NV8"], [[8254, 8254], "disallowed_STD3_mapped", [32, 773]], [[8255, 8262], "valid", [], "NV8"], [[8263, 8263], "disallowed_STD3_mapped", [63, 63]], [[8264, 8264], "disallowed_STD3_mapped", [63, 33]], [[8265, 8265], "disallowed_STD3_mapped", [33, 63]], [[8266, 8269], "valid", [], "NV8"], [[8270, 8274], "valid", [], "NV8"], [[8275, 8276], "valid", [], "NV8"], [[8277, 8278], "valid", [], "NV8"], [[8279, 8279], "mapped", [8242, 8242, 8242, 8242]], [[8280, 8286], "valid", [], "NV8"], [[8287, 8287], "disallowed_STD3_mapped", [32]], [[8288, 8288], "ignored"], [[8289, 8291], "disallowed"], [[8292, 8292], "ignored"], [[8293, 8293], "disallowed"], [[8294, 8297], "disallowed"], [[8298, 8303], "disallowed"], [[8304, 8304], "mapped", [48]], [[8305, 8305], "mapped", [105]], [[8306, 8307], "disallowed"], [[8308, 8308], "mapped", [52]], [[8309, 8309], "mapped", [53]], [[8310, 8310], "mapped", [54]], [[8311, 8311], "mapped", [55]], [[8312, 8312], "mapped", [56]], [[8313, 8313], "mapped", [57]], [[8314, 8314], "disallowed_STD3_mapped", [43]], [[8315, 8315], "mapped", [8722]], [[8316, 8316], "disallowed_STD3_mapped", [61]], [[8317, 8317], "disallowed_STD3_mapped", [40]], [[8318, 8318], "disallowed_STD3_mapped", [41]], [[8319, 8319], "mapped", [110]], [[8320, 8320], "mapped", [48]], [[8321, 8321], "mapped", [49]], [[8322, 8322], "mapped", [50]], [[8323, 8323], "mapped", [51]], [[8324, 8324], "mapped", [52]], [[8325, 8325], "mapped", [53]], [[8326, 8326], "mapped", [54]], [[8327, 8327], "mapped", [55]], [[8328, 8328], "mapped", [56]], [[8329, 8329], "mapped", [57]], [[8330, 8330], "disallowed_STD3_mapped", [43]], [[8331, 8331], "mapped", [8722]], [[8332, 8332], "disallowed_STD3_mapped", [61]], [[8333, 8333], "disallowed_STD3_mapped", [40]], [[8334, 8334], "disallowed_STD3_mapped", [41]], [[8335, 8335], "disallowed"], [[8336, 8336], "mapped", [97]], [[8337, 8337], "mapped", [101]], [[8338, 8338], "mapped", [111]], [[8339, 8339], "mapped", [120]], [[8340, 8340], "mapped", [601]], [[8341, 8341], "mapped", [104]], [[8342, 8342], "mapped", [107]], [[8343, 8343], "mapped", [108]], [[8344, 8344], "mapped", [109]], [[8345, 8345], "mapped", [110]], [[8346, 8346], "mapped", [112]], [[8347, 8347], "mapped", [115]], [[8348, 8348], "mapped", [116]], [[8349, 8351], "disallowed"], [[8352, 8359], "valid", [], "NV8"], [[8360, 8360], "mapped", [114, 115]], [[8361, 8362], "valid", [], "NV8"], [[8363, 8363], "valid", [], "NV8"], [[8364, 8364], "valid", [], "NV8"], [[8365, 8367], "valid", [], "NV8"], [[8368, 8369], "valid", [], "NV8"], [[8370, 8373], "valid", [], "NV8"], [[8374, 8376], "valid", [], "NV8"], [[8377, 8377], "valid", [], "NV8"], [[8378, 8378], "valid", [], "NV8"], [[8379, 8381], "valid", [], "NV8"], [[8382, 8382], "valid", [], "NV8"], [[8383, 8399], "disallowed"], [[8400, 8417], "valid", [], "NV8"], [[8418, 8419], "valid", [], "NV8"], [[8420, 8426], "valid", [], "NV8"], [[8427, 8427], "valid", [], "NV8"], [[8428, 8431], "valid", [], "NV8"], [[8432, 8432], "valid", [], "NV8"], [[8433, 8447], "disallowed"], [[8448, 8448], "disallowed_STD3_mapped", [97, 47, 99]], [[8449, 8449], "disallowed_STD3_mapped", [97, 47, 115]], [[8450, 8450], "mapped", [99]], [[8451, 8451], "mapped", [176, 99]], [[8452, 8452], "valid", [], "NV8"], [[8453, 8453], "disallowed_STD3_mapped", [99, 47, 111]], [[8454, 8454], "disallowed_STD3_mapped", [99, 47, 117]], [[8455, 8455], "mapped", [603]], [[8456, 8456], "valid", [], "NV8"], [[8457, 8457], "mapped", [176, 102]], [[8458, 8458], "mapped", [103]], [[8459, 8462], "mapped", [104]], [[8463, 8463], "mapped", [295]], [[8464, 8465], "mapped", [105]], [[8466, 8467], "mapped", [108]], [[8468, 8468], "valid", [], "NV8"], [[8469, 8469], "mapped", [110]], [[8470, 8470], "mapped", [110, 111]], [[8471, 8472], "valid", [], "NV8"], [[8473, 8473], "mapped", [112]], [[8474, 8474], "mapped", [113]], [[8475, 8477], "mapped", [114]], [[8478, 8479], "valid", [], "NV8"], [[8480, 8480], "mapped", [115, 109]], [[8481, 8481], "mapped", [116, 101, 108]], [[8482, 8482], "mapped", [116, 109]], [[8483, 8483], "valid", [], "NV8"], [[8484, 8484], "mapped", [122]], [[8485, 8485], "valid", [], "NV8"], [[8486, 8486], "mapped", [969]], [[8487, 8487], "valid", [], "NV8"], [[8488, 8488], "mapped", [122]], [[8489, 8489], "valid", [], "NV8"], [[8490, 8490], "mapped", [107]], [[8491, 8491], "mapped", [229]], [[8492, 8492], "mapped", [98]], [[8493, 8493], "mapped", [99]], [[8494, 8494], "valid", [], "NV8"], [[8495, 8496], "mapped", [101]], [[8497, 8497], "mapped", [102]], [[8498, 8498], "disallowed"], [[8499, 8499], "mapped", [109]], [[8500, 8500], "mapped", [111]], [[8501, 8501], "mapped", [1488]], [[8502, 8502], "mapped", [1489]], [[8503, 8503], "mapped", [1490]], [[8504, 8504], "mapped", [1491]], [[8505, 8505], "mapped", [105]], [[8506, 8506], "valid", [], "NV8"], [[8507, 8507], "mapped", [102, 97, 120]], [[8508, 8508], "mapped", [960]], [[8509, 8510], "mapped", [947]], [[8511, 8511], "mapped", [960]], [[8512, 8512], "mapped", [8721]], [[8513, 8516], "valid", [], "NV8"], [[8517, 8518], "mapped", [100]], [[8519, 8519], "mapped", [101]], [[8520, 8520], "mapped", [105]], [[8521, 8521], "mapped", [106]], [[8522, 8523], "valid", [], "NV8"], [[8524, 8524], "valid", [], "NV8"], [[8525, 8525], "valid", [], "NV8"], [[8526, 8526], "valid"], [[8527, 8527], "valid", [], "NV8"], [[8528, 8528], "mapped", [49, 8260, 55]], [[8529, 8529], "mapped", [49, 8260, 57]], [[8530, 8530], "mapped", [49, 8260, 49, 48]], [[8531, 8531], "mapped", [49, 8260, 51]], [[8532, 8532], "mapped", [50, 8260, 51]], [[8533, 8533], "mapped", [49, 8260, 53]], [[8534, 8534], "mapped", [50, 8260, 53]], [[8535, 8535], "mapped", [51, 8260, 53]], [[8536, 8536], "mapped", [52, 8260, 53]], [[8537, 8537], "mapped", [49, 8260, 54]], [[8538, 8538], "mapped", [53, 8260, 54]], [[8539, 8539], "mapped", [49, 8260, 56]], [[8540, 8540], "mapped", [51, 8260, 56]], [[8541, 8541], "mapped", [53, 8260, 56]], [[8542, 8542], "mapped", [55, 8260, 56]], [[8543, 8543], "mapped", [49, 8260]], [[8544, 8544], "mapped", [105]], [[8545, 8545], "mapped", [105, 105]], [[8546, 8546], "mapped", [105, 105, 105]], [[8547, 8547], "mapped", [105, 118]], [[8548, 8548], "mapped", [118]], [[8549, 8549], "mapped", [118, 105]], [[8550, 8550], "mapped", [118, 105, 105]], [[8551, 8551], "mapped", [118, 105, 105, 105]], [[8552, 8552], "mapped", [105, 120]], [[8553, 8553], "mapped", [120]], [[8554, 8554], "mapped", [120, 105]], [[8555, 8555], "mapped", [120, 105, 105]], [[8556, 8556], "mapped", [108]], [[8557, 8557], "mapped", [99]], [[8558, 8558], "mapped", [100]], [[8559, 8559], "mapped", [109]], [[8560, 8560], "mapped", [105]], [[8561, 8561], "mapped", [105, 105]], [[8562, 8562], "mapped", [105, 105, 105]], [[8563, 8563], "mapped", [105, 118]], [[8564, 8564], "mapped", [118]], [[8565, 8565], "mapped", [118, 105]], [[8566, 8566], "mapped", [118, 105, 105]], [[8567, 8567], "mapped", [118, 105, 105, 105]], [[8568, 8568], "mapped", [105, 120]], [[8569, 8569], "mapped", [120]], [[8570, 8570], "mapped", [120, 105]], [[8571, 8571], "mapped", [120, 105, 105]], [[8572, 8572], "mapped", [108]], [[8573, 8573], "mapped", [99]], [[8574, 8574], "mapped", [100]], [[8575, 8575], "mapped", [109]], [[8576, 8578], "valid", [], "NV8"], [[8579, 8579], "disallowed"], [[8580, 8580], "valid"], [[8581, 8584], "valid", [], "NV8"], [[8585, 8585], "mapped", [48, 8260, 51]], [[8586, 8587], "valid", [], "NV8"], [[8588, 8591], "disallowed"], [[8592, 8682], "valid", [], "NV8"], [[8683, 8691], "valid", [], "NV8"], [[8692, 8703], "valid", [], "NV8"], [[8704, 8747], "valid", [], "NV8"], [[8748, 8748], "mapped", [8747, 8747]], [[8749, 8749], "mapped", [8747, 8747, 8747]], [[8750, 8750], "valid", [], "NV8"], [[8751, 8751], "mapped", [8750, 8750]], [[8752, 8752], "mapped", [8750, 8750, 8750]], [[8753, 8799], "valid", [], "NV8"], [[8800, 8800], "disallowed_STD3_valid"], [[8801, 8813], "valid", [], "NV8"], [[8814, 8815], "disallowed_STD3_valid"], [[8816, 8945], "valid", [], "NV8"], [[8946, 8959], "valid", [], "NV8"], [[8960, 8960], "valid", [], "NV8"], [[8961, 8961], "valid", [], "NV8"], [[8962, 9e3], "valid", [], "NV8"], [[9001, 9001], "mapped", [12296]], [[9002, 9002], "mapped", [12297]], [[9003, 9082], "valid", [], "NV8"], [[9083, 9083], "valid", [], "NV8"], [[9084, 9084], "valid", [], "NV8"], [[9085, 9114], "valid", [], "NV8"], [[9115, 9166], "valid", [], "NV8"], [[9167, 9168], "valid", [], "NV8"], [[9169, 9179], "valid", [], "NV8"], [[9180, 9191], "valid", [], "NV8"], [[9192, 9192], "valid", [], "NV8"], [[9193, 9203], "valid", [], "NV8"], [[9204, 9210], "valid", [], "NV8"], [[9211, 9215], "disallowed"], [[9216, 9252], "valid", [], "NV8"], [[9253, 9254], "valid", [], "NV8"], [[9255, 9279], "disallowed"], [[9280, 9290], "valid", [], "NV8"], [[9291, 9311], "disallowed"], [[9312, 9312], "mapped", [49]], [[9313, 9313], "mapped", [50]], [[9314, 9314], "mapped", [51]], [[9315, 9315], "mapped", [52]], [[9316, 9316], "mapped", [53]], [[9317, 9317], "mapped", [54]], [[9318, 9318], "mapped", [55]], [[9319, 9319], "mapped", [56]], [[9320, 9320], "mapped", [57]], [[9321, 9321], "mapped", [49, 48]], [[9322, 9322], "mapped", [49, 49]], [[9323, 9323], "mapped", [49, 50]], [[9324, 9324], "mapped", [49, 51]], [[9325, 9325], "mapped", [49, 52]], [[9326, 9326], "mapped", [49, 53]], [[9327, 9327], "mapped", [49, 54]], [[9328, 9328], "mapped", [49, 55]], [[9329, 9329], "mapped", [49, 56]], [[9330, 9330], "mapped", [49, 57]], [[9331, 9331], "mapped", [50, 48]], [[9332, 9332], "disallowed_STD3_mapped", [40, 49, 41]], [[9333, 9333], "disallowed_STD3_mapped", [40, 50, 41]], [[9334, 9334], "disallowed_STD3_mapped", [40, 51, 41]], [[9335, 9335], "disallowed_STD3_mapped", [40, 52, 41]], [[9336, 9336], "disallowed_STD3_mapped", [40, 53, 41]], [[9337, 9337], "disallowed_STD3_mapped", [40, 54, 41]], [[9338, 9338], "disallowed_STD3_mapped", [40, 55, 41]], [[9339, 9339], "disallowed_STD3_mapped", [40, 56, 41]], [[9340, 9340], "disallowed_STD3_mapped", [40, 57, 41]], [[9341, 9341], "disallowed_STD3_mapped", [40, 49, 48, 41]], [[9342, 9342], "disallowed_STD3_mapped", [40, 49, 49, 41]], [[9343, 9343], "disallowed_STD3_mapped", [40, 49, 50, 41]], [[9344, 9344], "disallowed_STD3_mapped", [40, 49, 51, 41]], [[9345, 9345], "disallowed_STD3_mapped", [40, 49, 52, 41]], [[9346, 9346], "disallowed_STD3_mapped", [40, 49, 53, 41]], [[9347, 9347], "disallowed_STD3_mapped", [40, 49, 54, 41]], [[9348, 9348], "disallowed_STD3_mapped", [40, 49, 55, 41]], [[9349, 9349], "disallowed_STD3_mapped", [40, 49, 56, 41]], [[9350, 9350], "disallowed_STD3_mapped", [40, 49, 57, 41]], [[9351, 9351], "disallowed_STD3_mapped", [40, 50, 48, 41]], [[9352, 9371], "disallowed"], [[9372, 9372], "disallowed_STD3_mapped", [40, 97, 41]], [[9373, 9373], "disallowed_STD3_mapped", [40, 98, 41]], [[9374, 9374], "disallowed_STD3_mapped", [40, 99, 41]], [[9375, 9375], "disallowed_STD3_mapped", [40, 100, 41]], [[9376, 9376], "disallowed_STD3_mapped", [40, 101, 41]], [[9377, 9377], "disallowed_STD3_mapped", [40, 102, 41]], [[9378, 9378], "disallowed_STD3_mapped", [40, 103, 41]], [[9379, 9379], "disallowed_STD3_mapped", [40, 104, 41]], [[9380, 9380], "disallowed_STD3_mapped", [40, 105, 41]], [[9381, 9381], "disallowed_STD3_mapped", [40, 106, 41]], [[9382, 9382], "disallowed_STD3_mapped", [40, 107, 41]], [[9383, 9383], "disallowed_STD3_mapped", [40, 108, 41]], [[9384, 9384], "disallowed_STD3_mapped", [40, 109, 41]], [[9385, 9385], "disallowed_STD3_mapped", [40, 110, 41]], [[9386, 9386], "disallowed_STD3_mapped", [40, 111, 41]], [[9387, 9387], "disallowed_STD3_mapped", [40, 112, 41]], [[9388, 9388], "disallowed_STD3_mapped", [40, 113, 41]], [[9389, 9389], "disallowed_STD3_mapped", [40, 114, 41]], [[9390, 9390], "disallowed_STD3_mapped", [40, 115, 41]], [[9391, 9391], "disallowed_STD3_mapped", [40, 116, 41]], [[9392, 9392], "disallowed_STD3_mapped", [40, 117, 41]], [[9393, 9393], "disallowed_STD3_mapped", [40, 118, 41]], [[9394, 9394], "disallowed_STD3_mapped", [40, 119, 41]], [[9395, 9395], "disallowed_STD3_mapped", [40, 120, 41]], [[9396, 9396], "disallowed_STD3_mapped", [40, 121, 41]], [[9397, 9397], "disallowed_STD3_mapped", [40, 122, 41]], [[9398, 9398], "mapped", [97]], [[9399, 9399], "mapped", [98]], [[9400, 9400], "mapped", [99]], [[9401, 9401], "mapped", [100]], [[9402, 9402], "mapped", [101]], [[9403, 9403], "mapped", [102]], [[9404, 9404], "mapped", [103]], [[9405, 9405], "mapped", [104]], [[9406, 9406], "mapped", [105]], [[9407, 9407], "mapped", [106]], [[9408, 9408], "mapped", [107]], [[9409, 9409], "mapped", [108]], [[9410, 9410], "mapped", [109]], [[9411, 9411], "mapped", [110]], [[9412, 9412], "mapped", [111]], [[9413, 9413], "mapped", [112]], [[9414, 9414], "mapped", [113]], [[9415, 9415], "mapped", [114]], [[9416, 9416], "mapped", [115]], [[9417, 9417], "mapped", [116]], [[9418, 9418], "mapped", [117]], [[9419, 9419], "mapped", [118]], [[9420, 9420], "mapped", [119]], [[9421, 9421], "mapped", [120]], [[9422, 9422], "mapped", [121]], [[9423, 9423], "mapped", [122]], [[9424, 9424], "mapped", [97]], [[9425, 9425], "mapped", [98]], [[9426, 9426], "mapped", [99]], [[9427, 9427], "mapped", [100]], [[9428, 9428], "mapped", [101]], [[9429, 9429], "mapped", [102]], [[9430, 9430], "mapped", [103]], [[9431, 9431], "mapped", [104]], [[9432, 9432], "mapped", [105]], [[9433, 9433], "mapped", [106]], [[9434, 9434], "mapped", [107]], [[9435, 9435], "mapped", [108]], [[9436, 9436], "mapped", [109]], [[9437, 9437], "mapped", [110]], [[9438, 9438], "mapped", [111]], [[9439, 9439], "mapped", [112]], [[9440, 9440], "mapped", [113]], [[9441, 9441], "mapped", [114]], [[9442, 9442], "mapped", [115]], [[9443, 9443], "mapped", [116]], [[9444, 9444], "mapped", [117]], [[9445, 9445], "mapped", [118]], [[9446, 9446], "mapped", [119]], [[9447, 9447], "mapped", [120]], [[9448, 9448], "mapped", [121]], [[9449, 9449], "mapped", [122]], [[9450, 9450], "mapped", [48]], [[9451, 9470], "valid", [], "NV8"], [[9471, 9471], "valid", [], "NV8"], [[9472, 9621], "valid", [], "NV8"], [[9622, 9631], "valid", [], "NV8"], [[9632, 9711], "valid", [], "NV8"], [[9712, 9719], "valid", [], "NV8"], [[9720, 9727], "valid", [], "NV8"], [[9728, 9747], "valid", [], "NV8"], [[9748, 9749], "valid", [], "NV8"], [[9750, 9751], "valid", [], "NV8"], [[9752, 9752], "valid", [], "NV8"], [[9753, 9753], "valid", [], "NV8"], [[9754, 9839], "valid", [], "NV8"], [[9840, 9841], "valid", [], "NV8"], [[9842, 9853], "valid", [], "NV8"], [[9854, 9855], "valid", [], "NV8"], [[9856, 9865], "valid", [], "NV8"], [[9866, 9873], "valid", [], "NV8"], [[9874, 9884], "valid", [], "NV8"], [[9885, 9885], "valid", [], "NV8"], [[9886, 9887], "valid", [], "NV8"], [[9888, 9889], "valid", [], "NV8"], [[9890, 9905], "valid", [], "NV8"], [[9906, 9906], "valid", [], "NV8"], [[9907, 9916], "valid", [], "NV8"], [[9917, 9919], "valid", [], "NV8"], [[9920, 9923], "valid", [], "NV8"], [[9924, 9933], "valid", [], "NV8"], [[9934, 9934], "valid", [], "NV8"], [[9935, 9953], "valid", [], "NV8"], [[9954, 9954], "valid", [], "NV8"], [[9955, 9955], "valid", [], "NV8"], [[9956, 9959], "valid", [], "NV8"], [[9960, 9983], "valid", [], "NV8"], [[9984, 9984], "valid", [], "NV8"], [[9985, 9988], "valid", [], "NV8"], [[9989, 9989], "valid", [], "NV8"], [[9990, 9993], "valid", [], "NV8"], [[9994, 9995], "valid", [], "NV8"], [[9996, 10023], "valid", [], "NV8"], [[10024, 10024], "valid", [], "NV8"], [[10025, 10059], "valid", [], "NV8"], [[10060, 10060], "valid", [], "NV8"], [[10061, 10061], "valid", [], "NV8"], [[10062, 10062], "valid", [], "NV8"], [[10063, 10066], "valid", [], "NV8"], [[10067, 10069], "valid", [], "NV8"], [[10070, 10070], "valid", [], "NV8"], [[10071, 10071], "valid", [], "NV8"], [[10072, 10078], "valid", [], "NV8"], [[10079, 10080], "valid", [], "NV8"], [[10081, 10087], "valid", [], "NV8"], [[10088, 10101], "valid", [], "NV8"], [[10102, 10132], "valid", [], "NV8"], [[10133, 10135], "valid", [], "NV8"], [[10136, 10159], "valid", [], "NV8"], [[10160, 10160], "valid", [], "NV8"], [[10161, 10174], "valid", [], "NV8"], [[10175, 10175], "valid", [], "NV8"], [[10176, 10182], "valid", [], "NV8"], [[10183, 10186], "valid", [], "NV8"], [[10187, 10187], "valid", [], "NV8"], [[10188, 10188], "valid", [], "NV8"], [[10189, 10189], "valid", [], "NV8"], [[10190, 10191], "valid", [], "NV8"], [[10192, 10219], "valid", [], "NV8"], [[10220, 10223], "valid", [], "NV8"], [[10224, 10239], "valid", [], "NV8"], [[10240, 10495], "valid", [], "NV8"], [[10496, 10763], "valid", [], "NV8"], [[10764, 10764], "mapped", [8747, 8747, 8747, 8747]], [[10765, 10867], "valid", [], "NV8"], [[10868, 10868], "disallowed_STD3_mapped", [58, 58, 61]], [[10869, 10869], "disallowed_STD3_mapped", [61, 61]], [[10870, 10870], "disallowed_STD3_mapped", [61, 61, 61]], [[10871, 10971], "valid", [], "NV8"], [[10972, 10972], "mapped", [10973, 824]], [[10973, 11007], "valid", [], "NV8"], [[11008, 11021], "valid", [], "NV8"], [[11022, 11027], "valid", [], "NV8"], [[11028, 11034], "valid", [], "NV8"], [[11035, 11039], "valid", [], "NV8"], [[11040, 11043], "valid", [], "NV8"], [[11044, 11084], "valid", [], "NV8"], [[11085, 11087], "valid", [], "NV8"], [[11088, 11092], "valid", [], "NV8"], [[11093, 11097], "valid", [], "NV8"], [[11098, 11123], "valid", [], "NV8"], [[11124, 11125], "disallowed"], [[11126, 11157], "valid", [], "NV8"], [[11158, 11159], "disallowed"], [[11160, 11193], "valid", [], "NV8"], [[11194, 11196], "disallowed"], [[11197, 11208], "valid", [], "NV8"], [[11209, 11209], "disallowed"], [[11210, 11217], "valid", [], "NV8"], [[11218, 11243], "disallowed"], [[11244, 11247], "valid", [], "NV8"], [[11248, 11263], "disallowed"], [[11264, 11264], "mapped", [11312]], [[11265, 11265], "mapped", [11313]], [[11266, 11266], "mapped", [11314]], [[11267, 11267], "mapped", [11315]], [[11268, 11268], "mapped", [11316]], [[11269, 11269], "mapped", [11317]], [[11270, 11270], "mapped", [11318]], [[11271, 11271], "mapped", [11319]], [[11272, 11272], "mapped", [11320]], [[11273, 11273], "mapped", [11321]], [[11274, 11274], "mapped", [11322]], [[11275, 11275], "mapped", [11323]], [[11276, 11276], "mapped", [11324]], [[11277, 11277], "mapped", [11325]], [[11278, 11278], "mapped", [11326]], [[11279, 11279], "mapped", [11327]], [[11280, 11280], "mapped", [11328]], [[11281, 11281], "mapped", [11329]], [[11282, 11282], "mapped", [11330]], [[11283, 11283], "mapped", [11331]], [[11284, 11284], "mapped", [11332]], [[11285, 11285], "mapped", [11333]], [[11286, 11286], "mapped", [11334]], [[11287, 11287], "mapped", [11335]], [[11288, 11288], "mapped", [11336]], [[11289, 11289], "mapped", [11337]], [[11290, 11290], "mapped", [11338]], [[11291, 11291], "mapped", [11339]], [[11292, 11292], "mapped", [11340]], [[11293, 11293], "mapped", [11341]], [[11294, 11294], "mapped", [11342]], [[11295, 11295], "mapped", [11343]], [[11296, 11296], "mapped", [11344]], [[11297, 11297], "mapped", [11345]], [[11298, 11298], "mapped", [11346]], [[11299, 11299], "mapped", [11347]], [[11300, 11300], "mapped", [11348]], [[11301, 11301], "mapped", [11349]], [[11302, 11302], "mapped", [11350]], [[11303, 11303], "mapped", [11351]], [[11304, 11304], "mapped", [11352]], [[11305, 11305], "mapped", [11353]], [[11306, 11306], "mapped", [11354]], [[11307, 11307], "mapped", [11355]], [[11308, 11308], "mapped", [11356]], [[11309, 11309], "mapped", [11357]], [[11310, 11310], "mapped", [11358]], [[11311, 11311], "disallowed"], [[11312, 11358], "valid"], [[11359, 11359], "disallowed"], [[11360, 11360], "mapped", [11361]], [[11361, 11361], "valid"], [[11362, 11362], "mapped", [619]], [[11363, 11363], "mapped", [7549]], [[11364, 11364], "mapped", [637]], [[11365, 11366], "valid"], [[11367, 11367], "mapped", [11368]], [[11368, 11368], "valid"], [[11369, 11369], "mapped", [11370]], [[11370, 11370], "valid"], [[11371, 11371], "mapped", [11372]], [[11372, 11372], "valid"], [[11373, 11373], "mapped", [593]], [[11374, 11374], "mapped", [625]], [[11375, 11375], "mapped", [592]], [[11376, 11376], "mapped", [594]], [[11377, 11377], "valid"], [[11378, 11378], "mapped", [11379]], [[11379, 11379], "valid"], [[11380, 11380], "valid"], [[11381, 11381], "mapped", [11382]], [[11382, 11383], "valid"], [[11384, 11387], "valid"], [[11388, 11388], "mapped", [106]], [[11389, 11389], "mapped", [118]], [[11390, 11390], "mapped", [575]], [[11391, 11391], "mapped", [576]], [[11392, 11392], "mapped", [11393]], [[11393, 11393], "valid"], [[11394, 11394], "mapped", [11395]], [[11395, 11395], "valid"], [[11396, 11396], "mapped", [11397]], [[11397, 11397], "valid"], [[11398, 11398], "mapped", [11399]], [[11399, 11399], "valid"], [[11400, 11400], "mapped", [11401]], [[11401, 11401], "valid"], [[11402, 11402], "mapped", [11403]], [[11403, 11403], "valid"], [[11404, 11404], "mapped", [11405]], [[11405, 11405], "valid"], [[11406, 11406], "mapped", [11407]], [[11407, 11407], "valid"], [[11408, 11408], "mapped", [11409]], [[11409, 11409], "valid"], [[11410, 11410], "mapped", [11411]], [[11411, 11411], "valid"], [[11412, 11412], "mapped", [11413]], [[11413, 11413], "valid"], [[11414, 11414], "mapped", [11415]], [[11415, 11415], "valid"], [[11416, 11416], "mapped", [11417]], [[11417, 11417], "valid"], [[11418, 11418], "mapped", [11419]], [[11419, 11419], "valid"], [[11420, 11420], "mapped", [11421]], [[11421, 11421], "valid"], [[11422, 11422], "mapped", [11423]], [[11423, 11423], "valid"], [[11424, 11424], "mapped", [11425]], [[11425, 11425], "valid"], [[11426, 11426], "mapped", [11427]], [[11427, 11427], "valid"], [[11428, 11428], "mapped", [11429]], [[11429, 11429], "valid"], [[11430, 11430], "mapped", [11431]], [[11431, 11431], "valid"], [[11432, 11432], "mapped", [11433]], [[11433, 11433], "valid"], [[11434, 11434], "mapped", [11435]], [[11435, 11435], "valid"], [[11436, 11436], "mapped", [11437]], [[11437, 11437], "valid"], [[11438, 11438], "mapped", [11439]], [[11439, 11439], "valid"], [[11440, 11440], "mapped", [11441]], [[11441, 11441], "valid"], [[11442, 11442], "mapped", [11443]], [[11443, 11443], "valid"], [[11444, 11444], "mapped", [11445]], [[11445, 11445], "valid"], [[11446, 11446], "mapped", [11447]], [[11447, 11447], "valid"], [[11448, 11448], "mapped", [11449]], [[11449, 11449], "valid"], [[11450, 11450], "mapped", [11451]], [[11451, 11451], "valid"], [[11452, 11452], "mapped", [11453]], [[11453, 11453], "valid"], [[11454, 11454], "mapped", [11455]], [[11455, 11455], "valid"], [[11456, 11456], "mapped", [11457]], [[11457, 11457], "valid"], [[11458, 11458], "mapped", [11459]], [[11459, 11459], "valid"], [[11460, 11460], "mapped", [11461]], [[11461, 11461], "valid"], [[11462, 11462], "mapped", [11463]], [[11463, 11463], "valid"], [[11464, 11464], "mapped", [11465]], [[11465, 11465], "valid"], [[11466, 11466], "mapped", [11467]], [[11467, 11467], "valid"], [[11468, 11468], "mapped", [11469]], [[11469, 11469], "valid"], [[11470, 11470], "mapped", [11471]], [[11471, 11471], "valid"], [[11472, 11472], "mapped", [11473]], [[11473, 11473], "valid"], [[11474, 11474], "mapped", [11475]], [[11475, 11475], "valid"], [[11476, 11476], "mapped", [11477]], [[11477, 11477], "valid"], [[11478, 11478], "mapped", [11479]], [[11479, 11479], "valid"], [[11480, 11480], "mapped", [11481]], [[11481, 11481], "valid"], [[11482, 11482], "mapped", [11483]], [[11483, 11483], "valid"], [[11484, 11484], "mapped", [11485]], [[11485, 11485], "valid"], [[11486, 11486], "mapped", [11487]], [[11487, 11487], "valid"], [[11488, 11488], "mapped", [11489]], [[11489, 11489], "valid"], [[11490, 11490], "mapped", [11491]], [[11491, 11492], "valid"], [[11493, 11498], "valid", [], "NV8"], [[11499, 11499], "mapped", [11500]], [[11500, 11500], "valid"], [[11501, 11501], "mapped", [11502]], [[11502, 11505], "valid"], [[11506, 11506], "mapped", [11507]], [[11507, 11507], "valid"], [[11508, 11512], "disallowed"], [[11513, 11519], "valid", [], "NV8"], [[11520, 11557], "valid"], [[11558, 11558], "disallowed"], [[11559, 11559], "valid"], [[11560, 11564], "disallowed"], [[11565, 11565], "valid"], [[11566, 11567], "disallowed"], [[11568, 11621], "valid"], [[11622, 11623], "valid"], [[11624, 11630], "disallowed"], [[11631, 11631], "mapped", [11617]], [[11632, 11632], "valid", [], "NV8"], [[11633, 11646], "disallowed"], [[11647, 11647], "valid"], [[11648, 11670], "valid"], [[11671, 11679], "disallowed"], [[11680, 11686], "valid"], [[11687, 11687], "disallowed"], [[11688, 11694], "valid"], [[11695, 11695], "disallowed"], [[11696, 11702], "valid"], [[11703, 11703], "disallowed"], [[11704, 11710], "valid"], [[11711, 11711], "disallowed"], [[11712, 11718], "valid"], [[11719, 11719], "disallowed"], [[11720, 11726], "valid"], [[11727, 11727], "disallowed"], [[11728, 11734], "valid"], [[11735, 11735], "disallowed"], [[11736, 11742], "valid"], [[11743, 11743], "disallowed"], [[11744, 11775], "valid"], [[11776, 11799], "valid", [], "NV8"], [[11800, 11803], "valid", [], "NV8"], [[11804, 11805], "valid", [], "NV8"], [[11806, 11822], "valid", [], "NV8"], [[11823, 11823], "valid"], [[11824, 11824], "valid", [], "NV8"], [[11825, 11825], "valid", [], "NV8"], [[11826, 11835], "valid", [], "NV8"], [[11836, 11842], "valid", [], "NV8"], [[11843, 11903], "disallowed"], [[11904, 11929], "valid", [], "NV8"], [[11930, 11930], "disallowed"], [[11931, 11934], "valid", [], "NV8"], [[11935, 11935], "mapped", [27597]], [[11936, 12018], "valid", [], "NV8"], [[12019, 12019], "mapped", [40863]], [[12020, 12031], "disallowed"], [[12032, 12032], "mapped", [19968]], [[12033, 12033], "mapped", [20008]], [[12034, 12034], "mapped", [20022]], [[12035, 12035], "mapped", [20031]], [[12036, 12036], "mapped", [20057]], [[12037, 12037], "mapped", [20101]], [[12038, 12038], "mapped", [20108]], [[12039, 12039], "mapped", [20128]], [[12040, 12040], "mapped", [20154]], [[12041, 12041], "mapped", [20799]], [[12042, 12042], "mapped", [20837]], [[12043, 12043], "mapped", [20843]], [[12044, 12044], "mapped", [20866]], [[12045, 12045], "mapped", [20886]], [[12046, 12046], "mapped", [20907]], [[12047, 12047], "mapped", [20960]], [[12048, 12048], "mapped", [20981]], [[12049, 12049], "mapped", [20992]], [[12050, 12050], "mapped", [21147]], [[12051, 12051], "mapped", [21241]], [[12052, 12052], "mapped", [21269]], [[12053, 12053], "mapped", [21274]], [[12054, 12054], "mapped", [21304]], [[12055, 12055], "mapped", [21313]], [[12056, 12056], "mapped", [21340]], [[12057, 12057], "mapped", [21353]], [[12058, 12058], "mapped", [21378]], [[12059, 12059], "mapped", [21430]], [[12060, 12060], "mapped", [21448]], [[12061, 12061], "mapped", [21475]], [[12062, 12062], "mapped", [22231]], [[12063, 12063], "mapped", [22303]], [[12064, 12064], "mapped", [22763]], [[12065, 12065], "mapped", [22786]], [[12066, 12066], "mapped", [22794]], [[12067, 12067], "mapped", [22805]], [[12068, 12068], "mapped", [22823]], [[12069, 12069], "mapped", [22899]], [[12070, 12070], "mapped", [23376]], [[12071, 12071], "mapped", [23424]], [[12072, 12072], "mapped", [23544]], [[12073, 12073], "mapped", [23567]], [[12074, 12074], "mapped", [23586]], [[12075, 12075], "mapped", [23608]], [[12076, 12076], "mapped", [23662]], [[12077, 12077], "mapped", [23665]], [[12078, 12078], "mapped", [24027]], [[12079, 12079], "mapped", [24037]], [[12080, 12080], "mapped", [24049]], [[12081, 12081], "mapped", [24062]], [[12082, 12082], "mapped", [24178]], [[12083, 12083], "mapped", [24186]], [[12084, 12084], "mapped", [24191]], [[12085, 12085], "mapped", [24308]], [[12086, 12086], "mapped", [24318]], [[12087, 12087], "mapped", [24331]], [[12088, 12088], "mapped", [24339]], [[12089, 12089], "mapped", [24400]], [[12090, 12090], "mapped", [24417]], [[12091, 12091], "mapped", [24435]], [[12092, 12092], "mapped", [24515]], [[12093, 12093], "mapped", [25096]], [[12094, 12094], "mapped", [25142]], [[12095, 12095], "mapped", [25163]], [[12096, 12096], "mapped", [25903]], [[12097, 12097], "mapped", [25908]], [[12098, 12098], "mapped", [25991]], [[12099, 12099], "mapped", [26007]], [[12100, 12100], "mapped", [26020]], [[12101, 12101], "mapped", [26041]], [[12102, 12102], "mapped", [26080]], [[12103, 12103], "mapped", [26085]], [[12104, 12104], "mapped", [26352]], [[12105, 12105], "mapped", [26376]], [[12106, 12106], "mapped", [26408]], [[12107, 12107], "mapped", [27424]], [[12108, 12108], "mapped", [27490]], [[12109, 12109], "mapped", [27513]], [[12110, 12110], "mapped", [27571]], [[12111, 12111], "mapped", [27595]], [[12112, 12112], "mapped", [27604]], [[12113, 12113], "mapped", [27611]], [[12114, 12114], "mapped", [27663]], [[12115, 12115], "mapped", [27668]], [[12116, 12116], "mapped", [27700]], [[12117, 12117], "mapped", [28779]], [[12118, 12118], "mapped", [29226]], [[12119, 12119], "mapped", [29238]], [[12120, 12120], "mapped", [29243]], [[12121, 12121], "mapped", [29247]], [[12122, 12122], "mapped", [29255]], [[12123, 12123], "mapped", [29273]], [[12124, 12124], "mapped", [29275]], [[12125, 12125], "mapped", [29356]], [[12126, 12126], "mapped", [29572]], [[12127, 12127], "mapped", [29577]], [[12128, 12128], "mapped", [29916]], [[12129, 12129], "mapped", [29926]], [[12130, 12130], "mapped", [29976]], [[12131, 12131], "mapped", [29983]], [[12132, 12132], "mapped", [29992]], [[12133, 12133], "mapped", [3e4]], [[12134, 12134], "mapped", [30091]], [[12135, 12135], "mapped", [30098]], [[12136, 12136], "mapped", [30326]], [[12137, 12137], "mapped", [30333]], [[12138, 12138], "mapped", [30382]], [[12139, 12139], "mapped", [30399]], [[12140, 12140], "mapped", [30446]], [[12141, 12141], "mapped", [30683]], [[12142, 12142], "mapped", [30690]], [[12143, 12143], "mapped", [30707]], [[12144, 12144], "mapped", [31034]], [[12145, 12145], "mapped", [31160]], [[12146, 12146], "mapped", [31166]], [[12147, 12147], "mapped", [31348]], [[12148, 12148], "mapped", [31435]], [[12149, 12149], "mapped", [31481]], [[12150, 12150], "mapped", [31859]], [[12151, 12151], "mapped", [31992]], [[12152, 12152], "mapped", [32566]], [[12153, 12153], "mapped", [32593]], [[12154, 12154], "mapped", [32650]], [[12155, 12155], "mapped", [32701]], [[12156, 12156], "mapped", [32769]], [[12157, 12157], "mapped", [32780]], [[12158, 12158], "mapped", [32786]], [[12159, 12159], "mapped", [32819]], [[12160, 12160], "mapped", [32895]], [[12161, 12161], "mapped", [32905]], [[12162, 12162], "mapped", [33251]], [[12163, 12163], "mapped", [33258]], [[12164, 12164], "mapped", [33267]], [[12165, 12165], "mapped", [33276]], [[12166, 12166], "mapped", [33292]], [[12167, 12167], "mapped", [33307]], [[12168, 12168], "mapped", [33311]], [[12169, 12169], "mapped", [33390]], [[12170, 12170], "mapped", [33394]], [[12171, 12171], "mapped", [33400]], [[12172, 12172], "mapped", [34381]], [[12173, 12173], "mapped", [34411]], [[12174, 12174], "mapped", [34880]], [[12175, 12175], "mapped", [34892]], [[12176, 12176], "mapped", [34915]], [[12177, 12177], "mapped", [35198]], [[12178, 12178], "mapped", [35211]], [[12179, 12179], "mapped", [35282]], [[12180, 12180], "mapped", [35328]], [[12181, 12181], "mapped", [35895]], [[12182, 12182], "mapped", [35910]], [[12183, 12183], "mapped", [35925]], [[12184, 12184], "mapped", [35960]], [[12185, 12185], "mapped", [35997]], [[12186, 12186], "mapped", [36196]], [[12187, 12187], "mapped", [36208]], [[12188, 12188], "mapped", [36275]], [[12189, 12189], "mapped", [36523]], [[12190, 12190], "mapped", [36554]], [[12191, 12191], "mapped", [36763]], [[12192, 12192], "mapped", [36784]], [[12193, 12193], "mapped", [36789]], [[12194, 12194], "mapped", [37009]], [[12195, 12195], "mapped", [37193]], [[12196, 12196], "mapped", [37318]], [[12197, 12197], "mapped", [37324]], [[12198, 12198], "mapped", [37329]], [[12199, 12199], "mapped", [38263]], [[12200, 12200], "mapped", [38272]], [[12201, 12201], "mapped", [38428]], [[12202, 12202], "mapped", [38582]], [[12203, 12203], "mapped", [38585]], [[12204, 12204], "mapped", [38632]], [[12205, 12205], "mapped", [38737]], [[12206, 12206], "mapped", [38750]], [[12207, 12207], "mapped", [38754]], [[12208, 12208], "mapped", [38761]], [[12209, 12209], "mapped", [38859]], [[12210, 12210], "mapped", [38893]], [[12211, 12211], "mapped", [38899]], [[12212, 12212], "mapped", [38913]], [[12213, 12213], "mapped", [39080]], [[12214, 12214], "mapped", [39131]], [[12215, 12215], "mapped", [39135]], [[12216, 12216], "mapped", [39318]], [[12217, 12217], "mapped", [39321]], [[12218, 12218], "mapped", [39340]], [[12219, 12219], "mapped", [39592]], [[12220, 12220], "mapped", [39640]], [[12221, 12221], "mapped", [39647]], [[12222, 12222], "mapped", [39717]], [[12223, 12223], "mapped", [39727]], [[12224, 12224], "mapped", [39730]], [[12225, 12225], "mapped", [39740]], [[12226, 12226], "mapped", [39770]], [[12227, 12227], "mapped", [40165]], [[12228, 12228], "mapped", [40565]], [[12229, 12229], "mapped", [40575]], [[12230, 12230], "mapped", [40613]], [[12231, 12231], "mapped", [40635]], [[12232, 12232], "mapped", [40643]], [[12233, 12233], "mapped", [40653]], [[12234, 12234], "mapped", [40657]], [[12235, 12235], "mapped", [40697]], [[12236, 12236], "mapped", [40701]], [[12237, 12237], "mapped", [40718]], [[12238, 12238], "mapped", [40723]], [[12239, 12239], "mapped", [40736]], [[12240, 12240], "mapped", [40763]], [[12241, 12241], "mapped", [40778]], [[12242, 12242], "mapped", [40786]], [[12243, 12243], "mapped", [40845]], [[12244, 12244], "mapped", [40860]], [[12245, 12245], "mapped", [40864]], [[12246, 12271], "disallowed"], [[12272, 12283], "disallowed"], [[12284, 12287], "disallowed"], [[12288, 12288], "disallowed_STD3_mapped", [32]], [[12289, 12289], "valid", [], "NV8"], [[12290, 12290], "mapped", [46]], [[12291, 12292], "valid", [], "NV8"], [[12293, 12295], "valid"], [[12296, 12329], "valid", [], "NV8"], [[12330, 12333], "valid"], [[12334, 12341], "valid", [], "NV8"], [[12342, 12342], "mapped", [12306]], [[12343, 12343], "valid", [], "NV8"], [[12344, 12344], "mapped", [21313]], [[12345, 12345], "mapped", [21316]], [[12346, 12346], "mapped", [21317]], [[12347, 12347], "valid", [], "NV8"], [[12348, 12348], "valid"], [[12349, 12349], "valid", [], "NV8"], [[12350, 12350], "valid", [], "NV8"], [[12351, 12351], "valid", [], "NV8"], [[12352, 12352], "disallowed"], [[12353, 12436], "valid"], [[12437, 12438], "valid"], [[12439, 12440], "disallowed"], [[12441, 12442], "valid"], [[12443, 12443], "disallowed_STD3_mapped", [32, 12441]], [[12444, 12444], "disallowed_STD3_mapped", [32, 12442]], [[12445, 12446], "valid"], [[12447, 12447], "mapped", [12424, 12426]], [[12448, 12448], "valid", [], "NV8"], [[12449, 12542], "valid"], [[12543, 12543], "mapped", [12467, 12488]], [[12544, 12548], "disallowed"], [[12549, 12588], "valid"], [[12589, 12589], "valid"], [[12590, 12592], "disallowed"], [[12593, 12593], "mapped", [4352]], [[12594, 12594], "mapped", [4353]], [[12595, 12595], "mapped", [4522]], [[12596, 12596], "mapped", [4354]], [[12597, 12597], "mapped", [4524]], [[12598, 12598], "mapped", [4525]], [[12599, 12599], "mapped", [4355]], [[12600, 12600], "mapped", [4356]], [[12601, 12601], "mapped", [4357]], [[12602, 12602], "mapped", [4528]], [[12603, 12603], "mapped", [4529]], [[12604, 12604], "mapped", [4530]], [[12605, 12605], "mapped", [4531]], [[12606, 12606], "mapped", [4532]], [[12607, 12607], "mapped", [4533]], [[12608, 12608], "mapped", [4378]], [[12609, 12609], "mapped", [4358]], [[12610, 12610], "mapped", [4359]], [[12611, 12611], "mapped", [4360]], [[12612, 12612], "mapped", [4385]], [[12613, 12613], "mapped", [4361]], [[12614, 12614], "mapped", [4362]], [[12615, 12615], "mapped", [4363]], [[12616, 12616], "mapped", [4364]], [[12617, 12617], "mapped", [4365]], [[12618, 12618], "mapped", [4366]], [[12619, 12619], "mapped", [4367]], [[12620, 12620], "mapped", [4368]], [[12621, 12621], "mapped", [4369]], [[12622, 12622], "mapped", [4370]], [[12623, 12623], "mapped", [4449]], [[12624, 12624], "mapped", [4450]], [[12625, 12625], "mapped", [4451]], [[12626, 12626], "mapped", [4452]], [[12627, 12627], "mapped", [4453]], [[12628, 12628], "mapped", [4454]], [[12629, 12629], "mapped", [4455]], [[12630, 12630], "mapped", [4456]], [[12631, 12631], "mapped", [4457]], [[12632, 12632], "mapped", [4458]], [[12633, 12633], "mapped", [4459]], [[12634, 12634], "mapped", [4460]], [[12635, 12635], "mapped", [4461]], [[12636, 12636], "mapped", [4462]], [[12637, 12637], "mapped", [4463]], [[12638, 12638], "mapped", [4464]], [[12639, 12639], "mapped", [4465]], [[12640, 12640], "mapped", [4466]], [[12641, 12641], "mapped", [4467]], [[12642, 12642], "mapped", [4468]], [[12643, 12643], "mapped", [4469]], [[12644, 12644], "disallowed"], [[12645, 12645], "mapped", [4372]], [[12646, 12646], "mapped", [4373]], [[12647, 12647], "mapped", [4551]], [[12648, 12648], "mapped", [4552]], [[12649, 12649], "mapped", [4556]], [[12650, 12650], "mapped", [4558]], [[12651, 12651], "mapped", [4563]], [[12652, 12652], "mapped", [4567]], [[12653, 12653], "mapped", [4569]], [[12654, 12654], "mapped", [4380]], [[12655, 12655], "mapped", [4573]], [[12656, 12656], "mapped", [4575]], [[12657, 12657], "mapped", [4381]], [[12658, 12658], "mapped", [4382]], [[12659, 12659], "mapped", [4384]], [[12660, 12660], "mapped", [4386]], [[12661, 12661], "mapped", [4387]], [[12662, 12662], "mapped", [4391]], [[12663, 12663], "mapped", [4393]], [[12664, 12664], "mapped", [4395]], [[12665, 12665], "mapped", [4396]], [[12666, 12666], "mapped", [4397]], [[12667, 12667], "mapped", [4398]], [[12668, 12668], "mapped", [4399]], [[12669, 12669], "mapped", [4402]], [[12670, 12670], "mapped", [4406]], [[12671, 12671], "mapped", [4416]], [[12672, 12672], "mapped", [4423]], [[12673, 12673], "mapped", [4428]], [[12674, 12674], "mapped", [4593]], [[12675, 12675], "mapped", [4594]], [[12676, 12676], "mapped", [4439]], [[12677, 12677], "mapped", [4440]], [[12678, 12678], "mapped", [4441]], [[12679, 12679], "mapped", [4484]], [[12680, 12680], "mapped", [4485]], [[12681, 12681], "mapped", [4488]], [[12682, 12682], "mapped", [4497]], [[12683, 12683], "mapped", [4498]], [[12684, 12684], "mapped", [4500]], [[12685, 12685], "mapped", [4510]], [[12686, 12686], "mapped", [4513]], [[12687, 12687], "disallowed"], [[12688, 12689], "valid", [], "NV8"], [[12690, 12690], "mapped", [19968]], [[12691, 12691], "mapped", [20108]], [[12692, 12692], "mapped", [19977]], [[12693, 12693], "mapped", [22235]], [[12694, 12694], "mapped", [19978]], [[12695, 12695], "mapped", [20013]], [[12696, 12696], "mapped", [19979]], [[12697, 12697], "mapped", [30002]], [[12698, 12698], "mapped", [20057]], [[12699, 12699], "mapped", [19993]], [[12700, 12700], "mapped", [19969]], [[12701, 12701], "mapped", [22825]], [[12702, 12702], "mapped", [22320]], [[12703, 12703], "mapped", [20154]], [[12704, 12727], "valid"], [[12728, 12730], "valid"], [[12731, 12735], "disallowed"], [[12736, 12751], "valid", [], "NV8"], [[12752, 12771], "valid", [], "NV8"], [[12772, 12783], "disallowed"], [[12784, 12799], "valid"], [[12800, 12800], "disallowed_STD3_mapped", [40, 4352, 41]], [[12801, 12801], "disallowed_STD3_mapped", [40, 4354, 41]], [[12802, 12802], "disallowed_STD3_mapped", [40, 4355, 41]], [[12803, 12803], "disallowed_STD3_mapped", [40, 4357, 41]], [[12804, 12804], "disallowed_STD3_mapped", [40, 4358, 41]], [[12805, 12805], "disallowed_STD3_mapped", [40, 4359, 41]], [[12806, 12806], "disallowed_STD3_mapped", [40, 4361, 41]], [[12807, 12807], "disallowed_STD3_mapped", [40, 4363, 41]], [[12808, 12808], "disallowed_STD3_mapped", [40, 4364, 41]], [[12809, 12809], "disallowed_STD3_mapped", [40, 4366, 41]], [[12810, 12810], "disallowed_STD3_mapped", [40, 4367, 41]], [[12811, 12811], "disallowed_STD3_mapped", [40, 4368, 41]], [[12812, 12812], "disallowed_STD3_mapped", [40, 4369, 41]], [[12813, 12813], "disallowed_STD3_mapped", [40, 4370, 41]], [[12814, 12814], "disallowed_STD3_mapped", [40, 44032, 41]], [[12815, 12815], "disallowed_STD3_mapped", [40, 45208, 41]], [[12816, 12816], "disallowed_STD3_mapped", [40, 45796, 41]], [[12817, 12817], "disallowed_STD3_mapped", [40, 46972, 41]], [[12818, 12818], "disallowed_STD3_mapped", [40, 47560, 41]], [[12819, 12819], "disallowed_STD3_mapped", [40, 48148, 41]], [[12820, 12820], "disallowed_STD3_mapped", [40, 49324, 41]], [[12821, 12821], "disallowed_STD3_mapped", [40, 50500, 41]], [[12822, 12822], "disallowed_STD3_mapped", [40, 51088, 41]], [[12823, 12823], "disallowed_STD3_mapped", [40, 52264, 41]], [[12824, 12824], "disallowed_STD3_mapped", [40, 52852, 41]], [[12825, 12825], "disallowed_STD3_mapped", [40, 53440, 41]], [[12826, 12826], "disallowed_STD3_mapped", [40, 54028, 41]], [[12827, 12827], "disallowed_STD3_mapped", [40, 54616, 41]], [[12828, 12828], "disallowed_STD3_mapped", [40, 51452, 41]], [[12829, 12829], "disallowed_STD3_mapped", [40, 50724, 51204, 41]], [[12830, 12830], "disallowed_STD3_mapped", [40, 50724, 54980, 41]], [[12831, 12831], "disallowed"], [[12832, 12832], "disallowed_STD3_mapped", [40, 19968, 41]], [[12833, 12833], "disallowed_STD3_mapped", [40, 20108, 41]], [[12834, 12834], "disallowed_STD3_mapped", [40, 19977, 41]], [[12835, 12835], "disallowed_STD3_mapped", [40, 22235, 41]], [[12836, 12836], "disallowed_STD3_mapped", [40, 20116, 41]], [[12837, 12837], "disallowed_STD3_mapped", [40, 20845, 41]], [[12838, 12838], "disallowed_STD3_mapped", [40, 19971, 41]], [[12839, 12839], "disallowed_STD3_mapped", [40, 20843, 41]], [[12840, 12840], "disallowed_STD3_mapped", [40, 20061, 41]], [[12841, 12841], "disallowed_STD3_mapped", [40, 21313, 41]], [[12842, 12842], "disallowed_STD3_mapped", [40, 26376, 41]], [[12843, 12843], "disallowed_STD3_mapped", [40, 28779, 41]], [[12844, 12844], "disallowed_STD3_mapped", [40, 27700, 41]], [[12845, 12845], "disallowed_STD3_mapped", [40, 26408, 41]], [[12846, 12846], "disallowed_STD3_mapped", [40, 37329, 41]], [[12847, 12847], "disallowed_STD3_mapped", [40, 22303, 41]], [[12848, 12848], "disallowed_STD3_mapped", [40, 26085, 41]], [[12849, 12849], "disallowed_STD3_mapped", [40, 26666, 41]], [[12850, 12850], "disallowed_STD3_mapped", [40, 26377, 41]], [[12851, 12851], "disallowed_STD3_mapped", [40, 31038, 41]], [[12852, 12852], "disallowed_STD3_mapped", [40, 21517, 41]], [[12853, 12853], "disallowed_STD3_mapped", [40, 29305, 41]], [[12854, 12854], "disallowed_STD3_mapped", [40, 36001, 41]], [[12855, 12855], "disallowed_STD3_mapped", [40, 31069, 41]], [[12856, 12856], "disallowed_STD3_mapped", [40, 21172, 41]], [[12857, 12857], "disallowed_STD3_mapped", [40, 20195, 41]], [[12858, 12858], "disallowed_STD3_mapped", [40, 21628, 41]], [[12859, 12859], "disallowed_STD3_mapped", [40, 23398, 41]], [[12860, 12860], "disallowed_STD3_mapped", [40, 30435, 41]], [[12861, 12861], "disallowed_STD3_mapped", [40, 20225, 41]], [[12862, 12862], "disallowed_STD3_mapped", [40, 36039, 41]], [[12863, 12863], "disallowed_STD3_mapped", [40, 21332, 41]], [[12864, 12864], "disallowed_STD3_mapped", [40, 31085, 41]], [[12865, 12865], "disallowed_STD3_mapped", [40, 20241, 41]], [[12866, 12866], "disallowed_STD3_mapped", [40, 33258, 41]], [[12867, 12867], "disallowed_STD3_mapped", [40, 33267, 41]], [[12868, 12868], "mapped", [21839]], [[12869, 12869], "mapped", [24188]], [[12870, 12870], "mapped", [25991]], [[12871, 12871], "mapped", [31631]], [[12872, 12879], "valid", [], "NV8"], [[12880, 12880], "mapped", [112, 116, 101]], [[12881, 12881], "mapped", [50, 49]], [[12882, 12882], "mapped", [50, 50]], [[12883, 12883], "mapped", [50, 51]], [[12884, 12884], "mapped", [50, 52]], [[12885, 12885], "mapped", [50, 53]], [[12886, 12886], "mapped", [50, 54]], [[12887, 12887], "mapped", [50, 55]], [[12888, 12888], "mapped", [50, 56]], [[12889, 12889], "mapped", [50, 57]], [[12890, 12890], "mapped", [51, 48]], [[12891, 12891], "mapped", [51, 49]], [[12892, 12892], "mapped", [51, 50]], [[12893, 12893], "mapped", [51, 51]], [[12894, 12894], "mapped", [51, 52]], [[12895, 12895], "mapped", [51, 53]], [[12896, 12896], "mapped", [4352]], [[12897, 12897], "mapped", [4354]], [[12898, 12898], "mapped", [4355]], [[12899, 12899], "mapped", [4357]], [[12900, 12900], "mapped", [4358]], [[12901, 12901], "mapped", [4359]], [[12902, 12902], "mapped", [4361]], [[12903, 12903], "mapped", [4363]], [[12904, 12904], "mapped", [4364]], [[12905, 12905], "mapped", [4366]], [[12906, 12906], "mapped", [4367]], [[12907, 12907], "mapped", [4368]], [[12908, 12908], "mapped", [4369]], [[12909, 12909], "mapped", [4370]], [[12910, 12910], "mapped", [44032]], [[12911, 12911], "mapped", [45208]], [[12912, 12912], "mapped", [45796]], [[12913, 12913], "mapped", [46972]], [[12914, 12914], "mapped", [47560]], [[12915, 12915], "mapped", [48148]], [[12916, 12916], "mapped", [49324]], [[12917, 12917], "mapped", [50500]], [[12918, 12918], "mapped", [51088]], [[12919, 12919], "mapped", [52264]], [[12920, 12920], "mapped", [52852]], [[12921, 12921], "mapped", [53440]], [[12922, 12922], "mapped", [54028]], [[12923, 12923], "mapped", [54616]], [[12924, 12924], "mapped", [52280, 44256]], [[12925, 12925], "mapped", [51452, 51032]], [[12926, 12926], "mapped", [50864]], [[12927, 12927], "valid", [], "NV8"], [[12928, 12928], "mapped", [19968]], [[12929, 12929], "mapped", [20108]], [[12930, 12930], "mapped", [19977]], [[12931, 12931], "mapped", [22235]], [[12932, 12932], "mapped", [20116]], [[12933, 12933], "mapped", [20845]], [[12934, 12934], "mapped", [19971]], [[12935, 12935], "mapped", [20843]], [[12936, 12936], "mapped", [20061]], [[12937, 12937], "mapped", [21313]], [[12938, 12938], "mapped", [26376]], [[12939, 12939], "mapped", [28779]], [[12940, 12940], "mapped", [27700]], [[12941, 12941], "mapped", [26408]], [[12942, 12942], "mapped", [37329]], [[12943, 12943], "mapped", [22303]], [[12944, 12944], "mapped", [26085]], [[12945, 12945], "mapped", [26666]], [[12946, 12946], "mapped", [26377]], [[12947, 12947], "mapped", [31038]], [[12948, 12948], "mapped", [21517]], [[12949, 12949], "mapped", [29305]], [[12950, 12950], "mapped", [36001]], [[12951, 12951], "mapped", [31069]], [[12952, 12952], "mapped", [21172]], [[12953, 12953], "mapped", [31192]], [[12954, 12954], "mapped", [30007]], [[12955, 12955], "mapped", [22899]], [[12956, 12956], "mapped", [36969]], [[12957, 12957], "mapped", [20778]], [[12958, 12958], "mapped", [21360]], [[12959, 12959], "mapped", [27880]], [[12960, 12960], "mapped", [38917]], [[12961, 12961], "mapped", [20241]], [[12962, 12962], "mapped", [20889]], [[12963, 12963], "mapped", [27491]], [[12964, 12964], "mapped", [19978]], [[12965, 12965], "mapped", [20013]], [[12966, 12966], "mapped", [19979]], [[12967, 12967], "mapped", [24038]], [[12968, 12968], "mapped", [21491]], [[12969, 12969], "mapped", [21307]], [[12970, 12970], "mapped", [23447]], [[12971, 12971], "mapped", [23398]], [[12972, 12972], "mapped", [30435]], [[12973, 12973], "mapped", [20225]], [[12974, 12974], "mapped", [36039]], [[12975, 12975], "mapped", [21332]], [[12976, 12976], "mapped", [22812]], [[12977, 12977], "mapped", [51, 54]], [[12978, 12978], "mapped", [51, 55]], [[12979, 12979], "mapped", [51, 56]], [[12980, 12980], "mapped", [51, 57]], [[12981, 12981], "mapped", [52, 48]], [[12982, 12982], "mapped", [52, 49]], [[12983, 12983], "mapped", [52, 50]], [[12984, 12984], "mapped", [52, 51]], [[12985, 12985], "mapped", [52, 52]], [[12986, 12986], "mapped", [52, 53]], [[12987, 12987], "mapped", [52, 54]], [[12988, 12988], "mapped", [52, 55]], [[12989, 12989], "mapped", [52, 56]], [[12990, 12990], "mapped", [52, 57]], [[12991, 12991], "mapped", [53, 48]], [[12992, 12992], "mapped", [49, 26376]], [[12993, 12993], "mapped", [50, 26376]], [[12994, 12994], "mapped", [51, 26376]], [[12995, 12995], "mapped", [52, 26376]], [[12996, 12996], "mapped", [53, 26376]], [[12997, 12997], "mapped", [54, 26376]], [[12998, 12998], "mapped", [55, 26376]], [[12999, 12999], "mapped", [56, 26376]], [[13e3, 13e3], "mapped", [57, 26376]], [[13001, 13001], "mapped", [49, 48, 26376]], [[13002, 13002], "mapped", [49, 49, 26376]], [[13003, 13003], "mapped", [49, 50, 26376]], [[13004, 13004], "mapped", [104, 103]], [[13005, 13005], "mapped", [101, 114, 103]], [[13006, 13006], "mapped", [101, 118]], [[13007, 13007], "mapped", [108, 116, 100]], [[13008, 13008], "mapped", [12450]], [[13009, 13009], "mapped", [12452]], [[13010, 13010], "mapped", [12454]], [[13011, 13011], "mapped", [12456]], [[13012, 13012], "mapped", [12458]], [[13013, 13013], "mapped", [12459]], [[13014, 13014], "mapped", [12461]], [[13015, 13015], "mapped", [12463]], [[13016, 13016], "mapped", [12465]], [[13017, 13017], "mapped", [12467]], [[13018, 13018], "mapped", [12469]], [[13019, 13019], "mapped", [12471]], [[13020, 13020], "mapped", [12473]], [[13021, 13021], "mapped", [12475]], [[13022, 13022], "mapped", [12477]], [[13023, 13023], "mapped", [12479]], [[13024, 13024], "mapped", [12481]], [[13025, 13025], "mapped", [12484]], [[13026, 13026], "mapped", [12486]], [[13027, 13027], "mapped", [12488]], [[13028, 13028], "mapped", [12490]], [[13029, 13029], "mapped", [12491]], [[13030, 13030], "mapped", [12492]], [[13031, 13031], "mapped", [12493]], [[13032, 13032], "mapped", [12494]], [[13033, 13033], "mapped", [12495]], [[13034, 13034], "mapped", [12498]], [[13035, 13035], "mapped", [12501]], [[13036, 13036], "mapped", [12504]], [[13037, 13037], "mapped", [12507]], [[13038, 13038], "mapped", [12510]], [[13039, 13039], "mapped", [12511]], [[13040, 13040], "mapped", [12512]], [[13041, 13041], "mapped", [12513]], [[13042, 13042], "mapped", [12514]], [[13043, 13043], "mapped", [12516]], [[13044, 13044], "mapped", [12518]], [[13045, 13045], "mapped", [12520]], [[13046, 13046], "mapped", [12521]], [[13047, 13047], "mapped", [12522]], [[13048, 13048], "mapped", [12523]], [[13049, 13049], "mapped", [12524]], [[13050, 13050], "mapped", [12525]], [[13051, 13051], "mapped", [12527]], [[13052, 13052], "mapped", [12528]], [[13053, 13053], "mapped", [12529]], [[13054, 13054], "mapped", [12530]], [[13055, 13055], "disallowed"], [[13056, 13056], "mapped", [12450, 12497, 12540, 12488]], [[13057, 13057], "mapped", [12450, 12523, 12501, 12449]], [[13058, 13058], "mapped", [12450, 12531, 12506, 12450]], [[13059, 13059], "mapped", [12450, 12540, 12523]], [[13060, 13060], "mapped", [12452, 12491, 12531, 12464]], [[13061, 13061], "mapped", [12452, 12531, 12481]], [[13062, 13062], "mapped", [12454, 12457, 12531]], [[13063, 13063], "mapped", [12456, 12473, 12463, 12540, 12489]], [[13064, 13064], "mapped", [12456, 12540, 12459, 12540]], [[13065, 13065], "mapped", [12458, 12531, 12473]], [[13066, 13066], "mapped", [12458, 12540, 12512]], [[13067, 13067], "mapped", [12459, 12452, 12522]], [[13068, 13068], "mapped", [12459, 12521, 12483, 12488]], [[13069, 13069], "mapped", [12459, 12525, 12522, 12540]], [[13070, 13070], "mapped", [12460, 12525, 12531]], [[13071, 13071], "mapped", [12460, 12531, 12510]], [[13072, 13072], "mapped", [12462, 12460]], [[13073, 13073], "mapped", [12462, 12491, 12540]], [[13074, 13074], "mapped", [12461, 12517, 12522, 12540]], [[13075, 13075], "mapped", [12462, 12523, 12480, 12540]], [[13076, 13076], "mapped", [12461, 12525]], [[13077, 13077], "mapped", [12461, 12525, 12464, 12521, 12512]], [[13078, 13078], "mapped", [12461, 12525, 12513, 12540, 12488, 12523]], [[13079, 13079], "mapped", [12461, 12525, 12527, 12483, 12488]], [[13080, 13080], "mapped", [12464, 12521, 12512]], [[13081, 13081], "mapped", [12464, 12521, 12512, 12488, 12531]], [[13082, 13082], "mapped", [12463, 12523, 12476, 12452, 12525]], [[13083, 13083], "mapped", [12463, 12525, 12540, 12493]], [[13084, 13084], "mapped", [12465, 12540, 12473]], [[13085, 13085], "mapped", [12467, 12523, 12490]], [[13086, 13086], "mapped", [12467, 12540, 12509]], [[13087, 13087], "mapped", [12469, 12452, 12463, 12523]], [[13088, 13088], "mapped", [12469, 12531, 12481, 12540, 12512]], [[13089, 13089], "mapped", [12471, 12522, 12531, 12464]], [[13090, 13090], "mapped", [12475, 12531, 12481]], [[13091, 13091], "mapped", [12475, 12531, 12488]], [[13092, 13092], "mapped", [12480, 12540, 12473]], [[13093, 13093], "mapped", [12487, 12471]], [[13094, 13094], "mapped", [12489, 12523]], [[13095, 13095], "mapped", [12488, 12531]], [[13096, 13096], "mapped", [12490, 12494]], [[13097, 13097], "mapped", [12494, 12483, 12488]], [[13098, 13098], "mapped", [12495, 12452, 12484]], [[13099, 13099], "mapped", [12497, 12540, 12475, 12531, 12488]], [[13100, 13100], "mapped", [12497, 12540, 12484]], [[13101, 13101], "mapped", [12496, 12540, 12524, 12523]], [[13102, 13102], "mapped", [12500, 12450, 12473, 12488, 12523]], [[13103, 13103], "mapped", [12500, 12463, 12523]], [[13104, 13104], "mapped", [12500, 12467]], [[13105, 13105], "mapped", [12499, 12523]], [[13106, 13106], "mapped", [12501, 12449, 12521, 12483, 12489]], [[13107, 13107], "mapped", [12501, 12451, 12540, 12488]], [[13108, 13108], "mapped", [12502, 12483, 12471, 12455, 12523]], [[13109, 13109], "mapped", [12501, 12521, 12531]], [[13110, 13110], "mapped", [12504, 12463, 12479, 12540, 12523]], [[13111, 13111], "mapped", [12506, 12477]], [[13112, 13112], "mapped", [12506, 12491, 12498]], [[13113, 13113], "mapped", [12504, 12523, 12484]], [[13114, 13114], "mapped", [12506, 12531, 12473]], [[13115, 13115], "mapped", [12506, 12540, 12472]], [[13116, 13116], "mapped", [12505, 12540, 12479]], [[13117, 13117], "mapped", [12509, 12452, 12531, 12488]], [[13118, 13118], "mapped", [12508, 12523, 12488]], [[13119, 13119], "mapped", [12507, 12531]], [[13120, 13120], "mapped", [12509, 12531, 12489]], [[13121, 13121], "mapped", [12507, 12540, 12523]], [[13122, 13122], "mapped", [12507, 12540, 12531]], [[13123, 13123], "mapped", [12510, 12452, 12463, 12525]], [[13124, 13124], "mapped", [12510, 12452, 12523]], [[13125, 13125], "mapped", [12510, 12483, 12495]], [[13126, 13126], "mapped", [12510, 12523, 12463]], [[13127, 13127], "mapped", [12510, 12531, 12471, 12519, 12531]], [[13128, 13128], "mapped", [12511, 12463, 12525, 12531]], [[13129, 13129], "mapped", [12511, 12522]], [[13130, 13130], "mapped", [12511, 12522, 12496, 12540, 12523]], [[13131, 13131], "mapped", [12513, 12460]], [[13132, 13132], "mapped", [12513, 12460, 12488, 12531]], [[13133, 13133], "mapped", [12513, 12540, 12488, 12523]], [[13134, 13134], "mapped", [12516, 12540, 12489]], [[13135, 13135], "mapped", [12516, 12540, 12523]], [[13136, 13136], "mapped", [12518, 12450, 12531]], [[13137, 13137], "mapped", [12522, 12483, 12488, 12523]], [[13138, 13138], "mapped", [12522, 12521]], [[13139, 13139], "mapped", [12523, 12500, 12540]], [[13140, 13140], "mapped", [12523, 12540, 12502, 12523]], [[13141, 13141], "mapped", [12524, 12512]], [[13142, 13142], "mapped", [12524, 12531, 12488, 12466, 12531]], [[13143, 13143], "mapped", [12527, 12483, 12488]], [[13144, 13144], "mapped", [48, 28857]], [[13145, 13145], "mapped", [49, 28857]], [[13146, 13146], "mapped", [50, 28857]], [[13147, 13147], "mapped", [51, 28857]], [[13148, 13148], "mapped", [52, 28857]], [[13149, 13149], "mapped", [53, 28857]], [[13150, 13150], "mapped", [54, 28857]], [[13151, 13151], "mapped", [55, 28857]], [[13152, 13152], "mapped", [56, 28857]], [[13153, 13153], "mapped", [57, 28857]], [[13154, 13154], "mapped", [49, 48, 28857]], [[13155, 13155], "mapped", [49, 49, 28857]], [[13156, 13156], "mapped", [49, 50, 28857]], [[13157, 13157], "mapped", [49, 51, 28857]], [[13158, 13158], "mapped", [49, 52, 28857]], [[13159, 13159], "mapped", [49, 53, 28857]], [[13160, 13160], "mapped", [49, 54, 28857]], [[13161, 13161], "mapped", [49, 55, 28857]], [[13162, 13162], "mapped", [49, 56, 28857]], [[13163, 13163], "mapped", [49, 57, 28857]], [[13164, 13164], "mapped", [50, 48, 28857]], [[13165, 13165], "mapped", [50, 49, 28857]], [[13166, 13166], "mapped", [50, 50, 28857]], [[13167, 13167], "mapped", [50, 51, 28857]], [[13168, 13168], "mapped", [50, 52, 28857]], [[13169, 13169], "mapped", [104, 112, 97]], [[13170, 13170], "mapped", [100, 97]], [[13171, 13171], "mapped", [97, 117]], [[13172, 13172], "mapped", [98, 97, 114]], [[13173, 13173], "mapped", [111, 118]], [[13174, 13174], "mapped", [112, 99]], [[13175, 13175], "mapped", [100, 109]], [[13176, 13176], "mapped", [100, 109, 50]], [[13177, 13177], "mapped", [100, 109, 51]], [[13178, 13178], "mapped", [105, 117]], [[13179, 13179], "mapped", [24179, 25104]], [[13180, 13180], "mapped", [26157, 21644]], [[13181, 13181], "mapped", [22823, 27491]], [[13182, 13182], "mapped", [26126, 27835]], [[13183, 13183], "mapped", [26666, 24335, 20250, 31038]], [[13184, 13184], "mapped", [112, 97]], [[13185, 13185], "mapped", [110, 97]], [[13186, 13186], "mapped", [956, 97]], [[13187, 13187], "mapped", [109, 97]], [[13188, 13188], "mapped", [107, 97]], [[13189, 13189], "mapped", [107, 98]], [[13190, 13190], "mapped", [109, 98]], [[13191, 13191], "mapped", [103, 98]], [[13192, 13192], "mapped", [99, 97, 108]], [[13193, 13193], "mapped", [107, 99, 97, 108]], [[13194, 13194], "mapped", [112, 102]], [[13195, 13195], "mapped", [110, 102]], [[13196, 13196], "mapped", [956, 102]], [[13197, 13197], "mapped", [956, 103]], [[13198, 13198], "mapped", [109, 103]], [[13199, 13199], "mapped", [107, 103]], [[13200, 13200], "mapped", [104, 122]], [[13201, 13201], "mapped", [107, 104, 122]], [[13202, 13202], "mapped", [109, 104, 122]], [[13203, 13203], "mapped", [103, 104, 122]], [[13204, 13204], "mapped", [116, 104, 122]], [[13205, 13205], "mapped", [956, 108]], [[13206, 13206], "mapped", [109, 108]], [[13207, 13207], "mapped", [100, 108]], [[13208, 13208], "mapped", [107, 108]], [[13209, 13209], "mapped", [102, 109]], [[13210, 13210], "mapped", [110, 109]], [[13211, 13211], "mapped", [956, 109]], [[13212, 13212], "mapped", [109, 109]], [[13213, 13213], "mapped", [99, 109]], [[13214, 13214], "mapped", [107, 109]], [[13215, 13215], "mapped", [109, 109, 50]], [[13216, 13216], "mapped", [99, 109, 50]], [[13217, 13217], "mapped", [109, 50]], [[13218, 13218], "mapped", [107, 109, 50]], [[13219, 13219], "mapped", [109, 109, 51]], [[13220, 13220], "mapped", [99, 109, 51]], [[13221, 13221], "mapped", [109, 51]], [[13222, 13222], "mapped", [107, 109, 51]], [[13223, 13223], "mapped", [109, 8725, 115]], [[13224, 13224], "mapped", [109, 8725, 115, 50]], [[13225, 13225], "mapped", [112, 97]], [[13226, 13226], "mapped", [107, 112, 97]], [[13227, 13227], "mapped", [109, 112, 97]], [[13228, 13228], "mapped", [103, 112, 97]], [[13229, 13229], "mapped", [114, 97, 100]], [[13230, 13230], "mapped", [114, 97, 100, 8725, 115]], [[13231, 13231], "mapped", [114, 97, 100, 8725, 115, 50]], [[13232, 13232], "mapped", [112, 115]], [[13233, 13233], "mapped", [110, 115]], [[13234, 13234], "mapped", [956, 115]], [[13235, 13235], "mapped", [109, 115]], [[13236, 13236], "mapped", [112, 118]], [[13237, 13237], "mapped", [110, 118]], [[13238, 13238], "mapped", [956, 118]], [[13239, 13239], "mapped", [109, 118]], [[13240, 13240], "mapped", [107, 118]], [[13241, 13241], "mapped", [109, 118]], [[13242, 13242], "mapped", [112, 119]], [[13243, 13243], "mapped", [110, 119]], [[13244, 13244], "mapped", [956, 119]], [[13245, 13245], "mapped", [109, 119]], [[13246, 13246], "mapped", [107, 119]], [[13247, 13247], "mapped", [109, 119]], [[13248, 13248], "mapped", [107, 969]], [[13249, 13249], "mapped", [109, 969]], [[13250, 13250], "disallowed"], [[13251, 13251], "mapped", [98, 113]], [[13252, 13252], "mapped", [99, 99]], [[13253, 13253], "mapped", [99, 100]], [[13254, 13254], "mapped", [99, 8725, 107, 103]], [[13255, 13255], "disallowed"], [[13256, 13256], "mapped", [100, 98]], [[13257, 13257], "mapped", [103, 121]], [[13258, 13258], "mapped", [104, 97]], [[13259, 13259], "mapped", [104, 112]], [[13260, 13260], "mapped", [105, 110]], [[13261, 13261], "mapped", [107, 107]], [[13262, 13262], "mapped", [107, 109]], [[13263, 13263], "mapped", [107, 116]], [[13264, 13264], "mapped", [108, 109]], [[13265, 13265], "mapped", [108, 110]], [[13266, 13266], "mapped", [108, 111, 103]], [[13267, 13267], "mapped", [108, 120]], [[13268, 13268], "mapped", [109, 98]], [[13269, 13269], "mapped", [109, 105, 108]], [[13270, 13270], "mapped", [109, 111, 108]], [[13271, 13271], "mapped", [112, 104]], [[13272, 13272], "disallowed"], [[13273, 13273], "mapped", [112, 112, 109]], [[13274, 13274], "mapped", [112, 114]], [[13275, 13275], "mapped", [115, 114]], [[13276, 13276], "mapped", [115, 118]], [[13277, 13277], "mapped", [119, 98]], [[13278, 13278], "mapped", [118, 8725, 109]], [[13279, 13279], "mapped", [97, 8725, 109]], [[13280, 13280], "mapped", [49, 26085]], [[13281, 13281], "mapped", [50, 26085]], [[13282, 13282], "mapped", [51, 26085]], [[13283, 13283], "mapped", [52, 26085]], [[13284, 13284], "mapped", [53, 26085]], [[13285, 13285], "mapped", [54, 26085]], [[13286, 13286], "mapped", [55, 26085]], [[13287, 13287], "mapped", [56, 26085]], [[13288, 13288], "mapped", [57, 26085]], [[13289, 13289], "mapped", [49, 48, 26085]], [[13290, 13290], "mapped", [49, 49, 26085]], [[13291, 13291], "mapped", [49, 50, 26085]], [[13292, 13292], "mapped", [49, 51, 26085]], [[13293, 13293], "mapped", [49, 52, 26085]], [[13294, 13294], "mapped", [49, 53, 26085]], [[13295, 13295], "mapped", [49, 54, 26085]], [[13296, 13296], "mapped", [49, 55, 26085]], [[13297, 13297], "mapped", [49, 56, 26085]], [[13298, 13298], "mapped", [49, 57, 26085]], [[13299, 13299], "mapped", [50, 48, 26085]], [[13300, 13300], "mapped", [50, 49, 26085]], [[13301, 13301], "mapped", [50, 50, 26085]], [[13302, 13302], "mapped", [50, 51, 26085]], [[13303, 13303], "mapped", [50, 52, 26085]], [[13304, 13304], "mapped", [50, 53, 26085]], [[13305, 13305], "mapped", [50, 54, 26085]], [[13306, 13306], "mapped", [50, 55, 26085]], [[13307, 13307], "mapped", [50, 56, 26085]], [[13308, 13308], "mapped", [50, 57, 26085]], [[13309, 13309], "mapped", [51, 48, 26085]], [[13310, 13310], "mapped", [51, 49, 26085]], [[13311, 13311], "mapped", [103, 97, 108]], [[13312, 19893], "valid"], [[19894, 19903], "disallowed"], [[19904, 19967], "valid", [], "NV8"], [[19968, 40869], "valid"], [[40870, 40891], "valid"], [[40892, 40899], "valid"], [[40900, 40907], "valid"], [[40908, 40908], "valid"], [[40909, 40917], "valid"], [[40918, 40959], "disallowed"], [[40960, 42124], "valid"], [[42125, 42127], "disallowed"], [[42128, 42145], "valid", [], "NV8"], [[42146, 42147], "valid", [], "NV8"], [[42148, 42163], "valid", [], "NV8"], [[42164, 42164], "valid", [], "NV8"], [[42165, 42176], "valid", [], "NV8"], [[42177, 42177], "valid", [], "NV8"], [[42178, 42180], "valid", [], "NV8"], [[42181, 42181], "valid", [], "NV8"], [[42182, 42182], "valid", [], "NV8"], [[42183, 42191], "disallowed"], [[42192, 42237], "valid"], [[42238, 42239], "valid", [], "NV8"], [[42240, 42508], "valid"], [[42509, 42511], "valid", [], "NV8"], [[42512, 42539], "valid"], [[42540, 42559], "disallowed"], [[42560, 42560], "mapped", [42561]], [[42561, 42561], "valid"], [[42562, 42562], "mapped", [42563]], [[42563, 42563], "valid"], [[42564, 42564], "mapped", [42565]], [[42565, 42565], "valid"], [[42566, 42566], "mapped", [42567]], [[42567, 42567], "valid"], [[42568, 42568], "mapped", [42569]], [[42569, 42569], "valid"], [[42570, 42570], "mapped", [42571]], [[42571, 42571], "valid"], [[42572, 42572], "mapped", [42573]], [[42573, 42573], "valid"], [[42574, 42574], "mapped", [42575]], [[42575, 42575], "valid"], [[42576, 42576], "mapped", [42577]], [[42577, 42577], "valid"], [[42578, 42578], "mapped", [42579]], [[42579, 42579], "valid"], [[42580, 42580], "mapped", [42581]], [[42581, 42581], "valid"], [[42582, 42582], "mapped", [42583]], [[42583, 42583], "valid"], [[42584, 42584], "mapped", [42585]], [[42585, 42585], "valid"], [[42586, 42586], "mapped", [42587]], [[42587, 42587], "valid"], [[42588, 42588], "mapped", [42589]], [[42589, 42589], "valid"], [[42590, 42590], "mapped", [42591]], [[42591, 42591], "valid"], [[42592, 42592], "mapped", [42593]], [[42593, 42593], "valid"], [[42594, 42594], "mapped", [42595]], [[42595, 42595], "valid"], [[42596, 42596], "mapped", [42597]], [[42597, 42597], "valid"], [[42598, 42598], "mapped", [42599]], [[42599, 42599], "valid"], [[42600, 42600], "mapped", [42601]], [[42601, 42601], "valid"], [[42602, 42602], "mapped", [42603]], [[42603, 42603], "valid"], [[42604, 42604], "mapped", [42605]], [[42605, 42607], "valid"], [[42608, 42611], "valid", [], "NV8"], [[42612, 42619], "valid"], [[42620, 42621], "valid"], [[42622, 42622], "valid", [], "NV8"], [[42623, 42623], "valid"], [[42624, 42624], "mapped", [42625]], [[42625, 42625], "valid"], [[42626, 42626], "mapped", [42627]], [[42627, 42627], "valid"], [[42628, 42628], "mapped", [42629]], [[42629, 42629], "valid"], [[42630, 42630], "mapped", [42631]], [[42631, 42631], "valid"], [[42632, 42632], "mapped", [42633]], [[42633, 42633], "valid"], [[42634, 42634], "mapped", [42635]], [[42635, 42635], "valid"], [[42636, 42636], "mapped", [42637]], [[42637, 42637], "valid"], [[42638, 42638], "mapped", [42639]], [[42639, 42639], "valid"], [[42640, 42640], "mapped", [42641]], [[42641, 42641], "valid"], [[42642, 42642], "mapped", [42643]], [[42643, 42643], "valid"], [[42644, 42644], "mapped", [42645]], [[42645, 42645], "valid"], [[42646, 42646], "mapped", [42647]], [[42647, 42647], "valid"], [[42648, 42648], "mapped", [42649]], [[42649, 42649], "valid"], [[42650, 42650], "mapped", [42651]], [[42651, 42651], "valid"], [[42652, 42652], "mapped", [1098]], [[42653, 42653], "mapped", [1100]], [[42654, 42654], "valid"], [[42655, 42655], "valid"], [[42656, 42725], "valid"], [[42726, 42735], "valid", [], "NV8"], [[42736, 42737], "valid"], [[42738, 42743], "valid", [], "NV8"], [[42744, 42751], "disallowed"], [[42752, 42774], "valid", [], "NV8"], [[42775, 42778], "valid"], [[42779, 42783], "valid"], [[42784, 42785], "valid", [], "NV8"], [[42786, 42786], "mapped", [42787]], [[42787, 42787], "valid"], [[42788, 42788], "mapped", [42789]], [[42789, 42789], "valid"], [[42790, 42790], "mapped", [42791]], [[42791, 42791], "valid"], [[42792, 42792], "mapped", [42793]], [[42793, 42793], "valid"], [[42794, 42794], "mapped", [42795]], [[42795, 42795], "valid"], [[42796, 42796], "mapped", [42797]], [[42797, 42797], "valid"], [[42798, 42798], "mapped", [42799]], [[42799, 42801], "valid"], [[42802, 42802], "mapped", [42803]], [[42803, 42803], "valid"], [[42804, 42804], "mapped", [42805]], [[42805, 42805], "valid"], [[42806, 42806], "mapped", [42807]], [[42807, 42807], "valid"], [[42808, 42808], "mapped", [42809]], [[42809, 42809], "valid"], [[42810, 42810], "mapped", [42811]], [[42811, 42811], "valid"], [[42812, 42812], "mapped", [42813]], [[42813, 42813], "valid"], [[42814, 42814], "mapped", [42815]], [[42815, 42815], "valid"], [[42816, 42816], "mapped", [42817]], [[42817, 42817], "valid"], [[42818, 42818], "mapped", [42819]], [[42819, 42819], "valid"], [[42820, 42820], "mapped", [42821]], [[42821, 42821], "valid"], [[42822, 42822], "mapped", [42823]], [[42823, 42823], "valid"], [[42824, 42824], "mapped", [42825]], [[42825, 42825], "valid"], [[42826, 42826], "mapped", [42827]], [[42827, 42827], "valid"], [[42828, 42828], "mapped", [42829]], [[42829, 42829], "valid"], [[42830, 42830], "mapped", [42831]], [[42831, 42831], "valid"], [[42832, 42832], "mapped", [42833]], [[42833, 42833], "valid"], [[42834, 42834], "mapped", [42835]], [[42835, 42835], "valid"], [[42836, 42836], "mapped", [42837]], [[42837, 42837], "valid"], [[42838, 42838], "mapped", [42839]], [[42839, 42839], "valid"], [[42840, 42840], "mapped", [42841]], [[42841, 42841], "valid"], [[42842, 42842], "mapped", [42843]], [[42843, 42843], "valid"], [[42844, 42844], "mapped", [42845]], [[42845, 42845], "valid"], [[42846, 42846], "mapped", [42847]], [[42847, 42847], "valid"], [[42848, 42848], "mapped", [42849]], [[42849, 42849], "valid"], [[42850, 42850], "mapped", [42851]], [[42851, 42851], "valid"], [[42852, 42852], "mapped", [42853]], [[42853, 42853], "valid"], [[42854, 42854], "mapped", [42855]], [[42855, 42855], "valid"], [[42856, 42856], "mapped", [42857]], [[42857, 42857], "valid"], [[42858, 42858], "mapped", [42859]], [[42859, 42859], "valid"], [[42860, 42860], "mapped", [42861]], [[42861, 42861], "valid"], [[42862, 42862], "mapped", [42863]], [[42863, 42863], "valid"], [[42864, 42864], "mapped", [42863]], [[42865, 42872], "valid"], [[42873, 42873], "mapped", [42874]], [[42874, 42874], "valid"], [[42875, 42875], "mapped", [42876]], [[42876, 42876], "valid"], [[42877, 42877], "mapped", [7545]], [[42878, 42878], "mapped", [42879]], [[42879, 42879], "valid"], [[42880, 42880], "mapped", [42881]], [[42881, 42881], "valid"], [[42882, 42882], "mapped", [42883]], [[42883, 42883], "valid"], [[42884, 42884], "mapped", [42885]], [[42885, 42885], "valid"], [[42886, 42886], "mapped", [42887]], [[42887, 42888], "valid"], [[42889, 42890], "valid", [], "NV8"], [[42891, 42891], "mapped", [42892]], [[42892, 42892], "valid"], [[42893, 42893], "mapped", [613]], [[42894, 42894], "valid"], [[42895, 42895], "valid"], [[42896, 42896], "mapped", [42897]], [[42897, 42897], "valid"], [[42898, 42898], "mapped", [42899]], [[42899, 42899], "valid"], [[42900, 42901], "valid"], [[42902, 42902], "mapped", [42903]], [[42903, 42903], "valid"], [[42904, 42904], "mapped", [42905]], [[42905, 42905], "valid"], [[42906, 42906], "mapped", [42907]], [[42907, 42907], "valid"], [[42908, 42908], "mapped", [42909]], [[42909, 42909], "valid"], [[42910, 42910], "mapped", [42911]], [[42911, 42911], "valid"], [[42912, 42912], "mapped", [42913]], [[42913, 42913], "valid"], [[42914, 42914], "mapped", [42915]], [[42915, 42915], "valid"], [[42916, 42916], "mapped", [42917]], [[42917, 42917], "valid"], [[42918, 42918], "mapped", [42919]], [[42919, 42919], "valid"], [[42920, 42920], "mapped", [42921]], [[42921, 42921], "valid"], [[42922, 42922], "mapped", [614]], [[42923, 42923], "mapped", [604]], [[42924, 42924], "mapped", [609]], [[42925, 42925], "mapped", [620]], [[42926, 42927], "disallowed"], [[42928, 42928], "mapped", [670]], [[42929, 42929], "mapped", [647]], [[42930, 42930], "mapped", [669]], [[42931, 42931], "mapped", [43859]], [[42932, 42932], "mapped", [42933]], [[42933, 42933], "valid"], [[42934, 42934], "mapped", [42935]], [[42935, 42935], "valid"], [[42936, 42998], "disallowed"], [[42999, 42999], "valid"], [[43e3, 43e3], "mapped", [295]], [[43001, 43001], "mapped", [339]], [[43002, 43002], "valid"], [[43003, 43007], "valid"], [[43008, 43047], "valid"], [[43048, 43051], "valid", [], "NV8"], [[43052, 43055], "disallowed"], [[43056, 43065], "valid", [], "NV8"], [[43066, 43071], "disallowed"], [[43072, 43123], "valid"], [[43124, 43127], "valid", [], "NV8"], [[43128, 43135], "disallowed"], [[43136, 43204], "valid"], [[43205, 43213], "disallowed"], [[43214, 43215], "valid", [], "NV8"], [[43216, 43225], "valid"], [[43226, 43231], "disallowed"], [[43232, 43255], "valid"], [[43256, 43258], "valid", [], "NV8"], [[43259, 43259], "valid"], [[43260, 43260], "valid", [], "NV8"], [[43261, 43261], "valid"], [[43262, 43263], "disallowed"], [[43264, 43309], "valid"], [[43310, 43311], "valid", [], "NV8"], [[43312, 43347], "valid"], [[43348, 43358], "disallowed"], [[43359, 43359], "valid", [], "NV8"], [[43360, 43388], "valid", [], "NV8"], [[43389, 43391], "disallowed"], [[43392, 43456], "valid"], [[43457, 43469], "valid", [], "NV8"], [[43470, 43470], "disallowed"], [[43471, 43481], "valid"], [[43482, 43485], "disallowed"], [[43486, 43487], "valid", [], "NV8"], [[43488, 43518], "valid"], [[43519, 43519], "disallowed"], [[43520, 43574], "valid"], [[43575, 43583], "disallowed"], [[43584, 43597], "valid"], [[43598, 43599], "disallowed"], [[43600, 43609], "valid"], [[43610, 43611], "disallowed"], [[43612, 43615], "valid", [], "NV8"], [[43616, 43638], "valid"], [[43639, 43641], "valid", [], "NV8"], [[43642, 43643], "valid"], [[43644, 43647], "valid"], [[43648, 43714], "valid"], [[43715, 43738], "disallowed"], [[43739, 43741], "valid"], [[43742, 43743], "valid", [], "NV8"], [[43744, 43759], "valid"], [[43760, 43761], "valid", [], "NV8"], [[43762, 43766], "valid"], [[43767, 43776], "disallowed"], [[43777, 43782], "valid"], [[43783, 43784], "disallowed"], [[43785, 43790], "valid"], [[43791, 43792], "disallowed"], [[43793, 43798], "valid"], [[43799, 43807], "disallowed"], [[43808, 43814], "valid"], [[43815, 43815], "disallowed"], [[43816, 43822], "valid"], [[43823, 43823], "disallowed"], [[43824, 43866], "valid"], [[43867, 43867], "valid", [], "NV8"], [[43868, 43868], "mapped", [42791]], [[43869, 43869], "mapped", [43831]], [[43870, 43870], "mapped", [619]], [[43871, 43871], "mapped", [43858]], [[43872, 43875], "valid"], [[43876, 43877], "valid"], [[43878, 43887], "disallowed"], [[43888, 43888], "mapped", [5024]], [[43889, 43889], "mapped", [5025]], [[43890, 43890], "mapped", [5026]], [[43891, 43891], "mapped", [5027]], [[43892, 43892], "mapped", [5028]], [[43893, 43893], "mapped", [5029]], [[43894, 43894], "mapped", [5030]], [[43895, 43895], "mapped", [5031]], [[43896, 43896], "mapped", [5032]], [[43897, 43897], "mapped", [5033]], [[43898, 43898], "mapped", [5034]], [[43899, 43899], "mapped", [5035]], [[43900, 43900], "mapped", [5036]], [[43901, 43901], "mapped", [5037]], [[43902, 43902], "mapped", [5038]], [[43903, 43903], "mapped", [5039]], [[43904, 43904], "mapped", [5040]], [[43905, 43905], "mapped", [5041]], [[43906, 43906], "mapped", [5042]], [[43907, 43907], "mapped", [5043]], [[43908, 43908], "mapped", [5044]], [[43909, 43909], "mapped", [5045]], [[43910, 43910], "mapped", [5046]], [[43911, 43911], "mapped", [5047]], [[43912, 43912], "mapped", [5048]], [[43913, 43913], "mapped", [5049]], [[43914, 43914], "mapped", [5050]], [[43915, 43915], "mapped", [5051]], [[43916, 43916], "mapped", [5052]], [[43917, 43917], "mapped", [5053]], [[43918, 43918], "mapped", [5054]], [[43919, 43919], "mapped", [5055]], [[43920, 43920], "mapped", [5056]], [[43921, 43921], "mapped", [5057]], [[43922, 43922], "mapped", [5058]], [[43923, 43923], "mapped", [5059]], [[43924, 43924], "mapped", [5060]], [[43925, 43925], "mapped", [5061]], [[43926, 43926], "mapped", [5062]], [[43927, 43927], "mapped", [5063]], [[43928, 43928], "mapped", [5064]], [[43929, 43929], "mapped", [5065]], [[43930, 43930], "mapped", [5066]], [[43931, 43931], "mapped", [5067]], [[43932, 43932], "mapped", [5068]], [[43933, 43933], "mapped", [5069]], [[43934, 43934], "mapped", [5070]], [[43935, 43935], "mapped", [5071]], [[43936, 43936], "mapped", [5072]], [[43937, 43937], "mapped", [5073]], [[43938, 43938], "mapped", [5074]], [[43939, 43939], "mapped", [5075]], [[43940, 43940], "mapped", [5076]], [[43941, 43941], "mapped", [5077]], [[43942, 43942], "mapped", [5078]], [[43943, 43943], "mapped", [5079]], [[43944, 43944], "mapped", [5080]], [[43945, 43945], "mapped", [5081]], [[43946, 43946], "mapped", [5082]], [[43947, 43947], "mapped", [5083]], [[43948, 43948], "mapped", [5084]], [[43949, 43949], "mapped", [5085]], [[43950, 43950], "mapped", [5086]], [[43951, 43951], "mapped", [5087]], [[43952, 43952], "mapped", [5088]], [[43953, 43953], "mapped", [5089]], [[43954, 43954], "mapped", [5090]], [[43955, 43955], "mapped", [5091]], [[43956, 43956], "mapped", [5092]], [[43957, 43957], "mapped", [5093]], [[43958, 43958], "mapped", [5094]], [[43959, 43959], "mapped", [5095]], [[43960, 43960], "mapped", [5096]], [[43961, 43961], "mapped", [5097]], [[43962, 43962], "mapped", [5098]], [[43963, 43963], "mapped", [5099]], [[43964, 43964], "mapped", [5100]], [[43965, 43965], "mapped", [5101]], [[43966, 43966], "mapped", [5102]], [[43967, 43967], "mapped", [5103]], [[43968, 44010], "valid"], [[44011, 44011], "valid", [], "NV8"], [[44012, 44013], "valid"], [[44014, 44015], "disallowed"], [[44016, 44025], "valid"], [[44026, 44031], "disallowed"], [[44032, 55203], "valid"], [[55204, 55215], "disallowed"], [[55216, 55238], "valid", [], "NV8"], [[55239, 55242], "disallowed"], [[55243, 55291], "valid", [], "NV8"], [[55292, 55295], "disallowed"], [[55296, 57343], "disallowed"], [[57344, 63743], "disallowed"], [[63744, 63744], "mapped", [35912]], [[63745, 63745], "mapped", [26356]], [[63746, 63746], "mapped", [36554]], [[63747, 63747], "mapped", [36040]], [[63748, 63748], "mapped", [28369]], [[63749, 63749], "mapped", [20018]], [[63750, 63750], "mapped", [21477]], [[63751, 63752], "mapped", [40860]], [[63753, 63753], "mapped", [22865]], [[63754, 63754], "mapped", [37329]], [[63755, 63755], "mapped", [21895]], [[63756, 63756], "mapped", [22856]], [[63757, 63757], "mapped", [25078]], [[63758, 63758], "mapped", [30313]], [[63759, 63759], "mapped", [32645]], [[63760, 63760], "mapped", [34367]], [[63761, 63761], "mapped", [34746]], [[63762, 63762], "mapped", [35064]], [[63763, 63763], "mapped", [37007]], [[63764, 63764], "mapped", [27138]], [[63765, 63765], "mapped", [27931]], [[63766, 63766], "mapped", [28889]], [[63767, 63767], "mapped", [29662]], [[63768, 63768], "mapped", [33853]], [[63769, 63769], "mapped", [37226]], [[63770, 63770], "mapped", [39409]], [[63771, 63771], "mapped", [20098]], [[63772, 63772], "mapped", [21365]], [[63773, 63773], "mapped", [27396]], [[63774, 63774], "mapped", [29211]], [[63775, 63775], "mapped", [34349]], [[63776, 63776], "mapped", [40478]], [[63777, 63777], "mapped", [23888]], [[63778, 63778], "mapped", [28651]], [[63779, 63779], "mapped", [34253]], [[63780, 63780], "mapped", [35172]], [[63781, 63781], "mapped", [25289]], [[63782, 63782], "mapped", [33240]], [[63783, 63783], "mapped", [34847]], [[63784, 63784], "mapped", [24266]], [[63785, 63785], "mapped", [26391]], [[63786, 63786], "mapped", [28010]], [[63787, 63787], "mapped", [29436]], [[63788, 63788], "mapped", [37070]], [[63789, 63789], "mapped", [20358]], [[63790, 63790], "mapped", [20919]], [[63791, 63791], "mapped", [21214]], [[63792, 63792], "mapped", [25796]], [[63793, 63793], "mapped", [27347]], [[63794, 63794], "mapped", [29200]], [[63795, 63795], "mapped", [30439]], [[63796, 63796], "mapped", [32769]], [[63797, 63797], "mapped", [34310]], [[63798, 63798], "mapped", [34396]], [[63799, 63799], "mapped", [36335]], [[63800, 63800], "mapped", [38706]], [[63801, 63801], "mapped", [39791]], [[63802, 63802], "mapped", [40442]], [[63803, 63803], "mapped", [30860]], [[63804, 63804], "mapped", [31103]], [[63805, 63805], "mapped", [32160]], [[63806, 63806], "mapped", [33737]], [[63807, 63807], "mapped", [37636]], [[63808, 63808], "mapped", [40575]], [[63809, 63809], "mapped", [35542]], [[63810, 63810], "mapped", [22751]], [[63811, 63811], "mapped", [24324]], [[63812, 63812], "mapped", [31840]], [[63813, 63813], "mapped", [32894]], [[63814, 63814], "mapped", [29282]], [[63815, 63815], "mapped", [30922]], [[63816, 63816], "mapped", [36034]], [[63817, 63817], "mapped", [38647]], [[63818, 63818], "mapped", [22744]], [[63819, 63819], "mapped", [23650]], [[63820, 63820], "mapped", [27155]], [[63821, 63821], "mapped", [28122]], [[63822, 63822], "mapped", [28431]], [[63823, 63823], "mapped", [32047]], [[63824, 63824], "mapped", [32311]], [[63825, 63825], "mapped", [38475]], [[63826, 63826], "mapped", [21202]], [[63827, 63827], "mapped", [32907]], [[63828, 63828], "mapped", [20956]], [[63829, 63829], "mapped", [20940]], [[63830, 63830], "mapped", [31260]], [[63831, 63831], "mapped", [32190]], [[63832, 63832], "mapped", [33777]], [[63833, 63833], "mapped", [38517]], [[63834, 63834], "mapped", [35712]], [[63835, 63835], "mapped", [25295]], [[63836, 63836], "mapped", [27138]], [[63837, 63837], "mapped", [35582]], [[63838, 63838], "mapped", [20025]], [[63839, 63839], "mapped", [23527]], [[63840, 63840], "mapped", [24594]], [[63841, 63841], "mapped", [29575]], [[63842, 63842], "mapped", [30064]], [[63843, 63843], "mapped", [21271]], [[63844, 63844], "mapped", [30971]], [[63845, 63845], "mapped", [20415]], [[63846, 63846], "mapped", [24489]], [[63847, 63847], "mapped", [19981]], [[63848, 63848], "mapped", [27852]], [[63849, 63849], "mapped", [25976]], [[63850, 63850], "mapped", [32034]], [[63851, 63851], "mapped", [21443]], [[63852, 63852], "mapped", [22622]], [[63853, 63853], "mapped", [30465]], [[63854, 63854], "mapped", [33865]], [[63855, 63855], "mapped", [35498]], [[63856, 63856], "mapped", [27578]], [[63857, 63857], "mapped", [36784]], [[63858, 63858], "mapped", [27784]], [[63859, 63859], "mapped", [25342]], [[63860, 63860], "mapped", [33509]], [[63861, 63861], "mapped", [25504]], [[63862, 63862], "mapped", [30053]], [[63863, 63863], "mapped", [20142]], [[63864, 63864], "mapped", [20841]], [[63865, 63865], "mapped", [20937]], [[63866, 63866], "mapped", [26753]], [[63867, 63867], "mapped", [31975]], [[63868, 63868], "mapped", [33391]], [[63869, 63869], "mapped", [35538]], [[63870, 63870], "mapped", [37327]], [[63871, 63871], "mapped", [21237]], [[63872, 63872], "mapped", [21570]], [[63873, 63873], "mapped", [22899]], [[63874, 63874], "mapped", [24300]], [[63875, 63875], "mapped", [26053]], [[63876, 63876], "mapped", [28670]], [[63877, 63877], "mapped", [31018]], [[63878, 63878], "mapped", [38317]], [[63879, 63879], "mapped", [39530]], [[63880, 63880], "mapped", [40599]], [[63881, 63881], "mapped", [40654]], [[63882, 63882], "mapped", [21147]], [[63883, 63883], "mapped", [26310]], [[63884, 63884], "mapped", [27511]], [[63885, 63885], "mapped", [36706]], [[63886, 63886], "mapped", [24180]], [[63887, 63887], "mapped", [24976]], [[63888, 63888], "mapped", [25088]], [[63889, 63889], "mapped", [25754]], [[63890, 63890], "mapped", [28451]], [[63891, 63891], "mapped", [29001]], [[63892, 63892], "mapped", [29833]], [[63893, 63893], "mapped", [31178]], [[63894, 63894], "mapped", [32244]], [[63895, 63895], "mapped", [32879]], [[63896, 63896], "mapped", [36646]], [[63897, 63897], "mapped", [34030]], [[63898, 63898], "mapped", [36899]], [[63899, 63899], "mapped", [37706]], [[63900, 63900], "mapped", [21015]], [[63901, 63901], "mapped", [21155]], [[63902, 63902], "mapped", [21693]], [[63903, 63903], "mapped", [28872]], [[63904, 63904], "mapped", [35010]], [[63905, 63905], "mapped", [35498]], [[63906, 63906], "mapped", [24265]], [[63907, 63907], "mapped", [24565]], [[63908, 63908], "mapped", [25467]], [[63909, 63909], "mapped", [27566]], [[63910, 63910], "mapped", [31806]], [[63911, 63911], "mapped", [29557]], [[63912, 63912], "mapped", [20196]], [[63913, 63913], "mapped", [22265]], [[63914, 63914], "mapped", [23527]], [[63915, 63915], "mapped", [23994]], [[63916, 63916], "mapped", [24604]], [[63917, 63917], "mapped", [29618]], [[63918, 63918], "mapped", [29801]], [[63919, 63919], "mapped", [32666]], [[63920, 63920], "mapped", [32838]], [[63921, 63921], "mapped", [37428]], [[63922, 63922], "mapped", [38646]], [[63923, 63923], "mapped", [38728]], [[63924, 63924], "mapped", [38936]], [[63925, 63925], "mapped", [20363]], [[63926, 63926], "mapped", [31150]], [[63927, 63927], "mapped", [37300]], [[63928, 63928], "mapped", [38584]], [[63929, 63929], "mapped", [24801]], [[63930, 63930], "mapped", [20102]], [[63931, 63931], "mapped", [20698]], [[63932, 63932], "mapped", [23534]], [[63933, 63933], "mapped", [23615]], [[63934, 63934], "mapped", [26009]], [[63935, 63935], "mapped", [27138]], [[63936, 63936], "mapped", [29134]], [[63937, 63937], "mapped", [30274]], [[63938, 63938], "mapped", [34044]], [[63939, 63939], "mapped", [36988]], [[63940, 63940], "mapped", [40845]], [[63941, 63941], "mapped", [26248]], [[63942, 63942], "mapped", [38446]], [[63943, 63943], "mapped", [21129]], [[63944, 63944], "mapped", [26491]], [[63945, 63945], "mapped", [26611]], [[63946, 63946], "mapped", [27969]], [[63947, 63947], "mapped", [28316]], [[63948, 63948], "mapped", [29705]], [[63949, 63949], "mapped", [30041]], [[63950, 63950], "mapped", [30827]], [[63951, 63951], "mapped", [32016]], [[63952, 63952], "mapped", [39006]], [[63953, 63953], "mapped", [20845]], [[63954, 63954], "mapped", [25134]], [[63955, 63955], "mapped", [38520]], [[63956, 63956], "mapped", [20523]], [[63957, 63957], "mapped", [23833]], [[63958, 63958], "mapped", [28138]], [[63959, 63959], "mapped", [36650]], [[63960, 63960], "mapped", [24459]], [[63961, 63961], "mapped", [24900]], [[63962, 63962], "mapped", [26647]], [[63963, 63963], "mapped", [29575]], [[63964, 63964], "mapped", [38534]], [[63965, 63965], "mapped", [21033]], [[63966, 63966], "mapped", [21519]], [[63967, 63967], "mapped", [23653]], [[63968, 63968], "mapped", [26131]], [[63969, 63969], "mapped", [26446]], [[63970, 63970], "mapped", [26792]], [[63971, 63971], "mapped", [27877]], [[63972, 63972], "mapped", [29702]], [[63973, 63973], "mapped", [30178]], [[63974, 63974], "mapped", [32633]], [[63975, 63975], "mapped", [35023]], [[63976, 63976], "mapped", [35041]], [[63977, 63977], "mapped", [37324]], [[63978, 63978], "mapped", [38626]], [[63979, 63979], "mapped", [21311]], [[63980, 63980], "mapped", [28346]], [[63981, 63981], "mapped", [21533]], [[63982, 63982], "mapped", [29136]], [[63983, 63983], "mapped", [29848]], [[63984, 63984], "mapped", [34298]], [[63985, 63985], "mapped", [38563]], [[63986, 63986], "mapped", [40023]], [[63987, 63987], "mapped", [40607]], [[63988, 63988], "mapped", [26519]], [[63989, 63989], "mapped", [28107]], [[63990, 63990], "mapped", [33256]], [[63991, 63991], "mapped", [31435]], [[63992, 63992], "mapped", [31520]], [[63993, 63993], "mapped", [31890]], [[63994, 63994], "mapped", [29376]], [[63995, 63995], "mapped", [28825]], [[63996, 63996], "mapped", [35672]], [[63997, 63997], "mapped", [20160]], [[63998, 63998], "mapped", [33590]], [[63999, 63999], "mapped", [21050]], [[64e3, 64e3], "mapped", [20999]], [[64001, 64001], "mapped", [24230]], [[64002, 64002], "mapped", [25299]], [[64003, 64003], "mapped", [31958]], [[64004, 64004], "mapped", [23429]], [[64005, 64005], "mapped", [27934]], [[64006, 64006], "mapped", [26292]], [[64007, 64007], "mapped", [36667]], [[64008, 64008], "mapped", [34892]], [[64009, 64009], "mapped", [38477]], [[64010, 64010], "mapped", [35211]], [[64011, 64011], "mapped", [24275]], [[64012, 64012], "mapped", [20800]], [[64013, 64013], "mapped", [21952]], [[64014, 64015], "valid"], [[64016, 64016], "mapped", [22618]], [[64017, 64017], "valid"], [[64018, 64018], "mapped", [26228]], [[64019, 64020], "valid"], [[64021, 64021], "mapped", [20958]], [[64022, 64022], "mapped", [29482]], [[64023, 64023], "mapped", [30410]], [[64024, 64024], "mapped", [31036]], [[64025, 64025], "mapped", [31070]], [[64026, 64026], "mapped", [31077]], [[64027, 64027], "mapped", [31119]], [[64028, 64028], "mapped", [38742]], [[64029, 64029], "mapped", [31934]], [[64030, 64030], "mapped", [32701]], [[64031, 64031], "valid"], [[64032, 64032], "mapped", [34322]], [[64033, 64033], "valid"], [[64034, 64034], "mapped", [35576]], [[64035, 64036], "valid"], [[64037, 64037], "mapped", [36920]], [[64038, 64038], "mapped", [37117]], [[64039, 64041], "valid"], [[64042, 64042], "mapped", [39151]], [[64043, 64043], "mapped", [39164]], [[64044, 64044], "mapped", [39208]], [[64045, 64045], "mapped", [40372]], [[64046, 64046], "mapped", [37086]], [[64047, 64047], "mapped", [38583]], [[64048, 64048], "mapped", [20398]], [[64049, 64049], "mapped", [20711]], [[64050, 64050], "mapped", [20813]], [[64051, 64051], "mapped", [21193]], [[64052, 64052], "mapped", [21220]], [[64053, 64053], "mapped", [21329]], [[64054, 64054], "mapped", [21917]], [[64055, 64055], "mapped", [22022]], [[64056, 64056], "mapped", [22120]], [[64057, 64057], "mapped", [22592]], [[64058, 64058], "mapped", [22696]], [[64059, 64059], "mapped", [23652]], [[64060, 64060], "mapped", [23662]], [[64061, 64061], "mapped", [24724]], [[64062, 64062], "mapped", [24936]], [[64063, 64063], "mapped", [24974]], [[64064, 64064], "mapped", [25074]], [[64065, 64065], "mapped", [25935]], [[64066, 64066], "mapped", [26082]], [[64067, 64067], "mapped", [26257]], [[64068, 64068], "mapped", [26757]], [[64069, 64069], "mapped", [28023]], [[64070, 64070], "mapped", [28186]], [[64071, 64071], "mapped", [28450]], [[64072, 64072], "mapped", [29038]], [[64073, 64073], "mapped", [29227]], [[64074, 64074], "mapped", [29730]], [[64075, 64075], "mapped", [30865]], [[64076, 64076], "mapped", [31038]], [[64077, 64077], "mapped", [31049]], [[64078, 64078], "mapped", [31048]], [[64079, 64079], "mapped", [31056]], [[64080, 64080], "mapped", [31062]], [[64081, 64081], "mapped", [31069]], [[64082, 64082], "mapped", [31117]], [[64083, 64083], "mapped", [31118]], [[64084, 64084], "mapped", [31296]], [[64085, 64085], "mapped", [31361]], [[64086, 64086], "mapped", [31680]], [[64087, 64087], "mapped", [32244]], [[64088, 64088], "mapped", [32265]], [[64089, 64089], "mapped", [32321]], [[64090, 64090], "mapped", [32626]], [[64091, 64091], "mapped", [32773]], [[64092, 64092], "mapped", [33261]], [[64093, 64094], "mapped", [33401]], [[64095, 64095], "mapped", [33879]], [[64096, 64096], "mapped", [35088]], [[64097, 64097], "mapped", [35222]], [[64098, 64098], "mapped", [35585]], [[64099, 64099], "mapped", [35641]], [[64100, 64100], "mapped", [36051]], [[64101, 64101], "mapped", [36104]], [[64102, 64102], "mapped", [36790]], [[64103, 64103], "mapped", [36920]], [[64104, 64104], "mapped", [38627]], [[64105, 64105], "mapped", [38911]], [[64106, 64106], "mapped", [38971]], [[64107, 64107], "mapped", [24693]], [[64108, 64108], "mapped", [148206]], [[64109, 64109], "mapped", [33304]], [[64110, 64111], "disallowed"], [[64112, 64112], "mapped", [20006]], [[64113, 64113], "mapped", [20917]], [[64114, 64114], "mapped", [20840]], [[64115, 64115], "mapped", [20352]], [[64116, 64116], "mapped", [20805]], [[64117, 64117], "mapped", [20864]], [[64118, 64118], "mapped", [21191]], [[64119, 64119], "mapped", [21242]], [[64120, 64120], "mapped", [21917]], [[64121, 64121], "mapped", [21845]], [[64122, 64122], "mapped", [21913]], [[64123, 64123], "mapped", [21986]], [[64124, 64124], "mapped", [22618]], [[64125, 64125], "mapped", [22707]], [[64126, 64126], "mapped", [22852]], [[64127, 64127], "mapped", [22868]], [[64128, 64128], "mapped", [23138]], [[64129, 64129], "mapped", [23336]], [[64130, 64130], "mapped", [24274]], [[64131, 64131], "mapped", [24281]], [[64132, 64132], "mapped", [24425]], [[64133, 64133], "mapped", [24493]], [[64134, 64134], "mapped", [24792]], [[64135, 64135], "mapped", [24910]], [[64136, 64136], "mapped", [24840]], [[64137, 64137], "mapped", [24974]], [[64138, 64138], "mapped", [24928]], [[64139, 64139], "mapped", [25074]], [[64140, 64140], "mapped", [25140]], [[64141, 64141], "mapped", [25540]], [[64142, 64142], "mapped", [25628]], [[64143, 64143], "mapped", [25682]], [[64144, 64144], "mapped", [25942]], [[64145, 64145], "mapped", [26228]], [[64146, 64146], "mapped", [26391]], [[64147, 64147], "mapped", [26395]], [[64148, 64148], "mapped", [26454]], [[64149, 64149], "mapped", [27513]], [[64150, 64150], "mapped", [27578]], [[64151, 64151], "mapped", [27969]], [[64152, 64152], "mapped", [28379]], [[64153, 64153], "mapped", [28363]], [[64154, 64154], "mapped", [28450]], [[64155, 64155], "mapped", [28702]], [[64156, 64156], "mapped", [29038]], [[64157, 64157], "mapped", [30631]], [[64158, 64158], "mapped", [29237]], [[64159, 64159], "mapped", [29359]], [[64160, 64160], "mapped", [29482]], [[64161, 64161], "mapped", [29809]], [[64162, 64162], "mapped", [29958]], [[64163, 64163], "mapped", [30011]], [[64164, 64164], "mapped", [30237]], [[64165, 64165], "mapped", [30239]], [[64166, 64166], "mapped", [30410]], [[64167, 64167], "mapped", [30427]], [[64168, 64168], "mapped", [30452]], [[64169, 64169], "mapped", [30538]], [[64170, 64170], "mapped", [30528]], [[64171, 64171], "mapped", [30924]], [[64172, 64172], "mapped", [31409]], [[64173, 64173], "mapped", [31680]], [[64174, 64174], "mapped", [31867]], [[64175, 64175], "mapped", [32091]], [[64176, 64176], "mapped", [32244]], [[64177, 64177], "mapped", [32574]], [[64178, 64178], "mapped", [32773]], [[64179, 64179], "mapped", [33618]], [[64180, 64180], "mapped", [33775]], [[64181, 64181], "mapped", [34681]], [[64182, 64182], "mapped", [35137]], [[64183, 64183], "mapped", [35206]], [[64184, 64184], "mapped", [35222]], [[64185, 64185], "mapped", [35519]], [[64186, 64186], "mapped", [35576]], [[64187, 64187], "mapped", [35531]], [[64188, 64188], "mapped", [35585]], [[64189, 64189], "mapped", [35582]], [[64190, 64190], "mapped", [35565]], [[64191, 64191], "mapped", [35641]], [[64192, 64192], "mapped", [35722]], [[64193, 64193], "mapped", [36104]], [[64194, 64194], "mapped", [36664]], [[64195, 64195], "mapped", [36978]], [[64196, 64196], "mapped", [37273]], [[64197, 64197], "mapped", [37494]], [[64198, 64198], "mapped", [38524]], [[64199, 64199], "mapped", [38627]], [[64200, 64200], "mapped", [38742]], [[64201, 64201], "mapped", [38875]], [[64202, 64202], "mapped", [38911]], [[64203, 64203], "mapped", [38923]], [[64204, 64204], "mapped", [38971]], [[64205, 64205], "mapped", [39698]], [[64206, 64206], "mapped", [40860]], [[64207, 64207], "mapped", [141386]], [[64208, 64208], "mapped", [141380]], [[64209, 64209], "mapped", [144341]], [[64210, 64210], "mapped", [15261]], [[64211, 64211], "mapped", [16408]], [[64212, 64212], "mapped", [16441]], [[64213, 64213], "mapped", [152137]], [[64214, 64214], "mapped", [154832]], [[64215, 64215], "mapped", [163539]], [[64216, 64216], "mapped", [40771]], [[64217, 64217], "mapped", [40846]], [[64218, 64255], "disallowed"], [[64256, 64256], "mapped", [102, 102]], [[64257, 64257], "mapped", [102, 105]], [[64258, 64258], "mapped", [102, 108]], [[64259, 64259], "mapped", [102, 102, 105]], [[64260, 64260], "mapped", [102, 102, 108]], [[64261, 64262], "mapped", [115, 116]], [[64263, 64274], "disallowed"], [[64275, 64275], "mapped", [1396, 1398]], [[64276, 64276], "mapped", [1396, 1381]], [[64277, 64277], "mapped", [1396, 1387]], [[64278, 64278], "mapped", [1406, 1398]], [[64279, 64279], "mapped", [1396, 1389]], [[64280, 64284], "disallowed"], [[64285, 64285], "mapped", [1497, 1460]], [[64286, 64286], "valid"], [[64287, 64287], "mapped", [1522, 1463]], [[64288, 64288], "mapped", [1506]], [[64289, 64289], "mapped", [1488]], [[64290, 64290], "mapped", [1491]], [[64291, 64291], "mapped", [1492]], [[64292, 64292], "mapped", [1499]], [[64293, 64293], "mapped", [1500]], [[64294, 64294], "mapped", [1501]], [[64295, 64295], "mapped", [1512]], [[64296, 64296], "mapped", [1514]], [[64297, 64297], "disallowed_STD3_mapped", [43]], [[64298, 64298], "mapped", [1513, 1473]], [[64299, 64299], "mapped", [1513, 1474]], [[64300, 64300], "mapped", [1513, 1468, 1473]], [[64301, 64301], "mapped", [1513, 1468, 1474]], [[64302, 64302], "mapped", [1488, 1463]], [[64303, 64303], "mapped", [1488, 1464]], [[64304, 64304], "mapped", [1488, 1468]], [[64305, 64305], "mapped", [1489, 1468]], [[64306, 64306], "mapped", [1490, 1468]], [[64307, 64307], "mapped", [1491, 1468]], [[64308, 64308], "mapped", [1492, 1468]], [[64309, 64309], "mapped", [1493, 1468]], [[64310, 64310], "mapped", [1494, 1468]], [[64311, 64311], "disallowed"], [[64312, 64312], "mapped", [1496, 1468]], [[64313, 64313], "mapped", [1497, 1468]], [[64314, 64314], "mapped", [1498, 1468]], [[64315, 64315], "mapped", [1499, 1468]], [[64316, 64316], "mapped", [1500, 1468]], [[64317, 64317], "disallowed"], [[64318, 64318], "mapped", [1502, 1468]], [[64319, 64319], "disallowed"], [[64320, 64320], "mapped", [1504, 1468]], [[64321, 64321], "mapped", [1505, 1468]], [[64322, 64322], "disallowed"], [[64323, 64323], "mapped", [1507, 1468]], [[64324, 64324], "mapped", [1508, 1468]], [[64325, 64325], "disallowed"], [[64326, 64326], "mapped", [1510, 1468]], [[64327, 64327], "mapped", [1511, 1468]], [[64328, 64328], "mapped", [1512, 1468]], [[64329, 64329], "mapped", [1513, 1468]], [[64330, 64330], "mapped", [1514, 1468]], [[64331, 64331], "mapped", [1493, 1465]], [[64332, 64332], "mapped", [1489, 1471]], [[64333, 64333], "mapped", [1499, 1471]], [[64334, 64334], "mapped", [1508, 1471]], [[64335, 64335], "mapped", [1488, 1500]], [[64336, 64337], "mapped", [1649]], [[64338, 64341], "mapped", [1659]], [[64342, 64345], "mapped", [1662]], [[64346, 64349], "mapped", [1664]], [[64350, 64353], "mapped", [1658]], [[64354, 64357], "mapped", [1663]], [[64358, 64361], "mapped", [1657]], [[64362, 64365], "mapped", [1700]], [[64366, 64369], "mapped", [1702]], [[64370, 64373], "mapped", [1668]], [[64374, 64377], "mapped", [1667]], [[64378, 64381], "mapped", [1670]], [[64382, 64385], "mapped", [1671]], [[64386, 64387], "mapped", [1677]], [[64388, 64389], "mapped", [1676]], [[64390, 64391], "mapped", [1678]], [[64392, 64393], "mapped", [1672]], [[64394, 64395], "mapped", [1688]], [[64396, 64397], "mapped", [1681]], [[64398, 64401], "mapped", [1705]], [[64402, 64405], "mapped", [1711]], [[64406, 64409], "mapped", [1715]], [[64410, 64413], "mapped", [1713]], [[64414, 64415], "mapped", [1722]], [[64416, 64419], "mapped", [1723]], [[64420, 64421], "mapped", [1728]], [[64422, 64425], "mapped", [1729]], [[64426, 64429], "mapped", [1726]], [[64430, 64431], "mapped", [1746]], [[64432, 64433], "mapped", [1747]], [[64434, 64449], "valid", [], "NV8"], [[64450, 64466], "disallowed"], [[64467, 64470], "mapped", [1709]], [[64471, 64472], "mapped", [1735]], [[64473, 64474], "mapped", [1734]], [[64475, 64476], "mapped", [1736]], [[64477, 64477], "mapped", [1735, 1652]], [[64478, 64479], "mapped", [1739]], [[64480, 64481], "mapped", [1733]], [[64482, 64483], "mapped", [1737]], [[64484, 64487], "mapped", [1744]], [[64488, 64489], "mapped", [1609]], [[64490, 64491], "mapped", [1574, 1575]], [[64492, 64493], "mapped", [1574, 1749]], [[64494, 64495], "mapped", [1574, 1608]], [[64496, 64497], "mapped", [1574, 1735]], [[64498, 64499], "mapped", [1574, 1734]], [[64500, 64501], "mapped", [1574, 1736]], [[64502, 64504], "mapped", [1574, 1744]], [[64505, 64507], "mapped", [1574, 1609]], [[64508, 64511], "mapped", [1740]], [[64512, 64512], "mapped", [1574, 1580]], [[64513, 64513], "mapped", [1574, 1581]], [[64514, 64514], "mapped", [1574, 1605]], [[64515, 64515], "mapped", [1574, 1609]], [[64516, 64516], "mapped", [1574, 1610]], [[64517, 64517], "mapped", [1576, 1580]], [[64518, 64518], "mapped", [1576, 1581]], [[64519, 64519], "mapped", [1576, 1582]], [[64520, 64520], "mapped", [1576, 1605]], [[64521, 64521], "mapped", [1576, 1609]], [[64522, 64522], "mapped", [1576, 1610]], [[64523, 64523], "mapped", [1578, 1580]], [[64524, 64524], "mapped", [1578, 1581]], [[64525, 64525], "mapped", [1578, 1582]], [[64526, 64526], "mapped", [1578, 1605]], [[64527, 64527], "mapped", [1578, 1609]], [[64528, 64528], "mapped", [1578, 1610]], [[64529, 64529], "mapped", [1579, 1580]], [[64530, 64530], "mapped", [1579, 1605]], [[64531, 64531], "mapped", [1579, 1609]], [[64532, 64532], "mapped", [1579, 1610]], [[64533, 64533], "mapped", [1580, 1581]], [[64534, 64534], "mapped", [1580, 1605]], [[64535, 64535], "mapped", [1581, 1580]], [[64536, 64536], "mapped", [1581, 1605]], [[64537, 64537], "mapped", [1582, 1580]], [[64538, 64538], "mapped", [1582, 1581]], [[64539, 64539], "mapped", [1582, 1605]], [[64540, 64540], "mapped", [1587, 1580]], [[64541, 64541], "mapped", [1587, 1581]], [[64542, 64542], "mapped", [1587, 1582]], [[64543, 64543], "mapped", [1587, 1605]], [[64544, 64544], "mapped", [1589, 1581]], [[64545, 64545], "mapped", [1589, 1605]], [[64546, 64546], "mapped", [1590, 1580]], [[64547, 64547], "mapped", [1590, 1581]], [[64548, 64548], "mapped", [1590, 1582]], [[64549, 64549], "mapped", [1590, 1605]], [[64550, 64550], "mapped", [1591, 1581]], [[64551, 64551], "mapped", [1591, 1605]], [[64552, 64552], "mapped", [1592, 1605]], [[64553, 64553], "mapped", [1593, 1580]], [[64554, 64554], "mapped", [1593, 1605]], [[64555, 64555], "mapped", [1594, 1580]], [[64556, 64556], "mapped", [1594, 1605]], [[64557, 64557], "mapped", [1601, 1580]], [[64558, 64558], "mapped", [1601, 1581]], [[64559, 64559], "mapped", [1601, 1582]], [[64560, 64560], "mapped", [1601, 1605]], [[64561, 64561], "mapped", [1601, 1609]], [[64562, 64562], "mapped", [1601, 1610]], [[64563, 64563], "mapped", [1602, 1581]], [[64564, 64564], "mapped", [1602, 1605]], [[64565, 64565], "mapped", [1602, 1609]], [[64566, 64566], "mapped", [1602, 1610]], [[64567, 64567], "mapped", [1603, 1575]], [[64568, 64568], "mapped", [1603, 1580]], [[64569, 64569], "mapped", [1603, 1581]], [[64570, 64570], "mapped", [1603, 1582]], [[64571, 64571], "mapped", [1603, 1604]], [[64572, 64572], "mapped", [1603, 1605]], [[64573, 64573], "mapped", [1603, 1609]], [[64574, 64574], "mapped", [1603, 1610]], [[64575, 64575], "mapped", [1604, 1580]], [[64576, 64576], "mapped", [1604, 1581]], [[64577, 64577], "mapped", [1604, 1582]], [[64578, 64578], "mapped", [1604, 1605]], [[64579, 64579], "mapped", [1604, 1609]], [[64580, 64580], "mapped", [1604, 1610]], [[64581, 64581], "mapped", [1605, 1580]], [[64582, 64582], "mapped", [1605, 1581]], [[64583, 64583], "mapped", [1605, 1582]], [[64584, 64584], "mapped", [1605, 1605]], [[64585, 64585], "mapped", [1605, 1609]], [[64586, 64586], "mapped", [1605, 1610]], [[64587, 64587], "mapped", [1606, 1580]], [[64588, 64588], "mapped", [1606, 1581]], [[64589, 64589], "mapped", [1606, 1582]], [[64590, 64590], "mapped", [1606, 1605]], [[64591, 64591], "mapped", [1606, 1609]], [[64592, 64592], "mapped", [1606, 1610]], [[64593, 64593], "mapped", [1607, 1580]], [[64594, 64594], "mapped", [1607, 1605]], [[64595, 64595], "mapped", [1607, 1609]], [[64596, 64596], "mapped", [1607, 1610]], [[64597, 64597], "mapped", [1610, 1580]], [[64598, 64598], "mapped", [1610, 1581]], [[64599, 64599], "mapped", [1610, 1582]], [[64600, 64600], "mapped", [1610, 1605]], [[64601, 64601], "mapped", [1610, 1609]], [[64602, 64602], "mapped", [1610, 1610]], [[64603, 64603], "mapped", [1584, 1648]], [[64604, 64604], "mapped", [1585, 1648]], [[64605, 64605], "mapped", [1609, 1648]], [[64606, 64606], "disallowed_STD3_mapped", [32, 1612, 1617]], [[64607, 64607], "disallowed_STD3_mapped", [32, 1613, 1617]], [[64608, 64608], "disallowed_STD3_mapped", [32, 1614, 1617]], [[64609, 64609], "disallowed_STD3_mapped", [32, 1615, 1617]], [[64610, 64610], "disallowed_STD3_mapped", [32, 1616, 1617]], [[64611, 64611], "disallowed_STD3_mapped", [32, 1617, 1648]], [[64612, 64612], "mapped", [1574, 1585]], [[64613, 64613], "mapped", [1574, 1586]], [[64614, 64614], "mapped", [1574, 1605]], [[64615, 64615], "mapped", [1574, 1606]], [[64616, 64616], "mapped", [1574, 1609]], [[64617, 64617], "mapped", [1574, 1610]], [[64618, 64618], "mapped", [1576, 1585]], [[64619, 64619], "mapped", [1576, 1586]], [[64620, 64620], "mapped", [1576, 1605]], [[64621, 64621], "mapped", [1576, 1606]], [[64622, 64622], "mapped", [1576, 1609]], [[64623, 64623], "mapped", [1576, 1610]], [[64624, 64624], "mapped", [1578, 1585]], [[64625, 64625], "mapped", [1578, 1586]], [[64626, 64626], "mapped", [1578, 1605]], [[64627, 64627], "mapped", [1578, 1606]], [[64628, 64628], "mapped", [1578, 1609]], [[64629, 64629], "mapped", [1578, 1610]], [[64630, 64630], "mapped", [1579, 1585]], [[64631, 64631], "mapped", [1579, 1586]], [[64632, 64632], "mapped", [1579, 1605]], [[64633, 64633], "mapped", [1579, 1606]], [[64634, 64634], "mapped", [1579, 1609]], [[64635, 64635], "mapped", [1579, 1610]], [[64636, 64636], "mapped", [1601, 1609]], [[64637, 64637], "mapped", [1601, 1610]], [[64638, 64638], "mapped", [1602, 1609]], [[64639, 64639], "mapped", [1602, 1610]], [[64640, 64640], "mapped", [1603, 1575]], [[64641, 64641], "mapped", [1603, 1604]], [[64642, 64642], "mapped", [1603, 1605]], [[64643, 64643], "mapped", [1603, 1609]], [[64644, 64644], "mapped", [1603, 1610]], [[64645, 64645], "mapped", [1604, 1605]], [[64646, 64646], "mapped", [1604, 1609]], [[64647, 64647], "mapped", [1604, 1610]], [[64648, 64648], "mapped", [1605, 1575]], [[64649, 64649], "mapped", [1605, 1605]], [[64650, 64650], "mapped", [1606, 1585]], [[64651, 64651], "mapped", [1606, 1586]], [[64652, 64652], "mapped", [1606, 1605]], [[64653, 64653], "mapped", [1606, 1606]], [[64654, 64654], "mapped", [1606, 1609]], [[64655, 64655], "mapped", [1606, 1610]], [[64656, 64656], "mapped", [1609, 1648]], [[64657, 64657], "mapped", [1610, 1585]], [[64658, 64658], "mapped", [1610, 1586]], [[64659, 64659], "mapped", [1610, 1605]], [[64660, 64660], "mapped", [1610, 1606]], [[64661, 64661], "mapped", [1610, 1609]], [[64662, 64662], "mapped", [1610, 1610]], [[64663, 64663], "mapped", [1574, 1580]], [[64664, 64664], "mapped", [1574, 1581]], [[64665, 64665], "mapped", [1574, 1582]], [[64666, 64666], "mapped", [1574, 1605]], [[64667, 64667], "mapped", [1574, 1607]], [[64668, 64668], "mapped", [1576, 1580]], [[64669, 64669], "mapped", [1576, 1581]], [[64670, 64670], "mapped", [1576, 1582]], [[64671, 64671], "mapped", [1576, 1605]], [[64672, 64672], "mapped", [1576, 1607]], [[64673, 64673], "mapped", [1578, 1580]], [[64674, 64674], "mapped", [1578, 1581]], [[64675, 64675], "mapped", [1578, 1582]], [[64676, 64676], "mapped", [1578, 1605]], [[64677, 64677], "mapped", [1578, 1607]], [[64678, 64678], "mapped", [1579, 1605]], [[64679, 64679], "mapped", [1580, 1581]], [[64680, 64680], "mapped", [1580, 1605]], [[64681, 64681], "mapped", [1581, 1580]], [[64682, 64682], "mapped", [1581, 1605]], [[64683, 64683], "mapped", [1582, 1580]], [[64684, 64684], "mapped", [1582, 1605]], [[64685, 64685], "mapped", [1587, 1580]], [[64686, 64686], "mapped", [1587, 1581]], [[64687, 64687], "mapped", [1587, 1582]], [[64688, 64688], "mapped", [1587, 1605]], [[64689, 64689], "mapped", [1589, 1581]], [[64690, 64690], "mapped", [1589, 1582]], [[64691, 64691], "mapped", [1589, 1605]], [[64692, 64692], "mapped", [1590, 1580]], [[64693, 64693], "mapped", [1590, 1581]], [[64694, 64694], "mapped", [1590, 1582]], [[64695, 64695], "mapped", [1590, 1605]], [[64696, 64696], "mapped", [1591, 1581]], [[64697, 64697], "mapped", [1592, 1605]], [[64698, 64698], "mapped", [1593, 1580]], [[64699, 64699], "mapped", [1593, 1605]], [[64700, 64700], "mapped", [1594, 1580]], [[64701, 64701], "mapped", [1594, 1605]], [[64702, 64702], "mapped", [1601, 1580]], [[64703, 64703], "mapped", [1601, 1581]], [[64704, 64704], "mapped", [1601, 1582]], [[64705, 64705], "mapped", [1601, 1605]], [[64706, 64706], "mapped", [1602, 1581]], [[64707, 64707], "mapped", [1602, 1605]], [[64708, 64708], "mapped", [1603, 1580]], [[64709, 64709], "mapped", [1603, 1581]], [[64710, 64710], "mapped", [1603, 1582]], [[64711, 64711], "mapped", [1603, 1604]], [[64712, 64712], "mapped", [1603, 1605]], [[64713, 64713], "mapped", [1604, 1580]], [[64714, 64714], "mapped", [1604, 1581]], [[64715, 64715], "mapped", [1604, 1582]], [[64716, 64716], "mapped", [1604, 1605]], [[64717, 64717], "mapped", [1604, 1607]], [[64718, 64718], "mapped", [1605, 1580]], [[64719, 64719], "mapped", [1605, 1581]], [[64720, 64720], "mapped", [1605, 1582]], [[64721, 64721], "mapped", [1605, 1605]], [[64722, 64722], "mapped", [1606, 1580]], [[64723, 64723], "mapped", [1606, 1581]], [[64724, 64724], "mapped", [1606, 1582]], [[64725, 64725], "mapped", [1606, 1605]], [[64726, 64726], "mapped", [1606, 1607]], [[64727, 64727], "mapped", [1607, 1580]], [[64728, 64728], "mapped", [1607, 1605]], [[64729, 64729], "mapped", [1607, 1648]], [[64730, 64730], "mapped", [1610, 1580]], [[64731, 64731], "mapped", [1610, 1581]], [[64732, 64732], "mapped", [1610, 1582]], [[64733, 64733], "mapped", [1610, 1605]], [[64734, 64734], "mapped", [1610, 1607]], [[64735, 64735], "mapped", [1574, 1605]], [[64736, 64736], "mapped", [1574, 1607]], [[64737, 64737], "mapped", [1576, 1605]], [[64738, 64738], "mapped", [1576, 1607]], [[64739, 64739], "mapped", [1578, 1605]], [[64740, 64740], "mapped", [1578, 1607]], [[64741, 64741], "mapped", [1579, 1605]], [[64742, 64742], "mapped", [1579, 1607]], [[64743, 64743], "mapped", [1587, 1605]], [[64744, 64744], "mapped", [1587, 1607]], [[64745, 64745], "mapped", [1588, 1605]], [[64746, 64746], "mapped", [1588, 1607]], [[64747, 64747], "mapped", [1603, 1604]], [[64748, 64748], "mapped", [1603, 1605]], [[64749, 64749], "mapped", [1604, 1605]], [[64750, 64750], "mapped", [1606, 1605]], [[64751, 64751], "mapped", [1606, 1607]], [[64752, 64752], "mapped", [1610, 1605]], [[64753, 64753], "mapped", [1610, 1607]], [[64754, 64754], "mapped", [1600, 1614, 1617]], [[64755, 64755], "mapped", [1600, 1615, 1617]], [[64756, 64756], "mapped", [1600, 1616, 1617]], [[64757, 64757], "mapped", [1591, 1609]], [[64758, 64758], "mapped", [1591, 1610]], [[64759, 64759], "mapped", [1593, 1609]], [[64760, 64760], "mapped", [1593, 1610]], [[64761, 64761], "mapped", [1594, 1609]], [[64762, 64762], "mapped", [1594, 1610]], [[64763, 64763], "mapped", [1587, 1609]], [[64764, 64764], "mapped", [1587, 1610]], [[64765, 64765], "mapped", [1588, 1609]], [[64766, 64766], "mapped", [1588, 1610]], [[64767, 64767], "mapped", [1581, 1609]], [[64768, 64768], "mapped", [1581, 1610]], [[64769, 64769], "mapped", [1580, 1609]], [[64770, 64770], "mapped", [1580, 1610]], [[64771, 64771], "mapped", [1582, 1609]], [[64772, 64772], "mapped", [1582, 1610]], [[64773, 64773], "mapped", [1589, 1609]], [[64774, 64774], "mapped", [1589, 1610]], [[64775, 64775], "mapped", [1590, 1609]], [[64776, 64776], "mapped", [1590, 1610]], [[64777, 64777], "mapped", [1588, 1580]], [[64778, 64778], "mapped", [1588, 1581]], [[64779, 64779], "mapped", [1588, 1582]], [[64780, 64780], "mapped", [1588, 1605]], [[64781, 64781], "mapped", [1588, 1585]], [[64782, 64782], "mapped", [1587, 1585]], [[64783, 64783], "mapped", [1589, 1585]], [[64784, 64784], "mapped", [1590, 1585]], [[64785, 64785], "mapped", [1591, 1609]], [[64786, 64786], "mapped", [1591, 1610]], [[64787, 64787], "mapped", [1593, 1609]], [[64788, 64788], "mapped", [1593, 1610]], [[64789, 64789], "mapped", [1594, 1609]], [[64790, 64790], "mapped", [1594, 1610]], [[64791, 64791], "mapped", [1587, 1609]], [[64792, 64792], "mapped", [1587, 1610]], [[64793, 64793], "mapped", [1588, 1609]], [[64794, 64794], "mapped", [1588, 1610]], [[64795, 64795], "mapped", [1581, 1609]], [[64796, 64796], "mapped", [1581, 1610]], [[64797, 64797], "mapped", [1580, 1609]], [[64798, 64798], "mapped", [1580, 1610]], [[64799, 64799], "mapped", [1582, 1609]], [[64800, 64800], "mapped", [1582, 1610]], [[64801, 64801], "mapped", [1589, 1609]], [[64802, 64802], "mapped", [1589, 1610]], [[64803, 64803], "mapped", [1590, 1609]], [[64804, 64804], "mapped", [1590, 1610]], [[64805, 64805], "mapped", [1588, 1580]], [[64806, 64806], "mapped", [1588, 1581]], [[64807, 64807], "mapped", [1588, 1582]], [[64808, 64808], "mapped", [1588, 1605]], [[64809, 64809], "mapped", [1588, 1585]], [[64810, 64810], "mapped", [1587, 1585]], [[64811, 64811], "mapped", [1589, 1585]], [[64812, 64812], "mapped", [1590, 1585]], [[64813, 64813], "mapped", [1588, 1580]], [[64814, 64814], "mapped", [1588, 1581]], [[64815, 64815], "mapped", [1588, 1582]], [[64816, 64816], "mapped", [1588, 1605]], [[64817, 64817], "mapped", [1587, 1607]], [[64818, 64818], "mapped", [1588, 1607]], [[64819, 64819], "mapped", [1591, 1605]], [[64820, 64820], "mapped", [1587, 1580]], [[64821, 64821], "mapped", [1587, 1581]], [[64822, 64822], "mapped", [1587, 1582]], [[64823, 64823], "mapped", [1588, 1580]], [[64824, 64824], "mapped", [1588, 1581]], [[64825, 64825], "mapped", [1588, 1582]], [[64826, 64826], "mapped", [1591, 1605]], [[64827, 64827], "mapped", [1592, 1605]], [[64828, 64829], "mapped", [1575, 1611]], [[64830, 64831], "valid", [], "NV8"], [[64832, 64847], "disallowed"], [[64848, 64848], "mapped", [1578, 1580, 1605]], [[64849, 64850], "mapped", [1578, 1581, 1580]], [[64851, 64851], "mapped", [1578, 1581, 1605]], [[64852, 64852], "mapped", [1578, 1582, 1605]], [[64853, 64853], "mapped", [1578, 1605, 1580]], [[64854, 64854], "mapped", [1578, 1605, 1581]], [[64855, 64855], "mapped", [1578, 1605, 1582]], [[64856, 64857], "mapped", [1580, 1605, 1581]], [[64858, 64858], "mapped", [1581, 1605, 1610]], [[64859, 64859], "mapped", [1581, 1605, 1609]], [[64860, 64860], "mapped", [1587, 1581, 1580]], [[64861, 64861], "mapped", [1587, 1580, 1581]], [[64862, 64862], "mapped", [1587, 1580, 1609]], [[64863, 64864], "mapped", [1587, 1605, 1581]], [[64865, 64865], "mapped", [1587, 1605, 1580]], [[64866, 64867], "mapped", [1587, 1605, 1605]], [[64868, 64869], "mapped", [1589, 1581, 1581]], [[64870, 64870], "mapped", [1589, 1605, 1605]], [[64871, 64872], "mapped", [1588, 1581, 1605]], [[64873, 64873], "mapped", [1588, 1580, 1610]], [[64874, 64875], "mapped", [1588, 1605, 1582]], [[64876, 64877], "mapped", [1588, 1605, 1605]], [[64878, 64878], "mapped", [1590, 1581, 1609]], [[64879, 64880], "mapped", [1590, 1582, 1605]], [[64881, 64882], "mapped", [1591, 1605, 1581]], [[64883, 64883], "mapped", [1591, 1605, 1605]], [[64884, 64884], "mapped", [1591, 1605, 1610]], [[64885, 64885], "mapped", [1593, 1580, 1605]], [[64886, 64887], "mapped", [1593, 1605, 1605]], [[64888, 64888], "mapped", [1593, 1605, 1609]], [[64889, 64889], "mapped", [1594, 1605, 1605]], [[64890, 64890], "mapped", [1594, 1605, 1610]], [[64891, 64891], "mapped", [1594, 1605, 1609]], [[64892, 64893], "mapped", [1601, 1582, 1605]], [[64894, 64894], "mapped", [1602, 1605, 1581]], [[64895, 64895], "mapped", [1602, 1605, 1605]], [[64896, 64896], "mapped", [1604, 1581, 1605]], [[64897, 64897], "mapped", [1604, 1581, 1610]], [[64898, 64898], "mapped", [1604, 1581, 1609]], [[64899, 64900], "mapped", [1604, 1580, 1580]], [[64901, 64902], "mapped", [1604, 1582, 1605]], [[64903, 64904], "mapped", [1604, 1605, 1581]], [[64905, 64905], "mapped", [1605, 1581, 1580]], [[64906, 64906], "mapped", [1605, 1581, 1605]], [[64907, 64907], "mapped", [1605, 1581, 1610]], [[64908, 64908], "mapped", [1605, 1580, 1581]], [[64909, 64909], "mapped", [1605, 1580, 1605]], [[64910, 64910], "mapped", [1605, 1582, 1580]], [[64911, 64911], "mapped", [1605, 1582, 1605]], [[64912, 64913], "disallowed"], [[64914, 64914], "mapped", [1605, 1580, 1582]], [[64915, 64915], "mapped", [1607, 1605, 1580]], [[64916, 64916], "mapped", [1607, 1605, 1605]], [[64917, 64917], "mapped", [1606, 1581, 1605]], [[64918, 64918], "mapped", [1606, 1581, 1609]], [[64919, 64920], "mapped", [1606, 1580, 1605]], [[64921, 64921], "mapped", [1606, 1580, 1609]], [[64922, 64922], "mapped", [1606, 1605, 1610]], [[64923, 64923], "mapped", [1606, 1605, 1609]], [[64924, 64925], "mapped", [1610, 1605, 1605]], [[64926, 64926], "mapped", [1576, 1582, 1610]], [[64927, 64927], "mapped", [1578, 1580, 1610]], [[64928, 64928], "mapped", [1578, 1580, 1609]], [[64929, 64929], "mapped", [1578, 1582, 1610]], [[64930, 64930], "mapped", [1578, 1582, 1609]], [[64931, 64931], "mapped", [1578, 1605, 1610]], [[64932, 64932], "mapped", [1578, 1605, 1609]], [[64933, 64933], "mapped", [1580, 1605, 1610]], [[64934, 64934], "mapped", [1580, 1581, 1609]], [[64935, 64935], "mapped", [1580, 1605, 1609]], [[64936, 64936], "mapped", [1587, 1582, 1609]], [[64937, 64937], "mapped", [1589, 1581, 1610]], [[64938, 64938], "mapped", [1588, 1581, 1610]], [[64939, 64939], "mapped", [1590, 1581, 1610]], [[64940, 64940], "mapped", [1604, 1580, 1610]], [[64941, 64941], "mapped", [1604, 1605, 1610]], [[64942, 64942], "mapped", [1610, 1581, 1610]], [[64943, 64943], "mapped", [1610, 1580, 1610]], [[64944, 64944], "mapped", [1610, 1605, 1610]], [[64945, 64945], "mapped", [1605, 1605, 1610]], [[64946, 64946], "mapped", [1602, 1605, 1610]], [[64947, 64947], "mapped", [1606, 1581, 1610]], [[64948, 64948], "mapped", [1602, 1605, 1581]], [[64949, 64949], "mapped", [1604, 1581, 1605]], [[64950, 64950], "mapped", [1593, 1605, 1610]], [[64951, 64951], "mapped", [1603, 1605, 1610]], [[64952, 64952], "mapped", [1606, 1580, 1581]], [[64953, 64953], "mapped", [1605, 1582, 1610]], [[64954, 64954], "mapped", [1604, 1580, 1605]], [[64955, 64955], "mapped", [1603, 1605, 1605]], [[64956, 64956], "mapped", [1604, 1580, 1605]], [[64957, 64957], "mapped", [1606, 1580, 1581]], [[64958, 64958], "mapped", [1580, 1581, 1610]], [[64959, 64959], "mapped", [1581, 1580, 1610]], [[64960, 64960], "mapped", [1605, 1580, 1610]], [[64961, 64961], "mapped", [1601, 1605, 1610]], [[64962, 64962], "mapped", [1576, 1581, 1610]], [[64963, 64963], "mapped", [1603, 1605, 1605]], [[64964, 64964], "mapped", [1593, 1580, 1605]], [[64965, 64965], "mapped", [1589, 1605, 1605]], [[64966, 64966], "mapped", [1587, 1582, 1610]], [[64967, 64967], "mapped", [1606, 1580, 1610]], [[64968, 64975], "disallowed"], [[64976, 65007], "disallowed"], [[65008, 65008], "mapped", [1589, 1604, 1746]], [[65009, 65009], "mapped", [1602, 1604, 1746]], [[65010, 65010], "mapped", [1575, 1604, 1604, 1607]], [[65011, 65011], "mapped", [1575, 1603, 1576, 1585]], [[65012, 65012], "mapped", [1605, 1581, 1605, 1583]], [[65013, 65013], "mapped", [1589, 1604, 1593, 1605]], [[65014, 65014], "mapped", [1585, 1587, 1608, 1604]], [[65015, 65015], "mapped", [1593, 1604, 1610, 1607]], [[65016, 65016], "mapped", [1608, 1587, 1604, 1605]], [[65017, 65017], "mapped", [1589, 1604, 1609]], [[65018, 65018], "disallowed_STD3_mapped", [1589, 1604, 1609, 32, 1575, 1604, 1604, 1607, 32, 1593, 1604, 1610, 1607, 32, 1608, 1587, 1604, 1605]], [[65019, 65019], "disallowed_STD3_mapped", [1580, 1604, 32, 1580, 1604, 1575, 1604, 1607]], [[65020, 65020], "mapped", [1585, 1740, 1575, 1604]], [[65021, 65021], "valid", [], "NV8"], [[65022, 65023], "disallowed"], [[65024, 65039], "ignored"], [[65040, 65040], "disallowed_STD3_mapped", [44]], [[65041, 65041], "mapped", [12289]], [[65042, 65042], "disallowed"], [[65043, 65043], "disallowed_STD3_mapped", [58]], [[65044, 65044], "disallowed_STD3_mapped", [59]], [[65045, 65045], "disallowed_STD3_mapped", [33]], [[65046, 65046], "disallowed_STD3_mapped", [63]], [[65047, 65047], "mapped", [12310]], [[65048, 65048], "mapped", [12311]], [[65049, 65049], "disallowed"], [[65050, 65055], "disallowed"], [[65056, 65059], "valid"], [[65060, 65062], "valid"], [[65063, 65069], "valid"], [[65070, 65071], "valid"], [[65072, 65072], "disallowed"], [[65073, 65073], "mapped", [8212]], [[65074, 65074], "mapped", [8211]], [[65075, 65076], "disallowed_STD3_mapped", [95]], [[65077, 65077], "disallowed_STD3_mapped", [40]], [[65078, 65078], "disallowed_STD3_mapped", [41]], [[65079, 65079], "disallowed_STD3_mapped", [123]], [[65080, 65080], "disallowed_STD3_mapped", [125]], [[65081, 65081], "mapped", [12308]], [[65082, 65082], "mapped", [12309]], [[65083, 65083], "mapped", [12304]], [[65084, 65084], "mapped", [12305]], [[65085, 65085], "mapped", [12298]], [[65086, 65086], "mapped", [12299]], [[65087, 65087], "mapped", [12296]], [[65088, 65088], "mapped", [12297]], [[65089, 65089], "mapped", [12300]], [[65090, 65090], "mapped", [12301]], [[65091, 65091], "mapped", [12302]], [[65092, 65092], "mapped", [12303]], [[65093, 65094], "valid", [], "NV8"], [[65095, 65095], "disallowed_STD3_mapped", [91]], [[65096, 65096], "disallowed_STD3_mapped", [93]], [[65097, 65100], "disallowed_STD3_mapped", [32, 773]], [[65101, 65103], "disallowed_STD3_mapped", [95]], [[65104, 65104], "disallowed_STD3_mapped", [44]], [[65105, 65105], "mapped", [12289]], [[65106, 65106], "disallowed"], [[65107, 65107], "disallowed"], [[65108, 65108], "disallowed_STD3_mapped", [59]], [[65109, 65109], "disallowed_STD3_mapped", [58]], [[65110, 65110], "disallowed_STD3_mapped", [63]], [[65111, 65111], "disallowed_STD3_mapped", [33]], [[65112, 65112], "mapped", [8212]], [[65113, 65113], "disallowed_STD3_mapped", [40]], [[65114, 65114], "disallowed_STD3_mapped", [41]], [[65115, 65115], "disallowed_STD3_mapped", [123]], [[65116, 65116], "disallowed_STD3_mapped", [125]], [[65117, 65117], "mapped", [12308]], [[65118, 65118], "mapped", [12309]], [[65119, 65119], "disallowed_STD3_mapped", [35]], [[65120, 65120], "disallowed_STD3_mapped", [38]], [[65121, 65121], "disallowed_STD3_mapped", [42]], [[65122, 65122], "disallowed_STD3_mapped", [43]], [[65123, 65123], "mapped", [45]], [[65124, 65124], "disallowed_STD3_mapped", [60]], [[65125, 65125], "disallowed_STD3_mapped", [62]], [[65126, 65126], "disallowed_STD3_mapped", [61]], [[65127, 65127], "disallowed"], [[65128, 65128], "disallowed_STD3_mapped", [92]], [[65129, 65129], "disallowed_STD3_mapped", [36]], [[65130, 65130], "disallowed_STD3_mapped", [37]], [[65131, 65131], "disallowed_STD3_mapped", [64]], [[65132, 65135], "disallowed"], [[65136, 65136], "disallowed_STD3_mapped", [32, 1611]], [[65137, 65137], "mapped", [1600, 1611]], [[65138, 65138], "disallowed_STD3_mapped", [32, 1612]], [[65139, 65139], "valid"], [[65140, 65140], "disallowed_STD3_mapped", [32, 1613]], [[65141, 65141], "disallowed"], [[65142, 65142], "disallowed_STD3_mapped", [32, 1614]], [[65143, 65143], "mapped", [1600, 1614]], [[65144, 65144], "disallowed_STD3_mapped", [32, 1615]], [[65145, 65145], "mapped", [1600, 1615]], [[65146, 65146], "disallowed_STD3_mapped", [32, 1616]], [[65147, 65147], "mapped", [1600, 1616]], [[65148, 65148], "disallowed_STD3_mapped", [32, 1617]], [[65149, 65149], "mapped", [1600, 1617]], [[65150, 65150], "disallowed_STD3_mapped", [32, 1618]], [[65151, 65151], "mapped", [1600, 1618]], [[65152, 65152], "mapped", [1569]], [[65153, 65154], "mapped", [1570]], [[65155, 65156], "mapped", [1571]], [[65157, 65158], "mapped", [1572]], [[65159, 65160], "mapped", [1573]], [[65161, 65164], "mapped", [1574]], [[65165, 65166], "mapped", [1575]], [[65167, 65170], "mapped", [1576]], [[65171, 65172], "mapped", [1577]], [[65173, 65176], "mapped", [1578]], [[65177, 65180], "mapped", [1579]], [[65181, 65184], "mapped", [1580]], [[65185, 65188], "mapped", [1581]], [[65189, 65192], "mapped", [1582]], [[65193, 65194], "mapped", [1583]], [[65195, 65196], "mapped", [1584]], [[65197, 65198], "mapped", [1585]], [[65199, 65200], "mapped", [1586]], [[65201, 65204], "mapped", [1587]], [[65205, 65208], "mapped", [1588]], [[65209, 65212], "mapped", [1589]], [[65213, 65216], "mapped", [1590]], [[65217, 65220], "mapped", [1591]], [[65221, 65224], "mapped", [1592]], [[65225, 65228], "mapped", [1593]], [[65229, 65232], "mapped", [1594]], [[65233, 65236], "mapped", [1601]], [[65237, 65240], "mapped", [1602]], [[65241, 65244], "mapped", [1603]], [[65245, 65248], "mapped", [1604]], [[65249, 65252], "mapped", [1605]], [[65253, 65256], "mapped", [1606]], [[65257, 65260], "mapped", [1607]], [[65261, 65262], "mapped", [1608]], [[65263, 65264], "mapped", [1609]], [[65265, 65268], "mapped", [1610]], [[65269, 65270], "mapped", [1604, 1570]], [[65271, 65272], "mapped", [1604, 1571]], [[65273, 65274], "mapped", [1604, 1573]], [[65275, 65276], "mapped", [1604, 1575]], [[65277, 65278], "disallowed"], [[65279, 65279], "ignored"], [[65280, 65280], "disallowed"], [[65281, 65281], "disallowed_STD3_mapped", [33]], [[65282, 65282], "disallowed_STD3_mapped", [34]], [[65283, 65283], "disallowed_STD3_mapped", [35]], [[65284, 65284], "disallowed_STD3_mapped", [36]], [[65285, 65285], "disallowed_STD3_mapped", [37]], [[65286, 65286], "disallowed_STD3_mapped", [38]], [[65287, 65287], "disallowed_STD3_mapped", [39]], [[65288, 65288], "disallowed_STD3_mapped", [40]], [[65289, 65289], "disallowed_STD3_mapped", [41]], [[65290, 65290], "disallowed_STD3_mapped", [42]], [[65291, 65291], "disallowed_STD3_mapped", [43]], [[65292, 65292], "disallowed_STD3_mapped", [44]], [[65293, 65293], "mapped", [45]], [[65294, 65294], "mapped", [46]], [[65295, 65295], "disallowed_STD3_mapped", [47]], [[65296, 65296], "mapped", [48]], [[65297, 65297], "mapped", [49]], [[65298, 65298], "mapped", [50]], [[65299, 65299], "mapped", [51]], [[65300, 65300], "mapped", [52]], [[65301, 65301], "mapped", [53]], [[65302, 65302], "mapped", [54]], [[65303, 65303], "mapped", [55]], [[65304, 65304], "mapped", [56]], [[65305, 65305], "mapped", [57]], [[65306, 65306], "disallowed_STD3_mapped", [58]], [[65307, 65307], "disallowed_STD3_mapped", [59]], [[65308, 65308], "disallowed_STD3_mapped", [60]], [[65309, 65309], "disallowed_STD3_mapped", [61]], [[65310, 65310], "disallowed_STD3_mapped", [62]], [[65311, 65311], "disallowed_STD3_mapped", [63]], [[65312, 65312], "disallowed_STD3_mapped", [64]], [[65313, 65313], "mapped", [97]], [[65314, 65314], "mapped", [98]], [[65315, 65315], "mapped", [99]], [[65316, 65316], "mapped", [100]], [[65317, 65317], "mapped", [101]], [[65318, 65318], "mapped", [102]], [[65319, 65319], "mapped", [103]], [[65320, 65320], "mapped", [104]], [[65321, 65321], "mapped", [105]], [[65322, 65322], "mapped", [106]], [[65323, 65323], "mapped", [107]], [[65324, 65324], "mapped", [108]], [[65325, 65325], "mapped", [109]], [[65326, 65326], "mapped", [110]], [[65327, 65327], "mapped", [111]], [[65328, 65328], "mapped", [112]], [[65329, 65329], "mapped", [113]], [[65330, 65330], "mapped", [114]], [[65331, 65331], "mapped", [115]], [[65332, 65332], "mapped", [116]], [[65333, 65333], "mapped", [117]], [[65334, 65334], "mapped", [118]], [[65335, 65335], "mapped", [119]], [[65336, 65336], "mapped", [120]], [[65337, 65337], "mapped", [121]], [[65338, 65338], "mapped", [122]], [[65339, 65339], "disallowed_STD3_mapped", [91]], [[65340, 65340], "disallowed_STD3_mapped", [92]], [[65341, 65341], "disallowed_STD3_mapped", [93]], [[65342, 65342], "disallowed_STD3_mapped", [94]], [[65343, 65343], "disallowed_STD3_mapped", [95]], [[65344, 65344], "disallowed_STD3_mapped", [96]], [[65345, 65345], "mapped", [97]], [[65346, 65346], "mapped", [98]], [[65347, 65347], "mapped", [99]], [[65348, 65348], "mapped", [100]], [[65349, 65349], "mapped", [101]], [[65350, 65350], "mapped", [102]], [[65351, 65351], "mapped", [103]], [[65352, 65352], "mapped", [104]], [[65353, 65353], "mapped", [105]], [[65354, 65354], "mapped", [106]], [[65355, 65355], "mapped", [107]], [[65356, 65356], "mapped", [108]], [[65357, 65357], "mapped", [109]], [[65358, 65358], "mapped", [110]], [[65359, 65359], "mapped", [111]], [[65360, 65360], "mapped", [112]], [[65361, 65361], "mapped", [113]], [[65362, 65362], "mapped", [114]], [[65363, 65363], "mapped", [115]], [[65364, 65364], "mapped", [116]], [[65365, 65365], "mapped", [117]], [[65366, 65366], "mapped", [118]], [[65367, 65367], "mapped", [119]], [[65368, 65368], "mapped", [120]], [[65369, 65369], "mapped", [121]], [[65370, 65370], "mapped", [122]], [[65371, 65371], "disallowed_STD3_mapped", [123]], [[65372, 65372], "disallowed_STD3_mapped", [124]], [[65373, 65373], "disallowed_STD3_mapped", [125]], [[65374, 65374], "disallowed_STD3_mapped", [126]], [[65375, 65375], "mapped", [10629]], [[65376, 65376], "mapped", [10630]], [[65377, 65377], "mapped", [46]], [[65378, 65378], "mapped", [12300]], [[65379, 65379], "mapped", [12301]], [[65380, 65380], "mapped", [12289]], [[65381, 65381], "mapped", [12539]], [[65382, 65382], "mapped", [12530]], [[65383, 65383], "mapped", [12449]], [[65384, 65384], "mapped", [12451]], [[65385, 65385], "mapped", [12453]], [[65386, 65386], "mapped", [12455]], [[65387, 65387], "mapped", [12457]], [[65388, 65388], "mapped", [12515]], [[65389, 65389], "mapped", [12517]], [[65390, 65390], "mapped", [12519]], [[65391, 65391], "mapped", [12483]], [[65392, 65392], "mapped", [12540]], [[65393, 65393], "mapped", [12450]], [[65394, 65394], "mapped", [12452]], [[65395, 65395], "mapped", [12454]], [[65396, 65396], "mapped", [12456]], [[65397, 65397], "mapped", [12458]], [[65398, 65398], "mapped", [12459]], [[65399, 65399], "mapped", [12461]], [[65400, 65400], "mapped", [12463]], [[65401, 65401], "mapped", [12465]], [[65402, 65402], "mapped", [12467]], [[65403, 65403], "mapped", [12469]], [[65404, 65404], "mapped", [12471]], [[65405, 65405], "mapped", [12473]], [[65406, 65406], "mapped", [12475]], [[65407, 65407], "mapped", [12477]], [[65408, 65408], "mapped", [12479]], [[65409, 65409], "mapped", [12481]], [[65410, 65410], "mapped", [12484]], [[65411, 65411], "mapped", [12486]], [[65412, 65412], "mapped", [12488]], [[65413, 65413], "mapped", [12490]], [[65414, 65414], "mapped", [12491]], [[65415, 65415], "mapped", [12492]], [[65416, 65416], "mapped", [12493]], [[65417, 65417], "mapped", [12494]], [[65418, 65418], "mapped", [12495]], [[65419, 65419], "mapped", [12498]], [[65420, 65420], "mapped", [12501]], [[65421, 65421], "mapped", [12504]], [[65422, 65422], "mapped", [12507]], [[65423, 65423], "mapped", [12510]], [[65424, 65424], "mapped", [12511]], [[65425, 65425], "mapped", [12512]], [[65426, 65426], "mapped", [12513]], [[65427, 65427], "mapped", [12514]], [[65428, 65428], "mapped", [12516]], [[65429, 65429], "mapped", [12518]], [[65430, 65430], "mapped", [12520]], [[65431, 65431], "mapped", [12521]], [[65432, 65432], "mapped", [12522]], [[65433, 65433], "mapped", [12523]], [[65434, 65434], "mapped", [12524]], [[65435, 65435], "mapped", [12525]], [[65436, 65436], "mapped", [12527]], [[65437, 65437], "mapped", [12531]], [[65438, 65438], "mapped", [12441]], [[65439, 65439], "mapped", [12442]], [[65440, 65440], "disallowed"], [[65441, 65441], "mapped", [4352]], [[65442, 65442], "mapped", [4353]], [[65443, 65443], "mapped", [4522]], [[65444, 65444], "mapped", [4354]], [[65445, 65445], "mapped", [4524]], [[65446, 65446], "mapped", [4525]], [[65447, 65447], "mapped", [4355]], [[65448, 65448], "mapped", [4356]], [[65449, 65449], "mapped", [4357]], [[65450, 65450], "mapped", [4528]], [[65451, 65451], "mapped", [4529]], [[65452, 65452], "mapped", [4530]], [[65453, 65453], "mapped", [4531]], [[65454, 65454], "mapped", [4532]], [[65455, 65455], "mapped", [4533]], [[65456, 65456], "mapped", [4378]], [[65457, 65457], "mapped", [4358]], [[65458, 65458], "mapped", [4359]], [[65459, 65459], "mapped", [4360]], [[65460, 65460], "mapped", [4385]], [[65461, 65461], "mapped", [4361]], [[65462, 65462], "mapped", [4362]], [[65463, 65463], "mapped", [4363]], [[65464, 65464], "mapped", [4364]], [[65465, 65465], "mapped", [4365]], [[65466, 65466], "mapped", [4366]], [[65467, 65467], "mapped", [4367]], [[65468, 65468], "mapped", [4368]], [[65469, 65469], "mapped", [4369]], [[65470, 65470], "mapped", [4370]], [[65471, 65473], "disallowed"], [[65474, 65474], "mapped", [4449]], [[65475, 65475], "mapped", [4450]], [[65476, 65476], "mapped", [4451]], [[65477, 65477], "mapped", [4452]], [[65478, 65478], "mapped", [4453]], [[65479, 65479], "mapped", [4454]], [[65480, 65481], "disallowed"], [[65482, 65482], "mapped", [4455]], [[65483, 65483], "mapped", [4456]], [[65484, 65484], "mapped", [4457]], [[65485, 65485], "mapped", [4458]], [[65486, 65486], "mapped", [4459]], [[65487, 65487], "mapped", [4460]], [[65488, 65489], "disallowed"], [[65490, 65490], "mapped", [4461]], [[65491, 65491], "mapped", [4462]], [[65492, 65492], "mapped", [4463]], [[65493, 65493], "mapped", [4464]], [[65494, 65494], "mapped", [4465]], [[65495, 65495], "mapped", [4466]], [[65496, 65497], "disallowed"], [[65498, 65498], "mapped", [4467]], [[65499, 65499], "mapped", [4468]], [[65500, 65500], "mapped", [4469]], [[65501, 65503], "disallowed"], [[65504, 65504], "mapped", [162]], [[65505, 65505], "mapped", [163]], [[65506, 65506], "mapped", [172]], [[65507, 65507], "disallowed_STD3_mapped", [32, 772]], [[65508, 65508], "mapped", [166]], [[65509, 65509], "mapped", [165]], [[65510, 65510], "mapped", [8361]], [[65511, 65511], "disallowed"], [[65512, 65512], "mapped", [9474]], [[65513, 65513], "mapped", [8592]], [[65514, 65514], "mapped", [8593]], [[65515, 65515], "mapped", [8594]], [[65516, 65516], "mapped", [8595]], [[65517, 65517], "mapped", [9632]], [[65518, 65518], "mapped", [9675]], [[65519, 65528], "disallowed"], [[65529, 65531], "disallowed"], [[65532, 65532], "disallowed"], [[65533, 65533], "disallowed"], [[65534, 65535], "disallowed"], [[65536, 65547], "valid"], [[65548, 65548], "disallowed"], [[65549, 65574], "valid"], [[65575, 65575], "disallowed"], [[65576, 65594], "valid"], [[65595, 65595], "disallowed"], [[65596, 65597], "valid"], [[65598, 65598], "disallowed"], [[65599, 65613], "valid"], [[65614, 65615], "disallowed"], [[65616, 65629], "valid"], [[65630, 65663], "disallowed"], [[65664, 65786], "valid"], [[65787, 65791], "disallowed"], [[65792, 65794], "valid", [], "NV8"], [[65795, 65798], "disallowed"], [[65799, 65843], "valid", [], "NV8"], [[65844, 65846], "disallowed"], [[65847, 65855], "valid", [], "NV8"], [[65856, 65930], "valid", [], "NV8"], [[65931, 65932], "valid", [], "NV8"], [[65933, 65935], "disallowed"], [[65936, 65947], "valid", [], "NV8"], [[65948, 65951], "disallowed"], [[65952, 65952], "valid", [], "NV8"], [[65953, 65999], "disallowed"], [[66e3, 66044], "valid", [], "NV8"], [[66045, 66045], "valid"], [[66046, 66175], "disallowed"], [[66176, 66204], "valid"], [[66205, 66207], "disallowed"], [[66208, 66256], "valid"], [[66257, 66271], "disallowed"], [[66272, 66272], "valid"], [[66273, 66299], "valid", [], "NV8"], [[66300, 66303], "disallowed"], [[66304, 66334], "valid"], [[66335, 66335], "valid"], [[66336, 66339], "valid", [], "NV8"], [[66340, 66351], "disallowed"], [[66352, 66368], "valid"], [[66369, 66369], "valid", [], "NV8"], [[66370, 66377], "valid"], [[66378, 66378], "valid", [], "NV8"], [[66379, 66383], "disallowed"], [[66384, 66426], "valid"], [[66427, 66431], "disallowed"], [[66432, 66461], "valid"], [[66462, 66462], "disallowed"], [[66463, 66463], "valid", [], "NV8"], [[66464, 66499], "valid"], [[66500, 66503], "disallowed"], [[66504, 66511], "valid"], [[66512, 66517], "valid", [], "NV8"], [[66518, 66559], "disallowed"], [[66560, 66560], "mapped", [66600]], [[66561, 66561], "mapped", [66601]], [[66562, 66562], "mapped", [66602]], [[66563, 66563], "mapped", [66603]], [[66564, 66564], "mapped", [66604]], [[66565, 66565], "mapped", [66605]], [[66566, 66566], "mapped", [66606]], [[66567, 66567], "mapped", [66607]], [[66568, 66568], "mapped", [66608]], [[66569, 66569], "mapped", [66609]], [[66570, 66570], "mapped", [66610]], [[66571, 66571], "mapped", [66611]], [[66572, 66572], "mapped", [66612]], [[66573, 66573], "mapped", [66613]], [[66574, 66574], "mapped", [66614]], [[66575, 66575], "mapped", [66615]], [[66576, 66576], "mapped", [66616]], [[66577, 66577], "mapped", [66617]], [[66578, 66578], "mapped", [66618]], [[66579, 66579], "mapped", [66619]], [[66580, 66580], "mapped", [66620]], [[66581, 66581], "mapped", [66621]], [[66582, 66582], "mapped", [66622]], [[66583, 66583], "mapped", [66623]], [[66584, 66584], "mapped", [66624]], [[66585, 66585], "mapped", [66625]], [[66586, 66586], "mapped", [66626]], [[66587, 66587], "mapped", [66627]], [[66588, 66588], "mapped", [66628]], [[66589, 66589], "mapped", [66629]], [[66590, 66590], "mapped", [66630]], [[66591, 66591], "mapped", [66631]], [[66592, 66592], "mapped", [66632]], [[66593, 66593], "mapped", [66633]], [[66594, 66594], "mapped", [66634]], [[66595, 66595], "mapped", [66635]], [[66596, 66596], "mapped", [66636]], [[66597, 66597], "mapped", [66637]], [[66598, 66598], "mapped", [66638]], [[66599, 66599], "mapped", [66639]], [[66600, 66637], "valid"], [[66638, 66717], "valid"], [[66718, 66719], "disallowed"], [[66720, 66729], "valid"], [[66730, 66815], "disallowed"], [[66816, 66855], "valid"], [[66856, 66863], "disallowed"], [[66864, 66915], "valid"], [[66916, 66926], "disallowed"], [[66927, 66927], "valid", [], "NV8"], [[66928, 67071], "disallowed"], [[67072, 67382], "valid"], [[67383, 67391], "disallowed"], [[67392, 67413], "valid"], [[67414, 67423], "disallowed"], [[67424, 67431], "valid"], [[67432, 67583], "disallowed"], [[67584, 67589], "valid"], [[67590, 67591], "disallowed"], [[67592, 67592], "valid"], [[67593, 67593], "disallowed"], [[67594, 67637], "valid"], [[67638, 67638], "disallowed"], [[67639, 67640], "valid"], [[67641, 67643], "disallowed"], [[67644, 67644], "valid"], [[67645, 67646], "disallowed"], [[67647, 67647], "valid"], [[67648, 67669], "valid"], [[67670, 67670], "disallowed"], [[67671, 67679], "valid", [], "NV8"], [[67680, 67702], "valid"], [[67703, 67711], "valid", [], "NV8"], [[67712, 67742], "valid"], [[67743, 67750], "disallowed"], [[67751, 67759], "valid", [], "NV8"], [[67760, 67807], "disallowed"], [[67808, 67826], "valid"], [[67827, 67827], "disallowed"], [[67828, 67829], "valid"], [[67830, 67834], "disallowed"], [[67835, 67839], "valid", [], "NV8"], [[67840, 67861], "valid"], [[67862, 67865], "valid", [], "NV8"], [[67866, 67867], "valid", [], "NV8"], [[67868, 67870], "disallowed"], [[67871, 67871], "valid", [], "NV8"], [[67872, 67897], "valid"], [[67898, 67902], "disallowed"], [[67903, 67903], "valid", [], "NV8"], [[67904, 67967], "disallowed"], [[67968, 68023], "valid"], [[68024, 68027], "disallowed"], [[68028, 68029], "valid", [], "NV8"], [[68030, 68031], "valid"], [[68032, 68047], "valid", [], "NV8"], [[68048, 68049], "disallowed"], [[68050, 68095], "valid", [], "NV8"], [[68096, 68099], "valid"], [[68100, 68100], "disallowed"], [[68101, 68102], "valid"], [[68103, 68107], "disallowed"], [[68108, 68115], "valid"], [[68116, 68116], "disallowed"], [[68117, 68119], "valid"], [[68120, 68120], "disallowed"], [[68121, 68147], "valid"], [[68148, 68151], "disallowed"], [[68152, 68154], "valid"], [[68155, 68158], "disallowed"], [[68159, 68159], "valid"], [[68160, 68167], "valid", [], "NV8"], [[68168, 68175], "disallowed"], [[68176, 68184], "valid", [], "NV8"], [[68185, 68191], "disallowed"], [[68192, 68220], "valid"], [[68221, 68223], "valid", [], "NV8"], [[68224, 68252], "valid"], [[68253, 68255], "valid", [], "NV8"], [[68256, 68287], "disallowed"], [[68288, 68295], "valid"], [[68296, 68296], "valid", [], "NV8"], [[68297, 68326], "valid"], [[68327, 68330], "disallowed"], [[68331, 68342], "valid", [], "NV8"], [[68343, 68351], "disallowed"], [[68352, 68405], "valid"], [[68406, 68408], "disallowed"], [[68409, 68415], "valid", [], "NV8"], [[68416, 68437], "valid"], [[68438, 68439], "disallowed"], [[68440, 68447], "valid", [], "NV8"], [[68448, 68466], "valid"], [[68467, 68471], "disallowed"], [[68472, 68479], "valid", [], "NV8"], [[68480, 68497], "valid"], [[68498, 68504], "disallowed"], [[68505, 68508], "valid", [], "NV8"], [[68509, 68520], "disallowed"], [[68521, 68527], "valid", [], "NV8"], [[68528, 68607], "disallowed"], [[68608, 68680], "valid"], [[68681, 68735], "disallowed"], [[68736, 68736], "mapped", [68800]], [[68737, 68737], "mapped", [68801]], [[68738, 68738], "mapped", [68802]], [[68739, 68739], "mapped", [68803]], [[68740, 68740], "mapped", [68804]], [[68741, 68741], "mapped", [68805]], [[68742, 68742], "mapped", [68806]], [[68743, 68743], "mapped", [68807]], [[68744, 68744], "mapped", [68808]], [[68745, 68745], "mapped", [68809]], [[68746, 68746], "mapped", [68810]], [[68747, 68747], "mapped", [68811]], [[68748, 68748], "mapped", [68812]], [[68749, 68749], "mapped", [68813]], [[68750, 68750], "mapped", [68814]], [[68751, 68751], "mapped", [68815]], [[68752, 68752], "mapped", [68816]], [[68753, 68753], "mapped", [68817]], [[68754, 68754], "mapped", [68818]], [[68755, 68755], "mapped", [68819]], [[68756, 68756], "mapped", [68820]], [[68757, 68757], "mapped", [68821]], [[68758, 68758], "mapped", [68822]], [[68759, 68759], "mapped", [68823]], [[68760, 68760], "mapped", [68824]], [[68761, 68761], "mapped", [68825]], [[68762, 68762], "mapped", [68826]], [[68763, 68763], "mapped", [68827]], [[68764, 68764], "mapped", [68828]], [[68765, 68765], "mapped", [68829]], [[68766, 68766], "mapped", [68830]], [[68767, 68767], "mapped", [68831]], [[68768, 68768], "mapped", [68832]], [[68769, 68769], "mapped", [68833]], [[68770, 68770], "mapped", [68834]], [[68771, 68771], "mapped", [68835]], [[68772, 68772], "mapped", [68836]], [[68773, 68773], "mapped", [68837]], [[68774, 68774], "mapped", [68838]], [[68775, 68775], "mapped", [68839]], [[68776, 68776], "mapped", [68840]], [[68777, 68777], "mapped", [68841]], [[68778, 68778], "mapped", [68842]], [[68779, 68779], "mapped", [68843]], [[68780, 68780], "mapped", [68844]], [[68781, 68781], "mapped", [68845]], [[68782, 68782], "mapped", [68846]], [[68783, 68783], "mapped", [68847]], [[68784, 68784], "mapped", [68848]], [[68785, 68785], "mapped", [68849]], [[68786, 68786], "mapped", [68850]], [[68787, 68799], "disallowed"], [[68800, 68850], "valid"], [[68851, 68857], "disallowed"], [[68858, 68863], "valid", [], "NV8"], [[68864, 69215], "disallowed"], [[69216, 69246], "valid", [], "NV8"], [[69247, 69631], "disallowed"], [[69632, 69702], "valid"], [[69703, 69709], "valid", [], "NV8"], [[69710, 69713], "disallowed"], [[69714, 69733], "valid", [], "NV8"], [[69734, 69743], "valid"], [[69744, 69758], "disallowed"], [[69759, 69759], "valid"], [[69760, 69818], "valid"], [[69819, 69820], "valid", [], "NV8"], [[69821, 69821], "disallowed"], [[69822, 69825], "valid", [], "NV8"], [[69826, 69839], "disallowed"], [[69840, 69864], "valid"], [[69865, 69871], "disallowed"], [[69872, 69881], "valid"], [[69882, 69887], "disallowed"], [[69888, 69940], "valid"], [[69941, 69941], "disallowed"], [[69942, 69951], "valid"], [[69952, 69955], "valid", [], "NV8"], [[69956, 69967], "disallowed"], [[69968, 70003], "valid"], [[70004, 70005], "valid", [], "NV8"], [[70006, 70006], "valid"], [[70007, 70015], "disallowed"], [[70016, 70084], "valid"], [[70085, 70088], "valid", [], "NV8"], [[70089, 70089], "valid", [], "NV8"], [[70090, 70092], "valid"], [[70093, 70093], "valid", [], "NV8"], [[70094, 70095], "disallowed"], [[70096, 70105], "valid"], [[70106, 70106], "valid"], [[70107, 70107], "valid", [], "NV8"], [[70108, 70108], "valid"], [[70109, 70111], "valid", [], "NV8"], [[70112, 70112], "disallowed"], [[70113, 70132], "valid", [], "NV8"], [[70133, 70143], "disallowed"], [[70144, 70161], "valid"], [[70162, 70162], "disallowed"], [[70163, 70199], "valid"], [[70200, 70205], "valid", [], "NV8"], [[70206, 70271], "disallowed"], [[70272, 70278], "valid"], [[70279, 70279], "disallowed"], [[70280, 70280], "valid"], [[70281, 70281], "disallowed"], [[70282, 70285], "valid"], [[70286, 70286], "disallowed"], [[70287, 70301], "valid"], [[70302, 70302], "disallowed"], [[70303, 70312], "valid"], [[70313, 70313], "valid", [], "NV8"], [[70314, 70319], "disallowed"], [[70320, 70378], "valid"], [[70379, 70383], "disallowed"], [[70384, 70393], "valid"], [[70394, 70399], "disallowed"], [[70400, 70400], "valid"], [[70401, 70403], "valid"], [[70404, 70404], "disallowed"], [[70405, 70412], "valid"], [[70413, 70414], "disallowed"], [[70415, 70416], "valid"], [[70417, 70418], "disallowed"], [[70419, 70440], "valid"], [[70441, 70441], "disallowed"], [[70442, 70448], "valid"], [[70449, 70449], "disallowed"], [[70450, 70451], "valid"], [[70452, 70452], "disallowed"], [[70453, 70457], "valid"], [[70458, 70459], "disallowed"], [[70460, 70468], "valid"], [[70469, 70470], "disallowed"], [[70471, 70472], "valid"], [[70473, 70474], "disallowed"], [[70475, 70477], "valid"], [[70478, 70479], "disallowed"], [[70480, 70480], "valid"], [[70481, 70486], "disallowed"], [[70487, 70487], "valid"], [[70488, 70492], "disallowed"], [[70493, 70499], "valid"], [[70500, 70501], "disallowed"], [[70502, 70508], "valid"], [[70509, 70511], "disallowed"], [[70512, 70516], "valid"], [[70517, 70783], "disallowed"], [[70784, 70853], "valid"], [[70854, 70854], "valid", [], "NV8"], [[70855, 70855], "valid"], [[70856, 70863], "disallowed"], [[70864, 70873], "valid"], [[70874, 71039], "disallowed"], [[71040, 71093], "valid"], [[71094, 71095], "disallowed"], [[71096, 71104], "valid"], [[71105, 71113], "valid", [], "NV8"], [[71114, 71127], "valid", [], "NV8"], [[71128, 71133], "valid"], [[71134, 71167], "disallowed"], [[71168, 71232], "valid"], [[71233, 71235], "valid", [], "NV8"], [[71236, 71236], "valid"], [[71237, 71247], "disallowed"], [[71248, 71257], "valid"], [[71258, 71295], "disallowed"], [[71296, 71351], "valid"], [[71352, 71359], "disallowed"], [[71360, 71369], "valid"], [[71370, 71423], "disallowed"], [[71424, 71449], "valid"], [[71450, 71452], "disallowed"], [[71453, 71467], "valid"], [[71468, 71471], "disallowed"], [[71472, 71481], "valid"], [[71482, 71487], "valid", [], "NV8"], [[71488, 71839], "disallowed"], [[71840, 71840], "mapped", [71872]], [[71841, 71841], "mapped", [71873]], [[71842, 71842], "mapped", [71874]], [[71843, 71843], "mapped", [71875]], [[71844, 71844], "mapped", [71876]], [[71845, 71845], "mapped", [71877]], [[71846, 71846], "mapped", [71878]], [[71847, 71847], "mapped", [71879]], [[71848, 71848], "mapped", [71880]], [[71849, 71849], "mapped", [71881]], [[71850, 71850], "mapped", [71882]], [[71851, 71851], "mapped", [71883]], [[71852, 71852], "mapped", [71884]], [[71853, 71853], "mapped", [71885]], [[71854, 71854], "mapped", [71886]], [[71855, 71855], "mapped", [71887]], [[71856, 71856], "mapped", [71888]], [[71857, 71857], "mapped", [71889]], [[71858, 71858], "mapped", [71890]], [[71859, 71859], "mapped", [71891]], [[71860, 71860], "mapped", [71892]], [[71861, 71861], "mapped", [71893]], [[71862, 71862], "mapped", [71894]], [[71863, 71863], "mapped", [71895]], [[71864, 71864], "mapped", [71896]], [[71865, 71865], "mapped", [71897]], [[71866, 71866], "mapped", [71898]], [[71867, 71867], "mapped", [71899]], [[71868, 71868], "mapped", [71900]], [[71869, 71869], "mapped", [71901]], [[71870, 71870], "mapped", [71902]], [[71871, 71871], "mapped", [71903]], [[71872, 71913], "valid"], [[71914, 71922], "valid", [], "NV8"], [[71923, 71934], "disallowed"], [[71935, 71935], "valid"], [[71936, 72383], "disallowed"], [[72384, 72440], "valid"], [[72441, 73727], "disallowed"], [[73728, 74606], "valid"], [[74607, 74648], "valid"], [[74649, 74649], "valid"], [[74650, 74751], "disallowed"], [[74752, 74850], "valid", [], "NV8"], [[74851, 74862], "valid", [], "NV8"], [[74863, 74863], "disallowed"], [[74864, 74867], "valid", [], "NV8"], [[74868, 74868], "valid", [], "NV8"], [[74869, 74879], "disallowed"], [[74880, 75075], "valid"], [[75076, 77823], "disallowed"], [[77824, 78894], "valid"], [[78895, 82943], "disallowed"], [[82944, 83526], "valid"], [[83527, 92159], "disallowed"], [[92160, 92728], "valid"], [[92729, 92735], "disallowed"], [[92736, 92766], "valid"], [[92767, 92767], "disallowed"], [[92768, 92777], "valid"], [[92778, 92781], "disallowed"], [[92782, 92783], "valid", [], "NV8"], [[92784, 92879], "disallowed"], [[92880, 92909], "valid"], [[92910, 92911], "disallowed"], [[92912, 92916], "valid"], [[92917, 92917], "valid", [], "NV8"], [[92918, 92927], "disallowed"], [[92928, 92982], "valid"], [[92983, 92991], "valid", [], "NV8"], [[92992, 92995], "valid"], [[92996, 92997], "valid", [], "NV8"], [[92998, 93007], "disallowed"], [[93008, 93017], "valid"], [[93018, 93018], "disallowed"], [[93019, 93025], "valid", [], "NV8"], [[93026, 93026], "disallowed"], [[93027, 93047], "valid"], [[93048, 93052], "disallowed"], [[93053, 93071], "valid"], [[93072, 93951], "disallowed"], [[93952, 94020], "valid"], [[94021, 94031], "disallowed"], [[94032, 94078], "valid"], [[94079, 94094], "disallowed"], [[94095, 94111], "valid"], [[94112, 110591], "disallowed"], [[110592, 110593], "valid"], [[110594, 113663], "disallowed"], [[113664, 113770], "valid"], [[113771, 113775], "disallowed"], [[113776, 113788], "valid"], [[113789, 113791], "disallowed"], [[113792, 113800], "valid"], [[113801, 113807], "disallowed"], [[113808, 113817], "valid"], [[113818, 113819], "disallowed"], [[113820, 113820], "valid", [], "NV8"], [[113821, 113822], "valid"], [[113823, 113823], "valid", [], "NV8"], [[113824, 113827], "ignored"], [[113828, 118783], "disallowed"], [[118784, 119029], "valid", [], "NV8"], [[119030, 119039], "disallowed"], [[119040, 119078], "valid", [], "NV8"], [[119079, 119080], "disallowed"], [[119081, 119081], "valid", [], "NV8"], [[119082, 119133], "valid", [], "NV8"], [[119134, 119134], "mapped", [119127, 119141]], [[119135, 119135], "mapped", [119128, 119141]], [[119136, 119136], "mapped", [119128, 119141, 119150]], [[119137, 119137], "mapped", [119128, 119141, 119151]], [[119138, 119138], "mapped", [119128, 119141, 119152]], [[119139, 119139], "mapped", [119128, 119141, 119153]], [[119140, 119140], "mapped", [119128, 119141, 119154]], [[119141, 119154], "valid", [], "NV8"], [[119155, 119162], "disallowed"], [[119163, 119226], "valid", [], "NV8"], [[119227, 119227], "mapped", [119225, 119141]], [[119228, 119228], "mapped", [119226, 119141]], [[119229, 119229], "mapped", [119225, 119141, 119150]], [[119230, 119230], "mapped", [119226, 119141, 119150]], [[119231, 119231], "mapped", [119225, 119141, 119151]], [[119232, 119232], "mapped", [119226, 119141, 119151]], [[119233, 119261], "valid", [], "NV8"], [[119262, 119272], "valid", [], "NV8"], [[119273, 119295], "disallowed"], [[119296, 119365], "valid", [], "NV8"], [[119366, 119551], "disallowed"], [[119552, 119638], "valid", [], "NV8"], [[119639, 119647], "disallowed"], [[119648, 119665], "valid", [], "NV8"], [[119666, 119807], "disallowed"], [[119808, 119808], "mapped", [97]], [[119809, 119809], "mapped", [98]], [[119810, 119810], "mapped", [99]], [[119811, 119811], "mapped", [100]], [[119812, 119812], "mapped", [101]], [[119813, 119813], "mapped", [102]], [[119814, 119814], "mapped", [103]], [[119815, 119815], "mapped", [104]], [[119816, 119816], "mapped", [105]], [[119817, 119817], "mapped", [106]], [[119818, 119818], "mapped", [107]], [[119819, 119819], "mapped", [108]], [[119820, 119820], "mapped", [109]], [[119821, 119821], "mapped", [110]], [[119822, 119822], "mapped", [111]], [[119823, 119823], "mapped", [112]], [[119824, 119824], "mapped", [113]], [[119825, 119825], "mapped", [114]], [[119826, 119826], "mapped", [115]], [[119827, 119827], "mapped", [116]], [[119828, 119828], "mapped", [117]], [[119829, 119829], "mapped", [118]], [[119830, 119830], "mapped", [119]], [[119831, 119831], "mapped", [120]], [[119832, 119832], "mapped", [121]], [[119833, 119833], "mapped", [122]], [[119834, 119834], "mapped", [97]], [[119835, 119835], "mapped", [98]], [[119836, 119836], "mapped", [99]], [[119837, 119837], "mapped", [100]], [[119838, 119838], "mapped", [101]], [[119839, 119839], "mapped", [102]], [[119840, 119840], "mapped", [103]], [[119841, 119841], "mapped", [104]], [[119842, 119842], "mapped", [105]], [[119843, 119843], "mapped", [106]], [[119844, 119844], "mapped", [107]], [[119845, 119845], "mapped", [108]], [[119846, 119846], "mapped", [109]], [[119847, 119847], "mapped", [110]], [[119848, 119848], "mapped", [111]], [[119849, 119849], "mapped", [112]], [[119850, 119850], "mapped", [113]], [[119851, 119851], "mapped", [114]], [[119852, 119852], "mapped", [115]], [[119853, 119853], "mapped", [116]], [[119854, 119854], "mapped", [117]], [[119855, 119855], "mapped", [118]], [[119856, 119856], "mapped", [119]], [[119857, 119857], "mapped", [120]], [[119858, 119858], "mapped", [121]], [[119859, 119859], "mapped", [122]], [[119860, 119860], "mapped", [97]], [[119861, 119861], "mapped", [98]], [[119862, 119862], "mapped", [99]], [[119863, 119863], "mapped", [100]], [[119864, 119864], "mapped", [101]], [[119865, 119865], "mapped", [102]], [[119866, 119866], "mapped", [103]], [[119867, 119867], "mapped", [104]], [[119868, 119868], "mapped", [105]], [[119869, 119869], "mapped", [106]], [[119870, 119870], "mapped", [107]], [[119871, 119871], "mapped", [108]], [[119872, 119872], "mapped", [109]], [[119873, 119873], "mapped", [110]], [[119874, 119874], "mapped", [111]], [[119875, 119875], "mapped", [112]], [[119876, 119876], "mapped", [113]], [[119877, 119877], "mapped", [114]], [[119878, 119878], "mapped", [115]], [[119879, 119879], "mapped", [116]], [[119880, 119880], "mapped", [117]], [[119881, 119881], "mapped", [118]], [[119882, 119882], "mapped", [119]], [[119883, 119883], "mapped", [120]], [[119884, 119884], "mapped", [121]], [[119885, 119885], "mapped", [122]], [[119886, 119886], "mapped", [97]], [[119887, 119887], "mapped", [98]], [[119888, 119888], "mapped", [99]], [[119889, 119889], "mapped", [100]], [[119890, 119890], "mapped", [101]], [[119891, 119891], "mapped", [102]], [[119892, 119892], "mapped", [103]], [[119893, 119893], "disallowed"], [[119894, 119894], "mapped", [105]], [[119895, 119895], "mapped", [106]], [[119896, 119896], "mapped", [107]], [[119897, 119897], "mapped", [108]], [[119898, 119898], "mapped", [109]], [[119899, 119899], "mapped", [110]], [[119900, 119900], "mapped", [111]], [[119901, 119901], "mapped", [112]], [[119902, 119902], "mapped", [113]], [[119903, 119903], "mapped", [114]], [[119904, 119904], "mapped", [115]], [[119905, 119905], "mapped", [116]], [[119906, 119906], "mapped", [117]], [[119907, 119907], "mapped", [118]], [[119908, 119908], "mapped", [119]], [[119909, 119909], "mapped", [120]], [[119910, 119910], "mapped", [121]], [[119911, 119911], "mapped", [122]], [[119912, 119912], "mapped", [97]], [[119913, 119913], "mapped", [98]], [[119914, 119914], "mapped", [99]], [[119915, 119915], "mapped", [100]], [[119916, 119916], "mapped", [101]], [[119917, 119917], "mapped", [102]], [[119918, 119918], "mapped", [103]], [[119919, 119919], "mapped", [104]], [[119920, 119920], "mapped", [105]], [[119921, 119921], "mapped", [106]], [[119922, 119922], "mapped", [107]], [[119923, 119923], "mapped", [108]], [[119924, 119924], "mapped", [109]], [[119925, 119925], "mapped", [110]], [[119926, 119926], "mapped", [111]], [[119927, 119927], "mapped", [112]], [[119928, 119928], "mapped", [113]], [[119929, 119929], "mapped", [114]], [[119930, 119930], "mapped", [115]], [[119931, 119931], "mapped", [116]], [[119932, 119932], "mapped", [117]], [[119933, 119933], "mapped", [118]], [[119934, 119934], "mapped", [119]], [[119935, 119935], "mapped", [120]], [[119936, 119936], "mapped", [121]], [[119937, 119937], "mapped", [122]], [[119938, 119938], "mapped", [97]], [[119939, 119939], "mapped", [98]], [[119940, 119940], "mapped", [99]], [[119941, 119941], "mapped", [100]], [[119942, 119942], "mapped", [101]], [[119943, 119943], "mapped", [102]], [[119944, 119944], "mapped", [103]], [[119945, 119945], "mapped", [104]], [[119946, 119946], "mapped", [105]], [[119947, 119947], "mapped", [106]], [[119948, 119948], "mapped", [107]], [[119949, 119949], "mapped", [108]], [[119950, 119950], "mapped", [109]], [[119951, 119951], "mapped", [110]], [[119952, 119952], "mapped", [111]], [[119953, 119953], "mapped", [112]], [[119954, 119954], "mapped", [113]], [[119955, 119955], "mapped", [114]], [[119956, 119956], "mapped", [115]], [[119957, 119957], "mapped", [116]], [[119958, 119958], "mapped", [117]], [[119959, 119959], "mapped", [118]], [[119960, 119960], "mapped", [119]], [[119961, 119961], "mapped", [120]], [[119962, 119962], "mapped", [121]], [[119963, 119963], "mapped", [122]], [[119964, 119964], "mapped", [97]], [[119965, 119965], "disallowed"], [[119966, 119966], "mapped", [99]], [[119967, 119967], "mapped", [100]], [[119968, 119969], "disallowed"], [[119970, 119970], "mapped", [103]], [[119971, 119972], "disallowed"], [[119973, 119973], "mapped", [106]], [[119974, 119974], "mapped", [107]], [[119975, 119976], "disallowed"], [[119977, 119977], "mapped", [110]], [[119978, 119978], "mapped", [111]], [[119979, 119979], "mapped", [112]], [[119980, 119980], "mapped", [113]], [[119981, 119981], "disallowed"], [[119982, 119982], "mapped", [115]], [[119983, 119983], "mapped", [116]], [[119984, 119984], "mapped", [117]], [[119985, 119985], "mapped", [118]], [[119986, 119986], "mapped", [119]], [[119987, 119987], "mapped", [120]], [[119988, 119988], "mapped", [121]], [[119989, 119989], "mapped", [122]], [[119990, 119990], "mapped", [97]], [[119991, 119991], "mapped", [98]], [[119992, 119992], "mapped", [99]], [[119993, 119993], "mapped", [100]], [[119994, 119994], "disallowed"], [[119995, 119995], "mapped", [102]], [[119996, 119996], "disallowed"], [[119997, 119997], "mapped", [104]], [[119998, 119998], "mapped", [105]], [[119999, 119999], "mapped", [106]], [[12e4, 12e4], "mapped", [107]], [[120001, 120001], "mapped", [108]], [[120002, 120002], "mapped", [109]], [[120003, 120003], "mapped", [110]], [[120004, 120004], "disallowed"], [[120005, 120005], "mapped", [112]], [[120006, 120006], "mapped", [113]], [[120007, 120007], "mapped", [114]], [[120008, 120008], "mapped", [115]], [[120009, 120009], "mapped", [116]], [[120010, 120010], "mapped", [117]], [[120011, 120011], "mapped", [118]], [[120012, 120012], "mapped", [119]], [[120013, 120013], "mapped", [120]], [[120014, 120014], "mapped", [121]], [[120015, 120015], "mapped", [122]], [[120016, 120016], "mapped", [97]], [[120017, 120017], "mapped", [98]], [[120018, 120018], "mapped", [99]], [[120019, 120019], "mapped", [100]], [[120020, 120020], "mapped", [101]], [[120021, 120021], "mapped", [102]], [[120022, 120022], "mapped", [103]], [[120023, 120023], "mapped", [104]], [[120024, 120024], "mapped", [105]], [[120025, 120025], "mapped", [106]], [[120026, 120026], "mapped", [107]], [[120027, 120027], "mapped", [108]], [[120028, 120028], "mapped", [109]], [[120029, 120029], "mapped", [110]], [[120030, 120030], "mapped", [111]], [[120031, 120031], "mapped", [112]], [[120032, 120032], "mapped", [113]], [[120033, 120033], "mapped", [114]], [[120034, 120034], "mapped", [115]], [[120035, 120035], "mapped", [116]], [[120036, 120036], "mapped", [117]], [[120037, 120037], "mapped", [118]], [[120038, 120038], "mapped", [119]], [[120039, 120039], "mapped", [120]], [[120040, 120040], "mapped", [121]], [[120041, 120041], "mapped", [122]], [[120042, 120042], "mapped", [97]], [[120043, 120043], "mapped", [98]], [[120044, 120044], "mapped", [99]], [[120045, 120045], "mapped", [100]], [[120046, 120046], "mapped", [101]], [[120047, 120047], "mapped", [102]], [[120048, 120048], "mapped", [103]], [[120049, 120049], "mapped", [104]], [[120050, 120050], "mapped", [105]], [[120051, 120051], "mapped", [106]], [[120052, 120052], "mapped", [107]], [[120053, 120053], "mapped", [108]], [[120054, 120054], "mapped", [109]], [[120055, 120055], "mapped", [110]], [[120056, 120056], "mapped", [111]], [[120057, 120057], "mapped", [112]], [[120058, 120058], "mapped", [113]], [[120059, 120059], "mapped", [114]], [[120060, 120060], "mapped", [115]], [[120061, 120061], "mapped", [116]], [[120062, 120062], "mapped", [117]], [[120063, 120063], "mapped", [118]], [[120064, 120064], "mapped", [119]], [[120065, 120065], "mapped", [120]], [[120066, 120066], "mapped", [121]], [[120067, 120067], "mapped", [122]], [[120068, 120068], "mapped", [97]], [[120069, 120069], "mapped", [98]], [[120070, 120070], "disallowed"], [[120071, 120071], "mapped", [100]], [[120072, 120072], "mapped", [101]], [[120073, 120073], "mapped", [102]], [[120074, 120074], "mapped", [103]], [[120075, 120076], "disallowed"], [[120077, 120077], "mapped", [106]], [[120078, 120078], "mapped", [107]], [[120079, 120079], "mapped", [108]], [[120080, 120080], "mapped", [109]], [[120081, 120081], "mapped", [110]], [[120082, 120082], "mapped", [111]], [[120083, 120083], "mapped", [112]], [[120084, 120084], "mapped", [113]], [[120085, 120085], "disallowed"], [[120086, 120086], "mapped", [115]], [[120087, 120087], "mapped", [116]], [[120088, 120088], "mapped", [117]], [[120089, 120089], "mapped", [118]], [[120090, 120090], "mapped", [119]], [[120091, 120091], "mapped", [120]], [[120092, 120092], "mapped", [121]], [[120093, 120093], "disallowed"], [[120094, 120094], "mapped", [97]], [[120095, 120095], "mapped", [98]], [[120096, 120096], "mapped", [99]], [[120097, 120097], "mapped", [100]], [[120098, 120098], "mapped", [101]], [[120099, 120099], "mapped", [102]], [[120100, 120100], "mapped", [103]], [[120101, 120101], "mapped", [104]], [[120102, 120102], "mapped", [105]], [[120103, 120103], "mapped", [106]], [[120104, 120104], "mapped", [107]], [[120105, 120105], "mapped", [108]], [[120106, 120106], "mapped", [109]], [[120107, 120107], "mapped", [110]], [[120108, 120108], "mapped", [111]], [[120109, 120109], "mapped", [112]], [[120110, 120110], "mapped", [113]], [[120111, 120111], "mapped", [114]], [[120112, 120112], "mapped", [115]], [[120113, 120113], "mapped", [116]], [[120114, 120114], "mapped", [117]], [[120115, 120115], "mapped", [118]], [[120116, 120116], "mapped", [119]], [[120117, 120117], "mapped", [120]], [[120118, 120118], "mapped", [121]], [[120119, 120119], "mapped", [122]], [[120120, 120120], "mapped", [97]], [[120121, 120121], "mapped", [98]], [[120122, 120122], "disallowed"], [[120123, 120123], "mapped", [100]], [[120124, 120124], "mapped", [101]], [[120125, 120125], "mapped", [102]], [[120126, 120126], "mapped", [103]], [[120127, 120127], "disallowed"], [[120128, 120128], "mapped", [105]], [[120129, 120129], "mapped", [106]], [[120130, 120130], "mapped", [107]], [[120131, 120131], "mapped", [108]], [[120132, 120132], "mapped", [109]], [[120133, 120133], "disallowed"], [[120134, 120134], "mapped", [111]], [[120135, 120137], "disallowed"], [[120138, 120138], "mapped", [115]], [[120139, 120139], "mapped", [116]], [[120140, 120140], "mapped", [117]], [[120141, 120141], "mapped", [118]], [[120142, 120142], "mapped", [119]], [[120143, 120143], "mapped", [120]], [[120144, 120144], "mapped", [121]], [[120145, 120145], "disallowed"], [[120146, 120146], "mapped", [97]], [[120147, 120147], "mapped", [98]], [[120148, 120148], "mapped", [99]], [[120149, 120149], "mapped", [100]], [[120150, 120150], "mapped", [101]], [[120151, 120151], "mapped", [102]], [[120152, 120152], "mapped", [103]], [[120153, 120153], "mapped", [104]], [[120154, 120154], "mapped", [105]], [[120155, 120155], "mapped", [106]], [[120156, 120156], "mapped", [107]], [[120157, 120157], "mapped", [108]], [[120158, 120158], "mapped", [109]], [[120159, 120159], "mapped", [110]], [[120160, 120160], "mapped", [111]], [[120161, 120161], "mapped", [112]], [[120162, 120162], "mapped", [113]], [[120163, 120163], "mapped", [114]], [[120164, 120164], "mapped", [115]], [[120165, 120165], "mapped", [116]], [[120166, 120166], "mapped", [117]], [[120167, 120167], "mapped", [118]], [[120168, 120168], "mapped", [119]], [[120169, 120169], "mapped", [120]], [[120170, 120170], "mapped", [121]], [[120171, 120171], "mapped", [122]], [[120172, 120172], "mapped", [97]], [[120173, 120173], "mapped", [98]], [[120174, 120174], "mapped", [99]], [[120175, 120175], "mapped", [100]], [[120176, 120176], "mapped", [101]], [[120177, 120177], "mapped", [102]], [[120178, 120178], "mapped", [103]], [[120179, 120179], "mapped", [104]], [[120180, 120180], "mapped", [105]], [[120181, 120181], "mapped", [106]], [[120182, 120182], "mapped", [107]], [[120183, 120183], "mapped", [108]], [[120184, 120184], "mapped", [109]], [[120185, 120185], "mapped", [110]], [[120186, 120186], "mapped", [111]], [[120187, 120187], "mapped", [112]], [[120188, 120188], "mapped", [113]], [[120189, 120189], "mapped", [114]], [[120190, 120190], "mapped", [115]], [[120191, 120191], "mapped", [116]], [[120192, 120192], "mapped", [117]], [[120193, 120193], "mapped", [118]], [[120194, 120194], "mapped", [119]], [[120195, 120195], "mapped", [120]], [[120196, 120196], "mapped", [121]], [[120197, 120197], "mapped", [122]], [[120198, 120198], "mapped", [97]], [[120199, 120199], "mapped", [98]], [[120200, 120200], "mapped", [99]], [[120201, 120201], "mapped", [100]], [[120202, 120202], "mapped", [101]], [[120203, 120203], "mapped", [102]], [[120204, 120204], "mapped", [103]], [[120205, 120205], "mapped", [104]], [[120206, 120206], "mapped", [105]], [[120207, 120207], "mapped", [106]], [[120208, 120208], "mapped", [107]], [[120209, 120209], "mapped", [108]], [[120210, 120210], "mapped", [109]], [[120211, 120211], "mapped", [110]], [[120212, 120212], "mapped", [111]], [[120213, 120213], "mapped", [112]], [[120214, 120214], "mapped", [113]], [[120215, 120215], "mapped", [114]], [[120216, 120216], "mapped", [115]], [[120217, 120217], "mapped", [116]], [[120218, 120218], "mapped", [117]], [[120219, 120219], "mapped", [118]], [[120220, 120220], "mapped", [119]], [[120221, 120221], "mapped", [120]], [[120222, 120222], "mapped", [121]], [[120223, 120223], "mapped", [122]], [[120224, 120224], "mapped", [97]], [[120225, 120225], "mapped", [98]], [[120226, 120226], "mapped", [99]], [[120227, 120227], "mapped", [100]], [[120228, 120228], "mapped", [101]], [[120229, 120229], "mapped", [102]], [[120230, 120230], "mapped", [103]], [[120231, 120231], "mapped", [104]], [[120232, 120232], "mapped", [105]], [[120233, 120233], "mapped", [106]], [[120234, 120234], "mapped", [107]], [[120235, 120235], "mapped", [108]], [[120236, 120236], "mapped", [109]], [[120237, 120237], "mapped", [110]], [[120238, 120238], "mapped", [111]], [[120239, 120239], "mapped", [112]], [[120240, 120240], "mapped", [113]], [[120241, 120241], "mapped", [114]], [[120242, 120242], "mapped", [115]], [[120243, 120243], "mapped", [116]], [[120244, 120244], "mapped", [117]], [[120245, 120245], "mapped", [118]], [[120246, 120246], "mapped", [119]], [[120247, 120247], "mapped", [120]], [[120248, 120248], "mapped", [121]], [[120249, 120249], "mapped", [122]], [[120250, 120250], "mapped", [97]], [[120251, 120251], "mapped", [98]], [[120252, 120252], "mapped", [99]], [[120253, 120253], "mapped", [100]], [[120254, 120254], "mapped", [101]], [[120255, 120255], "mapped", [102]], [[120256, 120256], "mapped", [103]], [[120257, 120257], "mapped", [104]], [[120258, 120258], "mapped", [105]], [[120259, 120259], "mapped", [106]], [[120260, 120260], "mapped", [107]], [[120261, 120261], "mapped", [108]], [[120262, 120262], "mapped", [109]], [[120263, 120263], "mapped", [110]], [[120264, 120264], "mapped", [111]], [[120265, 120265], "mapped", [112]], [[120266, 120266], "mapped", [113]], [[120267, 120267], "mapped", [114]], [[120268, 120268], "mapped", [115]], [[120269, 120269], "mapped", [116]], [[120270, 120270], "mapped", [117]], [[120271, 120271], "mapped", [118]], [[120272, 120272], "mapped", [119]], [[120273, 120273], "mapped", [120]], [[120274, 120274], "mapped", [121]], [[120275, 120275], "mapped", [122]], [[120276, 120276], "mapped", [97]], [[120277, 120277], "mapped", [98]], [[120278, 120278], "mapped", [99]], [[120279, 120279], "mapped", [100]], [[120280, 120280], "mapped", [101]], [[120281, 120281], "mapped", [102]], [[120282, 120282], "mapped", [103]], [[120283, 120283], "mapped", [104]], [[120284, 120284], "mapped", [105]], [[120285, 120285], "mapped", [106]], [[120286, 120286], "mapped", [107]], [[120287, 120287], "mapped", [108]], [[120288, 120288], "mapped", [109]], [[120289, 120289], "mapped", [110]], [[120290, 120290], "mapped", [111]], [[120291, 120291], "mapped", [112]], [[120292, 120292], "mapped", [113]], [[120293, 120293], "mapped", [114]], [[120294, 120294], "mapped", [115]], [[120295, 120295], "mapped", [116]], [[120296, 120296], "mapped", [117]], [[120297, 120297], "mapped", [118]], [[120298, 120298], "mapped", [119]], [[120299, 120299], "mapped", [120]], [[120300, 120300], "mapped", [121]], [[120301, 120301], "mapped", [122]], [[120302, 120302], "mapped", [97]], [[120303, 120303], "mapped", [98]], [[120304, 120304], "mapped", [99]], [[120305, 120305], "mapped", [100]], [[120306, 120306], "mapped", [101]], [[120307, 120307], "mapped", [102]], [[120308, 120308], "mapped", [103]], [[120309, 120309], "mapped", [104]], [[120310, 120310], "mapped", [105]], [[120311, 120311], "mapped", [106]], [[120312, 120312], "mapped", [107]], [[120313, 120313], "mapped", [108]], [[120314, 120314], "mapped", [109]], [[120315, 120315], "mapped", [110]], [[120316, 120316], "mapped", [111]], [[120317, 120317], "mapped", [112]], [[120318, 120318], "mapped", [113]], [[120319, 120319], "mapped", [114]], [[120320, 120320], "mapped", [115]], [[120321, 120321], "mapped", [116]], [[120322, 120322], "mapped", [117]], [[120323, 120323], "mapped", [118]], [[120324, 120324], "mapped", [119]], [[120325, 120325], "mapped", [120]], [[120326, 120326], "mapped", [121]], [[120327, 120327], "mapped", [122]], [[120328, 120328], "mapped", [97]], [[120329, 120329], "mapped", [98]], [[120330, 120330], "mapped", [99]], [[120331, 120331], "mapped", [100]], [[120332, 120332], "mapped", [101]], [[120333, 120333], "mapped", [102]], [[120334, 120334], "mapped", [103]], [[120335, 120335], "mapped", [104]], [[120336, 120336], "mapped", [105]], [[120337, 120337], "mapped", [106]], [[120338, 120338], "mapped", [107]], [[120339, 120339], "mapped", [108]], [[120340, 120340], "mapped", [109]], [[120341, 120341], "mapped", [110]], [[120342, 120342], "mapped", [111]], [[120343, 120343], "mapped", [112]], [[120344, 120344], "mapped", [113]], [[120345, 120345], "mapped", [114]], [[120346, 120346], "mapped", [115]], [[120347, 120347], "mapped", [116]], [[120348, 120348], "mapped", [117]], [[120349, 120349], "mapped", [118]], [[120350, 120350], "mapped", [119]], [[120351, 120351], "mapped", [120]], [[120352, 120352], "mapped", [121]], [[120353, 120353], "mapped", [122]], [[120354, 120354], "mapped", [97]], [[120355, 120355], "mapped", [98]], [[120356, 120356], "mapped", [99]], [[120357, 120357], "mapped", [100]], [[120358, 120358], "mapped", [101]], [[120359, 120359], "mapped", [102]], [[120360, 120360], "mapped", [103]], [[120361, 120361], "mapped", [104]], [[120362, 120362], "mapped", [105]], [[120363, 120363], "mapped", [106]], [[120364, 120364], "mapped", [107]], [[120365, 120365], "mapped", [108]], [[120366, 120366], "mapped", [109]], [[120367, 120367], "mapped", [110]], [[120368, 120368], "mapped", [111]], [[120369, 120369], "mapped", [112]], [[120370, 120370], "mapped", [113]], [[120371, 120371], "mapped", [114]], [[120372, 120372], "mapped", [115]], [[120373, 120373], "mapped", [116]], [[120374, 120374], "mapped", [117]], [[120375, 120375], "mapped", [118]], [[120376, 120376], "mapped", [119]], [[120377, 120377], "mapped", [120]], [[120378, 120378], "mapped", [121]], [[120379, 120379], "mapped", [122]], [[120380, 120380], "mapped", [97]], [[120381, 120381], "mapped", [98]], [[120382, 120382], "mapped", [99]], [[120383, 120383], "mapped", [100]], [[120384, 120384], "mapped", [101]], [[120385, 120385], "mapped", [102]], [[120386, 120386], "mapped", [103]], [[120387, 120387], "mapped", [104]], [[120388, 120388], "mapped", [105]], [[120389, 120389], "mapped", [106]], [[120390, 120390], "mapped", [107]], [[120391, 120391], "mapped", [108]], [[120392, 120392], "mapped", [109]], [[120393, 120393], "mapped", [110]], [[120394, 120394], "mapped", [111]], [[120395, 120395], "mapped", [112]], [[120396, 120396], "mapped", [113]], [[120397, 120397], "mapped", [114]], [[120398, 120398], "mapped", [115]], [[120399, 120399], "mapped", [116]], [[120400, 120400], "mapped", [117]], [[120401, 120401], "mapped", [118]], [[120402, 120402], "mapped", [119]], [[120403, 120403], "mapped", [120]], [[120404, 120404], "mapped", [121]], [[120405, 120405], "mapped", [122]], [[120406, 120406], "mapped", [97]], [[120407, 120407], "mapped", [98]], [[120408, 120408], "mapped", [99]], [[120409, 120409], "mapped", [100]], [[120410, 120410], "mapped", [101]], [[120411, 120411], "mapped", [102]], [[120412, 120412], "mapped", [103]], [[120413, 120413], "mapped", [104]], [[120414, 120414], "mapped", [105]], [[120415, 120415], "mapped", [106]], [[120416, 120416], "mapped", [107]], [[120417, 120417], "mapped", [108]], [[120418, 120418], "mapped", [109]], [[120419, 120419], "mapped", [110]], [[120420, 120420], "mapped", [111]], [[120421, 120421], "mapped", [112]], [[120422, 120422], "mapped", [113]], [[120423, 120423], "mapped", [114]], [[120424, 120424], "mapped", [115]], [[120425, 120425], "mapped", [116]], [[120426, 120426], "mapped", [117]], [[120427, 120427], "mapped", [118]], [[120428, 120428], "mapped", [119]], [[120429, 120429], "mapped", [120]], [[120430, 120430], "mapped", [121]], [[120431, 120431], "mapped", [122]], [[120432, 120432], "mapped", [97]], [[120433, 120433], "mapped", [98]], [[120434, 120434], "mapped", [99]], [[120435, 120435], "mapped", [100]], [[120436, 120436], "mapped", [101]], [[120437, 120437], "mapped", [102]], [[120438, 120438], "mapped", [103]], [[120439, 120439], "mapped", [104]], [[120440, 120440], "mapped", [105]], [[120441, 120441], "mapped", [106]], [[120442, 120442], "mapped", [107]], [[120443, 120443], "mapped", [108]], [[120444, 120444], "mapped", [109]], [[120445, 120445], "mapped", [110]], [[120446, 120446], "mapped", [111]], [[120447, 120447], "mapped", [112]], [[120448, 120448], "mapped", [113]], [[120449, 120449], "mapped", [114]], [[120450, 120450], "mapped", [115]], [[120451, 120451], "mapped", [116]], [[120452, 120452], "mapped", [117]], [[120453, 120453], "mapped", [118]], [[120454, 120454], "mapped", [119]], [[120455, 120455], "mapped", [120]], [[120456, 120456], "mapped", [121]], [[120457, 120457], "mapped", [122]], [[120458, 120458], "mapped", [97]], [[120459, 120459], "mapped", [98]], [[120460, 120460], "mapped", [99]], [[120461, 120461], "mapped", [100]], [[120462, 120462], "mapped", [101]], [[120463, 120463], "mapped", [102]], [[120464, 120464], "mapped", [103]], [[120465, 120465], "mapped", [104]], [[120466, 120466], "mapped", [105]], [[120467, 120467], "mapped", [106]], [[120468, 120468], "mapped", [107]], [[120469, 120469], "mapped", [108]], [[120470, 120470], "mapped", [109]], [[120471, 120471], "mapped", [110]], [[120472, 120472], "mapped", [111]], [[120473, 120473], "mapped", [112]], [[120474, 120474], "mapped", [113]], [[120475, 120475], "mapped", [114]], [[120476, 120476], "mapped", [115]], [[120477, 120477], "mapped", [116]], [[120478, 120478], "mapped", [117]], [[120479, 120479], "mapped", [118]], [[120480, 120480], "mapped", [119]], [[120481, 120481], "mapped", [120]], [[120482, 120482], "mapped", [121]], [[120483, 120483], "mapped", [122]], [[120484, 120484], "mapped", [305]], [[120485, 120485], "mapped", [567]], [[120486, 120487], "disallowed"], [[120488, 120488], "mapped", [945]], [[120489, 120489], "mapped", [946]], [[120490, 120490], "mapped", [947]], [[120491, 120491], "mapped", [948]], [[120492, 120492], "mapped", [949]], [[120493, 120493], "mapped", [950]], [[120494, 120494], "mapped", [951]], [[120495, 120495], "mapped", [952]], [[120496, 120496], "mapped", [953]], [[120497, 120497], "mapped", [954]], [[120498, 120498], "mapped", [955]], [[120499, 120499], "mapped", [956]], [[120500, 120500], "mapped", [957]], [[120501, 120501], "mapped", [958]], [[120502, 120502], "mapped", [959]], [[120503, 120503], "mapped", [960]], [[120504, 120504], "mapped", [961]], [[120505, 120505], "mapped", [952]], [[120506, 120506], "mapped", [963]], [[120507, 120507], "mapped", [964]], [[120508, 120508], "mapped", [965]], [[120509, 120509], "mapped", [966]], [[120510, 120510], "mapped", [967]], [[120511, 120511], "mapped", [968]], [[120512, 120512], "mapped", [969]], [[120513, 120513], "mapped", [8711]], [[120514, 120514], "mapped", [945]], [[120515, 120515], "mapped", [946]], [[120516, 120516], "mapped", [947]], [[120517, 120517], "mapped", [948]], [[120518, 120518], "mapped", [949]], [[120519, 120519], "mapped", [950]], [[120520, 120520], "mapped", [951]], [[120521, 120521], "mapped", [952]], [[120522, 120522], "mapped", [953]], [[120523, 120523], "mapped", [954]], [[120524, 120524], "mapped", [955]], [[120525, 120525], "mapped", [956]], [[120526, 120526], "mapped", [957]], [[120527, 120527], "mapped", [958]], [[120528, 120528], "mapped", [959]], [[120529, 120529], "mapped", [960]], [[120530, 120530], "mapped", [961]], [[120531, 120532], "mapped", [963]], [[120533, 120533], "mapped", [964]], [[120534, 120534], "mapped", [965]], [[120535, 120535], "mapped", [966]], [[120536, 120536], "mapped", [967]], [[120537, 120537], "mapped", [968]], [[120538, 120538], "mapped", [969]], [[120539, 120539], "mapped", [8706]], [[120540, 120540], "mapped", [949]], [[120541, 120541], "mapped", [952]], [[120542, 120542], "mapped", [954]], [[120543, 120543], "mapped", [966]], [[120544, 120544], "mapped", [961]], [[120545, 120545], "mapped", [960]], [[120546, 120546], "mapped", [945]], [[120547, 120547], "mapped", [946]], [[120548, 120548], "mapped", [947]], [[120549, 120549], "mapped", [948]], [[120550, 120550], "mapped", [949]], [[120551, 120551], "mapped", [950]], [[120552, 120552], "mapped", [951]], [[120553, 120553], "mapped", [952]], [[120554, 120554], "mapped", [953]], [[120555, 120555], "mapped", [954]], [[120556, 120556], "mapped", [955]], [[120557, 120557], "mapped", [956]], [[120558, 120558], "mapped", [957]], [[120559, 120559], "mapped", [958]], [[120560, 120560], "mapped", [959]], [[120561, 120561], "mapped", [960]], [[120562, 120562], "mapped", [961]], [[120563, 120563], "mapped", [952]], [[120564, 120564], "mapped", [963]], [[120565, 120565], "mapped", [964]], [[120566, 120566], "mapped", [965]], [[120567, 120567], "mapped", [966]], [[120568, 120568], "mapped", [967]], [[120569, 120569], "mapped", [968]], [[120570, 120570], "mapped", [969]], [[120571, 120571], "mapped", [8711]], [[120572, 120572], "mapped", [945]], [[120573, 120573], "mapped", [946]], [[120574, 120574], "mapped", [947]], [[120575, 120575], "mapped", [948]], [[120576, 120576], "mapped", [949]], [[120577, 120577], "mapped", [950]], [[120578, 120578], "mapped", [951]], [[120579, 120579], "mapped", [952]], [[120580, 120580], "mapped", [953]], [[120581, 120581], "mapped", [954]], [[120582, 120582], "mapped", [955]], [[120583, 120583], "mapped", [956]], [[120584, 120584], "mapped", [957]], [[120585, 120585], "mapped", [958]], [[120586, 120586], "mapped", [959]], [[120587, 120587], "mapped", [960]], [[120588, 120588], "mapped", [961]], [[120589, 120590], "mapped", [963]], [[120591, 120591], "mapped", [964]], [[120592, 120592], "mapped", [965]], [[120593, 120593], "mapped", [966]], [[120594, 120594], "mapped", [967]], [[120595, 120595], "mapped", [968]], [[120596, 120596], "mapped", [969]], [[120597, 120597], "mapped", [8706]], [[120598, 120598], "mapped", [949]], [[120599, 120599], "mapped", [952]], [[120600, 120600], "mapped", [954]], [[120601, 120601], "mapped", [966]], [[120602, 120602], "mapped", [961]], [[120603, 120603], "mapped", [960]], [[120604, 120604], "mapped", [945]], [[120605, 120605], "mapped", [946]], [[120606, 120606], "mapped", [947]], [[120607, 120607], "mapped", [948]], [[120608, 120608], "mapped", [949]], [[120609, 120609], "mapped", [950]], [[120610, 120610], "mapped", [951]], [[120611, 120611], "mapped", [952]], [[120612, 120612], "mapped", [953]], [[120613, 120613], "mapped", [954]], [[120614, 120614], "mapped", [955]], [[120615, 120615], "mapped", [956]], [[120616, 120616], "mapped", [957]], [[120617, 120617], "mapped", [958]], [[120618, 120618], "mapped", [959]], [[120619, 120619], "mapped", [960]], [[120620, 120620], "mapped", [961]], [[120621, 120621], "mapped", [952]], [[120622, 120622], "mapped", [963]], [[120623, 120623], "mapped", [964]], [[120624, 120624], "mapped", [965]], [[120625, 120625], "mapped", [966]], [[120626, 120626], "mapped", [967]], [[120627, 120627], "mapped", [968]], [[120628, 120628], "mapped", [969]], [[120629, 120629], "mapped", [8711]], [[120630, 120630], "mapped", [945]], [[120631, 120631], "mapped", [946]], [[120632, 120632], "mapped", [947]], [[120633, 120633], "mapped", [948]], [[120634, 120634], "mapped", [949]], [[120635, 120635], "mapped", [950]], [[120636, 120636], "mapped", [951]], [[120637, 120637], "mapped", [952]], [[120638, 120638], "mapped", [953]], [[120639, 120639], "mapped", [954]], [[120640, 120640], "mapped", [955]], [[120641, 120641], "mapped", [956]], [[120642, 120642], "mapped", [957]], [[120643, 120643], "mapped", [958]], [[120644, 120644], "mapped", [959]], [[120645, 120645], "mapped", [960]], [[120646, 120646], "mapped", [961]], [[120647, 120648], "mapped", [963]], [[120649, 120649], "mapped", [964]], [[120650, 120650], "mapped", [965]], [[120651, 120651], "mapped", [966]], [[120652, 120652], "mapped", [967]], [[120653, 120653], "mapped", [968]], [[120654, 120654], "mapped", [969]], [[120655, 120655], "mapped", [8706]], [[120656, 120656], "mapped", [949]], [[120657, 120657], "mapped", [952]], [[120658, 120658], "mapped", [954]], [[120659, 120659], "mapped", [966]], [[120660, 120660], "mapped", [961]], [[120661, 120661], "mapped", [960]], [[120662, 120662], "mapped", [945]], [[120663, 120663], "mapped", [946]], [[120664, 120664], "mapped", [947]], [[120665, 120665], "mapped", [948]], [[120666, 120666], "mapped", [949]], [[120667, 120667], "mapped", [950]], [[120668, 120668], "mapped", [951]], [[120669, 120669], "mapped", [952]], [[120670, 120670], "mapped", [953]], [[120671, 120671], "mapped", [954]], [[120672, 120672], "mapped", [955]], [[120673, 120673], "mapped", [956]], [[120674, 120674], "mapped", [957]], [[120675, 120675], "mapped", [958]], [[120676, 120676], "mapped", [959]], [[120677, 120677], "mapped", [960]], [[120678, 120678], "mapped", [961]], [[120679, 120679], "mapped", [952]], [[120680, 120680], "mapped", [963]], [[120681, 120681], "mapped", [964]], [[120682, 120682], "mapped", [965]], [[120683, 120683], "mapped", [966]], [[120684, 120684], "mapped", [967]], [[120685, 120685], "mapped", [968]], [[120686, 120686], "mapped", [969]], [[120687, 120687], "mapped", [8711]], [[120688, 120688], "mapped", [945]], [[120689, 120689], "mapped", [946]], [[120690, 120690], "mapped", [947]], [[120691, 120691], "mapped", [948]], [[120692, 120692], "mapped", [949]], [[120693, 120693], "mapped", [950]], [[120694, 120694], "mapped", [951]], [[120695, 120695], "mapped", [952]], [[120696, 120696], "mapped", [953]], [[120697, 120697], "mapped", [954]], [[120698, 120698], "mapped", [955]], [[120699, 120699], "mapped", [956]], [[120700, 120700], "mapped", [957]], [[120701, 120701], "mapped", [958]], [[120702, 120702], "mapped", [959]], [[120703, 120703], "mapped", [960]], [[120704, 120704], "mapped", [961]], [[120705, 120706], "mapped", [963]], [[120707, 120707], "mapped", [964]], [[120708, 120708], "mapped", [965]], [[120709, 120709], "mapped", [966]], [[120710, 120710], "mapped", [967]], [[120711, 120711], "mapped", [968]], [[120712, 120712], "mapped", [969]], [[120713, 120713], "mapped", [8706]], [[120714, 120714], "mapped", [949]], [[120715, 120715], "mapped", [952]], [[120716, 120716], "mapped", [954]], [[120717, 120717], "mapped", [966]], [[120718, 120718], "mapped", [961]], [[120719, 120719], "mapped", [960]], [[120720, 120720], "mapped", [945]], [[120721, 120721], "mapped", [946]], [[120722, 120722], "mapped", [947]], [[120723, 120723], "mapped", [948]], [[120724, 120724], "mapped", [949]], [[120725, 120725], "mapped", [950]], [[120726, 120726], "mapped", [951]], [[120727, 120727], "mapped", [952]], [[120728, 120728], "mapped", [953]], [[120729, 120729], "mapped", [954]], [[120730, 120730], "mapped", [955]], [[120731, 120731], "mapped", [956]], [[120732, 120732], "mapped", [957]], [[120733, 120733], "mapped", [958]], [[120734, 120734], "mapped", [959]], [[120735, 120735], "mapped", [960]], [[120736, 120736], "mapped", [961]], [[120737, 120737], "mapped", [952]], [[120738, 120738], "mapped", [963]], [[120739, 120739], "mapped", [964]], [[120740, 120740], "mapped", [965]], [[120741, 120741], "mapped", [966]], [[120742, 120742], "mapped", [967]], [[120743, 120743], "mapped", [968]], [[120744, 120744], "mapped", [969]], [[120745, 120745], "mapped", [8711]], [[120746, 120746], "mapped", [945]], [[120747, 120747], "mapped", [946]], [[120748, 120748], "mapped", [947]], [[120749, 120749], "mapped", [948]], [[120750, 120750], "mapped", [949]], [[120751, 120751], "mapped", [950]], [[120752, 120752], "mapped", [951]], [[120753, 120753], "mapped", [952]], [[120754, 120754], "mapped", [953]], [[120755, 120755], "mapped", [954]], [[120756, 120756], "mapped", [955]], [[120757, 120757], "mapped", [956]], [[120758, 120758], "mapped", [957]], [[120759, 120759], "mapped", [958]], [[120760, 120760], "mapped", [959]], [[120761, 120761], "mapped", [960]], [[120762, 120762], "mapped", [961]], [[120763, 120764], "mapped", [963]], [[120765, 120765], "mapped", [964]], [[120766, 120766], "mapped", [965]], [[120767, 120767], "mapped", [966]], [[120768, 120768], "mapped", [967]], [[120769, 120769], "mapped", [968]], [[120770, 120770], "mapped", [969]], [[120771, 120771], "mapped", [8706]], [[120772, 120772], "mapped", [949]], [[120773, 120773], "mapped", [952]], [[120774, 120774], "mapped", [954]], [[120775, 120775], "mapped", [966]], [[120776, 120776], "mapped", [961]], [[120777, 120777], "mapped", [960]], [[120778, 120779], "mapped", [989]], [[120780, 120781], "disallowed"], [[120782, 120782], "mapped", [48]], [[120783, 120783], "mapped", [49]], [[120784, 120784], "mapped", [50]], [[120785, 120785], "mapped", [51]], [[120786, 120786], "mapped", [52]], [[120787, 120787], "mapped", [53]], [[120788, 120788], "mapped", [54]], [[120789, 120789], "mapped", [55]], [[120790, 120790], "mapped", [56]], [[120791, 120791], "mapped", [57]], [[120792, 120792], "mapped", [48]], [[120793, 120793], "mapped", [49]], [[120794, 120794], "mapped", [50]], [[120795, 120795], "mapped", [51]], [[120796, 120796], "mapped", [52]], [[120797, 120797], "mapped", [53]], [[120798, 120798], "mapped", [54]], [[120799, 120799], "mapped", [55]], [[120800, 120800], "mapped", [56]], [[120801, 120801], "mapped", [57]], [[120802, 120802], "mapped", [48]], [[120803, 120803], "mapped", [49]], [[120804, 120804], "mapped", [50]], [[120805, 120805], "mapped", [51]], [[120806, 120806], "mapped", [52]], [[120807, 120807], "mapped", [53]], [[120808, 120808], "mapped", [54]], [[120809, 120809], "mapped", [55]], [[120810, 120810], "mapped", [56]], [[120811, 120811], "mapped", [57]], [[120812, 120812], "mapped", [48]], [[120813, 120813], "mapped", [49]], [[120814, 120814], "mapped", [50]], [[120815, 120815], "mapped", [51]], [[120816, 120816], "mapped", [52]], [[120817, 120817], "mapped", [53]], [[120818, 120818], "mapped", [54]], [[120819, 120819], "mapped", [55]], [[120820, 120820], "mapped", [56]], [[120821, 120821], "mapped", [57]], [[120822, 120822], "mapped", [48]], [[120823, 120823], "mapped", [49]], [[120824, 120824], "mapped", [50]], [[120825, 120825], "mapped", [51]], [[120826, 120826], "mapped", [52]], [[120827, 120827], "mapped", [53]], [[120828, 120828], "mapped", [54]], [[120829, 120829], "mapped", [55]], [[120830, 120830], "mapped", [56]], [[120831, 120831], "mapped", [57]], [[120832, 121343], "valid", [], "NV8"], [[121344, 121398], "valid"], [[121399, 121402], "valid", [], "NV8"], [[121403, 121452], "valid"], [[121453, 121460], "valid", [], "NV8"], [[121461, 121461], "valid"], [[121462, 121475], "valid", [], "NV8"], [[121476, 121476], "valid"], [[121477, 121483], "valid", [], "NV8"], [[121484, 121498], "disallowed"], [[121499, 121503], "valid"], [[121504, 121504], "disallowed"], [[121505, 121519], "valid"], [[121520, 124927], "disallowed"], [[124928, 125124], "valid"], [[125125, 125126], "disallowed"], [[125127, 125135], "valid", [], "NV8"], [[125136, 125142], "valid"], [[125143, 126463], "disallowed"], [[126464, 126464], "mapped", [1575]], [[126465, 126465], "mapped", [1576]], [[126466, 126466], "mapped", [1580]], [[126467, 126467], "mapped", [1583]], [[126468, 126468], "disallowed"], [[126469, 126469], "mapped", [1608]], [[126470, 126470], "mapped", [1586]], [[126471, 126471], "mapped", [1581]], [[126472, 126472], "mapped", [1591]], [[126473, 126473], "mapped", [1610]], [[126474, 126474], "mapped", [1603]], [[126475, 126475], "mapped", [1604]], [[126476, 126476], "mapped", [1605]], [[126477, 126477], "mapped", [1606]], [[126478, 126478], "mapped", [1587]], [[126479, 126479], "mapped", [1593]], [[126480, 126480], "mapped", [1601]], [[126481, 126481], "mapped", [1589]], [[126482, 126482], "mapped", [1602]], [[126483, 126483], "mapped", [1585]], [[126484, 126484], "mapped", [1588]], [[126485, 126485], "mapped", [1578]], [[126486, 126486], "mapped", [1579]], [[126487, 126487], "mapped", [1582]], [[126488, 126488], "mapped", [1584]], [[126489, 126489], "mapped", [1590]], [[126490, 126490], "mapped", [1592]], [[126491, 126491], "mapped", [1594]], [[126492, 126492], "mapped", [1646]], [[126493, 126493], "mapped", [1722]], [[126494, 126494], "mapped", [1697]], [[126495, 126495], "mapped", [1647]], [[126496, 126496], "disallowed"], [[126497, 126497], "mapped", [1576]], [[126498, 126498], "mapped", [1580]], [[126499, 126499], "disallowed"], [[126500, 126500], "mapped", [1607]], [[126501, 126502], "disallowed"], [[126503, 126503], "mapped", [1581]], [[126504, 126504], "disallowed"], [[126505, 126505], "mapped", [1610]], [[126506, 126506], "mapped", [1603]], [[126507, 126507], "mapped", [1604]], [[126508, 126508], "mapped", [1605]], [[126509, 126509], "mapped", [1606]], [[126510, 126510], "mapped", [1587]], [[126511, 126511], "mapped", [1593]], [[126512, 126512], "mapped", [1601]], [[126513, 126513], "mapped", [1589]], [[126514, 126514], "mapped", [1602]], [[126515, 126515], "disallowed"], [[126516, 126516], "mapped", [1588]], [[126517, 126517], "mapped", [1578]], [[126518, 126518], "mapped", [1579]], [[126519, 126519], "mapped", [1582]], [[126520, 126520], "disallowed"], [[126521, 126521], "mapped", [1590]], [[126522, 126522], "disallowed"], [[126523, 126523], "mapped", [1594]], [[126524, 126529], "disallowed"], [[126530, 126530], "mapped", [1580]], [[126531, 126534], "disallowed"], [[126535, 126535], "mapped", [1581]], [[126536, 126536], "disallowed"], [[126537, 126537], "mapped", [1610]], [[126538, 126538], "disallowed"], [[126539, 126539], "mapped", [1604]], [[126540, 126540], "disallowed"], [[126541, 126541], "mapped", [1606]], [[126542, 126542], "mapped", [1587]], [[126543, 126543], "mapped", [1593]], [[126544, 126544], "disallowed"], [[126545, 126545], "mapped", [1589]], [[126546, 126546], "mapped", [1602]], [[126547, 126547], "disallowed"], [[126548, 126548], "mapped", [1588]], [[126549, 126550], "disallowed"], [[126551, 126551], "mapped", [1582]], [[126552, 126552], "disallowed"], [[126553, 126553], "mapped", [1590]], [[126554, 126554], "disallowed"], [[126555, 126555], "mapped", [1594]], [[126556, 126556], "disallowed"], [[126557, 126557], "mapped", [1722]], [[126558, 126558], "disallowed"], [[126559, 126559], "mapped", [1647]], [[126560, 126560], "disallowed"], [[126561, 126561], "mapped", [1576]], [[126562, 126562], "mapped", [1580]], [[126563, 126563], "disallowed"], [[126564, 126564], "mapped", [1607]], [[126565, 126566], "disallowed"], [[126567, 126567], "mapped", [1581]], [[126568, 126568], "mapped", [1591]], [[126569, 126569], "mapped", [1610]], [[126570, 126570], "mapped", [1603]], [[126571, 126571], "disallowed"], [[126572, 126572], "mapped", [1605]], [[126573, 126573], "mapped", [1606]], [[126574, 126574], "mapped", [1587]], [[126575, 126575], "mapped", [1593]], [[126576, 126576], "mapped", [1601]], [[126577, 126577], "mapped", [1589]], [[126578, 126578], "mapped", [1602]], [[126579, 126579], "disallowed"], [[126580, 126580], "mapped", [1588]], [[126581, 126581], "mapped", [1578]], [[126582, 126582], "mapped", [1579]], [[126583, 126583], "mapped", [1582]], [[126584, 126584], "disallowed"], [[126585, 126585], "mapped", [1590]], [[126586, 126586], "mapped", [1592]], [[126587, 126587], "mapped", [1594]], [[126588, 126588], "mapped", [1646]], [[126589, 126589], "disallowed"], [[126590, 126590], "mapped", [1697]], [[126591, 126591], "disallowed"], [[126592, 126592], "mapped", [1575]], [[126593, 126593], "mapped", [1576]], [[126594, 126594], "mapped", [1580]], [[126595, 126595], "mapped", [1583]], [[126596, 126596], "mapped", [1607]], [[126597, 126597], "mapped", [1608]], [[126598, 126598], "mapped", [1586]], [[126599, 126599], "mapped", [1581]], [[126600, 126600], "mapped", [1591]], [[126601, 126601], "mapped", [1610]], [[126602, 126602], "disallowed"], [[126603, 126603], "mapped", [1604]], [[126604, 126604], "mapped", [1605]], [[126605, 126605], "mapped", [1606]], [[126606, 126606], "mapped", [1587]], [[126607, 126607], "mapped", [1593]], [[126608, 126608], "mapped", [1601]], [[126609, 126609], "mapped", [1589]], [[126610, 126610], "mapped", [1602]], [[126611, 126611], "mapped", [1585]], [[126612, 126612], "mapped", [1588]], [[126613, 126613], "mapped", [1578]], [[126614, 126614], "mapped", [1579]], [[126615, 126615], "mapped", [1582]], [[126616, 126616], "mapped", [1584]], [[126617, 126617], "mapped", [1590]], [[126618, 126618], "mapped", [1592]], [[126619, 126619], "mapped", [1594]], [[126620, 126624], "disallowed"], [[126625, 126625], "mapped", [1576]], [[126626, 126626], "mapped", [1580]], [[126627, 126627], "mapped", [1583]], [[126628, 126628], "disallowed"], [[126629, 126629], "mapped", [1608]], [[126630, 126630], "mapped", [1586]], [[126631, 126631], "mapped", [1581]], [[126632, 126632], "mapped", [1591]], [[126633, 126633], "mapped", [1610]], [[126634, 126634], "disallowed"], [[126635, 126635], "mapped", [1604]], [[126636, 126636], "mapped", [1605]], [[126637, 126637], "mapped", [1606]], [[126638, 126638], "mapped", [1587]], [[126639, 126639], "mapped", [1593]], [[126640, 126640], "mapped", [1601]], [[126641, 126641], "mapped", [1589]], [[126642, 126642], "mapped", [1602]], [[126643, 126643], "mapped", [1585]], [[126644, 126644], "mapped", [1588]], [[126645, 126645], "mapped", [1578]], [[126646, 126646], "mapped", [1579]], [[126647, 126647], "mapped", [1582]], [[126648, 126648], "mapped", [1584]], [[126649, 126649], "mapped", [1590]], [[126650, 126650], "mapped", [1592]], [[126651, 126651], "mapped", [1594]], [[126652, 126703], "disallowed"], [[126704, 126705], "valid", [], "NV8"], [[126706, 126975], "disallowed"], [[126976, 127019], "valid", [], "NV8"], [[127020, 127023], "disallowed"], [[127024, 127123], "valid", [], "NV8"], [[127124, 127135], "disallowed"], [[127136, 127150], "valid", [], "NV8"], [[127151, 127152], "disallowed"], [[127153, 127166], "valid", [], "NV8"], [[127167, 127167], "valid", [], "NV8"], [[127168, 127168], "disallowed"], [[127169, 127183], "valid", [], "NV8"], [[127184, 127184], "disallowed"], [[127185, 127199], "valid", [], "NV8"], [[127200, 127221], "valid", [], "NV8"], [[127222, 127231], "disallowed"], [[127232, 127232], "disallowed"], [[127233, 127233], "disallowed_STD3_mapped", [48, 44]], [[127234, 127234], "disallowed_STD3_mapped", [49, 44]], [[127235, 127235], "disallowed_STD3_mapped", [50, 44]], [[127236, 127236], "disallowed_STD3_mapped", [51, 44]], [[127237, 127237], "disallowed_STD3_mapped", [52, 44]], [[127238, 127238], "disallowed_STD3_mapped", [53, 44]], [[127239, 127239], "disallowed_STD3_mapped", [54, 44]], [[127240, 127240], "disallowed_STD3_mapped", [55, 44]], [[127241, 127241], "disallowed_STD3_mapped", [56, 44]], [[127242, 127242], "disallowed_STD3_mapped", [57, 44]], [[127243, 127244], "valid", [], "NV8"], [[127245, 127247], "disallowed"], [[127248, 127248], "disallowed_STD3_mapped", [40, 97, 41]], [[127249, 127249], "disallowed_STD3_mapped", [40, 98, 41]], [[127250, 127250], "disallowed_STD3_mapped", [40, 99, 41]], [[127251, 127251], "disallowed_STD3_mapped", [40, 100, 41]], [[127252, 127252], "disallowed_STD3_mapped", [40, 101, 41]], [[127253, 127253], "disallowed_STD3_mapped", [40, 102, 41]], [[127254, 127254], "disallowed_STD3_mapped", [40, 103, 41]], [[127255, 127255], "disallowed_STD3_mapped", [40, 104, 41]], [[127256, 127256], "disallowed_STD3_mapped", [40, 105, 41]], [[127257, 127257], "disallowed_STD3_mapped", [40, 106, 41]], [[127258, 127258], "disallowed_STD3_mapped", [40, 107, 41]], [[127259, 127259], "disallowed_STD3_mapped", [40, 108, 41]], [[127260, 127260], "disallowed_STD3_mapped", [40, 109, 41]], [[127261, 127261], "disallowed_STD3_mapped", [40, 110, 41]], [[127262, 127262], "disallowed_STD3_mapped", [40, 111, 41]], [[127263, 127263], "disallowed_STD3_mapped", [40, 112, 41]], [[127264, 127264], "disallowed_STD3_mapped", [40, 113, 41]], [[127265, 127265], "disallowed_STD3_mapped", [40, 114, 41]], [[127266, 127266], "disallowed_STD3_mapped", [40, 115, 41]], [[127267, 127267], "disallowed_STD3_mapped", [40, 116, 41]], [[127268, 127268], "disallowed_STD3_mapped", [40, 117, 41]], [[127269, 127269], "disallowed_STD3_mapped", [40, 118, 41]], [[127270, 127270], "disallowed_STD3_mapped", [40, 119, 41]], [[127271, 127271], "disallowed_STD3_mapped", [40, 120, 41]], [[127272, 127272], "disallowed_STD3_mapped", [40, 121, 41]], [[127273, 127273], "disallowed_STD3_mapped", [40, 122, 41]], [[127274, 127274], "mapped", [12308, 115, 12309]], [[127275, 127275], "mapped", [99]], [[127276, 127276], "mapped", [114]], [[127277, 127277], "mapped", [99, 100]], [[127278, 127278], "mapped", [119, 122]], [[127279, 127279], "disallowed"], [[127280, 127280], "mapped", [97]], [[127281, 127281], "mapped", [98]], [[127282, 127282], "mapped", [99]], [[127283, 127283], "mapped", [100]], [[127284, 127284], "mapped", [101]], [[127285, 127285], "mapped", [102]], [[127286, 127286], "mapped", [103]], [[127287, 127287], "mapped", [104]], [[127288, 127288], "mapped", [105]], [[127289, 127289], "mapped", [106]], [[127290, 127290], "mapped", [107]], [[127291, 127291], "mapped", [108]], [[127292, 127292], "mapped", [109]], [[127293, 127293], "mapped", [110]], [[127294, 127294], "mapped", [111]], [[127295, 127295], "mapped", [112]], [[127296, 127296], "mapped", [113]], [[127297, 127297], "mapped", [114]], [[127298, 127298], "mapped", [115]], [[127299, 127299], "mapped", [116]], [[127300, 127300], "mapped", [117]], [[127301, 127301], "mapped", [118]], [[127302, 127302], "mapped", [119]], [[127303, 127303], "mapped", [120]], [[127304, 127304], "mapped", [121]], [[127305, 127305], "mapped", [122]], [[127306, 127306], "mapped", [104, 118]], [[127307, 127307], "mapped", [109, 118]], [[127308, 127308], "mapped", [115, 100]], [[127309, 127309], "mapped", [115, 115]], [[127310, 127310], "mapped", [112, 112, 118]], [[127311, 127311], "mapped", [119, 99]], [[127312, 127318], "valid", [], "NV8"], [[127319, 127319], "valid", [], "NV8"], [[127320, 127326], "valid", [], "NV8"], [[127327, 127327], "valid", [], "NV8"], [[127328, 127337], "valid", [], "NV8"], [[127338, 127338], "mapped", [109, 99]], [[127339, 127339], "mapped", [109, 100]], [[127340, 127343], "disallowed"], [[127344, 127352], "valid", [], "NV8"], [[127353, 127353], "valid", [], "NV8"], [[127354, 127354], "valid", [], "NV8"], [[127355, 127356], "valid", [], "NV8"], [[127357, 127358], "valid", [], "NV8"], [[127359, 127359], "valid", [], "NV8"], [[127360, 127369], "valid", [], "NV8"], [[127370, 127373], "valid", [], "NV8"], [[127374, 127375], "valid", [], "NV8"], [[127376, 127376], "mapped", [100, 106]], [[127377, 127386], "valid", [], "NV8"], [[127387, 127461], "disallowed"], [[127462, 127487], "valid", [], "NV8"], [[127488, 127488], "mapped", [12411, 12363]], [[127489, 127489], "mapped", [12467, 12467]], [[127490, 127490], "mapped", [12469]], [[127491, 127503], "disallowed"], [[127504, 127504], "mapped", [25163]], [[127505, 127505], "mapped", [23383]], [[127506, 127506], "mapped", [21452]], [[127507, 127507], "mapped", [12487]], [[127508, 127508], "mapped", [20108]], [[127509, 127509], "mapped", [22810]], [[127510, 127510], "mapped", [35299]], [[127511, 127511], "mapped", [22825]], [[127512, 127512], "mapped", [20132]], [[127513, 127513], "mapped", [26144]], [[127514, 127514], "mapped", [28961]], [[127515, 127515], "mapped", [26009]], [[127516, 127516], "mapped", [21069]], [[127517, 127517], "mapped", [24460]], [[127518, 127518], "mapped", [20877]], [[127519, 127519], "mapped", [26032]], [[127520, 127520], "mapped", [21021]], [[127521, 127521], "mapped", [32066]], [[127522, 127522], "mapped", [29983]], [[127523, 127523], "mapped", [36009]], [[127524, 127524], "mapped", [22768]], [[127525, 127525], "mapped", [21561]], [[127526, 127526], "mapped", [28436]], [[127527, 127527], "mapped", [25237]], [[127528, 127528], "mapped", [25429]], [[127529, 127529], "mapped", [19968]], [[127530, 127530], "mapped", [19977]], [[127531, 127531], "mapped", [36938]], [[127532, 127532], "mapped", [24038]], [[127533, 127533], "mapped", [20013]], [[127534, 127534], "mapped", [21491]], [[127535, 127535], "mapped", [25351]], [[127536, 127536], "mapped", [36208]], [[127537, 127537], "mapped", [25171]], [[127538, 127538], "mapped", [31105]], [[127539, 127539], "mapped", [31354]], [[127540, 127540], "mapped", [21512]], [[127541, 127541], "mapped", [28288]], [[127542, 127542], "mapped", [26377]], [[127543, 127543], "mapped", [26376]], [[127544, 127544], "mapped", [30003]], [[127545, 127545], "mapped", [21106]], [[127546, 127546], "mapped", [21942]], [[127547, 127551], "disallowed"], [[127552, 127552], "mapped", [12308, 26412, 12309]], [[127553, 127553], "mapped", [12308, 19977, 12309]], [[127554, 127554], "mapped", [12308, 20108, 12309]], [[127555, 127555], "mapped", [12308, 23433, 12309]], [[127556, 127556], "mapped", [12308, 28857, 12309]], [[127557, 127557], "mapped", [12308, 25171, 12309]], [[127558, 127558], "mapped", [12308, 30423, 12309]], [[127559, 127559], "mapped", [12308, 21213, 12309]], [[127560, 127560], "mapped", [12308, 25943, 12309]], [[127561, 127567], "disallowed"], [[127568, 127568], "mapped", [24471]], [[127569, 127569], "mapped", [21487]], [[127570, 127743], "disallowed"], [[127744, 127776], "valid", [], "NV8"], [[127777, 127788], "valid", [], "NV8"], [[127789, 127791], "valid", [], "NV8"], [[127792, 127797], "valid", [], "NV8"], [[127798, 127798], "valid", [], "NV8"], [[127799, 127868], "valid", [], "NV8"], [[127869, 127869], "valid", [], "NV8"], [[127870, 127871], "valid", [], "NV8"], [[127872, 127891], "valid", [], "NV8"], [[127892, 127903], "valid", [], "NV8"], [[127904, 127940], "valid", [], "NV8"], [[127941, 127941], "valid", [], "NV8"], [[127942, 127946], "valid", [], "NV8"], [[127947, 127950], "valid", [], "NV8"], [[127951, 127955], "valid", [], "NV8"], [[127956, 127967], "valid", [], "NV8"], [[127968, 127984], "valid", [], "NV8"], [[127985, 127991], "valid", [], "NV8"], [[127992, 127999], "valid", [], "NV8"], [[128e3, 128062], "valid", [], "NV8"], [[128063, 128063], "valid", [], "NV8"], [[128064, 128064], "valid", [], "NV8"], [[128065, 128065], "valid", [], "NV8"], [[128066, 128247], "valid", [], "NV8"], [[128248, 128248], "valid", [], "NV8"], [[128249, 128252], "valid", [], "NV8"], [[128253, 128254], "valid", [], "NV8"], [[128255, 128255], "valid", [], "NV8"], [[128256, 128317], "valid", [], "NV8"], [[128318, 128319], "valid", [], "NV8"], [[128320, 128323], "valid", [], "NV8"], [[128324, 128330], "valid", [], "NV8"], [[128331, 128335], "valid", [], "NV8"], [[128336, 128359], "valid", [], "NV8"], [[128360, 128377], "valid", [], "NV8"], [[128378, 128378], "disallowed"], [[128379, 128419], "valid", [], "NV8"], [[128420, 128420], "disallowed"], [[128421, 128506], "valid", [], "NV8"], [[128507, 128511], "valid", [], "NV8"], [[128512, 128512], "valid", [], "NV8"], [[128513, 128528], "valid", [], "NV8"], [[128529, 128529], "valid", [], "NV8"], [[128530, 128532], "valid", [], "NV8"], [[128533, 128533], "valid", [], "NV8"], [[128534, 128534], "valid", [], "NV8"], [[128535, 128535], "valid", [], "NV8"], [[128536, 128536], "valid", [], "NV8"], [[128537, 128537], "valid", [], "NV8"], [[128538, 128538], "valid", [], "NV8"], [[128539, 128539], "valid", [], "NV8"], [[128540, 128542], "valid", [], "NV8"], [[128543, 128543], "valid", [], "NV8"], [[128544, 128549], "valid", [], "NV8"], [[128550, 128551], "valid", [], "NV8"], [[128552, 128555], "valid", [], "NV8"], [[128556, 128556], "valid", [], "NV8"], [[128557, 128557], "valid", [], "NV8"], [[128558, 128559], "valid", [], "NV8"], [[128560, 128563], "valid", [], "NV8"], [[128564, 128564], "valid", [], "NV8"], [[128565, 128576], "valid", [], "NV8"], [[128577, 128578], "valid", [], "NV8"], [[128579, 128580], "valid", [], "NV8"], [[128581, 128591], "valid", [], "NV8"], [[128592, 128639], "valid", [], "NV8"], [[128640, 128709], "valid", [], "NV8"], [[128710, 128719], "valid", [], "NV8"], [[128720, 128720], "valid", [], "NV8"], [[128721, 128735], "disallowed"], [[128736, 128748], "valid", [], "NV8"], [[128749, 128751], "disallowed"], [[128752, 128755], "valid", [], "NV8"], [[128756, 128767], "disallowed"], [[128768, 128883], "valid", [], "NV8"], [[128884, 128895], "disallowed"], [[128896, 128980], "valid", [], "NV8"], [[128981, 129023], "disallowed"], [[129024, 129035], "valid", [], "NV8"], [[129036, 129039], "disallowed"], [[129040, 129095], "valid", [], "NV8"], [[129096, 129103], "disallowed"], [[129104, 129113], "valid", [], "NV8"], [[129114, 129119], "disallowed"], [[129120, 129159], "valid", [], "NV8"], [[129160, 129167], "disallowed"], [[129168, 129197], "valid", [], "NV8"], [[129198, 129295], "disallowed"], [[129296, 129304], "valid", [], "NV8"], [[129305, 129407], "disallowed"], [[129408, 129412], "valid", [], "NV8"], [[129413, 129471], "disallowed"], [[129472, 129472], "valid", [], "NV8"], [[129473, 131069], "disallowed"], [[131070, 131071], "disallowed"], [[131072, 173782], "valid"], [[173783, 173823], "disallowed"], [[173824, 177972], "valid"], [[177973, 177983], "disallowed"], [[177984, 178205], "valid"], [[178206, 178207], "disallowed"], [[178208, 183969], "valid"], [[183970, 194559], "disallowed"], [[194560, 194560], "mapped", [20029]], [[194561, 194561], "mapped", [20024]], [[194562, 194562], "mapped", [20033]], [[194563, 194563], "mapped", [131362]], [[194564, 194564], "mapped", [20320]], [[194565, 194565], "mapped", [20398]], [[194566, 194566], "mapped", [20411]], [[194567, 194567], "mapped", [20482]], [[194568, 194568], "mapped", [20602]], [[194569, 194569], "mapped", [20633]], [[194570, 194570], "mapped", [20711]], [[194571, 194571], "mapped", [20687]], [[194572, 194572], "mapped", [13470]], [[194573, 194573], "mapped", [132666]], [[194574, 194574], "mapped", [20813]], [[194575, 194575], "mapped", [20820]], [[194576, 194576], "mapped", [20836]], [[194577, 194577], "mapped", [20855]], [[194578, 194578], "mapped", [132380]], [[194579, 194579], "mapped", [13497]], [[194580, 194580], "mapped", [20839]], [[194581, 194581], "mapped", [20877]], [[194582, 194582], "mapped", [132427]], [[194583, 194583], "mapped", [20887]], [[194584, 194584], "mapped", [20900]], [[194585, 194585], "mapped", [20172]], [[194586, 194586], "mapped", [20908]], [[194587, 194587], "mapped", [20917]], [[194588, 194588], "mapped", [168415]], [[194589, 194589], "mapped", [20981]], [[194590, 194590], "mapped", [20995]], [[194591, 194591], "mapped", [13535]], [[194592, 194592], "mapped", [21051]], [[194593, 194593], "mapped", [21062]], [[194594, 194594], "mapped", [21106]], [[194595, 194595], "mapped", [21111]], [[194596, 194596], "mapped", [13589]], [[194597, 194597], "mapped", [21191]], [[194598, 194598], "mapped", [21193]], [[194599, 194599], "mapped", [21220]], [[194600, 194600], "mapped", [21242]], [[194601, 194601], "mapped", [21253]], [[194602, 194602], "mapped", [21254]], [[194603, 194603], "mapped", [21271]], [[194604, 194604], "mapped", [21321]], [[194605, 194605], "mapped", [21329]], [[194606, 194606], "mapped", [21338]], [[194607, 194607], "mapped", [21363]], [[194608, 194608], "mapped", [21373]], [[194609, 194611], "mapped", [21375]], [[194612, 194612], "mapped", [133676]], [[194613, 194613], "mapped", [28784]], [[194614, 194614], "mapped", [21450]], [[194615, 194615], "mapped", [21471]], [[194616, 194616], "mapped", [133987]], [[194617, 194617], "mapped", [21483]], [[194618, 194618], "mapped", [21489]], [[194619, 194619], "mapped", [21510]], [[194620, 194620], "mapped", [21662]], [[194621, 194621], "mapped", [21560]], [[194622, 194622], "mapped", [21576]], [[194623, 194623], "mapped", [21608]], [[194624, 194624], "mapped", [21666]], [[194625, 194625], "mapped", [21750]], [[194626, 194626], "mapped", [21776]], [[194627, 194627], "mapped", [21843]], [[194628, 194628], "mapped", [21859]], [[194629, 194630], "mapped", [21892]], [[194631, 194631], "mapped", [21913]], [[194632, 194632], "mapped", [21931]], [[194633, 194633], "mapped", [21939]], [[194634, 194634], "mapped", [21954]], [[194635, 194635], "mapped", [22294]], [[194636, 194636], "mapped", [22022]], [[194637, 194637], "mapped", [22295]], [[194638, 194638], "mapped", [22097]], [[194639, 194639], "mapped", [22132]], [[194640, 194640], "mapped", [20999]], [[194641, 194641], "mapped", [22766]], [[194642, 194642], "mapped", [22478]], [[194643, 194643], "mapped", [22516]], [[194644, 194644], "mapped", [22541]], [[194645, 194645], "mapped", [22411]], [[194646, 194646], "mapped", [22578]], [[194647, 194647], "mapped", [22577]], [[194648, 194648], "mapped", [22700]], [[194649, 194649], "mapped", [136420]], [[194650, 194650], "mapped", [22770]], [[194651, 194651], "mapped", [22775]], [[194652, 194652], "mapped", [22790]], [[194653, 194653], "mapped", [22810]], [[194654, 194654], "mapped", [22818]], [[194655, 194655], "mapped", [22882]], [[194656, 194656], "mapped", [136872]], [[194657, 194657], "mapped", [136938]], [[194658, 194658], "mapped", [23020]], [[194659, 194659], "mapped", [23067]], [[194660, 194660], "mapped", [23079]], [[194661, 194661], "mapped", [23e3]], [[194662, 194662], "mapped", [23142]], [[194663, 194663], "mapped", [14062]], [[194664, 194664], "disallowed"], [[194665, 194665], "mapped", [23304]], [[194666, 194667], "mapped", [23358]], [[194668, 194668], "mapped", [137672]], [[194669, 194669], "mapped", [23491]], [[194670, 194670], "mapped", [23512]], [[194671, 194671], "mapped", [23527]], [[194672, 194672], "mapped", [23539]], [[194673, 194673], "mapped", [138008]], [[194674, 194674], "mapped", [23551]], [[194675, 194675], "mapped", [23558]], [[194676, 194676], "disallowed"], [[194677, 194677], "mapped", [23586]], [[194678, 194678], "mapped", [14209]], [[194679, 194679], "mapped", [23648]], [[194680, 194680], "mapped", [23662]], [[194681, 194681], "mapped", [23744]], [[194682, 194682], "mapped", [23693]], [[194683, 194683], "mapped", [138724]], [[194684, 194684], "mapped", [23875]], [[194685, 194685], "mapped", [138726]], [[194686, 194686], "mapped", [23918]], [[194687, 194687], "mapped", [23915]], [[194688, 194688], "mapped", [23932]], [[194689, 194689], "mapped", [24033]], [[194690, 194690], "mapped", [24034]], [[194691, 194691], "mapped", [14383]], [[194692, 194692], "mapped", [24061]], [[194693, 194693], "mapped", [24104]], [[194694, 194694], "mapped", [24125]], [[194695, 194695], "mapped", [24169]], [[194696, 194696], "mapped", [14434]], [[194697, 194697], "mapped", [139651]], [[194698, 194698], "mapped", [14460]], [[194699, 194699], "mapped", [24240]], [[194700, 194700], "mapped", [24243]], [[194701, 194701], "mapped", [24246]], [[194702, 194702], "mapped", [24266]], [[194703, 194703], "mapped", [172946]], [[194704, 194704], "mapped", [24318]], [[194705, 194706], "mapped", [140081]], [[194707, 194707], "mapped", [33281]], [[194708, 194709], "mapped", [24354]], [[194710, 194710], "mapped", [14535]], [[194711, 194711], "mapped", [144056]], [[194712, 194712], "mapped", [156122]], [[194713, 194713], "mapped", [24418]], [[194714, 194714], "mapped", [24427]], [[194715, 194715], "mapped", [14563]], [[194716, 194716], "mapped", [24474]], [[194717, 194717], "mapped", [24525]], [[194718, 194718], "mapped", [24535]], [[194719, 194719], "mapped", [24569]], [[194720, 194720], "mapped", [24705]], [[194721, 194721], "mapped", [14650]], [[194722, 194722], "mapped", [14620]], [[194723, 194723], "mapped", [24724]], [[194724, 194724], "mapped", [141012]], [[194725, 194725], "mapped", [24775]], [[194726, 194726], "mapped", [24904]], [[194727, 194727], "mapped", [24908]], [[194728, 194728], "mapped", [24910]], [[194729, 194729], "mapped", [24908]], [[194730, 194730], "mapped", [24954]], [[194731, 194731], "mapped", [24974]], [[194732, 194732], "mapped", [25010]], [[194733, 194733], "mapped", [24996]], [[194734, 194734], "mapped", [25007]], [[194735, 194735], "mapped", [25054]], [[194736, 194736], "mapped", [25074]], [[194737, 194737], "mapped", [25078]], [[194738, 194738], "mapped", [25104]], [[194739, 194739], "mapped", [25115]], [[194740, 194740], "mapped", [25181]], [[194741, 194741], "mapped", [25265]], [[194742, 194742], "mapped", [25300]], [[194743, 194743], "mapped", [25424]], [[194744, 194744], "mapped", [142092]], [[194745, 194745], "mapped", [25405]], [[194746, 194746], "mapped", [25340]], [[194747, 194747], "mapped", [25448]], [[194748, 194748], "mapped", [25475]], [[194749, 194749], "mapped", [25572]], [[194750, 194750], "mapped", [142321]], [[194751, 194751], "mapped", [25634]], [[194752, 194752], "mapped", [25541]], [[194753, 194753], "mapped", [25513]], [[194754, 194754], "mapped", [14894]], [[194755, 194755], "mapped", [25705]], [[194756, 194756], "mapped", [25726]], [[194757, 194757], "mapped", [25757]], [[194758, 194758], "mapped", [25719]], [[194759, 194759], "mapped", [14956]], [[194760, 194760], "mapped", [25935]], [[194761, 194761], "mapped", [25964]], [[194762, 194762], "mapped", [143370]], [[194763, 194763], "mapped", [26083]], [[194764, 194764], "mapped", [26360]], [[194765, 194765], "mapped", [26185]], [[194766, 194766], "mapped", [15129]], [[194767, 194767], "mapped", [26257]], [[194768, 194768], "mapped", [15112]], [[194769, 194769], "mapped", [15076]], [[194770, 194770], "mapped", [20882]], [[194771, 194771], "mapped", [20885]], [[194772, 194772], "mapped", [26368]], [[194773, 194773], "mapped", [26268]], [[194774, 194774], "mapped", [32941]], [[194775, 194775], "mapped", [17369]], [[194776, 194776], "mapped", [26391]], [[194777, 194777], "mapped", [26395]], [[194778, 194778], "mapped", [26401]], [[194779, 194779], "mapped", [26462]], [[194780, 194780], "mapped", [26451]], [[194781, 194781], "mapped", [144323]], [[194782, 194782], "mapped", [15177]], [[194783, 194783], "mapped", [26618]], [[194784, 194784], "mapped", [26501]], [[194785, 194785], "mapped", [26706]], [[194786, 194786], "mapped", [26757]], [[194787, 194787], "mapped", [144493]], [[194788, 194788], "mapped", [26766]], [[194789, 194789], "mapped", [26655]], [[194790, 194790], "mapped", [26900]], [[194791, 194791], "mapped", [15261]], [[194792, 194792], "mapped", [26946]], [[194793, 194793], "mapped", [27043]], [[194794, 194794], "mapped", [27114]], [[194795, 194795], "mapped", [27304]], [[194796, 194796], "mapped", [145059]], [[194797, 194797], "mapped", [27355]], [[194798, 194798], "mapped", [15384]], [[194799, 194799], "mapped", [27425]], [[194800, 194800], "mapped", [145575]], [[194801, 194801], "mapped", [27476]], [[194802, 194802], "mapped", [15438]], [[194803, 194803], "mapped", [27506]], [[194804, 194804], "mapped", [27551]], [[194805, 194805], "mapped", [27578]], [[194806, 194806], "mapped", [27579]], [[194807, 194807], "mapped", [146061]], [[194808, 194808], "mapped", [138507]], [[194809, 194809], "mapped", [146170]], [[194810, 194810], "mapped", [27726]], [[194811, 194811], "mapped", [146620]], [[194812, 194812], "mapped", [27839]], [[194813, 194813], "mapped", [27853]], [[194814, 194814], "mapped", [27751]], [[194815, 194815], "mapped", [27926]], [[194816, 194816], "mapped", [27966]], [[194817, 194817], "mapped", [28023]], [[194818, 194818], "mapped", [27969]], [[194819, 194819], "mapped", [28009]], [[194820, 194820], "mapped", [28024]], [[194821, 194821], "mapped", [28037]], [[194822, 194822], "mapped", [146718]], [[194823, 194823], "mapped", [27956]], [[194824, 194824], "mapped", [28207]], [[194825, 194825], "mapped", [28270]], [[194826, 194826], "mapped", [15667]], [[194827, 194827], "mapped", [28363]], [[194828, 194828], "mapped", [28359]], [[194829, 194829], "mapped", [147153]], [[194830, 194830], "mapped", [28153]], [[194831, 194831], "mapped", [28526]], [[194832, 194832], "mapped", [147294]], [[194833, 194833], "mapped", [147342]], [[194834, 194834], "mapped", [28614]], [[194835, 194835], "mapped", [28729]], [[194836, 194836], "mapped", [28702]], [[194837, 194837], "mapped", [28699]], [[194838, 194838], "mapped", [15766]], [[194839, 194839], "mapped", [28746]], [[194840, 194840], "mapped", [28797]], [[194841, 194841], "mapped", [28791]], [[194842, 194842], "mapped", [28845]], [[194843, 194843], "mapped", [132389]], [[194844, 194844], "mapped", [28997]], [[194845, 194845], "mapped", [148067]], [[194846, 194846], "mapped", [29084]], [[194847, 194847], "disallowed"], [[194848, 194848], "mapped", [29224]], [[194849, 194849], "mapped", [29237]], [[194850, 194850], "mapped", [29264]], [[194851, 194851], "mapped", [149e3]], [[194852, 194852], "mapped", [29312]], [[194853, 194853], "mapped", [29333]], [[194854, 194854], "mapped", [149301]], [[194855, 194855], "mapped", [149524]], [[194856, 194856], "mapped", [29562]], [[194857, 194857], "mapped", [29579]], [[194858, 194858], "mapped", [16044]], [[194859, 194859], "mapped", [29605]], [[194860, 194861], "mapped", [16056]], [[194862, 194862], "mapped", [29767]], [[194863, 194863], "mapped", [29788]], [[194864, 194864], "mapped", [29809]], [[194865, 194865], "mapped", [29829]], [[194866, 194866], "mapped", [29898]], [[194867, 194867], "mapped", [16155]], [[194868, 194868], "mapped", [29988]], [[194869, 194869], "mapped", [150582]], [[194870, 194870], "mapped", [30014]], [[194871, 194871], "mapped", [150674]], [[194872, 194872], "mapped", [30064]], [[194873, 194873], "mapped", [139679]], [[194874, 194874], "mapped", [30224]], [[194875, 194875], "mapped", [151457]], [[194876, 194876], "mapped", [151480]], [[194877, 194877], "mapped", [151620]], [[194878, 194878], "mapped", [16380]], [[194879, 194879], "mapped", [16392]], [[194880, 194880], "mapped", [30452]], [[194881, 194881], "mapped", [151795]], [[194882, 194882], "mapped", [151794]], [[194883, 194883], "mapped", [151833]], [[194884, 194884], "mapped", [151859]], [[194885, 194885], "mapped", [30494]], [[194886, 194887], "mapped", [30495]], [[194888, 194888], "mapped", [30538]], [[194889, 194889], "mapped", [16441]], [[194890, 194890], "mapped", [30603]], [[194891, 194891], "mapped", [16454]], [[194892, 194892], "mapped", [16534]], [[194893, 194893], "mapped", [152605]], [[194894, 194894], "mapped", [30798]], [[194895, 194895], "mapped", [30860]], [[194896, 194896], "mapped", [30924]], [[194897, 194897], "mapped", [16611]], [[194898, 194898], "mapped", [153126]], [[194899, 194899], "mapped", [31062]], [[194900, 194900], "mapped", [153242]], [[194901, 194901], "mapped", [153285]], [[194902, 194902], "mapped", [31119]], [[194903, 194903], "mapped", [31211]], [[194904, 194904], "mapped", [16687]], [[194905, 194905], "mapped", [31296]], [[194906, 194906], "mapped", [31306]], [[194907, 194907], "mapped", [31311]], [[194908, 194908], "mapped", [153980]], [[194909, 194910], "mapped", [154279]], [[194911, 194911], "disallowed"], [[194912, 194912], "mapped", [16898]], [[194913, 194913], "mapped", [154539]], [[194914, 194914], "mapped", [31686]], [[194915, 194915], "mapped", [31689]], [[194916, 194916], "mapped", [16935]], [[194917, 194917], "mapped", [154752]], [[194918, 194918], "mapped", [31954]], [[194919, 194919], "mapped", [17056]], [[194920, 194920], "mapped", [31976]], [[194921, 194921], "mapped", [31971]], [[194922, 194922], "mapped", [32e3]], [[194923, 194923], "mapped", [155526]], [[194924, 194924], "mapped", [32099]], [[194925, 194925], "mapped", [17153]], [[194926, 194926], "mapped", [32199]], [[194927, 194927], "mapped", [32258]], [[194928, 194928], "mapped", [32325]], [[194929, 194929], "mapped", [17204]], [[194930, 194930], "mapped", [156200]], [[194931, 194931], "mapped", [156231]], [[194932, 194932], "mapped", [17241]], [[194933, 194933], "mapped", [156377]], [[194934, 194934], "mapped", [32634]], [[194935, 194935], "mapped", [156478]], [[194936, 194936], "mapped", [32661]], [[194937, 194937], "mapped", [32762]], [[194938, 194938], "mapped", [32773]], [[194939, 194939], "mapped", [156890]], [[194940, 194940], "mapped", [156963]], [[194941, 194941], "mapped", [32864]], [[194942, 194942], "mapped", [157096]], [[194943, 194943], "mapped", [32880]], [[194944, 194944], "mapped", [144223]], [[194945, 194945], "mapped", [17365]], [[194946, 194946], "mapped", [32946]], [[194947, 194947], "mapped", [33027]], [[194948, 194948], "mapped", [17419]], [[194949, 194949], "mapped", [33086]], [[194950, 194950], "mapped", [23221]], [[194951, 194951], "mapped", [157607]], [[194952, 194952], "mapped", [157621]], [[194953, 194953], "mapped", [144275]], [[194954, 194954], "mapped", [144284]], [[194955, 194955], "mapped", [33281]], [[194956, 194956], "mapped", [33284]], [[194957, 194957], "mapped", [36766]], [[194958, 194958], "mapped", [17515]], [[194959, 194959], "mapped", [33425]], [[194960, 194960], "mapped", [33419]], [[194961, 194961], "mapped", [33437]], [[194962, 194962], "mapped", [21171]], [[194963, 194963], "mapped", [33457]], [[194964, 194964], "mapped", [33459]], [[194965, 194965], "mapped", [33469]], [[194966, 194966], "mapped", [33510]], [[194967, 194967], "mapped", [158524]], [[194968, 194968], "mapped", [33509]], [[194969, 194969], "mapped", [33565]], [[194970, 194970], "mapped", [33635]], [[194971, 194971], "mapped", [33709]], [[194972, 194972], "mapped", [33571]], [[194973, 194973], "mapped", [33725]], [[194974, 194974], "mapped", [33767]], [[194975, 194975], "mapped", [33879]], [[194976, 194976], "mapped", [33619]], [[194977, 194977], "mapped", [33738]], [[194978, 194978], "mapped", [33740]], [[194979, 194979], "mapped", [33756]], [[194980, 194980], "mapped", [158774]], [[194981, 194981], "mapped", [159083]], [[194982, 194982], "mapped", [158933]], [[194983, 194983], "mapped", [17707]], [[194984, 194984], "mapped", [34033]], [[194985, 194985], "mapped", [34035]], [[194986, 194986], "mapped", [34070]], [[194987, 194987], "mapped", [160714]], [[194988, 194988], "mapped", [34148]], [[194989, 194989], "mapped", [159532]], [[194990, 194990], "mapped", [17757]], [[194991, 194991], "mapped", [17761]], [[194992, 194992], "mapped", [159665]], [[194993, 194993], "mapped", [159954]], [[194994, 194994], "mapped", [17771]], [[194995, 194995], "mapped", [34384]], [[194996, 194996], "mapped", [34396]], [[194997, 194997], "mapped", [34407]], [[194998, 194998], "mapped", [34409]], [[194999, 194999], "mapped", [34473]], [[195e3, 195e3], "mapped", [34440]], [[195001, 195001], "mapped", [34574]], [[195002, 195002], "mapped", [34530]], [[195003, 195003], "mapped", [34681]], [[195004, 195004], "mapped", [34600]], [[195005, 195005], "mapped", [34667]], [[195006, 195006], "mapped", [34694]], [[195007, 195007], "disallowed"], [[195008, 195008], "mapped", [34785]], [[195009, 195009], "mapped", [34817]], [[195010, 195010], "mapped", [17913]], [[195011, 195011], "mapped", [34912]], [[195012, 195012], "mapped", [34915]], [[195013, 195013], "mapped", [161383]], [[195014, 195014], "mapped", [35031]], [[195015, 195015], "mapped", [35038]], [[195016, 195016], "mapped", [17973]], [[195017, 195017], "mapped", [35066]], [[195018, 195018], "mapped", [13499]], [[195019, 195019], "mapped", [161966]], [[195020, 195020], "mapped", [162150]], [[195021, 195021], "mapped", [18110]], [[195022, 195022], "mapped", [18119]], [[195023, 195023], "mapped", [35488]], [[195024, 195024], "mapped", [35565]], [[195025, 195025], "mapped", [35722]], [[195026, 195026], "mapped", [35925]], [[195027, 195027], "mapped", [162984]], [[195028, 195028], "mapped", [36011]], [[195029, 195029], "mapped", [36033]], [[195030, 195030], "mapped", [36123]], [[195031, 195031], "mapped", [36215]], [[195032, 195032], "mapped", [163631]], [[195033, 195033], "mapped", [133124]], [[195034, 195034], "mapped", [36299]], [[195035, 195035], "mapped", [36284]], [[195036, 195036], "mapped", [36336]], [[195037, 195037], "mapped", [133342]], [[195038, 195038], "mapped", [36564]], [[195039, 195039], "mapped", [36664]], [[195040, 195040], "mapped", [165330]], [[195041, 195041], "mapped", [165357]], [[195042, 195042], "mapped", [37012]], [[195043, 195043], "mapped", [37105]], [[195044, 195044], "mapped", [37137]], [[195045, 195045], "mapped", [165678]], [[195046, 195046], "mapped", [37147]], [[195047, 195047], "mapped", [37432]], [[195048, 195048], "mapped", [37591]], [[195049, 195049], "mapped", [37592]], [[195050, 195050], "mapped", [37500]], [[195051, 195051], "mapped", [37881]], [[195052, 195052], "mapped", [37909]], [[195053, 195053], "mapped", [166906]], [[195054, 195054], "mapped", [38283]], [[195055, 195055], "mapped", [18837]], [[195056, 195056], "mapped", [38327]], [[195057, 195057], "mapped", [167287]], [[195058, 195058], "mapped", [18918]], [[195059, 195059], "mapped", [38595]], [[195060, 195060], "mapped", [23986]], [[195061, 195061], "mapped", [38691]], [[195062, 195062], "mapped", [168261]], [[195063, 195063], "mapped", [168474]], [[195064, 195064], "mapped", [19054]], [[195065, 195065], "mapped", [19062]], [[195066, 195066], "mapped", [38880]], [[195067, 195067], "mapped", [168970]], [[195068, 195068], "mapped", [19122]], [[195069, 195069], "mapped", [169110]], [[195070, 195071], "mapped", [38923]], [[195072, 195072], "mapped", [38953]], [[195073, 195073], "mapped", [169398]], [[195074, 195074], "mapped", [39138]], [[195075, 195075], "mapped", [19251]], [[195076, 195076], "mapped", [39209]], [[195077, 195077], "mapped", [39335]], [[195078, 195078], "mapped", [39362]], [[195079, 195079], "mapped", [39422]], [[195080, 195080], "mapped", [19406]], [[195081, 195081], "mapped", [170800]], [[195082, 195082], "mapped", [39698]], [[195083, 195083], "mapped", [4e4]], [[195084, 195084], "mapped", [40189]], [[195085, 195085], "mapped", [19662]], [[195086, 195086], "mapped", [19693]], [[195087, 195087], "mapped", [40295]], [[195088, 195088], "mapped", [172238]], [[195089, 195089], "mapped", [19704]], [[195090, 195090], "mapped", [172293]], [[195091, 195091], "mapped", [172558]], [[195092, 195092], "mapped", [172689]], [[195093, 195093], "mapped", [40635]], [[195094, 195094], "mapped", [19798]], [[195095, 195095], "mapped", [40697]], [[195096, 195096], "mapped", [40702]], [[195097, 195097], "mapped", [40709]], [[195098, 195098], "mapped", [40719]], [[195099, 195099], "mapped", [40726]], [[195100, 195100], "mapped", [40763]], [[195101, 195101], "mapped", [173568]], [[195102, 196605], "disallowed"], [[196606, 196607], "disallowed"], [[196608, 262141], "disallowed"], [[262142, 262143], "disallowed"], [[262144, 327677], "disallowed"], [[327678, 327679], "disallowed"], [[327680, 393213], "disallowed"], [[393214, 393215], "disallowed"], [[393216, 458749], "disallowed"], [[458750, 458751], "disallowed"], [[458752, 524285], "disallowed"], [[524286, 524287], "disallowed"], [[524288, 589821], "disallowed"], [[589822, 589823], "disallowed"], [[589824, 655357], "disallowed"], [[655358, 655359], "disallowed"], [[655360, 720893], "disallowed"], [[720894, 720895], "disallowed"], [[720896, 786429], "disallowed"], [[786430, 786431], "disallowed"], [[786432, 851965], "disallowed"], [[851966, 851967], "disallowed"], [[851968, 917501], "disallowed"], [[917502, 917503], "disallowed"], [[917504, 917504], "disallowed"], [[917505, 917505], "disallowed"], [[917506, 917535], "disallowed"], [[917536, 917631], "disallowed"], [[917632, 917759], "disallowed"], [[917760, 917999], "ignored"], [[918e3, 983037], "disallowed"], [[983038, 983039], "disallowed"], [[983040, 1048573], "disallowed"], [[1048574, 1048575], "disallowed"], [[1048576, 1114109], "disallowed"], [[1114110, 1114111], "disallowed"]];
  }
});

// node_modules/tr46/index.js
var require_tr46 = __commonJS({
  "node_modules/tr46/index.js"(exports, module2) {
    "use strict";
    var punycode = require("punycode");
    var mappingTable = require_mappingTable();
    var PROCESSING_OPTIONS = {
      TRANSITIONAL: 0,
      NONTRANSITIONAL: 1
    };
    function normalize(str) {
      return str.split("\0").map(function(s) {
        return s.normalize("NFC");
      }).join("\0");
    }
    function findStatus(val) {
      var start = 0;
      var end = mappingTable.length - 1;
      while (start <= end) {
        var mid = Math.floor((start + end) / 2);
        var target = mappingTable[mid];
        if (target[0][0] <= val && target[0][1] >= val) {
          return target;
        } else if (target[0][0] > val) {
          end = mid - 1;
        } else {
          start = mid + 1;
        }
      }
      return null;
    }
    var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    function countSymbols(string) {
      return string.replace(regexAstralSymbols, "_").length;
    }
    function mapChars(domain_name, useSTD3, processing_option) {
      var hasError = false;
      var processed = "";
      var len = countSymbols(domain_name);
      for (var i = 0; i < len; ++i) {
        var codePoint = domain_name.codePointAt(i);
        var status = findStatus(codePoint);
        switch (status[1]) {
          case "disallowed":
            hasError = true;
            processed += String.fromCodePoint(codePoint);
            break;
          case "ignored":
            break;
          case "mapped":
            processed += String.fromCodePoint.apply(String, status[2]);
            break;
          case "deviation":
            if (processing_option === PROCESSING_OPTIONS.TRANSITIONAL) {
              processed += String.fromCodePoint.apply(String, status[2]);
            } else {
              processed += String.fromCodePoint(codePoint);
            }
            break;
          case "valid":
            processed += String.fromCodePoint(codePoint);
            break;
          case "disallowed_STD3_mapped":
            if (useSTD3) {
              hasError = true;
              processed += String.fromCodePoint(codePoint);
            } else {
              processed += String.fromCodePoint.apply(String, status[2]);
            }
            break;
          case "disallowed_STD3_valid":
            if (useSTD3) {
              hasError = true;
            }
            processed += String.fromCodePoint(codePoint);
            break;
        }
      }
      return {
        string: processed,
        error: hasError
      };
    }
    var combiningMarksRegex = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDE2C-\uDE37\uDEDF-\uDEEA\uDF01-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDE30-\uDE40\uDEAB-\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]/;
    function validateLabel(label, processing_option) {
      if (label.substr(0, 4) === "xn--") {
        label = punycode.toUnicode(label);
        processing_option = PROCESSING_OPTIONS.NONTRANSITIONAL;
      }
      var error = false;
      if (normalize(label) !== label || label[3] === "-" && label[4] === "-" || label[0] === "-" || label[label.length - 1] === "-" || label.indexOf(".") !== -1 || label.search(combiningMarksRegex) === 0) {
        error = true;
      }
      var len = countSymbols(label);
      for (var i = 0; i < len; ++i) {
        var status = findStatus(label.codePointAt(i));
        if (processing === PROCESSING_OPTIONS.TRANSITIONAL && status[1] !== "valid" || processing === PROCESSING_OPTIONS.NONTRANSITIONAL && status[1] !== "valid" && status[1] !== "deviation") {
          error = true;
          break;
        }
      }
      return {
        label,
        error
      };
    }
    function processing(domain_name, useSTD3, processing_option) {
      var result = mapChars(domain_name, useSTD3, processing_option);
      result.string = normalize(result.string);
      var labels = result.string.split(".");
      for (var i = 0; i < labels.length; ++i) {
        try {
          var validation = validateLabel(labels[i]);
          labels[i] = validation.label;
          result.error = result.error || validation.error;
        } catch (e) {
          result.error = true;
        }
      }
      return {
        string: labels.join("."),
        error: result.error
      };
    }
    module2.exports.toASCII = function(domain_name, useSTD3, processing_option, verifyDnsLength) {
      var result = processing(domain_name, useSTD3, processing_option);
      var labels = result.string.split(".");
      labels = labels.map(function(l) {
        try {
          return punycode.toASCII(l);
        } catch (e) {
          result.error = true;
          return l;
        }
      });
      if (verifyDnsLength) {
        var total = labels.slice(0, labels.length - 1).join(".").length;
        if (total.length > 253 || total.length === 0) {
          result.error = true;
        }
        for (var i = 0; i < labels.length; ++i) {
          if (labels.length > 63 || labels.length === 0) {
            result.error = true;
            break;
          }
        }
      }
      if (result.error)
        return null;
      return labels.join(".");
    };
    module2.exports.toUnicode = function(domain_name, useSTD3) {
      var result = processing(domain_name, useSTD3, PROCESSING_OPTIONS.NONTRANSITIONAL);
      return {
        domain: result.string,
        error: result.error
      };
    };
    module2.exports.PROCESSING_OPTIONS = PROCESSING_OPTIONS;
  }
});

// node_modules/whatwg-url/lib/url-state-machine.js
var require_url_state_machine = __commonJS({
  "node_modules/whatwg-url/lib/url-state-machine.js"(exports, module2) {
    "use strict";
    var punycode = require("punycode");
    var tr46 = require_tr46();
    var specialSchemes = {
      ftp: 21,
      file: null,
      gopher: 70,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    };
    var failure = Symbol("failure");
    function countSymbols(str) {
      return punycode.ucs2.decode(str).length;
    }
    function at(input, idx) {
      const c = input[idx];
      return isNaN(c) ? void 0 : String.fromCodePoint(c);
    }
    function isASCIIDigit(c) {
      return c >= 48 && c <= 57;
    }
    function isASCIIAlpha(c) {
      return c >= 65 && c <= 90 || c >= 97 && c <= 122;
    }
    function isASCIIAlphanumeric(c) {
      return isASCIIAlpha(c) || isASCIIDigit(c);
    }
    function isASCIIHex(c) {
      return isASCIIDigit(c) || c >= 65 && c <= 70 || c >= 97 && c <= 102;
    }
    function isSingleDot(buffer) {
      return buffer === "." || buffer.toLowerCase() === "%2e";
    }
    function isDoubleDot(buffer) {
      buffer = buffer.toLowerCase();
      return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
    }
    function isWindowsDriveLetterCodePoints(cp1, cp2) {
      return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
    }
    function isWindowsDriveLetterString(string) {
      return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
    }
    function isNormalizedWindowsDriveLetterString(string) {
      return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
    }
    function containsForbiddenHostCodePoint(string) {
      return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
    }
    function containsForbiddenHostCodePointExcludingPercent(string) {
      return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
    }
    function isSpecialScheme(scheme) {
      return specialSchemes[scheme] !== void 0;
    }
    function isSpecial(url) {
      return isSpecialScheme(url.scheme);
    }
    function defaultPort(scheme) {
      return specialSchemes[scheme];
    }
    function percentEncode(c) {
      let hex = c.toString(16).toUpperCase();
      if (hex.length === 1) {
        hex = "0" + hex;
      }
      return "%" + hex;
    }
    function utf8PercentEncode(c) {
      const buf = new Buffer(c);
      let str = "";
      for (let i = 0; i < buf.length; ++i) {
        str += percentEncode(buf[i]);
      }
      return str;
    }
    function utf8PercentDecode(str) {
      const input = new Buffer(str);
      const output = [];
      for (let i = 0; i < input.length; ++i) {
        if (input[i] !== 37) {
          output.push(input[i]);
        } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
          output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
          i += 2;
        } else {
          output.push(input[i]);
        }
      }
      return new Buffer(output).toString();
    }
    function isC0ControlPercentEncode(c) {
      return c <= 31 || c > 126;
    }
    var extraPathPercentEncodeSet = /* @__PURE__ */ new Set([32, 34, 35, 60, 62, 63, 96, 123, 125]);
    function isPathPercentEncode(c) {
      return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
    }
    var extraUserinfoPercentEncodeSet = /* @__PURE__ */ new Set([47, 58, 59, 61, 64, 91, 92, 93, 94, 124]);
    function isUserinfoPercentEncode(c) {
      return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
    }
    function percentEncodeChar(c, encodeSetPredicate) {
      const cStr = String.fromCodePoint(c);
      if (encodeSetPredicate(c)) {
        return utf8PercentEncode(cStr);
      }
      return cStr;
    }
    function parseIPv4Number(input) {
      let R = 10;
      if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
        input = input.substring(2);
        R = 16;
      } else if (input.length >= 2 && input.charAt(0) === "0") {
        input = input.substring(1);
        R = 8;
      }
      if (input === "") {
        return 0;
      }
      const regex = R === 10 ? /[^0-9]/ : R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/;
      if (regex.test(input)) {
        return failure;
      }
      return parseInt(input, R);
    }
    function parseIPv4(input) {
      const parts = input.split(".");
      if (parts[parts.length - 1] === "") {
        if (parts.length > 1) {
          parts.pop();
        }
      }
      if (parts.length > 4) {
        return input;
      }
      const numbers = [];
      for (const part of parts) {
        if (part === "") {
          return input;
        }
        const n = parseIPv4Number(part);
        if (n === failure) {
          return input;
        }
        numbers.push(n);
      }
      for (let i = 0; i < numbers.length - 1; ++i) {
        if (numbers[i] > 255) {
          return failure;
        }
      }
      if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
        return failure;
      }
      let ipv4 = numbers.pop();
      let counter = 0;
      for (const n of numbers) {
        ipv4 += n * Math.pow(256, 3 - counter);
        ++counter;
      }
      return ipv4;
    }
    function serializeIPv4(address) {
      let output = "";
      let n = address;
      for (let i = 1; i <= 4; ++i) {
        output = String(n % 256) + output;
        if (i !== 4) {
          output = "." + output;
        }
        n = Math.floor(n / 256);
      }
      return output;
    }
    function parseIPv6(input) {
      const address = [0, 0, 0, 0, 0, 0, 0, 0];
      let pieceIndex = 0;
      let compress = null;
      let pointer = 0;
      input = punycode.ucs2.decode(input);
      if (input[pointer] === 58) {
        if (input[pointer + 1] !== 58) {
          return failure;
        }
        pointer += 2;
        ++pieceIndex;
        compress = pieceIndex;
      }
      while (pointer < input.length) {
        if (pieceIndex === 8) {
          return failure;
        }
        if (input[pointer] === 58) {
          if (compress !== null) {
            return failure;
          }
          ++pointer;
          ++pieceIndex;
          compress = pieceIndex;
          continue;
        }
        let value = 0;
        let length = 0;
        while (length < 4 && isASCIIHex(input[pointer])) {
          value = value * 16 + parseInt(at(input, pointer), 16);
          ++pointer;
          ++length;
        }
        if (input[pointer] === 46) {
          if (length === 0) {
            return failure;
          }
          pointer -= length;
          if (pieceIndex > 6) {
            return failure;
          }
          let numbersSeen = 0;
          while (input[pointer] !== void 0) {
            let ipv4Piece = null;
            if (numbersSeen > 0) {
              if (input[pointer] === 46 && numbersSeen < 4) {
                ++pointer;
              } else {
                return failure;
              }
            }
            if (!isASCIIDigit(input[pointer])) {
              return failure;
            }
            while (isASCIIDigit(input[pointer])) {
              const number = parseInt(at(input, pointer));
              if (ipv4Piece === null) {
                ipv4Piece = number;
              } else if (ipv4Piece === 0) {
                return failure;
              } else {
                ipv4Piece = ipv4Piece * 10 + number;
              }
              if (ipv4Piece > 255) {
                return failure;
              }
              ++pointer;
            }
            address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
            ++numbersSeen;
            if (numbersSeen === 2 || numbersSeen === 4) {
              ++pieceIndex;
            }
          }
          if (numbersSeen !== 4) {
            return failure;
          }
          break;
        } else if (input[pointer] === 58) {
          ++pointer;
          if (input[pointer] === void 0) {
            return failure;
          }
        } else if (input[pointer] !== void 0) {
          return failure;
        }
        address[pieceIndex] = value;
        ++pieceIndex;
      }
      if (compress !== null) {
        let swaps = pieceIndex - compress;
        pieceIndex = 7;
        while (pieceIndex !== 0 && swaps > 0) {
          const temp = address[compress + swaps - 1];
          address[compress + swaps - 1] = address[pieceIndex];
          address[pieceIndex] = temp;
          --pieceIndex;
          --swaps;
        }
      } else if (compress === null && pieceIndex !== 8) {
        return failure;
      }
      return address;
    }
    function serializeIPv6(address) {
      let output = "";
      const seqResult = findLongestZeroSequence(address);
      const compress = seqResult.idx;
      let ignore0 = false;
      for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
        if (ignore0 && address[pieceIndex] === 0) {
          continue;
        } else if (ignore0) {
          ignore0 = false;
        }
        if (compress === pieceIndex) {
          const separator = pieceIndex === 0 ? "::" : ":";
          output += separator;
          ignore0 = true;
          continue;
        }
        output += address[pieceIndex].toString(16);
        if (pieceIndex !== 7) {
          output += ":";
        }
      }
      return output;
    }
    function parseHost(input, isSpecialArg) {
      if (input[0] === "[") {
        if (input[input.length - 1] !== "]") {
          return failure;
        }
        return parseIPv6(input.substring(1, input.length - 1));
      }
      if (!isSpecialArg) {
        return parseOpaqueHost(input);
      }
      const domain = utf8PercentDecode(input);
      const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
      if (asciiDomain === null) {
        return failure;
      }
      if (containsForbiddenHostCodePoint(asciiDomain)) {
        return failure;
      }
      const ipv4Host = parseIPv4(asciiDomain);
      if (typeof ipv4Host === "number" || ipv4Host === failure) {
        return ipv4Host;
      }
      return asciiDomain;
    }
    function parseOpaqueHost(input) {
      if (containsForbiddenHostCodePointExcludingPercent(input)) {
        return failure;
      }
      let output = "";
      const decoded = punycode.ucs2.decode(input);
      for (let i = 0; i < decoded.length; ++i) {
        output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
      }
      return output;
    }
    function findLongestZeroSequence(arr) {
      let maxIdx = null;
      let maxLen = 1;
      let currStart = null;
      let currLen = 0;
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i] !== 0) {
          if (currLen > maxLen) {
            maxIdx = currStart;
            maxLen = currLen;
          }
          currStart = null;
          currLen = 0;
        } else {
          if (currStart === null) {
            currStart = i;
          }
          ++currLen;
        }
      }
      if (currLen > maxLen) {
        maxIdx = currStart;
        maxLen = currLen;
      }
      return {
        idx: maxIdx,
        len: maxLen
      };
    }
    function serializeHost(host) {
      if (typeof host === "number") {
        return serializeIPv4(host);
      }
      if (host instanceof Array) {
        return "[" + serializeIPv6(host) + "]";
      }
      return host;
    }
    function trimControlChars(url) {
      return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
    }
    function trimTabAndNewline(url) {
      return url.replace(/\u0009|\u000A|\u000D/g, "");
    }
    function shortenPath(url) {
      const path = url.path;
      if (path.length === 0) {
        return;
      }
      if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
        return;
      }
      path.pop();
    }
    function includesCredentials(url) {
      return url.username !== "" || url.password !== "";
    }
    function cannotHaveAUsernamePasswordPort(url) {
      return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
    }
    function isNormalizedWindowsDriveLetter(string) {
      return /^[A-Za-z]:$/.test(string);
    }
    function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
      this.pointer = 0;
      this.input = input;
      this.base = base || null;
      this.encodingOverride = encodingOverride || "utf-8";
      this.stateOverride = stateOverride;
      this.url = url;
      this.failure = false;
      this.parseError = false;
      if (!this.url) {
        this.url = {
          scheme: "",
          username: "",
          password: "",
          host: null,
          port: null,
          path: [],
          query: null,
          fragment: null,
          cannotBeABaseURL: false
        };
        const res2 = trimControlChars(this.input);
        if (res2 !== this.input) {
          this.parseError = true;
        }
        this.input = res2;
      }
      const res = trimTabAndNewline(this.input);
      if (res !== this.input) {
        this.parseError = true;
      }
      this.input = res;
      this.state = stateOverride || "scheme start";
      this.buffer = "";
      this.atFlag = false;
      this.arrFlag = false;
      this.passwordTokenSeenFlag = false;
      this.input = punycode.ucs2.decode(this.input);
      for (; this.pointer <= this.input.length; ++this.pointer) {
        const c = this.input[this.pointer];
        const cStr = isNaN(c) ? void 0 : String.fromCodePoint(c);
        const ret = this["parse " + this.state](c, cStr);
        if (!ret) {
          break;
        } else if (ret === failure) {
          this.failure = true;
          break;
        }
      }
    }
    URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
      if (isASCIIAlpha(c)) {
        this.buffer += cStr.toLowerCase();
        this.state = "scheme";
      } else if (!this.stateOverride) {
        this.state = "no scheme";
        --this.pointer;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
      if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
        this.buffer += cStr.toLowerCase();
      } else if (c === 58) {
        if (this.stateOverride) {
          if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
            return false;
          }
          if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
            return false;
          }
          if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
            return false;
          }
          if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
            return false;
          }
        }
        this.url.scheme = this.buffer;
        this.buffer = "";
        if (this.stateOverride) {
          return false;
        }
        if (this.url.scheme === "file") {
          if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
            this.parseError = true;
          }
          this.state = "file";
        } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
          this.state = "special relative or authority";
        } else if (isSpecial(this.url)) {
          this.state = "special authority slashes";
        } else if (this.input[this.pointer + 1] === 47) {
          this.state = "path or authority";
          ++this.pointer;
        } else {
          this.url.cannotBeABaseURL = true;
          this.url.path.push("");
          this.state = "cannot-be-a-base-URL path";
        }
      } else if (!this.stateOverride) {
        this.buffer = "";
        this.state = "no scheme";
        this.pointer = -1;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
      if (this.base === null || this.base.cannotBeABaseURL && c !== 35) {
        return failure;
      } else if (this.base.cannotBeABaseURL && c === 35) {
        this.url.scheme = this.base.scheme;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.url.cannotBeABaseURL = true;
        this.state = "fragment";
      } else if (this.base.scheme === "file") {
        this.state = "file";
        --this.pointer;
      } else {
        this.state = "relative";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
      if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
      } else {
        this.parseError = true;
        this.state = "relative";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
      if (c === 47) {
        this.state = "authority";
      } else {
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
      this.url.scheme = this.base.scheme;
      if (isNaN(c)) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
      } else if (c === 47) {
        this.state = "relative slash";
      } else if (c === 63) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = "";
        this.state = "query";
      } else if (c === 35) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.state = "fragment";
      } else if (isSpecial(this.url) && c === 92) {
        this.parseError = true;
        this.state = "relative slash";
      } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice(0, this.base.path.length - 1);
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
      if (isSpecial(this.url) && (c === 47 || c === 92)) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "special authority ignore slashes";
      } else if (c === 47) {
        this.state = "authority";
      } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
      if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
      } else {
        this.parseError = true;
        this.state = "special authority ignore slashes";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
      if (c !== 47 && c !== 92) {
        this.state = "authority";
        --this.pointer;
      } else {
        this.parseError = true;
      }
      return true;
    };
    URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
      if (c === 64) {
        this.parseError = true;
        if (this.atFlag) {
          this.buffer = "%40" + this.buffer;
        }
        this.atFlag = true;
        const len = countSymbols(this.buffer);
        for (let pointer = 0; pointer < len; ++pointer) {
          const codePoint = this.buffer.codePointAt(pointer);
          if (codePoint === 58 && !this.passwordTokenSeenFlag) {
            this.passwordTokenSeenFlag = true;
            continue;
          }
          const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
          if (this.passwordTokenSeenFlag) {
            this.url.password += encodedCodePoints;
          } else {
            this.url.username += encodedCodePoints;
          }
        }
        this.buffer = "";
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        if (this.atFlag && this.buffer === "") {
          this.parseError = true;
          return failure;
        }
        this.pointer -= countSymbols(this.buffer) + 1;
        this.buffer = "";
        this.state = "host";
      } else {
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
      if (this.stateOverride && this.url.scheme === "file") {
        --this.pointer;
        this.state = "file host";
      } else if (c === 58 && !this.arrFlag) {
        if (this.buffer === "") {
          this.parseError = true;
          return failure;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
          return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "port";
        if (this.stateOverride === "hostname") {
          return false;
        }
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        --this.pointer;
        if (isSpecial(this.url) && this.buffer === "") {
          this.parseError = true;
          return failure;
        } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
          this.parseError = true;
          return false;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
          return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "path start";
        if (this.stateOverride) {
          return false;
        }
      } else {
        if (c === 91) {
          this.arrFlag = true;
        } else if (c === 93) {
          this.arrFlag = false;
        }
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
      if (isASCIIDigit(c)) {
        this.buffer += cStr;
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92 || this.stateOverride) {
        if (this.buffer !== "") {
          const port = parseInt(this.buffer);
          if (port > Math.pow(2, 16) - 1) {
            this.parseError = true;
            return failure;
          }
          this.url.port = port === defaultPort(this.url.scheme) ? null : port;
          this.buffer = "";
        }
        if (this.stateOverride) {
          return false;
        }
        this.state = "path start";
        --this.pointer;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    var fileOtherwiseCodePoints = /* @__PURE__ */ new Set([47, 92, 63, 35]);
    URLStateMachine.prototype["parse file"] = function parseFile(c) {
      this.url.scheme = "file";
      if (c === 47 || c === 92) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "file slash";
      } else if (this.base !== null && this.base.scheme === "file") {
        if (isNaN(c)) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = this.base.query;
        } else if (c === 63) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = "";
          this.state = "query";
        } else if (c === 35) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = this.base.query;
          this.url.fragment = "";
          this.state = "fragment";
        } else {
          if (this.input.length - this.pointer - 1 === 0 || !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) || this.input.length - this.pointer - 1 >= 2 && !fileOtherwiseCodePoints.has(this.input[this.pointer + 2])) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            shortenPath(this.url);
          } else {
            this.parseError = true;
          }
          this.state = "path";
          --this.pointer;
        }
      } else {
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
      if (c === 47 || c === 92) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "file host";
      } else {
        if (this.base !== null && this.base.scheme === "file") {
          if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
            this.url.path.push(this.base.path[0]);
          } else {
            this.url.host = this.base.host;
          }
        }
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
      if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
        --this.pointer;
        if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
          this.parseError = true;
          this.state = "path";
        } else if (this.buffer === "") {
          this.url.host = "";
          if (this.stateOverride) {
            return false;
          }
          this.state = "path start";
        } else {
          let host = parseHost(this.buffer, isSpecial(this.url));
          if (host === failure) {
            return failure;
          }
          if (host === "localhost") {
            host = "";
          }
          this.url.host = host;
          if (this.stateOverride) {
            return false;
          }
          this.buffer = "";
          this.state = "path start";
        }
      } else {
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
      if (isSpecial(this.url)) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "path";
        if (c !== 47 && c !== 92) {
          --this.pointer;
        }
      } else if (!this.stateOverride && c === 63) {
        this.url.query = "";
        this.state = "query";
      } else if (!this.stateOverride && c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      } else if (c !== void 0) {
        this.state = "path";
        if (c !== 47) {
          --this.pointer;
        }
      }
      return true;
    };
    URLStateMachine.prototype["parse path"] = function parsePath(c) {
      if (isNaN(c) || c === 47 || isSpecial(this.url) && c === 92 || !this.stateOverride && (c === 63 || c === 35)) {
        if (isSpecial(this.url) && c === 92) {
          this.parseError = true;
        }
        if (isDoubleDot(this.buffer)) {
          shortenPath(this.url);
          if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
            this.url.path.push("");
          }
        } else if (isSingleDot(this.buffer) && c !== 47 && !(isSpecial(this.url) && c === 92)) {
          this.url.path.push("");
        } else if (!isSingleDot(this.buffer)) {
          if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
            if (this.url.host !== "" && this.url.host !== null) {
              this.parseError = true;
              this.url.host = "";
            }
            this.buffer = this.buffer[0] + ":";
          }
          this.url.path.push(this.buffer);
        }
        this.buffer = "";
        if (this.url.scheme === "file" && (c === void 0 || c === 63 || c === 35)) {
          while (this.url.path.length > 1 && this.url.path[0] === "") {
            this.parseError = true;
            this.url.path.shift();
          }
        }
        if (c === 63) {
          this.url.query = "";
          this.state = "query";
        }
        if (c === 35) {
          this.url.fragment = "";
          this.state = "fragment";
        }
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.buffer += percentEncodeChar(c, isPathPercentEncode);
      }
      return true;
    };
    URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
      if (c === 63) {
        this.url.query = "";
        this.state = "query";
      } else if (c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      } else {
        if (!isNaN(c) && c !== 37) {
          this.parseError = true;
        }
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        if (!isNaN(c)) {
          this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
        }
      }
      return true;
    };
    URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
      if (isNaN(c) || !this.stateOverride && c === 35) {
        if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
          this.encodingOverride = "utf-8";
        }
        const buffer = new Buffer(this.buffer);
        for (let i = 0; i < buffer.length; ++i) {
          if (buffer[i] < 33 || buffer[i] > 126 || buffer[i] === 34 || buffer[i] === 35 || buffer[i] === 60 || buffer[i] === 62) {
            this.url.query += percentEncode(buffer[i]);
          } else {
            this.url.query += String.fromCodePoint(buffer[i]);
          }
        }
        this.buffer = "";
        if (c === 35) {
          this.url.fragment = "";
          this.state = "fragment";
        }
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
      if (isNaN(c)) {
      } else if (c === 0) {
        this.parseError = true;
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
      }
      return true;
    };
    function serializeURL(url, excludeFragment) {
      let output = url.scheme + ":";
      if (url.host !== null) {
        output += "//";
        if (url.username !== "" || url.password !== "") {
          output += url.username;
          if (url.password !== "") {
            output += ":" + url.password;
          }
          output += "@";
        }
        output += serializeHost(url.host);
        if (url.port !== null) {
          output += ":" + url.port;
        }
      } else if (url.host === null && url.scheme === "file") {
        output += "//";
      }
      if (url.cannotBeABaseURL) {
        output += url.path[0];
      } else {
        for (const string of url.path) {
          output += "/" + string;
        }
      }
      if (url.query !== null) {
        output += "?" + url.query;
      }
      if (!excludeFragment && url.fragment !== null) {
        output += "#" + url.fragment;
      }
      return output;
    }
    function serializeOrigin(tuple) {
      let result = tuple.scheme + "://";
      result += serializeHost(tuple.host);
      if (tuple.port !== null) {
        result += ":" + tuple.port;
      }
      return result;
    }
    module2.exports.serializeURL = serializeURL;
    module2.exports.serializeURLOrigin = function(url) {
      switch (url.scheme) {
        case "blob":
          try {
            return module2.exports.serializeURLOrigin(module2.exports.parseURL(url.path[0]));
          } catch (e) {
            return "null";
          }
        case "ftp":
        case "gopher":
        case "http":
        case "https":
        case "ws":
        case "wss":
          return serializeOrigin({
            scheme: url.scheme,
            host: url.host,
            port: url.port
          });
        case "file":
          return "file://";
        default:
          return "null";
      }
    };
    module2.exports.basicURLParse = function(input, options) {
      if (options === void 0) {
        options = {};
      }
      const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
      if (usm.failure) {
        return "failure";
      }
      return usm.url;
    };
    module2.exports.setTheUsername = function(url, username) {
      url.username = "";
      const decoded = punycode.ucs2.decode(username);
      for (let i = 0; i < decoded.length; ++i) {
        url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
      }
    };
    module2.exports.setThePassword = function(url, password) {
      url.password = "";
      const decoded = punycode.ucs2.decode(password);
      for (let i = 0; i < decoded.length; ++i) {
        url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
      }
    };
    module2.exports.serializeHost = serializeHost;
    module2.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
    module2.exports.serializeInteger = function(integer) {
      return String(integer);
    };
    module2.exports.parseURL = function(input, options) {
      if (options === void 0) {
        options = {};
      }
      return module2.exports.basicURLParse(input, { baseURL: options.baseURL, encodingOverride: options.encodingOverride });
    };
  }
});

// node_modules/whatwg-url/lib/URL-impl.js
var require_URL_impl = __commonJS({
  "node_modules/whatwg-url/lib/URL-impl.js"(exports) {
    "use strict";
    var usm = require_url_state_machine();
    exports.implementation = class URLImpl {
      constructor(constructorArgs) {
        const url = constructorArgs[0];
        const base = constructorArgs[1];
        let parsedBase = null;
        if (base !== void 0) {
          parsedBase = usm.basicURLParse(base);
          if (parsedBase === "failure") {
            throw new TypeError("Invalid base URL");
          }
        }
        const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
        if (parsedURL === "failure") {
          throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
      }
      get href() {
        return usm.serializeURL(this._url);
      }
      set href(v) {
        const parsedURL = usm.basicURLParse(v);
        if (parsedURL === "failure") {
          throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
      }
      get origin() {
        return usm.serializeURLOrigin(this._url);
      }
      get protocol() {
        return this._url.scheme + ":";
      }
      set protocol(v) {
        usm.basicURLParse(v + ":", { url: this._url, stateOverride: "scheme start" });
      }
      get username() {
        return this._url.username;
      }
      set username(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        usm.setTheUsername(this._url, v);
      }
      get password() {
        return this._url.password;
      }
      set password(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        usm.setThePassword(this._url, v);
      }
      get host() {
        const url = this._url;
        if (url.host === null) {
          return "";
        }
        if (url.port === null) {
          return usm.serializeHost(url.host);
        }
        return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
      }
      set host(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
      }
      get hostname() {
        if (this._url.host === null) {
          return "";
        }
        return usm.serializeHost(this._url.host);
      }
      set hostname(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
      }
      get port() {
        if (this._url.port === null) {
          return "";
        }
        return usm.serializeInteger(this._url.port);
      }
      set port(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        if (v === "") {
          this._url.port = null;
        } else {
          usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
        }
      }
      get pathname() {
        if (this._url.cannotBeABaseURL) {
          return this._url.path[0];
        }
        if (this._url.path.length === 0) {
          return "";
        }
        return "/" + this._url.path.join("/");
      }
      set pathname(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        this._url.path = [];
        usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
      }
      get search() {
        if (this._url.query === null || this._url.query === "") {
          return "";
        }
        return "?" + this._url.query;
      }
      set search(v) {
        const url = this._url;
        if (v === "") {
          url.query = null;
          return;
        }
        const input = v[0] === "?" ? v.substring(1) : v;
        url.query = "";
        usm.basicURLParse(input, { url, stateOverride: "query" });
      }
      get hash() {
        if (this._url.fragment === null || this._url.fragment === "") {
          return "";
        }
        return "#" + this._url.fragment;
      }
      set hash(v) {
        if (v === "") {
          this._url.fragment = null;
          return;
        }
        const input = v[0] === "#" ? v.substring(1) : v;
        this._url.fragment = "";
        usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
      }
      toJSON() {
        return this.href;
      }
    };
  }
});

// node_modules/whatwg-url/lib/URL.js
var require_URL = __commonJS({
  "node_modules/whatwg-url/lib/URL.js"(exports, module2) {
    "use strict";
    var conversions = require_lib();
    var utils = require_utils();
    var Impl = require_URL_impl();
    var impl = utils.implSymbol;
    function URL(url) {
      if (!this || this[impl] || !(this instanceof URL)) {
        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      for (let i = 0; i < arguments.length && i < 2; ++i) {
        args[i] = arguments[i];
      }
      args[0] = conversions["USVString"](args[0]);
      if (args[1] !== void 0) {
        args[1] = conversions["USVString"](args[1]);
      }
      module2.exports.setup(this, args);
    }
    URL.prototype.toJSON = function toJSON() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length && i < 0; ++i) {
        args[i] = arguments[i];
      }
      return this[impl].toJSON.apply(this[impl], args);
    };
    Object.defineProperty(URL.prototype, "href", {
      get() {
        return this[impl].href;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].href = V;
      },
      enumerable: true,
      configurable: true
    });
    URL.prototype.toString = function() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this.href;
    };
    Object.defineProperty(URL.prototype, "origin", {
      get() {
        return this[impl].origin;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "protocol", {
      get() {
        return this[impl].protocol;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].protocol = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "username", {
      get() {
        return this[impl].username;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].username = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "password", {
      get() {
        return this[impl].password;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].password = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "host", {
      get() {
        return this[impl].host;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].host = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "hostname", {
      get() {
        return this[impl].hostname;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].hostname = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "port", {
      get() {
        return this[impl].port;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].port = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "pathname", {
      get() {
        return this[impl].pathname;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].pathname = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "search", {
      get() {
        return this[impl].search;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].search = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "hash", {
      get() {
        return this[impl].hash;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].hash = V;
      },
      enumerable: true,
      configurable: true
    });
    module2.exports = {
      is(obj) {
        return !!obj && obj[impl] instanceof Impl.implementation;
      },
      create(constructorArgs, privateData) {
        let obj = Object.create(URL.prototype);
        this.setup(obj, constructorArgs, privateData);
        return obj;
      },
      setup(obj, constructorArgs, privateData) {
        if (!privateData)
          privateData = {};
        privateData.wrapper = obj;
        obj[impl] = new Impl.implementation(constructorArgs, privateData);
        obj[impl][utils.wrapperSymbol] = obj;
      },
      interface: URL,
      expose: {
        Window: { URL },
        Worker: { URL }
      }
    };
  }
});

// node_modules/whatwg-url/lib/public-api.js
var require_public_api = __commonJS({
  "node_modules/whatwg-url/lib/public-api.js"(exports) {
    "use strict";
    exports.URL = require_URL().interface;
    exports.serializeURL = require_url_state_machine().serializeURL;
    exports.serializeURLOrigin = require_url_state_machine().serializeURLOrigin;
    exports.basicURLParse = require_url_state_machine().basicURLParse;
    exports.setTheUsername = require_url_state_machine().setTheUsername;
    exports.setThePassword = require_url_state_machine().setThePassword;
    exports.serializeHost = require_url_state_machine().serializeHost;
    exports.serializeInteger = require_url_state_machine().serializeInteger;
    exports.parseURL = require_url_state_machine().parseURL;
  }
});

// node_modules/node-fetch/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/node-fetch/lib/index.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream = _interopDefault(require("stream"));
    var http = _interopDefault(require("http"));
    var Url = _interopDefault(require("url"));
    var whatwgUrl = _interopDefault(require_public_api());
    var https = _interopDefault(require("https"));
    var zlib = _interopDefault(require("zlib"));
    var Readable = Stream.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob = class {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options && options.type !== void 0 && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable();
        readable._read = function() {
        };
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError(message, type, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError.prototype = Object.create(Error.prototype);
    FetchError.prototype.constructor = FetchError;
    FetchError.prototype.name = "FetchError";
    var convert;
    try {
      convert = require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS = Symbol("Body internals");
    var PassThrough = Stream.PassThrough;
    function Body(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream)
        ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream) {
        body.on("error", function(err) {
          const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS].error = error;
        });
      }
    }
    Body.prototype = {
      get body() {
        return this[INTERNALS].body;
      },
      get bodyUsed() {
        return this[INTERNALS].disturbed;
      },
      arrayBuffer() {
        return consumeBody.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody.call(this).then(function(buf) {
          return Object.assign(
            new Blob([], {
              type: ct.toLowerCase()
            }),
            {
              [BUFFER]: buf
            }
          );
        });
      },
      json() {
        var _this2 = this;
        return consumeBody.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      text() {
        return consumeBody.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body.mixIn = function(proto) {
      for (const name of Object.getOwnPropertyNames(Body.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody() {
      var _this4 = this;
      if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS].disturbed = true;
      if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
      }
      let body = this.body;
      if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
      }
      if (!(body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body.Promise(function(resolve, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers.get("content-type");
      let charset = "utf-8";
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream && typeof body.getBoundary !== "function") {
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map, name) {
      name = name.toLowerCase();
      for (const key in map) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers = class {
      constructor() {
        let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = /* @__PURE__ */ Object.create(null);
        if (init instanceof Headers) {
          const rawHeaders = init.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init == null)
          ;
        else if (typeof init === "object") {
          const method = init[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs = [];
            for (const pair of init) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init)) {
              const value = init[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers.prototype.entries = Headers.prototype[Symbol.iterator];
    Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys = Object.keys(headers[MAP]).sort();
      return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index + 1;
        return {
          value: values[index],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({ __proto__: null }, headers[MAP]);
      const hostHeaderKey = find(headers[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name] === void 0) {
              headers[MAP][name] = [val];
            } else {
              headers[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers[MAP][name] = [obj[name]];
        }
      }
      return headers;
    }
    var INTERNALS$1 = Symbol("Response internals");
    var STATUS_CODES = http.STATUS_CODES;
    var Response = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      clone() {
        return new Response(clone(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body.mixIn(Response.prototype);
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$2 = Symbol("Request internals");
    var URL = Url.URL || whatwgUrl.URL;
    var parse_url = Url.parse;
    var format_url = Url.format;
    function parseURL(urlStr) {
      if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
        urlStr = new URL(urlStr).toString();
      }
      return parse_url(urlStr);
    }
    var streamDestructionSupported = "destroy" in Stream.Readable.prototype;
    function isRequest(input) {
      return typeof input === "object" && typeof input[INTERNALS$2] === "object";
    }
    function isAbortSignal(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request = class {
      constructor(input) {
        let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest(input)) {
          if (input && input.href) {
            parsedURL = parseURL(input.href);
          } else {
            parsedURL = parseURL(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parseURL(input.url);
        }
        let method = init.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
        Body.call(this, inputBody, {
          timeout: init.timeout || input.timeout || 0,
          size: init.size || input.size || 0
        });
        const headers = new Headers(init.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init)
          signal = init.signal;
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$2] = {
          method,
          redirect: init.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init.counter || input.counter || 0;
        this.agent = init.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$2].method;
      }
      get url() {
        return format_url(this[INTERNALS$2].parsedURL);
      }
      get headers() {
        return this[INTERNALS$2].headers;
      }
      get redirect() {
        return this[INTERNALS$2].redirect;
      }
      get signal() {
        return this[INTERNALS$2].signal;
      }
      clone() {
        return new Request(this);
      }
    };
    Body.mixIn(Request.prototype);
    Object.defineProperty(Request.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions(request) {
      const parsedURL = request[INTERNALS$2].parsedURL;
      const headers = new Headers(request[INTERNALS$2].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError(message) {
      Error.call(this, message);
      this.type = "aborted";
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError.prototype = Object.create(Error.prototype);
    AbortError.prototype.constructor = AbortError;
    AbortError.prototype.name = "AbortError";
    var URL$1 = Url.URL || whatwgUrl.URL;
    var PassThrough$1 = Stream.PassThrough;
    var isDomainOrSubdomain = function isDomainOrSubdomain2(destination, original) {
      const orig = new URL$1(original).hostname;
      const dest = new URL$1(destination).hostname;
      return orig === dest || orig[orig.length - dest.length - 1] === "." && orig.endsWith(dest);
    };
    function fetch(url, opts) {
      if (!fetch.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body.Promise = fetch.Promise;
      return new fetch.Promise(function(resolve, reject) {
        const request = new Request(url, opts);
        const options = getNodeRequestOptions(request);
        const send = (options.protocol === "https:" ? https : http).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error = new AbortError("The user aborted a request.");
          reject(error);
          if (request.body && request.body instanceof Stream.Readable) {
            request.body.destroy(error);
          }
          if (!response || !response.body)
            return;
          response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
              finalize();
            }, request.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
          finalize();
        });
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch.isRedirect(res.statusCode)) {
            const location = headers.get("Location");
            let locationURL = null;
            try {
              locationURL = location === null ? null : new URL$1(location, request.url).toString();
            } catch (err) {
              if (request.redirect !== "manual") {
                reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
                finalize();
                return;
              }
            }
            switch (request.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (!isDomainOrSubdomain(request.url, locationURL)) {
                  for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                    requestOpts.headers.delete(name);
                  }
                }
                if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve(fetch(new Request(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal)
              signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          const zlibOptions = {
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib.createGunzip(zlibOptions));
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib.createInflate());
              } else {
                body = body.pipe(zlib.createInflateRaw());
              }
              response = new Response(body, response_options);
              resolve(response);
            });
            return;
          }
          if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
            body = body.pipe(zlib.createBrotliDecompress());
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          response = new Response(body, response_options);
          resolve(response);
        });
        writeToStream(req, request);
      });
    }
    fetch.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch.Promise = global.Promise;
    module2.exports = exports = fetch;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports;
    exports.Headers = Headers;
    exports.Request = Request;
    exports.Response = Response;
    exports.FetchError = FetchError;
  }
});

// node_modules/cross-fetch/dist/node-ponyfill.js
var require_node_ponyfill = __commonJS({
  "node_modules/cross-fetch/dist/node-ponyfill.js"(exports, module2) {
    var nodeFetch = require_lib2();
    var realFetch = nodeFetch.default || nodeFetch;
    var fetch = function(url, options) {
      if (/^\/\//.test(url)) {
        url = "https:" + url;
      }
      return realFetch.call(this, url, options);
    };
    fetch.ponyfill = true;
    module2.exports = exports = fetch;
    exports.fetch = fetch;
    exports.Headers = nodeFetch.Headers;
    exports.Request = nodeFetch.Request;
    exports.Response = nodeFetch.Response;
    exports.default = fetch;
  }
});

// node_modules/@raycast/utils/dist/useFetch.js
var require_useFetch = __commonJS({
  "node_modules/@raycast/utils/dist/useFetch.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useFetch = void 0;
    var react_1 = require("react");
    var media_typer_1 = __importDefault(require_media_typer());
    var content_type_1 = __importDefault(require_content_type());
    var useCachedPromise_1 = require_useCachedPromise();
    var useLatest_1 = require_useLatest();
    var { emitWarning } = process;
    process.emitWarning = (warning, ...args) => {
      if (args[0] === "ExperimentalWarning") {
        return;
      }
      if (args[0] && typeof args[0] === "object" && args[0].type === "ExperimentalWarning") {
        return;
      }
      return emitWarning(warning, ...args);
    };
    var cross_fetch_1 = require_node_ponyfill();
    function isJSON(contentTypeHeader) {
      if (contentTypeHeader) {
        const ct = content_type_1.default.parse(contentTypeHeader);
        const mediaType = media_typer_1.default.parse(ct.type);
        if (mediaType.subtype === "json") {
          return true;
        }
        if (mediaType.suffix === "json") {
          return true;
        }
        if (mediaType.suffix && /\bjson\b/i.test(mediaType.suffix)) {
          return true;
        }
        if (mediaType.subtype && /\bjson\b/i.test(mediaType.subtype)) {
          return true;
        }
      }
      return false;
    }
    async function defaultParsing(response) {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const contentTypeHeader = response.headers.get("content-type");
      if (contentTypeHeader && isJSON(contentTypeHeader)) {
        return await response.json();
      }
      return await response.text();
    }
    function useFetch(url, options) {
      const { parseResponse, initialData, execute, keepPreviousData, onError, onData, onWillExecute, ...fetchOptions } = options || {};
      const useCachedPromiseOptions = {
        initialData,
        execute,
        keepPreviousData,
        onError,
        onData,
        onWillExecute
      };
      const parseResponseRef = (0, useLatest_1.useLatest)(parseResponse || defaultParsing);
      const abortable = (0, react_1.useRef)();
      const fn = (0, react_1.useCallback)(async (url2, options2) => {
        const res = await (0, cross_fetch_1.fetch)(url2, { signal: abortable.current?.signal, ...options2 });
        return await parseResponseRef.current(res);
      }, [parseResponseRef]);
      return (0, useCachedPromise_1.useCachedPromise)(fn, [url, fetchOptions], { ...useCachedPromiseOptions, abortable });
    }
    exports.useFetch = useFetch;
  }
});

// node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "node_modules/signal-exit/signals.js"(exports, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
      );
    }
    if (process.platform === "linux") {
      module2.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/signal-exit/index.js"(exports, module2) {
    var process2 = global.process;
    var processOk = function(process3) {
      return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
    };
    if (!processOk(process2)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process2.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process2.__signal_exit_emitter__) {
        emitter = process2.__signal_exit_emitter__;
      } else {
        emitter = process2.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process2.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process2.emit = originalProcessEmit;
        process2.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process2.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process2.kill(process2.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process2.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process2.emit = processEmit;
        process2.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process2.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process2.exitCode = code || 0;
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        originalProcessReallyExit.call(process2, process2.exitCode);
      };
      originalProcessEmit = process2.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process2.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/@raycast/utils/dist/exec-utils.js
var require_exec_utils = __commonJS({
  "node_modules/@raycast/utils/dist/exec-utils.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSpawnedResult = exports.getSpawnedPromise = void 0;
    var node_buffer_1 = require("node:buffer");
    var node_stream_1 = __importDefault(require("node:stream"));
    var node_util_1 = require("node:util");
    var signal_exit_1 = __importDefault(require_signal_exit());
    function getSpawnedPromise(spawned, { timeout } = {}) {
      const spawnedPromise = new Promise((resolve, reject) => {
        spawned.on("exit", (exitCode, signal) => {
          resolve({ exitCode, signal, timedOut: false });
        });
        spawned.on("error", (error) => {
          reject(error);
        });
        if (spawned.stdin) {
          spawned.stdin.on("error", (error) => {
            reject(error);
          });
        }
      });
      if (timeout === 0 || timeout === void 0) {
        return spawnedPromise;
      }
      let timeoutId;
      const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutId = setTimeout(() => {
          spawned.kill("SIGTERM");
          reject(Object.assign(new Error("Timed out"), { timedOut: true, signal: "SIGTERM" }));
        }, timeout);
      });
      const safeSpawnedPromise = spawnedPromise.finally(() => {
        clearTimeout(timeoutId);
      });
      const removeExitHandler = (0, signal_exit_1.default)(() => {
        spawned.kill();
      });
      return Promise.race([timeoutPromise, safeSpawnedPromise]).finally(() => removeExitHandler());
    }
    exports.getSpawnedPromise = getSpawnedPromise;
    var MaxBufferError = class extends Error {
      constructor() {
        super("The output is too big");
        this.name = "MaxBufferError";
      }
    };
    var streamPipelinePromisified = (0, node_util_1.promisify)(node_stream_1.default.pipeline);
    function bufferStream(options) {
      const { encoding } = options;
      const isBuffer = encoding === "buffer";
      const stream = new node_stream_1.default.PassThrough({ objectMode: false });
      if (encoding && encoding !== "buffer") {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        length += chunk.length;
      });
      stream.getBufferedValue = () => {
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    }
    async function getStream(inputStream, options) {
      const stream = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream.getBufferedLength() <= node_buffer_1.constants.MAX_LENGTH) {
            error.bufferedData = stream.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream.on("data", () => {
          if (stream.getBufferedLength() > 1e3 * 1e3 * 80) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream.getBufferedValue();
    }
    async function getBufferedData(stream, streamPromise) {
      stream.destroy();
      try {
        return await streamPromise;
      } catch (error) {
        return error.bufferedData;
      }
    }
    async function getSpawnedResult({ stdout, stderr }, { encoding }, processDone) {
      const stdoutPromise = getStream(stdout, { encoding });
      const stderrPromise = getStream(stderr, { encoding });
      try {
        return await Promise.all([processDone, stdoutPromise, stderrPromise]);
      } catch (error) {
        return Promise.all([
          {
            error,
            exitCode: null,
            signal: error.signal,
            timedOut: error.timedOut || false
          },
          getBufferedData(stdout, stdoutPromise),
          getBufferedData(stderr, stderrPromise)
        ]);
      }
    }
    exports.getSpawnedResult = getSpawnedResult;
  }
});

// node_modules/@raycast/utils/dist/useExec.js
var require_useExec = __commonJS({
  "node_modules/@raycast/utils/dist/useExec.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useExec = void 0;
    var node_child_process_1 = __importDefault(require("node:child_process"));
    var react_1 = require("react");
    var useCachedPromise_1 = require_useCachedPromise();
    var useLatest_1 = require_useLatest();
    var exec_utils_1 = require_exec_utils();
    var SPACES_REGEXP = / +/g;
    function parseCommand(command, args) {
      if (args) {
        return [command, ...args];
      }
      const tokens = [];
      for (const token of command.trim().split(SPACES_REGEXP)) {
        const previousToken = tokens[tokens.length - 1];
        if (previousToken && previousToken.endsWith("\\")) {
          tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
        } else {
          tokens.push(token);
        }
      }
      return tokens;
    }
    function stripFinalNewline(input) {
      const LF = typeof input === "string" ? "\n" : "\n".charCodeAt(0);
      const CR = typeof input === "string" ? "\r" : "\r".charCodeAt(0);
      if (input[input.length - 1] === LF) {
        input = input.slice(0, -1);
      }
      if (input[input.length - 1] === CR) {
        input = input.slice(0, -1);
      }
      return input;
    }
    function handleOutput(options, value) {
      if (options.stripFinalNewline) {
        return stripFinalNewline(value);
      }
      return value;
    }
    var getErrorPrefix = ({ timedOut, timeout, signal, exitCode }) => {
      if (timedOut) {
        return `timed out after ${timeout} milliseconds`;
      }
      if (signal !== void 0) {
        return `was killed with ${signal}`;
      }
      if (exitCode !== void 0) {
        return `failed with exit code ${exitCode}`;
      }
      return "failed";
    };
    var makeError = ({ stdout, stderr, error, signal, exitCode, command, timedOut, options }) => {
      const prefix = getErrorPrefix({ timedOut, timeout: options?.timeout, signal, exitCode });
      const execaMessage = `Command ${prefix}: ${command}`;
      const shortMessage = error ? `${execaMessage}
${error.message}` : execaMessage;
      const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
      if (error) {
        error.originalMessage = error.message;
        error.message = message;
      } else {
        error = new Error(message);
      }
      error.shortMessage = shortMessage;
      error.command = command;
      error.exitCode = exitCode;
      error.signal = signal;
      error.stdout = stdout;
      error.stderr = stderr;
      if ("bufferedData" in error) {
        delete error["bufferedData"];
      }
      return error;
    };
    function defaultParsing({ stdout, stderr, error, exitCode, signal, timedOut, command, options }) {
      if (error || exitCode !== 0 || signal !== null) {
        const returnedError = makeError({
          error,
          exitCode,
          signal,
          stdout,
          stderr,
          command,
          timedOut,
          options
        });
        throw returnedError;
      }
      return stdout;
    }
    function useExec2(command, optionsOrArgs, options) {
      const { parseOutput, input, onData, onWillExecute, initialData, execute, keepPreviousData, onError, ...execOptions } = Array.isArray(optionsOrArgs) ? options || {} : optionsOrArgs || {};
      const useCachedPromiseOptions = {
        initialData,
        execute,
        keepPreviousData,
        onError,
        onData,
        onWillExecute
      };
      const abortable = (0, react_1.useRef)();
      const parseOutputRef = (0, useLatest_1.useLatest)(parseOutput || defaultParsing);
      const fn = (0, react_1.useCallback)(async (_command, _args, _options, input2) => {
        const [file, ...args] = parseCommand(_command, _args);
        const command2 = [file, ...args].join(" ");
        const options2 = {
          stripFinalNewline: true,
          ..._options,
          signal: abortable.current?.signal,
          encoding: _options?.encoding === null ? "buffer" : _options?.encoding || "utf8",
          env: { ...process.env, ..._options?.env }
        };
        const spawned = node_child_process_1.default.spawn(file, args, options2);
        const spawnedPromise = (0, exec_utils_1.getSpawnedPromise)(spawned, options2);
        if (input2) {
          spawned.stdin.end(input2);
        }
        const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult] = await (0, exec_utils_1.getSpawnedResult)(spawned, options2, spawnedPromise);
        const stdout = handleOutput(options2, stdoutResult);
        const stderr = handleOutput(options2, stderrResult);
        return parseOutputRef.current({
          stdout,
          stderr,
          error,
          exitCode,
          signal,
          timedOut,
          command: command2,
          options: options2
        });
      }, [parseOutputRef]);
      return (0, useCachedPromise_1.useCachedPromise)(fn, [command, Array.isArray(optionsOrArgs) ? optionsOrArgs : [], execOptions, input], {
        ...useCachedPromiseOptions,
        abortable
      });
    }
    exports.useExec = useExec2;
  }
});

// node_modules/@raycast/utils/dist/useSQL.js
var require_useSQL = __commonJS({
  "node_modules/@raycast/utils/dist/useSQL.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSQL = void 0;
    var jsx_runtime_1 = require("react/jsx-runtime");
    var api_1 = require("@raycast/api");
    var node_fs_1 = require("node:fs");
    var promises_1 = require("node:fs/promises");
    var node_os_1 = __importDefault(require("node:os"));
    var node_child_process_1 = __importDefault(require("node:child_process"));
    var node_path_1 = __importDefault(require("node:path"));
    var object_hash_1 = __importDefault(require_object_hash());
    var react_1 = require("react");
    var usePromise_1 = require_usePromise();
    var useLatest_1 = require_useLatest();
    var exec_utils_1 = require_exec_utils();
    function useSQL(databasePath, query, options) {
      const { permissionPriming, ...usePromiseOptions } = options || {};
      const [permissionView, setPermissionView] = (0, react_1.useState)();
      const latestOptions = (0, useLatest_1.useLatest)(options || {});
      const abortable = (0, react_1.useRef)();
      const handleError = (0, react_1.useCallback)((_error) => {
        console.error(_error);
        const error = _error instanceof Error && _error.message.includes("authorization denied") ? new PermissionError("You do not have permission to access the database.") : _error;
        if (isPermissionError(error)) {
          setPermissionView((0, jsx_runtime_1.jsx)(PermissionErrorScreen, { priming: latestOptions.current.permissionPriming }));
        } else {
          if (latestOptions.current.onError) {
            latestOptions.current.onError(error);
          } else {
            console.error(error);
            if (api_1.environment.launchType !== api_1.LaunchType.Background) {
              (0, api_1.showToast)({
                style: api_1.Toast.Style.Failure,
                title: "Cannot query the data",
                message: error.message,
                primaryAction: {
                  title: "Copy Logs",
                  onAction(toast) {
                    toast.hide();
                    api_1.Clipboard.copy(error?.stack || error?.message || "");
                  }
                }
              });
            }
          }
        }
      }, [latestOptions]);
      const fn = (0, react_1.useMemo)(() => {
        if (!(0, node_fs_1.existsSync)(databasePath)) {
          throw new Error("The database does not exist");
        }
        let tempFolder = void 0;
        return async (query2) => {
          const spawned = node_child_process_1.default.spawn("sqlite3", ["--json", "--readonly", databasePath, query2], {
            signal: abortable.current?.signal
          });
          const spawnedPromise = (0, exec_utils_1.getSpawnedPromise)(spawned);
          let [{ error, exitCode, signal }, stdoutResult, stderrResult] = await (0, exec_utils_1.getSpawnedResult)(spawned, { encoding: "utf-8" }, spawnedPromise);
          if (stderrResult.match("(5)")) {
            if (!tempFolder) {
              tempFolder = node_path_1.default.join(node_os_1.default.tmpdir(), "useSQL", (0, object_hash_1.default)(databasePath));
              await (0, promises_1.mkdir)(tempFolder, { recursive: true });
            }
            const newDbPath = node_path_1.default.join(tempFolder, "db");
            await (0, promises_1.copyFile)(databasePath, newDbPath);
            const spawned2 = node_child_process_1.default.spawn("sqlite3", ["--json", "--readonly", "--vfs", "unix-none", newDbPath, query2], {
              signal: abortable.current?.signal
            });
            const spawnedPromise2 = (0, exec_utils_1.getSpawnedPromise)(spawned2);
            [{ error, exitCode, signal }, stdoutResult, stderrResult] = await (0, exec_utils_1.getSpawnedResult)(spawned2, { encoding: "utf-8" }, spawnedPromise2);
          }
          if (error || exitCode !== 0 || signal !== null) {
            throw new Error(stderrResult);
          }
          return JSON.parse(stdoutResult.trim() || "[]");
        };
      }, [databasePath]);
      return {
        ...(0, usePromise_1.usePromise)(fn, [query], { ...usePromiseOptions, onError: handleError }),
        permissionView
      };
    }
    exports.useSQL = useSQL;
    var PermissionError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "PermissionError";
      }
    };
    function isPermissionError(error) {
      return error instanceof Error && error.name === "PermissionError";
    }
    var macosVenturaAndLater = parseInt(node_os_1.default.release().split(".")[0]) >= 22;
    var preferencesString = macosVenturaAndLater ? "Settings" : "Preferences";
    function PermissionErrorScreen(props) {
      const action = macosVenturaAndLater ? {
        title: "Open System Settings -> Privacy",
        target: "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"
      } : {
        title: "Open System Preferences -> Security",
        target: "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"
      };
      if (api_1.environment.commandMode === "menu-bar") {
        return (0, jsx_runtime_1.jsxs)(api_1.MenuBarExtra, { icon: api_1.Icon.Warning, title: api_1.environment.commandName, children: [(0, jsx_runtime_1.jsx)(api_1.MenuBarExtra.Item, { title: "Raycast needs full disk access", tooltip: `You can revert this access in ${preferencesString} whenever you want` }), props.priming ? (0, jsx_runtime_1.jsx)(api_1.MenuBarExtra.Item, { title: props.priming, tooltip: `You can revert this access in ${preferencesString} whenever you want` }) : null, (0, jsx_runtime_1.jsx)(api_1.MenuBarExtra.Separator, {}), (0, jsx_runtime_1.jsx)(api_1.MenuBarExtra.Item, { title: action.title, onAction: () => (0, api_1.open)(action.target) })] });
      }
      return (0, jsx_runtime_1.jsx)(api_1.List, { children: (0, jsx_runtime_1.jsx)(api_1.List.EmptyView, { icon: {
        source: {
          light: "https://raycast.com/uploads/extensions-utils-security-permissions-light.png",
          dark: "https://raycast.com/uploads/extensions-utils-security-permissions-dark.png"
        }
      }, title: "Raycast needs full disk access.", description: `${props.priming ? props.priming + "\n" : ""}You can revert this access in ${preferencesString} whenever you want.`, actions: (0, jsx_runtime_1.jsx)(api_1.ActionPanel, { children: (0, jsx_runtime_1.jsx)(api_1.Action.Open, { ...action }) }) }) });
    }
  }
});

// node_modules/@raycast/utils/dist/useForm.js
var require_useForm = __commonJS({
  "node_modules/@raycast/utils/dist/useForm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useForm = exports.FormValidation = void 0;
    var react_1 = require("react");
    var useLatest_1 = require_useLatest();
    var FormValidation;
    (function(FormValidation2) {
      FormValidation2["Required"] = "required";
    })(FormValidation = exports.FormValidation || (exports.FormValidation = {}));
    function validationError(validation, value) {
      if (validation) {
        if (typeof validation === "function") {
          return validation(value);
        } else if (validation === FormValidation.Required) {
          let valueIsValid = typeof value !== "undefined" && value !== null;
          if (valueIsValid) {
            switch (typeof value) {
              case "string":
                valueIsValid = value.length > 0;
                break;
              case "object":
                if (Array.isArray(value)) {
                  valueIsValid = value.length > 0;
                } else if (value instanceof Date) {
                  valueIsValid = value.getTime() > 0;
                }
                break;
              default:
                break;
            }
          }
          if (!valueIsValid) {
            return "The item is required";
          }
        }
      }
    }
    function useForm(props) {
      const { onSubmit: _onSubmit, validation, initialValues = {} } = props;
      const [values, setValues] = (0, react_1.useState)(initialValues);
      const [errors, setErrors] = (0, react_1.useState)({});
      const refs = (0, react_1.useRef)({});
      const latestValidation = (0, useLatest_1.useLatest)(validation || {});
      const latestOnSubmit = (0, useLatest_1.useLatest)(_onSubmit);
      const focus = (0, react_1.useCallback)((id) => {
        refs.current[id]?.focus();
      }, [refs]);
      const handleSubmit = (0, react_1.useCallback)(async (values2) => {
        let validationErrors = false;
        for (const [id, validation2] of Object.entries(latestValidation.current)) {
          const error = validationError(validation2, values2[id]);
          if (error) {
            if (!validationErrors) {
              validationErrors = {};
              focus(id);
            }
            validationErrors[id] = error;
          }
        }
        if (validationErrors) {
          setErrors(validationErrors);
          return false;
        }
        const result = await latestOnSubmit.current(values2);
        return typeof result === "boolean" ? result : true;
      }, [latestValidation, latestOnSubmit, focus]);
      const setValidationError = (0, react_1.useCallback)((id, error) => {
        setErrors((errors2) => ({ ...errors2, [id]: error }));
      }, [setErrors]);
      const setValue = (0, react_1.useCallback)(function(id, value) {
        setValues((values2) => ({ ...values2, [id]: value }));
      }, [setValues]);
      const itemProps = (0, react_1.useMemo)(() => {
        return new Proxy(
          {},
          {
            get(target, id) {
              const validation2 = latestValidation.current[id];
              const value = values[id];
              return {
                onChange(value2) {
                  if (errors[id]) {
                    const error = validationError(validation2, value2);
                    if (!error) {
                      setValidationError(id, void 0);
                    }
                  }
                  setValue(id, value2);
                },
                onBlur(event) {
                  const error = validationError(validation2, event.target.value);
                  if (error) {
                    setValidationError(id, error);
                  }
                },
                error: errors[id],
                id,
                value: typeof value === "undefined" ? null : value,
                ref: (instance) => {
                  refs.current[id] = instance;
                }
              };
            }
          }
        );
      }, [errors, latestValidation, setValidationError, values, refs, setValue]);
      const reset = (0, react_1.useCallback)((initialValues2 = {}) => {
        setValues(initialValues2);
        setErrors({});
      }, [setValues, setErrors]);
      return { handleSubmit, setValidationError, setValue, values, itemProps, focus, reset };
    }
    exports.useForm = useForm;
  }
});

// node_modules/@raycast/utils/dist/icon/color.js
var require_color = __commonJS({
  "node_modules/@raycast/utils/dist/icon/color.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slightlyLighterColor = exports.slightlyDarkerColor = void 0;
    function hexToRGB(hex) {
      let r = 0;
      let g = 0;
      let b = 0;
      if (hex.length === 4) {
        r = parseInt(`${hex[1]}${hex[1]}`, 16);
        g = parseInt(`${hex[2]}${hex[2]}`, 16);
        b = parseInt(`${hex[3]}${hex[3]}`, 16);
      } else if (hex.length === 7) {
        r = parseInt(`${hex[1]}${hex[2]}`, 16);
        g = parseInt(`${hex[3]}${hex[4]}`, 16);
        b = parseInt(`${hex[5]}${hex[6]}`, 16);
      } else {
        throw new Error(`Malformed hex color: ${hex}`);
      }
      return { r, g, b };
    }
    function rgbToHex({ r, g, b }) {
      let rString = r.toString(16);
      let gString = g.toString(16);
      let bString = b.toString(16);
      if (rString.length === 1) {
        rString = `0${rString}`;
      }
      if (gString.length === 1) {
        gString = `0${gString}`;
      }
      if (bString.length === 1) {
        bString = `0${bString}`;
      }
      return `#${rString}${gString}${bString}`;
    }
    function rgbToHSL({ r, g, b }) {
      r /= 255;
      g /= 255;
      b /= 255;
      const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      const delta = cmax - cmin;
      let h = 0;
      let s = 0;
      let l = 0;
      if (delta === 0) {
        h = 0;
      } else if (cmax === r) {
        h = (g - b) / delta % 6;
      } else if (cmax === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
      h = Math.round(h * 60);
      if (h < 0) {
        h += 360;
      }
      l = (cmax + cmin) / 2;
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);
      return { h, s, l };
    }
    function hslToRGB({ h, s, l }) {
      s /= 100;
      l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(h / 60 % 2 - 1));
      const m = l - c / 2;
      let r = 0;
      let g = 0;
      let b = 0;
      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return { r, g, b };
    }
    function hexToHSL(hex) {
      return rgbToHSL(hexToRGB(hex));
    }
    function hslToHex(hsl) {
      return rgbToHex(hslToRGB(hsl));
    }
    function clamp(value, min, max) {
      return min < max ? value < min ? min : value > max ? max : value : value < max ? max : value > min ? min : value;
    }
    var offset = 12;
    function slightlyDarkerColor(hex) {
      const hsl = hexToHSL(hex);
      return hslToHex({
        h: hsl.h,
        s: hsl.s,
        l: clamp(hsl.l - offset, 0, 100)
      });
    }
    exports.slightlyDarkerColor = slightlyDarkerColor;
    function slightlyLighterColor(hex) {
      const hsl = hexToHSL(hex);
      return hslToHex({
        h: hsl.h,
        s: hsl.s,
        l: clamp(hsl.l + offset, 0, 100)
      });
    }
    exports.slightlyLighterColor = slightlyLighterColor;
  }
});

// node_modules/@raycast/utils/dist/icon/avatar.js
var require_avatar = __commonJS({
  "node_modules/@raycast/utils/dist/icon/avatar.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAvatarIcon = void 0;
    var color_1 = require_color();
    function getWholeCharAndI(str, i) {
      const code = str.charCodeAt(i);
      if (Number.isNaN(code)) {
        return ["", i];
      }
      if (code < 55296 || code > 57343) {
        return [str.charAt(i), i];
      }
      if (55296 <= code && code <= 56319) {
        if (str.length <= i + 1) {
          throw new Error("High surrogate without following low surrogate");
        }
        const next = str.charCodeAt(i + 1);
        if (56320 > next || next > 57343) {
          throw new Error("High surrogate without following low surrogate");
        }
        return [str.charAt(i) + str.charAt(i + 1), i + 1];
      }
      if (i === 0) {
        throw new Error("Low surrogate without preceding high surrogate");
      }
      const prev = str.charCodeAt(i - 1);
      if (55296 > prev || prev > 56319) {
        throw new Error("Low surrogate without preceding high surrogate");
      }
      return [str.charAt(i + 1), i + 1];
    }
    var avatarColorSet = [
      "#DC829A",
      "#D64854",
      "#D47600",
      "#D36CDD",
      "#52A9E4",
      "#7871E8",
      "#70920F",
      "#43B93A",
      "#EB6B3E",
      "#26B795",
      "#D85A9B",
      "#A067DC",
      "#BD9500",
      "#5385D9"
    ];
    function getAvatarIcon(name, options) {
      const words = name.trim().split(" ");
      let initials;
      if (words.length == 1 && getWholeCharAndI(words[0], 0)[0]) {
        initials = getWholeCharAndI(words[0], 0)[0];
      } else if (words.length > 1) {
        const firstWordFirstLetter = getWholeCharAndI(words[0], 0)[0] || "";
        const lastWordFirstLetter = getWholeCharAndI(words[words.length - 1], 0)[0] ?? "";
        initials = firstWordFirstLetter + lastWordFirstLetter;
      } else {
        initials = "";
      }
      let backgroundColor;
      if (options?.background) {
        backgroundColor = options?.background;
      } else {
        let initialsCharIndex = 0;
        let [char, i] = getWholeCharAndI(initials, 0);
        while (char) {
          initialsCharIndex += char.charCodeAt(0);
          [char, i] = getWholeCharAndI(initials, i + 1);
        }
        const colorIndex = initialsCharIndex % avatarColorSet.length;
        backgroundColor = avatarColorSet[colorIndex];
      }
      const padding = 0;
      const radius = 50 - padding;
      const svg = `<svg width="100px" height="100px">
  ${options?.gradient !== false ? `<defs>
      <linearGradient id="Gradient" x1="0.25" x2="0.75" y1="0" y2="1">
        <stop offset="0%" stop-color="${(0, color_1.slightlyLighterColor)(backgroundColor)}"/>
        <stop offset="50%" stop-color="${backgroundColor}"/>
        <stop offset="100%" stop-color="${(0, color_1.slightlyDarkerColor)(backgroundColor)}"/>
      </linearGradient>
  </defs>` : ""}
      <circle cx="50" cy="50" r="${radius}" fill="${options?.gradient !== false ? "url(#Gradient)" : backgroundColor}" />
      ${initials ? `<text x="50" y="80" font-size="${radius - 1}" font-family="Inter, sans-serif" text-anchor="middle" fill="white">${initials}</text>` : ""}
    </svg>
  `.replaceAll("\n", "");
      return `data:image/svg+xml,${svg}`;
    }
    exports.getAvatarIcon = getAvatarIcon;
  }
});

// node_modules/@raycast/utils/dist/icon/favicon.js
var require_favicon = __commonJS({
  "node_modules/@raycast/utils/dist/icon/favicon.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFavicon = void 0;
    var api_1 = require("@raycast/api");
    var url_1 = require("url");
    function getFavicon(url, options) {
      try {
        const urlObj = typeof url === "string" ? new url_1.URL(url) : url;
        const hostname = urlObj.hostname;
        return {
          source: `https://www.google.com/s2/favicons?sz=${options?.size ?? 64}&domain=${hostname}`,
          fallback: options?.fallback ?? api_1.Icon.Link,
          mask: options?.mask
        };
      } catch (e) {
        console.error(e);
        return api_1.Icon.Link;
      }
    }
    exports.getFavicon = getFavicon;
  }
});

// node_modules/@raycast/utils/dist/icon/progress.js
var require_progress = __commonJS({
  "node_modules/@raycast/utils/dist/icon/progress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProgressIcon = void 0;
    var api_1 = require("@raycast/api");
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    }
    function describeArc(x, y, radius, startAngle, endAngle) {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      const d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
      return d;
    }
    function getProgressIcon(progress, color = "#FF6363", options) {
      const background = options?.background || (api_1.environment.theme === "light" ? "black" : "white");
      const backgroundOpacity = options?.backgroundOpacity || 0.1;
      const stroke = 10;
      const padding = 5;
      const radius = 50 - padding - stroke / 2;
      const svg = `<svg width="100px" height="100px">
      <circle cx="50" cy="50" r="${radius}" stroke-width="${stroke}" stroke="${progress < 1 ? background : color}" opacity="${progress < 1 ? backgroundOpacity : "1"}" fill="none" />
      ${progress > 0 && progress < 1 ? `<path d="${describeArc(50, 50, radius, 0, progress * 360)}" stroke="${color}" stroke-width="${stroke}" fill="none" />` : ""}
    </svg>
  `.replaceAll("\n", "");
      return `data:image/svg+xml,${svg}`;
    }
    exports.getProgressIcon = getProgressIcon;
  }
});

// node_modules/@raycast/utils/dist/icon/index.js
var require_icon = __commonJS({
  "node_modules/@raycast/utils/dist/icon/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_avatar(), exports);
    __exportStar(require_favicon(), exports);
    __exportStar(require_progress(), exports);
  }
});

// node_modules/@raycast/utils/dist/index.js
var require_dist = __commonJS({
  "node_modules/@raycast/utils/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_usePromise(), exports);
    __exportStar(require_useCachedState(), exports);
    __exportStar(require_useCachedPromise(), exports);
    __exportStar(require_useFetch(), exports);
    __exportStar(require_useExec(), exports);
    __exportStar(require_useSQL(), exports);
    __exportStar(require_useForm(), exports);
    __exportStar(require_icon(), exports);
  }
});

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  default: () => Command
});
module.exports = __toCommonJS(src_exports);
var import_api = require("@raycast/api");
var import_react = require("react");
var import_node_child_process = require("node:child_process");

// node_modules/is-regexp/index.js
var { toString } = Object.prototype;
function isRegexp(value) {
  return toString.call(value) === "[object RegExp]";
}

// node_modules/clone-regexp/index.js
var flagMap = {
  global: "g",
  ignoreCase: "i",
  multiline: "m",
  dotAll: "s",
  sticky: "y",
  unicode: "u"
};
function clonedRegexp(regexp, options = {}) {
  if (!isRegexp(regexp)) {
    throw new TypeError("Expected a RegExp instance");
  }
  const flags = Object.keys(flagMap).map((flag) => (typeof options[flag] === "boolean" ? options[flag] : regexp[flag]) ? flagMap[flag] : "").join("");
  const clonedRegexp2 = new RegExp(options.source || regexp.source, flags);
  clonedRegexp2.lastIndex = typeof options.lastIndex === "number" ? options.lastIndex : regexp.lastIndex;
  return clonedRegexp2;
}

// node_modules/execall/index.js
function execAll(regexp, string) {
  let match;
  const matches = [];
  const clonedRegexp2 = clonedRegexp(regexp, { lastIndex: 0 });
  const isGlobal = clonedRegexp2.global;
  while (match = clonedRegexp2.exec(string)) {
    matches.push({
      match: match[0],
      subMatches: match.slice(1),
      index: match.index
    });
    if (!isGlobal) {
      break;
    }
  }
  return matches;
}

// node_modules/arrify/index.js
function arrify(value) {
  if (value === null || value === void 0) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return [value];
  }
  if (typeof value[Symbol.iterator] === "function") {
    return [...value];
  }
  return [value];
}

// node_modules/num-sort/index.js
function assertNumber(number) {
  if (typeof number !== "number") {
    throw new TypeError("Expected a number");
  }
}
function numberSortAscending(left, right) {
  assertNumber(left);
  assertNumber(right);
  if (Number.isNaN(left)) {
    return -1;
  }
  if (Number.isNaN(right)) {
    return 1;
  }
  return left - right;
}

// node_modules/array-uniq/index.js
function arrayUniq(array) {
  return [...new Set(array)];
}

// node_modules/split-at/index.js
function splitAt(string, index, { remove } = {}) {
  const result = [];
  let lastIndex = 0;
  const indices = arrayUniq(
    arrify(index).map((element) => {
      const value = element < 0 ? string.length - 1 - element * -1 : element;
      return value < 0 ? value * -1 : value;
    }).sort(numberSortAscending)
  );
  for (let index2 of indices) {
    index2++;
    result.push(
      string.slice(lastIndex, remove ? index2 - 1 : index2)
    );
    lastIndex = index2;
  }
  if (lastIndex < string.length) {
    result.push(string.slice(lastIndex));
  }
  return result;
}

// node_modules/parse-columns/node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// node_modules/parse-columns/index.js
var countSeparators = (lines, separator = " ") => {
  const counts = [];
  const separatorRegex = new RegExp(escapeStringRegexp(separator), "g");
  const headerLength = (lines[0] || "").length;
  for (let line of lines) {
    const padAmount = Math.ceil(Math.max(headerLength - line.length, 0) / separator.length);
    line += separator.repeat(padAmount);
    for (const { index: column } of execAll(separatorRegex, line)) {
      counts[column] = typeof counts[column] === "number" ? counts[column] + 1 : 1;
    }
  }
  return counts;
};
var getSplits = (lines, separator) => {
  const counts = countSeparators(lines, separator);
  const splits = [];
  let consecutive = false;
  for (const [index, count] of counts.entries()) {
    if (count !== lines.length) {
      consecutive = false;
    } else {
      if (index !== 0 && !consecutive) {
        splits.push(index);
      }
      consecutive = true;
    }
  }
  return splits;
};
function parseColumns(input, options = {}) {
  const lines = input.replace(/^\s*\n|\s+$/g, "").split("\n");
  let splits = getSplits(lines, options.separator);
  const { transform } = options;
  const rows = [];
  let items;
  let { headers } = options;
  if (!headers) {
    headers = [];
    items = splitAt(lines[0], splits, { remove: true });
    for (let [index, item] of items.entries()) {
      item = item.trim();
      if (item) {
        headers.push(item);
      } else {
        splits[index - 1] = null;
      }
    }
    splits = splits.filter(Boolean);
  }
  for (const [index, line] of lines.slice(1).entries()) {
    items = splitAt(line, splits, { remove: true });
    const row = {};
    for (const [index2, header] of headers.entries()) {
      const item = (items[index2] || "").trim();
      row[header] = transform ? transform(item, header, index2, index) : item;
    }
    rows.push(row);
  }
  return rows;
}

// src/index.tsx
var import_utils = __toESM(require_dist());
var import_jsx_runtime = require("react/jsx-runtime");
function Command() {
  const [searchText, setSearchText] = (0, import_react.useState)("");
  const { isLoading, data } = (0, import_utils.useExec)("/opt/homebrew/bin/aws-vault", ["list"]);
  const profiles = (0, import_react.useMemo)(() => parseTableListOuput(data || ""), [data]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List, {
    isLoading,
    onSearchTextChange: setSearchText,
    searchBarPlaceholder: "Search one of your AWS profiles...",
    throttle: true,
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Section, {
      title: "Profiles",
      subtitle: profiles.length + "",
      children: [
        profiles.filter((profile) => new RegExp(searchText, "i").test(profile.name)).map((profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileListItem, {
          profile
        }, profile.name)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, {
          title: "Logout",
          icon: "\u{1F512}",
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, {
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel.Section, {
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.OpenInBrowser, {
                url: "https://signin.aws.amazon.com/oauth?Action=logout&redirect_uri=https://aws.amazon.com"
              })
            })
          })
        })
      ]
    })
  });
}
function ProfileListItem({ profile }) {
  const openInBrowser = async () => {
    const profile_dir_name = profile.name.replace(/^a-zA-Z0-9_-/i, "__");
    const user_data_dir = `~/.aws/chrome/${profile_dir_name}`;
    (0, import_node_child_process.execSync)(`mkdir -p ${user_data_dir}`);
    const disk_cache_dir = (0, import_node_child_process.execSync)(`mktemp -d /tmp/aws_chrome_cache.XXXXXXXX`).toString().trim();
    const url = (0, import_node_child_process.execSync)(`/opt/homebrew/bin/aws-vault login ${profile.name} --stdout`).toString();
    console.log(user_data_dir, disk_cache_dir, url);
    (0, import_node_child_process.execSync)(`/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome       --no-first-run       --user-data-dir=${user_data_dir}       --disk-cache-dir=${disk_cache_dir}       --new-window       ${url}     >/dev/null 2>&1 &`);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, {
    title: profile.name,
    subtitle: profile.session,
    icon: "list-icon.png",
    actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, {
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel.Section, {
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, {
          title: "Open in Browser",
          onAction: openInBrowser
        })
      })
    })
  });
}
var parseTableListOuput = (tableList) => {
  const list = [];
  parseColumns(tableList, {
    transform: (item, header, columnIndex, rowIndex) => {
      if (rowIndex < 1 || item === "-") {
        return;
      }
      list.push({
        item,
        header,
        columnIndex,
        rowIndex
      });
    }
  });
  const profilesByRowIndex = list.reduce((acc, value) => {
    if (value.header === "Profile") {
      acc[value.rowIndex] = {
        ...acc[value.rowIndex],
        name: value.item
      };
    }
    if (value.header === "Sessions") {
      acc[value.rowIndex] = {
        ...acc[value.rowIndex],
        session: value.item
      };
    }
    return acc;
  }, {});
  return Object.values(profilesByRowIndex).filter((profile) => "name" in profile);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL2RlcXVhbC9saXRlL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AcmF5Y2FzdC91dGlscy9kaXN0L3VzZURlZXBNZW1vLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AcmF5Y2FzdC91dGlscy9kaXN0L3VzZUxhdGVzdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHJheWNhc3QvdXRpbHMvZGlzdC91c2VQcm9taXNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AcmF5Y2FzdC91dGlscy9kaXN0L3VzZUNhY2hlZFN0YXRlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9vYmplY3QtaGFzaC9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHJheWNhc3QvdXRpbHMvZGlzdC91c2VDYWNoZWRQcm9taXNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9tZWRpYS10eXBlci9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvY29udGVudC10eXBlL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy93ZWJpZGwtY29udmVyc2lvbnMvbGliL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy93aGF0d2ctdXJsL2xpYi91dGlscy5qcyIsICIuLi9ub2RlX21vZHVsZXMvdHI0Ni9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvd2hhdHdnLXVybC9saWIvdXJsLXN0YXRlLW1hY2hpbmUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3doYXR3Zy11cmwvbGliL1VSTC1pbXBsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy93aGF0d2ctdXJsL2xpYi9VUkwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3doYXR3Zy11cmwvbGliL3B1YmxpYy1hcGkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvbGliL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9jcm9zcy1mZXRjaC9kaXN0L25vZGUtcG9ueWZpbGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0ByYXljYXN0L3V0aWxzL2Rpc3QvdXNlRmV0Y2guanMiLCAiLi4vbm9kZV9tb2R1bGVzL3NpZ25hbC1leGl0L3NpZ25hbHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3NpZ25hbC1leGl0L2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AcmF5Y2FzdC91dGlscy9kaXN0L2V4ZWMtdXRpbHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0ByYXljYXN0L3V0aWxzL2Rpc3QvdXNlRXhlYy5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHJheWNhc3QvdXRpbHMvZGlzdC91c2VTUUwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0ByYXljYXN0L3V0aWxzL2Rpc3QvdXNlRm9ybS5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHJheWNhc3QvdXRpbHMvZGlzdC9pY29uL2NvbG9yLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AcmF5Y2FzdC91dGlscy9kaXN0L2ljb24vYXZhdGFyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AcmF5Y2FzdC91dGlscy9kaXN0L2ljb24vZmF2aWNvbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHJheWNhc3QvdXRpbHMvZGlzdC9pY29uL3Byb2dyZXNzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AcmF5Y2FzdC91dGlscy9kaXN0L2ljb24vaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL0ByYXljYXN0L3V0aWxzL2Rpc3QvaW5kZXguanMiLCAiLi4vc3JjL2luZGV4LnRzeCIsICIuLi9ub2RlX21vZHVsZXMvaXMtcmVnZXhwL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9jbG9uZS1yZWdleHAvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2V4ZWNhbGwvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2FycmlmeS9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvbnVtLXNvcnQvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2FycmF5LXVuaXEvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL3NwbGl0LWF0L2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYXJzZS1jb2x1bW5zL25vZGVfbW9kdWxlcy9lc2NhcGUtc3RyaW5nLXJlZ2V4cC9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFyc2UtY29sdW1ucy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsidmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGRlcXVhbChmb28sIGJhcikge1xuXHR2YXIgY3RvciwgbGVuO1xuXHRpZiAoZm9vID09PSBiYXIpIHJldHVybiB0cnVlO1xuXG5cdGlmIChmb28gJiYgYmFyICYmIChjdG9yPWZvby5jb25zdHJ1Y3RvcikgPT09IGJhci5jb25zdHJ1Y3Rvcikge1xuXHRcdGlmIChjdG9yID09PSBEYXRlKSByZXR1cm4gZm9vLmdldFRpbWUoKSA9PT0gYmFyLmdldFRpbWUoKTtcblx0XHRpZiAoY3RvciA9PT0gUmVnRXhwKSByZXR1cm4gZm9vLnRvU3RyaW5nKCkgPT09IGJhci50b1N0cmluZygpO1xuXG5cdFx0aWYgKGN0b3IgPT09IEFycmF5KSB7XG5cdFx0XHRpZiAoKGxlbj1mb28ubGVuZ3RoKSA9PT0gYmFyLmxlbmd0aCkge1xuXHRcdFx0XHR3aGlsZSAobGVuLS0gJiYgZGVxdWFsKGZvb1tsZW5dLCBiYXJbbGVuXSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxlbiA9PT0gLTE7XG5cdFx0fVxuXG5cdFx0aWYgKCFjdG9yIHx8IHR5cGVvZiBmb28gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRsZW4gPSAwO1xuXHRcdFx0Zm9yIChjdG9yIGluIGZvbykge1xuXHRcdFx0XHRpZiAoaGFzLmNhbGwoZm9vLCBjdG9yKSAmJiArK2xlbiAmJiAhaGFzLmNhbGwoYmFyLCBjdG9yKSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZiAoIShjdG9yIGluIGJhcikgfHwgIWRlcXVhbChmb29bY3Rvcl0sIGJhcltjdG9yXSkpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBPYmplY3Qua2V5cyhiYXIpLmxlbmd0aCA9PT0gbGVuO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBmb28gIT09IGZvbyAmJiBiYXIgIT09IGJhcjtcbn1cblxuZXhwb3J0cy5kZXF1YWwgPSBkZXF1YWw7IiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VEZWVwTWVtbyA9IHZvaWQgMDtcbmNvbnN0IHJlYWN0XzEgPSByZXF1aXJlKFwicmVhY3RcIik7XG5jb25zdCBsaXRlXzEgPSByZXF1aXJlKFwiZGVxdWFsL2xpdGVcIik7XG4vKipcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gYmUgbWVtb2l6ZWQgKHVzdWFsbHkgYSBkZXBlbmRlbmN5IGxpc3QpXG4gKiBAcmV0dXJucyBhIG1lbW9pemVkIHZlcnNpb24gb2YgdGhlIHZhbHVlIGFzIGxvbmcgYXMgaXQgcmVtYWlucyBkZWVwbHkgZXF1YWxcbiAqL1xuZnVuY3Rpb24gdXNlRGVlcE1lbW8odmFsdWUpIHtcbiAgICBjb25zdCByZWYgPSAoMCwgcmVhY3RfMS51c2VSZWYpKHZhbHVlKTtcbiAgICBjb25zdCBzaWduYWxSZWYgPSAoMCwgcmVhY3RfMS51c2VSZWYpKDApO1xuICAgIGlmICghKDAsIGxpdGVfMS5kZXF1YWwpKHZhbHVlLCByZWYuY3VycmVudCkpIHtcbiAgICAgICAgcmVmLmN1cnJlbnQgPSB2YWx1ZTtcbiAgICAgICAgc2lnbmFsUmVmLmN1cnJlbnQgKz0gMTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIHJldHVybiAoMCwgcmVhY3RfMS51c2VNZW1vKSgoKSA9PiByZWYuY3VycmVudCwgW3NpZ25hbFJlZi5jdXJyZW50XSk7XG59XG5leHBvcnRzLnVzZURlZXBNZW1vID0gdXNlRGVlcE1lbW87XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZUxhdGVzdCA9IHZvaWQgMDtcbmNvbnN0IHJlYWN0XzEgPSByZXF1aXJlKFwicmVhY3RcIik7XG4vKipcbiAqIFJldHVybnMgdGhlIGxhdGVzdCBzdGF0ZS5cbiAqXG4gKiBUaGlzIGlzIG1vc3RseSB1c2VmdWwgdG8gZ2V0IGFjY2VzcyB0byB0aGUgbGF0ZXN0IHZhbHVlIG9mIHNvbWUgcHJvcHMgb3Igc3RhdGUgaW5zaWRlIGFuIGFzeW5jaHJvbm91cyBjYWxsYmFjaywgaW5zdGVhZCBvZiB0aGF0IHZhbHVlIGF0IHRoZSB0aW1lIHRoZSBjYWxsYmFjayB3YXMgY3JlYXRlZCBmcm9tLlxuICovXG5mdW5jdGlvbiB1c2VMYXRlc3QodmFsdWUpIHtcbiAgICBjb25zdCByZWYgPSAoMCwgcmVhY3RfMS51c2VSZWYpKHZhbHVlKTtcbiAgICByZWYuY3VycmVudCA9IHZhbHVlO1xuICAgIHJldHVybiByZWY7XG59XG5leHBvcnRzLnVzZUxhdGVzdCA9IHVzZUxhdGVzdDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXNlUHJvbWlzZSA9IHZvaWQgMDtcbmNvbnN0IHJlYWN0XzEgPSByZXF1aXJlKFwicmVhY3RcIik7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCJAcmF5Y2FzdC9hcGlcIik7XG5jb25zdCB1c2VEZWVwTWVtb18xID0gcmVxdWlyZShcIi4vdXNlRGVlcE1lbW9cIik7XG5jb25zdCB1c2VMYXRlc3RfMSA9IHJlcXVpcmUoXCIuL3VzZUxhdGVzdFwiKTtcbmZ1bmN0aW9uIHVzZVByb21pc2UoZm4sIGFyZ3MsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBsYXN0Q2FsbElkID0gKDAsIHJlYWN0XzEudXNlUmVmKSgwKTtcbiAgICBjb25zdCBbc3RhdGUsIHNldF0gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoeyBpc0xvYWRpbmc6IHRydWUgfSk7XG4gICAgY29uc3QgZm5SZWYgPSAoMCwgdXNlTGF0ZXN0XzEudXNlTGF0ZXN0KShmbik7XG4gICAgY29uc3QgbGF0ZXN0QWJvcnRhYmxlID0gKDAsIHVzZUxhdGVzdF8xLnVzZUxhdGVzdCkob3B0aW9ucz8uYWJvcnRhYmxlKTtcbiAgICBjb25zdCBsYXRlc3RBcmdzID0gKDAsIHVzZUxhdGVzdF8xLnVzZUxhdGVzdCkoYXJncyB8fCBbXSk7XG4gICAgY29uc3QgbGF0ZXN0T25FcnJvciA9ICgwLCB1c2VMYXRlc3RfMS51c2VMYXRlc3QpKG9wdGlvbnM/Lm9uRXJyb3IpO1xuICAgIGNvbnN0IGxhdGVzdE9uRGF0YSA9ICgwLCB1c2VMYXRlc3RfMS51c2VMYXRlc3QpKG9wdGlvbnM/Lm9uRGF0YSk7XG4gICAgY29uc3QgbGF0ZXN0T25XaWxsRXhlY3V0ZSA9ICgwLCB1c2VMYXRlc3RfMS51c2VMYXRlc3QpKG9wdGlvbnM/Lm9uV2lsbEV4ZWN1dGUpO1xuICAgIGNvbnN0IGxhdGVzdFZhbHVlID0gKDAsIHVzZUxhdGVzdF8xLnVzZUxhdGVzdCkoc3RhdGUuZGF0YSk7XG4gICAgY29uc3QgbGF0ZXN0Q2FsbGJhY2sgPSAoMCwgcmVhY3RfMS51c2VSZWYpKCk7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbElkID0gKytsYXN0Q2FsbElkLmN1cnJlbnQ7XG4gICAgICAgIGlmIChsYXRlc3RBYm9ydGFibGUuY3VycmVudCkge1xuICAgICAgICAgICAgbGF0ZXN0QWJvcnRhYmxlLmN1cnJlbnQuY3VycmVudD8uYWJvcnQoKTtcbiAgICAgICAgICAgIGxhdGVzdEFib3J0YWJsZS5jdXJyZW50LmN1cnJlbnQgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGF0ZXN0T25XaWxsRXhlY3V0ZS5jdXJyZW50Py4oYXJncyk7XG4gICAgICAgIHNldCgocHJldlN0YXRlKSA9PiAoeyAuLi5wcmV2U3RhdGUsIGlzTG9hZGluZzogdHJ1ZSB9KSk7XG4gICAgICAgIHJldHVybiBmblJlZi5jdXJyZW50KC4uLmFyZ3MpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChjYWxsSWQgPT09IGxhc3RDYWxsSWQuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3RPbkRhdGEuY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICBsYXRlc3RPbkRhdGEuY3VycmVudChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0KHsgZGF0YSwgaXNMb2FkaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvci5uYW1lID09IFwiQWJvcnRFcnJvclwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxJZCA9PT0gbGFzdENhbGxJZC5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIGVycm9yc1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3RPbkVycm9yLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGF0ZXN0T25FcnJvci5jdXJyZW50KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXBpXzEuZW52aXJvbm1lbnQubGF1bmNoVHlwZSAhPT0gYXBpXzEuTGF1bmNoVHlwZS5CYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoMCwgYXBpXzEuc2hvd1RvYXN0KSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGFwaV8xLlRvYXN0LlN0eWxlLkZhaWx1cmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRmFpbGVkIHRvIGZldGNoIGxhdGVzdCBkYXRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5QWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlJldHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQWN0aW9uKHRvYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRlc3RDYWxsYmFjay5jdXJyZW50Py4oLi4uKGxhdGVzdEFyZ3MuY3VycmVudCB8fCBbXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kYXJ5QWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNvcHkgTG9nc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFjdGlvbih0b2FzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpXzEuQ2xpcGJvYXJkLmNvcHkoZXJyb3I/LnN0YWNrIHx8IGVycm9yPy5tZXNzYWdlIHx8IFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXQoeyBlcnJvciwgaXNMb2FkaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfSk7XG4gICAgfSwgW2xhdGVzdEFib3J0YWJsZSwgbGF0ZXN0T25EYXRhLCBsYXRlc3RPbkVycm9yLCBsYXRlc3RBcmdzLCBmblJlZiwgc2V0LCBsYXRlc3RDYWxsYmFjaywgbGF0ZXN0T25XaWxsRXhlY3V0ZV1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICk7XG4gICAgbGF0ZXN0Q2FsbGJhY2suY3VycmVudCA9IGNhbGxiYWNrO1xuICAgIGNvbnN0IHJldmFsaWRhdGUgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoKCkgPT4ge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soLi4uKGxhdGVzdEFyZ3MuY3VycmVudCB8fCBbXSkpO1xuICAgIH0sIFtjYWxsYmFjaywgbGF0ZXN0QXJnc10pO1xuICAgIGNvbnN0IG11dGF0ZSA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKShhc3luYyAoYXN5bmNVcGRhdGUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgbGV0IGRhdGFCZWZvcmVPcHRpbWlzdGljVXBkYXRlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnM/Lm9wdGltaXN0aWNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnM/LnJvbGxiYWNrT25FcnJvciAhPT0gXCJmdW5jdGlvblwiICYmIG9wdGlvbnM/LnJvbGxiYWNrT25FcnJvciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgZGF0YSBiZWZvcmUgdGhlIG9wdGltaXN0aWMgdXBkYXRlLFxuICAgICAgICAgICAgICAgICAgICAvLyBidXQgb25seSBpZiB3ZSBuZWVkIGl0IChlZy4gb25seSB3aGVuIHdlIHdhbnQgdG8gYXV0b21hdGljYWxseSByb2xsYmFjayBhZnRlcilcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJlZm9yZU9wdGltaXN0aWNVcGRhdGUgPSBzdHJ1Y3R1cmVkQ2xvbmUobGF0ZXN0VmFsdWUuY3VycmVudD8udmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGUgPSBvcHRpb25zLm9wdGltaXN0aWNVcGRhdGU7XG4gICAgICAgICAgICAgICAgc2V0KChwcmV2U3RhdGUpID0+ICh7IC4uLnByZXZTdGF0ZSwgZGF0YTogdXBkYXRlKHByZXZTdGF0ZS5kYXRhKSB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgYXN5bmNVcGRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zPy5yb2xsYmFja09uRXJyb3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IG9wdGlvbnMucm9sbGJhY2tPbkVycm9yO1xuICAgICAgICAgICAgICAgIHNldCgocHJldlN0YXRlKSA9PiAoeyAuLi5wcmV2U3RhdGUsIGRhdGE6IHVwZGF0ZShwcmV2U3RhdGUuZGF0YSkgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAob3B0aW9ucz8ub3B0aW1pc3RpY1VwZGF0ZSAmJiBvcHRpb25zPy5yb2xsYmFja09uRXJyb3IgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc2V0KChwcmV2U3RhdGUpID0+ICh7IC4uLnByZXZTdGF0ZSwgZGF0YTogZGF0YUJlZm9yZU9wdGltaXN0aWNVcGRhdGUgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnM/LnNob3VsZFJldmFsaWRhdGVBZnRlciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXBpXzEuZW52aXJvbm1lbnQubGF1bmNoVHlwZSA9PT0gYXBpXzEuTGF1bmNoVHlwZS5CYWNrZ3JvdW5kIHx8IGFwaV8xLmVudmlyb25tZW50LmNvbW1hbmRNb2RlID09PSBcIm1lbnUtYmFyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBpbiB0aGUgYmFja2dyb3VuZCBvciBpbiBhIG1lbnUgYmFyLCB3ZSBhcmUgZ29pbmcgdG8gYXdhaXQgdGhlIHJldmFsaWRhdGlvblxuICAgICAgICAgICAgICAgICAgICAvLyB0byBtYWtlIHN1cmUgd2UgZ2V0IHRoZSByaWdodCBkYXRhIGF0IHRoZSBlbmQgb2YgdGhlIG11dGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHJldmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBbcmV2YWxpZGF0ZSwgbGF0ZXN0VmFsdWUsIHNldF0pO1xuICAgIC8vIHJldmFsaWRhdGUgd2hlbiB0aGUgYXJncyBjaGFuZ2VcbiAgICAoMCwgcmVhY3RfMS51c2VFZmZlY3QpKCgpID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnM/LmV4ZWN1dGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjYWxsYmFjayguLi4oYXJncyB8fCBbXSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbKDAsIHVzZURlZXBNZW1vXzEudXNlRGVlcE1lbW8pKFthcmdzLCBvcHRpb25zPy5leGVjdXRlLCBjYWxsYmFja10pXSk7XG4gICAgLy8gYWJvcnQgcmVxdWVzdCB3aGVuIHVubW91bnRpbmdcbiAgICAoMCwgcmVhY3RfMS51c2VFZmZlY3QpKCgpID0+IHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGlmIChsYXRlc3RBYm9ydGFibGUuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICAgICAgICAgICAgICBsYXRlc3RBYm9ydGFibGUuY3VycmVudC5jdXJyZW50Py5hYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sIFtsYXRlc3RBYm9ydGFibGVdKTtcbiAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmV2YWxpZGF0ZSwgbXV0YXRlIH07XG59XG5leHBvcnRzLnVzZVByb21pc2UgPSB1c2VQcm9taXNlO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VDYWNoZWRTdGF0ZSA9IHZvaWQgMDtcbmNvbnN0IHJlYWN0XzEgPSByZXF1aXJlKFwicmVhY3RcIik7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCJAcmF5Y2FzdC9hcGlcIik7XG5jb25zdCB1c2VMYXRlc3RfMSA9IHJlcXVpcmUoXCIuL3VzZUxhdGVzdFwiKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5mdW5jdGlvbiByZXBsYWNlcihrZXksIF92YWx1ZSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpc1trZXldO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuIGBfX3JheWNhc3RfY2FjaGVkX2RhdGVfXyR7dmFsdWUudG9TdHJpbmcoKX1gO1xuICAgIH1cbiAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gYF9fcmF5Y2FzdF9jYWNoZWRfYnVmZmVyX18ke3ZhbHVlLnRvU3RyaW5nKFwiYmFzZTY0XCIpfWA7XG4gICAgfVxuICAgIHJldHVybiBfdmFsdWU7XG59XG5mdW5jdGlvbiByZXZpdmVyKF9rZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5zdGFydHNXaXRoKFwiX19yYXljYXN0X2NhY2hlZF9kYXRlX19cIikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlLnJlcGxhY2UoXCJfX3JheWNhc3RfY2FjaGVkX2RhdGVfX1wiLCBcIlwiKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUuc3RhcnRzV2l0aChcIl9fcmF5Y2FzdF9jYWNoZWRfYnVmZmVyX19cIikpIHtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlLnJlcGxhY2UoXCJfX3JheWNhc3RfY2FjaGVkX2J1ZmZlcl9fXCIsIFwiXCIpLCBcImJhc2U2NFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuY29uc3Qgcm9vdENhY2hlID0gU3ltYm9sKFwiY2FjaGUgd2l0aG91dCBuYW1lc3BhY2VcIik7XG5jb25zdCBjYWNoZU1hcCA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIHVzZUNhY2hlZFN0YXRlKGtleSwgaW5pdGlhbFN0YXRlLCBjb25maWcpIHtcbiAgICBjb25zdCBjYWNoZUtleSA9IGNvbmZpZz8uY2FjaGVOYW1lc3BhY2UgfHwgcm9vdENhY2hlO1xuICAgIGNvbnN0IGNhY2hlID0gY2FjaGVNYXAuZ2V0KGNhY2hlS2V5KSB8fCBjYWNoZU1hcC5zZXQoY2FjaGVLZXksIG5ldyBhcGlfMS5DYWNoZSh7IG5hbWVzcGFjZTogY29uZmlnPy5jYWNoZU5hbWVzcGFjZSB9KSkuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoIWNhY2hlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgY2FjaGVcIik7XG4gICAgfVxuICAgIGNvbnN0IGtleVJlZiA9ICgwLCB1c2VMYXRlc3RfMS51c2VMYXRlc3QpKGtleSk7XG4gICAgY29uc3QgaW5pdGlhbFZhbHVlUmVmID0gKDAsIHVzZUxhdGVzdF8xLnVzZUxhdGVzdCkoaW5pdGlhbFN0YXRlKTtcbiAgICBjb25zdCBjYWNoZWRTdGF0ZSA9ICgwLCByZWFjdF8xLnVzZVN5bmNFeHRlcm5hbFN0b3JlKShjYWNoZS5zdWJzY3JpYmUsICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZS5nZXQoa2V5UmVmLmN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBnZXQgQ2FjaGUgZGF0YTpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHN0YXRlID0gKDAsIHJlYWN0XzEudXNlTWVtbykoKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGNhY2hlZFN0YXRlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAoY2FjaGVkU3RhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY2FjaGVkU3RhdGUsIHJldml2ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxWYWx1ZVJlZi5jdXJyZW50O1xuICAgICAgICB9XG4gICAgfSwgW2NhY2hlZFN0YXRlLCBpbml0aWFsVmFsdWVSZWZdKTtcbiAgICBjb25zdCBzdGF0ZVJlZiA9ICgwLCB1c2VMYXRlc3RfMS51c2VMYXRlc3QpKHN0YXRlKTtcbiAgICBjb25zdCBzZXRTdGF0ZUFuZENhY2hlID0gKDAsIHJlYWN0XzEudXNlQ2FsbGJhY2spKCh1cGRhdGVyKSA9PiB7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgc3RydWdnbGVzIHRvIGluZmVyIHRoZSB0eXBlcyBhcyBUIGNvdWxkIHBvdGVudGlhbGx5IGJlIGEgZnVuY3Rpb25cbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB0eXBlb2YgdXBkYXRlciA9PT0gXCJmdW5jdGlvblwiID8gdXBkYXRlcihzdGF0ZVJlZi5jdXJyZW50KSA6IHVwZGF0ZXI7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNhY2hlLnNldChrZXlSZWYuY3VycmVudCwgXCJ1bmRlZmluZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdHJpbmdpZmllZFZhbHVlID0gSlNPTi5zdHJpbmdpZnkobmV3VmFsdWUsIHJlcGxhY2VyKTtcbiAgICAgICAgICAgIGNhY2hlLnNldChrZXlSZWYuY3VycmVudCwgc3RyaW5naWZpZWRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgIH0sIFtjYWNoZSwga2V5UmVmLCBzdGF0ZVJlZl0pO1xuICAgIHJldHVybiBbc3RhdGUsIHNldFN0YXRlQW5kQ2FjaGVdO1xufVxuZXhwb3J0cy51c2VDYWNoZWRTdGF0ZSA9IHVzZUNhY2hlZFN0YXRlO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG4vKipcbiAqIEV4cG9ydGVkIGZ1bmN0aW9uXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgYWxnb3JpdGhtYCBoYXNoIGFsZ28gdG8gYmUgdXNlZCBieSB0aGlzIGluc3RhbmNlOiAqJ3NoYTEnLCAnbWQ1J1xuICogIC0gYGV4Y2x1ZGVWYWx1ZXNgIHt0cnVlfCpmYWxzZX0gaGFzaCBvYmplY3Qga2V5cywgdmFsdWVzIGlnbm9yZWRcbiAqICAtIGBlbmNvZGluZ2AgaGFzaCBlbmNvZGluZywgc3VwcG9ydHMgJ2J1ZmZlcicsICcqaGV4JywgJ2JpbmFyeScsICdiYXNlNjQnXG4gKiAgLSBgaWdub3JlVW5rbm93bmAge3RydWV8KmZhbHNlfSBpZ25vcmUgdW5rbm93biBvYmplY3QgdHlwZXNcbiAqICAtIGByZXBsYWNlcmAgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXBsYWNlcyB2YWx1ZXMgYmVmb3JlIGhhc2hpbmdcbiAqICAtIGByZXNwZWN0RnVuY3Rpb25Qcm9wZXJ0aWVzYCB7KnRydWV8ZmFsc2V9IGNvbnNpZGVyIGZ1bmN0aW9uIHByb3BlcnRpZXMgd2hlbiBoYXNoaW5nXG4gKiAgLSBgcmVzcGVjdEZ1bmN0aW9uTmFtZXNgIHsqdHJ1ZXxmYWxzZX0gY29uc2lkZXIgJ25hbWUnIHByb3BlcnR5IG9mIGZ1bmN0aW9ucyBmb3IgaGFzaGluZ1xuICogIC0gYHJlc3BlY3RUeXBlYCB7KnRydWV8ZmFsc2V9IFJlc3BlY3Qgc3BlY2lhbCBwcm9wZXJ0aWVzIChwcm90b3R5cGUsIGNvbnN0cnVjdG9yKVxuICogICAgd2hlbiBoYXNoaW5nIHRvIGRpc3Rpbmd1aXNoIGJldHdlZW4gdHlwZXNcbiAqICAtIGB1bm9yZGVyZWRBcnJheXNgIHt0cnVlfCpmYWxzZX0gU29ydCBhbGwgYXJyYXlzIGJlZm9yZSBoYXNoaW5nXG4gKiAgLSBgdW5vcmRlcmVkU2V0c2Ageyp0cnVlfGZhbHNlfSBTb3J0IGBTZXRgIGFuZCBgTWFwYCBpbnN0YW5jZXMgYmVmb3JlIGhhc2hpbmdcbiAqICAqID0gZGVmYXVsdFxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3QgdmFsdWUgdG8gaGFzaFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgaGFzaGluZyBvcHRpb25zXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGhhc2ggdmFsdWVcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG9iamVjdEhhc2g7XG5cbmZ1bmN0aW9uIG9iamVjdEhhc2gob2JqZWN0LCBvcHRpb25zKXtcbiAgb3B0aW9ucyA9IGFwcGx5RGVmYXVsdHMob2JqZWN0LCBvcHRpb25zKTtcblxuICByZXR1cm4gaGFzaChvYmplY3QsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEV4cG9ydGVkIHN1Z2FyIG1ldGhvZHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IHZhbHVlIHRvIGhhc2hcbiAqIEByZXR1cm4ge3N0cmluZ30gaGFzaCB2YWx1ZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0cy5zaGExID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgcmV0dXJuIG9iamVjdEhhc2gob2JqZWN0KTtcbn07XG5leHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3Qpe1xuICByZXR1cm4gb2JqZWN0SGFzaChvYmplY3QsIHtleGNsdWRlVmFsdWVzOiB0cnVlLCBhbGdvcml0aG06ICdzaGExJywgZW5jb2Rpbmc6ICdoZXgnfSk7XG59O1xuZXhwb3J0cy5NRDUgPSBmdW5jdGlvbihvYmplY3Qpe1xuICByZXR1cm4gb2JqZWN0SGFzaChvYmplY3QsIHthbGdvcml0aG06ICdtZDUnLCBlbmNvZGluZzogJ2hleCd9KTtcbn07XG5leHBvcnRzLmtleXNNRDUgPSBmdW5jdGlvbihvYmplY3Qpe1xuICByZXR1cm4gb2JqZWN0SGFzaChvYmplY3QsIHthbGdvcml0aG06ICdtZDUnLCBlbmNvZGluZzogJ2hleCcsIGV4Y2x1ZGVWYWx1ZXM6IHRydWV9KTtcbn07XG5cbi8vIEludGVybmFsc1xudmFyIGhhc2hlcyA9IGNyeXB0by5nZXRIYXNoZXMgPyBjcnlwdG8uZ2V0SGFzaGVzKCkuc2xpY2UoKSA6IFsnc2hhMScsICdtZDUnXTtcbmhhc2hlcy5wdXNoKCdwYXNzdGhyb3VnaCcpO1xudmFyIGVuY29kaW5ncyA9IFsnYnVmZmVyJywgJ2hleCcsICdiaW5hcnknLCAnYmFzZTY0J107XG5cbmZ1bmN0aW9uIGFwcGx5RGVmYXVsdHMob2JqZWN0LCBzb3VyY2VPcHRpb25zKXtcbiAgc291cmNlT3B0aW9ucyA9IHNvdXJjZU9wdGlvbnMgfHwge307XG5cbiAgLy8gY3JlYXRlIGEgY29weSByYXRoZXIgdGhhbiBtdXRhdGluZ1xuICB2YXIgb3B0aW9ucyA9IHt9O1xuICBvcHRpb25zLmFsZ29yaXRobSA9IHNvdXJjZU9wdGlvbnMuYWxnb3JpdGhtIHx8ICdzaGExJztcbiAgb3B0aW9ucy5lbmNvZGluZyA9IHNvdXJjZU9wdGlvbnMuZW5jb2RpbmcgfHwgJ2hleCc7XG4gIG9wdGlvbnMuZXhjbHVkZVZhbHVlcyA9IHNvdXJjZU9wdGlvbnMuZXhjbHVkZVZhbHVlcyA/IHRydWUgOiBmYWxzZTtcbiAgb3B0aW9ucy5hbGdvcml0aG0gPSBvcHRpb25zLmFsZ29yaXRobS50b0xvd2VyQ2FzZSgpO1xuICBvcHRpb25zLmVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZy50b0xvd2VyQ2FzZSgpO1xuICBvcHRpb25zLmlnbm9yZVVua25vd24gPSBzb3VyY2VPcHRpb25zLmlnbm9yZVVua25vd24gIT09IHRydWUgPyBmYWxzZSA6IHRydWU7IC8vIGRlZmF1bHQgdG8gZmFsc2VcbiAgb3B0aW9ucy5yZXNwZWN0VHlwZSA9IHNvdXJjZU9wdGlvbnMucmVzcGVjdFR5cGUgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlOyAvLyBkZWZhdWx0IHRvIHRydWVcbiAgb3B0aW9ucy5yZXNwZWN0RnVuY3Rpb25OYW1lcyA9IHNvdXJjZU9wdGlvbnMucmVzcGVjdEZ1bmN0aW9uTmFtZXMgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuICBvcHRpb25zLnJlc3BlY3RGdW5jdGlvblByb3BlcnRpZXMgPSBzb3VyY2VPcHRpb25zLnJlc3BlY3RGdW5jdGlvblByb3BlcnRpZXMgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuICBvcHRpb25zLnVub3JkZXJlZEFycmF5cyA9IHNvdXJjZU9wdGlvbnMudW5vcmRlcmVkQXJyYXlzICE9PSB0cnVlID8gZmFsc2UgOiB0cnVlOyAvLyBkZWZhdWx0IHRvIGZhbHNlXG4gIG9wdGlvbnMudW5vcmRlcmVkU2V0cyA9IHNvdXJjZU9wdGlvbnMudW5vcmRlcmVkU2V0cyA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7IC8vIGRlZmF1bHQgdG8gZmFsc2VcbiAgb3B0aW9ucy51bm9yZGVyZWRPYmplY3RzID0gc291cmNlT3B0aW9ucy51bm9yZGVyZWRPYmplY3RzID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTsgLy8gZGVmYXVsdCB0byB0cnVlXG4gIG9wdGlvbnMucmVwbGFjZXIgPSBzb3VyY2VPcHRpb25zLnJlcGxhY2VyIHx8IHVuZGVmaW5lZDtcbiAgb3B0aW9ucy5leGNsdWRlS2V5cyA9IHNvdXJjZU9wdGlvbnMuZXhjbHVkZUtleXMgfHwgdW5kZWZpbmVkO1xuXG4gIGlmKHR5cGVvZiBvYmplY3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QgYXJndW1lbnQgcmVxdWlyZWQuJyk7XG4gIH1cblxuICAvLyBpZiB0aGVyZSBpcyBhIGNhc2UtaW5zZW5zaXRpdmUgbWF0Y2ggaW4gdGhlIGhhc2hlcyBsaXN0LCBhY2NlcHQgaXRcbiAgLy8gKGkuZS4gU0hBMjU2IGZvciBzaGEyNTYpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaGFzaGVzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGhhc2hlc1tpXS50b0xvd2VyQ2FzZSgpID09PSBvcHRpb25zLmFsZ29yaXRobS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBvcHRpb25zLmFsZ29yaXRobSA9IGhhc2hlc1tpXTtcbiAgICB9XG4gIH1cblxuICBpZihoYXNoZXMuaW5kZXhPZihvcHRpb25zLmFsZ29yaXRobSkgPT09IC0xKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsZ29yaXRobSBcIicgKyBvcHRpb25zLmFsZ29yaXRobSArICdcIiAgbm90IHN1cHBvcnRlZC4gJyArXG4gICAgICAnc3VwcG9ydGVkIHZhbHVlczogJyArIGhhc2hlcy5qb2luKCcsICcpKTtcbiAgfVxuXG4gIGlmKGVuY29kaW5ncy5pbmRleE9mKG9wdGlvbnMuZW5jb2RpbmcpID09PSAtMSAmJlxuICAgICBvcHRpb25zLmFsZ29yaXRobSAhPT0gJ3Bhc3N0aHJvdWdoJyl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbmNvZGluZyBcIicgKyBvcHRpb25zLmVuY29kaW5nICsgJ1wiICBub3Qgc3VwcG9ydGVkLiAnICtcbiAgICAgICdzdXBwb3J0ZWQgdmFsdWVzOiAnICsgZW5jb2RpbmdzLmpvaW4oJywgJykpO1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbi8qKiBDaGVjayBpZiB0aGUgZ2l2ZW4gZnVuY3Rpb24gaXMgYSBuYXRpdmUgZnVuY3Rpb24gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICBpZiAoKHR5cGVvZiBmKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgZXhwID0gL15mdW5jdGlvblxccytcXHcqXFxzKlxcKFxccypcXClcXHMqe1xccytcXFtuYXRpdmUgY29kZVxcXVxccyt9JC9pO1xuICByZXR1cm4gZXhwLmV4ZWMoRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZikpICE9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGhhc2gob2JqZWN0LCBvcHRpb25zKSB7XG4gIHZhciBoYXNoaW5nU3RyZWFtO1xuXG4gIGlmIChvcHRpb25zLmFsZ29yaXRobSAhPT0gJ3Bhc3N0aHJvdWdoJykge1xuICAgIGhhc2hpbmdTdHJlYW0gPSBjcnlwdG8uY3JlYXRlSGFzaChvcHRpb25zLmFsZ29yaXRobSk7XG4gIH0gZWxzZSB7XG4gICAgaGFzaGluZ1N0cmVhbSA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBoYXNoaW5nU3RyZWFtLndyaXRlID09PSAndW5kZWZpbmVkJykge1xuICAgIGhhc2hpbmdTdHJlYW0ud3JpdGUgPSBoYXNoaW5nU3RyZWFtLnVwZGF0ZTtcbiAgICBoYXNoaW5nU3RyZWFtLmVuZCAgID0gaGFzaGluZ1N0cmVhbS51cGRhdGU7XG4gIH1cblxuICB2YXIgaGFzaGVyID0gdHlwZUhhc2hlcihvcHRpb25zLCBoYXNoaW5nU3RyZWFtKTtcbiAgaGFzaGVyLmRpc3BhdGNoKG9iamVjdCk7XG4gIGlmICghaGFzaGluZ1N0cmVhbS51cGRhdGUpIHtcbiAgICBoYXNoaW5nU3RyZWFtLmVuZCgnJyk7XG4gIH1cblxuICBpZiAoaGFzaGluZ1N0cmVhbS5kaWdlc3QpIHtcbiAgICByZXR1cm4gaGFzaGluZ1N0cmVhbS5kaWdlc3Qob3B0aW9ucy5lbmNvZGluZyA9PT0gJ2J1ZmZlcicgPyB1bmRlZmluZWQgOiBvcHRpb25zLmVuY29kaW5nKTtcbiAgfVxuXG4gIHZhciBidWYgPSBoYXNoaW5nU3RyZWFtLnJlYWQoKTtcbiAgaWYgKG9wdGlvbnMuZW5jb2RpbmcgPT09ICdidWZmZXInKSB7XG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiBidWYudG9TdHJpbmcob3B0aW9ucy5lbmNvZGluZyk7XG59XG5cbi8qKlxuICogRXhwb3NlIHN0cmVhbWluZyBBUElcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0ICBWYWx1ZSB0byBzZXJpYWxpemVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zICBPcHRpb25zLCBhcyBmb3IgaGFzaCgpXG4gKiBAcGFyYW0ge29iamVjdH0gc3RyZWFtICBBIHN0cmVhbSB0byB3cml0ZSB0aGUgc2VyaWFsaXppYXRpb24gdG9cbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydHMud3JpdGVUb1N0cmVhbSA9IGZ1bmN0aW9uKG9iamVjdCwgb3B0aW9ucywgc3RyZWFtKSB7XG4gIGlmICh0eXBlb2Ygc3RyZWFtID09PSAndW5kZWZpbmVkJykge1xuICAgIHN0cmVhbSA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgb3B0aW9ucyA9IGFwcGx5RGVmYXVsdHMob2JqZWN0LCBvcHRpb25zKTtcblxuICByZXR1cm4gdHlwZUhhc2hlcihvcHRpb25zLCBzdHJlYW0pLmRpc3BhdGNoKG9iamVjdCk7XG59O1xuXG5mdW5jdGlvbiB0eXBlSGFzaGVyKG9wdGlvbnMsIHdyaXRlVG8sIGNvbnRleHQpe1xuICBjb250ZXh0ID0gY29udGV4dCB8fCBbXTtcbiAgdmFyIHdyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKHdyaXRlVG8udXBkYXRlKSB7XG4gICAgICByZXR1cm4gd3JpdGVUby51cGRhdGUoc3RyLCAndXRmOCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gd3JpdGVUby53cml0ZShzdHIsICd1dGY4Jyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZGlzcGF0Y2g6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmIChvcHRpb25zLnJlcGxhY2VyKSB7XG4gICAgICAgIHZhbHVlID0gb3B0aW9ucy5yZXBsYWNlcih2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHR5cGUgPSAnbnVsbCc7XG4gICAgICB9XG5cbiAgICAgIC8vY29uc29sZS5sb2coXCJbREVCVUddIERpc3BhdGNoOiBcIiwgdmFsdWUsIFwiLT5cIiwgdHlwZSwgXCIgLT4gXCIsIFwiX1wiICsgdHlwZSk7XG5cbiAgICAgIHJldHVybiB0aGlzWydfJyArIHR5cGVdKHZhbHVlKTtcbiAgICB9LFxuICAgIF9vYmplY3Q6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgdmFyIHBhdHRlcm4gPSAoL1xcW29iamVjdCAoLiopXFxdL2kpO1xuICAgICAgdmFyIG9ialN0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpO1xuICAgICAgdmFyIG9ialR5cGUgPSBwYXR0ZXJuLmV4ZWMob2JqU3RyaW5nKTtcbiAgICAgIGlmICghb2JqVHlwZSkgeyAvLyBvYmplY3QgdHlwZSBkaWQgbm90IG1hdGNoIFtvYmplY3QgLi4uXVxuICAgICAgICBvYmpUeXBlID0gJ3Vua25vd246WycgKyBvYmpTdHJpbmcgKyAnXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpUeXBlID0gb2JqVHlwZVsxXTsgLy8gdGFrZSBvbmx5IHRoZSBjbGFzcyBuYW1lXG4gICAgICB9XG5cbiAgICAgIG9ialR5cGUgPSBvYmpUeXBlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIHZhciBvYmplY3ROdW1iZXIgPSBudWxsO1xuXG4gICAgICBpZiAoKG9iamVjdE51bWJlciA9IGNvbnRleHQuaW5kZXhPZihvYmplY3QpKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKCdbQ0lSQ1VMQVI6JyArIG9iamVjdE51bWJlciArICddJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250ZXh0LnB1c2gob2JqZWN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIEJ1ZmZlci5pc0J1ZmZlciAmJiBCdWZmZXIuaXNCdWZmZXIob2JqZWN0KSkge1xuICAgICAgICB3cml0ZSgnYnVmZmVyOicpO1xuICAgICAgICByZXR1cm4gd3JpdGUob2JqZWN0KTtcbiAgICAgIH1cblxuICAgICAgaWYob2JqVHlwZSAhPT0gJ29iamVjdCcgJiYgb2JqVHlwZSAhPT0gJ2Z1bmN0aW9uJyAmJiBvYmpUeXBlICE9PSAnYXN5bmNmdW5jdGlvbicpIHtcbiAgICAgICAgaWYodGhpc1snXycgKyBvYmpUeXBlXSkge1xuICAgICAgICAgIHRoaXNbJ18nICsgb2JqVHlwZV0ob2JqZWN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmlnbm9yZVVua25vd24pIHtcbiAgICAgICAgICByZXR1cm4gd3JpdGUoJ1snICsgb2JqVHlwZSArICddJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG9iamVjdCB0eXBlIFwiJyArIG9ialR5cGUgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfWVsc2V7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICAgICAgaWYgKG9wdGlvbnMudW5vcmRlcmVkT2JqZWN0cykge1xuICAgICAgICAgIGtleXMgPSBrZXlzLnNvcnQoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYWtlIHN1cmUgdG8gaW5jb3Jwb3JhdGUgc3BlY2lhbCBwcm9wZXJ0aWVzLCBzb1xuICAgICAgICAvLyBUeXBlcyB3aXRoIGRpZmZlcmVudCBwcm90b3R5cGVzIHdpbGwgcHJvZHVjZVxuICAgICAgICAvLyBhIGRpZmZlcmVudCBoYXNoIGFuZCBvYmplY3RzIGRlcml2ZWQgZnJvbVxuICAgICAgICAvLyBkaWZmZXJlbnQgZnVuY3Rpb25zIChgbmV3IEZvb2AsIGBuZXcgQmFyYCkgd2lsbFxuICAgICAgICAvLyBwcm9kdWNlIGRpZmZlcmVudCBoYXNoZXMuXG4gICAgICAgIC8vIFdlIG5ldmVyIGRvIHRoaXMgZm9yIG5hdGl2ZSBmdW5jdGlvbnMgc2luY2Ugc29tZVxuICAgICAgICAvLyBzZWVtIHRvIGJyZWFrIGJlY2F1c2Ugb2YgdGhhdC5cbiAgICAgICAgaWYgKG9wdGlvbnMucmVzcGVjdFR5cGUgIT09IGZhbHNlICYmICFpc05hdGl2ZUZ1bmN0aW9uKG9iamVjdCkpIHtcbiAgICAgICAgICBrZXlzLnNwbGljZSgwLCAwLCAncHJvdG90eXBlJywgJ19fcHJvdG9fXycsICdjb25zdHJ1Y3RvcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZXhjbHVkZUtleXMpIHtcbiAgICAgICAgICBrZXlzID0ga2V5cy5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7IHJldHVybiAhb3B0aW9ucy5leGNsdWRlS2V5cyhrZXkpOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdyaXRlKCdvYmplY3Q6JyArIGtleXMubGVuZ3RoICsgJzonKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4ga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgc2VsZi5kaXNwYXRjaChrZXkpO1xuICAgICAgICAgIHdyaXRlKCc6Jyk7XG4gICAgICAgICAgaWYoIW9wdGlvbnMuZXhjbHVkZVZhbHVlcykge1xuICAgICAgICAgICAgc2VsZi5kaXNwYXRjaChvYmplY3Rba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHdyaXRlKCcsJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgX2FycmF5OiBmdW5jdGlvbihhcnIsIHVub3JkZXJlZCl7XG4gICAgICB1bm9yZGVyZWQgPSB0eXBlb2YgdW5vcmRlcmVkICE9PSAndW5kZWZpbmVkJyA/IHVub3JkZXJlZCA6XG4gICAgICAgIG9wdGlvbnMudW5vcmRlcmVkQXJyYXlzICE9PSBmYWxzZTsgLy8gZGVmYXVsdCB0byBvcHRpb25zLnVub3JkZXJlZEFycmF5c1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB3cml0ZSgnYXJyYXk6JyArIGFyci5sZW5ndGggKyAnOicpO1xuICAgICAgaWYgKCF1bm9yZGVyZWQgfHwgYXJyLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybiBhcnIuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICAgIHJldHVybiBzZWxmLmRpc3BhdGNoKGVudHJ5KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHRoZSB1bm9yZGVyZWQgY2FzZSBpcyBhIGxpdHRsZSBtb3JlIGNvbXBsaWNhdGVkOlxuICAgICAgLy8gc2luY2UgdGhlcmUgaXMgbm8gY2Fub25pY2FsIG9yZGVyaW5nIG9uIG9iamVjdHMsXG4gICAgICAvLyBpLmUuIHthOjF9IDwge2E6Mn0gYW5kIHthOjF9ID4ge2E6Mn0gYXJlIGJvdGggZmFsc2UsXG4gICAgICAvLyB3ZSBmaXJzdCBzZXJpYWxpemUgZWFjaCBlbnRyeSB1c2luZyBhIFBhc3NUaHJvdWdoIHN0cmVhbVxuICAgICAgLy8gYmVmb3JlIHNvcnRpbmcuXG4gICAgICAvLyBhbHNvOiB3ZSBjYW5cdTIwMTl0IHVzZSB0aGUgc2FtZSBjb250ZXh0IGFycmF5IGZvciBhbGwgZW50cmllc1xuICAgICAgLy8gc2luY2UgdGhlIG9yZGVyIG9mIGhhc2hpbmcgc2hvdWxkICpub3QqIG1hdHRlci4gaW5zdGVhZCxcbiAgICAgIC8vIHdlIGtlZXAgdHJhY2sgb2YgdGhlIGFkZGl0aW9ucyB0byBhIGNvcHkgb2YgdGhlIGNvbnRleHQgYXJyYXlcbiAgICAgIC8vIGFuZCBhZGQgYWxsIG9mIHRoZW0gdG8gdGhlIGdsb2JhbCBjb250ZXh0IGFycmF5IHdoZW4gd2VcdTIwMTlyZSBkb25lXG4gICAgICB2YXIgY29udGV4dEFkZGl0aW9ucyA9IFtdO1xuICAgICAgdmFyIGVudHJpZXMgPSBhcnIubWFwKGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgIHZhciBzdHJtID0gbmV3IFBhc3NUaHJvdWdoKCk7XG4gICAgICAgIHZhciBsb2NhbENvbnRleHQgPSBjb250ZXh0LnNsaWNlKCk7IC8vIG1ha2UgY29weVxuICAgICAgICB2YXIgaGFzaGVyID0gdHlwZUhhc2hlcihvcHRpb25zLCBzdHJtLCBsb2NhbENvbnRleHQpO1xuICAgICAgICBoYXNoZXIuZGlzcGF0Y2goZW50cnkpO1xuICAgICAgICAvLyB0YWtlIG9ubHkgd2hhdCB3YXMgYWRkZWQgdG8gbG9jYWxDb250ZXh0IGFuZCBhcHBlbmQgaXQgdG8gY29udGV4dEFkZGl0aW9uc1xuICAgICAgICBjb250ZXh0QWRkaXRpb25zID0gY29udGV4dEFkZGl0aW9ucy5jb25jYXQobG9jYWxDb250ZXh0LnNsaWNlKGNvbnRleHQubGVuZ3RoKSk7XG4gICAgICAgIHJldHVybiBzdHJtLnJlYWQoKS50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgICBjb250ZXh0ID0gY29udGV4dC5jb25jYXQoY29udGV4dEFkZGl0aW9ucyk7XG4gICAgICBlbnRyaWVzLnNvcnQoKTtcbiAgICAgIHJldHVybiB0aGlzLl9hcnJheShlbnRyaWVzLCBmYWxzZSk7XG4gICAgfSxcbiAgICBfZGF0ZTogZnVuY3Rpb24oZGF0ZSl7XG4gICAgICByZXR1cm4gd3JpdGUoJ2RhdGU6JyArIGRhdGUudG9KU09OKCkpO1xuICAgIH0sXG4gICAgX3N5bWJvbDogZnVuY3Rpb24oc3ltKXtcbiAgICAgIHJldHVybiB3cml0ZSgnc3ltYm9sOicgKyBzeW0udG9TdHJpbmcoKSk7XG4gICAgfSxcbiAgICBfZXJyb3I6IGZ1bmN0aW9uKGVycil7XG4gICAgICByZXR1cm4gd3JpdGUoJ2Vycm9yOicgKyBlcnIudG9TdHJpbmcoKSk7XG4gICAgfSxcbiAgICBfYm9vbGVhbjogZnVuY3Rpb24oYm9vbCl7XG4gICAgICByZXR1cm4gd3JpdGUoJ2Jvb2w6JyArIGJvb2wudG9TdHJpbmcoKSk7XG4gICAgfSxcbiAgICBfc3RyaW5nOiBmdW5jdGlvbihzdHJpbmcpe1xuICAgICAgd3JpdGUoJ3N0cmluZzonICsgc3RyaW5nLmxlbmd0aCArICc6Jyk7XG4gICAgICB3cml0ZShzdHJpbmcudG9TdHJpbmcoKSk7XG4gICAgfSxcbiAgICBfZnVuY3Rpb246IGZ1bmN0aW9uKGZuKXtcbiAgICAgIHdyaXRlKCdmbjonKTtcbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKGZuKSkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCdbbmF0aXZlXScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaChmbi50b1N0cmluZygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMucmVzcGVjdEZ1bmN0aW9uTmFtZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBjYW4gc3RpbGwgZGlzdGluZ3Vpc2ggbmF0aXZlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBieSB0aGVpciBuYW1lLCBvdGhlcndpc2UgU3RyaW5nIGFuZCBGdW5jdGlvbiB3aWxsXG4gICAgICAgIC8vIGhhdmUgdGhlIHNhbWUgaGFzaFxuICAgICAgICB0aGlzLmRpc3BhdGNoKFwiZnVuY3Rpb24tbmFtZTpcIiArIFN0cmluZyhmbi5uYW1lKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnJlc3BlY3RGdW5jdGlvblByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5fb2JqZWN0KGZuKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9udW1iZXI6IGZ1bmN0aW9uKG51bWJlcil7XG4gICAgICByZXR1cm4gd3JpdGUoJ251bWJlcjonICsgbnVtYmVyLnRvU3RyaW5nKCkpO1xuICAgIH0sXG4gICAgX3htbDogZnVuY3Rpb24oeG1sKXtcbiAgICAgIHJldHVybiB3cml0ZSgneG1sOicgKyB4bWwudG9TdHJpbmcoKSk7XG4gICAgfSxcbiAgICBfbnVsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gd3JpdGUoJ051bGwnKTtcbiAgICB9LFxuICAgIF91bmRlZmluZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHdyaXRlKCdVbmRlZmluZWQnKTtcbiAgICB9LFxuICAgIF9yZWdleHA6IGZ1bmN0aW9uKHJlZ2V4KXtcbiAgICAgIHJldHVybiB3cml0ZSgncmVnZXg6JyArIHJlZ2V4LnRvU3RyaW5nKCkpO1xuICAgIH0sXG4gICAgX3VpbnQ4YXJyYXk6IGZ1bmN0aW9uKGFycil7XG4gICAgICB3cml0ZSgndWludDhhcnJheTonKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycikpO1xuICAgIH0sXG4gICAgX3VpbnQ4Y2xhbXBlZGFycmF5OiBmdW5jdGlvbihhcnIpe1xuICAgICAgd3JpdGUoJ3VpbnQ4Y2xhbXBlZGFycmF5OicpO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKSk7XG4gICAgfSxcbiAgICBfaW50OGFycmF5OiBmdW5jdGlvbihhcnIpe1xuICAgICAgd3JpdGUoJ2ludDhhcnJheTonKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycikpO1xuICAgIH0sXG4gICAgX3VpbnQxNmFycmF5OiBmdW5jdGlvbihhcnIpe1xuICAgICAgd3JpdGUoJ3VpbnQxNmFycmF5OicpO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKSk7XG4gICAgfSxcbiAgICBfaW50MTZhcnJheTogZnVuY3Rpb24oYXJyKXtcbiAgICAgIHdyaXRlKCdpbnQxNmFycmF5OicpO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKSk7XG4gICAgfSxcbiAgICBfdWludDMyYXJyYXk6IGZ1bmN0aW9uKGFycil7XG4gICAgICB3cml0ZSgndWludDMyYXJyYXk6Jyk7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpKTtcbiAgICB9LFxuICAgIF9pbnQzMmFycmF5OiBmdW5jdGlvbihhcnIpe1xuICAgICAgd3JpdGUoJ2ludDMyYXJyYXk6Jyk7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpKTtcbiAgICB9LFxuICAgIF9mbG9hdDMyYXJyYXk6IGZ1bmN0aW9uKGFycil7XG4gICAgICB3cml0ZSgnZmxvYXQzMmFycmF5OicpO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKSk7XG4gICAgfSxcbiAgICBfZmxvYXQ2NGFycmF5OiBmdW5jdGlvbihhcnIpe1xuICAgICAgd3JpdGUoJ2Zsb2F0NjRhcnJheTonKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycikpO1xuICAgIH0sXG4gICAgX2FycmF5YnVmZmVyOiBmdW5jdGlvbihhcnIpe1xuICAgICAgd3JpdGUoJ2FycmF5YnVmZmVyOicpO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2gobmV3IFVpbnQ4QXJyYXkoYXJyKSk7XG4gICAgfSxcbiAgICBfdXJsOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgIHJldHVybiB3cml0ZSgndXJsOicgKyB1cmwudG9TdHJpbmcoKSwgJ3V0ZjgnKTtcbiAgICB9LFxuICAgIF9tYXA6IGZ1bmN0aW9uKG1hcCkge1xuICAgICAgd3JpdGUoJ21hcDonKTtcbiAgICAgIHZhciBhcnIgPSBBcnJheS5mcm9tKG1hcCk7XG4gICAgICByZXR1cm4gdGhpcy5fYXJyYXkoYXJyLCBvcHRpb25zLnVub3JkZXJlZFNldHMgIT09IGZhbHNlKTtcbiAgICB9LFxuICAgIF9zZXQ6IGZ1bmN0aW9uKHNldCkge1xuICAgICAgd3JpdGUoJ3NldDonKTtcbiAgICAgIHZhciBhcnIgPSBBcnJheS5mcm9tKHNldCk7XG4gICAgICByZXR1cm4gdGhpcy5fYXJyYXkoYXJyLCBvcHRpb25zLnVub3JkZXJlZFNldHMgIT09IGZhbHNlKTtcbiAgICB9LFxuICAgIF9maWxlOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICB3cml0ZSgnZmlsZTonKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFtmaWxlLm5hbWUsIGZpbGUuc2l6ZSwgZmlsZS50eXBlLCBmaWxlLmxhc3RNb2RmaWVkXSk7XG4gICAgfSxcbiAgICBfYmxvYjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob3B0aW9ucy5pZ25vcmVVbmtub3duKSB7XG4gICAgICAgIHJldHVybiB3cml0ZSgnW2Jsb2JdJyk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IEVycm9yKCdIYXNoaW5nIEJsb2Igb2JqZWN0cyBpcyBjdXJyZW50bHkgbm90IHN1cHBvcnRlZFxcbicgK1xuICAgICAgICAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vcHVsZW9zL29iamVjdC1oYXNoL2lzc3Vlcy8yNilcXG4nICtcbiAgICAgICAgJ1VzZSBcIm9wdGlvbnMucmVwbGFjZXJcIiBvciBcIm9wdGlvbnMuaWdub3JlVW5rbm93blwiXFxuJyk7XG4gICAgfSxcbiAgICBfZG9td2luZG93OiBmdW5jdGlvbigpIHsgcmV0dXJuIHdyaXRlKCdkb213aW5kb3cnKTsgfSxcbiAgICBfYmlnaW50OiBmdW5jdGlvbihudW1iZXIpe1xuICAgICAgcmV0dXJuIHdyaXRlKCdiaWdpbnQ6JyArIG51bWJlci50b1N0cmluZygpKTtcbiAgICB9LFxuICAgIC8qIE5vZGUuanMgc3RhbmRhcmQgbmF0aXZlIG9iamVjdHMgKi9cbiAgICBfcHJvY2VzczogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgncHJvY2VzcycpOyB9LFxuICAgIF90aW1lcjogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgndGltZXInKTsgfSxcbiAgICBfcGlwZTogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgncGlwZScpOyB9LFxuICAgIF90Y3A6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JpdGUoJ3RjcCcpOyB9LFxuICAgIF91ZHA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JpdGUoJ3VkcCcpOyB9LFxuICAgIF90dHk6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JpdGUoJ3R0eScpOyB9LFxuICAgIF9zdGF0d2F0Y2hlcjogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgnc3RhdHdhdGNoZXInKTsgfSxcbiAgICBfc2VjdXJlY29udGV4dDogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgnc2VjdXJlY29udGV4dCcpOyB9LFxuICAgIF9jb25uZWN0aW9uOiBmdW5jdGlvbigpIHsgcmV0dXJuIHdyaXRlKCdjb25uZWN0aW9uJyk7IH0sXG4gICAgX3psaWI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JpdGUoJ3psaWInKTsgfSxcbiAgICBfY29udGV4dDogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgnY29udGV4dCcpOyB9LFxuICAgIF9ub2Rlc2NyaXB0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHdyaXRlKCdub2Rlc2NyaXB0Jyk7IH0sXG4gICAgX2h0dHBwYXJzZXI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JpdGUoJ2h0dHBwYXJzZXInKTsgfSxcbiAgICBfZGF0YXZpZXc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JpdGUoJ2RhdGF2aWV3Jyk7IH0sXG4gICAgX3NpZ25hbDogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgnc2lnbmFsJyk7IH0sXG4gICAgX2ZzZXZlbnQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JpdGUoJ2ZzZXZlbnQnKTsgfSxcbiAgICBfdGxzd3JhcDogZnVuY3Rpb24oKSB7IHJldHVybiB3cml0ZSgndGxzd3JhcCcpOyB9LFxuICB9O1xufVxuXG4vLyBNaW5pLWltcGxlbWVudGF0aW9uIG9mIHN0cmVhbS5QYXNzVGhyb3VnaFxuLy8gV2UgYXJlIGZhciBmcm9tIGhhdmluZyBuZWVkIGZvciB0aGUgZnVsbCBpbXBsZW1lbnRhdGlvbiwgYW5kIHdlIGNhblxuLy8gbWFrZSBhc3N1bXB0aW9ucyBsaWtlIFwibWFueSB3cml0ZXMsIHRoZW4gb25seSBvbmUgZmluYWwgcmVhZFwiXG4vLyBhbmQgd2UgY2FuIGlnbm9yZSBlbmNvZGluZyBzcGVjaWZpY3NcbmZ1bmN0aW9uIFBhc3NUaHJvdWdoKCkge1xuICByZXR1cm4ge1xuICAgIGJ1ZjogJycsXG5cbiAgICB3cml0ZTogZnVuY3Rpb24oYikge1xuICAgICAgdGhpcy5idWYgKz0gYjtcbiAgICB9LFxuXG4gICAgZW5kOiBmdW5jdGlvbihiKSB7XG4gICAgICB0aGlzLmJ1ZiArPSBiO1xuICAgIH0sXG5cbiAgICByZWFkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmJ1ZjtcbiAgICB9XG4gIH07XG59XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZUNhY2hlZFByb21pc2UgPSB2b2lkIDA7XG5jb25zdCByZWFjdF8xID0gcmVxdWlyZShcInJlYWN0XCIpO1xuY29uc3Qgb2JqZWN0X2hhc2hfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwib2JqZWN0LWhhc2hcIikpO1xuY29uc3QgdXNlQ2FjaGVkU3RhdGVfMSA9IHJlcXVpcmUoXCIuL3VzZUNhY2hlZFN0YXRlXCIpO1xuY29uc3QgdXNlUHJvbWlzZV8xID0gcmVxdWlyZShcIi4vdXNlUHJvbWlzZVwiKTtcbmNvbnN0IHVzZUxhdGVzdF8xID0gcmVxdWlyZShcIi4vdXNlTGF0ZXN0XCIpO1xuLy8gU3ltYm9sIHRvIGRpZmZlcmVudGlhdGUgYW4gZW1wdHkgY2FjaGUgZnJvbSBgdW5kZWZpbmVkYFxuY29uc3QgZW1wdHlDYWNoZSA9IFN5bWJvbCgpO1xuZnVuY3Rpb24gdXNlQ2FjaGVkUHJvbWlzZShmbiwgYXJncywgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgaW5pdGlhbERhdGEsIGtlZXBQcmV2aW91c0RhdGEsIC4uLnVzZVByb21pc2VPcHRpb25zIH0gPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGxhc3RVcGRhdGVGcm9tID0gKDAsIHJlYWN0XzEudXNlUmVmKSgpO1xuICAgIGNvbnN0IFtjYWNoZWREYXRhLCBtdXRhdGVDYWNoZV0gPSAoMCwgdXNlQ2FjaGVkU3RhdGVfMS51c2VDYWNoZWRTdGF0ZSkoKDAsIG9iamVjdF9oYXNoXzEuZGVmYXVsdCkoYXJncyB8fCBbXSksIGVtcHR5Q2FjaGUsIHtcbiAgICAgICAgY2FjaGVOYW1lc3BhY2U6ICgwLCBvYmplY3RfaGFzaF8xLmRlZmF1bHQpKGZuKSxcbiAgICB9KTtcbiAgICAvLyBVc2UgYSByZWYgdG8gc3RvcmUgcHJldmlvdXMgcmV0dXJuZWQgZGF0YS4gVXNlIHRoZSBpbml0YWwgZGF0YSBhcyBpdHMgaW5pdGFsIHZhbHVlIGZyb20gdGhlIGNhY2hlLlxuICAgIGNvbnN0IGxhZ2d5RGF0YVJlZiA9ICgwLCByZWFjdF8xLnVzZVJlZikoY2FjaGVkRGF0YSAhPT0gZW1wdHlDYWNoZSA/IGNhY2hlZERhdGEgOiBpbml0aWFsRGF0YSk7XG4gICAgY29uc3QgeyBtdXRhdGU6IF9tdXRhdGUsIHJldmFsaWRhdGUsIC4uLnN0YXRlXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgfSA9ICgwLCB1c2VQcm9taXNlXzEudXNlUHJvbWlzZSkoZm4sIGFyZ3MgfHwgW10sIHtcbiAgICAgICAgLi4udXNlUHJvbWlzZU9wdGlvbnMsXG4gICAgICAgIG9uRGF0YShkYXRhKSB7XG4gICAgICAgICAgICBpZiAodXNlUHJvbWlzZU9wdGlvbnMub25EYXRhKSB7XG4gICAgICAgICAgICAgICAgdXNlUHJvbWlzZU9wdGlvbnMub25EYXRhKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjYWNoZSB3aGVuIHdlIGZldGNoIG5ldyB2YWx1ZXNcbiAgICAgICAgICAgIGxhc3RVcGRhdGVGcm9tLmN1cnJlbnQgPSBcInByb21pc2VcIjtcbiAgICAgICAgICAgIGxhZ2d5RGF0YVJlZi5jdXJyZW50ID0gZGF0YTtcbiAgICAgICAgICAgIG11dGF0ZUNhY2hlKGRhdGEpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIC8vIGRhdGEgcmV0dXJuZWQgaWYgdGhlcmUgYXJlIG5vIHNwZWNpYWwgY2FzZXNcbiAgICBjb25zdCBkYXRhID0gY2FjaGVkRGF0YSAhPT0gZW1wdHlDYWNoZSA/IGNhY2hlZERhdGEgOiBpbml0aWFsRGF0YTtcbiAgICBjb25zdCByZXR1cm5lZERhdGEgPSBcbiAgICAvLyBpZiB0aGUgbGF0ZXN0IHVwZGF0ZSBpZiBmcm9tIHRoZSBQcm9taXNlLCB3ZSBrZWVwIGl0XG4gICAgbGFzdFVwZGF0ZUZyb20uY3VycmVudCA9PT0gXCJwcm9taXNlXCJcbiAgICAgICAgPyBsYWdneURhdGFSZWYuY3VycmVudFxuICAgICAgICA6IC8vIGlmIHdlIHdhbnQgdG8ga2VlcCB0aGUgbGF0ZXN0IGRhdGEsIHdlIHBpY2sgdGhlIGNhY2hlIGJ1dCBvbmx5IGlmIGl0J3Mgbm90IGVtcHR5XG4gICAgICAgICAgICBrZWVwUHJldmlvdXNEYXRhXG4gICAgICAgICAgICAgICAgPyBjYWNoZWREYXRhICE9PSBlbXB0eUNhY2hlXG4gICAgICAgICAgICAgICAgICAgID8gY2FjaGVkRGF0YVxuICAgICAgICAgICAgICAgICAgICA6IC8vIGlmIHRoZSBjYWNoZSBpcyBlbXB0eSwgd2Ugd2lsbCByZXR1cm4gdGhlIHByZXZpb3VzIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhZ2d5RGF0YVJlZi5jdXJyZW50XG4gICAgICAgICAgICAgICAgOiBkYXRhO1xuICAgIGNvbnN0IGxhdGVzdERhdGEgPSAoMCwgdXNlTGF0ZXN0XzEudXNlTGF0ZXN0KShyZXR1cm5lZERhdGEpO1xuICAgIC8vIHdlIHJld3JpdGUgdGhlIG11dGF0ZSBmdW5jdGlvbiB0byB1cGRhdGUgdGhlIGNhY2hlIGluc3RlYWRcbiAgICBjb25zdCBtdXRhdGUgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoYXN5bmMgKGFzeW5jVXBkYXRlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgIGxldCBkYXRhQmVmb3JlT3B0aW1pc3RpY1VwZGF0ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zPy5vcHRpbWlzdGljVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zPy5yb2xsYmFja09uRXJyb3IgIT09IFwiZnVuY3Rpb25cIiAmJiBvcHRpb25zPy5yb2xsYmFja09uRXJyb3IgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGRhdGEgYmVmb3JlIHRoZSBvcHRpbWlzdGljIHVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IG9ubHkgaWYgd2UgbmVlZCBpdCAoZWcuIG9ubHkgd2hlbiB3ZSB3YW50IHRvIGF1dG9tYXRpY2FsbHkgcm9sbGJhY2sgYWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCZWZvcmVPcHRpbWlzdGljVXBkYXRlID0gc3RydWN0dXJlZENsb25lKGxhdGVzdERhdGEuY3VycmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBvcHRpb25zLm9wdGltaXN0aWNVcGRhdGUobGF0ZXN0RGF0YS5jdXJyZW50KTtcbiAgICAgICAgICAgICAgICBsYXN0VXBkYXRlRnJvbS5jdXJyZW50ID0gXCJjYWNoZVwiO1xuICAgICAgICAgICAgICAgIGxhZ2d5RGF0YVJlZi5jdXJyZW50ID0gZGF0YTtcbiAgICAgICAgICAgICAgICBtdXRhdGVDYWNoZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBfbXV0YXRlKGFzeW5jVXBkYXRlLCB7IHNob3VsZFJldmFsaWRhdGVBZnRlcjogb3B0aW9ucz8uc2hvdWxkUmV2YWxpZGF0ZUFmdGVyIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucz8ucm9sbGJhY2tPbkVycm9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gb3B0aW9ucy5yb2xsYmFja09uRXJyb3IobGF0ZXN0RGF0YS5jdXJyZW50KTtcbiAgICAgICAgICAgICAgICBsYXN0VXBkYXRlRnJvbS5jdXJyZW50ID0gXCJjYWNoZVwiO1xuICAgICAgICAgICAgICAgIGxhZ2d5RGF0YVJlZi5jdXJyZW50ID0gZGF0YTtcbiAgICAgICAgICAgICAgICBtdXRhdGVDYWNoZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnM/Lm9wdGltaXN0aWNVcGRhdGUgJiYgb3B0aW9ucz8ucm9sbGJhY2tPbkVycm9yICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVGcm9tLmN1cnJlbnQgPSBcImNhY2hlXCI7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB3aGVuIHVuZGVmaW5lZCwgaXQncyBleHBlY3RlZFxuICAgICAgICAgICAgICAgIGxhZ2d5RGF0YVJlZi5jdXJyZW50ID0gZGF0YUJlZm9yZU9wdGltaXN0aWNVcGRhdGU7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB3aGVuIHVuZGVmaW5lZCwgaXQncyBleHBlY3RlZFxuICAgICAgICAgICAgICAgIG11dGF0ZUNhY2hlKGRhdGFCZWZvcmVPcHRpbWlzdGljVXBkYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0sIFttdXRhdGVDYWNoZSwgX211dGF0ZSwgbGF0ZXN0RGF0YSwgbGFnZ3lEYXRhUmVmLCBsYXN0VXBkYXRlRnJvbV0pO1xuICAgICgwLCByZWFjdF8xLnVzZUVmZmVjdCkoKCkgPT4ge1xuICAgICAgICBpZiAoY2FjaGVkRGF0YSAhPT0gZW1wdHlDYWNoZSkge1xuICAgICAgICAgICAgbGFzdFVwZGF0ZUZyb20uY3VycmVudCA9IFwiY2FjaGVcIjtcbiAgICAgICAgICAgIGxhZ2d5RGF0YVJlZi5jdXJyZW50ID0gY2FjaGVkRGF0YTtcbiAgICAgICAgfVxuICAgIH0sIFtjYWNoZWREYXRhXSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YTogcmV0dXJuZWREYXRhLFxuICAgICAgICBpc0xvYWRpbmc6IHN0YXRlLmlzTG9hZGluZyxcbiAgICAgICAgZXJyb3I6IHN0YXRlLmVycm9yLFxuICAgICAgICBtdXRhdGUsXG4gICAgICAgIHJldmFsaWRhdGUsXG4gICAgfTtcbn1cbmV4cG9ydHMudXNlQ2FjaGVkUHJvbWlzZSA9IHVzZUNhY2hlZFByb21pc2U7XG4iLCAiLyohXG4gKiBtZWRpYS10eXBlclxuICogQ29weXJpZ2h0KGMpIDIwMTQtMjAxNyBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvblxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogUmVnRXhwIHRvIG1hdGNoIHR5cGUgaW4gUkZDIDY4MzhcbiAqXG4gKiB0eXBlLW5hbWUgPSByZXN0cmljdGVkLW5hbWVcbiAqIHN1YnR5cGUtbmFtZSA9IHJlc3RyaWN0ZWQtbmFtZVxuICogcmVzdHJpY3RlZC1uYW1lID0gcmVzdHJpY3RlZC1uYW1lLWZpcnN0ICoxMjZyZXN0cmljdGVkLW5hbWUtY2hhcnNcbiAqIHJlc3RyaWN0ZWQtbmFtZS1maXJzdCAgPSBBTFBIQSAvIERJR0lUXG4gKiByZXN0cmljdGVkLW5hbWUtY2hhcnMgID0gQUxQSEEgLyBESUdJVCAvIFwiIVwiIC8gXCIjXCIgL1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIFwiJFwiIC8gXCImXCIgLyBcIi1cIiAvIFwiXlwiIC8gXCJfXCJcbiAqIHJlc3RyaWN0ZWQtbmFtZS1jaGFycyA9LyBcIi5cIiA7IENoYXJhY3RlcnMgYmVmb3JlIGZpcnN0IGRvdCBhbHdheXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOyBzcGVjaWZ5IGEgZmFjZXQgbmFtZVxuICogcmVzdHJpY3RlZC1uYW1lLWNoYXJzID0vIFwiK1wiIDsgQ2hhcmFjdGVycyBhZnRlciBsYXN0IHBsdXMgYWx3YXlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDsgc3BlY2lmeSBhIHN0cnVjdHVyZWQgc3ludGF4IHN1ZmZpeFxuICogQUxQSEEgPSAgJXg0MS01QSAvICV4NjEtN0EgICA7IEEtWiAvIGEtelxuICogRElHSVQgPSAgJXgzMC0zOSAgICAgICAgICAgICA7IDAtOVxuICovXG52YXIgU1VCVFlQRV9OQU1FX1JFR0VYUCA9IC9eW0EtWmEtejAtOV1bQS1aYS16MC05ISMkJl5fLi1dezAsMTI2fSQvXG52YXIgVFlQRV9OQU1FX1JFR0VYUCA9IC9eW0EtWmEtejAtOV1bQS1aYS16MC05ISMkJl5fLV17MCwxMjZ9JC9cbnZhciBUWVBFX1JFR0VYUCA9IC9eICooW0EtWmEtejAtOV1bQS1aYS16MC05ISMkJl5fLV17MCwxMjZ9KVxcLyhbQS1aYS16MC05XVtBLVphLXowLTkhIyQmXl8uKy1dezAsMTI2fSkgKiQvXG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXQgPSBmb3JtYXRcbmV4cG9ydHMucGFyc2UgPSBwYXJzZVxuZXhwb3J0cy50ZXN0ID0gdGVzdFxuXG4vKipcbiAqIEZvcm1hdCBvYmplY3QgdG8gbWVkaWEgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0IChvYmopIHtcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBvYmogaXMgcmVxdWlyZWQnKVxuICB9XG5cbiAgdmFyIHN1YnR5cGUgPSBvYmouc3VidHlwZVxuICB2YXIgc3VmZml4ID0gb2JqLnN1ZmZpeFxuICB2YXIgdHlwZSA9IG9iai50eXBlXG5cbiAgaWYgKCF0eXBlIHx8ICFUWVBFX05BTUVfUkVHRVhQLnRlc3QodHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHR5cGUnKVxuICB9XG5cbiAgaWYgKCFzdWJ0eXBlIHx8ICFTVUJUWVBFX05BTUVfUkVHRVhQLnRlc3Qoc3VidHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHN1YnR5cGUnKVxuICB9XG5cbiAgLy8gZm9ybWF0IGFzIHR5cGUvc3VidHlwZVxuICB2YXIgc3RyaW5nID0gdHlwZSArICcvJyArIHN1YnR5cGVcblxuICAvLyBhcHBlbmQgK3N1ZmZpeFxuICBpZiAoc3VmZml4KSB7XG4gICAgaWYgKCFUWVBFX05BTUVfUkVHRVhQLnRlc3Qoc3VmZml4KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWZmaXgnKVxuICAgIH1cblxuICAgIHN0cmluZyArPSAnKycgKyBzdWZmaXhcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdcbn1cblxuLyoqXG4gKiBUZXN0IG1lZGlhIHR5cGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7b2JqZWN0fVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHRlc3QgKHN0cmluZykge1xuICBpZiAoIXN0cmluZykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IHN0cmluZyBpcyByZXF1aXJlZCcpXG4gIH1cblxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzdHJpbmcgaXMgcmVxdWlyZWQgdG8gYmUgYSBzdHJpbmcnKVxuICB9XG5cbiAgcmV0dXJuIFRZUEVfUkVHRVhQLnRlc3Qoc3RyaW5nLnRvTG93ZXJDYXNlKCkpXG59XG5cbi8qKlxuICogUGFyc2UgbWVkaWEgdHlwZSB0byBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7b2JqZWN0fVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHBhcnNlIChzdHJpbmcpIHtcbiAgaWYgKCFzdHJpbmcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzdHJpbmcgaXMgcmVxdWlyZWQnKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc3RyaW5nIGlzIHJlcXVpcmVkIHRvIGJlIGEgc3RyaW5nJylcbiAgfVxuXG4gIHZhciBtYXRjaCA9IFRZUEVfUkVHRVhQLmV4ZWMoc3RyaW5nLnRvTG93ZXJDYXNlKCkpXG5cbiAgaWYgKCFtYXRjaCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgbWVkaWEgdHlwZScpXG4gIH1cblxuICB2YXIgdHlwZSA9IG1hdGNoWzFdXG4gIHZhciBzdWJ0eXBlID0gbWF0Y2hbMl1cbiAgdmFyIHN1ZmZpeFxuXG4gIC8vIHN1ZmZpeCBhZnRlciBsYXN0ICtcbiAgdmFyIGluZGV4ID0gc3VidHlwZS5sYXN0SW5kZXhPZignKycpXG4gIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICBzdWZmaXggPSBzdWJ0eXBlLnN1YnN0cihpbmRleCArIDEpXG4gICAgc3VidHlwZSA9IHN1YnR5cGUuc3Vic3RyKDAsIGluZGV4KVxuICB9XG5cbiAgcmV0dXJuIG5ldyBNZWRpYVR5cGUodHlwZSwgc3VidHlwZSwgc3VmZml4KVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBNZWRpYVR5cGUgb2JqZWN0LlxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIE1lZGlhVHlwZSAodHlwZSwgc3VidHlwZSwgc3VmZml4KSB7XG4gIHRoaXMudHlwZSA9IHR5cGVcbiAgdGhpcy5zdWJ0eXBlID0gc3VidHlwZVxuICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeFxufVxuIiwgIi8qIVxuICogY29udGVudC10eXBlXG4gKiBDb3B5cmlnaHQoYykgMjAxNSBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvblxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogUmVnRXhwIHRvIG1hdGNoICooIFwiO1wiIHBhcmFtZXRlciApIGluIFJGQyA3MjMxIHNlYyAzLjEuMS4xXG4gKlxuICogcGFyYW1ldGVyICAgICA9IHRva2VuIFwiPVwiICggdG9rZW4gLyBxdW90ZWQtc3RyaW5nIClcbiAqIHRva2VuICAgICAgICAgPSAxKnRjaGFyXG4gKiB0Y2hhciAgICAgICAgID0gXCIhXCIgLyBcIiNcIiAvIFwiJFwiIC8gXCIlXCIgLyBcIiZcIiAvIFwiJ1wiIC8gXCIqXCJcbiAqICAgICAgICAgICAgICAgLyBcIitcIiAvIFwiLVwiIC8gXCIuXCIgLyBcIl5cIiAvIFwiX1wiIC8gXCJgXCIgLyBcInxcIiAvIFwiflwiXG4gKiAgICAgICAgICAgICAgIC8gRElHSVQgLyBBTFBIQVxuICogICAgICAgICAgICAgICA7IGFueSBWQ0hBUiwgZXhjZXB0IGRlbGltaXRlcnNcbiAqIHF1b3RlZC1zdHJpbmcgPSBEUVVPVEUgKiggcWR0ZXh0IC8gcXVvdGVkLXBhaXIgKSBEUVVPVEVcbiAqIHFkdGV4dCAgICAgICAgPSBIVEFCIC8gU1AgLyAleDIxIC8gJXgyMy01QiAvICV4NUQtN0UgLyBvYnMtdGV4dFxuICogb2JzLXRleHQgICAgICA9ICV4ODAtRkZcbiAqIHF1b3RlZC1wYWlyICAgPSBcIlxcXCIgKCBIVEFCIC8gU1AgLyBWQ0hBUiAvIG9icy10ZXh0IClcbiAqL1xudmFyIFBBUkFNX1JFR0VYUCA9IC87ICooWyEjJCUmJyorLl5fYHx+MC05QS1aYS16LV0rKSAqPSAqKFwiKD86W1xcdTAwMGJcXHUwMDIwXFx1MDAyMVxcdTAwMjMtXFx1MDA1YlxcdTAwNWQtXFx1MDA3ZVxcdTAwODAtXFx1MDBmZl18XFxcXFtcXHUwMDBiXFx1MDAyMC1cXHUwMGZmXSkqXCJ8WyEjJCUmJyorLl5fYHx+MC05QS1aYS16LV0rKSAqL2dcbnZhciBURVhUX1JFR0VYUCA9IC9eW1xcdTAwMGJcXHUwMDIwLVxcdTAwN2VcXHUwMDgwLVxcdTAwZmZdKyQvXG52YXIgVE9LRU5fUkVHRVhQID0gL15bISMkJSYnKisuXl9gfH4wLTlBLVphLXotXSskL1xuXG4vKipcbiAqIFJlZ0V4cCB0byBtYXRjaCBxdW90ZWQtcGFpciBpbiBSRkMgNzIzMCBzZWMgMy4yLjZcbiAqXG4gKiBxdW90ZWQtcGFpciA9IFwiXFxcIiAoIEhUQUIgLyBTUCAvIFZDSEFSIC8gb2JzLXRleHQgKVxuICogb2JzLXRleHQgICAgPSAleDgwLUZGXG4gKi9cbnZhciBRRVNDX1JFR0VYUCA9IC9cXFxcKFtcXHUwMDBiXFx1MDAyMC1cXHUwMGZmXSkvZ1xuXG4vKipcbiAqIFJlZ0V4cCB0byBtYXRjaCBjaGFycyB0aGF0IG11c3QgYmUgcXVvdGVkLXBhaXIgaW4gUkZDIDcyMzAgc2VjIDMuMi42XG4gKi9cbnZhciBRVU9URV9SRUdFWFAgPSAvKFtcXFxcXCJdKS9nXG5cbi8qKlxuICogUmVnRXhwIHRvIG1hdGNoIHR5cGUgaW4gUkZDIDcyMzEgc2VjIDMuMS4xLjFcbiAqXG4gKiBtZWRpYS10eXBlID0gdHlwZSBcIi9cIiBzdWJ0eXBlXG4gKiB0eXBlICAgICAgID0gdG9rZW5cbiAqIHN1YnR5cGUgICAgPSB0b2tlblxuICovXG52YXIgVFlQRV9SRUdFWFAgPSAvXlshIyQlJicqKy5eX2B8fjAtOUEtWmEtei1dK1xcL1shIyQlJicqKy5eX2B8fjAtOUEtWmEtei1dKyQvXG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5mb3JtYXQgPSBmb3JtYXRcbmV4cG9ydHMucGFyc2UgPSBwYXJzZVxuXG4vKipcbiAqIEZvcm1hdCBvYmplY3QgdG8gbWVkaWEgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0IChvYmopIHtcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBvYmogaXMgcmVxdWlyZWQnKVxuICB9XG5cbiAgdmFyIHBhcmFtZXRlcnMgPSBvYmoucGFyYW1ldGVyc1xuICB2YXIgdHlwZSA9IG9iai50eXBlXG5cbiAgaWYgKCF0eXBlIHx8ICFUWVBFX1JFR0VYUC50ZXN0KHR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCB0eXBlJylcbiAgfVxuXG4gIHZhciBzdHJpbmcgPSB0eXBlXG5cbiAgLy8gYXBwZW5kIHBhcmFtZXRlcnNcbiAgaWYgKHBhcmFtZXRlcnMgJiYgdHlwZW9mIHBhcmFtZXRlcnMgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIHBhcmFtXG4gICAgdmFyIHBhcmFtcyA9IE9iamVjdC5rZXlzKHBhcmFtZXRlcnMpLnNvcnQoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhcmFtID0gcGFyYW1zW2ldXG5cbiAgICAgIGlmICghVE9LRU5fUkVHRVhQLnRlc3QocGFyYW0pKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgcGFyYW1ldGVyIG5hbWUnKVxuICAgICAgfVxuXG4gICAgICBzdHJpbmcgKz0gJzsgJyArIHBhcmFtICsgJz0nICsgcXN0cmluZyhwYXJhbWV0ZXJzW3BhcmFtXSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RyaW5nXG59XG5cbi8qKlxuICogUGFyc2UgbWVkaWEgdHlwZSB0byBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBzdHJpbmdcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZSAoc3RyaW5nKSB7XG4gIGlmICghc3RyaW5nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc3RyaW5nIGlzIHJlcXVpcmVkJylcbiAgfVxuXG4gIC8vIHN1cHBvcnQgcmVxL3Jlcy1saWtlIG9iamVjdHMgYXMgYXJndW1lbnRcbiAgdmFyIGhlYWRlciA9IHR5cGVvZiBzdHJpbmcgPT09ICdvYmplY3QnXG4gICAgPyBnZXRjb250ZW50dHlwZShzdHJpbmcpXG4gICAgOiBzdHJpbmdcblxuICBpZiAodHlwZW9mIGhlYWRlciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzdHJpbmcgaXMgcmVxdWlyZWQgdG8gYmUgYSBzdHJpbmcnKVxuICB9XG5cbiAgdmFyIGluZGV4ID0gaGVhZGVyLmluZGV4T2YoJzsnKVxuICB2YXIgdHlwZSA9IGluZGV4ICE9PSAtMVxuICAgID8gaGVhZGVyLnN1YnN0cigwLCBpbmRleCkudHJpbSgpXG4gICAgOiBoZWFkZXIudHJpbSgpXG5cbiAgaWYgKCFUWVBFX1JFR0VYUC50ZXN0KHR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBtZWRpYSB0eXBlJylcbiAgfVxuXG4gIHZhciBvYmogPSBuZXcgQ29udGVudFR5cGUodHlwZS50b0xvd2VyQ2FzZSgpKVxuXG4gIC8vIHBhcnNlIHBhcmFtZXRlcnNcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIHZhciBrZXlcbiAgICB2YXIgbWF0Y2hcbiAgICB2YXIgdmFsdWVcblxuICAgIFBBUkFNX1JFR0VYUC5sYXN0SW5kZXggPSBpbmRleFxuXG4gICAgd2hpbGUgKChtYXRjaCA9IFBBUkFNX1JFR0VYUC5leGVjKGhlYWRlcikpKSB7XG4gICAgICBpZiAobWF0Y2guaW5kZXggIT09IGluZGV4KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgcGFyYW1ldGVyIGZvcm1hdCcpXG4gICAgICB9XG5cbiAgICAgIGluZGV4ICs9IG1hdGNoWzBdLmxlbmd0aFxuICAgICAga2V5ID0gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKVxuICAgICAgdmFsdWUgPSBtYXRjaFsyXVxuXG4gICAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgICAgLy8gcmVtb3ZlIHF1b3RlcyBhbmQgZXNjYXBlc1xuICAgICAgICB2YWx1ZSA9IHZhbHVlXG4gICAgICAgICAgLnN1YnN0cigxLCB2YWx1ZS5sZW5ndGggLSAyKVxuICAgICAgICAgIC5yZXBsYWNlKFFFU0NfUkVHRVhQLCAnJDEnKVxuICAgICAgfVxuXG4gICAgICBvYmoucGFyYW1ldGVyc1trZXldID0gdmFsdWVcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggIT09IGhlYWRlci5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgcGFyYW1ldGVyIGZvcm1hdCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9ialxufVxuXG4vKipcbiAqIEdldCBjb250ZW50LXR5cGUgZnJvbSByZXEvcmVzIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGdldGNvbnRlbnR0eXBlIChvYmopIHtcbiAgdmFyIGhlYWRlclxuXG4gIGlmICh0eXBlb2Ygb2JqLmdldEhlYWRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIHJlcy1saWtlXG4gICAgaGVhZGVyID0gb2JqLmdldEhlYWRlcignY29udGVudC10eXBlJylcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqLmhlYWRlcnMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gcmVxLWxpa2VcbiAgICBoZWFkZXIgPSBvYmouaGVhZGVycyAmJiBvYmouaGVhZGVyc1snY29udGVudC10eXBlJ11cbiAgfVxuXG4gIGlmICh0eXBlb2YgaGVhZGVyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRlbnQtdHlwZSBoZWFkZXIgaXMgbWlzc2luZyBmcm9tIG9iamVjdCcpXG4gIH1cblxuICByZXR1cm4gaGVhZGVyXG59XG5cbi8qKlxuICogUXVvdGUgYSBzdHJpbmcgaWYgbmVjZXNzYXJ5LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcXN0cmluZyAodmFsKSB7XG4gIHZhciBzdHIgPSBTdHJpbmcodmFsKVxuXG4gIC8vIG5vIG5lZWQgdG8gcXVvdGUgdG9rZW5zXG4gIGlmIChUT0tFTl9SRUdFWFAudGVzdChzdHIpKSB7XG4gICAgcmV0dXJuIHN0clxuICB9XG5cbiAgaWYgKHN0ci5sZW5ndGggPiAwICYmICFURVhUX1JFR0VYUC50ZXN0KHN0cikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHBhcmFtZXRlciB2YWx1ZScpXG4gIH1cblxuICByZXR1cm4gJ1wiJyArIHN0ci5yZXBsYWNlKFFVT1RFX1JFR0VYUCwgJ1xcXFwkMScpICsgJ1wiJ1xufVxuXG4vKipcbiAqIENsYXNzIHRvIHJlcHJlc2VudCBhIGNvbnRlbnQgdHlwZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIENvbnRlbnRUeXBlICh0eXBlKSB7XG4gIHRoaXMucGFyYW1ldGVycyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgdGhpcy50eXBlID0gdHlwZVxufVxuIiwgIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29udmVyc2lvbnMgPSB7fTtcbm1vZHVsZS5leHBvcnRzID0gY29udmVyc2lvbnM7XG5cbmZ1bmN0aW9uIHNpZ24oeCkge1xuICAgIHJldHVybiB4IDwgMCA/IC0xIDogMTtcbn1cblxuZnVuY3Rpb24gZXZlblJvdW5kKHgpIHtcbiAgICAvLyBSb3VuZCB4IHRvIHRoZSBuZWFyZXN0IGludGVnZXIsIGNob29zaW5nIHRoZSBldmVuIGludGVnZXIgaWYgaXQgbGllcyBoYWxmd2F5IGJldHdlZW4gdHdvLlxuICAgIGlmICgoeCAlIDEpID09PSAwLjUgJiYgKHggJiAxKSA9PT0gMCkgeyAvLyBbZXZlbiBudW1iZXJdLjU7IHJvdW5kIGRvd24gKGkuZS4gZmxvb3IpXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTnVtYmVyQ29udmVyc2lvbihiaXRMZW5ndGgsIHR5cGVPcHRzKSB7XG4gICAgaWYgKCF0eXBlT3B0cy51bnNpZ25lZCkge1xuICAgICAgICAtLWJpdExlbmd0aDtcbiAgICB9XG4gICAgY29uc3QgbG93ZXJCb3VuZCA9IHR5cGVPcHRzLnVuc2lnbmVkID8gMCA6IC1NYXRoLnBvdygyLCBiaXRMZW5ndGgpO1xuICAgIGNvbnN0IHVwcGVyQm91bmQgPSBNYXRoLnBvdygyLCBiaXRMZW5ndGgpIC0gMTtcblxuICAgIGNvbnN0IG1vZHVsb1ZhbCA9IHR5cGVPcHRzLm1vZHVsb0JpdExlbmd0aCA/IE1hdGgucG93KDIsIHR5cGVPcHRzLm1vZHVsb0JpdExlbmd0aCkgOiBNYXRoLnBvdygyLCBiaXRMZW5ndGgpO1xuICAgIGNvbnN0IG1vZHVsb0JvdW5kID0gdHlwZU9wdHMubW9kdWxvQml0TGVuZ3RoID8gTWF0aC5wb3coMiwgdHlwZU9wdHMubW9kdWxvQml0TGVuZ3RoIC0gMSkgOiBNYXRoLnBvdygyLCBiaXRMZW5ndGggLSAxKTtcblxuICAgIHJldHVybiBmdW5jdGlvbihWLCBvcHRzKSB7XG4gICAgICAgIGlmICghb3B0cykgb3B0cyA9IHt9O1xuXG4gICAgICAgIGxldCB4ID0gK1Y7XG5cbiAgICAgICAgaWYgKG9wdHMuZW5mb3JjZVJhbmdlKSB7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh4KSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBcmd1bWVudCBpcyBub3QgYSBmaW5pdGUgbnVtYmVyXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4ID0gc2lnbih4KSAqIE1hdGguZmxvb3IoTWF0aC5hYnMoeCkpO1xuICAgICAgICAgICAgaWYgKHggPCBsb3dlckJvdW5kIHx8IHggPiB1cHBlckJvdW5kKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50IGlzIG5vdCBpbiBieXRlIHJhbmdlXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOYU4oeCkgJiYgb3B0cy5jbGFtcCkge1xuICAgICAgICAgICAgeCA9IGV2ZW5Sb3VuZCh4KTtcblxuICAgICAgICAgICAgaWYgKHggPCBsb3dlckJvdW5kKSB4ID0gbG93ZXJCb3VuZDtcbiAgICAgICAgICAgIGlmICh4ID4gdXBwZXJCb3VuZCkgeCA9IHVwcGVyQm91bmQ7XG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHgpIHx8IHggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgeCA9IHNpZ24oeCkgKiBNYXRoLmZsb29yKE1hdGguYWJzKHgpKTtcbiAgICAgICAgeCA9IHggJSBtb2R1bG9WYWw7XG5cbiAgICAgICAgaWYgKCF0eXBlT3B0cy51bnNpZ25lZCAmJiB4ID49IG1vZHVsb0JvdW5kKSB7XG4gICAgICAgICAgICByZXR1cm4geCAtIG1vZHVsb1ZhbDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlT3B0cy51bnNpZ25lZCkge1xuICAgICAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICAgIHggKz0gbW9kdWxvVmFsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh4ID09PSAtMCkgeyAvLyBkb24ndCByZXR1cm4gbmVnYXRpdmUgemVyb1xuICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbn1cblxuY29udmVyc2lvbnNbXCJ2b2lkXCJdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5jb252ZXJzaW9uc1tcImJvb2xlYW5cIl0gPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuICEhdmFsO1xufTtcblxuY29udmVyc2lvbnNbXCJieXRlXCJdID0gY3JlYXRlTnVtYmVyQ29udmVyc2lvbig4LCB7IHVuc2lnbmVkOiBmYWxzZSB9KTtcbmNvbnZlcnNpb25zW1wib2N0ZXRcIl0gPSBjcmVhdGVOdW1iZXJDb252ZXJzaW9uKDgsIHsgdW5zaWduZWQ6IHRydWUgfSk7XG5cbmNvbnZlcnNpb25zW1wic2hvcnRcIl0gPSBjcmVhdGVOdW1iZXJDb252ZXJzaW9uKDE2LCB7IHVuc2lnbmVkOiBmYWxzZSB9KTtcbmNvbnZlcnNpb25zW1widW5zaWduZWQgc2hvcnRcIl0gPSBjcmVhdGVOdW1iZXJDb252ZXJzaW9uKDE2LCB7IHVuc2lnbmVkOiB0cnVlIH0pO1xuXG5jb252ZXJzaW9uc1tcImxvbmdcIl0gPSBjcmVhdGVOdW1iZXJDb252ZXJzaW9uKDMyLCB7IHVuc2lnbmVkOiBmYWxzZSB9KTtcbmNvbnZlcnNpb25zW1widW5zaWduZWQgbG9uZ1wiXSA9IGNyZWF0ZU51bWJlckNvbnZlcnNpb24oMzIsIHsgdW5zaWduZWQ6IHRydWUgfSk7XG5cbmNvbnZlcnNpb25zW1wibG9uZyBsb25nXCJdID0gY3JlYXRlTnVtYmVyQ29udmVyc2lvbigzMiwgeyB1bnNpZ25lZDogZmFsc2UsIG1vZHVsb0JpdExlbmd0aDogNjQgfSk7XG5jb252ZXJzaW9uc1tcInVuc2lnbmVkIGxvbmcgbG9uZ1wiXSA9IGNyZWF0ZU51bWJlckNvbnZlcnNpb24oMzIsIHsgdW5zaWduZWQ6IHRydWUsIG1vZHVsb0JpdExlbmd0aDogNjQgfSk7XG5cbmNvbnZlcnNpb25zW1wiZG91YmxlXCJdID0gZnVuY3Rpb24gKFYpIHtcbiAgICBjb25zdCB4ID0gK1Y7XG5cbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh4KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXJndW1lbnQgaXMgbm90IGEgZmluaXRlIGZsb2F0aW5nLXBvaW50IHZhbHVlXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB4O1xufTtcblxuY29udmVyc2lvbnNbXCJ1bnJlc3RyaWN0ZWQgZG91YmxlXCJdID0gZnVuY3Rpb24gKFYpIHtcbiAgICBjb25zdCB4ID0gK1Y7XG5cbiAgICBpZiAoaXNOYU4oeCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50IGlzIE5hTlwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn07XG5cbi8vIG5vdCBxdWl0ZSB2YWxpZCwgYnV0IGdvb2QgZW5vdWdoIGZvciBKU1xuY29udmVyc2lvbnNbXCJmbG9hdFwiXSA9IGNvbnZlcnNpb25zW1wiZG91YmxlXCJdO1xuY29udmVyc2lvbnNbXCJ1bnJlc3RyaWN0ZWQgZmxvYXRcIl0gPSBjb252ZXJzaW9uc1tcInVucmVzdHJpY3RlZCBkb3VibGVcIl07XG5cbmNvbnZlcnNpb25zW1wiRE9NU3RyaW5nXCJdID0gZnVuY3Rpb24gKFYsIG9wdHMpIHtcbiAgICBpZiAoIW9wdHMpIG9wdHMgPSB7fTtcblxuICAgIGlmIChvcHRzLnRyZWF0TnVsbEFzRW1wdHlTdHJpbmcgJiYgViA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RyaW5nKFYpO1xufTtcblxuY29udmVyc2lvbnNbXCJCeXRlU3RyaW5nXCJdID0gZnVuY3Rpb24gKFYsIG9wdHMpIHtcbiAgICBjb25zdCB4ID0gU3RyaW5nKFYpO1xuICAgIGxldCBjID0gdW5kZWZpbmVkO1xuICAgIGZvciAobGV0IGkgPSAwOyAoYyA9IHguY29kZVBvaW50QXQoaSkpICE9PSB1bmRlZmluZWQ7ICsraSkge1xuICAgICAgICBpZiAoYyA+IDI1NSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50IGlzIG5vdCBhIHZhbGlkIGJ5dGVzdHJpbmdcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn07XG5cbmNvbnZlcnNpb25zW1wiVVNWU3RyaW5nXCJdID0gZnVuY3Rpb24gKFYpIHtcbiAgICBjb25zdCBTID0gU3RyaW5nKFYpO1xuICAgIGNvbnN0IG4gPSBTLmxlbmd0aDtcbiAgICBjb25zdCBVID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgY29uc3QgYyA9IFMuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGMgPCAweEQ4MDAgfHwgYyA+IDB4REZGRikge1xuICAgICAgICAgICAgVS5wdXNoKFN0cmluZy5mcm9tQ29kZVBvaW50KGMpKTtcbiAgICAgICAgfSBlbHNlIGlmICgweERDMDAgPD0gYyAmJiBjIDw9IDB4REZGRikge1xuICAgICAgICAgICAgVS5wdXNoKFN0cmluZy5mcm9tQ29kZVBvaW50KDB4RkZGRCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGkgPT09IG4gLSAxKSB7XG4gICAgICAgICAgICAgICAgVS5wdXNoKFN0cmluZy5mcm9tQ29kZVBvaW50KDB4RkZGRCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gUy5jaGFyQ29kZUF0KGkgKyAxKTtcbiAgICAgICAgICAgICAgICBpZiAoMHhEQzAwIDw9IGQgJiYgZCA8PSAweERGRkYpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9IGMgJiAweDNGRjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYiA9IGQgJiAweDNGRjtcbiAgICAgICAgICAgICAgICAgICAgVS5wdXNoKFN0cmluZy5mcm9tQ29kZVBvaW50KCgyIDw8IDE1KSArICgyIDw8IDkpICogYSArIGIpKTtcbiAgICAgICAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFUucHVzaChTdHJpbmcuZnJvbUNvZGVQb2ludCgweEZGRkQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gVS5qb2luKCcnKTtcbn07XG5cbmNvbnZlcnNpb25zW1wiRGF0ZVwiXSA9IGZ1bmN0aW9uIChWLCBvcHRzKSB7XG4gICAgaWYgKCEoViBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBcmd1bWVudCBpcyBub3QgYSBEYXRlIG9iamVjdFwiKTtcbiAgICB9XG4gICAgaWYgKGlzTmFOKFYpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIFY7XG59O1xuXG5jb252ZXJzaW9uc1tcIlJlZ0V4cFwiXSA9IGZ1bmN0aW9uIChWLCBvcHRzKSB7XG4gICAgaWYgKCEoViBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgViA9IG5ldyBSZWdFeHAoVik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFY7XG59O1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cy5taXhpbiA9IGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXlzW2ldLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5c1tpXSkpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy53cmFwcGVyU3ltYm9sID0gU3ltYm9sKFwid3JhcHBlclwiKTtcbm1vZHVsZS5leHBvcnRzLmltcGxTeW1ib2wgPSBTeW1ib2woXCJpbXBsXCIpO1xuXG5tb2R1bGUuZXhwb3J0cy53cmFwcGVyRm9ySW1wbCA9IGZ1bmN0aW9uIChpbXBsKSB7XG4gIHJldHVybiBpbXBsW21vZHVsZS5leHBvcnRzLndyYXBwZXJTeW1ib2xdO1xufTtcblxubW9kdWxlLmV4cG9ydHMuaW1wbEZvcldyYXBwZXIgPSBmdW5jdGlvbiAod3JhcHBlcikge1xuICByZXR1cm4gd3JhcHBlclttb2R1bGUuZXhwb3J0cy5pbXBsU3ltYm9sXTtcbn07XG5cbiIsICJcInVzZSBzdHJpY3RcIjtcblxudmFyIHB1bnljb2RlID0gcmVxdWlyZShcInB1bnljb2RlXCIpO1xudmFyIG1hcHBpbmdUYWJsZSA9IHJlcXVpcmUoXCIuL2xpYi9tYXBwaW5nVGFibGUuanNvblwiKTtcblxudmFyIFBST0NFU1NJTkdfT1BUSU9OUyA9IHtcbiAgVFJBTlNJVElPTkFMOiAwLFxuICBOT05UUkFOU0lUSU9OQUw6IDFcbn07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShzdHIpIHsgLy8gZml4IGJ1ZyBpbiB2OFxuICByZXR1cm4gc3RyLnNwbGl0KCdcXHUwMDAwJykubWFwKGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLm5vcm1hbGl6ZSgnTkZDJyk7IH0pLmpvaW4oJ1xcdTAwMDAnKTtcbn1cblxuZnVuY3Rpb24gZmluZFN0YXR1cyh2YWwpIHtcbiAgdmFyIHN0YXJ0ID0gMDtcbiAgdmFyIGVuZCA9IG1hcHBpbmdUYWJsZS5sZW5ndGggLSAxO1xuXG4gIHdoaWxlIChzdGFydCA8PSBlbmQpIHtcbiAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigoc3RhcnQgKyBlbmQpIC8gMik7XG5cbiAgICB2YXIgdGFyZ2V0ID0gbWFwcGluZ1RhYmxlW21pZF07XG4gICAgaWYgKHRhcmdldFswXVswXSA8PSB2YWwgJiYgdGFyZ2V0WzBdWzFdID49IHZhbCkge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFswXVswXSA+IHZhbCkge1xuICAgICAgZW5kID0gbWlkIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSBtaWQgKyAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgcmVnZXhBc3RyYWxTeW1ib2xzID0gL1tcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRl0vZztcblxuZnVuY3Rpb24gY291bnRTeW1ib2xzKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nXG4gICAgLy8gcmVwbGFjZSBldmVyeSBzdXJyb2dhdGUgcGFpciB3aXRoIGEgQk1QIHN5bWJvbFxuICAgIC5yZXBsYWNlKHJlZ2V4QXN0cmFsU3ltYm9scywgJ18nKVxuICAgIC8vIHRoZW4gZ2V0IHRoZSBsZW5ndGhcbiAgICAubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBtYXBDaGFycyhkb21haW5fbmFtZSwgdXNlU1REMywgcHJvY2Vzc2luZ19vcHRpb24pIHtcbiAgdmFyIGhhc0Vycm9yID0gZmFsc2U7XG4gIHZhciBwcm9jZXNzZWQgPSBcIlwiO1xuXG4gIHZhciBsZW4gPSBjb3VudFN5bWJvbHMoZG9tYWluX25hbWUpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIGNvZGVQb2ludCA9IGRvbWFpbl9uYW1lLmNvZGVQb2ludEF0KGkpO1xuICAgIHZhciBzdGF0dXMgPSBmaW5kU3RhdHVzKGNvZGVQb2ludCk7XG5cbiAgICBzd2l0Y2ggKHN0YXR1c1sxXSkge1xuICAgICAgY2FzZSBcImRpc2FsbG93ZWRcIjpcbiAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICBwcm9jZXNzZWQgKz0gU3RyaW5nLmZyb21Db2RlUG9pbnQoY29kZVBvaW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaWdub3JlZFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtYXBwZWRcIjpcbiAgICAgICAgcHJvY2Vzc2VkICs9IFN0cmluZy5mcm9tQ29kZVBvaW50LmFwcGx5KFN0cmluZywgc3RhdHVzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGV2aWF0aW9uXCI6XG4gICAgICAgIGlmIChwcm9jZXNzaW5nX29wdGlvbiA9PT0gUFJPQ0VTU0lOR19PUFRJT05TLlRSQU5TSVRJT05BTCkge1xuICAgICAgICAgIHByb2Nlc3NlZCArPSBTdHJpbmcuZnJvbUNvZGVQb2ludC5hcHBseShTdHJpbmcsIHN0YXR1c1syXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvY2Vzc2VkICs9IFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVQb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidmFsaWRcIjpcbiAgICAgICAgcHJvY2Vzc2VkICs9IFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVQb2ludCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRpc2FsbG93ZWRfU1REM19tYXBwZWRcIjpcbiAgICAgICAgaWYgKHVzZVNURDMpIHtcbiAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgcHJvY2Vzc2VkICs9IFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVQb2ludCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvY2Vzc2VkICs9IFN0cmluZy5mcm9tQ29kZVBvaW50LmFwcGx5KFN0cmluZywgc3RhdHVzWzJdKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkaXNhbGxvd2VkX1NURDNfdmFsaWRcIjpcbiAgICAgICAgaWYgKHVzZVNURDMpIHtcbiAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzZWQgKz0gU3RyaW5nLmZyb21Db2RlUG9pbnQoY29kZVBvaW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdHJpbmc6IHByb2Nlc3NlZCxcbiAgICBlcnJvcjogaGFzRXJyb3JcbiAgfTtcbn1cblxudmFyIGNvbWJpbmluZ01hcmtzUmVnZXggPSAvW1xcdTAzMDAtXFx1MDM2RlxcdTA0ODMtXFx1MDQ4OVxcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA2MTAtXFx1MDYxQVxcdTA2NEItXFx1MDY1RlxcdTA2NzBcXHUwNkQ2LVxcdTA2RENcXHUwNkRGLVxcdTA2RTRcXHUwNkU3XFx1MDZFOFxcdTA2RUEtXFx1MDZFRFxcdTA3MTFcXHUwNzMwLVxcdTA3NEFcXHUwN0E2LVxcdTA3QjBcXHUwN0VCLVxcdTA3RjNcXHUwODE2LVxcdTA4MTlcXHUwODFCLVxcdTA4MjNcXHUwODI1LVxcdTA4MjdcXHUwODI5LVxcdTA4MkRcXHUwODU5LVxcdTA4NUJcXHUwOEU0LVxcdTA5MDNcXHUwOTNBLVxcdTA5M0NcXHUwOTNFLVxcdTA5NEZcXHUwOTUxLVxcdTA5NTdcXHUwOTYyXFx1MDk2M1xcdTA5ODEtXFx1MDk4M1xcdTA5QkNcXHUwOUJFLVxcdTA5QzRcXHUwOUM3XFx1MDlDOFxcdTA5Q0ItXFx1MDlDRFxcdTA5RDdcXHUwOUUyXFx1MDlFM1xcdTBBMDEtXFx1MEEwM1xcdTBBM0NcXHUwQTNFLVxcdTBBNDJcXHUwQTQ3XFx1MEE0OFxcdTBBNEItXFx1MEE0RFxcdTBBNTFcXHUwQTcwXFx1MEE3MVxcdTBBNzVcXHUwQTgxLVxcdTBBODNcXHUwQUJDXFx1MEFCRS1cXHUwQUM1XFx1MEFDNy1cXHUwQUM5XFx1MEFDQi1cXHUwQUNEXFx1MEFFMlxcdTBBRTNcXHUwQjAxLVxcdTBCMDNcXHUwQjNDXFx1MEIzRS1cXHUwQjQ0XFx1MEI0N1xcdTBCNDhcXHUwQjRCLVxcdTBCNERcXHUwQjU2XFx1MEI1N1xcdTBCNjJcXHUwQjYzXFx1MEI4MlxcdTBCQkUtXFx1MEJDMlxcdTBCQzYtXFx1MEJDOFxcdTBCQ0EtXFx1MEJDRFxcdTBCRDdcXHUwQzAwLVxcdTBDMDNcXHUwQzNFLVxcdTBDNDRcXHUwQzQ2LVxcdTBDNDhcXHUwQzRBLVxcdTBDNERcXHUwQzU1XFx1MEM1NlxcdTBDNjJcXHUwQzYzXFx1MEM4MS1cXHUwQzgzXFx1MENCQ1xcdTBDQkUtXFx1MENDNFxcdTBDQzYtXFx1MENDOFxcdTBDQ0EtXFx1MENDRFxcdTBDRDVcXHUwQ0Q2XFx1MENFMlxcdTBDRTNcXHUwRDAxLVxcdTBEMDNcXHUwRDNFLVxcdTBENDRcXHUwRDQ2LVxcdTBENDhcXHUwRDRBLVxcdTBENERcXHUwRDU3XFx1MEQ2MlxcdTBENjNcXHUwRDgyXFx1MEQ4M1xcdTBEQ0FcXHUwRENGLVxcdTBERDRcXHUwREQ2XFx1MEREOC1cXHUwRERGXFx1MERGMlxcdTBERjNcXHUwRTMxXFx1MEUzNC1cXHUwRTNBXFx1MEU0Ny1cXHUwRTRFXFx1MEVCMVxcdTBFQjQtXFx1MEVCOVxcdTBFQkJcXHUwRUJDXFx1MEVDOC1cXHUwRUNEXFx1MEYxOFxcdTBGMTlcXHUwRjM1XFx1MEYzN1xcdTBGMzlcXHUwRjNFXFx1MEYzRlxcdTBGNzEtXFx1MEY4NFxcdTBGODZcXHUwRjg3XFx1MEY4RC1cXHUwRjk3XFx1MEY5OS1cXHUwRkJDXFx1MEZDNlxcdTEwMkItXFx1MTAzRVxcdTEwNTYtXFx1MTA1OVxcdTEwNUUtXFx1MTA2MFxcdTEwNjItXFx1MTA2NFxcdTEwNjctXFx1MTA2RFxcdTEwNzEtXFx1MTA3NFxcdTEwODItXFx1MTA4RFxcdTEwOEZcXHUxMDlBLVxcdTEwOURcXHUxMzVELVxcdTEzNUZcXHUxNzEyLVxcdTE3MTRcXHUxNzMyLVxcdTE3MzRcXHUxNzUyXFx1MTc1M1xcdTE3NzJcXHUxNzczXFx1MTdCNC1cXHUxN0QzXFx1MTdERFxcdTE4MEItXFx1MTgwRFxcdTE4QTlcXHUxOTIwLVxcdTE5MkJcXHUxOTMwLVxcdTE5M0JcXHUxOUIwLVxcdTE5QzBcXHUxOUM4XFx1MTlDOVxcdTFBMTctXFx1MUExQlxcdTFBNTUtXFx1MUE1RVxcdTFBNjAtXFx1MUE3Q1xcdTFBN0ZcXHUxQUIwLVxcdTFBQkVcXHUxQjAwLVxcdTFCMDRcXHUxQjM0LVxcdTFCNDRcXHUxQjZCLVxcdTFCNzNcXHUxQjgwLVxcdTFCODJcXHUxQkExLVxcdTFCQURcXHUxQkU2LVxcdTFCRjNcXHUxQzI0LVxcdTFDMzdcXHUxQ0QwLVxcdTFDRDJcXHUxQ0Q0LVxcdTFDRThcXHUxQ0VEXFx1MUNGMi1cXHUxQ0Y0XFx1MUNGOFxcdTFDRjlcXHUxREMwLVxcdTFERjVcXHUxREZDLVxcdTFERkZcXHUyMEQwLVxcdTIwRjBcXHUyQ0VGLVxcdTJDRjFcXHUyRDdGXFx1MkRFMC1cXHUyREZGXFx1MzAyQS1cXHUzMDJGXFx1MzA5OVxcdTMwOUFcXHVBNjZGLVxcdUE2NzJcXHVBNjc0LVxcdUE2N0RcXHVBNjlGXFx1QTZGMFxcdUE2RjFcXHVBODAyXFx1QTgwNlxcdUE4MEJcXHVBODIzLVxcdUE4MjdcXHVBODgwXFx1QTg4MVxcdUE4QjQtXFx1QThDNFxcdUE4RTAtXFx1QThGMVxcdUE5MjYtXFx1QTkyRFxcdUE5NDctXFx1QTk1M1xcdUE5ODAtXFx1QTk4M1xcdUE5QjMtXFx1QTlDMFxcdUE5RTVcXHVBQTI5LVxcdUFBMzZcXHVBQTQzXFx1QUE0Q1xcdUFBNERcXHVBQTdCLVxcdUFBN0RcXHVBQUIwXFx1QUFCMi1cXHVBQUI0XFx1QUFCN1xcdUFBQjhcXHVBQUJFXFx1QUFCRlxcdUFBQzFcXHVBQUVCLVxcdUFBRUZcXHVBQUY1XFx1QUFGNlxcdUFCRTMtXFx1QUJFQVxcdUFCRUNcXHVBQkVEXFx1RkIxRVxcdUZFMDAtXFx1RkUwRlxcdUZFMjAtXFx1RkUyRF18XFx1RDgwMFtcXHVEREZEXFx1REVFMFxcdURGNzYtXFx1REY3QV18XFx1RDgwMltcXHVERTAxLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUwRlxcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERUU1XFx1REVFNl18XFx1RDgwNFtcXHVEQzAwLVxcdURDMDJcXHVEQzM4LVxcdURDNDZcXHVEQzdGLVxcdURDODJcXHVEQ0IwLVxcdURDQkFcXHVERDAwLVxcdUREMDJcXHVERDI3LVxcdUREMzRcXHVERDczXFx1REQ4MC1cXHVERDgyXFx1RERCMy1cXHVEREMwXFx1REUyQy1cXHVERTM3XFx1REVERi1cXHVERUVBXFx1REYwMS1cXHVERjAzXFx1REYzQ1xcdURGM0UtXFx1REY0NFxcdURGNDdcXHVERjQ4XFx1REY0Qi1cXHVERjREXFx1REY1N1xcdURGNjJcXHVERjYzXFx1REY2Ni1cXHVERjZDXFx1REY3MC1cXHVERjc0XXxcXHVEODA1W1xcdURDQjAtXFx1RENDM1xcdUREQUYtXFx1RERCNVxcdUREQjgtXFx1RERDMFxcdURFMzAtXFx1REU0MFxcdURFQUItXFx1REVCN118XFx1RDgxQVtcXHVERUYwLVxcdURFRjRcXHVERjMwLVxcdURGMzZdfFxcdUQ4MUJbXFx1REY1MS1cXHVERjdFXFx1REY4Ri1cXHVERjkyXXxcXHVEODJGW1xcdURDOURcXHVEQzlFXXxcXHVEODM0W1xcdURENjUtXFx1REQ2OVxcdURENkQtXFx1REQ3MlxcdUREN0ItXFx1REQ4MlxcdUREODUtXFx1REQ4QlxcdUREQUEtXFx1RERBRFxcdURFNDItXFx1REU0NF18XFx1RDgzQVtcXHVEQ0QwLVxcdURDRDZdfFxcdURCNDBbXFx1REQwMC1cXHVEREVGXS87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGFiZWwobGFiZWwsIHByb2Nlc3Npbmdfb3B0aW9uKSB7XG4gIGlmIChsYWJlbC5zdWJzdHIoMCwgNCkgPT09IFwieG4tLVwiKSB7XG4gICAgbGFiZWwgPSBwdW55Y29kZS50b1VuaWNvZGUobGFiZWwpO1xuICAgIHByb2Nlc3Npbmdfb3B0aW9uID0gUFJPQ0VTU0lOR19PUFRJT05TLk5PTlRSQU5TSVRJT05BTDtcbiAgfVxuXG4gIHZhciBlcnJvciA9IGZhbHNlO1xuXG4gIGlmIChub3JtYWxpemUobGFiZWwpICE9PSBsYWJlbCB8fFxuICAgICAgKGxhYmVsWzNdID09PSBcIi1cIiAmJiBsYWJlbFs0XSA9PT0gXCItXCIpIHx8XG4gICAgICBsYWJlbFswXSA9PT0gXCItXCIgfHwgbGFiZWxbbGFiZWwubGVuZ3RoIC0gMV0gPT09IFwiLVwiIHx8XG4gICAgICBsYWJlbC5pbmRleE9mKFwiLlwiKSAhPT0gLTEgfHxcbiAgICAgIGxhYmVsLnNlYXJjaChjb21iaW5pbmdNYXJrc1JlZ2V4KSA9PT0gMCkge1xuICAgIGVycm9yID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBsZW4gPSBjb3VudFN5bWJvbHMobGFiZWwpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHN0YXR1cyA9IGZpbmRTdGF0dXMobGFiZWwuY29kZVBvaW50QXQoaSkpO1xuICAgIGlmICgocHJvY2Vzc2luZyA9PT0gUFJPQ0VTU0lOR19PUFRJT05TLlRSQU5TSVRJT05BTCAmJiBzdGF0dXNbMV0gIT09IFwidmFsaWRcIikgfHxcbiAgICAgICAgKHByb2Nlc3NpbmcgPT09IFBST0NFU1NJTkdfT1BUSU9OUy5OT05UUkFOU0lUSU9OQUwgJiZcbiAgICAgICAgIHN0YXR1c1sxXSAhPT0gXCJ2YWxpZFwiICYmIHN0YXR1c1sxXSAhPT0gXCJkZXZpYXRpb25cIikpIHtcbiAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGVycm9yOiBlcnJvclxuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzaW5nKGRvbWFpbl9uYW1lLCB1c2VTVEQzLCBwcm9jZXNzaW5nX29wdGlvbikge1xuICB2YXIgcmVzdWx0ID0gbWFwQ2hhcnMoZG9tYWluX25hbWUsIHVzZVNURDMsIHByb2Nlc3Npbmdfb3B0aW9uKTtcbiAgcmVzdWx0LnN0cmluZyA9IG5vcm1hbGl6ZShyZXN1bHQuc3RyaW5nKTtcblxuICB2YXIgbGFiZWxzID0gcmVzdWx0LnN0cmluZy5zcGxpdChcIi5cIik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGFiZWxzLmxlbmd0aDsgKytpKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB2YWxpZGF0aW9uID0gdmFsaWRhdGVMYWJlbChsYWJlbHNbaV0pO1xuICAgICAgbGFiZWxzW2ldID0gdmFsaWRhdGlvbi5sYWJlbDtcbiAgICAgIHJlc3VsdC5lcnJvciA9IHJlc3VsdC5lcnJvciB8fCB2YWxpZGF0aW9uLmVycm9yO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmVzdWx0LmVycm9yID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0cmluZzogbGFiZWxzLmpvaW4oXCIuXCIpLFxuICAgIGVycm9yOiByZXN1bHQuZXJyb3JcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMudG9BU0NJSSA9IGZ1bmN0aW9uKGRvbWFpbl9uYW1lLCB1c2VTVEQzLCBwcm9jZXNzaW5nX29wdGlvbiwgdmVyaWZ5RG5zTGVuZ3RoKSB7XG4gIHZhciByZXN1bHQgPSBwcm9jZXNzaW5nKGRvbWFpbl9uYW1lLCB1c2VTVEQzLCBwcm9jZXNzaW5nX29wdGlvbik7XG4gIHZhciBsYWJlbHMgPSByZXN1bHQuc3RyaW5nLnNwbGl0KFwiLlwiKTtcbiAgbGFiZWxzID0gbGFiZWxzLm1hcChmdW5jdGlvbihsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBwdW55Y29kZS50b0FTQ0lJKGwpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmVzdWx0LmVycm9yID0gdHJ1ZTtcbiAgICAgIHJldHVybiBsO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHZlcmlmeURuc0xlbmd0aCkge1xuICAgIHZhciB0b3RhbCA9IGxhYmVscy5zbGljZSgwLCBsYWJlbHMubGVuZ3RoIC0gMSkuam9pbihcIi5cIikubGVuZ3RoO1xuICAgIGlmICh0b3RhbC5sZW5ndGggPiAyNTMgfHwgdG90YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXN1bHQuZXJyb3IgPSB0cnVlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGk9MDsgaSA8IGxhYmVscy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGxhYmVscy5sZW5ndGggPiA2MyB8fCBsYWJlbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJlc3VsdC5lcnJvciA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChyZXN1bHQuZXJyb3IpIHJldHVybiBudWxsO1xuICByZXR1cm4gbGFiZWxzLmpvaW4oXCIuXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMudG9Vbmljb2RlID0gZnVuY3Rpb24oZG9tYWluX25hbWUsIHVzZVNURDMpIHtcbiAgdmFyIHJlc3VsdCA9IHByb2Nlc3NpbmcoZG9tYWluX25hbWUsIHVzZVNURDMsIFBST0NFU1NJTkdfT1BUSU9OUy5OT05UUkFOU0lUSU9OQUwpO1xuXG4gIHJldHVybiB7XG4gICAgZG9tYWluOiByZXN1bHQuc3RyaW5nLFxuICAgIGVycm9yOiByZXN1bHQuZXJyb3JcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLlBST0NFU1NJTkdfT1BUSU9OUyA9IFBST0NFU1NJTkdfT1BUSU9OUztcbiIsICJcInVzZSBzdHJpY3RcIjtcclxuY29uc3QgcHVueWNvZGUgPSByZXF1aXJlKFwicHVueWNvZGVcIik7XHJcbmNvbnN0IHRyNDYgPSByZXF1aXJlKFwidHI0NlwiKTtcclxuXHJcbmNvbnN0IHNwZWNpYWxTY2hlbWVzID0ge1xyXG4gIGZ0cDogMjEsXHJcbiAgZmlsZTogbnVsbCxcclxuICBnb3BoZXI6IDcwLFxyXG4gIGh0dHA6IDgwLFxyXG4gIGh0dHBzOiA0NDMsXHJcbiAgd3M6IDgwLFxyXG4gIHdzczogNDQzXHJcbn07XHJcblxyXG5jb25zdCBmYWlsdXJlID0gU3ltYm9sKFwiZmFpbHVyZVwiKTtcclxuXHJcbmZ1bmN0aW9uIGNvdW50U3ltYm9scyhzdHIpIHtcclxuICByZXR1cm4gcHVueWNvZGUudWNzMi5kZWNvZGUoc3RyKS5sZW5ndGg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF0KGlucHV0LCBpZHgpIHtcclxuICBjb25zdCBjID0gaW5wdXRbaWR4XTtcclxuICByZXR1cm4gaXNOYU4oYykgPyB1bmRlZmluZWQgOiBTdHJpbmcuZnJvbUNvZGVQb2ludChjKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBU0NJSURpZ2l0KGMpIHtcclxuICByZXR1cm4gYyA+PSAweDMwICYmIGMgPD0gMHgzOTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBU0NJSUFscGhhKGMpIHtcclxuICByZXR1cm4gKGMgPj0gMHg0MSAmJiBjIDw9IDB4NUEpIHx8IChjID49IDB4NjEgJiYgYyA8PSAweDdBKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBU0NJSUFscGhhbnVtZXJpYyhjKSB7XHJcbiAgcmV0dXJuIGlzQVNDSUlBbHBoYShjKSB8fCBpc0FTQ0lJRGlnaXQoYyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQVNDSUlIZXgoYykge1xyXG4gIHJldHVybiBpc0FTQ0lJRGlnaXQoYykgfHwgKGMgPj0gMHg0MSAmJiBjIDw9IDB4NDYpIHx8IChjID49IDB4NjEgJiYgYyA8PSAweDY2KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTaW5nbGVEb3QoYnVmZmVyKSB7XHJcbiAgcmV0dXJuIGJ1ZmZlciA9PT0gXCIuXCIgfHwgYnVmZmVyLnRvTG93ZXJDYXNlKCkgPT09IFwiJTJlXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRG91YmxlRG90KGJ1ZmZlcikge1xyXG4gIGJ1ZmZlciA9IGJ1ZmZlci50b0xvd2VyQ2FzZSgpO1xyXG4gIHJldHVybiBidWZmZXIgPT09IFwiLi5cIiB8fCBidWZmZXIgPT09IFwiJTJlLlwiIHx8IGJ1ZmZlciA9PT0gXCIuJTJlXCIgfHwgYnVmZmVyID09PSBcIiUyZSUyZVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1dpbmRvd3NEcml2ZUxldHRlckNvZGVQb2ludHMoY3AxLCBjcDIpIHtcclxuICByZXR1cm4gaXNBU0NJSUFscGhhKGNwMSkgJiYgKGNwMiA9PT0gNTggfHwgY3AyID09PSAxMjQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1dpbmRvd3NEcml2ZUxldHRlclN0cmluZyhzdHJpbmcpIHtcclxuICByZXR1cm4gc3RyaW5nLmxlbmd0aCA9PT0gMiAmJiBpc0FTQ0lJQWxwaGEoc3RyaW5nLmNvZGVQb2ludEF0KDApKSAmJiAoc3RyaW5nWzFdID09PSBcIjpcIiB8fCBzdHJpbmdbMV0gPT09IFwifFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNOb3JtYWxpemVkV2luZG93c0RyaXZlTGV0dGVyU3RyaW5nKHN0cmluZykge1xyXG4gIHJldHVybiBzdHJpbmcubGVuZ3RoID09PSAyICYmIGlzQVNDSUlBbHBoYShzdHJpbmcuY29kZVBvaW50QXQoMCkpICYmIHN0cmluZ1sxXSA9PT0gXCI6XCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnRhaW5zRm9yYmlkZGVuSG9zdENvZGVQb2ludChzdHJpbmcpIHtcclxuICByZXR1cm4gc3RyaW5nLnNlYXJjaCgvXFx1MDAwMHxcXHUwMDA5fFxcdTAwMEF8XFx1MDAwRHxcXHUwMDIwfCN8JXxcXC98OnxcXD98QHxcXFt8XFxcXHxcXF0vKSAhPT0gLTE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnRhaW5zRm9yYmlkZGVuSG9zdENvZGVQb2ludEV4Y2x1ZGluZ1BlcmNlbnQoc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHN0cmluZy5zZWFyY2goL1xcdTAwMDB8XFx1MDAwOXxcXHUwMDBBfFxcdTAwMER8XFx1MDAyMHwjfFxcL3w6fFxcP3xAfFxcW3xcXFxcfFxcXS8pICE9PSAtMTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTcGVjaWFsU2NoZW1lKHNjaGVtZSkge1xyXG4gIHJldHVybiBzcGVjaWFsU2NoZW1lc1tzY2hlbWVdICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3BlY2lhbCh1cmwpIHtcclxuICByZXR1cm4gaXNTcGVjaWFsU2NoZW1lKHVybC5zY2hlbWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0UG9ydChzY2hlbWUpIHtcclxuICByZXR1cm4gc3BlY2lhbFNjaGVtZXNbc2NoZW1lXTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGVyY2VudEVuY29kZShjKSB7XHJcbiAgbGV0IGhleCA9IGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XHJcbiAgaWYgKGhleC5sZW5ndGggPT09IDEpIHtcclxuICAgIGhleCA9IFwiMFwiICsgaGV4O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFwiJVwiICsgaGV4O1xyXG59XHJcblxyXG5mdW5jdGlvbiB1dGY4UGVyY2VudEVuY29kZShjKSB7XHJcbiAgY29uc3QgYnVmID0gbmV3IEJ1ZmZlcihjKTtcclxuXHJcbiAgbGV0IHN0ciA9IFwiXCI7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgKytpKSB7XHJcbiAgICBzdHIgKz0gcGVyY2VudEVuY29kZShidWZbaV0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuZnVuY3Rpb24gdXRmOFBlcmNlbnREZWNvZGUoc3RyKSB7XHJcbiAgY29uc3QgaW5wdXQgPSBuZXcgQnVmZmVyKHN0cik7XHJcbiAgY29uc3Qgb3V0cHV0ID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7ICsraSkge1xyXG4gICAgaWYgKGlucHV0W2ldICE9PSAzNykge1xyXG4gICAgICBvdXRwdXQucHVzaChpbnB1dFtpXSk7XHJcbiAgICB9IGVsc2UgaWYgKGlucHV0W2ldID09PSAzNyAmJiBpc0FTQ0lJSGV4KGlucHV0W2kgKyAxXSkgJiYgaXNBU0NJSUhleChpbnB1dFtpICsgMl0pKSB7XHJcbiAgICAgIG91dHB1dC5wdXNoKHBhcnNlSW50KGlucHV0LnNsaWNlKGkgKyAxLCBpICsgMykudG9TdHJpbmcoKSwgMTYpKTtcclxuICAgICAgaSArPSAyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0cHV0LnB1c2goaW5wdXRbaV0pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbmV3IEJ1ZmZlcihvdXRwdXQpLnRvU3RyaW5nKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQzBDb250cm9sUGVyY2VudEVuY29kZShjKSB7XHJcbiAgcmV0dXJuIGMgPD0gMHgxRiB8fCBjID4gMHg3RTtcclxufVxyXG5cclxuY29uc3QgZXh0cmFQYXRoUGVyY2VudEVuY29kZVNldCA9IG5ldyBTZXQoWzMyLCAzNCwgMzUsIDYwLCA2MiwgNjMsIDk2LCAxMjMsIDEyNV0pO1xyXG5mdW5jdGlvbiBpc1BhdGhQZXJjZW50RW5jb2RlKGMpIHtcclxuICByZXR1cm4gaXNDMENvbnRyb2xQZXJjZW50RW5jb2RlKGMpIHx8IGV4dHJhUGF0aFBlcmNlbnRFbmNvZGVTZXQuaGFzKGMpO1xyXG59XHJcblxyXG5jb25zdCBleHRyYVVzZXJpbmZvUGVyY2VudEVuY29kZVNldCA9XHJcbiAgbmV3IFNldChbNDcsIDU4LCA1OSwgNjEsIDY0LCA5MSwgOTIsIDkzLCA5NCwgMTI0XSk7XHJcbmZ1bmN0aW9uIGlzVXNlcmluZm9QZXJjZW50RW5jb2RlKGMpIHtcclxuICByZXR1cm4gaXNQYXRoUGVyY2VudEVuY29kZShjKSB8fCBleHRyYVVzZXJpbmZvUGVyY2VudEVuY29kZVNldC5oYXMoYyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBlcmNlbnRFbmNvZGVDaGFyKGMsIGVuY29kZVNldFByZWRpY2F0ZSkge1xyXG4gIGNvbnN0IGNTdHIgPSBTdHJpbmcuZnJvbUNvZGVQb2ludChjKTtcclxuXHJcbiAgaWYgKGVuY29kZVNldFByZWRpY2F0ZShjKSkge1xyXG4gICAgcmV0dXJuIHV0ZjhQZXJjZW50RW5jb2RlKGNTdHIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNTdHI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSVB2NE51bWJlcihpbnB1dCkge1xyXG4gIGxldCBSID0gMTA7XHJcblxyXG4gIGlmIChpbnB1dC5sZW5ndGggPj0gMiAmJiBpbnB1dC5jaGFyQXQoMCkgPT09IFwiMFwiICYmIGlucHV0LmNoYXJBdCgxKS50b0xvd2VyQ2FzZSgpID09PSBcInhcIikge1xyXG4gICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMik7XHJcbiAgICBSID0gMTY7XHJcbiAgfSBlbHNlIGlmIChpbnB1dC5sZW5ndGggPj0gMiAmJiBpbnB1dC5jaGFyQXQoMCkgPT09IFwiMFwiKSB7XHJcbiAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygxKTtcclxuICAgIFIgPSA4O1xyXG4gIH1cclxuXHJcbiAgaWYgKGlucHV0ID09PSBcIlwiKSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcblxyXG4gIGNvbnN0IHJlZ2V4ID0gUiA9PT0gMTAgPyAvW14wLTldLyA6IChSID09PSAxNiA/IC9bXjAtOUEtRmEtZl0vIDogL1teMC03XS8pO1xyXG4gIGlmIChyZWdleC50ZXN0KGlucHV0KSkge1xyXG4gICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcGFyc2VJbnQoaW5wdXQsIFIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUlQdjQoaW5wdXQpIHtcclxuICBjb25zdCBwYXJ0cyA9IGlucHV0LnNwbGl0KFwiLlwiKTtcclxuICBpZiAocGFydHNbcGFydHMubGVuZ3RoIC0gMV0gPT09IFwiXCIpIHtcclxuICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIHBhcnRzLnBvcCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDQpIHtcclxuICAgIHJldHVybiBpbnB1dDtcclxuICB9XHJcblxyXG4gIGNvbnN0IG51bWJlcnMgPSBbXTtcclxuICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcclxuICAgIGlmIChwYXJ0ID09PSBcIlwiKSB7XHJcbiAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxuICAgIGNvbnN0IG4gPSBwYXJzZUlQdjROdW1iZXIocGFydCk7XHJcbiAgICBpZiAobiA9PT0gZmFpbHVyZSkge1xyXG4gICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgbnVtYmVycy5wdXNoKG4pO1xyXG4gIH1cclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJzLmxlbmd0aCAtIDE7ICsraSkge1xyXG4gICAgaWYgKG51bWJlcnNbaV0gPiAyNTUpIHtcclxuICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChudW1iZXJzW251bWJlcnMubGVuZ3RoIC0gMV0gPj0gTWF0aC5wb3coMjU2LCA1IC0gbnVtYmVycy5sZW5ndGgpKSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZTtcclxuICB9XHJcblxyXG4gIGxldCBpcHY0ID0gbnVtYmVycy5wb3AoKTtcclxuICBsZXQgY291bnRlciA9IDA7XHJcblxyXG4gIGZvciAoY29uc3QgbiBvZiBudW1iZXJzKSB7XHJcbiAgICBpcHY0ICs9IG4gKiBNYXRoLnBvdygyNTYsIDMgLSBjb3VudGVyKTtcclxuICAgICsrY291bnRlcjtcclxuICB9XHJcblxyXG4gIHJldHVybiBpcHY0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXJpYWxpemVJUHY0KGFkZHJlc3MpIHtcclxuICBsZXQgb3V0cHV0ID0gXCJcIjtcclxuICBsZXQgbiA9IGFkZHJlc3M7XHJcblxyXG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDQ7ICsraSkge1xyXG4gICAgb3V0cHV0ID0gU3RyaW5nKG4gJSAyNTYpICsgb3V0cHV0O1xyXG4gICAgaWYgKGkgIT09IDQpIHtcclxuICAgICAgb3V0cHV0ID0gXCIuXCIgKyBvdXRwdXQ7XHJcbiAgICB9XHJcbiAgICBuID0gTWF0aC5mbG9vcihuIC8gMjU2KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSVB2NihpbnB1dCkge1xyXG4gIGNvbnN0IGFkZHJlc3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XHJcbiAgbGV0IHBpZWNlSW5kZXggPSAwO1xyXG4gIGxldCBjb21wcmVzcyA9IG51bGw7XHJcbiAgbGV0IHBvaW50ZXIgPSAwO1xyXG5cclxuICBpbnB1dCA9IHB1bnljb2RlLnVjczIuZGVjb2RlKGlucHV0KTtcclxuXHJcbiAgaWYgKGlucHV0W3BvaW50ZXJdID09PSA1OCkge1xyXG4gICAgaWYgKGlucHV0W3BvaW50ZXIgKyAxXSAhPT0gNTgpIHtcclxuICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgcG9pbnRlciArPSAyO1xyXG4gICAgKytwaWVjZUluZGV4O1xyXG4gICAgY29tcHJlc3MgPSBwaWVjZUluZGV4O1xyXG4gIH1cclxuXHJcbiAgd2hpbGUgKHBvaW50ZXIgPCBpbnB1dC5sZW5ndGgpIHtcclxuICAgIGlmIChwaWVjZUluZGV4ID09PSA4KSB7XHJcbiAgICAgIHJldHVybiBmYWlsdXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnB1dFtwb2ludGVyXSA9PT0gNTgpIHtcclxuICAgICAgaWYgKGNvbXByZXNzICE9PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICAgIH1cclxuICAgICAgKytwb2ludGVyO1xyXG4gICAgICArK3BpZWNlSW5kZXg7XHJcbiAgICAgIGNvbXByZXNzID0gcGllY2VJbmRleDtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHZhbHVlID0gMDtcclxuICAgIGxldCBsZW5ndGggPSAwO1xyXG5cclxuICAgIHdoaWxlIChsZW5ndGggPCA0ICYmIGlzQVNDSUlIZXgoaW5wdXRbcG9pbnRlcl0pKSB7XHJcbiAgICAgIHZhbHVlID0gdmFsdWUgKiAweDEwICsgcGFyc2VJbnQoYXQoaW5wdXQsIHBvaW50ZXIpLCAxNik7XHJcbiAgICAgICsrcG9pbnRlcjtcclxuICAgICAgKytsZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlucHV0W3BvaW50ZXJdID09PSA0Nikge1xyXG4gICAgICBpZiAobGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBvaW50ZXIgLT0gbGVuZ3RoO1xyXG5cclxuICAgICAgaWYgKHBpZWNlSW5kZXggPiA2KSB7XHJcbiAgICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBudW1iZXJzU2VlbiA9IDA7XHJcblxyXG4gICAgICB3aGlsZSAoaW5wdXRbcG9pbnRlcl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxldCBpcHY0UGllY2UgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAobnVtYmVyc1NlZW4gPiAwKSB7XHJcbiAgICAgICAgICBpZiAoaW5wdXRbcG9pbnRlcl0gPT09IDQ2ICYmIG51bWJlcnNTZWVuIDwgNCkge1xyXG4gICAgICAgICAgICArK3BvaW50ZXI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFpbHVyZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNBU0NJSURpZ2l0KGlucHV0W3BvaW50ZXJdKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aGlsZSAoaXNBU0NJSURpZ2l0KGlucHV0W3BvaW50ZXJdKSkge1xyXG4gICAgICAgICAgY29uc3QgbnVtYmVyID0gcGFyc2VJbnQoYXQoaW5wdXQsIHBvaW50ZXIpKTtcclxuICAgICAgICAgIGlmIChpcHY0UGllY2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgaXB2NFBpZWNlID0gbnVtYmVyO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpcHY0UGllY2UgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpcHY0UGllY2UgPSBpcHY0UGllY2UgKiAxMCArIG51bWJlcjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpcHY0UGllY2UgPiAyNTUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICArK3BvaW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhZGRyZXNzW3BpZWNlSW5kZXhdID0gYWRkcmVzc1twaWVjZUluZGV4XSAqIDB4MTAwICsgaXB2NFBpZWNlO1xyXG5cclxuICAgICAgICArK251bWJlcnNTZWVuO1xyXG5cclxuICAgICAgICBpZiAobnVtYmVyc1NlZW4gPT09IDIgfHwgbnVtYmVyc1NlZW4gPT09IDQpIHtcclxuICAgICAgICAgICsrcGllY2VJbmRleDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChudW1iZXJzU2VlbiAhPT0gNCkge1xyXG4gICAgICAgIHJldHVybiBmYWlsdXJlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBicmVhaztcclxuICAgIH0gZWxzZSBpZiAoaW5wdXRbcG9pbnRlcl0gPT09IDU4KSB7XHJcbiAgICAgICsrcG9pbnRlcjtcclxuICAgICAgaWYgKGlucHV0W3BvaW50ZXJdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gZmFpbHVyZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChpbnB1dFtwb2ludGVyXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBmYWlsdXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZHJlc3NbcGllY2VJbmRleF0gPSB2YWx1ZTtcclxuICAgICsrcGllY2VJbmRleDtcclxuICB9XHJcblxyXG4gIGlmIChjb21wcmVzcyAhPT0gbnVsbCkge1xyXG4gICAgbGV0IHN3YXBzID0gcGllY2VJbmRleCAtIGNvbXByZXNzO1xyXG4gICAgcGllY2VJbmRleCA9IDc7XHJcbiAgICB3aGlsZSAocGllY2VJbmRleCAhPT0gMCAmJiBzd2FwcyA+IDApIHtcclxuICAgICAgY29uc3QgdGVtcCA9IGFkZHJlc3NbY29tcHJlc3MgKyBzd2FwcyAtIDFdO1xyXG4gICAgICBhZGRyZXNzW2NvbXByZXNzICsgc3dhcHMgLSAxXSA9IGFkZHJlc3NbcGllY2VJbmRleF07XHJcbiAgICAgIGFkZHJlc3NbcGllY2VJbmRleF0gPSB0ZW1wO1xyXG4gICAgICAtLXBpZWNlSW5kZXg7XHJcbiAgICAgIC0tc3dhcHM7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChjb21wcmVzcyA9PT0gbnVsbCAmJiBwaWVjZUluZGV4ICE9PSA4KSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhZGRyZXNzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXJpYWxpemVJUHY2KGFkZHJlc3MpIHtcclxuICBsZXQgb3V0cHV0ID0gXCJcIjtcclxuICBjb25zdCBzZXFSZXN1bHQgPSBmaW5kTG9uZ2VzdFplcm9TZXF1ZW5jZShhZGRyZXNzKTtcclxuICBjb25zdCBjb21wcmVzcyA9IHNlcVJlc3VsdC5pZHg7XHJcbiAgbGV0IGlnbm9yZTAgPSBmYWxzZTtcclxuXHJcbiAgZm9yIChsZXQgcGllY2VJbmRleCA9IDA7IHBpZWNlSW5kZXggPD0gNzsgKytwaWVjZUluZGV4KSB7XHJcbiAgICBpZiAoaWdub3JlMCAmJiBhZGRyZXNzW3BpZWNlSW5kZXhdID09PSAwKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfSBlbHNlIGlmIChpZ25vcmUwKSB7XHJcbiAgICAgIGlnbm9yZTAgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29tcHJlc3MgPT09IHBpZWNlSW5kZXgpIHtcclxuICAgICAgY29uc3Qgc2VwYXJhdG9yID0gcGllY2VJbmRleCA9PT0gMCA/IFwiOjpcIiA6IFwiOlwiO1xyXG4gICAgICBvdXRwdXQgKz0gc2VwYXJhdG9yO1xyXG4gICAgICBpZ25vcmUwID0gdHJ1ZTtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0ICs9IGFkZHJlc3NbcGllY2VJbmRleF0udG9TdHJpbmcoMTYpO1xyXG5cclxuICAgIGlmIChwaWVjZUluZGV4ICE9PSA3KSB7XHJcbiAgICAgIG91dHB1dCArPSBcIjpcIjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSG9zdChpbnB1dCwgaXNTcGVjaWFsQXJnKSB7XHJcbiAgaWYgKGlucHV0WzBdID09PSBcIltcIikge1xyXG4gICAgaWYgKGlucHV0W2lucHV0Lmxlbmd0aCAtIDFdICE9PSBcIl1cIikge1xyXG4gICAgICByZXR1cm4gZmFpbHVyZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyc2VJUHY2KGlucHV0LnN1YnN0cmluZygxLCBpbnB1dC5sZW5ndGggLSAxKSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzU3BlY2lhbEFyZykge1xyXG4gICAgcmV0dXJuIHBhcnNlT3BhcXVlSG9zdChpbnB1dCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkb21haW4gPSB1dGY4UGVyY2VudERlY29kZShpbnB1dCk7XHJcbiAgY29uc3QgYXNjaWlEb21haW4gPSB0cjQ2LnRvQVNDSUkoZG9tYWluLCBmYWxzZSwgdHI0Ni5QUk9DRVNTSU5HX09QVElPTlMuTk9OVFJBTlNJVElPTkFMLCBmYWxzZSk7XHJcbiAgaWYgKGFzY2lpRG9tYWluID09PSBudWxsKSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZTtcclxuICB9XHJcblxyXG4gIGlmIChjb250YWluc0ZvcmJpZGRlbkhvc3RDb2RlUG9pbnQoYXNjaWlEb21haW4pKSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGlwdjRIb3N0ID0gcGFyc2VJUHY0KGFzY2lpRG9tYWluKTtcclxuICBpZiAodHlwZW9mIGlwdjRIb3N0ID09PSBcIm51bWJlclwiIHx8IGlwdjRIb3N0ID09PSBmYWlsdXJlKSB7XHJcbiAgICByZXR1cm4gaXB2NEhvc3Q7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXNjaWlEb21haW47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlT3BhcXVlSG9zdChpbnB1dCkge1xyXG4gIGlmIChjb250YWluc0ZvcmJpZGRlbkhvc3RDb2RlUG9pbnRFeGNsdWRpbmdQZXJjZW50KGlucHV0KSkge1xyXG4gICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgfVxyXG5cclxuICBsZXQgb3V0cHV0ID0gXCJcIjtcclxuICBjb25zdCBkZWNvZGVkID0gcHVueWNvZGUudWNzMi5kZWNvZGUoaW5wdXQpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGVjb2RlZC5sZW5ndGg7ICsraSkge1xyXG4gICAgb3V0cHV0ICs9IHBlcmNlbnRFbmNvZGVDaGFyKGRlY29kZWRbaV0sIGlzQzBDb250cm9sUGVyY2VudEVuY29kZSk7XHJcbiAgfVxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRMb25nZXN0WmVyb1NlcXVlbmNlKGFycikge1xyXG4gIGxldCBtYXhJZHggPSBudWxsO1xyXG4gIGxldCBtYXhMZW4gPSAxOyAvLyBvbmx5IGZpbmQgZWxlbWVudHMgPiAxXHJcbiAgbGV0IGN1cnJTdGFydCA9IG51bGw7XHJcbiAgbGV0IGN1cnJMZW4gPSAwO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xyXG4gICAgaWYgKGFycltpXSAhPT0gMCkge1xyXG4gICAgICBpZiAoY3VyckxlbiA+IG1heExlbikge1xyXG4gICAgICAgIG1heElkeCA9IGN1cnJTdGFydDtcclxuICAgICAgICBtYXhMZW4gPSBjdXJyTGVuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjdXJyU3RhcnQgPSBudWxsO1xyXG4gICAgICBjdXJyTGVuID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChjdXJyU3RhcnQgPT09IG51bGwpIHtcclxuICAgICAgICBjdXJyU3RhcnQgPSBpO1xyXG4gICAgICB9XHJcbiAgICAgICsrY3VyckxlbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGlmIHRyYWlsaW5nIHplcm9zXHJcbiAgaWYgKGN1cnJMZW4gPiBtYXhMZW4pIHtcclxuICAgIG1heElkeCA9IGN1cnJTdGFydDtcclxuICAgIG1heExlbiA9IGN1cnJMZW47XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaWR4OiBtYXhJZHgsXHJcbiAgICBsZW46IG1heExlblxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZUhvc3QoaG9zdCkge1xyXG4gIGlmICh0eXBlb2YgaG9zdCA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgcmV0dXJuIHNlcmlhbGl6ZUlQdjQoaG9zdCk7XHJcbiAgfVxyXG5cclxuICAvLyBJUHY2IHNlcmlhbGl6ZXJcclxuICBpZiAoaG9zdCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICByZXR1cm4gXCJbXCIgKyBzZXJpYWxpemVJUHY2KGhvc3QpICsgXCJdXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaG9zdDtcclxufVxyXG5cclxuZnVuY3Rpb24gdHJpbUNvbnRyb2xDaGFycyh1cmwpIHtcclxuICByZXR1cm4gdXJsLnJlcGxhY2UoL15bXFx1MDAwMC1cXHUwMDFGXFx1MDAyMF0rfFtcXHUwMDAwLVxcdTAwMUZcXHUwMDIwXSskL2csIFwiXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0cmltVGFiQW5kTmV3bGluZSh1cmwpIHtcclxuICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcdTAwMDl8XFx1MDAwQXxcXHUwMDBEL2csIFwiXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG9ydGVuUGF0aCh1cmwpIHtcclxuICBjb25zdCBwYXRoID0gdXJsLnBhdGg7XHJcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlmICh1cmwuc2NoZW1lID09PSBcImZpbGVcIiAmJiBwYXRoLmxlbmd0aCA9PT0gMSAmJiBpc05vcm1hbGl6ZWRXaW5kb3dzRHJpdmVMZXR0ZXIocGF0aFswXSkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHBhdGgucG9wKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluY2x1ZGVzQ3JlZGVudGlhbHModXJsKSB7XHJcbiAgcmV0dXJuIHVybC51c2VybmFtZSAhPT0gXCJcIiB8fCB1cmwucGFzc3dvcmQgIT09IFwiXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbm5vdEhhdmVBVXNlcm5hbWVQYXNzd29yZFBvcnQodXJsKSB7XHJcbiAgcmV0dXJuIHVybC5ob3N0ID09PSBudWxsIHx8IHVybC5ob3N0ID09PSBcIlwiIHx8IHVybC5jYW5ub3RCZUFCYXNlVVJMIHx8IHVybC5zY2hlbWUgPT09IFwiZmlsZVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc05vcm1hbGl6ZWRXaW5kb3dzRHJpdmVMZXR0ZXIoc3RyaW5nKSB7XHJcbiAgcmV0dXJuIC9eW0EtWmEtel06JC8udGVzdChzdHJpbmcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBVUkxTdGF0ZU1hY2hpbmUoaW5wdXQsIGJhc2UsIGVuY29kaW5nT3ZlcnJpZGUsIHVybCwgc3RhdGVPdmVycmlkZSkge1xyXG4gIHRoaXMucG9pbnRlciA9IDA7XHJcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gIHRoaXMuYmFzZSA9IGJhc2UgfHwgbnVsbDtcclxuICB0aGlzLmVuY29kaW5nT3ZlcnJpZGUgPSBlbmNvZGluZ092ZXJyaWRlIHx8IFwidXRmLThcIjtcclxuICB0aGlzLnN0YXRlT3ZlcnJpZGUgPSBzdGF0ZU92ZXJyaWRlO1xyXG4gIHRoaXMudXJsID0gdXJsO1xyXG4gIHRoaXMuZmFpbHVyZSA9IGZhbHNlO1xyXG4gIHRoaXMucGFyc2VFcnJvciA9IGZhbHNlO1xyXG5cclxuICBpZiAoIXRoaXMudXJsKSB7XHJcbiAgICB0aGlzLnVybCA9IHtcclxuICAgICAgc2NoZW1lOiBcIlwiLFxyXG4gICAgICB1c2VybmFtZTogXCJcIixcclxuICAgICAgcGFzc3dvcmQ6IFwiXCIsXHJcbiAgICAgIGhvc3Q6IG51bGwsXHJcbiAgICAgIHBvcnQ6IG51bGwsXHJcbiAgICAgIHBhdGg6IFtdLFxyXG4gICAgICBxdWVyeTogbnVsbCxcclxuICAgICAgZnJhZ21lbnQ6IG51bGwsXHJcblxyXG4gICAgICBjYW5ub3RCZUFCYXNlVVJMOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCByZXMgPSB0cmltQ29udHJvbENoYXJzKHRoaXMuaW5wdXQpO1xyXG4gICAgaWYgKHJlcyAhPT0gdGhpcy5pbnB1dCkge1xyXG4gICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbnB1dCA9IHJlcztcclxuICB9XHJcblxyXG4gIGNvbnN0IHJlcyA9IHRyaW1UYWJBbmROZXdsaW5lKHRoaXMuaW5wdXQpO1xyXG4gIGlmIChyZXMgIT09IHRoaXMuaW5wdXQpIHtcclxuICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgfVxyXG4gIHRoaXMuaW5wdXQgPSByZXM7XHJcblxyXG4gIHRoaXMuc3RhdGUgPSBzdGF0ZU92ZXJyaWRlIHx8IFwic2NoZW1lIHN0YXJ0XCI7XHJcblxyXG4gIHRoaXMuYnVmZmVyID0gXCJcIjtcclxuICB0aGlzLmF0RmxhZyA9IGZhbHNlO1xyXG4gIHRoaXMuYXJyRmxhZyA9IGZhbHNlO1xyXG4gIHRoaXMucGFzc3dvcmRUb2tlblNlZW5GbGFnID0gZmFsc2U7XHJcblxyXG4gIHRoaXMuaW5wdXQgPSBwdW55Y29kZS51Y3MyLmRlY29kZSh0aGlzLmlucHV0KTtcclxuXHJcbiAgZm9yICg7IHRoaXMucG9pbnRlciA8PSB0aGlzLmlucHV0Lmxlbmd0aDsgKyt0aGlzLnBvaW50ZXIpIHtcclxuICAgIGNvbnN0IGMgPSB0aGlzLmlucHV0W3RoaXMucG9pbnRlcl07XHJcbiAgICBjb25zdCBjU3RyID0gaXNOYU4oYykgPyB1bmRlZmluZWQgOiBTdHJpbmcuZnJvbUNvZGVQb2ludChjKTtcclxuXHJcbiAgICAvLyBleGVjIHN0YXRlIG1hY2hpbmVcclxuICAgIGNvbnN0IHJldCA9IHRoaXNbXCJwYXJzZSBcIiArIHRoaXMuc3RhdGVdKGMsIGNTdHIpO1xyXG4gICAgaWYgKCFyZXQpIHtcclxuICAgICAgYnJlYWs7IC8vIHRlcm1pbmF0ZSBhbGdvcml0aG1cclxuICAgIH0gZWxzZSBpZiAocmV0ID09PSBmYWlsdXJlKSB7XHJcbiAgICAgIHRoaXMuZmFpbHVyZSA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIHNjaGVtZSBzdGFydFwiXSA9IGZ1bmN0aW9uIHBhcnNlU2NoZW1lU3RhcnQoYywgY1N0cikge1xyXG4gIGlmIChpc0FTQ0lJQWxwaGEoYykpIHtcclxuICAgIHRoaXMuYnVmZmVyICs9IGNTdHIudG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuc3RhdGUgPSBcInNjaGVtZVwiO1xyXG4gIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGVPdmVycmlkZSkge1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwibm8gc2NoZW1lXCI7XHJcbiAgICAtLXRoaXMucG9pbnRlcjtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgIHJldHVybiBmYWlsdXJlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2Ugc2NoZW1lXCJdID0gZnVuY3Rpb24gcGFyc2VTY2hlbWUoYywgY1N0cikge1xyXG4gIGlmIChpc0FTQ0lJQWxwaGFudW1lcmljKGMpIHx8IGMgPT09IDQzIHx8IGMgPT09IDQ1IHx8IGMgPT09IDQ2KSB7XHJcbiAgICB0aGlzLmJ1ZmZlciArPSBjU3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgfSBlbHNlIGlmIChjID09PSA1OCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdGVPdmVycmlkZSkge1xyXG4gICAgICBpZiAoaXNTcGVjaWFsKHRoaXMudXJsKSAmJiAhaXNTcGVjaWFsU2NoZW1lKHRoaXMuYnVmZmVyKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFpc1NwZWNpYWwodGhpcy51cmwpICYmIGlzU3BlY2lhbFNjaGVtZSh0aGlzLmJ1ZmZlcikpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgoaW5jbHVkZXNDcmVkZW50aWFscyh0aGlzLnVybCkgfHwgdGhpcy51cmwucG9ydCAhPT0gbnVsbCkgJiYgdGhpcy5idWZmZXIgPT09IFwiZmlsZVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy51cmwuc2NoZW1lID09PSBcImZpbGVcIiAmJiAodGhpcy51cmwuaG9zdCA9PT0gXCJcIiB8fCB0aGlzLnVybC5ob3N0ID09PSBudWxsKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51cmwuc2NoZW1lID0gdGhpcy5idWZmZXI7XHJcbiAgICB0aGlzLmJ1ZmZlciA9IFwiXCI7XHJcbiAgICBpZiAodGhpcy5zdGF0ZU92ZXJyaWRlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnVybC5zY2hlbWUgPT09IFwiZmlsZVwiKSB7XHJcbiAgICAgIGlmICh0aGlzLmlucHV0W3RoaXMucG9pbnRlciArIDFdICE9PSA0NyB8fCB0aGlzLmlucHV0W3RoaXMucG9pbnRlciArIDJdICE9PSA0Nykge1xyXG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zdGF0ZSA9IFwiZmlsZVwiO1xyXG4gICAgfSBlbHNlIGlmIChpc1NwZWNpYWwodGhpcy51cmwpICYmIHRoaXMuYmFzZSAhPT0gbnVsbCAmJiB0aGlzLmJhc2Uuc2NoZW1lID09PSB0aGlzLnVybC5zY2hlbWUpIHtcclxuICAgICAgdGhpcy5zdGF0ZSA9IFwic3BlY2lhbCByZWxhdGl2ZSBvciBhdXRob3JpdHlcIjtcclxuICAgIH0gZWxzZSBpZiAoaXNTcGVjaWFsKHRoaXMudXJsKSkge1xyXG4gICAgICB0aGlzLnN0YXRlID0gXCJzcGVjaWFsIGF1dGhvcml0eSBzbGFzaGVzXCI7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRbdGhpcy5wb2ludGVyICsgMV0gPT09IDQ3KSB7XHJcbiAgICAgIHRoaXMuc3RhdGUgPSBcInBhdGggb3IgYXV0aG9yaXR5XCI7XHJcbiAgICAgICsrdGhpcy5wb2ludGVyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cmwuY2Fubm90QmVBQmFzZVVSTCA9IHRydWU7XHJcbiAgICAgIHRoaXMudXJsLnBhdGgucHVzaChcIlwiKTtcclxuICAgICAgdGhpcy5zdGF0ZSA9IFwiY2Fubm90LWJlLWEtYmFzZS1VUkwgcGF0aFwiO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGVPdmVycmlkZSkge1xyXG4gICAgdGhpcy5idWZmZXIgPSBcIlwiO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwibm8gc2NoZW1lXCI7XHJcbiAgICB0aGlzLnBvaW50ZXIgPSAtMTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgIHJldHVybiBmYWlsdXJlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2Ugbm8gc2NoZW1lXCJdID0gZnVuY3Rpb24gcGFyc2VOb1NjaGVtZShjKSB7XHJcbiAgaWYgKHRoaXMuYmFzZSA9PT0gbnVsbCB8fCAodGhpcy5iYXNlLmNhbm5vdEJlQUJhc2VVUkwgJiYgYyAhPT0gMzUpKSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZTtcclxuICB9IGVsc2UgaWYgKHRoaXMuYmFzZS5jYW5ub3RCZUFCYXNlVVJMICYmIGMgPT09IDM1KSB7XHJcbiAgICB0aGlzLnVybC5zY2hlbWUgPSB0aGlzLmJhc2Uuc2NoZW1lO1xyXG4gICAgdGhpcy51cmwucGF0aCA9IHRoaXMuYmFzZS5wYXRoLnNsaWNlKCk7XHJcbiAgICB0aGlzLnVybC5xdWVyeSA9IHRoaXMuYmFzZS5xdWVyeTtcclxuICAgIHRoaXMudXJsLmZyYWdtZW50ID0gXCJcIjtcclxuICAgIHRoaXMudXJsLmNhbm5vdEJlQUJhc2VVUkwgPSB0cnVlO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwiZnJhZ21lbnRcIjtcclxuICB9IGVsc2UgaWYgKHRoaXMuYmFzZS5zY2hlbWUgPT09IFwiZmlsZVwiKSB7XHJcbiAgICB0aGlzLnN0YXRlID0gXCJmaWxlXCI7XHJcbiAgICAtLXRoaXMucG9pbnRlcjtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwicmVsYXRpdmVcIjtcclxuICAgIC0tdGhpcy5wb2ludGVyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2Ugc3BlY2lhbCByZWxhdGl2ZSBvciBhdXRob3JpdHlcIl0gPSBmdW5jdGlvbiBwYXJzZVNwZWNpYWxSZWxhdGl2ZU9yQXV0aG9yaXR5KGMpIHtcclxuICBpZiAoYyA9PT0gNDcgJiYgdGhpcy5pbnB1dFt0aGlzLnBvaW50ZXIgKyAxXSA9PT0gNDcpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBcInNwZWNpYWwgYXV0aG9yaXR5IGlnbm9yZSBzbGFzaGVzXCI7XHJcbiAgICArK3RoaXMucG9pbnRlcjtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgIHRoaXMuc3RhdGUgPSBcInJlbGF0aXZlXCI7XHJcbiAgICAtLXRoaXMucG9pbnRlcjtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIHBhdGggb3IgYXV0aG9yaXR5XCJdID0gZnVuY3Rpb24gcGFyc2VQYXRoT3JBdXRob3JpdHkoYykge1xyXG4gIGlmIChjID09PSA0Nykge1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwiYXV0aG9yaXR5XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuc3RhdGUgPSBcInBhdGhcIjtcclxuICAgIC0tdGhpcy5wb2ludGVyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2UgcmVsYXRpdmVcIl0gPSBmdW5jdGlvbiBwYXJzZVJlbGF0aXZlKGMpIHtcclxuICB0aGlzLnVybC5zY2hlbWUgPSB0aGlzLmJhc2Uuc2NoZW1lO1xyXG4gIGlmIChpc05hTihjKSkge1xyXG4gICAgdGhpcy51cmwudXNlcm5hbWUgPSB0aGlzLmJhc2UudXNlcm5hbWU7XHJcbiAgICB0aGlzLnVybC5wYXNzd29yZCA9IHRoaXMuYmFzZS5wYXNzd29yZDtcclxuICAgIHRoaXMudXJsLmhvc3QgPSB0aGlzLmJhc2UuaG9zdDtcclxuICAgIHRoaXMudXJsLnBvcnQgPSB0aGlzLmJhc2UucG9ydDtcclxuICAgIHRoaXMudXJsLnBhdGggPSB0aGlzLmJhc2UucGF0aC5zbGljZSgpO1xyXG4gICAgdGhpcy51cmwucXVlcnkgPSB0aGlzLmJhc2UucXVlcnk7XHJcbiAgfSBlbHNlIGlmIChjID09PSA0Nykge1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwicmVsYXRpdmUgc2xhc2hcIjtcclxuICB9IGVsc2UgaWYgKGMgPT09IDYzKSB7XHJcbiAgICB0aGlzLnVybC51c2VybmFtZSA9IHRoaXMuYmFzZS51c2VybmFtZTtcclxuICAgIHRoaXMudXJsLnBhc3N3b3JkID0gdGhpcy5iYXNlLnBhc3N3b3JkO1xyXG4gICAgdGhpcy51cmwuaG9zdCA9IHRoaXMuYmFzZS5ob3N0O1xyXG4gICAgdGhpcy51cmwucG9ydCA9IHRoaXMuYmFzZS5wb3J0O1xyXG4gICAgdGhpcy51cmwucGF0aCA9IHRoaXMuYmFzZS5wYXRoLnNsaWNlKCk7XHJcbiAgICB0aGlzLnVybC5xdWVyeSA9IFwiXCI7XHJcbiAgICB0aGlzLnN0YXRlID0gXCJxdWVyeVwiO1xyXG4gIH0gZWxzZSBpZiAoYyA9PT0gMzUpIHtcclxuICAgIHRoaXMudXJsLnVzZXJuYW1lID0gdGhpcy5iYXNlLnVzZXJuYW1lO1xyXG4gICAgdGhpcy51cmwucGFzc3dvcmQgPSB0aGlzLmJhc2UucGFzc3dvcmQ7XHJcbiAgICB0aGlzLnVybC5ob3N0ID0gdGhpcy5iYXNlLmhvc3Q7XHJcbiAgICB0aGlzLnVybC5wb3J0ID0gdGhpcy5iYXNlLnBvcnQ7XHJcbiAgICB0aGlzLnVybC5wYXRoID0gdGhpcy5iYXNlLnBhdGguc2xpY2UoKTtcclxuICAgIHRoaXMudXJsLnF1ZXJ5ID0gdGhpcy5iYXNlLnF1ZXJ5O1xyXG4gICAgdGhpcy51cmwuZnJhZ21lbnQgPSBcIlwiO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwiZnJhZ21lbnRcIjtcclxuICB9IGVsc2UgaWYgKGlzU3BlY2lhbCh0aGlzLnVybCkgJiYgYyA9PT0gOTIpIHtcclxuICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICB0aGlzLnN0YXRlID0gXCJyZWxhdGl2ZSBzbGFzaFwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnVybC51c2VybmFtZSA9IHRoaXMuYmFzZS51c2VybmFtZTtcclxuICAgIHRoaXMudXJsLnBhc3N3b3JkID0gdGhpcy5iYXNlLnBhc3N3b3JkO1xyXG4gICAgdGhpcy51cmwuaG9zdCA9IHRoaXMuYmFzZS5ob3N0O1xyXG4gICAgdGhpcy51cmwucG9ydCA9IHRoaXMuYmFzZS5wb3J0O1xyXG4gICAgdGhpcy51cmwucGF0aCA9IHRoaXMuYmFzZS5wYXRoLnNsaWNlKDAsIHRoaXMuYmFzZS5wYXRoLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBcInBhdGhcIjtcclxuICAgIC0tdGhpcy5wb2ludGVyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2UgcmVsYXRpdmUgc2xhc2hcIl0gPSBmdW5jdGlvbiBwYXJzZVJlbGF0aXZlU2xhc2goYykge1xyXG4gIGlmIChpc1NwZWNpYWwodGhpcy51cmwpICYmIChjID09PSA0NyB8fCBjID09PSA5MikpIHtcclxuICAgIGlmIChjID09PSA5Mikge1xyXG4gICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGF0ZSA9IFwic3BlY2lhbCBhdXRob3JpdHkgaWdub3JlIHNsYXNoZXNcIjtcclxuICB9IGVsc2UgaWYgKGMgPT09IDQ3KSB7XHJcbiAgICB0aGlzLnN0YXRlID0gXCJhdXRob3JpdHlcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy51cmwudXNlcm5hbWUgPSB0aGlzLmJhc2UudXNlcm5hbWU7XHJcbiAgICB0aGlzLnVybC5wYXNzd29yZCA9IHRoaXMuYmFzZS5wYXNzd29yZDtcclxuICAgIHRoaXMudXJsLmhvc3QgPSB0aGlzLmJhc2UuaG9zdDtcclxuICAgIHRoaXMudXJsLnBvcnQgPSB0aGlzLmJhc2UucG9ydDtcclxuICAgIHRoaXMuc3RhdGUgPSBcInBhdGhcIjtcclxuICAgIC0tdGhpcy5wb2ludGVyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2Ugc3BlY2lhbCBhdXRob3JpdHkgc2xhc2hlc1wiXSA9IGZ1bmN0aW9uIHBhcnNlU3BlY2lhbEF1dGhvcml0eVNsYXNoZXMoYykge1xyXG4gIGlmIChjID09PSA0NyAmJiB0aGlzLmlucHV0W3RoaXMucG9pbnRlciArIDFdID09PSA0Nykge1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwic3BlY2lhbCBhdXRob3JpdHkgaWdub3JlIHNsYXNoZXNcIjtcclxuICAgICsrdGhpcy5wb2ludGVyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwic3BlY2lhbCBhdXRob3JpdHkgaWdub3JlIHNsYXNoZXNcIjtcclxuICAgIC0tdGhpcy5wb2ludGVyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2Ugc3BlY2lhbCBhdXRob3JpdHkgaWdub3JlIHNsYXNoZXNcIl0gPSBmdW5jdGlvbiBwYXJzZVNwZWNpYWxBdXRob3JpdHlJZ25vcmVTbGFzaGVzKGMpIHtcclxuICBpZiAoYyAhPT0gNDcgJiYgYyAhPT0gOTIpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBcImF1dGhvcml0eVwiO1xyXG4gICAgLS10aGlzLnBvaW50ZXI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblVSTFN0YXRlTWFjaGluZS5wcm90b3R5cGVbXCJwYXJzZSBhdXRob3JpdHlcIl0gPSBmdW5jdGlvbiBwYXJzZUF1dGhvcml0eShjLCBjU3RyKSB7XHJcbiAgaWYgKGMgPT09IDY0KSB7XHJcbiAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgaWYgKHRoaXMuYXRGbGFnKSB7XHJcbiAgICAgIHRoaXMuYnVmZmVyID0gXCIlNDBcIiArIHRoaXMuYnVmZmVyO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hdEZsYWcgPSB0cnVlO1xyXG5cclxuICAgIC8vIGNhcmVmdWwsIHRoaXMgaXMgYmFzZWQgb24gYnVmZmVyIGFuZCBoYXMgaXRzIG93biBwb2ludGVyICh0aGlzLnBvaW50ZXIgIT0gcG9pbnRlcikgYW5kIGlubmVyIGNoYXJzXHJcbiAgICBjb25zdCBsZW4gPSBjb3VudFN5bWJvbHModGhpcy5idWZmZXIpO1xyXG4gICAgZm9yIChsZXQgcG9pbnRlciA9IDA7IHBvaW50ZXIgPCBsZW47ICsrcG9pbnRlcikge1xyXG4gICAgICBjb25zdCBjb2RlUG9pbnQgPSB0aGlzLmJ1ZmZlci5jb2RlUG9pbnRBdChwb2ludGVyKTtcclxuXHJcbiAgICAgIGlmIChjb2RlUG9pbnQgPT09IDU4ICYmICF0aGlzLnBhc3N3b3JkVG9rZW5TZWVuRmxhZykge1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmRUb2tlblNlZW5GbGFnID0gdHJ1ZTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBlbmNvZGVkQ29kZVBvaW50cyA9IHBlcmNlbnRFbmNvZGVDaGFyKGNvZGVQb2ludCwgaXNVc2VyaW5mb1BlcmNlbnRFbmNvZGUpO1xyXG4gICAgICBpZiAodGhpcy5wYXNzd29yZFRva2VuU2VlbkZsYWcpIHtcclxuICAgICAgICB0aGlzLnVybC5wYXNzd29yZCArPSBlbmNvZGVkQ29kZVBvaW50cztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnVybC51c2VybmFtZSArPSBlbmNvZGVkQ29kZVBvaW50cztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5idWZmZXIgPSBcIlwiO1xyXG4gIH0gZWxzZSBpZiAoaXNOYU4oYykgfHwgYyA9PT0gNDcgfHwgYyA9PT0gNjMgfHwgYyA9PT0gMzUgfHxcclxuICAgICAgICAgICAgIChpc1NwZWNpYWwodGhpcy51cmwpICYmIGMgPT09IDkyKSkge1xyXG4gICAgaWYgKHRoaXMuYXRGbGFnICYmIHRoaXMuYnVmZmVyID09PSBcIlwiKSB7XHJcbiAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICAgIHJldHVybiBmYWlsdXJlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wb2ludGVyIC09IGNvdW50U3ltYm9scyh0aGlzLmJ1ZmZlcikgKyAxO1xyXG4gICAgdGhpcy5idWZmZXIgPSBcIlwiO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwiaG9zdFwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLmJ1ZmZlciArPSBjU3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2UgaG9zdG5hbWVcIl0gPVxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2UgaG9zdFwiXSA9IGZ1bmN0aW9uIHBhcnNlSG9zdE5hbWUoYywgY1N0cikge1xyXG4gIGlmICh0aGlzLnN0YXRlT3ZlcnJpZGUgJiYgdGhpcy51cmwuc2NoZW1lID09PSBcImZpbGVcIikge1xyXG4gICAgLS10aGlzLnBvaW50ZXI7XHJcbiAgICB0aGlzLnN0YXRlID0gXCJmaWxlIGhvc3RcIjtcclxuICB9IGVsc2UgaWYgKGMgPT09IDU4ICYmICF0aGlzLmFyckZsYWcpIHtcclxuICAgIGlmICh0aGlzLmJ1ZmZlciA9PT0gXCJcIikge1xyXG4gICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gZmFpbHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBob3N0ID0gcGFyc2VIb3N0KHRoaXMuYnVmZmVyLCBpc1NwZWNpYWwodGhpcy51cmwpKTtcclxuICAgIGlmIChob3N0ID09PSBmYWlsdXJlKSB7XHJcbiAgICAgIHJldHVybiBmYWlsdXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXJsLmhvc3QgPSBob3N0O1xyXG4gICAgdGhpcy5idWZmZXIgPSBcIlwiO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwicG9ydFwiO1xyXG4gICAgaWYgKHRoaXMuc3RhdGVPdmVycmlkZSA9PT0gXCJob3N0bmFtZVwiKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKGlzTmFOKGMpIHx8IGMgPT09IDQ3IHx8IGMgPT09IDYzIHx8IGMgPT09IDM1IHx8XHJcbiAgICAgICAgICAgICAoaXNTcGVjaWFsKHRoaXMudXJsKSAmJiBjID09PSA5MikpIHtcclxuICAgIC0tdGhpcy5wb2ludGVyO1xyXG4gICAgaWYgKGlzU3BlY2lhbCh0aGlzLnVybCkgJiYgdGhpcy5idWZmZXIgPT09IFwiXCIpIHtcclxuICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGVPdmVycmlkZSAmJiB0aGlzLmJ1ZmZlciA9PT0gXCJcIiAmJlxyXG4gICAgICAgICAgICAgICAoaW5jbHVkZXNDcmVkZW50aWFscyh0aGlzLnVybCkgfHwgdGhpcy51cmwucG9ydCAhPT0gbnVsbCkpIHtcclxuICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhvc3QgPSBwYXJzZUhvc3QodGhpcy5idWZmZXIsIGlzU3BlY2lhbCh0aGlzLnVybCkpO1xyXG4gICAgaWYgKGhvc3QgPT09IGZhaWx1cmUpIHtcclxuICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cmwuaG9zdCA9IGhvc3Q7XHJcbiAgICB0aGlzLmJ1ZmZlciA9IFwiXCI7XHJcbiAgICB0aGlzLnN0YXRlID0gXCJwYXRoIHN0YXJ0XCI7XHJcbiAgICBpZiAodGhpcy5zdGF0ZU92ZXJyaWRlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGMgPT09IDkxKSB7XHJcbiAgICAgIHRoaXMuYXJyRmxhZyA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGMgPT09IDkzKSB7XHJcbiAgICAgIHRoaXMuYXJyRmxhZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5idWZmZXIgKz0gY1N0cjtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIHBvcnRcIl0gPSBmdW5jdGlvbiBwYXJzZVBvcnQoYywgY1N0cikge1xyXG4gIGlmIChpc0FTQ0lJRGlnaXQoYykpIHtcclxuICAgIHRoaXMuYnVmZmVyICs9IGNTdHI7XHJcbiAgfSBlbHNlIGlmIChpc05hTihjKSB8fCBjID09PSA0NyB8fCBjID09PSA2MyB8fCBjID09PSAzNSB8fFxyXG4gICAgICAgICAgICAgKGlzU3BlY2lhbCh0aGlzLnVybCkgJiYgYyA9PT0gOTIpIHx8XHJcbiAgICAgICAgICAgICB0aGlzLnN0YXRlT3ZlcnJpZGUpIHtcclxuICAgIGlmICh0aGlzLmJ1ZmZlciAhPT0gXCJcIikge1xyXG4gICAgICBjb25zdCBwb3J0ID0gcGFyc2VJbnQodGhpcy5idWZmZXIpO1xyXG4gICAgICBpZiAocG9ydCA+IE1hdGgucG93KDIsIDE2KSAtIDEpIHtcclxuICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWlsdXJlO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXJsLnBvcnQgPSBwb3J0ID09PSBkZWZhdWx0UG9ydCh0aGlzLnVybC5zY2hlbWUpID8gbnVsbCA6IHBvcnQ7XHJcbiAgICAgIHRoaXMuYnVmZmVyID0gXCJcIjtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnN0YXRlT3ZlcnJpZGUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGF0ZSA9IFwicGF0aCBzdGFydFwiO1xyXG4gICAgLS10aGlzLnBvaW50ZXI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICByZXR1cm4gZmFpbHVyZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuY29uc3QgZmlsZU90aGVyd2lzZUNvZGVQb2ludHMgPSBuZXcgU2V0KFs0NywgOTIsIDYzLCAzNV0pO1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIGZpbGVcIl0gPSBmdW5jdGlvbiBwYXJzZUZpbGUoYykge1xyXG4gIHRoaXMudXJsLnNjaGVtZSA9IFwiZmlsZVwiO1xyXG5cclxuICBpZiAoYyA9PT0gNDcgfHwgYyA9PT0gOTIpIHtcclxuICAgIGlmIChjID09PSA5Mikge1xyXG4gICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGF0ZSA9IFwiZmlsZSBzbGFzaFwiO1xyXG4gIH0gZWxzZSBpZiAodGhpcy5iYXNlICE9PSBudWxsICYmIHRoaXMuYmFzZS5zY2hlbWUgPT09IFwiZmlsZVwiKSB7XHJcbiAgICBpZiAoaXNOYU4oYykpIHtcclxuICAgICAgdGhpcy51cmwuaG9zdCA9IHRoaXMuYmFzZS5ob3N0O1xyXG4gICAgICB0aGlzLnVybC5wYXRoID0gdGhpcy5iYXNlLnBhdGguc2xpY2UoKTtcclxuICAgICAgdGhpcy51cmwucXVlcnkgPSB0aGlzLmJhc2UucXVlcnk7XHJcbiAgICB9IGVsc2UgaWYgKGMgPT09IDYzKSB7XHJcbiAgICAgIHRoaXMudXJsLmhvc3QgPSB0aGlzLmJhc2UuaG9zdDtcclxuICAgICAgdGhpcy51cmwucGF0aCA9IHRoaXMuYmFzZS5wYXRoLnNsaWNlKCk7XHJcbiAgICAgIHRoaXMudXJsLnF1ZXJ5ID0gXCJcIjtcclxuICAgICAgdGhpcy5zdGF0ZSA9IFwicXVlcnlcIjtcclxuICAgIH0gZWxzZSBpZiAoYyA9PT0gMzUpIHtcclxuICAgICAgdGhpcy51cmwuaG9zdCA9IHRoaXMuYmFzZS5ob3N0O1xyXG4gICAgICB0aGlzLnVybC5wYXRoID0gdGhpcy5iYXNlLnBhdGguc2xpY2UoKTtcclxuICAgICAgdGhpcy51cmwucXVlcnkgPSB0aGlzLmJhc2UucXVlcnk7XHJcbiAgICAgIHRoaXMudXJsLmZyYWdtZW50ID0gXCJcIjtcclxuICAgICAgdGhpcy5zdGF0ZSA9IFwiZnJhZ21lbnRcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLmlucHV0Lmxlbmd0aCAtIHRoaXMucG9pbnRlciAtIDEgPT09IDAgfHwgLy8gcmVtYWluaW5nIGNvbnNpc3RzIG9mIDAgY29kZSBwb2ludHNcclxuICAgICAgICAgICFpc1dpbmRvd3NEcml2ZUxldHRlckNvZGVQb2ludHMoYywgdGhpcy5pbnB1dFt0aGlzLnBvaW50ZXIgKyAxXSkgfHxcclxuICAgICAgICAgICh0aGlzLmlucHV0Lmxlbmd0aCAtIHRoaXMucG9pbnRlciAtIDEgPj0gMiAmJiAvLyByZW1haW5pbmcgaGFzIGF0IGxlYXN0IDIgY29kZSBwb2ludHNcclxuICAgICAgICAgICAhZmlsZU90aGVyd2lzZUNvZGVQb2ludHMuaGFzKHRoaXMuaW5wdXRbdGhpcy5wb2ludGVyICsgMl0pKSkge1xyXG4gICAgICAgIHRoaXMudXJsLmhvc3QgPSB0aGlzLmJhc2UuaG9zdDtcclxuICAgICAgICB0aGlzLnVybC5wYXRoID0gdGhpcy5iYXNlLnBhdGguc2xpY2UoKTtcclxuICAgICAgICBzaG9ydGVuUGF0aCh0aGlzLnVybCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdGF0ZSA9IFwicGF0aFwiO1xyXG4gICAgICAtLXRoaXMucG9pbnRlcjtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwicGF0aFwiO1xyXG4gICAgLS10aGlzLnBvaW50ZXI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblVSTFN0YXRlTWFjaGluZS5wcm90b3R5cGVbXCJwYXJzZSBmaWxlIHNsYXNoXCJdID0gZnVuY3Rpb24gcGFyc2VGaWxlU2xhc2goYykge1xyXG4gIGlmIChjID09PSA0NyB8fCBjID09PSA5Mikge1xyXG4gICAgaWYgKGMgPT09IDkyKSB7XHJcbiAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXRlID0gXCJmaWxlIGhvc3RcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHRoaXMuYmFzZSAhPT0gbnVsbCAmJiB0aGlzLmJhc2Uuc2NoZW1lID09PSBcImZpbGVcIikge1xyXG4gICAgICBpZiAoaXNOb3JtYWxpemVkV2luZG93c0RyaXZlTGV0dGVyU3RyaW5nKHRoaXMuYmFzZS5wYXRoWzBdKSkge1xyXG4gICAgICAgIHRoaXMudXJsLnBhdGgucHVzaCh0aGlzLmJhc2UucGF0aFswXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy51cmwuaG9zdCA9IHRoaXMuYmFzZS5ob3N0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXRlID0gXCJwYXRoXCI7XHJcbiAgICAtLXRoaXMucG9pbnRlcjtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIGZpbGUgaG9zdFwiXSA9IGZ1bmN0aW9uIHBhcnNlRmlsZUhvc3QoYywgY1N0cikge1xyXG4gIGlmIChpc05hTihjKSB8fCBjID09PSA0NyB8fCBjID09PSA5MiB8fCBjID09PSA2MyB8fCBjID09PSAzNSkge1xyXG4gICAgLS10aGlzLnBvaW50ZXI7XHJcbiAgICBpZiAoIXRoaXMuc3RhdGVPdmVycmlkZSAmJiBpc1dpbmRvd3NEcml2ZUxldHRlclN0cmluZyh0aGlzLmJ1ZmZlcikpIHtcclxuICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5zdGF0ZSA9IFwicGF0aFwiO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmJ1ZmZlciA9PT0gXCJcIikge1xyXG4gICAgICB0aGlzLnVybC5ob3N0ID0gXCJcIjtcclxuICAgICAgaWYgKHRoaXMuc3RhdGVPdmVycmlkZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnN0YXRlID0gXCJwYXRoIHN0YXJ0XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgaG9zdCA9IHBhcnNlSG9zdCh0aGlzLmJ1ZmZlciwgaXNTcGVjaWFsKHRoaXMudXJsKSk7XHJcbiAgICAgIGlmIChob3N0ID09PSBmYWlsdXJlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhaWx1cmU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGhvc3QgPT09IFwibG9jYWxob3N0XCIpIHtcclxuICAgICAgICBob3N0ID0gXCJcIjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVybC5ob3N0ID0gaG9zdDtcclxuXHJcbiAgICAgIGlmICh0aGlzLnN0YXRlT3ZlcnJpZGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnVmZmVyID0gXCJcIjtcclxuICAgICAgdGhpcy5zdGF0ZSA9IFwicGF0aCBzdGFydFwiO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLmJ1ZmZlciArPSBjU3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5VUkxTdGF0ZU1hY2hpbmUucHJvdG90eXBlW1wicGFyc2UgcGF0aCBzdGFydFwiXSA9IGZ1bmN0aW9uIHBhcnNlUGF0aFN0YXJ0KGMpIHtcclxuICBpZiAoaXNTcGVjaWFsKHRoaXMudXJsKSkge1xyXG4gICAgaWYgKGMgPT09IDkyKSB7XHJcbiAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXRlID0gXCJwYXRoXCI7XHJcblxyXG4gICAgaWYgKGMgIT09IDQ3ICYmIGMgIT09IDkyKSB7XHJcbiAgICAgIC0tdGhpcy5wb2ludGVyO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGVPdmVycmlkZSAmJiBjID09PSA2Mykge1xyXG4gICAgdGhpcy51cmwucXVlcnkgPSBcIlwiO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwicXVlcnlcIjtcclxuICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlT3ZlcnJpZGUgJiYgYyA9PT0gMzUpIHtcclxuICAgIHRoaXMudXJsLmZyYWdtZW50ID0gXCJcIjtcclxuICAgIHRoaXMuc3RhdGUgPSBcImZyYWdtZW50XCI7XHJcbiAgfSBlbHNlIGlmIChjICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBcInBhdGhcIjtcclxuICAgIGlmIChjICE9PSA0Nykge1xyXG4gICAgICAtLXRoaXMucG9pbnRlcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIHBhdGhcIl0gPSBmdW5jdGlvbiBwYXJzZVBhdGgoYykge1xyXG4gIGlmIChpc05hTihjKSB8fCBjID09PSA0NyB8fCAoaXNTcGVjaWFsKHRoaXMudXJsKSAmJiBjID09PSA5MikgfHxcclxuICAgICAgKCF0aGlzLnN0YXRlT3ZlcnJpZGUgJiYgKGMgPT09IDYzIHx8IGMgPT09IDM1KSkpIHtcclxuICAgIGlmIChpc1NwZWNpYWwodGhpcy51cmwpICYmIGMgPT09IDkyKSB7XHJcbiAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzRG91YmxlRG90KHRoaXMuYnVmZmVyKSkge1xyXG4gICAgICBzaG9ydGVuUGF0aCh0aGlzLnVybCk7XHJcbiAgICAgIGlmIChjICE9PSA0NyAmJiAhKGlzU3BlY2lhbCh0aGlzLnVybCkgJiYgYyA9PT0gOTIpKSB7XHJcbiAgICAgICAgdGhpcy51cmwucGF0aC5wdXNoKFwiXCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzU2luZ2xlRG90KHRoaXMuYnVmZmVyKSAmJiBjICE9PSA0NyAmJlxyXG4gICAgICAgICAgICAgICAhKGlzU3BlY2lhbCh0aGlzLnVybCkgJiYgYyA9PT0gOTIpKSB7XHJcbiAgICAgIHRoaXMudXJsLnBhdGgucHVzaChcIlwiKTtcclxuICAgIH0gZWxzZSBpZiAoIWlzU2luZ2xlRG90KHRoaXMuYnVmZmVyKSkge1xyXG4gICAgICBpZiAodGhpcy51cmwuc2NoZW1lID09PSBcImZpbGVcIiAmJiB0aGlzLnVybC5wYXRoLmxlbmd0aCA9PT0gMCAmJiBpc1dpbmRvd3NEcml2ZUxldHRlclN0cmluZyh0aGlzLmJ1ZmZlcikpIHtcclxuICAgICAgICBpZiAodGhpcy51cmwuaG9zdCAhPT0gXCJcIiAmJiB0aGlzLnVybC5ob3N0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy51cmwuaG9zdCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnVmZmVyID0gdGhpcy5idWZmZXJbMF0gKyBcIjpcIjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVybC5wYXRoLnB1c2godGhpcy5idWZmZXIpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5idWZmZXIgPSBcIlwiO1xyXG4gICAgaWYgKHRoaXMudXJsLnNjaGVtZSA9PT0gXCJmaWxlXCIgJiYgKGMgPT09IHVuZGVmaW5lZCB8fCBjID09PSA2MyB8fCBjID09PSAzNSkpIHtcclxuICAgICAgd2hpbGUgKHRoaXMudXJsLnBhdGgubGVuZ3RoID4gMSAmJiB0aGlzLnVybC5wYXRoWzBdID09PSBcIlwiKSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnVybC5wYXRoLnNoaWZ0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChjID09PSA2Mykge1xyXG4gICAgICB0aGlzLnVybC5xdWVyeSA9IFwiXCI7XHJcbiAgICAgIHRoaXMuc3RhdGUgPSBcInF1ZXJ5XCI7XHJcbiAgICB9XHJcbiAgICBpZiAoYyA9PT0gMzUpIHtcclxuICAgICAgdGhpcy51cmwuZnJhZ21lbnQgPSBcIlwiO1xyXG4gICAgICB0aGlzLnN0YXRlID0gXCJmcmFnbWVudFwiO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBUT0RPOiBJZiBjIGlzIG5vdCBhIFVSTCBjb2RlIHBvaW50IGFuZCBub3QgXCIlXCIsIHBhcnNlIGVycm9yLlxyXG5cclxuICAgIGlmIChjID09PSAzNyAmJlxyXG4gICAgICAoIWlzQVNDSUlIZXgodGhpcy5pbnB1dFt0aGlzLnBvaW50ZXIgKyAxXSkgfHxcclxuICAgICAgICAhaXNBU0NJSUhleCh0aGlzLmlucHV0W3RoaXMucG9pbnRlciArIDJdKSkpIHtcclxuICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1ZmZlciArPSBwZXJjZW50RW5jb2RlQ2hhcihjLCBpc1BhdGhQZXJjZW50RW5jb2RlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIGNhbm5vdC1iZS1hLWJhc2UtVVJMIHBhdGhcIl0gPSBmdW5jdGlvbiBwYXJzZUNhbm5vdEJlQUJhc2VVUkxQYXRoKGMpIHtcclxuICBpZiAoYyA9PT0gNjMpIHtcclxuICAgIHRoaXMudXJsLnF1ZXJ5ID0gXCJcIjtcclxuICAgIHRoaXMuc3RhdGUgPSBcInF1ZXJ5XCI7XHJcbiAgfSBlbHNlIGlmIChjID09PSAzNSkge1xyXG4gICAgdGhpcy51cmwuZnJhZ21lbnQgPSBcIlwiO1xyXG4gICAgdGhpcy5zdGF0ZSA9IFwiZnJhZ21lbnRcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gVE9ETzogQWRkOiBub3QgYSBVUkwgY29kZSBwb2ludFxyXG4gICAgaWYgKCFpc05hTihjKSAmJiBjICE9PSAzNykge1xyXG4gICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjID09PSAzNyAmJlxyXG4gICAgICAgICghaXNBU0NJSUhleCh0aGlzLmlucHV0W3RoaXMucG9pbnRlciArIDFdKSB8fFxyXG4gICAgICAgICAhaXNBU0NJSUhleCh0aGlzLmlucHV0W3RoaXMucG9pbnRlciArIDJdKSkpIHtcclxuICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWlzTmFOKGMpKSB7XHJcbiAgICAgIHRoaXMudXJsLnBhdGhbMF0gPSB0aGlzLnVybC5wYXRoWzBdICsgcGVyY2VudEVuY29kZUNoYXIoYywgaXNDMENvbnRyb2xQZXJjZW50RW5jb2RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIHF1ZXJ5XCJdID0gZnVuY3Rpb24gcGFyc2VRdWVyeShjLCBjU3RyKSB7XHJcbiAgaWYgKGlzTmFOKGMpIHx8ICghdGhpcy5zdGF0ZU92ZXJyaWRlICYmIGMgPT09IDM1KSkge1xyXG4gICAgaWYgKCFpc1NwZWNpYWwodGhpcy51cmwpIHx8IHRoaXMudXJsLnNjaGVtZSA9PT0gXCJ3c1wiIHx8IHRoaXMudXJsLnNjaGVtZSA9PT0gXCJ3c3NcIikge1xyXG4gICAgICB0aGlzLmVuY29kaW5nT3ZlcnJpZGUgPSBcInV0Zi04XCI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcih0aGlzLmJ1ZmZlcik7IC8vIFRPRE86IFVzZSBlbmNvZGluZyBvdmVycmlkZSBpbnN0ZWFkXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICBpZiAoYnVmZmVyW2ldIDwgMHgyMSB8fCBidWZmZXJbaV0gPiAweDdFIHx8IGJ1ZmZlcltpXSA9PT0gMHgyMiB8fCBidWZmZXJbaV0gPT09IDB4MjMgfHxcclxuICAgICAgICAgIGJ1ZmZlcltpXSA9PT0gMHgzQyB8fCBidWZmZXJbaV0gPT09IDB4M0UpIHtcclxuICAgICAgICB0aGlzLnVybC5xdWVyeSArPSBwZXJjZW50RW5jb2RlKGJ1ZmZlcltpXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy51cmwucXVlcnkgKz0gU3RyaW5nLmZyb21Db2RlUG9pbnQoYnVmZmVyW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYnVmZmVyID0gXCJcIjtcclxuICAgIGlmIChjID09PSAzNSkge1xyXG4gICAgICB0aGlzLnVybC5mcmFnbWVudCA9IFwiXCI7XHJcbiAgICAgIHRoaXMuc3RhdGUgPSBcImZyYWdtZW50XCI7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFRPRE86IElmIGMgaXMgbm90IGEgVVJMIGNvZGUgcG9pbnQgYW5kIG5vdCBcIiVcIiwgcGFyc2UgZXJyb3IuXHJcbiAgICBpZiAoYyA9PT0gMzcgJiZcclxuICAgICAgKCFpc0FTQ0lJSGV4KHRoaXMuaW5wdXRbdGhpcy5wb2ludGVyICsgMV0pIHx8XHJcbiAgICAgICAgIWlzQVNDSUlIZXgodGhpcy5pbnB1dFt0aGlzLnBvaW50ZXIgKyAyXSkpKSB7XHJcbiAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWZmZXIgKz0gY1N0cjtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuVVJMU3RhdGVNYWNoaW5lLnByb3RvdHlwZVtcInBhcnNlIGZyYWdtZW50XCJdID0gZnVuY3Rpb24gcGFyc2VGcmFnbWVudChjKSB7XHJcbiAgaWYgKGlzTmFOKGMpKSB7IC8vIGRvIG5vdGhpbmdcclxuICB9IGVsc2UgaWYgKGMgPT09IDB4MCkge1xyXG4gICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gVE9ETzogSWYgYyBpcyBub3QgYSBVUkwgY29kZSBwb2ludCBhbmQgbm90IFwiJVwiLCBwYXJzZSBlcnJvci5cclxuICAgIGlmIChjID09PSAzNyAmJlxyXG4gICAgICAoIWlzQVNDSUlIZXgodGhpcy5pbnB1dFt0aGlzLnBvaW50ZXIgKyAxXSkgfHxcclxuICAgICAgICAhaXNBU0NJSUhleCh0aGlzLmlucHV0W3RoaXMucG9pbnRlciArIDJdKSkpIHtcclxuICAgICAgdGhpcy5wYXJzZUVycm9yID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVybC5mcmFnbWVudCArPSBwZXJjZW50RW5jb2RlQ2hhcihjLCBpc0MwQ29udHJvbFBlcmNlbnRFbmNvZGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBzZXJpYWxpemVVUkwodXJsLCBleGNsdWRlRnJhZ21lbnQpIHtcclxuICBsZXQgb3V0cHV0ID0gdXJsLnNjaGVtZSArIFwiOlwiO1xyXG4gIGlmICh1cmwuaG9zdCAhPT0gbnVsbCkge1xyXG4gICAgb3V0cHV0ICs9IFwiLy9cIjtcclxuXHJcbiAgICBpZiAodXJsLnVzZXJuYW1lICE9PSBcIlwiIHx8IHVybC5wYXNzd29yZCAhPT0gXCJcIikge1xyXG4gICAgICBvdXRwdXQgKz0gdXJsLnVzZXJuYW1lO1xyXG4gICAgICBpZiAodXJsLnBhc3N3b3JkICE9PSBcIlwiKSB7XHJcbiAgICAgICAgb3V0cHV0ICs9IFwiOlwiICsgdXJsLnBhc3N3b3JkO1xyXG4gICAgICB9XHJcbiAgICAgIG91dHB1dCArPSBcIkBcIjtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXQgKz0gc2VyaWFsaXplSG9zdCh1cmwuaG9zdCk7XHJcblxyXG4gICAgaWYgKHVybC5wb3J0ICE9PSBudWxsKSB7XHJcbiAgICAgIG91dHB1dCArPSBcIjpcIiArIHVybC5wb3J0O1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAodXJsLmhvc3QgPT09IG51bGwgJiYgdXJsLnNjaGVtZSA9PT0gXCJmaWxlXCIpIHtcclxuICAgIG91dHB1dCArPSBcIi8vXCI7XHJcbiAgfVxyXG5cclxuICBpZiAodXJsLmNhbm5vdEJlQUJhc2VVUkwpIHtcclxuICAgIG91dHB1dCArPSB1cmwucGF0aFswXTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9yIChjb25zdCBzdHJpbmcgb2YgdXJsLnBhdGgpIHtcclxuICAgICAgb3V0cHV0ICs9IFwiL1wiICsgc3RyaW5nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHVybC5xdWVyeSAhPT0gbnVsbCkge1xyXG4gICAgb3V0cHV0ICs9IFwiP1wiICsgdXJsLnF1ZXJ5O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFleGNsdWRlRnJhZ21lbnQgJiYgdXJsLmZyYWdtZW50ICE9PSBudWxsKSB7XHJcbiAgICBvdXRwdXQgKz0gXCIjXCIgKyB1cmwuZnJhZ21lbnQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0cHV0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXJpYWxpemVPcmlnaW4odHVwbGUpIHtcclxuICBsZXQgcmVzdWx0ID0gdHVwbGUuc2NoZW1lICsgXCI6Ly9cIjtcclxuICByZXN1bHQgKz0gc2VyaWFsaXplSG9zdCh0dXBsZS5ob3N0KTtcclxuXHJcbiAgaWYgKHR1cGxlLnBvcnQgIT09IG51bGwpIHtcclxuICAgIHJlc3VsdCArPSBcIjpcIiArIHR1cGxlLnBvcnQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zZXJpYWxpemVVUkwgPSBzZXJpYWxpemVVUkw7XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zZXJpYWxpemVVUkxPcmlnaW4gPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgLy8gaHR0cHM6Ly91cmwuc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LXVybC1vcmlnaW5cclxuICBzd2l0Y2ggKHVybC5zY2hlbWUpIHtcclxuICAgIGNhc2UgXCJibG9iXCI6XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzLnNlcmlhbGl6ZVVSTE9yaWdpbihtb2R1bGUuZXhwb3J0cy5wYXJzZVVSTCh1cmwucGF0aFswXSkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gc2VyaWFsaXppbmcgYW4gb3BhcXVlIG9yaWdpbiByZXR1cm5zIFwibnVsbFwiXHJcbiAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gICAgICB9XHJcbiAgICBjYXNlIFwiZnRwXCI6XHJcbiAgICBjYXNlIFwiZ29waGVyXCI6XHJcbiAgICBjYXNlIFwiaHR0cFwiOlxyXG4gICAgY2FzZSBcImh0dHBzXCI6XHJcbiAgICBjYXNlIFwid3NcIjpcclxuICAgIGNhc2UgXCJ3c3NcIjpcclxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZU9yaWdpbih7XHJcbiAgICAgICAgc2NoZW1lOiB1cmwuc2NoZW1lLFxyXG4gICAgICAgIGhvc3Q6IHVybC5ob3N0LFxyXG4gICAgICAgIHBvcnQ6IHVybC5wb3J0XHJcbiAgICAgIH0pO1xyXG4gICAgY2FzZSBcImZpbGVcIjpcclxuICAgICAgLy8gc3BlYyBzYXlzIFwiZXhlcmNpc2UgdG8gdGhlIHJlYWRlclwiLCBjaHJvbWUgc2F5cyBcImZpbGU6Ly9cIlxyXG4gICAgICByZXR1cm4gXCJmaWxlOi8vXCI7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICAvLyBzZXJpYWxpemluZyBhbiBvcGFxdWUgb3JpZ2luIHJldHVybnMgXCJudWxsXCJcclxuICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmJhc2ljVVJMUGFyc2UgPSBmdW5jdGlvbiAoaW5wdXQsIG9wdGlvbnMpIHtcclxuICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBvcHRpb25zID0ge307XHJcbiAgfVxyXG5cclxuICBjb25zdCB1c20gPSBuZXcgVVJMU3RhdGVNYWNoaW5lKGlucHV0LCBvcHRpb25zLmJhc2VVUkwsIG9wdGlvbnMuZW5jb2RpbmdPdmVycmlkZSwgb3B0aW9ucy51cmwsIG9wdGlvbnMuc3RhdGVPdmVycmlkZSk7XHJcbiAgaWYgKHVzbS5mYWlsdXJlKSB7XHJcbiAgICByZXR1cm4gXCJmYWlsdXJlXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXNtLnVybDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldFRoZVVzZXJuYW1lID0gZnVuY3Rpb24gKHVybCwgdXNlcm5hbWUpIHtcclxuICB1cmwudXNlcm5hbWUgPSBcIlwiO1xyXG4gIGNvbnN0IGRlY29kZWQgPSBwdW55Y29kZS51Y3MyLmRlY29kZSh1c2VybmFtZSk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWNvZGVkLmxlbmd0aDsgKytpKSB7XHJcbiAgICB1cmwudXNlcm5hbWUgKz0gcGVyY2VudEVuY29kZUNoYXIoZGVjb2RlZFtpXSwgaXNVc2VyaW5mb1BlcmNlbnRFbmNvZGUpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldFRoZVBhc3N3b3JkID0gZnVuY3Rpb24gKHVybCwgcGFzc3dvcmQpIHtcclxuICB1cmwucGFzc3dvcmQgPSBcIlwiO1xyXG4gIGNvbnN0IGRlY29kZWQgPSBwdW55Y29kZS51Y3MyLmRlY29kZShwYXNzd29yZCk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWNvZGVkLmxlbmd0aDsgKytpKSB7XHJcbiAgICB1cmwucGFzc3dvcmQgKz0gcGVyY2VudEVuY29kZUNoYXIoZGVjb2RlZFtpXSwgaXNVc2VyaW5mb1BlcmNlbnRFbmNvZGUpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNlcmlhbGl6ZUhvc3QgPSBzZXJpYWxpemVIb3N0O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY2Fubm90SGF2ZUFVc2VybmFtZVBhc3N3b3JkUG9ydCA9IGNhbm5vdEhhdmVBVXNlcm5hbWVQYXNzd29yZFBvcnQ7XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zZXJpYWxpemVJbnRlZ2VyID0gZnVuY3Rpb24gKGludGVnZXIpIHtcclxuICByZXR1cm4gU3RyaW5nKGludGVnZXIpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucGFyc2VVUkwgPSBmdW5jdGlvbiAoaW5wdXQsIG9wdGlvbnMpIHtcclxuICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBvcHRpb25zID0ge307XHJcbiAgfVxyXG5cclxuICAvLyBXZSBkb24ndCBoYW5kbGUgYmxvYnMsIHNvIHRoaXMganVzdCBkZWxlZ2F0ZXM6XHJcbiAgcmV0dXJuIG1vZHVsZS5leHBvcnRzLmJhc2ljVVJMUGFyc2UoaW5wdXQsIHsgYmFzZVVSTDogb3B0aW9ucy5iYXNlVVJMLCBlbmNvZGluZ092ZXJyaWRlOiBvcHRpb25zLmVuY29kaW5nT3ZlcnJpZGUgfSk7XHJcbn07XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IHVzbSA9IHJlcXVpcmUoXCIuL3VybC1zdGF0ZS1tYWNoaW5lXCIpO1xuXG5leHBvcnRzLmltcGxlbWVudGF0aW9uID0gY2xhc3MgVVJMSW1wbCB7XG4gIGNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yQXJncykge1xuICAgIGNvbnN0IHVybCA9IGNvbnN0cnVjdG9yQXJnc1swXTtcbiAgICBjb25zdCBiYXNlID0gY29uc3RydWN0b3JBcmdzWzFdO1xuXG4gICAgbGV0IHBhcnNlZEJhc2UgPSBudWxsO1xuICAgIGlmIChiYXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHBhcnNlZEJhc2UgPSB1c20uYmFzaWNVUkxQYXJzZShiYXNlKTtcbiAgICAgIGlmIChwYXJzZWRCYXNlID09PSBcImZhaWx1cmVcIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBiYXNlIFVSTFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwYXJzZWRVUkwgPSB1c20uYmFzaWNVUkxQYXJzZSh1cmwsIHsgYmFzZVVSTDogcGFyc2VkQmFzZSB9KTtcbiAgICBpZiAocGFyc2VkVVJMID09PSBcImZhaWx1cmVcIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgVVJMXCIpO1xuICAgIH1cblxuICAgIHRoaXMuX3VybCA9IHBhcnNlZFVSTDtcblxuICAgIC8vIFRPRE86IHF1ZXJ5IHN0dWZmXG4gIH1cblxuICBnZXQgaHJlZigpIHtcbiAgICByZXR1cm4gdXNtLnNlcmlhbGl6ZVVSTCh0aGlzLl91cmwpO1xuICB9XG5cbiAgc2V0IGhyZWYodikge1xuICAgIGNvbnN0IHBhcnNlZFVSTCA9IHVzbS5iYXNpY1VSTFBhcnNlKHYpO1xuICAgIGlmIChwYXJzZWRVUkwgPT09IFwiZmFpbHVyZVwiKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBVUkxcIik7XG4gICAgfVxuXG4gICAgdGhpcy5fdXJsID0gcGFyc2VkVVJMO1xuICB9XG5cbiAgZ2V0IG9yaWdpbigpIHtcbiAgICByZXR1cm4gdXNtLnNlcmlhbGl6ZVVSTE9yaWdpbih0aGlzLl91cmwpO1xuICB9XG5cbiAgZ2V0IHByb3RvY29sKCkge1xuICAgIHJldHVybiB0aGlzLl91cmwuc2NoZW1lICsgXCI6XCI7XG4gIH1cblxuICBzZXQgcHJvdG9jb2wodikge1xuICAgIHVzbS5iYXNpY1VSTFBhcnNlKHYgKyBcIjpcIiwgeyB1cmw6IHRoaXMuX3VybCwgc3RhdGVPdmVycmlkZTogXCJzY2hlbWUgc3RhcnRcIiB9KTtcbiAgfVxuXG4gIGdldCB1c2VybmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsLnVzZXJuYW1lO1xuICB9XG5cbiAgc2V0IHVzZXJuYW1lKHYpIHtcbiAgICBpZiAodXNtLmNhbm5vdEhhdmVBVXNlcm5hbWVQYXNzd29yZFBvcnQodGhpcy5fdXJsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVzbS5zZXRUaGVVc2VybmFtZSh0aGlzLl91cmwsIHYpO1xuICB9XG5cbiAgZ2V0IHBhc3N3b3JkKCkge1xuICAgIHJldHVybiB0aGlzLl91cmwucGFzc3dvcmQ7XG4gIH1cblxuICBzZXQgcGFzc3dvcmQodikge1xuICAgIGlmICh1c20uY2Fubm90SGF2ZUFVc2VybmFtZVBhc3N3b3JkUG9ydCh0aGlzLl91cmwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdXNtLnNldFRoZVBhc3N3b3JkKHRoaXMuX3VybCwgdik7XG4gIH1cblxuICBnZXQgaG9zdCgpIHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLl91cmw7XG5cbiAgICBpZiAodXJsLmhvc3QgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIGlmICh1cmwucG9ydCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVzbS5zZXJpYWxpemVIb3N0KHVybC5ob3N0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXNtLnNlcmlhbGl6ZUhvc3QodXJsLmhvc3QpICsgXCI6XCIgKyB1c20uc2VyaWFsaXplSW50ZWdlcih1cmwucG9ydCk7XG4gIH1cblxuICBzZXQgaG9zdCh2KSB7XG4gICAgaWYgKHRoaXMuX3VybC5jYW5ub3RCZUFCYXNlVVJMKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdXNtLmJhc2ljVVJMUGFyc2UodiwgeyB1cmw6IHRoaXMuX3VybCwgc3RhdGVPdmVycmlkZTogXCJob3N0XCIgfSk7XG4gIH1cblxuICBnZXQgaG9zdG5hbWUoKSB7XG4gICAgaWYgKHRoaXMuX3VybC5ob3N0ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gdXNtLnNlcmlhbGl6ZUhvc3QodGhpcy5fdXJsLmhvc3QpO1xuICB9XG5cbiAgc2V0IGhvc3RuYW1lKHYpIHtcbiAgICBpZiAodGhpcy5fdXJsLmNhbm5vdEJlQUJhc2VVUkwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB1c20uYmFzaWNVUkxQYXJzZSh2LCB7IHVybDogdGhpcy5fdXJsLCBzdGF0ZU92ZXJyaWRlOiBcImhvc3RuYW1lXCIgfSk7XG4gIH1cblxuICBnZXQgcG9ydCgpIHtcbiAgICBpZiAodGhpcy5fdXJsLnBvcnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIHJldHVybiB1c20uc2VyaWFsaXplSW50ZWdlcih0aGlzLl91cmwucG9ydCk7XG4gIH1cblxuICBzZXQgcG9ydCh2KSB7XG4gICAgaWYgKHVzbS5jYW5ub3RIYXZlQVVzZXJuYW1lUGFzc3dvcmRQb3J0KHRoaXMuX3VybCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gXCJcIikge1xuICAgICAgdGhpcy5fdXJsLnBvcnQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c20uYmFzaWNVUkxQYXJzZSh2LCB7IHVybDogdGhpcy5fdXJsLCBzdGF0ZU92ZXJyaWRlOiBcInBvcnRcIiB9KTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGF0aG5hbWUoKSB7XG4gICAgaWYgKHRoaXMuX3VybC5jYW5ub3RCZUFCYXNlVVJMKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLnBhdGhbMF07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3VybC5wYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiL1wiICsgdGhpcy5fdXJsLnBhdGguam9pbihcIi9cIik7XG4gIH1cblxuICBzZXQgcGF0aG5hbWUodikge1xuICAgIGlmICh0aGlzLl91cmwuY2Fubm90QmVBQmFzZVVSTCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3VybC5wYXRoID0gW107XG4gICAgdXNtLmJhc2ljVVJMUGFyc2UodiwgeyB1cmw6IHRoaXMuX3VybCwgc3RhdGVPdmVycmlkZTogXCJwYXRoIHN0YXJ0XCIgfSk7XG4gIH1cblxuICBnZXQgc2VhcmNoKCkge1xuICAgIGlmICh0aGlzLl91cmwucXVlcnkgPT09IG51bGwgfHwgdGhpcy5fdXJsLnF1ZXJ5ID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gXCI/XCIgKyB0aGlzLl91cmwucXVlcnk7XG4gIH1cblxuICBzZXQgc2VhcmNoKHYpIHtcbiAgICAvLyBUT0RPOiBxdWVyeSBzdHVmZlxuXG4gICAgY29uc3QgdXJsID0gdGhpcy5fdXJsO1xuXG4gICAgaWYgKHYgPT09IFwiXCIpIHtcbiAgICAgIHVybC5xdWVyeSA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXQgPSB2WzBdID09PSBcIj9cIiA/IHYuc3Vic3RyaW5nKDEpIDogdjtcbiAgICB1cmwucXVlcnkgPSBcIlwiO1xuICAgIHVzbS5iYXNpY1VSTFBhcnNlKGlucHV0LCB7IHVybCwgc3RhdGVPdmVycmlkZTogXCJxdWVyeVwiIH0pO1xuICB9XG5cbiAgZ2V0IGhhc2goKSB7XG4gICAgaWYgKHRoaXMuX3VybC5mcmFnbWVudCA9PT0gbnVsbCB8fCB0aGlzLl91cmwuZnJhZ21lbnQgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIHJldHVybiBcIiNcIiArIHRoaXMuX3VybC5mcmFnbWVudDtcbiAgfVxuXG4gIHNldCBoYXNoKHYpIHtcbiAgICBpZiAodiA9PT0gXCJcIikge1xuICAgICAgdGhpcy5fdXJsLmZyYWdtZW50ID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dCA9IHZbMF0gPT09IFwiI1wiID8gdi5zdWJzdHJpbmcoMSkgOiB2O1xuICAgIHRoaXMuX3VybC5mcmFnbWVudCA9IFwiXCI7XG4gICAgdXNtLmJhc2ljVVJMUGFyc2UoaW5wdXQsIHsgdXJsOiB0aGlzLl91cmwsIHN0YXRlT3ZlcnJpZGU6IFwiZnJhZ21lbnRcIiB9KTtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy5ocmVmO1xuICB9XG59O1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBjb252ZXJzaW9ucyA9IHJlcXVpcmUoXCJ3ZWJpZGwtY29udmVyc2lvbnNcIik7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpO1xuY29uc3QgSW1wbCA9IHJlcXVpcmUoXCIuLy9VUkwtaW1wbC5qc1wiKTtcblxuY29uc3QgaW1wbCA9IHV0aWxzLmltcGxTeW1ib2w7XG5cbmZ1bmN0aW9uIFVSTCh1cmwpIHtcbiAgaWYgKCF0aGlzIHx8IHRoaXNbaW1wbF0gfHwgISh0aGlzIGluc3RhbmNlb2YgVVJMKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdVUkwnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBET00gb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG4gIH1cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1VSTCc6IDEgYXJndW1lbnQgcmVxdWlyZWQsIGJ1dCBvbmx5IFwiICsgYXJndW1lbnRzLmxlbmd0aCArIFwiIHByZXNlbnQuXCIpO1xuICB9XG4gIGNvbnN0IGFyZ3MgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoICYmIGkgPCAyOyArK2kpIHtcbiAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICB9XG4gIGFyZ3NbMF0gPSBjb252ZXJzaW9uc1tcIlVTVlN0cmluZ1wiXShhcmdzWzBdKTtcbiAgaWYgKGFyZ3NbMV0gIT09IHVuZGVmaW5lZCkge1xuICBhcmdzWzFdID0gY29udmVyc2lvbnNbXCJVU1ZTdHJpbmdcIl0oYXJnc1sxXSk7XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cy5zZXR1cCh0aGlzLCBhcmdzKTtcbn1cblxuVVJMLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gIGlmICghdGhpcyB8fCAhbW9kdWxlLmV4cG9ydHMuaXModGhpcykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSWxsZWdhbCBpbnZvY2F0aW9uXCIpO1xuICB9XG4gIGNvbnN0IGFyZ3MgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoICYmIGkgPCAwOyArK2kpIHtcbiAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICB9XG4gIHJldHVybiB0aGlzW2ltcGxdLnRvSlNPTi5hcHBseSh0aGlzW2ltcGxdLCBhcmdzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVVJMLnByb3RvdHlwZSwgXCJocmVmXCIsIHtcbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzW2ltcGxdLmhyZWY7XG4gIH0sXG4gIHNldChWKSB7XG4gICAgViA9IGNvbnZlcnNpb25zW1wiVVNWU3RyaW5nXCJdKFYpO1xuICAgIHRoaXNbaW1wbF0uaHJlZiA9IFY7XG4gIH0sXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cblVSTC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcyB8fCAhbW9kdWxlLmV4cG9ydHMuaXModGhpcykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSWxsZWdhbCBpbnZvY2F0aW9uXCIpO1xuICB9XG4gIHJldHVybiB0aGlzLmhyZWY7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVVJMLnByb3RvdHlwZSwgXCJvcmlnaW5cIiwge1xuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXNbaW1wbF0ub3JpZ2luO1xuICB9LFxuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVVJMLnByb3RvdHlwZSwgXCJwcm90b2NvbFwiLCB7XG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpc1tpbXBsXS5wcm90b2NvbDtcbiAgfSxcbiAgc2V0KFYpIHtcbiAgICBWID0gY29udmVyc2lvbnNbXCJVU1ZTdHJpbmdcIl0oVik7XG4gICAgdGhpc1tpbXBsXS5wcm90b2NvbCA9IFY7XG4gIH0sXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShVUkwucHJvdG90eXBlLCBcInVzZXJuYW1lXCIsIHtcbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzW2ltcGxdLnVzZXJuYW1lO1xuICB9LFxuICBzZXQoVikge1xuICAgIFYgPSBjb252ZXJzaW9uc1tcIlVTVlN0cmluZ1wiXShWKTtcbiAgICB0aGlzW2ltcGxdLnVzZXJuYW1lID0gVjtcbiAgfSxcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFVSTC5wcm90b3R5cGUsIFwicGFzc3dvcmRcIiwge1xuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXNbaW1wbF0ucGFzc3dvcmQ7XG4gIH0sXG4gIHNldChWKSB7XG4gICAgViA9IGNvbnZlcnNpb25zW1wiVVNWU3RyaW5nXCJdKFYpO1xuICAgIHRoaXNbaW1wbF0ucGFzc3dvcmQgPSBWO1xuICB9LFxuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVVJMLnByb3RvdHlwZSwgXCJob3N0XCIsIHtcbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzW2ltcGxdLmhvc3Q7XG4gIH0sXG4gIHNldChWKSB7XG4gICAgViA9IGNvbnZlcnNpb25zW1wiVVNWU3RyaW5nXCJdKFYpO1xuICAgIHRoaXNbaW1wbF0uaG9zdCA9IFY7XG4gIH0sXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShVUkwucHJvdG90eXBlLCBcImhvc3RuYW1lXCIsIHtcbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzW2ltcGxdLmhvc3RuYW1lO1xuICB9LFxuICBzZXQoVikge1xuICAgIFYgPSBjb252ZXJzaW9uc1tcIlVTVlN0cmluZ1wiXShWKTtcbiAgICB0aGlzW2ltcGxdLmhvc3RuYW1lID0gVjtcbiAgfSxcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFVSTC5wcm90b3R5cGUsIFwicG9ydFwiLCB7XG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpc1tpbXBsXS5wb3J0O1xuICB9LFxuICBzZXQoVikge1xuICAgIFYgPSBjb252ZXJzaW9uc1tcIlVTVlN0cmluZ1wiXShWKTtcbiAgICB0aGlzW2ltcGxdLnBvcnQgPSBWO1xuICB9LFxuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVVJMLnByb3RvdHlwZSwgXCJwYXRobmFtZVwiLCB7XG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpc1tpbXBsXS5wYXRobmFtZTtcbiAgfSxcbiAgc2V0KFYpIHtcbiAgICBWID0gY29udmVyc2lvbnNbXCJVU1ZTdHJpbmdcIl0oVik7XG4gICAgdGhpc1tpbXBsXS5wYXRobmFtZSA9IFY7XG4gIH0sXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShVUkwucHJvdG90eXBlLCBcInNlYXJjaFwiLCB7XG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpc1tpbXBsXS5zZWFyY2g7XG4gIH0sXG4gIHNldChWKSB7XG4gICAgViA9IGNvbnZlcnNpb25zW1wiVVNWU3RyaW5nXCJdKFYpO1xuICAgIHRoaXNbaW1wbF0uc2VhcmNoID0gVjtcbiAgfSxcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFVSTC5wcm90b3R5cGUsIFwiaGFzaFwiLCB7XG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpc1tpbXBsXS5oYXNoO1xuICB9LFxuICBzZXQoVikge1xuICAgIFYgPSBjb252ZXJzaW9uc1tcIlVTVlN0cmluZ1wiXShWKTtcbiAgICB0aGlzW2ltcGxdLmhhc2ggPSBWO1xuICB9LFxuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpcyhvYmopIHtcbiAgICByZXR1cm4gISFvYmogJiYgb2JqW2ltcGxdIGluc3RhbmNlb2YgSW1wbC5pbXBsZW1lbnRhdGlvbjtcbiAgfSxcbiAgY3JlYXRlKGNvbnN0cnVjdG9yQXJncywgcHJpdmF0ZURhdGEpIHtcbiAgICBsZXQgb2JqID0gT2JqZWN0LmNyZWF0ZShVUkwucHJvdG90eXBlKTtcbiAgICB0aGlzLnNldHVwKG9iaiwgY29uc3RydWN0b3JBcmdzLCBwcml2YXRlRGF0YSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfSxcbiAgc2V0dXAob2JqLCBjb25zdHJ1Y3RvckFyZ3MsIHByaXZhdGVEYXRhKSB7XG4gICAgaWYgKCFwcml2YXRlRGF0YSkgcHJpdmF0ZURhdGEgPSB7fTtcbiAgICBwcml2YXRlRGF0YS53cmFwcGVyID0gb2JqO1xuXG4gICAgb2JqW2ltcGxdID0gbmV3IEltcGwuaW1wbGVtZW50YXRpb24oY29uc3RydWN0b3JBcmdzLCBwcml2YXRlRGF0YSk7XG4gICAgb2JqW2ltcGxdW3V0aWxzLndyYXBwZXJTeW1ib2xdID0gb2JqO1xuICB9LFxuICBpbnRlcmZhY2U6IFVSTCxcbiAgZXhwb3NlOiB7XG4gICAgV2luZG93OiB7IFVSTDogVVJMIH0sXG4gICAgV29ya2VyOiB7IFVSTDogVVJMIH1cbiAgfVxufTtcblxuIiwgIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLlVSTCA9IHJlcXVpcmUoXCIuL1VSTFwiKS5pbnRlcmZhY2U7XG5leHBvcnRzLnNlcmlhbGl6ZVVSTCA9IHJlcXVpcmUoXCIuL3VybC1zdGF0ZS1tYWNoaW5lXCIpLnNlcmlhbGl6ZVVSTDtcbmV4cG9ydHMuc2VyaWFsaXplVVJMT3JpZ2luID0gcmVxdWlyZShcIi4vdXJsLXN0YXRlLW1hY2hpbmVcIikuc2VyaWFsaXplVVJMT3JpZ2luO1xuZXhwb3J0cy5iYXNpY1VSTFBhcnNlID0gcmVxdWlyZShcIi4vdXJsLXN0YXRlLW1hY2hpbmVcIikuYmFzaWNVUkxQYXJzZTtcbmV4cG9ydHMuc2V0VGhlVXNlcm5hbWUgPSByZXF1aXJlKFwiLi91cmwtc3RhdGUtbWFjaGluZVwiKS5zZXRUaGVVc2VybmFtZTtcbmV4cG9ydHMuc2V0VGhlUGFzc3dvcmQgPSByZXF1aXJlKFwiLi91cmwtc3RhdGUtbWFjaGluZVwiKS5zZXRUaGVQYXNzd29yZDtcbmV4cG9ydHMuc2VyaWFsaXplSG9zdCA9IHJlcXVpcmUoXCIuL3VybC1zdGF0ZS1tYWNoaW5lXCIpLnNlcmlhbGl6ZUhvc3Q7XG5leHBvcnRzLnNlcmlhbGl6ZUludGVnZXIgPSByZXF1aXJlKFwiLi91cmwtc3RhdGUtbWFjaGluZVwiKS5zZXJpYWxpemVJbnRlZ2VyO1xuZXhwb3J0cy5wYXJzZVVSTCA9IHJlcXVpcmUoXCIuL3VybC1zdGF0ZS1tYWNoaW5lXCIpLnBhcnNlVVJMO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gX2ludGVyb3BEZWZhdWx0IChleCkgeyByZXR1cm4gKGV4ICYmICh0eXBlb2YgZXggPT09ICdvYmplY3QnKSAmJiAnZGVmYXVsdCcgaW4gZXgpID8gZXhbJ2RlZmF1bHQnXSA6IGV4OyB9XG5cbnZhciBTdHJlYW0gPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnc3RyZWFtJykpO1xudmFyIGh0dHAgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnaHR0cCcpKTtcbnZhciBVcmwgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgndXJsJykpO1xudmFyIHdoYXR3Z1VybCA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCd3aGF0d2ctdXJsJykpO1xudmFyIGh0dHBzID0gX2ludGVyb3BEZWZhdWx0KHJlcXVpcmUoJ2h0dHBzJykpO1xudmFyIHpsaWIgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnemxpYicpKTtcblxuLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL3RtcHZhci9qc2RvbS9ibG9iL2FhODViMmFiZjA3NzY2ZmY3YmY1YzFmNmRhYWZiMzcyNmYyZjJkYjUvbGliL2pzZG9tL2xpdmluZy9ibG9iLmpzXG5cbi8vIGZpeCBmb3IgXCJSZWFkYWJsZVwiIGlzbid0IGEgbmFtZWQgZXhwb3J0IGlzc3VlXG5jb25zdCBSZWFkYWJsZSA9IFN0cmVhbS5SZWFkYWJsZTtcblxuY29uc3QgQlVGRkVSID0gU3ltYm9sKCdidWZmZXInKTtcbmNvbnN0IFRZUEUgPSBTeW1ib2woJ3R5cGUnKTtcblxuY2xhc3MgQmxvYiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXNbVFlQRV0gPSAnJztcblxuXHRcdGNvbnN0IGJsb2JQYXJ0cyA9IGFyZ3VtZW50c1swXTtcblx0XHRjb25zdCBvcHRpb25zID0gYXJndW1lbnRzWzFdO1xuXG5cdFx0Y29uc3QgYnVmZmVycyA9IFtdO1xuXHRcdGxldCBzaXplID0gMDtcblxuXHRcdGlmIChibG9iUGFydHMpIHtcblx0XHRcdGNvbnN0IGEgPSBibG9iUGFydHM7XG5cdFx0XHRjb25zdCBsZW5ndGggPSBOdW1iZXIoYS5sZW5ndGgpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBlbGVtZW50ID0gYVtpXTtcblx0XHRcdFx0bGV0IGJ1ZmZlcjtcblx0XHRcdFx0aWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcblx0XHRcdFx0XHRidWZmZXIgPSBlbGVtZW50O1xuXHRcdFx0XHR9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhlbGVtZW50KSkge1xuXHRcdFx0XHRcdGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGVsZW1lbnQuYnVmZmVyLCBlbGVtZW50LmJ5dGVPZmZzZXQsIGVsZW1lbnQuYnl0ZUxlbmd0aCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG5cdFx0XHRcdFx0YnVmZmVyID0gQnVmZmVyLmZyb20oZWxlbWVudCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEJsb2IpIHtcblx0XHRcdFx0XHRidWZmZXIgPSBlbGVtZW50W0JVRkZFUl07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YnVmZmVyID0gQnVmZmVyLmZyb20odHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnID8gZWxlbWVudCA6IFN0cmluZyhlbGVtZW50KSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2l6ZSArPSBidWZmZXIubGVuZ3RoO1xuXHRcdFx0XHRidWZmZXJzLnB1c2goYnVmZmVyKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzW0JVRkZFUl0gPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuXG5cdFx0bGV0IHR5cGUgPSBvcHRpb25zICYmIG9wdGlvbnMudHlwZSAhPT0gdW5kZWZpbmVkICYmIFN0cmluZyhvcHRpb25zLnR5cGUpLnRvTG93ZXJDYXNlKCk7XG5cdFx0aWYgKHR5cGUgJiYgIS9bXlxcdTAwMjAtXFx1MDA3RV0vLnRlc3QodHlwZSkpIHtcblx0XHRcdHRoaXNbVFlQRV0gPSB0eXBlO1xuXHRcdH1cblx0fVxuXHRnZXQgc2l6ZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tCVUZGRVJdLmxlbmd0aDtcblx0fVxuXHRnZXQgdHlwZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tUWVBFXTtcblx0fVxuXHR0ZXh0KCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpc1tCVUZGRVJdLnRvU3RyaW5nKCkpO1xuXHR9XG5cdGFycmF5QnVmZmVyKCkge1xuXHRcdGNvbnN0IGJ1ZiA9IHRoaXNbQlVGRkVSXTtcblx0XHRjb25zdCBhYiA9IGJ1Zi5idWZmZXIuc2xpY2UoYnVmLmJ5dGVPZmZzZXQsIGJ1Zi5ieXRlT2Zmc2V0ICsgYnVmLmJ5dGVMZW5ndGgpO1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYWIpO1xuXHR9XG5cdHN0cmVhbSgpIHtcblx0XHRjb25zdCByZWFkYWJsZSA9IG5ldyBSZWFkYWJsZSgpO1xuXHRcdHJlYWRhYmxlLl9yZWFkID0gZnVuY3Rpb24gKCkge307XG5cdFx0cmVhZGFibGUucHVzaCh0aGlzW0JVRkZFUl0pO1xuXHRcdHJlYWRhYmxlLnB1c2gobnVsbCk7XG5cdFx0cmV0dXJuIHJlYWRhYmxlO1xuXHR9XG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiAnW29iamVjdCBCbG9iXSc7XG5cdH1cblx0c2xpY2UoKSB7XG5cdFx0Y29uc3Qgc2l6ZSA9IHRoaXMuc2l6ZTtcblxuXHRcdGNvbnN0IHN0YXJ0ID0gYXJndW1lbnRzWzBdO1xuXHRcdGNvbnN0IGVuZCA9IGFyZ3VtZW50c1sxXTtcblx0XHRsZXQgcmVsYXRpdmVTdGFydCwgcmVsYXRpdmVFbmQ7XG5cdFx0aWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJlbGF0aXZlU3RhcnQgPSAwO1xuXHRcdH0gZWxzZSBpZiAoc3RhcnQgPCAwKSB7XG5cdFx0XHRyZWxhdGl2ZVN0YXJ0ID0gTWF0aC5tYXgoc2l6ZSArIHN0YXJ0LCAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVsYXRpdmVTdGFydCA9IE1hdGgubWluKHN0YXJ0LCBzaXplKTtcblx0XHR9XG5cdFx0aWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZWxhdGl2ZUVuZCA9IHNpemU7XG5cdFx0fSBlbHNlIGlmIChlbmQgPCAwKSB7XG5cdFx0XHRyZWxhdGl2ZUVuZCA9IE1hdGgubWF4KHNpemUgKyBlbmQsIDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWxhdGl2ZUVuZCA9IE1hdGgubWluKGVuZCwgc2l6ZSk7XG5cdFx0fVxuXHRcdGNvbnN0IHNwYW4gPSBNYXRoLm1heChyZWxhdGl2ZUVuZCAtIHJlbGF0aXZlU3RhcnQsIDApO1xuXG5cdFx0Y29uc3QgYnVmZmVyID0gdGhpc1tCVUZGRVJdO1xuXHRcdGNvbnN0IHNsaWNlZEJ1ZmZlciA9IGJ1ZmZlci5zbGljZShyZWxhdGl2ZVN0YXJ0LCByZWxhdGl2ZVN0YXJ0ICsgc3Bhbik7XG5cdFx0Y29uc3QgYmxvYiA9IG5ldyBCbG9iKFtdLCB7IHR5cGU6IGFyZ3VtZW50c1syXSB9KTtcblx0XHRibG9iW0JVRkZFUl0gPSBzbGljZWRCdWZmZXI7XG5cdFx0cmV0dXJuIGJsb2I7XG5cdH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQmxvYi5wcm90b3R5cGUsIHtcblx0c2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHR5cGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRzbGljZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmxvYi5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuXHR2YWx1ZTogJ0Jsb2InLFxuXHR3cml0YWJsZTogZmFsc2UsXG5cdGVudW1lcmFibGU6IGZhbHNlLFxuXHRjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG4vKipcbiAqIGZldGNoLWVycm9yLmpzXG4gKlxuICogRmV0Y2hFcnJvciBpbnRlcmZhY2UgZm9yIG9wZXJhdGlvbmFsIGVycm9yc1xuICovXG5cbi8qKlxuICogQ3JlYXRlIEZldGNoRXJyb3IgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgICAgICBtZXNzYWdlICAgICAgRXJyb3IgbWVzc2FnZSBmb3IgaHVtYW5cbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIHR5cGUgICAgICAgICBFcnJvciB0eXBlIGZvciBtYWNoaW5lXG4gKiBAcGFyYW0gICBTdHJpbmcgICAgICBzeXN0ZW1FcnJvciAgRm9yIE5vZGUuanMgc3lzdGVtIGVycm9yXG4gKiBAcmV0dXJuICBGZXRjaEVycm9yXG4gKi9cbmZ1bmN0aW9uIEZldGNoRXJyb3IobWVzc2FnZSwgdHlwZSwgc3lzdGVtRXJyb3IpIHtcbiAgRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLnR5cGUgPSB0eXBlO1xuXG4gIC8vIHdoZW4gZXJyLnR5cGUgaXMgYHN5c3RlbWAsIGVyci5jb2RlIGNvbnRhaW5zIHN5c3RlbSBlcnJvciBjb2RlXG4gIGlmIChzeXN0ZW1FcnJvcikge1xuICAgIHRoaXMuY29kZSA9IHRoaXMuZXJybm8gPSBzeXN0ZW1FcnJvci5jb2RlO1xuICB9XG5cbiAgLy8gaGlkZSBjdXN0b20gZXJyb3IgaW1wbGVtZW50YXRpb24gZGV0YWlscyBmcm9tIGVuZC11c2Vyc1xuICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbn1cblxuRmV0Y2hFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5GZXRjaEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZldGNoRXJyb3I7XG5GZXRjaEVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0ZldGNoRXJyb3InO1xuXG5sZXQgY29udmVydDtcbnRyeSB7XG5cdGNvbnZlcnQgPSByZXF1aXJlKCdlbmNvZGluZycpLmNvbnZlcnQ7XG59IGNhdGNoIChlKSB7fVxuXG5jb25zdCBJTlRFUk5BTFMgPSBTeW1ib2woJ0JvZHkgaW50ZXJuYWxzJyk7XG5cbi8vIGZpeCBhbiBpc3N1ZSB3aGVyZSBcIlBhc3NUaHJvdWdoXCIgaXNuJ3QgYSBuYW1lZCBleHBvcnQgZm9yIG5vZGUgPDEwXG5jb25zdCBQYXNzVGhyb3VnaCA9IFN0cmVhbS5QYXNzVGhyb3VnaDtcblxuLyoqXG4gKiBCb2R5IG1peGluXG4gKlxuICogUmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jYm9keVxuICpcbiAqIEBwYXJhbSAgIFN0cmVhbSAgYm9keSAgUmVhZGFibGUgc3RyZWFtXG4gKiBAcGFyYW0gICBPYmplY3QgIG9wdHMgIFJlc3BvbnNlIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZnVuY3Rpb24gQm9keShib2R5KSB7XG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0dmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuXHQgICAgX3JlZiRzaXplID0gX3JlZi5zaXplO1xuXG5cdGxldCBzaXplID0gX3JlZiRzaXplID09PSB1bmRlZmluZWQgPyAwIDogX3JlZiRzaXplO1xuXHR2YXIgX3JlZiR0aW1lb3V0ID0gX3JlZi50aW1lb3V0O1xuXHRsZXQgdGltZW91dCA9IF9yZWYkdGltZW91dCA9PT0gdW5kZWZpbmVkID8gMCA6IF9yZWYkdGltZW91dDtcblxuXHRpZiAoYm9keSA9PSBudWxsKSB7XG5cdFx0Ly8gYm9keSBpcyB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdGJvZHkgPSBudWxsO1xuXHR9IGVsc2UgaWYgKGlzVVJMU2VhcmNoUGFyYW1zKGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBhIFVSTFNlYXJjaFBhcmFtc1xuXHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LnRvU3RyaW5nKCkpO1xuXHR9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkgOyBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIDsgZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nKSB7XG5cdFx0Ly8gYm9keSBpcyBBcnJheUJ1ZmZlclxuXHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5KTtcblx0fSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIEFycmF5QnVmZmVyVmlld1xuXHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LmJ1ZmZlciwgYm9keS5ieXRlT2Zmc2V0LCBib2R5LmJ5dGVMZW5ndGgpO1xuXHR9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pIDsgZWxzZSB7XG5cdFx0Ly8gbm9uZSBvZiB0aGUgYWJvdmVcblx0XHQvLyBjb2VyY2UgdG8gc3RyaW5nIHRoZW4gYnVmZmVyXG5cdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKFN0cmluZyhib2R5KSk7XG5cdH1cblx0dGhpc1tJTlRFUk5BTFNdID0ge1xuXHRcdGJvZHksXG5cdFx0ZGlzdHVyYmVkOiBmYWxzZSxcblx0XHRlcnJvcjogbnVsbFxuXHR9O1xuXHR0aGlzLnNpemUgPSBzaXplO1xuXHR0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuXG5cdGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0Ym9keS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRjb25zdCBlcnJvciA9IGVyci5uYW1lID09PSAnQWJvcnRFcnJvcicgPyBlcnIgOiBuZXcgRmV0Y2hFcnJvcihgSW52YWxpZCByZXNwb25zZSBib2R5IHdoaWxlIHRyeWluZyB0byBmZXRjaCAke190aGlzLnVybH06ICR7ZXJyLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycik7XG5cdFx0XHRfdGhpc1tJTlRFUk5BTFNdLmVycm9yID0gZXJyb3I7XG5cdFx0fSk7XG5cdH1cbn1cblxuQm9keS5wcm90b3R5cGUgPSB7XG5cdGdldCBib2R5KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uYm9keTtcblx0fSxcblxuXHRnZXQgYm9keVVzZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5kaXN0dXJiZWQ7XG5cdH0sXG5cblx0LyoqXG4gICogRGVjb2RlIHJlc3BvbnNlIGFzIEFycmF5QnVmZmVyXG4gICpcbiAgKiBAcmV0dXJuICBQcm9taXNlXG4gICovXG5cdGFycmF5QnVmZmVyKCkge1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpLnRoZW4oZnVuY3Rpb24gKGJ1Zikge1xuXHRcdFx0cmV0dXJuIGJ1Zi5idWZmZXIuc2xpY2UoYnVmLmJ5dGVPZmZzZXQsIGJ1Zi5ieXRlT2Zmc2V0ICsgYnVmLmJ5dGVMZW5ndGgpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuICAqIFJldHVybiByYXcgcmVzcG9uc2UgYXMgQmxvYlxuICAqXG4gICogQHJldHVybiBQcm9taXNlXG4gICovXG5cdGJsb2IoKSB7XG5cdFx0bGV0IGN0ID0gdGhpcy5oZWFkZXJzICYmIHRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpIHx8ICcnO1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpLnRoZW4oZnVuY3Rpb24gKGJ1Zikge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oXG5cdFx0XHQvLyBQcmV2ZW50IGNvcHlpbmdcblx0XHRcdG5ldyBCbG9iKFtdLCB7XG5cdFx0XHRcdHR5cGU6IGN0LnRvTG93ZXJDYXNlKClcblx0XHRcdH0pLCB7XG5cdFx0XHRcdFtCVUZGRVJdOiBidWZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuICAqIERlY29kZSByZXNwb25zZSBhcyBqc29uXG4gICpcbiAgKiBAcmV0dXJuICBQcm9taXNlXG4gICovXG5cdGpzb24oKSB7XG5cdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRyZXR1cm4gY29uc3VtZUJvZHkuY2FsbCh0aGlzKS50aGVuKGZ1bmN0aW9uIChidWZmZXIpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlci50b1N0cmluZygpKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlamVjdChuZXcgRmV0Y2hFcnJvcihgaW52YWxpZCBqc29uIHJlc3BvbnNlIGJvZHkgYXQgJHtfdGhpczIudXJsfSByZWFzb246ICR7ZXJyLm1lc3NhZ2V9YCwgJ2ludmFsaWQtanNvbicpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHQvKipcbiAgKiBEZWNvZGUgcmVzcG9uc2UgYXMgdGV4dFxuICAqXG4gICogQHJldHVybiAgUHJvbWlzZVxuICAqL1xuXHR0ZXh0KCkge1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpLnRoZW4oZnVuY3Rpb24gKGJ1ZmZlcikge1xuXHRcdFx0cmV0dXJuIGJ1ZmZlci50b1N0cmluZygpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuICAqIERlY29kZSByZXNwb25zZSBhcyBidWZmZXIgKG5vbi1zcGVjIGFwaSlcbiAgKlxuICAqIEByZXR1cm4gIFByb21pc2VcbiAgKi9cblx0YnVmZmVyKCkge1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpO1xuXHR9LFxuXG5cdC8qKlxuICAqIERlY29kZSByZXNwb25zZSBhcyB0ZXh0LCB3aGlsZSBhdXRvbWF0aWNhbGx5IGRldGVjdGluZyB0aGUgZW5jb2RpbmcgYW5kXG4gICogdHJ5aW5nIHRvIGRlY29kZSB0byBVVEYtOCAobm9uLXNwZWMgYXBpKVxuICAqXG4gICogQHJldHVybiAgUHJvbWlzZVxuICAqL1xuXHR0ZXh0Q29udmVydGVkKCkge1xuXHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIGNvbnN1bWVCb2R5LmNhbGwodGhpcykudGhlbihmdW5jdGlvbiAoYnVmZmVyKSB7XG5cdFx0XHRyZXR1cm4gY29udmVydEJvZHkoYnVmZmVyLCBfdGhpczMuaGVhZGVycyk7XG5cdFx0fSk7XG5cdH1cbn07XG5cbi8vIEluIGJyb3dzZXJzLCBhbGwgcHJvcGVydGllcyBhcmUgZW51bWVyYWJsZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEJvZHkucHJvdG90eXBlLCB7XG5cdGJvZHk6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRib2R5VXNlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGFycmF5QnVmZmVyOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0YmxvYjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGpzb246IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHR0ZXh0OiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5cbkJvZHkubWl4SW4gPSBmdW5jdGlvbiAocHJvdG8pIHtcblx0Zm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEJvZHkucHJvdG90eXBlKSkge1xuXHRcdC8vIGlzdGFuYnVsIGlnbm9yZSBlbHNlOiBmdXR1cmUgcHJvb2Zcblx0XHRpZiAoIShuYW1lIGluIHByb3RvKSkge1xuXHRcdFx0Y29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoQm9keS5wcm90b3R5cGUsIG5hbWUpO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCBkZXNjKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogQ29uc3VtZSBhbmQgY29udmVydCBhbiBlbnRpcmUgQm9keSB0byBhIEJ1ZmZlci5cbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHktY29uc3VtZS1ib2R5XG4gKlxuICogQHJldHVybiAgUHJvbWlzZVxuICovXG5mdW5jdGlvbiBjb25zdW1lQm9keSgpIHtcblx0dmFyIF90aGlzNCA9IHRoaXM7XG5cblx0aWYgKHRoaXNbSU5URVJOQUxTXS5kaXN0dXJiZWQpIHtcblx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKGBib2R5IHVzZWQgYWxyZWFkeSBmb3I6ICR7dGhpcy51cmx9YCkpO1xuXHR9XG5cblx0dGhpc1tJTlRFUk5BTFNdLmRpc3R1cmJlZCA9IHRydWU7XG5cblx0aWYgKHRoaXNbSU5URVJOQUxTXS5lcnJvcikge1xuXHRcdHJldHVybiBCb2R5LlByb21pc2UucmVqZWN0KHRoaXNbSU5URVJOQUxTXS5lcnJvcik7XG5cdH1cblxuXHRsZXQgYm9keSA9IHRoaXMuYm9keTtcblxuXHQvLyBib2R5IGlzIG51bGxcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlc29sdmUoQnVmZmVyLmFsbG9jKDApKTtcblx0fVxuXG5cdC8vIGJvZHkgaXMgYmxvYlxuXHRpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0Ym9keSA9IGJvZHkuc3RyZWFtKCk7XG5cdH1cblxuXHQvLyBib2R5IGlzIGJ1ZmZlclxuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0cmV0dXJuIEJvZHkuUHJvbWlzZS5yZXNvbHZlKGJvZHkpO1xuXHR9XG5cblx0Ly8gaXN0YW5idWwgaWdub3JlIGlmOiBzaG91bGQgbmV2ZXIgaGFwcGVuXG5cdGlmICghKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pKSB7XG5cdFx0cmV0dXJuIEJvZHkuUHJvbWlzZS5yZXNvbHZlKEJ1ZmZlci5hbGxvYygwKSk7XG5cdH1cblxuXHQvLyBib2R5IGlzIHN0cmVhbVxuXHQvLyBnZXQgcmVhZHkgdG8gYWN0dWFsbHkgY29uc3VtZSB0aGUgYm9keVxuXHRsZXQgYWNjdW0gPSBbXTtcblx0bGV0IGFjY3VtQnl0ZXMgPSAwO1xuXHRsZXQgYWJvcnQgPSBmYWxzZTtcblxuXHRyZXR1cm4gbmV3IEJvZHkuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0bGV0IHJlc1RpbWVvdXQ7XG5cblx0XHQvLyBhbGxvdyB0aW1lb3V0IG9uIHNsb3cgcmVzcG9uc2UgYm9keVxuXHRcdGlmIChfdGhpczQudGltZW91dCkge1xuXHRcdFx0cmVzVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRhYm9ydCA9IHRydWU7XG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgUmVzcG9uc2UgdGltZW91dCB3aGlsZSB0cnlpbmcgdG8gZmV0Y2ggJHtfdGhpczQudXJsfSAob3ZlciAke190aGlzNC50aW1lb3V0fW1zKWAsICdib2R5LXRpbWVvdXQnKSk7XG5cdFx0XHR9LCBfdGhpczQudGltZW91dCk7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHN0cmVhbSBlcnJvcnNcblx0XHRib2R5Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGlmIChlcnIubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG5cdFx0XHRcdC8vIGlmIHRoZSByZXF1ZXN0IHdhcyBhYm9ydGVkLCByZWplY3Qgd2l0aCB0aGlzIEVycm9yXG5cdFx0XHRcdGFib3J0ID0gdHJ1ZTtcblx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBvdGhlciBlcnJvcnMsIHN1Y2ggYXMgaW5jb3JyZWN0IGNvbnRlbnQtZW5jb2Rpbmdcblx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBJbnZhbGlkIHJlc3BvbnNlIGJvZHkgd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7X3RoaXM0LnVybH06ICR7ZXJyLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycikpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ym9keS5vbignZGF0YScsIGZ1bmN0aW9uIChjaHVuaykge1xuXHRcdFx0aWYgKGFib3J0IHx8IGNodW5rID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKF90aGlzNC5zaXplICYmIGFjY3VtQnl0ZXMgKyBjaHVuay5sZW5ndGggPiBfdGhpczQuc2l6ZSkge1xuXHRcdFx0XHRhYm9ydCA9IHRydWU7XG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgY29udGVudCBzaXplIGF0ICR7X3RoaXM0LnVybH0gb3ZlciBsaW1pdDogJHtfdGhpczQuc2l6ZX1gLCAnbWF4LXNpemUnKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0YWNjdW1CeXRlcyArPSBjaHVuay5sZW5ndGg7XG5cdFx0XHRhY2N1bS5wdXNoKGNodW5rKTtcblx0XHR9KTtcblxuXHRcdGJvZHkub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChhYm9ydCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNsZWFyVGltZW91dChyZXNUaW1lb3V0KTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmVzb2x2ZShCdWZmZXIuY29uY2F0KGFjY3VtLCBhY2N1bUJ5dGVzKSk7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0Ly8gaGFuZGxlIHN0cmVhbXMgdGhhdCBoYXZlIGFjY3VtdWxhdGVkIHRvbyBtdWNoIGRhdGEgKGlzc3VlICM0MTQpXG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgQ291bGQgbm90IGNyZWF0ZSBCdWZmZXIgZnJvbSByZXNwb25zZSBib2R5IGZvciAke190aGlzNC51cmx9OiAke2Vyci5tZXNzYWdlfWAsICdzeXN0ZW0nLCBlcnIpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59XG5cbi8qKlxuICogRGV0ZWN0IGJ1ZmZlciBlbmNvZGluZyBhbmQgY29udmVydCB0byB0YXJnZXQgZW5jb2RpbmdcbiAqIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9XRC1odG1sNS0yMDExMDExMy9wYXJzaW5nLmh0bWwjZGV0ZXJtaW5pbmctdGhlLWNoYXJhY3Rlci1lbmNvZGluZ1xuICpcbiAqIEBwYXJhbSAgIEJ1ZmZlciAgYnVmZmVyICAgIEluY29taW5nIGJ1ZmZlclxuICogQHBhcmFtICAgU3RyaW5nICBlbmNvZGluZyAgVGFyZ2V0IGVuY29kaW5nXG4gKiBAcmV0dXJuICBTdHJpbmdcbiAqL1xuZnVuY3Rpb24gY29udmVydEJvZHkoYnVmZmVyLCBoZWFkZXJzKSB7XG5cdGlmICh0eXBlb2YgY29udmVydCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignVGhlIHBhY2thZ2UgYGVuY29kaW5nYCBtdXN0IGJlIGluc3RhbGxlZCB0byB1c2UgdGhlIHRleHRDb252ZXJ0ZWQoKSBmdW5jdGlvbicpO1xuXHR9XG5cblx0Y29uc3QgY3QgPSBoZWFkZXJzLmdldCgnY29udGVudC10eXBlJyk7XG5cdGxldCBjaGFyc2V0ID0gJ3V0Zi04Jztcblx0bGV0IHJlcywgc3RyO1xuXG5cdC8vIGhlYWRlclxuXHRpZiAoY3QpIHtcblx0XHRyZXMgPSAvY2hhcnNldD0oW147XSopL2kuZXhlYyhjdCk7XG5cdH1cblxuXHQvLyBubyBjaGFyc2V0IGluIGNvbnRlbnQgdHlwZSwgcGVlayBhdCByZXNwb25zZSBib2R5IGZvciBhdCBtb3N0IDEwMjQgYnl0ZXNcblx0c3RyID0gYnVmZmVyLnNsaWNlKDAsIDEwMjQpLnRvU3RyaW5nKCk7XG5cblx0Ly8gaHRtbDVcblx0aWYgKCFyZXMgJiYgc3RyKSB7XG5cdFx0cmVzID0gLzxtZXRhLis/Y2hhcnNldD0oWydcIl0pKC4rPylcXDEvaS5leGVjKHN0cik7XG5cdH1cblxuXHQvLyBodG1sNFxuXHRpZiAoIXJlcyAmJiBzdHIpIHtcblx0XHRyZXMgPSAvPG1ldGFbXFxzXSs/aHR0cC1lcXVpdj0oWydcIl0pY29udGVudC10eXBlXFwxW1xcc10rP2NvbnRlbnQ9KFsnXCJdKSguKz8pXFwyL2kuZXhlYyhzdHIpO1xuXHRcdGlmICghcmVzKSB7XG5cdFx0XHRyZXMgPSAvPG1ldGFbXFxzXSs/Y29udGVudD0oWydcIl0pKC4rPylcXDFbXFxzXSs/aHR0cC1lcXVpdj0oWydcIl0pY29udGVudC10eXBlXFwzL2kuZXhlYyhzdHIpO1xuXHRcdFx0aWYgKHJlcykge1xuXHRcdFx0XHRyZXMucG9wKCk7IC8vIGRyb3AgbGFzdCBxdW90ZVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChyZXMpIHtcblx0XHRcdHJlcyA9IC9jaGFyc2V0PSguKikvaS5leGVjKHJlcy5wb3AoKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8geG1sXG5cdGlmICghcmVzICYmIHN0cikge1xuXHRcdHJlcyA9IC88XFw/eG1sLis/ZW5jb2Rpbmc9KFsnXCJdKSguKz8pXFwxL2kuZXhlYyhzdHIpO1xuXHR9XG5cblx0Ly8gZm91bmQgY2hhcnNldFxuXHRpZiAocmVzKSB7XG5cdFx0Y2hhcnNldCA9IHJlcy5wb3AoKTtcblxuXHRcdC8vIHByZXZlbnQgZGVjb2RlIGlzc3VlcyB3aGVuIHNpdGVzIHVzZSBpbmNvcnJlY3QgZW5jb2Rpbmdcblx0XHQvLyByZWY6IGh0dHBzOi8vaHNpdm9uZW4uZmkvZW5jb2RpbmctbWVudS9cblx0XHRpZiAoY2hhcnNldCA9PT0gJ2diMjMxMicgfHwgY2hhcnNldCA9PT0gJ2diaycpIHtcblx0XHRcdGNoYXJzZXQgPSAnZ2IxODAzMCc7XG5cdFx0fVxuXHR9XG5cblx0Ly8gdHVybiByYXcgYnVmZmVycyBpbnRvIGEgc2luZ2xlIHV0Zi04IGJ1ZmZlclxuXHRyZXR1cm4gY29udmVydChidWZmZXIsICdVVEYtOCcsIGNoYXJzZXQpLnRvU3RyaW5nKCk7XG59XG5cbi8qKlxuICogRGV0ZWN0IGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICogcmVmOiBodHRwczovL2dpdGh1Yi5jb20vYml0aW5uL25vZGUtZmV0Y2gvaXNzdWVzLzI5NiNpc3N1ZWNvbW1lbnQtMzA3NTk4MTQzXG4gKlxuICogQHBhcmFtICAgT2JqZWN0ICBvYmogICAgIE9iamVjdCB0byBkZXRlY3QgYnkgdHlwZSBvciBicmFuZFxuICogQHJldHVybiAgU3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKG9iaikge1xuXHQvLyBEdWNrLXR5cGluZyBhcyBhIG5lY2Vzc2FyeSBjb25kaXRpb24uXG5cdGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqLmFwcGVuZCAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygb2JqLmRlbGV0ZSAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygb2JqLmdldCAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygb2JqLmdldEFsbCAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygb2JqLmhhcyAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygb2JqLnNldCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIEJyYW5kLWNoZWNraW5nIGFuZCBtb3JlIGR1Y2stdHlwaW5nIGFzIG9wdGlvbmFsIGNvbmRpdGlvbi5cblx0cmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSAnVVJMU2VhcmNoUGFyYW1zJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgVVJMU2VhcmNoUGFyYW1zXScgfHwgdHlwZW9mIG9iai5zb3J0ID09PSAnZnVuY3Rpb24nO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgVzNDIGBCbG9iYCBvYmplY3QgKHdoaWNoIGBGaWxlYCBpbmhlcml0cyBmcm9tKVxuICogQHBhcmFtICB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0Jsb2Iob2JqKSB7XG5cdHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqLmFycmF5QnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmoudHlwZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIG9iai5zdHJlYW0gPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdzdHJpbmcnICYmIC9eKEJsb2J8RmlsZSkkLy50ZXN0KG9iai5jb25zdHJ1Y3Rvci5uYW1lKSAmJiAvXihCbG9ifEZpbGUpJC8udGVzdChvYmpbU3ltYm9sLnRvU3RyaW5nVGFnXSk7XG59XG5cbi8qKlxuICogQ2xvbmUgYm9keSBnaXZlbiBSZXMvUmVxIGluc3RhbmNlXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgIGluc3RhbmNlICBSZXNwb25zZSBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcmV0dXJuICBNaXhlZFxuICovXG5mdW5jdGlvbiBjbG9uZShpbnN0YW5jZSkge1xuXHRsZXQgcDEsIHAyO1xuXHRsZXQgYm9keSA9IGluc3RhbmNlLmJvZHk7XG5cblx0Ly8gZG9uJ3QgYWxsb3cgY2xvbmluZyBhIHVzZWQgYm9keVxuXHRpZiAoaW5zdGFuY2UuYm9keVVzZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjbG9uZSBib2R5IGFmdGVyIGl0IGlzIHVzZWQnKTtcblx0fVxuXG5cdC8vIGNoZWNrIHRoYXQgYm9keSBpcyBhIHN0cmVhbSBhbmQgbm90IGZvcm0tZGF0YSBvYmplY3Rcblx0Ly8gbm90ZTogd2UgY2FuJ3QgY2xvbmUgdGhlIGZvcm0tZGF0YSBvYmplY3Qgd2l0aG91dCBoYXZpbmcgaXQgYXMgYSBkZXBlbmRlbmN5XG5cdGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtICYmIHR5cGVvZiBib2R5LmdldEJvdW5kYXJ5ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gdGVlIGluc3RhbmNlIGJvZHlcblx0XHRwMSA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuXHRcdHAyID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0Ym9keS5waXBlKHAxKTtcblx0XHRib2R5LnBpcGUocDIpO1xuXHRcdC8vIHNldCBpbnN0YW5jZSBib2R5IHRvIHRlZWQgYm9keSBhbmQgcmV0dXJuIHRoZSBvdGhlciB0ZWVkIGJvZHlcblx0XHRpbnN0YW5jZVtJTlRFUk5BTFNdLmJvZHkgPSBwMTtcblx0XHRib2R5ID0gcDI7XG5cdH1cblxuXHRyZXR1cm4gYm9keTtcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyB0aGUgb3BlcmF0aW9uIFwiZXh0cmFjdCBhIGBDb250ZW50LVR5cGVgIHZhbHVlIGZyb20gfG9iamVjdHxcIiBhc1xuICogc3BlY2lmaWVkIGluIHRoZSBzcGVjaWZpY2F0aW9uOlxuICogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtYm9keWluaXQtZXh0cmFjdFxuICpcbiAqIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGluc3RhbmNlLmJvZHkgaXMgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgaW5zdGFuY2UgIEFueSBvcHRpb25zLmJvZHkgaW5wdXRcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdENvbnRlbnRUeXBlKGJvZHkpIHtcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHQvLyBib2R5IGlzIG51bGxcblx0XHRyZXR1cm4gbnVsbDtcblx0fSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcblx0XHQvLyBib2R5IGlzIHN0cmluZ1xuXHRcdHJldHVybiAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jztcblx0fSBlbHNlIGlmIChpc1VSTFNlYXJjaFBhcmFtcyhib2R5KSkge1xuXHRcdC8vIGJvZHkgaXMgYSBVUkxTZWFyY2hQYXJhbXNcblx0XHRyZXR1cm4gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04Jztcblx0fSBlbHNlIGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIGJsb2Jcblx0XHRyZXR1cm4gYm9keS50eXBlIHx8IG51bGw7XG5cdH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBidWZmZXJcblx0XHRyZXR1cm4gbnVsbDtcblx0fSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXScpIHtcblx0XHQvLyBib2R5IGlzIEFycmF5QnVmZmVyXG5cdFx0cmV0dXJuIG51bGw7XG5cdH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBBcnJheUJ1ZmZlclZpZXdcblx0XHRyZXR1cm4gbnVsbDtcblx0fSBlbHNlIGlmICh0eXBlb2YgYm9keS5nZXRCb3VuZGFyeSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdC8vIGRldGVjdCBmb3JtIGRhdGEgaW5wdXQgZnJvbSBmb3JtLWRhdGEgbW9kdWxlXG5cdFx0cmV0dXJuIGBtdWx0aXBhcnQvZm9ybS1kYXRhO2JvdW5kYXJ5PSR7Ym9keS5nZXRCb3VuZGFyeSgpfWA7XG5cdH0gZWxzZSBpZiAoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkge1xuXHRcdC8vIGJvZHkgaXMgc3RyZWFtXG5cdFx0Ly8gY2FuJ3QgcmVhbGx5IGRvIG11Y2ggYWJvdXQgdGhpc1xuXHRcdHJldHVybiBudWxsO1xuXHR9IGVsc2Uge1xuXHRcdC8vIEJvZHkgY29uc3RydWN0b3IgZGVmYXVsdHMgb3RoZXIgdGhpbmdzIHRvIHN0cmluZ1xuXHRcdHJldHVybiAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jztcblx0fVxufVxuXG4vKipcbiAqIFRoZSBGZXRjaCBTdGFuZGFyZCB0cmVhdHMgdGhpcyBhcyBpZiBcInRvdGFsIGJ5dGVzXCIgaXMgYSBwcm9wZXJ0eSBvbiB0aGUgYm9keS5cbiAqIEZvciB1cywgd2UgaGF2ZSB0byBleHBsaWNpdGx5IGdldCBpdCB3aXRoIGEgZnVuY3Rpb24uXG4gKlxuICogcmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1ib2R5LXRvdGFsLWJ5dGVzXG4gKlxuICogQHBhcmFtICAgQm9keSAgICBpbnN0YW5jZSAgIEluc3RhbmNlIG9mIEJvZHlcbiAqIEByZXR1cm4gIE51bWJlcj8gICAgICAgICAgICBOdW1iZXIgb2YgYnl0ZXMsIG9yIG51bGwgaWYgbm90IHBvc3NpYmxlXG4gKi9cbmZ1bmN0aW9uIGdldFRvdGFsQnl0ZXMoaW5zdGFuY2UpIHtcblx0Y29uc3QgYm9keSA9IGluc3RhbmNlLmJvZHk7XG5cblxuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdC8vIGJvZHkgaXMgbnVsbFxuXHRcdHJldHVybiAwO1xuXHR9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkge1xuXHRcdHJldHVybiBib2R5LnNpemU7XG5cdH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBidWZmZXJcblx0XHRyZXR1cm4gYm9keS5sZW5ndGg7XG5cdH0gZWxzZSBpZiAoYm9keSAmJiB0eXBlb2YgYm9keS5nZXRMZW5ndGhTeW5jID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gZGV0ZWN0IGZvcm0gZGF0YSBpbnB1dCBmcm9tIGZvcm0tZGF0YSBtb2R1bGVcblx0XHRpZiAoYm9keS5fbGVuZ3RoUmV0cmlldmVycyAmJiBib2R5Ll9sZW5ndGhSZXRyaWV2ZXJzLmxlbmd0aCA9PSAwIHx8IC8vIDEueFxuXHRcdGJvZHkuaGFzS25vd25MZW5ndGggJiYgYm9keS5oYXNLbm93bkxlbmd0aCgpKSB7XG5cdFx0XHQvLyAyLnhcblx0XHRcdHJldHVybiBib2R5LmdldExlbmd0aFN5bmMoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gYm9keSBpcyBzdHJlYW1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG4vKipcbiAqIFdyaXRlIGEgQm9keSB0byBhIE5vZGUuanMgV3JpdGFibGVTdHJlYW0gKGUuZy4gaHR0cC5SZXF1ZXN0KSBvYmplY3QuXG4gKlxuICogQHBhcmFtICAgQm9keSAgICBpbnN0YW5jZSAgIEluc3RhbmNlIG9mIEJvZHlcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZnVuY3Rpb24gd3JpdGVUb1N0cmVhbShkZXN0LCBpbnN0YW5jZSkge1xuXHRjb25zdCBib2R5ID0gaW5zdGFuY2UuYm9keTtcblxuXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0Ly8gYm9keSBpcyBudWxsXG5cdFx0ZGVzdC5lbmQoKTtcblx0fSBlbHNlIGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRib2R5LnN0cmVhbSgpLnBpcGUoZGVzdCk7XG5cdH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBidWZmZXJcblx0XHRkZXN0LndyaXRlKGJvZHkpO1xuXHRcdGRlc3QuZW5kKCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gYm9keSBpcyBzdHJlYW1cblx0XHRib2R5LnBpcGUoZGVzdCk7XG5cdH1cbn1cblxuLy8gZXhwb3NlIFByb21pc2VcbkJvZHkuUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuXG4vKipcbiAqIGhlYWRlcnMuanNcbiAqXG4gKiBIZWFkZXJzIGNsYXNzIG9mZmVycyBjb252ZW5pZW50IGhlbHBlcnNcbiAqL1xuXG5jb25zdCBpbnZhbGlkVG9rZW5SZWdleCA9IC9bXlxcXl9gYS16QS1aXFwtMC05ISMkJSYnKisufH5dLztcbmNvbnN0IGludmFsaWRIZWFkZXJDaGFyUmVnZXggPSAvW15cXHRcXHgyMC1cXHg3ZVxceDgwLVxceGZmXS87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTmFtZShuYW1lKSB7XG5cdG5hbWUgPSBgJHtuYW1lfWA7XG5cdGlmIChpbnZhbGlkVG9rZW5SZWdleC50ZXN0KG5hbWUpIHx8IG5hbWUgPT09ICcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgJHtuYW1lfSBpcyBub3QgYSBsZWdhbCBIVFRQIGhlYWRlciBuYW1lYCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVWYWx1ZSh2YWx1ZSkge1xuXHR2YWx1ZSA9IGAke3ZhbHVlfWA7XG5cdGlmIChpbnZhbGlkSGVhZGVyQ2hhclJlZ2V4LnRlc3QodmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgJHt2YWx1ZX0gaXMgbm90IGEgbGVnYWwgSFRUUCBoZWFkZXIgdmFsdWVgKTtcblx0fVxufVxuXG4vKipcbiAqIEZpbmQgdGhlIGtleSBpbiB0aGUgbWFwIG9iamVjdCBnaXZlbiBhIGhlYWRlciBuYW1lLlxuICpcbiAqIFJldHVybnMgdW5kZWZpbmVkIGlmIG5vdCBmb3VuZC5cbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgIEhlYWRlciBuYW1lXG4gKiBAcmV0dXJuICBTdHJpbmd8VW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGZpbmQobWFwLCBuYW1lKSB7XG5cdG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cdGZvciAoY29uc3Qga2V5IGluIG1hcCkge1xuXHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSkge1xuXHRcdFx0cmV0dXJuIGtleTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuY29uc3QgTUFQID0gU3ltYm9sKCdtYXAnKTtcbmNsYXNzIEhlYWRlcnMge1xuXHQvKipcbiAgKiBIZWFkZXJzIGNsYXNzXG4gICpcbiAgKiBAcGFyYW0gICBPYmplY3QgIGhlYWRlcnMgIFJlc3BvbnNlIGhlYWRlcnNcbiAgKiBAcmV0dXJuICBWb2lkXG4gICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGxldCBpbml0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQ7XG5cblx0XHR0aGlzW01BUF0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0aWYgKGluaXQgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG5cdFx0XHRjb25zdCByYXdIZWFkZXJzID0gaW5pdC5yYXcoKTtcblx0XHRcdGNvbnN0IGhlYWRlck5hbWVzID0gT2JqZWN0LmtleXMocmF3SGVhZGVycyk7XG5cblx0XHRcdGZvciAoY29uc3QgaGVhZGVyTmFtZSBvZiBoZWFkZXJOYW1lcykge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIHJhd0hlYWRlcnNbaGVhZGVyTmFtZV0pIHtcblx0XHRcdFx0XHR0aGlzLmFwcGVuZChoZWFkZXJOYW1lLCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFdlIGRvbid0IHdvcnJ5IGFib3V0IGNvbnZlcnRpbmcgcHJvcCB0byBCeXRlU3RyaW5nIGhlcmUgYXMgYXBwZW5kKClcblx0XHQvLyB3aWxsIGhhbmRsZSBpdC5cblx0XHRpZiAoaW5pdCA9PSBudWxsKSA7IGVsc2UgaWYgKHR5cGVvZiBpbml0ID09PSAnb2JqZWN0Jykge1xuXHRcdFx0Y29uc3QgbWV0aG9kID0gaW5pdFtTeW1ib2wuaXRlcmF0b3JdO1xuXHRcdFx0aWYgKG1ldGhvZCAhPSBudWxsKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgbWV0aG9kICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignSGVhZGVyIHBhaXJzIG11c3QgYmUgaXRlcmFibGUnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHNlcXVlbmNlPHNlcXVlbmNlPEJ5dGVTdHJpbmc+PlxuXHRcdFx0XHQvLyBOb3RlOiBwZXIgc3BlYyB3ZSBoYXZlIHRvIGZpcnN0IGV4aGF1c3QgdGhlIGxpc3RzIHRoZW4gcHJvY2VzcyB0aGVtXG5cdFx0XHRcdGNvbnN0IHBhaXJzID0gW107XG5cdFx0XHRcdGZvciAoY29uc3QgcGFpciBvZiBpbml0KSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBwYWlyICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFpcltTeW1ib2wuaXRlcmF0b3JdICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFYWNoIGhlYWRlciBwYWlyIG11c3QgYmUgaXRlcmFibGUnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cGFpcnMucHVzaChBcnJheS5mcm9tKHBhaXIpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAoY29uc3QgcGFpciBvZiBwYWlycykge1xuXHRcdFx0XHRcdGlmIChwYWlyLmxlbmd0aCAhPT0gMikge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRWFjaCBoZWFkZXIgcGFpciBtdXN0IGJlIGEgbmFtZS92YWx1ZSB0dXBsZScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmFwcGVuZChwYWlyWzBdLCBwYWlyWzFdKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gcmVjb3JkPEJ5dGVTdHJpbmcsIEJ5dGVTdHJpbmc+XG5cdFx0XHRcdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGluaXQpKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBpbml0W2tleV07XG5cdFx0XHRcdFx0dGhpcy5hcHBlbmQoa2V5LCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignUHJvdmlkZWQgaW5pdGlhbGl6ZXIgbXVzdCBiZSBhbiBvYmplY3QnKTtcblx0XHR9XG5cdH1cblxuXHQvKipcbiAgKiBSZXR1cm4gY29tYmluZWQgaGVhZGVyIHZhbHVlIGdpdmVuIG5hbWVcbiAgKlxuICAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgSGVhZGVyIG5hbWVcbiAgKiBAcmV0dXJuICBNaXhlZFxuICAqL1xuXHRnZXQobmFtZSkge1xuXHRcdG5hbWUgPSBgJHtuYW1lfWA7XG5cdFx0dmFsaWRhdGVOYW1lKG5hbWUpO1xuXHRcdGNvbnN0IGtleSA9IGZpbmQodGhpc1tNQVBdLCBuYW1lKTtcblx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzW01BUF1ba2V5XS5qb2luKCcsICcpO1xuXHR9XG5cblx0LyoqXG4gICogSXRlcmF0ZSBvdmVyIGFsbCBoZWFkZXJzXG4gICpcbiAgKiBAcGFyYW0gICBGdW5jdGlvbiAgY2FsbGJhY2sgIEV4ZWN1dGVkIGZvciBlYWNoIGl0ZW0gd2l0aCBwYXJhbWV0ZXJzICh2YWx1ZSwgbmFtZSwgdGhpc0FyZylcbiAgKiBAcGFyYW0gICBCb29sZWFuICAgdGhpc0FyZyAgIGB0aGlzYCBjb250ZXh0IGZvciBjYWxsYmFjayBmdW5jdGlvblxuICAqIEByZXR1cm4gIFZvaWRcbiAgKi9cblx0Zm9yRWFjaChjYWxsYmFjaykge1xuXHRcdGxldCB0aGlzQXJnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG5cblx0XHRsZXQgcGFpcnMgPSBnZXRIZWFkZXJzKHRoaXMpO1xuXHRcdGxldCBpID0gMDtcblx0XHR3aGlsZSAoaSA8IHBhaXJzLmxlbmd0aCkge1xuXHRcdFx0dmFyIF9wYWlycyRpID0gcGFpcnNbaV07XG5cdFx0XHRjb25zdCBuYW1lID0gX3BhaXJzJGlbMF0sXG5cdFx0XHQgICAgICB2YWx1ZSA9IF9wYWlycyRpWzFdO1xuXG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBuYW1lLCB0aGlzKTtcblx0XHRcdHBhaXJzID0gZ2V0SGVhZGVycyh0aGlzKTtcblx0XHRcdGkrKztcblx0XHR9XG5cdH1cblxuXHQvKipcbiAgKiBPdmVyd3JpdGUgaGVhZGVyIHZhbHVlcyBnaXZlbiBuYW1lXG4gICpcbiAgKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgICBIZWFkZXIgbmFtZVxuICAqIEBwYXJhbSAgIFN0cmluZyAgdmFsdWUgIEhlYWRlciB2YWx1ZVxuICAqIEByZXR1cm4gIFZvaWRcbiAgKi9cblx0c2V0KG5hbWUsIHZhbHVlKSB7XG5cdFx0bmFtZSA9IGAke25hbWV9YDtcblx0XHR2YWx1ZSA9IGAke3ZhbHVlfWA7XG5cdFx0dmFsaWRhdGVOYW1lKG5hbWUpO1xuXHRcdHZhbGlkYXRlVmFsdWUodmFsdWUpO1xuXHRcdGNvbnN0IGtleSA9IGZpbmQodGhpc1tNQVBdLCBuYW1lKTtcblx0XHR0aGlzW01BUF1ba2V5ICE9PSB1bmRlZmluZWQgPyBrZXkgOiBuYW1lXSA9IFt2YWx1ZV07XG5cdH1cblxuXHQvKipcbiAgKiBBcHBlbmQgYSB2YWx1ZSBvbnRvIGV4aXN0aW5nIGhlYWRlclxuICAqXG4gICogQHBhcmFtICAgU3RyaW5nICBuYW1lICAgSGVhZGVyIG5hbWVcbiAgKiBAcGFyYW0gICBTdHJpbmcgIHZhbHVlICBIZWFkZXIgdmFsdWVcbiAgKiBAcmV0dXJuICBWb2lkXG4gICovXG5cdGFwcGVuZChuYW1lLCB2YWx1ZSkge1xuXHRcdG5hbWUgPSBgJHtuYW1lfWA7XG5cdFx0dmFsdWUgPSBgJHt2YWx1ZX1gO1xuXHRcdHZhbGlkYXRlTmFtZShuYW1lKTtcblx0XHR2YWxpZGF0ZVZhbHVlKHZhbHVlKTtcblx0XHRjb25zdCBrZXkgPSBmaW5kKHRoaXNbTUFQXSwgbmFtZSk7XG5cdFx0aWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzW01BUF1ba2V5XS5wdXNoKHZhbHVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpc1tNQVBdW25hbWVdID0gW3ZhbHVlXTtcblx0XHR9XG5cdH1cblxuXHQvKipcbiAgKiBDaGVjayBmb3IgaGVhZGVyIG5hbWUgZXhpc3RlbmNlXG4gICpcbiAgKiBAcGFyYW0gICBTdHJpbmcgICBuYW1lICBIZWFkZXIgbmFtZVxuICAqIEByZXR1cm4gIEJvb2xlYW5cbiAgKi9cblx0aGFzKG5hbWUpIHtcblx0XHRuYW1lID0gYCR7bmFtZX1gO1xuXHRcdHZhbGlkYXRlTmFtZShuYW1lKTtcblx0XHRyZXR1cm4gZmluZCh0aGlzW01BUF0sIG5hbWUpICE9PSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvKipcbiAgKiBEZWxldGUgYWxsIGhlYWRlciB2YWx1ZXMgZ2l2ZW4gbmFtZVxuICAqXG4gICogQHBhcmFtICAgU3RyaW5nICBuYW1lICBIZWFkZXIgbmFtZVxuICAqIEByZXR1cm4gIFZvaWRcbiAgKi9cblx0ZGVsZXRlKG5hbWUpIHtcblx0XHRuYW1lID0gYCR7bmFtZX1gO1xuXHRcdHZhbGlkYXRlTmFtZShuYW1lKTtcblx0XHRjb25zdCBrZXkgPSBmaW5kKHRoaXNbTUFQXSwgbmFtZSk7XG5cdFx0aWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRkZWxldGUgdGhpc1tNQVBdW2tleV07XG5cdFx0fVxuXHR9XG5cblx0LyoqXG4gICogUmV0dXJuIHJhdyBoZWFkZXJzIChub24tc3BlYyBhcGkpXG4gICpcbiAgKiBAcmV0dXJuICBPYmplY3RcbiAgKi9cblx0cmF3KCkge1xuXHRcdHJldHVybiB0aGlzW01BUF07XG5cdH1cblxuXHQvKipcbiAgKiBHZXQgYW4gaXRlcmF0b3Igb24ga2V5cy5cbiAgKlxuICAqIEByZXR1cm4gIEl0ZXJhdG9yXG4gICovXG5cdGtleXMoKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZUhlYWRlcnNJdGVyYXRvcih0aGlzLCAna2V5Jyk7XG5cdH1cblxuXHQvKipcbiAgKiBHZXQgYW4gaXRlcmF0b3Igb24gdmFsdWVzLlxuICAqXG4gICogQHJldHVybiAgSXRlcmF0b3JcbiAgKi9cblx0dmFsdWVzKCkge1xuXHRcdHJldHVybiBjcmVhdGVIZWFkZXJzSXRlcmF0b3IodGhpcywgJ3ZhbHVlJyk7XG5cdH1cblxuXHQvKipcbiAgKiBHZXQgYW4gaXRlcmF0b3Igb24gZW50cmllcy5cbiAgKlxuICAqIFRoaXMgaXMgdGhlIGRlZmF1bHQgaXRlcmF0b3Igb2YgdGhlIEhlYWRlcnMgb2JqZWN0LlxuICAqXG4gICogQHJldHVybiAgSXRlcmF0b3JcbiAgKi9cblx0W1N5bWJvbC5pdGVyYXRvcl0oKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZUhlYWRlcnNJdGVyYXRvcih0aGlzLCAna2V5K3ZhbHVlJyk7XG5cdH1cbn1cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSGVhZGVycy5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuXHR2YWx1ZTogJ0hlYWRlcnMnLFxuXHR3cml0YWJsZTogZmFsc2UsXG5cdGVudW1lcmFibGU6IGZhbHNlLFxuXHRjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhIZWFkZXJzLnByb3RvdHlwZSwge1xuXHRnZXQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRmb3JFYWNoOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0c2V0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0YXBwZW5kOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0aGFzOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0ZGVsZXRlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0a2V5czogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHZhbHVlczogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGVudHJpZXM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcblxuZnVuY3Rpb24gZ2V0SGVhZGVycyhoZWFkZXJzKSB7XG5cdGxldCBraW5kID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAna2V5K3ZhbHVlJztcblxuXHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoaGVhZGVyc1tNQVBdKS5zb3J0KCk7XG5cdHJldHVybiBrZXlzLm1hcChraW5kID09PSAna2V5JyA/IGZ1bmN0aW9uIChrKSB7XG5cdFx0cmV0dXJuIGsudG9Mb3dlckNhc2UoKTtcblx0fSA6IGtpbmQgPT09ICd2YWx1ZScgPyBmdW5jdGlvbiAoaykge1xuXHRcdHJldHVybiBoZWFkZXJzW01BUF1ba10uam9pbignLCAnKTtcblx0fSA6IGZ1bmN0aW9uIChrKSB7XG5cdFx0cmV0dXJuIFtrLnRvTG93ZXJDYXNlKCksIGhlYWRlcnNbTUFQXVtrXS5qb2luKCcsICcpXTtcblx0fSk7XG59XG5cbmNvbnN0IElOVEVSTkFMID0gU3ltYm9sKCdpbnRlcm5hbCcpO1xuXG5mdW5jdGlvbiBjcmVhdGVIZWFkZXJzSXRlcmF0b3IodGFyZ2V0LCBraW5kKSB7XG5cdGNvbnN0IGl0ZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShIZWFkZXJzSXRlcmF0b3JQcm90b3R5cGUpO1xuXHRpdGVyYXRvcltJTlRFUk5BTF0gPSB7XG5cdFx0dGFyZ2V0LFxuXHRcdGtpbmQsXG5cdFx0aW5kZXg6IDBcblx0fTtcblx0cmV0dXJuIGl0ZXJhdG9yO1xufVxuXG5jb25zdCBIZWFkZXJzSXRlcmF0b3JQcm90b3R5cGUgPSBPYmplY3Quc2V0UHJvdG90eXBlT2Yoe1xuXHRuZXh0KCkge1xuXHRcdC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuXHRcdGlmICghdGhpcyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykgIT09IEhlYWRlcnNJdGVyYXRvclByb3RvdHlwZSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVmFsdWUgb2YgYHRoaXNgIGlzIG5vdCBhIEhlYWRlcnNJdGVyYXRvcicpO1xuXHRcdH1cblxuXHRcdHZhciBfSU5URVJOQUwgPSB0aGlzW0lOVEVSTkFMXTtcblx0XHRjb25zdCB0YXJnZXQgPSBfSU5URVJOQUwudGFyZ2V0LFxuXHRcdCAgICAgIGtpbmQgPSBfSU5URVJOQUwua2luZCxcblx0XHQgICAgICBpbmRleCA9IF9JTlRFUk5BTC5pbmRleDtcblxuXHRcdGNvbnN0IHZhbHVlcyA9IGdldEhlYWRlcnModGFyZ2V0LCBraW5kKTtcblx0XHRjb25zdCBsZW4gPSB2YWx1ZXMubGVuZ3RoO1xuXHRcdGlmIChpbmRleCA+PSBsZW4pIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdGRvbmU6IHRydWVcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dGhpc1tJTlRFUk5BTF0uaW5kZXggPSBpbmRleCArIDE7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHZhbHVlc1tpbmRleF0sXG5cdFx0XHRkb25lOiBmYWxzZVxuXHRcdH07XG5cdH1cbn0sIE9iamVjdC5nZXRQcm90b3R5cGVPZihPYmplY3QuZ2V0UHJvdG90eXBlT2YoW11bU3ltYm9sLml0ZXJhdG9yXSgpKSkpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSGVhZGVyc0l0ZXJhdG9yUHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcblx0dmFsdWU6ICdIZWFkZXJzSXRlcmF0b3InLFxuXHR3cml0YWJsZTogZmFsc2UsXG5cdGVudW1lcmFibGU6IGZhbHNlLFxuXHRjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG4vKipcbiAqIEV4cG9ydCB0aGUgSGVhZGVycyBvYmplY3QgaW4gYSBmb3JtIHRoYXQgTm9kZS5qcyBjYW4gY29uc3VtZS5cbiAqXG4gKiBAcGFyYW0gICBIZWFkZXJzICBoZWFkZXJzXG4gKiBAcmV0dXJuICBPYmplY3RcbiAqL1xuZnVuY3Rpb24gZXhwb3J0Tm9kZUNvbXBhdGlibGVIZWFkZXJzKGhlYWRlcnMpIHtcblx0Y29uc3Qgb2JqID0gT2JqZWN0LmFzc2lnbih7IF9fcHJvdG9fXzogbnVsbCB9LCBoZWFkZXJzW01BUF0pO1xuXG5cdC8vIGh0dHAucmVxdWVzdCgpIG9ubHkgc3VwcG9ydHMgc3RyaW5nIGFzIEhvc3QgaGVhZGVyLiBUaGlzIGhhY2sgbWFrZXNcblx0Ly8gc3BlY2lmeWluZyBjdXN0b20gSG9zdCBoZWFkZXIgcG9zc2libGUuXG5cdGNvbnN0IGhvc3RIZWFkZXJLZXkgPSBmaW5kKGhlYWRlcnNbTUFQXSwgJ0hvc3QnKTtcblx0aWYgKGhvc3RIZWFkZXJLZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdG9ialtob3N0SGVhZGVyS2V5XSA9IG9ialtob3N0SGVhZGVyS2V5XVswXTtcblx0fVxuXG5cdHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgSGVhZGVycyBvYmplY3QgZnJvbSBhbiBvYmplY3Qgb2YgaGVhZGVycywgaWdub3JpbmcgdGhvc2UgdGhhdCBkb1xuICogbm90IGNvbmZvcm0gdG8gSFRUUCBncmFtbWFyIHByb2R1Y3Rpb25zLlxuICpcbiAqIEBwYXJhbSAgIE9iamVjdCAgb2JqICBPYmplY3Qgb2YgaGVhZGVyc1xuICogQHJldHVybiAgSGVhZGVyc1xuICovXG5mdW5jdGlvbiBjcmVhdGVIZWFkZXJzTGVuaWVudChvYmopIHtcblx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG5cdGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG5cdFx0aWYgKGludmFsaWRUb2tlblJlZ2V4LnRlc3QobmFtZSkpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRpZiAoQXJyYXkuaXNBcnJheShvYmpbbmFtZV0pKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHZhbCBvZiBvYmpbbmFtZV0pIHtcblx0XHRcdFx0aWYgKGludmFsaWRIZWFkZXJDaGFyUmVnZXgudGVzdCh2YWwpKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGhlYWRlcnNbTUFQXVtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0aGVhZGVyc1tNQVBdW25hbWVdID0gW3ZhbF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aGVhZGVyc1tNQVBdW25hbWVdLnB1c2godmFsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIWludmFsaWRIZWFkZXJDaGFyUmVnZXgudGVzdChvYmpbbmFtZV0pKSB7XG5cdFx0XHRoZWFkZXJzW01BUF1bbmFtZV0gPSBbb2JqW25hbWVdXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGhlYWRlcnM7XG59XG5cbmNvbnN0IElOVEVSTkFMUyQxID0gU3ltYm9sKCdSZXNwb25zZSBpbnRlcm5hbHMnKTtcblxuLy8gZml4IGFuIGlzc3VlIHdoZXJlIFwiU1RBVFVTX0NPREVTXCIgYXJlbid0IGEgbmFtZWQgZXhwb3J0IGZvciBub2RlIDwxMFxuY29uc3QgU1RBVFVTX0NPREVTID0gaHR0cC5TVEFUVVNfQ09ERVM7XG5cbi8qKlxuICogUmVzcG9uc2UgY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBTdHJlYW0gIGJvZHkgIFJlYWRhYmxlIHN0cmVhbVxuICogQHBhcmFtICAgT2JqZWN0ICBvcHRzICBSZXNwb25zZSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmNsYXNzIFJlc3BvbnNlIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0bGV0IGJvZHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG5cdFx0bGV0IG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG5cdFx0Qm9keS5jYWxsKHRoaXMsIGJvZHksIG9wdHMpO1xuXG5cdFx0Y29uc3Qgc3RhdHVzID0gb3B0cy5zdGF0dXMgfHwgMjAwO1xuXHRcdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRzLmhlYWRlcnMpO1xuXG5cdFx0aWYgKGJvZHkgIT0gbnVsbCAmJiAhaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKSB7XG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IGV4dHJhY3RDb250ZW50VHlwZShib2R5KTtcblx0XHRcdGlmIChjb250ZW50VHlwZSkge1xuXHRcdFx0XHRoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxTJDFdID0ge1xuXHRcdFx0dXJsOiBvcHRzLnVybCxcblx0XHRcdHN0YXR1cyxcblx0XHRcdHN0YXR1c1RleHQ6IG9wdHMuc3RhdHVzVGV4dCB8fCBTVEFUVVNfQ09ERVNbc3RhdHVzXSxcblx0XHRcdGhlYWRlcnMsXG5cdFx0XHRjb3VudGVyOiBvcHRzLmNvdW50ZXJcblx0XHR9O1xuXHR9XG5cblx0Z2V0IHVybCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMV0udXJsIHx8ICcnO1xuXHR9XG5cblx0Z2V0IHN0YXR1cygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMV0uc3RhdHVzO1xuXHR9XG5cblx0LyoqXG4gICogQ29udmVuaWVuY2UgcHJvcGVydHkgcmVwcmVzZW50aW5nIGlmIHRoZSByZXF1ZXN0IGVuZGVkIG5vcm1hbGx5XG4gICovXG5cdGdldCBvaygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMV0uc3RhdHVzID49IDIwMCAmJiB0aGlzW0lOVEVSTkFMUyQxXS5zdGF0dXMgPCAzMDA7XG5cdH1cblxuXHRnZXQgcmVkaXJlY3RlZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMV0uY291bnRlciA+IDA7XG5cdH1cblxuXHRnZXQgc3RhdHVzVGV4dCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMV0uc3RhdHVzVGV4dDtcblx0fVxuXG5cdGdldCBoZWFkZXJzKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQxXS5oZWFkZXJzO1xuXHR9XG5cblx0LyoqXG4gICogQ2xvbmUgdGhpcyByZXNwb25zZVxuICAqXG4gICogQHJldHVybiAgUmVzcG9uc2VcbiAgKi9cblx0Y2xvbmUoKSB7XG5cdFx0cmV0dXJuIG5ldyBSZXNwb25zZShjbG9uZSh0aGlzKSwge1xuXHRcdFx0dXJsOiB0aGlzLnVybCxcblx0XHRcdHN0YXR1czogdGhpcy5zdGF0dXMsXG5cdFx0XHRzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG5cdFx0XHRoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG5cdFx0XHRvazogdGhpcy5vayxcblx0XHRcdHJlZGlyZWN0ZWQ6IHRoaXMucmVkaXJlY3RlZFxuXHRcdH0pO1xuXHR9XG59XG5cbkJvZHkubWl4SW4oUmVzcG9uc2UucHJvdG90eXBlKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVzcG9uc2UucHJvdG90eXBlLCB7XG5cdHVybDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHN0YXR1czogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdG9rOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0cmVkaXJlY3RlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHN0YXR1c1RleHQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRoZWFkZXJzOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0Y2xvbmU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlc3BvbnNlLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG5cdHZhbHVlOiAnUmVzcG9uc2UnLFxuXHR3cml0YWJsZTogZmFsc2UsXG5cdGVudW1lcmFibGU6IGZhbHNlLFxuXHRjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG5jb25zdCBJTlRFUk5BTFMkMiA9IFN5bWJvbCgnUmVxdWVzdCBpbnRlcm5hbHMnKTtcbmNvbnN0IFVSTCA9IFVybC5VUkwgfHwgd2hhdHdnVXJsLlVSTDtcblxuLy8gZml4IGFuIGlzc3VlIHdoZXJlIFwiZm9ybWF0XCIsIFwicGFyc2VcIiBhcmVuJ3QgYSBuYW1lZCBleHBvcnQgZm9yIG5vZGUgPDEwXG5jb25zdCBwYXJzZV91cmwgPSBVcmwucGFyc2U7XG5jb25zdCBmb3JtYXRfdXJsID0gVXJsLmZvcm1hdDtcblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCBgbmV3IFVSTGAgdG8gaGFuZGxlIGFyYml0cmFyeSBVUkxzXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSB1cmxTdHJcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHBhcnNlVVJMKHVybFN0cikge1xuXHQvKlxuIFx0Q2hlY2sgd2hldGhlciB0aGUgVVJMIGlzIGFic29sdXRlIG9yIG5vdFxuIFx0XHRTY2hlbWU6IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4xXG4gXHRBYnNvbHV0ZSBVUkw6IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tNC4zXG4gKi9cblx0aWYgKC9eW2EtekEtWl1bYS16QS1aXFxkK1xcLS5dKjovLmV4ZWModXJsU3RyKSkge1xuXHRcdHVybFN0ciA9IG5ldyBVUkwodXJsU3RyKS50b1N0cmluZygpO1xuXHR9XG5cblx0Ly8gRmFsbGJhY2sgdG8gb2xkIGltcGxlbWVudGF0aW9uIGZvciBhcmJpdHJhcnkgVVJMc1xuXHRyZXR1cm4gcGFyc2VfdXJsKHVybFN0cik7XG59XG5cbmNvbnN0IHN0cmVhbURlc3RydWN0aW9uU3VwcG9ydGVkID0gJ2Rlc3Ryb3knIGluIFN0cmVhbS5SZWFkYWJsZS5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2sgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBSZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSAgIE1peGVkICAgaW5wdXRcbiAqIEByZXR1cm4gIEJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gaXNSZXF1ZXN0KGlucHV0KSB7XG5cdHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnICYmIHR5cGVvZiBpbnB1dFtJTlRFUk5BTFMkMl0gPT09ICdvYmplY3QnO1xufVxuXG5mdW5jdGlvbiBpc0Fib3J0U2lnbmFsKHNpZ25hbCkge1xuXHRjb25zdCBwcm90byA9IHNpZ25hbCAmJiB0eXBlb2Ygc2lnbmFsID09PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc2lnbmFsKTtcblx0cmV0dXJuICEhKHByb3RvICYmIHByb3RvLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBYm9ydFNpZ25hbCcpO1xufVxuXG4vKipcbiAqIFJlcXVlc3QgY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgIGlucHV0ICBVcmwgb3IgUmVxdWVzdCBpbnN0YW5jZVxuICogQHBhcmFtICAgT2JqZWN0ICBpbml0ICAgQ3VzdG9tIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuY2xhc3MgUmVxdWVzdCB7XG5cdGNvbnN0cnVjdG9yKGlucHV0KSB7XG5cdFx0bGV0IGluaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG5cdFx0bGV0IHBhcnNlZFVSTDtcblxuXHRcdC8vIG5vcm1hbGl6ZSBpbnB1dFxuXHRcdGlmICghaXNSZXF1ZXN0KGlucHV0KSkge1xuXHRcdFx0aWYgKGlucHV0ICYmIGlucHV0LmhyZWYpIHtcblx0XHRcdFx0Ly8gaW4gb3JkZXIgdG8gc3VwcG9ydCBOb2RlLmpzJyBVcmwgb2JqZWN0czsgdGhvdWdoIFdIQVRXRydzIFVSTCBvYmplY3RzXG5cdFx0XHRcdC8vIHdpbGwgZmFsbCBpbnRvIHRoaXMgYnJhbmNoIGFsc28gKHNpbmNlIHRoZWlyIGB0b1N0cmluZygpYCB3aWxsIHJldHVyblxuXHRcdFx0XHQvLyBgaHJlZmAgcHJvcGVydHkgYW55d2F5KVxuXHRcdFx0XHRwYXJzZWRVUkwgPSBwYXJzZVVSTChpbnB1dC5ocmVmKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGNvZXJjZSBpbnB1dCB0byBhIHN0cmluZyBiZWZvcmUgYXR0ZW1wdGluZyB0byBwYXJzZVxuXHRcdFx0XHRwYXJzZWRVUkwgPSBwYXJzZVVSTChgJHtpbnB1dH1gKTtcblx0XHRcdH1cblx0XHRcdGlucHV0ID0ge307XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcnNlZFVSTCA9IHBhcnNlVVJMKGlucHV0LnVybCk7XG5cdFx0fVxuXG5cdFx0bGV0IG1ldGhvZCA9IGluaXQubWV0aG9kIHx8IGlucHV0Lm1ldGhvZCB8fCAnR0VUJztcblx0XHRtZXRob2QgPSBtZXRob2QudG9VcHBlckNhc2UoKTtcblxuXHRcdGlmICgoaW5pdC5ib2R5ICE9IG51bGwgfHwgaXNSZXF1ZXN0KGlucHV0KSAmJiBpbnB1dC5ib2R5ICE9PSBudWxsKSAmJiAobWV0aG9kID09PSAnR0VUJyB8fCBtZXRob2QgPT09ICdIRUFEJykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlcXVlc3Qgd2l0aCBHRVQvSEVBRCBtZXRob2QgY2Fubm90IGhhdmUgYm9keScpO1xuXHRcdH1cblxuXHRcdGxldCBpbnB1dEJvZHkgPSBpbml0LmJvZHkgIT0gbnVsbCA/IGluaXQuYm9keSA6IGlzUmVxdWVzdChpbnB1dCkgJiYgaW5wdXQuYm9keSAhPT0gbnVsbCA/IGNsb25lKGlucHV0KSA6IG51bGw7XG5cblx0XHRCb2R5LmNhbGwodGhpcywgaW5wdXRCb2R5LCB7XG5cdFx0XHR0aW1lb3V0OiBpbml0LnRpbWVvdXQgfHwgaW5wdXQudGltZW91dCB8fCAwLFxuXHRcdFx0c2l6ZTogaW5pdC5zaXplIHx8IGlucHV0LnNpemUgfHwgMFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKGluaXQuaGVhZGVycyB8fCBpbnB1dC5oZWFkZXJzIHx8IHt9KTtcblxuXHRcdGlmIChpbnB1dEJvZHkgIT0gbnVsbCAmJiAhaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKSB7XG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IGV4dHJhY3RDb250ZW50VHlwZShpbnB1dEJvZHkpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlKSB7XG5cdFx0XHRcdGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCBjb250ZW50VHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IHNpZ25hbCA9IGlzUmVxdWVzdChpbnB1dCkgPyBpbnB1dC5zaWduYWwgOiBudWxsO1xuXHRcdGlmICgnc2lnbmFsJyBpbiBpbml0KSBzaWduYWwgPSBpbml0LnNpZ25hbDtcblxuXHRcdGlmIChzaWduYWwgIT0gbnVsbCAmJiAhaXNBYm9ydFNpZ25hbChzaWduYWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBzaWduYWwgdG8gYmUgYW4gaW5zdGFuY2VvZiBBYm9ydFNpZ25hbCcpO1xuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxTJDJdID0ge1xuXHRcdFx0bWV0aG9kLFxuXHRcdFx0cmVkaXJlY3Q6IGluaXQucmVkaXJlY3QgfHwgaW5wdXQucmVkaXJlY3QgfHwgJ2ZvbGxvdycsXG5cdFx0XHRoZWFkZXJzLFxuXHRcdFx0cGFyc2VkVVJMLFxuXHRcdFx0c2lnbmFsXG5cdFx0fTtcblxuXHRcdC8vIG5vZGUtZmV0Y2gtb25seSBvcHRpb25zXG5cdFx0dGhpcy5mb2xsb3cgPSBpbml0LmZvbGxvdyAhPT0gdW5kZWZpbmVkID8gaW5pdC5mb2xsb3cgOiBpbnB1dC5mb2xsb3cgIT09IHVuZGVmaW5lZCA/IGlucHV0LmZvbGxvdyA6IDIwO1xuXHRcdHRoaXMuY29tcHJlc3MgPSBpbml0LmNvbXByZXNzICE9PSB1bmRlZmluZWQgPyBpbml0LmNvbXByZXNzIDogaW5wdXQuY29tcHJlc3MgIT09IHVuZGVmaW5lZCA/IGlucHV0LmNvbXByZXNzIDogdHJ1ZTtcblx0XHR0aGlzLmNvdW50ZXIgPSBpbml0LmNvdW50ZXIgfHwgaW5wdXQuY291bnRlciB8fCAwO1xuXHRcdHRoaXMuYWdlbnQgPSBpbml0LmFnZW50IHx8IGlucHV0LmFnZW50O1xuXHR9XG5cblx0Z2V0IG1ldGhvZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMl0ubWV0aG9kO1xuXHR9XG5cblx0Z2V0IHVybCgpIHtcblx0XHRyZXR1cm4gZm9ybWF0X3VybCh0aGlzW0lOVEVSTkFMUyQyXS5wYXJzZWRVUkwpO1xuXHR9XG5cblx0Z2V0IGhlYWRlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDJdLmhlYWRlcnM7XG5cdH1cblxuXHRnZXQgcmVkaXJlY3QoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDJdLnJlZGlyZWN0O1xuXHR9XG5cblx0Z2V0IHNpZ25hbCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMl0uc2lnbmFsO1xuXHR9XG5cblx0LyoqXG4gICogQ2xvbmUgdGhpcyByZXF1ZXN0XG4gICpcbiAgKiBAcmV0dXJuICBSZXF1ZXN0XG4gICovXG5cdGNsb25lKCkge1xuXHRcdHJldHVybiBuZXcgUmVxdWVzdCh0aGlzKTtcblx0fVxufVxuXG5Cb2R5Lm1peEluKFJlcXVlc3QucHJvdG90eXBlKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlcXVlc3QucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcblx0dmFsdWU6ICdSZXF1ZXN0Jyxcblx0d3JpdGFibGU6IGZhbHNlLFxuXHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0Y29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVxdWVzdC5wcm90b3R5cGUsIHtcblx0bWV0aG9kOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0dXJsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0aGVhZGVyczogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHJlZGlyZWN0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0Y2xvbmU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRzaWduYWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgUmVxdWVzdCB0byBOb2RlLmpzIGh0dHAgcmVxdWVzdCBvcHRpb25zLlxuICpcbiAqIEBwYXJhbSAgIFJlcXVlc3QgIEEgUmVxdWVzdCBpbnN0YW5jZVxuICogQHJldHVybiAgT2JqZWN0ICAgVGhlIG9wdGlvbnMgb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBodHRwLnJlcXVlc3RcbiAqL1xuZnVuY3Rpb24gZ2V0Tm9kZVJlcXVlc3RPcHRpb25zKHJlcXVlc3QpIHtcblx0Y29uc3QgcGFyc2VkVVJMID0gcmVxdWVzdFtJTlRFUk5BTFMkMl0ucGFyc2VkVVJMO1xuXHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMocmVxdWVzdFtJTlRFUk5BTFMkMl0uaGVhZGVycyk7XG5cblx0Ly8gZmV0Y2ggc3RlcCAxLjNcblx0aWYgKCFoZWFkZXJzLmhhcygnQWNjZXB0JykpIHtcblx0XHRoZWFkZXJzLnNldCgnQWNjZXB0JywgJyovKicpO1xuXHR9XG5cblx0Ly8gQmFzaWMgZmV0Y2hcblx0aWYgKCFwYXJzZWRVUkwucHJvdG9jb2wgfHwgIXBhcnNlZFVSTC5ob3N0bmFtZSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09ubHkgYWJzb2x1dGUgVVJMcyBhcmUgc3VwcG9ydGVkJyk7XG5cdH1cblxuXHRpZiAoIS9eaHR0cHM/OiQvLnRlc3QocGFyc2VkVVJMLnByb3RvY29sKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09ubHkgSFRUUChTKSBwcm90b2NvbHMgYXJlIHN1cHBvcnRlZCcpO1xuXHR9XG5cblx0aWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3QuYm9keSBpbnN0YW5jZW9mIFN0cmVhbS5SZWFkYWJsZSAmJiAhc3RyZWFtRGVzdHJ1Y3Rpb25TdXBwb3J0ZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NhbmNlbGxhdGlvbiBvZiBzdHJlYW1lZCByZXF1ZXN0cyB3aXRoIEFib3J0U2lnbmFsIGlzIG5vdCBzdXBwb3J0ZWQgaW4gbm9kZSA8IDgnKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCBzdGVwcyAyLjQtMi43XG5cdGxldCBjb250ZW50TGVuZ3RoVmFsdWUgPSBudWxsO1xuXHRpZiAocmVxdWVzdC5ib2R5ID09IG51bGwgJiYgL14oUE9TVHxQVVQpJC9pLnRlc3QocmVxdWVzdC5tZXRob2QpKSB7XG5cdFx0Y29udGVudExlbmd0aFZhbHVlID0gJzAnO1xuXHR9XG5cdGlmIChyZXF1ZXN0LmJvZHkgIT0gbnVsbCkge1xuXHRcdGNvbnN0IHRvdGFsQnl0ZXMgPSBnZXRUb3RhbEJ5dGVzKHJlcXVlc3QpO1xuXHRcdGlmICh0eXBlb2YgdG90YWxCeXRlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdGNvbnRlbnRMZW5ndGhWYWx1ZSA9IFN0cmluZyh0b3RhbEJ5dGVzKTtcblx0XHR9XG5cdH1cblx0aWYgKGNvbnRlbnRMZW5ndGhWYWx1ZSkge1xuXHRcdGhlYWRlcnMuc2V0KCdDb250ZW50LUxlbmd0aCcsIGNvbnRlbnRMZW5ndGhWYWx1ZSk7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmstb3ItY2FjaGUgZmV0Y2ggc3RlcCAyLjExXG5cdGlmICghaGVhZGVycy5oYXMoJ1VzZXItQWdlbnQnKSkge1xuXHRcdGhlYWRlcnMuc2V0KCdVc2VyLUFnZW50JywgJ25vZGUtZmV0Y2gvMS4wICgraHR0cHM6Ly9naXRodWIuY29tL2JpdGlubi9ub2RlLWZldGNoKScpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXAgMi4xNVxuXHRpZiAocmVxdWVzdC5jb21wcmVzcyAmJiAhaGVhZGVycy5oYXMoJ0FjY2VwdC1FbmNvZGluZycpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ0FjY2VwdC1FbmNvZGluZycsICdnemlwLGRlZmxhdGUnKTtcblx0fVxuXG5cdGxldCBhZ2VudCA9IHJlcXVlc3QuYWdlbnQ7XG5cdGlmICh0eXBlb2YgYWdlbnQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRhZ2VudCA9IGFnZW50KHBhcnNlZFVSTCk7XG5cdH1cblxuXHRpZiAoIWhlYWRlcnMuaGFzKCdDb25uZWN0aW9uJykgJiYgIWFnZW50KSB7XG5cdFx0aGVhZGVycy5zZXQoJ0Nvbm5lY3Rpb24nLCAnY2xvc2UnKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yayBmZXRjaCBzdGVwIDQuMlxuXHQvLyBjaHVua2VkIGVuY29kaW5nIGlzIGhhbmRsZWQgYnkgTm9kZS5qc1xuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwYXJzZWRVUkwsIHtcblx0XHRtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuXHRcdGhlYWRlcnM6IGV4cG9ydE5vZGVDb21wYXRpYmxlSGVhZGVycyhoZWFkZXJzKSxcblx0XHRhZ2VudFxuXHR9KTtcbn1cblxuLyoqXG4gKiBhYm9ydC1lcnJvci5qc1xuICpcbiAqIEFib3J0RXJyb3IgaW50ZXJmYWNlIGZvciBjYW5jZWxsZWQgcmVxdWVzdHNcbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBBYm9ydEVycm9yIGluc3RhbmNlXG4gKlxuICogQHBhcmFtICAgU3RyaW5nICAgICAgbWVzc2FnZSAgICAgIEVycm9yIG1lc3NhZ2UgZm9yIGh1bWFuXG4gKiBAcmV0dXJuICBBYm9ydEVycm9yXG4gKi9cbmZ1bmN0aW9uIEFib3J0RXJyb3IobWVzc2FnZSkge1xuICBFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIHRoaXMudHlwZSA9ICdhYm9ydGVkJztcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblxuICAvLyBoaWRlIGN1c3RvbSBlcnJvciBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIGZyb20gZW5kLXVzZXJzXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xufVxuXG5BYm9ydEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkFib3J0RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWJvcnRFcnJvcjtcbkFib3J0RXJyb3IucHJvdG90eXBlLm5hbWUgPSAnQWJvcnRFcnJvcic7XG5cbmNvbnN0IFVSTCQxID0gVXJsLlVSTCB8fCB3aGF0d2dVcmwuVVJMO1xuXG4vLyBmaXggYW4gaXNzdWUgd2hlcmUgXCJQYXNzVGhyb3VnaFwiLCBcInJlc29sdmVcIiBhcmVuJ3QgYSBuYW1lZCBleHBvcnQgZm9yIG5vZGUgPDEwXG5jb25zdCBQYXNzVGhyb3VnaCQxID0gU3RyZWFtLlBhc3NUaHJvdWdoO1xuXG5jb25zdCBpc0RvbWFpbk9yU3ViZG9tYWluID0gZnVuY3Rpb24gaXNEb21haW5PclN1YmRvbWFpbihkZXN0aW5hdGlvbiwgb3JpZ2luYWwpIHtcblx0Y29uc3Qgb3JpZyA9IG5ldyBVUkwkMShvcmlnaW5hbCkuaG9zdG5hbWU7XG5cdGNvbnN0IGRlc3QgPSBuZXcgVVJMJDEoZGVzdGluYXRpb24pLmhvc3RuYW1lO1xuXG5cdHJldHVybiBvcmlnID09PSBkZXN0IHx8IG9yaWdbb3JpZy5sZW5ndGggLSBkZXN0Lmxlbmd0aCAtIDFdID09PSAnLicgJiYgb3JpZy5lbmRzV2l0aChkZXN0KTtcbn07XG5cbi8qKlxuICogRmV0Y2ggZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgICB1cmwgICBBYnNvbHV0ZSB1cmwgb3IgUmVxdWVzdCBpbnN0YW5jZVxuICogQHBhcmFtICAgT2JqZWN0ICAgb3B0cyAgRmV0Y2ggb3B0aW9uc1xuICogQHJldHVybiAgUHJvbWlzZVxuICovXG5mdW5jdGlvbiBmZXRjaCh1cmwsIG9wdHMpIHtcblxuXHQvLyBhbGxvdyBjdXN0b20gcHJvbWlzZVxuXHRpZiAoIWZldGNoLlByb21pc2UpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ25hdGl2ZSBwcm9taXNlIG1pc3NpbmcsIHNldCBmZXRjaC5Qcm9taXNlIHRvIHlvdXIgZmF2b3JpdGUgYWx0ZXJuYXRpdmUnKTtcblx0fVxuXG5cdEJvZHkuUHJvbWlzZSA9IGZldGNoLlByb21pc2U7XG5cblx0Ly8gd3JhcCBodHRwLnJlcXVlc3QgaW50byBmZXRjaFxuXHRyZXR1cm4gbmV3IGZldGNoLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdC8vIGJ1aWxkIHJlcXVlc3Qgb2JqZWN0XG5cdFx0Y29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybCwgb3B0cyk7XG5cdFx0Y29uc3Qgb3B0aW9ucyA9IGdldE5vZGVSZXF1ZXN0T3B0aW9ucyhyZXF1ZXN0KTtcblxuXHRcdGNvbnN0IHNlbmQgPSAob3B0aW9ucy5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyBodHRwcyA6IGh0dHApLnJlcXVlc3Q7XG5cdFx0Y29uc3Qgc2lnbmFsID0gcmVxdWVzdC5zaWduYWw7XG5cblx0XHRsZXQgcmVzcG9uc2UgPSBudWxsO1xuXG5cdFx0Y29uc3QgYWJvcnQgPSBmdW5jdGlvbiBhYm9ydCgpIHtcblx0XHRcdGxldCBlcnJvciA9IG5ldyBBYm9ydEVycm9yKCdUaGUgdXNlciBhYm9ydGVkIGEgcmVxdWVzdC4nKTtcblx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRpZiAocmVxdWVzdC5ib2R5ICYmIHJlcXVlc3QuYm9keSBpbnN0YW5jZW9mIFN0cmVhbS5SZWFkYWJsZSkge1xuXHRcdFx0XHRyZXF1ZXN0LmJvZHkuZGVzdHJveShlcnJvcik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5ib2R5KSByZXR1cm47XG5cdFx0XHRyZXNwb25zZS5ib2R5LmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXHRcdH07XG5cblx0XHRpZiAoc2lnbmFsICYmIHNpZ25hbC5hYm9ydGVkKSB7XG5cdFx0XHRhYm9ydCgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFib3J0QW5kRmluYWxpemUgPSBmdW5jdGlvbiBhYm9ydEFuZEZpbmFsaXplKCkge1xuXHRcdFx0YWJvcnQoKTtcblx0XHRcdGZpbmFsaXplKCk7XG5cdFx0fTtcblxuXHRcdC8vIHNlbmQgcmVxdWVzdFxuXHRcdGNvbnN0IHJlcSA9IHNlbmQob3B0aW9ucyk7XG5cdFx0bGV0IHJlcVRpbWVvdXQ7XG5cblx0XHRpZiAoc2lnbmFsKSB7XG5cdFx0XHRzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmaW5hbGl6ZSgpIHtcblx0XHRcdHJlcS5hYm9ydCgpO1xuXHRcdFx0aWYgKHNpZ25hbCkgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0XHRjbGVhclRpbWVvdXQocmVxVGltZW91dCk7XG5cdFx0fVxuXG5cdFx0aWYgKHJlcXVlc3QudGltZW91dCkge1xuXHRcdFx0cmVxLm9uY2UoJ3NvY2tldCcsIGZ1bmN0aW9uIChzb2NrZXQpIHtcblx0XHRcdFx0cmVxVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgbmV0d29yayB0aW1lb3V0IGF0OiAke3JlcXVlc3QudXJsfWAsICdyZXF1ZXN0LXRpbWVvdXQnKSk7XG5cdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0fSwgcmVxdWVzdC50aW1lb3V0KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJlcS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYHJlcXVlc3QgdG8gJHtyZXF1ZXN0LnVybH0gZmFpbGVkLCByZWFzb246ICR7ZXJyLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycikpO1xuXHRcdFx0ZmluYWxpemUoKTtcblx0XHR9KTtcblxuXHRcdHJlcS5vbigncmVzcG9uc2UnLCBmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQocmVxVGltZW91dCk7XG5cblx0XHRcdGNvbnN0IGhlYWRlcnMgPSBjcmVhdGVIZWFkZXJzTGVuaWVudChyZXMuaGVhZGVycyk7XG5cblx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1XG5cdFx0XHRpZiAoZmV0Y2guaXNSZWRpcmVjdChyZXMuc3RhdHVzQ29kZSkpIHtcblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuMlxuXHRcdFx0XHRjb25zdCBsb2NhdGlvbiA9IGhlYWRlcnMuZ2V0KCdMb2NhdGlvbicpO1xuXG5cdFx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1LjNcblx0XHRcdFx0bGV0IGxvY2F0aW9uVVJMID0gbnVsbDtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRsb2NhdGlvblVSTCA9IGxvY2F0aW9uID09PSBudWxsID8gbnVsbCA6IG5ldyBVUkwkMShsb2NhdGlvbiwgcmVxdWVzdC51cmwpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdC8vIGVycm9yIGhlcmUgY2FuIG9ubHkgYmUgaW52YWxpZCBVUkwgaW4gTG9jYXRpb246IGhlYWRlclxuXHRcdFx0XHRcdC8vIGRvIG5vdCB0aHJvdyB3aGVuIG9wdGlvbnMucmVkaXJlY3QgPT0gbWFudWFsXG5cdFx0XHRcdFx0Ly8gbGV0IHRoZSB1c2VyIGV4dHJhY3QgdGhlIGVycm9ybmVvdXMgcmVkaXJlY3QgVVJMXG5cdFx0XHRcdFx0aWYgKHJlcXVlc3QucmVkaXJlY3QgIT09ICdtYW51YWwnKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYHVyaSByZXF1ZXN0ZWQgcmVzcG9uZHMgd2l0aCBhbiBpbnZhbGlkIHJlZGlyZWN0IFVSTDogJHtsb2NhdGlvbn1gLCAnaW52YWxpZC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuNVxuXHRcdFx0XHRzd2l0Y2ggKHJlcXVlc3QucmVkaXJlY3QpIHtcblx0XHRcdFx0XHRjYXNlICdlcnJvcic6XG5cdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYHVyaSByZXF1ZXN0ZWQgcmVzcG9uZHMgd2l0aCBhIHJlZGlyZWN0LCByZWRpcmVjdCBtb2RlIGlzIHNldCB0byBlcnJvcjogJHtyZXF1ZXN0LnVybH1gLCAnbm8tcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGNhc2UgJ21hbnVhbCc6XG5cdFx0XHRcdFx0XHQvLyBub2RlLWZldGNoLXNwZWNpZmljIHN0ZXA6IG1ha2UgbWFudWFsIHJlZGlyZWN0IGEgYml0IGVhc2llciB0byB1c2UgYnkgc2V0dGluZyB0aGUgTG9jYXRpb24gaGVhZGVyIHZhbHVlIHRvIHRoZSByZXNvbHZlZCBVUkwuXG5cdFx0XHRcdFx0XHRpZiAobG9jYXRpb25VUkwgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0Ly8gaGFuZGxlIGNvcnJ1cHRlZCBoZWFkZXJcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzLnNldCgnTG9jYXRpb24nLCBsb2NhdGlvblVSTCk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdFx0XHRcdC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub2RlanMgc2VydmVyIHByZXZlbnQgaW52YWxpZCByZXNwb25zZSBoZWFkZXJzLCB3ZSBjYW4ndCB0ZXN0IHRoaXMgdGhyb3VnaCBub3JtYWwgcmVxdWVzdFxuXHRcdFx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdmb2xsb3cnOlxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDJcblx0XHRcdFx0XHRcdGlmIChsb2NhdGlvblVSTCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDVcblx0XHRcdFx0XHRcdGlmIChyZXF1ZXN0LmNvdW50ZXIgPj0gcmVxdWVzdC5mb2xsb3cpIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBtYXhpbXVtIHJlZGlyZWN0IHJlYWNoZWQgYXQ6ICR7cmVxdWVzdC51cmx9YCwgJ21heC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgNiAoY291bnRlciBpbmNyZW1lbnQpXG5cdFx0XHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgUmVxdWVzdCBvYmplY3QuXG5cdFx0XHRcdFx0XHRjb25zdCByZXF1ZXN0T3B0cyA9IHtcblx0XHRcdFx0XHRcdFx0aGVhZGVyczogbmV3IEhlYWRlcnMocmVxdWVzdC5oZWFkZXJzKSxcblx0XHRcdFx0XHRcdFx0Zm9sbG93OiByZXF1ZXN0LmZvbGxvdyxcblx0XHRcdFx0XHRcdFx0Y291bnRlcjogcmVxdWVzdC5jb3VudGVyICsgMSxcblx0XHRcdFx0XHRcdFx0YWdlbnQ6IHJlcXVlc3QuYWdlbnQsXG5cdFx0XHRcdFx0XHRcdGNvbXByZXNzOiByZXF1ZXN0LmNvbXByZXNzLFxuXHRcdFx0XHRcdFx0XHRtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuXHRcdFx0XHRcdFx0XHRib2R5OiByZXF1ZXN0LmJvZHksXG5cdFx0XHRcdFx0XHRcdHNpZ25hbDogcmVxdWVzdC5zaWduYWwsXG5cdFx0XHRcdFx0XHRcdHRpbWVvdXQ6IHJlcXVlc3QudGltZW91dCxcblx0XHRcdFx0XHRcdFx0c2l6ZTogcmVxdWVzdC5zaXplXG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRpZiAoIWlzRG9tYWluT3JTdWJkb21haW4ocmVxdWVzdC51cmwsIGxvY2F0aW9uVVJMKSkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgWydhdXRob3JpemF0aW9uJywgJ3d3dy1hdXRoZW50aWNhdGUnLCAnY29va2llJywgJ2Nvb2tpZTInXSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRzLmhlYWRlcnMuZGVsZXRlKG5hbWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA5XG5cdFx0XHRcdFx0XHRpZiAocmVzLnN0YXR1c0NvZGUgIT09IDMwMyAmJiByZXF1ZXN0LmJvZHkgJiYgZ2V0VG90YWxCeXRlcyhyZXF1ZXN0KSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ0Nhbm5vdCBmb2xsb3cgcmVkaXJlY3Qgd2l0aCBib2R5IGJlaW5nIGEgcmVhZGFibGUgc3RyZWFtJywgJ3Vuc3VwcG9ydGVkLXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxMVxuXHRcdFx0XHRcdFx0aWYgKHJlcy5zdGF0dXNDb2RlID09PSAzMDMgfHwgKHJlcy5zdGF0dXNDb2RlID09PSAzMDEgfHwgcmVzLnN0YXR1c0NvZGUgPT09IDMwMikgJiYgcmVxdWVzdC5tZXRob2QgPT09ICdQT1NUJykge1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0cy5tZXRob2QgPSAnR0VUJztcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdHMuYm9keSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdHMuaGVhZGVycy5kZWxldGUoJ2NvbnRlbnQtbGVuZ3RoJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxNVxuXHRcdFx0XHRcdFx0cmVzb2x2ZShmZXRjaChuZXcgUmVxdWVzdChsb2NhdGlvblVSTCwgcmVxdWVzdE9wdHMpKSk7XG5cdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHByZXBhcmUgcmVzcG9uc2Vcblx0XHRcdHJlcy5vbmNlKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmIChzaWduYWwpIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdFx0fSk7XG5cdFx0XHRsZXQgYm9keSA9IHJlcy5waXBlKG5ldyBQYXNzVGhyb3VnaCQxKCkpO1xuXG5cdFx0XHRjb25zdCByZXNwb25zZV9vcHRpb25zID0ge1xuXHRcdFx0XHR1cmw6IHJlcXVlc3QudXJsLFxuXHRcdFx0XHRzdGF0dXM6IHJlcy5zdGF0dXNDb2RlLFxuXHRcdFx0XHRzdGF0dXNUZXh0OiByZXMuc3RhdHVzTWVzc2FnZSxcblx0XHRcdFx0aGVhZGVyczogaGVhZGVycyxcblx0XHRcdFx0c2l6ZTogcmVxdWVzdC5zaXplLFxuXHRcdFx0XHR0aW1lb3V0OiByZXF1ZXN0LnRpbWVvdXQsXG5cdFx0XHRcdGNvdW50ZXI6IHJlcXVlc3QuY291bnRlclxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gSFRUUC1uZXR3b3JrIGZldGNoIHN0ZXAgMTIuMS4xLjNcblx0XHRcdGNvbnN0IGNvZGluZ3MgPSBoZWFkZXJzLmdldCgnQ29udGVudC1FbmNvZGluZycpO1xuXG5cdFx0XHQvLyBIVFRQLW5ldHdvcmsgZmV0Y2ggc3RlcCAxMi4xLjEuNDogaGFuZGxlIGNvbnRlbnQgY29kaW5nc1xuXG5cdFx0XHQvLyBpbiBmb2xsb3dpbmcgc2NlbmFyaW9zIHdlIGlnbm9yZSBjb21wcmVzc2lvbiBzdXBwb3J0XG5cdFx0XHQvLyAxLiBjb21wcmVzc2lvbiBzdXBwb3J0IGlzIGRpc2FibGVkXG5cdFx0XHQvLyAyLiBIRUFEIHJlcXVlc3Rcblx0XHRcdC8vIDMuIG5vIENvbnRlbnQtRW5jb2RpbmcgaGVhZGVyXG5cdFx0XHQvLyA0LiBubyBjb250ZW50IHJlc3BvbnNlICgyMDQpXG5cdFx0XHQvLyA1LiBjb250ZW50IG5vdCBtb2RpZmllZCByZXNwb25zZSAoMzA0KVxuXHRcdFx0aWYgKCFyZXF1ZXN0LmNvbXByZXNzIHx8IHJlcXVlc3QubWV0aG9kID09PSAnSEVBRCcgfHwgY29kaW5ncyA9PT0gbnVsbCB8fCByZXMuc3RhdHVzQ29kZSA9PT0gMjA0IHx8IHJlcy5zdGF0dXNDb2RlID09PSAzMDQpIHtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvciBOb2RlIHY2K1xuXHRcdFx0Ly8gQmUgbGVzcyBzdHJpY3Qgd2hlbiBkZWNvZGluZyBjb21wcmVzc2VkIHJlc3BvbnNlcywgc2luY2Ugc29tZXRpbWVzXG5cdFx0XHQvLyBzZXJ2ZXJzIHNlbmQgc2xpZ2h0bHkgaW52YWxpZCByZXNwb25zZXMgdGhhdCBhcmUgc3RpbGwgYWNjZXB0ZWRcblx0XHRcdC8vIGJ5IGNvbW1vbiBicm93c2Vycy5cblx0XHRcdC8vIEFsd2F5cyB1c2luZyBaX1NZTkNfRkxVU0ggaXMgd2hhdCBjVVJMIGRvZXMuXG5cdFx0XHRjb25zdCB6bGliT3B0aW9ucyA9IHtcblx0XHRcdFx0Zmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNILFxuXHRcdFx0XHRmaW5pc2hGbHVzaDogemxpYi5aX1NZTkNfRkxVU0hcblx0XHRcdH07XG5cblx0XHRcdC8vIGZvciBnemlwXG5cdFx0XHRpZiAoY29kaW5ncyA9PSAnZ3ppcCcgfHwgY29kaW5ncyA9PSAneC1nemlwJykge1xuXHRcdFx0XHRib2R5ID0gYm9keS5waXBlKHpsaWIuY3JlYXRlR3VuemlwKHpsaWJPcHRpb25zKSk7XG5cdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmb3IgZGVmbGF0ZVxuXHRcdFx0aWYgKGNvZGluZ3MgPT0gJ2RlZmxhdGUnIHx8IGNvZGluZ3MgPT0gJ3gtZGVmbGF0ZScpIHtcblx0XHRcdFx0Ly8gaGFuZGxlIHRoZSBpbmZhbW91cyByYXcgZGVmbGF0ZSByZXNwb25zZSBmcm9tIG9sZCBzZXJ2ZXJzXG5cdFx0XHRcdC8vIGEgaGFjayBmb3Igb2xkIElJUyBhbmQgQXBhY2hlIHNlcnZlcnNcblx0XHRcdFx0Y29uc3QgcmF3ID0gcmVzLnBpcGUobmV3IFBhc3NUaHJvdWdoJDEoKSk7XG5cdFx0XHRcdHJhdy5vbmNlKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XG5cdFx0XHRcdFx0Ly8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzc1MTk4Mjhcblx0XHRcdFx0XHRpZiAoKGNodW5rWzBdICYgMHgwRikgPT09IDB4MDgpIHtcblx0XHRcdFx0XHRcdGJvZHkgPSBib2R5LnBpcGUoemxpYi5jcmVhdGVJbmZsYXRlKCkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRib2R5ID0gYm9keS5waXBlKHpsaWIuY3JlYXRlSW5mbGF0ZVJhdygpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZvciBiclxuXHRcdFx0aWYgKGNvZGluZ3MgPT0gJ2JyJyAmJiB0eXBlb2YgemxpYi5jcmVhdGVCcm90bGlEZWNvbXByZXNzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGJvZHkgPSBib2R5LnBpcGUoemxpYi5jcmVhdGVCcm90bGlEZWNvbXByZXNzKCkpO1xuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZV9vcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gb3RoZXJ3aXNlLCB1c2UgcmVzcG9uc2UgYXMtaXNcblx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSk7XG5cblx0XHR3cml0ZVRvU3RyZWFtKHJlcSwgcmVxdWVzdCk7XG5cdH0pO1xufVxuLyoqXG4gKiBSZWRpcmVjdCBjb2RlIG1hdGNoaW5nXG4gKlxuICogQHBhcmFtICAgTnVtYmVyICAgY29kZSAgU3RhdHVzIGNvZGVcbiAqIEByZXR1cm4gIEJvb2xlYW5cbiAqL1xuZmV0Y2guaXNSZWRpcmVjdCA9IGZ1bmN0aW9uIChjb2RlKSB7XG5cdHJldHVybiBjb2RlID09PSAzMDEgfHwgY29kZSA9PT0gMzAyIHx8IGNvZGUgPT09IDMwMyB8fCBjb2RlID09PSAzMDcgfHwgY29kZSA9PT0gMzA4O1xufTtcblxuLy8gZXhwb3NlIFByb21pc2VcbmZldGNoLlByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmV0Y2g7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzO1xuZXhwb3J0cy5IZWFkZXJzID0gSGVhZGVycztcbmV4cG9ydHMuUmVxdWVzdCA9IFJlcXVlc3Q7XG5leHBvcnRzLlJlc3BvbnNlID0gUmVzcG9uc2U7XG5leHBvcnRzLkZldGNoRXJyb3IgPSBGZXRjaEVycm9yO1xuIiwgImNvbnN0IG5vZGVGZXRjaCA9IHJlcXVpcmUoJ25vZGUtZmV0Y2gnKVxuY29uc3QgcmVhbEZldGNoID0gbm9kZUZldGNoLmRlZmF1bHQgfHwgbm9kZUZldGNoXG5cbmNvbnN0IGZldGNoID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICAvLyBTdXBwb3J0IHNjaGVtYWxlc3MgVVJJcyBvbiB0aGUgc2VydmVyIGZvciBwYXJpdHkgd2l0aCB0aGUgYnJvd3Nlci5cbiAgLy8gRXg6IC8vZ2l0aHViLmNvbS8gLT4gaHR0cHM6Ly9naXRodWIuY29tL1xuICBpZiAoL15cXC9cXC8vLnRlc3QodXJsKSkge1xuICAgIHVybCA9ICdodHRwczonICsgdXJsXG4gIH1cbiAgcmV0dXJuIHJlYWxGZXRjaC5jYWxsKHRoaXMsIHVybCwgb3B0aW9ucylcbn1cblxuZmV0Y2gucG9ueWZpbGwgPSB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZldGNoXG5leHBvcnRzLmZldGNoID0gZmV0Y2hcbmV4cG9ydHMuSGVhZGVycyA9IG5vZGVGZXRjaC5IZWFkZXJzXG5leHBvcnRzLlJlcXVlc3QgPSBub2RlRmV0Y2guUmVxdWVzdFxuZXhwb3J0cy5SZXNwb25zZSA9IG5vZGVGZXRjaC5SZXNwb25zZVxuXG4vLyBOZWVkZWQgZm9yIFR5cGVTY3JpcHQgY29uc3VtZXJzIHdpdGhvdXQgZXNNb2R1bGVJbnRlcm9wLlxuZXhwb3J0cy5kZWZhdWx0ID0gZmV0Y2hcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXNlRmV0Y2ggPSB2b2lkIDA7XG5jb25zdCByZWFjdF8xID0gcmVxdWlyZShcInJlYWN0XCIpO1xuY29uc3QgbWVkaWFfdHlwZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibWVkaWEtdHlwZXJcIikpO1xuY29uc3QgY29udGVudF90eXBlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImNvbnRlbnQtdHlwZVwiKSk7XG5jb25zdCB1c2VDYWNoZWRQcm9taXNlXzEgPSByZXF1aXJlKFwiLi91c2VDYWNoZWRQcm9taXNlXCIpO1xuY29uc3QgdXNlTGF0ZXN0XzEgPSByZXF1aXJlKFwiLi91c2VMYXRlc3RcIik7XG5jb25zdCB7IGVtaXRXYXJuaW5nIH0gPSBwcm9jZXNzO1xuLy8gdG8gcmVtb3ZlIHdoZW4gd2Ugc3dpdGNoIHRvIE5vZGUgMThcbnByb2Nlc3MuZW1pdFdhcm5pbmcgPSAod2FybmluZywgLi4uYXJncykgPT4ge1xuICAgIGlmIChhcmdzWzBdID09PSBcIkV4cGVyaW1lbnRhbFdhcm5pbmdcIikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChhcmdzWzBdICYmIHR5cGVvZiBhcmdzWzBdID09PSBcIm9iamVjdFwiICYmIGFyZ3NbMF0udHlwZSA9PT0gXCJFeHBlcmltZW50YWxXYXJuaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHRvbyBtYW55IGRpZmZlcmVudCB0eXBlcyBidXQgaXQncyBvayBzaW5jZSB3ZSBwYXNzIHdoYXQgd2FzIHBhc3NlZFxuICAgIHJldHVybiBlbWl0V2FybmluZyh3YXJuaW5nLCAuLi5hcmdzKTtcbn07XG5jb25zdCBjcm9zc19mZXRjaF8xID0gcmVxdWlyZShcImNyb3NzLWZldGNoXCIpO1xuZnVuY3Rpb24gaXNKU09OKGNvbnRlbnRUeXBlSGVhZGVyKSB7XG4gICAgaWYgKGNvbnRlbnRUeXBlSGVhZGVyKSB7XG4gICAgICAgIGNvbnN0IGN0ID0gY29udGVudF90eXBlXzEuZGVmYXVsdC5wYXJzZShjb250ZW50VHlwZUhlYWRlcik7XG4gICAgICAgIGNvbnN0IG1lZGlhVHlwZSA9IG1lZGlhX3R5cGVyXzEuZGVmYXVsdC5wYXJzZShjdC50eXBlKTtcbiAgICAgICAgaWYgKG1lZGlhVHlwZS5zdWJ0eXBlID09PSBcImpzb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lZGlhVHlwZS5zdWZmaXggPT09IFwianNvblwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVkaWFUeXBlLnN1ZmZpeCAmJiAvXFxianNvblxcYi9pLnRlc3QobWVkaWFUeXBlLnN1ZmZpeCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWRpYVR5cGUuc3VidHlwZSAmJiAvXFxianNvblxcYi9pLnRlc3QobWVkaWFUeXBlLnN1YnR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZyhyZXNwb25zZSkge1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH1cbiAgICBjb25zdCBjb250ZW50VHlwZUhlYWRlciA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xuICAgIGlmIChjb250ZW50VHlwZUhlYWRlciAmJiBpc0pTT04oY29udGVudFR5cGVIZWFkZXIpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG59XG4vKipcbiAqIEZldGNoIHRoZSBVUkwgYW5kIHJldHVybnMgdGhlIHtAbGluayBBc3luY1N0YXRlfSBjb3JyZXNwb25kaW5nIHRvIHRoZSBleGVjdXRpb24gb2YgdGhlIGZldGNoLiBUaGUgbGFzdCB2YWx1ZSB3aWxsIGJlIGtlcHQgYmV0d2VlbiBjb21tYW5kIHJ1bnMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogaW1wb3J0IHsgdXNlRmV0Y2ggfSBmcm9tICdAcmF5Y2FzdC91dGlscyc7XG4gKlxuICogY29uc3QgRGVtbyA9ICgpID0+IHtcbiAqICAgY29uc3QgeyBpc0xvYWRpbmcsIGRhdGEsIHJldmFsaWRhdGUgfSA9IHVzZUZldGNoKCdodHRwczovL2FwaS5leGFtcGxlJyk7XG4gKlxuICogICByZXR1cm4gKFxuICogICAgIDxEZXRhaWxcbiAqICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICogICAgICAgbWFya2Rvd249e2RhdGF9XG4gKiAgICAgICBhY3Rpb25zPXtcbiAqICAgICAgICAgPEFjdGlvblBhbmVsPlxuICogICAgICAgICAgIDxBY3Rpb24gdGl0bGU9XCJSZWxvYWRcIiBvbkFjdGlvbj17KCkgPT4gcmV2YWxpZGF0ZSgpfSAvPlxuICogICAgICAgICA8L0FjdGlvblBhbmVsPlxuICogICAgICAgfVxuICogICAgIC8+XG4gKiAgICk7XG4gKiB9O1xuICogYGBgXG4gKi9cbmZ1bmN0aW9uIHVzZUZldGNoKHVybCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgcGFyc2VSZXNwb25zZSwgaW5pdGlhbERhdGEsIGV4ZWN1dGUsIGtlZXBQcmV2aW91c0RhdGEsIG9uRXJyb3IsIG9uRGF0YSwgb25XaWxsRXhlY3V0ZSwgLi4uZmV0Y2hPcHRpb25zIH0gPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IHVzZUNhY2hlZFByb21pc2VPcHRpb25zID0ge1xuICAgICAgICBpbml0aWFsRGF0YSxcbiAgICAgICAgZXhlY3V0ZSxcbiAgICAgICAga2VlcFByZXZpb3VzRGF0YSxcbiAgICAgICAgb25FcnJvcixcbiAgICAgICAgb25EYXRhLFxuICAgICAgICBvbldpbGxFeGVjdXRlLFxuICAgIH07XG4gICAgY29uc3QgcGFyc2VSZXNwb25zZVJlZiA9ICgwLCB1c2VMYXRlc3RfMS51c2VMYXRlc3QpKHBhcnNlUmVzcG9uc2UgfHwgZGVmYXVsdFBhcnNpbmcpO1xuICAgIGNvbnN0IGFib3J0YWJsZSA9ICgwLCByZWFjdF8xLnVzZVJlZikoKTtcbiAgICBjb25zdCBmbiA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKShhc3luYyAodXJsLCBvcHRpb25zKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0ICgwLCBjcm9zc19mZXRjaF8xLmZldGNoKSh1cmwsIHsgc2lnbmFsOiBhYm9ydGFibGUuY3VycmVudD8uc2lnbmFsLCAuLi5vcHRpb25zIH0pO1xuICAgICAgICByZXR1cm4gKGF3YWl0IHBhcnNlUmVzcG9uc2VSZWYuY3VycmVudChyZXMpKTtcbiAgICB9LCBbcGFyc2VSZXNwb25zZVJlZl0pO1xuICAgIHJldHVybiAoMCwgdXNlQ2FjaGVkUHJvbWlzZV8xLnVzZUNhY2hlZFByb21pc2UpKGZuLCBbdXJsLCBmZXRjaE9wdGlvbnNdLCB7IC4uLnVzZUNhY2hlZFByb21pc2VPcHRpb25zLCBhYm9ydGFibGUgfSk7XG59XG5leHBvcnRzLnVzZUZldGNoID0gdXNlRmV0Y2g7XG4iLCAiLy8gVGhpcyBpcyBub3QgdGhlIHNldCBvZiBhbGwgcG9zc2libGUgc2lnbmFscy5cbi8vXG4vLyBJdCBJUywgaG93ZXZlciwgdGhlIHNldCBvZiBhbGwgc2lnbmFscyB0aGF0IHRyaWdnZXJcbi8vIGFuIGV4aXQgb24gZWl0aGVyIExpbnV4IG9yIEJTRCBzeXN0ZW1zLiAgTGludXggaXMgYVxuLy8gc3VwZXJzZXQgb2YgdGhlIHNpZ25hbCBuYW1lcyBzdXBwb3J0ZWQgb24gQlNELCBhbmRcbi8vIHRoZSB1bmtub3duIHNpZ25hbHMganVzdCBmYWlsIHRvIHJlZ2lzdGVyLCBzbyB3ZSBjYW5cbi8vIGNhdGNoIHRoYXQgZWFzaWx5IGVub3VnaC5cbi8vXG4vLyBEb24ndCBib3RoZXIgd2l0aCBTSUdLSUxMLiAgSXQncyB1bmNhdGNoYWJsZSwgd2hpY2hcbi8vIG1lYW5zIHRoYXQgd2UgY2FuJ3QgZmlyZSBhbnkgY2FsbGJhY2tzIGFueXdheS5cbi8vXG4vLyBJZiBhIHVzZXIgZG9lcyBoYXBwZW4gdG8gcmVnaXN0ZXIgYSBoYW5kbGVyIG9uIGEgbm9uLVxuLy8gZmF0YWwgc2lnbmFsIGxpa2UgU0lHV0lOQ0ggb3Igc29tZXRoaW5nLCBhbmQgdGhlblxuLy8gZXhpdCwgaXQnbGwgZW5kIHVwIGZpcmluZyBgcHJvY2Vzcy5lbWl0KCdleGl0JylgLCBzb1xuLy8gdGhlIGhhbmRsZXIgd2lsbCBiZSBmaXJlZCBhbnl3YXkuXG4vL1xuLy8gU0lHQlVTLCBTSUdGUEUsIFNJR1NFR1YgYW5kIFNJR0lMTCwgd2hlbiBub3QgcmFpc2VkXG4vLyBhcnRpZmljaWFsbHksIGluaGVyZW50bHkgbGVhdmUgdGhlIHByb2Nlc3MgaW4gYVxuLy8gc3RhdGUgZnJvbSB3aGljaCBpdCBpcyBub3Qgc2FmZSB0byB0cnkgYW5kIGVudGVyIEpTXG4vLyBsaXN0ZW5lcnMuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ1NJR0FCUlQnLFxuICAnU0lHQUxSTScsXG4gICdTSUdIVVAnLFxuICAnU0lHSU5UJyxcbiAgJ1NJR1RFUk0nXG5dXG5cbmlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gIG1vZHVsZS5leHBvcnRzLnB1c2goXG4gICAgJ1NJR1ZUQUxSTScsXG4gICAgJ1NJR1hDUFUnLFxuICAgICdTSUdYRlNaJyxcbiAgICAnU0lHVVNSMicsXG4gICAgJ1NJR1RSQVAnLFxuICAgICdTSUdTWVMnLFxuICAgICdTSUdRVUlUJyxcbiAgICAnU0lHSU9UJ1xuICAgIC8vIHNob3VsZCBkZXRlY3QgcHJvZmlsZXIgYW5kIGVuYWJsZS9kaXNhYmxlIGFjY29yZGluZ2x5LlxuICAgIC8vIHNlZSAjMjFcbiAgICAvLyAnU0lHUFJPRidcbiAgKVxufVxuXG5pZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICBtb2R1bGUuZXhwb3J0cy5wdXNoKFxuICAgICdTSUdJTycsXG4gICAgJ1NJR1BPTEwnLFxuICAgICdTSUdQV1InLFxuICAgICdTSUdTVEtGTFQnLFxuICAgICdTSUdVTlVTRUQnXG4gIClcbn1cbiIsICIvLyBOb3RlOiBzaW5jZSBueWMgdXNlcyB0aGlzIG1vZHVsZSB0byBvdXRwdXQgY292ZXJhZ2UsIGFueSBsaW5lc1xuLy8gdGhhdCBhcmUgaW4gdGhlIGRpcmVjdCBzeW5jIGZsb3cgb2YgbnljJ3Mgb3V0cHV0Q292ZXJhZ2UgYXJlXG4vLyBpZ25vcmVkLCBzaW5jZSB3ZSBjYW4gbmV2ZXIgZ2V0IGNvdmVyYWdlIGZvciB0aGVtLlxuLy8gZ3JhYiBhIHJlZmVyZW5jZSB0byBub2RlJ3MgcmVhbCBwcm9jZXNzIG9iamVjdCByaWdodCBhd2F5XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzXG5cbmNvbnN0IHByb2Nlc3NPayA9IGZ1bmN0aW9uIChwcm9jZXNzKSB7XG4gIHJldHVybiBwcm9jZXNzICYmXG4gICAgdHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmXG4gICAgdHlwZW9mIHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicgJiZcbiAgICB0eXBlb2YgcHJvY2Vzcy5lbWl0ID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIHByb2Nlc3MucmVhbGx5RXhpdCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHR5cGVvZiBwcm9jZXNzLmxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHR5cGVvZiBwcm9jZXNzLmtpbGwgPT09ICdmdW5jdGlvbicgJiZcbiAgICB0eXBlb2YgcHJvY2Vzcy5waWQgPT09ICdudW1iZXInICYmXG4gICAgdHlwZW9mIHByb2Nlc3Mub24gPT09ICdmdW5jdGlvbidcbn1cblxuLy8gc29tZSBraW5kIG9mIG5vbi1ub2RlIGVudmlyb25tZW50LCBqdXN0IG5vLW9wXG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbmlmICghcHJvY2Vzc09rKHByb2Nlc3MpKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fVxuICB9XG59IGVsc2Uge1xuICB2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0JylcbiAgdmFyIHNpZ25hbHMgPSByZXF1aXJlKCcuL3NpZ25hbHMuanMnKVxuICB2YXIgaXNXaW4gPSAvXndpbi9pLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSlcblxuICB2YXIgRUUgPSByZXF1aXJlKCdldmVudHMnKVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBFRSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIEVFID0gRUUuRXZlbnRFbWl0dGVyXG4gIH1cblxuICB2YXIgZW1pdHRlclxuICBpZiAocHJvY2Vzcy5fX3NpZ25hbF9leGl0X2VtaXR0ZXJfXykge1xuICAgIGVtaXR0ZXIgPSBwcm9jZXNzLl9fc2lnbmFsX2V4aXRfZW1pdHRlcl9fXG4gIH0gZWxzZSB7XG4gICAgZW1pdHRlciA9IHByb2Nlc3MuX19zaWduYWxfZXhpdF9lbWl0dGVyX18gPSBuZXcgRUUoKVxuICAgIGVtaXR0ZXIuY291bnQgPSAwXG4gICAgZW1pdHRlci5lbWl0dGVkID0ge31cbiAgfVxuXG4gIC8vIEJlY2F1c2UgdGhpcyBlbWl0dGVyIGlzIGEgZ2xvYmFsLCB3ZSBoYXZlIHRvIGNoZWNrIHRvIHNlZSBpZiBhXG4gIC8vIHByZXZpb3VzIHZlcnNpb24gb2YgdGhpcyBsaWJyYXJ5IGZhaWxlZCB0byBlbmFibGUgaW5maW5pdGUgbGlzdGVuZXJzLlxuICAvLyBJIGtub3cgd2hhdCB5b3UncmUgYWJvdXQgdG8gc2F5LiAgQnV0IGxpdGVyYWxseSBldmVyeXRoaW5nIGFib3V0XG4gIC8vIHNpZ25hbC1leGl0IGlzIGEgY29tcHJvbWlzZSB3aXRoIGV2aWwuICBHZXQgdXNlZCB0byBpdC5cbiAgaWYgKCFlbWl0dGVyLmluZmluaXRlKSB7XG4gICAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoSW5maW5pdHkpXG4gICAgZW1pdHRlci5pbmZpbml0ZSA9IHRydWVcbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNiLCBvcHRzKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFwcm9jZXNzT2soZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge31cbiAgICB9XG4gICAgYXNzZXJ0LmVxdWFsKHR5cGVvZiBjYiwgJ2Z1bmN0aW9uJywgJ2EgY2FsbGJhY2sgbXVzdCBiZSBwcm92aWRlZCBmb3IgZXhpdCBoYW5kbGVyJylcblxuICAgIGlmIChsb2FkZWQgPT09IGZhbHNlKSB7XG4gICAgICBsb2FkKClcbiAgICB9XG5cbiAgICB2YXIgZXYgPSAnZXhpdCdcbiAgICBpZiAob3B0cyAmJiBvcHRzLmFsd2F5c0xhc3QpIHtcbiAgICAgIGV2ID0gJ2FmdGVyZXhpdCdcbiAgICB9XG5cbiAgICB2YXIgcmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihldiwgY2IpXG4gICAgICBpZiAoZW1pdHRlci5saXN0ZW5lcnMoJ2V4aXQnKS5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICBlbWl0dGVyLmxpc3RlbmVycygnYWZ0ZXJleGl0JykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHVubG9hZCgpXG4gICAgICB9XG4gICAgfVxuICAgIGVtaXR0ZXIub24oZXYsIGNiKVxuXG4gICAgcmV0dXJuIHJlbW92ZVxuICB9XG5cbiAgdmFyIHVubG9hZCA9IGZ1bmN0aW9uIHVubG9hZCAoKSB7XG4gICAgaWYgKCFsb2FkZWQgfHwgIXByb2Nlc3NPayhnbG9iYWwucHJvY2VzcykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBsb2FkZWQgPSBmYWxzZVxuXG4gICAgc2lnbmFscy5mb3JFYWNoKGZ1bmN0aW9uIChzaWcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIoc2lnLCBzaWdMaXN0ZW5lcnNbc2lnXSlcbiAgICAgIH0gY2F0Y2ggKGVyKSB7fVxuICAgIH0pXG4gICAgcHJvY2Vzcy5lbWl0ID0gb3JpZ2luYWxQcm9jZXNzRW1pdFxuICAgIHByb2Nlc3MucmVhbGx5RXhpdCA9IG9yaWdpbmFsUHJvY2Vzc1JlYWxseUV4aXRcbiAgICBlbWl0dGVyLmNvdW50IC09IDFcbiAgfVxuICBtb2R1bGUuZXhwb3J0cy51bmxvYWQgPSB1bmxvYWRcblxuICB2YXIgZW1pdCA9IGZ1bmN0aW9uIGVtaXQgKGV2ZW50LCBjb2RlLCBzaWduYWwpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoZW1pdHRlci5lbWl0dGVkW2V2ZW50XSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGVtaXR0ZXIuZW1pdHRlZFtldmVudF0gPSB0cnVlXG4gICAgZW1pdHRlci5lbWl0KGV2ZW50LCBjb2RlLCBzaWduYWwpXG4gIH1cblxuICAvLyB7IDxzaWduYWw+OiA8bGlzdGVuZXIgZm4+LCAuLi4gfVxuICB2YXIgc2lnTGlzdGVuZXJzID0ge31cbiAgc2lnbmFscy5mb3JFYWNoKGZ1bmN0aW9uIChzaWcpIHtcbiAgICBzaWdMaXN0ZW5lcnNbc2lnXSA9IGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCFwcm9jZXNzT2soZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG90aGVyIGxpc3RlbmVycywgYW4gZXhpdCBpcyBjb21pbmchXG4gICAgICAvLyBTaW1wbGVzdCB3YXk6IHJlbW92ZSB1cyBhbmQgdGhlbiByZS1zZW5kIHRoZSBzaWduYWwuXG4gICAgICAvLyBXZSBrbm93IHRoYXQgdGhpcyB3aWxsIGtpbGwgdGhlIHByb2Nlc3MsIHNvIHdlIGNhblxuICAgICAgLy8gc2FmZWx5IGVtaXQgbm93LlxuICAgICAgdmFyIGxpc3RlbmVycyA9IHByb2Nlc3MubGlzdGVuZXJzKHNpZylcbiAgICAgIGlmIChsaXN0ZW5lcnMubGVuZ3RoID09PSBlbWl0dGVyLmNvdW50KSB7XG4gICAgICAgIHVubG9hZCgpXG4gICAgICAgIGVtaXQoJ2V4aXQnLCBudWxsLCBzaWcpXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGVtaXQoJ2FmdGVyZXhpdCcsIG51bGwsIHNpZylcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKGlzV2luICYmIHNpZyA9PT0gJ1NJR0hVUCcpIHtcbiAgICAgICAgICAvLyBcIlNJR0hVUFwiIHRocm93cyBhbiBgRU5PU1lTYCBlcnJvciBvbiBXaW5kb3dzLFxuICAgICAgICAgIC8vIHNvIHVzZSBhIHN1cHBvcnRlZCBzaWduYWwgaW5zdGVhZFxuICAgICAgICAgIHNpZyA9ICdTSUdJTlQnXG4gICAgICAgIH1cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgcHJvY2Vzcy5raWxsKHByb2Nlc3MucGlkLCBzaWcpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIG1vZHVsZS5leHBvcnRzLnNpZ25hbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHNpZ25hbHNcbiAgfVxuXG4gIHZhciBsb2FkZWQgPSBmYWxzZVxuXG4gIHZhciBsb2FkID0gZnVuY3Rpb24gbG9hZCAoKSB7XG4gICAgaWYgKGxvYWRlZCB8fCAhcHJvY2Vzc09rKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxvYWRlZCA9IHRydWVcblxuICAgIC8vIFRoaXMgaXMgdGhlIG51bWJlciBvZiBvblNpZ25hbEV4aXQncyB0aGF0IGFyZSBpbiBwbGF5LlxuICAgIC8vIEl0J3MgaW1wb3J0YW50IHNvIHRoYXQgd2UgY2FuIGNvdW50IHRoZSBjb3JyZWN0IG51bWJlciBvZlxuICAgIC8vIGxpc3RlbmVycyBvbiBzaWduYWxzLCBhbmQgZG9uJ3Qgd2FpdCBmb3IgdGhlIG90aGVyIG9uZSB0b1xuICAgIC8vIGhhbmRsZSBpdCBpbnN0ZWFkIG9mIHVzLlxuICAgIGVtaXR0ZXIuY291bnQgKz0gMVxuXG4gICAgc2lnbmFscyA9IHNpZ25hbHMuZmlsdGVyKGZ1bmN0aW9uIChzaWcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByb2Nlc3Mub24oc2lnLCBzaWdMaXN0ZW5lcnNbc2lnXSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLmVtaXQgPSBwcm9jZXNzRW1pdFxuICAgIHByb2Nlc3MucmVhbGx5RXhpdCA9IHByb2Nlc3NSZWFsbHlFeGl0XG4gIH1cbiAgbW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRcblxuICB2YXIgb3JpZ2luYWxQcm9jZXNzUmVhbGx5RXhpdCA9IHByb2Nlc3MucmVhbGx5RXhpdFxuICB2YXIgcHJvY2Vzc1JlYWxseUV4aXQgPSBmdW5jdGlvbiBwcm9jZXNzUmVhbGx5RXhpdCAoY29kZSkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghcHJvY2Vzc09rKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHByb2Nlc3MuZXhpdENvZGUgPSBjb2RlIHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIDBcbiAgICBlbWl0KCdleGl0JywgcHJvY2Vzcy5leGl0Q29kZSwgbnVsbClcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGVtaXQoJ2FmdGVyZXhpdCcsIHByb2Nlc3MuZXhpdENvZGUsIG51bGwpXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBvcmlnaW5hbFByb2Nlc3NSZWFsbHlFeGl0LmNhbGwocHJvY2VzcywgcHJvY2Vzcy5leGl0Q29kZSlcbiAgfVxuXG4gIHZhciBvcmlnaW5hbFByb2Nlc3NFbWl0ID0gcHJvY2Vzcy5lbWl0XG4gIHZhciBwcm9jZXNzRW1pdCA9IGZ1bmN0aW9uIHByb2Nlc3NFbWl0IChldiwgYXJnKSB7XG4gICAgaWYgKGV2ID09PSAnZXhpdCcgJiYgcHJvY2Vzc09rKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwcm9jZXNzLmV4aXRDb2RlID0gYXJnXG4gICAgICB9XG4gICAgICB2YXIgcmV0ID0gb3JpZ2luYWxQcm9jZXNzRW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgZW1pdCgnZXhpdCcsIHByb2Nlc3MuZXhpdENvZGUsIG51bGwpXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgZW1pdCgnYWZ0ZXJleGl0JywgcHJvY2Vzcy5leGl0Q29kZSwgbnVsbClcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICByZXR1cm4gcmV0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbFByb2Nlc3NFbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9XG4gIH1cbn1cbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0U3Bhd25lZFJlc3VsdCA9IGV4cG9ydHMuZ2V0U3Bhd25lZFByb21pc2UgPSB2b2lkIDA7XG5jb25zdCBub2RlX2J1ZmZlcl8xID0gcmVxdWlyZShcIm5vZGU6YnVmZmVyXCIpO1xuY29uc3Qgbm9kZV9zdHJlYW1fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibm9kZTpzdHJlYW1cIikpO1xuY29uc3Qgbm9kZV91dGlsXzEgPSByZXF1aXJlKFwibm9kZTp1dGlsXCIpO1xuY29uc3Qgc2lnbmFsX2V4aXRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwic2lnbmFsLWV4aXRcIikpO1xuZnVuY3Rpb24gZ2V0U3Bhd25lZFByb21pc2Uoc3Bhd25lZCwgeyB0aW1lb3V0IH0gPSB7fSkge1xuICAgIGNvbnN0IHNwYXduZWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBzcGF3bmVkLm9uKFwiZXhpdFwiLCAoZXhpdENvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7IGV4aXRDb2RlLCBzaWduYWwsIHRpbWVkT3V0OiBmYWxzZSB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNwYXduZWQub24oXCJlcnJvclwiLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3Bhd25lZC5zdGRpbikge1xuICAgICAgICAgICAgc3Bhd25lZC5zdGRpbi5vbihcImVycm9yXCIsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0aW1lb3V0ID09PSAwIHx8IHRpbWVvdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gc3Bhd25lZFByb21pc2U7XG4gICAgfVxuICAgIGxldCB0aW1lb3V0SWQ7XG4gICAgY29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgoX3Jlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNwYXduZWQua2lsbChcIlNJR1RFUk1cIik7XG4gICAgICAgICAgICByZWplY3QoT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IoXCJUaW1lZCBvdXRcIiksIHsgdGltZWRPdXQ6IHRydWUsIHNpZ25hbDogXCJTSUdURVJNXCIgfSkpO1xuICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICB9KTtcbiAgICBjb25zdCBzYWZlU3Bhd25lZFByb21pc2UgPSBzcGF3bmVkUHJvbWlzZS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfSk7XG4gICAgY29uc3QgcmVtb3ZlRXhpdEhhbmRsZXIgPSAoMCwgc2lnbmFsX2V4aXRfMS5kZWZhdWx0KSgoKSA9PiB7XG4gICAgICAgIHNwYXduZWQua2lsbCgpO1xuICAgIH0pO1xuICAgIHJldHVybiBQcm9taXNlLnJhY2UoW3RpbWVvdXRQcm9taXNlLCBzYWZlU3Bhd25lZFByb21pc2VdKS5maW5hbGx5KCgpID0+IHJlbW92ZUV4aXRIYW5kbGVyKCkpO1xufVxuZXhwb3J0cy5nZXRTcGF3bmVkUHJvbWlzZSA9IGdldFNwYXduZWRQcm9taXNlO1xuY2xhc3MgTWF4QnVmZmVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiVGhlIG91dHB1dCBpcyB0b28gYmlnXCIpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIk1heEJ1ZmZlckVycm9yXCI7XG4gICAgfVxufVxuY29uc3Qgc3RyZWFtUGlwZWxpbmVQcm9taXNpZmllZCA9ICgwLCBub2RlX3V0aWxfMS5wcm9taXNpZnkpKG5vZGVfc3RyZWFtXzEuZGVmYXVsdC5waXBlbGluZSk7XG5mdW5jdGlvbiBidWZmZXJTdHJlYW0ob3B0aW9ucykge1xuICAgIGNvbnN0IHsgZW5jb2RpbmcgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgaXNCdWZmZXIgPSBlbmNvZGluZyA9PT0gXCJidWZmZXJcIjtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG1pc3NpbmcgdGhlIG1ldGhvZHMgd2UgYXJlIGFkZGluZyBiZWxvd1xuICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBub2RlX3N0cmVhbV8xLmRlZmF1bHQuUGFzc1Rocm91Z2goeyBvYmplY3RNb2RlOiBmYWxzZSB9KTtcbiAgICBpZiAoZW5jb2RpbmcgJiYgZW5jb2RpbmcgIT09IFwiYnVmZmVyXCIpIHtcbiAgICAgICAgc3RyZWFtLnNldEVuY29kaW5nKGVuY29kaW5nKTtcbiAgICB9XG4gICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgY29uc3QgY2h1bmtzID0gW107XG4gICAgc3RyZWFtLm9uKFwiZGF0YVwiLCAoY2h1bmspID0+IHtcbiAgICAgICAgY2h1bmtzLnB1c2goY2h1bmspO1xuICAgICAgICBsZW5ndGggKz0gY2h1bmsubGVuZ3RoO1xuICAgIH0pO1xuICAgIHN0cmVhbS5nZXRCdWZmZXJlZFZhbHVlID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gKGlzQnVmZmVyID8gQnVmZmVyLmNvbmNhdChjaHVua3MsIGxlbmd0aCkgOiBjaHVua3Muam9pbihcIlwiKSk7XG4gICAgfTtcbiAgICBzdHJlYW0uZ2V0QnVmZmVyZWRMZW5ndGggPSAoKSA9PiBsZW5ndGg7XG4gICAgcmV0dXJuIHN0cmVhbTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFN0cmVhbShpbnB1dFN0cmVhbSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHN0cmVhbSA9IGJ1ZmZlclN0cmVhbShvcHRpb25zKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlamVjdFByb21pc2UgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIC8vIERvbid0IHJldHJpZXZlIGFuIG92ZXJzaXplZCBidWZmZXIuXG4gICAgICAgICAgICBpZiAoZXJyb3IgJiYgc3RyZWFtLmdldEJ1ZmZlcmVkTGVuZ3RoKCkgPD0gbm9kZV9idWZmZXJfMS5jb25zdGFudHMuTUFYX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIGVycm9yLmJ1ZmZlcmVkRGF0YSA9IHN0cmVhbS5nZXRCdWZmZXJlZFZhbHVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBzdHJlYW1QaXBlbGluZVByb21pc2lmaWVkKGlucHV0U3RyZWFtLCBzdHJlYW0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdFByb21pc2UoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgICAgICBzdHJlYW0ub24oXCJkYXRhXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vIDgwbWJcbiAgICAgICAgICAgIGlmIChzdHJlYW0uZ2V0QnVmZmVyZWRMZW5ndGgoKSA+IDEwMDAgKiAxMDAwICogODApIHtcbiAgICAgICAgICAgICAgICByZWplY3RQcm9taXNlKG5ldyBNYXhCdWZmZXJFcnJvcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cmVhbS5nZXRCdWZmZXJlZFZhbHVlKCk7XG59XG4vLyBPbiBmYWlsdXJlLCBgcmVzdWx0LnN0ZG91dHxzdGRlcnJgIHNob3VsZCBjb250YWluIHRoZSBjdXJyZW50bHkgYnVmZmVyZWQgc3RyZWFtXG5hc3luYyBmdW5jdGlvbiBnZXRCdWZmZXJlZERhdGEoc3RyZWFtLCBzdHJlYW1Qcm9taXNlKSB7XG4gICAgc3RyZWFtLmRlc3Ryb3koKTtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgc3RyZWFtUHJvbWlzZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvci5idWZmZXJlZERhdGE7XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gZ2V0U3Bhd25lZFJlc3VsdCh7IHN0ZG91dCwgc3RkZXJyIH0sIHsgZW5jb2RpbmcgfSwgcHJvY2Vzc0RvbmUpIHtcbiAgICBjb25zdCBzdGRvdXRQcm9taXNlID0gZ2V0U3RyZWFtKHN0ZG91dCwgeyBlbmNvZGluZyB9KTtcbiAgICBjb25zdCBzdGRlcnJQcm9taXNlID0gZ2V0U3RyZWFtKHN0ZGVyciwgeyBlbmNvZGluZyB9KTtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwoW3Byb2Nlc3NEb25lLCBzdGRvdXRQcm9taXNlLCBzdGRlcnJQcm9taXNlXSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgICAgICAgICAgICBleGl0Q29kZTogbnVsbCxcbiAgICAgICAgICAgICAgICBzaWduYWw6IGVycm9yLnNpZ25hbCxcbiAgICAgICAgICAgICAgICB0aW1lZE91dDogZXJyb3IudGltZWRPdXQgfHwgZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QnVmZmVyZWREYXRhKHN0ZG91dCwgc3Rkb3V0UHJvbWlzZSksXG4gICAgICAgICAgICBnZXRCdWZmZXJlZERhdGEoc3RkZXJyLCBzdGRlcnJQcm9taXNlKSxcbiAgICAgICAgXSk7XG4gICAgfVxufVxuZXhwb3J0cy5nZXRTcGF3bmVkUmVzdWx0ID0gZ2V0U3Bhd25lZFJlc3VsdDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbi8qXG4gKiBJbnNwaXJlZCBieSBFeGVjYVxuICovXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZUV4ZWMgPSB2b2lkIDA7XG5jb25zdCBub2RlX2NoaWxkX3Byb2Nlc3NfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpKTtcbmNvbnN0IHJlYWN0XzEgPSByZXF1aXJlKFwicmVhY3RcIik7XG5jb25zdCB1c2VDYWNoZWRQcm9taXNlXzEgPSByZXF1aXJlKFwiLi91c2VDYWNoZWRQcm9taXNlXCIpO1xuY29uc3QgdXNlTGF0ZXN0XzEgPSByZXF1aXJlKFwiLi91c2VMYXRlc3RcIik7XG5jb25zdCBleGVjX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9leGVjLXV0aWxzXCIpO1xuY29uc3QgU1BBQ0VTX1JFR0VYUCA9IC8gKy9nO1xuZnVuY3Rpb24gcGFyc2VDb21tYW5kKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBpZiAoYXJncykge1xuICAgICAgICByZXR1cm4gW2NvbW1hbmQsIC4uLmFyZ3NdO1xuICAgIH1cbiAgICBjb25zdCB0b2tlbnMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIGNvbW1hbmQudHJpbSgpLnNwbGl0KFNQQUNFU19SRUdFWFApKSB7XG4gICAgICAgIC8vIEFsbG93IHNwYWNlcyB0byBiZSBlc2NhcGVkIGJ5IGEgYmFja3NsYXNoIGlmIG5vdCBtZWFudCBhcyBhIGRlbGltaXRlclxuICAgICAgICBjb25zdCBwcmV2aW91c1Rva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKHByZXZpb3VzVG9rZW4gJiYgcHJldmlvdXNUb2tlbi5lbmRzV2l0aChcIlxcXFxcIikpIHtcbiAgICAgICAgICAgIC8vIE1lcmdlIHByZXZpb3VzIHRva2VuIHdpdGggY3VycmVudCBvbmVcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0gPSBgJHtwcmV2aW91c1Rva2VuLnNsaWNlKDAsIC0xKX0gJHt0b2tlbn1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b2tlbnM7XG59XG5mdW5jdGlvbiBzdHJpcEZpbmFsTmV3bGluZShpbnB1dCkge1xuICAgIGNvbnN0IExGID0gdHlwZW9mIGlucHV0ID09PSBcInN0cmluZ1wiID8gXCJcXG5cIiA6IFwiXFxuXCIuY2hhckNvZGVBdCgwKTtcbiAgICBjb25zdCBDUiA9IHR5cGVvZiBpbnB1dCA9PT0gXCJzdHJpbmdcIiA/IFwiXFxyXCIgOiBcIlxcclwiLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGlucHV0W2lucHV0Lmxlbmd0aCAtIDFdID09PSBMRikge1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHdlIGFyZSBkb2luZyBzb21lIG5hc3R5IHN0dWZmIGhlcmVcbiAgICAgICAgaW5wdXQgPSBpbnB1dC5zbGljZSgwLCAtMSk7XG4gICAgfVxuICAgIGlmIChpbnB1dFtpbnB1dC5sZW5ndGggLSAxXSA9PT0gQ1IpIHtcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB3ZSBhcmUgZG9pbmcgc29tZSBuYXN0eSBzdHVmZiBoZXJlXG4gICAgICAgIGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgLTEpO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXQ7XG59XG5mdW5jdGlvbiBoYW5kbGVPdXRwdXQob3B0aW9ucywgdmFsdWUpIHtcbiAgICBpZiAob3B0aW9ucy5zdHJpcEZpbmFsTmV3bGluZSkge1xuICAgICAgICByZXR1cm4gc3RyaXBGaW5hbE5ld2xpbmUodmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5jb25zdCBnZXRFcnJvclByZWZpeCA9ICh7IHRpbWVkT3V0LCB0aW1lb3V0LCBzaWduYWwsIGV4aXRDb2RlLCB9KSA9PiB7XG4gICAgaWYgKHRpbWVkT3V0KSB7XG4gICAgICAgIHJldHVybiBgdGltZWQgb3V0IGFmdGVyICR7dGltZW91dH0gbWlsbGlzZWNvbmRzYDtcbiAgICB9XG4gICAgaWYgKHNpZ25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBgd2FzIGtpbGxlZCB3aXRoICR7c2lnbmFsfWA7XG4gICAgfVxuICAgIGlmIChleGl0Q29kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBgZmFpbGVkIHdpdGggZXhpdCBjb2RlICR7ZXhpdENvZGV9YDtcbiAgICB9XG4gICAgcmV0dXJuIFwiZmFpbGVkXCI7XG59O1xuY29uc3QgbWFrZUVycm9yID0gKHsgc3Rkb3V0LCBzdGRlcnIsIGVycm9yLCBzaWduYWwsIGV4aXRDb2RlLCBjb21tYW5kLCB0aW1lZE91dCwgb3B0aW9ucywgfSkgPT4ge1xuICAgIGNvbnN0IHByZWZpeCA9IGdldEVycm9yUHJlZml4KHsgdGltZWRPdXQsIHRpbWVvdXQ6IG9wdGlvbnM/LnRpbWVvdXQsIHNpZ25hbCwgZXhpdENvZGUgfSk7XG4gICAgY29uc3QgZXhlY2FNZXNzYWdlID0gYENvbW1hbmQgJHtwcmVmaXh9OiAke2NvbW1hbmR9YDtcbiAgICBjb25zdCBzaG9ydE1lc3NhZ2UgPSBlcnJvciA/IGAke2V4ZWNhTWVzc2FnZX1cXG4ke2Vycm9yLm1lc3NhZ2V9YCA6IGV4ZWNhTWVzc2FnZTtcbiAgICBjb25zdCBtZXNzYWdlID0gW3Nob3J0TWVzc2FnZSwgc3RkZXJyLCBzdGRvdXRdLmZpbHRlcihCb29sZWFuKS5qb2luKFwiXFxuXCIpO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG5vdCBvbiBFcnJvclxuICAgICAgICBlcnJvci5vcmlnaW5hbE1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG5vdCBvbiBFcnJvclxuICAgIGVycm9yLnNob3J0TWVzc2FnZSA9IHNob3J0TWVzc2FnZTtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG5vdCBvbiBFcnJvclxuICAgIGVycm9yLmNvbW1hbmQgPSBjb21tYW5kO1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3Igbm90IG9uIEVycm9yXG4gICAgZXJyb3IuZXhpdENvZGUgPSBleGl0Q29kZTtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG5vdCBvbiBFcnJvclxuICAgIGVycm9yLnNpZ25hbCA9IHNpZ25hbDtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG5vdCBvbiBFcnJvclxuICAgIGVycm9yLnN0ZG91dCA9IHN0ZG91dDtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG5vdCBvbiBFcnJvclxuICAgIGVycm9yLnN0ZGVyciA9IHN0ZGVycjtcbiAgICBpZiAoXCJidWZmZXJlZERhdGFcIiBpbiBlcnJvcikge1xuICAgICAgICBkZWxldGUgZXJyb3JbXCJidWZmZXJlZERhdGFcIl07XG4gICAgfVxuICAgIHJldHVybiBlcnJvcjtcbn07XG5mdW5jdGlvbiBkZWZhdWx0UGFyc2luZyh7IHN0ZG91dCwgc3RkZXJyLCBlcnJvciwgZXhpdENvZGUsIHNpZ25hbCwgdGltZWRPdXQsIGNvbW1hbmQsIG9wdGlvbnMsIH0pIHtcbiAgICBpZiAoZXJyb3IgfHwgZXhpdENvZGUgIT09IDAgfHwgc2lnbmFsICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHJldHVybmVkRXJyb3IgPSBtYWtlRXJyb3Ioe1xuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICBleGl0Q29kZSxcbiAgICAgICAgICAgIHNpZ25hbCxcbiAgICAgICAgICAgIHN0ZG91dCxcbiAgICAgICAgICAgIHN0ZGVycixcbiAgICAgICAgICAgIGNvbW1hbmQsXG4gICAgICAgICAgICB0aW1lZE91dCxcbiAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aHJvdyByZXR1cm5lZEVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gc3Rkb3V0O1xufVxuZnVuY3Rpb24gdXNlRXhlYyhjb21tYW5kLCBvcHRpb25zT3JBcmdzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgeyBwYXJzZU91dHB1dCwgaW5wdXQsIG9uRGF0YSwgb25XaWxsRXhlY3V0ZSwgaW5pdGlhbERhdGEsIGV4ZWN1dGUsIGtlZXBQcmV2aW91c0RhdGEsIG9uRXJyb3IsIC4uLmV4ZWNPcHRpb25zIH0gPSBBcnJheS5pc0FycmF5KG9wdGlvbnNPckFyZ3MpID8gb3B0aW9ucyB8fCB7fSA6IG9wdGlvbnNPckFyZ3MgfHwge307XG4gICAgY29uc3QgdXNlQ2FjaGVkUHJvbWlzZU9wdGlvbnMgPSB7XG4gICAgICAgIGluaXRpYWxEYXRhLFxuICAgICAgICBleGVjdXRlLFxuICAgICAgICBrZWVwUHJldmlvdXNEYXRhLFxuICAgICAgICBvbkVycm9yLFxuICAgICAgICBvbkRhdGEsXG4gICAgICAgIG9uV2lsbEV4ZWN1dGUsXG4gICAgfTtcbiAgICBjb25zdCBhYm9ydGFibGUgPSAoMCwgcmVhY3RfMS51c2VSZWYpKCk7XG4gICAgY29uc3QgcGFyc2VPdXRwdXRSZWYgPSAoMCwgdXNlTGF0ZXN0XzEudXNlTGF0ZXN0KShwYXJzZU91dHB1dCB8fCBkZWZhdWx0UGFyc2luZyk7XG4gICAgY29uc3QgZm4gPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoYXN5bmMgKF9jb21tYW5kLCBfYXJncywgX29wdGlvbnMsIGlucHV0KSA9PiB7XG4gICAgICAgIGNvbnN0IFtmaWxlLCAuLi5hcmdzXSA9IHBhcnNlQ29tbWFuZChfY29tbWFuZCwgX2FyZ3MpO1xuICAgICAgICBjb25zdCBjb21tYW5kID0gW2ZpbGUsIC4uLmFyZ3NdLmpvaW4oXCIgXCIpO1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgc3RyaXBGaW5hbE5ld2xpbmU6IHRydWUsXG4gICAgICAgICAgICAuLi5fb3B0aW9ucyxcbiAgICAgICAgICAgIHNpZ25hbDogYWJvcnRhYmxlLmN1cnJlbnQ/LnNpZ25hbCxcbiAgICAgICAgICAgIGVuY29kaW5nOiBfb3B0aW9ucz8uZW5jb2RpbmcgPT09IG51bGwgPyBcImJ1ZmZlclwiIDogX29wdGlvbnM/LmVuY29kaW5nIHx8IFwidXRmOFwiLFxuICAgICAgICAgICAgZW52OiB7IC4uLnByb2Nlc3MuZW52LCAuLi5fb3B0aW9ucz8uZW52IH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNwYXduZWQgPSBub2RlX2NoaWxkX3Byb2Nlc3NfMS5kZWZhdWx0LnNwYXduKGZpbGUsIGFyZ3MsIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCBzcGF3bmVkUHJvbWlzZSA9ICgwLCBleGVjX3V0aWxzXzEuZ2V0U3Bhd25lZFByb21pc2UpKHNwYXduZWQsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHNwYXduZWQuc3RkaW4uZW5kKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbeyBlcnJvciwgZXhpdENvZGUsIHNpZ25hbCwgdGltZWRPdXQgfSwgc3Rkb3V0UmVzdWx0LCBzdGRlcnJSZXN1bHRdID0gYXdhaXQgKDAsIGV4ZWNfdXRpbHNfMS5nZXRTcGF3bmVkUmVzdWx0KShzcGF3bmVkLCBvcHRpb25zLCBzcGF3bmVkUHJvbWlzZSk7XG4gICAgICAgIGNvbnN0IHN0ZG91dCA9IGhhbmRsZU91dHB1dChvcHRpb25zLCBzdGRvdXRSZXN1bHQpO1xuICAgICAgICBjb25zdCBzdGRlcnIgPSBoYW5kbGVPdXRwdXQob3B0aW9ucywgc3RkZXJyUmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHBhcnNlT3V0cHV0UmVmLmN1cnJlbnQoe1xuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0b28gbWFueSBnZW5lcmljcywgSSBnaXZlIHVwXG4gICAgICAgICAgICBzdGRvdXQsXG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHRvbyBtYW55IGdlbmVyaWNzLCBJIGdpdmUgdXBcbiAgICAgICAgICAgIHN0ZGVycixcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgZXhpdENvZGUsXG4gICAgICAgICAgICBzaWduYWwsXG4gICAgICAgICAgICB0aW1lZE91dCxcbiAgICAgICAgICAgIGNvbW1hbmQsXG4gICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICB9KTtcbiAgICB9LCBbcGFyc2VPdXRwdXRSZWZdKTtcbiAgICByZXR1cm4gKDAsIHVzZUNhY2hlZFByb21pc2VfMS51c2VDYWNoZWRQcm9taXNlKShmbiwgW2NvbW1hbmQsIEFycmF5LmlzQXJyYXkob3B0aW9uc09yQXJncykgPyBvcHRpb25zT3JBcmdzIDogW10sIGV4ZWNPcHRpb25zLCBpbnB1dF0sIHtcbiAgICAgICAgLi4udXNlQ2FjaGVkUHJvbWlzZU9wdGlvbnMsXG4gICAgICAgIGFib3J0YWJsZSxcbiAgICB9KTtcbn1cbmV4cG9ydHMudXNlRXhlYyA9IHVzZUV4ZWM7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZVNRTCA9IHZvaWQgMDtcbmNvbnN0IGpzeF9ydW50aW1lXzEgPSByZXF1aXJlKFwicmVhY3QvanN4LXJ1bnRpbWVcIik7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCJAcmF5Y2FzdC9hcGlcIik7XG5jb25zdCBub2RlX2ZzXzEgPSByZXF1aXJlKFwibm9kZTpmc1wiKTtcbmNvbnN0IHByb21pc2VzXzEgPSByZXF1aXJlKFwibm9kZTpmcy9wcm9taXNlc1wiKTtcbmNvbnN0IG5vZGVfb3NfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibm9kZTpvc1wiKSk7XG5jb25zdCBub2RlX2NoaWxkX3Byb2Nlc3NfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpKTtcbmNvbnN0IG5vZGVfcGF0aF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJub2RlOnBhdGhcIikpO1xuY29uc3Qgb2JqZWN0X2hhc2hfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwib2JqZWN0LWhhc2hcIikpO1xuY29uc3QgcmVhY3RfMSA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmNvbnN0IHVzZVByb21pc2VfMSA9IHJlcXVpcmUoXCIuL3VzZVByb21pc2VcIik7XG5jb25zdCB1c2VMYXRlc3RfMSA9IHJlcXVpcmUoXCIuL3VzZUxhdGVzdFwiKTtcbmNvbnN0IGV4ZWNfdXRpbHNfMSA9IHJlcXVpcmUoXCIuL2V4ZWMtdXRpbHNcIik7XG4vKipcbiAqIEV4ZWN1dGVzIGEgcXVlcnkgb24gYSBsb2NhbCBTUUwgZGF0YWJhc2UgYW5kIHJldHVybnMgdGhlIHtAbGluayBBc3luY1N0YXRlfSBjb3JyZXNwb25kaW5nIHRvIHRoZSBxdWVyeSBvZiB0aGUgY29tbWFuZC4gVGhlIGxhc3QgdmFsdWUgd2lsbCBiZSBrZXB0IGJldHdlZW4gY29tbWFuZCBydW5zLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIGltcG9ydCB7IHVzZVNRTCB9IGZyb20gXCJAcmF5Y2FzdC91dGlsc1wiO1xuICogaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG4gKiBpbXBvcnQgeyBob21lZGlyIH0gZnJvbSBcIm9zXCI7XG4gKlxuICogY29uc3QgTk9URVNfREIgPSByZXNvbHZlKGhvbWVkaXIoKSwgXCJMaWJyYXJ5L0dyb3VwIENvbnRhaW5lcnMvZ3JvdXAuY29tLmFwcGxlLm5vdGVzL05vdGVTdG9yZS5zcWxpdGVcIik7XG4gKiBjb25zdCBub3Rlc1F1ZXJ5ID0gYFNFTEVDVCBpZCwgdGl0bGUgRlJPTSAuLi5gO1xuICogdHlwZSBOb3RlSXRlbSA9IHtcbiAqICAgaWQ6IHN0cmluZztcbiAqICAgdGl0bGU6IHN0cmluZztcbiAqIH07XG4gKlxuICogY29uc3QgRGVtbyA9ICgpID0+IHtcbiAqICAgY29uc3QgeyBpc0xvYWRpbmcsIGRhdGEsIHBlcm1pc3Npb25WaWV3IH0gPSB1c2VTUUw8Tm90ZUl0ZW0+KE5PVEVTX0RCLCBub3Rlc1F1ZXJ5KTtcbiAqXG4gKiAgIGlmIChwZXJtaXNzaW9uVmlldykge1xuICogICAgIHJldHVybiBwZXJtaXNzaW9uVmlldztcbiAqICAgfVxuICpcbiAqICAgcmV0dXJuIChcbiAqICAgICA8TGlzdCBpc0xvYWRpbmc9e2lzTG9hZGluZ30+XG4gKiAgICAgICB7KGRhdGEgfHwgW10pLm1hcCgoaXRlbSkgPT4gKFxuICogICAgICAgICA8TGlzdC5JdGVtIGtleT17aXRlbS5pZH0gdGl0bGU9e2l0ZW0udGl0bGV9IC8+XG4gKiAgICAgICApKX1cbiAqICAgICA8L0xpc3Q+XG4gKiAgKTtcbiAqIH07XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gdXNlU1FMKGRhdGFiYXNlUGF0aCwgcXVlcnksIG9wdGlvbnMpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgY29uc3QgeyBwZXJtaXNzaW9uUHJpbWluZywgLi4udXNlUHJvbWlzZU9wdGlvbnMgfSA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgW3Blcm1pc3Npb25WaWV3LCBzZXRQZXJtaXNzaW9uVmlld10gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoKTtcbiAgICBjb25zdCBsYXRlc3RPcHRpb25zID0gKDAsIHVzZUxhdGVzdF8xLnVzZUxhdGVzdCkob3B0aW9ucyB8fCB7fSk7XG4gICAgY29uc3QgYWJvcnRhYmxlID0gKDAsIHJlYWN0XzEudXNlUmVmKSgpO1xuICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKDAsIHJlYWN0XzEudXNlQ2FsbGJhY2spKChfZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihfZXJyb3IpO1xuICAgICAgICBjb25zdCBlcnJvciA9IF9lcnJvciBpbnN0YW5jZW9mIEVycm9yICYmIF9lcnJvci5tZXNzYWdlLmluY2x1ZGVzKFwiYXV0aG9yaXphdGlvbiBkZW5pZWRcIilcbiAgICAgICAgICAgID8gbmV3IFBlcm1pc3Npb25FcnJvcihcIllvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGFjY2VzcyB0aGUgZGF0YWJhc2UuXCIpXG4gICAgICAgICAgICA6IF9lcnJvcjtcbiAgICAgICAgaWYgKGlzUGVybWlzc2lvbkVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgc2V0UGVybWlzc2lvblZpZXcoKDAsIGpzeF9ydW50aW1lXzEuanN4KShQZXJtaXNzaW9uRXJyb3JTY3JlZW4sIHsgcHJpbWluZzogbGF0ZXN0T3B0aW9ucy5jdXJyZW50LnBlcm1pc3Npb25QcmltaW5nIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsYXRlc3RPcHRpb25zLmN1cnJlbnQub25FcnJvcikge1xuICAgICAgICAgICAgICAgIGxhdGVzdE9wdGlvbnMuY3VycmVudC5vbkVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIGlmIChhcGlfMS5lbnZpcm9ubWVudC5sYXVuY2hUeXBlICE9PSBhcGlfMS5MYXVuY2hUeXBlLkJhY2tncm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGFwaV8xLnNob3dUb2FzdCkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGFwaV8xLlRvYXN0LlN0eWxlLkZhaWx1cmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDYW5ub3QgcXVlcnkgdGhlIGRhdGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5QWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ29weSBMb2dzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25BY3Rpb24odG9hc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGlfMS5DbGlwYm9hcmQuY29weShlcnJvcj8uc3RhY2sgfHwgZXJyb3I/Lm1lc3NhZ2UgfHwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIFtsYXRlc3RPcHRpb25zXSk7XG4gICAgY29uc3QgZm4gPSAoMCwgcmVhY3RfMS51c2VNZW1vKSgoKSA9PiB7XG4gICAgICAgIGlmICghKDAsIG5vZGVfZnNfMS5leGlzdHNTeW5jKShkYXRhYmFzZVBhdGgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZGF0YWJhc2UgZG9lcyBub3QgZXhpc3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRlbXBGb2xkZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBhc3luYyAocXVlcnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNwYXduZWQgPSBub2RlX2NoaWxkX3Byb2Nlc3NfMS5kZWZhdWx0LnNwYXduKFwic3FsaXRlM1wiLCBbXCItLWpzb25cIiwgXCItLXJlYWRvbmx5XCIsIGRhdGFiYXNlUGF0aCwgcXVlcnldLCB7XG4gICAgICAgICAgICAgICAgc2lnbmFsOiBhYm9ydGFibGUuY3VycmVudD8uc2lnbmFsLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBzcGF3bmVkUHJvbWlzZSA9ICgwLCBleGVjX3V0aWxzXzEuZ2V0U3Bhd25lZFByb21pc2UpKHNwYXduZWQpO1xuICAgICAgICAgICAgbGV0IFt7IGVycm9yLCBleGl0Q29kZSwgc2lnbmFsIH0sIHN0ZG91dFJlc3VsdCwgc3RkZXJyUmVzdWx0XSA9IGF3YWl0ICgwLCBleGVjX3V0aWxzXzEuZ2V0U3Bhd25lZFJlc3VsdCkoc3Bhd25lZCwgeyBlbmNvZGluZzogXCJ1dGYtOFwiIH0sIHNwYXduZWRQcm9taXNlKTtcbiAgICAgICAgICAgIGlmIChzdGRlcnJSZXN1bHQubWF0Y2goXCIoNSlcIikpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGF0IG1lYW5zIHRoYXQgdGhlIERCIGlzIGJ1c3kgYmVjYXVzZSBvZiBhbm90aGVyIGFwcCBpcyBsb2NraW5nIGl0XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gQ2hyb21lIG9yIEFyYyBpcyBvcGVuZWQ6IHRoZXkgbG9jayB0aGUgSGlzdG9yeSBkYi5cbiAgICAgICAgICAgICAgICAvLyBBcyBhbiB1Z2x5IHdvcmthcm91bmQsIHdlIGR1cGxpY2F0ZSB0aGUgZmlsZSBhbmQgcmVhZCB0aGF0IGluc3RlYWRcbiAgICAgICAgICAgICAgICAvLyAod2l0aCB2ZnMgdW5peCAtIG5vbmUgdG8ganVzdCBub3QgY2FyZSBhYm91dCBsb2NrcylcbiAgICAgICAgICAgICAgICBpZiAoIXRlbXBGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbGRlciA9IG5vZGVfcGF0aF8xLmRlZmF1bHQuam9pbihub2RlX29zXzEuZGVmYXVsdC50bXBkaXIoKSwgXCJ1c2VTUUxcIiwgKDAsIG9iamVjdF9oYXNoXzEuZGVmYXVsdCkoZGF0YWJhc2VQYXRoKSk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICgwLCBwcm9taXNlc18xLm1rZGlyKSh0ZW1wRm9sZGVyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RGJQYXRoID0gbm9kZV9wYXRoXzEuZGVmYXVsdC5qb2luKHRlbXBGb2xkZXIsIFwiZGJcIik7XG4gICAgICAgICAgICAgICAgYXdhaXQgKDAsIHByb21pc2VzXzEuY29weUZpbGUpKGRhdGFiYXNlUGF0aCwgbmV3RGJQYXRoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzcGF3bmVkID0gbm9kZV9jaGlsZF9wcm9jZXNzXzEuZGVmYXVsdC5zcGF3bihcInNxbGl0ZTNcIiwgW1wiLS1qc29uXCIsIFwiLS1yZWFkb25seVwiLCBcIi0tdmZzXCIsIFwidW5peC1ub25lXCIsIG5ld0RiUGF0aCwgcXVlcnldLCB7XG4gICAgICAgICAgICAgICAgICAgIHNpZ25hbDogYWJvcnRhYmxlLmN1cnJlbnQ/LnNpZ25hbCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzcGF3bmVkUHJvbWlzZSA9ICgwLCBleGVjX3V0aWxzXzEuZ2V0U3Bhd25lZFByb21pc2UpKHNwYXduZWQpO1xuICAgICAgICAgICAgICAgIFt7IGVycm9yLCBleGl0Q29kZSwgc2lnbmFsIH0sIHN0ZG91dFJlc3VsdCwgc3RkZXJyUmVzdWx0XSA9IGF3YWl0ICgwLCBleGVjX3V0aWxzXzEuZ2V0U3Bhd25lZFJlc3VsdCkoc3Bhd25lZCwgeyBlbmNvZGluZzogXCJ1dGYtOFwiIH0sIHNwYXduZWRQcm9taXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnJvciB8fCBleGl0Q29kZSAhPT0gMCB8fCBzaWduYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RkZXJyUmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHN0ZG91dFJlc3VsdC50cmltKCkgfHwgXCJbXVwiKTtcbiAgICAgICAgfTtcbiAgICB9LCBbZGF0YWJhc2VQYXRoXSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uKDAsIHVzZVByb21pc2VfMS51c2VQcm9taXNlKShmbiwgW3F1ZXJ5XSwgeyAuLi51c2VQcm9taXNlT3B0aW9ucywgb25FcnJvcjogaGFuZGxlRXJyb3IgfSksXG4gICAgICAgIHBlcm1pc3Npb25WaWV3LFxuICAgIH07XG59XG5leHBvcnRzLnVzZVNRTCA9IHVzZVNRTDtcbmNsYXNzIFBlcm1pc3Npb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIlBlcm1pc3Npb25FcnJvclwiO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzUGVybWlzc2lvbkVycm9yKGVycm9yKSB7XG4gICAgcmV0dXJuIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgZXJyb3IubmFtZSA9PT0gXCJQZXJtaXNzaW9uRXJyb3JcIjtcbn1cbmNvbnN0IG1hY29zVmVudHVyYUFuZExhdGVyID0gcGFyc2VJbnQobm9kZV9vc18xLmRlZmF1bHQucmVsZWFzZSgpLnNwbGl0KFwiLlwiKVswXSkgPj0gMjI7XG5jb25zdCBwcmVmZXJlbmNlc1N0cmluZyA9IG1hY29zVmVudHVyYUFuZExhdGVyID8gXCJTZXR0aW5nc1wiIDogXCJQcmVmZXJlbmNlc1wiO1xuZnVuY3Rpb24gUGVybWlzc2lvbkVycm9yU2NyZWVuKHByb3BzKSB7XG4gICAgY29uc3QgYWN0aW9uID0gbWFjb3NWZW50dXJhQW5kTGF0ZXJcbiAgICAgICAgPyB7XG4gICAgICAgICAgICB0aXRsZTogXCJPcGVuIFN5c3RlbSBTZXR0aW5ncyAtPiBQcml2YWN5XCIsXG4gICAgICAgICAgICB0YXJnZXQ6IFwieC1hcHBsZS5zeXN0ZW1wcmVmZXJlbmNlczpjb20uYXBwbGUucHJlZmVyZW5jZS5zZWN1cml0eT9Qcml2YWN5X0FsbEZpbGVzXCIsXG4gICAgICAgIH1cbiAgICAgICAgOiB7XG4gICAgICAgICAgICB0aXRsZTogXCJPcGVuIFN5c3RlbSBQcmVmZXJlbmNlcyAtPiBTZWN1cml0eVwiLFxuICAgICAgICAgICAgdGFyZ2V0OiBcIngtYXBwbGUuc3lzdGVtcHJlZmVyZW5jZXM6Y29tLmFwcGxlLnByZWZlcmVuY2Uuc2VjdXJpdHk/UHJpdmFjeV9BbGxGaWxlc1wiLFxuICAgICAgICB9O1xuICAgIGlmIChhcGlfMS5lbnZpcm9ubWVudC5jb21tYW5kTW9kZSA9PT0gXCJtZW51LWJhclwiKSB7XG4gICAgICAgIHJldHVybiAoKDAsIGpzeF9ydW50aW1lXzEuanN4cykoYXBpXzEuTWVudUJhckV4dHJhLCB7IGljb246IGFwaV8xLkljb24uV2FybmluZywgdGl0bGU6IGFwaV8xLmVudmlyb25tZW50LmNvbW1hbmROYW1lLCBjaGlsZHJlbjogWygwLCBqc3hfcnVudGltZV8xLmpzeCkoYXBpXzEuTWVudUJhckV4dHJhLkl0ZW0sIHsgdGl0bGU6IFwiUmF5Y2FzdCBuZWVkcyBmdWxsIGRpc2sgYWNjZXNzXCIsIHRvb2x0aXA6IGBZb3UgY2FuIHJldmVydCB0aGlzIGFjY2VzcyBpbiAke3ByZWZlcmVuY2VzU3RyaW5nfSB3aGVuZXZlciB5b3Ugd2FudGAgfSksIHByb3BzLnByaW1pbmcgPyAoKDAsIGpzeF9ydW50aW1lXzEuanN4KShhcGlfMS5NZW51QmFyRXh0cmEuSXRlbSwgeyB0aXRsZTogcHJvcHMucHJpbWluZywgdG9vbHRpcDogYFlvdSBjYW4gcmV2ZXJ0IHRoaXMgYWNjZXNzIGluICR7cHJlZmVyZW5jZXNTdHJpbmd9IHdoZW5ldmVyIHlvdSB3YW50YCB9KSkgOiBudWxsLCAoMCwganN4X3J1bnRpbWVfMS5qc3gpKGFwaV8xLk1lbnVCYXJFeHRyYS5TZXBhcmF0b3IsIHt9KSwgKDAsIGpzeF9ydW50aW1lXzEuanN4KShhcGlfMS5NZW51QmFyRXh0cmEuSXRlbSwgeyB0aXRsZTogYWN0aW9uLnRpdGxlLCBvbkFjdGlvbjogKCkgPT4gKDAsIGFwaV8xLm9wZW4pKGFjdGlvbi50YXJnZXQpIH0pXSB9KSk7XG4gICAgfVxuICAgIHJldHVybiAoKDAsIGpzeF9ydW50aW1lXzEuanN4KShhcGlfMS5MaXN0LCB7IGNoaWxkcmVuOiAoMCwganN4X3J1bnRpbWVfMS5qc3gpKGFwaV8xLkxpc3QuRW1wdHlWaWV3LCB7IGljb246IHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlnaHQ6IFwiaHR0cHM6Ly9yYXljYXN0LmNvbS91cGxvYWRzL2V4dGVuc2lvbnMtdXRpbHMtc2VjdXJpdHktcGVybWlzc2lvbnMtbGlnaHQucG5nXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhcms6IFwiaHR0cHM6Ly9yYXljYXN0LmNvbS91cGxvYWRzL2V4dGVuc2lvbnMtdXRpbHMtc2VjdXJpdHktcGVybWlzc2lvbnMtZGFyay5wbmdcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSwgdGl0bGU6IFwiUmF5Y2FzdCBuZWVkcyBmdWxsIGRpc2sgYWNjZXNzLlwiLCBkZXNjcmlwdGlvbjogYCR7cHJvcHMucHJpbWluZyA/IHByb3BzLnByaW1pbmcgKyBcIlxcblwiIDogXCJcIn1Zb3UgY2FuIHJldmVydCB0aGlzIGFjY2VzcyBpbiAke3ByZWZlcmVuY2VzU3RyaW5nfSB3aGVuZXZlciB5b3Ugd2FudC5gLCBhY3Rpb25zOiAoMCwganN4X3J1bnRpbWVfMS5qc3gpKGFwaV8xLkFjdGlvblBhbmVsLCB7IGNoaWxkcmVuOiAoMCwganN4X3J1bnRpbWVfMS5qc3gpKGFwaV8xLkFjdGlvbi5PcGVuLCB7IC4uLmFjdGlvbiB9KSB9KSB9KSB9KSk7XG59XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZUZvcm0gPSBleHBvcnRzLkZvcm1WYWxpZGF0aW9uID0gdm9pZCAwO1xuY29uc3QgcmVhY3RfMSA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmNvbnN0IHVzZUxhdGVzdF8xID0gcmVxdWlyZShcIi4vdXNlTGF0ZXN0XCIpO1xuLyoqXG4gKiBTaG9ydGhhbmRzIGZvciBjb21tb24gdmFsaWRhdGlvbiBjYXNlc1xuICovXG52YXIgRm9ybVZhbGlkYXRpb247XG4oZnVuY3Rpb24gKEZvcm1WYWxpZGF0aW9uKSB7XG4gICAgLyoqIFNob3cgYW4gZXJyb3Igd2hlbiB0aGUgdmFsdWUgb2YgdGhlIGl0ZW0gaXMgZW1wdHkgKi9cbiAgICBGb3JtVmFsaWRhdGlvbltcIlJlcXVpcmVkXCJdID0gXCJyZXF1aXJlZFwiO1xufSkoRm9ybVZhbGlkYXRpb24gPSBleHBvcnRzLkZvcm1WYWxpZGF0aW9uIHx8IChleHBvcnRzLkZvcm1WYWxpZGF0aW9uID0ge30pKTtcbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcih2YWxpZGF0aW9uLCB2YWx1ZSkge1xuICAgIGlmICh2YWxpZGF0aW9uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGlvbih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsaWRhdGlvbiA9PT0gRm9ybVZhbGlkYXRpb24uUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZUlzVmFsaWQgPSB0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IG51bGw7XG4gICAgICAgICAgICBpZiAodmFsdWVJc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVJc1ZhbGlkID0gdmFsdWUubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZUlzVmFsaWQgPSB2YWx1ZS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVJc1ZhbGlkID0gdmFsdWUuZ2V0VGltZSgpID4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF2YWx1ZUlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUaGUgaXRlbSBpcyByZXF1aXJlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBIb29rIHRoYXQgcHJvdmlkZXMgYSBoaWdoLWxldmVsIGludGVyZmFjZSB0byB3b3JrIHdpdGggRm9ybXMsIGFuZCBtb3JlIHBhcnRpY3VsYXJseSwgd2l0aCBGb3JtIHZhbGlkYXRpb25zLiBJdCBpbmNvcnBvcmF0ZXMgYWxsIHRoZSBnb29kIHByYWN0aWNlcyB0byBwcm92aWRlIGEgZ3JlYXQgVXNlciBFeHBlcmllbmNlIGZvciB5b3VyIEZvcm1zLlxuICpcbiAqIEByZXR1cm5zIGFuIG9iamVjdCB3aGljaCBjb250YWlucyB0aGUgbmVjZXNzYXJ5IG1ldGhvZHMgYW5kIHByb3BzIHRvIHByb3ZpZGUgYSBnb29kIFVzZXIgRXhwZXJpZW5jZSBpbiB5b3VyIEZvcm0uXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25QYW5lbCwgRm9ybSwgc2hvd1RvYXN0LCBUb2FzdCB9IGZyb20gXCJAcmF5Y2FzdC9hcGlcIjtcbiAqIGltcG9ydCB7IHVzZUZvcm0sIEZvcm1WYWxpZGF0aW9uIH0gZnJvbSBcIkByYXljYXN0L3V0aWxzXCI7XG4gKlxuICogaW50ZXJmYWNlIFNpZ25VcEZvcm1WYWx1ZXMge1xuICogICBuaWNrbmFtZTogc3RyaW5nO1xuICogICBwYXNzd29yZDogc3RyaW5nO1xuICogfVxuICpcbiAqIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1haW4oKSB7XG4gKiAgIGNvbnN0IHsgaGFuZGxlU3VibWl0LCBpdGVtUHJvcHMgfSA9IHVzZUZvcm08U2lnblVwRm9ybVZhbHVlcz4oe1xuICogICAgIG9uU3VibWl0KHZhbHVlcykge1xuICogICAgICAgc2hvd1RvYXN0KFRvYXN0LlN0eWxlLlN1Y2Nlc3MsIFwiWWF5IVwiLCBgJHt2YWx1ZXMubmlja25hbWV9IGFjY291bnQgY3JlYXRlZGApO1xuICogICAgIH0sXG4gKiAgICAgdmFsaWRhdGlvbjoge1xuICogICAgICAgbmlja25hbWU6IEZvcm1WYWxpZGF0aW9uLlJlcXVpcmVkLFxuICogICAgICAgcGFzc3dvcmQ6ICh2YWx1ZSkgPT4ge1xuICogICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoIDwgOCkge1xuICogICAgICAgICAgIHJldHVybiBcIlBhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgOCBzeW1ib2xzXCI7XG4gKiAgICAgICAgIH0gZWxzZSBpZiAoIXZhbHVlKSB7XG4gKiAgICAgICAgICAgcmV0dXJuIFwiVGhlIGl0ZW0gaXMgcmVxdWlyZWRcIjtcbiAqICAgICAgICAgfVxuICogICAgICAgfSxcbiAqICAgICB9LFxuICogICB9KTtcbiAqXG4gKiAgIHJldHVybiAoXG4gKiAgICAgPEZvcm1cbiAqICAgICAgIGFjdGlvbnM9e1xuICogICAgICAgICA8QWN0aW9uUGFuZWw+XG4gKiAgICAgICAgICAgPEFjdGlvbi5TdWJtaXRGb3JtIHRpdGxlPVwiU3VibWl0XCIgb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gLz5cbiAqICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAqICAgICAgIH1cbiAqICAgICA+XG4gKiAgICAgICA8Rm9ybS5UZXh0RmllbGQgdGl0bGU9XCJOaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciBuaWNrbmFtZVwiIHsuLi5pdGVtUHJvcHMubmlja25hbWV9IC8+XG4gKiAgICAgICA8Rm9ybS5QYXNzd29yZEZpZWxkXG4gKiAgICAgICAgIHRpdGxlPVwiUGFzc3dvcmRcIlxuICogICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHBhc3N3b3JkIGF0IGxlYXN0IDggY2hhcmFjdGVycyBsb25nXCJcbiAqICAgICAgICAgey4uLml0ZW1Qcm9wcy5wYXNzd29yZH1cbiAqICAgICAgIC8+XG4gKiAgICAgPC9Gb3JtPlxuICogICApO1xuICogfVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uIHVzZUZvcm0ocHJvcHMpIHtcbiAgICBjb25zdCB7IG9uU3VibWl0OiBfb25TdWJtaXQsIHZhbGlkYXRpb24sIGluaXRpYWxWYWx1ZXMgPSB7fSB9ID0gcHJvcHM7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciBpdCdzIGZpbmUgaWYgd2UgZG9uJ3Qgc3BlY2lmeSBhbGwgdGhlIHZhbHVlc1xuICAgIGNvbnN0IFt2YWx1ZXMsIHNldFZhbHVlc10gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoaW5pdGlhbFZhbHVlcyk7XG4gICAgY29uc3QgW2Vycm9ycywgc2V0RXJyb3JzXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKSh7fSk7XG4gICAgY29uc3QgcmVmcyA9ICgwLCByZWFjdF8xLnVzZVJlZikoe30pO1xuICAgIGNvbnN0IGxhdGVzdFZhbGlkYXRpb24gPSAoMCwgdXNlTGF0ZXN0XzEudXNlTGF0ZXN0KSh2YWxpZGF0aW9uIHx8IHt9KTtcbiAgICBjb25zdCBsYXRlc3RPblN1Ym1pdCA9ICgwLCB1c2VMYXRlc3RfMS51c2VMYXRlc3QpKF9vblN1Ym1pdCk7XG4gICAgY29uc3QgZm9jdXMgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoKGlkKSA9PiB7XG4gICAgICAgIHJlZnMuY3VycmVudFtpZF0/LmZvY3VzKCk7XG4gICAgfSwgW3JlZnNdKTtcbiAgICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoYXN5bmMgKHZhbHVlcykgPT4ge1xuICAgICAgICBsZXQgdmFsaWRhdGlvbkVycm9ycyA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IFtpZCwgdmFsaWRhdGlvbl0gb2YgT2JqZWN0LmVudHJpZXMobGF0ZXN0VmFsaWRhdGlvbi5jdXJyZW50KSkge1xuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB2YWxpZGF0aW9uRXJyb3IodmFsaWRhdGlvbiwgdmFsdWVzW2lkXSk7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbkVycm9ycyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBmb2N1cyB0aGUgZmlyc3QgaXRlbSB0aGF0IGhhcyBhbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICBmb2N1cyhpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbGlkYXRpb25FcnJvcnNbaWRdID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbGlkYXRpb25FcnJvcnMpIHtcbiAgICAgICAgICAgIHNldEVycm9ycyh2YWxpZGF0aW9uRXJyb3JzKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBsYXRlc3RPblN1Ym1pdC5jdXJyZW50KHZhbHVlcyk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09PSBcImJvb2xlYW5cIiA/IHJlc3VsdCA6IHRydWU7XG4gICAgfSwgW2xhdGVzdFZhbGlkYXRpb24sIGxhdGVzdE9uU3VibWl0LCBmb2N1c10pO1xuICAgIGNvbnN0IHNldFZhbGlkYXRpb25FcnJvciA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKSgoaWQsIGVycm9yKSA9PiB7XG4gICAgICAgIHNldEVycm9ycygoZXJyb3JzKSA9PiAoeyAuLi5lcnJvcnMsIFtpZF06IGVycm9yIH0pKTtcbiAgICB9LCBbc2V0RXJyb3JzXSk7XG4gICAgY29uc3Qgc2V0VmFsdWUgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xuICAgICAgICBzZXRWYWx1ZXMoKHZhbHVlcykgPT4gKHsgLi4udmFsdWVzLCBbaWRdOiB2YWx1ZSB9KSk7XG4gICAgfSwgW3NldFZhbHVlc10pO1xuICAgIGNvbnN0IGl0ZW1Qcm9wcyA9ICgwLCByZWFjdF8xLnVzZU1lbW8pKCgpID0+IHtcbiAgICAgICAgLy8gd2UgaGF2ZSB0byB1c2UgYSBwcm94eSBiZWNhdXNlIHdlIGRvbid0IGFjdHVhbGx5IGhhdmUgYW55IG9iamVjdCB0byBpdGVyYXRlIHRocm91Z2hcbiAgICAgICAgLy8gc28gaW5zdGVhZCB3ZSBkeW5hbWljYWxseSBjcmVhdGUgdGhlIHByb3BzIHdoZW4gcmVxdWlyZWRcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0aGUgd2hvbGUgcG9pbnQgb2YgYSBwcm94eS4uLlxuICAgICAgICB7fSwge1xuICAgICAgICAgICAgZ2V0KHRhcmdldCwgaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZGF0aW9uID0gbGF0ZXN0VmFsaWRhdGlvbi5jdXJyZW50W2lkXTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpZF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2UodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcnNbaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB2YWxpZGF0aW9uRXJyb3IodmFsaWRhdGlvbiwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VmFsaWRhdGlvbkVycm9yKGlkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFZhbHVlKGlkLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uQmx1cihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB2YWxpZGF0aW9uRXJyb3IodmFsaWRhdGlvbiwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFZhbGlkYXRpb25FcnJvcihpZCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JzW2lkXSxcbiAgICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIHNob3VsZG4ndCByZXR1cm4gYHVuZGVmaW5lZGAgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgYW4gdW5jb250cm9sbGVkIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiID8gbnVsbCA6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICByZWY6IChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmcy5jdXJyZW50W2lkXSA9IGluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LCBbZXJyb3JzLCBsYXRlc3RWYWxpZGF0aW9uLCBzZXRWYWxpZGF0aW9uRXJyb3IsIHZhbHVlcywgcmVmcywgc2V0VmFsdWVdKTtcbiAgICBjb25zdCByZXNldCA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKSgoaW5pdGlhbFZhbHVlcyA9IHt9KSA9PiB7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgaXQncyBmaW5lIGlmIHdlIGRvbid0IHNwZWNpZnkgYWxsIHRoZSB2YWx1ZXNcbiAgICAgICAgc2V0VmFsdWVzKGluaXRpYWxWYWx1ZXMpO1xuICAgICAgICBzZXRFcnJvcnMoe30pO1xuICAgIH0sIFtzZXRWYWx1ZXMsIHNldEVycm9yc10pO1xuICAgIHJldHVybiB7IGhhbmRsZVN1Ym1pdCwgc2V0VmFsaWRhdGlvbkVycm9yLCBzZXRWYWx1ZSwgdmFsdWVzLCBpdGVtUHJvcHMsIGZvY3VzLCByZXNldCB9O1xufVxuZXhwb3J0cy51c2VGb3JtID0gdXNlRm9ybTtcbiIsICJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2xpZ2h0bHlMaWdodGVyQ29sb3IgPSBleHBvcnRzLnNsaWdodGx5RGFya2VyQ29sb3IgPSB2b2lkIDA7XG5mdW5jdGlvbiBoZXhUb1JHQihoZXgpIHtcbiAgICBsZXQgciA9IDA7XG4gICAgbGV0IGcgPSAwO1xuICAgIGxldCBiID0gMDtcbiAgICAvLyAzIGRpZ2l0c1xuICAgIGlmIChoZXgubGVuZ3RoID09PSA0KSB7XG4gICAgICAgIHIgPSBwYXJzZUludChgJHtoZXhbMV19JHtoZXhbMV19YCwgMTYpO1xuICAgICAgICBnID0gcGFyc2VJbnQoYCR7aGV4WzJdfSR7aGV4WzJdfWAsIDE2KTtcbiAgICAgICAgYiA9IHBhcnNlSW50KGAke2hleFszXX0ke2hleFszXX1gLCAxNik7XG4gICAgICAgIC8vIDYgZGlnaXRzXG4gICAgfVxuICAgIGVsc2UgaWYgKGhleC5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgciA9IHBhcnNlSW50KGAke2hleFsxXX0ke2hleFsyXX1gLCAxNik7XG4gICAgICAgIGcgPSBwYXJzZUludChgJHtoZXhbM119JHtoZXhbNF19YCwgMTYpO1xuICAgICAgICBiID0gcGFyc2VJbnQoYCR7aGV4WzVdfSR7aGV4WzZdfWAsIDE2KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWFsZm9ybWVkIGhleCBjb2xvcjogJHtoZXh9YCk7XG4gICAgfVxuICAgIHJldHVybiB7IHIsIGcsIGIgfTtcbn1cbmZ1bmN0aW9uIHJnYlRvSGV4KHsgciwgZywgYiB9KSB7XG4gICAgbGV0IHJTdHJpbmcgPSByLnRvU3RyaW5nKDE2KTtcbiAgICBsZXQgZ1N0cmluZyA9IGcudG9TdHJpbmcoMTYpO1xuICAgIGxldCBiU3RyaW5nID0gYi50b1N0cmluZygxNik7XG4gICAgaWYgKHJTdHJpbmcubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJTdHJpbmcgPSBgMCR7clN0cmluZ31gO1xuICAgIH1cbiAgICBpZiAoZ1N0cmluZy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZ1N0cmluZyA9IGAwJHtnU3RyaW5nfWA7XG4gICAgfVxuICAgIGlmIChiU3RyaW5nLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBiU3RyaW5nID0gYDAke2JTdHJpbmd9YDtcbiAgICB9XG4gICAgcmV0dXJuIGAjJHtyU3RyaW5nfSR7Z1N0cmluZ30ke2JTdHJpbmd9YDtcbn1cbmZ1bmN0aW9uIHJnYlRvSFNMKHsgciwgZywgYiB9KSB7XG4gICAgLy8gTWFrZSByLCBnLCBhbmQgYiBmcmFjdGlvbnMgb2YgMVxuICAgIHIgLz0gMjU1O1xuICAgIGcgLz0gMjU1O1xuICAgIGIgLz0gMjU1O1xuICAgIC8vIEZpbmQgZ3JlYXRlc3QgYW5kIHNtYWxsZXN0IGNoYW5uZWwgdmFsdWVzXG4gICAgY29uc3QgY21pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgIGNvbnN0IGNtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICBjb25zdCBkZWx0YSA9IGNtYXggLSBjbWluO1xuICAgIGxldCBoID0gMDtcbiAgICBsZXQgcyA9IDA7XG4gICAgbGV0IGwgPSAwO1xuICAgIC8vIENhbGN1bGF0ZSBodWVcbiAgICAvLyBObyBkaWZmZXJlbmNlXG4gICAgaWYgKGRlbHRhID09PSAwKSB7XG4gICAgICAgIGggPSAwO1xuICAgIH1cbiAgICAvLyBSZWQgaXMgbWF4XG4gICAgZWxzZSBpZiAoY21heCA9PT0gcikge1xuICAgICAgICBoID0gKChnIC0gYikgLyBkZWx0YSkgJSA2O1xuICAgIH1cbiAgICAvLyBHcmVlbiBpcyBtYXhcbiAgICBlbHNlIGlmIChjbWF4ID09PSBnKSB7XG4gICAgICAgIGggPSAoYiAtIHIpIC8gZGVsdGEgKyAyO1xuICAgIH1cbiAgICAvLyBCbHVlIGlzIG1heFxuICAgIGVsc2Uge1xuICAgICAgICBoID0gKHIgLSBnKSAvIGRlbHRhICsgNDtcbiAgICB9XG4gICAgaCA9IE1hdGgucm91bmQoaCAqIDYwKTtcbiAgICAvLyBNYWtlIG5lZ2F0aXZlIGh1ZXMgcG9zaXRpdmUgYmVoaW5kIDM2MFx1MDBCMFxuICAgIGlmIChoIDwgMCkge1xuICAgICAgICBoICs9IDM2MDtcbiAgICB9XG4gICAgLy8gQ2FsY3VsYXRlIGxpZ2h0bmVzc1xuICAgIGwgPSAoY21heCArIGNtaW4pIC8gMjtcbiAgICAvLyBDYWxjdWxhdGUgc2F0dXJhdGlvblxuICAgIHMgPSBkZWx0YSA9PT0gMCA/IDAgOiBkZWx0YSAvICgxIC0gTWF0aC5hYnMoMiAqIGwgLSAxKSk7XG4gICAgLy8gTXVsdGlwbHkgbCBhbmQgcyBieSAxMDBcbiAgICBzID0gKyhzICogMTAwKS50b0ZpeGVkKDEpO1xuICAgIGwgPSArKGwgKiAxMDApLnRvRml4ZWQoMSk7XG4gICAgcmV0dXJuIHsgaCwgcywgbCB9O1xufVxuZnVuY3Rpb24gaHNsVG9SR0IoeyBoLCBzLCBsIH0pIHtcbiAgICAvLyBNdXN0IGJlIGZyYWN0aW9ucyBvZiAxXG4gICAgcyAvPSAxMDA7XG4gICAgbCAvPSAxMDA7XG4gICAgY29uc3QgYyA9ICgxIC0gTWF0aC5hYnMoMiAqIGwgLSAxKSkgKiBzO1xuICAgIGNvbnN0IHggPSBjICogKDEgLSBNYXRoLmFicygoKGggLyA2MCkgJSAyKSAtIDEpKTtcbiAgICBjb25zdCBtID0gbCAtIGMgLyAyO1xuICAgIGxldCByID0gMDtcbiAgICBsZXQgZyA9IDA7XG4gICAgbGV0IGIgPSAwO1xuICAgIGlmIChoID49IDAgJiYgaCA8IDYwKSB7XG4gICAgICAgIHIgPSBjO1xuICAgICAgICBnID0geDtcbiAgICAgICAgYiA9IDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKGggPj0gNjAgJiYgaCA8IDEyMCkge1xuICAgICAgICByID0geDtcbiAgICAgICAgZyA9IGM7XG4gICAgICAgIGIgPSAwO1xuICAgIH1cbiAgICBlbHNlIGlmIChoID49IDEyMCAmJiBoIDwgMTgwKSB7XG4gICAgICAgIHIgPSAwO1xuICAgICAgICBnID0gYztcbiAgICAgICAgYiA9IHg7XG4gICAgfVxuICAgIGVsc2UgaWYgKGggPj0gMTgwICYmIGggPCAyNDApIHtcbiAgICAgICAgciA9IDA7XG4gICAgICAgIGcgPSB4O1xuICAgICAgICBiID0gYztcbiAgICB9XG4gICAgZWxzZSBpZiAoaCA+PSAyNDAgJiYgaCA8IDMwMCkge1xuICAgICAgICByID0geDtcbiAgICAgICAgZyA9IDA7XG4gICAgICAgIGIgPSBjO1xuICAgIH1cbiAgICBlbHNlIGlmIChoID49IDMwMCAmJiBoIDwgMzYwKSB7XG4gICAgICAgIHIgPSBjO1xuICAgICAgICBnID0gMDtcbiAgICAgICAgYiA9IHg7XG4gICAgfVxuICAgIHIgPSBNYXRoLnJvdW5kKChyICsgbSkgKiAyNTUpO1xuICAgIGcgPSBNYXRoLnJvdW5kKChnICsgbSkgKiAyNTUpO1xuICAgIGIgPSBNYXRoLnJvdW5kKChiICsgbSkgKiAyNTUpO1xuICAgIHJldHVybiB7IHIsIGcsIGIgfTtcbn1cbmZ1bmN0aW9uIGhleFRvSFNMKGhleCkge1xuICAgIHJldHVybiByZ2JUb0hTTChoZXhUb1JHQihoZXgpKTtcbn1cbmZ1bmN0aW9uIGhzbFRvSGV4KGhzbCkge1xuICAgIHJldHVybiByZ2JUb0hleChoc2xUb1JHQihoc2wpKTtcbn1cbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xuICAgIHJldHVybiBtaW4gPCBtYXggPyAodmFsdWUgPCBtaW4gPyBtaW4gOiB2YWx1ZSA+IG1heCA/IG1heCA6IHZhbHVlKSA6IHZhbHVlIDwgbWF4ID8gbWF4IDogdmFsdWUgPiBtaW4gPyBtaW4gOiB2YWx1ZTtcbn1cbmNvbnN0IG9mZnNldCA9IDEyO1xuZnVuY3Rpb24gc2xpZ2h0bHlEYXJrZXJDb2xvcihoZXgpIHtcbiAgICBjb25zdCBoc2wgPSBoZXhUb0hTTChoZXgpO1xuICAgIHJldHVybiBoc2xUb0hleCh7XG4gICAgICAgIGg6IGhzbC5oLFxuICAgICAgICBzOiBoc2wucyxcbiAgICAgICAgbDogY2xhbXAoaHNsLmwgLSBvZmZzZXQsIDAsIDEwMCksXG4gICAgfSk7XG59XG5leHBvcnRzLnNsaWdodGx5RGFya2VyQ29sb3IgPSBzbGlnaHRseURhcmtlckNvbG9yO1xuZnVuY3Rpb24gc2xpZ2h0bHlMaWdodGVyQ29sb3IoaGV4KSB7XG4gICAgY29uc3QgaHNsID0gaGV4VG9IU0woaGV4KTtcbiAgICByZXR1cm4gaHNsVG9IZXgoe1xuICAgICAgICBoOiBoc2wuaCxcbiAgICAgICAgczogaHNsLnMsXG4gICAgICAgIGw6IGNsYW1wKGhzbC5sICsgb2Zmc2V0LCAwLCAxMDApLFxuICAgIH0pO1xufVxuZXhwb3J0cy5zbGlnaHRseUxpZ2h0ZXJDb2xvciA9IHNsaWdodGx5TGlnaHRlckNvbG9yO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRBdmF0YXJJY29uID0gdm9pZCAwO1xuY29uc3QgY29sb3JfMSA9IHJlcXVpcmUoXCIuL2NvbG9yXCIpO1xuZnVuY3Rpb24gZ2V0V2hvbGVDaGFyQW5kSShzdHIsIGkpIHtcbiAgICBjb25zdCBjb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKE51bWJlci5pc05hTihjb2RlKSkge1xuICAgICAgICByZXR1cm4gW1wiXCIsIGldO1xuICAgIH1cbiAgICBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID4gMHhkZmZmKSB7XG4gICAgICAgIHJldHVybiBbc3RyLmNoYXJBdChpKSwgaV07IC8vIE5vcm1hbCBjaGFyYWN0ZXIsIGtlZXBpbmcgJ2knIHRoZSBzYW1lXG4gICAgfVxuICAgIC8vIEhpZ2ggc3Vycm9nYXRlIChjb3VsZCBjaGFuZ2UgbGFzdCBoZXggdG8gMHhEQjdGIHRvIHRyZWF0IGhpZ2ggcHJpdmF0ZVxuICAgIC8vIHN1cnJvZ2F0ZXMgYXMgc2luZ2xlIGNoYXJhY3RlcnMpXG4gICAgaWYgKDB4ZDgwMCA8PSBjb2RlICYmIGNvZGUgPD0gMHhkYmZmKSB7XG4gICAgICAgIGlmIChzdHIubGVuZ3RoIDw9IGkgKyAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIaWdoIHN1cnJvZ2F0ZSB3aXRob3V0IGZvbGxvd2luZyBsb3cgc3Vycm9nYXRlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5leHQgPSBzdHIuY2hhckNvZGVBdChpICsgMSk7XG4gICAgICAgIGlmICgweGRjMDAgPiBuZXh0IHx8IG5leHQgPiAweGRmZmYpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkhpZ2ggc3Vycm9nYXRlIHdpdGhvdXQgZm9sbG93aW5nIGxvdyBzdXJyb2dhdGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtzdHIuY2hhckF0KGkpICsgc3RyLmNoYXJBdChpICsgMSksIGkgKyAxXTtcbiAgICB9XG4gICAgLy8gTG93IHN1cnJvZ2F0ZSAoMHhEQzAwIDw9IGNvZGUgJiYgY29kZSA8PSAweERGRkYpXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTG93IHN1cnJvZ2F0ZSB3aXRob3V0IHByZWNlZGluZyBoaWdoIHN1cnJvZ2F0ZVwiKTtcbiAgICB9XG4gICAgY29uc3QgcHJldiA9IHN0ci5jaGFyQ29kZUF0KGkgLSAxKTtcbiAgICAvLyAoY291bGQgY2hhbmdlIGxhc3QgaGV4IHRvIDB4REI3RiB0byB0cmVhdCBoaWdoIHByaXZhdGUgc3Vycm9nYXRlc1xuICAgIC8vIGFzIHNpbmdsZSBjaGFyYWN0ZXJzKVxuICAgIGlmICgweGQ4MDAgPiBwcmV2IHx8IHByZXYgPiAweGRiZmYpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTG93IHN1cnJvZ2F0ZSB3aXRob3V0IHByZWNlZGluZyBoaWdoIHN1cnJvZ2F0ZVwiKTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBuZXh0IGNoYXJhY3RlciBpbnN0ZWFkIChhbmQgaW5jcmVtZW50KVxuICAgIHJldHVybiBbc3RyLmNoYXJBdChpICsgMSksIGkgKyAxXTtcbn1cbmNvbnN0IGF2YXRhckNvbG9yU2V0ID0gW1xuICAgIFwiI0RDODI5QVwiLFxuICAgIFwiI0Q2NDg1NFwiLFxuICAgIFwiI0Q0NzYwMFwiLFxuICAgIFwiI0QzNkNERFwiLFxuICAgIFwiIzUyQTlFNFwiLFxuICAgIFwiIzc4NzFFOFwiLFxuICAgIFwiIzcwOTIwRlwiLFxuICAgIFwiIzQzQjkzQVwiLFxuICAgIFwiI0VCNkIzRVwiLFxuICAgIFwiIzI2Qjc5NVwiLFxuICAgIFwiI0Q4NUE5QlwiLFxuICAgIFwiI0EwNjdEQ1wiLFxuICAgIFwiI0JEOTUwMFwiLFxuICAgIFwiIzUzODVEOVwiLCAvLyBCbHVlXG5dO1xuLyoqXG4gKiBJY29uIHRvIHJlcHJlc2VudCBhbiBhdmF0YXIgd2hlbiB5b3UgZG9uJ3QgaGF2ZSBvbmUuIFRoZSBnZW5lcmF0ZWQgYXZhdGFyXG4gKiB3aWxsIGJlIGdlbmVyYXRlZCBmcm9tIHRoZSBpbml0aWFscyBvZiB0aGUgbmFtZSBhbmQgaGF2ZSBhIGNvbG9yZnVsIGJ1dCBjb25zaXN0ZW50IGJhY2tncm91bmQuXG4gKlxuICogQHJldHVybnMgYW4gSW1hZ2UgdGhhdCBjYW4gYmUgdXNlZCB3aGVyZSBSYXljYXN0IGV4cGVjdHMgdGhlbS5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiA8TGlzdC5JdGVtIGljb249e2dldEF2YXRhckljb24oJ01hdGhpZXUgRHV0b3VyJyl9IHRpdGxlPVwiUHJvamVjdFwiIC8+XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gZ2V0QXZhdGFySWNvbihuYW1lLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgd29yZHMgPSBuYW1lLnRyaW0oKS5zcGxpdChcIiBcIik7XG4gICAgbGV0IGluaXRpYWxzO1xuICAgIGlmICh3b3Jkcy5sZW5ndGggPT0gMSAmJiBnZXRXaG9sZUNoYXJBbmRJKHdvcmRzWzBdLCAwKVswXSkge1xuICAgICAgICBpbml0aWFscyA9IGdldFdob2xlQ2hhckFuZEkod29yZHNbMF0sIDApWzBdO1xuICAgIH1cbiAgICBlbHNlIGlmICh3b3Jkcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0V29yZEZpcnN0TGV0dGVyID0gZ2V0V2hvbGVDaGFyQW5kSSh3b3Jkc1swXSwgMClbMF0gfHwgXCJcIjtcbiAgICAgICAgY29uc3QgbGFzdFdvcmRGaXJzdExldHRlciA9IGdldFdob2xlQ2hhckFuZEkod29yZHNbd29yZHMubGVuZ3RoIC0gMV0sIDApWzBdID8/IFwiXCI7XG4gICAgICAgIGluaXRpYWxzID0gZmlyc3RXb3JkRmlyc3RMZXR0ZXIgKyBsYXN0V29yZEZpcnN0TGV0dGVyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSBcIlwiO1xuICAgIH1cbiAgICBsZXQgYmFja2dyb3VuZENvbG9yO1xuICAgIGlmIChvcHRpb25zPy5iYWNrZ3JvdW5kKSB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IG9wdGlvbnM/LmJhY2tncm91bmQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgaW5pdGlhbHNDaGFySW5kZXggPSAwO1xuICAgICAgICBsZXQgW2NoYXIsIGldID0gZ2V0V2hvbGVDaGFyQW5kSShpbml0aWFscywgMCk7XG4gICAgICAgIHdoaWxlIChjaGFyKSB7XG4gICAgICAgICAgICBpbml0aWFsc0NoYXJJbmRleCArPSBjaGFyLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICBbY2hhciwgaV0gPSBnZXRXaG9sZUNoYXJBbmRJKGluaXRpYWxzLCBpICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29sb3JJbmRleCA9IGluaXRpYWxzQ2hhckluZGV4ICUgYXZhdGFyQ29sb3JTZXQubGVuZ3RoO1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBhdmF0YXJDb2xvclNldFtjb2xvckluZGV4XTtcbiAgICB9XG4gICAgY29uc3QgcGFkZGluZyA9IDA7XG4gICAgY29uc3QgcmFkaXVzID0gNTAgLSBwYWRkaW5nO1xuICAgIGNvbnN0IHN2ZyA9IGA8c3ZnIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiPlxuICAke29wdGlvbnM/LmdyYWRpZW50ICE9PSBmYWxzZVxuICAgICAgICA/IGA8ZGVmcz5cbiAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cIkdyYWRpZW50XCIgeDE9XCIwLjI1XCIgeDI9XCIwLjc1XCIgeTE9XCIwXCIgeTI9XCIxXCI+XG4gICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiR7KDAsIGNvbG9yXzEuc2xpZ2h0bHlMaWdodGVyQ29sb3IpKGJhY2tncm91bmRDb2xvcil9XCIvPlxuICAgICAgICA8c3RvcCBvZmZzZXQ9XCI1MCVcIiBzdG9wLWNvbG9yPVwiJHtiYWNrZ3JvdW5kQ29sb3J9XCIvPlxuICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cIiR7KDAsIGNvbG9yXzEuc2xpZ2h0bHlEYXJrZXJDb2xvcikoYmFja2dyb3VuZENvbG9yKX1cIi8+XG4gICAgICA8L2xpbmVhckdyYWRpZW50PlxuICA8L2RlZnM+YFxuICAgICAgICA6IFwiXCJ9XG4gICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIiR7cmFkaXVzfVwiIGZpbGw9XCIke29wdGlvbnM/LmdyYWRpZW50ICE9PSBmYWxzZSA/IFwidXJsKCNHcmFkaWVudClcIiA6IGJhY2tncm91bmRDb2xvcn1cIiAvPlxuICAgICAgJHtpbml0aWFsc1xuICAgICAgICA/IGA8dGV4dCB4PVwiNTBcIiB5PVwiODBcIiBmb250LXNpemU9XCIke3JhZGl1cyAtIDF9XCIgZm9udC1mYW1pbHk9XCJJbnRlciwgc2Fucy1zZXJpZlwiIHRleHQtYW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cIndoaXRlXCI+JHtpbml0aWFsc308L3RleHQ+YFxuICAgICAgICA6IFwiXCJ9XG4gICAgPC9zdmc+XG4gIGAucmVwbGFjZUFsbChcIlxcblwiLCBcIlwiKTtcbiAgICByZXR1cm4gYGRhdGE6aW1hZ2Uvc3ZnK3htbCwke3N2Z31gO1xufVxuZXhwb3J0cy5nZXRBdmF0YXJJY29uID0gZ2V0QXZhdGFySWNvbjtcbiIsICJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0RmF2aWNvbiA9IHZvaWQgMDtcbmNvbnN0IGFwaV8xID0gcmVxdWlyZShcIkByYXljYXN0L2FwaVwiKTtcbmNvbnN0IHVybF8xID0gcmVxdWlyZShcInVybFwiKTtcbi8qKlxuICogSWNvbiBzaG93aW5nIHRoZSBmYXZpY29uIG9mIGEgd2Vic2l0ZS5cbiAqXG4gKiBBIGZhdmljb24gKGZhdm9yaXRlIGljb24pIGlzIGEgdGlueSBpY29uIGluY2x1ZGVkIGFsb25nIHdpdGggYSB3ZWJzaXRlLCB3aGljaCBpcyBkaXNwbGF5ZWQgaW4gcGxhY2VzIGxpa2UgdGhlIGJyb3dzZXIncyBhZGRyZXNzIGJhciwgcGFnZSB0YWJzLCBhbmQgYm9va21hcmtzIG1lbnUuXG4gKlxuICogQHBhcmFtIHVybCBUaGUgVVJMIG9mIHRoZSB3ZWJzaXRlIHRvIHJlcHJlc2VudC5cbiAqXG4gKiBAcmV0dXJucyBhbiBJbWFnZSB0aGF0IGNhbiBiZSB1c2VkIHdoZXJlIFJheWNhc3QgZXhwZWN0cyB0aGVtLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIDxMaXN0Lkl0ZW0gaWNvbj17Z2V0RmF2aWNvbihcImh0dHBzOi8vcmF5Y2FzdC5jb21cIil9IHRpdGxlPVwiUmF5Y2FzdCBXZWJzaXRlXCIgLz5cbiAqIGBgYFxuICovXG5mdW5jdGlvbiBnZXRGYXZpY29uKHVybCwgb3B0aW9ucykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVybE9iaiA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgdXJsXzEuVVJMKHVybCkgOiB1cmw7XG4gICAgICAgIGNvbnN0IGhvc3RuYW1lID0gdXJsT2JqLmhvc3RuYW1lO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc291cmNlOiBgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zMi9mYXZpY29ucz9zej0ke29wdGlvbnM/LnNpemUgPz8gNjR9JmRvbWFpbj0ke2hvc3RuYW1lfWAsXG4gICAgICAgICAgICBmYWxsYmFjazogb3B0aW9ucz8uZmFsbGJhY2sgPz8gYXBpXzEuSWNvbi5MaW5rLFxuICAgICAgICAgICAgbWFzazogb3B0aW9ucz8ubWFzayxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgcmV0dXJuIGFwaV8xLkljb24uTGluaztcbiAgICB9XG59XG5leHBvcnRzLmdldEZhdmljb24gPSBnZXRGYXZpY29uO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRQcm9ncmVzc0ljb24gPSB2b2lkIDA7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCJAcmF5Y2FzdC9hcGlcIik7XG5mdW5jdGlvbiBwb2xhclRvQ2FydGVzaWFuKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVJbkRlZ3JlZXMpIHtcbiAgICBjb25zdCBhbmdsZUluUmFkaWFucyA9ICgoYW5nbGVJbkRlZ3JlZXMgLSA5MCkgKiBNYXRoLlBJKSAvIDE4MC4wO1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IGNlbnRlclggKyByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyksXG4gICAgICAgIHk6IGNlbnRlclkgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucyksXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRlc2NyaWJlQXJjKHgsIHksIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUpIHtcbiAgICBjb25zdCBzdGFydCA9IHBvbGFyVG9DYXJ0ZXNpYW4oeCwgeSwgcmFkaXVzLCBlbmRBbmdsZSk7XG4gICAgY29uc3QgZW5kID0gcG9sYXJUb0NhcnRlc2lhbih4LCB5LCByYWRpdXMsIHN0YXJ0QW5nbGUpO1xuICAgIGNvbnN0IGxhcmdlQXJjRmxhZyA9IGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSA8PSAxODAgPyBcIjBcIiA6IFwiMVwiO1xuICAgIGNvbnN0IGQgPSBbXCJNXCIsIHN0YXJ0LngsIHN0YXJ0LnksIFwiQVwiLCByYWRpdXMsIHJhZGl1cywgMCwgbGFyZ2VBcmNGbGFnLCAwLCBlbmQueCwgZW5kLnldLmpvaW4oXCIgXCIpO1xuICAgIHJldHVybiBkO1xufVxuLyoqXG4gKiBJY29uIHRvIHJlcHJlc2VudCB0aGUgcHJvZ3Jlc3Mgb2YgX3NvbWV0aGluZ18uXG4gKlxuICogQHBhcmFtIHByb2dyZXNzIE51bWJlciBiZXR3ZWVuIDAgYW5kIDEuXG4gKiBAcGFyYW0gY29sb3IgSGV4IGNvbG9yIChkZWZhdWx0IGBcIiNGRjYzNjNcImApLlxuICpcbiAqIEByZXR1cm5zIGFuIEltYWdlIHRoYXQgY2FuIGJlIHVzZWQgd2hlcmUgUmF5Y2FzdCBleHBlY3RzIHRoZW0uXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogPExpc3QuSXRlbSBpY29uPXtnZXRQcm9ncmVzc0ljb24oMC4xKX0gdGl0bGU9XCJQcm9qZWN0XCIgLz5cbiAqIGBgYFxuICovXG5mdW5jdGlvbiBnZXRQcm9ncmVzc0ljb24ocHJvZ3Jlc3MsIGNvbG9yID0gXCIjRkY2MzYzXCIsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gb3B0aW9ucz8uYmFja2dyb3VuZCB8fCAoYXBpXzEuZW52aXJvbm1lbnQudGhlbWUgPT09IFwibGlnaHRcIiA/IFwiYmxhY2tcIiA6IFwid2hpdGVcIik7XG4gICAgY29uc3QgYmFja2dyb3VuZE9wYWNpdHkgPSBvcHRpb25zPy5iYWNrZ3JvdW5kT3BhY2l0eSB8fCAwLjE7XG4gICAgY29uc3Qgc3Ryb2tlID0gMTA7XG4gICAgY29uc3QgcGFkZGluZyA9IDU7XG4gICAgY29uc3QgcmFkaXVzID0gNTAgLSBwYWRkaW5nIC0gc3Ryb2tlIC8gMjtcbiAgICBjb25zdCBzdmcgPSBgPHN2ZyB3aWR0aD1cIjEwMHB4XCIgaGVpZ2h0PVwiMTAwcHhcIj5cbiAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiJHtyYWRpdXN9XCIgc3Ryb2tlLXdpZHRoPVwiJHtzdHJva2V9XCIgc3Ryb2tlPVwiJHtwcm9ncmVzcyA8IDEgPyBiYWNrZ3JvdW5kIDogY29sb3J9XCIgb3BhY2l0eT1cIiR7cHJvZ3Jlc3MgPCAxID8gYmFja2dyb3VuZE9wYWNpdHkgOiBcIjFcIn1cIiBmaWxsPVwibm9uZVwiIC8+XG4gICAgICAke3Byb2dyZXNzID4gMCAmJiBwcm9ncmVzcyA8IDFcbiAgICAgICAgPyBgPHBhdGggZD1cIiR7ZGVzY3JpYmVBcmMoNTAsIDUwLCByYWRpdXMsIDAsIHByb2dyZXNzICogMzYwKX1cIiBzdHJva2U9XCIke2NvbG9yfVwiIHN0cm9rZS13aWR0aD1cIiR7c3Ryb2tlfVwiIGZpbGw9XCJub25lXCIgLz5gXG4gICAgICAgIDogXCJcIn1cbiAgICA8L3N2Zz5cbiAgYC5yZXBsYWNlQWxsKFwiXFxuXCIsIFwiXCIpO1xuICAgIHJldHVybiBgZGF0YTppbWFnZS9zdmcreG1sLCR7c3ZnfWA7XG59XG5leHBvcnRzLmdldFByb2dyZXNzSWNvbiA9IGdldFByb2dyZXNzSWNvbjtcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2F2YXRhclwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vZmF2aWNvblwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vcHJvZ3Jlc3NcIiksIGV4cG9ydHMpO1xuIiwgIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdXNlUHJvbWlzZVwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdXNlQ2FjaGVkU3RhdGVcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3VzZUNhY2hlZFByb21pc2VcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3VzZUZldGNoXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi91c2VFeGVjXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi91c2VTUUxcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3VzZUZvcm1cIiksIGV4cG9ydHMpO1xuLy9leHBvcnQgKiBhcyBzdXNwZW5zZSBmcm9tIFwiLi9zdXNwZW5zZVwiO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2ljb25cIiksIGV4cG9ydHMpO1xuIiwgImltcG9ydCB7IEFjdGlvblBhbmVsLCBBY3Rpb24sIExpc3QsIG9wZW4gfSBmcm9tIFwiQHJheWNhc3QvYXBpXCI7XG5pbXBvcnQgeyB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tIFwibm9kZTpjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgcGFyc2VDb2x1bW5zIGZyb20gXCJwYXJzZS1jb2x1bW5zXCI7XG5pbXBvcnQgeyB1c2VFeGVjIH0gZnJvbSBcIkByYXljYXN0L3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbW1hbmQoKSB7XG4gIGNvbnN0IFtzZWFyY2hUZXh0LCBzZXRTZWFyY2hUZXh0XSA9IHVzZVN0YXRlKFwiXCIpO1xuXG4gIGNvbnN0IHsgaXNMb2FkaW5nLCBkYXRhIH0gPSB1c2VFeGVjKFwiL29wdC9ob21lYnJldy9iaW4vYXdzLXZhdWx0XCIsIFtcImxpc3RcIl0pO1xuICBjb25zdCBwcm9maWxlcyA9IHVzZU1lbW88cHJvZmlsZVtdPigoKSA9PiBwYXJzZVRhYmxlTGlzdE91cHV0KGRhdGEgfHwgXCJcIiksIFtkYXRhXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8TGlzdFxuICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICBvblNlYXJjaFRleHRDaGFuZ2U9e3NldFNlYXJjaFRleHR9XG4gICAgICBzZWFyY2hCYXJQbGFjZWhvbGRlcj1cIlNlYXJjaCBvbmUgb2YgeW91ciBBV1MgcHJvZmlsZXMuLi5cIlxuICAgICAgdGhyb3R0bGVcbiAgICA+XG4gICAgICA8TGlzdC5TZWN0aW9uIHRpdGxlPVwiUHJvZmlsZXNcIiBzdWJ0aXRsZT17cHJvZmlsZXMubGVuZ3RoICsgXCJcIn0+XG4gICAgICAgIHtwcm9maWxlc1xuICAgICAgICAgIC5maWx0ZXIoKHByb2ZpbGUpID0+IG5ldyBSZWdFeHAoc2VhcmNoVGV4dCwgXCJpXCIpLnRlc3QocHJvZmlsZS5uYW1lKSlcbiAgICAgICAgICAubWFwKChwcm9maWxlKSA9PiAoXG4gICAgICAgICAgICA8UHJvZmlsZUxpc3RJdGVtIGtleT17cHJvZmlsZS5uYW1lfSBwcm9maWxlPXtwcm9maWxlfSAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8TGlzdC5JdGVtXG4gICAgICAgICAgdGl0bGU9XCJMb2dvdXRcIlxuICAgICAgICAgIGljb249XCJcdUQ4M0RcdUREMTJcIlxuICAgICAgICAgIGFjdGlvbnM9e1xuICAgICAgICAgICAgPEFjdGlvblBhbmVsPlxuICAgICAgICAgICAgICA8QWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8QWN0aW9uLk9wZW5JbkJyb3dzZXIgdXJsPVwiaHR0cHM6Ly9zaWduaW4uYXdzLmFtYXpvbi5jb20vb2F1dGg/QWN0aW9uPWxvZ291dCZyZWRpcmVjdF91cmk9aHR0cHM6Ly9hd3MuYW1hem9uLmNvbVwiIC8+XG4gICAgICAgICAgICAgIDwvQWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgPC9MaXN0LlNlY3Rpb24+XG4gICAgPC9MaXN0PlxuICApO1xufVxuXG5mdW5jdGlvbiBQcm9maWxlTGlzdEl0ZW0oeyBwcm9maWxlIH06IHsgcHJvZmlsZTogcHJvZmlsZSB9KSB7XG4gIGNvbnN0IG9wZW5JbkJyb3dzZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcHJvZmlsZV9kaXJfbmFtZSA9IHByb2ZpbGUubmFtZS5yZXBsYWNlKC9eYS16QS1aMC05Xy0vaSwgXCJfX1wiKTtcbiAgICBjb25zdCB1c2VyX2RhdGFfZGlyID0gYH4vLmF3cy9jaHJvbWUvJHtwcm9maWxlX2Rpcl9uYW1lfWA7XG4gICAgZXhlY1N5bmMoYG1rZGlyIC1wICR7dXNlcl9kYXRhX2Rpcn1gKTtcbiAgICBjb25zdCBkaXNrX2NhY2hlX2RpciA9IGV4ZWNTeW5jKGBta3RlbXAgLWQgL3RtcC9hd3NfY2hyb21lX2NhY2hlLlhYWFhYWFhYYCkudG9TdHJpbmcoKS50cmltKCk7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBleGVjU3luYyhgL29wdC9ob21lYnJldy9iaW4vYXdzLXZhdWx0IGxvZ2luICR7cHJvZmlsZS5uYW1lfSAtLXN0ZG91dGApLnRvU3RyaW5nKCk7XG5cbiAgICBjb25zb2xlLmxvZyh1c2VyX2RhdGFfZGlyLCBkaXNrX2NhY2hlX2RpciwgdXJsKTtcblxuICAgIGV4ZWNTeW5jKGAvQXBwbGljYXRpb25zL0dvb2dsZVxcXFwgQ2hyb21lLmFwcC9Db250ZW50cy9NYWNPUy9Hb29nbGVcXFxcIENocm9tZSBcXFxuICAgICAgLS1uby1maXJzdC1ydW4gXFxcbiAgICAgIC0tdXNlci1kYXRhLWRpcj0ke3VzZXJfZGF0YV9kaXJ9IFxcXG4gICAgICAtLWRpc2stY2FjaGUtZGlyPSR7ZGlza19jYWNoZV9kaXJ9IFxcXG4gICAgICAtLW5ldy13aW5kb3cgXFxcbiAgICAgICR7dXJsfSBcXFxuICAgID4vZGV2L251bGwgMj4mMSAmYCk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8TGlzdC5JdGVtXG4gICAgICB0aXRsZT17cHJvZmlsZS5uYW1lfVxuICAgICAgc3VidGl0bGU9e3Byb2ZpbGUuc2Vzc2lvbn1cbiAgICAgIGljb249XCJsaXN0LWljb24ucG5nXCJcbiAgICAgIGFjdGlvbnM9e1xuICAgICAgICA8QWN0aW9uUGFuZWw+XG4gICAgICAgICAgPEFjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICAgICAgICA8QWN0aW9uIHRpdGxlPVwiT3BlbiBpbiBCcm93c2VyXCIgb25BY3Rpb249e29wZW5JbkJyb3dzZXJ9IC8+XG4gICAgICAgICAgPC9BY3Rpb25QYW5lbC5TZWN0aW9uPlxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgfVxuICAgIC8+XG4gICk7XG59XG5cbmNvbnN0IHBhcnNlVGFibGVMaXN0T3VwdXQ6ICh0YWJsZUxpc3Q6IHN0cmluZykgPT4gcHJvZmlsZVtdID0gKHRhYmxlTGlzdDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGxpc3Q6IHBhcnNlZExpc3RbXSA9IFtdO1xuXG4gIHBhcnNlQ29sdW1ucyh0YWJsZUxpc3QsIHtcbiAgICB0cmFuc2Zvcm06IChpdGVtLCBoZWFkZXIsIGNvbHVtbkluZGV4LCByb3dJbmRleCkgPT4ge1xuICAgICAgaWYgKHJvd0luZGV4IDwgMSB8fCBpdGVtID09PSBcIi1cIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaCh7XG4gICAgICAgIGl0ZW0sXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgY29sdW1uSW5kZXgsXG4gICAgICAgIHJvd0luZGV4LFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgcHJvZmlsZXNCeVJvd0luZGV4ID0gbGlzdC5yZWR1Y2UoKGFjYywgdmFsdWUpID0+IHtcbiAgICBpZiAodmFsdWUuaGVhZGVyID09PSBcIlByb2ZpbGVcIikge1xuICAgICAgYWNjW3ZhbHVlLnJvd0luZGV4XSA9IHtcbiAgICAgICAgLi4uYWNjW3ZhbHVlLnJvd0luZGV4XSxcbiAgICAgICAgbmFtZTogdmFsdWUuaXRlbSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlLmhlYWRlciA9PT0gXCJTZXNzaW9uc1wiKSB7XG4gICAgICBhY2NbdmFsdWUucm93SW5kZXhdID0ge1xuICAgICAgICAuLi5hY2NbdmFsdWUucm93SW5kZXhdLFxuICAgICAgICBzZXNzaW9uOiB2YWx1ZS5pdGVtLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSBhcyB7IFtrZXk6IHN0cmluZ106IHBhcnNlZFByb2ZpbGUgfSk7XG5cbiAgcmV0dXJuIE9iamVjdC52YWx1ZXMocHJvZmlsZXNCeVJvd0luZGV4KS5maWx0ZXIoKHByb2ZpbGU6IHBhcnNlZFByb2ZpbGUpID0+IFwibmFtZVwiIGluIHByb2ZpbGUpIGFzIHByb2ZpbGVbXTtcbn07XG5cbnR5cGUgcGFyc2VkTGlzdCA9IHtcbiAgaXRlbTogc3RyaW5nO1xuICBoZWFkZXI6IHN0cmluZztcbiAgY29sdW1uSW5kZXg6IG51bWJlcjtcbiAgcm93SW5kZXg6IG51bWJlcjtcbn07XG50eXBlIHBhcnNlZFByb2ZpbGUgPSB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHNlc3Npb24/OiBzdHJpbmc7XG59O1xudHlwZSBwcm9maWxlID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHNlc3Npb24/OiBzdHJpbmc7XG59O1xuZnVuY3Rpb24gZXhlY1NwYXduKGFyZzA6IHN0cmluZyk6IEJ1ZmZlciB7XG4gIHRocm93IG5ldyBFcnJvcihcIkZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZC5cIik7XG59XG4iLCAiY29uc3Qge3RvU3RyaW5nfSA9IE9iamVjdC5wcm90b3R5cGU7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzUmVnZXhwKHZhbHVlKSB7XG5cdHJldHVybiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG4iLCAiaW1wb3J0IGlzUmVnZXhwIGZyb20gJ2lzLXJlZ2V4cCc7XG5cbmNvbnN0IGZsYWdNYXAgPSB7XG5cdGdsb2JhbDogJ2cnLFxuXHRpZ25vcmVDYXNlOiAnaScsXG5cdG11bHRpbGluZTogJ20nLFxuXHRkb3RBbGw6ICdzJyxcblx0c3RpY2t5OiAneScsXG5cdHVuaWNvZGU6ICd1J1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xvbmVkUmVnZXhwKHJlZ2V4cCwgb3B0aW9ucyA9IHt9KSB7XG5cdGlmICghaXNSZWdleHAocmVnZXhwKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgUmVnRXhwIGluc3RhbmNlJyk7XG5cdH1cblxuXHRjb25zdCBmbGFncyA9IE9iamVjdC5rZXlzKGZsYWdNYXApLm1hcChmbGFnID0+IChcblx0XHQodHlwZW9mIG9wdGlvbnNbZmxhZ10gPT09ICdib29sZWFuJyA/IG9wdGlvbnNbZmxhZ10gOiByZWdleHBbZmxhZ10pID8gZmxhZ01hcFtmbGFnXSA6ICcnXG5cdCkpLmpvaW4oJycpO1xuXG5cdGNvbnN0IGNsb25lZFJlZ2V4cCA9IG5ldyBSZWdFeHAob3B0aW9ucy5zb3VyY2UgfHwgcmVnZXhwLnNvdXJjZSwgZmxhZ3MpO1xuXG5cdGNsb25lZFJlZ2V4cC5sYXN0SW5kZXggPSB0eXBlb2Ygb3B0aW9ucy5sYXN0SW5kZXggPT09ICdudW1iZXInID9cblx0XHRvcHRpb25zLmxhc3RJbmRleCA6XG5cdFx0cmVnZXhwLmxhc3RJbmRleDtcblxuXHRyZXR1cm4gY2xvbmVkUmVnZXhwO1xufVxuIiwgImltcG9ydCBjbG9uZVJlZ2V4cCBmcm9tICdjbG9uZS1yZWdleHAnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleGVjQWxsKHJlZ2V4cCwgc3RyaW5nKSB7XG5cdGxldCBtYXRjaDtcblx0Y29uc3QgbWF0Y2hlcyA9IFtdO1xuXHRjb25zdCBjbG9uZWRSZWdleHAgPSBjbG9uZVJlZ2V4cChyZWdleHAsIHtsYXN0SW5kZXg6IDB9KTtcblx0Y29uc3QgaXNHbG9iYWwgPSBjbG9uZWRSZWdleHAuZ2xvYmFsO1xuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25kLWFzc2lnblxuXHR3aGlsZSAobWF0Y2ggPSBjbG9uZWRSZWdleHAuZXhlYyhzdHJpbmcpKSB7XG5cdFx0bWF0Y2hlcy5wdXNoKHtcblx0XHRcdG1hdGNoOiBtYXRjaFswXSxcblx0XHRcdHN1Yk1hdGNoZXM6IG1hdGNoLnNsaWNlKDEpLFxuXHRcdFx0aW5kZXg6IG1hdGNoLmluZGV4XG5cdFx0fSk7XG5cblx0XHRpZiAoIWlzR2xvYmFsKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbWF0Y2hlcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcnJpZnkodmFsdWUpIHtcblx0aWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiBbdmFsdWVdO1xuXHR9XG5cblx0aWYgKHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIFsuLi52YWx1ZV07XG5cdH1cblxuXHRyZXR1cm4gW3ZhbHVlXTtcbn1cbiIsICJmdW5jdGlvbiBhc3NlcnROdW1iZXIobnVtYmVyKSB7XG5cdGlmICh0eXBlb2YgbnVtYmVyICE9PSAnbnVtYmVyJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbnVtYmVyJyk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlclNvcnRBc2NlbmRpbmcobGVmdCwgcmlnaHQpIHtcblx0YXNzZXJ0TnVtYmVyKGxlZnQpO1xuXHRhc3NlcnROdW1iZXIocmlnaHQpO1xuXG5cdGlmIChOdW1iZXIuaXNOYU4obGVmdCkpIHtcblx0XHRyZXR1cm4gLTE7XG5cdH1cblxuXHRpZiAoTnVtYmVyLmlzTmFOKHJpZ2h0KSkge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0cmV0dXJuIGxlZnQgLSByaWdodDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlclNvcnREZXNjZW5kaW5nKGxlZnQsIHJpZ2h0KSB7XG5cdGFzc2VydE51bWJlcihsZWZ0KTtcblx0YXNzZXJ0TnVtYmVyKHJpZ2h0KTtcblxuXHRpZiAoTnVtYmVyLmlzTmFOKGxlZnQpKSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoTnVtYmVyLmlzTmFOKHJpZ2h0KSkge1xuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdHJldHVybiByaWdodCAtIGxlZnQ7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXJyYXlVbmlxKGFycmF5KSB7XG5cdHJldHVybiBbLi4ubmV3IFNldChhcnJheSldO1xufVxuIiwgImltcG9ydCBhcnJpZnkgZnJvbSAnYXJyaWZ5JztcbmltcG9ydCB7bnVtYmVyU29ydEFzY2VuZGluZ30gZnJvbSAnbnVtLXNvcnQnO1xuaW1wb3J0IGFycmF5VW5pcSBmcm9tICdhcnJheS11bmlxJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3BsaXRBdChzdHJpbmcsIGluZGV4LCB7cmVtb3ZlfSA9IHt9KSB7XG5cdGNvbnN0IHJlc3VsdCA9IFtdO1xuXHRsZXQgbGFzdEluZGV4ID0gMDtcblxuXHRjb25zdCBpbmRpY2VzID0gYXJyYXlVbmlxKFxuXHRcdGFycmlmeShpbmRleClcblx0XHRcdC5tYXAoZWxlbWVudCA9PiB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gZWxlbWVudCA8IDAgPyBzdHJpbmcubGVuZ3RoIC0gMSAtIChlbGVtZW50ICogLTEpIDogZWxlbWVudDtcblx0XHRcdFx0cmV0dXJuIHZhbHVlIDwgMCA/IHZhbHVlICogLTEgOiB2YWx1ZTtcblx0XHRcdH0pXG5cdFx0XHQuc29ydChudW1iZXJTb3J0QXNjZW5kaW5nKVxuXHQpO1xuXG5cdGZvciAobGV0IGluZGV4IG9mIGluZGljZXMpIHtcblx0XHRpbmRleCsrO1xuXG5cdFx0cmVzdWx0LnB1c2goXG5cdFx0XHRzdHJpbmcuc2xpY2UobGFzdEluZGV4LCByZW1vdmUgPyBpbmRleCAtIDEgOiBpbmRleClcblx0XHQpO1xuXG5cdFx0bGFzdEluZGV4ID0gaW5kZXg7XG5cdH1cblxuXHRpZiAobGFzdEluZGV4IDwgc3RyaW5nLmxlbmd0aCkge1xuXHRcdHJlc3VsdC5wdXNoKHN0cmluZy5zbGljZShsYXN0SW5kZXgpKTtcblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXNjYXBlU3RyaW5nUmVnZXhwKHN0cmluZykge1xuXHRpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuXHR9XG5cblx0Ly8gRXNjYXBlIGNoYXJhY3RlcnMgd2l0aCBzcGVjaWFsIG1lYW5pbmcgZWl0aGVyIGluc2lkZSBvciBvdXRzaWRlIGNoYXJhY3RlciBzZXRzLlxuXHQvLyBVc2UgYSBzaW1wbGUgYmFja3NsYXNoIGVzY2FwZSB3aGVuIGl0XHUyMDE5cyBhbHdheXMgdmFsaWQsIGFuZCBhIGBcXHhubmAgZXNjYXBlIHdoZW4gdGhlIHNpbXBsZXIgZm9ybSB3b3VsZCBiZSBkaXNhbGxvd2VkIGJ5IFVuaWNvZGUgcGF0dGVybnNcdTIwMTkgc3RyaWN0ZXIgZ3JhbW1hci5cblx0cmV0dXJuIHN0cmluZ1xuXHRcdC5yZXBsYWNlKC9bfFxcXFx7fSgpW1xcXV4kKyo/Ll0vZywgJ1xcXFwkJicpXG5cdFx0LnJlcGxhY2UoLy0vZywgJ1xcXFx4MmQnKTtcbn1cbiIsICJpbXBvcnQgZXhlY2FsbCBmcm9tICdleGVjYWxsJztcbmltcG9ydCBzcGxpdEF0IGZyb20gJ3NwbGl0LWF0JztcbmltcG9ydCBlc2NhcGVTdHJpbmdSZWdleHAgZnJvbSAnZXNjYXBlLXN0cmluZy1yZWdleHAnO1xuXG4vKlxuQWxnb3JpdGhtOlxuRmluZCBzZXBhcmF0b3JzIHRoYXQgYXJlIG9uIHRoZSBzYW1lIGluZGV4IG9uIGVhY2ggbGluZSwgcmVtb3ZlIGNvbnNlY3V0aXZlIG9uZXMsIHRoZW4gc3BsaXQgb24gdGhvc2UgaW5kZXhlcy4gSXQncyBpbXBvcnRhbnQgdG8gY2hlY2sgZWFjaCBsaW5lIGFzIHlvdSBkb24ndCB3YW50IHRvIHNwbGl0IGluIHRoZSBtaWRkbGUgb2YgYSBjb2x1bW4gcm93IGp1c3QgYmVjYXVzZSBpdCBjb250YWlucyB0aGUgc2VwYXJhdG9yLlxuKi9cblxuY29uc3QgY291bnRTZXBhcmF0b3JzID0gKGxpbmVzLCBzZXBhcmF0b3IgPSAnICcpID0+IHtcblx0Y29uc3QgY291bnRzID0gW107XG5cdGNvbnN0IHNlcGFyYXRvclJlZ2V4ID0gbmV3IFJlZ0V4cChlc2NhcGVTdHJpbmdSZWdleHAoc2VwYXJhdG9yKSwgJ2cnKTtcblx0Y29uc3QgaGVhZGVyTGVuZ3RoID0gKGxpbmVzWzBdIHx8ICcnKS5sZW5ndGg7XG5cblx0Zm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xuXHRcdC8vIEVuc3VyZSBsaW5lcyBhcmUgYXMgbG9uZyBhcyB0aGUgaGVhZGVyXG5cdFx0Y29uc3QgcGFkQW1vdW50ID0gTWF0aC5jZWlsKE1hdGgubWF4KGhlYWRlckxlbmd0aCAtIGxpbmUubGVuZ3RoLCAwKSAvIHNlcGFyYXRvci5sZW5ndGgpO1xuXHRcdGxpbmUgKz0gc2VwYXJhdG9yLnJlcGVhdChwYWRBbW91bnQpO1xuXG5cdFx0Zm9yIChjb25zdCB7aW5kZXg6IGNvbHVtbn0gb2YgZXhlY2FsbChzZXBhcmF0b3JSZWdleCwgbGluZSkpIHtcblx0XHRcdGNvdW50c1tjb2x1bW5dID0gdHlwZW9mIGNvdW50c1tjb2x1bW5dID09PSAnbnVtYmVyJyA/IGNvdW50c1tjb2x1bW5dICsgMSA6IDE7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNvdW50cztcbn07XG5cbmNvbnN0IGdldFNwbGl0cyA9IChsaW5lcywgc2VwYXJhdG9yKSA9PiB7XG5cdGNvbnN0IGNvdW50cyA9IGNvdW50U2VwYXJhdG9ycyhsaW5lcywgc2VwYXJhdG9yKTtcblx0Y29uc3Qgc3BsaXRzID0gW107XG5cdGxldCBjb25zZWN1dGl2ZSA9IGZhbHNlO1xuXG5cdGZvciAoY29uc3QgW2luZGV4LCBjb3VudF0gb2YgY291bnRzLmVudHJpZXMoKSkge1xuXHRcdGlmIChjb3VudCAhPT0gbGluZXMubGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmVnYXRlZC1jb25kaXRpb25cblx0XHRcdGNvbnNlY3V0aXZlID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChpbmRleCAhPT0gMCAmJiAhY29uc2VjdXRpdmUpIHtcblx0XHRcdFx0c3BsaXRzLnB1c2goaW5kZXgpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zZWN1dGl2ZSA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHNwbGl0cztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlQ29sdW1ucyhpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG5cdGNvbnN0IGxpbmVzID0gaW5wdXQucmVwbGFjZSgvXlxccypcXG58XFxzKyQvZywgJycpLnNwbGl0KCdcXG4nKTtcblx0bGV0IHNwbGl0cyA9IGdldFNwbGl0cyhsaW5lcywgb3B0aW9ucy5zZXBhcmF0b3IpO1xuXHRjb25zdCB7dHJhbnNmb3JtfSA9IG9wdGlvbnM7XG5cdGNvbnN0IHJvd3MgPSBbXTtcblx0bGV0IGl0ZW1zO1xuXG5cdGxldCB7aGVhZGVyc30gPSBvcHRpb25zO1xuXHRpZiAoIWhlYWRlcnMpIHtcblx0XHRoZWFkZXJzID0gW107XG5cdFx0aXRlbXMgPSBzcGxpdEF0KGxpbmVzWzBdLCBzcGxpdHMsIHtyZW1vdmU6IHRydWV9KTtcblxuXHRcdGZvciAobGV0IFtpbmRleCwgaXRlbV0gb2YgaXRlbXMuZW50cmllcygpKSB7XG5cdFx0XHRpdGVtID0gaXRlbS50cmltKCk7XG5cdFx0XHRpZiAoaXRlbSkge1xuXHRcdFx0XHRoZWFkZXJzLnB1c2goaXRlbSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzcGxpdHNbaW5kZXggLSAxXSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c3BsaXRzID0gc3BsaXRzLmZpbHRlcihCb29sZWFuKTtcblx0fVxuXG5cdGZvciAoY29uc3QgW2luZGV4LCBsaW5lXSBvZiBsaW5lcy5zbGljZSgxKS5lbnRyaWVzKCkpIHtcblx0XHRpdGVtcyA9IHNwbGl0QXQobGluZSwgc3BsaXRzLCB7cmVtb3ZlOiB0cnVlfSk7XG5cblx0XHRjb25zdCByb3cgPSB7fTtcblx0XHRmb3IgKGNvbnN0IFtpbmRleDIsIGhlYWRlcl0gb2YgaGVhZGVycy5lbnRyaWVzKCkpIHtcblx0XHRcdGNvbnN0IGl0ZW0gPSAoaXRlbXNbaW5kZXgyXSB8fCAnJykudHJpbSgpO1xuXHRcdFx0cm93W2hlYWRlcl0gPSB0cmFuc2Zvcm0gPyB0cmFuc2Zvcm0oaXRlbSwgaGVhZGVyLCBpbmRleDIsIGluZGV4KSA6IGl0ZW07XG5cdFx0fVxuXG5cdFx0cm93cy5wdXNoKHJvdyk7XG5cdH1cblxuXHRyZXR1cm4gcm93cztcbn1cbiJdLAogICJtYXBwaW5ncyI6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QixDQUFDO0FBRTVCLGVBQWEsV0FBVztBQUFBLElBQ3RCLFdBQVcsQ0FBQyxNQUFNLFFBQVEsYUFBYSxhQUFhO0FBQ2xELFVBQUksV0FBVyxLQUFLLFNBQVMsS0FBSztBQUNoQztBQUFBLE1BQ0Y7QUFFQSxXQUFLLEtBQUs7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0YsQ0FBQztBQUVELFFBQU0scUJBQXFCLEtBQUssT0FBTyxDQUFDLEtBQUssVUFBVTtBQUNyRCxRQUFJLE1BQU0sV0FBVyxXQUFXO0FBQzlCLFVBQUksTUFBTSxZQUFZO0FBQUEsUUFDcEIsR0FBRyxJQUFJLE1BQU07QUFBQSxRQUNiLE1BQU0sTUFBTTtBQUFBLE1BQ2Q7QUFBQSxJQUNGO0FBRUEsUUFBSSxNQUFNLFdBQVcsWUFBWTtBQUMvQixVQUFJLE1BQU0sWUFBWTtBQUFBLFFBQ3BCLEdBQUcsSUFBSSxNQUFNO0FBQUEsUUFDYixTQUFTLE1BQU07QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFFQSxXQUFPO0FBQUEsRUFDVCxHQUFHLENBQUMsQ0FBcUM7QUFFekMsU0FBTyxPQUFPLE9BQU8sa0JBQWtCLEVBQUUsT0FBTyxDQUFDLFlBQTJCLFVBQVUsT0FBTztBQUMvRjsiLAogICJuYW1lcyI6IFsiYXJncyIsICJvcHRpb25zIiwgIm1vZHVsZSIsICJkYXRhIiwgIm9wdGlvbnMiLCAibW9kdWxlIiwgIm1vZHVsZSIsICJtb2R1bGUiLCAibW9kdWxlIiwgInJlcyIsICJtb2R1bGUiLCAicmVxdWlyZV9saWIiLCAibW9kdWxlIiwgImlzRG9tYWluT3JTdWJkb21haW4iLCAiYWJvcnQiLCAiYWJvcnRBbmRGaW5hbGl6ZSIsICJtb2R1bGUiLCAidXJsIiwgIm9wdGlvbnMiLCAibW9kdWxlIiwgIm1vZHVsZSIsICJwcm9jZXNzIiwgInVubG9hZCIsICJlbWl0IiwgImxvYWQiLCAicHJvY2Vzc1JlYWxseUV4aXQiLCAicHJvY2Vzc0VtaXQiLCAidXNlRXhlYyIsICJpbnB1dCIsICJjb21tYW5kIiwgIm9wdGlvbnMiLCAicXVlcnkiLCAic3Bhd25lZCIsICJzcGF3bmVkUHJvbWlzZSIsICJGb3JtVmFsaWRhdGlvbiIsICJ2YWx1ZXMiLCAidmFsaWRhdGlvbiIsICJlcnJvcnMiLCAidmFsdWUiLCAiaW5pdGlhbFZhbHVlcyIsICJleHBvcnRzIiwgImV4cG9ydHMiLCAiY2xvbmVkUmVnZXhwIiwgImNsb25lZFJlZ2V4cCIsICJpbmRleCJdCn0K
