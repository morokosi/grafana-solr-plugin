import * as _ from "lodash";

export class QueryCtrl {
    public target: any;
    public datasource: any;
    public panelCtrl: any;
    public panel: any;
    public hasRawMode: boolean;
    public error: string;

    constructor(public $scope, private $injector) {
        this.panel = this.panelCtrl.panel;
    }

    public refresh() {
        this.panelCtrl.refresh();
    }

}
