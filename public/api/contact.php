<?php
ini_set('display_errors', '0');

const STRATA_MAX_CV = 5242880;
const STRATA_RECIPIENTS = array('strataoack@gmail.com', 'eustaceocrentsil@gmail.com');

function strata_config()
{
    $config = array(
        'to' => STRATA_RECIPIENTS,
        'from_email' => '',
        'from_name' => 'STRATAOACK website',
        'transport' => 'mail',
        'smtp' => array(
            'host' => '',
            'port' => 587,
            'encryption' => 'tls',
            'username' => '',
            'password' => '',
            'allow_self_signed' => false,
        ),
        'rate_max' => 5,
        'rate_window' => 3600,
        'rate_dir' => '',
        'log_path' => '',
    );
    $path = __DIR__ . '/config.php';
    if (is_readable($path)) {
        $loaded = include $path;
        if (is_array($loaded)) {
            foreach ($loaded as $key => $value) {
                if ($key === 'smtp' && is_array($value)) {
                    $config['smtp'] = array_merge($config['smtp'], $value);
                } else {
                    $config[$key] = $value;
                }
            }
        }
    }
    return $config;
}

function strata_finish($code, $payload)
{
    if (!headers_sent()) {
        http_response_code($code);
        header('Content-Type: application/json; charset=UTF-8');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: no-store');
    }
    echo json_encode($payload);
    exit;
}

function strata_cors()
{
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if (preg_match('#^https?://(127\.0\.0\.1|localhost)(:\d+)?$#', $origin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Accept, Content-Type');
    }
}

function strata_len($value)
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }
    return strlen($value);
}

function strata_clean_line($value, $max)
{
    $value = trim(str_replace(array("\r", "\n", "\0"), ' ', (string) $value));
    if (strata_len($value) > $max) {
        $value = function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
    }
    return $value;
}

function strata_clean_text($value, $max)
{
    $value = str_replace(array("\r\n", "\r", "\0"), "\n", (string) $value);
    $value = trim($value);
    if (strata_len($value) > $max) {
        $value = function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
    }
    return $value;
}

function strata_email_ok($value)
{
    if (!is_string($value) || $value === '' || strlen($value) > 200) {
        return false;
    }
    if (preg_match('/[\r\n]/', $value)) {
        return false;
    }
    return preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $value) === 1;
}

function strata_client_ip()
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    $ip = preg_replace('/[^0-9a-fA-F:.]/', '', $ip);
    return $ip === '' ? 'unknown' : $ip;
}

function strata_rate_ok($config, $ip)
{
    $max = isset($config['rate_max']) ? (int) $config['rate_max'] : 5;
    $window = isset($config['rate_window']) ? (int) $config['rate_window'] : 3600;
    if ($max < 1 || $window < 1) {
        return true;
    }
    $dir = isset($config['rate_dir']) && $config['rate_dir'] !== ''
        ? $config['rate_dir']
        : sys_get_temp_dir() . '/strataoack-form-limit';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return true;
    }
    $file = $dir . '/' . hash('sha256', $ip) . '.json';
    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return true;
    }
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        return true;
    }
    $raw = stream_get_contents($fh);
    $decoded = json_decode($raw ? $raw : '[]', true);
    $hits = is_array($decoded) ? $decoded : array();
    $now = time();
    $fresh = array();
    foreach ($hits as $hit) {
        if (is_int($hit) && ($now - $hit) < $window) {
            $fresh[] = $hit;
        }
    }
    if (count($fresh) >= $max) {
        flock($fh, LOCK_UN);
        fclose($fh);
        return false;
    }
    $fresh[] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($fresh));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
    return true;
}

function strata_recipients($config)
{
    $list = isset($config['to']) && is_array($config['to']) ? $config['to'] : STRATA_RECIPIENTS;
    $clean = array();
    foreach ($list as $email) {
        if (strata_email_ok($email)) {
            $clean[] = $email;
        }
    }
    return count($clean) > 0 ? $clean : STRATA_RECIPIENTS;
}

