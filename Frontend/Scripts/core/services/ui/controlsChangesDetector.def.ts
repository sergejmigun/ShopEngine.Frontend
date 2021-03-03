namespace Services {
    export interface IControlsChangesDetector {
        addControl(control: UI.IInputControl<any>): void;
        update(control?: UI.IInputControl<any>): void;
        hasChanges(): boolean;
    }

    export interface IControlsChangesDetectorFactory {
        init(): IControlsChangesDetector;
    }
}