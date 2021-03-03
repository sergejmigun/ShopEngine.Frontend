app.registerComponent('imageUploaderHelper', 'Services', [
    'UI.imageUploader',
    'Utils.objects',
    'Collections',
    'Services.mvcControllers.other.help',
    function (imageUploader: UI.IImageUploaderFactory,
        objects: Utils.IObjects,
        collections: ICollections,
        helpController) {
    'use strict';

    return {
        init: function (container, initData) {
            var defaultInitData = {
                uploadUrl: helpController.upload().url,
                maxUploads: 1
            };

            return imageUploader.init(container, objects.extend(defaultInitData, initData, false));
        },
        serializeSingle: function (value) {
            if (!objects.isEmptyArray(value)) {
                return value[0].fileName;
            }

            return null;
        },
        serializeMultiple: function (value) {
            if (!objects.isEmptyArray(value)) {
                return collections.from(value).select(function (valueItem) {
                    return valueItem.fileName;
                }).toArray();
            }

            return null;
        }
    } as Services.Helpers.IImageUploaderHelper;
}]);