function strata_from_email($config)
{
    if (isset($config['from_email']) && strata_email_ok($config['from_email'])) {
        return $config['from_email'];
    }
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
    $host = preg_replace('/:\d+$/', '', $host);
    $host = strtolower(preg_replace('/[^a-z0-9.-]/i', '', $host));
    if ($host === '' || strpos($host, '.') === false || filter_var($host, FILTER_VALIDATE_IP)) {
        return 'noreply@localhost';
    }
    return 'noreply@' . $host;
}

function strata_encode_header($value)
{
    if (preg_match('/[^\x20-\x7E]/', $value)) {
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }
    return $value;
}

function strata_format_address($name, $email)
{
    $name = strata_clean_line($name, 80);
    $name = str_replace(array('"', '<', '>'), '', $name);
    if ($name === '') {
        return $email;
    }
    return strata_encode_header($name) . ' <' . $email . '>';
}

function strata_filename($name)
{
    $base = basename(str_replace(array("\0", '\\'), '', (string) $name));
    $base = preg_replace('/[^A-Za-z0-9._-]/', '_', $base);
    $base = trim($base, '._');
    if ($base === '') {
        $base = 'cv';
    }
    if (strlen($base) > 80) {
        $base = substr($base, -80);
    }
    return $base;
}

function strata_extension($filename)
{
    $parts = explode('.', strtolower($filename));
    if (count($parts) < 2) {
        return '';
    }
    return $parts[count($parts) - 1];
}

function strata_magic_ok($ext, $bytes)
{
    if ($ext === 'pdf') {
        return strncmp($bytes, '%PDF', 4) === 0;
    }
    if ($ext === 'doc') {
        return strncmp($bytes, "\xD0\xCF\x11\xE0", 4) === 0;
    }
    if ($ext === 'docx') {
        return strncmp($bytes, "PK\x03\x04", 4) === 0;
    }
    return false;
}

function strata_mime_for($ext)
{
    if ($ext === 'pdf') {
        return 'application/pdf';
    }
    if ($ext === 'doc') {
        return 'application/msword';
    }
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}

function strata_resume($files)
{
    if (!isset($files['resume']) || !is_array($files['resume'])) {
        return array('ok' => true, 'file' => null);
    }
    $file = $files['resume'];
    $error = isset($file['error']) ? (int) $file['error'] : UPLOAD_ERR_NO_FILE;
    if ($error === UPLOAD_ERR_NO_FILE) {
        return array('ok' => true, 'file' => null);
    }
    if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
        return array('ok' => false, 'status' => 413, 'message' => 'The CV is larger than this server accepts. Keep it under 5 MB, or raise upload_max_filesize and post_max_size.');
    }
    if ($error !== UPLOAD_ERR_OK) {
        return array('ok' => false, 'status' => 400, 'message' => 'The CV could not be read. Try a PDF, DOC, or DOCX under 5 MB.');
    }
    $filename = strata_filename(isset($file['name']) ? $file['name'] : '');
    $ext = strata_extension($filename);
    if (!in_array($ext, array('pdf', 'doc', 'docx'), true)) {
        return array('ok' => false, 'status' => 400, 'fields' => array('resume' => 'Attach a PDF, DOC, or DOCX file'), 'message' => 'Attach a PDF, DOC, or DOCX file.');
    }
    $size = isset($file['size']) ? (int) $file['size'] : 0;
    if ($size <= 0 || $size > STRATA_MAX_CV) {
        return array('ok' => false, 'status' => 413, 'fields' => array('resume' => 'The CV must be 5 MB or smaller'), 'message' => 'The CV must be 5 MB or smaller.');
    }
    $tmp = isset($file['tmp_name']) ? $file['tmp_name'] : '';
    if ($tmp === '' || !is_uploaded_file($tmp)) {
        return array('ok' => false, 'status' => 400, 'message' => 'The CV could not be read.');
    }
    $bytes = file_get_contents($tmp);
    if ($bytes === false || strlen($bytes) > STRATA_MAX_CV || !strata_magic_ok($ext, $bytes)) {
        return array('ok' => false, 'status' => 400, 'fields' => array('resume' => 'That file does not look like a PDF, DOC, or DOCX'), 'message' => 'That file does not look like a PDF, DOC, or DOCX.');
    }
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detected = $finfo ? finfo_file($finfo, $tmp) : '';
        if ($finfo) {
            finfo_close($finfo);
        }
        $banned = array('text/html', 'application/javascript', 'application/x-httpd-php', 'application/x-php', 'text/x-php', 'image/png', 'image/jpeg', 'image/gif', 'image/webp');
        if (in_array($detected, $banned, true)) {
            return array('ok' => false, 'status' => 400, 'fields' => array('resume' => 'That file type is not accepted'), 'message' => 'That file type is not accepted.');
        }
    }
    return array(
        'ok' => true,
        'file' => array(
            'filename' => $filename,
            'mime' => strata_mime_for($ext),
            'bytes' => $bytes,
        ),
    );
}

