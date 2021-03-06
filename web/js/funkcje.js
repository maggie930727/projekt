

// Adres do folderu z wszystkimi podstronami
var src = "/~s175155/backend/"
// zmienna do odblokowywania funkcji administraora 
var ZALOGOWANY = false;
/*
Funkcja ładująca górny pasek
*/
function loadNavbar()
{
	$("#navbar").load( src + '/menu/navbar.html' );
}
/*
Funkcja ładująca lewy panel
*/
function loadLeftpanel()
{
	$("#leftpanel").load( src + '/menu/leftpanel.html' );
}
/*
Funkcja ładująca zawartość
*/
function loadContent( link )
{	
	href = $(link).attr('href');
	// nie przetwarzaj dalej jeśli to ma byc wykonanie jakiegoś skryptu
	if (href.indexOf('javascript:') > -1)
		return;
	// popbieramy odnośnik
	href = href.replace("#", "");


	$('.se-pre-con').fadeIn("fast");
	$("#content").load( src + href , function( response, status, xhr ) {
  		if ( status == "error" ) {
  			// jeśli strona nie istenieje
  			$("#content").html("<div class='row'><img src='/~s175155/images/budowa.gif' style='width:100%'/></div>");
  			$("#content").waitForImages(true).done(function() {
  				$('.se-pre-con').fadeOut("slow");});

  		} else {
  		//Czekaj az załadują się obrazki
		$("#content").waitForImages(true).done(function() {
		    $('.se-pre-con').fadeOut("slow");
		});
		}

	});
	
}
/*
Funkcja wyświetlająca forme do dodania nowego filmu
*/
function dodajFilm() 
{
	// Jeśli nie zalogowany wyswietli error
	if (!ZALOGOWANY)
	{
		// Wyswietlanie komunikatu że nie zalogowany
		$('#alertBox').effect("highlight", 3000);
		setTimeout(function(){$('#alertBox').fadeOut("slow")}, 5000);
		return;
	}
	// Kod HTML formularza
	body = '<form><div class="form-group">'+
	'Podaj tytuł filmu:'+
	'<input name="nazwa" type="text" class="form-control" required>'+
	'Opis filmu:'+
	'<textarea name="opis" class="form-control" placeholder="Podaj opis filmu" required></textarea><hr>'+
	'Cena:'+
	'<input name="cena" type="number" step="0.01" class="form-control" style="width:100px" required>'+
	'Ocena:'+
	'<select id="selectbasic" name="ocena" class="form-control" style="width:100px" required>'+
      '<option value="1">1</option>'+
      '<option value="2">2</option>'+
      '<option value="3">3</option>'+
      '<option value="4">4</option>'+
      '<option value="5">5</option>'+
    '</select><input type=button style="display:none;">'+
	'</div></form>';

	  BootstrapDialog.show({
	  		title: 'Dodaj nowy film',
            message: body,
            buttons: [{
                icon: 'glyphicon glyphicon-send',
                label: 'Dodaj film',
                cssClass: 'btn-primary',
                autospin: true,
                action: function(dialogRef){
                    dialogRef.enableButtons(false);
                    dialogRef.setClosable(false);
                	// Pobieramy uzupełnione elementy formy
                	var dane = dialogRef.getModalBody().find('form').serialize();
                	
                	//Wysyłamy zapytanie POST w celu dodania nowego filmu
                	$.get( src+ "filmy/dodaj.php", dane )
					  .done(function( data ) {
					  	// zamknij okno po załadowaniu
					    dialogRef.close();
					    // odśwież zawartośc strony
					    $("#wszystkie").click();
					  });


       
                }
            }, {
                label: 'Anuluj',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });
        
}

function loguj()
{
	if (!sprawdzForme($("#loginForm")))
		return;

	$("#loginForm a").addClass("disabled");
	$("#loginForm a span").removeClass("hidden");
	//Łączymy się do serwera w celu sprawdzenia danych
	$.getJSON( src + "users.php", $("#loginForm").serialize(), function( data ) {
		
		//Dla efektu odblokuj przycisk z opóźnieniem


		setTimeout(function(){
			$("#loginForm a span").addClass("hidden")
			$("#loginForm a").removeClass("disabled");}, 500);

		if (data.ok == 1)
		{
			setTimeout(function(){pokazPanel($("#loginForm input[name='login']").val())}, 550);
			// ustaw zmienną zalogowany na true
			ZALOGOWANY = true;
		} else 
		{
			//Wyświetl błedy
			$('#loginForm input[name="pass"]').each(function() {this.setCustomValidity('Błędny login lub hasło');});
			sprawdzForme($("#loginForm"));
		}
			
		
	  });


}


//Zmienia logowanie w panel użytkownika

function pokazPanel(login)
{
	//$("#navbar center div").fadeOut("fast");
	$("#navbar center div").html(
		'<ul class="nav navbar-nav pull-right">'+
         '<li class="dropdown">'+
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+
            'Witaj, '+login+'<b class="caret"></b></a>'+
            '<ul class="dropdown-menu">'+
               '<li><a href="#">Profil</a></li>'+
               '<li><a href="#">Zmien hasło</a></li>'+
               '<li><a href="#">Skzynka</a></li>'+
               '<li class="divider"></li>'+
               '<li><a href="#">Skasuj konto</a></li>'+
               '<li class="divider"></li>'+
               '<li><a href="'+src+'/wyloguj.php">Wyloguj</a></li>'+
            '</ul>'+
         '</li>'+
      '</ul>');
}

//sprawdza czy zalogowany
function sprawdzCzyZalogowany()
{
	$.getJSON( src + "czyZalogowany.php", $("#loginForm").serialize(), function( data ) {
		if (data.zalogowany == 1)
		{
			ZALOGOWANY = true;
			pokazPanel(data.admin);
		}
		});
		
}

/*
Funkcja generuje okno modalna zakupu
*/
// id filmu
function kup(id) 
{
	// Kod HTML formularza
	body = '<form><div class="form-group">'+
	'<input type="hidden" name="film_id" value="'+id+'">'+
	'Podaj swoje imie i nazwisko:'+
	'<input name="imie_nazwisko" type="text" class="form-control" required>'+
	'Podaj swój adres:'+
	'<textarea class="form-control" placeholder="Podaj opis filmu" required></textarea><hr>'+
	'</div></form>';

	  BootstrapDialog.show({
	  		title: 'Potwierdź zakup',
            message: body,
            buttons: [{
                icon: 'fa fa-shopping-cart',
                label: 'Kup film',
                cssClass: 'btn-primary',
                autospin: true,
                action: function(dialogRef){
                    dialogRef.enableButtons(false);
                    dialogRef.setClosable(false);
                	// Pobieramy uzupełnione elementy formy
                	var dane = dialogRef.getModalBody().find('form').serialize();
                	
                	//Wysyłamy zapytanie POST w celu dodania nowego filmu
                	$.get( src+ "zamowienia/dodaj.php", dane )
					  .done(function( data ) {
					  	// zamknij okno po załadowaniu
					    dialogRef.close();
					    // przejdź do zakupionych
					    $("#wszystkie").click();
					  });


       
                }
            }, {
                label: 'Anuluj',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });
        
}
// funkcja w budowie
function pokaz(id)
{
	$('#alertBox').effect("highlight", 3000);
	setTimeout(function(){$('#alertBox').fadeOut("slow")}, 5000);
}
//funkcjonalnosc w budowie
function usun(id){
	$('#alertBox').effect("highlight", 3000);
	setTimeout(function(){$('#alertBox').fadeOut("slow")}, 5000);
}
//Wyswietla błędy formy
function sprawdzForme($form){
  if (!$form[0].checkValidity()) {
        $form.find(':submit').click();
        return false;
  }
  return true;
}
