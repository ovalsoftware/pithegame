---
---
(function(){
  var viewers = document.querySelectorAll('.digit-viewer');
  viewers.forEach(function(root){
    var src = root.dataset.src;
    var chunk = Number(root.dataset.chunk || 100);
    var shown = Number(root.dataset.initial || 1000);
    var out = root.querySelector('[data-out]');
    var count = root.querySelector('[data-count]');
    var status = root.querySelector('.status');
    var moreBtn = root.querySelector('[data-more]');
    var jump = root.querySelector('[data-jump]');
    var digits = '';

    function render(){
      if(!digits) return;
      var slice = digits.slice(2, 2 + shown);
      var group = 10;                  // digits per space-separated group
      var perLine = chunk;             // digits per line
      var lines = [];
      // First line keeps the leading "3." so it looks natural
      var first = slice.slice(0, perLine);
      lines.push('3.  ' + chunkify(first, group));
      for(var i = perLine; i < slice.length; i += perLine){
        var line = slice.slice(i, i + perLine);
        // Left-pad the line index to align nicely
        var idx = (i + 1).toString();
        while(idx.length < 8) idx = ' ' + idx;
        lines.push(idx + '  ' + chunkify(line, group));
      }
      out.textContent = lines.join('\n');
      var total = digits.length - 2;
      count.textContent = 'Showing ' + shown.toLocaleString() + ' of ' + total.toLocaleString() + ' digits';
      if(shown >= total) moreBtn.style.display = 'none';
    }

    function chunkify(s, n){
      var parts = [];
      for(var i = 0; i < s.length; i += n) parts.push(s.slice(i, i + n));
      return parts.join(' ');
    }

    fetch(src).then(function(r){ return r.text(); }).then(function(t){
      digits = t.trim();
      status.textContent = (digits.length - 2).toLocaleString() + ' digits loaded';
      render();
    }).catch(function(){
      out.textContent = 'Failed to load digits.';
    });

    moreBtn.addEventListener('click', function(){
      shown = Math.min(shown + 10000, digits.length - 2);
      render();
    });

    jump.addEventListener('change', function(){
      var n = Math.max(1, Math.min(digits.length - 2, Number(jump.value) || 1));
      if(n > shown) shown = Math.min(n + 100, digits.length - 2);
      render();
      var linesBefore = Math.floor(n / chunk);
      out.parentElement.scrollTop = linesBefore * 24;
    });
  });
})();
