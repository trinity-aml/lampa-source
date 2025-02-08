import Storage from '../storage'
import Account from '../account'
import Personal from '../personal'
import Platform from '../platform'
import Base64 from '../base64'
import Noty from '../../interaction/noty'
import Utils from '../math'
import Request from '../reguest'
import Lang from '../lang'
import Settings from '../../components/settings'

let torrent_net = new Request()

function init(){
    Storage.listener.follow('change', function (e) {
        if (e.name == 'torrserver_url') check(e.name)
        if (e.name == 'torrserver_url_two') check(e.name)
        if (e.name == 'torrserver_use_link') check(e.value == 'one' ? 'torrserver_url' : 'torrserver_url_two')
    })

    Settings.listener.follow('open', function (e){
        if(e.name == 'server'){
            let name = Storage.field('torrserver_use_link') == 'one' ? 'torrserver_url' : 'torrserver_url_two'

            check(name)

            if(!Account.hasPremium() && Lang.selected(['ru','be','uk']) && !Personal.confirm()){
                let ad = $(`
                    <div class="ad-server">
                        <div class="ad-server__text">
                            Ссылка Torrserver в аренду.
                        </div>
                        <img class="ad-server__qr" style="opacity: 0; border: 0.5em solid #3c3e3f; border-radius: 0.3em;">
                        <div class="ad-server__label">Реклама - https://tsarea.tv</div>
                    </div>
                `)

                let im = ad.find('img')

                Utils.imgLoad(im[0], 'https://i.ibb.co/6YsXH0H/qr-code-4-1.png', ()=>{
                    im.css('opacity', 1)
                })

                $('[data-name="torrserver_use_link"]',e.body).after(ad)
            }
        }
        else torrent_net.clear() 
    })
}

function check(name) {
    if(Platform.is('android') && !Storage.field('internal_torrclient')) return

    let item = $('[data-name="'+name+'"]').find('.settings-param__status').removeClass('active error wait').addClass('wait')
    let url  = Storage.get(name)

    if(url){
        torrent_net.timeout(10000)

        let head = {dataType: 'text'}
        let auth = Storage.field('torrserver_auth')

        if(auth){
            head.headers = {
                Authorization: "Basic " + Base64.encode(Storage.get('torrserver_login')+':'+Storage.value('torrserver_password'))
            }
        }

        torrent_net.native(Utils.checkEmptyUrl(Storage.get(name)), ()=>{
            item.removeClass('wait').addClass('active')
        }, (a, c)=> {
            if(a.status == 401){
                item.removeClass('wait').addClass('active')

                Noty.show(Lang.translate('torrent_error_check_no_auth') + ' - ' + url, {time: 5000})
            }
            else{
                item.removeClass('wait').addClass('error')

                Noty.show(torrent_net.errorDecode(a, c) + ' - ' + url, {time: 5000})
            }
        }, false, head)
    }
}

export default {
    init
}