YUI.add('yql', function(Y) {
    //Global storage for the callbacks
    if (!YUI.yql) {
        YUI.yql = {};
    }

    var BASE_URL = 'http:/'+'/query.yahooapis.com/v1/public/yql?',
    yql = function (sql, callback, params) {
        yql.superclass.constructor.apply(this);
        this._query(sql, callback, params);
    };

    Y.extend(yql, Y.Event.Target, {
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
        },
        _query: function(sql, callback, params) {
            var st = Y.stamp({}), qs = '', i, url;
            //Must replace the dashes with underscrores
            st = st.replace(/-/g, '_');
            
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

    Y.yql = yql;

}, '1.0', { requires: ['get', 'event-custom'], skinnable:false});
