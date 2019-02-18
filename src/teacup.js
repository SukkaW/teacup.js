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



    window.teacup = {
        prefix: 'teacup:'
    };

    teacup.clean = () => {
        try {
            let keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                keys.push(LS.key(i));
            };
            keys.forEach((key) => {
                if (key.indexOf(teacup.prefix) !== -1) {
                    removeLS(key);
                }
            })
        } catch (err) {
        }
    };
})();