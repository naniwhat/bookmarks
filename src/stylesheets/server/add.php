<?php
    $name=$_POST['name'];
    $addr = $_POST['addr'];
    $id = round(microtime(true) * 1000);;

    $text = file_get_contents("../../resource/bookmarks.json");
    $data = json_decode($text,true);

    $new_one=array("title"=>$name,"address"=>$addr,"id"=>$id);
    array_push($data,$new_one);

    $new_json_string = json_encode($data);

    file_put_contents("../../resource/bookmarks.json",$new_json_string);
    echo $id;
?>