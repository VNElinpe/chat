// 页面聊天记录
var uid = "anonymous"
var chatLogs
// messages
var messages = [{role: 'system', content: 'You are a helpful assistant.'}]


$(document).ready(function(){
    let urlArgs = window.location.search
    if (urlArgs.length != 0) {
        let kvs = urlArgs.substr(1).split("=")
        if (kvs[0] == 'uid') {
            uid = kvs[1]
        }
    }
    // 首次进入页面的欢迎信息
    chatLogs = [{
        messageType: 'text',
        headIcon: 'img/A.jpg',
        name: 'Robot 1',
        position: 'left',
        html: `Hi there, how can I assist you today?`
    } ];
    beforeRenderingHTML(chatLogs, '.lite-chatbox');
    // 发送消息
    document.querySelector('.send').onclick = function() {
        let content = document.querySelector('.chatinput').innerHTML
        // 消息内容为空不做处理
        if (content == '') {
            return
        }
        // 聊天页面展示用户发送的消息
        chatLogs.push({
            messageType: 'raw',
            headIcon: 'img/thinking_face_color.svg',
            name: '',
            position: 'right',
            html: content
        })
        // 获取响应信息
        messages.push({role: 'user', content: content})
        $.ajax({
            type: "POST",
            url: "/chat?uid="+uid+"&time="+dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
            data: JSON.stringify(messages),
            dataType: "json",
            contentType: "application/json",
            success: function(resp){
                // 获取响应数据
                let respData = resp['data']
                if (respData != undefined) {
                    chatLogs.push({
                        messageType: 'raw',
                        headIcon: 'img/A.jpg',
                        name: 'Robot 1',
                        position: 'left',
                        html: respData
                    })
                    // 聊天页面展示响应信息
                    beforeRenderingHTML(chatLogs, '.lite-chatbox');
                    // 记录上下文
                    messages.push({role: 'assistant', content: respData})
                }
            }
        });
        document.querySelector('.chatinput').innerHTML = '';
        beforeRenderingHTML(chatLogs, '.lite-chatbox');
    };

});


// 入参 fmt-格式 date-日期
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
