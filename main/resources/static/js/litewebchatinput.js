// !参考资料来源：
// !https://blog.csdn.net/weixin_40629244/article/details/104642683
// !https://github.com/jrainlau/chat-input-box
// !https://www.zhihu.com/question/20893119/answer/19452676
// !致谢：感谢@jrainlau提供的思路和代码，我在他的富文本编辑器基础上进行了修改，使其能够在聊天输入框中使用
// ————YubaC 2023.1.23

// --------------------------------
// 上半部分的聊天区域
var upperChild = document.querySelector('.lite-chatbox');
// 分界线
var oLine = document.querySelector('.lite-chatinput hr');
// 下半部分的输入框区域
var downChild = document.querySelector('.lite-chatinput');

// 以下为输入框区域的按钮
var emojiBtn = document.getElementById("emojiBtn"); // 表情按钮
var imageBtn = document.getElementById("imageBtn"); // 图片按钮
var fileBtn = document.getElementById("fileBtn"); // 文件按钮
var editFullScreen = document.getElementById("editFullScreen"); // 全屏按钮
var exitFullScreen = document.getElementById("exitFullScreen"); // 退出全屏按钮
var emojiMart = document.getElementById("emojiMart"); // 表情面板
var toolMusk = document.getElementById("toolMusk"); // 表情面板遮罩
var sendBtn = document.getElementById("sendBtn"); // 发送按钮
var chatInput = document.querySelector('.lite-chatinput>.chatinput'); // 输入框
// --------------------------------

// Emoji Mart（表情面板）设置及唤起
var pickerOptions = {
    "locale": "en",
    onEmojiSelect: function(e) {
        // console.log(e.native);
        emojiMart.style.display = "none";
        toolMusk.style.display = "none";
        insertAtCursor(chatInput, e.native);
        // insertEmoji(e.native);
    }
}
var picker = new EmojiMart.Picker(pickerOptions);
emojiMart.appendChild(picker);

// 负责在光标处插入文字的函数
function insertAtCursor(myField, myValue) {
    var editor = myField;
    var html = myValue;
    editor.focus();

    if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
            var range = selection.getRangeAt(0);
            range.deleteContents();
            var element = document.createElement('div');
            element.innerHTML = html;

            var node;
            var lastNode;
            var fragment = document.createDocumentFragment();

            while ((node = element.firstChild)) {
                lastNode = fragment.appendChild(node);
            };

            range.insertNode(fragment);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            };
        }

    } else if (document.selection && document.selection.type != 'Control') {
        editor.focus();
        var range = document.selection.createRange();
        range.pasteHTML(html);
        editor.focus();
    }
}

// 调整聊天区域和输入框区域比例的函数
oLine.onmousedown = function(ev) {
    // 更改oLine颜色为蓝色，方便查看分界线
    oLine.style.backgroundColor = "#1E90FF";
    var iEvent = ev || event;
    var dy = iEvent.clientY; //当你第一次单击的时候，存储y轴的坐标。//相对于浏览器窗口        
    var upperHeight = upperChild.offsetHeight;
    var downHeight = downChild.offsetHeight;
    document.onmousemove = function(ev) {
        var iEvent = ev || event;
        var diff = iEvent.clientY - dy; //移动的距离（向上滑时为负数,下滑时为正数）
        if (100 < (upperHeight + diff) && 100 < (downHeight - diff)) {
            //两个div的最小高度均为100px
            upperChild.style.height = `calc(100% - ${downHeight - diff}px)`;
            downChild.style.height = (downHeight - diff) + 'px';
        }
    };
    document.onmouseup = function() {
        // 更改oLine颜色为白色
        oLine.style.backgroundColor = "#fff";
        document.onmousedown = null;
        document.onmousemove = null;
    };
    return false;
}

// 显示表情输入框
emojiBtn.onclick = function() {
    emojiMart.style.display = "block";
    toolMusk.style.display = "block";

    let emojiHeight = emojiMart.offsetHeight;
    var downHeight = downChild.clientHeight;
    var upperHeight = upperChild.clientHeight;

    if (emojiHeight < upperHeight) {
        emojiMart.style.bottom = `${downHeight + 3}px`
        emojiMart.style.top = '';
    } else {
        emojiMart.style.bottom = ''
        emojiMart.style.top = '10px';
    }

}

// 全屏编辑文字
editFullScreen.onclick = function() {
    downHeight = downChild.clientHeight;
    upperHeight = upperChild.clientHeight;
    downChild.style.height = `100%`;
    upperChild.style.height = "0px";
    editFullScreen.style.display = "none";
    exitFullScreen.style.display = "block";
    oLine.style.display = "none";
}

// 退出全屏编辑文字
exitFullScreen.onclick = function() {
    // 防呆不防傻，用于避免上部聊天窗口被压到没有高度后出现异常
    if (upperHeight != 0) {
        downChild.style.height = `${downHeight}px`;
        upperChild.style.height = `calc(100% - ${downHeight}px)`;
    } else {
        upperChild.style.height = "calc(100% - 150px)";
        downChild.style.height = "150px";
    }

    exitFullScreen.style.display = "none";
    editFullScreen.style.display = "block";
    oLine.style.display = "block";
}

// 隐藏musk和表情输入框
toolMusk.onclick = function() {
    emojiMart.style.display = "none";
    toolMusk.style.display = "none";
}

// 将图片插入到输入框中
function addImage(file) {
    new Promise((resolve, reject) => {
        // console.log(file);
        // 获取file的src
        var reader = new FileReader();
        reader.onload = function(e) {
            var src = e.target.result;
            var img = new Image();
            img.src = src;

            // *这里的方法已经转移到了css里，暂时弃用
            // // 为了防止图片在输入框内显示过大不好编辑
            // img.style.width = "100px";
            // 将img从HEMLElement转化为字符串
            // 例如，转化结束后为'<img src="">'
            var imgStr = img.outerHTML;
            // 将img字符串插入到输入框中
            insertAtCursor(chatInput, imgStr);
        }
        reader.readAsDataURL(file);
    })
}

// TODO:可能富文本输入框的粘贴部分需要对Chrome浏览器做部分额外适配，以优化体验
// 无格式粘贴
chatInput.addEventListener('paste', function(e) {
    onPaste(e);
})

//格式化粘贴文本方法
function onPaste(event) {
    // 如果粘贴的是文本，就清除格式后粘贴
    if (event.clipboardData && event.clipboardData.getData) {
        var text = event.clipboardData.getData('text/plain');
        if (text) {
            event.preventDefault();
            document.execCommand('insertText', false, text);
        }
    }
}

window.addEventListener('DOMContentLoaded', function() {
    chatInput.focus();
});