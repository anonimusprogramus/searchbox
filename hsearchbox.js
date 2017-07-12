// Author: Ryan Heath
// http://rpheath.com
// Mirs edited

(function($) {
  function HSearchBox(options){
    var defaults = {
      url: '/search',
      param: 'query',
      dom_id: '#livesearch_results',
      delay: 250,
      minChars: 2,
      loading_css: '#livesearch_loading',
      del_id: '#livesearch_del',
      form_id: '#livesearch_form',
      dataType: 'text',
      onInitSearch: function(){},
      onStartSearch: function(){},
      onFinishSearch: function(){}
    }

    this.settings = $.extend({}, defaults, options || {})

    this.loading = function() {
      $(this.settings.loading_css).show()
    }

    this.idle = function() {
      $(this.settings.loading_css).hide()
    }

    this.start = function() {
      this.loading()
      this.settings.onStartSearch()
    }

    this.stop = function() {
      this.idle()
      this.settings.onFinishSearch()
    }

    this.kill = function() {
      $(this.settings.dom_id).fadeOut(50)
      $(this.settings.dom_id).html('')
      $(this.settings.del_id).fadeOut(100)
    }

    this.reset = function() {
      $(this.settings.dom_id).html('')
      $(this.settings.dom_id).fadeOut(50)
      $(this.settings.form_id).val('')
      $(this.settings.del_id).fadeOut(100)
    }

    this.resetTimer = function(timer) {
      if (timer) clearTimeout(timer)
    }

    this.process = function(terms) {
      var currentSearchBox = this
      if (/\S/.test(terms)) {
        $.ajax({
          type: 'GET',
          dataType : currentSearchBox.settings.dataType,
          url: currentSearchBox.settings.url,
          data: {
            search: terms.trim()
          },
          complete: function(data) {
            $(currentSearchBox.settings.del_id).fadeIn(50)
            $(currentSearchBox.settings.dom_id).html(data.responseText)
            if (!$(currentSearchBox.settings.dom_id).is(':empty')) {
              $(currentSearchBox.settings.dom_id).fadeIn(100)
            }
            currentSearchBox.stop()
          }
        })
        return false
      } else {
        currentSearchBox.kill()
      }
    }
  }

  $.fn.hsearchbox = function(configs) {
    var hsearchbox = new HSearchBox(configs)
    hsearchbox.settings.onInitSearch()
    hsearchbox.idle()

    return this.each(function() {
      var $input = $(this)
      $input
        .keyup(function() {
          if ($input.val() != this.previousValue) {
            if (/\S/.test($input.val().trim()) && $input.val().trim().length > hsearchbox.settings.minChars) {
              hsearchbox.resetTimer(this.timer)
              this.timer = setTimeout(function() {
                hsearchbox.start()
                hsearchbox.process($input.val())
              }, hsearchbox.settings.delay)
            } else {
              hsearchbox.kill()
            }
            this.previousValue = $input.val()
          }
        })
    })
  }
})(jQuery)
