YUI.add('yql', function(Y) {
    //Global storage for the callbacks
    if (!YUI.yql) {
        YUI.yql = {};
    }
    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @module yql
     */     
    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @class yql
     * @extends Event.Target
     * @constructor
     * @param {String} sql The SQL statement to execute
     * @param {Function} callback The callback to execute after the query (optional).
     * @param {Object} params An object literal of extra parameters to pass along (optional).
     */
    var BASE_URL = 'http:/'+'/query.yahooapis.com/v1/public/yql?',
    yql = function (sql, callback, params) {
        yql.superclass.constructor.apply(this);
        this._query(sql, callback, params);
    };

    Y.extend(yql, Y.Event.Target, {
        /**
        * @private
        * @property _cb
        * @description The callback method
        */ 
        _cb: null,
        /**
        * @private
        * @property _stamp
        * @description The method name on the Global YUI object we use as the callback.
        */ 
        _stamp: null,
        /**
        * @private
        * @method _receiver
        * @description The global callback that get's called from Get.
        * @param {Object} q The JSON object from YQL.
        */
        _receiver: function(q) {
            if (q.query) {
                this.fire('query', q.query);
            }
            if (q.error) {
                this.fire('error', q.error);
            }
            if (this._cb) {
                this._cb(q);
            }
            delete YUI.yql[st];
        },
        /**
        * @private
        * @method _query
        * @description Builds the query and fire the Get call.
        * @param {String} sql The SQL statement to execute
        * @param {Function} callback The callback to execute after the query (optional).
        * @param {Object} params An object literal of extra parameters to pass along (optional).
        * @return Self
        */
        _query: function(sql, callback, params) {
            var st = Y.stamp({}), qs = '', url;
            //Must replace the dashes with underscrores
            st = st.replace(/-/g, '_');

            this._stamp = st;
            
            this._cb = callback;

            YUI.yql[st] = Y.bind(this._receiver, this);

            if (!params) {
                params = {};
            }
            params.q = sql;
            params.format = 'json';
            params.callback = "YUI.yql." + st;
            if (!params.env) {
                params.env = 'http:/'+'/datatables.org/alltables.env';
            }

            Y.each(params, function(v, k) {
                qs += k + '=' + encodeURIComponent(v) + '&';
            });

            url = BASE_URL + qs;
            Y.Get.script(url, { autopurge: true });
            return this;
        }
    });
    /**
    * @event query
    * @description Fires when the Query returns.
    * @type {Event.Custom}
    */

    /**
    * @event error
    * @description Fires when an error occurs.
    * @type {Event.Custom}
    */

    Y.yql = yql;

}, '1.0', { requires: ['get', 'event-custom'], skinnable:false});
