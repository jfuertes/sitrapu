<?php
	include_once'../config/mysql.php';

	$db       = new EissonConnect();
	$dbh      = $db->enchufalo();
	$q        = "SELECT ts.id_nino, GROUP_CONCAT(DISTINCT ts.email  SEPARATOR ',') as emails, 
			GROUP_CONCAT(DISTINCT CONCAT_WS(',',tvn.id_vacuna,tvn.id_dosis_vacunas,tvn.fecha_vacunacion ) separator '---') as vacunas
			FROM tb_suscripciones ts
			inner join tb_vacunas_x_ninos tvn on tvn.id_nino=ts.id_nino
			GROUP BY tvn.id_nino;";

		$stmt     = $dbh->prepare($q);

		$stmt->execute();
		$r = $stmt->fetch(PDO::FETCH_ASSOC);
var_dump(json_encode($r));

	include('PHPMailer/PHPMailerAutoload.php');
	//$db      = new dbConnect();
	//$dbh     = $db->conectar();

	$body = '<html><head><style>@font-face{font-family:Calibri;panose-1:2 15 5 2 2 2 4 3 2 4;}body{font-family:"Calibri","sans-serif";color:#0154A0}table td{border:1px solid #ddd;} table th{background-color:#1884C0;color:#fff;} span.m-1{color:#15A508} span.m-0{color:#B94444}p.MsoNormal, div.MsoNormal{margin:0cm;margin-bottom:.0001pt;font-size:11.0pt;font-family:"Calibri","sans-serif";} @page WordSection1{size:612.0pt 792.0pt;margin:70.85pt 3.0cm 70.85pt 3.0cm;}div.WordSection1{page:WordSection1;}</style></head><body><div class=WordSection1><p class=MsoNormal><span style="color:#1F497D"> ola k ase?</span></p></div></body></html>';
	try {

  		$name= 'giancarlo.paoli';
  		$domainNet = '@mindtec.pe';
  		$newMail = $name . $domainNet;

		$mail = new PHPMailer(true);
		$mail->isSMTP();
		$mail->Host = 'gator3078.hostgator.com';
		$mail->SMTPAuth = true;
		//Username to use for SMTP authentication
		$mail->Username = "jair.fuertes@mindtec.pe";
		//Password to use for SMTP authentication
		$mail->Password = "Jairf123";

		$mail->setFrom( $newMail, 'Giggio Paoli' );
		//$mail->addReplyTo($correo);
		$mail->isHTML(true);
		$mail->Subject = 'Mensaje de prueba';

		$mail->AddAddress('jfuertesl2@gmail.com');

		//$mail->addCC($data->solicitanteMail);
		//$mail->addCC('prueba@gmail.com');
		$mail->Body    = $body;
		//$mail->AddEmbeddedImage('entel.jpg', 'entel');
		$mail->CharSet = 'utf-8';
		$r = $mail->send();
	} catch (phpmailerException $e) {  $r = $e->errorMessage();	}
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  	echo json_encode($r);


?>