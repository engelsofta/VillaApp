
// Globale Variable

var dplist = [];

var AjaxAktPage = 'villa';
var datum = new Date();
var MonthforArc = '';
var AjaxHandle = '';
var AjaxHandle2 = '';
var Para02 = '';
var AjaxArchivTyp = '';
var AjaxFilter = '';

var AjaxFilerStart = '';
//var AjaxFilerEnd   = '';

var AjaxAktion = '0';
var AjaxArchivMode = '50';
var AjaxIsZaehler = '';

var AjaxSummeArchiv = [];
var AjaxSummeYear = [];
var AjaxSummeCol = [];

var sleeprefresh = false;

var LastDPSearch = [];

var ShowConsoleLog = false;

// allow to swipe
var isSwipeEnable = true;

// Snackbar
var asnackjoblist = [];
var intervalsnack = clearInterval(ShowSnack);  
var isInterval = false; 



// check if <input> is changed ...
function InitCheckAndSend() { 

  var OldInputValue, JSAction, JSExtVarName;

  $(".CheckAndSend").on("focus", function(){
    OldInputValue = $(this).val();
    JSAction = $(this).data('jsactiondata');
    JSExtVarName = $(this).data('jsextvarname');
  })

  
  $(".CheckAndSend").on("input", function(){

    if (OldInputValue != $(this).val()) {

      $(this).addClass("w3-leftbar w3-rightbar");
    } else {
      $(this).removeClass("w3-leftbar w3-rightbar");
    }

  })


  $(".CheckAndSend").on("blur", function(){

    if (OldInputValue != $(this).val()) {
      console.log('Wert von ' + JSExtVarName + ' geändert von "' + OldInputValue + '" auf "' + $(this).val() + '" -> informiere Server');
      SendPost('', JSExtVarName + ';' + $(this).val(), JSAction, AjaxHandle);
      $(this).removeClass("w3-leftbar w3-rightbar");
    }

  })

}








// Wenn Seite geladen ist
$(document).ready(function() {


  // SlideOut Loader...
  $('#DIVloader').fadeOut();
  
  $.get('/menue/' + StartPage + '.html', function(data) {
    $('#idmain').html(data);
    CollectDataNew('RemoveHide');
  })
    


  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-Q5Z5LQ6NH8');




  //  NoAdminUserMode
  if (NoAdminUserMode) {
  
    $('#myVillaSideBar, #IDHamburger, #DivArchivRight, #DivTopMenueRight, #IDSettingsIconOben').removeClass().addClass('w3-hide');

    $("#IDMainName").attr("onclick","ajax_menu(StartPage)");
    $("#idmain").css("margin-right", "0px");

  } else {
  }





  // refresh für Elemente, welche sich nach einem resize neu ausrichten müssen
  const REFRESH_INTERVAL = 250;
  const REFRESH_CLASS_NAME = "refreshable";

  const debounce = (func) => {
    let requestId;
    return (...args) => {
      cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(() => func.apply(this, args));
    };
  };

  const refreshHandler = () => {
    const elementsToRefresh = $(`.${REFRESH_CLASS_NAME}`);
    if (elementsToRefresh.length === 0) {
      return;
    }
    for (let i = 0; i < elementsToRefresh.length; i++) {
      const element = elementsToRefresh[i];
      const functionName = $(element).data("runjs") || REFRESH_FUNCTION_NAME;
      if (typeof window[functionName] === "function") {
        window[functionName](element);
      }
    }
  };

  $(window).on('resize', debounce(refreshHandler));

});











// When the user clicks anywhere outside of the modal, close it/all
$("[id*='element']").click(function(event){

  if (event.target.id.includes('element')) {
    $(this).hide();
    RemoveOverlay()
    $('#IDelementglobal').html('');	
    isSwipeEnable = true;
  }
	
});






// data-datapoint="" data-mode="" data-pic="" data-col00="" data-col01="" data-col02="" data-animate=""
// Livewerte vom ProGraf holen

