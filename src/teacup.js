(() => {
    /*
     * check if the argument is an instance of Object
     */
    let isObject = (obj) => {
        return Object.prototype.toString.call(obj) === '[object Object]'
    }

    /*
     * check if the argument is an instance of String
     */
    let isString = (str) => {
        return Object.prototype.toString.call(str) === '[object String]'
    }

    /*
     * check if the argument is an instance of Array
     */
    let isArray = (arr) => {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }

    /*
     * check if a given path is a valid url
     */
    let isUrl = (path) => {
        return /^(https?|\/\/)/.test(path)
    }

    const LS = localStorage;

    /*
     * Add value to localStorage
     */
    let setLS = (key, val) => {
        try {
            LS.setItem(key, val);
        } catch (err) {
        }
    };

    /*
     * get value from localStorage
     */
    let getLS = (key) => {
        let val = '';
        try {
            val = LS.getItem(key);
        } catch (e) {
            val = '';
        }
        return val;
    };

    /*
     * remove an item from localStorage
     */
    let removeLS = (key) => {
        try {
            LS.removeItem(key);
        } catch (err) {
        }
    };

    /**
     * get - 封装 XHR GET
     *
     * @param {string} url
     * @param {string} timeout
     * @param {function} success
     * @param {function} error
     *
     * Example:
        get(
            'http://localhost:3000/getData',
            4000,
            (res) => {
                console.log(res)
            },
            () => {}
        )
     */
    const get = (url, success, error) => {
        try {
            let xhr = new XMLHttpRequest()
            xhr.open('GET', encodeURI(url), true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        if (xhr.response != '') {
                            success(xhr.responseText);
                            return;
                        }
                    };
                    error();
                }
            };
            xhr.timeout = 6000;
            xhr.send(null);
        } catch (err) {
            error(err);
        }
    }

    window.teacup = {
        prefix: 'teacup'
    };

    teacup.clean = () => {
        try {
            let keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                keys.push(LS.key(i));
            };
            keys.forEach((key) => {
                if (key.indexOf(`${teacup.prefix}:`) !== -1) {
                    removeLS(key);
                }
            })
        } catch (err) {
        }
    };

    let loadJsFallback = (url, name) => {
        let script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        document.head.appendChild(script);
    };

    let loadCssFallback = (url, name) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.type = 'text/css';
        let root = document.getElementsByTagName('script')[0];
        root.parentNode.insertBefore(style, link)
    };

    let importStyle = (name, code) => {
        let style = document.createElement('style');
        style.id = name;
        style.appendChild(document.createTextNode(code));
        let root = document.getElementsByTagName('script')[0];
        root.parentNode.insertBefore(style, root);
    }

    let importScript = (name, code) => {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.appendChild(document.createTextNode(code));
        document.head.appendChild(script);
    }

    teacup.css = (name, url, version) => {
        try {
            version = version || '';
            if (getLS(`${teacup.prefix}:css:${name}`) && getLS(`${teacup.prefix}:css:${name}`).indexOf(`/*${url}:${version}*/`) !== -1) {
                importStyle(name, getLS(`${teacup.prefix}:css:${name}`))
            } else {
                removeLS(`${teacup.prefix}:css:${name}`);
                get(url, (resp) => {
                        importStyle(name, resp);
                        setLS(`${teacup.prefix}:css:${name}`, `/*${url}:${version}*/${resp}`);
                    },
                    (err) => {
                        loadCssFallback(url, name);
                    }
                )
            }
        } catch (err) {
            loadCssFallback(url, name);
        }
    };

    teacup.js = (name, url, version) => {
        try {
            version = version || '';
            if (getLS(`${teacup.prefix}:js:${name}`) && getLS(`${teacup.prefix}:js:${name}`).indexOf(`/*${url}:${version}*/`) !== -1) {
                importScript(name, getLS(`${teacup.prefix}:js:${name}`))
            } else {
                removeLS(`${teacup.prefix}:js:${name}`);
                get(url, (resp) => {
                        importScript(name, resp);
                        setLS(`${teacup.prefix}:js:${name}`, `/*${url}:${version}*/${resp}`);
                    },
                    (err) => {
                        loadJsFallback(url, name);
                    }
                )
            }
        } catch (err) {
            loadJsFallback(url, name);
        }
    }
})();