﻿namespace Layout.Services {
    export interface ILayoutServicesService {
        search(query: string): Promise<any>;
        getCategoriesMenu(): Promise<Api.Layout.Models.ICategoriesMenu>;
    }
}