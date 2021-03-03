namespace Components.Common {
    export interface IContentVariableModel {
        name: string;
        description: string;
    }

    export interface IContentVariable extends ITemplate<IContentVariableModel> {
    }

    export interface IContentVariableFactory extends Components.ITemplateFactory<IContentVariableModel, IContentVariable> {
    }
}