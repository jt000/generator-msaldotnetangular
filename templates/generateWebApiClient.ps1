param()

$ErrorActionPreference = "Stop"

$downloadSwaggerUri = "https://localhost:5001/swagger/v1/swagger.json";
$generateApiUri = "https://generator3.swagger.io/api/generate";
$outputFolder = "$PSScriptRoot\<%= webclientfoldername %>\src\webapiclient"

$webClient = New-Object  System.Net.WebClient;

try {
    Write-Host "Downloading OpenAPI spec...";
    $swaggerObj = $webClient.DownloadString($downloadSwaggerUri) | ConvertFrom-Json;
    if ([System.String]::IsNullOrEmpty($swaggerObj)) {
        throw New-Object System.Exception "No response returned from $downloadSwaggerUri";
    }
}
catch [System.Net.WebException] {
    Write-Host "Unable to download the swagger json. Make sure your WebAPI is running locally at https://localhost:5001";
    Write-Host $_;
    return;
}

$payload = @{
    lang = "typescript-angular"
    type = "CLIENT"
    spec = $swaggerObj
} | ConvertTo-Json -Depth 20 -Compress;

Write-Host "Generating Typescript client for $payload"

$headers = @{
    "Content-Type" = "application/json"
};

try {
    $fileName = [System.IO.Path]::ChangeExtension([System.IO.Path]::GetTempFileName(), "zip");
    Invoke-WebRequest -Uri $generateApiUri -Method POST -Body $payload -Headers $headers -OutFile $fileName
}
catch {
    Write-Host "Unable to download the client api ZIP";
    Write-Host $_;
    return;
}

if ([System.IO.Directory]::Exists($outputFolder)) {
    [System.IO.Directory]::Delete($outputFolder, 1);
}

Add-Type -AssemblyName System.IO.Compression.FileSystem;
[System.IO.Compression.ZipFile]::ExtractToDirectory($fileName, $outputFolder)