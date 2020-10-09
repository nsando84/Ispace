
if (location.hash) {
    $('a[href=\'' + location.hash + '\']').tab('show');
  }
  let activeTab = localStorage.getItem('activeTab');
  if (activeTab) {
    $('a[href="' + activeTab + '"]').tab('show');
  }
  
  $('body').on('click', 'a[data-toggle=\'tab\']', function (e) {
    e.preventDefault()
    let tab_name = this.getAttribute('href')
    if (history.pushState) {
      history.pushState(null, null, tab_name)
    }
    else {
      location.hash = tab_name
    }
    localStorage.setItem('activeTab', tab_name)
  
    $(this).tab('show');
    return false;
  });
  $(window).on('popstate', function () {
   let anchor = location.hash ||
      $('a[data-toggle=\'tab\']').first().attr('href');
    $('a[href=\'' + anchor + '\']').tab('show');
  });
