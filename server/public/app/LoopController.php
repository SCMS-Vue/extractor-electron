<?php
namespace App;
use Laminas\Diactoros\Response\JsonResponse;
use Helpers\Help;
use Spatie\Async\Pool;


class LoopController {
    static $url;
    static $pages;
    static $companies = [];

    public static function handle($url) {
        self::$url = Help::decode($url);
        self::$pages = Help::getpages(self::$url);
        array_push(self::$companies, self::$pages);
        foreach(self::$pages as $page) {
            array_push(self::$companies, Help::getcompanies($page));
        }
        $response = Help::buildit(self::$companies);
        return new JsonResponse($response, 200);
        
    }
}