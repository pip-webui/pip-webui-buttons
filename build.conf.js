module.exports = {
    module: {
        name: 'pipButtons',
        styles: 'index',
        export: 'pip.buttons',
        standalone: 'pip.buttons'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: false
    },
    file: {
        lib: [
            '../pip-webui-lib/dist/**/*',
            '../pip-webui-css/dist/**/*',
            '../pip-webui-services/dist/**/*',
             '../pip-webui-nav/dist/**/*',
             '../pip-webui-layouts/dist/**/*',
             '../pip-webui-themes/dist/**/*',             
        ]
    },
    samples: {
        port: 8160
    },
    api: {
        port: 8161
    }
};
