namespace Api.Home.Models {
    export interface ICategoriesMenuItem {
        title: string;
        url: string;
        iconUrl: string;
        subItems: ICategoriesMenuItem[];
    }
}