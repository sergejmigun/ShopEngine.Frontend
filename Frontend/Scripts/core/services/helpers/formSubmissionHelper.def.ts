namespace Services.Helpers {
    export interface IFormSubmissionData {
        id: string | number;
        createAction: (data: any) => Promise<any>;
        editAction: (data: any) => Promise<any>;
        createActionNotification?: string;
        editActionNotification?: string;
    }

    export interface IFormSubmissionHelper {
        submitForm: (form: UI.IForm, data: IFormSubmissionData) => Promise<{ status: Components.IFormSubmissionStatus, data: Components.IIdentityResponseData }>;
    }
}