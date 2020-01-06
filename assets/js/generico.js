$(function () {

console.log('carreguei a página');

var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
  ];
  $( "#nome1" ).autocomplete({
    source: availableTags
  });

  $( "#nome" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/nomeClientes',
            type:"POST",
            dataType: "json",
            data: {
            term: request.term
            },
            success: function( data ) {
                console.log('resposta:', data);
                response( data );
            }
        } );
        },
        // source: availableTags,
        minLength: 2,
        select: function( event, ui ) {
            console.log('disparou pq cliquei no item das opções')
        console.log( "Selected: " + ui.item.value + " aka " + ui.item.id + " tipoPessoa: " + ui.item.tipo_pessoa );
        },
        response: function( event, ui ) {
            for (var i = 0; i < ui.content.length; i++){
                if(ui.content[i].label.toLowerCase() == "Calhas Venezianas".toLowerCase() ){
                    console.log('a posição desse cara é: ',i, ui.content[i].label);
                }
                    
                
            }
            console.log('fonte:', ui.content);
        }
    }).focus(function(event) {
      var termo = "";
      termo = $(this).val().trim();
      $(this).autocomplete( "search" , termo );
    });
  
  
  $( "#nome" ).parent('div').addClass('ui-widget');

  $("#nome").on('blur',function(){
    console.log('disparou o blur');
  });
  
  $("#nome").on('change',function(){
    console.log('disparou o change');
  });
  
  $("#nome").on('click',function(){
    $("#nome").keyup();
  });
  
});