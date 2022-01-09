//instanceof ArrayBuffer
NengeApp = new class {
    'check_webgl' = (() => {
        var CheckWebGL = {
            'DETECTED': false
        };
        var WebGL_ELM = document['createElement']('canvas');
        if (WebGL_ELM && WebGL_ELM['getContext'])
            for (var WebGLAttr = ['webgl2', 'experimental-webgl2', 'webgl', 'experimental-webgl'], _0x44cd27 = 0x0, _0x12b7b8 = WebGLAttr['length']; _0x44cd27 < _0x12b7b8; ++_0x44cd27) {
                var Attr = WebGLAttr[_0x44cd27],
                    WebGLType = WebGL_ELM['getContext'](Attr);
                if (WebGLType) {
                    CheckWebGL['WEBGL_CONTEXT'] = Attr,
                        CheckWebGL['WEBGL_VERSION'] = WebGLType['getParameter'](WebGLType['VERSION']),
                        CheckWebGL['WEBGL_VENDOR'] = WebGLType['getParameter'](WebGLType['VENDOR']),
                        CheckWebGL['WEBGL_SL_VERSION'] = WebGLType['getParameter'](WebGLType['SHADING_LANGUAGE_VERSION']),
                        CheckWebGL['MAX_TEXTURE_SIZE'] = WebGLType['getParameter'](WebGLType['MAX_TEXTURE_SIZE']);
                    var getExt = WebGLType['getExtension']('WEBGL_debug_renderer_info');
                    getExt && (CheckWebGL['WEBGL_VENDOR'] = WebGLType['getParameter'](getExt['UNMASKED_VENDOR_WEBGL']),
                            CheckWebGL['WEBGL_RENDERER'] = WebGLType['getParameter'](getExt['UNMASKED_RENDERER_WEBGL'])),
                        CheckWebGL['DETECTED'] = true;
                    break;
                }
            }
        console.log(CheckWebGL);
        CheckWebGL.ELement = WebGL_ELM;
        return CheckWebGL;
    })()
}