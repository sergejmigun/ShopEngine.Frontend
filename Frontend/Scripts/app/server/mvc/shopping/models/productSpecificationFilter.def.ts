namespace Api.Shopping.Models {
    export interface IProductSpecificationFilter {
        id: number;
        title: string;
        options: IProductSpecificationFilterOption[];
    }
}