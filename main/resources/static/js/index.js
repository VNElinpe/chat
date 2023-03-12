// 页面聊天记录
var chatLogs
// messages
var messages = [{role: 'system', content: 'You are a helpful assistant.'}]


$(document).ready(function(){
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
            url: "/chat",
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