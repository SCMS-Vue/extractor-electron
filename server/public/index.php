<?php
require __DIR__ . '/vendor/autoload.php';
use MiladRahimi\PhpRouter\Router;
use Laminas\Diactoros\Response\JsonResponse;
use MiladRahimi\PhpRouter\Exceptions\RouteNotFoundException;

use App\TestController;
use App\LoopController;
use App\EmailController;

use Helpers\Help;



Help::cors();
$router = Router::create();

$router->get('/', function() use ($router) {
    $router->getPublisher()->publish(new JsonResponse(["status" => 200, "message" => "Server is up."], 200));
});

$router->get('/test/{url}', TestController::class);
$router->get('/loop/{url}', LoopController::class);
$router->get('/email/{url}', EmailController::class);

try {
    $router->dispatch();
} catch (RouteNotFoundException $e) {
    $router->getPublisher()->publish(new JsonResponse(["status" => 404, "message" => "Not found.", "error" => "" . $e], 404));
} catch (Throwable $e) {
    $router->getPublisher()->publish(new JsonResponse(["status" => 500, "message" => "Internal error.", "error" => "" . $e], 500));
}