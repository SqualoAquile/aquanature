$(function () {
   
    var linhatot = `<tr role="row" class="d-flex flex-column flex-lg-row text-center border-2">
                        <td class="col d-flex"> <label class="col font-weight-bold"> TOTAIS </label></td>`;        
                        
    for(var col = 1; col < $('thead tr th').length; col++){
        var totP = 0; totE = 0, aux1 = 0, aux2 = 0, aux = '';
        
        for( var lin = 0; lin < parseInt( $('tbody tr').length ); lin++ ){
            aux = '';
            aux = $('tbody tr:eq('+lin+') td:eq('+col+')').text();
            aux = aux.split('|');
            
            aux1 = parseInt( aux[0] );
            totP += aux1; 
            aux2 = parseInt( aux[1] );
            totE += aux2;
            
        }
        linhatot += "<td class='col d-flex'> <label class='col font-weight-bold'>"+totP+'  |  '+totE+"</label></td>";        
    }    

    linhatot += `</tr>`;
    $('tbody ').append(linhatot);         
    
    // clicar no botão e fazer um toggle de aparecer só o dia atual e aparecer todos os dias
    

    var dias = [];
    for (var i = 1; i < $('thead tr th').length; i++ ){
        var dia = '', aux = $('thead tr th:eq('+i+')').text();
            dia = aux.split('|')[0];
            dia = dia.substring(0, dia.length - 8).trim();
        $('#opcoes').append('<option value="'+i+'" >'+dia+'</option>');
    }
    $('#opcoes').change(function(){

        if( $('#opcoes').find(':selected').val() != '' ){
            for(var col = 1; col < $('thead tr th').length; col++){
                $('th:eq('+col+'), td:eq('+col+')').css('color','#000');
                for( var lin = 0; lin < parseInt( $('tbody tr').length ); lin++ ){
                    $('tbody tr:eq('+lin+') td:eq('+col+')').css('color','#000');                    
                }
                
            }
            
            for(var col = 1; col < $('thead tr th').length; col++){
                if( col != $('#opcoes').find(':selected').val() ){
                    $('th:eq('+col+'), td:eq('+col+')').css('color','#f8f9fa');
                    for( var lin = 0; lin < parseInt( $('tbody tr').length ); lin++ ){
                        $('tbody tr:eq('+lin+') td:eq('+col+')').css('color','#f8f9fa');                    
                    }
                }
            }   
        }else{
            for(var col = 1; col < $('thead tr th').length; col++){
                $('th:eq('+col+'), td:eq('+col+')').css('color','#000');
                for( var lin = 0; lin < parseInt( $('tbody tr').length ); lin++ ){
                    $('tbody tr:eq('+lin+') td:eq('+col+')').css('color','#000');                    
                }
                
            }   
        }
         

    });
    
});