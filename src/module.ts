import {SolrDatasource} from "./datasource";
import {SolrDatasourceQueryCtrl} from "./query_ctrl";

class SolrConfigCtrl {
    public static templateUrl = "partials/config.html";
}

class SolrQueryOptionsCtrl {
    public static templateUrl = "partials/query.options.html";
}

class SolrAnnotationsQueryCtrl {
    public static templateUrl = "partials/annotations.editor.html";
}

export {
    SolrDatasource as Datasource,
    SolrDatasourceQueryCtrl as QueryCtrl,
    SolrConfigCtrl as ConfigCtrl,
    SolrQueryOptionsCtrl as QueryOptionsCtrl,
    SolrAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