function CollectDataNew(par) { 
  

  let ArrRequestSend = [];
  let iZaehlerDivs = 0;

  let ArrDivToFill = Array.from(document.querySelectorAll("div[id^='DIVCollect']"));

  ArrDivToFill.forEach(function(element) {
    ArrRequestSend.push( $(element).attr('data-datapoint') + '´' + $(element).attr('data-mode') + '´' + $(element).attr('data-pic') + '´' + $(element).attr('data-col00') + '´' + $(element).attr('data-col01') + '´' + $(element).attr('data-col02')+ '´' + $(element).attr('data-animate'));
  })


  let url = "getvalue2.htm?sData=" + encodeURIComponent(JSON.stringify(ArrRequestSend));

  $.ajax({
    url: url,
    dataType: "json",


    // ajax request OK
    success: function(response) {

      // check each Div
      ArrDivToFill.forEach(function(element) {

        if (sleeprefresh == true) {
          return false;
        }

        iZaehlerDivs++;
        let JsonAnswer = response['ct' + iZaehlerDivs];
        let JsonJS = response['js' + iZaehlerDivs];
        let OldJSValue = ArrDivToFill[iZaehlerDivs-1][2];

        // change content detected

        if (JsonAnswer !== ArrDivToFill[iZaehlerDivs-1].innerHTML) {

          if (ShowConsoleLog) {
            console.log('%c<-- ' + ArrDivToFill[iZaehlerDivs-1].innerHTML, 'color: #CD3333');
	          console.log('%c--> ' +  ArrDivToFill[iZaehlerDivs-1] + '     ' + JsonAnswer, 'color: #bada55');
          }

          ArrDivToFill[iZaehlerDivs-1].innerHTML = JsonAnswer;
          ArrDivToFill[iZaehlerDivs-1][1] = JsonAnswer;

        }


        // change JS detected
        if (JsonJS !== OldJSValue) {

          if (ShowConsoleLog) {
            console.log('%c<-- ' + OldJSValue, 'color: #CD3333');
	          console.log('%c--> ' + JsonJS, 'color: #87CEFA');
          }

          ArrDivToFill[iZaehlerDivs-1][2] = JsonJS;
          eval(JsonJS);

        }


      });
       
      if (par === 'RemoveHide') {
        $('#idmain').removeClass("w3-hide");
        $('#DIVloader').fadeOut();
      }

    },

    // ajax request NOT OK
    error: function(xhr, status, error) {
      console.error('AJAX request failed. Status: ' + status + '. Error: ' + error);
    }

  });



};





myinterval = setInterval(function() { 
  if (sleeprefresh == true) return false;
  CollectDataNew(); 
}, 3000);







function SendPost(elmnt, page, aktion, handle) {
  sleeprefresh = true;
  const newName = 'ok';

  const encodedPage = encodeURIComponent(page);
  const encodedAktion = encodeURIComponent(aktion);
  const encodedHandle = encodeURIComponent(handle);

  $.ajax({
    type: 'POST',
    url: `villa.htm?page=${encodedPage}&aktion=${encodedAktion}&handle=${encodedHandle}`,
    data: encodeURI(`name=${newName}`),
    success: function(response) {
      if (response.includes("check0815")) {
        const aktionResult = response.replace("check0815", "");
        const [message, type, duration] = aktionResult.split(';');
        snackbar(message, type, duration);
      } else {
        const error = 'Da ist etwas schief gelaufen';
        const errorMessage = response ? `: ${response}` : '';
        alert(`${error}${errorMessage}`);
        $.get(`/menue/${StartPage}.html`, function(data) {
          $('#idmain').html(data);
        });
      }
    },
    error: function(xhr, status, error) {
      alert(`Keine Verbindung zum WebServer! ${xhr.status}`);
    },
    complete: function() {
      sleeprefresh = false;
    }
  });
}






function snackbar(snackbild, snackcolor, snackhtml) {
  asnackjoblist.push([snackbild, snackcolor, snackhtml]);

  if (!isInterval) {
    intervalsnack = setInterval(ShowSnack, 4000);
    isInterval = true;
    ShowSnack();
  }
}







