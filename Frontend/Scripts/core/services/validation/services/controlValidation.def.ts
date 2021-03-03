namespace Services {
    export interface IValidationResult {
        status: ValidationStatus,
        data?: any
    }

    export interface IControlValidationResult {
        result: boolean;
        warning?: boolean;
        message?: string;
        data?: any;
    }

    export interface IControlValidationFunc<T, TControl extends UI.IInputControl<T>> {
        (control: TControl): Promise<Services.IControlValidationResult>
    }

    export interface IControlValidationInitData {
        validateOnChange: boolean;
    }

    export interface IControlValidation {
        add<T, TControl extends UI.IInputControl<T>>(control: TControl, validatorName: string, validator: IControlValidationFunc<T, TControl>): void;
        validate(): Promise<UI.IValidationError[]>;
        validateControl(control: UI.IInputControl<any>, targetValidatorNames?: string[]): Promise<any>;
        clearValidation(control: UI.IInputControl<any>): void;
    }

    export interface IControlValidationFactory {
        init(initData: IControlValidationInitData): IControlValidation;
    }
}