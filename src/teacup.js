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
        let xhr = new XMLHttpRequest()
        xhr.open('GET', encodeURI(url), true);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                success(xhr.responseText);
            } else {
                error(e);
            }
        }
        xhr.timeout = 4500;
        xhr.ontimeout = (e) => {
            error(e);
        };
        xhr.onerror = (e) => {
            error(e);
        };
        xhr.send();
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
        document.body.appendChild(script);
    };

    let loadCssFallback = (url, name) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.type = 'text/css';
        document.head.appendChild(link);
    };

    let importStyle = (name, code) => {
        document.getElementById(name).appendChild(document.createTextNode(code));
    }

    teacup.css = (name, url, version) => {
        try {
            if (getLS(`${teacup.prefix}:css:${name}`) && getLS(`${teacup.prefix}:css:${name}`).indexOf(`/*${url}:${version}*/`) !== -1) {
                importStyle(name, getLS(`${teacup.prefix}:css:${name}`))
            } else {
                removeLS(`${teacup.prefix}:css:${name}`);
                get(url, (resp) => {
                        importStyle(name, resp);
                        setLS(`${teacup.prefix}:css:${name}`, resp);
                    },
                    (err) => {
                        loadCssFallback(url, name);
                    }
                )
            }
        } catch (err) {
            loadCssFallback(url, name);
        }
    }
})();