// ==UserScript==
// @name         微信小程序快捷切换账号
// @namespace    https://mp.weixin.qq.com/
// @version      1.0.4
// @author       Misaka
// @match        https://mp.weixin.qq.com/wxamp/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Misaka-1314/MisakaStudy-MIniProgram/refs/heads/main/resource/油猴脚本/账号切换.js
// @downloadURL  https://raw.githubusercontent.com/Misaka-1314/MisakaStudy-MIniProgram/refs/heads/main/resource/油猴脚本/账号切换.js
// ==/UserScript==

const getQueryParam = (name) => {
    const match = location.href.match(
        new RegExp("[?&]" + name + "=([^&]*)")
    );
    return match ? decodeURIComponent(match[1]) : null;
};

const 获取小程序列表 = () => {
    const random = Math.random();
    const token = getQueryParam("token");

    return new Promise(resolve => {
        fetch(`https://mp.weixin.qq.com/wxamp/cgi/getWxaList?token=${token}&lang=zh_CN&random=${random}`)
            .then(resp => resp.json())
            .then(res => {
                console.info("获取小程序列表", res);
                const list = res.wax_list || res.wxa_list || [];
                if (list.length > 0)
                    resolve(list.filter(item => item.type == 1).filter(item => !item.app_name.includes("测试号")).slice(1));
                else
                    resolve([])
            })
            .catch(() => resolve([]))
    })
}

const 切换账号 = (username) => {
    const items = document.querySelectorAll(".account_item");
    const item = Array.from(items).find(item => item.querySelector(".account_email").innerText === username);
    if (!item) {
        alert(`未找到账号：${username}`);
        return;
    }
    console.info("找到账号元素", item);
    sessionStorage.setItem("redirect_to_codepage", "1");
    item.click();
}

(async () => {
    "use strict";

    if (sessionStorage.getItem("redirect_to_codepage")) {
        sessionStorage.removeItem("redirect_to_codepage");
        const token = getQueryParam("token");
        window.location.href = `https://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?token=${token}&lang=zh_CN&_=${Math.random()}`;
        return;
    }

    const 小程序列表 = await 获取小程序列表();

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "110px";
    container.style.right = "10px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end";
    container.style.gap = "4px";
    container.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

    小程序列表.forEach((item, index) => {
        const button = document.createElement("button");
        button.innerText = item.app_name || item.username;
        button.style.padding = "5px 8px";
        button.style.width = "100px";
        button.style.backgroundColor = "#072347";
        button.style.color = "#fff";
        button.style.fontSize = "12px";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.title = item.appid;
        button.addEventListener("click", () => 切换账号(item.username));
        container.appendChild(button);
    });

    document.body.appendChild(container);
})();
