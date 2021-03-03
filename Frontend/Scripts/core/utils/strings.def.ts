namespace Utils {
    export interface IStrings {
        join<T>(array: Array<T>, separator?: string, selector?: (item: T) => string): string;
        format(strFormat: string, ...args: any[]): string;
        formatTags(str, formatters): string;
        splice(currentStr: string, startIndex: number, removeLength: number, insertedStr: string): string;
        trim(str): string;
        capitalizeFirstLetter(str: string): string;
        isNullOrWhiteSpace(str: string): boolean;
        concat(strFormat: string): string;
        formatFileSize(fileSize: number): string;
    }
}