### 在线RetroArch模拟器
- [www.emulatorjs.com](https://www.emulatorjs.com/) 
- [RetroArch](https://github.com/libretro/RetroArch.git)

###核心文件源文件 CORE FILE
xxx.data => xxx.7z
里面含有两份文件 have two file
- retroarch.js
- retroarch.js.mem/retroach.wasm
```javascript
//var _7z_BUF = dataBUF.slice ? dataBUF.slice(12) : dataBUF['subarray'](12);
//_7z_BUF['set']([55,122,188,175,39,28,0,3], 0);
    let buffreset = (e)=>{
        var newbuf = new Uint8Array(e);
        var xx = newbuf.slice ? newbuf.slice(12) : newbuf['subarray'](12);
        xx['set']([55,122,188,175,39,28,0,3], 0);
        return xx;
    },
    down = (e,name="xx.7z")=>{
        
        let link = document.createElement("a");
                        link.href = URL.createObjectURL(new Blob([e]));
                        link.download = name.split('/').pop().replace('.data','.7z');
                        link.click();
    },
    downcore = str=>{
            fetch(str).then(result=>result.arrayBuffer()).then(result=>down(result,str));
    };
    //F12 console
    //http://www.emulatorjs.com/cores/
    //see v.json asmjs=>1 http://www.emulatorjs.com/cores/{name}-{asmjs}.data
    //see v.json wasm=>1  http://www.emulatorjs.com/cores/{name}-{wasm}.data
    downcore('cores/vba-wasm.data')
```

###GBA例子 使用 use
```javascript
let NengeApp = new class{
    CoreFile = "vbanext-wasm.7z";
    Core7z = "../extract7z.min.js";
    OnLine = document.domain.search(/localhost|127.0./g) !== -1;
    constructor(){    
        fetch(this.CoreFile).then(data=>data.arrayBuffer()).then(resultData=>{
        let worker = new Worker(this.Core7z),File = {};
        worker.onmessage = result7z=>{
                if(result7z.data.data){
                File[result7z.data.file] = result7z.data.data;
                }else if(result7z.data.t==1){
                this.installCore(File);
                }
        };
        worker.postMessage(new Uint8Array(resultData));
        })

    }
    installCore(File){
        let js = (new TextDecoder()).decode(File['retroarch.js']);
        let EmulatorJS = Function('"use strict";'+js+';return EmulatorJS')(this),
            Module = {
            'TOTAL_MEMORY': 0x10000000,
            'noInitialRun': !0x0,
            'arguments': [],
            'preRun': [],
            'postRun': [],
            'canvas': document.querySelector('.gba-pic'),
            'print': e=>console.log(e),
            'printErr': e=>console.warn(e),
            'totalDependencies': 0,
            'monitorRunDependencies': e=>console.warn(e),
            'monitorRunDependencies':e=>console.log("游戏开始"),
            'onRuntimeInitialized':e=>console.log("执行完毕"),
            //preMainLoop:e=>{//console.log("循环运行运行");},
            'wasmBinary':File['retroarch.wasm']
        };
        EmulatorJS(Module);
        Module['FS']['createFolder']('/', 'etc', !0x0, !0x0),
        Module['FS']['mkdir']('/data'),
        Module['FS']['mkdir']('/data/saves'),
        'undefined' != typeof IDBFS ? Module['FS']['mount'](IDBFS, {}, '/data/saves') : Module['FS']['mount'](Module['FS']['filesystems']['IDBFS'], {}, '/data/saves'),
        Module['FS']['mkdir']('/shader'),
        Module['FS']['syncfs'](!0x0, function (e) {}),
        Module['FS']['createDataFile']('/etc', 'retroarch.cfg', 'savefile_directory = /data/saves\n'+
        'video_vsync = true\n'+
        'screenshot_directory = /\n'+
        'video_shader = /shader/shader.glslp\n'+
        'video_shader_enable = true\n'+
        'video_font_enable = false\n'+
        'video_scale = 1.0\n'+
        'video_gpu_screenshot = false\n'+
        'audio_latency = 96\n'+
        'fastforward_ratio = 1.0\n'+
        'video_smooth = false', !0x0, !0x0),
        Module['FS']['createFolder']('/home/web_user', '.config', !0x0, !0x0),
        Module['FS']['createFolder']('/home/web_user/.config', 'retroarch', !0x0, !0x0),
        Module['FS']['createDataFile']('/home/web_user/.config/retroarch', 'retroarch-core-options.cfg', "", !0x0, !0x0);
        fetch("1.gba").then(v=>v.arrayBuffer()).then(v=>{
                v=new Uint8Array(v);
                console.log(v.length);
                Module['FS']['createDataFile']('/', "1.gba", v, !0x0, !0x1);
                //Module['callMain']([gameName, length==49 string])
                Module['callMain'](['1.gba', '2b35cacf70aef5cbb3f38c0bb20e488cc8ad0c350400499a0'] );
                //retroarch _emscripten_memcpy_big
                /* set room buf
                function _emscripten_memcpy_big(dest, src, num) {
                        //gba 40201728
                        console.log(dest);
                        HEAPU8.set(HEAPU8.subarray(src, src + num), dest)
                }
                then HEAPU8.set(gbaBuff, 40201728) change room no refresh page 改变ROOM不刷新，先运行绿宝石就可以开启RTC
                */
        });
        this.Module = Module;
        File = null;

    }
/*
Module['cwrap']('system_restart', '', []) 重启
Module['cwrap']('get_current_frame_count', '', [])
Module['cwrap']('cmd_savefiles', '', [])
Module['cwrap']('get_core_options', 'string', [])
Module['cwrap']('load_state', 'number', ['string', 'number'])('game.state', 0x0)
Module['cwrap']('set_volume', 'null', ['number']);
Module['cwrap']('set_variable', 'null', ['string', 'string'])
Module['cwrap']('simulate_input', 'null', ['number', 'number', 'number'])
Module['cwrap']('shader_enable', 'null', ['number'])
getStateInfo=>  Module['cwrap']('get_state_info', 'string', [])
    let buf = getStateInfo().split('|');
    Statusbuf = buf[0] >> 0;
load_state = Module['cwrap']('load_state', 'number', ['string', 'number'])
    load_state('game.state', Statusbuf)
Module['cwrap']('set_cheat', 'number', ['number', 'number', 'string']))
Module['_reset_cheat']
*/
    //Module._simulate_input(0,keyMapID,1 or 0);
    KeyMap = {
        0: 'B',
        1: 'Y',
        2: 'SELECT',
        3: 'START',
        4: 'UP',
        5: 'DOWN',
        6: 'LEFT',
        7: 'RIGHT',
        8: 'A',
        9: 'X',
        10: 'L',
        11: 'R',
        12: 'L2',
        13: 'R2',
        14: 'L3',
        15: 'R3',
        19: 'L STICK UP',
        18: 'L STICK DOWN',
        17: 'L STICK LEFT',
        16: 'L STICK RIGHT',
        23: 'R STICK UP',
        22: 'R STICK DOWN',
        21: 'R STICK LEFT',
        20: 'R STICK RIGHT'
    }
}
```
