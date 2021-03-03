namespace UI {
    export interface IConditionPredicate {
        id: string | number;
        name: string;
        initControl?(container: IContainer): Promise<IInputControl<any>>;
        type?: InputType;
        options?: any
    }

    export interface IConditionOperand {
        id: string | number;
        name: string;
        predicates: IConditionPredicate[]
    }

    export interface IConditionsData {
        conditionType: ConditionType;
        conditions?: IConditionsData[]
        isGroup?: boolean;
        predicateValue?: any;
        predicateValueControl?: IInputControl<any>
        predicateId?: string | number;
        operandId?: string | number;
    }

    export interface IConditionsBuilderInitData {
        conditionsData: IConditionsData;
        operands: IConditionOperand[]
    }

    export interface IConditionsBuilder {
        remove(): void;
        getConditionsData(): IConditionsData;
    }

    export interface IConditionsBuilderFactory {
        init(container: IContainer, initData: IConditionsBuilderInitData): Promise<IConditionsBuilder>;
    }
}