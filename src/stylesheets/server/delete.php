<?php
    $id=$_POST['trans_data'];
    $text = file_get_contents("../../resource/bookmarks.json");
    $data = json_decode($text);
    $unset_queue = array();
    foreach ( $data as $i => $item )
    {
        if ("li".$item->id == $id)
        {
            $unset_queue[] = $i;
        }
    }

    foreach ( $unset_queue as $index )
    {
        unset($data[$index]);
    }

    $data = array_values($data);

    $new_json_string = json_encode($data);

    file_put_contents("../../resource/bookmarks.json",$new_json_string);
?>