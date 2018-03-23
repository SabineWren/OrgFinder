<?php
/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
	
	mb_internal_encoding("UTF-8");
	
	$connection = new mysqli("localhost","publicselect","public", "cognitiondb");
	if( mysqli_connect_errno() ){
		die( "Connection failed: " . mysqli_connect_error() );
	}
	
	if( !$connection->set_charset("utf8") )echo "Error changing connection character set\n";
	
	//get parameters from query string
	if( isset($_GET['SID']) )$SID = $_GET['SID'];
	
	$prepared_select = $connection->prepare("SELECT Headline, Manifesto FROM tbl_OrgDescription WHERE SID = ?");
	$prepared_select->bind_param("s", $SID);
	$prepared_select->execute();
	
	$meta = $prepared_select->result_metadata();
	while ($field = $meta->fetch_field()) {
		$parameters[] = &$rowKeyValue[$field->name];
	}
	
	call_user_func_array(array($prepared_select, 'bind_result'), $parameters);
	
	//fetch results into $parameters, which references the values of $resultsKeyValue
	while ($prepared_select->fetch()) {
		//copy the resulting row one attribute at a time
		//we use a loop because the contents are references
		foreach($rowKeyValue as $key => $val) {
			$x[$key] = $val;
		}
		$results[] = $x;//save the row
	}
	
	$prepared_select->close();
	$connection->close();
	if(isset($results))echo json_encode($results);
	else echo "null";
?>

