<?php
	//42579084
	//41225079
	$response = array('error' => 'No se recibio ningun parametro de busqueda.' );
	if ( isset( $_GET['valor'] )) {
		$valor  = $_GET['valor'];
		var_dump($valor);
		try {

			require_once('config/mysql.php');
			$db       = new EissonConnect();
			$dbh      = $db->enchufalo();
			$id_sensor=99;
			$temperatura=9999;
			list($id_sensor, $temperatura) = split(',', $valor);
			var_dump($id_sensor);
			var_dump($temperatura);

			$q = 'INSERT INTO temperatura (id_sensor, temperatura, created_at) 
					values (:id_sensor, :temperatura, CURRENT_TIMESTAMP)';
			
			$stmt = $dbh->prepare($q);
			$stmt->bindParam(':id_sensor',  $id_sensor, PDO::PARAM_STR);
			$stmt->bindParam(':temperatura',  $temperatura, PDO::PARAM_STR);
			$response = $stmt->execute();
		
			
		} catch (Exception $e) {
			$response = array('error' => 'Lo lamento, El servidor esta indispuesto, intentelo mas tarde.' );
		}

	}
	echo json_encode($response);
?>