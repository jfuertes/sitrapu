
<HTML>
<BODY>

<meta charset="utf-8"> 
<?php
require_once("../api/RandomClass.php");

//Creamos un objeto de la clase randomTable
$rand = new RandomTable();
//insertamos un valor aleatorio
//$rand->insertRandom();
//obtenemos toda la información de la tabla random
$rawdata1 = $rand->getAllInfo(1);
$rawdata2 = $rand->getAllInfo(2);
$rawdata3 = $rand->getAllInfo(3);
$rawdata4 = $rand->getAllInfo(4);
$rawdata5 = $rand->getAllInfo(5);
//var_dump($rawdata);
//nos creamos dos arrays para almacenar el tiempo y el valor numérico
$valoresArray1;
$valoresArray2;
$valoresArray3;
$valoresArray4;
$valoresArray5;
$timeArray1;
$timeArray2;
$timeArray3;
$timeArray4;
$timeArray5;
//en un bucle for obtenemos en cada iteración el valor númerico y 
//el TIMESTAMP del tiempo y lo almacenamos en los arrays 
for($i = 0 ;$i<count($rawdata1);$i++){
    $valoresArray1[$i]= $rawdata1[$i]["temperatura"];
    $publishDate1 = DateTime::createFromFormat('Y-m-d H:i:s', $rawdata1[$i]["created_at"]);
    $timeArray1[$i]= $publishDate1->getTimestamp()*1000;
}

for($i = 0 ;$i<count($rawdata2);$i++){
    $valoresArray2[$i]= $rawdata2[$i]["temperatura"];
    $publishDate2 = DateTime::createFromFormat('Y-m-d H:i:s', $rawdata2[$i]["created_at"]);
    $timeArray2[$i]= $publishDate2->getTimestamp()*1000;
}

for($i = 0 ;$i<count($rawdata3);$i++){
    $valoresArray3[$i]= $rawdata3[$i]["temperatura"];
    $publishDate3 = DateTime::createFromFormat('Y-m-d H:i:s', $rawdata3[$i]["created_at"]);
    $timeArray3[$i]= $publishDate3->getTimestamp()*1000;
}

for($i = 0 ;$i<count($rawdata4);$i++){
    $valoresArray4[$i]= $rawdata4[$i]["temperatura"];
    $publishDate4 = DateTime::createFromFormat('Y-m-d H:i:s', $rawdata4[$i]["created_at"]);
    $timeArray4[$i]= $publishDate4->getTimestamp()*1000;
}

for($i = 0 ;$i<count($rawdata5);$i++){
    $valoresArray5[$i]= $rawdata5[$i]["temperatura"];
    $publishDate5 = DateTime::createFromFormat('Y-m-d H:i:s', $rawdata5[$i]["created_at"]);
    $timeArray5[$i]= $publishDate5->getTimestamp()*1000;
}

?>
<div id="contenedor"></div></br>
<div id="contenedor2"></div></br>
<div id="contenedor3"></div></br>
<div id="contenedor4"></div></br>

    <!-- Importo el archivo Javascript de Highcharts directamente desde su servidor -->

<script>

chartCPU = new Highcharts.StockChart({
    chart: {
        renderTo: 'contenedor'
        //defaultSeriesType: 'spline'
        
    },
    rangeSelector : {
        enabled: false
    },
    title: {
        text: 'Gráfica de Temperatura del sensor 1'
    },
    xAxis: {
        type: 'datetime'
        //tickPixelInterval: 150,
        //maxZoom: 20 * 1000
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
            text: 'Valores',
            margin: 10
        }
    },
    series: [{
        name: 'Valor',
        data: (function() {
                // generate an array of random data
                var data = [];
                <?php
                    for($i = 0 ;$i<count($rawdata1);$i++){
                ?>
                data.push([<?php echo $timeArray1[$i];?>,<?php echo $valoresArray1[$i];?>]);
                <?php } ?>
                return data;
            })()
    }],
    credits: {
            enabled: false
    }
});


chartCPU2 = new Highcharts.StockChart({
    chart: {
        renderTo: 'contenedor2'
        //defaultSeriesType: 'spline'
        
    },
    rangeSelector : {
        enabled: false
    },
    title: {
        text: 'Gráfica de Temperatura del sensor 2'
    },
    xAxis: {
        type: 'datetime'
        //tickPixelInterval: 150,
        //maxZoom: 20 * 1000
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
            text: 'Valores',
            margin: 10
        }
    },
    series: [{
        name: 'Valor',
        data: (function() {
                // generate an array of random data
                var data = [];
                <?php
                    for($i = 0 ;$i<count($rawdata2);$i++){
                ?>
                data.push([<?php echo $timeArray2[$i];?>,<?php echo $valoresArray2[$i];?>]);
                <?php } ?>
                return data;
            })()
    }],
    credits: {
            enabled: false
    }
});

chartCPU2 = new Highcharts.StockChart({
    chart: {
        renderTo: 'contenedor3'
        //defaultSeriesType: 'spline'
        
    },
    rangeSelector : {
        enabled: false
    },
    title: {
        text: 'Gráfica de Temperatura del sensor 3'
    },
    xAxis: {
        type: 'datetime'
        //tickPixelInterval: 150,
        //maxZoom: 20 * 1000
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
            text: 'Valores',
            margin: 10
        }
    },
    series: [{
        name: 'Valor',
        data: (function() {
                // generate an array of random data
                var data = [];
                <?php
                    for($i = 0 ;$i<count($rawdata3);$i++){
                ?>
                data.push([<?php echo $timeArray3[$i];?>,<?php echo $valoresArray3[$i];?>]);
                <?php } ?>
                return data;
            })()
    }],
    credits: {
            enabled: false
    }
});

chartCPU2 = new Highcharts.StockChart({
    chart: {
        renderTo: 'contenedor4'
        //defaultSeriesType: 'spline'
        
    },
    rangeSelector : {
        enabled: false
    },
    title: {
        text: 'Gráfica de Temperatura del sensor 4'
    },
    xAxis: {
        type: 'datetime'
        //tickPixelInterval: 150,
        //maxZoom: 20 * 1000
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
            text: 'Valores',
            margin: 10
        }
    },
    series: [{
        name: 'Valor',
        data: (function() {
                // generate an array of random data
                var data = [];
                <?php
                    for($i = 0 ;$i<count($rawdata4);$i++){
                ?>
                data.push([<?php echo $timeArray4[$i];?>,<?php echo $valoresArray4[$i];?>]);
                <?php } ?>
                return data;
            })()
    }],
    credits: {
            enabled: false
    }
});



</script>   
</BODY>

</html>