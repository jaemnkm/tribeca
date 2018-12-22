"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
class StandaloneHttpPublisher {
    constructor(_wrapped, route, _httpApp, _persister) {
        this._wrapped = _wrapped;
        this.route = route;
        this._httpApp = _httpApp;
        this._persister = _persister;
        this.publish = this._wrapped.publish;
        this.registerSnapshot = (generator) => {
            return this._wrapped.registerSnapshot(generator);
        };
        _httpApp.get("/data/" + route, (req, res) => {
            var getParameter = (pName, cvt) => {
                var rawMax = req.param(pName, null);
                return (rawMax === null ? null : cvt(rawMax));
            };
            var max = getParameter("max", r => parseInt(r));
            var startTime = getParameter("start_time", r => moment(r));
            var handler = (d) => {
                if (max !== null && max <= d.length)
                    d = _.takeRight(d, max);
                res.json(d);
            };
            const selector = startTime == null
                ? null
                : { time: { $gte: startTime.toDate() } };
            _persister.loadAll(max, selector).then(handler);
        });
    }
}
exports.StandaloneHttpPublisher = StandaloneHttpPublisher;
//# sourceMappingURL=web.js.map