function ShowSnack() {
  var x = $("#snackbar");

  if (asnackjoblist.length < 1) {
    x.removeClass("show");
    $('#DIVCollectMainHandle, #IDMainName').fadeIn(1000);
    clearInterval(intervalsnack);
    isInterval = false;
  } else {
    if (x.hasClass("show")) {
      if (asnackjoblist.length === 1) {
        x.html('<table style="width:100%;height:100%;text-align:center"><tr><td style="width:40px"><span class="w3-xlarge w3-text-' + asnackjoblist[0][1] + ' ' + asnackjoblist[0][0] + '"></span></td><td class="w3-animate-top w3-text-white w3-tiny">' + asnackjoblist[0][2] + '</td></tr></table>');
      } else {
        x.html('<table style="width:100%;height:100%;text-align:center"><tr><td style="width:40px"><span class="w3-xlarge w3-text-' + asnackjoblist[0][1] + ' ' + asnackjoblist[0][0] + '"></span></td><td class="w3-animate-top w3-text-white w3-tiny">' + asnackjoblist[0][2] + '</td><td style="width:35px;"><span class="w3-left w3-badge w3-tiny w3-dark-grey w3-opacity">' + asnackjoblist.length + '</span></td></tr></table>');
      }
    } else {
      $("#IDMainName").fadeOut(100);
      x.addClass("show").html('<table style="width:100%;height:100%;text-align:center"><tr><td style="width:40px"><span class="w3-xlarge  w3-text-' + asnackjoblist[0][1] + ' ' + asnackjoblist[0][0] + '"></span></td><td class="w3-text-white w3-tiny">' + asnackjoblist[0][2] + '</td></tr></table>');

      if ($('#IDSettingsIconOben').not('.w3-hide') && screen.width < 993) {
        $("#DIVCollectMainHandle").fadeOut(500);
      }
    }

    asnackjoblist.shift();
  }
}




function modalklick(modalid) {

//  $("[id*='element']").hide();

  $('#myVillaSideBar, #myOverlay').hide();
  $('#myVillaSideBar, #idmain').css('filter', 'blur(6px)');
  blurry(true);
  
  isSwipeEnable = false;
  
//  $("#bottommenue").css('filter', 'opacity(.8) blur(6px)');
  $("#" + modalid).show();


  // Autofocus Searchfeld und DPList wird eingelesen
  if (modalid === 'elementsearch') {

    // VerlaufsIcon verstecken wenn Verlauf noch leer ist
    if (LastDPSearch.length < 1) {
      $('[id^=IDLastSearch]').addClass("w3-hide");
    }  else {
      $('[id^=IDLastSearch]').removeClass("w3-hide");
    }

    // Focus setzen und Inhalt löschen
    $( "#myInputSearch" ).focus().val("");

  }
  
}






// Toggle between showing and hiding the sidebar, and add overlay effect

function w3_open() {
  $("#myVillaSideBar").css('filter', 'blur(0px)');

  if ($("#myVillaSideBar").is(":visible")) {
    RemoveOverlay();
  } else {
    $("#myVillaSideBar, #myOverlay").show();
//    $("#idmain, #bottommenue").css('filter', 'opacity(.8) blur(6px)');
    $("[id*='element']").hide();
    blurry(true);
  }
}



function blurry(bIsBlur) {

  if (bIsBlur) {
    $("#idmain, #bottommenue").css('filter', 'opacity(.8) blur(4px)');
  } else {

  }

}





function RemoveOverlay() {

  // Alles wieder aufhellen
  $('#myOverlay, #myVillaSideBar').hide();
  
  // Alles wieder scharf machen
  $('#idmain, #myVillaSideBar, #bottommenue').css('filter', 'blur(0px)');

}





function ShowDIVloader() {
  $('#DIVloader').show();

  if (AjaxHandle > 0 && !NoAdminUserMode) {
    $('[id^=IDSettingsIcon]').removeClass("w3-hide");
  } else {
    $('[id^=IDSettingsIcon]').addClass("w3-hide");
  }
}




// AJAX SECTION ----------------------------------------------------------------------------


function ajax_arcmodal(DestElement, AjaxPage) {

  ShowDIVloader();
  $(DestElement).html('').show();

  isSwipeEnable = false;

  var TempLink = 'villa.htm?page=' + AjaxPage + '&handle=' + AjaxHandle + '&aktion=10';
		
  $('#myVillaSideBar').css('filter', 'opacity(.8) blur(6px)');
  blurry(true);

  $.get(TempLink, function(data) {
    $(DestElement).html(data);
	  $('#DIVloader').fadeOut();
  })
	
}






function ajax_default(DestElement, AjaxPage) {

  ShowDIVloader();
	 
  var TempLink = 'villa.htm?page=' + AjaxPage + '&handle=' + AjaxHandle + '&aktion=10';
	
  $(DestElement).html('');	
  $.get(TempLink, function(data) {
    $(DestElement).html(data);
    $('#DIVloader').fadeOut();
    CollectDataNew();
  })

}



