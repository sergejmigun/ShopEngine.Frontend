namespace UI {
    export interface ICaptchaInitData extends IInputControlInitData<string> {
    }

    export interface ICaptcha extends IInputControl<string> {
    }

    export interface ICaptchaFactory extends IInputControlFactory<string, ICaptcha, ICaptchaInitData> {
    }
}