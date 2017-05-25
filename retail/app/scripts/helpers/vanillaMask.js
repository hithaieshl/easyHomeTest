define([
     'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    ,'mask'
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,VanillaMasker
    ) {
        VanillaMasker.prototype.bindElementToMask = function(el, maskFunction, params) {
            try {
              var that = this,
                  elements = el.length ? el : [el],
                  isApp = window.localStorage.getItem('environment').indexOf('app') !== -1,
                  ctrlDown = false,
                  ctrlKey = 17,
                  byPassKeys = [8, 9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
                  isPaste = false,
                  onType = function(e) {
                    //prevent validation of values that have bigger length bigger then a mask on desktop
                    if (!isApp && e.type === 'keydown') {
                        var keyCode = event.keyCode || event.which;
                        var key = String.fromCharCode(keyCode);
                        if (!ctrlDown && byPassKeys.indexOf(keyCode) === -1) {
                            if ((e.target.value + key).length > params.length) {
                                e.preventDefault();
                            }
                        }
                        if (keyCode == ctrlKey) {
                            //check if Ctrl key was pressed
                            ctrlDown = true;
                        }
                    }
                    if (!isApp && e.type === 'keyup') {
                        ctrlDown = false;
                    }
                    if (!ctrlDown) {
                        if (e.target) {
                          e.target.value = that[maskFunction](e.target.value, params);
                          $(e.target).trigger('change');
                        } else {
                          e.srcElement.value = that[maskFunction](e.srcElement.value, params);
                          $(e.target).trigger('change');
                        }
                    }
                  },
                  onPaste = function(e) {
                    isPaste = true;
                  },
                  onInput = function(e) {
                    if (isPaste) {
                        e.target.value = that.toPattern(e.target.value, "(999) 999-9999");
                        isPaste = false;
                    }
                  };
              for (var i = 0, len = elements.length; i < len; i++) {
                if (elements[i].addEventListener) {
                  elements[i].addEventListener("keyup", onType);
                  elements[i].addEventListener("keydown", onType);
                  $(elements[i]).bind('paste', onPaste);
                  $(elements[i]).bind('input', onInput);
                } else {
                  elements[i].attachEvent("onkeyup", onType);
                  elements[i].attachEvent("onkeydown", onType);
                }
              }
            } catch(e) {
              console.log("There is no element to bind.");
            }
        };
        var masker = new VanillaMasker({
          // Decimal precision -> "90"
          precision: 2, 
          // Decimal separator -> ",90"
          separator: ',', 
          // Number delimiter -> "12.345.678"
          delimiter: '.', 
          // Money unit -> "R$ 12.345.678,90"
          unit: 'R$', 
          // Force type only number instead decimal,
          // masking decimals with ",00"
          // Zero cents -> "R$ 1.234.567.890,00"
          zeroCents: true
        });
        return masker;
    }
);