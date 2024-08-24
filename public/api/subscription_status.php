<?php
    include ("cors_bypass.php");
    include ("keys.php");

    if (!file_exists('/home/u321831237/domains/stanimeros.com/public_html/vendor/autoload.php')) {
        echo json_encode(['status' => 'failed', 'message' => 'Missing libraries']);
        exit;
    }

    require "/home/u321831237/domains/stanimeros.com/public_html/vendor/autoload.php";
    $stripePrivateKey = $keys['stripe_private_key']; //Private Key
    //$stripePrivateKey = $keys['test_stripe_private_key'];
    \Stripe\Stripe::setApiKey($stripePrivateKey);

    if (!isset($_GET["email"])) {
        echo json_encode(['status' => 'failed', 'message' => 'Email address is required']);
        http_response_code(400);
        exit;
    }

    try {
        $customer = \Stripe\Customer::all(['email' => $_GET["email"], 'limit' => 1])->data[0];
        //echo json_encode(['customerId' => $customer->id]);
    
        if ($customer){
            $activeSubscriptions = \Stripe\Subscription::all(['customer' => $customer->id]);
            //echo json_encode(['subscriptionId' => $activeSubscriptions->data[0]->id]);

            if (count($activeSubscriptions) > 0) {
                echo json_encode(['subscriptionStatus' => 'active']);
            } else {
                echo json_encode(['subscriptionStatus' => 'inactive']);
            }
        }else{
            echo json_encode(['subscriptionStatus' => 'inactive']);
        }
    } catch (\Stripe\Exception\ApiErrorException $e) {
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
        http_response_code(500);
        exit;
    }
?>