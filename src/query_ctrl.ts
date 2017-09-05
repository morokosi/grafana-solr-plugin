import "./css/query-editor.css!";
import {QueryCtrl} from "./sdk/query_ctrl";

export class SolrDatasourceQueryCtrl extends QueryCtrl {
    public static templateUrl = "partials/query.editor.html";
    public scope: any;

    constructor($scope, $injector)  {
        super($scope, $injector);

        this.scope = $scope;
    }

    public getOptions(query: string) {
        // return this.datasource.metricFindQuery(query || '');
        return [];
    }

    public toggleEditorMode() {
        this.target.rawQuery = !this.target.rawQuery;
    }

    public onChangeInternal() {
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
}
