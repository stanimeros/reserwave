<?php
    include ("cors_bypass.php");
    include ("keys.php");

    if (!file_exists('/home/re552547/libs/vendor/autoload.php')) {
        echo json_encode(['status' => 'failed', 'message' => 'Missing libraries']);
        exit;
    }

    require "/home/re552547/libs/vendor/autoload.php";

    $stripePrivateKey = $keys['stripe_private_key']; //Private Key
    //$stripePrivateKey = $keys['test_stripe_private_key'];

    $stripePriceID = 'price_1Ocu0cHyq1kKZGtFEA6lmpHk'; //Price ID
    //$stripePriceID = 'price_1ObqxyHyq1kKZGtFVgikr5mw';

    $stripeTaxID = 'txcd_10000000';

    $successURL = 'https://reserwave.com';
    $cancelURL = 'https://reserwave.com/become-a-partner';

    \Stripe\Stripe::setApiKey($stripePrivateKey);

    $checkout_session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price' => $stripePriceID,
            'quantity' => 1,
        ]],
        'mode' => 'subscription',
        'locale' => 'auto',
        'success_url' => $successURL,
        'cancel_url' => $cancelURL,
    ]);

    // http_response_code(303);
    // header("Location: " . $checkout_session->url);

    $redirect_url = $checkout_session->url;
    print json_encode(['redirect_url' => $redirect_url]);
    exit();
?>