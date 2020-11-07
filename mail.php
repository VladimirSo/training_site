<?php
if ($_POST) { // если передан массив POST
     // пишем данные в переменные и экранируем спецсимволы
    $name = htmlspecialchars($_POST["callbackName"]);
    $phone = htmlspecialchars($_POST["callbackPhone"]);
    $message = htmlspecialchars($_POST["callbackName"].': :'.$_POST["callbackPhone"].': :'.$_POST["callbackMessage"]);
	
//    $adminEmail = htmlspecialchars($_POST["adminEmail"]);
    $adminEmail = "to-rin@yandex.ru";
    $project = htmlspecialchars($_POST["callbackProject"]);
    $subject = htmlspecialchars($_POST["callbackSubj"]);
    
    $json = array(); // подготовим массив ответа
    
    if (!$name or !$phone) { // если одно из данных полей оказалось пустым        
        $json['error'] = 'Заполнены не все обязательные поля!'; // пишем ошибку в массив
		echo json_encode($json); // выводим массив ответа 
		die(); // умираем
	}

	function mime_header_encode($str, $data_charset, $send_charset) { // функция преобразования заголовков в верную кодировку 
		if($data_charset != $send_charset)
		$str=iconv($data_charset,$send_charset.'//IGNORE',$str);
		return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
	}
	/* супер класс для отправки письма в нужной кодировке */
	class TEmail {
	public $from_email;
	public $from_name;
	public $to_email;
	public $to_name;
	public $subject;
	public $data_charset='UTF-8';
	public $send_charset='windows-1251';
	public $body='';
	public $type='text/plain';

	function send(){
		$dc=$this->data_charset;
		$sc=$this->send_charset;
		$enc_to=mime_header_encode($this->to_name,$dc,$sc).' <'.$this->to_email.'>';
		$enc_subject=mime_header_encode($this->subject,$dc,$sc);
		$enc_from=mime_header_encode($this->from_name,$dc,$sc).' <'.$this->from_email.'>';
		$enc_body=$dc==$sc?$this->body:iconv($dc,$sc.'//IGNORE',$this->body);
		$headers='';
		$headers.="Mime-Version: 1.0\r\n";
		$headers.="Content-type: ".$this->type."; charset=".$sc."\r\n";
		$headers.="From: ".$enc_from."\r\n";
		return mail($enc_to,$enc_subject,$enc_body,$headers);
	}

	}

	$emailgo= new TEmail; // инициализируем супер класс отправки
    // от кого:
	$emailgo->from_email= 'sova-disigner.ru'; 
    $emailgo->from_name= $project;
    // кому:
    $emailgo->to_email= $adminEmail;
    $emailgo->to_name= $adminEmail;
	$emailgo->subject= $subject; // тема
	$emailgo->body= $message; // сообщение
	$emailgo->send(); // отправляем

	$json['error'] = 0; // ошибок не было

	echo json_encode($json); // выводим массив ответа
} else { // если массив POST не был передан
	echo 'GET LOST!'; // высылаем
}
?>
