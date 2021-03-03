namespace Services.Helpers {
    export interface IViewHelper {
        open(data: Services.IModalHelperInitData): Promise<IModalHelperResult<any, any>>;
        initCloseButton($container: JQuery, modalHelper): void;
    }
}