namespace Services.Helpers {
    export interface IImageUploaderHelper {
        init(container: IContainer, initData: UI.IImageUploaderInitData): Promise<UI.IImageUploader>;
        serializeSingle(value): any;
        serializeMultiple(value: any[]): any;
    }
}