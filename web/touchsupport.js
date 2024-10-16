 
 //disable right click
  //window.addEventListener("contextmenu", function(e) { e.preventDefault(); })

  
// TouchSupport Version
var tsVersion='1.0.0';

/* START Optionen */
 
// Mindestdauer der Wischgeste in ms.
var durationMin = 50;

// Max Dauer der Wischgeste in ms.
var durationMax = 350;


// Zurückgelegte Mindestdistanz auf der X-Koordinate.
var distanceTraveledMin = 80;
 
// Abweichung vom Kurs.
var courceTolerance = 80;
 
// Element, das auf Wischgeste geprüft werden soll.
var el = document.getElementById("touchbox");

// Mindestdistanz für Erscheinen des Menüs
var MinSwipeMenue = 30;

 
/* ENDE Optionen */
 
var startX = null;
var startY = null;
var starttime = null;
var showmenu = false;
var iShowSearch = false;
 
var DIVSideMenue = document.getElementById("myVillaSideBar");
 
 
el.ontouchstart = function (e) {

  startX = e.changedTouches[0].pageX;
  startY = e.changedTouches[0].pageY;
  starttime = new Date().getTime();

  if ((screen.width * 0.9) <= startX && isSwipeEnable == true && screen.width < 993) {
    showmenu = true;
  } else {	
	  showmenu = false;
  }

  if ((screen.height * 0.2) >= startY) {
    iShowSearch = true;
  } else {
    iShowSearch = false;
  } 

}
 

el.ontouchend = function (e) {
  
  if (isSwipeEnable == true) {
	
    var endX = e.changedTouches[0].pageX;
    var endY = e.changedTouches[0].pageY;
    var endtime = new Date().getTime();

    if ((screen.width * 0.9 <= endX) && (screen.width < 993)) {
      RemoveOverlay();
      $("#myVillaSideBar").css("width", 265);
    }	


    if (iShowSearch == true && endY-startY > 40) {
      $("[id*='element']").hide();
      modalklick('elementsearch');
    } 

    if (endX > MinSwipeMenue && showmenu) {
      $("#myVillaSideBar").css("width", 265);
    }

    verifyHorizontalSwipe(endX, endY, endtime);
    verifyVerticalSwipe(endX, endY, endtime);

  } else {	

  }

}
 
 

 
el.ontouchmove = function (e01) {

  var x = e01.touches[0].clientX;
  
  if (showmenu) {

    $("#myVillaSideBar").css('filter', 'blur(0px)');
		
		if (screen.width-x >= 265) {
  	  x = 265;
    } else {
		  x = screen.width-x;
		}
    
    if (!NoAdminUserMode && x > MinSwipeMenue) {

      $("#myVillaSideBar").css("width", x);
      $("#IDelementglobal").hide();
      $("#elementsearch").hide();
      $("#myVillaSideBar").show();
      $("#myOverlay").show();
      blurry(true);

    }
	

      //    $("[id*='element']").hide();
	
  }	

}	
 







 
function verifyVerticalSwipe(endX, endY, endtime) {

  // Dauer der Touchgeste in ms:
  var duration = endtime - starttime;
  // Distanz der Touchgeste in Pixel:
  var distanceTraveled = endY - startY;
  // Abweichung der Touchgeste nach oben oder unten in Pixel:
  var deviation = Math.abs(endX - startX);

  if (duration >= durationMin + 200 && Math.abs(distanceTraveled) >= distanceTraveledMin  && deviation <= courceTolerance) {
  }

}	
 

 
 
function verifyHorizontalSwipe(endX, endY, endtime) {
    
  // Dauer der Touchgeste in ms:
  var duration = endtime - starttime;
  // Distanz der Touchgeste in Pixel:
  var distanceTraveled = endX - startX;
  // Abweichung der Touchgeste nach oben oder unten in Pixel:
  var deviation = Math.abs(endY - startY);
 

  // kurzer Strecke Swipe

     // Wischdauer                 // Entfernung <80 
  if ((duration >= durationMin) && (Math.abs(distanceTraveled) < distanceTraveledMin) && (deviation <= courceTolerance)) {
  
    // letzt Page aufrufen
    if (Math.sign(distanceTraveled) == -1 && showmenu == true && Math.abs(distanceTraveled) > MinSwipeMenue) {

// kann gelöscht werden wenn Funktion gegeben
//  if (Math.sign(distanceTraveled) == -1 && showmenu == true) {

        RemoveOverlay()

        $("#myVillaSideBar").css("width", 265);

        if (document.getElementById('TouchArchiv')) {	 
          ajax_menu(AjaxAktPage);
        }

    }
 
  } 
	



  // lange Strecke Swipe
  if (duration >= durationMin && Math.abs(distanceTraveled) >= distanceTraveledMin && deviation <= courceTolerance && duration < durationMax) {
  
    if (Math.sign(distanceTraveled) == 1) {

      if (document.getElementById('TouchArchiv')) {	 	
        document.getElementById("ArchivBack").click();
		  } else {
  	  }

    }

    else if (Math.sign(distanceTraveled) == -1) {

      if (showmenu) {

        $("#myVillaSideBar").css('filter', 'blur(0px)');
        $("#myVillaSideBar").css("width", 265);
        if (!NoAdminUserMode) {
          $("#myOverlay").show();
        }

		  } else {
			  
        if (document.getElementById('TouchArchiv')) {	 	
          document.getElementById("ArchivNext").click();
			  } else {
			  }
		  
		  }
		  
    }
		
  }

}
 


/* Touchgeste soll nicht als Zoom oder Scrollen erkannt werden, wenn der User im entsprechenden Element auf der Seite eine Touchgeste ausführt. */
//el.ontouchmove = function(e){
// e.preventDefault()
//}
  
 
 
/* Maussimulation */
 
el.onmousedown = function (e) {


  // Element mit der ID "IDelementglobal" auswählen
  var element = document.getElementById("IDelementglobal");

  // Berechnete CSS-Stile des Elements abrufen
  var styles = window.getComputedStyle(element);

  startX = e.pageX;
  startY = e.pageY;
  starttime = new Date().getTime();
}
 
el.onmouseup = function (e) {
	
  if (isSwipeEnable == true) {	
	
    var endX = e.pageX;
    var endY = e.pageY;
    var endtime = new Date().getTime();
 
    verifyHorizontalSwipe(endX, endY, endtime);
    verifyVerticalSwipe(endX, endY, endtime);
	
  } else {

  }	

}
