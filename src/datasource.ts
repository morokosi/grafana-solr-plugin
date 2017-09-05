import * as _ from "lodash";
import moment from "moment";

interface ISolrResponse {
    docs: any[];
    facets: any;
}

interface IGrafanaTimeserie {
    datapoints: number[][];
    target: string;
}

interface ITarget {
    hide: boolean;
    refId: any;
    target: any;
    type: string;
}

export class SolrDatasource {
    public headers: any;
    public name: string;
    public type: string;
    public url: string;
    public withCredentials: any;

    /** @ngInject */
    constructor(instanceSettings,
                private $q,
                private backendSrv,
                private templateSrv,
                private timeSrv) {
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.withCredentials = instanceSettings.withCredentials;
        if (typeof instanceSettings.basicAuth === "string" && instanceSettings.basicAuth.length > 0) {
            this.headers.Authorization = instanceSettings.basicAuth;
        }
    }

    public query(options) {
        console.log(options);
        const start = moment(options.range.from).toISOString();
        const end = moment(options.range.to).toISOString();
        return this.$q.all(
            _.map(options.targets,
                  (target) => this._queryTarget(target, {start, end})))
            .then(targets => {
                const grafanaTimeseries: IGrafanaTimeserie[] = targets;
                return {data: grafanaTimeseries};
            });
    }

    public _queryTarget(target, {start, end}) {
        const collection = "gettingstarted";
        const gap = "+1MINUTE";
        const facet = {};
        facet[target.facet] = target.facet;
        const query = {
            query: target.query,
            limit: 0,
            facet: {
                result: {
                    type: "range",
                    field: target.timestampField,
                    start, end, gap,
                    facet
                }
            }
        };
        return this.doRequest({
            data: query,
            method: "POST",
            url: `${this.url}/${collection}/query`,
        }).then((response) => {
            const solrResp: ISolrResponse = response.data;
            const tmp = _.map(solrResp.facets.result.buckets, (bucket) => {
                return [
                    bucket[target.facet],
                    moment(bucket["val"]).valueOf()
                ];
            });
            return {datapoints: tmp, target: target.facet};
        });

    }

    public testDatasource() {
        return this.doRequest({
            method: "GET",
            url: this.url + "/",
        }).then((response) => {
            if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
            }
        });
    }

    public annotationQuery(options) {
        const annotation = options.annotation;
        const baseQuery = this.templateSrv.replace(annotation.query, {}, "glob") || "*:*";
        const timeField = "timestamp_dt";
        const collection = annotation.collection || "annotations";
        const tagsField = annotation.tagsField || "tags";
        const titleField = annotation.titleField || "desc";
        const textField = annotation.textField || null;
        const start = options.range.from.toISOString();
        const end = options.range.to.toISOString();
        const query = {
            query: `${baseQuery} AND ${timeField}:[${start} TO ${end}]`,
            limit: 10
        };

        return this.doRequest({
            data: query,
            method: "POST",
            url: `${this.url}/${collection}/query?defType=edismax`,
        }).then((result) => {
            return _.map(result.data.response.docs, (doc) => {
                return {
                    annotation: annotation,
                    time: moment(doc[timeField]).valueOf(),
                    title: doc[titleField],
                    tags: doc[tagsField],
                    text: doc[textField]
                };
            });
        });
    }
/*
    metricFindQuery(query) {
        let interpolated = {
            target: this.templateSrv.replace(query, null, 'regex')
        };

        return this.doRequest({
            url: this.url + '/search',
            data: interpolated,
            method: 'POST',
        }).then(this.mapToTextValue);
    }

    mapToTextValue(result) {
        return _.map(result.data, (d, i) => {
            if (d && d.text && d.value) {
                return { text: d.text, value: d.value };
            } else if (_.isObject(d)) {
                return { text: d, value: i};
            }
            return { text: d, value: d };
        });
    }
*/
    public doRequest(options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;

        return this.backendSrv.datasourceRequest(options);
    }
}
