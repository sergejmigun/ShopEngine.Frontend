app.registerComponent('controlOptionsPrototypes', 'Services', [
    'Resources.UICore',
    'Shared',
    function (resources, shared) {
        'use strict';
        return {
            imageUploader: function () {
                var options = {
                    uploadUrl: shared.systemUrls.uploadFileUrl,
                    maxUploads: 1,
                    alreadyUploadedFilesDownloading: {
                        url: shared.systemUrls.downloadFileUrl
                    },
                    justUploadedFilesDeletion: {
                        url: shared.systemUrls.removeFileUrl,
                        confirmation: {
                            title: resources.confirm,
                            message: resources.removeImageConfirmation
                        }
                    },
                    alreadyUploadedFilesDeletion: {
                        url: shared.systemUrls.removeFileUrl,
                        confirmation: {
                            title: resources.confirm,
                            message: resources.removeImageConfirmation
                        }
                    }
                };
                return options;
            }
        };
    }
]);