function strata_fail_fields($fields, $message)
{
    strata_finish(400, array('ok' => false, 'message' => $message, 'fields' => $fields));
}

function strata_validate()
{
    $form = isset($_POST['form']) ? $_POST['form'] : '';
    if ($form !== 'contact' && $form !== 'careers') {
        strata_finish(400, array('ok' => false, 'message' => 'This form is not recognised.'));
    }
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = strata_clean_line(isset($_POST['subject']) ? $_POST['subject'] : '', 200);
    $message = strata_clean_text(isset($_POST['message']) ? $_POST['message'] : '', 5000);
    $fields = array();
    if (!strata_email_ok($email)) {
        $fields['email'] = $email === '' ? 'Email is required' : 'Enter a valid email';
    }
    if (strata_len($message) < 10) {
        $fields['message'] = 'Please provide more details (at least 10 characters)';
    }
    $value = array(
        'form' => $form,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
    );
    if ($form === 'contact') {
        $name = strata_clean_line(isset($_POST['name']) ? $_POST['name'] : '', 120);
        if ($name === '') {
            $fields['name'] = 'Your name is required';
        }
        $value['name'] = $name;
        $value['company'] = strata_clean_line(isset($_POST['company']) ? $_POST['company'] : '', 200);
        if ($subject === '') {
            $value['subject'] = 'Project inquiry from STRATAOACK website';
        }
    } else {
        $first = strata_clean_line(isset($_POST['first_name']) ? $_POST['first_name'] : '', 120);
        $last = strata_clean_line(isset($_POST['last_name']) ? $_POST['last_name'] : '', 120);
        $authorized = isset($_POST['work_authorized']) ? $_POST['work_authorized'] : '';
        if ($first === '') {
            $fields['first_name'] = 'First name is required';
        }
        if ($last === '') {
            $fields['last_name'] = 'Last name is required';
        }
        if ($subject === '') {
            $fields['subject'] = 'Subject is required';
        }
        if ($authorized !== 'Yes' && $authorized !== 'No') {
            $fields['work_authorized'] = 'Select yes or no';
        }
        $value['first_name'] = $first;
        $value['last_name'] = $last;
        $value['work_authorized'] = $authorized;
        $resume = strata_resume(isset($_FILES) ? $_FILES : array());
        if (!$resume['ok']) {
            $payload = array('ok' => false, 'message' => $resume['message']);
            if (isset($resume['fields'])) {
                $payload['fields'] = $resume['fields'];
            }
            strata_finish($resume['status'], $payload);
        }
        $value['file'] = $resume['file'];
    }
    if (count($fields) > 0) {
        strata_fail_fields($fields, 'Check the highlighted fields and try again.');
    }
    return $value;
}

function strata_plain_text($value)
{
    $lines = array('A message was sent from the STRATAOACK website.', '');
    if ($value['form'] === 'contact') {
        $lines[] = 'Form: Project inquiry';
        $lines[] = 'Name: ' . $value['name'];
        $lines[] = 'Email: ' . $value['email'];
        $lines[] = 'Company: ' . ($value['company'] !== '' ? $value['company'] : '(not given)');
    } else {
        $lines[] = 'Form: Speculative CV';
        $lines[] = 'Name: ' . $value['first_name'] . ' ' . $value['last_name'];
        $lines[] = 'Email: ' . $value['email'];
        $lines[] = 'Work authorized in Ghana/West Africa: ' . $value['work_authorized'];
        $lines[] = 'CV: ' . ($value['file'] ? $value['file']['filename'] : 'not attached');
    }
    $lines[] = 'Subject: ' . $value['subject'];
    $lines[] = '';
    $lines[] = $value['message'];
    return implode("\n", $lines);
}

