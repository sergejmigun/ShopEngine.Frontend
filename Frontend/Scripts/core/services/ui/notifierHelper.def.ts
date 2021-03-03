namespace Services.Helpers {
    export interface INotifierHelper {
        successfullyCreated(itemName): void;
        successfullyUpdated(itemName): void;
        successfullyDeleted(itemName): void;
    }

    export interface INotifierHelperFactory {
        init(): INotifierHelper;
    }
}