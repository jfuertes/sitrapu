<?php
	$response = array('error' => 'No se recibio ningun parametro' );
	if ( isset( $_GET['id_camara'] )) {
		$id_camara  = $_GET['id_camara'];
		$carros_entrantes  = $_GET['carros_entrantes'];
		$carros_salientes  = $_GET['carros_salientes'];
		try {
			require_once('config/mysql.php');
			$db       = new EissonConnect();
			$dbh      = $db->enchufalo();
			$q = 'INSERT INTO camera (id_camara, carros_entrantes, carros_salientes, hora_guardada) values (:id_camara, :carros_entrantes, :carros_salientes, CURRENT_TIMESTAMP)';
			$stmt = $dbh->prepare($q);
			$stmt->bindParam(':id_camara',  $id_camara, PDO::PARAM_STR);
			$stmt->bindParam(':carros_entrantes',  $carros_entrantes, PDO::PARAM_STR);
			$stmt->bindParam(':carros_salientes',  $carros_salientes, PDO::PARAM_STR);
			$response = $stmt->execute();
		} catch (Exception $e) { $response = array('error' => 'Lo lamento, El servidor esta indispuesto, intentelo mas tarde.' ); }
	}
	echo json_encode($response);
?>