var Services;
(function (Services) {
    let PageMode;
    (function (PageMode) {
        PageMode["create"] = "create";
        PageMode["edit"] = "edit";
        PageMode["view"] = "view";
    })(PageMode = Services.PageMode || (Services.PageMode = {}));
    let ValidationStatus;
    (function (ValidationStatus) {
        ValidationStatus["Success"] = "success";
        ValidationStatus["Fail"] = "fail";
        ValidationStatus["Warning"] = "warning";
    })(ValidationStatus = Services.ValidationStatus || (Services.ValidationStatus = {}));
})(Services || (Services = {}));
