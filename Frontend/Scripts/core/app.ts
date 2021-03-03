class App {
    modulesInitData = [];
    componentsInitData = {};
    contextObjects = {};
    dependenciesScope = [] as string[];
    componentsCache = {};

    private getDependenciesPath(fullName) {
        var path = '';

        this.dependenciesScope.forEach(function (pathItem) {
            path = path + (path ? ' -> ' : '') + pathItem;
        });

        return path + ' -> ' + fullName;
    }

    private getDependency(dependecyInfo) {
        var nameParts = dependecyInfo.split('.'),
            dependency = this;

        nameParts.forEach(function (namePart) {
            if (!dependency[namePart]) {
                throw 'Dependency "' + dependecyInfo + '" doesn\'t exist';
            }

            dependency = dependency[namePart];
        });

        return dependency;
    }

    private getDependencies(dependeciesInfo) {
        var dependencies = [],
            self = this;

        dependeciesInfo.forEach(function (dependecyInfo) {
            dependencies.push(self.getDependency(dependecyInfo));
        });

        return dependencies;
    }

    private getInstance(initData, fullName) {
        if (this.componentsCache.hasOwnProperty(fullName)) {
            return this.componentsCache[fullName];
        }

        if (this.dependenciesScope.indexOf(fullName) !== -1) {
            throw 'Circular dependency detected: ' + this.getDependenciesPath(fullName);
        }

        this.dependenciesScope.push(fullName);

        var constructorFunc = initData[initData.length - 1],
            dependeciesInfo = [],
            i;

        for (i = 0; i < initData.length - 1; i += 1) {
            dependeciesInfo.push(initData[i]);
        }

        if (!this.contextObjects.hasOwnProperty(fullName)) {
            this.contextObjects[fullName] = {};
        }

        var instance = constructorFunc.apply(this.contextObjects[fullName], this.getDependencies(dependeciesInfo));

        this.componentsCache[fullName] = instance;
        this.dependenciesScope.splice(this.dependenciesScope.indexOf(fullName), 1);

        return instance;
    }

    private getModuleInstance(moduleName, initData) {
        var moduleObj = this.getInstance(initData, moduleName),
            self = this;

        if (self.componentsInitData[moduleName]) {
            self.componentsInitData[moduleName].forEach(function (componentInitData) {
                var nsParts = componentInitData.moduleName.split('.'),
                    obj = moduleObj.module,
                    componentName = componentInitData.componentName,
                    i;

                for (i = 1; i < nsParts.length; i += 1) {
                    if (!obj.hasOwnProperty(nsParts[i])) {
                        obj[nsParts[i]] = {};
                    }

                    obj = obj[nsParts[i]];
                }

                if (!obj.hasOwnProperty(componentName)) {
                    Object.defineProperty(obj, componentName, {
                        get: function () {
                            var component = self.getInstance(componentInitData.initData, componentInitData.moduleName + '.' + componentName);

                            if (moduleObj.initComponent) {
                                moduleObj.initComponent(component, componentName);
                            }

                            return component;
                        }
                    });
                }
            });
        }

        return moduleObj.module;
    }

    private initApp() {
        var self = this;

        this.modulesInitData.forEach(function (moduleInitData) {
            Object.defineProperty(app, moduleInitData.moduleName, {
                get: function () {
                    return self.getModuleInstance(moduleInitData.moduleName, moduleInitData.initData);
                }
            });
        });
    }

    public registerModule(moduleName, initData) {
        this.modulesInitData.push({
            moduleName: moduleName,
            initData: initData
        });
    }

    public registerComponent(componentName, namespaceModuleName, initData) {
        if (!componentName) {
            throw 'Component name is required';
        }

        if (!namespaceModuleName) {
            throw 'Module name is required';
        }

        var components,
            moduleName = namespaceModuleName.split('.')[0];

        if (!this.componentsInitData.hasOwnProperty(moduleName)) {
            components = [];
            this.componentsInitData[moduleName] = components;
        } else {
            components = this.componentsInitData[moduleName];
        }

        components.push({
            componentName: componentName,
            moduleName: namespaceModuleName,
            initData: initData
        });
    }

    public init() {
        this.initApp();
    }

    public ignoreParams = function (args: any) {
        return args;
    };
}

var app = new App();