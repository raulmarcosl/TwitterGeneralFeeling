$(function() {
    $(".search-area").focus(function() {
        if (this.value === this.defaultValue) {
            this.value = '';
        }
    })
});

$(function() {
    $(".search-area").blur(function() {
        if (this.value === '') {
            this.value = this.defaultValue;
        }
    })
});
  