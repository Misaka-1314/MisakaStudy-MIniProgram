# 签到类型

## 课程、班级、群聊的区别

打开学习通 App 的聊天页，课程是绿色图标，班级是黄色图标，群聊是学生头像拼接。

<img src="/image/guide/分辨签到类型.png" style="width: min(60vw, 300px)" />

::: details 怎么签？（课程、班级、群聊签到都能搞定哦~）

**1. 课程签到、班级签到**

直接在【课程学习】独自完成除二维码以外的签到类型，二维码需要同学去教室扫。班级签到本质是隐藏了课程入口的课程签到。

**2. 群聊签到**

在【实时学习】中监听签到通知，可独自完成各种类型的签到。
:::

## 课程签到的类型

![签到类型辨别](/image/guide/发布签到类型.png)

| 类型 | 特点 | 怎么签 |
| --- | --- | --- |
| 二维码签到 | 过期二维码漏洞已在 2023年4月8号 被学习通官方修复。截止目前没人能破解过期二维码签到。<br/>二维码解码后是链接，例如：https://mobilelearn.chaoxing.com/widget/sign/e?id=80001231452&enc=FACDD34DBC291EE176，包含 id 和 enc 参数，enc 每 10 秒无规律变化一次。 | 点击 **扫码学习** 就可以扫码签到；若教师设置位置限制，可地图选点签到。<br/>已自动绕过 “同一设备不能重复签到” 的限制。<br/>PS：点击 “请人帮忙” 可以快捷把账号密码分享给同学帮你签。 |
| 位置签到 | 不会触发 “使用作弊工具” 提示。开发者已有应对策略，教师端仅显示正常签到记录。 | 地图选点，可自行修改签到位置文本。会员用户可获取教师设置的位置。<br/>只要坐标对了，你填 “学园都市” 都能签上。 |
| 手势签到 / 签到码签到 | 签到码是 4-8 位的数字，不是二维码。 | 点击自动获取，即可获得签到码、手势图，然后点立即签到。 |
| 图片签到 | 会员用户可一键借用同学照片签到。 | 用户可上传任意图片进行签到。<br/>不上传图片也会签到成功，但图片缺失。 |

## 签到的结果

:::warning
部分同学分不清【1.未签】和【2.缺勤】，缺勤是你老师手动设置的！
:::

| 1. 未签 | 2. 缺勤 | 3. 教师代签 | 4. 虚拟定位 | 5. 已签 |
| :---: | :---: | :---: | :---: | :---: |
| 如果没签到，显示的是这个 | 教师手动设置的 | | v3 小程序支持自动绕过 | |
| <img src="/image/result/未签.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/缺勤.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/教师代签.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/虚拟定位.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/已签.png" style="width: min(15vw, 160px)" /> |

| 6. 事假 | 7. 病假 | 8. 公假 | 9. 迟到 | 10. 早退 |
| :---: | :---: | :---: | :---: | :---: |
| <img src="/image/result/事假.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/病假.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/公假.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/迟到.png" style="width: min(15vw, 160px)" /> | <img src="/image/result/早退.png" style="width: min(15vw, 160px)" /> |
