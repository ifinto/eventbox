<?php 

$aReturn[ 'text' ] = '';
if( !empty( $_GET ) )
{
    if( $_GET[ 'type' ] == 'Games' )
    {
        $aReturn[ 'text' ] = 'Text for games';
    }
    else if( $_GET[ 'type' ] == 'Books' )
    {
        $aReturn[ 'text' ] = 'Text for books';
    }
    else if( $_GET[ 'type' ] == 'Comics' )
    {
        $aReturn[ 'text' ] = 'Text for comics';
    }
}
$sJson = json_encode( $aReturn, 1 );
header( 'Content-Type: application/json' );
echo $sJson;

?>