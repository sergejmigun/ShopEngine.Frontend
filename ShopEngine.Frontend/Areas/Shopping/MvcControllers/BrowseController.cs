using System.Collections.Generic;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Common;
using ShopEngine.Frontend.Areas.Shopping.Models;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Areas.Shopping.MvcControllers
{
    public class BrowseController : Controller
    {
        [HttpGet]
        public ActionResult Category(int? categoryId)
        {
            var vm = new BrowseByCategoryViewModel();

            LayoutHelper.FillLayoutModel(vm);

            vm.SiteMap = new List<LinkViewModel>
            {
                new LinkViewModel{ Link = "#",  Text = "First" },
                new LinkViewModel{ Link = "#",  Text = "Second" },
                new LinkViewModel{ Link = "#",  Text = "Last" }
            };

            vm.Category = new CategoryModel
            {
                 Id = 1,
                 Image = "",
                 Link = "",
                 Name = "Mobile Phones"
            };

            vm.SubTitle = vm.Category.Name;

            vm.SubCategories = new List<CategoryModel>
            {
                new CategoryModel
                {
                    Id = 1,
                    Image = "",
                    Link = "",
                    Name = ""
                },
                new CategoryModel
                {
                    Id = 1,
                    Image = "",
                    Link = "",
                    Name = ""
                },
                new CategoryModel
                {
                    Id = 1,
                    Image = "",
                    Link = "",
                    Name = ""
                },
                new CategoryModel
                {
                    Id = 1,
                    Image = "",
                    Link = "",
                    Name = ""
                }
            };

            vm.PriceFilter = new PriceFilter { From = 1, To = 1000, CurrencySign = "$" };

            vm.BrandFilter = new BrandFilter
            {
                 Options = new List<ProductSpecificationFilterOption>
                 {
                     new ProductSpecificationFilterOption { Count = 10, Id = 1,  Title = "Apple" },
                     new ProductSpecificationFilterOption { Count = 34, Id = 2,  Title = "Samsung" },
                     new ProductSpecificationFilterOption { Count = 44, Id = 3,  Title = "Xiaomi" },
                     new ProductSpecificationFilterOption { Count = 654, Id = 4,  Title = "Philips" }
                 }
            };

            vm.Filters = new List<ProductSpecificationFilter>
            {
                 new ProductSpecificationFilter
                 {
                      Id = 1,
                      Title = "Weight",
                      Options = new List<ProductSpecificationFilterOption>
                      {
                          new ProductSpecificationFilterOption { Count = 0, Id = 1,  Title = "0-50g" },
                          new ProductSpecificationFilterOption { Count = 22, Id = 2,  Title = "50-150g" },
                          new ProductSpecificationFilterOption { Count = 1, Id = 3,  Title = "150-550g" },
                          new ProductSpecificationFilterOption { Count = 234, Id = 4,  Title = "550g +" }
                      }
                 },
                 new ProductSpecificationFilter
                 {
                      Id = 3,
                      Title = "Display size",
                      Options = new List<ProductSpecificationFilterOption>
                      {
                          new ProductSpecificationFilterOption { Count = 0, Id = 1,  Title = "11'" },
                          new ProductSpecificationFilterOption { Count = 2, Id = 2,  Title = "12'" },
                          new ProductSpecificationFilterOption { Count = 1, Id = 3,  Title = "13'" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "14'" }
                      }
                 },
                 new ProductSpecificationFilter
                 {
                      Id = 4,
                      Title = "Color",
                      Options = new List<ProductSpecificationFilterOption>
                      {
                          new ProductSpecificationFilterOption { Count = 0, Id = 1,  Title = "Red" },
                          new ProductSpecificationFilterOption { Count = 2, Id = 2,  Title = "Blue" },
                          new ProductSpecificationFilterOption { Count = 1, Id = 3,  Title = "Black" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "White" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Orange" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Yellow" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Gray" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Green" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Violet" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Mint" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Brown" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Lavender" },
                          new ProductSpecificationFilterOption { Count = 24, Id = 4,  Title = "Sky" },
                      }
                 }
            };


            return View(vm);
        }
    }
}