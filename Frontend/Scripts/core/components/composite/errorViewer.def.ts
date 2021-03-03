namespace Components.Common {
    export interface IErrorViewData {
        exceptionMessage: string;
        exceptionType: string;
        stackTrace: string;
        innerException?: IErrorViewData;
    }

    export interface IErrorViewerModel {
        errorData: IErrorViewData;
    }

    export interface IErrorViewer extends ITemplate<IErrorViewerModel> {
    }

    export interface IErrorViewerFactory extends Components.ITemplateFactory<IErrorViewerModel, IErrorViewer> {
    }
}