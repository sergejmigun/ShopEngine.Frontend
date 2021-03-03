app.registerComponent('mapper', 'Lib.objects', ['Collections', 'Utils.objects', function (collections, objects) {
    'use strict';

    function mapObjects(sourceObj, targetObj, mapping) {
        function mapProperties(sourceProp, targetProp, formatter) {
            if (formatter) {
                targetObj[targetProp] = formatter(sourceObj[sourceProp]);
            } else {
                targetObj[targetProp] = sourceObj[sourceProp];
            }
        }

        function mapByObjectMapping(mappingObj) {
            collections.foreach(mappingObj, function (mappingValue, targetProp) {
                if (objects.isString(mappingValue)) {
                    mapProperties(mappingValue, targetProp);
                } else if (objects.isObject(mappingValue)) {
                    var sourcePropName = mappingValue.name || targetProp;

                    if (sourceObj[sourcePropName] === undefined) {
                        targetObj[targetProp] = mappingValue.def;
                    } else {
                        mapProperties(sourcePropName, targetProp, mappingValue.format);
                    }
                } else if (objects.isFunction(mappingValue)) {
                    targetObj[targetProp] = mappingValue(sourceObj);
                }
            });
        }

        function mapByArrayMapping(mappingArray) {
            if (!mappingArray.length) {
                return;
            }

            collections.foreach(mappingArray, function (prop, index) {
                if (index !== mappingArray.length - 1) {
                    mapProperties(prop, prop);
                }
            });

            var last = mappingArray[mappingArray.length - 1];

            if (objects.isObject(last)) {
                mapByObjectMapping(last);
            } else {
                mapProperties(last, last);
            }
        }

        function mapAllProperties() {
            Object.keys(sourceObj).forEach(function (sourceProp) {
                targetObj[sourceProp] = sourceObj[sourceProp];
            });
        }

        if (!mapping) {
            mapAllProperties();
        } else if (objects.isArray(mapping)) {
            mapByArrayMapping(mapping);
        } else {
            mapByObjectMapping(mapping);
        }
    }

    var mapper = {
        map: mapObjects
    };

    return mapper;
}]);