function ajax_status(DestElement, AjaxPage) {

  ShowDIVloader();

  $("#bottommenue").addClass("w3-hide");
  $('[id*=element]').fadeOut(); 
  
  $.get(AjaxPage, function(data) {
    RemoveOverlay();
    $(DestElement).html(data);	
    $('#DIVloader').fadeOut();
    CollectDataNew();
  })
	
}





function ajax_menu(mainPage) {

  ShowDIVloader();
  AjaxAktPage = mainPage;
  AjaxFilter = '';
  datum = new Date();
  AjaxArchivMode = '50';
  RemoveOverlay();

  $('#bottommenue, #idmain').addClass("w3-hide");
  $('[id^=btnMain]').removeClass("wandy-buttonback");
  $('#btnMain' + mainPage).addClass("wandy-buttonback");
		
  $.get('/menue/' + mainPage + '.html', function(data) {
    $('#idmain').html(data);	
    CollectDataNew('RemoveHide');
  })

}





function ajax_callarchiv(DestElement) {

  ShowDIVloader();
  isSwipeEnable = true;

  AjaxArchivTyp = 'event'

  if (AjaxAktion === '1') {
    datum = new Date();

    AjaxHandle2 = '';

    AjaxAktion  = '0';
	  AjaxFilter = '';
	  AjaxSummeArchiv01 = '';
 	  AjaxSummeArchiv02 = '';
  } 


  // Anpassung Buttons
  
  
  $('#btnfilter, #btnCalenderPlus').removeClass("w3-text-blue").addClass("w3-text-white");
  $('#IDelementglobal').fadeOut();

  
  var TempLink = 'villa.htm?page=ajax_archiv&handle=' + AjaxHandle + '&aktion=10&pagepara= ' + datum.toLocaleDateString('de-DE') + ',' + Para02 + ',' + AjaxFilter + ',' + AjaxHandle2 + ',' + AjaxArchivMode + ',,';

  $.get(TempLink, function(data) {
    RemoveOverlay();
    $('[id^=btnResetArc]').addClass("w3-hide");
    $(DestElement).html(data);
    $('#DIVloader').fadeOut();
    $("#bottommenue").removeClass("w3-hide");
  })
	
}


// AJAX SECTION ENDE -----------------------------------------------------------------------





// Zwischenablage
function CopyClipboard(sTextToCopy) {
  // (1) Versuch
  navigator.clipboard.writeText(sTextToCopy);

  // (2) Versuch
  var aux = $("<input>")
    .val(sTextToCopy)
    .appendTo("body")
    .select()
    .trigger("focus");
  document.execCommand("copy");
  aux.remove();

  snackbar('la la-clipboard', 'indigo', `${sTextToCopy}<br>wurde kopiert`);
}












