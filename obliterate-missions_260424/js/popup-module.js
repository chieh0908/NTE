/**
 * NTE Popup Module
 * 可重用彈窗模組 — 適用於任何使用 reset.js 的活動頁面
 *
 * 依賴：jQuery, Bootstrap 4 Modal
 *
 * 使用方式：
 *   NTEPopup.init({
 *     popups: ['popRule', 'popMsg', 'popShare'],
 *     config: {
 *       popRule: { ruleContent: '<p>活動規則 HTML</p>' },
 *       popShare: { shareImg: 'https://...share.jpg' }
 *     }
 *   });
 *
 *   NTEPopup.open('#popRule');
 *   NTEPopup.msg('活動尚未開啟');
 */
var NTEPopup = (function ($) {
  "use strict";

  // ============================================================
  //  HTML 模板
  //  與 demo.html 中的結構保持同步
  // ============================================================

  var templates = {
    // -------------------- 1. 活動規則 --------------------
    popRule: function (cfg) {
      var ruleContent = (cfg && cfg.ruleContent) || "";
      return (
        '<div class="modal fade popRule" id="popRule" tabindex="-1" aria-hidden="true">' +
          '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content popCont">' +
              '<div class="popup">' +
                '<div class="abs pop-bg pop-bg2">' +
                  '<button class="abs close closePop" data-dismiss="modal" aria-label="Close"></button>' +
                  '<div class="popRuleTit"></div>' +
                  '<div class="rule-scroll cus-scroll">' +
                    ruleContent +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    },

    // -------------------- 2. 通用提示訊息 --------------------
    popMsg: function () {
      return (
        '<div class="modal fade popMsg" id="popMsg" tabindex="-1" aria-hidden="true">' +
          '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content popCont">' +
              '<div class="popup">' +
                '<div class="abs pop-bg pop-bg2">' +
                  '<button class="abs close closePop" data-dismiss="modal" aria-label="Close"></button>' +
                  '<div class="popMsgCont">' +
                    "<p></p>" +
                    '<div class="popBtns" style="display: none;">' +
                      '<button class="popBtn btn-msg-confirm"></button>' +
                    "</div>" +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    },

    // -------------------- 3. 分享選項 --------------------
    popShare: function (cfg) {
      var shareImg = (cfg && cfg.shareImg) || "";
      return (
        '<div class="modal fade popShare" id="popShare" tabindex="-1" aria-hidden="true">' +
          '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content popCont">' +
              '<div class="popup">' +
                '<div class="abs pop-bg pop-bg3">' +
                  '<button class="abs close closePop" data-dismiss="modal" aria-label="Close"></button>' +
                  '<div class="popShareCont">' +
                    '<div class="abs shareDownSourcePic">' +
                      '<div class="shareDownPic"></div>' +
                      '<div class="abs inviteCode" id="qrcode"></div>' +
                    "</div>" +
                    '<div class="abs shareDownResultPic">' +
                      '<img src="' + shareImg + '" alt="分享圖片">' +
                    "</div>" +
                  "</div>" +
                  '<div class="popBtns">' +
                    '<button class="popBtn shareInviteLinkBtn"></button>' +
                    '<a class="popBtn downloadSharePicBtn" download></a>' +
                    '<button class="popBtn fbShareBtn"></button>' +
                    '<button class="popBtn lineShareBtn"></button>' +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    },

    // -------------------- 4. 遊戲帳號預註冊 --------------------
    regressmodal: function (cfg) {
      var phoneOptions =
        (cfg && cfg.phoneOptions) ||
        '<option value="-1">區域</option>' +
        '<option value="+886">台灣 +886</option>' +
        '<option value="+852">香港 +852</option>' +
        '<option value="+853">澳門 +853</option>';

      var platforms =
        (cfg && cfg.platforms) ||
        '<div class="t_btn"><button system="iOS" class="platform_iOS publicGoogleAnalytics" type="button" data-device="iOS"></button></div>' +
        '<div class="t_btn"><button system="Android" class="platform_Android publicGoogleAnalytics" type="button" data-device="Android"></button></div>' +
        '<div class="t_btn"><button system="pc" class="platform_pc publicGoogleAnalytics" type="button" data-device="PC"></button></div>' +
        '<div class="t_btn"><button system="console" class="platform_host publicGoogleAnalytics" type="button" data-device="PS5"></button></div>';

      return (
        '<div class="modal fade regressmodal" id="regressmodal" tabindex="-1" aria-hidden="true" style="z-index: 1057">' +
          '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content">' +
              '<button type="button" class="btn-close hvr-shrink" data-dismiss="modal" aria-label="Close"></button>' +
              '<div class="modal-body">' +
                '<div class="pop" id="pop_yy">' +
                  '<div class="abs popCont languageName">' +
                    '<button class="abs popClose" data-dismiss="modal" aria-label="Close"></button>' +
                    '<div class="rel popCont1 pop_yy_form">' +
                      '<div class="abs auto pop_yy_tit"></div>' +
                      '<div class="abs auto yyForm">' +
                        '<div class="form-bg">' +
                          '<select id="phone_code" class="form-select">' +
                            phoneOptions +
                          "</select>" +
                          '<input id="phone_number" name="play_info" type="text" class="form-control" size="20" maxlength="10" placeholder="範例 0912345678" onkeypress="if (event.keyCode == 13) {return false;}" />' +
                        "</div>" +
                      "</div>" +
                      '<div class="d-flex">' +
                        '<input class="form-check-input" type="checkbox" id="gridCheck" checked />' +
                        '<label class="form-check-label" data-target="#privacymodal" data-toggle="modal" data-dismiss="modal">{privacy}</label>' +
                      "</div>" +
                      '<div class="platform">' +
                        '<div class="abs auto yy_platform_head">* 請選擇預約平台（單選）</div>' +
                        '<div class="abs yy_platform">' +
                          platforms +
                        "</div>" +
                        '<div class="platform_tip">選擇您的設備，點擊「預約」代表您同意我們向您的手機號發送短信通知或以手機號參與活動</div>' +
                      "</div>" +
                      '<a class="abs auto yySubmit login_button"></a>' +
                    "</div>" +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    },

    // -------------------- 5. 預約成功 --------------------
    successmodal: function (cfg) {
      var iosLink =
        (cfg && cfg.successLinks && cfg.successLinks.ios) ||
        "https://apps.apple.com/app/id6751030003";
      var androidLink =
        (cfg && cfg.successLinks && cfg.successLinks.android) ||
        "https://play.google.com/store/apps/details?id=tw.com.iwplay.nte";
      var iosImg =
        (cfg && cfg.successLinks && cfg.successLinks.iosImg) ||
        "https://rests-nte.iwplay.com.tw/events/pre-gacha/images/event_double_yy_btn_ios.webp";
      var androidImg =
        (cfg && cfg.successLinks && cfg.successLinks.androidImg) ||
        "https://rests-nte.iwplay.com.tw/events/pre-gacha/images/event_double_yy_btn_android.webp";

      return (
        '<div class="modal fade successmodal" id="successmodal" tabindex="-1" aria-hidden="true">' +
          '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content popCont">' +
              '<button class="abs popClose" data-dismiss="modal" aria-label="Close"></button>' +
              '<div class="modal-body rel popCont2 pop_yy_success">' +
                '<div class="abs auto pop_yySuccess_tit"></div>' +
                '<div class="focus_social_btns">' +
                  '<div class="urban_icon_ios">' +
                    '<a href="' + iosLink + '" target="_blank">' +
                      '<img src="' + iosImg + '" alt="">' +
                    "</a>" +
                  "</div>" +
                  '<div class="urban_icon_android">' +
                    '<a href="' + androidLink + '" target="_blank">' +
                      '<img src="' + androidImg + '" alt="">' +
                    "</a>" +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    },

    // -------------------- 6. 隱私權政策 --------------------
    privacymodal: function (cfg) {
      var returnTarget = (cfg && cfg.returnTarget) || "#regressmodal";
      var privacyContent = (cfg && cfg.privacyContent) || "<li>{privacy_list}</li>";

      return (
        '<div class="modal fade privacymodal" id="privacymodal" data-backdrop="static" data-keyboard="false" aria-hidden="true" tabindex="-1">' +
          '<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">' +
            '<div class="modal-content popCont">' +
              '<button class="abs popClose" data-target="' + returnTarget + '" data-toggle="modal" data-dismiss="modal"></button>' +
              '<div class="modal-body rel popCont3">' +
                '<div class="res_poptt">' +
                  '<img src="https://rests-nte.iwplay.com.tw/images/pop/pop_yy_privacy_tt.png" alt="異環"/>' +
                "</div>" +
                '<div class="list_con">' +
                  "<ol>" +
                    privacyContent +
                  "</ol>" +
                "</div>" +
                '<a class="popup_close" href="javascript:void(0);" data-target="' + returnTarget + '" data-toggle="modal" data-dismiss="modal">返回</a>' +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    },

    // -------------------- 7. SDK 登入 --------------------
    bookedmodal: function () {
      return (
        '<div class="modal fade bookedmodal" id="bookedmodal" tabindex="-1" aria-hidden="true" style="z-index: 1057">' +
          '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content">' +
              '<button type="button" class="btn-close hvr-shrink" data-dismiss="modal" aria-label="Close"></button>' +
              '<div class="modal-body">' +
                '<div class="pop" id="pop_booked">' +
                  '<div class="abs popCont languageName">' +
                    '<button class="abs popClose" data-dismiss="modal" aria-label="Close"></button>' +
                    '<div class="rel popCont1 pop_booked_form">' +
                      '<div class="abs auto pop_booked_tit"></div>' +
                      '<div class="abs auto bookedForm">' +
                        '<div class="form-bg">' +
                          '<select id="booked_phone_code" class="form-select">' +
                            '<option value="-1">區域</option>' +
                            '<option value="+886">台灣 +886</option>' +
                            '<option value="+852">香港 +852</option>' +
                            '<option value="+853">澳門 +853</option>' +
                          "</select>" +
                          '<input id="booked_phone_number" name="play_info" type="text" class="form-control" size="20" maxlength="10" placeholder="範例 0912345678" onkeypress="if (event.keyCode == 13) {return false;}" />' +
                        "</div>" +
                        '<div class="graphic_verification_code">' +
                          '<input class="captcha" name="" value="" type="text" maxlength="10" placeholder="請輸入圖形驗證碼" />' +
                          '<div class="img_code">' +
                            '<img class="img_code_pic" src="https://images1.iwplay.com.tw/image/zxsj/events/member/images/img_code.webp" alt="" key="" />' +
                          "</div>" +
                        "</div>" +
                        '<div class="phone_verification_code">' +
                          '<input class="smsCode" name="" value="" type="text" maxlength="10" placeholder="請輸入手機驗證碼" />' +
                          '<div class="btn_get_code"></div>' +
                        "</div>" +
                      "</div>" +
                      '<div class="d-flex">' +
                        '<input class="form-check-input" type="checkbox" id="bookedGridCheck" checked />' +
                        '<label class="form-check-label" data-target="#privacymodal" data-toggle="modal" data-dismiss="modal">{privacy}</label>' +
                      "</div>" +
                      '<a href="javascript:void(0);" class="abs auto bkSubmit booked_button" data-dismiss="modal" aria-label="Close"></a>' +
                      '<div class="abs auto booked_button_bg"></div>' +
                      '<p class="abs auto Change_acc_hint">使用其他平台快速登入</p>' +
                      '<div class="abs auto Change_acc_box">' +
                        '<a href="javascript:void(0);" class="Change_acc_btn google"></a>' +
                        '<a href="javascript:void(0);" class="Change_acc_btn ios"></a>' +
                        '<a href="javascript:void(0);" class="Change_acc_btn facebook"></a>' +
                      "</div>" +
                    "</div>" +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    },
  };

  // ============================================================
  //  公開 API
  // ============================================================

  return {
    /**
     * 初始化彈窗模組
     * @param {object} options
     * @param {string[]} options.popups - 要啟用的彈窗名稱陣列
     * @param {object}   [options.config] - 各彈窗的自訂設定
     * @param {string}   [options.privacyDataUrl] - 隱私權資料 JSON 路徑（優先於 ViewObj）
     */
    init: function (options) {
      if (!options || !options.popups) {
        console.warn("[NTEPopup] init() 需要 options.popups 陣列");
        return;
      }

      var self = this;
      var config = options.config || {};
      var container = document.createElement("div");
      container.id = "nte-popup-container";

      options.popups.forEach(function (name) {
        if (templates[name]) {
          container.innerHTML += templates[name](config[name] || {});
        } else {
          console.warn("[NTEPopup] 找不到模板: " + name);
        }
      });

      document.body.appendChild(container);
      this._bindEvents();

      // 隱私權資料渲染：優先從 privacyDataUrl 載入，否則從 ViewObj 讀取
      if (options.privacyDataUrl) {
        $.getJSON(options.privacyDataUrl, function (data) {
          self._renderPrivacy(data);
        });
      } else if (typeof ViewObj !== "undefined") {
        this._renderPrivacy(ViewObj);
      }
    },

    /**
     * 開啟指定彈窗（先關閉所有再開啟目標）
     * @param {string} targetId - 目標選擇器，例如 '#popRule'
     */
    open: function (targetId) {
      $(".modal").modal("hide");
      setTimeout(function () {
        $(targetId).modal("show");
      }, 300);
    },

    /**
     * 快捷：顯示通用提示訊息
     * @param {string} text - 要顯示的文字
     * @param {object} [opts] - 選項
     * @param {boolean} [opts.showConfirm] - 是否顯示確認按鈕
     */
    msg: function (text, opts) {
      var $modal = $("#popMsg");
      if (!$modal.length) {
        console.warn("[NTEPopup] popMsg 尚未初始化，請在 popups 陣列中加入 'popMsg'");
        return;
      }
      $modal.find(".popMsgCont p").text(text);

      if (opts && opts.showConfirm) {
        $modal.find(".popBtns").show();
      } else {
        $modal.find(".popBtns").hide();
      }

      this.open("#popMsg");
    },

    /**
     * 綁定共用事件
     * @private
     */
    _bindEvents: function () {
      // 預約平台按鈕切換
      $(document).on("click", "#nte-popup-container .yy_platform button", function () {
        $("#nte-popup-container .yy_platform button").removeClass("on");
        $(this).toggleClass("on");
      });
    },

    /**
     * 渲染隱私權文字（{privacy} / {privacy_list}）
     * @param {object} data - 包含 privacy (string) 和 privacy_list (string|array) 的資料
     * @private
     */
    _renderPrivacy: function (data) {
      if (!data) return;

      // 只針對 .form-check-label，避免匹配到祖先 div 導致 HTML 結構被破壞
      $("#nte-popup-container .form-check-label").each(function () {
        var text = $(this).text();
        if (text.indexOf("{privacy}") > -1) {
          $(this).text(text.replace("{privacy}", data.privacy));
        }
      });

      // 只針對 .list_con 內的 li
      $("#nte-popup-container .list_con li").each(function () {
        var html = $(this).html();
        if (html.indexOf("{privacy_list}") > -1) {
          var content = data.privacy_list;
          if (Array.isArray(content)) {
            content = content.join("</li><li>");
          }
          $(this).html(html.replace("{privacy_list}", content));
        }
      });
    },
  };
})(jQuery);
