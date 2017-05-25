define([], function() {
    var LogoutPopupState = {
        _isOpened: false,
        setIsOpened: function(isOpened) {
            this._isOpened = isOpened;
        },
        isOpened: function() {
            return this._isOpened;
        }
    }
    return LogoutPopupState;
});