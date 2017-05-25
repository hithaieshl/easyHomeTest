define([
     'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
    ) {
        var Mask = function(el, mask) {
            this.$el = el;
            this.mask = mask;
            this.prevValue = this.$el.val();
            this.ctrlDown = false;
            this.init();
        }
        Mask.prototype.transitionPattern = {
             '9': /\d/
            ,'A': /[A-Za-z]/
        }
        Mask.prototype.ctrlKey = 17;
        Mask.prototype.byPassKeys = [8, 9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
        /**
         * Get current position of the cursor
         * input - HTMLObject
         */
        function getCaretPos(input) {
            // Internet Explorer Caret Position (TextArea)
            if (document.selection && document.selection.createRange) {
                var range = document.selection.createRange();
                var bookmark = range.getBookmark();
                var caret_pos = bookmark.charCodeAt(2) - 2;
            } else {
                // Firefox Caret Position (TextArea)
                if (input.setSelectionRange)
                    var caret_pos = input.selectionStart;
            }
            return caret_pos;
        };
        
        function triggerChangeEvent() {
            this.$el.trigger('change');
        }

        /**
         * Check if current input value is valid
         */
        Mask.prototype.isCorrectValue = function(value) {
            var isValid = true;
            var mask = this.mask;
            //Check every character of the input value
            for (var i = 0; i < value.length; i++) {
                if (this.transitionPattern[mask[i]] !== undefined) {
                    //check all mask characters that have regexp representaion
                    isValid = isValid && this.transitionPattern[mask[i]].test(value[i]);
                    //if current symbol doesn't match regexp check if it match any mask symbols
                    if (!isValid) {
                        for (var j = i; j < mask.length; j++) {
                            //find first mask symbol that have no regexp representation
                            //check if our current symbol is the same and break from cycle
                            if (this.transitionPattern[mask[j]] === undefined) {
                                isValid = mask[j] === value[i]
                                break;
                            }
                        }
                        break;
                    }
                } else {
                    //all symbols in mask that have no regexp representation 
                    // should be treated as they are and added to input value automatically
                    isValid = isValid && (value[i] === mask[i]);
                    //if false no need to check more
                    if (!isValid) break;
                }
            }
            return isValid;
        }

        Mask.prototype.setValue = function(newVal, cursorPos) {
            if (newVal === this.$el.val()) {
                return;
            }
            //check if whole input value is valid (according to our mask)
            if (this.isCorrectValue(newVal)) {
                this.$el.val(newVal);
                //move cursor to the next position
                this.$el[0].setSelectionRange(cursorPos, cursorPos);
                triggerChangeEvent.call(this);
            }
        }

        Mask.prototype.checkSymbol = function(key, value, cursorPos) {
            var valLength = value.length;
            var maskSymbol = this.mask[cursorPos];
            var newVal = value;

            //add key if current cursor position is not out of mask range and is vaid character
            if (this.mask[valLength] !== undefined && this.transitionPattern[maskSymbol] !== undefined && 
                    this.transitionPattern[maskSymbol].test(key)) {
                //inset key into current cursor position
                newVal = value.slice(0, cursorPos) + key + value.slice(cursorPos);
            //if we are not out of mask range but current mask symbol is not a regexp
            } else if (this.mask[valLength] !== undefined && this.transitionPattern[maskSymbol] === undefined) {
                //add mask symbol to the current cursor position and check next mask symbol with current key
                newVal = value.slice(0, cursorPos) + maskSymbol + value.slice(cursorPos);
                newVal = this.checkSymbol(key, newVal, cursorPos + 1);
            }

            return newVal;
        }
        
        Mask.prototype.getMasked = function() {
            var value = this.$el.val();
            var maskedValue = '';
            if (value !== undefined) {
                for (var i = 0; i < value.length; i++) {
                    maskedValue = this.checkSymbol(value[i], maskedValue, maskedValue.length);
                }
            }
            this.setValue(maskedValue);
        }

        Mask.prototype.onKeyDown = function(event) {
            var keyCode = event.keyCode || event.which;

            if (!this.ctrlDown && this.byPassKeys.indexOf(keyCode) === -1) {
                //check if current key is valid for our mask
                event.preventDefault();
                var key = 0;
                //numeric values from side keypad (numberpad) are parsed as letter on key down in String.fromCharCode
                var keyCode = event.which;
                if (keyCode >= 96 && keyCode <= 105) {
                    //assume we get numeric value not from numpad
                    key = String.fromCharCode(keyCode - 48);
                }else  {
                    key = String.fromCharCode(keyCode);
                }
                var cursorPos = getCaretPos(this.$el[0]);
                var value = this.$el.val();
                var maskedValue = this.checkSymbol(key, value, cursorPos);
                var cursorPosOffset = maskedValue.length - value.length;
                this.setValue(maskedValue, cursorPos + cursorPosOffset);
            } else if (keyCode == this.ctrlKey) {
                //check if Ctrl key was pressed
                this.ctrlDown = true;
            }
        }

        Mask.prototype.onKeyUp = function(event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode == this.ctrlKey) {
                this.ctrlDown = false;
            }
            this.bufferValue = this.$el.val();
        }

        Mask.prototype.onPaste = function(event) {
            var prevValue = this.$el.val();
            var pasteData = (event.originalEvent || event).clipboardData.getData('text/plain');
            var self = this;
            var isMatch = _.every(pasteData, function(character, index) {
                var maskSymbol = self.mask[index];
                if (maskSymbol === undefined) {
                    return false;
                }
                if (self.transitionPattern[maskSymbol] === undefined) {
                    return character === maskSymbol
                }
                return self.transitionPattern[maskSymbol].test(character);
            });
            if (!isMatch) {
                event.preventDefault();
                this.$el.val(prevValue);
                triggerChangeEvent.call(this)
            }
        }
        Mask.prototype.onInput = function(event) {
            event.preventDefault();
            var $input = this.$el;
            var currentValue = $input.val();
            var cursorPos = getCaretPos(this.$el[0]);
            var maskSymbol = this.mask[cursorPos - 1];
            var newVal = currentValue;
            var newCursorPosition = cursorPos;
            //remove all mask special symbols from the field
            for (var i = cursorPos; i--;) {
                maskSymbol = this.mask[i];
                if (maskSymbol !== undefined && this.transitionPattern[maskSymbol] === undefined) {
                    newVal = newVal.substring(0, i) + newVal.substring(i + 1, newVal.length);
                    newCursorPosition--;
                //if value is incorrect replace it with the previous one from buffer
                } else if (!this.isCorrectValue(currentValue)) {
                    newVal = this.bufferValue;
                    newCursorPosition = cursorPos + 1
                    break;
                } else {
                    break;
                }
            }
            if (this.isCorrectValue(newVal)) {
                $input.val(newVal);
                $input[0].setSelectionRange(newCursorPosition, newCursorPosition);
                triggerChangeEvent.call(this);
            }
            this.bufferValue = this.$el.val();
        }
        Mask.prototype.init = function() {
            this.$el.on('keydown', _.bind(this.onKeyDown, this));
            this.$el.on('keyup', _.bind(this.onKeyUp, this));
            this.$el.on('paste', _.bind(this.onPaste, this));
            this.$el.on('input', _.bind(this.onInput, this));
            this.getMasked()
        }
        return Mask;
    }
);