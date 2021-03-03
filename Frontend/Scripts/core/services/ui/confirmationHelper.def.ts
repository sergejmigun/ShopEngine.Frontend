namespace Services {
    export interface IConfirmationHelper {
        confirmDeletion(itemName: string): Promise<any>;
    }
}