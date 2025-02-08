import Utils from '../math'
import Manifest from '../manifest'

function init(){
    let video_libs = ['hls/hls.js', 'dash/dash.js']

    video_libs = video_libs.map(lib=>{
        return window.location.protocol == 'file:' ? Manifest.github_lampa + 'vender/' + lib : './vender/' + lib
    })

    Utils.putScript(video_libs,()=>{})

    if(window.youtube_lazy_load) Utils.putScript([Utils.protocol() + 'youtube.com/iframe_api'],()=>{})
}

export default {
    init
}