function autocomplete(inp, arr) {
  var currentFocus;
//  var counter = 0;
  var TempIcon;

  $(inp).on("input", function(e) {
    var val = this.value.toUpperCase();
    closeAllLists();
    $(".autocomplete-items-last").remove();

    if (!val) return false;
    currentFocus = -1;

    var $a = $("<div>")
      .attr("id", this.id + "c")
      .attr("onclick", "search_kick()")
      .addClass("autocomplete-items");
    $(this).parent().append($a);

    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0].toUpperCase().includes(val)) {

        var $b = $('<div class="autocomplete-items-list CenterThings w3-hover-opacity">');

        if (arr[i][2] === "0") TempIcon = "las la-database";
        if (arr[i][2] === "1") TempIcon = "las la-exchange-alt";
        if (arr[i][2] === "2") TempIcon = "las la-chart-line";

        $b.html(
          '<div class="CenterThings w3-margin-right" style="width:35px;"><span class="w3-large w3-text-white ' + TempIcon +
            '"></span></div><div class="FontRespo03" style="pointer-events: none; width: calc(100% - 105px)">' +
            arr[i][0] +
            '</div>' + 
            '<div class="CenterThings FontRespo03" style="text-align:center; margin-left:auto; pointer-events: none; width:90px;" id="DIVCollect' + i + '" data-datapoint="' + arr[i][1] + '" data-mode="" data-pic="" data-col00="" data-col01="" data-col02="" data-animate=""><div class="w3-spin CenterThings" style="width:100%; height:100%;"><i class="las la-spinner w3-large gradient-text"></i></div></div>' +
            '<input type="hidden" name="' +
            arr[i][1] +
            '" value="' +
            arr[i][0] +
            '">'
        );


        $b.on("click", function() {
          $(inp).val($(this).find("input").val());
          AjaxHandle = $(this).find("input").attr("name");
          LastDPSearch.push([AjaxHandle, $(inp).val(), $(this).find("input").attr("id")]);
          closeAllLists();
        });

        $a.append($b);
      }
    }
    
  });




  $(inp).on("keydown", function(e) {
    var $x = $(".autocomplete-items > div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive($x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive($x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1 && $x.length) {
        $x.eq(currentFocus).click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x.eq(currentFocus).addClass("autocomplete-active");
  }

  function removeActive(x) {
    x.removeClass("autocomplete-active");
  }

  function closeAllLists(elmnt) {
    $(".autocomplete-items").not(elmnt).remove();
  }

  $(document).on("click", function(e) {
    closeAllLists(e.target);
  });
}






function search_kick(){

  $('#elementsearch').fadeOut();
  AjaxAktion='1';
  AjaxArchivMode='50';
  $('#myInputSearch').val("");
  ajax_callarchiv('#idmain');
}




function Switch_Search(){

  //$(".autocomplete-items-last").remove();
 
  SearchElement = document.getElementById("myInputSearch");
  
   a = document.createElement("DIV");
   a.setAttribute("class", "autocomplete-items-last");
   /*append the DIV element as a child of the autocomplete container:*/
   SearchElement.parentNode.appendChild(a);
 
   /*for each item in the array...*/
   for (i = LastDPSearch.length-1; i > -1; i--) {
     
       /*create a DIV element for each matching element:*/
       b = document.createElement("DIV");
       b.setAttribute("class", "autocomplete-items-last-list CenterThings w3-hover-opacity");

       b.innerHTML += '<div class="w3-margin-left FontRespo03" style="pointer-events: none; width: 100%;">' + LastDPSearch[i][1] + '</div>';

// checken was das ist       
//       b.innerHTML += '<div class="w3-brown w3-large ' + LastDPSearch[i][2] + '" style="min-width:40px;"></div>';

       b.innerHTML += '<div class="CenterThings FontRespo03" style="text-align:center; margin-left:auto; pointer-events: none; width:90px;" id="' + 'DIVCollectSearchHistory' + LastDPSearch[i][0] + '" data-datapoint="' + LastDPSearch[i][0] + '" data-mode="" data-pic="" data-col00="" data-col01="" data-col02="" data-animate=""><div class="w3-spin CenterThings" style="width:100%; height:100%;"><i class="las la-spinner w3-large gradient-text"></i></div></div>'
 

       b.setAttribute("onclick", 'AjaxHandle = ' + LastDPSearch[i][0] + '; search_kick(); ');
 
       a.appendChild(b);
       
   }
   
   CollectDataNew();
 
 }









// Eventlistener für Klick auf Trigger-Element hinzufügen
$(document).on('click', '.dropdown-item', function(event) {

  event.stopPropagation(); // Ereignisausbreitung verhindern

  $(`div[id^="seGW"]`).css(`display`, `none`);
  $(`div[id^="seSet"]`).css(`display`, `none`);
  $(`#se05Main`).css(`display`, `block`);

  const $this = $(this);
  const JSVcontition = $this.attr('value');
  const JSVSendMode = $this.data('sendmode');
  const JSVFieldName = $this.data('fieldname');
  
  SendPost(this,JSVFieldName+';'+JSVcontition, JSVSendMode, AjaxHandle);

})




/* Check if fade text available */
$("#idmain").on("click", ".HelpClick", function(event) {
  const $HToggle = $(this).find(".HelpToggle");
  $HToggle.fadeToggle();
});




/*Check if hover text available*/
$("#idmain").on("click", ".more_info", function(event) {
  const $this = $(this);
  const $title = $this.find(".title");
  if (!$title.length) {
    $this.append('<span class="title">' + $this.attr("data-tooltip") + '</span>');
  } else {
    $title.remove();
  }
});



// Copy to Clipboard
$('body').on( "click", ".clipboard", function( event ) {
   
  var copyText = $(this).text();

  navigator.clipboard.writeText(copyText).then(() => {
    /* clipboard successfully set */
  }, () => {
    /* clipboard write failed */
    copyText.select();
    document.execCommand("copy");
  });

  snackbar('la la-clipboard', 'indigo', `${copyText}<br>wurde kopiert`);

});
