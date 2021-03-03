namespace Settings.Services {
    export interface ILocalizationManagementService {
        findLanguages(filterData): Promise<any>;
        getLanguage(shortName: string): Promise<any>;
        createLanguage(language): Promise<any>;
        updateLanguage(language): Promise<any>;
        deleteLanguage(shortName: string): Promise<any>;
    }
}