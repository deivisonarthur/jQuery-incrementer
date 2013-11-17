// Generated by CoffeeScript 1.6.3
/*!
    Copyright see require on https://github.com/thaibault/require

    Conventions see require on https://github.com/thaibault/require

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This plugin extends an html input field which serves a number to be given.
    Handling validation and easy incrementing or decrementing of
    given value is provided.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    /**
        @memberOf $
        @class
        @extends $.Tools
    
        @param {DomNode} domNode The dom object from where where the plugin
                                 starts to do it's magic.
    */

    var Incrementer, _ref;
    Incrementer = (function(_super) {
      __extends(Incrementer, _super);

      function Incrementer() {
        _ref = Incrementer.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /**
          Saves default options for manipulating the Gui's behaviour.
      
          @property {Object}
      */


      Incrementer.prototype._options = {
        domNodeSelectorPrefix: 'body form div.{1}',
        onInvalidNumber: $.noop(),
        onTypeInvalidLetter: $.noop(),
        logging: false,
        step: 1,
        min: 0,
        max: 9999,
        domNode: {
          plus: '> a.plus',
          minus: '> a.minus'
        },
        neededMarkup: "<a href=\"#\" class=\"plus\">plus</a>\n<a href=\"#\" class=\"minus\">minus</a>"
      };

      /**
          Saves the class name for introspection.
      
          @property {String}
      */


      Incrementer.prototype.__name__ = 'Incrementer';

      /**
          @description Initializes the plugin. Later needed dom nodes are
                       grabbed.
      
          @param {Object} options An options object.
      
          @returns {$.Incrementer} Returns the current instance.
      */


      Incrementer.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        Incrementer.__super__.initialize.call(this, options);
        console.log(this._options.domNodeSelectorPrefix);
        if (this._options.neededMarkup) {
          this.$domNode.wrap($('<div>').addClass(this.camelCaseStringToDelimited(this.__name__))).after(this._options.neededMarkup);
        }
        this.$domNodes = this.grabDomNode(this._options.domNode);
        this.on(this.$domNodes.plus.add(this.$domNodes.minus), 'click', this.getMethod(this._onClick));
        this.on(this.$domNode, {
          keydown: this.getMethod(this._preventOtherThanNumberInput),
          keyup: this.getMethod(this._onChangeInput),
          change: this.getMethod(this._onChangeInput)
        });
        return this;
      };

      /**
          @description This method triggers if a "keydown" event occurs.
                       This callback grantees that only numeric input comes
                       into given dom node.
      
          @param {Function} thisFunction this function itself
          @param {Object} event the event object
      
          @returns {$.Incrementer} Returns the current instance.
      */


      Incrementer.prototype._preventOtherThanNumberInput = function(thisFunction, event) {
        if ($.inArray(event.keyCode, [this.keyCode.BACKSPACE, this.keyCode.DELETE, this.keyCode.LEFT, this.keyCode.RIGHT, this.keyCode.NUMPAD_SUBTRACT]) === -1 && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
          this.fireEvent('typeInvalidLetter', false, this, event);
          event.preventDefault();
        }
        return this;
      };

      /**
          @description This method triggeres if a "click" event on increment
                       or decrement buttons occurs.
      
          @param {Function} thisFunction this function itself
          @param {Object} event the event object
      
          @returns {$.Incrementer} Returns the current instance.
      */


      Incrementer.prototype._onClick = function(thisFunction, event) {
        var currentValue, newValue, plus;
        event.preventDefault();
        currentValue = window.parseInt(this.$domNode.val());
        if (!currentValue) {
          currentValue = 0;
        }
        plus = event.target === this.$domNodes.plus[0] || this.$domNodes.plus.children().filter(event.target).length;
        if (!plus && currentValue - this._options.step >= this._options.min || plus && currentValue < this._options.max) {
          newValue = currentValue - this._options.step;
          if (plus) {
            newValue = currentValue + this._options.step;
          }
          this.$domNode.val(newValue);
        } else {
          this.fireEvent('invalidNumber', false, this, event);
        }
        return this;
      };

      /**
          @description This method triggeres if a "change" event on given dom
                       node occurs.
      
          @param {Function} thisFunction this function itself
          @param {Object} event the event object
      
          @returns {$.Incrementer} Returns the current instance.
      */


      Incrementer.prototype._onChangeInput = function(thisFunction, event) {
        var target, value;
        target = $(event.target);
        value = window.parseInt(target.val(target.val().replace(/[^0-9]+/g, '')).val());
        if (value > this._options.max) {
          this._onInvalidNumber(event, value);
          target.val(this._options.max);
        } else if (value < this._options.min) {
          this._onInvalidNumber(event, value);
          target.val(this._options.min);
        }
        return this;
      };

      /**
          @description This method triggers if an invalid number was given
                       via keyboard input.
      
          @param {Object} event the event object
      
          @returns {$.Incrementer} Returns the current instance.
      */


      Incrementer.prototype._onTypeInvalidLetter = function(event) {
        var character, typedCharInfo;
        typedCharInfo = '';
        character = String.fromCharCode(event.keyCode);
        if (event.keyCode && character.match(/^\w| $/)) {
          typedCharInfo = " (you typed \"" + character + "\")";
        }
        return this.info("Please type a number" + typedCharInfo + ".");
      };

      /**
          @description This method is triggered if a "change" event on given
                       dom node occurs.
      
          @param {Object} event the event object
          @param {String} value the invalid chars
      
          @returns {$.Incrementer} Returns the current instance.
      */


      Incrementer.prototype._onInvalidNumber = function(event, value) {
        var character, typedCharInfo;
        if (value == null) {
          value = '';
        }
        typedCharInfo = '';
        character = String.fromCharCode(event.keyCode);
        if (value) {
          typedCharInfo = " (you typed \"" + value + "\").";
        } else if (event.keyCode && character.match(/^\w| $/)) {
          typedCharInfo = " (you typed \"" + character + "\")";
        }
        return this.info(("Please type a number between \"" + this._options.min + "\" and ") + ("\"" + this._options.max + "\"" + typedCharInfo + "."));
      };

      return Incrementer;

    })($.Tools["class"]);
    /** @ignore*/

    return $.fn.Incrementer = function() {
      return $.Tools().controller(Incrementer, arguments, this);
    };
  })(this.jQuery);

}).call(this);
