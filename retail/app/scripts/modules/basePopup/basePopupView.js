define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

	 // Template
    ,'requirejs-text!modules/basePopup/basePopupTemplate.html'
	
    // Backbone extension for two way data-binding (View<->Model)
    ,'backbone.stickit'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'
    
    ,'helpers/backbone/stickit'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,basePopupTemplate
    ) {
	var BasePopupView = Backbone.View.extend({
		tagName: 'div'
		,model: {}
		,name: "BasePopupView"
		,template: basePopupTemplate
		,popupContainer: null
		,options: {
			className: '',
			setFocusOnFirstFormControl:true,
			backgroundClickClosesPopup: true,
		}
		,templates: {
			 header: ''
			,content: ''
			,footer: ''
		}
		,events: {
			'click #js-overlay': '_overlayClick'
		}

		,_overlayClick: function( event) {
			if( event.target.id === 'js-overlay' && this.options.backgroundClickClosesPopup) {
				this.hide();
			}
		}

		,_setFocusOnFirstFormControl: function() {
			var controls = $("input, select, email, url, number, range, date, month, week, time, datetime, datetime-local, search, color", $(this.el));
			if( controls.length > 0) {
				$(controls[0]).focus();
			}
		}

		,_destroy: function() {
			// COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			this.$el.removeData().unbind(); 

			// Remove view from DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);
		}
		
		,render: function() {
			var self = this;
			if( this.popupContainer !== null) {
				this._destroy();
			}

			if( this.popupContainer == null) {

				var $content = $(this.template);
				
				if (this.options.showCloseButton) {
					$content.find('header').append('<span class="close"></span>');
				}
				if (this.options.className) {
					$content.find('.popup').addClass(this.options.className);
				}
				
				$content.find('header').append(this.templates.header);
				$content.find('.content').append(this.templates.content);
				$content.find('footer').append(this.templates.footer);
				
				var linkedTemplate = _.template($content[0].outerHTML)(this.model);
				
				this.popupContainer = $.parseHTML(linkedTemplate);
				
				this.$el.html(this.popupContainer);
				
				// Render the template
				$('body').append(this.el);
				
				if (self.options.setFocusOnFirstFormControl) {
					self._setFocusOnFirstFormControl();
				}
				
				// Initialize stickit with view.bindings and view.model
				this.stickit();
				
				// Initialize validation of this view model attributes
				Backbone.Validation.bind(this);
				
				this.model.validate();
			}
			return self;
		}
		
		,hide: function() {
			var self = this;
			self._destroy();
			self.trigger( 'close');
		}
		
	})
	
	return BasePopupView;
})