<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/estilos.css" type="text/css">
    <title>CALENDARIO</title>
  </head>
    <body>
    <div class="container">
            <div class="row"><!--aqui va la tabla calendario--> 
            <?php
              function generar_calendario($month,$year,$holidays = null)
              {
                  $calendar = '<table cellpadding="20" cellspacing="20" class="calendar">';
                  $headings = array('L','M','M','J','V','S','D');
                  $meses = array('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre');
                  $calendar.= '<tr class="calendar-row"><td class="calendar-day-head">'.implode('</td><td class="calendar-day-head">',$headings).'</td></tr>';
                  $running_day = date('w',mktime(0,0,0,$month,1,$year));
                  $running_day = ($running_day > 0) ? $running_day-1 : $running_day;
                  $days_in_month = date('t',mktime(0,0,0,$month,1,$year));
                  $days_in_this_week = 1;
                  $day_counter = 0;
                  $dates_array = array();
              
                  $calendar.= '<tr class="calendar-row">';
              
                  for($x = 0; $x < $running_day; $x++):
                      $calendar.= '<td class="calendar-day-np"> </td>';
                      $days_in_this_week++;
                  endfor;
              
                  for($list_day = 1; $list_day <= $days_in_month; $list_day++):
                      $calendar.= '<td class="calendar-day">';
                      
                      $class="day-number ";
                      if($running_day == 0 || $running_day == 6 ){
                          $class.=" not-work ";
                      }
                      
                      $key_month_day = "month_{$month}_day_{$list_day}";
              
                      if($holidays != null && is_array($holidays)){
                          $month_key = array_search($key_month_day, $holidays);
                          
                          if(is_numeric($month_key)){
                              $class.=" not-work-holiday ";
                          }
                      }
                          $calendar.= "<div class='{$class}'>".$list_day."</div>";
                      $calendar.= '</td>';
                      if($running_day == 6):
                          $calendar.= '</tr>';
                          if(($day_counter+1) != $days_in_month):
                              $calendar.= '<tr class="calendar-row">';
                          endif;
                          $running_day = -1;
                          $days_in_this_week = 0;
                      endif;
                      $days_in_this_week++; $running_day++; $day_counter++;
                  endfor;
              
                  if($days_in_this_week < 8):
                      for($x = 1; $x <= (8 - $days_in_this_week); $x++):
                          $calendar.= '<td class="calendar-day-np"> </td>';
                      endfor;
                  endif; 
                  $calendar.= '</tr>';
                  $calendar.= '</table>'; 
                  return $calendar;
              }
              // Le pasamos el mes menos uno (por el arreglo), el año actual
 
              echo generar_calendario(10,2024);
              ?>
            </div>
          </div> <!--Cierra contenedor-->   
  </body>
</html>