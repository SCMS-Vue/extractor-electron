<?php
namespace App;
use Laminas\Diactoros\Response\JsonResponse;
use Helpers\Help;
use PHPHtmlParser\Dom;


class TestController {
    public static function handle($url) {
        if(!$url) {
            return new JsonResponse(["status" => 204, "message" => "No Content", "data" => null], 204);
        } else {
            $url = Help::decode($url);
            $test = Help::getTest($url);
            if($test > 0) {
                return new JsonResponse(["status" => 200, "message" => "Hemos Encontrado $test Resultados", "data" => $test], 200);
            } else {
                return new JsonResponse(["status" => 201, "message" => "Failed test", "data" => null], 201);
            }
            
        }
        
    }
}