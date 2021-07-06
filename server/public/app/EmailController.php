<?php
namespace App;
use Laminas\Diactoros\Response\JsonResponse;
use Helpers\Help;

class EmailController {
    public static function handle($url) {
        if(!$url) {
            return new JsonResponse(["status" => 204, "message" => "No Content", "data" => null], 204);
        } else {
            $url = Help::decode($url);
            $email = Help::extractEmail($url);
            if($email !== false) {
                return new JsonResponse(["status" => 200, "message" => "Success", "data" => $email], 200);
            } else {
                return new JsonResponse(["status" => 201, "message" => "Empty", "data" => null], 201);
            }
        }
        
    }
}