function strata_compose($text, $attachment)
{
    if ($attachment === null) {
        return array($text, 'Content-Type: text/plain; charset=UTF-8');
    }
    $boundary = 'strata_' . bin2hex(random_bytes(8));
    $body = '--' . $boundary . "\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $body .= $text . "\r\n";
    $body .= '--' . $boundary . "\r\n";
    $body .= 'Content-Type: ' . $attachment['mime'] . '; name="' . $attachment['filename'] . "\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= 'Content-Disposition: attachment; filename="' . $attachment['filename'] . "\"\r\n\r\n";
    $body .= chunk_split(base64_encode($attachment['bytes']));
    $body .= '--' . $boundary . "--";
    return array($body, 'Content-Type: multipart/mixed; boundary="' . $boundary . '"');
}

function strata_smtp_read($fp)
{
    $data = '';
    while (!feof($fp)) {
        $line = fgets($fp, 515);
        if ($line === false) {
            break;
        }
        $data .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function strata_smtp_expect($fp, $codes)
{
    $data = strata_smtp_read($fp);
    $code = (int) substr($data, 0, 3);
    if (!in_array($code, $codes, true)) {
        throw new RuntimeException('SMTP rejected the message (' . $code . ')');
    }
    return $data;
}

function strata_smtp_cmd($fp, $command, $codes)
{
    fwrite($fp, $command . "\r\n");
    return strata_smtp_expect($fp, $codes);
}

function strata_smtp_send($config, $toList, $replyTo, $subject, $body, $contentType, $fromEmail, $fromName)
{
    $smtp = isset($config['smtp']) && is_array($config['smtp']) ? $config['smtp'] : array();
    $host = isset($smtp['host']) ? trim($smtp['host']) : '';
    $port = isset($smtp['port']) ? (int) $smtp['port'] : 587;
    $encryption = isset($smtp['encryption']) ? strtolower($smtp['encryption']) : 'tls';
    $username = isset($smtp['username']) ? $smtp['username'] : '';
    $password = isset($smtp['password']) ? $smtp['password'] : '';
    $allowSelf = !empty($smtp['allow_self_signed']);
    if ($host === '' || $username === '' || $password === '') {
        throw new RuntimeException('SMTP is not configured');
    }
    if (!in_array($encryption, array('tls', 'ssl', 'none'), true)) {
        throw new RuntimeException('SMTP encryption must be tls, ssl, or none');
    }
    $remote = ($encryption === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
    $context = stream_context_create(array(
        'ssl' => array(
            'verify_peer' => !$allowSelf,
            'verify_peer_name' => !$allowSelf,
            'allow_self_signed' => $allowSelf,
        ),
    ));
    $errno = 0;
    $errstr = '';
    $fp = stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $context);
    if (!$fp) {
        throw new RuntimeException('SMTP connection failed');
    }
    stream_set_timeout($fp, 20);
    try {
        strata_smtp_expect($fp, array(220));
        strata_smtp_cmd($fp, 'EHLO strataoack.local', array(250));
        if ($encryption === 'tls') {
            strata_smtp_cmd($fp, 'STARTTLS', array(220));
            $crypto = stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if ($crypto !== true) {
                throw new RuntimeException('STARTTLS failed');
            }
            strata_smtp_cmd($fp, 'EHLO strataoack.local', array(250));
        }
        strata_smtp_cmd($fp, 'AUTH LOGIN', array(334));
        strata_smtp_cmd($fp, base64_encode($username), array(334));
        strata_smtp_cmd($fp, base64_encode($password), array(235));
        strata_smtp_cmd($fp, 'MAIL FROM:<' . $fromEmail . '>', array(250));
        foreach ($toList as $rcpt) {
            strata_smtp_cmd($fp, 'RCPT TO:<' . $rcpt . '>', array(250, 251));
        }
        strata_smtp_cmd($fp, 'DATA', array(354));
        $headers = array(
            'From: ' . strata_format_address($fromName, $fromEmail),
            'To: ' . implode(', ', $toList),
            'Reply-To: ' . $replyTo,
            'Subject: ' . strata_encode_header($subject),
            'MIME-Version: 1.0',
            $contentType,
        );
        $raw = implode("\r\n", $headers) . "\r\n\r\n" . $body;
        $normalized = str_replace(array("\r\n", "\r"), "\n", $raw);
        $lines = explode("\n", $normalized);
        foreach ($lines as $index => $line) {
            if (isset($line[0]) && $line[0] === '.') {
                $lines[$index] = '.' . $line;
            }
        }
        fwrite($fp, implode("\r\n", $lines) . "\r\n.\r\n");
        strata_smtp_expect($fp, array(250));
        strata_smtp_cmd($fp, 'QUIT', array(221));
    } finally {
        fclose($fp);
    }
}

function strata_php_mail($toList, $replyTo, $subject, $body, $contentType, $fromEmail, $fromName)
{
    $headers = array(
        'From: ' . strata_format_address($fromName, $fromEmail),
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        $contentType,
    );
    $params = '';
    if (strata_email_ok($fromEmail)) {
        $params = '-f' . $fromEmail;
    }
    $ok = $params === ''
        ? mail(implode(', ', $toList), strata_encode_header($subject), $body, implode("\r\n", $headers))
        : mail(implode(', ', $toList), strata_encode_header($subject), $body, implode("\r\n", $headers), $params);
    if (!$ok) {
        throw new RuntimeException('mail() returned false');
    }
}

function strata_deliver($config, $value)
{
    $to = strata_recipients($config);
    $fromEmail = strata_from_email($config);
    $fromName = isset($config['from_name']) ? $config['from_name'] : 'STRATAOACK website';
    $text = strata_plain_text($value);
    $attachment = ($value['form'] === 'careers') ? $value['file'] : null;
    list($body, $contentType) = strata_compose($text, $attachment);
    $subject = '[STRATAOACK] ' . $value['subject'];
    $transport = isset($config['transport']) ? $config['transport'] : 'mail';
    if ($transport === 'log') {
        $path = isset($config['log_path']) && $config['log_path'] !== '' ? $config['log_path'] : sys_get_temp_dir() . '/strataoack-form.log';
        $record = "TO: " . implode(', ', $to) . "\nREPLY: " . $value['email'] . "\nSUBJECT: " . $subject . "\n" . $text . "\n----\n";
        if (file_put_contents($path, $record, FILE_APPEND | LOCK_EX) === false) {
            throw new RuntimeException('log transport could not write');
        }
        return;
    }
    if ($transport === 'smtp') {
        strata_smtp_send($config, $to, $value['email'], $subject, $body, $contentType, $fromEmail, $fromName);
        return;
    }
    strata_php_mail($to, $value['email'], $subject, $body, $contentType, $fromEmail, $fromName);
}

function strata_handle_request()
{
    strata_cors();
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        strata_finish(405, array('ok' => false, 'message' => 'Send the form with POST.'));
    }
    $length = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
    if ($length > 0 && empty($_POST) && empty($_FILES)) {
        strata_finish(413, array('ok' => false, 'message' => 'The upload is larger than this server allows. Ask the host to raise post_max_size above 8M.'));
    }
    $value = strata_validate();
    $config = strata_config();
    if (!strata_rate_ok($config, strata_client_ip())) {
        strata_finish(429, array('ok' => false, 'message' => 'Too many messages from this network. Please wait an hour, or email this message instead.'));
    }
    $honeypot = isset($_POST['bot_field']) ? trim($_POST['bot_field']) : '';
    if ($honeypot !== '') {
        strata_finish(200, array('ok' => true));
    }
    try {
        strata_deliver($config, $value);
    } catch (Throwable $error) {
        error_log('STRATAOACK form: ' . $error->getMessage());
        strata_finish(500, array('ok' => false, 'message' => 'The message could not be emailed. Email this message instead.'));
    }
    strata_finish(200, array('ok' => true));
}

if (PHP_SAPI !== 'cli') {
    try {
        strata_handle_request();
    } catch (Throwable $error) {
        error_log('STRATAOACK form: ' . $error->getMessage());
        strata_finish(500, array('ok' => false, 'message' => 'The message could not be emailed. Email this message instead.'));
    }
}
