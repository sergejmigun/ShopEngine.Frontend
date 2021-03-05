namespace Api.Layout.Models {
    export interface ICategoriesMenuItem {
        title: string;
        url: string;
        iconUrl: string;
        subItems: ICategoriesMenuItem[];
    }
}