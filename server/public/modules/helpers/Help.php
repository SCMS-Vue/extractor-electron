<?php
namespace Helpers;
use PHPHtmlParser\Dom; 
use GuzzleHttp\Client;

class Help {
    static function dom($url) {
        $hostname = gethostname();
        if (strpos($hostname, 'hostx.ro') !== false) {
            $dom = new Dom;
            $dom->loadFromUrl($url);
        } else {
            $client = new Client(['verify' => false]);
            $dom = new Dom;
            $dom->loadFromUrl($url, null, $client);
        }
        return $dom;
    }
    static function buildit($array) {
        $pages = $array[0]; unset($array[0]);
        $newa = ['success' => true]; $p=1;
            foreach( $pages as $page ) {
                $newa['pages'][$p] = ['url' => $page, 'companies' => []]; $p++;
            }
            foreach($array as $page => $carray) {
                $closure = function ($arr) {
                    $newarr = []; $i=0;
                    foreach($arr as $company_name => $company_url) {
                        $newarr[$i]['name'] = strtoupper($company_name); $newarr[$i]['url'] = $company_url; $i++;
                    }
                    return $newarr;
                };
                $newa['pages'][$page]['companies'] = $closure($carray);
            }
        return $newa;
    }
    static function decode($str) {
        return strlen($str) ? base64_decode($str) : false;
    }
    static function extractEmail($url) {
        $dom = self::dom($url);
        $found = $dom->find('span.email');
        if(count($found)) {
            return $found[0]->innertext;
        } else {
            return false;
        }
    }
    static function getcompanies($url) {
        $companies = [];
        $dom = self::dom($url);
        foreach($dom->find('a[itemprop=url]') as $element) {
            $companies[$element->innertext] = $element->href;
        }
        return $companies;
    }
    static function getpages($url) {
        $pages = [
            $url
        ];
        $dom = self::dom($url);
        foreach($dom->find('li.mr4 a') as $element) {
            array_push($pages, $element->href);
        }
        return array_unique($pages);
    }

    static function getTest($url) {
        $arr = '';
        $dom = self::dom($url);
        $found = $dom->find('h2.title01.text-capitalize');
        if(count($found)) {
            return (int) filter_var($found[0]->innerHtml, FILTER_SANITIZE_NUMBER_INT);
            return $found[0]->innerHtml;
        } else {
            return 0;
        }
        
        
    }
    static function cors() {
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
            // you want to allow, and if so:
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }
        
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // may also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        
            exit(0);
        }
    }
}