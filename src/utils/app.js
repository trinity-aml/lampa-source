import Platform from './platform'
import Android from './android'
import Orsay from './orsay'
import Manifest from './manifest'
import Utils from './math'
import Controller from '../interaction/controller'
import Modal from '../interaction/modal'
import Lang from './lang'
import LoadingProgress from '../interaction/loading_progress'

function close(){
    if(Platform.is('apple_tv')) window.location.assign('exit://exit');
    if(Platform.is('tizen')) tizen.application.getCurrentApplication().exit()
    if(Platform.is('webos') && typeof window.close == 'function') window.close()
    if(Platform.is('android')) Android.exit()
    if(Platform.is('orsay')) Orsay.exit()
    if(Platform.is('netcast')) window.NetCastBack()
    if(Platform.is('noname')) window.history.back()
}

function loadStyle(){
    /** Start - для orsay одни стили, для других другие */
    let old_css = $('link[href="css/app.css"]')

    if(Platform.is('orsay') && window.location.host.indexOf('localhost') == -1){
        let urlStyle = 'http://lampa.mx/css/app.css?v'
        //Для нового типа виджета берем сохраненный адрес загрузки
        if (Orsay.isNewWidget()) {
            //Для фрейм загрузчика запишем полный url
            if (location.protocol != 'file:') {
                let newloaderUrl = location.href.replace(/[^/]*$/, '')
                if (newloaderUrl.slice(-1) == '/') {
                    newloaderUrl = newloaderUrl.substring(0, newloaderUrl.length - 1);
                }
                if (Orsay.getLoaderUrl() != newloaderUrl) {
                    Orsay.setLoaderUrl(newloaderUrl)
                }
            }
            //console.log('Loader', 'start url: ', Orsay.getLoaderUrl());
            urlStyle = Orsay.getLoaderUrl() + '/css/app.css?v'
        }
        Utils.putStyle([
            urlStyle + Manifest.css_version
        ],()=>{
            old_css.remove()
        })
    }
    else if(old_css.length){
        Utils.putStyle([
            Manifest.github_lampa + 'css/app.css?v' + Manifest.css_version
        ],()=>{
            LoadingProgress.status('PutStyle ' + Manifest.css_version)

            old_css.remove()
        },()=>{
            
        })
    }
}

function modalClose(){
    let controller = Controller.enabled().name

    Modal.open({
        title: '',
        align: 'center',
        zIndex: 300,
        html: $('<div class="about">'+Lang.translate('close_app_modal')+'</div>'),
        buttons: [
            {
                name: Lang.translate('settings_param_no'),
                onSelect: ()=>{
                    Modal.close()

                    Controller.toggle(controller)
                }
            },
            {
                name: Lang.translate('settings_param_yes'),
                onSelect: ()=>{
                    Modal.close()

                    Controller.toggle(controller)

                    close()
                }
            }
        ]
    })
}

export default {
    close,
    loadStyle,
    modalClose
}