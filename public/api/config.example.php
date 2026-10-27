<?php
return array(
    'to' => array(
        'strataoack@gmail.com',
        'eustaceocrentsil@gmail.com',
    ),
    'from_email' => 'noreply@your-domain.com',
    'from_name' => 'STRATAOACK website',
    'transport' => 'mail',
    'smtp' => array(
        'host' => 'mail.your-domain.com',
        'port' => 587,
        'encryption' => 'tls',
        'username' => 'noreply@your-domain.com',
        'password' => '',
    ),
    'rate_max' => 5,
    'rate_window' => 3600,
);
