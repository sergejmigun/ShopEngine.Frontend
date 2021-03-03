namespace Components.Common {
    export interface IContentVariablesViewModel {
        variables: any
    }

    export interface IContentVariablesView extends ITemplate<IContentVariablesViewModel> {
        showVariables(variables): void;
    }

    export interface IContentVariablesViewFactory extends Components.ITemplateFactory<IContentVariablesViewModel, IContentVariablesView> {
    }
}