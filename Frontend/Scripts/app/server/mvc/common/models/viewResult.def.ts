namespace Api.Common.Models {
    export interface IViewResult {
        masterName: string;
        model: any;
        tempData: Common.Models.IKeyValuePair[];
        view: Common.Models.IIView;
        viewBag: any;
        viewData: Common.Models.IKeyValuePair[];
        viewEngineCollection: Common.Models.IIViewEngine[];
        viewName: string;
    }
}